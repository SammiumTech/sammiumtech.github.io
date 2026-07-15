import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface HolographicPanelProps {
  children: React.ReactNode;
  className?: string;
  theme?: "cyan" | "violet" | "neutral";
  headerText?: string;
  isBathingInLight?: boolean;
}

export default function HolographicPanel({
  children,
  className = "",
  theme = "neutral",
  headerText,
  isBathingInLight = false,
}: HolographicPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Dynamic 3D mouse tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = panelRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left; // x coordinate inside panel
    const y = e.clientY - rect.top;  // y coordinate inside panel

    // Convert coordinates to degrees of rotation (Max +/- 4 degrees for subtle elegance)
    const rotateX = -((y / rect.height) - 0.5) * 8;
    const rotateY = ((x / rect.width) - 0.5) * 8;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  // Determine border and glass class
  const glassClass =
    theme === "cyan"
      ? "glass-panel-cyan"
      : theme === "violet"
      ? "glass-panel-violet"
      : "glass-panel";

  return (
    <div
      ref={panelRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.005)`
          : `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`,
        transition: isHovered ? "none" : "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={`glass-panel relative rounded-2xl ${glassClass} ${className} group`}
    >
      {/* Dynamic Laser scanner scanline animation when hovered */}
      {isHovered && <div className="hologram-scanner" />}

      {/* Futuristic corner frame overlays */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400/40 rounded-tl z-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400/40 rounded-tr z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400/40 rounded-bl z-20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400/40 rounded-br z-20 pointer-events-none" />

      {/* Sci-fi diagnostic coordinate marks */}
      <div className="absolute top-2 right-4 text-[7px] font-mono text-slate-500/60 pointer-events-none tracking-widest hidden md:block">
        [ SYS_MODEL_COH_V4.2 ]
      </div>

      {headerText && (
        <div className="border-b border-white/5 px-6 py-3 flex items-center justify-between bg-slate-950/20">
          <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            {headerText}
          </span>
          <span className="text-[8px] font-mono text-slate-500">
            SEC_LVL_MAX
          </span>
        </div>
      )}

      {/* Panel inner padding container */}
      <div className="p-5 md:p-6 relative z-10">
        {children}
      </div>

      {/* Volumetric background glow effect */}
      <div
        className={`absolute -inset-20 rounded-full opacity-10 transition-opacity duration-700 pointer-events-none z-0 blur-3xl ${
          theme === "cyan"
            ? "bg-cyan-500/20 group-hover:opacity-15"
            : theme === "violet"
            ? "bg-violet-500/20 group-hover:opacity-15"
            : "bg-cyan-500/10 group-hover:opacity-15"
        }`}
      />
    </div>
  );
}
