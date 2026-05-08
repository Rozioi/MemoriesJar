import { useState } from "react";
import { uploadImage } from "../utils/upload";
import type { IMemories } from "../memories";

export const MemoryInput = ({
  m,
  onUpdate,
  onRemove,
}: {
  m: IMemories;
  onUpdate: (val: string, type: "text" | "image") => void;
  onRemove: () => void;
}) => {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      try {
        const url = await uploadImage(e.target.files[0]);
        onUpdate(url, "image");
      } catch (err) {
        alert("Не удалось загрузить фото");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-4 p-3 bg-pink-50 rounded-2xl border border-pink-100">
      <div className="flex gap-2">
        <input
          type="text"
          value={m.type === "text" ? m.content : "Фото загружено ✅"}
          disabled={m.type === "image"}
          onChange={(e) => onUpdate(e.target.value, "text")}
          placeholder="Текст воспоминания..."
          className="flex-1 px-4 py-2 rounded-xl outline-none font-cute text-sm"
        />
        <button onClick={onRemove} className="text-pink-300 px-2">
          ×
        </button>
      </div>

      <label className="text-[10px] text-pink-400 cursor-pointer hover:text-pink-600 transition flex items-center gap-1">
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />
        {loading ? "⌛ Загрузка..." : "📷 Прикрепить фото вместо текста"}
      </label>

      {m.type === "image" && (
        <img
          src={m.content}
          className="w-12 h-12 object-cover rounded-lg mt-1"
        />
      )}
    </div>
  );
};
