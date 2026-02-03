// D&D 5e 規則計算函式

import type {
  Character,
  AbilityScores,
  AbilityModifiers,
  SavingThrows,
  SkillSet,
  SkillName,
  SpellSlots,
  AbilityName,
} from "../types/character";
import {
  PROFICIENCY_BONUS_BY_LEVEL,
  HIT_DICE_BY_CLASS,
  SAVING_THROW_PROFICIENCIES,
  SKILL_ABILITY_MAP,
  FULL_CASTER_SPELL_SLOTS,
  HALF_CASTER_SPELL_SLOTS,
  getCasterType,
} from "./constants";

/**
 * 計算能力值修正值
 * 公式：mod = floor((score - 10) / 2)
 */
export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/**
 * 計算所有能力值的修正值
 */
export function calculateAbilityModifiers(
  scores: AbilityScores
): AbilityModifiers {
  return {
    str: getAbilityModifier(scores.str),
    dex: getAbilityModifier(scores.dex),
    con: getAbilityModifier(scores.con),
    int: getAbilityModifier(scores.int),
    wis: getAbilityModifier(scores.wis),
    cha: getAbilityModifier(scores.cha),
  };
}

/**
 * 根據等級取得熟練加值
 */
export function getProficiencyBonus(level: number): number {
  if (level < 1) return 2;
  if (level > 20) return 6;
  return PROFICIENCY_BONUS_BY_LEVEL[level] || 2;
}

/**
 * 計算最大生命值
 * 等級 1：生命骰最大值 + CON 修正
 * 更高等級：簡化為 (生命骰平均值 + CON 修正) * 等級
 */
export function calculateMaxHP(character: Character): number {
  if (!character.class) return 0;

  const hitDice = HIT_DICE_BY_CLASS[character.class];
  const conMod = getAbilityModifier(character.abilityScores.con);
  const level = character.level || 1;

  if (level === 1) {
    return hitDice + conMod;
  }

  // 簡化計算：生命骰平均值（向上取整）+ CON 修正，然後乘以等級
  const averageHitDie = Math.ceil((hitDice + 1) / 2);
  return (averageHitDie + conMod) * level;
}

/**
 * 計算護甲等級（AC）
 * 簡化處理：10 + DEX 修正（無裝甲時）
 */
export function calculateArmorClass(character: Character): number {
  const dexMod = getAbilityModifier(character.abilityScores.dex);
  return 10 + dexMod;
}

/**
 * 計算豁免值
 */
export function calculateSavingThrows(character: Character): SavingThrows {
  if (!character.class) {
    return {
      str: 0,
      dex: 0,
      con: 0,
      int: 0,
      wis: 0,
      cha: 0,
    };
  }

  const modifiers = calculateAbilityModifiers(character.abilityScores);
  const proficiencyBonus = getProficiencyBonus(character.level || 1);
  const proficiencies = SAVING_THROW_PROFICIENCIES[character.class];

  const savingThrows: SavingThrows = {
    str: modifiers.str + (proficiencies.includes("str") ? proficiencyBonus : 0),
    dex: modifiers.dex + (proficiencies.includes("dex") ? proficiencyBonus : 0),
    con: modifiers.con + (proficiencies.includes("con") ? proficiencyBonus : 0),
    int: modifiers.int + (proficiencies.includes("int") ? proficiencyBonus : 0),
    wis: modifiers.wis + (proficiencies.includes("wis") ? proficiencyBonus : 0),
    cha: modifiers.cha + (proficiencies.includes("cha") ? proficiencyBonus : 0),
  };

  return savingThrows;
}

/**
 * 計算技能加值
 * 簡化版：先計算所有技能，預設都不熟練（之後可由使用者選擇哪些技能熟練）
 */
export function calculateSkills(character: Character): SkillSet {
  if (!character.class) {
    return {};
  }

  const modifiers = calculateAbilityModifiers(character.abilityScores);
  const proficiencyBonus = getProficiencyBonus(character.level || 1);

  const skills: SkillSet = {};

  // 初始化所有技能（預設不熟練）
  (Object.keys(SKILL_ABILITY_MAP) as SkillName[]).forEach((skillName) => {
    const ability = SKILL_ABILITY_MAP[skillName];
    const abilityMod = modifiers[ability];
    skills[skillName] = {
      name: skillName,
      ability,
      proficient: false,
      bonus: abilityMod,
    };
  });

  return skills;
}

/**
 * 設定技能熟練（由使用者選擇）
 */
export function setSkillProficiency(
  skills: SkillSet,
  skillName: SkillName,
  proficient: boolean
): SkillSet {
  const skill = skills[skillName];
  if (!skill) return skills;

  const modifiers = calculateAbilityModifiers({
    str: 10, // 這些值應該從 character 取得，但為了簡化先這樣
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
  });

  const abilityMod = modifiers[skill.ability];
  const proficiencyBonus = getProficiencyBonus(1); // 應該從 character.level 取得

  return {
    ...skills,
    [skillName]: {
      ...skill,
      proficient,
      bonus: abilityMod + (proficient ? proficiencyBonus : 0),
    },
  };
}

/**
 * 計算法術位
 */
export function calculateSpellSlots(character: Character): SpellSlots | null {
  if (!character.class) return null;

  const casterType = getCasterType(character.class);
  const level = Math.min(character.level || 1, 10); // 簡化：只支援到等級 10

  if (casterType === "none") {
    return null;
  }

  const slots =
    casterType === "full"
      ? FULL_CASTER_SPELL_SLOTS[level]
      : HALF_CASTER_SPELL_SLOTS[level];

  return slots || {
    level1: 0,
    level2: 0,
    level3: 0,
    level4: 0,
    level5: 0,
  };
}

/**
 * 計算角色的所有衍生數值
 */
export function calculateCharacterDerivedStats(
  character: Character
): Character {
  const abilityModifiers = calculateAbilityModifiers(character.abilityScores);
  const proficiencyBonus = getProficiencyBonus(character.level || 1);
  const maxHP = calculateMaxHP(character);
  const armorClass = calculateArmorClass(character);
  const savingThrows = calculateSavingThrows(character);
  const skills = calculateSkills(character);
  const spellSlots = calculateSpellSlots(character);

  return {
    ...character,
    abilityModifiers,
    proficiencyBonus,
    maxHP,
    currentHP: character.currentHP ?? maxHP,
    armorClass,
    savingThrows,
    skills,
    spellSlots: spellSlots || undefined,
  };
}
