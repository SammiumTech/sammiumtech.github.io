import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
import { Heart, Sparkles, MessageSquare, Volume2, ShieldAlert, Cpu, Activity, Server, Settings, Terminal, RefreshCw, Zap, X, Network, Database } from "lucide-react";
import { sounds } from "../utils/sounds";

interface YuiHologramProps {
  activeStation: string;
  operatorName: string;
}

// English scientific dialogue for Sentinel Core
const getSentinelComments = (user: string): Record<string, string> => ({
  "ai-nexus": `[AI RESEARCH CORE] Running community prediction modeling across 10,000 tensor threads. High-fidelity decision-support is stable, Operator ${user}.`,
  "neural-observatory": `[CLIMATE ANALYTICS] Weather, air quality indexes, UV and water levels online. Historical data matches current model predictions.`,
  "ai-vault": `[DRONE OPERATIONS] Smart surveillance and agricultural assessment drone coordinates active. Flight diagnostics logged.`,
  "ai-lab": `[LAB MANAGER] Multi-criteria spatial decision logs synchronized. Academic workflow stages (Proposal → Publication) tracking active.`,
  "robotics-swarm": `[ROBOTICS RESEARCH] Ground rover and warehouse inspection robot actuators reporting 0.02mm position tolerance. Swarm ready.`,
  "quantum-orbit": `[GIS & MAPS] Regional elevation files and Keplerian satellite orbits locked. 12-layer GIS map overlays successfully calibrated.`,
  "cellular-matrix": `[DIGITAL TWIN] Botolan digital twin running with roads, power lines, and flood zone layers. Real-time community impact simulator sync OK.`,
  "telemetry-center": `[IOT SENSORS] durable IoT sensor mesh active. Port 3000 diagnostics stream is capturing live solar panel telemetry.`,
  "prototype-sandbox": `[DISASTER RISK] Regional heat index, flood risk, and landslide vulnerabilities computed. Emergency trigger alerts configured.`,
  "knowledge-core": `[RESEARCH REPOSITORY] Pre-computed semantic vector embeddings and research publications loaded for instant decision verification.`,
  "experiment-timeline": `[SMART AGRICULTURE] Soil moisture, fertilizer timelines, and crop health forecasting calibrated with local rainfall history.`,
  "impact-simulator": `[ENERGY GRID] Smart community power load, battery storage efficiencies, and carbon offset logs active. Green grid ratio optimal.`,
  "research-rankings": `[LAB KPIS] Enterprise suite stats online. Uptime: 99.97%. Active papers: 8. Active IoT nodes: 58.`
});

// Smart Community GIS/Spatial comments
const getYuiComments = (user: string): Record<string, string> => ({
  "ai-nexus": `[GIS ANALYST] Welcome, Operator ${user}. Spatial GIS modeling shows strong correlation with urban canopy cover in Botolan grids.`,
  "neural-observatory": `[CLIMATE DECK] Climate analytics indicates temperature and humidity indexes are within normal municipal safety guidelines.`,
  "ai-vault": `[DRONE HUB] Multi-spectral drone imagery confirms 84.2% tree coverage index across central residential forestry plots.`,
  "ai-lab": `[EXPERIMENTS] All community metrics have been logged under the research simulation timeline. System fully stable.`,
  "robotics-swarm": `[ROBOT LAB] Autonomous mobile rovers have finalized the agricultural soil sample run. Check the research notes.`,
  "quantum-orbit": `[GIS LAYERS] Satellite orbits confirmed. GIS layers including roads, schools, and hospitals are aligned with GIS vectors.`,
  "digital-twin": `[DIGITAL TWIN] The 3D terrain grid is active. Evacuation center routing is calculated and updated in the GIS layer database.`,
  "iot-sensors": `[IOT NETWORK] Online sensors: 58/63. Network packet signal quality is at -68dBm. Diagnostic streams fully active.`,
  "disaster-risk": `[HAZARD MODEL] Multi-hazard risk alerts are active. Flood zones verified against a 50-year return period precipitation model.`,
  "repository": `[ACADEMIC REPO] Abstract catalog is fully indexed. Downloads and publication peer-review status metrics updated.`,
  "smart-agriculture": `[SMART AG] Rain forecast indicates potential precipitation in 48h. Fertilizer recommendations calculated accordingly.`,
  "smart-community": `[POWER MONITOR] Power consumption is showing a 12% peak-load reduction thanks to solar-battery storage cells.`,
  "system-admin": `[SYSTEM METRICS] Smart community operational KPIs verified. Active researchers: 12. Public papers published: 8. Uptime: 99.97%.`
});

