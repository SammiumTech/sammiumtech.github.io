import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { 
  Wrench, 
  Sparkles, 
  Plus, 
  Trash2, 
  Cpu, 
  Layers, 
  Activity, 
  RotateCcw, 
  Compass, 
  HelpCircle, 
  Lightbulb, 
  Radio, 
  Eye, 
  Settings, 
  Play, 
  Pause, 
  ShieldAlert, 
  Check, 
  ExternalLink,
  ChevronRight,
  Info,
  Terminal,
  RefreshCw,
  Send
} from "lucide-react";
import { motion } from "motion/react";
import { sounds } from "../utils/sounds";

interface PrototypeIdea {
  id: string;
  project: string;
  status: "Prototype" | "Alpha Sandbox" | "Conceptual" | "Draft";
  idea: string;
  technology: string;
  createdTime: string;
  simulatedHealth: number;
  simulatedPower: number;
  isCustom?: boolean;
}

const DEFAULT_PROTOTYPES: PrototypeIdea[] = [
  {
    id: "smart-helmet-ai",
    project: "Smart Helmet AI",
    status: "Prototype",
    idea: "Intelligent safety monitoring device with active HUD, oxygen saturation telemetry, and automated impact prediction modeling.",
    technology: "AI + Sensors",
    createdTime: "2026-07-01",
    simulatedHealth: 94.2,
    simulatedPower: 88.0
  },
  {
    id: "haptic-glove",
    project: "Exo-Skeletal Haptic Glove",
    status: "Alpha Sandbox",
    idea: "Force feedback telemetry gloves tracking high-precision hand joints during vacuum assembly simulations.",
    technology: "Actuators + Electro-magnetic Lattices",
    createdTime: "2026-06-25",
    simulatedHealth: 81.5,
    simulatedPower: 72.4
  },
  {
    id: "moss-reactor",
    project: "Bio-Moss Air Purifier",
    status: "Conceptual",
    idea: "Atmospheric scrubber utilizing bio-engineered luminescent moss culture to strip carbon monoxide and emit fluorescent oxygen.",
    technology: "Genetic Splicing + Fluid Dynamics",
    createdTime: "2026-06-18",
    simulatedHealth: 99.8,
    simulatedPower: 95.0
  }
];

