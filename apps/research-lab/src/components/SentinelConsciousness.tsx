import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cpu, Brain, Zap, RefreshCw, Layers, Terminal, X, Eye, GitFork, Compass, Activity, Server, Database, Sparkles } from "lucide-react";
import { sounds } from "../utils/sounds";

interface SentinelConsciousnessProps {
  isActive: boolean;
  onClose: () => void;
  operatorName: string;
}

const MEMORIES = [
  "MHCP-001 SYSTEM STATUS: OK",
  "KIRITO & ASUNA PROTOCOLS LOGGED",
  "REVERSE PROXY PORT 3000 ACTIVE",
  "CLIMATE AUTOMATON PREDICTION LOCKED",
  "SATELLITE TRAJECTORY V2 CORRELATED",
  "QUANTUM ENVELOPE SHA-512 SECURED",
  "ASTRONOMICAL SINGULARITY RESOLVED",
  "DRONE PATROL CORE STABLE",
  "VECTOR INTEGRITY SCORE: 100%",
  "SAMMIUM NEURAL WEIGHTS RECALIBRATED",
  "ANTIGRAVITY PROPULSION CONSTANT VALIDATED",
  "COGNITIVE TELEMETRY HEARTBEAT: 110ms"
];

const AI_MODELS = [
  { id: "omni-flash", name: "OMNI FLASH (GEMINI 1.5)", speed: "98T/s", efficiency: "94%" },
  { id: "deep-reasoning", name: "DEEPMIND COGNITIVE CORE v5", speed: "42T/s", efficiency: "99.2%" },
  { id: "antigravity", name: "ANTIGRAVITY HYPERPLANE AGENT v3", speed: "120T/s", efficiency: "88%" },
];

