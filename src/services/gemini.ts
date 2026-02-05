import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Part } from "@google/generative-ai";
import type { Character } from "../types/character";

// 從 localStorage 取得 API Key
export function getApiKey(): string | null {
    return localStorage.getItem("gemini_api_key");
}

export function setApiKey(key: string): void {
    localStorage.setItem("gemini_api_key", key);
}

// 將圖片 URL 轉換為 Base64
async function imageUrlToBase64(imageUrl: string): Promise<string> {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            // 移除 data:image/xxx;base64, 前綴
            resolve(base64.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

// 建立角色描述的 Prompt
function buildPrompt(character: Partial<Character>): string {
    const scores = character.abilityScores;
    const mods = character.abilityModifiers;

    const formatStat = (name: string, score?: number, mod?: number) => {
        if (score === undefined) return `${name}: --`;
        const modStr = mod !== undefined ? (mod >= 0 ? `+${mod}` : `${mod}`) : "";
        return `${name}: ${score} (${modStr})`;
    };

    return `你是一位經驗豐富的地下城主 (Dungeon Master)，擅長用史詩般的語言描述角色。

請根據以下 D&D 5e 角色資料，撰寫一段 150-200 字的角色介紹。

**請分析並描述：**
1. 根據能力值分析角色的強項與弱點
2. 推測這個角色可能的戰鬥風格與冒險策略
3. 若有提供圖片，請描述圖中人物的外觀特徵

**角色資料：**
- 姓名：${character.name || "未命名冒險者"}
- 種族：${character.race || "未知"}
- 職業：${character.class || "未知"} Lv.${character.level || 1}
- 陣營：${character.alignment || "未定"}

**能力值：**
- ${formatStat("力量 (STR)", scores?.str, mods?.str)}
- ${formatStat("敏捷 (DEX)", scores?.dex, mods?.dex)}
- ${formatStat("體質 (CON)", scores?.con, mods?.con)}
- ${formatStat("智力 (INT)", scores?.int, mods?.int)}
- ${formatStat("感知 (WIS)", scores?.wis, mods?.wis)}
- ${formatStat("魅力 (CHA)", scores?.cha, mods?.cha)}

**戰鬥數值：**
- 護甲等級 (AC): ${character.armorClass || 10}
- 生命值 (HP): ${character.maxHP || 0}
- 速度: ${character.speed || 30}ft

${character.backgroundStory ? `**背景故事：**\n${character.backgroundStory}` : ""}

請用中文撰寫，語氣要像一個正在開場的地下城主，充滿戲劇性與沉浸感。`;
}

// 可用的模型列表（按優先順序）
const MODELS = [
    "gemini-2.0-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-8b",
    "gemini-pro",
];

// 延遲函式
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 生成角色描述
export async function generateCharacterDescription(
    character: Partial<Character>,
    onRetry?: (message: string) => void
): Promise<string> {
    const apiKey = getApiKey();
    if (!apiKey) {
        throw new Error("請先設定 Gemini API Key");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const prompt = buildPrompt(character);
    const parts: Part[] = [{ text: prompt }];

    // 若有圖片，加入多模態輸入
    if (character.imageUrl) {
        try {
            const base64Image = await imageUrlToBase64(character.imageUrl);
            parts.push({
                inlineData: {
                    mimeType: "image/jpeg",
                    data: base64Image,
                },
            });
        } catch (error) {
            console.warn("無法處理圖片，將僅使用文字生成", error);
        }
    }

    // 嘗試不同模型
    for (const modelName of MODELS) {
        try {
            const model = genAI.getGenerativeModel({
                model: modelName,
                safetySettings: [
                    {
                        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                    },
                ],
            });

            const result = await model.generateContent(parts);
            const response = await result.response;
            return response.text();

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);

            // 429 配額錯誤 - 嘗試等待後重試
            if (errorMessage.includes("429")) {
                const retryMatch = errorMessage.match(/retry in (\d+)/i);
                const retrySeconds = retryMatch ? parseInt(retryMatch[1]) : 30;

                // 如果是最後一個模型，等待後重試一次
                if (modelName === MODELS[MODELS.length - 1]) {
                    onRetry?.(`配額限制中，等待 ${retrySeconds} 秒後重試...`);
                    await delay(retrySeconds * 1000 + 1000);

                    try {
                        const model = genAI.getGenerativeModel({ model: modelName });
                        const result = await model.generateContent(parts);
                        return result.response.text();
                    } catch {
                        throw new Error(`API 配額已用完，請稍後再試或更換 API Key。\n\n💡 提示：免費版每分鐘限 15 次請求，每日限 200 次。`);
                    }
                }

                // 嘗試下一個模型
                onRetry?.(`模型 ${modelName} 配額已滿，嘗試其他模型...`);
                continue;
            }

            // 404 模型不存在 - 嘗試下一個
            if (errorMessage.includes("404") || errorMessage.includes("not found")) {
                continue;
            }

            // 其他錯誤
            throw new Error(`生成失敗：${errorMessage}`);
        }
    }

    throw new Error("所有模型都無法使用，請檢查 API Key 或稍後再試");
}
