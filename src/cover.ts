import type { IMemories } from "./memories";

export type CoverType = "jar" | "box" | "postcard";
export type StickerStyle = string;

export interface ICoverSettings {
  type: CoverType;
  color: string;
  sticker: StickerStyle;
  title?: string;
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
  title: "",
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
  "#f6b5c7",
  "#2f2622",
  "#a57d85",
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
{ id: "pink-hearts", title: "Розовые сердечки", stickers: ["💗", "💖", "💗"] },
{ id: "love", title: "Любовь", stickers: ["💘", "💞", "💝"] },
{ id: "kisses", title: "Поцелуи", stickers: ["💋", "♡", "💋"] },
{ id: "bows", title: "Бантики", stickers: ["🎀", "୨୧", "🎀"] },
{ id: "cute", title: "Милота", stickers: ["૮", "◡", "ა"] },
{ id: "teddy", title: "Мишки", stickers: ["🧸", "♡", "🧸"] },
{ id: "bunnies", title: "Кролики", stickers: ["🐰", "♡", "🐇"] },
{ id: "cats", title: "Котики", stickers: ["🐱", "ฅ", "🐈"] },
{ id: "paws", title: "Лапки", stickers: ["🐾", "♡", "🐾"] },
{ id: "stars", title: "Звёзды", stickers: ["★", "✦", "★"] },
{ id: "sparkles", title: "Искры", stickers: ["✧", "✦", "✧"] },
{ id: "moon", title: "Луна", stickers: ["☾", "✦", "☽"] },
{ id: "space", title: "Космос", stickers: ["🌙", "⭐", "🪐"] },
{ id: "galaxy", title: "Галактика", stickers: ["🌌", "✦", "🪐"] },
{ id: "magic", title: "Магия", stickers: ["✨", "🔮", "✨"] },
{ id: "fairy", title: "Феи", stickers: ["🧚", "✨", "🧚"] },
{ id: "clouds", title: "Облачка", stickers: ["☁️", "☁︎", "☁️"] },
{ id: "rainbow", title: "Радуга", stickers: ["🌈", "✨", "🌈"] },
{ id: "computer", title: "Компьютеры", stickers: ["🖥️", "⌨️", "🖥️"] },
{ id: "laptop", title: "Ноутбуки", stickers: ["💻", "⌨️", "💻"] },
{ id: "phone", title: "Телефоны", stickers: ["📱", "♡", "📱"] },
{ id: "tablet", title: "Планшеты", stickers: ["📱", "✦", "📱"] },
{ id: "keyboard", title: "Клавиатура", stickers: ["⌨️", "⌨", "⌨️"] },
{ id: "mouse", title: "Мышки", stickers: ["🖱️", "✦", "🖱️"] },
{ id: "code", title: "Код", stickers: ["</>", "{ }", "</>"] },
{ id: "terminal", title: "Терминал", stickers: [">_", "⌁", ">_"] },
{ id: "github", title: "GitHub", stickers: ["◉", "⌘", "◉"] },
{ id: "wifi", title: "Интернет", stickers: ["📶", "🌐", "📶"] },
{ id: "cloud-tech", title: "Облако", stickers: ["☁️", "</>", "☁️"] },
{ id: "robot", title: "Роботы", stickers: ["🤖", "⚙️", "🤖"] },
{ id: "settings", title: "Техника", stickers: ["⚙️", "🔧", "⚙️"] },
{ id: "flowers", title: "Цветы", stickers: ["✿", "✽", "✿"] },
{ id: "daisies", title: "Ромашки", stickers: ["🌼", "✿", "🌼"] },
{ id: "roses", title: "Розы", stickers: ["🌹", "♡", "🌹"] },
{ id: "sunflowers", title: "Подсолнухи", stickers: ["🌻", "☀", "🌻"] },
{ id: "leaves", title: "Листья", stickers: ["🍃", "❧", "🍃"] },
{ id: "mushrooms", title: "Грибочки", stickers: ["🍄", "🌿", "🍄"] },
{ id: "cherries", title: "Вишенки", stickers: ["🍒", "♡", "🍒"] },
{ id: "strawberries", title: "Клубника", stickers: ["🍓", "♡", "🍓"] },
{ id: "butterflies", title: "Бабочки", stickers: ["🦋", "✿", "🦋"] },
{ id: "bees", title: "Пчёлки", stickers: ["🐝", "🌼", "🐝"] },
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
    (cover.title === undefined || typeof cover.title === "string") &&
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
