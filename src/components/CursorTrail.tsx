"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bird } from "lucide-react";

interface TrailParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
}

export default function CursorTrail() {
  const [particles, setParticles] = useState<TrailParticle[]>([]);
  const [particleCount, setParticleCount] = useState(0);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let lastTime = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime < 40) return; // limit to 25fps for performance
      lastTime = now;

      // Calculate velocity/angle
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90; // +90 to point bird forward

      lastPos.current = { x: e.clientX, y: e.clientY };

      const newParticle = { id: particleCount, x: e.clientX, y: e.clientY, rotation: angle };
      
      setParticles((prev) => [...prev.slice(-12), newParticle]); // Keep max 12
      setParticleCount((prev) => prev + 1);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [particleCount]);

  useEffect(() => {
    const cleanup = setInterval(() => {
      setParticles((prev) => {
        if (prev.length > 0) return prev.slice(1);
        return prev;
      });
    }, 100);

    return () => clearInterval(cleanup);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.9, scale: 0.6, y: p.y, x: p.x, rotate: p.rotation }}
            animate={{ 
              opacity: 0, 
              scale: 2,
              y: p.y + (Math.sin((p.rotation - 90) * (Math.PI / 180)) * -60), // fly forward
              x: p.x + (Math.cos((p.rotation - 90) * (Math.PI / 180)) * -60),
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute text-primary drop-shadow-[0_0_12px_rgba(124,58,237,1)]"
            style={{ left: -12, top: -12 }}
          >
            <Bird size={24} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
