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
    <div className="space-y-4">
      <div className="flex justify-between items-end border-b-2 border-black pb-1">
        <label className="dnd-label !mt-0 !text-left">Ability Scores</label>
        <span className="text-[10px] italic text-gray-500">Range: 1-30</span>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {(Object.keys(ABILITY_LABELS) as Array<keyof AbilityScores>).map(
          (ability) => {
            const score = abilityScores[ability];
            const modifier = getAbilityModifier(score);
            const modifierStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;

            return (
              <div key={ability} className="flex flex-col">
                <label className="text-[10px] font-bold uppercase tracking-tight text-gray-600">
                  {ABILITY_LABELS[ability]}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={score}
                    onChange={(e) =>
                      handleChange(ability, parseInt(e.target.value) || 1)
                    }
                    className="dnd-input-underlined w-16 text-lg font-bold font-serif py-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-xs font-bold text-red-800 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                    {modifierStr}
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
