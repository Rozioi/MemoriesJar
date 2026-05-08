import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

import { motion, AnimatePresence } from "framer-motion";
import { decodeMemories, encodeMemories } from "./utils/share";
import { memories as defaultMemories, type IMemories } from "./memories";
import { MemoryInput } from "./components/MemoryInput";

import "./App.css";

function App() {
  const [allMemories, setAllMemories] = useState<IMemories[]>([]);
  const [activeMemory, setActiveMemory] = useState<IMemories | null>(null);
  const [mode, setMode] = useState<"view" | "create">("view");

  const [isCreating, setIsCreating] = useState(false);
  const [newMemories, setNewMemories] = useState<IMemories[]>([
    { id: 1, type: "text", content: "" },
  ]);
  const [generatedLink, setGeneratedLink] = useState("");
  const [countMemories, setCountMemories] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get("data");

    if (data) {
      const decoded = decodeMemories(data);
      if (decoded && Array.isArray(decoded)) {
        setAllMemories(decoded);
        console.log(decoded);
        setCountMemories(decoded.length);
        setMode("view");
        return;
      }
    }
    setAllMemories(defaultMemories);
    console.log(defaultMemories);

    setCountMemories(defaultMemories.length);
    setMode("create");
  }, []);

  // const showRandomMemory = () => {
  //   if (allMemories.length === 0) return;
  //   let nextMemory: IMemories;
  //   do {
  //     nextMemory = allMemories[Math.floor(Math.random() * allMemories.length)];
  //   } while (nextMemory === activeMemory && allMemories.length > 1);
  //   setActiveMemory(nextMemory);
  // };

  const showNextMemory = () => {
    if (allMemories.length === 0) return;

    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ff69b4", "#ff1493", "#ffffff"],
      shapes: ["circle"],
    });

    const memoryToDisplay = allMemories[0];
    setActiveMemory(memoryToDisplay);
    const updatedMemories = allMemories.slice(1);
    setAllMemories(updatedMemories);
    setCountMemories(updatedMemories.length);
  };
  // const showNextMemory = () => {
  //   if (allMemories.length === 0) return;

  //   // Берем самое первое воспоминание из списка
  //   const memoryToDisplay = allMemories[0];

  //   // Устанавливаем его как активное
  //   setActiveMemory(memoryToDisplay);

  //   // Удаляем это воспоминание из общего списка
  //   const updatedMemories = allMemories.slice(1);
  //   setAllMemories(updatedMemories);

  //   // Обновляем счетчик
  //   setCountMemories(updatedMemories.length);
  // };
  const addField = () =>
    setNewMemories([
      ...newMemories,
      { id: Date.now(), type: "text", content: "" },
    ]);
  const updateField = (
    id: number | string,
    content: string,
    type: "text" | "image",
  ) => {
    setNewMemories(
      newMemories.map((m) => (m.id === id ? { ...m, content, type } : m)),
    );
  };

  const removeField = (id: number | string) => {
    if (newMemories.length > 1)
      setNewMemories(newMemories.filter((m) => m.id !== id));
  };

  const handleGenerate = () => {
    const filtered = newMemories.filter((m) => m.content.trim() !== "");
    if (filtered.length === 0)
      return alert("Добавь хотя бы одно воспоминание!");

    const link = `${window.location.origin}${window.location.pathname}?data=${encodeMemories(filtered)}`;
    setGeneratedLink(link);
    navigator.clipboard.writeText(link);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-brand-pink to-brand-purple flex flex-col items-center justify-center p-4 relative overflow-hidden font-cute text-gray-800">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-center mb-12 drop-shadow-sm px-4"
      >
        {mode === "view" ? "Баночка наших " : "Создай свою баночку "}
        <span className="text-pink-500 block sm:inline">
          счастливых моментов ✨
        </span>
      </motion.h1>

      <div
        className="relative cursor-pointer group flex flex-col items-center"
        onClick={showNextMemory}
      >
        <div className="absolute inset-0 bg-magic-gold opacity-20 blur-2xl group-hover:opacity-40 transition-opacity rounded-full"></div>

        <motion.div
          whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
          whileTap={{ scale: 0.95 }}
          className="relative text-9xl md:text-[12rem] select-none z-10"
        >
          🫙
          {Array.from({ length: Math.min(countMemories, 10) }).map(
            (_, index) => (
              <motion.span
                key={index}
                animate={{
                  y: [0, -15, 0],
                  x: [0, index % 2 === 0 ? 10 : -10, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2 + index * 0.2,
                  delay: index * 0.1,
                }}
                className="absolute text-xl text-yellow-300"
                style={{
                  top: `${40 + ((index * 5) % 30)}%`,
                  left: `${35 + ((index * 7) % 30)}%`,
                }}
              >
                ✨
              </motion.span>
            ),
          )}
        </motion.div>

        <AnimatePresence>
          {countMemories > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="mt-4 px-4 py-1 bg-white/50 backdrop-blur-sm border border-white/20 rounded-full shadow-sm"
            >
              <span className="text-pink-600 font-bold text-sm tracking-widest">
                ОСТАЛОСЬ: {countMemories}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ВСПЛЫВАЮЩЕЕ ВОСПОМИНАНИЕ */}
      <AnimatePresence>
        {activeMemory && (
          <motion.div
            key={activeMemory.id}
            initial={{ opacity: 0, scale: 0, y: 50, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -100, rotate: 15 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="absolute top-[20%] md:top-[15%] max-w-sm w-full bg-white p-6 rounded-[2.5rem] shadow-2xl border-4 border-magic-gold z-10 flex flex-col items-center"
          >
            {activeMemory.type === "image" ? (
              <div className="w-full bg-white p-3 pb-12 shadow-sm rotate-1 border border-gray-100 flex flex-col items-center">
                <div className="w-full aspect-square overflow-hidden bg-gray-50 border border-gray-100 rounded-sm">
                  <img
                    src={activeMemory.content}
                    alt="Moment"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Место для "подписи" внизу как на полароиде */}
                <div className="mt-4 font-cute text-gray-400 text-sm italic">
                  Наш счастливый миг... ❤️
                </div>
              </div>
            ) : (
              <p className="text-xl text-gray-800 text-center font-bold italic font-cute py-8 px-4 leading-relaxed">
                “ {activeMemory.content} ”
              </p>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveMemory(null);
              }}
              className="mt-4 text-sm text-gray-400 hover:text-pink-500 transition font-cute underline"
            >
              Закрыть [x]
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {mode === "view" && (
        <button
          onClick={() => {
            window.location.href = window.location.pathname;
          }}
          className="mt-12 text-pink-400 hover:text-pink-600 transition text-sm underline"
        >
          Хочу создать свою такую баночку ✨
        </button>
      )}

      {mode === "create" && !isCreating && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setIsCreating(true)}
          className="mt-12 px-8 py-3 bg-white text-pink-500 font-bold rounded-full shadow-lg hover:shadow-pink-200 transition"
        >
          ✨ Наполнить баночку
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
              className="bg-white w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsCreating(false)}
                className="absolute top-6 right-6 text-gray-400"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-6">Наполни баночку ✨</h2>

              <div className="mb-6">
                {newMemories.map((m) => (
                  <MemoryInput
                    key={m.id}
                    m={m}
                    onUpdate={(val, type) => updateField(m.id, val, type)}
                    onRemove={() => removeField(m.id)}
                  />
                ))}
              </div>

              <button
                onClick={addField}
                className="w-full py-2 border-2 border-dashed border-pink-100 rounded-xl text-pink-300 hover:border-pink-300 hover:text-pink-400 transition mb-6"
              >
                + Ещё момент
              </button>

              <button
                onClick={handleGenerate}
                className="w-full py-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition"
              >
                {generatedLink
                  ? "Ссылка скопирована! ✅"
                  : "Получить ссылку ❤️"}
              </button>

              {generatedLink && (
                <p className="mt-4 text-[10px] text-gray-400 break-all text-center">
                  Отправь её тому самому человеку
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="absolute bottom-4 text-[10px] text-gray-400">
        Сделано с любовью ❤️
      </p>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.span
            key={i}
            initial={{ y: "110vh", x: `${Math.random() * 100}vw`, opacity: 0 }}
            animate={{
              y: "-10vh",
              opacity: [0, 0.3, 0],
              rotate: 360,
            }}
            transition={{
              duration: 10 + Math.random() * 15,
              repeat: Infinity,
              delay: i * 2,
            }}
            className="absolute text-white/20 text-3xl"
          >
            ❤️
          </motion.span>
        ))}
      </div>
    </div>
  );
}

export default App;
