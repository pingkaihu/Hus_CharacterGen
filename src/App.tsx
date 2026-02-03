import React, { useState, useMemo, useEffect } from "react";
import type { Character, AbilityScores } from "./types/character";
import { calculateCharacterDerivedStats } from "./rules/calculations";
import {
  BasicInfoForm,
  AbilityScoresForm,
  BackgroundForm,
  ImageUpload,
} from "./components/CharacterForm";
import { CharacterCard, DescriptionPanel } from "./components/Preview";
import { ExportControls } from "./components/Export";

const DEFAULT_ABILITY_SCORES: AbilityScores = {
  str: 10,
  dex: 10,
  con: 10,
  int: 10,
  wis: 10,
  cha: 10,
};

function App() {
  const [baseCharacter, setBaseCharacter] = useState<Partial<Character>>({
    name: "",
    race: "",
    class: "",
    level: 1,
    alignment: "",
    abilityScores: DEFAULT_ABILITY_SCORES,
    backgroundStory: "",
  });

  // 從 localStorage 載入（如果有的話）
  useEffect(() => {
    const saved = localStorage.getItem("dnd-character");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setBaseCharacter(parsed);
      } catch (e) {
        console.error("Failed to load character from localStorage", e);
      }
    }
  }, []);

  // 計算衍生數值
  const character = useMemo(() => {
    if (
      baseCharacter.name &&
      baseCharacter.race &&
      baseCharacter.class &&
      baseCharacter.level &&
      baseCharacter.abilityScores
    ) {
      return calculateCharacterDerivedStats(baseCharacter as Character);
    }
    return baseCharacter;
  }, [
    baseCharacter.name,
    baseCharacter.race,
    baseCharacter.class,
    baseCharacter.level,
    baseCharacter.abilityScores,
    baseCharacter.backgroundStory,
    baseCharacter.imageUrl,
  ]);

  // 儲存到 localStorage
  useEffect(() => {
    if (character.name) {
      localStorage.setItem("dnd-character", JSON.stringify(character));
    }
  }, [character]);

  const handleBasicInfoChange = (updates: Partial<Character>) => {
    setBaseCharacter((prev) => ({ ...prev, ...updates }));
  };

  const handleAbilityScoresChange = (scores: AbilityScores) => {
    setBaseCharacter((prev) => ({ ...prev, abilityScores: scores }));
  };

  const handleBackgroundChange = (background: string) => {
    setBaseCharacter((prev) => ({ ...prev, backgroundStory: background }));
  };

  const handleImageChange = (imageUrl: string | undefined) => {
    setBaseCharacter((prev) => ({ ...prev, imageUrl }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold tracking-wide text-amber-300">
            DnD 角色產生器
          </h1>
          <p className="text-xs text-slate-400">
            React + TypeScript + Tailwind
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-2 py-4 sm:px-4 md:flex-row">
        <section className="w-full md:w-1/2 rounded-lg border border-slate-700 bg-slate-900/60 p-4 sm:p-6 shadow-lg shadow-slate-950/40 overflow-y-auto max-h-[calc(100vh-120px)]">
          <h2 className="mb-4 text-base sm:text-lg font-semibold text-amber-200 border-b border-amber-800/40 pb-2">
            編輯區
          </h2>
          <div className="space-y-6">
            <BasicInfoForm
              character={character}
              onChange={handleBasicInfoChange}
            />
            <AbilityScoresForm
              abilityScores={character.abilityScores || DEFAULT_ABILITY_SCORES}
              onChange={handleAbilityScoresChange}
            />
            <BackgroundForm
              background={character.backgroundStory || ""}
              onChange={handleBackgroundChange}
            />
            <ImageUpload
              imageUrl={character.imageUrl}
              onChange={handleImageChange}
            />
          </div>
        </section>

        <section className="w-full md:w-1/2 rounded-lg border border-amber-800/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-4 shadow-xl shadow-black/60 overflow-y-auto max-h-[calc(100vh-120px)]">
          <h2 className="mb-4 text-base sm:text-lg font-semibold text-amber-200 border-b border-amber-800/40 pb-2">
            角色卡預覽
          </h2>
          <div className="space-y-4">
            {character.imageUrl && (
              <div className="mb-4">
                <img
                  src={character.imageUrl}
                  alt="角色"
                  className="mx-auto max-h-48 rounded border border-amber-700/60 object-contain"
                />
              </div>
            )}
            <CharacterCard character={character} />
            <DescriptionPanel character={character} />
            <ExportControls character={character} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