const PERSISTENT_MOODS: Record<string, "happy" | "thinking" | "scanning" | "alert"> = {
  "ai-nexus": "thinking",
  "neural-observatory": "happy",
  "ai-vault": "alert",
  "ai-lab": "thinking",
  "robotics-swarm": "happy",
  "quantum-orbit": "scanning",
  "cellular-matrix": "thinking",
  "telemetry-center": "scanning",
  "prototype-sandbox": "happy",
  "knowledge-core": "thinking",
  "experiment-timeline": "scanning",
  "impact-simulator": "alert",
  "research-rankings": "happy"
};

// --- Real-time Sine-Wave Voice Visualizer ---
const VoiceVisualizerCanvas: React.FC<{ isSpeaking: boolean }> = ({ isSpeaking }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = canvas.width = 280;
    let height = canvas.height = 40;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw baseline center line
      ctx.strokeStyle = "rgba(100, 116, 139, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Dynamic variables for speaking wave
      const amp = isSpeaking ? 12 : 3;
      const freq = isSpeaking ? 0.08 : 0.03;
      phase += isSpeaking ? 0.15 : 0.04;

      // Draw primary cyan sine wave
      ctx.strokeStyle = "rgb(6, 182, 212)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const y = height / 2 + Math.sin(x * freq + phase) * amp * Math.sin(x * 0.012);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw secondary orange sine wave out of phase
      ctx.strokeStyle = "rgb(249, 115, 22)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const y = height / 2 + Math.sin(x * freq * 0.8 - phase + 1.2) * (amp * 0.7) * Math.sin(x * 0.012);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isSpeaking]);

  return <canvas ref={canvasRef} className="w-full h-10 block bg-slate-950 rounded border border-slate-900" />;
};

