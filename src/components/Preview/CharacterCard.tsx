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
    <div className="max-w-[950px] mx-auto space-y-6 text-[#1a1a1a] select-none">
      {/* 頂部橫向看板 */}
      <div className="flex flex-col md:flex-row gap-4 border-2 border-black p-4 bg-white relative">
        {character.imageUrl && (
          <div className="w-full md:w-24 h-24 md:h-auto md:min-h-[120px] flex-shrink-0 border-2 border-black overflow-hidden">
            <img src={character.imageUrl} alt={name} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 flex flex-col justify-end border-r-0 md:border-r-2 border-black pr-4 mb-4 md:mb-0">
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
                <div key={key} className="border border-black p-2 bg-white flex items-center gap-2">
                  <div className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center text-sm font-bold bg-gray-50">
                    {modStr}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold">{ABILITY_LABELS[key].zh}</div>
                    <div className="text-[10px] text-gray-400">{ABILITY_LABELS[key].en}</div>
                  </div>
                  <div className="text-lg font-bold font-serif">{score}</div>
                </div>
              );
            })}
          </div>

          {/* 熟練加值 */}
          <div className="border border-black flex items-center p-2 gap-2 bg-white">
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
          <div className="border border-black bg-white p-2 grid grid-cols-2 gap-1">
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
            <CombatBox label="AC" value={ac} icon="shield" />
            <CombatBox label="先攻" value={character.initiative ?? 0} prefix="+" />
            <CombatBox label="速度" value={`${character.speed ?? 30}ft`} />
          </div>

          {/* 生命值 */}
          <div className="border-2 border-black bg-white">
            <div className="h-14 flex items-center justify-center font-serif text-3xl font-bold text-red-800">
              {hp}
            </div>
            <div className="bg-black text-white text-center py-1 text-xs font-bold">
              生命值 HP
            </div>
          </div>

          {/* 法術豁免 DC + 生命骰 */}
          <div className="grid grid-cols-2 gap-2">
            <div className="border border-black p-2 bg-white text-center">
              <div className="font-bold text-lg font-serif">{level}d8</div>
              <div className="text-[10px] text-gray-500">生命骰</div>
            </div>
            {spellDC ? (
              <div className="border border-black p-2 bg-white text-center">
                <div className="font-bold text-lg font-serif text-red-800">{spellDC}</div>
                <div className="text-[10px] text-gray-500">法術 DC</div>
              </div>
            ) : (
              <div className="border border-black p-2 bg-gray-100 text-center">
                <div className="font-bold text-lg font-serif text-gray-400">—</div>
                <div className="text-[10px] text-gray-400">法術 DC</div>
              </div>
            )}
          </div>
        </div>

        {/* 右欄：技能（按能力分類） */}
        <div className="md:col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase border-b border-black pb-1">
            技能 <span className="text-gray-400 font-normal">Skills</span>
          </h3>
          <div className="border border-black bg-white p-2 space-y-2 max-h-[450px] overflow-y-auto">
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
