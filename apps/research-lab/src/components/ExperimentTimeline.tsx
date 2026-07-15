import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { 
  Calendar, 
  GitCommit, 
  GitBranch, 
  Clock, 
  Sparkles, 
  Plus, 
  Trash2, 
  Activity, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  ChevronRight, 
  Layers, 
  Cpu, 
  HelpCircle,
  Lightbulb,
  Flame,
  Zap,
  Briefcase,
  Play,
  RotateCcw
} from "lucide-react";
import { sounds } from "../utils/sounds";

export interface TimelineNode {
  id: string;
  year: number;
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  title: string;
  description: string;
  status: "Complete" | "In Progress" | "In Development" | "Conceptual";
  progress: number;
  team: string;
  technologies: string[];
  isCustom?: boolean;
}

const DEFAULT_TIMELINE: TimelineNode[] = [
  // 2026 Milestones (User Spec)
  {
    id: "tl-2026-q1",
    year: 2026,
    quarter: "Q1",
    title: "AI Assistant Prototype",
    description: "Multi-modal contextual AI agent capable of zero-latency voice command mapping and automated bio-telemetry summarization.",
    status: "Complete",
    progress: 100,
    team: "Aura Cognitive Team",
    technologies: ["Gemini-3.5", "WebRTC", "Dermal Receptors"]
  },
  {
    id: "tl-2026-q2",
    year: 2026,
    quarter: "Q2",
    title: "RehabMate AI Research",
    description: "Deep-neural sensory mapping targeting prosthetic actuation and muscle telemetry micro-coordination for therapeutic exercises.",
    status: "In Progress",
    progress: 78,
    team: "Neuro-Kinetic Group",
    technologies: ["Haptic Lattices", "EMG Telemetry", "Sci-Kit Learn"]
  },
  {
    id: "tl-2026-q3",
    year: 2026,
    quarter: "Q3",
    title: "Smart Community AI",
    description: "Decentralized public intelligence hub integrating air scrubbers, warning alarms, and localized smart grids for community protection.",
    status: "In Development",
    progress: 35,
    team: "Socio-Cybernetics Div",
    technologies: ["Port-3000 WebSockets", "Bio-Reactors", "Geo-Location"]
  },
  {
    id: "tl-2026-q4",
    year: 2026,
    quarter: "Q4",
    title: "AI Core Platform",
    description: "Unified master orchestration core synthesizing robotic swarms, orbit telemetry, and cognitive health nets under Dr. Sammium's supervision.",
    status: "Conceptual",
    progress: 0,
    team: "Core Architecture Team",
    technologies: ["Sammium-v5.0 Engine", "Drizzle SQL", "Quantum Field Matrix"]
  },
  // 2025 Past Milestones
  {
    id: "tl-2025-q3",
    year: 2025,
    quarter: "Q3",
    title: "Swarm Actuator Calibration",
    description: "Automated joint matrix calibrations of five-axis robotic drone arms, improving alignment tolerances to +/- 0.05 mm bounds.",
    status: "Complete",
    progress: 100,
    team: "Swarm Mechanics Lab",
    technologies: ["Nvidia Jetson", "PID Regulators", "Rust Arm SDK"]
  },
  {
    id: "tl-2025-q4",
    year: 2025,
    quarter: "Q4",
    title: "Galactic Telemetry Relay",
    description: "First Successful mesh relay established with lunar orbit satellite arrays, syncing 1.2M metrics packages safely on 500ms intervals.",
    status: "Complete",
    progress: 100,
    team: "Celestial Orbits Division",
    technologies: ["S-Band Radio", "Buffer Pools", "High-frequency Waveguides"]
  }
];