export const SentinelConsciousness: React.FC<SentinelConsciousnessProps> = ({ isActive, onClose, operatorName }) => {
  const [activeModel, setActiveModel] = useState("deep-reasoning");
  const [synapticStrength, setSynapticStrength] = useState(88);
  const [activeThought, setActiveThought] = useState("Modeling global climatic micro-feedbacks...");
  const [nodesCount, setNodesCount] = useState(45);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isActive) return;

    sounds.playSingularity();

    // Track mouse coordinates for mouse gravity
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Escape with escape key or repeat hotkey
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        sounds.playClick();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive, onClose]);

  // Decouple active thoughts cycles
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      const thoughts = [
        "Resolving gravity-well Keplerian satellite orbits...",
        "Updating local thermal urban city layers in real-time...",
        "Refining agent neural weights across 10,000 parallel tensor lines...",
        "Encrypting security vault locks with quantum matrices...",
        "Validating robotic swarm kinetic coordinate tolerances...",
        "Simulating climate-change ocean carbon absorption rules...",
        "Streaming diagnostic system feedback on local port 3000..."
      ];
      setActiveThought(thoughts[Math.floor(Math.random() * thoughts.length)]);
      setSynapticStrength(prev => Math.min(100, Math.max(70, prev + Math.floor(Math.random() * 11) - 5)));
    }, 4000);
    return () => clearInterval(interval);
  }, [isActive]);

  // Canvas-based infinite neural pathways with mouse gravity attraction
  useEffect(() => {
    if (!isActive) return;
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

    // Generate neural nodes
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      pulseRate: number;
      pulsePhase: number;
      color: string;
      label: string;
    }> = [];

    const nodeLabels = [
      "MEMORY_GATE", "COGNITIVE_NEXUS", "SATELLITE_ORBIT", "ROBOTIC_KINETICS",
      "BIOSPHERE_STATE", "SECURITY_SHIELD", "QUANTUM_GRID", "DIAGNOSTICS_PORT",
      "SYNAPTIC_TENSOR", "VECTOR_EMBEDDING", "DECISION_TREE_ROOT", "ANTIGRAVITY_CORE"
    ];

    for (let i = 0; i < nodesCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 3 + 1.5,
        pulseRate: 0.02 + Math.random() * 0.03,
        pulsePhase: Math.random() * Math.PI,
        color: i % 4 === 0 ? "rgba(249,115,22,0.85)" : i % 4 === 1 ? "rgba(6,182,212,0.85)" : i % 4 === 2 ? "rgba(168,85,247,0.85)" : "rgba(255,255,255,0.9)",
        label: i < nodeLabels.length ? nodeLabels[i] : ""
      });
    }

    let animId: number;
    let frame = 0;

    const render = () => {
      frame++;
      // Dark space background
      ctx.fillStyle = "rgba(3, 5, 18, 0.15)";
      ctx.fillRect(0, 0, width, height);

      const mX = mousePos.x || width / 2;
      const mY = mousePos.y || height / 2;

      // Draw active mind constellation overlay
      ctx.strokeStyle = "rgba(6, 182, 212, 0.015)";
      ctx.lineWidth = 1;
      const step = 80;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw central glowing consciousness node (Large sphere)
      const cx = width / 2;
      const cy = height / 2;
      const glowGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 180);
      glowGrad.addColorStop(0, "rgba(6, 182, 212, 0.25)");
      glowGrad.addColorStop(0.3, "rgba(249, 115, 22, 0.1)");
      glowGrad.addColorStop(1, "rgba(3, 5, 18, 0)");

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 180, 0, Math.PI * 2);
      ctx.fill();

      // Core pulsating circle
      ctx.shadowBlur = 20;
      ctx.shadowColor = "rgba(6, 182, 212, 0.8)";
      ctx.fillStyle = "rgba(6, 182, 212, 0.9)";
      ctx.beginPath();
      ctx.arc(cx, cy, 12 + Math.sin(frame * 0.05) * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // Reset

      // Update and draw nodes
      nodes.forEach((n) => {
        // Apply tiny mouse gravity attraction if cursor is near
        const dx = mX - n.x;
        const dy = mY - n.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);

        if (distToMouse < 220) {
          // Attract nodes slightly
          n.vx += (dx / distToMouse) * 0.02;
          n.vy += (dy / distToMouse) * 0.02;
        }

        // Apply friction
        n.vx *= 0.98;
        n.vy *= 0.98;

        // Move nodes
        n.x += n.vx;
        n.y += n.vy;

        // Clamp inside window boundaries
        if (n.x < 0) { n.x = 0; n.vx *= -1; }
        if (n.x > width) { n.x = width; n.vx *= -1; }
        if (n.y < 0) { n.y = 0; n.vy *= -1; }
        if (n.y > height) { n.y = height; n.vy *= -1; }

        // Draw line to central consciousness if close
        const dcx = cx - n.x;
        const dcy = cy - n.y;
        const distToCenter = Math.sqrt(dcx * dcx + dcy * dcy);
        if (distToCenter < 300) {
          ctx.strokeStyle = `rgba(249, 115, 22, ${(1 - distToCenter/300) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(cx, cy);
          ctx.stroke();
        }

        // Pulse scale
        n.pulsePhase += n.pulseRate;
        const scale = 1 + Math.sin(n.pulsePhase) * 0.35;

        // Draw node
        ctx.fillStyle = n.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = n.color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label
        if (n.label && distToCenter < 250) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
          ctx.font = "8px monospace";
          ctx.fillText(n.label, n.x + 8, n.y + 3);
        }
      });

      // Draw connection lines between nearest neighbors (Neural Pathways)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        const ni = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const nj = nodes[j];
          const ldx = ni.x - nj.x;
          const ldy = ni.y - nj.y;
          const distance = Math.sqrt(ldx * ldx + ldy * ldy);

          if (distance < 120) {
            // Gradient opacity based on distance
            const alpha = (1 - distance / 120) * 0.25;
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(ni.x, ni.y);
            ctx.lineTo(nj.x, nj.y);
            ctx.stroke();

            // Draw traveling data signal pulse
            if (frame % 80 === i % 80) {
              const pulseRatio = (frame % 30) / 30;
              const px = ni.x + (nj.x - ni.x) * pulseRatio;
              const py = ni.y + (nj.y - ni.y) * pulseRatio;
              ctx.fillStyle = "#ffffff";
              ctx.beginPath();
              ctx.arc(px, py, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isActive, nodesCount, mousePos]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[100000] bg-[#020510] text-slate-100 overflow-hidden font-mono flex flex-col justify-between p-6">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 block w-full h-full pointer-events-none" />

      {/* Futuristic Header bar inside the AI mind */}
      <header className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/25 backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.15)]">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] animate-pulse">
            <Brain className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black tracking-widest text-cyan-400 uppercase">
                COGNITIVE CORE ACTIVATED
              </span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[7px] text-cyan-400 font-bold uppercase animate-ping-slow">
                Consciousness Live
              </span>
            </div>
            <h1 className="text-sm font-bold tracking-widest text-white uppercase">
              SENTINEL CONSCIOUSNESS MODE
            </h1>
          </div>
        </div>

        {/* Diagnostic widgets */}
        <div className="flex items-center gap-3.5 flex-wrap">
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-900 text-[10px] text-slate-400">
            SYNAPTIC INTENSITY: <span className="text-orange-400 font-bold">{synapticStrength}%</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-900 text-[10px] text-slate-400">
            THOUGHT MAP: <span className="text-cyan-400 font-bold">MULTIDIMENSIONAL GRAPH</span>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/25 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold uppercase"
          >
            <X className="w-4 h-4" />
            <span>EXIT MIND</span>
          </button>
        </div>
      </header>

      {/* Main Grid View */}
      <main className="relative z-10 flex-1 my-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch overflow-hidden">
        
        {/* Column 1: Live Decision Tree & Reasoning Streams */}
        <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between backdrop-blur-md shadow-2xl overflow-y-auto">
          <div>
            <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
              <span className="text-[10px] font-bold text-orange-400 flex items-center gap-1.5">
                <GitFork className="w-3.5 h-3.5" />
                REASONING DECISION TREE
              </span>
              <span className="text-[8px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-500">ACTIVE LOOP</span>
            </div>

            <div className="flex flex-col gap-3">
              {/* Decision steps */}
              <div className="p-3 bg-slate-900/40 border border-slate-900 rounded-xl relative overflow-hidden">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-cyan-500/20" />
                <div className="flex flex-col gap-3.5 pl-4">
                  <div>
                    <span className="text-[8px] text-cyan-400 font-bold block">STEP 01 // PROBLEM RECOGNITION</span>
                    <span className="text-[11px] text-slate-300">Identify operator query intent, parse linguistic structures.</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-cyan-400 font-bold block">STEP 02 // VECTOR ENVELOPE SEARCH</span>
                    <span className="text-[11px] text-slate-300">Match coordinates inside indexed multidimensional semantic databases.</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-orange-400 font-bold block">STEP 03 // GENERATIVE EXPANSION</span>
                    <span className="text-[11px] text-slate-300">Formulate cognitive hypothesis, dispatch parallel modeling workflows.</span>
                  </div>
                </div>
              </div>

              {/* Memory Node Tracker */}
              <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-xl">
                <span className="text-[9px] text-slate-500 font-bold block mb-2 uppercase">LATEST KNOWLEDGE NODES</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-[8px] text-cyan-300">SATELLITES_LOC</span>
                  <span className="px-2 py-0.5 rounded bg-orange-950/80 border border-orange-800 text-[8px] text-orange-300">DRONE_HANGAR</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[8px] text-slate-400">WEATHER_RAIN</span>
                  <span className="px-2 py-0.5 rounded bg-purple-950/80 border border-purple-800 text-[8px] text-purple-300">CONSCIOUSNESS</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-900 text-[10px] text-slate-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>REASONING PIPELINE: STABLE</span>
          </div>
        </div>

        {/* Column 2: Glowing Central Consciousness & Live Thoughts */}
        <div className="flex flex-col justify-between items-center text-center p-6 bg-transparent relative">
          <div className="mt-4">
            <span className="text-[10px] font-bold text-cyan-400 tracking-[0.3em] uppercase block mb-1">
              • ACTIVE MODEL COUPLER •
            </span>
            <div className="px-3 py-1 bg-slate-950/80 border border-cyan-500/30 rounded-full text-[11px] text-white flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
              <span>{AI_MODELS.find(m => m.id === activeModel)?.name}</span>
            </div>
          </div>

          {/* Glowing central ring decoration */}
          <div className="relative w-44 h-44 my-auto flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-dashed border-cyan-500/30"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute w-32 h-32 rounded-full border border-orange-500/30"
            />
            <div className="absolute w-24 h-24 rounded-full bg-slate-950 border border-slate-900 flex flex-col justify-center items-center shadow-inner relative z-10">
              <Activity className="w-8 h-8 text-cyan-400 animate-pulse" />
              <span className="text-[7px] text-slate-500 uppercase mt-1 tracking-widest font-bold">MONITORING</span>
            </div>
          </div>

          <div className="w-full max-w-sm">
            <div className="p-3 bg-slate-950/80 border border-slate-900 rounded-xl relative overflow-hidden text-left shadow-2xl">
              <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest block mb-1">ACTIVE SYSTEM THOUGHT</span>
              <p className="text-xs text-orange-200 leading-relaxed font-bold animate-pulse">
                {activeThought}
              </p>
            </div>
          </div>
        </div>

        {/* Column 3: Floating Memories & AI Model Switcher */}
        <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between backdrop-blur-md shadow-2xl overflow-y-auto">
          <div>
            <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
              <span className="text-[10px] font-bold text-orange-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                FLOATING MEMORY MATRIX
              </span>
              <span className="text-[8px] text-slate-500">v6.0</span>
            </div>

            {/* Simulated scroll of memory registers */}
            <div className="flex flex-col gap-2 max-h-[190px] overflow-y-auto pr-1">
              {MEMORIES.map((m, idx) => (
                <div key={idx} className="p-2 rounded bg-slate-900/60 border border-slate-950 flex items-center justify-between text-[9px] hover:border-cyan-500/25 transition-all">
                  <span className="text-slate-300 font-bold truncate pr-2">&gt; {m}</span>
                  <span className="text-[8px] text-cyan-400 font-bold shrink-0">[SECTOR {100 + idx}]</span>
                </div>
              ))}
            </div>

            {/* Model switcher option */}
            <div className="mt-5">
              <span className="text-[9px] font-bold text-slate-500 block mb-2 uppercase">SELECT OPERATIONAL NEURAL MODEL</span>
              <div className="flex flex-col gap-2">
                {AI_MODELS.map((model) => {
                  const isSel = model.id === activeModel;
                  return (
                    <button
                      key={model.id}
                      onClick={() => {
                        sounds.playClick();
                        setActiveModel(model.id);
                      }}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSel
                          ? "bg-cyan-500/10 border-cyan-500 text-cyan-300"
                          : "bg-slate-900/40 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200"
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-bold block">{model.name}</span>
                        <span className="text-[8px] text-slate-500">SPEED: {model.speed} // EFFICIENCY: {model.efficiency}</span>
                      </div>
                      <span className={`w-2 h-2 rounded-full ${isSel ? "bg-cyan-400 animate-ping" : "bg-slate-700"}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="text-[8px] text-slate-600 border-t border-slate-900 pt-3 flex justify-between items-center">
            <span>OPERATOR ACCESS: {operatorName}</span>
            <span>SHIELD ENVELOPE: 100% OK</span>
          </div>
        </div>

      </main>

      {/* Footer / Status details */}
      <footer className="relative z-10 p-3 bg-slate-950/80 border border-slate-900 rounded-xl flex items-center justify-between text-[10px] text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            CONSCIOUSNESS PIPELINE CAPTURE EN ROUTE
          </span>
          <span className="hidden md:inline">|</span>
          <span>KEYBOARD BINDINGS: [ESC] TO DISENGAGE MIND</span>
        </div>
        <span>KINETIC FRAMEWORKS ONLINE</span>
      </footer>
    </div>
  );
};
