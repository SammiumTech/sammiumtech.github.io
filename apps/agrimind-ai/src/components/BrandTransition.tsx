import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sprout } from "lucide-react";

interface BrandTransitionProps {
  isTransitioning: boolean;
}

export default function BrandTransition({ isTransitioning }: BrandTransitionProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; tx: number; ty: number }[]>([]);

  useEffect(() => {
    if (isTransitioning) {
      // Create random particles that float toward the center to "assemble" the logo
      const newParticles = Array.from({ length: 24 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 150;
        return {
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          tx: 0, // travel to center
          ty: 0,
        };
      });
      setParticles(newParticles);
    }
  }, [isTransitioning]);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Main Backdrop Glass overlay */}
          <motion.div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Particle Assembly Layer */}
          <div className="absolute inset-0 flex items-center justify-center">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                initial={{ x: p.x, y: p.y, scale: 0, opacity: 0 }}
                animate={{
                  x: [p.x, p.tx],
                  y: [p.y, p.ty],
                  scale: [0, 1.2, 0.4],
                  opacity: [0, 0.9, 0],
                }}
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                  delay: Math.random() * 0.1,
                }}
              />
            ))}
          </div>

          {/* Logo Assembly and Pulse Group */}
          <div className="relative flex flex-col items-center justify-center">
            {/* The Pulse expansion wave */}
            <motion.div
              className="absolute w-24 h-24 rounded-full border-4 border-cyan-400 bg-cyan-400/10 shadow-[0_0_35px_rgba(34,211,238,0.7)]"
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{
                scale: [0.2, 1, 15],
                opacity: [0, 1, 1, 0],
                borderWidth: ["8px", "4px", "1px"],
              }}
              transition={{
                duration: 0.8,
                times: [0, 0.4, 1],
                ease: "easeOut",
              }}
            />

            {/* Additional Emerald Energy Pulse */}
            <motion.div
              className="absolute w-20 h-20 rounded-full border border-emerald-400 bg-emerald-400/5 shadow-[0_0_30px_rgba(52,211,153,0.6)]"
              initial={{ scale: 0.1, opacity: 0 }}
              animate={{
                scale: [0.1, 0.8, 11],
                opacity: [0, 1, 0.8, 0],
              }}
              transition={{
                duration: 0.85,
                delay: 0.05,
                ease: "easeOut",
              }}
            />

            {/* Sammium Research Labs Assembled Hex-Logo Container */}
            <motion.div
              className="relative flex flex-col items-center p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-[0_0_50px_rgba(16,185,129,0.3)] z-50 text-center"
              initial={{ scale: 0.6, rotate: -45, opacity: 0 }}
              animate={{
                scale: [0.6, 1.05, 1, 0.7],
                rotate: [0, 0, 0, 15],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 0.75,
                times: [0, 0.35, 0.7, 1],
                ease: "easeInOut",
              }}
            >
              {/* Interlocking Nature & Science SVG */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                {/* Outer Hexagon frame */}
                <motion.div 
                  className="absolute inset-0 border-2 border-emerald-400/40 rounded-xl"
                  animate={{ rotate: 180 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{ transform: "rotate(30deg)" }}
                />
                <motion.div 
                  className="absolute w-12 h-12 border-2 border-cyan-400/40 rounded-xl"
                  animate={{ rotate: -180 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{ transform: "rotate(60deg)" }}
                />
                
                {/* Core Sprout Spiky Icon */}
                <Sprout className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
              </div>
              
              <motion.span 
                className="text-[10px] uppercase tracking-[0.25em] font-black text-cyan-400 mt-3"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.2 }}
              >
                SAMMIUM
              </motion.span>
              <motion.span 
                className="text-[8px] uppercase tracking-[0.15em] font-bold text-emerald-300 mt-1"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.2 }}
              >
                Research Labs
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
