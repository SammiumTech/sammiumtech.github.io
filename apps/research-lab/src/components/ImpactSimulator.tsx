import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { 
  Globe, 
  TrendingUp, 
  Zap, 
  Sparkles, 
  Shield, 
  Trash2, 
  Plus, 
  ArrowRight, 
  Clock, 
  AlertTriangle, 
  HeartPulse, 
  Leaf, 
  Cpu,
  BarChart3,
  Flame,
  User,
  Scale,
  Award,
  Maximize2
} from "lucide-react";
import { sounds } from "../utils/sounds";

export interface ImpactProject {
  id: string;
  name: string;
  category: "Community Systems" | "Healthcare AI" | "Agriculture Intelligence";
  description: string;
  beforeState: string;
  afterState: string;
  metricLabel: string;
  metricUnit: string;
  beforeVal: number;
  afterVal: number;
  isCustom?: boolean;
}

const DEFAULT_PROJECTS: ImpactProject[] = [
  {
    id: "imp-smart-comm",
    name: "Smart Community AI",
    category: "Community Systems",
    description: "Decentralized public intelligence hubs managing localized air scrubbers, warning systems, and smart grids.",
    beforeState: "Manual records and delayed localized hazard notifications",
    afterState: "AI-assisted real-time automated decision making and active grid hazard mitigation",
    metricLabel: "Emergency Dispatch Latency",
    metricUnit: "seconds",
    beforeVal: 1800,
    afterVal: 45
  },
  {
    id: "imp-smart-helmet",
    name: "Smart Helmet HUD Alerts",
    category: "Healthcare AI",
    description: "Dermal bio-sensors embedded in heavy-duty safety gear tracking vitals in extreme thermal/atmospheric environments.",
    beforeState: "Standard passive physical armor without active warning feedback",
    afterState: "Pre-emptive oxygen saturation alerts and heads-up thermal overlays",
    metricLabel: "Carbon Exposure Incidents",
    metricUnit: "incidents / yr",
    beforeVal: 64,
    afterVal: 2
  },
  {
    id: "imp-rehabmate",
    name: "RehabMate Therapeutic AI",
    category: "Healthcare AI",
    description: "Deep neural joint tracking targeting prosthetic actuation and fine-motor muscular feedback loops.",
    beforeState: "Subjective, paper-bound rehabilitation journals and sporadic clinical assessment",
    afterState: "Dynamic millisecond-level haptic feedback loops and precise digital kinematic tracking",
    metricLabel: "Therapeutic Recovery Timeline",
    metricUnit: "weeks",
    beforeVal: 24,
    afterVal: 9
  },
  {
    id: "imp-ceres-swarm",
    name: "Ceres Swarm Agriculture",
    category: "Agriculture Intelligence",
    description: "Low-altitude crop-scanning drone fleets synced with biological land water-harvesters.",
    beforeState: "Manual crop inspection schedules, soil sampling delay, and uniform irrigation",
    afterState: "Continuous neural biosensing, micro-targeted hydration, and automatic yield forecast",
    metricLabel: "Crops Harvest Deficit",
    metricUnit: "metric tons / sector",
    beforeVal: 85,
    afterVal: 12
  }
];

interface DeploymentScale {
  id: string;
  label: string;
  multiplier: number;
  description: string;
}

const SCALES: DeploymentScale[] = [
  { id: "hub", label: "Single Hub", multiplier: 1, description: "A highly isolated research outpost grid." },
  { id: "city", label: "Municipal Grid", multiplier: 18, description: "Deploying across an entire metropolitan area." },
  { id: "region", label: "Regional Mesh", multiplier: 120, description: "Integrating multiple municipal lattices together." },
  { id: "global", label: "Global Lattice", multiplier: 850, description: "Worldwide synchronized deployment via space arrays." }
];

