"use client";

import { motion } from "framer-motion";
import { BookHeart } from "lucide-react";
import { useEffect, useState } from "react";

export default function WelcomeScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 1000); // Wait for exit animation
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0F0F23] ${!isVisible ? "pointer-events-none" : ""}`}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: isVisible ? 1 : 0.9, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="relative">
          <motion.div
            animate={{ 
              boxShadow: ["0 0 0px #7C3AED", "0 0 60px #7C3AED", "0 0 0px #7C3AED"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="rounded-full p-6 bg-primary/10 border border-primary/30"
          >
            <BookHeart className="w-16 h-16 text-primary drop-shadow-[0_0_15px_rgba(124,58,237,0.8)]" />
          </motion.div>
        </div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: isVisible ? 0 : -20, opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-8 text-4xl font-serif text-foreground tracking-wide font-medium"
        >
          ZenSpace
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isVisible ? 1 : 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="h-[1px] w-32 bg-gradient-to-r from-transparent via-primary to-transparent mt-4"
        />
      </motion.div>
    </motion.div>
  );
}
