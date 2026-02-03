// 自動生成人物介紹

import type { Character } from "../types/character";
import { calculateAbilityModifiers } from "./calculations";

/**
 * 根據角色資訊生成人物介紹
 */
export function generateCharacterDescription(character: Character): string {
  const parts: string[] = [];

  // 基本資訊
  const name = character.name || "無名角色";
  const race = character.race || "未知種族";
  const charClass = character.class || "未知職業";
  const level = character.level || 1;

  parts.push(`${name} 是一位 ${level} 級的 ${race} ${charClass}。`);

  // 根據能力值判斷角色特質
  const modifiers = calculateAbilityModifiers(character.abilityScores);
  const abilities = [
    { name: "力量", value: character.abilityScores.str, mod: modifiers.str },
    { name: "敏捷", value: character.abilityScores.dex, mod: modifiers.dex },
    { name: "體質", value: character.abilityScores.con, mod: modifiers.con },
    { name: "智力", value: character.abilityScores.int, mod: modifiers.int },
    { name: "感知", value: character.abilityScores.wis, mod: modifiers.wis },
    { name: "魅力", value: character.abilityScores.cha, mod: modifiers.cha },
  ];

  // 找出最高的兩個能力
  const sortedAbilities = [...abilities].sort((a, b) => b.value - a.value);
  const topTwo = sortedAbilities.slice(0, 2);

  if (topTwo.length >= 2) {
    const [first, second] = topTwo;
    parts.push(
      `${name} 在 ${first.name}（${first.value}）和 ${second.name}（${second.value}）方面表現突出，`
    );

    // 根據職業和能力組合描述戰鬥風格
    if (charClass === "Fighter" || charClass === "Barbarian") {
      parts.push("是一位勇猛的近戰戰士。");
    } else if (charClass === "Wizard" || charClass === "Sorcerer") {
      parts.push("擅長運用強大的法術力量。");
    } else if (charClass === "Rogue") {
      parts.push("精通潛行與暗殺技巧。");
    } else if (charClass === "Cleric" || charClass === "Paladin") {
      parts.push("擁有神聖的力量與堅定的信仰。");
    } else if (charClass === "Ranger") {
      parts.push("是荒野中的優秀獵手與追蹤者。");
    } else if (charClass === "Bard") {
      parts.push("以音樂與話語施展魔法，鼓舞同伴。");
    } else {
      parts.push("是一位經驗豐富的冒險者。");
    }
  }

  // 根據能力修正值描述個性
  if (modifiers.cha >= 3) {
    parts.push(`${name} 擁有非凡的魅力，能夠輕易說服他人。`);
  } else if (modifiers.int >= 3) {
    parts.push(`${name} 智慧過人，善於分析與解決問題。`);
  } else if (modifiers.wis >= 3) {
    parts.push(`${name} 擁有敏銳的直覺與洞察力。`);
  }

  // 加入背景故事摘要
  if (character.backgroundStory && character.backgroundStory.trim().length > 0) {
    const storyPreview = character.backgroundStory
      .trim()
      .substring(0, 100)
      .replace(/\n/g, " ");
    if (storyPreview.length < character.backgroundStory.length) {
      parts.push(`背景：${storyPreview}...`);
    } else {
      parts.push(`背景：${storyPreview}`);
    }
  }

  return parts.join(" ");
}
