import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { DEFAULT_COVER, isSharedMemoryJar, type ICoverSettings } from "./cover";
import { BackgroundMusicInput } from "./components/BackgroundMusicInput";
import { CoverCustomizer } from "./components/CoverCustomizer";
import { MemoryCover } from "./components/MemoryCover";
import { MemoryInput } from "./components/MemoryInput";
import { SoundCloudPlayer } from "./components/SoundCloudPlayer";
import { type IMemories } from "./memories";
import { type IBackgroundTrack } from "./music";
import { decodeMemories, encodeMemories } from "./utils/share";
import "./App.css";

function App() {
  const [allMemories, setAllMemories] = useState<IMemories[]>([]);
  const [initialMemories, setInitialMemories] = useState<IMemories[]>([]);
  const [activeMemory, setActiveMemory] = useState<IMemories | null>(null);
  const [mode, setMode] = useState<"view" | "create">("view");
  const [isCreating, setIsCreating] = useState(false);
  const [newMemories, setNewMemories] = useState<IMemories[]>([
    { id: 1, type: "text", content: "", caption: "" },
  ]);
  const [cover, setCover] = useState<ICoverSettings>(DEFAULT_COVER);
  const [music, setMusic] = useState<IBackgroundTrack | undefined>();
  const [generatedLink, setGeneratedLink] = useState("");
  const [countMemories, setCountMemories] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get("data");
    if (!data) {
      setMode("create");
      return;
    }

    const decoded = decodeMemories(data);
    if (Array.isArray(decoded)) {
      setAllMemories(decoded as IMemories[]);
      setInitialMemories(decoded as IMemories[]);
      setCountMemories(decoded.length);
      setMode("view");
      return;
    }

    if (isSharedMemoryJar(decoded)) {
      setAllMemories(decoded.memories);
      setInitialMemories(decoded.memories);
      setCover(decoded.cover);
      setMusic(decoded.music);
      setCountMemories(decoded.memories.length);
      setMode("view");
      return;
    }

    setMode("create");
  }, []);

  const resetJar = () => {
    setAllMemories(initialMemories);
    setCountMemories(initialMemories.length);
    setActiveMemory(null);
  };

  const showNextMemory = () => {
    if (allMemories.length === 0) return;

    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.6 },
      colors: [cover.color, "#ffffff", "#fde68a"],
      shapes: ["circle"],
    });

    const memoryToDisplay = allMemories[0];
    setActiveMemory(memoryToDisplay);
    const updatedMemories = allMemories.slice(1);
    setAllMemories(updatedMemories);
    setCountMemories(updatedMemories.length);
  };

  const addField = () => {
    setNewMemories((previous) => [
      ...previous,
      { id: Date.now(), type: "text", content: "" },
    ]);
  };

  const updateField = (id: number | string, updatedData: Partial<IMemories>) => {
    setNewMemories((previous) =>
      previous.map((memory) =>
        memory.id === id ? { ...memory, ...updatedData } : memory,
      ),
    );
  };

  const removeField = (id: number | string) => {
    if (newMemories.length > 1) {
      setNewMemories((previous) => previous.filter((memory) => memory.id !== id));
    }
  };

  const handleGenerate = async () => {
    const filtered = newMemories.filter((memory) => memory.content.trim() !== "");
    if (filtered.length === 0) {
      alert("Добавь хотя бы одно воспоминание!");
      return;
    }

    const payload = { memories: filtered, cover, music };
    const link = `${window.location.origin}${window.location.pathname}?data=${encodeMemories(payload)}`;
    setGeneratedLink(link);

    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // Ссылка остаётся видимой в интерфейсе, если браузер запретил доступ к буферу.
    }
  };

  const isEmpty = mode === "view" && allMemories.length === 0 && !activeMemory;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-brand-pink to-brand-purple flex flex-col items-center justify-center p-4 relative overflow-hidden font-cute text-gray-800">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-center mb-8 drop-shadow-sm px-4"
      >
        {mode === "view" ? "Капсула наших " : "Создай свою капсулу "}
        <span className="text-pink-500 block sm:inline">счастливых моментов</span>
      </motion.h1>

      {allMemories.length > 0 && (
        <button
          type="button"
          className="relative cursor-pointer group flex flex-col items-center focus:outline-none focus-visible:ring-4 focus-visible:ring-white/70 rounded-[2rem]"
          onClick={showNextMemory}
          aria-label="Открыть следующее воспоминание"
        >
          <div className="absolute inset-0 bg-magic-gold opacity-20 blur-2xl group-hover:opacity-40 transition-opacity rounded-full" />
          <MemoryCover cover={cover} count={countMemories} interactive />
        </button>
      )}

      {isEmpty && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center bg-white/30 backdrop-blur-md p-8 rounded-[2.5rem] border-2 border-white shadow-xl text-center"
        >
          <MemoryCover cover={cover} count={initialMemories.length} />
          <h2 className="text-2xl font-bold text-pink-600 mt-6 mb-2">Все моменты открыты!</h2>
          <p className="text-gray-600 mb-6 px-4">
            Воспоминания закончились, но чувства остаются навсегда.
          </p>
          <button
            onClick={resetJar}
            className="px-8 py-3 bg-pink-500 text-white font-bold rounded-full shadow-lg hover:bg-pink-600 transition-colors active:scale-95"
          >
            Посмотреть ещё раз
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {activeMemory && (
          <motion.div
          onClick={() => showNextMemory()}
            key={activeMemory.id}
            initial={{ opacity: 0, scale: 0, y: 50, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -100, rotate: 15 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="absolute top-[20%] md:top-[15%] max-w-sm w-[calc(100%-2rem)] bg-white p-6 rounded-[2.5rem] shadow-2xl border-4 border-magic-gold z-20 flex flex-col items-center"
          >
            {activeMemory.type === "image" ? (
              <div className="w-full bg-white p-3 pb-8 shadow-sm rotate-1 border border-gray-100 flex flex-col items-center">
                <div className="w-full aspect-square overflow-hidden bg-gray-50 border border-gray-100 rounded-sm">
                  <img
                    src={activeMemory.content}
                    alt={activeMemory.caption || "Воспоминание"}
                    className="w-full h-full object-cover"
                  />
                </div>
                {activeMemory.caption && (
                  <div className="mt-4 font-cute text-gray-600 text-base italic text-center px-2">
                    {activeMemory.caption}
                  </div>
                )}
              </div>
            ) : (
              <div
                className="w-full min-h-48 rounded-[1.6rem] border-2 p-7 shadow-sm flex items-center justify-center"
                style={{
                  backgroundColor: activeMemory.cardColor || "#ffffff",
                  borderColor: cover.color,
                  boxShadow: `0 12px 28px ${cover.color}24`,
                }}
              >
                <p className="text-xl text-gray-800 text-center font-bold italic font-cute leading-relaxed">
                  “ {activeMemory.content} ”
                </p>
              </div>
            )}
            <button
              onClick={(event) => {
                event.stopPropagation();
                setActiveMemory(null);
              }}
              className="mt-4 text-sm text-gray-400 hover:text-pink-500 transition font-cute underline"
            >
              Закрыть
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {mode === "view" && <SoundCloudPlayer track={music} color={cover.color} />}

      {mode === "view" && (
        <button
          onClick={() => {
            window.location.href = window.location.pathname;
          }}
          className="mt-8 text-pink-500 hover:text-pink-700 transition text-sm underline relative z-20"
        >
          Создать свою капсулу
        </button>
      )}

      {mode === "create" && !isCreating && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setIsCreating(true)}
          className="mt-5 px-8 py-3 bg-white text-pink-500 font-bold rounded-full shadow-lg hover:shadow-pink-200 transition"
        >
          Настроить и наполнить
        </motion.button>
      )}

      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-purple/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-md p-6 md:p-8 rounded-[2rem] shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-pink-500 text-2xl leading-none"
                aria-label="Закрыть"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-1 pr-8">Твоя капсула</h2>
              <p className="text-sm text-gray-500 mb-5">Сначала оформи её, потом добавь тёплые моменты.</p>

              <CoverCustomizer cover={cover} onChange={setCover} />

              <div className="mb-5">
                <BackgroundMusicInput track={music} onChange={setMusic} />
              </div>

              <div className="mb-6">
                <p className="text-sm font-bold text-pink-700 mb-3">Воспоминания</p>
                {newMemories.map((memory) => (
                  <MemoryInput
                    key={memory.id}
                    m={memory}
                    onUpdate={(updatedData) => updateField(memory.id, updatedData)}
                    onRemove={() => removeField(memory.id)}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={addField}
                className="w-full py-2 border-2 border-dashed border-pink-100 rounded-xl text-pink-400 hover:border-pink-300 hover:text-pink-500 transition mb-5"
              >
                + Ещё момент
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                className="w-full py-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition"
              >
                {generatedLink ? "Ссылка обновлена и скопирована" : "Получить ссылку"}
              </button>
              {generatedLink && (
                <div className="mt-4 rounded-xl bg-pink-50 p-3 text-center">
                  <p className="text-xs text-pink-700 font-bold">Готово — ссылка скопирована.</p>
                  <p className="mt-1 text-[10px] text-gray-500 break-all">Отправь её тому, для кого сделана капсула.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="absolute bottom-4 text-[10px] text-gray-400">Сделано с любовью</p>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, index) => (
          <motion.span
            key={index}
            initial={{ y: "110vh", x: `${Math.random() * 100}vw`, opacity: 0 }}
            animate={{ y: "-10vh", opacity: [0, 0.3, 0], rotate: 360 }}
            transition={{ duration: 10 + Math.random() * 15, repeat: Infinity, delay: index * 2 }}
            className="absolute text-white/20 text-3xl"
          >
            ♥
          </motion.span>
        ))}
      </div>
    </div>
  );
}

export default App;
