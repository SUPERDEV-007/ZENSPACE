"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { BookHeart, Wind, Puzzle, Send, Loader2, Headphones, Timer, ActivitySquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RelaxationHub from "@/components/RelaxationHub";
import MusicRelaxation from "@/components/MusicRelaxation";
import BrainGame from "@/components/BrainGame";
import FocusProtocol from "@/components/FocusProtocol";
import MoodGrid from "@/components/MoodGrid";

const TABS = [
  { id: "journal", icon: BookHeart, label: "AI JOURNAL", color: "bg-[#FF2D55]" },
  { id: "relax", icon: Wind, label: "BREATHE", color: "bg-[#00C7BE]" },
  { id: "focus", icon: Timer, label: "FOCUS", color: "bg-black" },
  { id: "music", icon: Headphones, label: "AUDIO", color: "bg-white" },
  { id: "game", icon: Puzzle, label: "GAME", color: "bg-[#FFCC00]" },
  { id: "mood", icon: ActivitySquare, label: "MOOD", color: "bg-black" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const activeTabId = TABS[activeTab].id;

  const handleAnalyze = async () => {
    if (!journalEntry.trim()) return;
    setIsAnalyzing(true);
    setAiResponse(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: journalEntry }),
      });
      const data = await res.json();
      setAiResponse(data.message || "SYSTEM: I'M HERE FOR YOU.");
    } catch (error) {
      setAiResponse("SYSTEM ERROR: CANNOT CONNECT. KEEP BREATHING.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const baseAngles = [-50, -30, -10, 10, 30, 50];
  const rotateAngle = -baseAngles[activeTab];

  return (
    <div className="flex h-screen overflow-hidden selection:bg-[#000] selection:text-[#fff]">
      {/* Brutalist Wheel Navigation */}
      <aside className="w-[450px] shrink-0 relative flex items-center bg-white border-r-8 border-black z-20 shadow-[12px_0_0_0_#000] overflow-hidden">
        {/* Title */}
        <div className="absolute top-8 left-8 z-50">
          <h1 className="text-5xl font-black uppercase tracking-tighter bg-black text-[#FFCC00] px-4 py-2 border-4 border-black shadow-[6px_6px_0_0_#FF2D55]">
            ZENSPACE
          </h1>
        </div>

        {/* The Wheel */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-[450px] w-[900px] h-[900px] rounded-full border-[12px] border-black bg-[#f4f0e6] shadow-[inset_-16px_0_0_0_rgba(0,0,0,0.1)] flex items-center justify-center">
          <motion.div 
            className="relative w-full h-full rounded-full"
            animate={{ rotate: rotateAngle }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            {TABS.map((tab, i) => {
              const angle = baseAngles[i];
              return (
                <div 
                  key={tab.id}
                  className="absolute inset-0 flex items-center justify-end pr-10 pointer-events-none"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <div 
                    className="flex items-center gap-4 hover:scale-105 transition-transform origin-right pointer-events-auto cursor-pointer"
                    onClick={() => setActiveTab(i)}
                  >
                    <span className={`text-2xl font-black uppercase ${activeTab === i ? 'text-black' : 'text-gray-400'}`}>
                      {tab.label}
                    </span>
                    <div className={`w-20 h-20 rounded-full border-8 border-black flex items-center justify-center transition-colors duration-300 ${activeTab === i ? tab.color : 'bg-white'} ${activeTab === i && tab.color.includes('black') ? 'text-white' : 'text-black'}`}>
                      <tab.icon size={36} />
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
          
          {/* Center Hub */}
          <div className="absolute w-48 h-48 bg-black rounded-full border-[12px] border-[#00C7BE] shadow-[0_0_0_12px_#FFCC00] z-10 flex items-center justify-center">
            <div className="w-16 h-16 bg-[#FF2D55] rounded-full border-4 border-black" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative z-0 p-12 bg-transparent">
        <div className="max-w-4xl mx-auto min-h-full flex flex-col justify-center">
          
          <motion.div 
            key={activeTabId}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {/* Header */}
            <div className={`mb-12 brutalist-panel p-8 ${TABS[activeTab].color} ${TABS[activeTab].color.includes('black') ? 'text-white' : 'text-black'}`}>
              <h2 className="text-6xl font-black uppercase tracking-tight mb-2 border-b-8 border-current pb-2">
                {tabContentText(activeTabId).title}
              </h2>
              <p className="text-2xl font-bold uppercase mt-4">
                {tabContentText(activeTabId).subtitle}
              </p>
            </div>

            {/* Render Active View */}
            {activeTabId === "journal" && (
              <div className="space-y-8">
                <div className="brutalist-panel p-6 bg-white relative">
                  <textarea
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                    placeholder="ENTER YOUR LOG HERE..."
                    className="w-full h-72 bg-transparent border-none text-black placeholder:text-gray-300 focus:outline-none focus:ring-0 resize-none text-2xl font-bold tracking-wide"
                  />
                  <div className="absolute bottom-6 right-6">
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !journalEntry.trim()}
                      className="brutalist-button px-10 py-5 text-2xl"
                    >
                      {isAnalyzing ? <Loader2 className="animate-spin w-8 h-8 mr-3" /> : <Send className="w-8 h-8 mr-3" />}
                      EXECUTE
                    </button>
                  </div>
                </div>

                {/* AI Response Area */}
                <AnimatePresence>
                  {aiResponse && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="brutalist-panel p-10 bg-[#FFCC00]"
                    >
                      <div className="flex items-start gap-8">
                        <div className="p-5 bg-black text-white border-4 border-black shadow-[6px_6px_0_0_#FF2D55]">
                          <BookHeart className="w-12 h-12" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-4xl font-black uppercase mb-6 border-b-8 border-black pb-2">SYSTEM ANALYSIS</h3>
                          <div className="text-black text-xl font-bold">
                            <ReactMarkdown
                              components={{
                                h3: ({node, ...props}) => <h3 className="text-2xl font-black bg-black text-[#FFCC00] px-4 py-2 mt-8 mb-4 border-4 border-black shadow-[4px_4px_0_0_#FF2D55] inline-block uppercase" {...props} />,
                                p: ({node, ...props}) => <p className="mb-6 leading-relaxed" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-none space-y-4 mb-6" {...props} />,
                                li: ({node, ...props}) => (
                                  <li className="flex items-start gap-4">
                                    <div className="w-4 h-4 bg-[#FF2D55] mt-1.5 border-2 border-black shrink-0" />
                                    <span {...props} />
                                  </li>
                                ),
                                strong: ({node, ...props}) => <strong className="bg-[#00C7BE] px-2 py-1 border-2 border-black text-black uppercase tracking-wide" {...props} />,
                                em: ({node, ...props}) => <em className="italic bg-[#FFCC00] px-1 border-b-4 border-black text-black" {...props} />,
                                hr: ({node, ...props}) => <hr className="my-8 border-t-8 border-black" {...props} />
                              }}
                            >
                              {aiResponse}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {activeTabId === "relax" && <RelaxationHub />}
            {activeTabId === "focus" && <FocusProtocol />}
            {activeTabId === "music" && <MusicRelaxation />}
            {activeTabId === "game" && <BrainGame />}
            {activeTabId === "mood" && <MoodGrid />}
          </motion.div>

        </div>
      </main>
    </div>
  );
}

function tabContentText(id: string) {
  switch (id) {
    case "journal": return { title: "LOG", subtitle: "DUMP YOUR THOUGHTS. LET THE SYSTEM ANALYZE." };
    case "relax": return { title: "BREATHE", subtitle: "FOLLOW THE CYCLE. REGAIN CONTROL." };
    case "focus": return { title: "FOCUS", subtitle: "INITIATE POMODORO. NO DISTRACTIONS." };
    case "music": return { title: "AUDIO", subtitle: "ISOLATE YOUR SENSES. MAXIMIZE FOCUS." };
    case "game": return { title: "GAME", subtitle: "RESET YOUR MIND WITH A VISUAL PUZZLE." };
    case "mood": return { title: "MOOD", subtitle: "TRACK YOUR MENTAL STATE OVER 30 DAYS." };
    default: return { title: "", subtitle: "" };
  }
}
