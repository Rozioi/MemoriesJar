import LZString from "lz-string";
import type { IMemories } from "../memories";

// Функция для превращения массива воспоминаний в короткую строку для URL
export const encodeMemories = (memoriesArray: IMemories[]) => {
  const jsonString = JSON.stringify(memoriesArray);
  return LZString.compressToEncodedURIComponent(jsonString);
};

// Функция для превращения строки из URL обратно в массив
export const decodeMemories = (encodedString: string) => {
  try {
    const decompressed =
      LZString.decompressFromEncodedURIComponent(encodedString);
    return JSON.parse(decompressed);
  } catch (e) {
    console.error("Ошибка декодирования:", e);
    return null;
  }
};
