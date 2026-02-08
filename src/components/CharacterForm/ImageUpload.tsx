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
    <div className="space-y-2 border border-black/30 bg-[#fdfaf2] p-4 rounded">
      <h3 className="text-sm font-bold text-gray-800 border-b border-black/20 pb-1">角色圖像</h3>

      {imageUrl ? (
        <div className="space-y-2">
          <div className="relative">
            <img
              src={imageUrl}
              alt="角色預覽"
              className="max-h-48 w-full rounded border border-black/30 object-contain bg-white"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="w-full rounded border border-amber-700/50 bg-amber-100/80 px-3 py-2 text-xs text-amber-900 hover:bg-amber-200/80 focus:outline-none transition-colors"
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
            className="flex cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-black/30 bg-white/60 p-6 text-center hover:border-red-800 hover:bg-white/80 transition-colors"
          >
            <span className="text-sm text-gray-600">
              點擊或拖放圖片到此處
            </span>
            <span className="mt-1 text-xs text-gray-400">
              支援 JPG、PNG、GIF 等格式
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
