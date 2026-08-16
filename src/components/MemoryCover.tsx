import type { CSSProperties } from "react";
import { getStickerCharacters, type ICoverSettings } from "../cover";
import "./MemoryCover.css";

type MemoryCoverProps = {
  cover: ICoverSettings;
  count: number;
  interactive?: boolean;
};

const formatCount = (count: number) => {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return `${count} моментов`;
  if (lastDigit === 1) return `${count} момент`;
  if (lastDigit >= 2 && lastDigit <= 4) return `${count} момента`;
  return `${count} моментов`;
};

export const MemoryCover = ({
  cover,
  count,
  interactive = false,
}: MemoryCoverProps) => {
  const stickers = getStickerCharacters(cover.sticker);
  const hasImage = Boolean(cover.imageUrl);
  const style = {
    "--cover-color": cover.color,
    "--cover-image": cover.imageUrl ? `url("${cover.imageUrl}")` : "none",
  } as CSSProperties;

  return (
    <div
      className={`memory-cover memory-cover--${cover.type} ${
        interactive ? "memory-cover--interactive" : ""
      } ${hasImage ? "memory-cover--has-image" : ""}`}
      style={style}
      aria-label={`Обложка в формате «${cover.type}». Воспоминаний: ${count}`}
    >
      <div className="memory-cover__backdrop" aria-hidden="true" />
      <div className="memory-cover__light" aria-hidden="true" />

      {stickers.length > 0 && (
        <div className="memory-cover__stickers" aria-hidden="true">
          {[0, 1, 2].map((row) => (
            <div
              className={`memory-cover__sticker-row memory-cover__sticker-row--${row + 1}`}
              key={row}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <span key={index}>{stickers[(row + index) % stickers.length]}</span>
              ))}
            </div>
          ))}
        </div>
      )}

      {cover.type === "jar" && (
        <div className="cover-object cover-jar" aria-hidden="true">
          <div className="cover-jar__shadow" />
          <div className="cover-jar__lid">
            <span className="cover-jar__lid-line" />
            <span className="cover-jar__lid-line" />
            <span className="cover-jar__lid-line" />
          </div>
          <div className="cover-jar__neck" />
          <div className="cover-jar__glass">
            <div className="cover-jar__photo" />
            <div className="cover-jar__tint" />
            <span className="cover-jar__shine" />
            <span className="cover-jar__glow" />
            <div className="cover-jar__label">
              <span>moments</span>
              <strong>для нас</strong>
            </div>
            <span className="cover-jar__heart">♥</span>
            <span className="cover-jar__heart cover-jar__heart--small">♥</span>
          </div>
        </div>
      )}

      {cover.type === "box" && (
        <div className="cover-object cover-box" aria-hidden="true">
          <div className="cover-box__shadow" />
          <div className="cover-box__body">
            <div className="cover-box__photo" />
            <div className="cover-box__tint" />
            <div className="cover-box__ribbon cover-box__ribbon--vertical" />
            <div className="cover-box__ribbon cover-box__ribbon--horizontal" />
            <div className="cover-box__tag">
              <span>for you</span>
              <strong>♥</strong>
            </div>
          </div>
          <div className="cover-box__lid">
            <div className="cover-box__lid-ribbon" />
          </div>
          <div className="cover-box__bow">
            <span className="cover-box__bow-loop cover-box__bow-loop--left" />
            <span className="cover-box__bow-knot" />
            <span className="cover-box__bow-loop cover-box__bow-loop--right" />
            <span className="cover-box__bow-tail cover-box__bow-tail--left" />
            <span className="cover-box__bow-tail cover-box__bow-tail--right" />
          </div>
        </div>
      )}

      {cover.type === "postcard" && (
        <div className="cover-object cover-postcard" aria-hidden="true">
          <div className="cover-postcard__shadow" />
          <div className="cover-postcard__paper">
            <div className="cover-postcard__photo" />
            <div className="cover-postcard__stamp">♥</div>
            <span className="cover-postcard__line cover-postcard__line--1" />
            <span className="cover-postcard__line cover-postcard__line--2" />
            <span className="cover-postcard__line cover-postcard__line--3" />
            <span className="cover-postcard__signature">для тебя</span>
          </div>
        </div>
      )}

      <div className="memory-cover__footer">
        <span>{formatCount(count)}</span>
        {interactive && <span className="memory-cover__tap">нажми, чтобы открыть</span>}
      </div>
    </div>
  );
};
