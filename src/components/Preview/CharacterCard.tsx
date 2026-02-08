import React from "react";
import type { Character, AbilityName, SkillName } from "../../types/character";

interface CharacterCardProps {
  character: Partial<Character>;
}

const ABILITY_LABELS: Record<AbilityName, { zh: string; en: string }> = {
  str: { zh: "力量", en: "STR" },
  dex: { zh: "敏捷", en: "DEX" },
  con: { zh: "體質", en: "CON" },
  int: { zh: "智力", en: "INT" },
  wis: { zh: "感知", en: "WIS" },
  cha: { zh: "魅力", en: "CHA" },
};

// 按能力分類的技能
const SKILLS_BY_ABILITY: Record<AbilityName, { name: SkillName; zh: string }[]> = {
  str: [
    { name: "Athletics", zh: "運動" },
  ],
  dex: [
    { name: "Acrobatics", zh: "特技" },
    { name: "Sleight of Hand", zh: "巧手" },
    { name: "Stealth", zh: "潛行" },
  ],
  con: [], // 體質沒有對應技能
  int: [
    { name: "Arcana", zh: "奧術" },
    { name: "History", zh: "歷史" },
    { name: "Investigation", zh: "調查" },
    { name: "Nature", zh: "自然" },
    { name: "Religion", zh: "宗教" },
  ],
  wis: [
    { name: "Animal Handling", zh: "馴獸" },
    { name: "Insight", zh: "洞察" },
    { name: "Medicine", zh: "醫療" },
    { name: "Perception", zh: "感知" },
    { name: "Survival", zh: "生存" },
  ],
  cha: [
    { name: "Deception", zh: "欺瞞" },
    { name: "Intimidation", zh: "威嚇" },
    { name: "Performance", zh: "表演" },
    { name: "Persuasion", zh: "說服" },
  ],
};

// 職業生命骰
const CLASS_HIT_DICE: Record<string, number> = {
  Barbarian: 12,
  Fighter: 10, Paladin: 10, Ranger: 10,
  Bard: 8, Cleric: 8, Druid: 8, Monk: 8, Rogue: 8, Warlock: 8,
  Sorcerer: 6, Wizard: 6,
};

// 根據職業和等級計算法術位（簡化版 D&D 5e 規則）
function getSpellSlots(charClass: string, level: number): number[] {
  // 全施法者法術位表
  const fullCasterSlots: Record<number, number[]> = {
    1: [2], 2: [3], 3: [4, 2], 4: [4, 3], 5: [4, 3, 2],
    6: [4, 3, 3], 7: [4, 3, 3, 1], 8: [4, 3, 3, 2], 9: [4, 3, 3, 3, 1],
    10: [4, 3, 3, 3, 2], 11: [4, 3, 3, 3, 2, 1], 12: [4, 3, 3, 3, 2, 1],
    13: [4, 3, 3, 3, 2, 1, 1], 14: [4, 3, 3, 3, 2, 1, 1], 15: [4, 3, 3, 3, 2, 1, 1, 1],
    16: [4, 3, 3, 3, 2, 1, 1, 1], 17: [4, 3, 3, 3, 2, 1, 1, 1, 1], 18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
    19: [4, 3, 3, 3, 3, 2, 1, 1, 1], 20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
  };

  // 半施法者法術位表（Paladin, Ranger）
  const halfCasterSlots: Record<number, number[]> = {
    1: [], 2: [2], 3: [3], 4: [3], 5: [4, 2],
    6: [4, 2], 7: [4, 3], 8: [4, 3], 9: [4, 3, 2],
    10: [4, 3, 2], 11: [4, 3, 3], 12: [4, 3, 3], 13: [4, 3, 3, 1],
    14: [4, 3, 3, 1], 15: [4, 3, 3, 2], 16: [4, 3, 3, 2], 17: [4, 3, 3, 3, 1],
    18: [4, 3, 3, 3, 1], 19: [4, 3, 3, 3, 2], 20: [4, 3, 3, 3, 2],
  };

  // Warlock 契約魔法
  const warlockSlots: Record<number, number[]> = {
    1: [1], 2: [2], 3: [2], 4: [2], 5: [2],
    6: [2], 7: [2], 8: [2], 9: [2], 10: [2],
    11: [3], 12: [3], 13: [3], 14: [3], 15: [3],
    16: [3], 17: [4], 18: [4], 19: [4], 20: [4],
  };

  const fullCasters = ["Bard", "Cleric", "Druid", "Sorcerer", "Wizard"];
  const halfCasters = ["Paladin", "Ranger"];

  if (fullCasters.includes(charClass)) {
    return fullCasterSlots[level] || [];
  } else if (halfCasters.includes(charClass)) {
    return halfCasterSlots[level] || [];
  } else if (charClass === "Warlock") {
    return warlockSlots[level] || [];
  }
  return [];
}