export const YuiHologram: React.FC<YuiHologramProps> = ({ activeStation, operatorName }) => {
  // Assistant Configuration
  const [corePersona, setCorePersona] = useState<"sentinel" | "yui">("sentinel");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const userAffectionName = operatorName.toLowerCase() === "kirito" ? "パパ" : (operatorName.toLowerCase() === "asuna" ? "ママ" : operatorName);
  
  const getDialogueText = () => {
    if (corePersona === "sentinel") {
      const comms = getSentinelComments(operatorName);
      return comms[activeStation] || `Sentinel OS initialized. Ready for commands, Operator ${operatorName}.`;
    } else {
      const comms = getYuiComments(userAffectionName);
      return comms[activeStation] || `こんにちは、${userAffectionName}様！MHCP-001のユイです！`;
    }
  };

  const [dialogue, setDialogue] = useState(getDialogueText);
  const [showBubble, setShowBubble] = useState(true);
  const [mood, setMood] = useState<"happy" | "thinking" | "scanning" | "alert" | "sleeping">("happy");
  const [isBlinking, setIsBlinking] = useState(false);
  const [activityFactor, setActivityFactor] = useState(0.3);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Automatic eye-blinking interval
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 140);
    }, 4500 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Sleep inactivity detection: goes to sleep after 25 seconds of no movement
  useEffect(() => {
    const recordActivity = () => {
      setLastActivity(Date.now());
      if (mood === "sleeping") {
        sounds.playClick();
        setMood(PERSISTENT_MOODS[activeStation] || "happy");
        setDialogue("[AWAKEN] Sentinel link restored. Cognitive receptors online.");
        setShowBubble(true);
      }
    };
    window.addEventListener("mousemove", recordActivity);
    window.addEventListener("keydown", recordActivity);
    return () => {
      window.removeEventListener("mousemove", recordActivity);
      window.removeEventListener("keydown", recordActivity);
    };
  }, [mood, activeStation]);

  useEffect(() => {
    const idleCheck = setInterval(() => {
      if (Date.now() - lastActivity > 25000 && mood !== "sleeping") {
        setMood("sleeping");
        setDialogue("[POWER_SAVE] Idle threshold reached. Sleeping. Touch screen to awaken.");
        setShowBubble(true);
      }
    }, 2000);
    return () => clearInterval(idleCheck);
  }, [lastActivity, mood]);

  // Hologram Leaning Spring Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 110 };
  const rotateXSpring = useSpring(mouseY, springConfig);
  const rotateYSpring = useSpring(mouseX, springConfig);
  const rotateX = useTransform(rotateXSpring, [-1, 1], [10, -10]);
  const rotateY = useTransform(rotateYSpring, [-1, 1], [-10, 10]);

  // Live Telemetry diagnostics stats (random fluctuations)
  const [cpuLoad, setCpuLoad] = useState(28);
  const [sysTemp, setSysTemp] = useState(34.2);
  const [activeThreads, setActiveThreads] = useState(1420);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Simulation Trigger dispatch logs helpers
  const triggerSimulationEvent = (simType: "solar_flare" | "security_sweep" | "overclock") => {
    sounds.playSingularity();
    let logMessage = "";
    let code = "INFO";

    if (simType === "solar_flare") {
      logMessage = "WARNING: HIGH EXTERNAL SOLAR WEATHER INCIDENCE REGISTERED. INDUCING IONOSPHERIC INTERFERENCE ON SATELLITE ORBIT LINES.";
      code = "SYS_WEATHER_WARN";
      setCpuLoad(78);
      setSysTemp(48.5);
    } else if (simType === "security_sweep") {
      logMessage = "FIREWALL INTEGRITY SCAN COMPLETED. 0 CYBER-THREATS DETECTED. ALL QUANTUM ENCRYPTIONS REPORT 100% HEALTHY.";
      code = "SEC_CLEAN";
      setCpuLoad(45);
    } else if (simType === "overclock") {
      logMessage = "SENTINEL OVERCLOCK INJECTED! SPIKING COGNITIVE NEURAL MATRIX FREQUENCY TO 8.2 GHZ.";
      code = "CORE_OVERCLOCK";
      setCpuLoad(95);
      setSysTemp(54.8);
      // Dispatch Overdrive Trigger globally
      const toggleEvent = new CustomEvent("inject-system-log", {
        detail: { message: "Sentinel overclocker engaged.", code: "OVERDRIVE_ENGAGED" }
      });
      window.dispatchEvent(toggleEvent);
    }

    // Trigger local audio chime and log
    sounds.playLaser();
    const event = new CustomEvent("inject-system-log", {
      detail: { message: logMessage, code }
    });
    window.dispatchEvent(event);

    setDialogue(`[SIMULATION ENGAGED] Executed ${simType.toUpperCase()} test protocols. Review logs in Telemetry hub.`);
    setShowBubble(true);
  };

  // Sync state dialogue on persona switch or station switch
  useEffect(() => {
    const text = getDialogueText();
    setDialogue(text);
    setShowBubble(true);
    setActivityFactor(0.9);

    // Sync mood state
    if (mood !== "sleeping") {
      setMood(PERSISTENT_MOODS[activeStation] || "happy");
    }

    // Simulate speaking state for animating facial mouth curves
    setIsSpeaking(true);
    const speechTimeout = setTimeout(() => {
      setIsSpeaking(false);
    }, Math.min(4500, text.length * 45));

    const speakText = corePersona === "sentinel" 
      ? text.replace(/\[.*?\]/, "") // Strip telemetry bracket tags for cleaner vocalization
      : text;

    sounds.speakYui(speakText);

    // Revert bubble after 8 seconds
    const timer = setTimeout(() => {
      setShowBubble(false);
    }, 8000);
    return () => {
      clearTimeout(timer);
      clearTimeout(speechTimeout);
    };
  }, [activeStation, corePersona]);

  // Decaying CPU loads back to baseline
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuLoad(prev => {
        if (prev > 28) return Math.max(28, prev - 4);
        return 28 + Math.floor(Math.random() * 3) - 1;
      });
      setSysTemp(prev => {
        if (prev > 34.2) return Math.max(34.2, Number((prev - 0.8).toFixed(1)));
        return Number((34.2 + (Math.random() * 0.4) - 0.2).toFixed(1));
      });
      setActiveThreads(prev => 1420 + Math.floor(Math.random() * 40) - 20);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* 1. Immersive Floating Hologram Trigger Block */}
      <div 
        id="yui-hologram-assistant" 
        className="fixed bottom-6 right-6 z-[90] flex flex-col items-end pointer-events-none font-mono"
      >
        {/* Animated Speech Bubble */}
        <AnimatePresence>
          {showBubble && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="mb-3 max-w-[280px] bg-slate-950/95 border border-orange-500/30 text-[11px] p-3 rounded-2xl rounded-br-none shadow-[0_0_20px_rgba(249,115,22,0.25)] text-orange-200 pointer-events-auto select-none relative"
            >
              {/* Dialogue indicator tail */}
              <div className="absolute right-4 -bottom-1.5 w-3 h-3 bg-slate-950 border-r border-b border-orange-500/30 rotate-45" />

              {/* Bubble header */}
              <div className="flex items-center justify-between text-[8px] text-orange-400 font-bold mb-1 tracking-wider uppercase">
                <span className="flex items-center gap-1">
                  <Cpu className="w-2.5 h-2.5 text-orange-500 animate-pulse" />
                  {corePersona === "sentinel" ? "SENTINEL AI MASTER CORE" : "YUI LEGACY PROTOCOL"}
                </span>
                <span className="text-[7px] text-slate-500">v6.0</span>
              </div>

              <p className="leading-relaxed text-[11px] text-slate-100 pr-1">
                {dialogue}
              </p>

              {/* Action commands */}
              <div className="mt-2 pt-1.5 border-t border-slate-900 flex justify-between items-center text-[8px]">
                <button 
                  onClick={() => {
                    sounds.playClick();
                    setDrawerOpen(true);
                  }}
                  className="text-cyan-400 hover:text-white uppercase font-bold cursor-pointer"
                >
                  [🚀 Open Diagnostic Panel]
                </button>
                <button 
                  onClick={() => setShowBubble(false)} 
                  className="text-slate-500 hover:text-orange-400 uppercase font-bold cursor-pointer"
                >
                  [Dismiss]
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Holographic Sphere */}
        <motion.div
          animate={{
            y: [0, -8, 0]
          }}
          transition={{
            repeat: Infinity,
            duration: 3.5,
            ease: "easeInOut"
          }}
          style={{
            perspective: 1000,
            rotateX: rotateX,
            rotateY: rotateY,
            transformStyle: "preserve-3d"
          }}
          whileHover={{ scale: 1.08 }}
          onClick={() => {
            sounds.playClick();
            setDrawerOpen(true);
          }}
          className="pointer-events-auto cursor-pointer relative flex flex-col items-center"
        >
          {/* Neon scan lines sweep */}
          <div className="absolute -bottom-6 w-14 h-16 bg-gradient-to-t from-cyan-500/20 to-transparent blur-sm rounded-full transform -skew-x-6 opacity-30 pointer-events-none" />

          {/* Glowing Aura Rings */}
          <div className="absolute inset-0 -z-20 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{
                scale: [0.95, 1.35],
                opacity: [0.6, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 2.0,
                ease: "easeOut"
              }}
              className="absolute w-14 h-14 rounded-full border border-cyan-400/40"
            />
          </div>

          {/* Core avatar capsule */}
          <div className={`p-1 rounded-full border bg-slate-950/90 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 ${
            corePersona === "sentinel" ? "border-cyan-500/60" : "border-pink-500/60"
          }`}>
            <div className="w-14 h-14 rounded-full overflow-hidden relative bg-slate-950 flex items-center justify-center border border-slate-900 shadow-inner">
              {/* Scanline sweep */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.06)_2px,transparent_2px)] bg-[size:100%_4px] pointer-events-none" />
              
              {/* Animated scanning bar overlay */}
              <motion.div 
                animate={{ y: [-10, 56, -10] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
                className="absolute left-0 w-full h-[1.5px] bg-cyan-400/40 blur-[0.5px] pointer-events-none"
              />

              <svg width="100%" height="100%" viewBox="0 0 56 56" className="w-full h-full p-2">
                {/* Background radar concentric circles */}
                <circle cx="28" cy="28" r="23" fill="none" stroke={corePersona === "sentinel" ? "rgba(6, 182, 212, 0.08)" : "rgba(244, 63, 94, 0.08)"} strokeWidth="0.5" />
                <circle cx="28" cy="28" r="17" fill="none" stroke={corePersona === "sentinel" ? "rgba(6, 182, 212, 0.12)" : "rgba(244, 63, 94, 0.12)"} strokeWidth="0.5" strokeDasharray="3,3" />

                <g className="transition-all duration-300">
                  {/* Left Eye */}
                  {mood === "sleeping" ? (
                    // Closed sleepy eyes
                    <path d="M 14 26 Q 19 30 24 26" fill="none" stroke={corePersona === "sentinel" ? "rgb(6, 182, 212)" : "rgb(244, 63, 94)"} strokeWidth="2.5" strokeLinecap="round" />
                  ) : isBlinking ? (
                    // Blinking eye
                    <line x1="14" y1="26" x2="24" y2="26" stroke={corePersona === "sentinel" ? "rgb(6, 182, 212)" : "rgb(244, 63, 94)"} strokeWidth="2.5" strokeLinecap="round" />
                  ) : mood === "thinking" ? (
                    // Narrowed inquisitive eye
                    <g>
                      <path d="M 14 24 L 24 27" stroke={corePersona === "sentinel" ? "rgb(6, 182, 212)" : "rgb(244, 63, 94)"} strokeWidth="2" strokeLinecap="round" />
                      <circle cx="19" cy="28" r="1.5" fill={corePersona === "sentinel" ? "rgb(6, 182, 212)" : "rgb(244, 63, 94)"} />
                    </g>
                  ) : mood === "alert" ? (
                    // Exclamation / Warning wide eye
                    <g>
                      <ellipse cx="19" cy="25" rx="3.5" ry="3.5" fill="none" stroke="#ef4444" strokeWidth="2" />
                      <circle cx="19" cy="25" r="1.5" fill="#ef4444" />
                    </g>
                  ) : (
                    // Standard happy / scanning eye
                    <g>
                      <circle cx="19" cy="26" r="3" fill="none" stroke={corePersona === "sentinel" ? "rgb(6, 182, 212)" : "rgb(244, 63, 94)"} strokeWidth="2" />
                      <circle cx="19" cy="26" r="1" fill={corePersona === "sentinel" ? "rgb(6, 182, 212)" : "rgb(244, 63, 94)"} />
                    </g>
                  )}

                  {/* Right Eye */}
                  {mood === "sleeping" ? (
                    <path d="M 32 26 Q 37 30 42 26" fill="none" stroke={corePersona === "sentinel" ? "rgb(6, 182, 212)" : "rgb(244, 63, 94)"} strokeWidth="2.5" strokeLinecap="round" />
                  ) : isBlinking ? (
                    <line x1="32" y1="26" x2="42" y2="26" stroke={corePersona === "sentinel" ? "rgb(6, 182, 212)" : "rgb(244, 63, 94)"} strokeWidth="2.5" strokeLinecap="round" />
                  ) : mood === "thinking" ? (
                    <g>
                      <path d="M 32 27 L 42 24" stroke={corePersona === "sentinel" ? "rgb(6, 182, 212)" : "rgb(244, 63, 94)"} strokeWidth="2" strokeLinecap="round" />
                      <circle cx="37" cy="28" r="1.5" fill={corePersona === "sentinel" ? "rgb(6, 182, 212)" : "rgb(244, 63, 94)"} />
                    </g>
                  ) : mood === "alert" ? (
                    <g>
                      <ellipse cx="37" cy="25" rx="3.5" ry="3.5" fill="none" stroke="#ef4444" strokeWidth="2" />
                      <circle cx="37" cy="25" r="1.5" fill="#ef4444" />
                    </g>
                  ) : (
                    <g>
                      <circle cx="37" cy="26" r="3" fill="none" stroke={corePersona === "sentinel" ? "rgb(6, 182, 212)" : "rgb(244, 63, 94)"} strokeWidth="2" />
                      <circle cx="37" cy="26" r="1" fill={corePersona === "sentinel" ? "rgb(6, 182, 212)" : "rgb(244, 63, 94)"} />
                    </g>
                  )}

                  {/* Mouth Expression */}
                  {mood === "sleeping" ? (
                    // Sleeping flat mouth
                    <line x1="23" y1="38" x2="33" y2="38" stroke={corePersona === "sentinel" ? "rgba(6, 182, 212, 0.5)" : "rgba(244, 63, 94, 0.5)"} strokeWidth="1.5" strokeLinecap="round" />
                  ) : isSpeaking ? (
                    // Active speaking waveform
                    <path 
                      d="M 21 38 Q 28 34 35 38"
                      fill="none" 
                      stroke={corePersona === "sentinel" ? "rgb(6, 182, 212)" : "rgb(244, 63, 94)"} 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      className="animate-pulse"
                    />
                  ) : mood === "happy" ? (
                    // Happy upward curve smile
                    <path d="M 21 37 Q 28 43 35 37" fill="none" stroke={corePersona === "sentinel" ? "rgb(6, 182, 212)" : "rgb(244, 63, 94)"} strokeWidth="2.5" strokeLinecap="round" />
                  ) : mood === "thinking" ? (
                    // Puzzled slight squiggly line
                    <path d="M 22 38 Q 28 36 34 39" fill="none" stroke={corePersona === "sentinel" ? "rgb(6, 182, 212)" : "rgb(244, 63, 94)"} strokeWidth="2" strokeLinecap="round" />
                  ) : mood === "alert" ? (
                    // Open surprised mouth
                    <circle cx="28" cy="38" r="3" fill="none" stroke="#ef4444" strokeWidth="2" />
                  ) : (
                    <line x1="22" y1="38" x2="34" y2="38" stroke={corePersona === "sentinel" ? "rgb(6, 182, 212)" : "rgb(244, 63, 94)"} strokeWidth="2" strokeLinecap="round" />
                  )}
                </g>
              </svg>
            </div>
          </div>

          <div className="mt-1 px-2 py-0.5 bg-slate-950/90 rounded-md border border-cyan-500/30 text-[7px] font-bold text-cyan-400 tracking-widest flex items-center gap-1 uppercase shadow">
            <span className="w-1 h-1 rounded-full bg-cyan-400 animate-ping" />
            <span>{corePersona === "sentinel" ? "SENTINEL.AI" : "SPATIAL.GIS"}</span>
          </div>
        </motion.div>
      </div>

      {/* 2. Interactive Holographic Drawer/Control Center Panel */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0, x: 380 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 380 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="fixed top-0 right-0 h-full w-full max-w-[360px] bg-slate-950/90 border-l border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] z-[100] backdrop-blur-xl flex flex-col font-mono"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-900 bg-slate-950/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4.5 h-4.5 text-cyan-400 animate-pulse" />
                <div>
                  <h2 className="text-xs font-bold text-white tracking-widest uppercase">SENTINEL ASSISTANT</h2>
                  <p className="text-[8px] text-slate-500">INTELLIGENT DIAGNOSTIC DECK</p>
                </div>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  setDrawerOpen(false);
                }}
                className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-rose-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Contents (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 scrollbar-thin scrollbar-thumb-slate-900">
              
              {/* Persona Selector Toggle */}
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-[9px] text-slate-500 mb-2 font-bold uppercase tracking-widest">COGNITIVE EMULATOR PROFILE</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setCorePersona("sentinel");
                    }}
                    className={`px-3 py-2 text-center rounded text-[10px] font-bold border transition-all ${
                      corePersona === "sentinel" 
                        ? "bg-cyan-500 border-cyan-400 text-slate-950 font-bold" 
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    🧠 Sentinel Core
                  </button>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setCorePersona("yui");
                    }}
                    className={`px-3 py-2 text-center rounded text-[10px] font-bold border transition-all ${
                      corePersona === "yui" 
                        ? "bg-pink-500 border-pink-400 text-slate-950 font-bold" 
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    🗺️ GIS Analyst
                  </button>
                </div>
              </div>

              {/* Voice Sine-wave visualizer */}
              <div>
                <div className="flex justify-between items-center text-[9px] text-slate-500 mb-2 uppercase tracking-widest">
                  <span>VOICE TRACK WAVEFORM</span>
                  <span className="text-cyan-400 font-bold">{isSpeaking ? "SYNTHESIZING" : "IDLE"}</span>
                </div>
                <VoiceVisualizerCanvas isSpeaking={isSpeaking} />
              </div>

              {/* Micro Diagnostics Metrics */}
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col gap-2.5">
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>CORE MICRO-DIAGNOSTICS</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[8px] text-slate-500 block">CPU MATRIX UTILIZATION</span>
                    <span className="text-xs font-bold text-slate-300">{cpuLoad}%</span>
                    <div className="w-full bg-slate-950 h-1 rounded overflow-hidden mt-1 border border-slate-900">
                      <div className="bg-cyan-400 h-full transition-all duration-500" style={{ width: `${cpuLoad}%` }} />
                    </div>
                  </div>

                  <div>
                    <span className="text-[8px] text-slate-500 block">COGNITIVE TEMPERATURE</span>
                    <span className="text-xs font-bold text-slate-300">{sysTemp}°C</span>
                    <div className="w-full bg-slate-950 h-1 rounded overflow-hidden mt-1 border border-slate-900">
                      <div className="bg-orange-400 h-full transition-all duration-500" style={{ width: `${Math.min(100, (sysTemp / 60) * 100)}%` }} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1.5 border-t border-slate-900">
                  <div>
                    <span className="text-[8px] text-slate-500 block">SYNAPTIC THREADS</span>
                    <span className="text-xs font-bold text-slate-300">{activeThreads} Active</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 block">INTEGRITY MATRIX</span>
                    <span className="text-xs font-bold text-emerald-400">100.0% OK</span>
                  </div>
                </div>
              </div>

              {/* Thought Pathway Association Graph */}
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-[9px] text-slate-500 mb-2 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5 text-cyan-400" />
                  <span>THOUGHT ASSOCIATION GRAPH</span>
                </div>

                {/* Simulated Nodes connected together */}
                <div className="flex items-center justify-between text-[7px] text-slate-400 bg-slate-950/60 p-2.5 rounded border border-slate-900 relative overflow-hidden">
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-900 -translate-y-1/2 z-0" />
                  
                  <div className="flex flex-col items-center gap-1 z-10">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse border border-slate-950" />
                    <span>[INPUT]</span>
                  </div>

                  <div className="flex flex-col items-center gap-1 z-10">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
                    <span>[NLP]</span>
                  </div>

                  <div className="flex flex-col items-center gap-1 z-10">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-slate-950 animate-ping" />
                    <span>[SYNAPSE]</span>
                  </div>

                  <div className="flex flex-col items-center gap-1 z-10">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
                    <span>[VECTOR]</span>
                  </div>

                  <div className="flex flex-col items-center gap-1 z-10">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-400 border border-slate-950" />
                    <span>[STREAM]</span>
                  </div>
                </div>
              </div>

              {/* Interactive Simulation Injections Capabilities */}
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col gap-2">
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
                  <span>TRIGGER SIMULATION RUNS</span>
                </div>
                <p className="text-[8px] text-slate-400 leading-relaxed mb-1">
                  Inject global, interactive test vectors directly into the operating system environment:
                </p>

                <button
                  onClick={() => triggerSimulationEvent("solar_flare")}
                  className="px-3 py-2 text-left text-[9px] font-bold bg-slate-950 border border-slate-800 hover:border-amber-500 rounded text-slate-300 hover:text-amber-400 transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>☀️ Simulate Solar Weather</span>
                  <span className="text-[7px] bg-amber-500/10 text-amber-400 px-1 rounded">IONOSPHERE</span>
                </button>

                <button
                  onClick={() => triggerSimulationEvent("overclock")}
                  className="px-3 py-2 text-left text-[9px] font-bold bg-slate-950 border border-slate-800 hover:border-orange-500 rounded text-slate-300 hover:text-orange-400 transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>⚡ Engage Sentinel Overclock</span>
                  <span className="text-[7px] bg-orange-500/10 text-orange-400 px-1 rounded">GLOBAL OVERDRIVE</span>
                </button>

                <button
                  onClick={() => triggerSimulationEvent("security_sweep")}
                  className="px-3 py-2 text-left text-[9px] font-bold bg-slate-950 border border-slate-800 hover:border-emerald-500 rounded text-slate-300 hover:text-emerald-400 transition-all flex items-center justify-between cursor-pointer"
                  title="Run cryptographic firewall scan"
                >
                  <span>🛡️ Cryptographic Firewall Sweep</span>
                  <span className="text-[7px] bg-emerald-500/10 text-emerald-400 px-1 rounded">SECURITY</span>
                </button>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-900 bg-slate-950/90 text-[8px] text-slate-500 flex justify-between items-center">
              <span>SYSTEM: OK</span>
              <span>SENTINEL CORE DECK v6.0</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
