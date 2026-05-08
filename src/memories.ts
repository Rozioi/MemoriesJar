export interface IMemories {
  id: number;
  type: "text" | "image";
  content: string;
}
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
