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

  const handlePersonalityChange = (updates: Partial<Character>) => {
    setBaseCharacter((prev) => ({ ...prev, ...updates }));
  };

  const handleImageChange = (imageUrl: string | undefined) => {
    setBaseCharacter((prev) => ({ ...prev, imageUrl }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e6e2d6]">
      <header className="no-print border-b-2 border-black bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-sm flex items-center justify-center">
              <span className="text-white font-serif text-2xl font-bold">&</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tighter text-black uppercase">
              Dungeons & Dragons <span className="text-red-800 font-serif lowercase italic font-normal ml-1">Character Generator</span>
            </h1>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
            5th Edition
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 md:flex-row items-start">
        {/* 編輯區 - 保持側邊欄樣式但配色調整 */}
        <section className="no-print w-full md:w-[380px] shrink-0 rounded-none border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-y-auto max-h-[calc(100vh-120px)]">
          <h2 className="mb-6 text-xl font-bold text-black uppercase tracking-tight border-b-2 border-black pb-2">
            角色編輯器 <span className="text-xs font-normal normal-case">Character Editor</span>
          </h2>
          <div className="space-y-8">
            <ImageUpload
              imageUrl={character.imageUrl}
              onChange={handleImageChange}
            />
            <BasicInfoForm
              character={character}
              onChange={handleBasicInfoChange}
            />
            <AbilityScoresForm
              abilityScores={character.abilityScores || DEFAULT_ABILITY_SCORES}
              onChange={handleAbilityScoresChange}
            />
            <BackgroundForm
              character={character}
              onChange={handlePersonalityChange}
            />
          </div>
        </section>

        {/* 預覽區 - 核心角色卡 */}
        <section className="flex-1 w-full dnd-parchment p-8 sm:p-12 shadow-xl overflow-y-auto max-h-none md:max-h-[calc(100vh-80px)] print:max-h-none print:p-0">
          <div className="space-y-8">
            <CharacterCard character={character} />
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <DescriptionPanel character={character} />
              </div>
              <div className="no-print w-full lg:w-48">
                <ExportControls character={character} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
