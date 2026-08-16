import type { CSSProperties } from "react";
import { getStickerCharacters, type ICoverSettings } from "../cover";
import "./MemoryCover.css";

type MemoryCoverProps = {
  cover: ICoverSettings;
  count: number;
  interactive?: boolean;
};

export const MemoryCover = ({
  cover,
  count,
  interactive = false,
}: MemoryCoverProps) => {
  const stickers = getStickerCharacters(cover.sticker);
  const style = {
    "--cover-color": cover.color,
    "--cover-image": cover.imageUrl ? `url("${cover.imageUrl}")` : "none",
  } as CSSProperties;

  return (
    <div
      className={`memory-cover memory-cover--${cover.type} ${interactive ? "memory-cover--interactive" : ""}`}
      style={style}
      aria-label={`Обложка: ${cover.type}. Воспоминаний: ${count}`}
    >
      <div className="memory-cover__image" aria-hidden="true" />
      {stickers.length > 0 && (
        <div className="memory-cover__stickers" aria-hidden="true">
          {[0, 1, 2].map((row) => (
            <div className={`memory-cover__sticker-row memory-cover__sticker-row--${row + 1}`} key={row}>
              {Array.from({ length: 6 }).map((_, index) => (
                <span key={index}>{stickers[(row + index) % stickers.length]}</span>
              ))}
            </div>
          ))}
        </div>
      )}

      {cover.type === "jar" && (
        <div className="cover-object cover-jar" aria-hidden="true">
          <div className="cover-jar__lid" />
          <div className="cover-jar__neck" />
          <div className="cover-jar__glass">
            <span className="cover-jar__shine" />
            <span className="cover-jar__heart">♥</span>
            <span className="cover-jar__heart cover-jar__heart--small">♥</span>
          </div>
        </div>
      )}

      {cover.type === "box" && (
        <div className="cover-object cover-box" aria-hidden="true">
          <div className="cover-box__lid" />
          <div className="cover-box__ribbon cover-box__ribbon--vertical" />
          <div className="cover-box__ribbon cover-box__ribbon--horizontal" />
          <div className="cover-box__bow">⌁</div>
        </div>
      )}

      {cover.type === "postcard" && (
        <div className="cover-object cover-postcard" aria-hidden="true">
          <div className="cover-postcard__paper">
            <span className="cover-postcard__stamp">♥</span>
            <span className="cover-postcard__line cover-postcard__line--1" />
            <span className="cover-postcard__line cover-postcard__line--2" />
            <span className="cover-postcard__line cover-postcard__line--3" />
            <span className="cover-postcard__signature">для тебя</span>
          </div>
        </div>
      )}

      <div className="memory-cover__footer">
        <span>{count === 1 ? "1 момент" : `${count} моментов`}</span>
        {interactive && <span className="memory-cover__tap">нажми, чтобы открыть</span>}
      </div>
    </div>
  );
};
