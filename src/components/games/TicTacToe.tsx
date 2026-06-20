"use client";

import { useState } from "react";
import { Circle, X } from "lucide-react";

export default function TicTacToe() {
  const [board, setBoard] = useState<Array<"X" | "O" | null>>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const calculateWinner = (squares: Array<"X" | "O" | null>) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(square => square !== null);

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-2xl mb-10 items-end border-b-4 border-white pb-6">
        <div>
          <h2 className="text-4xl font-black mb-2 text-white uppercase tracking-widest">Grid War</h2>
          <p className="text-white font-bold text-xl uppercase tracking-widest">X vs O.</p>
        </div>
        <div className="text-right flex flex-col items-end">
          <p className={`font-black text-2xl px-6 py-2 border-4 border-white shadow-[4px_4px_0_0_#fff] ${xIsNext ? 'bg-[#FF2D55] text-white' : 'bg-[#00C7BE] text-black'}`}>
            TURN: {xIsNext ? "X" : "O"}
          </p>
          <button 
            onClick={resetGame}
            className="brutalist-button mt-4 px-4 py-2 bg-white text-black text-sm border-2 border-white shadow-[2px_2px_0_0_#fff]"
          >
            RESET GRID
          </button>
        </div>
      </div>

      {winner || isDraw ? (
        <div className="py-20 flex flex-col items-center text-center max-w-2xl w-full border-8 border-white p-12 bg-black">
          {winner ? (
            <>
              {winner === "X" ? <X className="w-32 h-32 text-[#FF2D55] mb-8" /> : <Circle className="w-32 h-32 text-[#00C7BE] mb-8" />}
              <h3 className="text-6xl font-black mb-4 text-white uppercase tracking-tighter">VICTORY</h3>
              <p className="text-[#FFCC00] mb-10 text-3xl font-bold uppercase tracking-widest">{winner} DOMINATES THE GRID</p>
            </>
          ) : (
            <>
              <h3 className="text-6xl font-black mb-4 text-white uppercase tracking-tighter">STALEMATE</h3>
              <p className="text-[#FFCC00] mb-10 text-3xl font-bold uppercase tracking-widest">NO WINNER</p>
            </>
          )}
          
          <button 
            onClick={resetGame}
            className="brutalist-button px-12 py-6 text-3xl bg-white text-black border-8 border-[#FF2D55] shadow-[8px_8px_0_0_#FF2D55] hover:bg-[#FFCC00]"
          >
            PLAY AGAIN
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 max-w-[400px] w-full">
          {board.map((square, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className="aspect-square bg-black border-4 border-white flex items-center justify-center brutalist-panel-hover"
            >
              {square === "X" && <X className="w-20 h-20 text-[#FF2D55]" />}
              {square === "O" && <Circle className="w-20 h-20 text-[#00C7BE]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
