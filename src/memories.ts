export interface IMemories {
  id: number;
  type: "text" | "image";
  content: string;
  caption?: string;
  cardColor?: string;
}

export const TEXT_CARD_COLORS = [
  { value: "#ffffff", label: "Белая" },
  { value: "#fff7ed", label: "Персиковая" },
  { value: "#fef3c7", label: "Солнечная" },
  { value: "#ecfdf5", label: "Мятная" },
  { value: "#eff6ff", label: "Голубая" },
  { value: "#f5f3ff", label: "Лавандовая" },
  { value: "#fdf2f8", label: "Розовая" },
  { value: "#f3f4f6", label: "Серая" },
];
export const memories: IMemories[] = [
  { id: 1, type: "text", content: "Твоя улыбка в тот день..." },
  { id: 2, type: "text", content: "Тот самый смешной мем про кто пошел" },
  {
    id: 3,
    type: "image",
    content: "https://i.ibb.co/jPyXYjq9/photo-2026-05-08-23-40-48.jpg",
  }, // Ссылка на фото
  { id: 4, type: "text", content: "Как мне ногу в тралике защемило)" },
  // Добавь еще штук 10-15
];
