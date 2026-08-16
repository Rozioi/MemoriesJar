import { useState } from "react";
import { isSoundCloudUrl, type IBackgroundTrack } from "../music";

type BackgroundMusicInputProps = {
  track?: IBackgroundTrack;
  onChange: (track?: IBackgroundTrack) => void;
};

export const BackgroundMusicInput = ({ track, onChange }: BackgroundMusicInputProps) => {
  const [url, setUrl] = useState(track?.url || "");
  const [title, setTitle] = useState(track?.title || "");
  const [wasTouched, setWasTouched] = useState(false);

  const updateTrack = (nextUrl: string, nextTitle: string) => {
    setUrl(nextUrl);
    setTitle(nextTitle);
    const trimmedUrl = nextUrl.trim();

    if (!trimmedUrl) {
      onChange(undefined);
      return;
    }

    if (isSoundCloudUrl(trimmedUrl)) {
      onChange({ url: trimmedUrl, title: nextTitle.trim() || undefined });
    } else {
      onChange(undefined);
    }
  };

  const isInvalid = wasTouched && Boolean(url.trim()) && !isSoundCloudUrl(url);

  return (
    <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-pink-50 p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-500 text-lg text-white shadow-sm">♪</span>
        <div>
          <p className="text-sm font-bold text-violet-900">Музыка для этой капсулы</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-violet-700">Необязательно. Получатель увидит кнопку и сам включит трек.</p>
        </div>
      </div>

      <div className="mt-3 grid gap-2">
        <input
          type="url"
          value={url}
          onChange={(event) => updateTrack(event.target.value, title)}
          onBlur={() => setWasTouched(true)}
          placeholder="Ссылка на трек SoundCloud"
          className={`w-full rounded-xl border bg-white px-3 py-2 text-xs text-gray-700 outline-none transition ${
            isInvalid ? "border-rose-300 focus:border-rose-400" : "border-violet-100 focus:border-violet-400"
          }`}
        />
        {isInvalid && <p className="text-[10px] text-rose-500">Вставь публичную ссылку с soundcloud.com или on.soundcloud.com.</p>}
        <input
          type="text"
          value={title}
          onChange={(event) => updateTrack(url, event.target.value.slice(0, 48))}
          placeholder="Название трека (необязательно)"
          maxLength={48}
          className="w-full rounded-xl border border-violet-100 bg-white px-3 py-2 text-xs text-gray-700 outline-none transition focus:border-violet-400"
        />
      </div>

      {url && !isInvalid && (
        <button
          type="button"
          onClick={() => updateTrack("", "")}
          className="mt-2 text-[10px] font-bold text-violet-500 underline decoration-violet-200 underline-offset-2 hover:text-violet-700"
        >
          Убрать музыку
        </button>
      )}
    </section>
  );
};
