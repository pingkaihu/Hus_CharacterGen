import React from "react";
import type { Character, Race, CharacterClass, Alignment } from "../../types/character";

interface BasicInfoFormProps {
  character: Partial<Character>;
  onChange: (updates: Partial<Character>) => void;
}

const RACES: Race[] = [
  "Human",
  "Elf",
  "Dwarf",
  "Halfling",
  "Dragonborn",
  "Gnome",
  "Half-Elf",
  "Half-Orc",
  "Tiefling",
];

const CLASSES: CharacterClass[] = [
  "Fighter",
  "Wizard",
  "Rogue",
  "Cleric",
  "Ranger",
  "Paladin",
  "Barbarian",
  "Bard",
  "Sorcerer",
  "Warlock",
  "Monk",
  "Druid",
];

const ALIGNMENTS: Alignment[] = [
  "Lawful Good",
  "Neutral Good",
  "Chaotic Good",
  "Lawful Neutral",
  "True Neutral",
  "Chaotic Neutral",
  "Lawful Evil",
  "Neutral Evil",
  "Chaotic Evil",
];

const RACE_LABELS: Record<Race, string> = {
  Human: "人類",
  Elf: "精靈",
  Dwarf: "矮人",
  Halfling: "半身人",
  Dragonborn: "龍裔",
  Gnome: "侏儒",
  "Half-Elf": "半精靈",
  "Half-Orc": "半獸人",
  Tiefling: "提夫林",
};

const CLASS_LABELS: Record<CharacterClass, string> = {
  Fighter: "戰士",
  Wizard: "法師",
  Rogue: "盜賊",
  Cleric: "牧師",
  Ranger: "遊俠",
  Paladin: "聖騎士",
  Barbarian: "野蠻人",
  Bard: "吟遊詩人",
  Sorcerer: "術士",
  Warlock: "邪術師",
  Monk: "武僧",
  Druid: "德魯伊",
};

export function BasicInfoForm({ character, onChange }: BasicInfoFormProps) {
  return (
    <div className="space-y-4 rounded-lg border border-slate-700 bg-slate-800/40 p-4">
      <h3 className="text-sm font-semibold text-amber-300">基本資料</h3>

      <div>
        <label className="block text-xs text-slate-300 mb-1">角色姓名</label>
        <input
          type="text"
          value={character.name || ""}
          onChange={(e) => onChange({ name: e.target.value })}
          className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
          placeholder="輸入角色姓名"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-300 mb-1">種族</label>
          <select
            value={character.race || ""}
            onChange={(e) => onChange({ race: e.target.value as Race })}
            className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
          >
            <option value="">選擇種族</option>
            {RACES.map((race) => (
              <option key={race} value={race}>
                {RACE_LABELS[race]} ({race})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-300 mb-1">職業</label>
          <select
            value={character.class || ""}
            onChange={(e) => onChange({ class: e.target.value as CharacterClass })}
            className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
          >
            <option value="">選擇職業</option>
            {CLASSES.map((cls) => (
              <option key={cls} value={cls}>
                {CLASS_LABELS[cls]} ({cls})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-300 mb-1">等級</label>
          <input
            type="number"
            min="1"
            max="20"
            value={character.level || 1}
            onChange={(e) => onChange({ level: parseInt(e.target.value) || 1 })}
            className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-300 mb-1">陣營</label>
          <select
            value={character.alignment || ""}
            onChange={(e) => onChange({ alignment: e.target.value as Alignment })}
            className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
          >
            <option value="">選擇陣營</option>
            {ALIGNMENTS.map((align) => (
              <option key={align} value={align}>
                {align}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
