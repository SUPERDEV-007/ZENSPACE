"use client";

import { useState, useRef } from "react";
import { Play, Pause, Music } from "lucide-react";

export default function MusicRelaxation() {
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  
  // Audio refs
  const audioRefs = useRef<{ [key: number]: HTMLAudioElement | null }>({});

  const tracks = [
    { id: 1, name: "AMBIENT RAIN", src: "/music/WhatsApp Audio 2026-06-20 at 11.49.06 AM.mpeg", color: "bg-[#00C7BE]" },
    { id: 2, name: "DEEP FOCUS", src: "/music/WhatsApp Audio 2026-06-20 at 11.49.08 AM.mpeg", color: "bg-[#FFCC00]" },
    { id: 3, name: "CALM MIND", src: "/music/WhatsApp Audio 2026-06-20 at 11.49.09 AM.mpeg", color: "bg-[#FF2D55]" },
  ];

  const togglePlay = (id: number) => {
    if (isPlaying && isPlaying !== id) {
      audioRefs.current[isPlaying]?.pause();
    }
    if (isPlaying === id) {
      audioRefs.current[id]?.pause();
      setIsPlaying(null);
    } else {
      audioRefs.current[id]?.play();
      setIsPlaying(id);
    }
  };

  return (
    <div className="brutalist-panel p-10 bg-white border-8 border-black">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tracks.map((track) => (
          <div
            key={track.id}
            className={`flex flex-col border-4 border-black transition-all duration-200 brutalist-panel-hover ${
              isPlaying === track.id 
                ? `${track.color} shadow-[12px_12px_0_0_#000] -translate-x-1 -translate-y-1` 
                : "bg-white shadow-[8px_8px_0_0_#000]"
            }`}
          >
            <div className="flex items-center justify-between p-6 border-b-4 border-black bg-black text-white">
              <span className="font-black text-2xl tracking-widest">{track.name}</span>
              <Music size={28} className={isPlaying === track.id ? "animate-pulse text-[#FFCC00]" : "text-white"} />
            </div>

            <div className="flex items-center p-6 gap-6">
              <button
                onClick={() => togglePlay(track.id)}
                className={`brutalist-button w-20 h-20 shrink-0 border-4 border-black flex items-center justify-center ${
                  isPlaying === track.id 
                    ? "bg-black text-white shadow-[4px_4px_0_0_#fff]" 
                    : "bg-black text-white"
                }`}
              >
                {isPlaying === track.id ? <Pause size={36} /> : <Play size={36} className="ml-2" />}
              </button>
              
              <div className="flex-1 h-12 flex items-end gap-2 px-4 bg-white border-4 border-black p-2">
                {isPlaying === track.id ? (
                  // Animated Equalizer Bars
                  Array.from({ length: 6 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="w-3 bg-black"
                      style={{
                        animation: `eq 0.6s ease-in-out infinite alternate`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))
                ) : (
                  <span className="text-xl text-black font-bold uppercase tracking-widest self-center w-full text-center">
                    STANDBY
                  </span>
                )}
              </div>
            </div>
            
            <audio 
              ref={(el) => { audioRefs.current[track.id] = el; }} 
              src={track.src} 
              loop 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
