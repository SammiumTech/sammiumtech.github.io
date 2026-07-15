import React, { useState, useEffect, useRef } from "react";
import { 
  Eye, 
  Activity, 
  Cpu, 
  Brain, 
  Database, 
  Sparkles, 
  TrendingUp, 
  RefreshCw, 
  BarChart2, 
  Shield, 
  Zap, 
  Settings,
  Flame,
  Binary,
  LineChart,
  Radio,
  Clock
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { sounds } from "../utils/sounds";

interface NeuralObservatoryProps {
  isRgbOverdrive: boolean;
}

interface ModelStatus {
  id: string;
  name: string;
  type: string;
  active: boolean;
  load: number;
  temperature: number;
  tokensPerSec: number;
}

interface ExperimentNode {
  id: string;
  name: string;
  status: "active" | "converged" | "mutating";
  confidence: number;
  cycles: number;
}

// Generate nice real-time chart data for the Observatory
const generateInitialChartData = () => {
  return Array.from({ length: 15 }, (_, i) => ({
    time: `${i * 2}s ago`,
    throughput: Math.floor(120 + Math.random() * 50),
    efficiency: Math.floor(88 + Math.random() * 8)
  }));
};

export const NeuralObservatory: React.FC<NeuralObservatoryProps> = ({ isRgbOverdrive }) => {
  const [chartData, setChartData] = useState(generateInitialChartData());
  const [dataProcessed, setDataProcessed] = useState(1400000); // 1.4M starting records
  const [aiConfidence, setAiConfidence] = useState(94); // 94% starting confidence
  const [selectedModel, setSelectedModel] = useState<string>("gemini-flash");
  const [isObserving, setIsObserving] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Models list - exactly 04 running models
  const [models, setModels] = useState<ModelStatus[]>([
    { id: "gemini-flash", name: "Gemini 1.5 Flash Core", type: "Multimodal Fast Reasoning", active: true, load: 45, temperature: 0.4, tokensPerSec: 142 },
    { id: "gemini-pro", name: "Gemini 1.5 Pro Matrix", type: "Deep Cognitive Analytical", active: true, load: 68, temperature: 0.2, tokensPerSec: 48 },
    { id: "antigravity", name: "Antigravity Agent v2.5", type: "Autonomous Pathfinding", active: true, load: 30, temperature: 0.7, tokensPerSec: 92 },
    { id: "sammium-boid", name: "Sammium Swarm Optimizer", type: "Heuristic Particle Drift", active: true, load: 52, temperature: 0.5, tokensPerSec: 210 }
  ]);

  // Experiments list - exactly 12 active/running experiments
  const [experiments, setExperiments] = useState<ExperimentNode[]>([
    { id: "exp-1", name: "Cosmic Ray Midi Synth", status: "active", confidence: 96, cycles: 1240 },
    { id: "exp-2", name: "Self-Repairing Carbon Swarms", status: "active", confidence: 92, cycles: 890 },
    { id: "exp-3", name: "Laser Singularity Lens", status: "converged", confidence: 99, cycles: 4520 },
    { id: "exp-4", name: "5D String Lattice Mapping", status: "active", confidence: 94, cycles: 2310 },
    { id: "exp-5", name: "Bio-Automata swarm bounds", status: "mutating", confidence: 88, cycles: 1840 },
    { id: "exp-6", name: "Parallax Space Dust trails", status: "active", confidence: 95, cycles: 730 },
    { id: "exp-7", name: "Neural Chronos orbit", status: "converged", confidence: 98, cycles: 3100 },
    { id: "exp-8", name: "RGB Tunneling parameters", status: "active", confidence: 93, cycles: 1150 },
    { id: "exp-9", name: "Entropy-guided backprop", status: "mutating", confidence: 85, cycles: 1420 },
    { id: "exp-10", name: "Thermal annealing feed", status: "active", confidence: 97, cycles: 2950 },
    { id: "exp-11", name: "Deep Reinforcement Boids", status: "active", confidence: 91, cycles: 1670 },
    { id: "exp-12", name: "Galactic Node verify loops", status: "converged", confidence: 99, cycles: 5100 }
  ]);

  // Handle live updates to data processing and model loads
  useEffect(() => {
    if (!isObserving) return;

    const interval = setInterval(() => {
      // Increment data processed count dynamically
      setDataProcessed(prev => prev + Math.floor(Math.random() * 12 + 5));
      
      // Sligt fluctuations to AI Confidence around 94%
      setAiConfidence(prev => {
        const drift = (Math.random() - 0.5) * 1.5;
        const next = prev + drift;
        // Clamp between 92% and 96% to stay faithful to 94% core
        return Math.max(92.1, Math.min(95.9, next));
      });

      // Update model loads and metrics
      setModels(prev => 
        prev.map(m => ({
          ...m,
          load: Math.max(15, Math.min(98, m.load + Math.floor((Math.random() - 0.5) * 10))),
          tokensPerSec: Math.max(20, m.tokensPerSec + Math.floor((Math.random() - 0.5) * 12))
        }))
      );

      // Add fresh telemetry data points to chart
      setChartData(prev => {
        const sliced = prev.slice(1);
        return [
          ...sliced,
          {
            time: "0s ago",
            throughput: Math.floor(110 + Math.random() * 65),
            efficiency: Math.floor(90 + Math.random() * 6)
          }
        ];
      });

    }, 2000);

    return () => clearInterval(interval);
  }, [isObserving]);

  // Live particle canvas simulating neural sync lines
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let nodes: { x: number; y: number; vx: number; vy: number; size: number; active: boolean; glow: string }[] = [];

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 400;
      canvas.height = 150;
    };

    resize();
    window.addEventListener("resize", resize);

    // Populate neural nodes
    for (let i = 0; i < 22; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        size: Math.random() * 3 + 1,
        active: Math.random() > 0.3,
        glow: isRgbOverdrive 
          ? (Math.random() > 0.5 ? "#f43f5e" : "#ec4899")
          : (Math.random() > 0.5 ? "#06b6d4" : "#6366f1")
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw links
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 65) {
            ctx.beginPath();
            ctx.strokeStyle = isRgbOverdrive 
              ? `rgba(244, 63, 94, ${(1 - dist / 65) * 0.25})`
              : `rgba(6, 182, 212, ${(1 - dist / 65) * 0.25})`;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw active nodes
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;

        // Bounce borders
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

        ctx.beginPath();
        ctx.fillStyle = n.glow;
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        ctx.fill();

        if (n.active) {
          ctx.beginPath();
          ctx.strokeStyle = n.glow;
          ctx.arc(n.x, n.y, n.size * 2.5, 0, Math.PI * 2);
          ctx.globalAlpha = 0.25;
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, [isRgbOverdrive]);

  const activeModelsCount = models.filter(m => m.active).length;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="neural-observatory-station">
      {/* Top Banner & Primary metrics banner */}
      <div className="lg:col-span-12 flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/90 border border-slate-800 p-4 rounded-xl gap-4 relative overflow-hidden shadow-xl">
        {/* Abstract glowing backdrop */}
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16 opacity-20 transition-all ${
          isRgbOverdrive ? "bg-rose-500" : "bg-cyan-500"
        }`} />

        <div className="flex items-center gap-3 relative z-10">
          <span className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-2xl flex items-center justify-center animate-pulse">🛰️</span>
          <div>
            <div className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">
              COSMIC NEURAL FEED
            </div>
            <h2 className="text-sm font-mono font-bold tracking-wider text-slate-100 flex items-center gap-2">
              AI SYSTEM MONITOR
              <span className={`w-2 h-2 rounded-full animate-ping ${isRgbOverdrive ? "bg-rose-500" : "bg-cyan-400"}`} />
            </h2>
          </div>
        </div>

        {/* Observatory configuration toggle */}
        <div className="flex items-center gap-2.5 relative z-10">
          <button
            onClick={() => {
              sounds.playClick();
              setIsObserving(!isObserving);
            }}
            className={`px-3 py-1.5 rounded font-mono text-[10px] font-bold tracking-wider border cursor-pointer transition-all flex items-center gap-1.5 ${
              isObserving 
                ? "bg-slate-950 text-emerald-400 border-emerald-500/30" 
                : "bg-slate-900/40 text-slate-400 border-slate-800"
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isObserving ? "animate-spin" : ""}`} />
            {isObserving ? "OBSERVATORY LIVE" : "OBSERVATORY PAUSED"}
          </button>
          
          <button
            onClick={() => {
              sounds.playLaser();
              // Reset some metrics
              setDataProcessed(1400000);
            }}
            className="p-1.5 rounded bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-100 transition-all cursor-pointer"
            title="Reset telemetry counters"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* LEFT COLUMN: Main KPI Bento Deck */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {/* Core Stats grid - representing user requested parameters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Models Running: 04 */}
          <div className="p-4 rounded-xl border bg-slate-900/60 hover:bg-slate-900 border-slate-850 hover:border-slate-800 transition-all flex flex-col justify-between h-[125px]">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                Models Running
              </span>
              <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-900/60 px-1.5 py-0.5 rounded">
                SECURE INSTANCES
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-mono font-bold text-slate-100 tracking-tight">
                04
              </span>
              <Cpu className="w-6 h-6 text-cyan-400" />
            </div>
          </div>

          {/* Data Processing: 1.4M records */}
          <div className="p-4 rounded-xl border bg-slate-900/60 hover:bg-slate-900 border-slate-850 hover:border-slate-800 transition-all flex flex-col justify-between h-[125px]">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                Data Processing
              </span>
              <span className="text-xs font-mono text-rose-400 font-bold bg-rose-950/40 border border-rose-900/60 px-1.5 py-0.5 rounded">
                REAL-TIME FEED
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-1">
              <span className="text-2xl font-mono font-bold text-slate-100 tracking-tight">
                {(dataProcessed / 1000000).toFixed(6)}M
              </span>
              <Database className="w-5 h-5 text-rose-400 shrink-0" />
            </div>
          </div>

          {/* Active Experiments: 12 */}
          <div className="p-4 rounded-xl border bg-slate-900/60 hover:bg-slate-900 border-slate-850 hover:border-slate-800 transition-all flex flex-col justify-between h-[125px]">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                Active Experiments
              </span>
              <span className="text-xs font-mono text-pink-400 font-bold bg-pink-950/40 border border-pink-900/60 px-1.5 py-0.5 rounded">
                STATION CONTEXT
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-mono font-bold text-slate-100 tracking-tight">
                12
              </span>
              <Sparkles className="w-5 h-5 text-pink-400" />
            </div>
          </div>

          {/* AI Confidence: 94% */}
          <div className="p-4 rounded-xl border bg-slate-900/60 hover:bg-slate-900 border-slate-850 hover:border-slate-800 transition-all flex flex-col justify-between h-[125px]">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                AI Confidence
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-900/60 px-1.5 py-0.5 rounded">
                INTEGRITY OK
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-mono font-bold text-slate-100 tracking-tight">
                {aiConfidence.toFixed(1)}%
              </span>
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

        </div>

        {/* Real-time Throughput / Computational efficiency charting */}
        <div className="p-4 rounded-xl border bg-slate-950 border-slate-800 flex flex-col justify-between h-[280px]">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-850">
            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <LineChart className="w-4 h-4 text-cyan-400" /> REAL-TIME LOGICAL COMPUTATION FLUX (THROUGHPUT)
            </span>
            <span className="text-[9px] font-mono text-slate-500">
              AVERAGE RATE: 135 vectors/s
            </span>
          </div>

          <div className="flex-1 w-full h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isRgbOverdrive ? "#f43f5e" : "#06b6d4"} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={isRgbOverdrive ? "#f43f5e" : "#06b6d4"} stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 9 }} fontStyle="monospace" />
                <YAxis tick={{ fill: "#64748b", fontSize: 9 }} fontStyle="monospace" domain={[80, 200]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "8px" }}
                  labelStyle={{ color: "#94a3b8", fontFamily: "monospace", fontSize: "10px" }}
                  itemStyle={{ color: "#38bdf8", fontFamily: "monospace", fontSize: "11px" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="throughput" 
                  stroke={isRgbOverdrive ? "#f43f5e" : "#06b6d4"} 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorThroughput)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
            <span>METRIC RESOLUTION: 2.0s</span>
            <span>SYSTEM CONTEXT MATCH: 100%</span>
          </div>
        </div>

        {/* Neural Network Link Canvas (Visual decoration / dynamic simulator) */}
        <div className="p-4 rounded-xl border bg-slate-900/40 border-slate-850 flex flex-col h-[200px]">
          <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-slate-850">
            <span className="text-[10px] font-mono text-slate-400 font-bold flex items-center gap-1">
              <Binary className="w-3.5 h-3.5 text-pink-400" /> LIVE HYPER-DIMENSIONAL LATTICE FEEDS
            </span>
            <span className="text-[9px] font-mono text-slate-500">
              ACTIVE NODE LINK: {isObserving ? "SYNCHRONIZED" : "STATIONARY"}
            </span>
          </div>

          <div className="flex-1 bg-slate-950 rounded border border-slate-850/60 relative overflow-hidden flex items-center justify-center">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            <div className="absolute bottom-3 left-3 bg-slate-950/80 px-2 py-1 rounded border border-slate-800 text-[9px] font-mono text-slate-400">
              NEURAL CONSTRAINTS: STABLE // ENTROPIC RATIO: 0.04
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Running Models Core & Experiment Deck */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Models details matrix */}
        <div className="p-4 rounded-xl border bg-slate-900/95 border-slate-800 flex flex-col h-[325px]">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" /> RUNNING_CORES_INDEX
            </span>
            <span className="text-[9px] font-mono text-slate-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
              {activeModelsCount} / {models.length} CORES
            </span>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {models.map(model => {
              const isSel = selectedModel === model.id;
              return (
                <div 
                  key={model.id}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedModel(model.id);
                  }}
                  onMouseEnter={() => sounds.playHover()}
                  className={`p-2.5 rounded border transition-all cursor-pointer relative ${
                    isSel 
                      ? "bg-slate-950 border-cyan-400/80" 
                      : "bg-slate-900/40 border-slate-850 hover:border-slate-800 hover:bg-slate-900/80"
                  }`}
                >
                  <div className="flex justify-between items-start gap-1">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-slate-100 block">
                        {model.name}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">
                        {model.type}
                      </span>
                    </div>

                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-850 text-[9px] font-mono text-slate-400">
                    <div>
                      <span className="text-slate-500">CORE LOAD:</span>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-0.5 border border-slate-800">
                        <div 
                          className="bg-cyan-400 h-full transition-all duration-1000" 
                          style={{ width: `${model.load}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">TOKENS SPEED:</span>
                      <span className="text-slate-200 block font-bold">{model.tokensPerSec} t/s</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Active Experiments List */}
        <div className="p-4 rounded-xl border bg-slate-900/95 border-slate-800 flex flex-col h-[300px]">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-pink-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-pink-400" /> ACTIVE_EXPERIMENTS (12)
            </span>
            <span className="text-[9px] font-mono text-slate-500">
              STATUS FEEDS
            </span>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {experiments.map(exp => (
              <div 
                key={exp.id}
                className="p-2 bg-slate-950 rounded border border-slate-850 flex items-center justify-between text-[11px] font-mono"
              >
                <div className="min-w-0">
                  <span className="text-slate-200 font-bold block truncate">{exp.name}</span>
                  <span className="text-[9px] text-slate-500">CYCLES: {exp.cycles}c</span>
                </div>

                <div className="text-right shrink-0">
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold block ${
                    exp.status === "active" 
                      ? "bg-cyan-950 text-cyan-400 border border-cyan-900" 
                      : exp.status === "converged"
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-900"
                      : "bg-pink-950 text-pink-400 border border-pink-900"
                  }`}>
                    {exp.status.toUpperCase()}
                  </span>
                  <span className="text-[8px] text-slate-400 block mt-0.5 font-bold">
                    {exp.confidence}% conf
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
