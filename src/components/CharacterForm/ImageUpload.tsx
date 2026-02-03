import React, { useRef } from "react";

interface ImageUploadProps {
  imageUrl?: string;
  onChange: (imageUrl: string | undefined) => void;
}

export function ImageUpload({ imageUrl, onChange }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 檢查是否為圖片
      if (!file.type.startsWith("image/")) {
        alert("請選擇圖片檔案");
        return;
      }

      // 使用 URL.createObjectURL 建立本機預覽 URL
      const url = URL.createObjectURL(file);
      onChange(url);
    }
  };

  const handleRemove = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2 rounded-lg border border-slate-700 bg-slate-800/40 p-4">
      <h3 className="text-sm font-semibold text-amber-300">角色圖像</h3>

      {imageUrl ? (
        <div className="space-y-2">
          <div className="relative">
            <img
              src={imageUrl}
              alt="角色預覽"
              className="max-h-48 w-full rounded border border-slate-600 object-contain"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="w-full rounded border border-red-600 bg-red-900/30 px-3 py-2 text-xs text-red-300 hover:bg-red-900/50 focus:outline-none transition-colors"
          >
            移除圖片
          </button>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="flex cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-slate-600 bg-slate-800/60 p-6 text-center hover:border-amber-500 hover:bg-slate-800/80 transition-colors"
          >
            <span className="text-sm text-slate-400">
              點擊或拖放圖片到此處
            </span>
            <span className="mt-1 text-xs text-slate-500">
              支援 JPG、PNG、GIF 等格式
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
