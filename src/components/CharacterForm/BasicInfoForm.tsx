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
    <div className="space-y-6">
      <div>
        <label className="dnd-label !text-left">Character Name</label>
        <input
          type="text"
          value={character.name || ""}
          onChange={(e) => onChange({ name: e.target.value })}
          className="dnd-input-underlined w-full text-lg font-serif"
          placeholder="Name your hero..."
        />
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label className="dnd-label !text-left">Race</label>
          <select
            value={character.race || ""}
            onChange={(e) => onChange({ race: e.target.value as Race })}
            className="dnd-input-underlined w-full text-sm py-1 cursor-pointer"
          >
            <option value="">Choose Race</option>
            {RACES.map((race) => (
              <option key={race} value={race}>
                {RACE_LABELS[race]} ({race})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="dnd-label !text-left">Class</label>
          <select
            value={character.class || ""}
            onChange={(e) => onChange({ class: e.target.value as CharacterClass })}
            className="dnd-input-underlined w-full text-sm py-1 cursor-pointer"
          >
            <option value="">Choose Class</option>
            {CLASSES.map((cls) => (
              <option key={cls} value={cls}>
                {CLASS_LABELS[cls]} ({cls})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="dnd-label !text-left">Level</label>
          <input
            type="number"
            min="1"
            max="20"
            value={character.level || 1}
            onChange={(e) => onChange({ level: parseInt(e.target.value) || 1 })}
            className="dnd-input-underlined w-full text-sm py-1 font-serif"
          />
        </div>

        <div>
          <label className="dnd-label !text-left">Alignment</label>
          <select
            value={character.alignment || ""}
            onChange={(e) => onChange({ alignment: e.target.value as Alignment })}
            className="dnd-input-underlined w-full text-sm py-1 cursor-pointer"
          >
            <option value="">Set Alignment</option>
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
