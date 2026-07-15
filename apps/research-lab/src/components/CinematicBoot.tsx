import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cpu, Network, Shield, Zap, RefreshCw, Radio, Sparkles, Database } from "lucide-react";
import { sounds } from "../utils/sounds";

interface CinematicBootProps {
  operatorName: string;
  onBootComplete: () => void;
}

const BOOT_MESSAGES = [
  { text: "⚡ Power Initializing...", sound: "beep", delay: 600 },
  { text: "🧠 Loading Neural Engine Matrix...", sound: "laser", delay: 700 },
  { text: "🛰 Connecting Satellite Network Mesh...", sound: "beep", delay: 600 },
  { text: "🔋 Starting Quantum Core Protocols...", sound: "singularity", delay: 800 },
  { text: "🤖 Loading Robotics Framework v6.0...", sound: "beep", delay: 500 },
  { text: "🛡 Authenticating User Credentials...", sound: "laser", delay: 600 },
  { text: "👤 Operator Verified. Access Granted.", sound: "beep", delay: 400 },
  { text: "✨ Welcome Back, {name}.", sound: "singularity", delay: 1200 },
  { text: "🌌 Launching Sentinel Research Central Decision Core...", sound: "timejump", delay: 1400 },
];

export const CinematicBoot: React.FC<CinematicBootProps> = ({ operatorName, onBootComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);
  const [awakeningStage, setAwakeningStage] = useState<"none" | "gathering" | "connecting" | "rotating" | "pulsing" | "complete">("none");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Run the cinematic boot sequence
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const runStep = (stepIndex: number) => {
      if (stepIndex >= BOOT_MESSAGES.length) {
        // Trigger AI Awakening transition!
        setAwakeningStage("gathering");
        setAwakeningStarted(true);
        return;
      }

      const step = BOOT_MESSAGES[stepIndex];
      const parsedText = step.text.replace("{name}", operatorName || "Operator");

      setVisibleMessages(prev => [...prev, parsedText]);

      // Play matching sound
      if (step.sound === "beep") {
        sounds.playClick();
      } else if (step.sound === "laser") {
        sounds.playLaser();
      } else if (step.sound === "singularity") {
        sounds.playSingularity();
      } else if (step.sound === "timejump") {
        sounds.playTimeJump();
      }

      timer = setTimeout(() => {
        setCurrentStep(stepIndex + 1);
        runStep(stepIndex + 1);
      }, step.delay);
    };

    runStep(0);

    return () => clearTimeout(timer);
  }, [operatorName]);

  const [awakeningStarted, setAwakeningStarted] = useState(false);
  const stageRef = useRef(awakeningStage);
  const onBootCompleteRef = useRef(onBootComplete);

  // Keep refs in sync
  useEffect(() => {
    onBootCompleteRef.current = onBootComplete;
  }, [onBootComplete]);

  // Keep stageRef in sync with awakeningStage for the animation loop
  useEffect(() => {
    stageRef.current = awakeningStage;
  }, [awakeningStage]);

  // AI Awakening states progression
  useEffect(() => {
    if (!awakeningStarted) return;

    sounds.playSingularity();

    const stageTimers = [
      setTimeout(() => setAwakeningStage("connecting"), 1800),
      setTimeout(() => {
        setAwakeningStage("rotating");
        sounds.playLaser();
      }, 3400),
      setTimeout(() => {
        setAwakeningStage("pulsing");
        sounds.playTimeJump();
      }, 5000),
      setTimeout(() => {
        setAwakeningStage("complete");
        onBootCompleteRef.current();
      }, 6400)
    ];

    return () => stageTimers.forEach(clearTimeout);
  }, [awakeningStarted]);

  const hasCanvasMounted = awakeningStage !== "none";

  // Brain Neural / Quantum particle gather animation canvas
  useEffect(() => {
    if (!hasCanvasMounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles: Array<{
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      startX: number;
      startY: number;
      color: string;
      size: number;
      progress: number;
      speed: number;
    }> = [];

    const numParticles = 220;
    const centerX = width / 2;
    const centerY = height / 2;

    // Generate random star stars that will gather to the core
    for (let i = 0; i < numParticles; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 80 + Math.random() * 40;
      const tX = centerX + Math.cos(angle) * radius;
      const tY = centerY + Math.sin(angle) * radius;

      // Start from off-screen or extreme outer boundaries
      const distance = 400 + Math.random() * 600;
      const sX = centerX + Math.cos(angle) * distance;
      const sY = centerY + Math.sin(angle) * distance;

      particles.push({
        x: sX,
        y: sY,
        startX: sX,
        startY: sY,
        targetX: tX,
        targetY: tY,
        color: i % 3 === 0 ? "rgba(249, 115, 22, 0.9)" : i % 3 === 1 ? "rgba(6, 182, 212, 0.9)" : "rgba(255, 255, 255, 0.95)",
        size: Math.random() * 2 + 1,
        progress: 0,
        speed: 0.01 + Math.random() * 0.012
      });
    }

    let animationFrameId: number;
    let frame = 0;

    const render = () => {
      frame++;
      ctx.fillStyle = "rgba(2, 6, 23, 0.25)";
      ctx.fillRect(0, 0, width, height);

      const currentStage = stageRef.current;
      const isPulse = currentStage === "pulsing";
      const isConnecting = currentStage === "connecting" || currentStage === "rotating" || isPulse;
      const isRotating = currentStage === "rotating" || isPulse;

      // Draw active grids
      ctx.strokeStyle = "rgba(6, 182, 212, 0.02)";
      ctx.lineWidth = 1;
      const gridSize = 40;
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

      // Draw and update particles
      particles.forEach((p, idx) => {
        if (p.progress < 1) {
          p.progress += p.speed;
          if (p.progress > 1) p.progress = 1;

          // Smooth interpolation
          p.x = p.startX + (p.targetX - p.startX) * p.progress;
          p.y = p.startY + (p.targetY - p.startY) * p.progress;
        } else if (isRotating) {
          // Slowly orbit around center
          const angle = (frame * 0.003 + idx * 0.1) % (Math.PI * 2);
          const radius = 80 + (idx % 4) * 12;
          p.x = centerX + Math.cos(angle) * radius;
          p.y = centerY + Math.sin(angle) * radius;
        }

        ctx.fillStyle = p.color;
        ctx.shadowBlur = isPulse ? 15 : 6;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw light beams connecting nodes
      if (isConnecting) {
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i += 8) {
          const pi = particles[i];
          for (let j = i + 8; j < particles.length; j += 12) {
            const pj = particles[j];
            const dx = pi.x - pj.x;
            const dy = pi.y - pj.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 90) {
              ctx.strokeStyle = `rgba(6, 182, 212, ${(1 - dist/90) * 0.18})`;
              ctx.beginPath();
              ctx.moveTo(pi.x, pi.y);
              ctx.lineTo(pj.x, pj.y);
              ctx.stroke();
            }
          }
        }
      }

      // Draw rotating neural rings
      if (isRotating) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(249, 115, 22, 0.4)";
        ctx.beginPath();
        ctx.arc(centerX, centerY, 75, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "rgba(6, 182, 212, 0.3)";
        ctx.setLineDash([15, 30]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, 110, frame * 0.008, frame * 0.008 + Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]); // Reset
      }

      // Expand powerful energy pulse!
      if (isPulse) {
        const pulseRadius = (frame % 60) * 12;
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, 1 - (frame % 60) / 60)})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Screen Flash overlay
        const flashAlpha = Math.max(0, 0.4 - (frame % 60) / 100);
        ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
        ctx.fillRect(0, 0, width, height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [hasCanvasMounted]);

  return (
    <div className="fixed inset-0 z-[999999] bg-[#020412] flex flex-col items-center justify-center font-mono text-slate-100 overflow-hidden select-none">
      
      {/* Immersive interactive visualizer canvas */}
      {awakeningStage !== "none" && (
        <canvas ref={canvasRef} className="absolute inset-0 z-0 block w-full h-full" />
      )}

      {/* Cybernetic overlay scan lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none z-10" />

      <div className="relative z-20 flex flex-col items-center max-w-lg w-full px-6">
        
        {/* Terminal screen text scrolling for Cinematic Boot */}
        {awakeningStage === "none" && (
          <div className="w-full bg-slate-950/90 border border-slate-800 p-6 rounded-2xl shadow-2xl flex flex-col gap-3 min-h-[300px]">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-orange-500 animate-spin-slow" />
                <span className="text-[10px] font-bold text-slate-400 tracking-wider">
                  SENTINEL_COGNITIVE_BOOT //: LEVEL_6
                </span>
              </div>
              <span className="text-[8px] bg-orange-500/10 text-orange-400 px-1.5 py-0.5 rounded border border-orange-500/30">
                ACTIVE COUPLER
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto">
              {visibleMessages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-2 text-xs text-slate-200"
                >
                  <span className="text-orange-500 font-bold shrink-0">&gt;&gt;</span>
                  <span className="leading-relaxed">{msg}</span>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-slate-900 pt-3 flex items-center justify-between text-[9px] text-slate-500">
              <span>PORT: 3000 // QUANTUM</span>
              <span className="animate-pulse">DECODING NEURAL FREQUENCY...</span>
            </div>
          </div>
        )}

        {/* AI Awakening Interactive Holographic HUD */}
        {awakeningStage !== "none" && (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-6 text-center z-10"
            >
              <div className="relative">
                {/* Central brain core spinner */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 rounded-full border border-orange-500/20 border-dashed flex items-center justify-center"
                >
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="w-24 h-24 rounded-full border border-cyan-400/40 border-dotted flex items-center justify-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.4)]">
                      <Zap className="w-6 h-6 text-orange-400 animate-pulse" />
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-cyan-400 tracking-[0.25em] uppercase animate-pulse">
                  {awakeningStage === "gathering" && "• COGNITIVE SYNAPSES GATHERING •"}
                  {awakeningStage === "connecting" && "• NEURAL CHANNELS COUPLING •"}
                  {awakeningStage === "rotating" && "• OVERCLOCK ENVELOPE DOCKING •"}
                  {awakeningStage === "pulsing" && "• SENTINEL AWAKENING •"}
                </span>
                
                <h2 className="text-3xl font-black tracking-[0.15em] text-white uppercase drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] pl-[0.15em]">
                  {awakeningStage === "pulsing" ? "SYSTEM INITIALIZED" : "AI AWAKENING"}
                </h2>

                <p className="text-[10px] text-slate-400 font-mono mt-1 max-w-sm leading-relaxed">
                  {awakeningStage === "gathering" && "Retrieving remote machine coordinates from Satellite Mesh and pooling cognitive weights."}
                  {awakeningStage === "connecting" && "Synchronizing local Express routers and stabilizing bi-directional message loops."}
                  {awakeningStage === "rotating" && "Establishing 8.2 GHz quantum resonance limits for spatial tracking diagnostics."}
                  {awakeningStage === "pulsing" && "Sentinel OS general artificial intelligence has completed integration."}
                </p>
              </div>

              {/* Progress Bar Loader */}
              <div className="w-56 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900 relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 6.0, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        )}

      </div>
    </div>
  );
};
