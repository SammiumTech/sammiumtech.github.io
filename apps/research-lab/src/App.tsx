import React, { useState, useEffect } from "react";
import { 
  Cpu, 
  Orbit, 
  Activity, 
  Brain, 
  Terminal, 
  Volume2, 
  VolumeX, 
  Zap, 
  Laptop,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Clock,
  FlaskConical,
  Bot,
  Eye,
  Wrench,
  BookOpen,
  GitBranch,
  Globe,
  Flame
} from "lucide-react";
import { sounds } from "./utils/sounds";

// Import Station components
import { AICognitiveNexus } from "./components/AICognitiveNexus";
import { RoboticSwarm } from "./components/RoboticSwarm";
import { QuantumOrbit } from "./components/QuantumOrbit";
import { CellularAutomata } from "./components/CellularAutomata";
import { TelemetryHub } from "./components/TelemetryHub";
import { InteractiveStarfield } from "./components/InteractiveStarfield";
import { AIExperimentVault } from "./components/AIExperimentVault";
import { AIAgentLaboratory } from "./components/AIAgentLaboratory";
import { CosmicGalaxyCursor } from "./components/CosmicGalaxyCursor";
import { NeuralObservatory } from "./components/NeuralObservatory";
import { PrototypeSandbox } from "./components/PrototypeSandbox";
import { KnowledgeCore } from "./components/KnowledgeCore";
import { ExperimentTimeline } from "./components/ExperimentTimeline";
import { ImpactSimulator } from "./components/ImpactSimulator";
import { EnterpriseSuite } from "./components/EnterpriseSuite";
import { SaoLogin } from "./components/SaoLogin";
import { SystemStatus } from "./components/SystemStatus";
import { SystemEventLogStreamer } from "./components/SystemEventLogStreamer";
import { StationTransition } from "./components/StationTransition";
import { AnimatePresence } from "motion/react";
import { VrHudOverlay } from "./components/VrHudOverlay";
import { YuiHologram } from "./components/YuiHologram";
import { CinematicBoot } from "./components/CinematicBoot";
import { SentinelConsciousness } from "./components/SentinelConsciousness";

type ActiveStation = "ai-nexus" | "robotics-swarm" | "quantum-orbit" | "cellular-matrix" | "telemetry-center" | "ai-vault" | "ai-lab" | "neural-observatory" | "prototype-sandbox" | "knowledge-core" | "experiment-timeline" | "impact-simulator" | "research-rankings";