export const ExperimentTimeline: React.FC<{ isRgbOverdrive: boolean }> = ({ isRgbOverdrive }) => {
  const [timeline, setTimeline] = useState<TimelineNode[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedNode, setSelectedNode] = useState<TimelineNode | null>(null);

  // Form states for custom milestone
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newYear, setNewYear] = useState<number>(2026);
  const [newQuarter, setNewQuarter] = useState<"Q1" | "Q2" | "Q3" | "Q4">("Q1");
  const [newDescription, setNewDescription] = useState("");
  const [newStatus, setNewStatus] = useState<"Complete" | "In Progress" | "In Development" | "Conceptual">("Conceptual");
  const [newProgress, setNewProgress] = useState<number>(0);
  const [newTeam, setNewTeam] = useState("");
  const [newTechsInput, setNewTechsInput] = useState("");

  // AI forecasting feedback states
  const [aiResponse, setAiResponse] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Load and Persist State
  useEffect(() => {
    const saved = localStorage.getItem("sammium_timeline_nodes");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeline(parsed);
        // default select
        const currentYearNodes = parsed.filter((n: TimelineNode) => n.year === 2026);
        if (currentYearNodes.length > 0) {
          setSelectedNode(currentYearNodes[0]);
        } else if (parsed.length > 0) {
          setSelectedNode(parsed[0]);
        }
      } catch (e) {
        setTimeline(DEFAULT_TIMELINE);
        setSelectedNode(DEFAULT_TIMELINE[1]); // select rehabmate
      }
    } else {
      setTimeline(DEFAULT_TIMELINE);
      setSelectedNode(DEFAULT_TIMELINE[1]);
    }
  }, []);

  const saveToStorage = (updated: TimelineNode[]) => {
    localStorage.setItem("sammium_timeline_nodes", JSON.stringify(updated));
  };

  // Add custom milestone
  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription) {
      sounds.playError();
      return;
    }

    sounds.playLaser();
    const parsedTechs = newTechsInput
      ? newTechsInput.split(",").map(t => t.trim()).filter(Boolean)
      : ["General AI"];

    const newNode: TimelineNode = {
      id: "node-" + Date.now(),
      year: Number(newYear),
      quarter: newQuarter,
      title: newTitle,
      description: newDescription,
      status: newStatus,
      progress: Number(newProgress),
      team: newTeam || "Sammium Lab Force",
      technologies: parsedTechs,
      isCustom: true
    };

    const updated = [...timeline, newNode];
    setTimeline(updated);
    saveToStorage(updated);
    setSelectedNode(newNode);
    setSelectedYear(Number(newYear));
    setIsAdding(false);

    // Reset fields
    setNewTitle("");
    setNewYear(2026);
    setNewQuarter("Q1");
    setNewDescription("");
    setNewStatus("Conceptual");
    setNewProgress(0);
    setNewTeam("");
    setNewTechsInput("");
    setAiResponse("");
  };

  // Delete node
  const handleDeleteNode = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playError();
    const updated = timeline.filter(n => n.id !== id);
    setTimeline(updated);
    saveToStorage(updated);
    if (selectedNode?.id === id) {
      setSelectedNode(updated[0] || null);
    }
  };

  // Dr. Sammium Forecast call
  const triggerAiForecast = async () => {
    if (!selectedNode || aiLoading) return;

    sounds.playClick();
    setAiLoading(true);
    setAiError(null);
    setAiResponse("");

    try {
      const res = await fetch("/api/timeline/forecast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          milestone: selectedNode.title,
          quarter: selectedNode.quarter,
          year: selectedNode.year,
          description: selectedNode.description
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to communicate with research forecasting node.");
      }

      sounds.playLaser();
      setAiResponse(data.text || "No forecasting stream returned.");
    } catch (err: any) {
      console.error(err);
      sounds.playError();
      setAiError(err.message || "Lost synchrony with temporal prognostic relays.");
    } finally {
      setAiLoading(false);
    }
  };

  // Particle Accelerator Simulation (Increments progress values)
  const accelerateRoadmapTime = () => {
    sounds.playSingularity();
    const updated = timeline.map(node => {
      if (node.status === "In Progress") {
        const nextProgress = Math.min(99, node.progress + Math.round(Math.random() * 8 + 2));
        return { ...node, progress: nextProgress };
      }
      if (node.status === "In Development") {
        const nextProgress = Math.min(85, node.progress + Math.round(Math.random() * 12 + 1));
        return { ...node, progress: nextProgress };
      }
      if (node.status === "Conceptual") {
        // small chance to transition to Development
        if (Math.random() > 0.7) {
          return { ...node, status: "In Development" as const, progress: 5 };
        }
      }
      return node;
    });

    setTimeline(updated);
    saveToStorage(updated);
    
    // sync selectedNode
    if (selectedNode) {
      const synced = updated.find(n => n.id === selectedNode.id);
      if (synced) setSelectedNode(synced);
    }
  };

  // Get nodes of selected year, sorted by Quarter
  const sortedYearNodes = timeline
    .filter(n => n.year === selectedYear)
    .sort((a, b) => {
      const qMap = { Q1: 1, Q2: 2, Q3: 3, Q4: 4 };
      return qMap[a.quarter] - qMap[b.quarter];
    });

  // Unique years available
  const availableYears = Array.from(new Set(timeline.map(n => n.year))).sort((a, b) => b - a);

  // Status visualizer styling
  const renderStatusTag = (status: string) => {
    switch (status) {
      case "Complete":
        return (
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> SECURED
          </span>
        );
      case "In Progress":
        return (
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono text-cyan-400 font-bold flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400 animate-pulse" /> ON AIR
          </span>
        );
      case "In Development":
        return (
          <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-[10px] font-mono text-purple-400 font-bold flex items-center gap-1">
            <Activity className="w-3 h-3 text-purple-400" /> WELDING
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded bg-slate-500/10 border border-slate-500/30 text-[10px] font-mono text-slate-400 font-bold flex items-center gap-1">
            <Layers className="w-3 h-3 text-slate-400" /> PLANNING
          </span>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="experiment-timeline-station">
      {/* Sidebar: Year Deck & Accelerators */}
      <div className="xl:col-span-3 flex flex-col gap-4">
        
        {/* Year Select & Inject Milestone control */}
        <div className={`p-4 rounded-xl border bg-slate-900/95 shadow-xl relative overflow-hidden transition-all duration-300 ${
          isRgbOverdrive ? "border-pink-500/40 ring-2 ring-pink-500/10" : "border-slate-800"
        }`}>
          <div className="absolute inset-0 bg-[radial-gradient(#ec4899_0.8px,transparent_0.8px)] [background-size:14px_14px] opacity-10 pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-pink-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-pink-500" /> [ TEMPORAL_DECKS ]
              </h3>
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsAdding(!isAdding);
                }}
                className="p-1 px-2 rounded bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-[9px] font-mono font-bold text-pink-400 flex items-center gap-1 cursor-pointer transition-all shrink-0"
              >
                <Plus className="w-3 h-3" />
                LOG GOAL
              </button>
            </div>

            {/* Year selector buttons */}
            <div className="flex flex-col gap-2">
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider">
                Select Active Temporal Year:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {availableYears.map((year) => {
                  const isSelected = selectedYear === year;
                  return (
                    <button
                      key={year}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedYear(year);
                        setIsAdding(false);
                        // default select first node of that year
                        const yearNodes = timeline.filter(n => n.year === year);
                        if (yearNodes.length > 0) setSelectedNode(yearNodes[0]);
                      }}
                      className={`p-2 font-mono text-xs font-bold rounded border text-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-pink-500 text-slate-950 border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.25)]"
                          : "bg-slate-950/80 border-slate-850 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simulated Accelerator Tool */}
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-850 mt-2">
              <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                ⚡ TEMPORAL PARTICULATOR
              </span>
              <p className="text-[9px] text-slate-500 font-mono leading-relaxed mb-3">
                Stimulate current lab velocity matrix to organically advance research progress metrics across ongoing milestones.
              </p>
              <button
                onClick={accelerateRoadmapTime}
                className="w-full p-2 rounded bg-gradient-to-r from-cyan-500/20 to-pink-500/20 hover:from-cyan-500/35 hover:to-pink-500/35 border border-pink-500/30 text-pink-300 font-mono font-bold text-[9px] uppercase tracking-wider cursor-pointer transition-all text-center flex items-center justify-center gap-1.5"
              >
                <Flame className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
                STIMULATE ROADMAP
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Main Roadmap Hub */}
      <div className="xl:col-span-9 flex flex-col gap-4">
        
        {isAdding ? (
          /* Log Goal / Milestone Form */
          <form
            onSubmit={handleAddMilestone}
            className={`p-6 rounded-xl border bg-slate-900/95 shadow-2xl relative transition-all duration-300 h-[520px] overflow-y-auto flex flex-col justify-between ${
              isRgbOverdrive ? "border-cyan-glow ring-2 ring-cyan-500/10" : "border-slate-800"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-cyan-400" /> [ LOG_ROADMAP_MILESTONE ]
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-[9px] font-mono text-slate-400 mb-1.5 uppercase">Milestone Name:</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Brainwave Cap Prototype"
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-2 text-xs font-mono text-cyan-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-slate-400 mb-1.5 uppercase">Year:</label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    min="2020"
                    max="2035"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-2 text-xs font-mono text-cyan-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-slate-400 mb-1.5 uppercase">Quarter Placement:</label>
                  <select
                    value={newQuarter}
                    onChange={(e) => setNewQuarter(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-2 text-xs font-mono text-cyan-300 focus:outline-none cursor-pointer"
                  >
                    <option value="Q1">Q1 Quarter</option>
                    <option value="Q2">Q2 Quarter</option>
                    <option value="Q3">Q3 Quarter</option>
                    <option value="Q4">Q4 Quarter</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-[9px] font-mono text-slate-400 mb-1.5 uppercase">Active Team Unit:</label>
                  <input
                    type="text"
                    value={newTeam}
                    onChange={(e) => setNewTeam(e.target.value)}
                    placeholder="e.g. Aura Cognitive Team"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-2 text-xs font-mono text-cyan-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-slate-400 mb-1.5 uppercase">Current Progress (%):</label>
                  <input
                    type="number"
                    value={newProgress}
                    onChange={(e) => setNewProgress(Number(e.target.value))}
                    min="0"
                    max="100"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-2 text-xs font-mono text-cyan-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-slate-400 mb-1.5 uppercase">Status:</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-2 text-xs font-mono text-cyan-300 focus:outline-none cursor-pointer"
                  >
                    <option value="Complete">Complete</option>
                    <option value="In Progress">In Progress</option>
                    <option value="In Development">In Development</option>
                    <option value="Conceptual">Conceptual</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[9px] font-mono text-slate-400 mb-1.5 uppercase">Core Technologies (comma separated):</label>
                <input
                  type="text"
                  value={newTechsInput}
                  onChange={(e) => setNewTechsInput(e.target.value)}
                  placeholder="e.g. React, D3, Recharts"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-2 text-xs font-mono text-cyan-300 focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-[9px] font-mono text-slate-400 mb-1.5 uppercase">Milestone Concept / Plan Description:</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={4}
                  required
                  placeholder="Describe the research goals, telemetry integrations, and structural milestones..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-2 text-xs font-mono text-cyan-300 focus:outline-none resize-none h-[110px]"
                />
              </div>
            </div>

            <button
              type="submit"
              onMouseEnter={() => sounds.playHover()}
              className="w-full p-2.5 rounded bg-gradient-to-r from-cyan-500 to-pink-500 text-slate-950 hover:opacity-95 font-mono font-bold text-xs uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all shrink-0"
            >
              🚀 ENGRAVE MILESTONE NODE INTO TEMPORAL ROADMAP
            </button>
          </form>
        ) : (
          /* Active Roadmap Visualization & Inspection layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
            
            {/* Left: Horizontal/Vertical Timeline track slider */}
            <div className={`lg:col-span-7 flex flex-col rounded-xl border bg-slate-950 p-4 justify-between h-[520px] relative overflow-hidden transition-all duration-500 ${
              isRgbOverdrive ? "border-pink-500/60 shadow-[0_0_20px_rgba(244,63,94,0.06)]" : "border-slate-800"
            }`}>
              
              {/* Timeline Header bar */}
              <div className="flex justify-between items-center pb-2 border-b border-slate-850 shrink-0">
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider">
                    🛰️ TEMPORAL_ROADMAP_TRACK
                  </span>
                  <h2 className="text-sm font-mono text-slate-100 font-bold uppercase mt-0.5">
                    Year Index: {selectedYear}
                  </h2>
                </div>
                <div className="text-[9px] font-mono text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-pink-500 animate-spin-slow" /> ACTIVE PERIOD
                </div>
              </div>

              {/* Symmetrical Q1-Q4 Track Layout */}
              <div className="flex-1 my-4 flex flex-col justify-around relative pl-6 border-l border-slate-850/60 py-2">
                {/* Visual Connector gradient pipe */}
                <div className="absolute left-0 top-6 bottom-6 w-px bg-gradient-to-b from-pink-500 via-cyan-500 to-purple-500" />

                {["Q1", "Q2", "Q3", "Q4"].map((q) => {
                  // Find node for this quarter in this year
                  const node = sortedYearNodes.find(n => n.quarter === q);
                  const isSelected = selectedNode?.id === node?.id && node !== undefined;

                  if (!node) {
                    return (
                      <div 
                        key={q} 
                        className="relative flex items-center gap-4 group opacity-40 select-none py-1.5"
                      >
                        {/* Dot */}
                        <div className="absolute -left-[28.5px] w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
                        <div>
                          <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                            {q} // ROADMAP NODE LACKING
                          </div>
                          <p className="text-[9px] text-slate-600 font-mono">No registered milestones currently logged in active sector database.</p>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={node.id}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedNode(node);
                        setAiResponse("");
                      }}
                      onMouseEnter={() => sounds.playHover()}
                      className={`relative flex items-start gap-4 p-3 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-slate-900/90 border-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.15)]"
                          : "bg-slate-900/30 border-slate-850 hover:border-slate-700 hover:bg-slate-900/60"
                      }`}
                    >
                      {/* Timeline Dot Indicator */}
                      <div className={`absolute -left-[30.5px] w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-pink-500 border-pink-400 scale-125"
                          : node.status === "Complete"
                          ? "bg-emerald-500 border-emerald-400"
                          : node.status === "In Progress"
                          ? "bg-cyan-500 border-cyan-400 animate-pulse"
                          : "bg-slate-950 border-slate-700"
                      }`}>
                        {node.status === "Complete" && <span className="w-1 h-1 rounded-full bg-white" />}
                      </div>

                      {/* Info Block */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] font-mono font-bold text-pink-400 tracking-widest uppercase shrink-0">
                            {node.quarter} • {node.team.split(" ")[0].toUpperCase()}
                          </span>
                          <span className="text-[9px] font-mono text-slate-500 shrink-0">Progress: {node.progress}%</span>
                        </div>

                        <h3 className="text-xs font-mono font-bold text-slate-100 truncate group-hover:text-pink-400 transition-colors">
                          {node.title}
                        </h3>

                        <p className="text-[10px] text-slate-400 font-mono mt-1 line-clamp-1">
                          {node.description}
                        </p>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-600 self-center shrink-0" />
                    </div>
                  );
                })}
              </div>

              {/* Track Footer system message */}
              <div className="p-2.5 bg-slate-900/80 border border-slate-850 rounded text-[9px] font-mono text-slate-500 flex justify-between items-center shrink-0">
                <span>SECTOR_GRID_SYNC: COHERENT</span>
                <span>CHANNELS ON PORT 3000</span>
              </div>

            </div>

            {/* Right: Selected Node specs inspector & Dr. Sammium Forecast panel */}
            <div className="lg:col-span-5 flex flex-col gap-4 justify-between h-[520px]">
              {selectedNode ? (
                <div className={`flex flex-col rounded-xl border bg-slate-950 p-4 h-full justify-between relative overflow-hidden transition-all duration-500 ${
                  isRgbOverdrive ? "border-pink-500/60 shadow-[0_0_20px_rgba(244,63,94,0.06)]" : "border-slate-800"
                }`}>
                  
                  {/* Inner specifications details block */}
                  <div className="flex flex-col gap-3 flex-1 overflow-y-auto pb-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-850">
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 block uppercase">NODE DETAILS</span>
                        <h3 className="text-xs font-mono font-bold text-slate-100 uppercase">{selectedNode.quarter} Milestone</h3>
                      </div>
                      {renderStatusTag(selectedNode.status)}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-pink-400 uppercase tracking-wider block">PROJECT NAME:</span>
                      <h4 className="text-xs font-mono font-bold text-slate-200 uppercase">{selectedNode.title}</h4>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-pink-400 uppercase tracking-wider block">CONCEPT & SCOPE:</span>
                      <p className="text-[10px] text-slate-300 font-mono leading-relaxed">{selectedNode.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-850 text-[9px] font-mono">
                      <div>
                        <span className="text-slate-500 block">RESPONSIBLE TEAM:</span>
                        <span className="text-cyan-400 font-bold">{selectedNode.team}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">ESTIMATED LAUNCH:</span>
                        <span className="text-rose-400 font-bold">{selectedNode.year} {selectedNode.quarter}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-850">
                      <span className="text-[9px] font-mono text-pink-400 uppercase tracking-wider block">PRIMARY INTEGRATIONS:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedNode.technologies.map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-[9px] font-mono text-pink-300 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Progress slider bar representation */}
                    <div className="space-y-1 pt-2 border-t border-slate-850">
                      <div className="flex justify-between text-[9px] font-mono text-slate-500">
                        <span>ESTIMATED VELOCITY MATRIX:</span>
                        <span className="text-emerald-400 font-bold">{selectedNode.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-850">
                        <div 
                          className="bg-gradient-to-r from-pink-500 to-cyan-500 h-full transition-all duration-1000"
                          style={{ width: `${selectedNode.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Dr. Sammium Prognostic/Forecasting output */}
                    <div className="border-t border-slate-850 pt-3">
                      {aiLoading ? (
                        <div className="py-8 flex flex-col items-center justify-center text-center gap-2">
                          <div className="w-5 h-5 rounded-full border-2 border-t-pink-500 border-r-pink-500 border-transparent animate-spin" />
                          <span className="text-[9px] font-mono text-pink-400 animate-pulse uppercase">COGNITIVE SENSOR SYNC IN PROGRESS...</span>
                        </div>
                      ) : aiError ? (
                        <div className="p-2.5 bg-red-950/40 border border-red-500/20 text-red-300 text-[9px] rounded font-mono">
                          <span className="font-bold text-red-400 uppercase block mb-0.5">TRANSMISSION INTERRUPTION:</span>
                          {aiError}
                        </div>
                      ) : aiResponse ? (
                        <div className="p-3 bg-slate-900/60 rounded border border-slate-850 font-mono text-[9px] text-slate-300 leading-relaxed max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
                          <div className="border-b border-slate-850 pb-1 mb-1.5 flex justify-between items-center text-[8px] text-pink-400 select-none">
                            <span>PROGNOSTIC VECTOR FEED</span>
                            <button onClick={() => setAiResponse("")} className="hover:underline">CLEAR</button>
                          </div>
                          <div className="markdown-body">
                            <ReactMarkdown>{aiResponse}</ReactMarkdown>
                          </div>
                        </div>
                      ) : null}
                    </div>

                  </div>

                  {/* Forecast Trigger Button bottom align */}
                  {!aiResponse && !aiLoading && (
                    <button
                      onClick={triggerAiForecast}
                      className="w-full p-2.5 rounded bg-pink-500 hover:bg-pink-400 text-slate-950 font-mono font-bold text-[10px] uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-[0_0_15px_rgba(236,72,153,0.15)]"
                    >
                      <Sparkles className="w-4 h-4 text-slate-950 animate-pulse" />
                      PROGNOSTIC ROADMAP ASSESSMENT
                    </button>
                  )}

                  {selectedNode.isCustom && (
                    <button
                      onClick={(e) => handleDeleteNode(selectedNode.id, e)}
                      className="text-[9px] font-mono text-red-400/80 hover:text-red-400 hover:underline mt-2 text-center"
                    >
                      Delete Milestone From Matrix
                    </button>
                  )}

                </div>
              ) : (
                <div className="h-full border border-slate-800 rounded-xl bg-slate-950 flex flex-col items-center justify-center text-center p-8">
                  <Activity className="w-8 h-8 text-slate-700 animate-pulse mb-3" />
                  <p className="text-xs text-slate-500 font-mono">
                    Select a quarter roadmap card from the track view to inspect specific technical indicators.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
