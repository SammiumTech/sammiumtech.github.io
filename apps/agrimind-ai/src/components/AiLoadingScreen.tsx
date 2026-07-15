import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sprout, Sparkles, Cpu, ShieldCheck, Sun, Eye, Zap, Compass, RefreshCw } from "lucide-react";
import { audioManager } from "../lib/audioManager";

interface AiLoadingScreenProps {
  onComplete: () => void;
}

// Calibration Text sequences mapped to timelines
const calibrationTexts = [
  "Loading Crop Intelligence...",
  "Connecting Weather Satellites...",
  "Calibrating Soil Models (N-P-K)...",
  "Synchronizing Zambales Market Indices...",
  "Initializing Pest Detection Neural Nets...",
  "Preparing Sentinel AI Assistant..."
];

export default function AiLoadingScreen({ onComplete }: AiLoadingScreenProps) {
  const [isBooted, setIsBooted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<1 | 2 | 3 | 4>(1);
  const [loadingText, setLoadingText] = useState("Initializing Agricultural Intelligence...");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Easter Egg & Sound states
  const [isEasterEggActive, setIsEasterEggActive] = useState(false);
  const [isHummingbirdLanded, setIsHummingbirdLanded] = useState(false);
  const [isAiLogoIlluminated, setIsAiLogoIlluminated] = useState(false);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Track which stages have triggered sound
  const playedStages = useRef<Record<number, boolean>>({});

  // 1. Time-Based Progression
  useEffect(() => {
    if (!isBooted || isEasterEggActive) return;

    const startTime = Date.now();
    const duration = 9000; // 9 seconds total calibration

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, (elapsed / duration) * 100);
      setProgress(Math.round(currentProgress));

      // Mappings to Stages and trigger sound identity stages
      let currentStage: 1 | 2 | 3 | 4 = 1;
      if (currentProgress < 25) {
        currentStage = 1;
        setStage(1);
        setLoadingText("Initializing Agricultural Intelligence...");
      } else if (currentProgress < 55) {
        currentStage = 2;
        setStage(2);
        const textIdx = Math.min(
          calibrationTexts.length - 1,
          Math.floor(((currentProgress - 25) / 30) * calibrationTexts.length)
        );
        setLoadingText(calibrationTexts[textIdx]);
      } else if (currentProgress < 85) {
        currentStage = 3;
        setStage(3);
        if (currentProgress < 62) {
          setLoadingText("Planting Seed & Stimulating Soil Microbes...");
        } else if (currentProgress < 70) {
          setLoadingText("Germinating Root Structure & Tiny Sprout...");
        } else if (currentProgress < 78) {
          setLoadingText("Spreading Foliage & Synthesizing Chlorophyll...");
        } else {
          setLoadingText("Flowering Buds & Ripening Crop for Harvest...");
        }
      } else {
        currentStage = 4;
        setStage(4);
        setLoadingText("Converting Biological Models to Neural Circuits...");
      }

      // Trigger stage audio if not already triggered
      if (!playedStages.current[currentStage]) {
        playedStages.current[currentStage] = true;
        audioManager.triggerStageAudio(currentStage);
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        // Start the beautiful final Easter Egg sequence instead of immediate completion!
        setIsEasterEggActive(true);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isBooted, isEasterEggActive]);

  // Handle the immersive 100% Easter Egg sequence
  useEffect(() => {
    if (!isEasterEggActive) return;

    setProgress(100);
    setLoadingText("Sentinel AgriMind AI Calibration Complete.");

    // Timeline of Easter Egg triggers:
    // 1. Immediately: Flower blooms completely, and hummingbird flies in
    // 2. At 2.5s: Hummingbird lands, logo illuminates, heartbeat pulse plays
    const t1 = setTimeout(() => {
      setIsHummingbirdLanded(true);
      setIsAiLogoIlluminated(true);
      audioManager.playHeartbeat(); // Deep heartbeat bass pulse!
    }, 2500);

    // 3. At 3.2s: Beautiful Vision Pro / Tesla AI Activation chime & voice speaks
    const t2 = setTimeout(() => {
      audioManager.triggerStageAudio(5); // Play AI Online confirmation chime & voice greetings
    }, 3200);

    // 4. At 6.8s: Sequence complete, transition and fade to dashboard!
    const t3 = setTimeout(() => {
      onCompleteRef.current();
    }, 7200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isEasterEggActive]);

  // 2. High-Performance Canvas for Holographic Particles & Scanline Glow
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particles array
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
    }
    const particles: Particle[] = [];
    const maxParticles = 60;

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2.5 + 0.5,
        color: i % 2 === 0 ? "16, 185, 129" : "6, 182, 212", // emerald & cyan
        alpha: Math.random() * 0.4 + 0.1
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle gridlines
      ctx.strokeStyle = "rgba(16, 185, 129, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 45;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update & Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();

        // Trace connections to near particles (Neural AI mesh)
        particles.forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.07 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      });

      // Ambient top-down light sweep scanline
      const scanlineY = (Date.now() / 15) % (height + 200) - 100;
      const gradient = ctx.createLinearGradient(0, scanlineY - 40, 0, scanlineY + 40);
      gradient.addColorStop(0, "rgba(6, 182, 212, 0)");
      gradient.addColorStop(0.5, "rgba(16, 185, 129, 0.05)");
      gradient.addColorStop(1, "rgba(6, 182, 212, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanlineY - 45, width, 90);

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  if (!isBooted) {
    return (
      <div className="fixed inset-0 bg-[#070b0e] z-[9999] flex flex-col items-center justify-center overflow-hidden font-sans select-none text-white p-4">
        {/* Holographic background grid & canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-80" />

        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none" />

        {/* Top Brand Tag */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] tracking-[0.25em] font-bold text-emerald-300 uppercase">
              Sammium Research Labs
            </span>
          </div>
          <h2 className="text-xs text-stone-400 font-medium tracking-widest mt-1">SENTINEL ECOSYSTEM</h2>
        </div>

        {/* Main Glassmorphic Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-[90%] max-w-xl p-8 rounded-3xl bg-slate-950/60 border border-white/10 backdrop-blur-3xl shadow-[0_24px_50px_rgba(0,0,0,0.5)] flex flex-col items-center text-center overflow-hidden"
        >
          {/* Logo & Ring */}
          <div className="relative w-36 h-36 flex items-center justify-center mb-6">
            <motion.div
              className="absolute inset-0 rounded-full border border-dashed border-emerald-400/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center relative overflow-hidden bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
              <Sprout className="w-12 h-12 text-emerald-400 animate-pulse" />
            </div>
          </div>

          <div className="space-y-1 mb-6">
            <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-100 to-emerald-300 tracking-wider uppercase font-sans">
              Sentinel AgriMind AI
            </h1>
            <p className="text-[10px] text-emerald-300/80 font-mono tracking-widest uppercase">
              Quantum Agricultural Diagnostics & Core
            </p>
          </div>

          {/* Sound Identity Feature Cards */}
          <div className="w-full space-y-2.5 mb-6 text-left">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5">
              <span className="text-sm mt-0.5">🍃</span>
              <div>
                <h4 className="text-[11px] font-bold text-white tracking-wide uppercase">Ambient Nature Synthesizer</h4>
                <p className="text-[10px] text-stone-400 mt-0.5 leading-relaxed">
                  Procedural wind noise, water droplets, and woodland bird chirps dynamically synthesized in real-time.
                </p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5">
              <span className="text-sm mt-0.5">☀️</span>
              <div>
                <h4 className="text-[11px] font-bold text-white tracking-wide uppercase">Sync-Acoustic Calibration</h4>
                <p className="text-[10px] text-stone-400 mt-0.5 leading-relaxed">
                  Plant germination, roots growing, and flower blooming are physically simulated with localized sound.
                </p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5">
              <span className="text-sm mt-0.5">🤖</span>
              <div>
                <h4 className="text-[11px] font-bold text-white tracking-wide uppercase">Vocal Intelligence Synthesis</h4>
                <p className="text-[10px] text-stone-400 mt-0.5 leading-relaxed">
                  Calm, balanced vocal feedback providing real-time weather and irrigation recommendations.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              audioManager.resume();
              setIsBooted(true);
            }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-mono font-black text-[10px] tracking-widest uppercase shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer border border-emerald-400/20"
          >
            [ Power Up AI & Calibrate Core ]
          </button>
        </motion.div>

        <button
          onClick={onComplete}
          className="absolute bottom-8 text-[10px] tracking-widest text-stone-500 uppercase hover:text-white transition-all cursor-pointer bg-white/5 border border-white/5 px-4 py-2 rounded-xl backdrop-blur-md"
        >
          Skip System Calibration &rarr;
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#030712] z-[9999] flex flex-col items-center justify-center overflow-hidden font-sans select-none text-white">
      {/* Canvas layer */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-80" />

      {/* Decorative ambient background spots */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Top Brand Tag */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="absolute top-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5"
      >
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] tracking-[0.25em] font-bold text-emerald-300 uppercase">
            Sammium Research Labs
          </span>
        </div>
        <h2 className="text-xs text-stone-400 font-medium tracking-widest mt-1">SENTINEL ECOSYSTEM</h2>
      </motion.div>

      {/* Main Glassmorphic Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-[90%] max-w-xl p-8 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-2xl shadow-[0_24px_50px_rgba(0,0,0,0.4)] flex flex-col items-center text-center overflow-hidden"
      >
        {/* Futuristic Glass Reflection */}
        <div className="absolute -inset-y-12 left-0 w-20 bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-12 -translate-x-32 animate-[shimmer_8s_infinite] pointer-events-none" />

        {/* 1. Logo & Neural Ring */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-8">
          {/* External Holographic Circular Scanner Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-dashed border-cyan-400/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute -inset-2.5 rounded-full border border-double border-emerald-500/20"
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />

          {/* Glowing AI Scanner Target Indicator */}
          {stage === 2 && (
            <motion.div
              className="absolute -inset-4 rounded-full border-2 border-emerald-400/70"
              animate={{
                scale: [0.95, 1.15, 0.95],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          {/* Central Logo Container */}
          <motion.div
            className={`w-24 h-24 rounded-2xl flex items-center justify-center relative overflow-hidden transition-all duration-1000 ${
              isAiLogoIlluminated
                ? "bg-gradient-to-br from-emerald-500 to-cyan-400 shadow-[0_0_50px_rgba(34,211,238,0.9),inset_0_0_20px_rgba(255,255,255,0.6)] border-white scale-110"
                : stage === 4
                ? "bg-cyan-500/25 shadow-[0_0_35px_rgba(6,182,212,0.6)] border-cyan-300"
                : "bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
            }`}
            animate={{
              scale: isAiLogoIlluminated ? [1.1, 1.15, 1.1] : [1, 1.05, 1],
            }}
            transition={{
              duration: isAiLogoIlluminated ? 1 : 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {isAiLogoIlluminated ? (
              <Sparkles className="w-14 h-14 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
            ) : stage === 4 ? (
              <Cpu className="w-12 h-12 text-cyan-300 animate-pulse" />
            ) : (
              <Sprout className="w-12 h-12 text-emerald-400" />
            )}

            {/* Glowing vertical pulse sweep */}
            <motion.div
              className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-60"
              animate={{ y: [-48, 48] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>

        {/* 2. Platform Title */}
        <div className="space-y-1 mb-8">
          <motion.h1
            initial={{ letterSpacing: "0.1em" }}
            animate={{ letterSpacing: "0.22em" }}
            transition={{ duration: 1.5 }}
            className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-100 to-emerald-300 tracking-widest uppercase font-sans"
          >
            Sentinel AgriMind AI
          </motion.h1>
          <div className="text-[10px] text-cyan-400/90 font-mono tracking-widest uppercase font-semibold flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 animate-spin" />
            Quantum Agricultural Core Active
          </div>
        </div>

        {/* 3. Immersive Growth Animation Stage */}
        <div className="relative w-full h-44 mb-6 bg-black/30 border border-white/5 rounded-2xl flex flex-col items-center justify-center overflow-hidden">
          
          {/* Grid lines in visual chamber */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

          {/* Soil line & ground */}
          <div className="absolute bottom-10 left-0 right-0 h-[2px] bg-emerald-950/40" />

          {/* Stage Rendering */}
          <AnimatePresence mode="wait">
            {isEasterEggActive ? (
              <motion.div
                key="easteregg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {/* Immersive Easter Egg with Blooming Flower & Hummingbird */}
                <svg className="w-48 h-36 overflow-visible" viewBox="0 0 100 80">
                  {/* Soil layer */}
                  <rect x="0" y="65" width="100" height="15" fill="#3f2d24" opacity="0.3" rx="3" />
                  <line x1="0" y1="65" x2="100" y2="65" stroke="#4a3b32" strokeWidth="1.5" strokeDasharray="3 3" />

                  {/* Roots */}
                  <path d="M 50,65 C 50,70 48,74 46,78 M 50,65 C 50,71 53,75 55,79" fill="none" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round" />

                  {/* Stem */}
                  <path d="M 50,65 C 50,55 49,42 48,28" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Leaves */}
                  <path d="M 49,48 C 42,46 37,38 41,36 C 45,34 48,42 49,48" fill="#4ade80" stroke="#15803d" strokeWidth="0.5" />
                  <path d="M 48,38 C 55,36 60,28 56,26 C 52,24 49,32 48,38" fill="#22c55e" stroke="#166534" strokeWidth="0.5" />

                  {/* Sun / Rays */}
                  <circle cx="80" cy="20" r="12" fill="rgba(253, 224, 71, 0.25)" className="blur-md animate-pulse" />

                  {/* Bloomed Flower */}
                  <g style={{ transformOrigin: "48px 28px" }} className="animate-pulse">
                    <circle cx="48" cy="24" r="3.5" fill="#facc15" />
                    <circle cx="43" cy="28" r="3.5" fill="#facc15" />
                    <circle cx="53" cy="28" r="3.5" fill="#facc15" />
                    <circle cx="48" cy="32" r="3.5" fill="#facc15" />
                    <circle cx="48" cy="28" r="3" fill="#ea580c" />
                  </g>

                  {/* Fruits */}
                  <circle cx="36" cy="40" r="3" fill="#ef4444" className="shadow-lg" />
                  <circle cx="58" cy="35" r="2.5" fill="#ef4444" className="shadow-lg" />

                  {/* Hummingbird flying in, hovering, and landing! */}
                  <motion.g
                    initial={{ x: 120, y: -20, scale: 0, rotate: -20, opacity: 0 }}
                    animate={isHummingbirdLanded ? {
                      x: 35, // Beak at cx=43, cy=28 (left petal)
                      y: 20,
                      scale: 0.9,
                      rotate: 5,
                      opacity: 1
                    } : {
                      x: [120, 75, 45, 52, 35],
                      y: [-20, 15, -5, 10, 20],
                      scale: [0, 0.8, 0.9, 0.9, 0.9],
                      rotate: [-20, 15, -10, 5, 5],
                      opacity: [0, 1, 1, 1, 1]
                    }}
                    transition={{
                      duration: 3,
                      ease: "easeOut"
                    }}
                    style={{ transformOrigin: "center" }}
                  >
                    <path d="M 0,0 C 6,-6 14,-6 17,-1 C 20,4 17,11 9,13 C 4,14 -2,11 -3,7 Z" fill="#0d9488" />
                    <circle cx="-3" cy="3" r="3.5" fill="#115e59" />
                    <line x1="-6" y1="3" x2="-16" y2="2" stroke="#1f2937" strokeWidth="0.8" />
                    <motion.path
                      d="M 6,1 C 9,-10 14,-14 16,-12 C 18,-10 13,3 6,1 Z"
                      fill="#14b8a6"
                      animate={isHummingbirdLanded ? {
                        scaleY: [-0.6, 0.6],
                        rotate: [-10, 10]
                      } : {
                        scaleY: [-1, 1],
                        rotate: [-25, 25]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: isHummingbirdLanded ? 0.22 : 0.08,
                        ease: "linear"
                      }}
                      style={{ transformOrigin: "6px 1px" }}
                    />
                    <circle cx="-4" cy="3.5" r="0.6" fill="#ffffff" />
                  </motion.g>
                </svg>

                {/* Sparkling pollen particles */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(12)].map((_, idx) => (
                    <motion.div
                      key={`pollen-egg-${idx}`}
                      className="absolute w-1.5 h-1.5 rounded-full bg-yellow-300 shadow-[0_0_6px_rgba(250,204,21,0.9)]"
                      style={{
                        left: `${42 + (idx % 4) * 5}%`,
                        top: `${30 + (idx % 3) * 8}%`,
                      }}
                      animate={{
                        y: [-10, -35],
                        x: [0, (idx - 6) * 4],
                        opacity: [0, 1, 0],
                        scale: [0.5, 1.2, 0.5]
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: idx * 0.2,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <>
                {stage === 1 && (
                  <motion.div
                    key="stage1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center"
                  >
                    {/* Neural particles / floating AI nodes visualization */}
                    <div className="flex gap-4 items-center">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={`init-node-${i}`}
                          className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                          animate={{
                            y: [-12, 12, -12],
                            scale: [0.8, 1.2, 0.8],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 2 + i * 0.4,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400/70 mt-3 tracking-widest">
                      ESTABLISHING COGNITIVE DEEP MESH...
                    </span>
                  </motion.div>
                )}

                {stage === 2 && (
                  <motion.div
                    key="stage2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-4"
                  >
                    {/* Scanner graphic */}
                    <div className="relative w-24 h-24 border border-cyan-500/20 rounded-full flex items-center justify-center">
                      <motion.div
                        className="absolute inset-1 rounded-full border-t-2 border-cyan-400"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                      <Compass className="w-8 h-8 text-cyan-300 animate-pulse" />
                    </div>
                    <span className="text-[9px] font-mono text-cyan-300 tracking-wider mt-3 uppercase">
                      CALIBRATING LOCAL TELEMETRY CORRELATIONS
                    </span>
                  </motion.div>
                )}

                {stage === 3 && (
                  <motion.div
                    key="stage3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {/* Complete Plant Lifecycle procedurally simulated */}
                    <svg className="w-48 h-36 overflow-visible" viewBox="0 0 100 80">
                      {/* Soil layer */}
                      <rect x="0" y="65" width="100" height="15" fill="#3f2d24" opacity="0.3" rx="3" />
                      <line x1="0" y1="65" x2="100" y2="65" stroke="#4a3b32" strokeWidth="1.5" strokeDasharray="3 3" />

                      {/* Seed Drop (Only active early in progress) */}
                      {progress >= 55 && progress < 62 && (
                        <motion.circle
                          cx="50"
                          cy="40"
                          r="2.5"
                          fill="#8b5a2b"
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 22, opacity: 1 }}
                          transition={{ type: "spring", bounce: 0.5, duration: 1 }}
                        />
                      )}

                      {/* Root Creeping (underground) */}
                      {progress >= 60 && (
                        <motion.path
                          d="M 50,65 C 50,70 48,74 46,78 M 50,65 C 50,71 53,75 55,79"
                          fill="none"
                          stroke="#86efac"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      )}

                      {/* Stem growing */}
                      {progress >= 62 && (
                        <motion.path
                          d="M 50,65 C 50,55 49,42 48,28"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, ease: "easeInOut" }}
                        />
                      )}

                      {/* Leaves unfolding */}
                      {progress >= 70 && (
                        <>
                          {/* Leaf Left */}
                          <motion.path
                            d="M 49,48 C 42,46 37,38 41,36 C 45,34 48,42 49,48"
                            fill="#4ade80"
                            stroke="#15803d"
                            strokeWidth="0.5"
                            initial={{ scale: 0, originX: "49px", originY: "48px" }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                          {/* Leaf Right */}
                          <motion.path
                            d="M 48,38 C 55,36 60,28 56,26 C 52,24 49,32 48,38"
                            fill="#22c55e"
                            stroke="#166534"
                            strokeWidth="0.5"
                            initial={{ scale: 0, originX: "48px", originY: "38px" }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                          />
                        </>
                      )}

                      {/* Flowering stage & morning rays */}
                      {progress >= 78 && (
                        <>
                          {/* Solar beam/Sun sparkle */}
                          <motion.circle
                            cx="80"
                            cy="20"
                            r="12"
                            fill="rgba(253, 224, 71, 0.15)"
                            className="blur-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0.7, 1] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                          />
                          {/* Dew drops sparking */}
                          <motion.circle
                            cx="42"
                            cy="36"
                            r="1"
                            fill="#67e8f9"
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          />

                          {/* Blooming flower */}
                          <motion.g
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 120, delay: 0.2 }}
                            style={{ transformOrigin: "48px 28px" }}
                          >
                            {/* Petals */}
                            <circle cx="48" cy="24" r="3.5" fill="#facc15" />
                            <circle cx="43" cy="28" r="3.5" fill="#facc15" />
                            <circle cx="53" cy="28" r="3.5" fill="#facc15" />
                            <circle cx="48" cy="32" r="3.5" fill="#facc15" />
                            {/* Center */}
                            <circle cx="48" cy="28" r="3" fill="#ea580c" />
                          </motion.g>
                        </>
                      )}

                      {/* Harvest - Fruits appearing */}
                      {progress >= 83 && (
                        <motion.g
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
                          style={{ transformOrigin: "48px 28px" }}
                        >
                          {/* Ripened crops hanging */}
                          <circle cx="36" cy="40" r="3" fill="#ef4444" className="shadow-lg" />
                          <circle cx="58" cy="35" r="2.5" fill="#ef4444" className="shadow-lg" />
                        </motion.g>
                      )}
                    </svg>
                    {/* Sparkle particles floating around the plant */}
                    {progress >= 78 && (
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(6)].map((_, idx) => (
                          <motion.div
                            key={`pollen-${idx}`}
                            className="absolute w-1 h-1 rounded-full bg-yellow-300 shadow-[0_0_4px_rgba(250,204,21,0.8)]"
                            style={{
                              left: `${40 + idx * 4}%`,
                              top: `${35 + (idx % 2) * 10}%`,
                            }}
                            animate={{
                              y: [-10, -25],
                              x: [0, (idx - 3) * 5],
                              opacity: [0, 1, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: idx * 0.3,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {stage === 4 && (
                  <motion.div
                    key="stage4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-cyan-950/20"
                  >
                    {/* Circuit Grid Plant Transformation */}
                    <div className="relative w-36 h-28 flex flex-col items-center justify-center">
                      <motion.div
                        className="w-16 h-16 rounded-full border border-cyan-400 bg-cyan-950/40 shadow-[0_0_25px_rgba(34,211,238,0.4)] flex items-center justify-center"
                        animate={{
                          scale: [0.96, 1.08, 0.96],
                          boxShadow: [
                            "0 0 15px rgba(34,211,238,0.3)",
                            "0 0 35px rgba(34,211,238,0.6)",
                            "0 0 15px rgba(34,211,238,0.3)",
                          ],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Zap className="w-7 h-7 text-cyan-300 animate-pulse" />
                      </motion.div>
                      {/* Cybernetic upwards flows */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={`pulse-up-${i}`}
                          className="absolute w-[1.5px] bg-cyan-400"
                          style={{
                            left: `${35 + i * 15}%`,
                            height: "45px",
                            bottom: "0",
                          }}
                          animate={{
                            opacity: [0.2, 1, 0.2],
                            backgroundColor: ["#10b981", "#22d3ee", "#10b981"],
                          }}
                          transition={{ duration: 1, delay: i * 0.3, repeat: Infinity }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-cyan-300 tracking-[0.2em] uppercase mt-2">
                      BIOLOGICAL ENERGY TO NEURAL SCHEMATICS COMPLETE
                    </span>
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>

          {/* Glowing bottom-shadow within chamber */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-emerald-500/10 to-transparent pointer-events-none" />
        </div>

        {/* 4. Progress Text & Metric Monitor */}
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between px-1 text-xs">
            <span className="font-mono text-stone-400 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              STATUS: <strong className="text-emerald-400">CALIBRATING</strong>
            </span>
            <span className="font-mono text-cyan-300 font-black tracking-widest">{progress}%</span>
          </div>

          {/* Premium Glowing Progress Bar */}
          <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5 relative p-[1px]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-400 relative"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            >
              {/* Sparkle on leading edge of progress */}
              <div className="absolute top-1/2 -translate-y-1/2 right-0 w-4 h-4 bg-white rounded-full blur-[3px] animate-pulse" />
            </motion.div>
          </div>

          {/* Subtext and Loader Sequence State */}
          <div className="min-h-[20px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={loadingText}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="text-xs text-stone-300 font-bold tracking-wide italic"
              >
                {loadingText}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* 5. Cybernetic Calibration Status Grid (Live HUD) */}
        <div className="grid grid-cols-2 gap-3.5 w-full mt-8 pt-6 border-t border-white/10 text-left">
          <div className="bg-white/[0.03] border border-white/5 p-3 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[9px] text-stone-400 uppercase tracking-widest block">AI CONFIDENCE</span>
              <span className="text-xs font-mono font-black text-white">99.8%</span>
            </div>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="bg-white/[0.03] border border-white/5 p-3 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[9px] text-stone-400 uppercase tracking-widest block">WEATHER MODELLING</span>
              <span className="text-xs font-mono font-black text-white">98.9%</span>
            </div>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>

          <div className="bg-white/[0.03] border border-white/5 p-3 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[9px] text-stone-400 uppercase tracking-widest block">SOIL ANALYSIS</span>
              <span className="text-xs font-mono font-black text-white">READY</span>
            </div>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="bg-white/[0.03] border border-white/5 p-3 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[9px] text-stone-400 uppercase tracking-widest block">SATELLITE SYNC</span>
              <span className="text-xs font-mono font-black text-emerald-400">ONLINE</span>
            </div>
            <Eye className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
        </div>
      </motion.div>

      {/* Skip Calibration control */}
      <button
        onClick={onComplete}
        className="absolute bottom-8 text-[10px] tracking-widest text-stone-500 uppercase hover:text-white transition-all cursor-pointer bg-white/5 border border-white/5 px-4 py-2 rounded-xl backdrop-blur-md"
      >
        Skip System Calibration &rarr;
      </button>
    </div>
  );
}
