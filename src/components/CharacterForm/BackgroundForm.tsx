import React from "react";

interface BackgroundFormProps {
  background: string;
  onChange: (background: string) => void;
}

export function BackgroundForm({ background, onChange }: BackgroundFormProps) {
  return (
    <div className="space-y-2 rounded-lg border border-slate-700 bg-slate-800/40 p-4">
      <h3 className="text-sm font-semibold text-amber-300">背景故事</h3>
      <textarea
        value={background}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none resize-y"
        placeholder="輸入角色的背景故事、經歷、動機等..."
      />
    </div>
  );
}
