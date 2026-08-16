import { useRef, useState, type CSSProperties } from "react";
import {
  COLOR_OPTIONS,
  COVER_OPTIONS,
  STICKER_OPTIONS,
  type ICoverSettings,
} from "../cover";
import { uploadImage } from "../utils/upload";
import { MemoryCover } from "./MemoryCover";

type CoverCustomizerProps = {
  cover: ICoverSettings;
  onChange: (cover: ICoverSettings) => void;
};

export const CoverCustomizer = ({ cover, onChange }: CoverCustomizerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const changeCover = (patch: Partial<ICoverSettings>) => {
    onChange({ ...cover, ...patch });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      changeCover({ imageUrl });
    } catch {
      alert("Не удалось загрузить фото для обложки. Попробуй ещё раз.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const customizerStyle = {
    "--active-cover-color": cover.color,
  } as CSSProperties;

  return (
    <section
      className="cover-customizer"
      style={customizerStyle}
      aria-labelledby="cover-settings-title"
    >
      <div className="cover-customizer__heading">
        <div>
          <p className="cover-customizer__eyebrow">Сделай по-своему</p>
          <h3 id="cover-settings-title">Настрой обложку</h3>
        </div>
        <span className="cover-customizer__badge">5 шагов</span>
      </div>

      <div className="cover-control-group cover-title-control">
        <div className="cover-title-control__heading">
          <p className="cover-control-group__label">1. Название</p>
          <span>{(cover.title || "").length}/34</span>
        </div>
        <input
          type="text"
          value={cover.title || ""}
          onChange={(event) => changeCover({ title: event.target.value.slice(0, 34) })}
          placeholder="Например, «Наши счастливые дни»"
          maxLength={34}
          className="cover-title-control__input"
        />
        <p className="cover-title-control__hint">Оно появится на баночке, подарке или открытке.</p>
      </div>

      <div className="cover-editor-preview" aria-live="polite">
        <div className="cover-editor-preview__heading">
          <span>Предпросмотр</span>
          <small>так получатель увидит капсулу</small>
        </div>
        <MemoryCover cover={cover} count={3} />
      </div>

      <div className="cover-control-group">
        <p className="cover-control-group__label">2. Формат</p>
        <div className="cover-choice-grid">
          {COVER_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`cover-choice ${cover.type === option.id ? "cover-choice--active" : ""}`}
              onClick={() => changeCover({ type: option.id })}
              aria-pressed={cover.type === option.id}
            >
              <span className="cover-choice__icon">{option.icon}</span>
              <span className="cover-choice__text">
                <strong>{option.title}</strong>
                <small>{option.description}</small>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="cover-control-group">
        <p className="cover-control-group__label">3. Цвет</p>
        <div className="cover-colors" role="list" aria-label="Палитра обложки">
          {COLOR_OPTIONS.map((color) => (
            <button
              key={color}
              type="button"
              className={`cover-color ${cover.color === color ? "cover-color--active" : ""}`}
              style={{ backgroundColor: color }}
              onClick={() => changeCover({ color })}
              aria-label={`Выбрать цвет ${color}`}
              aria-pressed={cover.color === color}
            />
          ))}
          <label
            className={`cover-color cover-color--picker ${!COLOR_OPTIONS.includes(cover.color) ? "cover-color--active" : ""}`}
            title="Выбрать свой цвет"
          >
            <span>+</span>
            <input
              type="color"
              value={cover.color}
              onChange={(event) => changeCover({ color: event.target.value })}
              aria-label="Выбрать свой цвет"
            />
          </label>
        </div>
      </div>

      <div className="cover-control-group">
        <p className="cover-control-group__label">4. Диагональные стикеры</p>
        <div className="cover-sticker-options">
          {STICKER_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`sticker-choice ${cover.sticker === option.id ? "sticker-choice--active" : ""}`}
              onClick={() => changeCover({ sticker: option.id })}
              aria-pressed={cover.sticker === option.id}
            >
              <span className="sticker-choice__sample">
                {option.stickers.length ? option.stickers.join(" ") : "—"}
              </span>
              <span>{option.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="cover-control-group cover-photo-control">
        <div>
          <p className="cover-control-group__label">5. Фото для обложки</p>
          <p className="cover-photo-control__hint">
            Необязательно. Фото станет фоном и сохранится в ссылке.
          </p>
        </div>
        <div className="cover-photo-control__actions">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleImageUpload}
          />
          <button
            type="button"
            className="cover-upload-button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? "Загружаем…" : cover.imageUrl ? "Заменить фото" : "Загрузить фото"}
          </button>
          {cover.imageUrl && (
            <button
              type="button"
              className="cover-remove-photo"
              onClick={() => changeCover({ imageUrl: undefined })}
            >
              Убрать
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
