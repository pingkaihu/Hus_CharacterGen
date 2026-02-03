import React from "react";
import type { Character } from "../../types/character";

interface CharacterCardProps {
  character: Partial<Character>;
}

const ABILITY_LABELS: Record<keyof Character["abilityScores"], string> = {
  str: "力量",
  dex: "敏捷",
  con: "體質",
  int: "智力",
  wis: "感知",
  cha: "魅力",
};

export function CharacterCard({ character }: CharacterCardProps) {
  if (!character.name && !character.class) {
    return (
      <div className="rounded-lg border border-amber-700/60 bg-gradient-to-b from-amber-950/60 to-slate-950/90 p-6 text-center text-sm text-amber-50/60">
        請在左側填寫角色資訊以查看角色卡
      </div>
    );
  }

  const name = character.name || "未命名";
  const race = character.race || "未知";
  const charClass = character.class || "未知";
  const level = character.level || 1;
  const alignment = character.alignment || "未設定";

  return (
    <div className="rounded-lg border border-amber-700/60 bg-gradient-to-b from-amber-950/60 to-slate-950/90 p-6 text-sm text-amber-50 shadow-lg">
      {/* 標題區 */}
      <div className="mb-4 border-b border-amber-700/40 pb-3">
        <h3 className="text-lg font-bold text-amber-200">{name}</h3>
        <p className="text-xs text-amber-300/80">
          {race} {charClass} {level}級 · {alignment}
        </p>
      </div>

      {/* 基本數值 */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded border border-amber-700/40 bg-amber-950/40 p-2">
          <div className="text-xs text-amber-300/70">最大生命值</div>
          <div className="text-lg font-bold text-amber-200">
            {character.maxHP || "-"}
          </div>
        </div>
        <div className="rounded border border-amber-700/40 bg-amber-950/40 p-2">
          <div className="text-xs text-amber-300/70">護甲等級</div>
          <div className="text-lg font-bold text-amber-200">
            {character.armorClass || "-"}
          </div>
        </div>
        <div className="rounded border border-amber-700/40 bg-amber-950/40 p-2">
          <div className="text-xs text-amber-300/70">熟練加值</div>
          <div className="text-lg font-bold text-amber-200">
            {character.proficiencyBonus
              ? `+${character.proficiencyBonus}`
              : "-"}
          </div>
        </div>
      </div>

      {/* 能力值與修正 */}
      {character.abilityScores && character.abilityModifiers && (
        <div className="mb-4 space-y-2">
          <h4 className="text-xs font-semibold text-amber-300/80">能力值</h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {(Object.keys(character.abilityScores) as Array<
              keyof typeof character.abilityScores
            >).map((ability) => {
              const score = character.abilityScores![ability];
              const mod = character.abilityModifiers![ability];
              const modStr = mod >= 0 ? `+${mod}` : `${mod}`;
              return (
                <div
                  key={ability}
                  className="rounded border border-amber-700/30 bg-amber-950/30 p-1.5"
                >
                  <div className="text-amber-300/70">
                    {ABILITY_LABELS[ability]}
                  </div>
                  <div className="font-semibold text-amber-200">
                    {score} ({modStr})
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 豁免 */}
      {character.savingThrows && (
        <div className="mb-4 space-y-2">
          <h4 className="text-xs font-semibold text-amber-300/80">豁免</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {(Object.keys(character.savingThrows) as Array<
              keyof typeof character.savingThrows
            >).map((ability) => {
              const value = character.savingThrows![ability];
              const valueStr = value >= 0 ? `+${value}` : `${value}`;
              return (
                <div
                  key={ability}
                  className="rounded border border-amber-700/30 bg-amber-950/30 p-1.5"
                >
                  <div className="text-amber-300/70">
                    {ABILITY_LABELS[ability]}
                  </div>
                  <div className="font-semibold text-amber-200">
                    {valueStr}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 法術位（如果有） */}
      {character.spellSlots && (
        <div className="mb-4 space-y-2">
          <h4 className="text-xs font-semibold text-amber-300/80">法術位</h4>
          <div className="flex gap-2 text-xs">
            {[1, 2, 3, 4, 5].map((level) => {
              const slots =
                character.spellSlots![
                  `level${level}` as keyof typeof character.spellSlots
                ];
              if (slots === 0) return null;
              return (
                <div
                  key={level}
                  className="rounded border border-amber-700/30 bg-amber-950/30 px-2 py-1"
                >
                  <span className="text-amber-300/70">{level}環:</span>{" "}
                  <span className="font-semibold text-amber-200">{slots}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
