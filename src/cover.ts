import type { IMemories } from "./memories";

export type CoverType = "jar" | "box" | "postcard";
export type StickerStyle = "hearts" | "stars" | "flowers" | "sparkles" | "none";

export interface ICoverSettings {
  type: CoverType;
  color: string;
  sticker: StickerStyle;
  imageUrl?: string;
}

export interface ISharedMemoryJar {
  memories: IMemories[];
  cover: ICoverSettings;
}

export const DEFAULT_COVER: ICoverSettings = {
  type: "jar",
  color: "#f472b6",
  sticker: "hearts",
};

export const COVER_OPTIONS: Array<{
  id: CoverType;
  title: string;
  description: string;
  icon: string;
}> = [
  {
    id: "jar",
    title: "Баночка",
    description: "Классический формат",
    icon: "🫙",
  },
  {
    id: "box",
    title: "Коробка",
    description: "Подарок с лентой",
    icon: "🎁",
  },
  {
    id: "postcard",
    title: "Открытка",
    description: "Личный тёплый привет",
    icon: "💌",
  },
];

export const COLOR_OPTIONS = [
  "#f472b6",
  "#a78bfa",
  "#60a5fa",
  "#34d399",
  "#fbbf24",
  "#fb7185",
  "#f97316",
  "#334155",
];

export const STICKER_OPTIONS: Array<{
  id: StickerStyle;
  title: string;
  stickers: string[];
}> = [
  { id: "hearts", title: "Сердечки", stickers: ["♥", "♡", "♥"] },
  { id: "stars", title: "Звёзды", stickers: ["★", "✦", "★"] },
  { id: "flowers", title: "Цветы", stickers: ["✿", "✽", "✿"] },
  { id: "sparkles", title: "Искры", stickers: ["✧", "✦", "✧"] },
  { id: "none", title: "Без стикеров", stickers: [] },
];

export const getStickerCharacters = (style: StickerStyle): string[] =>
  STICKER_OPTIONS.find((option) => option.id === style)?.stickers ?? [];

export const isCoverSettings = (value: unknown): value is ICoverSettings => {
  if (!value || typeof value !== "object") return false;
  const cover = value as Partial<ICoverSettings>;
  return (
    (cover.type === "jar" || cover.type === "box" || cover.type === "postcard") &&
    typeof cover.color === "string" &&
    (cover.sticker === "hearts" ||
      cover.sticker === "stars" ||
      cover.sticker === "flowers" ||
      cover.sticker === "sparkles" ||
      cover.sticker === "none")
  );
};

export const isSharedMemoryJar = (value: unknown): value is ISharedMemoryJar => {
  if (!value || typeof value !== "object") return false;
  const jar = value as Partial<ISharedMemoryJar>;
  return Array.isArray(jar.memories) && isCoverSettings(jar.cover);
};
