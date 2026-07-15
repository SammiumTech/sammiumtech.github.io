import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { audioService } from "../utils/audioService";

interface PhotonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  soundType?: "tap" | "pulse" | "confirm";
  hoverSoundType?: "tick" | "shimmer" | "sparkle";
  showOrbit?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
}

interface Spark {
  id: number;
  angle: number;
  distance: number;
  size: number;
}

export default function PhotonButton({
  children,
  variant = "primary",
  soundType = "tap",
  hoverSoundType = "tick",
  showOrbit = true,
  className = "",
  onClick,
  onMouseEnter,
  ...props
}: PhotonButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [sparkId, setSparkId] = useState(0);

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(true);
    audioService.playHover(hoverSoundType, 0.4);

    // Create rapid particle sparks
    const newSparks: Spark[] = Array.from({ length: 5 }).map((_, i) => ({
      id: sparkId + i,
      angle: Math.random() * Math.PI * 2,
      distance: 15 + Math.random() * 25,
      size: Math.random() * 2.5 + 1,
    }));
    setSparks(newSparks);
    setSparkId((prev) => prev + 5);

    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setSparks([]);
  };

  const handleMouseDown = () => {
    // Spatial mechanical pressed sound
    audioService.playPressed("haptic");
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    audioService.playClick(soundType);

    // Click burst particles
    const burstSparks: Spark[] = Array.from({ length: 12 }).map((_, i) => ({
      id: sparkId + i,
      angle: (i / 12) * Math.PI * 2 + Math.random() * 0.2,
      distance: 30 + Math.random() * 40,
      size: Math.random() * 3.5 + 1.5,
    }));
    setSparks(burstSparks);
    setSparkId((prev) => prev + 12);

    setTimeout(() => {
      setSparks([]);
    }, 600);

    if (onClick) onClick(e);
  };

  // Build crystalline clipped-corner theme class
  let baseTheme = "";
  if (variant === "primary") {
    baseTheme = "bg-cyan-500/10 border-cyan-400/40 text-cyan-400 hover:bg-cyan-400/20 hover:border-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.05)] hover:shadow-[0_0_20px_rgba(0,243,255,0.2)]";
  } else if (variant === "secondary") {
    baseTheme = "bg-violet-500/10 border-violet-400/40 text-violet-400 hover:bg-violet-400/20 hover:border-violet-400 shadow-[0_0_15px_rgba(189,0,255,0.05)] hover:shadow-[0_0_20px_rgba(189,0,255,0.2)]";
  } else if (variant === "danger") {
    baseTheme = "bg-rose-500/10 border-rose-400/40 text-rose-400 hover:bg-rose-400/20 hover:border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.05)] hover:shadow-[0_0_20px_rgba(244,63,94,0.2)]";
  } else {
    baseTheme = "bg-slate-950/20 border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20";
  }

  return (
    <button
      {...props}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      style={{
        clipPath: "polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)",
      }}
      className={`relative inline-flex items-center justify-center px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider border transition-all duration-300 ${baseTheme} ${className}`}
    >
      {/* Outer Orbit Light Ring */}
      {showOrbit && isHovered && (
        <div className="absolute inset-0 border border-cyan-400/30 -m-1.5 rounded animate-pulse-slow pointer-events-none" />
      )}

      {/* Tiny Photon Particles on hover/click */}
      <AnimatePresence>
        {sparks.map((s) => {
          const x = Math.cos(s.angle) * s.distance;
          const y = Math.sin(s.angle) * s.distance;
          return (
            <motion.span
              key={s.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x, y, opacity: 0, scale: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                position: "absolute",
                width: s.size,
                height: s.size,
                borderRadius: "50%",
                backgroundColor: variant === "secondary" ? "#bd00ff" : "#00f3ff",
                boxShadow: `0 0 6px ${variant === "secondary" ? "#bd00ff" : "#00f3ff"}`,
                pointerEvents: "none",
                zIndex: 20,
              }}
            />
          );
        })}
      </AnimatePresence>

      {/* Button content */}
      <span className="relative z-10 flex items-center gap-1.5">
        {children}
      </span>
    </button>
  );
}