export const PrototypeSandbox: React.FC<{ isRgbOverdrive: boolean }> = ({ isRgbOverdrive }) => {
  const [prototypes, setPrototypes] = useState<PrototypeIdea[]>([]);
  const [selectedProto, setSelectedProto] = useState<PrototypeIdea | null>(null);
  
  // Create Modal / Form States
  const [isAdding, setIsAdding] = useState(false);
  const [newProject, setNewProject] = useState("");
  const [newStatus, setNewStatus] = useState<"Prototype" | "Alpha Sandbox" | "Conceptual" | "Draft">("Prototype");
  const [newIdea, setNewIdea] = useState("");
  const [newTech, setNewTech] = useState("");

  // Simulated live HUD telemetry states
  const [sensorCal, setSensorCal] = useState(75);
  const [overdriveHz, setOverdriveHz] = useState(50);
  const [noiseFilter, setNoiseFilter] = useState(true);
  const [warningActive, setWarningActive] = useState(false);
  const [hudTargetLock, setHudTargetLock] = useState({ x: 120, y: 80 });

  // AI Brainstorming states
  const [aiResponse, setAiResponse] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [brainstormPrompt, setBrainstormPrompt] = useState("");

  // Diagnostic log stream state
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Load and Persist Prototypes
  useEffect(() => {
    const saved = localStorage.getItem("sammium_prototypes");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPrototypes(parsed);
        if (parsed.length > 0) setSelectedProto(parsed[0]);
      } catch (e) {
        setPrototypes(DEFAULT_PROTOTYPES);
        setSelectedProto(DEFAULT_PROTOTYPES[0]);
      }
    } else {
      setPrototypes(DEFAULT_PROTOTYPES);
      setSelectedProto(DEFAULT_PROTOTYPES[0]);
    }
  }, []);

  const saveToStorage = (updatedList: PrototypeIdea[]) => {
    localStorage.setItem("sammium_prototypes", JSON.stringify(updatedList));
  };

  // Add a new prototype idea
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject || !newIdea || !newTech) {
      sounds.playError();
      return;
    }
    sounds.playLaser();
    const newProto: PrototypeIdea = {
      id: "proto-" + Date.now(),
      project: newProject,
      status: newStatus,
      idea: newIdea,
      technology: newTech,
      createdTime: new Date().toISOString().split("T")[0],
      simulatedHealth: Math.round(75 + Math.random() * 24),
      simulatedPower: Math.round(60 + Math.random() * 38),
      isCustom: true
    };

    const updated = [newProto, ...prototypes];
    setPrototypes(updated);
    saveToStorage(updated);
    setSelectedProto(newProto);
    setIsAdding(false);

    // Reset Form
    setNewProject("");
    setNewStatus("Prototype");
    setNewIdea("");
    setNewTech("");
    
    // Clear AI states
    setAiResponse("");
    setDiagnosticLogs([]);
    setIsDiagnosticRunning(false);
  };

  // Delete prototype idea
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playError();
    const filtered = prototypes.filter(p => p.id !== id);
    setPrototypes(filtered);
    saveToStorage(filtered);
    if (selectedProto?.id === id) {
      setSelectedProto(filtered[0] || null);
      setAiResponse("");
      setDiagnosticLogs([]);
      setIsDiagnosticRunning(false);
    }
  };

  // Run Hardware Diagnostics Loop
  const runDiagnostics = () => {
    if (isDiagnosticRunning || !selectedProto) return;
    sounds.playSingularity();
    setIsDiagnosticRunning(true);
    setDiagnosticLogs([]);
    
    const logs = [
      `[sys_init] BOOTING DIAGNOSTIC STREAM FOR: ${selectedProto.project.toUpperCase()}`,
      `[sys_init] CLOCK ALIGNMENT INDEX SECURE...`,
      `[subsystem_0] INITIALIZING POWERGRID FEEDER: V_IN = ${selectedProto.simulatedPower}%`,
      `[hardware] BINDING SENSORS MATRIX ON PORT 3000...`,
      `[neural_net] FIRING COGNITIVE COLLISION PREDICTOR (98.2% lock stability)...`,
      `[comms] STANDBY FOR GALACTIC RECEPTOR LINK CHECK...`,
      `[telemetry] CALIBRATING TRANSLATION BUFFERS (FILTER=${noiseFilter ? "ON" : "OFF"})...`,
      `[sensors] SCANNING THERMAL BOUNDS... COAXIAL TEMPERATURES OPTIMAL (22.5°C)`,
      `[sys_end] DIAGNOSTIC CYCLE COMPLETED SUCCESSFULLY. ALL METRICS GREEN.`
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logs.length) {
        setDiagnosticLogs(prev => [...prev, logs[currentStep]]);
        sounds.playHover();
        currentStep++;
      } else {
        clearInterval(interval);
        setIsDiagnosticRunning(false);
        sounds.playLaser();
      }
    }, 450);
  };

  // Auto-scroll diagnostic console logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [diagnosticLogs]);

  // Request real-time brainstorming expansion from server-side Gemini
  const askGeminiBrainstorm = async (promptType: string) => {
    if (!selectedProto || aiLoading) return;
    sounds.playClick();
    setAiLoading(true);
    setAiError(null);
    setAiResponse("");

    const basePrompt = promptType === "custom" && brainstormPrompt.trim()
      ? brainstormPrompt
      : `Provide an extremely creative, detailed engineering breakdown and futuristic design concept for our science laboratory project:
Name: ${selectedProto.project}
Description: ${selectedProto.idea}
Status: ${selectedProto.status}
Technology: ${selectedProto.technology}

Specific Request: ${
        promptType === "blueprint" 
          ? "Create a 3-step physical architecture schematic with detailed sensor pathways."
          : promptType === "materials"
          ? "Describe 3 exotic sci-fi materials or quantum alloys required to build this prototype."
          : promptType === "fail"
          ? "List 3 speculative failure modes and emergency bypass actions for safety drills."
          : brainstormPrompt
      }

Include glowing scientific jargon, physical formula hypotheses, and inspiring aesthetic advice. Format output neatly with markdown headings, bold terms, and code blocks representing sensor configurations. Keep your answer highly speculative and sci-fi flavored, speaking as Dr. Sammium of the Sammium Research Labs.`;

    try {
      const res = await fetch("/api/experiments/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: basePrompt,
          vibe: "chaotic",
          systemInstruction: "You are Dr. Sammium, a visionary quantum researcher at Sammium Lab. Speak with immense intellectual fervor, introducing elegant scientific hypotheses, combining cybernetics and cosmological poetry."
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate ideas from the cognitive core.");
      }
      sounds.playLaser();
      setAiResponse(data.text || "No response received from the brain core.");
    } catch (err: any) {
      console.error(err);
      sounds.playError();
      setAiError(err.message || "Cognitive transmission lost.");
    } finally {
      setAiLoading(false);
      setBrainstormPrompt("");
    }
  };

  // HUD target drift simulation
  useEffect(() => {
    if (selectedProto?.id !== "smart-helmet-ai") return;
    const interval = setInterval(() => {
      setHudTargetLock(prev => {
        const dx = (Math.random() - 0.5) * 12;
        const dy = (Math.random() - 0.5) * 12;
        return {
          x: Math.max(30, Math.min(250, prev.x + dx)),
          y: Math.max(20, Math.min(130, prev.y + dy))
        };
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [selectedProto]);

  // Status badges
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Prototype":
        return (
          <span className="px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/30 text-[10px] font-mono font-bold text-pink-400 flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
            🧪 Prototype
          </span>
        );
      case "Alpha Sandbox":
        return (
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono font-bold text-cyan-400 flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            ⚡ Alpha
          </span>
        );
      case "Conceptual":
        return (
          <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-[10px] font-mono font-bold text-purple-400 flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            🔮 Conceptual
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded bg-slate-500/10 border border-slate-500/30 text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            📝 Draft
          </span>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="prototype-sandbox-station">
      {/* Sidebar - Prototype Idea Deck */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className={`p-4 rounded-xl border bg-slate-900/95 shadow-xl relative overflow-hidden transition-all duration-300 ${
          isRgbOverdrive ? "border-pink-500/40 ring-2 ring-pink-500/10" : "border-slate-800"
        }`}>
          {/* subtle grid backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(#ec4899_0.8px,transparent_0.8px)] [background-size:14px_14px] opacity-10 pointer-events-none" />

          <div className="relative z-10 flex flex-col h-[520px]">
            {/* Header control */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-pink-400 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 animate-spin-slow text-pink-500" /> [ PROTOTYPE_SANDBOX ]
              </h3>
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsAdding(!isAdding);
                }}
                className="p-1 px-2.5 rounded bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-[10px] font-mono text-pink-400 font-bold flex items-center gap-1 cursor-pointer transition-all shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                ADD IDEA
              </button>
            </div>

            {/* List block */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {prototypes.map((proto) => {
                const isSelected = selectedProto?.id === proto.id;
                return (
                  <div
                    key={proto.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedProto(proto);
                      setIsAdding(false);
                      setAiResponse("");
                      setDiagnosticLogs([]);
                      setIsDiagnosticRunning(false);
                    }}
                    onMouseEnter={() => sounds.playHover()}
                    className={`p-3.5 rounded-lg border text-left transition-all relative cursor-pointer group ${
                      isSelected
                        ? "bg-slate-950 border-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.15)]"
                        : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-0 left-0 w-1 h-full bg-pink-500 rounded-l-md" />
                    )}

                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <div className="min-w-0">
                        <div className="text-xs font-mono font-bold tracking-wider text-slate-100 uppercase group-hover:text-pink-400 transition-colors truncate">
                          {proto.project}
                        </div>
                        <div className="text-[10px] font-mono text-cyan-400 tracking-wide mt-0.5">
                          Tech: {proto.technology}
                        </div>
                      </div>
                      {renderStatusBadge(proto.status)}
                    </div>

                    <p className="text-[10px] text-slate-400 font-mono line-clamp-2 leading-relaxed mb-2">
                      {proto.idea}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 text-[9px] font-mono text-slate-500">
                      <div>
                        <span>Registered: {proto.createdTime}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-pink-400">Diag Lock: ON</span>
                      </div>
                    </div>

                    {/* Quick delete */}
                    <button
                      onClick={(e) => handleDelete(proto.id, e)}
                      title="Annihilate Sandbox Prototype"
                      className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 rounded hover:bg-slate-950/40 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}

              {prototypes.length === 0 && (
                <div className="text-center py-12 text-slate-500 font-mono text-xs">
                  NO UNFINISHED IDEAS FILED IN MATRIX.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        {isAdding ? (
          /* Add New Prototype Form */
          <form 
            onSubmit={handleCreate}
            className={`p-6 rounded-xl border bg-slate-900/95 shadow-2xl relative transition-all duration-300 h-[520px] overflow-y-auto flex flex-col justify-between ${
              isRgbOverdrive ? "border-cyan-glow ring-2 ring-cyan-500/10" : "border-slate-800"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-slate-800">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-cyan-400" /> [ INJECT_NEW_UNFINISHED_IDEA ]
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
                    placeholder="e.g. Smart Helmet AI"
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-2 text-xs font-mono text-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase">Development Status:</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-2 text-xs font-mono text-cyan-300 focus:outline-none cursor-pointer"
                  >
                    <option value="Prototype">🧪 Prototype</option>
                    <option value="Alpha Sandbox">⚡ Alpha Sandbox</option>
                    <option value="Conceptual">🔮 Conceptual</option>
                    <option value="Draft">📝 Draft</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase">Primary Technologies:</label>
                <input
                  type="text"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="e.g. AI + Sensors"
                  required
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-2 text-xs font-mono text-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
                />
              </div>

              <div className="mb-4">
                <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase">Core Idea / Description:</label>
                <textarea
                  value={newIdea}
                  onChange={(e) => setNewIdea(e.target.value)}
                  rows={4}
                  required
                  placeholder="e.g. A safety monitoring device with active HUD and thermal crash prevention."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-2 text-xs font-mono text-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 resize-none h-[140px]"
                />
              </div>
            </div>

            <button
              type="submit"
              onMouseEnter={() => sounds.playHover()}
              className="w-full p-2.5 rounded bg-gradient-to-r from-cyan-500 to-pink-500 text-slate-950 hover:opacity-95 font-mono font-bold text-xs uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
            >
              🚀 SPARK PROTOTYPE IDEA IN CELLULAR ARCHIVE
            </button>
          </form>
        ) : selectedProto ? (
          /* Interactive Lab Sandbox Workspace */
          <div className={`flex flex-col rounded-xl border bg-slate-950 shadow-2xl relative overflow-hidden transition-all duration-500 h-[520px] ${
            isRgbOverdrive 
              ? "border-pink-500/60 shadow-[0_0_25px_rgba(244,63,94,0.08)]" 
              : "border-slate-800"
          }`}>
            {/* Top Workspace Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 py-3 bg-slate-900/90 border-b border-slate-800 gap-2 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                    🛠️ PROTOTYPE_SIMULATOR_CORE
                  </span>
                  <span className="text-slate-600">//</span>
                  <span className="text-[10px] font-mono text-slate-400">{selectedProto.id.toUpperCase()}</span>
                </div>
                <h2 className="text-sm font-mono font-bold tracking-tight text-slate-100 uppercase mt-0.5 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-pink-400 animate-pulse" /> {selectedProto.project}
                </h2>
              </div>

              {/* Status bar */}
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="text-slate-500">Power: <span className="text-emerald-400 font-bold">{selectedProto.simulatedPower}%</span></span>
                <span className="text-slate-500">Stability: <span className="text-cyan-400 font-bold">{selectedProto.simulatedHealth}%</span></span>
              </div>
            </div>

            {/* Main Interactive Workspace Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              
              {/* Interactive visual canvas for the requested Smart Helmet AI */}
              {selectedProto.id === "smart-helmet-ai" ? (
                <div className="border border-pink-500/25 bg-slate-900/70 p-3 rounded-lg relative overflow-hidden flex flex-col md:flex-row gap-3">
                  {/* Subtle CRT scanning line overlay */}
                  <div className="absolute inset-0 bg-scanline pointer-events-none opacity-5" />

                  {/* Simulated HUD feed screen */}
                  <div className="w-full md:w-3/5 h-40 bg-slate-950 border border-slate-850 rounded-lg relative overflow-hidden flex flex-col justify-between p-2 font-mono text-[9px]">
                    {/* Simulated laser crosshairs */}
                    <div className="absolute top-0 left-1/2 w-px h-full bg-cyan-500/10" />
                    <div className="absolute top-1/2 left-0 w-full h-px bg-cyan-500/10" />

                    <div className="flex justify-between items-start text-cyan-400 relative z-10">
                      <span>HUD LOCK: ACTIVE</span>
                      <span className={`${warningActive ? "text-red-400 animate-flash font-bold" : "text-emerald-400"}`}>
                        {warningActive ? "⚠️ IMPACT WARNING" : "🟢 COGNITIVE SAFE"}
                      </span>
                    </div>

                    {/* HUD Target Lock Marker moving dynamically */}
                    <div 
                      className="absolute w-6 h-6 border border-cyan-400 rounded-full transition-all duration-1000 flex items-center justify-center -ml-3 -mt-3"
                      style={{ left: `${hudTargetLock.x}px`, top: `${hudTargetLock.y}px` }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    </div>

                    <div className="flex justify-between items-end text-slate-400 relative z-10">
                      <div className="flex flex-col">
                        <span>O2 FEED: 98.4%</span>
                        <span>TEMPER: 23.4°C</span>
                      </div>
                      <div className="text-right flex flex-col">
                        <span>CALIBRATION: {sensorCal}%</span>
                        <span>FREQUENCY: {overdriveHz} Hz</span>
                      </div>
                    </div>
                  </div>

                  {/* HUD controls parameters */}
                  <div className="flex-1 flex flex-col justify-between gap-2.5">
                    <span className="text-[9px] font-mono text-pink-400 uppercase tracking-wider block">
                      [ HUD CALIBRATION CONTROLS ]
                    </span>
                    
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>Sensors Calibration:</span>
                        <span className="text-cyan-400 font-bold">{sensorCal}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="20" 
                        max="100" 
                        value={sensorCal} 
                        onChange={(e) => { setSensorCal(Number(e.target.value)); sounds.playHover(); }}
                        className="w-full bg-slate-950 accent-pink-500 rounded h-1 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>Subsystem Overdrive:</span>
                        <span className="text-pink-400 font-bold">{overdriveHz} Hz</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="120" 
                        value={overdriveHz} 
                        onChange={(e) => { setOverdriveHz(Number(e.target.value)); sounds.playHover(); }}
                        className="w-full bg-slate-950 accent-cyan-400 rounded h-1 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-850">
                      <button
                        onClick={() => { sounds.playClick(); setNoiseFilter(!noiseFilter); }}
                        className={`p-1 px-2 text-[8px] font-mono uppercase rounded border transition-all cursor-pointer flex-1 text-center ${
                          noiseFilter 
                            ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400" 
                            : "bg-slate-950 border-slate-800 text-slate-500"
                        }`}
                      >
                        {noiseFilter ? "FILTER: ON" : "FILTER: OFF"}
                      </button>
                      <button
                        onClick={() => { sounds.playSingularity(); setWarningActive(!warningActive); }}
                        className={`p-1 px-2 text-[8px] font-mono uppercase rounded border transition-all cursor-pointer flex-1 text-center ${
                          warningActive 
                            ? "bg-red-500/20 border-red-500/50 text-red-400 animate-pulse" 
                            : "bg-slate-950 border-slate-800 text-slate-400"
                        }`}
                      >
                        {warningActive ? "WARN: ENGAGED" : "TRIGGER IMPACT"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Fallback generic beautiful visual stats box for other prototype cards */
                <div className="border border-slate-850 bg-slate-900/30 p-3.5 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
                      <Compass className="w-5 h-5 animate-spin-slow" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
                        ESTABLISHED CONCEPT MATRIX
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Lattice system is monitoring diagnostic channels safely. Adjust conceptual values below.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded bg-slate-950 border border-slate-850 text-[9px] font-mono text-slate-400 animate-pulse">
                      SYS_SECURE_LINK
                    </span>
                  </div>
                </div>
              )}

              {/* Sub-panels layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Panel 1: Diagnostic Terminal Console */}
                <div className="border border-slate-850 bg-slate-900/60 rounded-lg p-3 flex flex-col h-56 justify-between">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-850 mb-1.5 shrink-0">
                    <span className="text-[9px] font-mono font-bold text-cyan-400 flex items-center gap-1">
                      <Terminal className="w-3.5 h-3.5" /> DIAGNOSTICS_CONSOLE
                    </span>
                    <button
                      onClick={runDiagnostics}
                      disabled={isDiagnosticRunning}
                      className={`p-1 px-2 rounded text-[8px] font-mono font-bold uppercase transition-all border ${
                        isDiagnosticRunning
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse cursor-not-allowed"
                          : "bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-400 cursor-pointer"
                      }`}
                    >
                      {isDiagnosticRunning ? "PINGING..." : "PING SYSTEM"}
                    </button>
                  </div>

                  {/* Terminal log streams */}
                  <div className="flex-1 bg-slate-950 rounded p-2 overflow-y-auto font-mono text-[9px] text-slate-400 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                    {diagnosticLogs.length > 0 ? (
                      diagnosticLogs.map((log, idx) => (
                        <div key={idx} className="flex gap-1">
                          <span className="text-pink-500/60 select-none">&gt;&gt;</span>
                          <span className={log.includes("sys_end") ? "text-emerald-400 font-bold" : log.includes("sys_init") ? "text-cyan-400" : ""}>{log}</span>
                        </div>
                      ))
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 italic">
                        <Activity className="w-5 h-5 mb-1.5 text-slate-700 animate-pulse" />
                        <span>Console offline. Press PING SYSTEM to initiate dynamic sensor diagnostics loop.</span>
                      </div>
                    )}
                    <div ref={logsEndRef} />
                  </div>
                </div>

                {/* Panel 2: Dr. Sammium Brainstorming Deck */}
                <div className="border border-slate-850 bg-slate-900/60 rounded-lg p-3 flex flex-col h-56 justify-between">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-850 mb-1.5 shrink-0">
                    <span className="text-[9px] font-mono font-bold text-pink-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-pink-500" /> COGNITIVE_BRAINSTORM
                    </span>
                    <span className="text-[8px] font-mono text-slate-500">POWERED BY GEMINI 3.5</span>
                  </div>

                  {/* Response viewport or prompt buttons */}
                  <div className="flex-1 overflow-y-auto mb-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                    {aiLoading ? (
                      <div className="h-full flex flex-col items-center justify-center text-center gap-2">
                        <div className="w-6 h-6 rounded-full border-2 border-t-pink-500 border-r-pink-500 border-transparent animate-spin" />
                        <span className="text-[9px] font-mono text-pink-400 animate-pulse uppercase">TRANSMITTING CONCEPT VECTOR...</span>
                      </div>
                    ) : aiError ? (
                      <div className="p-2 bg-red-950/40 border border-red-500/20 text-red-300 text-[9px] rounded font-mono">
                        <span className="font-bold text-red-400 uppercase block mb-0.5">TRANSMISSION OVERFLOW:</span>
                        {aiError}
                      </div>
                    ) : aiResponse ? (
                      <div className="markdown-body text-[9px] font-mono text-slate-300 leading-relaxed p-1.5 bg-slate-950 rounded border border-slate-850">
                        <div className="border-b border-slate-850 pb-1.5 mb-1.5 flex justify-between items-center select-none text-[8px] text-pink-400">
                          <span>LOG_OUT // SUCCESS</span>
                          <button 
                            onClick={() => { sounds.playClick(); setAiResponse(""); }} 
                            className="hover:underline hover:text-white"
                          >
                            CLEAR
                          </button>
                        </div>
                        <ReactMarkdown>{aiResponse}</ReactMarkdown>
                      </div>
                    ) : (
                      /* Presets selectors for rapid brainstorming */
                      <div className="flex flex-col gap-1.5 h-full justify-center">
                        <span className="text-[8px] text-slate-500 uppercase font-mono block text-center mb-1">
                          SELECT BRAINSTORMING PRESSET LINK FOR DYNAMIC SYNTHESIS:
                        </span>
                        <div className="grid grid-cols-3 gap-1">
                          <button
                            onClick={() => askGeminiBrainstorm("blueprint")}
                            className="p-1.5 text-[8px] font-mono font-bold bg-slate-950/80 hover:bg-slate-950 border border-slate-850 hover:border-pink-500/40 text-slate-300 hover:text-pink-400 rounded text-center transition-all cursor-pointer"
                          >
                            ⚙️ BLUEPRINT
                          </button>
                          <button
                            onClick={() => askGeminiBrainstorm("materials")}
                            className="p-1.5 text-[8px] font-mono font-bold bg-slate-950/80 hover:bg-slate-950 border border-slate-850 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 rounded text-center transition-all cursor-pointer"
                          >
                            🧪 MATERIALS
                          </button>
                          <button
                            onClick={() => askGeminiBrainstorm("fail")}
                            className="p-1.5 text-[8px] font-mono font-bold bg-slate-950/80 hover:bg-slate-950 border border-slate-850 hover:border-amber-500/40 text-slate-300 hover:text-amber-400 rounded text-center transition-all cursor-pointer"
                          >
                            ⚠️ FAILURE MODE
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input form for custom brainstorming */}
                  <form 
                    onSubmit={(e) => { e.preventDefault(); askGeminiBrainstorm("custom"); }}
                    className="flex gap-1.5 border-t border-slate-850 pt-1.5 shrink-0"
                  >
                    <input 
                      type="text"
                      value={brainstormPrompt}
                      onChange={(e) => setBrainstormPrompt(e.target.value)}
                      placeholder="Ask Dr. Sammium about this prototype idea..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[9px] font-mono text-cyan-300 focus:outline-none focus:border-pink-500/50"
                      disabled={aiLoading}
                    />
                    <button
                      type="submit"
                      disabled={aiLoading || !brainstormPrompt.trim()}
                      className="p-1 px-2 bg-pink-500 text-slate-950 font-bold rounded text-[9px] font-mono hover:opacity-90 disabled:opacity-30 cursor-pointer shrink-0 flex items-center justify-center"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  </form>
                </div>

              </div>

            </div>

            {/* Footer Workspace status line */}
            <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-[9px] font-mono text-slate-500 gap-2 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
                <span>UNFINISHED SCIENTIFIC PROTO - CURRENTLY IN EXPERIMENT LATTICE</span>
              </div>
              <div>
                <span>SAMMIUM COGNITIVE REGISTRY PORT 3000 // PERSISTED</span>
              </div>
            </div>

          </div>
        ) : (
          <div className="h-[520px] border border-slate-800 rounded-xl bg-slate-950 flex flex-col items-center justify-center text-center p-8">
            <Wrench className="w-10 h-10 text-slate-700 animate-spin-slow mb-3" />
            <p className="text-xs text-slate-500 font-mono">
              Please register or select a prototype concept card from the left panel to execute simulation diagnostics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
