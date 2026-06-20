"use client";

import { useState, useEffect } from "react";
import { Brain, Star, Cloud, Moon, Sun, Coffee, Sparkles, Heart } from "lucide-react";

const ICONS = [Brain, Star, Cloud, Moon, Sun, Coffee, Sparkles, Heart];

export default function MemoryMatrix() {
  const [cards, setCards] = useState<{ id: number; icon: any; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);

  const initializeGame = () => {
    const deck = [...ICONS, ...ICONS]
      .sort(() => Math.random() - 0.5)
      .map((icon, idx) => ({ id: idx, icon, isFlipped: false, isMatched: false }));
    setCards(deck);
    setFlippedIds([]);
    setMoves(0);
    setMatches(0);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (id: number) => {
    if (flippedIds.length === 2 || cards[id].isFlipped || cards[id].isMatched) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlippedIds = [...flippedIds, id];
    setFlippedIds(newFlippedIds);

    if (newFlippedIds.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlippedIds;
      
      if (cards[first].icon === cards[second].icon) {
        setTimeout(() => {
          setCards(prev => {
            const matched = [...prev];
            matched[first].isMatched = true;
            matched[second].isMatched = true;
            return matched;
          });
          setMatches(m => m + 1);
          setFlippedIds([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => {
            const unflipped = [...prev];
            unflipped[first].isFlipped = false;
            unflipped[second].isFlipped = false;
            return unflipped;
          });
          setFlippedIds([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-2xl mb-10 items-end border-b-4 border-white pb-6">
        <div>
          <h2 className="text-4xl font-black mb-2 text-[#FFCC00] uppercase tracking-widest">Memory Matrix</h2>
          <p className="text-white font-bold text-xl uppercase tracking-widest">Find the pairs.</p>
        </div>
        <div className="text-right flex flex-col items-end">
          <p className="text-black bg-[#00C7BE] font-black text-2xl px-6 py-2 border-4 border-white shadow-[4px_4px_0_0_#fff]">
            MOVES: {moves}
          </p>
          <button 
            onClick={initializeGame}
            className="brutalist-button mt-4 px-4 py-2 bg-white text-black text-sm border-2 border-white shadow-[2px_2px_0_0_#fff]"
          >
            REBOOT
          </button>
        </div>
      </div>

      {matches === ICONS.length ? (
        <div className="py-20 flex flex-col items-center text-center">
          <Sparkles className="w-24 h-24 text-[#FFCC00] mb-8 animate-spin-slow" />
          <h3 className="text-6xl font-black mb-4 text-white uppercase tracking-tighter">SEQUENCE CLEAR</h3>
          <p className="text-[#00C7BE] mb-10 text-2xl font-bold uppercase tracking-widest">Matrix Reset Available.</p>
          <button 
            onClick={initializeGame}
            className="brutalist-button px-12 py-6 text-3xl bg-[#FF2D55] text-white border-8 border-white shadow-[8px_8px_0_0_#fff] hover:bg-[#FFCC00] hover:text-black"
          >
            REBOOT MATRIX
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 max-w-2xl w-full">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square border-4 border-white flex items-center justify-center transition-all duration-200 ${
                card.isFlipped || card.isMatched 
                  ? "bg-[#00C7BE] shadow-[inset_4px_4px_0_0_rgba(0,0,0,0.2)]" 
                  : "bg-[#222] hover:bg-[#333] cursor-pointer"
              } ${card.isMatched ? "bg-[#FFCC00]" : ""}`}
            >
              <div className={card.isFlipped || card.isMatched ? "opacity-100 scale-100" : "opacity-0 scale-50"}>
                <card.icon className="w-16 h-16 text-black" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
