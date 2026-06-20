"use client";

import { useState, useEffect } from "react";
import { Play, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RelaxationHub() {
  const [isBreathing, setIsBreathing] = useState(false);
  const [phase, setPhase] = useState("READY?");
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Live Timer Animation Logic
  useEffect(() => {
    if (!isBreathing) {
      setPhase("READY?");
      setTimeLeft(null);
      return;
    }

    let isMounted = true;
    let currentPhase = "INHALE";
    let ticks = 4;
    
    setPhase("INHALE");
    setTimeLeft(4);

    const interval = setInterval(() => {
      if (!isMounted) return;
      ticks--;
      
      if (ticks > 0) {
        setTimeLeft(ticks);
      } else {
        if (currentPhase === "INHALE") {
          currentPhase = "HOLD";
          ticks = 7;
        } else if (currentPhase === "HOLD") {
          currentPhase = "EXHALE";
          ticks = 8;
        } else if (currentPhase === "EXHALE") {
          currentPhase = "INHALE";
          ticks = 4;
        }
        setPhase(currentPhase);
        setTimeLeft(ticks);
      }
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isBreathing]);

  return (
    <div className="flex flex-col gap-10">
      <div className="brutalist-panel p-12 bg-white flex flex-col items-center border-8 border-black">
        <h2 className="text-4xl font-black uppercase mb-4 border-b-8 border-black pb-2">4-7-8 CYCLE</h2>
        <p className="text-black mb-16 text-center max-w-md font-bold text-xl uppercase">
          FOLLOW THE SHAPE. DO NOT DEVIATE.
        </p>

        <div className="relative w-72 h-72 flex items-center justify-center mb-16">
          {/* Animated Brutalist Shape */}
          <motion.div
            animate={isBreathing ? { 
              scale: [1, 1.6, 1.6, 1],
              borderRadius: ["50%", "0%", "0%", "50%"],
              rotate: [0, 90, 90, 180]
            } : { scale: 1, borderRadius: "50%", rotate: 0 }}
            transition={{ duration: 19, ease: "linear", repeat: Infinity, times: [0, 0.21, 0.58, 1] }}
            className={`absolute w-48 h-48 border-[12px] border-black shadow-[16px_16px_0_0_#000] ${
              isBreathing ? "bg-[#FF2D55]" : "bg-[#00C7BE]"
            }`}
          />
          
          {/* Live Timer Center Text */}
          <div className="z-10 flex flex-col items-center justify-center h-32 bg-white border-4 border-black px-6 shadow-[8px_8px_0_0_#000]">
            <div className="text-3xl font-black uppercase text-black mb-1">
              {phase}
            </div>
            {timeLeft !== null && (
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={timeLeft + phase}
                  initial={{ opacity: 0, y: 20, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.5 }}
                  transition={{ duration: 0.2, type: "spring" }}
                  className="text-6xl font-black text-[#FF2D55] drop-shadow-[4px_4px_0_rgba(0,0,0,1)] tabular-nums"
                >
                  {timeLeft}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsBreathing(!isBreathing)}
          className="brutalist-button px-12 py-5 text-2xl border-8 border-black bg-[#FFCC00] text-black hover:bg-[#FF2D55] hover:text-white"
        >
          {isBreathing ? (
            <>
              <Square size={28} className="mr-3" /> ABORT
            </>
          ) : (
            <>
              <Play size={28} className="mr-3" /> INITIATE
            </>
          )}
        </button>
      </div>
    </div>
  );
}