export function CharacterCard({ character }: CharacterCardProps) {
  if (!character.name && !character.class) {
    return (
      <div className="dnd-border-box bg-white/50 p-8 text-center italic text-gray-500">
        請在左側輸入資料，冒險即將開始...
      </div>
    );
  }

  const name = character.name || "—";
  const race = character.race || "—";
  const charClass = character.class || "—";
  const level = character.level || 1;
  const alignment = character.alignment || "—";
  const ac = character.armorClass || 10;
  const hp = character.maxHP || 0;
  const pb = character.proficiencyBonus || 2;

  // 計算法術豁免 DC（8 + 熟練加值 + 施法屬性修正）
  // 根據職業決定施法屬性
  const getSpellcastingAbility = (): AbilityName | null => {
    switch (character.class) {
      case "Wizard": return "int";
      case "Cleric": case "Druid": case "Ranger": return "wis";
      case "Bard": case "Sorcerer": case "Warlock": case "Paladin": return "cha";
      default: return null;
    }
  };

  const spellAbility = getSpellcastingAbility();
  const spellDC = spellAbility
    ? 8 + pb + (character.abilityModifiers?.[spellAbility] ?? 0)
    : null;

  return (
    <div className="max-w-[950px] mx-auto space-y-4 text-[#1a1a1a] select-none">
      {/* 頂部橫向看板 */}
      <div className="flex flex-col md:flex-row gap-4 border-2 border-black p-4 bg-[#fdfaf2] shadow-sm relative">
        {character.imageUrl && (
          <div className="w-full md:w-24 h-24 md:h-auto md:min-h-[120px] flex-shrink-0 border-2 border-black overflow-hidden">
            <img src={character.imageUrl} alt={name} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 flex flex-col justify-start border-r-0 md:border-r-2 border-black pr-4 mb-4 md:mb-0">
          <div className="text-2xl font-bold font-serif underline decoration-1 underline-offset-4">{name}</div>
          <label className="dnd-label text-left">角色名稱</label>
        </div>
        <div className="flex-[2] grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4">
          <InfoBox label="職業與等級" value={`${charClass} ${level}`} />
          <InfoBox label="種族" value={race} />
          <InfoBox label="陣營" value={alignment} />
        </div>
      </div>

      {/* 主體三欄佈局 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

        {/* 左欄：能力值 */}
        <div className="md:col-span-3 space-y-3">
          <h3 className="text-xs font-bold uppercase border-b border-black pb-1">
            能力值 <span className="text-gray-400 font-normal">Ability Scores</span>
          </h3>
          <div className="space-y-2">
            {(Object.keys(ABILITY_LABELS) as AbilityName[]).map((key) => {
              const score = character.abilityScores?.[key] ?? 10;
              const mod = character.abilityModifiers?.[key] ?? 0;
              const modStr = mod >= 0 ? `+${mod}` : `${mod}`;
              return (
                <div key={key} className="border border-black p-2 bg-[#fdfaf2] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center text-sm font-bold bg-gray-50 flex-shrink-0">
                      {modStr}
                    </div>
                    <div>
                      <div className="text-xs font-bold">{ABILITY_LABELS[key].zh}</div>
                      <div className="text-[10px] text-gray-400">{ABILITY_LABELS[key].en}</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold font-serif min-w-[2rem] text-right">{score}</div>
                </div>
              );
            })}
          </div>

          {/* 熟練加值 */}
          <div className="border border-black flex items-center p-2 gap-2 bg-[#fdfaf2]">
            <div className="w-8 h-8 border-2 border-black rounded-full flex items-center justify-center font-bold text-sm bg-gray-100">
              +{pb}
            </div>
            <div className="text-xs">
              <span className="font-bold">熟練加值</span>
            </div>
          </div>
        </div>

        {/* 中欄：豁免 + 戰鬥數值 */}
        <div className="md:col-span-4 space-y-3">
          {/* 豁免值 */}
          <h3 className="text-xs font-bold uppercase border-b border-black pb-1">
            豁免 <span className="text-gray-400 font-normal">Saving Throws</span>
          </h3>
          <div className="border border-black bg-[#fdfaf2] p-2 grid grid-cols-2 gap-1">
            {(Object.keys(ABILITY_LABELS) as AbilityName[]).map((key) => {
              const saveValue = character.savingThrows?.[key] ?? (character.abilityModifiers?.[key] ?? 0);
              const saveStr = saveValue >= 0 ? `+${saveValue}` : `${saveValue}`;
              const isProficient = character.class &&
                (character.savingThrows?.[key] ?? 0) > (character.abilityModifiers?.[key] ?? 0);
              return (
                <div key={key} className="flex items-center justify-between text-xs py-1 px-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${isProficient ? 'bg-black' : 'border border-black'}`}></span>
                    <span className="font-bold">{ABILITY_LABELS[key].en}</span>
                  </div>
                  <span className="font-serif font-bold">{saveStr}</span>
                </div>
              );
            })}
          </div>

          {/* 戰鬥數值 */}
          <h3 className="text-xs font-bold uppercase border-b border-black pb-1">
            戰鬥 <span className="text-gray-400 font-normal">Combat</span>
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <CombatBox label="護甲等級 AC" value={ac} icon="shield" />
            <CombatBox label="先攻" value={character.initiative ?? 0} prefix="+" />
            <CombatBox label="速度" value={`${character.speed ?? 30}ft`} />
          </div>

          {/* 生命值 */}
          <div className="border-2 border-black bg-[#fdfaf2]">
            <div className="h-14 flex items-center justify-center font-serif text-3xl font-bold text-gray-800">
              {hp}
            </div>
            <div className="bg-black text-white text-center py-1 text-xs font-bold">
              最大生命值 MAX HP
            </div>
          </div>

          {/* 生命骰 */}
          <div className="border border-black p-2 bg-[#fdfaf2] flex items-center justify-between">
            <div>
              <span className="font-bold text-sm">生命骰</span>
              <span className="text-xs text-gray-500 ml-1">Hit Dice</span>
            </div>
            <div className="font-bold text-lg font-serif">
              {level}d{CLASS_HIT_DICE[character.class ?? ""] || 8}
            </div>
          </div>

          {/* 法術資訊區塊 */}
          {spellAbility && (
            <div className="border-2 border-black bg-[#fdfaf2] p-3 space-y-2">
              <h4 className="text-xs font-bold uppercase border-b border-black/30 pb-1 text-gray-800">
                法術 <span className="text-gray-400 font-normal">Spellcasting</span>
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/60 border border-black/30 p-2 rounded text-center">
                  <div className="font-bold text-lg font-serif text-gray-800">{spellDC}</div>
                  <div className="text-[9px] text-gray-600">法術豁免 DC</div>
                </div>
                <div className="bg-white/60 border border-black/30 p-2 rounded text-center">
                  <div className="font-bold text-lg font-serif text-gray-800">
                    +{pb + (character.abilityModifiers?.[spellAbility] ?? 0)}
                  </div>
                  <div className="text-[9px] text-gray-600">法術攻擊加值</div>
                </div>
                <div className="bg-white/60 border border-black/30 p-2 rounded text-center">
                  <div className="font-bold text-lg font-serif text-gray-800">
                    {ABILITY_LABELS[spellAbility].en}
                  </div>
                  <div className="text-[9px] text-gray-600">施法屬性</div>
                </div>
              </div>
              {/* 法術位 */}
              <div className="text-[10px] space-y-1">
                <div className="font-bold text-gray-700">法術位 Spell Slots</div>
                <div className="grid grid-cols-3 gap-1">
                  {getSpellSlots(character.class ?? "", level).map((slots, idx) => (
                    slots > 0 && (
                      <div key={idx} className="bg-white/60 px-2 py-1 rounded border border-black/20 text-center">
                        <span className="text-gray-600">{idx + 1}環</span>
                        <span className="font-bold ml-1">×{slots}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 右欄：技能（按能力分類） */}
        <div className="md:col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase border-b border-black pb-1">
            技能 <span className="text-gray-400 font-normal">Skills</span>
          </h3>
          <div className="border border-black bg-[#fdfaf2] p-2 space-y-2">
            {(Object.keys(SKILLS_BY_ABILITY) as AbilityName[]).map((ability) => {
              const skills = SKILLS_BY_ABILITY[ability];
              if (skills.length === 0) return null;

              return (
                <div key={ability}>
                  <div className="text-[10px] font-bold text-gray-500 uppercase border-b border-gray-200 pb-0.5 mb-1">
                    {ABILITY_LABELS[ability].en} ({ABILITY_LABELS[ability].zh})
                  </div>
                  {skills.map(({ name: skillName, zh }) => {
                    const skill = character.skills?.[skillName];
                    const abilityMod = character.abilityModifiers?.[ability] ?? 0;
                    const bonus = skill?.bonus ?? abilityMod;
                    const bonusStr = bonus >= 0 ? `+${bonus}` : `${bonus}`;
                    const isProficient = skill?.proficient ?? false;

                    return (
                      <div key={skillName} className="flex items-center justify-between text-xs py-0.5">
                        <div className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${isProficient ? 'bg-black' : 'border border-black'}`}></span>
                          <span>{zh}</span>
                          <span className="text-[9px] text-gray-400">{skillName}</span>
                        </div>
                        <span className="font-bold font-serif">{bonusStr}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col">
      <div className="font-serif border-b border-black/40 text-sm whitespace-nowrap overflow-hidden text-ellipsis min-h-[1.5rem]">
        {value}
      </div>
      <label className="dnd-label text-[8px] text-left">{label}</label>
    </div>
  );
}

function CombatBox({ label, value, icon, prefix = "" }: { label: string; value: string | number; icon?: string; prefix?: string }) {
  return (
    <div className="flex flex-col items-center border border-black p-2 bg-white relative rounded-md">
      {icon === "shield" ? (
        <div className="w-10 h-10 border-2 border-black rounded-sm rotate-45 flex items-center justify-center mb-1 bg-gray-50">
          <div className="-rotate-45 font-bold text-lg">{value}</div>
        </div>
      ) : (
        <div className="text-lg font-bold border border-black/20 w-10 h-10 flex items-center justify-center rounded-lg mb-1">
          {prefix}{value}
        </div>
      )}
      <div className="text-[9px] font-bold leading-tight text-center">{label}</div>
    </div>
  );
}
