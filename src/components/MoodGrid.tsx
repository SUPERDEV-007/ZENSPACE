"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";

type MoodType = "NULL" | "CRITICAL" | "HIGH" | "ELEVATED" | "OPTIMAL";

const MOODS: Record<MoodType, { color: string; label: string }> = {
  "NULL": { color: "bg-white", label: "NO DATA" },
  "CRITICAL": { color: "bg-[#FF2D55]", label: "BURNOUT / PANIC" },
  "HIGH": { color: "bg-[#FF8A00]", label: "STRESSED" },
  "ELEVATED": { color: "bg-[#FFCC00]", label: "ANXIOUS" },
  "OPTIMAL": { color: "bg-[#00C7BE]", label: "FOCUSED / CALM" },
};

export default function MoodGrid() {
  const [mounted, setMounted] = useState(false);
  const [gridData, setGridData] = useState<MoodType[]>(Array(30).fill("NULL"));
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      const saved = localStorage.getItem("zenspace_mood_grid");
      if (saved) {
        try {
          setGridData(JSON.parse(saved));
        } catch {
          // ignore parse error
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const updateMood = (dayIndex: number, mood: MoodType) => {
    const newData = [...gridData];
    newData[dayIndex] = mood;
    setGridData(newData);
    localStorage.setItem("zenspace_mood_grid", JSON.stringify(newData));
    setSelectedDay(null);
  };

  if (!mounted) return <div className="brutalist-panel p-10 bg-black min-h-[600px]" />;

  return (
    <div className="brutalist-panel p-10 bg-black border-8 border-white shadow-[16px_16px_0_0_#FFCC00] min-h-[600px] flex flex-col">
      <div className="mb-10 border-b-8 border-white pb-6 flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black text-[#FFCC00] uppercase tracking-widest mb-2">MOOD MATRIX</h2>
          <p className="text-white text-2xl font-bold uppercase tracking-widest">30-DAY LOG</p>
        </div>
      </div>

      <div className="flex-1 flex gap-12">
        {/* The Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-6 gap-3">
            {gridData.map((mood, index) => (
              <button
                key={index}
                onClick={() => setSelectedDay(index)}
                className={`aspect-square border-4 transition-transform hover:scale-110 shadow-[4px_4px_0_0_#fff] ${MOODS[mood].color} ${selectedDay === index ? 'scale-110 shadow-[0_0_0_4px_#FF2D55] border-[#FF2D55] z-10' : 'border-white'} relative`}
                title={`Day ${index + 1}: ${MOODS[mood].label}`}
              >
                {selectedDay === index && (
                  <span className="absolute inset-0 flex items-center justify-center font-black text-xl text-black mix-blend-difference">
                    {index + 1}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Legend / Editor */}
        <div className="w-72 flex flex-col justify-center border-l-8 border-white pl-12 gap-4">
          <h3 className="text-3xl font-black text-white uppercase mb-4">
            {selectedDay !== null ? `LOG DAY ${selectedDay + 1}` : "LEGEND"}
          </h3>
          
          {(Object.keys(MOODS) as MoodType[]).map((moodType) => (
            <button
              key={moodType}
              onClick={() => selectedDay !== null && updateMood(selectedDay, moodType)}
              disabled={selectedDay === null}
              className={`group flex items-center gap-4 p-4 border-4 border-white transition-colors duration-150 ${selectedDay !== null ? 'hover:bg-white cursor-pointer bg-black' : 'opacity-60 cursor-not-allowed bg-black'}`}
            >
              <div className={`w-8 h-8 border-2 border-white ${MOODS[moodType].color} shrink-0`} />
              <span className={`font-bold uppercase tracking-wide transition-colors ${selectedDay !== null ? 'text-white group-hover:text-black' : 'text-white'}`}>{MOODS[moodType].label}</span>
              {selectedDay !== null && gridData[selectedDay] === moodType && (
                <Check className="w-6 h-6 ml-auto text-white group-hover:text-black" />
              )}
            </button>
          ))}
          
          {selectedDay !== null && (
            <button 
              onClick={() => setSelectedDay(null)}
              className="brutalist-button mt-8 py-3 bg-[#FF2D55] text-white border-4 border-white hover:bg-white hover:text-black"
            >
              CANCEL LOG
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
