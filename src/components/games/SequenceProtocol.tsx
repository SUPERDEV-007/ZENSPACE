"use client";

import { useState, useEffect, useRef } from "react";
import { Terminal } from "lucide-react";

const COLORS = [
  { id: 0, bg: "bg-[#FF2D55]", active: "bg-[#FFa3b5]", label: "RED" },
  { id: 1, bg: "bg-[#00C7BE]", active: "bg-[#a3efec]", label: "CYAN" },
  { id: 2, bg: "bg-[#FFCC00]", active: "bg-[#ffeaa3]", label: "YELLOW" },
  { id: 3, bg: "bg-white", active: "bg-gray-400", label: "WHITE" }
];

export default function SequenceProtocol() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userStep, setUserStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePanel, setActivePanel] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const startGame = () => {
    setSequence([Math.floor(Math.random() * 4)]);
    setUserStep(0);
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
  };

  const playSequence = async (currentSeq: number[]) => {
    setIsPlaying(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // wait before starting playback
    for (let i = 0; i < currentSeq.length; i++) {
      setActivePanel(currentSeq[i]);
      await new Promise(resolve => setTimeout(resolve, 500));
      setActivePanel(null);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    if (sequence.length > 0 && !gameOver) {
      playSequence(sequence);
    }
  }, [sequence, gameOver]);

  const handlePanelClick = (id: number) => {
    if (isPlaying || gameOver || sequence.length === 0) return;

    // Flash the panel
    setActivePanel(id);
    setTimeout(() => setActivePanel(null), 200);

    if (id === sequence[userStep]) {
      // Correct click
      if (userStep === sequence.length - 1) {
        // Finished sequence
        setScore(sequence.length);
        setUserStep(0);
        setIsPlaying(true);
        setTimeout(() => {
          setSequence([...sequence, Math.floor(Math.random() * 4)]);
        }, 1000);
      } else {
        setUserStep(userStep + 1);
      }
    } else {
      // Wrong click
      setGameOver(true);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-2xl mb-10 items-end border-b-4 border-white pb-6">
        <div>
          <h2 className="text-4xl font-black mb-2 text-[#00C7BE] uppercase tracking-widest">Sequence Protocol</h2>
          <p className="text-white font-bold text-xl uppercase tracking-widest">Repeat the pattern.</p>
        </div>
        <div className="text-right flex flex-col items-end">
          <p className="text-black bg-white font-black text-2xl px-6 py-2 border-4 border-[#00C7BE] shadow-[4px_4px_0_0_#FF2D55]">
            LEVEL: {score}
          </p>
          {(gameOver || sequence.length === 0) && (
            <button 
              onClick={startGame}
              className="brutalist-button mt-4 px-4 py-2 bg-[#FFCC00] text-black text-sm border-2 border-white shadow-[2px_2px_0_0_#fff]"
            >
              {gameOver ? "RETRY PROTOCOL" : "INITIATE"}
            </button>
          )}
        </div>
      </div>

      {gameOver ? (
        <div className="py-20 flex flex-col items-center text-center max-w-2xl w-full border-8 border-white p-12 bg-black">
          <Terminal className="w-24 h-24 text-[#FF2D55] mb-8" />
          <h3 className="text-6xl font-black mb-4 text-[#FF2D55] uppercase tracking-tighter">PROTOCOL FAILED</h3>
          <p className="text-white mb-10 text-3xl font-bold uppercase tracking-widest">Final Level: {score}</p>
          <button 
            onClick={startGame}
            className="brutalist-button px-12 py-6 text-3xl bg-white text-black border-8 border-[#00C7BE] shadow-[8px_8px_0_0_#00C7BE] hover:bg-[#FFCC00]"
          >
            RETRY PROTOCOL
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 max-w-lg w-full">
          {COLORS.map((color) => (
            <button
              key={color.id}
              onClick={() => handlePanelClick(color.id)}
              disabled={isPlaying}
              className={`aspect-square border-8 border-white transition-all duration-100 ${
                activePanel === color.id 
                  ? `${color.active} shadow-[inset_0_0_40px_rgba(255,255,255,0.8)] scale-95` 
                  : `${color.bg} shadow-[8px_8px_0_0_#fff] hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#fff]`
              } ${isPlaying ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="sr-only">{color.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