export const ImpactSimulator: React.FC<{ isRgbOverdrive: boolean }> = ({ isRgbOverdrive }) => {
  const [projects, setProjects] = useState<ImpactProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<ImpactProject | null>(null);
  const [selectedScale, setSelectedScale] = useState<DeploymentScale>(SCALES[0]);

  // Form states for creating custom project
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<"Community Systems" | "Healthcare AI" | "Agriculture Intelligence">("Community Systems");
  const [newDescription, setNewDescription] = useState("");
  const [newBeforeState, setNewBeforeState] = useState("");
  const [newAfterState, setNewAfterState] = useState("");
  const [newMetricLabel, setNewMetricLabel] = useState("");
  const [newMetricUnit, setNewMetricUnit] = useState("");
  const [newBeforeVal, setNewBeforeVal] = useState("");
  const [newAfterVal, setNewAfterVal] = useState("");

  // AI-powered simulation briefing
  const [aiReport, setAiReport] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulateError, setSimulateError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("sammium_impact_projects");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProjects(parsed);
        if (parsed.length > 0) setSelectedProject(parsed[0]);
      } catch (e) {
        setProjects(DEFAULT_PROJECTS);
        setSelectedProject(DEFAULT_PROJECTS[0]);
      }
    } else {
      setProjects(DEFAULT_PROJECTS);
      setSelectedProject(DEFAULT_PROJECTS[0]);
    }
  }, []);

  const saveToStorage = (updated: ImpactProject[]) => {
    localStorage.setItem("sammium_impact_projects", JSON.stringify(updated));
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newBeforeState || !newAfterState || !newMetricLabel || !newMetricUnit) {
      sounds.playError();
      return;
    }

    sounds.playLaser();
    const newProj: ImpactProject = {
      id: "imp-" + Date.now(),
      name: newName,
      category: newCategory,
      description: newDescription || "Custom simulated lab initiative.",
      beforeState: newBeforeState,
      afterState: newAfterState,
      metricLabel: newMetricLabel,
      metricUnit: newMetricUnit,
      beforeVal: Number(newBeforeVal) || 100,
      afterVal: Number(newAfterVal) || 10,
      isCustom: true
    };

    const updated = [newProj, ...projects];
    setProjects(updated);
    saveToStorage(updated);
    setSelectedProject(newProj);
    setIsAdding(false);

    // Reset Form
    setNewName("");
    setNewCategory("Community Systems");
    setNewDescription("");
    setNewBeforeState("");
    setNewAfterState("");
    setNewMetricLabel("");
    setNewMetricUnit("");
    setNewBeforeVal("");
    setNewAfterVal("");
    setAiReport("");
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playError();
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    saveToStorage(updated);
    if (selectedProject?.id === id) {
      setSelectedProject(updated[0] || null);
    }
  };

  // Trigger Dr. Sammium deployment forecast API
  const handleSimulateDeployment = async () => {
    if (!selectedProject || isSimulating) return;

    sounds.playSingularity();
    setIsSimulating(true);
    setSimulateError(null);
    setAiReport("");

    try {
      const res = await fetch("/api/impact/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          projectName: selectedProject.name,
          beforeState: selectedProject.beforeState,
          afterState: selectedProject.afterState,
          scale: selectedScale.label,
          impactMultiplier: selectedScale.multiplier
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Simulation stream interrupted.");
      }

      sounds.playLaser();
      setAiReport(data.text || "No report generated.");
    } catch (err: any) {
      console.error(err);
      sounds.playError();
      setSimulateError(err.message || "Failed to establish network sync with Dr. Sammium's neural impact forecast.");
    } finally {
      setIsSimulating(false);
    }
  };

  // Calculations for Scaled Metric Savings
  const beforeMetricCalculated = selectedProject ? selectedProject.beforeVal * selectedScale.multiplier : 0;
  const afterMetricCalculated = selectedProject ? selectedProject.afterVal * selectedScale.multiplier : 0;
  const savingPercentage = selectedProject 
    ? Math.round(((selectedProject.beforeVal - selectedProject.afterVal) / selectedProject.beforeVal) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="impact-simulator-station">
      {/* Left Column: Project Catalog Selector */}
      <div className="xl:col-span-4 flex flex-col gap-4">
        <div className={`p-4 rounded-xl border bg-slate-900/95 shadow-xl relative overflow-hidden transition-all duration-300 ${
          isRgbOverdrive ? "border-pink-500/40 ring-2 ring-pink-500/10" : "border-slate-800"
        }`}>
          <div className="absolute inset-0 bg-[radial-gradient(#ec4899_0.8px,transparent_0.8px)] [background-size:14px_14px] opacity-10 pointer-events-none" />

          <div className="relative z-10 flex flex-col h-[560px]">
            {/* Header Deck Controls */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-pink-400 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-pink-500 animate-spin-slow" /> [ PROJECT_CATALOG ]
              </h3>
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsAdding(!isAdding);
                }}
                className="p-1 px-2.5 rounded bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-[10px] font-mono text-pink-400 font-bold flex items-center gap-1 cursor-pointer transition-all shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                INIT SYSTEM
              </button>
            </div>

            {/* List of projects */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {projects.map((proj) => {
                const isSelected = selectedProject?.id === proj.id;
                return (
                  <div
                    key={proj.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedProject(proj);
                      setIsAdding(false);
                      setAiReport("");
                    }}
                    onMouseEnter={() => sounds.playHover()}
                    className={`p-3 rounded-lg border text-left transition-all relative cursor-pointer group ${
                      isSelected
                        ? "bg-slate-950 border-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.15)]"
                        : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-0 left-0 w-1 h-full bg-pink-500 rounded-l-md" />
                    )}

                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase shrink-0 ${
                        proj.category === "Community Systems"
                          ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
                          : proj.category === "Healthcare AI"
                          ? "bg-pink-500/10 border border-pink-500/20 text-pink-400"
                          : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                      }`}>
                        {proj.category}
                      </span>
                    </div>

                    <h4 className="text-xs font-mono font-bold tracking-tight text-slate-200 line-clamp-1 group-hover:text-pink-400 transition-colors">
                      {proj.name}
                    </h4>

                    <p className="text-[10px] text-slate-400 font-mono line-clamp-2 mt-1 leading-relaxed">
                      {proj.description}
                    </p>

                    {/* Delete button for custom files */}
                    {proj.isCustom && (
                      <button
                        onClick={(e) => handleDeleteProject(proj.id, e)}
                        title="Delete custom model from matrix"
                        className="absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 rounded transition-all cursor-pointer bg-slate-950/80"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Dynamic Simulator Viewport */}
      <div className="xl:col-span-8 flex flex-col gap-4">
        {isAdding ? (
          /* Create Custom Project Form */
          <form
            onSubmit={handleAddProject}
            className={`p-5 rounded-xl border bg-slate-900/95 shadow-2xl relative transition-all duration-300 h-[560px] overflow-y-auto flex flex-col justify-between ${
              isRgbOverdrive ? "border-cyan-glow ring-2 ring-cyan-500/10" : "border-slate-800"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-cyan-400" /> [ CREATE_CUSTOM_IMPACT_MODEL ]
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

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[9px] font-mono text-slate-400 mb-1 uppercase">Project Name:</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Ceres Irrigation Loop"
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-1.5 text-xs font-mono text-cyan-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-slate-400 mb-1 uppercase">Category:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-1.5 text-xs font-mono text-cyan-300 focus:outline-none cursor-pointer"
                  >
                    <option value="Community Systems">Community Systems</option>
                    <option value="Healthcare AI">Healthcare AI</option>
                    <option value="Agriculture Intelligence">Agriculture Intelligence</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-[9px] font-mono text-slate-400 mb-1 uppercase">Brief description:</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="e.g. Automated crop biosensors linked directly with solar water-harvesters."
                  required
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-1.5 text-xs font-mono text-cyan-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[9px] font-mono text-slate-400 mb-1 uppercase">Before State Description:</label>
                  <textarea
                    value={newBeforeState}
                    onChange={(e) => setNewBeforeState(e.target.value)}
                    rows={2}
                    placeholder="e.g. Manual soil sampling schedules and heavy water waste."
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-1.5 text-xs font-mono text-cyan-300 focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-slate-400 mb-1 uppercase">After State Description:</label>
                  <textarea
                    value={newAfterState}
                    onChange={(e) => setNewAfterState(e.target.value)}
                    rows={2}
                    placeholder="e.g. AI-assisted automated decision making and targeted solar hydration loops."
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-1.5 text-xs font-mono text-cyan-300 focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[9px] font-mono text-slate-400 mb-1 uppercase">Metric Key Label:</label>
                  <input
                    type="text"
                    value={newMetricLabel}
                    onChange={(e) => setNewMetricLabel(e.target.value)}
                    placeholder="e.g. Water consumption rate"
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-1.5 text-xs font-mono text-cyan-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-slate-400 mb-1 uppercase">Metric Unit Label:</label>
                  <input
                    type="text"
                    value={newMetricUnit}
                    onChange={(e) => setNewMetricUnit(e.target.value)}
                    placeholder="e.g. liters / sector / hr"
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-1.5 text-xs font-mono text-cyan-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[9px] font-mono text-slate-400 mb-1 uppercase">Before State Numerical Value:</label>
                  <input
                    type="number"
                    value={newBeforeVal}
                    onChange={(e) => setNewBeforeVal(e.target.value)}
                    placeholder="e.g. 500"
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-1.5 text-xs font-mono text-cyan-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-slate-400 mb-1 uppercase">After State Numerical Value:</label>
                  <input
                    type="number"
                    value={newAfterVal}
                    onChange={(e) => setNewAfterVal(e.target.value)}
                    placeholder="e.g. 110"
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-1.5 text-xs font-mono text-cyan-300 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              onMouseEnter={() => sounds.playHover()}
              className="w-full p-2.5 rounded bg-gradient-to-r from-cyan-500 to-pink-500 text-slate-950 hover:opacity-95 font-mono font-bold text-xs uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all shrink-0 mt-3"
            >
              💾 INTEGRATE PROJECT INTO DEPLOYMENT SIMULATOR
            </button>
          </form>
        ) : selectedProject ? (
          /* Active Simulator Screen */
          <div className={`flex flex-col rounded-xl border bg-slate-950 p-5 shadow-2xl relative overflow-hidden transition-all duration-500 h-[560px] justify-between ${
            isRgbOverdrive ? "border-pink-500/60 shadow-[0_0_25px_rgba(244,63,94,0.08)]" : "border-slate-800"
          }`}>
            <div className="absolute inset-0 bg-[radial-gradient(#ec4899_0.5px,transparent_0.5px)] [background-size:20px_20px] opacity-5 pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-4 overflow-y-auto pr-1 flex-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {/* Dynamic Headline requested by user */}
              <div className="border-b border-slate-800 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-2 shrink-0">
                <div>
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">DEPLOYMENT PROJECTIONS</span>
                  <h2 className="text-base md:text-lg font-mono font-bold text-slate-100 flex items-center gap-1.5">
                    <span className="text-pink-400 animate-pulse">If deployed...</span>
                    <span className="text-slate-400 text-sm">({selectedProject.name})</span>
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-pink-500/15 border border-pink-500/30 text-[10px] font-mono text-pink-400 font-bold uppercase shrink-0">
                    Slashed by {savingPercentage}%
                  </span>
                </div>
              </div>

              {/* Before and After Card Side-by-Side (Matches example schema in user spec) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* BEFORE CARD */}
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-950/10 flex flex-col gap-3 justify-between relative group hover:border-red-500/35 transition-all">
                  <div className="absolute top-2 right-3 text-[8px] font-mono text-red-500/60 select-none">HISTORIC_INDEX</div>
                  <div>
                    <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider block mb-1.5">
                      🚨 Before State
                    </span>
                    <p className="text-xs text-slate-300 font-mono leading-relaxed min-h-[3.25rem]">
                      {selectedProject.beforeState}
                    </p>
                  </div>
                  
                  <div className="border-t border-red-500/15 pt-2 mt-1">
                    <span className="text-[8px] font-mono text-red-400/80 block uppercase">UNOPTIMIZED FOOTPRINT:</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-base md:text-lg font-mono text-slate-100 font-bold font-semibold">
                        {beforeMetricCalculated.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{selectedProject.metricUnit}</span>
                    </div>
                  </div>
                </div>

                {/* AFTER CARD */}
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10 flex flex-col gap-3 justify-between relative group hover:border-emerald-500/35 transition-all">
                  <div className="absolute top-2 right-3 text-[8px] font-mono text-emerald-500/60 select-none">AI_OPTIMIZED</div>
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-1.5">
                      ✨ After State
                    </span>
                    <p className="text-xs text-slate-300 font-mono leading-relaxed min-h-[3.25rem]">
                      {selectedProject.afterState}
                    </p>
                  </div>

                  <div className="border-t border-emerald-500/15 pt-2 mt-1">
                    <span className="text-[8px] font-mono text-emerald-400/80 block uppercase">SIMULATED CORE VELOCITY:</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-base md:text-lg font-mono text-emerald-400 font-bold font-semibold">
                        {afterMetricCalculated.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{selectedProject.metricUnit}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Geographical Scale Interactive Selector */}
              <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl">
                <span className="text-[9px] font-mono text-pink-400 uppercase tracking-widest block mb-2.5">
                  🌎 GEOGRAPHICAL_DEPLOYMENT_SCALE_TUNER
                </span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {SCALES.map((scale) => {
                    const isSelected = selectedScale.id === scale.id;
                    return (
                      <button
                        key={scale.id}
                        onClick={() => {
                          sounds.playClick();
                          setSelectedScale(scale);
                        }}
                        onMouseEnter={() => sounds.playHover()}
                        className={`p-2 rounded border font-mono text-left transition-all flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? "bg-slate-950 border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.15)]"
                            : "bg-slate-900/40 border-slate-850 hover:border-slate-750 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 w-full">
                          <span className="text-[10px] font-bold uppercase truncate">{scale.label}</span>
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                            isSelected ? "bg-pink-500/10 text-pink-400" : "bg-slate-950 text-slate-500"
                          }`}>
                            x{scale.multiplier}
                          </span>
                        </div>
                        <p className="text-[8px] text-slate-500 leading-snug mt-1.5 line-clamp-1">{scale.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AI Forecasting simulation results */}
              {isSimulating ? (
                <div className="py-8 flex flex-col items-center justify-center text-center gap-2 border-t border-slate-850">
                  <div className="w-6 h-6 rounded-full border-2 border-t-pink-500 border-r-pink-500 border-transparent animate-spin" />
                  <span className="text-[10px] font-mono text-pink-400 animate-pulse uppercase">DR. SAMMIUM IS SIMULATING SOCIAL DYNAMICS...</span>
                </div>
              ) : simulateError ? (
                <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-300 text-[10px] rounded font-mono border-t border-slate-850 mt-1">
                  <span className="font-bold text-red-400 uppercase block mb-1">TRANSMISSION INTERRUPTION:</span>
                  {simulateError}
                </div>
              ) : aiReport ? (
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-850 font-mono text-xs text-slate-300 leading-relaxed max-h-[160px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
                  <div className="border-b border-slate-850 pb-1.5 mb-2.5 flex justify-between items-center text-[9px] text-pink-400 select-none">
                    <span>COGNITIVE IMPACT BRIEFING BY DR. SAMMIUM</span>
                    <button onClick={() => setAiReport("")} className="hover:underline">CLEAR</button>
                  </div>
                  <div className="markdown-body text-[10px] space-y-3">
                    <ReactMarkdown>{aiReport}</ReactMarkdown>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Bottom Panel Controls */}
            {!aiReport && !isSimulating && (
              <div className="flex gap-2 shrink-0 border-t border-slate-850 pt-3 mt-2">
                <button
                  onClick={handleSimulateDeployment}
                  className="flex-1 p-2.5 rounded bg-pink-500 hover:bg-pink-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(236,72,153,0.15)]"
                >
                  <Sparkles className="w-4 h-4 text-slate-950 animate-pulse" />
                  SYNTHESIZE SPECTRUM IMPACT STUDY
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full border border-slate-800 rounded-xl bg-slate-950 flex flex-col items-center justify-center text-center p-8">
            <Globe className="w-10 h-10 text-slate-700 animate-spin-slow mb-3" />
            <p className="text-xs text-slate-500 font-mono">
              Initialize active projection by selecting a research component from the index list on the left.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
