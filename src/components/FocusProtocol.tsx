"use client";

import { useState, useEffect } from "react";
import { Play, Square, Coffee } from "lucide-react";

export default function FocusProtocol() {
  const [mode, setMode] = useState<"standby" | "focus" | "break">("standby");
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default

  useEffect(() => {
    if (mode === "standby") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Transition modes
          if (mode === "focus") {
            setMode("break");
            return 5 * 60; // 5 min break
          } else {
            setMode("standby");
            return 25 * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mode]);

  const startFocus = () => {
    setMode("focus");
    setTimeLeft(25 * 60);
  };

  const startBreak = () => {
    setMode("break");
    setTimeLeft(5 * 60);
  };

  const abort = () => {
    setMode("standby");
    setTimeLeft(25 * 60);
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <div className={`brutalist-panel p-12 border-8 border-black transition-colors duration-500 flex flex-col items-center shadow-[16px_16px_0_0_#FF2D55] min-h-[600px] justify-center ${
      mode === "focus" ? "bg-black text-white" : mode === "break" ? "bg-[#00C7BE] text-black" : "bg-white text-black"
    }`}>
      
      <div className="text-center mb-16 border-4 border-current p-6 bg-transparent">
        {mode === "standby" && <h2 className="text-6xl font-black uppercase tracking-tighter">STANDBY MODE</h2>}
        {mode === "focus" && <h2 className="text-6xl font-black uppercase tracking-tighter text-[#FF2D55] animate-pulse">FOCUS INITIATED</h2>}
        {mode === "break" && <h2 className="text-6xl font-black uppercase tracking-tighter">REST AUTHORIZED</h2>}
        
        <p className="text-2xl font-bold mt-4 uppercase tracking-widest">
          {mode === "standby" && "AWAITING PROTOCOL START."}
          {mode === "focus" && "DO NOT BREAK CONCENTRATION."}
          {mode === "break" && "DISENGAGE IMMEDIATELY."}
        </p>
      </div>

      <div className="text-center mb-16">
        <h1 className={`text-[12rem] font-black tabular-nums leading-none tracking-tighter drop-shadow-[8px_8px_0_rgba(0,0,0,1)] ${mode === "focus" ? "text-white" : "text-black"}`}>
          {minutes}:{seconds}
        </h1>
      </div>

      <div className="flex gap-6 w-full max-w-2xl">
        {mode === "standby" ? (
          <>
            <button
              onClick={startFocus}
              className="flex-1 brutalist-button py-6 bg-[#FF2D55] text-white text-3xl border-8 border-black hover:bg-black"
            >
              <Play size={36} className="mr-4" /> START FOCUS
            </button>
            <button
              onClick={startBreak}
              className="flex-1 brutalist-button py-6 bg-[#00C7BE] text-black text-3xl border-8 border-black hover:bg-black hover:text-white"
            >
              <Coffee size={36} className="mr-4" /> START BREAK
            </button>
          </>
        ) : (
          <button
            onClick={abort}
            className="flex-1 brutalist-button py-6 bg-[#FFCC00] text-black text-3xl border-8 border-black hover:bg-white"
          >
            <Square size={36} className="mr-4" /> ABORT PROTOCOL
          </button>
        )}
      </div>

    </div>
  );
}
