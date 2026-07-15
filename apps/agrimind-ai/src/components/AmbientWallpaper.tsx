import React, { useMemo } from "react";
import { motion } from "motion/react";

interface AmbientWallpaperProps {
  weatherMode?: "sunny" | "rainy" | "windy" | "monsoon";
  isNight?: boolean;
}

interface Orb {
  id: string;
  color: string;
  size: number;
  initialX: number;
  initialY: number;
  driftX: number[];
  driftY: number[];
  duration: number;
  pulseScale: number[];
}

interface FloatingLeaf {
  id: string;
  color: string;
  size: number;
  left: number;
  delay: number;
  duration: number;
  swayX: number[];
  rotate: number[];
}

interface Cloud {
  id: string;
  scale: number;
  top: number;
  duration: number;
  delay: number;
}

interface Bird {
  id: string;
  top: number;
  duration: number;
  delay: number;
  scale: number;
}

interface RainDrop {
  id: string;
  left: number;
  delay: number;
  duration: number;
  opacity: number;
}

export default function AmbientWallpaper({ weatherMode = "sunny", isNight = false }: AmbientWallpaperProps) {
  // 1. Moving Glowing Orbs (adapted for Day/Night)
  const orbs = useMemo<Orb[]>(() => {
    const colors = isNight
      ? [
          "rgba(6, 182, 212, 0.05)",  // Cyan extremely dark soft
          "rgba(15, 23, 42, 0.4)",    // Deep slate
          "rgba(30, 41, 59, 0.5)",    // Slate background fill
          "rgba(16, 185, 129, 0.04)", // Soft deep green
          "rgba(99, 102, 241, 0.05)", // Soft indigo glow
        ]
      : [
          "rgba(16, 185, 129, 0.12)", // Emerald soft
          "rgba(52, 211, 153, 0.10)", // Teal-ish light
          "rgba(255, 255, 255, 0.80)",// Crisp bright white
          "rgba(240, 253, 244, 0.85)",// Light pale green
          "rgba(110, 231, 183, 0.08)",// Light mint
        ];

    return Array.from({ length: 12 }).map((_, idx) => {
      const size = 150 + Math.random() * 250;
      const initialX = Math.random() * 100;
      const initialY = Math.random() * 100;
      
      const driftX = [0, (Math.random() - 0.5) * 120, (Math.random() - 0.5) * 120, 0];
      const driftY = [0, (Math.random() - 0.5) * 120, (Math.random() - 0.5) * 120, 0];
      const duration = 22 + Math.random() * 25;
      const pulseScale = [1, 1.25 + Math.random() * 0.25, 0.85 + Math.random() * 0.15, 1];

      return {
        id: `orb-${idx}`,
        color: colors[idx % colors.length],
        size,
        initialX,
        initialY,
        driftX,
        driftY,
        duration,
        pulseScale,
      };
    });
  }, [isNight]);

  // 2. Generate floating/falling leaves (Red, Green, Blue)
  const fallingLeaves = useMemo<FloatingLeaf[]>(() => {
    const leafColors = [
      "rgba(239, 68, 68, 0.20)",   // Red
      "rgba(248, 113, 113, 0.16)", // Coral pinkish red
      "rgba(16, 185, 129, 0.20)",  // Green
      "rgba(52, 211, 153, 0.16)",  // Soft Mint Green
      "rgba(59, 130, 246, 0.20)",  // Blue
      "rgba(96, 165, 250, 0.16)",  // Sky blue
    ];

    return Array.from({ length: 26 }).map((_, idx) => {
      const size = 14 + Math.random() * 18;
      const left = Math.random() * 100;
      const delay = Math.random() * 12;
      const duration = (weatherMode === "windy" || weatherMode === "monsoon") 
        ? 6 + Math.random() * 5   // falls much faster in high winds
        : 12 + Math.random() * 12;
      
      const swayAmount = (weatherMode === "windy" || weatherMode === "monsoon")
        ? 60 + Math.random() * 80  // sways wildly in storm/wind
        : 25 + Math.random() * 40;
      const swayX = [0, swayAmount, -swayAmount * 0.5, 0];
      const rotate = [0, 240 + Math.random() * 180, 480 + Math.random() * 360];

      return {
        id: `falling-leaf-${idx}`,
        color: leafColors[idx % leafColors.length],
        size,
        left,
        delay,
        duration,
        swayX,
        rotate,
      };
    });
  }, [weatherMode]);

  // 3. Clouds (Soft moving clouds)
  const clouds = useMemo<Cloud[]>(() => {
    return Array.from({ length: 5 }).map((_, i) => ({
      id: `cloud-${i}`,
      scale: 0.6 + Math.random() * 0.7,
      top: 5 + Math.random() * 25,
      duration: 55 + Math.random() * 40,
      delay: i * -12, // staggered starts
    }));
  }, []);

  // 4. Gentle Birds Soaring
  const birds = useMemo<Bird[]>(() => {
    return Array.from({ length: 4 }).map((_, i) => ({
      id: `bird-${i}`,
      top: 10 + Math.random() * 35,
      duration: 25 + Math.random() * 15,
      delay: i * -6,
      scale: 0.4 + Math.random() * 0.4,
    }));
  }, []);

  // 5. Rain Drops (for Rain / Monsoon transition)
  const rainDrops = useMemo<RainDrop[]>(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: `rain-${i}`,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 0.8 + Math.random() * 0.7,
      opacity: 0.2 + Math.random() * 0.5,
    }));
  }, []);

  return (
    <div 
      className={`fixed inset-0 -z-20 overflow-hidden pointer-events-none select-none transition-all duration-1000 ${
        isNight 
          ? "bg-gradient-to-b from-[#020617] via-[#070f2e] to-[#011411]" 
          : "bg-gradient-to-tr from-[#f0fbf4] via-[#fafaf9] to-[#f4fbf7]"
      }`}
    >
      {/* Night Sky Stars */}
      {isNight && (
        <div className="absolute inset-0 opacity-40">
          {[...Array(30)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                width: Math.random() * 2 + 1,
                height: Math.random() * 2 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 70}%`,
                animationDuration: `${2 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Soft overlay grids for texture */}
      <div 
        className="absolute inset-0 opacity-[0.015]" 
        style={{
          backgroundImage: `radial-gradient(#10b981 1px, transparent 1px)`,
          backgroundSize: "24px 24px"
        }}
      />
      
      {/* Moving Ambient Glowing Orbs */}
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full pointer-events-none mix-blend-multiply"
          style={{
            left: `${orb.initialX}%`,
            top: `${orb.initialY}%`,
            width: orb.size,
            height: orb.size,
            backgroundColor: orb.color,
            filter: "blur(60px)",
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            x: orb.driftX,
            y: orb.driftY,
            scale: orb.pulseScale,
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Volumetric Sun Rays / Sunbeams from Top-Right Corner (Only in daytime) */}
      {!isNight && (
        <div className="absolute -top-24 -right-24 w-[750px] h-[750px] pointer-events-none select-none overflow-hidden opacity-30 md:opacity-40">
          <motion.div
            className="w-full h-full rounded-full origin-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
            style={{
              background: "radial-gradient(circle, rgba(253,224,71,0.22) 0%, rgba(253,224,71,0.05) 55%, transparent 80%)",
            }}
          />
          <motion.svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full text-amber-100/15 fill-current origin-top-right scale-110"
            animate={{ 
              rotate: [0, 8, -5, 0],
              opacity: [0.6, 0.95, 0.7, 0.6]
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <path d="M 100 0 L 0 25 L 0 45 Z" />
            <path d="M 100 0 L 15 100 L 32 100 Z" />
            <path d="M 100 0 L 52 100 L 72 100 Z" />
            <path d="M 100 0 L 88 100 L 98 100 Z" />
            <path d="M 100 0 L 0 65 L 0 85 Z" />
          </motion.svg>
        </div>
      )}

      {/* 1. Soft Moving Clouds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {clouds.map((cloud) => (
          <motion.div
            key={cloud.id}
            className="absolute opacity-20 md:opacity-30"
            style={{
              top: `${cloud.top}%`,
              left: `-20%`,
              scale: cloud.scale,
            }}
            animate={{ x: "125vw" }}
            transition={{
              duration: cloud.duration,
              delay: cloud.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* Simple Elegant Cloud SVG shape */}
            <svg width="180" height="70" viewBox="0 0 180 70" fill={isNight ? "#475569" : "#ffffff"}>
              <path d="M30,50 C15,50 5,40 5,28 C5,15 18,8 32,12 C40,4 62,2 75,10 C88,2 110,6 118,18 C128,10 148,12 152,24 C165,18 175,28 175,40 C175,48 165,52 152,50 C145,50 142,50 142,50 L30,50 Z" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* 2. Gentle Soaring Birds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {birds.map((bird) => (
          <motion.div
            key={bird.id}
            className="absolute text-slate-400/30"
            style={{
              top: `${bird.top}%`,
              left: `-10%`,
              scale: bird.scale,
            }}
            animate={{
              x: "115vw",
              y: [0, -15, 10, 0]
            }}
            transition={{
              x: { duration: bird.duration, delay: bird.delay, repeat: Infinity, ease: "linear" },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            {/* Origami avian silhouette */}
            <svg width="24" height="20" viewBox="0 0 24 20" fill="currentColor">
              <path d="M 0,10 L 12,8 L 24,10 L 15,13 L 12,20 L 9,13 Z" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* 3. Floating pollen / light particles */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`pollen-particle-${i}`}
            className="absolute rounded-full bg-white/75 shadow-[0_0_12px_rgba(255,255,255,0.9)]"
            style={{
              width: 3 + i,
              height: 3 + i,
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 3) * 18}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, i * 8 - 20, 0],
              opacity: [0.1, 0.7, 0.1],
              scale: [0.8, 1.25, 0.8],
            }}
            transition={{
              duration: 12 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* 4. Wind Lines Flowing across background */}
      {(weatherMode === "windy" || weatherMode === "monsoon") && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, idx) => (
            <motion.div
              key={`wind-${idx}`}
              className="absolute h-[1px] bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent"
              style={{
                width: "250px",
                top: `${20 + idx * 15}%`,
                left: "-30%",
              }}
              animate={{ x: "135vw" }}
              transition={{
                duration: 4 + idx * 1.5,
                repeat: Infinity,
                delay: idx * 0.8,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      {/* 5. Rain particles if state is rainy / monsoon */}
      {(weatherMode === "rainy" || weatherMode === "monsoon") && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-slate-900/10">
          {rainDrops.map((drop) => (
            <motion.div
              key={drop.id}
              className="absolute w-[1.5px] bg-blue-300/40"
              style={{
                left: `${drop.left}%`,
                height: "35px",
                top: "-10%",
                transform: "rotate(15deg)",
              }}
              initial={{ y: "-10%" }}
              animate={{ y: "110vh" }}
              transition={{
                duration: drop.duration,
                delay: drop.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      {/* 6. Dynamic Drifting Leaves (Red, Green, Blue) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {fallingLeaves.map((leaf) => (
          <motion.div
            key={leaf.id}
            className="absolute origin-center"
            style={{
              left: `${leaf.left}%`,
              top: `-5%`,
              width: leaf.size,
              height: leaf.size,
            }}
            initial={{ y: "-10%", opacity: 0 }}
            animate={{
              y: "115vh",
              x: leaf.swayX,
              rotate: leaf.rotate,
              opacity: [0, 0.75, 0.75, 0],
            }}
            transition={{
              duration: leaf.duration,
              delay: leaf.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-sm">
              <path
                d="M 20,4 C 32,10 36,26 20,36 C 4,26 8,10 20,4 Z"
                fill={leaf.color}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
              />
              <path
                d="M 20,4 L 20,36"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* 7. Immersive Drooping Foliage (Red, Green, Blue) from the top corners */}
      {/* Top Left Drooping Foliage */}
      <div className={`absolute top-0 left-0 w-80 h-80 pointer-events-none select-none origin-top-left transition-opacity duration-1000 ${isNight ? "opacity-20" : "opacity-35 md:opacity-45"}`}>
        <motion.svg
          viewBox="0 0 200 200"
          className="w-full h-full overflow-visible"
          animate={{ rotate: [0, 2.5, -1.5, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M 0,0 C 40,20 80,50 120,70" fill="none" stroke="#047857" strokeWidth="3" strokeLinecap="round" />
          
          <path d="M 40,15 C 60,10 80,30 50,45 C 30,50 20,30 40,15 Z" fill="rgba(16, 185, 129, 0.75)" />
          <path d="M 75,32 C 100,25 110,50 85,62 C 65,70 55,50 75,32 Z" fill="rgba(239, 68, 68, 0.65)" />
          <path d="M 105,52 C 130,45 135,75 112,82 C 90,90 85,70 105,52 Z" fill="rgba(59, 130, 246, 0.6)" />
          
          <path d="M 20,5 C 20,50 10,90 30,120" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
          <path d="M 16,55 C 5,65 -5,85 8,90 C 20,95 25,75 16,55 Z" fill="rgba(239, 68, 68, 0.55)" />
          <path d="M 25,95 C 15,110 5,130 22,132 C 35,135 32,110 25,95 Z" fill="rgba(16, 185, 129, 0.7)" />
        </motion.svg>
      </div>

      {/* Top Right Drooping Foliage */}
      <div className={`absolute top-0 right-0 w-80 h-80 pointer-events-none select-none origin-top-right transition-opacity duration-1000 scale-x-[-1] ${isNight ? "opacity-20" : "opacity-35 md:opacity-45"}`}>
        <motion.svg
          viewBox="0 0 200 200"
          className="w-full h-full overflow-visible"
          animate={{ rotate: [0, -2, 1.5, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <path d="M 0,0 C 40,20 80,50 120,70" fill="none" stroke="#065f46" strokeWidth="3" strokeLinecap="round" />
          
          <path d="M 40,15 C 60,10 80,30 50,45 C 30,50 20,30 40,15 Z" fill="rgba(59, 130, 246, 0.65)" />
          <path d="M 75,32 C 100,25 110,50 85,62 C 65,70 55,50 75,32 Z" fill="rgba(16, 185, 129, 0.7)" />
          <path d="M 105,52 C 130,45 135,75 112,82 C 90,90 85,70 105,52 Z" fill="rgba(239, 68, 68, 0.6)" />
          
          <path d="M 20,5 C 20,50 10,90 30,120" fill="none" stroke="#065f46" strokeWidth="2" strokeLinecap="round" />
          <path d="M 16,55 C 5,65 -5,85 8,90 C 20,95 25,75 16,55 Z" fill="rgba(16, 185, 129, 0.75)" />
          <path d="M 25,95 C 15,110 5,130 22,132 C 35,135 32,110 25,95 Z" fill="rgba(59, 130, 246, 0.55)" />
        </motion.svg>
      </div>

      {/* 8. Animated Grass wavering at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none overflow-visible flex items-end justify-between px-1 bg-gradient-to-t from-emerald-950/5 to-transparent">
        {[...Array(24)].map((_, idx) => (
          <motion.svg
            key={`grass-${idx}`}
            width="20"
            height="35"
            viewBox="0 0 20 40"
            className="text-emerald-700/20 fill-current overflow-visible"
            style={{
              marginLeft: "-4px",
              marginRight: "-4px",
            }}
            animate={{
              rotate: (weatherMode === "windy" || weatherMode === "monsoon")
                ? [-6, 12, -6] // sways heavily
                : [-2, 3, -2],
              scaleY: [1, 1.05, 1],
            }}
            transition={{
              duration: (weatherMode === "windy" || weatherMode === "monsoon") ? 1.5 + idx * 0.1 : 3 + idx * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <path d="M 10 40 Q 5 20, 0 0 Q 8 20, 10 40" />
            <path d="M 10 40 Q 15 15, 20 5 Q 12 25, 10 40" />
          </motion.svg>
        ))}
      </div>

      {/* Elegant Sprouting Vines/Plants on Bottom-Left and Bottom-Right corners */}
      <div className="absolute bottom-0 left-0 right-0 h-[220px] pointer-events-none select-none flex justify-between px-4 md:px-12 items-end">
        {/* Left Sprout */}
        <div className="relative w-44 h-48 opacity-[0.22] md:opacity-[0.28]">
          <svg viewBox="0 0 100 120" className="w-full h-full overflow-visible">
            <motion.path
              d="M 10 120 C 12 90, 25 70, 30 40 C 32 25, 24 15, 20 5"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 1, 0] }}
              transition={{ duration: 18, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
            />
            <motion.path
              d="M 23 80 C 15 75, 5 80, 2 95 C 10 98, 20 90, 23 80 Z"
              fill="#059669"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 0, 1, 1, 0], opacity: [0, 0, 0.9, 0.9, 0] }}
              transition={{ duration: 18, times: [0, 0.25, 0.45, 0.9, 1], repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
            />
            <motion.path
              d="M 28 60 C 40 55, 48 65, 46 80 C 38 82, 30 72, 28 60 Z"
              fill="#34d399"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 0, 1, 1, 0], opacity: [0, 0, 0.9, 0.9, 0] }}
              transition={{ duration: 18, times: [0, 0.35, 0.55, 0.9, 1], repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
            />
          </svg>
        </div>

        {/* Right Sprout */}
        <div className="relative w-44 h-48 opacity-[0.22] md:opacity-[0.28] scale-x-[-1]">
          <svg viewBox="0 0 100 120" className="w-full h-full overflow-visible">
            <motion.path
              d="M 15 120 C 20 95, 30 75, 32 45 C 33 30, 26 18, 22 8"
              fill="none"
              stroke="#059669"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 1, 0] }}
              transition={{ duration: 20, repeat: Infinity, repeatDelay: 1, ease: "easeInOut", delay: 1.5 }}
            />
            <motion.path
              d="M 24 82 C 16 77, 8 82, 5 96 C 13 99, 22 92, 24 82 Z"
              fill="#10b981"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 0, 1, 1, 0], opacity: [0, 0, 0.9, 0.9, 0] }}
              transition={{ duration: 20, times: [0, 0.22, 0.42, 0.9, 1], repeat: Infinity, repeatDelay: 1, ease: "easeInOut", delay: 1.5 }}
            />
          </svg>
        </div>
      </div>

      {/* Subtle bottom environmental mist gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-white/80 to-transparent pointer-events-none dark:from-[#020617]/90" />
    </div>
  );
}
