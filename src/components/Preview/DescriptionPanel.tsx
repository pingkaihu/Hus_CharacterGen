import React, { useState } from "react";
import type { Character } from "../../types/character";
import { generateCharacterDescription as generateRuleDescription } from "../../rules/description";
import { generateCharacterDescription as generateAIDescription, getApiKey, setApiKey } from "../../services/gemini";

interface DescriptionPanelProps {
  character: Partial<Character>;
}

export function DescriptionPanel({ character }: DescriptionPanelProps) {
  const [aiDescription, setAiDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getApiKey() || "");

  if (!character.name && !character.class) {
    return null;
  }

  const ruleDescription = generateRuleDescription(character as Character);

  const handleGenerateAI = async () => {
    const currentApiKey = getApiKey();
    if (!currentApiKey) {
      setShowApiKeyInput(true);
      setError("請先設定 Gemini API Key");
      return;
    }

    setIsLoading(true);
    setError(null);
    setRetryMessage(null);

    try {
      const result = await generateAIDescription(character, (msg) => {
        setRetryMessage(msg);
      });
      setAiDescription(result);
      setRetryMessage(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失敗，請稍後再試");
    } finally {
      setIsLoading(false);
      setRetryMessage(null);
    }
  };

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
      setShowApiKeyInput(false);
      setError(null);
    }
  };

  return (
    <div className="border border-black p-6 bg-white/40 shadow-inner space-y-4">
      <div className="flex items-center justify-between border-b border-black/10 pb-2">
        <h3 className="dnd-label !text-left !mb-0">
          角色描述 <span className="text-gray-500 font-normal">Character Description</span>
        </h3>
        <button
          onClick={handleGenerateAI}
          disabled={isLoading}
          className="text-xs bg-red-800 hover:bg-red-900 text-white px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⟳</span>
              {retryMessage || "生成中..."}
            </>
          ) : (
            <>
              ✨ AI 生成描述
            </>
          )}
        </button>
      </div>

      {/* API Key 輸入區 */}
      {showApiKeyInput && (
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded space-y-2">
          <label className="text-xs font-bold block">
            Gemini API Key
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-2 font-normal"
            >
              取得免費 Key →
            </a>
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
            />
            <button
              onClick={handleSaveApiKey}
              className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded"
            >
              儲存
            </button>
          </div>
        </div>
      )}

      {/* 錯誤訊息 */}
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">
          ⚠️ {error}
        </div>
      )}

      {/* AI 生成的描述 */}
      {aiDescription && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-600">🎭</span>
            <span className="text-xs font-bold text-amber-800 uppercase">地下城主評語</span>
          </div>
          <p className="font-serif leading-relaxed text-gray-800 whitespace-pre-wrap">
            {aiDescription}
          </p>
        </div>
      )}

      {/* 規則生成的基本描述 */}
      <div>
        <div className="text-xs text-gray-500 mb-1">基本描述</div>
        <p className="font-serif leading-relaxed italic text-gray-700 whitespace-pre-wrap">
          {ruleDescription}
        </p>
      </div>

      {/* API Key 設定按鈕 */}
      {!showApiKeyInput && (
        <button
          onClick={() => setShowApiKeyInput(true)}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          ⚙️ 設定 API Key
        </button>
      )}
    </div>
  );
}
