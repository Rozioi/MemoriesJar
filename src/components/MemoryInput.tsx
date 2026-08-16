import { useState } from "react";
import { uploadImage } from "../utils/upload";
import { TEXT_CARD_COLORS, type IMemories } from "../memories";

export const MemoryInput = ({
  m,
  onUpdate,
  onRemove,
}: {
  m: IMemories;
  onUpdate: (data: Partial<IMemories>) => void;
  onRemove: () => void;
}) => {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      try {
        const url = await uploadImage(e.target.files[0]);
        // Меняем тип на image и сохраняем ссылку в content
        onUpdate({ content: url, type: "image" });
      } catch (err) {
        alert("Не удалось загрузить фото");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-4 p-3 bg-pink-50 rounded-2xl border border-pink-100">
      {/* Если это обычный текст */}
      {m.type === "text" ? (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={m.content}
              onChange={(e) => onUpdate({ content: e.target.value, type: "text" })}
              placeholder="Текст воспоминания..."
              className="flex-1 px-4 py-2 rounded-xl outline-none font-cute text-sm"
            />
            <button onClick={onRemove} className="text-pink-300 px-2 hover:text-pink-500">
              ×
            </button>
          </div>
          <div className="flex items-center justify-between gap-3 px-1">
            <span className="text-[10px] font-bold text-pink-400">Цвет карточки</span>
            <div className="flex flex-wrap justify-end gap-1.5" aria-label="Цвет карточки воспоминания">
              {TEXT_CARD_COLORS.map((color) => {
                const isSelected = (m.cardColor || "#ffffff") === color.value;
                return (
                  <button
                    key={color.value}
                    type="button"
                    title={color.label}
                    aria-label={`Выбрать ${color.label} цвет карточки`}
                    aria-pressed={isSelected}
                    onClick={() => onUpdate({ cardColor: color.value })}
                    className={`h-5 w-5 rounded-full border-2 border-white transition ${
                      isSelected
                        ? "scale-110 ring-2 ring-pink-400 ring-offset-1"
                        : "shadow-sm hover:scale-110"
                    }`}
                    style={{ backgroundColor: color.value }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Если это загруженное фото */
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={m.content}
                alt="Превью"
                className="w-12 h-12 object-cover rounded-lg border border-pink-200"
              />
              <span className="text-xs text-pink-500 font-bold">Фото загружено ✅</span>
            </div>
            <button onClick={onRemove} className="text-pink-300 px-2 hover:text-pink-500">
              ×
            </button>
          </div>

          {/* ПОЛЕ ВВОДА ПОДПИСИ */}
          <input
            type="text"
            value={m.caption || ""}
            onChange={(e) => onUpdate({ caption: e.target.value })}
            placeholder="Подпись к фото (необязательно)..."
            className="w-full px-4 py-2 rounded-xl outline-none font-cute text-sm bg-white/80 border border-pink-100 focus:border-pink-300"
          />
        </div>
      )}

      {/* Кнопка загрузки для переключения в режим фото */}
      {m.type === "text" && (
        <label className="text-[10px] text-pink-400 cursor-pointer hover:text-pink-600 transition flex items-center gap-1 self-start">
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
          {loading ? "⌛ Загрузка..." : "📷 Прикрепить фото вместо текста"}
        </label>
      )}
    </div>
  );
};