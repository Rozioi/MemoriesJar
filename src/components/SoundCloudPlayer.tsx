import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { IBackgroundTrack } from "../music";
import "./SoundCloudPlayer.css";

type SoundCloudWidget = {
  bind: (event: string, listener: () => void) => void;
  toggle: () => void;
  setVolume: (volume: number) => void;
};

type SoundCloudApi = {
  Widget: ((iframe: HTMLIFrameElement) => SoundCloudWidget) & {
    Events: {
      READY: string;
      PLAY: string;
      PAUSE: string;
      FINISH: string;
    };
  };
};

declare global {
  interface Window {
    SC?: SoundCloudApi;
  }
}

type SoundCloudPlayerProps = {
  track?: IBackgroundTrack;
  color: string;
};

const WIDGET_SCRIPT_ID = "soundcloud-widget-api";

export const SoundCloudPlayer = ({ track, color }: SoundCloudPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const widgetRef = useRef<SoundCloudWidget | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!track) return;

    setIsReady(false);
    setIsPlaying(false);
    widgetRef.current = null;

    const initialiseWidget = () => {
      if (!iframeRef.current || !window.SC?.Widget) return;
      const widget = window.SC.Widget(iframeRef.current);
      widgetRef.current = widget;
      widget.bind(window.SC.Widget.Events.READY, () => {
        widget.setVolume(62);
        setIsReady(true);
      });
      widget.bind(window.SC.Widget.Events.PLAY, () => setIsPlaying(true));
      widget.bind(window.SC.Widget.Events.PAUSE, () => setIsPlaying(false));
      widget.bind(window.SC.Widget.Events.FINISH, () => setIsPlaying(false));
    };

    const existingScript = document.getElementById(WIDGET_SCRIPT_ID) as HTMLScriptElement | null;
    if (window.SC?.Widget) {
      initialiseWidget();
    } else if (existingScript) {
      existingScript.addEventListener("load", initialiseWidget, { once: true });
    } else {
      const script = document.createElement("script");
      script.id = WIDGET_SCRIPT_ID;
      script.src = "https://w.soundcloud.com/player/api.js";
      script.async = true;
      script.addEventListener("load", initialiseWidget, { once: true });
      document.body.appendChild(script);
    }

    return () => {
      widgetRef.current = null;
    };
  }, [track?.url]);

  if (!track) return null;

  const playerUrl = new URL("https://w.soundcloud.com/player/");
  playerUrl.searchParams.set("url", track.url);
  playerUrl.searchParams.set("auto_play", "false");
  playerUrl.searchParams.set("show_artwork", "false");
  playerUrl.searchParams.set("show_comments", "false");
  playerUrl.searchParams.set("show_playcount", "false");
  playerUrl.searchParams.set("show_user", "false");
  playerUrl.searchParams.set("sharing", "false");
  playerUrl.searchParams.set("buying", "false");
  playerUrl.searchParams.set("download", "false");
  playerUrl.searchParams.set("color", color.replace("#", ""));

  const playerStyle = {
    "--track-color": color,
  } as CSSProperties;

  const togglePlayback = () => {
    if (!isReady || !widgetRef.current) return;
    widgetRef.current.toggle();
  };

  return (
    <div className="soundcloud-corner" style={playerStyle}>
      <iframe
        ref={iframeRef}
        className="soundcloud-corner__iframe"
        src={playerUrl.toString()}
        allow="autoplay"
        title="Фоновая музыка из SoundCloud"
      />
      <div className="soundcloud-corner__card">
        <span className={`soundcloud-corner__note ${isPlaying ? "soundcloud-corner__note--playing" : ""}`} aria-hidden="true">
          ♪
        </span>
        <div className="soundcloud-corner__copy">
          <span>Музыка для этой капсулы</span>
          <strong>{track.title?.trim() || "Трек из SoundCloud"}</strong>
        </div>
        <button
          type="button"
          onClick={togglePlayback}
          disabled={!isReady}
          className="soundcloud-corner__button"
          aria-label={isPlaying ? "Поставить музыку на паузу" : "Включить музыку"}
        >
          {isPlaying ? "Ⅱ" : "▶"}
          <span>{isReady ? (isPlaying ? "Пауза" : "Включить") : "Загрузка"}</span>
        </button>
      </div>
    </div>
  );
};
