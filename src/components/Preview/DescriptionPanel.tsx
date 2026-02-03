import React from "react";
import type { Character } from "../../types/character";
import { generateCharacterDescription } from "../../rules/description";

interface DescriptionPanelProps {
  character: Partial<Character>;
}

export function DescriptionPanel({ character }: DescriptionPanelProps) {
  if (!character.name && !character.class) {
    return null;
  }

  const description = generateCharacterDescription(character as Character);

  return (
    <div className="rounded-lg border border-amber-700/60 bg-gradient-to-b from-amber-950/60 to-slate-950/90 p-6 text-sm text-amber-50 shadow-lg">
      <h3 className="mb-3 text-base font-semibold text-amber-200 border-b border-amber-700/40 pb-2">
        人物介紹
      </h3>
      <p className="leading-relaxed text-amber-50/90 whitespace-pre-wrap">
        {description}
      </p>
    </div>
  );
}
