import React, { useState, useEffect } from "react";
import { 
  FlaskConical, 
  Plus, 
  Trash2, 
  Play, 
  BookOpen, 
  History, 
  LineChart as ChartIcon, 
  Check, 
  Activity, 
  TrendingUp, 
  Zap, 
  Cpu, 
  Eye, 
  Layers, 
  RotateCcw,
  Sparkles,
  Award
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { sounds } from "../utils/sounds";

interface AIExperiment {
  id: string;
  project: string;
  category: string;
  status: "Active" | "Testing" | "Archived";
  progress: number;
  goal: string;
  researchNotes: string;
  versionHistory: { version: string; date: string; changes: string }[];
  metrics: { name: string; value: number; unit: string }[];
  liveDemoType: "vision" | "optimizer" | "swarm" | "custom";
}

const DEFAULT_EXPERIMENTS: AIExperiment[] = [
  {
    id: "sam-ai-vision",
    project: "SAM-AI Vision Engine",
    category: "Computer Vision",
    status: "Testing",
    progress: 78,
    goal: "Real-time object recognition system",
    researchNotes: "## Phase 1: Convolutional Backbones\nAchieved high precision via a customized lightweight deep residual network. Current constraints involve latency during rapid multi-scale scanning.\n\n## Phase 2: Quantum Attention Mapping\nIntegrating quantum-inspired attention matrices to skip low-entropy regions. Preliminary tests indicate a 34% drop in computational overhead.",
    versionHistory: [
      { version: "v2.1.0-rc", date: "2026-06-28", changes: "Added multi-scale anchor boxes and stabilized thermal tracking." },
      { version: "v2.0.4", date: "2026-05-15", changes: "Optimized tensor core layout. Resolved memory overflow under heavy smoke occlusion." },
      { version: "v1.9.0", date: "2026-03-01", changes: "Initial vision engine containerization with basic convolutional filters." }
    ],
    metrics: [
      { name: "Inference Latency", value: 14.2, unit: "ms" },
      { name: "mAP (Mean Average Precision)", value: 89.4, unit: "%" },
      { name: "Thermal Power Draw", value: 4.8, unit: "W" },
      { name: "Object Lock Stability", value: 92.1, unit: "%" }
    ],
    liveDemoType: "vision"
  },
  {
    id: "quantum-neural-opt",
    project: "Quantum Neural Optimizer",
    category: "Generative AI",
    status: "Active",
    progress: 95,
    goal: "Sub-nanosecond weight adjustment in deep neural lattices",
    researchNotes: "## Quantum Annealing Weight Pathing\nTraditional gradient descent is prone to stagnation in deep valleys. By applying a simulated transverse quantum field, the weights successfully tunnel through optimization barriers.\n\n## Status Update\nOverdrive enabled. Lattices remain fully coherent under heavy backpropagation loads.",
    versionHistory: [
      { version: "v4.0.1", date: "2026-06-30", changes: "Fully unified quantum weights solver with multi-thread worker nodes." },
      { version: "v3.8.0", date: "2026-04-12", changes: "Implemented gradient tunneling coefficient calculation." }
    ],
    metrics: [
      { name: "Convergence Speedup", value: 12.4, unit: "x" },
      { name: "Quantum Coherence", value: 98.7, unit: "%" },
      { name: "Loss Value", value: 0.0024, unit: "" },
      { name: "Lattice Size Support", value: 1024, unit: "qubits" }
    ],
    liveDemoType: "optimizer"
  },
  {
    id: "bio-swarm-mind",
    project: "Bio-automata Swarm Mind",
    category: "Swarm Intelligence",
    status: "Archived",
    progress: 100,
    goal: "Distributed hive-mind decision framework",
    researchNotes: "## Swarm Mind Paradigm\nIndividual cellular boids communicate via lightweight electrostatic field vectors. Emergent navigation bypasses static barriers dynamically.\n\n## Archive Reason\nSuccessfully integrated directly into the core robotic swarm control station. No further standalone maintenance needed.",
    versionHistory: [
      { version: "v1.0.0-final", date: "2026-02-10", changes: "Polished consensus protocol. Archived project after successfully merging Swarm Mind with main colony engines." },
      { version: "v0.9.1", date: "2025-11-20", changes: "Tested cellular cohesion rules against hostile particle fields." }
    ],
    metrics: [
      { name: "Consensus Agreement Time", value: 8.5, unit: "ms" },
      { name: "Individual Boid CPU Overhead", value: 0.12, unit: "%" },
      { name: "Communication Bandwidth Saved", value: 81.0, unit: "%" },
      { name: "Swarm Recovery Index", value: 99.9, unit: "%" }
    ],
    liveDemoType: "swarm"
  }
];

export const AIExperimentVault: React.FC<{ isRgbOverdrive: boolean }> = ({ isRgbOverdrive }) => {
  const [experiments, setExperiments] = useState<AIExperiment[]>([]);
  const [selectedExp, setSelectedExp] = useState<AIExperiment | null>(null);
  const [activeTab, setActiveTab] = useState<"demo" | "notes" | "history" | "metrics">("demo");
  
  // Custom Create Experiment Form States
  const [isAdding, setIsAdding] = useState(false);
  const [newProject, setNewProject] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newStatus, setNewStatus] = useState<"Active" | "Testing" | "Archived">("Testing");
  const [newProgress, setNewProgress] = useState(50);
  const [newGoal, setNewGoal] = useState("");
  const [newNotes, setNewNotes] = useState("");

  // Live simulation states
  const [visionInput, setVisionInput] = useState<"drone" | "corridor" | "nebula">("drone");
  const [detectedObjects, setDetectedObjects] = useState<{ name: string; conf: number; x: number; y: number; w: number; h: number }[]>([]);
  const [optimizerWeights, setOptimizerWeights] = useState<number[]>([]);
  const [optimizerTuning, setOptimizerTuning] = useState(false);
  const [swarmTarget, setSwarmTarget] = useState({ x: 150, y: 100 });
  const [swarmBoids, setSwarmBoids] = useState<{ x: number; y: number; vx: number; vy: number }[]>([]);

  // Load and Persist
  useEffect(() => {
    const saved = localStorage.getItem("sam_ai_experiments");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setExperiments(parsed);
        if (parsed.length > 0) setSelectedExp(parsed[0]);
      } catch (e) {
        setExperiments(DEFAULT_EXPERIMENTS);
        setSelectedExp(DEFAULT_EXPERIMENTS[0]);
      }
    } else {
      setExperiments(DEFAULT_EXPERIMENTS);
      setSelectedExp(DEFAULT_EXPERIMENTS[0]);
    }
  }, []);

  const saveToStorage = (updatedList: AIExperiment[]) => {
    localStorage.setItem("sam_ai_experiments", JSON.stringify(updatedList));
  };

  // Add experiment
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject || !newCategory || !newGoal) {
      sounds.playError();
      return;
    }
    sounds.playLaser();
    const newExp: AIExperiment = {
      id: "exp-" + Date.now(),
      project: newProject,
      category: newCategory,
      status: newStatus,
      progress: Number(newProgress),
      goal: newGoal,
      researchNotes: newNotes || `## ${newProject} Research Overview\nInitiated tracking of goals and performance vectors.\n\n## Hypotheses\n- Vector fields align with multi-lattice learning limits.\n- Spatial correlation index shows significant gains.`,
      versionHistory: [
        { version: "v1.0.0-alpha", date: new Date().toISOString().split('T')[0], changes: "Initial project scaffolding created in Vault matrix." }
      ],
      metrics: [
        { name: "Processing Index", value: Math.round(Math.random() * 40 + 60), unit: "FLOPs/W" },
        { name: "Model Accuracy Potential", value: Math.round(Math.random() * 15 + 80), unit: "%" },
        { name: "System Stability Coefficient", value: Math.round(Math.random() * 10 + 90), unit: "%" },
        { name: "Resource Occupancy Rate", value: Math.round(Math.random() * 30 + 10), unit: "%" }
      ],
      liveDemoType: "custom"
    };

    const updated = [newExp, ...experiments];
    setExperiments(updated);
    saveToStorage(updated);
    setSelectedExp(newExp);
    setIsAdding(false);
    
    // Reset Form
    setNewProject("");
    setNewCategory("");
    setNewStatus("Testing");
    setNewProgress(50);
    setNewGoal("");
    setNewNotes("");
  };

  // Delete experiment
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playError();
    const filtered = experiments.filter(ex => ex.id !== id);
    setExperiments(filtered);
    saveToStorage(filtered);
    if (selectedExp?.id === id) {
      setSelectedExp(filtered[0] || null);
    }
  };

  // Status badge formatter
  const renderStatusBadge = (status: "Active" | "Testing" | "Archived") => {
    switch (status) {
      case "Active":
        return (
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            🟢 Active
          </span>
        );
      case "Testing":
        return (
          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono font-bold text-amber-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            🟡 Testing
          </span>
        );
      case "Archived":
        return (
          <span className="px-2 py-0.5 rounded bg-slate-500/10 border border-slate-500/30 text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            ⚪ Archived
          </span>
        );
    }
  };

  // SIMULATIONS LOGIC FOR LIVE DEMO

  // 1. Vision Engine Simulated Stream
  useEffect(() => {
    if (selectedExp?.liveDemoType !== "vision" || activeTab !== "demo") return;

    const objectsList: Record<string, string[]> = {
      drone: ["Target Ship", "Asteroid Core", "Plasma Shield", "Hyper Router"],
      corridor: ["Android Sentry", "Logic Board", "Rebel Decoy", "Optic Core"],
      nebula: ["Cosmic Singularity", "Quantum Well", "Dark Matter Cluster", "Dust Veil"]
    };

    const interval = setInterval(() => {
      const candidates = objectsList[visionInput];
      const count = Math.floor(Math.random() * 2) + 2; // 2 to 3 objects
      const newDetections = Array.from({ length: count }, () => {
        const name = candidates[Math.floor(Math.random() * candidates.length)];
        const w = Math.floor(Math.random() * 50) + 40;
        const h = Math.floor(Math.random() * 50) + 40;
        return {
          name,
          conf: Math.round(80 + Math.random() * 19),
          x: Math.floor(Math.random() * (260 - w)),
          y: Math.floor(Math.random() * (160 - h)),
          w,
          h
        };
      });
      setDetectedObjects(newDetections);
    }, 1800);

    return () => clearInterval(interval);
  }, [selectedExp, activeTab, visionInput]);

  // 2. Quantum Neural Optimizer Tunneling Weights
  useEffect(() => {
    if (selectedExp?.liveDemoType !== "optimizer" || activeTab !== "demo") return;
    
    // Seed initial weights
    if (optimizerWeights.length === 0) {
      setOptimizerWeights(Array.from({ length: 12 }, () => Math.random() * 0.8 + 0.1));
    }

    if (optimizerTuning) {
      const interval = setInterval(() => {
        setOptimizerWeights(prev => prev.map(w => {
          const shift = (Math.random() - 0.5) * 0.15;
          // Slowly push weights towards optimum lower values representing low entropy
          const idealVal = 0.1;
          const adjusted = w + shift + (idealVal - w) * 0.1;
          return Math.max(0.01, Math.min(0.99, adjusted));
        }));
      }, 200);

      const timeout = setTimeout(() => {
        setOptimizerTuning(false);
        sounds.playLaser();
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [selectedExp, activeTab, optimizerTuning]);

  // 3. Bio-automata Swarm Target Tracking Simulator
  useEffect(() => {
    if (selectedExp?.liveDemoType !== "swarm" || activeTab !== "demo") return;

    if (swarmBoids.length === 0) {
      setSwarmBoids(Array.from({ length: 18 }, () => ({
        x: Math.random() * 300,
        y: Math.random() * 200,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
      })));
    }

    const interval = setInterval(() => {
      setSwarmBoids(prev => prev.map(b => {
        // Force toward target
        const dx = swarmTarget.x - b.x;
        const dy = swarmTarget.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let ax = 0;
        let ay = 0;
        if (dist > 5) {
          ax = (dx / dist) * 0.25;
          ay = (dy / dist) * 0.25;
        }

        // Add small jitter
        ax += (Math.random() - 0.5) * 0.1;
        ay += (Math.random() - 0.5) * 0.1;

        const vx = Math.max(-3, Math.min(3, b.vx + ax));
        const vy = Math.max(-3, Math.min(3, b.vy + ay));

        return {
          x: b.x + vx,
          y: b.y + vy,
          vx,
          vy
        };
      }));
    }, 40);

    return () => clearInterval(interval);
  }, [selectedExp, activeTab, swarmTarget]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="ai-experiment-vault">
      {/* Sidebar: Experiments List Panel */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className={`p-4 rounded-xl border bg-slate-900/95 shadow-xl relative overflow-hidden transition-all duration-300 ${
          isRgbOverdrive ? "border-magenta-glow ring-2 ring-magenta-500/20" : "border-slate-800"
        }`}>
          {/* Futuristic subtle grid backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(#ec4899_0.8px,transparent_0.8px)] [background-size:14px_14px] opacity-10 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col h-[520px]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-pink-400 flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 animate-pulse text-pink-500" /> [ EXPERIMENT_VAULT ]
              </h3>
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsAdding(!isAdding);
                }}
                className="p-1 px-2 rounded bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-[10px] font-mono text-pink-400 font-bold flex items-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                NEW
              </button>
            </div>

            {/* List scroll */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {experiments.map((exp) => {
                const isSelected = selectedExp?.id === exp.id;
                return (
                  <div
                    key={exp.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedExp(exp);
                      setIsAdding(false);
                    }}
                    onMouseEnter={() => sounds.playHover()}
                    className={`p-3.5 rounded-lg border text-left transition-all relative cursor-pointer group ${
                      isSelected
                        ? "bg-slate-950 border-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.2)]"
                        : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    {/* Active Left Indicator Bar */}
                    {isSelected && (
                      <span className="absolute top-0 left-0 w-1 h-full bg-pink-500 rounded-l-md" />
                    )}

                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <div>
                        <div className="text-xs font-mono font-bold tracking-wider text-slate-100 uppercase group-hover:text-pink-400 transition-colors">
                          {exp.project}
                        </div>
                        <div className="text-[10px] font-mono text-cyan-400 tracking-wide mt-0.5">
                          Category: {exp.category}
                        </div>
                      </div>
                      {renderStatusBadge(exp.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-800/60 text-[10px] font-mono text-slate-400">
                      <div>
                        <span className="text-slate-500">Progress:</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="flex-1 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                            <div 
                              className="h-full bg-gradient-to-r from-pink-500 to-cyan-400" 
                              style={{ width: `${exp.progress}%` }}
                            />
                          </div>
                          <span className="text-slate-300 font-bold">{exp.progress}%</span>
                        </div>
                      </div>
                      <div className="flex flex-col justify-end text-right">
                        <span className="text-slate-500 block">System Core:</span>
                        <span className="text-slate-300 font-medium truncate max-w-[120px]">{exp.goal}</span>
                      </div>
                    </div>

                    {/* Quick Delete overlay trigger */}
                    <button
                      onClick={(e) => handleDelete(exp.id, e)}
                      title="Annihilate Experiment"
                      className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 rounded hover:bg-slate-950/40 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}

              {experiments.length === 0 && (
                <div className="text-center py-12 text-slate-500 font-mono text-xs">
                  NO EXPERIMENTS REGISTERED IN COGNITIVE MATRIX.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Panel: Interactive Experiment Blueprint Interface */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        {isAdding ? (
          /* futuristic Creation Deck */
          <form 
            onSubmit={handleCreate}
            className={`p-6 rounded-xl border bg-slate-900/95 shadow-2xl relative transition-all duration-300 h-[520px] overflow-y-auto flex flex-col justify-between ${
              isRgbOverdrive ? "border-cyan-glow ring-2 ring-cyan-500/20" : "border-slate-800"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-slate-800">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-cyan-400" /> [ INITIATE_NEW_HYPOTHESIS ]
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setIsAdding(false);
                  }}
                  className="text-slate-500 hover:text-slate-300 font-mono text-xs cursor-pointer"
                >
                  CANCEL
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase">Project Name:</label>
                  <input
                    type="text"
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    placeholder="e.g. SAM-AI Neural Synthesizer"
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-2 text-xs font-mono text-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase">Category:</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="e.g. LLM Reasoning, NLP"
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-2 text-xs font-mono text-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase">Development Status:</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-2 text-xs font-mono text-cyan-300 focus:outline-none cursor-pointer"
                  >
                    <option value="Active">🟢 Active</option>
                    <option value="Testing">🟡 Testing</option>
                    <option value="Archived">⚪ Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase">Core Target Goal:</label>
                  <input
                    type="text"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder="e.g. Multi-agent negotiation convergence"
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-2 text-xs font-mono text-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Prototype Progress Matrix:</label>
                  <span className="text-xs font-mono text-cyan-400 font-bold">{newProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newProgress}
                  onChange={(e) => setNewProgress(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer bg-slate-950 border border-slate-800 rounded-lg h-2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase">Initial Research Hypotheses / Notes (Markdown):</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={4}
                  placeholder="## High-Dimensional Weight Proving&#10;- Hyper-dimensional fields prove extremely robust against noise.&#10;- Convergence latency falls to optimal levels."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-2 text-xs font-mono text-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 resize-none h-[110px]"
                />
              </div>
            </div>

            <button
              type="submit"
              onMouseEnter={() => sounds.playHover()}
              className="w-full p-2.5 rounded bg-gradient-to-r from-cyan-500 to-pink-500 text-slate-950 hover:opacity-95 font-mono font-bold text-xs uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
            >
              🚀 INJECT EXPERIMENT INTO CENTRAL VAULT
            </button>
          </form>
        ) : selectedExp ? (
          /* Interactive Blueprint Card */
          <div className={`flex flex-col rounded-xl border bg-slate-950 shadow-2xl relative overflow-hidden transition-all duration-500 h-[520px] ${
            isRgbOverdrive 
              ? "border-pink-500/60 shadow-[0_0_25px_rgba(244,63,94,0.12)]" 
              : "border-slate-800"
          }`}>
            {/* Blueprint Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 py-3 bg-slate-900/90 border-b border-slate-800 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                    🧬 EXP_CORE_LOGS
                  </span>
                  <span className="text-slate-600">//</span>
                  <span className="text-[10px] font-mono text-slate-400">{selectedExp.id.toUpperCase()}</span>
                </div>
                <h2 className="text-base font-mono font-bold tracking-tight text-slate-100 uppercase mt-0.5">
                  {selectedExp.project}
                </h2>
              </div>

              {/* Sub tabs Navigation */}
              <div className="flex items-center gap-1 border border-slate-800 p-0.5 rounded bg-slate-950">
                {[
                  { id: "demo", label: "Live Demo", icon: Play },
                  { id: "notes", label: "Research Notes", icon: BookOpen },
                  { id: "history", label: "Version History", icon: History },
                  { id: "metrics", label: "Metrics & Charts", icon: ChartIcon }
                ].map((st) => {
                  const isActive = activeTab === st.id;
                  const SubIcon = st.icon;
                  return (
                    <button
                      key={st.id}
                      onClick={() => {
                        sounds.playClick();
                        setActiveTab(st.id as any);
                      }}
                      onMouseEnter={() => sounds.playHover()}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1 cursor-pointer ${
                        isActive
                          ? "bg-pink-500 text-white shadow-[0_0_8px_rgba(236,72,153,0.3)]"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                      }`}
                    >
                      <SubIcon className="w-3 h-3" />
                      <span className="hidden sm:inline">{st.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub tab Content Body */}
            <div className="flex-1 p-5 overflow-y-auto bg-slate-950 font-mono text-xs scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {activeTab === "demo" && (
                <div className="h-full flex flex-col justify-between">
                  <div className="mb-3">
                    <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest block mb-1">
                      [ INTERACTIVE SIMULATION PREVIEW ]
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      This live sandbox executes actual real-time algorithmic loops representing this experiment's goal: <span className="text-cyan-300 font-bold">"{selectedExp.goal}"</span>.
                    </p>
                  </div>

                  {/* Render simulated live content based on category */}
                  <div className="flex-1 border border-slate-850 bg-slate-900/60 rounded-xl relative overflow-hidden flex items-center justify-center p-4">
                    {/* Vision Engine Simulator */}
                    {selectedExp.liveDemoType === "vision" && (
                      <div className="w-full max-w-md h-full flex flex-col justify-between relative gap-3">
                        <div className="flex items-center justify-between text-[10px] border-b border-slate-800/80 pb-1.5">
                          <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 animate-pulse text-cyan-400" /> CAMERA_INPUT_FEED
                          </span>
                          <div className="flex gap-1">
                            {["drone", "corridor", "nebula"].map((src) => (
                              <button
                                key={src}
                                onClick={() => {
                                  sounds.playClick();
                                  setVisionInput(src as any);
                                }}
                                className={`px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold transition-all border ${
                                  visionInput === src 
                                    ? "bg-cyan-500 border-cyan-400 text-slate-950" 
                                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                                }`}
                              >
                                {src}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Camera feed representation */}
                        <div className="flex-1 bg-slate-950 rounded-lg border border-slate-800 relative overflow-hidden flex items-center justify-center h-[170px]">
                          {/* Radial scanned background */}
                          <div className={`absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${
                            visionInput === "nebula" ? "from-pink-500 via-purple-600 to-transparent" : visionInput === "corridor" ? "from-indigo-500 via-slate-900 to-transparent" : "from-emerald-500 via-slate-900 to-transparent"
                          }`} />

                          {/* Radar sweep lines */}
                          <div className="absolute top-0 left-0 w-full h-0.5 bg-cyan-500/30 animate-scan pointer-events-none" />

                          {/* Detected Bounding Boxes */}
                          {detectedObjects.map((obj, i) => (
                            <div
                              key={i}
                              className="absolute border border-cyan-400 bg-cyan-400/5 transition-all duration-1000 flex flex-col justify-between p-0.5"
                              style={{
                                left: `${obj.x}px`,
                                top: `${obj.y}px`,
                                width: `${obj.w}px`,
                                height: `${obj.h}px`
                              }}
                            >
                              <div className="bg-cyan-400/80 text-[8px] text-slate-950 px-1 font-bold font-mono tracking-wider truncate max-w-full">
                                {obj.name}
                              </div>
                              <div className="text-[7px] text-cyan-400 font-bold font-mono text-right mt-auto">
                                {obj.conf}%
                              </div>
                            </div>
                          ))}

                          <div className="absolute bottom-2 left-2 text-[9px] font-mono text-cyan-400/80 bg-slate-900/80 px-1.5 py-0.5 rounded border border-cyan-500/20">
                            FPS: 59.8 // BUFFER: NORMAL
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quantum Optimizer Simulator */}
                    {selectedExp.liveDemoType === "optimizer" && (
                      <div className="w-full max-w-md h-full flex flex-col justify-between gap-3">
                        <div className="flex items-center justify-between text-[10px] border-b border-slate-800/80 pb-1.5">
                          <span className="text-pink-400 font-bold flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-pink-400" /> GRADIENT_DESCENT_TUNER
                          </span>
                          <button
                            onClick={() => {
                              sounds.playOverdrive();
                              setOptimizerTuning(true);
                            }}
                            disabled={optimizerTuning}
                            className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold transition-all border ${
                              optimizerTuning 
                                ? "bg-amber-500/20 border-amber-500/40 text-amber-400 animate-pulse" 
                                : "bg-pink-500 border-pink-400 text-white hover:opacity-90"
                            }`}
                          >
                            {optimizerTuning ? "ANNEALING..." : "TUNE COUPLING"}
                          </button>
                        </div>

                        {/* Weights matrix visual representation */}
                        <div className="flex-1 grid grid-cols-4 gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                          {optimizerWeights.map((w, idx) => (
                            <div key={idx} className="flex flex-col justify-between p-2 rounded bg-slate-900/60 border border-slate-850 relative overflow-hidden">
                              <span className="text-[8px] text-slate-500">W{idx + 1}</span>
                              <div className="h-10 flex items-end bg-slate-950/80 rounded overflow-hidden border border-slate-850">
                                <div 
                                  className={`w-full transition-all duration-300 ${
                                    optimizerTuning ? "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                                  }`}
                                  style={{ height: `${w * 100}%` }}
                                />
                              </div>
                              <span className="text-[9px] font-bold text-slate-300 text-center mt-1">
                                {w.toFixed(3)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Swarm Mind target simulator */}
                    {selectedExp.liveDemoType === "swarm" && (
                      <div className="w-full max-w-md h-full flex flex-col justify-between gap-3">
                        <div className="flex items-center justify-between text-[10px] border-b border-slate-800/80 pb-1.5">
                          <span className="text-purple-400 font-bold flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-purple-400" /> SWARM_COORDINATION_GRID
                          </span>
                          <span className="text-[9px] text-slate-500">CLICK GRID TO POSITION TARGET</span>
                        </div>

                        {/* Interactive grid container */}
                        <div 
                          onClick={(e) => {
                            sounds.playClick();
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            setSwarmTarget({ x: Math.max(10, Math.min(290, x)), y: Math.max(10, Math.min(190, y)) });
                          }}
                          className="flex-1 bg-slate-950 rounded-lg border border-slate-800 relative overflow-hidden cursor-crosshair h-[170px]"
                        >
                          {/* Electrostatic Grid lines */}
                          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-25" />

                          {/* Target Locator Node */}
                          <div 
                            className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full border-2 border-pink-500 bg-pink-500/20 animate-ping"
                            style={{ left: `${swarmTarget.x}px`, top: `${swarmTarget.y}px` }}
                          />
                          <div 
                            className="absolute w-2 h-2 -ml-1 -mt-1 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]"
                            style={{ left: `${swarmTarget.x}px`, top: `${swarmTarget.y}px` }}
                          />

                          {/* Sim Boid Particle Swarm */}
                          {swarmBoids.map((b, idx) => (
                            <div
                              key={idx}
                              className="absolute w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_4px_rgba(34,211,238,0.8)] transition-all duration-75"
                              style={{ left: `${b.x}px`, top: `${b.y}px` }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Fallback Custom Client Simulation */}
                    {selectedExp.liveDemoType === "custom" && (
                      <div className="w-full max-w-md h-full flex flex-col justify-center items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-cyan-500 flex items-center justify-center animate-spin-slow">
                          <Zap className="w-6 h-6 text-slate-950" />
                        </div>
                        <div>
                          <div className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">
                            {selectedExp.project} Prototype Live
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono mt-1 leading-relaxed max-w-xs">
                            Running virtual sandbox loop for custom hypothesis. Emitting electrostatic performance vectors safely.
                          </p>
                        </div>
                        <div className="px-3 py-1 bg-slate-950 rounded border border-slate-800 text-[9px] text-cyan-400 font-mono animate-pulse">
                          MATRIX_LINK: ESTABLISHED
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Sandbox stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-800/60 text-[10px] font-mono text-slate-400">
                    <div>
                      <span className="text-slate-500">Prototype Core:</span>
                      <div className="text-slate-300 font-bold truncate mt-0.5">{selectedExp.category}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Lattice Status:</span>
                      <div className="text-pink-400 font-bold mt-0.5">READY</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Virtual Lock:</span>
                      <div className="text-cyan-400 font-bold mt-0.5">SECURE</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Host Core:</span>
                      <div className="text-slate-300 font-bold mt-0.5">PORT 3000</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notes" && (
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest block mb-2">
                      [ SCIENTIFIC LOGS & RESEARCH NOTES ]
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                      Direct logs from the research sandbox. Edit the notes block directly to document new findings:
                    </p>
                  </div>

                  <div className="flex-1 bg-slate-900/60 rounded-xl border border-slate-850 p-4 flex flex-col">
                    <textarea
                      value={selectedExp.researchNotes}
                      onChange={(e) => {
                        const updated = experiments.map(ex => {
                          if (ex.id === selectedExp.id) {
                            return { ...ex, researchNotes: e.target.value };
                          }
                          return ex;
                        });
                        setExperiments(updated);
                        saveToStorage(updated);
                        setSelectedExp({ ...selectedExp, researchNotes: e.target.value });
                      }}
                      className="w-full h-full bg-slate-950 border border-slate-800 rounded p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400/80 resize-none leading-relaxed"
                      placeholder="Markdown notes supported..."
                    />
                  </div>

                  <div className="text-[9px] font-mono text-slate-500 text-right mt-2">
                    ⚡ Auto-saved to Local Storage sandbox registry.
                  </div>
                </div>
              )}

              {activeTab === "history" && (
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest block mb-1">
                      [ DEPLOYED REVISIONS INDEX ]
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                      Immutable history tracking for all iterations deployed to the Sammium lab array:
                    </p>
                  </div>

                  <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                    {selectedExp.versionHistory.map((vh, i) => (
                      <div key={i} className="p-3 bg-slate-900/50 border border-slate-850 hover:border-slate-800 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-2 transition-all">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-1.5 py-0.5 rounded bg-pink-500/15 border border-pink-500/30 text-[9px] font-bold text-pink-400 font-mono">
                              {vh.version}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">{vh.date}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 font-mono leading-relaxed">
                            {vh.changes}
                          </p>
                        </div>
                        <span className="text-[9px] font-mono font-bold text-emerald-400 flex items-center gap-1 shrink-0 bg-emerald-500/5 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                          <Check className="w-3 h-3 text-emerald-400" /> DEPLOY_SUCCESS
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="text-[9px] font-mono text-slate-500 mt-2">
                    Registry synchronized // Secure Hash verified
                  </div>
                </div>
              )}

              {activeTab === "metrics" && (
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest block mb-1">
                      [ SYSTEM PERFORMANCE TELEMETRY ]
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                      Real-time telemetry reports representing the hardware footprint and mathematical convergence efficiency:
                    </p>
                  </div>

                  {/* Metrics grid and charting */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Footprint metrics widgets */}
                    <div className="grid grid-cols-2 gap-3">
                      {selectedExp.metrics.map((met, i) => (
                        <div key={i} className="p-3 bg-slate-900/60 border border-slate-850 hover:border-pink-500/20 rounded-lg flex flex-col justify-between transition-all">
                          <span className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold block leading-tight">
                            {met.name}
                          </span>
                          <div className="mt-2.5 flex items-baseline gap-1.5">
                            <span className="text-xl font-bold font-mono text-cyan-400 tracking-tight">
                              {met.value}
                            </span>
                            {met.unit && (
                              <span className="text-[9px] font-mono text-slate-400 uppercase">
                                {met.unit}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chart widget */}
                    <div className="bg-slate-900/60 border border-slate-850 rounded-lg p-3 flex flex-col justify-between h-[210px] md:h-full">
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Stability vs Compute Load Trend
                      </span>
                      <div className="flex-1 min-h-[140px] text-[9px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={[
                              { name: "P1", Load: 20, Stability: 99 },
                              { name: "P2", Load: 45, Stability: 98 },
                              { name: "P3", Load: 68, Stability: 95 },
                              { name: "P4", Load: selectedExp.progress, Stability: Math.round(90 + (100 - selectedExp.progress) * 0.1) },
                              { name: "P5", Load: 95, Stability: 94 }
                            ]}
                            margin={{ top: 5, right: 10, left: -25, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="name" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip 
                              contentStyle={{ backgroundColor: "#020617", borderColor: "#334155" }}
                              labelStyle={{ color: "#94a3b8" }}
                            />
                            <Line type="monotone" dataKey="Load" stroke="#ec4899" strokeWidth={2} name="Compute %" />
                            <Line type="monotone" dataKey="Stability" stroke="#06b6d4" strokeWidth={1.5} name="Stability %" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-[520px] rounded-xl border border-slate-800 bg-slate-950 flex flex-col items-center justify-center text-center p-6">
            <FlaskConical className="w-12 h-12 text-slate-700 mb-3 animate-pulse" />
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
              No Experiment Selected
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-1 leading-relaxed max-w-xs">
              Select an experiment from the registry, or trigger a new hypothesis container to begin monitoring.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
