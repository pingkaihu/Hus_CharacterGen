import React from "react";
import type { Character } from "../../types/character";

interface BackgroundFormProps {
  character: Partial<Character>;
  onChange: (updates: Partial<Character>) => void;
}

export function BackgroundForm({ character, onChange }: BackgroundFormProps) {
  return (
    <div className="space-y-3">
      <label className="dnd-label !text-left">背景故事 Background Story</label>
      <textarea
        value={character.backgroundStory || ""}
        onChange={(e) => onChange({ backgroundStory: e.target.value })}
        rows={6}
        className="dnd-input-underlined w-full text-sm leading-relaxed font-serif italic resize-y"
        placeholder="輸入角色的背景故事、經歷、動機..."
      />
    </div>
  );
}

// 保留別名以保持向後兼容
export { BackgroundForm as PersonalityForm };
