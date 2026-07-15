import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface StationTransitionProps {
  stationId: string;
  children: React.ReactNode;
}

export const StationTransition: React.FC<StationTransitionProps> = ({ stationId, children }) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchText, setGlitchText] = useState("");

  // Words that fit the SAO/Sammium laboratory aesthetic
  const GLITCH_KEYWORDS = [
    "DECRYPTING_NEURAL_UPLINK...",
    "SYNCING_NERVEGEAR_MATRIX...",
    "STREAM_PORT_3000_ESTABLISHED",
    "RECALIBRATING_QUANTUM_CORE...",
    "CONNECTING_AI_COGNITIVE_NEXUS...",
    "SWARM_TELEMETRY_SYNCED",
    "MATRIX_AUTOMATA_ACTIVE",
    "BUFFERING_LAB_DATASTREAM..."
  ];

  useEffect(() => {
    setIsGlitching(true);
    // Grab a random cybernetic prompt
    setGlitchText(GLITCH_KEYWORDS[Math.floor(Math.random() * GLITCH_KEYWORDS.length)]);

    const timer = setTimeout(() => {
      setIsGlitching(false);
    }, 450); // Glitch flash duration match

    return () => clearTimeout(timer);
  }, [stationId]);

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={stationId}
          initial={{
            opacity: 0,
            scaleY: 0.96,
            skewX: -8,
            x: -20,
            filter: "hue-rotate(45deg) brightness(1.4) contrast(1.2)"
          }}
          animate={{
            opacity: 1,
            scaleY: 1,
            skewX: 0,
            x: 0,
            filter: "hue-rotate(0deg) brightness(1) contrast(1)"
          }}
          exit={{
            opacity: 0,
            scaleY: 0.95,
            skewX: 8,
            x: 20,
            filter: "hue-rotate(-45deg) brightness(1.6) contrast(1.3)"
          }}
          transition={{
            duration: 0.35,
            ease: [0.16, 1, 0.3, 1] // Modern cubic-bezier transition
          }}
          className="w-full relative"
        >
          {/* Main child station component */}
          {children}

          {/* Glitch Scanline Overlay */}
          {isGlitching && (
            <div className="absolute inset-0 pointer-events-none z-30 rounded-2xl overflow-hidden border border-cyan-500/40 bg-slate-950/20">
              {/* Scrolling Horizontal Glitch Line */}
              <motion.div
                initial={{ y: "-100%" }}
                animate={{ y: "100%" }}
                transition={{ duration: 0.4, ease: "linear" }}
                className="absolute left-0 w-full h-8 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.4)]"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: "-100%" }}
                transition={{ duration: 0.35, ease: "linear", delay: 0.1 }}
                className="absolute left-0 w-full h-4 bg-gradient-to-b from-transparent via-pink-500/30 to-transparent shadow-[0_0_15px_rgba(244,63,94,0.4)]"
              />

              {/* Digital static grid noise effect */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.35)_50%,rgba(16,182,212,0.1)_50%)] bg-[size:100%_4px] opacity-60 animate-pulse" />

              {/* Real-time Decrypting text */}
              <div className="absolute bottom-4 left-4 font-mono text-[9px] font-bold tracking-widest text-cyan-400 bg-slate-950/90 px-3 py-1.5 rounded border border-cyan-500/30 flex items-center gap-2 shadow-lg animate-bounce">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>{glitchText}</span>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
