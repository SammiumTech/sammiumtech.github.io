import React, { useState, useEffect } from "react";
import { Server, ThumbsUp, Plus, Database, Sparkles, Send, Brain, Eye, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { sounds } from "../utils/sounds";
import { TelemetryData, ResearchProposal } from "../types";
import { RealTimeD3Chart } from "./RealTimeD3Chart";

interface TelemetryHubProps {
  isRgbOverdrive: boolean;
  isVrMode?: boolean;
}

const INITIAL_PROPOSALS: ResearchProposal[] = [
  {
    id: "prop-1",
    title: "Neuro-Linguistic Stellar Mapping Core",
    department: "ai",
    description: "Train Gemini parameters to translate cosmic stellar rays into structured MIDI synth streams for musical output.",
    proposer: "AstroCoder-Alpha",
    timestamp: "10m ago",
    votes: 42,
  },
  {
    id: "prop-2",
    title: "Self-Repairing Carbon-Foil Boid Swarms",
    department: "robotics",
    description: "Empower robotic boids with proximity magnetic fields to automatically reassemble broken kinetic limbs in asteroid rings.",
    proposer: "NanoGamer-99",
    timestamp: "1h ago",
    votes: 29,
  },
  {
    id: "prop-3",
    title: "RGB Lightwave Singularity Lens",
    department: "physics",
    description: "Bending white laser beams around micro planetary gravity wells to construct a dynamic, holographic space-radar dashboard.",
    proposer: "CosmicBeats",
    timestamp: "2h ago",
    votes: 56,
  }
];

export const TelemetryHub: React.FC<TelemetryHubProps> = ({ isRgbOverdrive, isVrMode }) => {
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(100);
  const [activeSyncMessage, setActiveSyncMessage] = useState("NEURAL SYNAPTIC LINK STABLE // 100% SYNC");
  const [bars, setBars] = useState<{ id: number; heightPercent: number; colorClass: string; delay: number }[]>([]);

  // Initialize randomized neural channel stream bars
  useEffect(() => {
    const COLORS = [
      "bg-cyan-500",
      "bg-pink-500",
      "bg-purple-500",
      "bg-emerald-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-amber-500",
    ];
    const generated = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      heightPercent: 25 + Math.random() * 70,
      colorClass: COLORS[i % COLORS.length],
      delay: Math.random() * 0.4,
    }));
    setBars(generated);
  }, []);

  // Sync state & trigger calibration whenever isVrMode changes (toggles)
  useEffect(() => {
    let isMounted = true;
    let transmitTimeout: any = null;
    
    const triggerCalibration = () => {
      setIsCalibrating(true);
      setIsTransmitting(true);
      setCalibrationProgress(0);
      sounds.playLaser(); // Play a cybernetic sound effect

      transmitTimeout = setTimeout(() => {
        if (isMounted) setIsTransmitting(false);
      }, 1000);
      
      const messages = [
        "ESTABLISHING SECURE NERVEGEAR LINK...",
        "SYNAPSE MAPPING OVERLAY INITIALIZED...",
        "CALIBRATING OPTICAL COGNITIVE WAVE...",
        "VR VIEW MATRIX STABILIZING...",
        "NEURAL CALIBRATION SYNC COMPLETE!"
      ];

      let currentMsgIndex = 0;
      if (isMounted) setActiveSyncMessage(messages[0]);

      const interval = setInterval(() => {
        if (!isMounted) {
          clearInterval(interval);
          return;
        }
        setCalibrationProgress((prev) => {
          const next = prev + Math.floor(Math.random() * 8) + 5;
          if (next >= 100) {
            clearInterval(interval);
            setIsCalibrating(false);
            setActiveSyncMessage("NEURAL SYNAPTIC LINK STABLE // 100% SYNC");
            return 100;
          }
          
          const msgIdx = Math.floor((next / 100) * messages.length);
          if (msgIdx !== currentMsgIndex && msgIdx < messages.length) {
            currentMsgIndex = msgIdx;
            setActiveSyncMessage(messages[msgIdx]);
          }
          return next;
        });
      }, 120);
    };

    triggerCalibration();

    return () => {
      isMounted = false;
      if (transmitTimeout) clearTimeout(transmitTimeout);
    };
  }, [isVrMode]);

  const [telemetry, setTelemetry] = useState<TelemetryData>({
    status: "initializing",
    systemCore: "Sammium-v5.0-Alpha",
    cpuUsage: 0,
    memoryUsage: 0,
    uptimeSeconds: 0,
    activeQuantumNodes: 0,
  });

  const [proposals, setProposals] = useState<ResearchProposal[]>(INITIAL_PROPOSALS);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDept, setNewDept] = useState<"ai" | "robotics" | "physics" | "cellular">("ai");
  const [newProposer, setNewProposer] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Sync real-time telemetry from backend express route
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/telemetry");
        if (res.ok) {
          const data = await res.json();
          setTelemetry(data);
        }
      } catch (err) {
        // Fallback random metrics if connection errors
        setTelemetry(prev => ({
          status: "local-simulation",
          systemCore: "Sammium-v5.0-Offline",
          cpuUsage: parseFloat((6 + Math.random() * 5).toFixed(1)),
          memoryUsage: parseFloat((42 + Math.random() * 3).toFixed(1)),
          uptimeSeconds: prev.uptimeSeconds + 2,
          activeQuantumNodes: 12,
        }));
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleVote = (id: string) => {
    sounds.playLaser();
    setProposals(prev =>
      prev.map(p => (p.id === id ? { ...p, votes: p.votes + 1 } : p))
    );
  };

  const handleAddProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    sounds.playOverdrive();
    const created: ResearchProposal = {
      id: `prop-${Date.now()}`,
      title: newTitle.trim(),
      department: newDept,
      description: newDesc.trim(),
      proposer: newProposer.trim() || "Anonymous Researcher",
      timestamp: "Just now",
      votes: 1,
    };

    setProposals([created, ...proposals]);
    setNewTitle("");
    setNewDesc("");
    setNewProposer("");
    setShowForm(false);
  };

  // Convert seconds into standard galactic clock output: HH:MM:SS
  const formatUptime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div id="telemetry-innovation-hub" className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
      {/* Momentary Full-Viewport Chromatic Aberration & Shake Warp to enhance data transmission feel */}
      {isTransmitting && (
        <div className="fixed inset-0 z-[100] pointer-events-none bg-orange-500/[0.04] mix-blend-screen animate-cyber-shake animate-chromatic border-[8px] border-orange-500/20 shadow-[inset_0_0_80px_rgba(249,115,22,0.3)]" />
      )}

      {/* Real-time Diagnostics Grid Block */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        {/* Neural Calibration Sequence Sync Overlay Card */}
        <div className={`p-4 rounded-xl border bg-slate-900/95 shadow-lg relative transition-all duration-300 ${
          isTransmitting
            ? "border-orange-500/85 animate-cyber-shake animate-chromatic aberration-overlay"
            : isRgbOverdrive
              ? "border-orange-glow animate-pulse-slow"
              : "border-slate-800"
        }`}>
          <div className="absolute top-2 right-3 text-[7px] font-mono text-slate-600">
            SECURE LINK // {isVrMode ? "VR MODE ACTIVE" : "STANDARD PREVIEW"}
          </div>
          
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-orange-400 mb-3.5 flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-orange-400 animate-pulse" /> [ NEURAL_CALIBRATION_SEQUENCE ]
          </h3>

          <div className="flex flex-col gap-3.5">
            {/* Status Message */}
            <div className="bg-slate-950 p-2.5 rounded border border-slate-850 flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <div className="text-[8px] font-mono text-slate-500 uppercase tracking-wider">CALIBRATION ENGINE STATUS</div>
                <div className="text-[10px] font-mono font-bold text-orange-300 uppercase truncate mt-0.5">
                  {isCalibrating ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping shrink-0" />
                      {activeSyncMessage}
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      {activeSyncMessage}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right ml-2 shrink-0">
                <div className="text-[8px] font-mono text-slate-500 uppercase">SYNC RATIO</div>
                <div className={`text-xs font-mono font-bold ${isCalibrating ? "text-orange-400 animate-pulse" : "text-emerald-400"}`}>
                  {calibrationProgress}%
                </div>
              </div>
            </div>

            {/* Simulated Live Progress Line */}
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-850">
              <div 
                className={`h-full transition-all duration-150 ${
                  isCalibrating ? "bg-gradient-to-r from-orange-500 via-amber-400 to-pink-500" : "bg-emerald-500"
                }`}
                style={{ width: `${calibrationProgress}%` }}
              />
            </div>

            {/* Neural Channel Data Stream Bars Visualizer */}
            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-850 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                <span>[ CHANNEL_FREQ_SPECTRUM ]</span>
                <span className="animate-pulse text-slate-400">
                  {isCalibrating ? "STREAMING REAL-TIME..." : "SYNCHRONIZED"}
                </span>
              </div>
              
              {/* Flex row of data stream bars */}
              <div className="h-16 flex items-end justify-between gap-1 px-1 pt-2 overflow-hidden select-none">
                {bars.map((bar) => (
                  <motion.div
                    key={bar.id}
                    animate={isCalibrating ? {
                      scaleY: [1, 0.2, 1.4, 0.4, 1.1, 0.6, 1],
                      opacity: [1, 0.2, 0.9, 0.3, 0.8, 0.4, 1],
                    } : {
                      scaleY: [1, 0.85, 1.05, 0.9, 1],
                      opacity: [0.7, 0.5, 0.75, 0.6, 0.7],
                    }}
                    transition={isCalibrating ? {
                      duration: 0.5 + Math.random() * 0.3,
                      repeat: Infinity,
                      delay: bar.delay,
                      ease: "easeInOut",
                    } : {
                      duration: 1.5 + Math.random() * 1.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: bar.delay * 2,
                    }}
                    className={`w-full rounded-t transition-colors duration-300 ${
                      isCalibrating ? bar.colorClass : "bg-emerald-500/80"
                    }`}
                    style={{
                      height: `${bar.heightPercent}%`,
                      transformOrigin: "bottom",
                    }}
                  />
                ))}
              </div>

              {/* Neural Bands Legend */}
              <div className="grid grid-cols-5 text-[7px] font-mono text-slate-500 uppercase text-center border-t border-slate-850/60 pt-1.5 mt-0.5">
                <div>α (ALPHA)</div>
                <div>β (BETA)</div>
                <div>θ (THETA)</div>
                <div>δ (DELTA)</div>
                <div>γ (GAMMA)</div>
              </div>
            </div>

            {/* Calibration Trigger Button */}
            <button
              onClick={() => {
                sounds.playClick();
                setIsCalibrating(true);
                setIsTransmitting(true);
                setCalibrationProgress(0);
                setTimeout(() => {
                  setIsTransmitting(false);
                }, 1000);
                const messages = [
                  "ESTABLISHING SECURE NERVEGEAR LINK...",
                  "SYNAPSE MAPPING OVERLAY INITIALIZED...",
                  "CALIBRATING OPTICAL COGNITIVE WAVE...",
                  "VR VIEW MATRIX STABILIZING...",
                  "NEURAL CALIBRATION SYNC COMPLETE!"
                ];
                let currentMsgIndex = 0;
                setActiveSyncMessage(messages[0]);
                const interval = setInterval(() => {
                  setCalibrationProgress((prev) => {
                    const next = prev + Math.floor(Math.random() * 8) + 5;
                    if (next >= 100) {
                      clearInterval(interval);
                      setIsCalibrating(false);
                      setActiveSyncMessage("NEURAL SYNAPTIC LINK STABLE // 100% SYNC");
                      return 100;
                    }
                    const msgIdx = Math.floor((next / 100) * messages.length);
                    if (msgIdx !== currentMsgIndex && msgIdx < messages.length) {
                      currentMsgIndex = msgIdx;
                      setActiveSyncMessage(messages[msgIdx]);
                    }
                    return next;
                  });
                }, 120);
              }}
              disabled={isCalibrating}
              className={`w-full py-1.5 bg-slate-950 hover:bg-slate-900 border text-[9px] font-mono uppercase tracking-wider font-bold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                isCalibrating 
                  ? "border-slate-850 text-slate-650 cursor-not-allowed" 
                  : "border-orange-500/40 text-orange-400 hover:border-orange-500"
              }`}
            >
              <RefreshCw className={`w-3 h-3 ${isCalibrating ? "animate-spin text-slate-650" : "text-orange-400"}`} />
              {isCalibrating ? "CALIBRATING SYNC..." : "TRIGGER MANUAL CALIBRATION"}
            </button>
          </div>
        </div>

        <div className={`p-4 rounded-xl border bg-slate-900/95 shadow-lg relative transition-all duration-300 ${
          isRgbOverdrive ? "border-cyan-glow" : "border-slate-800"
        }`}>
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 mb-3.5 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-cyan-400" /> [ SYSTEM_TELEMETRY_DIAGNOSTICS ]
          </h3>

          <div className="flex flex-col gap-4">
            {/* Status grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800/80">
                <div className="text-[9px] font-mono text-slate-500 uppercase">SYS STATUS</div>
                <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                  {telemetry.status.toUpperCase()}
                </div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800/80">
                <div className="text-[9px] font-mono text-slate-500 uppercase">UPTIME CLOCK</div>
                <div className="text-xs font-mono font-bold text-slate-300 mt-0.5">
                  {formatUptime(telemetry.uptimeSeconds)}
                </div>
              </div>
            </div>

            {/* Core engine description */}
            <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/60">
              <div className="text-[9px] font-mono text-slate-500 uppercase">ACTIVE CORE ENGINE</div>
              <div className="text-[11px] font-mono text-pink-400 font-bold mt-0.5">
                ⚛️ {telemetry.systemCore}
              </div>
            </div>

            {/* Simulated Live CPU usage micro-bar */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>CPU COMPUTATIONAL FLUX</span>
                <span className="text-cyan-400 font-bold">{telemetry.cpuUsage}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-pink-500 h-full transition-all duration-1000"
                  style={{ width: `${telemetry.cpuUsage * 8}%` }}
                />
              </div>
            </div>

            {/* Simulated Memory utilization */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>MEMORY CORE RETENTION</span>
                <span className="text-purple-400 font-bold">{telemetry.memoryUsage}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full transition-all duration-1000"
                  style={{ width: `${telemetry.memoryUsage}%` }}
                />
              </div>
            </div>

            {/* Real-time D3 Diagnostic Chart */}
            <RealTimeD3Chart cpu={telemetry.cpuUsage} memory={telemetry.memoryUsage} />

            {/* Quantum logical nodes count */}
            <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded border border-slate-800/60">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-mono text-slate-400">ACTIVE QUANTUM CORE NODES</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">{telemetry.activeQuantumNodes} CORES</span>
            </div>
          </div>
        </div>
      </div>

      {/* Community Experiments Innovation Board */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <div className={`p-4 rounded-xl border bg-slate-900/95 shadow-lg relative transition-all duration-300 ${
          isRgbOverdrive ? "border-pink-glow" : "border-slate-800"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-pink-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-pink-400" /> [ EXPERIMENT_INNOVATION_BOARD ]
            </h3>
            <button
              onClick={() => {
                sounds.playClick();
                setShowForm(!showForm);
              }}
              className="px-2 py-1 bg-slate-950 hover:bg-slate-900 border border-pink-500/40 text-pink-400 rounded text-[9px] font-mono uppercase tracking-wider flex items-center gap-1 transition-all"
            >
              <Plus className="w-3 h-3" />
              {showForm ? "Cancel" : "Add Proposal"}
            </button>
          </div>

          {/* Form to submit ideas */}
          {showForm && (
            <form onSubmit={handleAddProposal} className="p-3 mb-4 rounded-lg bg-slate-950 border border-slate-800 flex flex-col gap-3">
              <div className="text-[10px] font-mono font-bold text-pink-400 uppercase tracking-wider">
                🔬 PROPOSE NEW EXPERIMENT NODE
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-mono text-slate-500 block mb-1">PROPOSER alias</label>
                  <input
                    type="text"
                    required
                    value={newProposer}
                    onChange={(e) => setNewProposer(e.target.value)}
                    placeholder="E.g. GamerSci-88"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono text-slate-500 block mb-1">DEPARTMENT SECTION</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-pink-500"
                  >
                    <option value="ai">AI Models (Cognitive)</option>
                    <option value="robotics">Robotics (Swarm)</option>
                    <option value="physics">Physics (Orbit)</option>
                    <option value="cellular">Cellular Matrix</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-mono text-slate-500 block mb-1">EXPERIMENT TITLE</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="E.g. Hyper-threaded Fusion Drive"
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono text-slate-500 block mb-1">ABSTRACT (DESCRIPTION)</label>
                <textarea
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Write a brief futuristic concept outline..."
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-pink-500"
                />
              </div>

              <button
                type="submit"
                onMouseEnter={() => sounds.playHover()}
                className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> SUBMIT TO THE CORE
              </button>
            </form>
          )}

          {/* Proposals Scroller */}
          <div className="flex flex-col gap-3 max-h-[310px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {proposals.map((prop) => (
              <div 
                key={prop.id}
                className="p-3 rounded-lg bg-slate-950 border border-slate-850 hover:border-slate-800 flex items-start gap-3 justify-between transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {/* Badge */}
                    <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider ${
                      prop.department === "ai" 
                        ? "bg-cyan-950 text-cyan-400 border border-cyan-900" 
                        : prop.department === "robotics" 
                        ? "bg-pink-950 text-pink-400 border border-pink-900"
                        : prop.department === "physics" 
                        ? "bg-purple-950 text-purple-400 border border-purple-900"
                        : "bg-emerald-950 text-emerald-400 border border-emerald-900"
                    }`}>
                      {prop.department.toUpperCase()}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">
                      by {prop.proposer} • {prop.timestamp}
                    </span>
                  </div>

                  <h4 className="text-[11px] font-mono font-bold text-slate-200 tracking-wide">
                    {prop.title}
                  </h4>
                  <p className="text-[10px] font-mono text-slate-400 leading-relaxed mt-1">
                    {prop.description}
                  </p>
                </div>

                {/* Vote mechanics */}
                <button
                  onClick={() => handleVote(prop.id)}
                  onMouseEnter={() => sounds.playHover()}
                  className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-pink-500 rounded flex flex-col items-center gap-1 min-w-[38px] transition-colors group shrink-0"
                >
                  <ThumbsUp className="w-3 h-3 text-slate-500 group-hover:text-pink-400 transition-colors" />
                  <span className="text-[9px] font-mono font-bold text-slate-300 group-hover:text-pink-400">
                    {prop.votes}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
