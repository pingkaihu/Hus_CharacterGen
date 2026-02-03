// D&D 5e 角色相關型別定義

export type AbilityName = "str" | "dex" | "con" | "int" | "wis" | "cha";

export interface AbilityScores {
  str: number; // 力量
  dex: number; // 敏捷
  con: number; // 體質
  int: number; // 智力
  wis: number; // 感知（智慧）
  cha: number; // 魅力
}

export interface AbilityModifiers {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface SavingThrows {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export type CharacterClass =
  | "Fighter" // 戰士
  | "Wizard" // 法師
  | "Rogue" // 盜賊
  | "Cleric" // 牧師
  | "Ranger" // 遊俠
  | "Paladin" // 聖騎士
  | "Barbarian" // 野蠻人
  | "Bard" // 吟遊詩人
  | "Sorcerer" // 術士
  | "Warlock" // 術士（邪術師）
  | "Monk" // 武僧
  | "Druid"; // 德魯伊

export type Race =
  | "Human" // 人類
  | "Elf" // 精靈
  | "Dwarf" // 矮人
  | "Halfling" // 半身人
  | "Dragonborn" // 龍裔
  | "Gnome" // 侏儒
  | "Half-Elf" // 半精靈
  | "Half-Orc" // 半獸人
  | "Tiefling"; // 提夫林

export type Alignment =
  | "Lawful Good"
  | "Neutral Good"
  | "Chaotic Good"
  | "Lawful Neutral"
  | "True Neutral"
  | "Chaotic Neutral"
  | "Lawful Evil"
  | "Neutral Evil"
  | "Chaotic Evil";

export type SkillName =
  | "Acrobatics" // 特技
  | "Animal Handling" // 馴獸
  | "Arcana" // 奧術
  | "Athletics" // 運動
  | "Deception" // 欺瞞
  | "History" // 歷史
  | "Insight" // 察覺
  | "Intimidation" // 威嚇
  | "Investigation" // 調查
  | "Medicine" // 醫藥
  | "Nature" // 自然
  | "Perception" // 感知
  | "Performance" // 表演
  | "Persuasion" // 說服
  | "Religion" // 宗教
  | "Sleight of Hand" // 巧手
  | "Stealth" // 潛行
  | "Survival"; // 生存

export interface Skill {
  name: SkillName;
  ability: AbilityName;
  proficient: boolean;
  bonus: number;
}

export interface SkillSet {
  [key: string]: Skill;
}

export interface SpellSlots {
  level1: number;
  level2: number;
  level3: number;
  level4: number;
  level5: number;
}

export interface Character {
  // 基本資料
  name: string;
  race: Race | "";
  class: CharacterClass | "";
  level: number;
  alignment: Alignment | "";
  
  // 能力值
  abilityScores: AbilityScores;
  
  // 衍生數值（由規則計算）
  abilityModifiers?: AbilityModifiers;
  maxHP?: number;
  currentHP?: number;
  armorClass?: number;
  proficiencyBonus?: number;
  savingThrows?: SavingThrows;
  skills?: SkillSet;
  spellSlots?: SpellSlots;
  
  // 背景與圖片
  backgroundStory: string;
  imageUrl?: string; // 使用 URL.createObjectURL 產生的本機 URL
  
  // 自動生成的人物介紹
  description?: string;
}
