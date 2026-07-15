import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Eye, Shield, Radio, Sparkles, Compass, Cpu, Layers } from "lucide-react";

interface VrHudOverlayProps {
  isVrMode: boolean;
  operatorName: string;
}

export const VrHudOverlay: React.FC<VrHudOverlayProps> = ({ isVrMode, operatorName }) => {
  const [pitch, setPitch] = useState(0.0);
  const [roll, setRoll] = useState(0.0);
  const [yaw, setYaw] = useState(0.0);

  const [shouldRender, setShouldRender] = useState(isVrMode);
  const [isExiting, setIsExiting] = useState(false);

  // Sync isVrMode to local transition flags
  useEffect(() => {
    if (isVrMode) {
      setShouldRender(true);
      setIsExiting(false);
    } else {
      if (shouldRender) {
        setIsExiting(true);
        const timer = setTimeout(() => {
          setShouldRender(false);
          setIsExiting(false);
        }, 1100); // 1.1 seconds elegant shutdown sequence
        return () => clearTimeout(timer);
      }
    }
  }, [isVrMode, shouldRender]);

  // Simulate subtle head tracking movement wiggles on Pitch/Roll/Yaw metrics to look authentic and active
  useEffect(() => {
    if (!isVrMode) return;

    const interval = setInterval(() => {
      setPitch((prev) => {
        const delta = (Math.random() - 0.5) * 0.4;
        return parseFloat((prev + delta).toFixed(2));
      });
      setRoll((prev) => {
        const delta = (Math.random() - 0.5) * 0.3;
        return parseFloat((prev + delta).toFixed(2));
      });
      setYaw((prev) => {
        const delta = (Math.random() - 0.5) * 0.5;
        return parseFloat((prev + delta).toFixed(2));
      });
    }, 180);

    return () => clearInterval(interval);
  }, [isVrMode]);

  if (!shouldRender) return null;

  return (
    <div 
      id="vr-hud-system-overlay" 
      className="fixed inset-0 pointer-events-none z-[100] overflow-hidden select-none font-mono text-cyan-400"
    >
      {/* 1. Custom SVG Fisheye Lens Aberration/Distortion Source Filter */}
      <svg className="absolute w-0 h-0 pointer-events-none" width="0" height="0">
        <defs>
          <filter id="vr-fisheye-filter">
            {/* Fractal noise map creates the authentic lens barrel refraction warp */}
            <feTurbulence type="fractalNoise" baseFrequency="0.003" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* 2. Full screen CRT-like phosphor phosphor grid scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_50%,transparent_50%)] bg-[size:100%_4px] opacity-70" />

      {/* 3. Deep Radial Headset Bezel Mask (Simulates Google Cardboard or advanced Neural Link headset goggles) */}
      <div className="absolute inset-0 bg-radial from-transparent via-slate-950/25 to-slate-950/90 mix-blend-multiply opacity-95 shadow-[inset_0_0_150px_rgba(0,0,0,0.98)]" />

      {/* Dual Circular Lens Vignettes/Scope Brackets in Left and Right Fields */}
      <motion.div 
        animate={isExiting ? { scale: 0.05, opacity: 0, filter: "blur(15px)" } : { scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-0 flex items-center justify-around px-8 lg:px-24"
      >
        
        {/* LEFT LENS HUD */}
        <div className="w-[380px] h-[380px] lg:w-[460px] lg:h-[460px] rounded-full border border-cyan-500/20 relative flex items-center justify-center shadow-[0_0_80px_rgba(6,182,212,0.05)] bg-slate-950/5">
          {/* Outer Rotating Compass ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="absolute inset-4 rounded-full border border-dashed border-cyan-500/15"
          />
          {/* Inner ticks */}
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            className="absolute inset-12 rounded-full border-2 border-dotted border-pink-500/15"
          />
          {/* Targeting reticle crosshair */}
          <div className="absolute w-12 h-px bg-cyan-400/30" />
          <div className="absolute h-12 w-px bg-cyan-400/30" />
          
          {/* Corner target brackets */}
          <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-cyan-400/40" />
          <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-cyan-400/40" />
          <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-cyan-400/40" />
          <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-cyan-400/40" />

          {/* Left specific indicators */}
          <div className="absolute top-16 left-16 text-[8px] tracking-widest text-pink-400/70 uppercase">
            <span>SYS_EYE_L // OK</span>
          </div>
          <div className="absolute bottom-16 right-16 text-[8px] tracking-widest text-cyan-400/70 uppercase flex flex-col items-end">
            <span>FOV // 110.4°</span>
            <span>ZOOM // 1.0X</span>
          </div>
        </div>

        {/* RIGHT LENS HUD */}
        <div className="w-[380px] h-[380px] lg:w-[460px] lg:h-[460px] rounded-full border border-pink-500/20 relative flex items-center justify-center shadow-[0_0_80px_rgba(244,63,94,0.05)] bg-slate-950/5 hidden md:flex">
          {/* Outer Rotating Compass ring */}
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            className="absolute inset-4 rounded-full border border-dashed border-pink-500/15"
          />
          {/* Inner ticks */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="absolute inset-12 rounded-full border-2 border-dotted border-cyan-500/15"
          />
          {/* Targeting reticle crosshair */}
          <div className="absolute w-12 h-px bg-pink-400/30" />
          <div className="absolute h-12 w-px bg-pink-400/30" />

          {/* Corner target brackets */}
          <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-pink-400/40" />
          <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-pink-400/40" />
          <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-pink-400/40" />
          <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-pink-400/40" />

          {/* Right specific indicators */}
          <div className="absolute top-16 right-16 text-[8px] tracking-widest text-cyan-400/70 uppercase">
            <span>SYS_EYE_R // ACTIVE</span>
          </div>
          <div className="absolute bottom-16 left-16 text-[8px] tracking-widest text-pink-400/70 uppercase flex flex-col items-start">
            <span>DISP // AMBIENT</span>
            <span>LAG_METER // 0.14ms</span>
          </div>
        </div>

      </motion.div>

      {/* 4. Left Side Vertical Command Logs Overlay */}
      <motion.div 
        animate={isExiting ? { x: -150, opacity: 0 } : { x: 0, opacity: 0.8 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        className="absolute left-6 top-1/3 flex flex-col gap-1.5 scale-90 lg:scale-100 origin-left"
      >
        <div className="flex items-center gap-1 text-[9px] font-bold text-cyan-400 border-b border-cyan-500/30 pb-1 mb-1">
          <Cpu className="w-3.5 h-3.5" />
          <span>NEURAL TERMINAL DAT</span>
        </div>
        <div className="text-[8px] text-slate-400 flex flex-col gap-0.5 font-mono">
          <span className="text-pink-400">OPERATOR: {operatorName || "KIRITO"}</span>
          <span>LINK_STN: SAMMIUM_3000</span>
          <span>SYNC_RATIO: 98.74%</span>
          <span>IP_PORT: LOCALHOST_3000</span>
          <span>SENSORS: STABLE_4_NODES</span>
          <span className="text-emerald-400 animate-pulse">● FEED: ACTIVE // v5.1</span>
        </div>
      </motion.div>

      {/* 5. Right Side Vertical Attitude Gyro & HUD Pitch telemetry */}
      <motion.div 
        animate={isExiting ? { x: 150, opacity: 0 } : { x: 0, opacity: 0.8 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        className="absolute right-6 top-1/3 flex flex-col gap-2 items-end scale-90 lg:scale-100 origin-right"
      >
        <div className="flex items-center gap-1 text-[9px] font-bold text-pink-400 border-b border-pink-500/30 pb-1 mb-1">
          <Compass className="w-3.5 h-3.5" />
          <span>ATTITUDE GYROSCOPE</span>
        </div>
        <div className="text-[8px] text-slate-400 flex flex-col gap-1 font-mono items-end">
          <div className="flex gap-2">
            <span>PITCH:</span>
            <span className="text-cyan-400 font-bold">{pitch}°</span>
          </div>
          <div className="flex gap-2">
            <span>ROLL:</span>
            <span className="text-cyan-400 font-bold">{roll}°</span>
          </div>
          <div className="flex gap-2">
            <span>YAW:</span>
            <span className="text-cyan-400 font-bold">{yaw}°</span>
          </div>
          <div className="w-24 h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
            <motion.div 
              animate={{ x: [ -12, 12, -12 ] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="h-full w-12 bg-pink-500 rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* 6. Top Center Horizon Pitch lines & Headset calibration stats */}
      <motion.div 
        animate={isExiting ? { y: -100, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-center"
      >
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-950/90 rounded-md border border-cyan-500/30 text-[9px] font-bold tracking-[0.2em] shadow-lg">
          <Radio className="w-3.5 h-3.5 text-pink-500 animate-pulse animate-spin" />
          <span>● VR NEURAL LINK ACTIVE // IMMERSION OVERLAY</span>
        </div>
        <div className="text-[7px] text-slate-500 tracking-widest font-mono">
          GLITCH MAP OVERRIDE ACTIVE // RESOLUTION: WIDE_SCALE
        </div>
      </motion.div>

      {/* 7. Bottom center navigation indicators */}
      <motion.div 
        animate={isExiting ? { y: 100, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-8 text-[9px] text-slate-400 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-850 shadow-md"
      >
        <div className="flex items-center gap-1">
          <span className="text-cyan-400">P_A:</span>
          <span>982.4 HPA</span>
        </div>
        <div className="text-slate-700">|</div>
        <div className="flex items-center gap-1">
          <span className="text-pink-400">LAT:</span>
          <span>35.6895° N</span>
        </div>
        <div className="text-slate-700">|</div>
        <div className="flex items-center gap-1">
          <span className="text-cyan-400">LON:</span>
          <span>139.6917° E</span>
        </div>
      </motion.div>

      {/* 8. Full-screen Retracting Shutdown Grid Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Horizontal retracting grid line */}
        <motion.div 
          initial={{ scaleX: 1, opacity: 0.4 }}
          animate={isExiting 
            ? { scaleX: 0, opacity: [0.5, 1, 0.8, 0] } 
            : { scaleX: 1, opacity: 0.4 }
          }
          transition={{ 
            duration: isExiting ? 1.0 : 0.4, 
            ease: isExiting ? "circIn" : "easeOut" 
          }}
          className="absolute left-0 right-0 h-[1.5px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
          style={{ top: "50%", transformOrigin: "center" }}
        />
        {/* Vertical retracting grid line */}
        <motion.div 
          initial={{ scaleY: 1, opacity: 0.4 }}
          animate={isExiting 
            ? { scaleY: 0, opacity: [0.5, 1, 0.8, 0] } 
            : { scaleY: 1, opacity: 0.4 }
          }
          transition={{ 
            duration: isExiting ? 1.0 : 0.4, 
            ease: isExiting ? "circIn" : "easeOut" 
          }}
          className="absolute top-0 bottom-0 w-[1.5px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
          style={{ left: "50%", transformOrigin: "center" }}
        />

        {/* Concentric collapsing radar ring */}
        {isExiting && (
          <motion.div
            initial={{ scale: 1.5, opacity: 0.7, filter: "blur(0px)" }}
            animate={{ scale: 0, opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.95, ease: "circIn" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full border border-pink-500/80 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
          />
        )}
      </div>

    </div>
  );
};
