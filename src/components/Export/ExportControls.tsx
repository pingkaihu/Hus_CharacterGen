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
    <div className="flex flex-col gap-3 no-print">
      <button
        onClick={handleExportJSON}
        className="w-full flex items-center justify-center gap-2 border-2 border-black bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
      >
        <span>Export JSON</span>
      </button>
      <button
        onClick={handlePrint}
        className="w-full flex items-center justify-center gap-2 border-2 border-black bg-red-800 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-red-900 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
      >
        <span>Print Sheet</span>
      </button>
    </div>
  );
}
