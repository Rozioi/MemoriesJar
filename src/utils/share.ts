import LZString from "lz-string";

export const encodeMemories = (payload: unknown): string => {
  const jsonString = JSON.stringify(payload);
  return LZString.compressToEncodedURIComponent(jsonString);
};

export const decodeMemories = (encodedString: string): unknown => {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(encodedString);
    if (!decompressed) return null;
    return JSON.parse(decompressed);
  } catch (error) {
    console.error("Ошибка декодирования:", error);
    return null;
  }
};
