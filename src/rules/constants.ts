// D&D 5e 規則常數

import type { CharacterClass, SkillName, AbilityName } from "../types/character";

// 熟練加值表：等級 -> 熟練加值
export const PROFICIENCY_BONUS_BY_LEVEL: Record<number, number> = {
  1: 2,
  2: 2,
  3: 2,
  4: 2,
  5: 3,
  6: 3,
  7: 3,
  8: 3,
  9: 4,
  10: 4,
  11: 4,
  12: 4,
  13: 5,
  14: 5,
  15: 5,
  16: 5,
  17: 6,
  18: 6,
  19: 6,
  20: 6,
};

// 各職業的生命骰（Hit Dice）
export const HIT_DICE_BY_CLASS: Record<CharacterClass, number> = {
  Fighter: 10,
  Wizard: 6,
  Rogue: 8,
  Cleric: 8,
  Ranger: 10,
  Paladin: 10,
  Barbarian: 12,
  Bard: 8,
  Sorcerer: 6,
  Warlock: 8,
  Monk: 8,
  Druid: 8,
};

// 各職業的豁免熟練（Saving Throw Proficiencies）
export const SAVING_THROW_PROFICIENCIES: Record<
  CharacterClass,
  [AbilityName, AbilityName]
> = {
  Fighter: ["str", "con"],
  Wizard: ["int", "wis"],
  Rogue: ["dex", "int"],
  Cleric: ["wis", "cha"],
  Ranger: ["str", "dex"],
  Paladin: ["wis", "cha"],
  Barbarian: ["str", "con"],
  Bard: ["dex", "cha"],
  Sorcerer: ["con", "cha"],
  Warlock: ["wis", "cha"],
  Monk: ["str", "dex"],
  Druid: ["int", "wis"],
};

// 技能與對應的能力值
export const SKILL_ABILITY_MAP: Record<SkillName, AbilityName> = {
  Acrobatics: "dex",
  "Animal Handling": "wis",
  Arcana: "int",
  Athletics: "str",
  Deception: "cha",
  History: "int",
  Insight: "wis",
  Intimidation: "cha",
  Investigation: "int",
  Medicine: "wis",
  Nature: "int",
  Perception: "wis",
  Performance: "cha",
  Persuasion: "cha",
  Religion: "int",
  "Sleight of Hand": "dex",
  Stealth: "dex",
  Survival: "wis",
};

// 各職業的技能熟練選項（玩家可從中選擇 2-4 個）
export const CLASS_SKILL_OPTIONS: Record<CharacterClass, SkillName[]> = {
  Fighter: [
    "Acrobatics",
    "Animal Handling",
    "Athletics",
    "History",
    "Insight",
    "Intimidation",
    "Perception",
    "Survival",
  ],
  Wizard: [
    "Arcana",
    "History",
    "Insight",
    "Investigation",
    "Medicine",
    "Religion",
  ],
  Rogue: [
    "Acrobatics",
    "Athletics",
    "Deception",
    "Insight",
    "Intimidation",
    "Investigation",
    "Perception",
    "Performance",
    "Persuasion",
    "Sleight of Hand",
    "Stealth",
  ],
  Cleric: ["History", "Insight", "Medicine", "Persuasion", "Religion"],
  Ranger: [
    "Animal Handling",
    "Athletics",
    "Insight",
    "Investigation",
    "Nature",
    "Perception",
    "Stealth",
    "Survival",
  ],
  Paladin: ["Athletics", "Insight", "Intimidation", "Medicine", "Persuasion", "Religion"],
  Barbarian: [
    "Animal Handling",
    "Athletics",
    "Intimidation",
    "Nature",
    "Perception",
    "Survival",
  ],
  Bard: [
    "Acrobatics",
    "Animal Handling",
    "Arcana",
    "Athletics",
    "Deception",
    "History",
    "Insight",
    "Intimidation",
    "Investigation",
    "Medicine",
    "Nature",
    "Perception",
    "Performance",
    "Persuasion",
    "Religion",
    "Sleight of Hand",
    "Stealth",
    "Survival",
  ],
  Sorcerer: [
    "Arcana",
    "Deception",
    "Insight",
    "Intimidation",
    "Persuasion",
    "Religion",
  ],
  Warlock: [
    "Arcana",
    "Deception",
    "History",
    "Intimidation",
    "Investigation",
    "Nature",
    "Religion",
  ],
  Monk: [
    "Acrobatics",
    "Athletics",
    "History",
    "Insight",
    "Religion",
    "Stealth",
  ],
  Druid: [
    "Arcana",
    "Animal Handling",
    "Insight",
    "Medicine",
    "Nature",
    "Perception",
    "Religion",
    "Survival",
  ],
};

// 法術位表（簡化版，根據職業類型與等級）
// 全施法者：Wizard, Cleric, Druid, Sorcerer, Bard
// 半施法者：Ranger, Paladin
// 戰士型：Fighter, Rogue, Barbarian, Monk
// Warlock 使用特殊規則（先簡化為全施法者）

export const FULL_CASTER_SPELL_SLOTS: Record<number, { level1: number; level2: number; level3: number; level4: number; level5: number }> = {
  1: { level1: 2, level2: 0, level3: 0, level4: 0, level5: 0 },
  2: { level1: 3, level2: 0, level3: 0, level4: 0, level5: 0 },
  3: { level1: 4, level2: 2, level3: 0, level4: 0, level5: 0 },
  4: { level1: 4, level2: 3, level3: 0, level4: 0, level5: 0 },
  5: { level1: 4, level2: 3, level3: 2, level4: 0, level5: 0 },
  6: { level1: 4, level2: 3, level3: 3, level4: 0, level5: 0 },
  7: { level1: 4, level2: 3, level3: 3, level4: 1, level5: 0 },
  8: { level1: 4, level2: 3, level3: 3, level4: 2, level5: 0 },
  9: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 1 },
  10: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2 },
};

export const HALF_CASTER_SPELL_SLOTS: Record<number, { level1: number; level2: number; level3: number; level4: number; level5: number }> = {
  1: { level1: 0, level2: 0, level3: 0, level4: 0, level5: 0 },
  2: { level1: 2, level2: 0, level3: 0, level4: 0, level5: 0 },
  3: { level1: 3, level2: 0, level3: 0, level4: 0, level5: 0 },
  4: { level1: 3, level2: 0, level3: 0, level4: 0, level5: 0 },
  5: { level1: 4, level2: 2, level3: 0, level4: 0, level5: 0 },
  6: { level1: 4, level2: 2, level3: 0, level4: 0, level5: 0 },
  7: { level1: 4, level2: 3, level3: 0, level4: 0, level5: 0 },
  8: { level1: 4, level2: 3, level3: 0, level4: 0, level5: 0 },
  9: { level1: 4, level2: 3, level3: 2, level4: 0, level5: 0 },
  10: { level1: 4, level2: 3, level3: 2, level4: 0, level5: 0 },
};

// 判斷職業類型
export function getCasterType(
  characterClass: CharacterClass
): "full" | "half" | "none" {
  const fullCasters: CharacterClass[] = [
    "Wizard",
    "Cleric",
    "Druid",
    "Sorcerer",
    "Bard",
    "Warlock",
  ];
  const halfCasters: CharacterClass[] = ["Ranger", "Paladin"];

  if (fullCasters.includes(characterClass)) return "full";
  if (halfCasters.includes(characterClass)) return "half";
  return "none";
}
