export interface IBackgroundTrack {
  url: string;
  title?: string;
  artworkUrl?: string;
}

export const isSoundCloudUrl = (value: string): boolean => {
  try {
    const url = new URL(value.trim());
    const hostname = url.hostname.toLowerCase();
    return (
      url.protocol === "https:" &&
      (hostname === "soundcloud.com" ||
        hostname.endsWith(".soundcloud.com") ||
        hostname === "on.soundcloud.com")
    );
  } catch {
    return false;
  }
};

export const isBackgroundTrack = (value: unknown): value is IBackgroundTrack => {
  if (!value || typeof value !== "object") return false;
  const track = value as Partial<IBackgroundTrack>;
  return typeof track.url === "string" && isSoundCloudUrl(track.url);
};