export default function App() {
  const [operatorName, setOperatorName] = useState<string>("");
  const [activeStation, setActiveStation] = useState<ActiveStation>("ai-nexus");
  const [isRgbOverdrive, setIsRgbOverdrive] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [systemTime, setSystemTime] = useState("");
  const [isVrMode, setIsVrMode] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);
  const [isConsciousnessActive, setIsConsciousnessActive] = useState(false);

  // Listen for CTRL + SHIFT + SPACE to toggle consciousness mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.code === "Space") {
        e.preventDefault();
        sounds.playOverdrive();
        setIsConsciousnessActive(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Keep galactic clock ticking
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystemTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }) + " UTC"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Synchronize low-frequency ambient hum loop with application active state
  useEffect(() => {
    if (isAudioEnabled && operatorName) {
      sounds.startAmbientHum(isRgbOverdrive);
    } else {
      sounds.stopAmbientHum();
    }
    // Cleanup hum on unmount
    return () => {
      sounds.stopAmbientHum();
    };
  }, [isAudioEnabled, isRgbOverdrive, operatorName]);

  const handleStationChange = (station: ActiveStation) => {
    sounds.playClick();
    sounds.playStationChime(station);
    setActiveStation(station);
  };

  const toggleRgbOverdrive = () => {
    sounds.playOverdrive();
    setIsRgbOverdrive(!isRgbOverdrive);
  };

  const toggleAudio = () => {
    sounds.toggle(!isAudioEnabled);
    setIsAudioEnabled(!isAudioEnabled);
  };

  const toggleVrMode = () => {
    const nextVr = !isVrMode;
    sounds.playVrToggle(nextVr);
    setIsVrMode(nextVr);
    
    // Inject custom event to post directly into the log stream
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("inject-system-log", {
          detail: {
            message: `Virtual neural VR Headset simulation link switched ${nextVr ? "ON" : "OFF"}. Holographic HUD calibrating.`,
            category: nextVr ? "SUCCESS" : "SYSTEM",
            code: `VR_HELM_SW // ${nextVr ? "ACTIVE" : "STANDBY"}`
          }
        })
      );
    }
  };

  if (!operatorName) {
    return (
      <SaoLogin 
        onLoginSuccess={(name) => {
          setOperatorName(name);
          setIsAudioEnabled(true);
        }} 
        isRgbOverdrive={isRgbOverdrive} 
      />
    );
  }

  if (!bootComplete) {
    return (
      <CinematicBoot 
        operatorName={operatorName} 
        onBootComplete={() => setBootComplete(true)} 
      />
    );
  }

  return (
    <>
      <div 
        className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col relative transition-all duration-500 overflow-x-hidden ${
          isRgbOverdrive ? "selection:bg-orange-500 selection:text-white" : "selection:bg-cyan-500 selection:text-slate-900"
        }`}
        style={{ filter: isVrMode ? "url(#vr-fisheye-filter)" : "none", transition: "filter 0.4s ease" }}
      >
      
      {/* Decorative RGB scrolling top indicator */}
      {isRgbOverdrive && (
        <div className="h-1.5 w-full rgb-overdrive-bar relative z-50 shadow-[0_0_15px_rgba(249,115,22,0.6)]" />
      )}

      {/* Cybernetic Grid matrix background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/60 via-[#030712] to-[#020617] pointer-events-none z-0" />

      {/* Interactive responsive particle starfield */}
      <InteractiveStarfield isRgbOverdrive={isRgbOverdrive} />

      {/* Dynamic Cosmic Galaxy trailing cursor and global click time-jump sound listener */}
      <CosmicGalaxyCursor isRgbOverdrive={isRgbOverdrive} />

      {/* Glowing atmospheric nodes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none z-0 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none z-0 animate-pulse" />

      {/* System Diagnostics Status overlay sliding down from top right */}
      <SystemStatus operatorName={operatorName} />

      {/* Primary Container */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 flex flex-col gap-6 relative z-10">
        
        {/* Futuristic Header Deck */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/85 border border-slate-800 shadow-2xl backdrop-blur-md relative overflow-hidden">
          {/* Subtle line decoration */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-400/40 to-transparent"></div>
 
          {/* Title Area */}
          <div className="flex items-center gap-4.5">
            <div className={`p-3 rounded-xl border transition-all duration-300 relative ${
              isRgbOverdrive 
                ? "bg-slate-950 border-orange-500/60 shadow-[0_0_12px_rgba(249,115,22,0.45)]" 
                : "bg-slate-950 border-slate-800"
            }`}>
              <div className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
              </div>
              <Laptop className={`w-6 h-6 ${isRgbOverdrive ? "text-orange-450" : "text-cyan-400"}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-display font-bold tracking-[0.06em] text-orange-400 uppercase">
                  📡 SAMMIUM RESEARCH & INNOVATION LABORATORY
                </span>
                <span className="px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/30 text-[10px] font-display text-orange-400 uppercase font-bold animate-pulse">
                  DECISION SUPPORT CORE
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold tracking-wide bg-gradient-to-r from-white via-orange-100 to-slate-300 bg-clip-text text-transparent mt-1">
                SENTINEL RESEARCH PLATFORM
              </h1>
            </div>
          </div>
 
          {/* Interactive controls bar (Audio + RGB switches) */}
          <div className="flex items-center flex-wrap gap-3">
            {/* Operator Status Badge */}
            <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-850 flex items-center gap-2 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-500 uppercase font-bold text-[10px]">OPERATOR:</span>
              <span className="text-orange-400 font-bold uppercase">{operatorName}</span>
              <button
                onClick={() => {
                  sounds.playClick();
                  setOperatorName("");
                }}
                className="ml-2 px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[8px] text-red-400 hover:bg-red-500/20 font-mono font-bold uppercase transition-all cursor-pointer"
                title="Disconnect NerveGear Neural Link"
              >
                DISCONNECT
              </button>
            </div>
 
            {/* Live Clock */}
            <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-850 flex items-center gap-2 text-xs font-mono text-slate-400">
              <Clock className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
              <span>{systemTime || "00:00:00 UTC"}</span>
            </div>
 
            {/* Audio Synth Switch */}
            <button
              onClick={toggleAudio}
              onMouseEnter={() => sounds.playHover()}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isAudioEnabled
                  ? "bg-slate-950 border-emerald-500/40 text-emerald-400 hover:bg-slate-900"
                  : "bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-300 hover:bg-slate-900"
              }`}
            >
              {isAudioEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span>SYNTH ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-600" />
                  <span>MUTED</span>
                </>
              )}
            </button>
 
            {/* RGB OVERDRIVE Switch */}
            <button
              onClick={toggleRgbOverdrive}
              onMouseEnter={() => sounds.playHover()}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isRgbOverdrive
                  ? "bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-600 border-orange-400 text-white hover:opacity-90 shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Zap className={`w-4 h-4 ${isRgbOverdrive ? "text-yellow-300 animate-bounce" : "text-slate-400"}`} />
              <span>SENTINEL OVERCLOCK</span>
            </button>

            {/* VR VIEW Switch */}
            <button
              onClick={toggleVrMode}
              onMouseEnter={() => sounds.playHover()}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isVrMode
                  ? "bg-slate-950 border-cyan-400 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.35)]"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50"
              }`}
              title="Toggle immersive VR Neural Headset Lens & HUD Grid simulation mode"
            >
              <Eye className={`w-4 h-4 ${isVrMode ? "text-cyan-400 animate-pulse" : "text-slate-400"}`} />
              <span>{isVrMode ? "VR VIEW: ON" : "VR VIEW"}</span>
            </button>

            {/* CONSCIOUSNESS MODE Switch */}
            <button
              onClick={() => {
                sounds.playOverdrive();
                setIsConsciousnessActive(true);
              }}
              onMouseEnter={() => sounds.playHover()}
              className="px-3 py-1.5 rounded-lg border border-purple-500/40 text-purple-400 bg-slate-950 hover:bg-purple-950/20 hover:text-white transition-all cursor-pointer flex items-center gap-2 animate-pulse font-mono text-xs font-bold shadow-[0_0_15px_rgba(168,85,247,0.2)]"
              title="Enter Sentinel Consciousness Mode. Hotkey: [CTRL + SHIFT + SPACE]"
            >
              <Brain className="w-4 h-4 text-purple-400 animate-spin-slow" />
              <span>COGNITIVE MIND</span>
            </button>
          </div>
        </header>

        {/* Station Navigation Station Controls */}
        <nav className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-[repeat(13,_minmax(0,_1fr))] gap-2">
          {[
            {
              id: "ai-nexus",
              label: "🧠 AI Research",
              icon: Brain,
              color: "text-orange-400"
            },
            {
              id: "neural-observatory",
              label: "🌦 Climate Anal",
              icon: Eye,
              color: "text-amber-400"
            },
            {
              id: "ai-vault",
              label: "🚁 Drone Fleet",
              icon: FlaskConical,
              color: "text-orange-400"
            },
            {
              id: "ai-lab",
              label: "🔬 Lab Manager",
              icon: Bot,
              color: "text-amber-400"
            },
            {
              id: "robotics-swarm",
              label: "🤖 Robotics Lab",
              icon: Activity,
              color: "text-orange-400"
            },
            {
              id: "quantum-orbit",
              label: "🛰 GIS & Map",
              icon: Orbit,
              color: "text-orange-400"
            },
            {
              id: "cellular-matrix",
              label: "🏙 Digital Twin",
              icon: Cpu,
              color: "text-emerald-400"
            },
            {
              id: "telemetry-center",
              label: "📡 IoT Sensors",
              icon: Terminal,
              color: "text-amber-400"
            },
            {
              id: "prototype-sandbox",
              label: "🌊 Disaster Risk",
              icon: Wrench,
              color: "text-orange-400"
            },
            {
              id: "knowledge-core",
              label: "📂 Research Repo",
              icon: BookOpen,
              color: "text-amber-400"
            },
            {
              id: "experiment-timeline",
              label: "🌾 Smart Ag",
              icon: GitBranch,
              color: "text-orange-400"
            },
            {
              id: "impact-simulator",
              label: "⚡ Energy Grid",
              icon: Globe,
              color: "text-emerald-400"
            },
            {
              id: "research-rankings",
              label: "📊 Lab KPIs",
              icon: Flame,
              color: "text-orange-400"
            }
          ].map((tab) => {
            const isSelected = activeStation === tab.id;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleStationChange(tab.id as ActiveStation)}
                onMouseEnter={() => sounds.playHover()}
                className={`py-3 px-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? "bg-slate-900 border-orange-500/60 shadow-[0_0_12px_rgba(249,115,22,0.25)] text-slate-100"
                    : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70 text-slate-400 hover:text-slate-200"
                }`}
              >
                {/* Active bottom marker line */}
                {isSelected && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-orange-500" />
                )}
                <TabIcon className={`w-4.5 h-4.5 ${tab.color}`} />
                <span className="text-[11px] font-sans font-semibold uppercase tracking-wider">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Main Lab Layout with 2 columns: Active Playground and Real-time Streamer */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          {/* Station Playground Area */}
          <main className="min-w-0 flex-1">
            <StationTransition stationId={activeStation}>
              {activeStation === "ai-nexus" && <AICognitiveNexus isRgbOverdrive={isRgbOverdrive} operatorName={operatorName} />}
              {activeStation === "neural-observatory" && <NeuralObservatory isRgbOverdrive={isRgbOverdrive} />}
              {activeStation === "ai-vault" && <AIExperimentVault isRgbOverdrive={isRgbOverdrive} />}
              {activeStation === "ai-lab" && <AIAgentLaboratory isRgbOverdrive={isRgbOverdrive} />}
              {activeStation === "robotics-swarm" && <RoboticSwarm isRgbOverdrive={isRgbOverdrive} />}
              {activeStation === "quantum-orbit" && <QuantumOrbit isRgbOverdrive={isRgbOverdrive} />}
              {activeStation === "cellular-matrix" && <CellularAutomata isRgbOverdrive={isRgbOverdrive} />}
              {activeStation === "telemetry-center" && <TelemetryHub isRgbOverdrive={isRgbOverdrive} isVrMode={isVrMode} />}
              {activeStation === "prototype-sandbox" && <PrototypeSandbox isRgbOverdrive={isRgbOverdrive} />}
              {activeStation === "knowledge-core" && <KnowledgeCore isRgbOverdrive={isRgbOverdrive} />}
              {activeStation === "experiment-timeline" && <ExperimentTimeline isRgbOverdrive={isRgbOverdrive} />}
              {activeStation === "impact-simulator" && <ImpactSimulator isRgbOverdrive={isRgbOverdrive} />}
              {activeStation === "research-rankings" && <EnterpriseSuite isRgbOverdrive={isRgbOverdrive} operatorName={operatorName} />}
            </StationTransition>
          </main>

          {/* Real-time System Event log streamer in a narrow right column */}
          <aside className="w-full lg:sticky lg:top-6 lg:max-h-[750px] flex flex-col gap-6">
            <SystemEventLogStreamer 
              operatorName={operatorName}
              activeStation={activeStation}
              isRgbOverdrive={isRgbOverdrive}
            />
          </aside>
        </div>

        {/* Immersive System Information Footer */}
        <footer className="p-4 rounded-xl bg-slate-900/60 border border-slate-850 text-[10px] font-mono text-slate-500 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-orange-400">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
              PORT 3000 // SECURE DECISION SUPPORT SYSTEM ACCESS
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span>DEVELOPER PORTAL VERIFIED</span>
          </div>
          <div className="flex items-center gap-2">
            <span>"Sentinel Decision Support Engine v6.0"</span>
            <span className="text-orange-400">📡 SENTINEL DECISION SUPPORT NETWORK</span>
          </div>
        </footer>

      </div>
    </div>
    <VrHudOverlay isVrMode={isVrMode} operatorName={operatorName} />
    <YuiHologram activeStation={activeStation} operatorName={operatorName} />
    <AnimatePresence>
      {isConsciousnessActive && (
        <SentinelConsciousness
          isActive={isConsciousnessActive}
          onClose={() => setIsConsciousnessActive(false)}
          operatorName={operatorName}
        />
      )}
    </AnimatePresence>
  </>
  );
}
