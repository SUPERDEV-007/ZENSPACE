"use client";

import { useState } from "react";
import MemoryMatrix from "./games/MemoryMatrix";
import ReactionStrike from "./games/ReactionStrike";
import SequenceProtocol from "./games/SequenceProtocol";
import TicTacToe from "./games/TicTacToe";

type GameType = "matrix" | "strike" | "protocol" | "tictactoe";

export default function BrainGame() {
  const [activeGame, setActiveGame] = useState<GameType>("matrix");

  const GAMES = [
    { id: "matrix", label: "MEMORY MATRIX", color: "bg-[#FFCC00]" },
    { id: "strike", label: "REACTION STRIKE", color: "bg-[#FF2D55]" },
    { id: "protocol", label: "SEQUENCE PROTOCOL", color: "bg-[#00C7BE]" },
    { id: "tictactoe", label: "GRID WAR", color: "bg-white" },
  ] as const;

  return (
    <div className="brutalist-panel p-10 bg-black border-8 border-white flex flex-col shadow-[16px_16px_0_0_#FF2D55] min-h-[800px]">
      
      {/* Game Hub Navigation */}
      <div className="flex flex-wrap gap-4 mb-12 pb-8 border-b-8 border-white">
        {GAMES.map((game) => (
          <button
            key={game.id}
            onClick={() => setActiveGame(game.id as GameType)}
            className={`brutalist-button px-6 py-3 border-4 border-white transition-all duration-200 text-black shadow-[4px_4px_0_0_#fff] ${
              activeGame === game.id 
                ? `${game.color} scale-105 -translate-y-2` 
                : "bg-gray-400 hover:bg-gray-200"
            }`}
          >
            {game.label}
          </button>
        ))}
      </div>

      {/* Active Game Area */}
      <div className="flex-1 w-full flex flex-col">
        {activeGame === "matrix" && <MemoryMatrix />}
        {activeGame === "strike" && <ReactionStrike />}
        {activeGame === "protocol" && <SequenceProtocol />}
        {activeGame === "tictactoe" && <TicTacToe />}
      </div>
      
    </div>
  );
}
