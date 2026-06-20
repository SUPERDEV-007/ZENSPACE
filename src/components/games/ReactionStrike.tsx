"use client";

import { useState, useEffect, useRef } from "react";
import { Zap } from "lucide-react";

export default function ReactionStrike() {
  const [gameState, setGameState] = useState<"idle" | "waiting" | "ready" | "result">("idle");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startGame = () => {
    setGameState("waiting");
    setReactionTime(null);
    
    // Random wait between 2s and 6s
    const waitTime = Math.random() * 4000 + 2000;
    
    timerRef.current = setTimeout(() => {
      setGameState("ready");
      startTimeRef.current = Date.now();
    }, waitTime);
  };

  const handleClick = () => {
    if (gameState === "idle" || gameState === "result") {
      startGame();
    } else if (gameState === "waiting") {
      // Clicked too early
      if (timerRef.current) clearTimeout(timerRef.current);
      setGameState("result");
      setReactionTime(-1); // -1 means too early
    } else if (gameState === "ready") {
      // Successful click
      const endTime = Date.now();
      const time = endTime - startTimeRef.current;
      setReactionTime(time);
      setGameState("result");
      
      if (!bestTime || time < bestTime) {
        setBestTime(time);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-2xl mb-10 items-end border-b-4 border-white pb-6">
        <div>
          <h2 className="text-4xl font-black mb-2 text-[#FF2D55] uppercase tracking-widest">Reaction Strike</h2>
          <p className="text-white font-bold text-xl uppercase tracking-widest">Click when it turns green.</p>
        </div>
        {bestTime && (
          <div className="text-right flex flex-col items-end">
            <p className="text-black bg-[#FFCC00] font-black text-2xl px-6 py-2 border-4 border-white shadow-[4px_4px_0_0_#fff]">
              BEST: {bestTime}ms
            </p>
          </div>
        )}
      </div>

      <button
        onClick={handleClick}
        className={`w-full max-w-2xl aspect-video border-8 border-white shadow-[16px_16px_0_0_#fff] flex flex-col items-center justify-center cursor-pointer transition-colors duration-75 ${
          gameState === "idle" ? "bg-black" :
          gameState === "waiting" ? "bg-[#FF2D55]" :
          gameState === "ready" ? "bg-[#00C7BE]" :
          "bg-black"
        }`}
      >
        {gameState === "idle" && (
          <div className="text-center text-white">
            <Zap className="w-24 h-24 mb-6 mx-auto" />
            <h3 className="text-5xl font-black uppercase">Click To Start</h3>
          </div>
        )}
        
        {gameState === "waiting" && (
          <div className="text-center text-white">
            <h3 className="text-6xl font-black uppercase tracking-widest">WAIT FOR GREEN...</h3>
          </div>
        )}
        
        {gameState === "ready" && (
          <div className="text-center text-black">
            <h3 className="text-7xl font-black uppercase tracking-widest">STRIKE NOW!</h3>
          </div>
        )}
        
        {gameState === "result" && (
          <div className="text-center text-white">
            {reactionTime === -1 ? (
              <h3 className="text-5xl font-black uppercase text-[#FF2D55]">TOO EARLY!</h3>
            ) : (
              <div>
                <h3 className="text-7xl font-black uppercase text-[#00C7BE] mb-4">{reactionTime}ms</h3>
                <p className="text-2xl font-bold uppercase">Click to restart</p>
              </div>
            )}
          </div>
        )}
      </button>
    </div>
  );
}
