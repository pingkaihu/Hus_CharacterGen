import React from "react";
import type { AbilityScores } from "../../types/character";
import { getAbilityModifier } from "../../rules/calculations";

interface AbilityScoresFormProps {
  abilityScores: AbilityScores;
  onChange: (scores: AbilityScores) => void;
}

const ABILITY_LABELS: Record<keyof AbilityScores, string> = {
  str: "力量 (STR)",
  dex: "敏捷 (DEX)",
  con: "體質 (CON)",
  int: "智力 (INT)",
  wis: "感知 (WIS)",
  cha: "魅力 (CHA)",
};

export function AbilityScoresForm({
  abilityScores,
  onChange,
}: AbilityScoresFormProps) {
  const handleChange = (ability: keyof AbilityScores, value: number) => {
    const clampedValue = Math.max(1, Math.min(30, value || 1));
    onChange({
      ...abilityScores,
      [ability]: clampedValue,
    });
  };

  return (
    <div className="space-y-4 rounded-lg border border-slate-700 bg-slate-800/40 p-4">
      <h3 className="text-sm font-semibold text-amber-300">能力值</h3>
      <p className="text-xs text-slate-400">
        輸入角色的六項基本能力值（範圍：1-30）
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(Object.keys(ABILITY_LABELS) as Array<keyof AbilityScores>).map(
          (ability) => {
            const score = abilityScores[ability];
            const modifier = getAbilityModifier(score);
            const modifierStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;

            return (
              <div
                key={ability}
                className="rounded border border-slate-600 bg-slate-800/60 p-3"
              >
                <label className="block text-xs text-slate-300 mb-1">
                  {ABILITY_LABELS[ability]}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={score}
                    onChange={(e) =>
                      handleChange(ability, parseInt(e.target.value) || 1)
                    }
                    className="w-16 rounded border border-slate-600 bg-slate-900 px-2 py-1 text-sm font-semibold text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                  <span className="text-sm font-semibold text-amber-300">
                    ({modifierStr})
                  </span>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
