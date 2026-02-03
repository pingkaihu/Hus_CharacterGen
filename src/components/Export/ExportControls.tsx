import React from "react";
import type { Character } from "../../types/character";

interface ExportControlsProps {
  character: Partial<Character>;
}

export function ExportControls({ character }: ExportControlsProps) {
  const handleExportJSON = () => {
    if (!character.name) {
      alert("請先填寫角色姓名");
      return;
    }

    const dataStr = JSON.stringify(character, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${character.name || "character"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (!character.name) {
      alert("請先填寫角色姓名");
      return;
    }
    window.print();
  };

  return (
    <div className="mt-4 flex flex-col sm:flex-row flex-wrap gap-2 no-print">
      <button
        onClick={handleExportJSON}
        className="w-full sm:w-auto rounded border border-amber-600 bg-amber-900/40 px-4 py-2 text-sm font-semibold text-amber-200 hover:bg-amber-900/60 focus:outline-none transition-colors"
      >
        匯出 JSON
      </button>
      <button
        onClick={handlePrint}
        className="w-full sm:w-auto rounded border border-amber-600 bg-amber-900/40 px-4 py-2 text-sm font-semibold text-amber-200 hover:bg-amber-900/60 focus:outline-none transition-colors"
      >
        列印角色卡
      </button>
    </div>
  );
}
