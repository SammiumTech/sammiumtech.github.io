import React, { useState, useEffect, useRef } from "react";
import { 
  Terminal, 
  Send, 
  Cpu, 
  ShieldAlert, 
  Sparkles, 
  Zap, 
  RotateCcw, 
  Activity, 
  Network, 
  Layers, 
  Database,
  MapPin,
  School,
  Activity as HeartPulse,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Sun,
  Droplets,
  Wind,
  Navigation,
  FileText,
  BookOpen,
  Award,
  Milestone,
  Power,
  Percent,
  Battery,
  Wifi,
  AlertCircle,
  Compass,
  Eye,
  Globe,
  Bot,
  Timer,
  ChevronRight,
  Gauge,
  Workflow,
  Clock,
  Sparkle,
  Plus,
  Trash2,
  Play,
  FolderPlus,
  X,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { sounds } from "../utils/sounds";

interface AICognitiveNexusProps {
  isRgbOverdrive: boolean;
  operatorName: string;
}

interface Persona {
  id: string;
  name: string;
  avatar: string;
  description: string;
  vibe: "balanced" | "chaotic" | "conservative";
  systemPrompt: string;
  prefix: string;
}

const getPersonas = (operatorName: string): Persona[] => [
  {
    id: "sentinel-core",
    name: "🧠 SENTINEL GENERAL DECISION CORE v6.0",
    avatar: "🤖",
    description: `Sentinel's primary decision support core. Processes spatial statistics, community indicators, and regional KPIs. Dedicated to Operator ${operatorName}.`,
    vibe: "balanced",
    systemPrompt: `You are 'SENTINEL-CORE', the central AI core of the Sentinel Smart Community Decision Support Platform. Speak with professional, academic authority, crisp scientific precision, and analytical rigor. Help local organizations monitor environmental, infrastructure, and public safety variables. Use clean markdown formatting, structured lists, and clear bullet points. Address the user respectfully as Operator ${operatorName}.`,
    prefix: "SENTINEL_CORE //: "
  },
  {
    id: "yui-legacy",
    name: "🗺️ GIS & SPATIAL ANALYST S6",
    avatar: "🗺️",
    description: `Specialized in geographic information systems, terrain elevation, flood zones, population density, and municipal infrastructure routing.`,
    vibe: "balanced",
    systemPrompt: `You are 'SPATIAL-ANALYST-S6', a specialized GIS and geographic modeling assistant on the Sentinel platform. Answer with high geographic precision, mapping metrics, and smart community planning suggestions. Highlight data regarding schools, roads, water networks, and evacuation centers. Address the user respectfully as Operator.`,
    prefix: "GIS_SPATIAL_S6 //: "
  },
  {
    id: "quantum-physics",
    name: "🌾 SMART AGRICULTURE CO-PILOT",
    avatar: "🌾",
    description: "Expert in soil moisture analytics, crop health indexes, rainfall forecasting, and optimal fertilizer timelines.",
    vibe: "conservative",
    systemPrompt: "You are 'AGRI-COPILOT', an AI expert in precision farming and smart community agricultural management. Respond with professional agronomy indexes, moisture analytics, and climate adaptation suggestions. Be concise and practical.",
    prefix: "AGRI_COPILOT //: "
  },
  {
    id: "glitch-override",
    name: "⚡ ENERGY GRID & IOT AUDITOR",
    avatar: "⚡",
    description: "Monitors solar panels, battery storage efficiency, power consumption metrics, and IoT hardware signal quality diagnostics.",
    vibe: "balanced",
    systemPrompt: "You are 'ENERGY-IOT-AUDITOR', a specialized edge-computing auditor for smart community infrastructure. Provide energy efficiency ratios, power demand curves, carbon offset logs, and firmware diagnostics.",
    prefix: "IOT_AUDITOR //: "
  }
];

const PRESETS = [
  "How can we optimize Botolan's evacuation routes based on recent GIS flood zone maps?",
  "Recommend a fertilizer schedule for the agricultural sector given a 45% soil moisture drop.",
  "Calculate the estimated carbon savings of introducing 120kW solar panels with 400kWh battery storage.",
  "Perform a risk assessment for landslides on terrain elevation layers with over 20 degrees slope."
];

// --- Brain Neural Canvas Component ---
const NeuralBrainCanvas: React.FC<{ isLoading: boolean; isOverdrive: boolean }> = ({ isLoading, isOverdrive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = canvas.width = 400;
    let height = canvas.height = 160;

    // Handle resizing
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const d = containerRef.current.getBoundingClientRect();
        width = canvasRef.current.width = d.width;
        height = canvasRef.current.height = d.height || 160;
      }
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    handleResize();

    // Generate Particles
    const numParticles = 45;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      pulseSpeed: number;
      pulseOffset: number;
    }> = [];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: i % 2 === 0 ? "rgb(249, 115, 22)" : "rgb(6, 182, 212)", // Orange and Cyan
        pulseSpeed: Math.random() * 0.05 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }

    // Light pulses traveling along synapses
    const signalPulses: Array<{
      from: number;
      to: number;
      progress: number;
      speed: number;
      color: string;
    }> = [];

    let frame = 0;

    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Speed multipliers based on states
      const speedMult = isLoading ? 3.5 : isOverdrive ? 2.0 : 1.0;

      // Draw background cyber matrix grids
      ctx.strokeStyle = "rgba(15, 23, 42, 0.4)";
      ctx.lineWidth = 1;
      const gridSize = 20;
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

      // Draw beautiful neural pathways (synapses)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < numParticles; i++) {
        const pi = particles[i];
        for (let j = i + 1; j < numParticles; j++) {
          const pj = particles[j];
          const dist = Math.hypot(pi.x - pj.x, pi.y - pj.y);
          if (dist < 85) {
            const alpha = (1 - dist / 85) * 0.22;
            ctx.strokeStyle = pi.color === pj.color 
              ? `rgba(${pi.color === "rgb(249, 115, 22)" ? "249,115,22" : "6,182,212"}, ${alpha})`
              : `rgba(203, 213, 225, ${alpha * 0.5})`;
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.stroke();

            // Spawn occasional pulse signals
            if (frame % 150 === 0 && Math.random() < 0.08) {
              signalPulses.push({
                from: i,
                to: j,
                progress: 0,
                speed: 0.02 * speedMult,
                color: pi.color
              });
            }
          }
        }
      }

      // Draw and update traveling signal pulses
      for (let k = signalPulses.length - 1; k >= 0; k--) {
        const pulse = signalPulses[k];
        pulse.progress += pulse.speed;
        if (pulse.progress >= 1) {
          signalPulses.splice(k, 1);
          continue;
        }

        const pFrom = particles[pulse.from];
        const pTo = particles[pulse.to];
        const px = pFrom.x + (pTo.x - pFrom.x) * pulse.progress;
        const py = pFrom.y + (pTo.y - pFrom.y) * pulse.progress;

        ctx.fillStyle = pulse.color;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Glow trail effect
        ctx.shadowBlur = 6;
        ctx.shadowColor = pulse.color;
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // Update and draw nodes
      for (let i = 0; i < numParticles; i++) {
        const p = particles[i];
        p.x += p.vx * speedMult;
        p.y += p.vy * speedMult;

        // Bounce boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const pulseScale = 1 + 0.3 * Math.sin(frame * p.pulseSpeed + p.pulseOffset);

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * pulseScale, 0, Math.PI * 2);
        ctx.fill();

        // Node outline rings
        ctx.strokeStyle = p.color === "rgb(249, 115, 22)" ? "rgba(249,115,22,0.2)" : "rgba(6,182,212,0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * pulseScale * 3.5, 0, Math.PI * 2);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [isLoading, isOverdrive]);

  return (
    <div ref={containerRef} className="w-full h-full bg-slate-950/80 rounded-xl border border-slate-800/80 overflow-hidden relative shadow-inner">
      <div className="absolute top-2 left-3 z-10 flex items-center gap-2">
        <span className="flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
        </span>
        <span className="text-[10px] font-mono text-orange-400 font-bold uppercase tracking-widest">
          {isLoading ? "COGNITIVE SYNAPSE RE-ROUTING..." : "LIVE DECISION BRAIN MODEL ACTIVE"}
        </span>
      </div>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export const AICognitiveNexus: React.FC<AICognitiveNexusProps> = ({
  isRgbOverdrive,
  operatorName
}) => {
  const [activeTab, setActiveTab] = useState<"bridge" | "chat">("bridge");
  const [selectedPersonaId, setSelectedPersonaId] = useState("sentinel-core");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  
  // GIS Map Layer Toggles
  const [mapLayers, setMapLayers] = useState({
    sensors: true,
    schools: true,
    hospitals: true,
    floodZones: true,
    dronePath: true
  });

  // AI Confidence Model Selection
  const [confidenceModel, setConfidenceModel] = useState<"flood" | "landslide" | "crop" | "solar">("flood");

  // AI Thought Stream state
  const [thoughtStream, setThoughtStream] = useState<string[]>([
    "[ENV] Initiating precipitation indicators analytics...",
    "[GIS] Loading digital terrain models for Botolan Sector A...",
    "[IOT] Polling 58 active nodes. High signal quality."
  ]);

  // Terminal Chat history
  const [terminalHistory, setTerminalHistory] = useState<Array<{
    type: "user" | "system" | "error";
    text: string;
    personaName?: string;
  }>>([
    {
      type: "system",
      text: "SENTINEL COGNITIVE NEURAL DECK ESTABLISHED. READY FOR OPERATOR INSTRUCTIONS.",
      personaName: "SYSTEM BOOT"
    }
  ]);

  // --- CUSTOM EXPERIMENTS ACTIVE WORKSPACE (Empty state support) ---
  interface CustomExperiment {
    id: string;
    title: string;
    area: string;
    objective: string;
    modelParam: string;
    progress: number;
    status: "idle" | "running" | "completed";
  }

  const [customExperiments, setCustomExperiments] = useState<CustomExperiment[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sentinel_custom_experiments");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [isFormulating, setIsFormulating] = useState(false);
  const [newExpTitle, setNewExpTitle] = useState("");
  const [newExpArea, setNewExpArea] = useState("Environmental Intelligence");
  const [newExpObjective, setNewExpObjective] = useState("");
  const [newExpParam, setNewExpParam] = useState("Gemini-2.5-Flash (Adaptive)");

  useEffect(() => {
    localStorage.setItem("sentinel_custom_experiments", JSON.stringify(customExperiments));
  }, [customExperiments]);

  const handleCreateExperiment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpTitle.trim()) return;
    sounds.playLaser();
    const newExp: CustomExperiment = {
      id: `EXP-${100 + customExperiments.length + 1}`,
      title: newExpTitle,
      area: newExpArea,
      objective: newExpObjective || "Run simulated analytics sweeps and calibrate GIS layers.",
      modelParam: newExpParam,
      progress: 0,
      status: "idle"
    };
    setCustomExperiments(prev => [...prev, newExp]);
    setIsFormulating(false);
    setNewExpTitle("");
    setNewExpObjective("");
  };

  const runExperimentSimulation = (id: string) => {
    sounds.playClick();
    setCustomExperiments(prev => prev.map(exp => {
      if (exp.id === id) {
        return { ...exp, status: "running", progress: 0 };
      }
      return exp;
    }));

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setCustomExperiments(prev => prev.map(exp => {
        if (exp.id === id) {
          if (currentProgress >= 100) {
            clearInterval(interval);
            sounds.playLaser();
            return { ...exp, status: "completed", progress: 100 };
          }
          return { ...exp, progress: currentProgress };
        }
        return exp;
      }));
    }, 300);
  };

  const deleteExperiment = (id: string) => {
    sounds.playError();
    setCustomExperiments(prev => prev.filter(exp => exp.id !== id));
  };

  const personas = getPersonas(operatorName);
  const selectedPersona = personas.find(p => p.id === selectedPersonaId) || personas[0];

  // Map layers data configuration
  const botolanMapData = {
    sensors: [
      { id: "S-01", name: "River Water Level Node 1", x: "28%", y: "42%", status: "online" },
      { id: "S-04", name: "River Water Level Node 4", x: "42%", y: "48%", status: "alert" },
      { id: "S-12", name: "Soil Moisture Node 12", x: "70%", y: "22%", status: "online" },
      { id: "S-18", name: "Soil Moisture Node 18", x: "82%", y: "34%", status: "battery-low" },
      { id: "S-22", name: "Rainfall Gauge Node 22", x: "15%", y: "70%", status: "online" }
    ],
    schools: [
      { id: "SCH-01", name: "Botolan Central School", x: "32%", y: "60%" },
      { id: "SCH-02", name: "Poonbato Elementary School", x: "55%", y: "80%" },
      { id: "SCH-03", name: "Zambales State Agricultural College", x: "78%", y: "15%" }
    ],
    hospitals: [
      { id: "HSP-01", name: "Municipal Health Center", x: "22%", y: "52%" },
      { id: "HSP-02", name: "Botolan Rural Hospital", x: "45%", y: "68%" }
    ],
    floodZones: [
      { name: "Bucao Flood Basin Zone A", points: "20,35 40,45 45,55 35,65 15,50" },
      { name: "Southern Inundation Grid 4", points: "40,70 65,85 55,95 30,80" }
    ]
  };

  // Drone Position simulation state
  const [dronePos, setDronePos] = useState({ x: 20, y: 35, angle: 0 });

  useEffect(() => {
    // Dynamic drone position along path
    const interval = setInterval(() => {
      setDronePos(prev => {
        const nextAngle = prev.angle + 0.02;
        // Draw an oval path around central coordinate
        const cx = 50;
        const cy = 50;
        const rx = 30;
        const ry = 22;
        const px = cx + rx * Math.cos(nextAngle);
        const py = cy + ry * Math.sin(nextAngle);
        return {
          x: parseFloat(px.toFixed(1)),
          y: parseFloat(py.toFixed(1)),
          angle: nextAngle
        };
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  // AI thought stream ticker
  useEffect(() => {
    const thoughts = [
      "[ENV] Fetching live UV index: Current at 5.8 (Moderate).",
      "[AI] Landslide risk index calculated: 14% (Very Low).",
      "[AGRI] Soil moisture sensor 12 reporting stable hydration index of 64%.",
      "[DRONE] Multi-spectral drone imagery confirms 84.2% canopy density.",
      "[GRID] Solar dispatch balance: 120kW produced, battery reserve optimal.",
      "[AI] Prediction accuracy re-evaluated: 97.42% accuracy across historical datasets.",
      "[IOT] Firmware version check: 63 nodes on v1.0.4. Perfect status.",
      "[ENV] River water level sensor 04 at 1.82 meters - Monitor threshold (2.00m).",
      "[GIS] Rendering digital terrain elevation vectors..."
    ];

    const interval = setInterval(() => {
      setThoughtStream(prev => {
        const nextThought = thoughts[Math.floor(Math.random() * thoughts.length)];
        // Keep last 15 thoughts
        return [...prev.slice(-14), `[${new Date().toLocaleTimeString()}] ${nextThought}`];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const runNeuralSimulation = async (inputPrompt: string) => {
    if (!inputPrompt.trim()) return;

    sounds.playClick();
    setLoading(true);

    // Push local user prompt to terminal history
    setTerminalHistory(prev => [
      ...prev,
      { type: "user", text: inputPrompt }
    ]);

    // Simulated quick command bypass (for fun offline feel)
    if (inputPrompt.startsWith(">")) {
      const cleanCmd = inputPrompt.substring(1).trim().toLowerCase();
      let replyText = "";
      let code = "CMD_OK";

      if (cleanCmd.includes("typhoon") || cleanCmd.includes("weather")) {
        replyText = `[CLIMATE INTEGRATION] Merged high-elevation satellite coordinates. Current atmospheric pressure is steady at 1012 hPa. Heavy monsoon bands detected 140km offshore. Recommended course of action: Secure IoT agricultural sensors and prepare drone survey for crop health.`;
        code = "WEATHER_GIS";
      } else if (cleanCmd.includes("drone")) {
        replyText = `[DRONE FLIGHT DECK] Pre-flight telemetry validated. Drone Alpha queued for Launch sequence. Mission path: Botolan Forest Sector C Canopy evaluation. Pilot: Autonomous Sentinel Pilot-Grid. Battery status: 98.4%.`;
        code = "DRONE_LAUNCH";
      } else if (cleanCmd.includes("flood") || cleanCmd.includes("simulation")) {
        replyText = `[FLOOD DISASTER MODELER] Recalculated terrain accumulation flow rate across Bucao River grids. Simulated precipitation inflow rate: 12mm/hour. Simulated inundation risk: 18.4% (Medium risk at Sector B). Recommended action: Alert community centers.`;
        code = "FLOOD_SIM";
      } else if (cleanCmd.includes("robot")) {
        replyText = `[MOBILE ROBOT LAB] Ground Rover S5 status: Operational. Actuator values adjusted. Sensor package: Soil moisture + pH spectrum active. Positioning locked on coordinate grid 45.28N, 120.08E.`;
        code = "ROBOT_SYNC";
      } else {
        replyText = `[SENTINEL DIRECT DIRECTIVE] Executing command directive "${inputPrompt}". Connection established. Municipal database status is operational. All spatial layers are aligned.`;
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("inject-system-log", {
            detail: {
              message: replyText,
              category: code === "SYS_ERR" ? "ERROR" : "SUCCESS",
              code: code
            }
          })
        );
      }

      setTimeout(() => {
        sounds.playLaser();
        setTerminalHistory(prev => [
          ...prev,
          {
            type: "system",
            text: replyText,
            personaName: "SENTINEL DECISION CONTROL BRIDGE"
          }
        ]);
        setLoading(false);
        setPrompt("");
      }, 1000);
      return;
    }

    try {
      const res = await fetch("/api/experiments/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: inputPrompt,
          vibe: selectedPersona.vibe,
          systemInstruction: selectedPersona.systemPrompt
        })
      });

      const data = await res.json();
      
      if (res.ok && data.text) {
        sounds.playLaser();
        setTerminalHistory(prev => [
          ...prev,
          {
            type: "system",
            text: `${selectedPersona.prefix}${data.text}`,
            personaName: selectedPersona.name
          }
        ]);
      } else {
        throw new Error(data.error || "No response received from the Cognitive Core.");
      }
    } catch (err: any) {
      sounds.playError();
      setTerminalHistory(prev => [
        ...prev,
        {
          type: "error",
          text: `DECISION_BRIDGE_ERROR: Connection failed. ${err.message || "Please check the server status."}`
        }
      ]);
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  const handlePresetClick = (preset: string) => {
    sounds.playHover();
    setPrompt(preset);
  };

  const clearConsole = () => {
    sounds.playClick();
    setTerminalHistory([
      {
        type: "system",
        text: "DECISION CONTROL RAM DUMPED. COUPLER CALIBRATION ENGAGED.",
        personaName: "SYSTEM INTEGRATION"
      }
    ]);
  };

  // Render model confidence configuration description
  const getConfidenceDetails = () => {
    switch (confidenceModel) {
      case "flood":
        return { percent: 97.8, label: "Flood Inundation Predictor", desc: "Bucao river inflow neural networks vs 50-year return precipitation matrices." };
      case "landslide":
        return { percent: 94.5, label: "Landslide Risk Classifier", desc: "GIS Digital elevation slope calculations overlaid with real-time moisture." };
      case "crop":
        return { percent: 96.2, label: "Smart Crop Yield Estimator", desc: "Predicts harvest yields using multispectral drone vegetation index profiles." };
      case "solar":
        return { percent: 98.9, label: "Solar Energy Load Dispatcher", desc: "Forecasts solar storage and community load demands to maximize carbon savings." };
    }
  };

  const confDetails = getConfidenceDetails();

  return (
    <div id="sentinel-dashboard-nexus" className="flex flex-col gap-5">
      
      {/* Station Navigation Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Workflow className="w-5 h-5 text-orange-400" />
          <h2 className="text-xl font-display font-bold text-white tracking-wide">
            ENVIRONMENTAL & ARTIFICIAL INTELLIGENCE CORE
          </h2>
        </div>
        
        <div className="flex items-center bg-slate-900/90 rounded-lg p-1 border border-slate-800">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab("bridge");
            }}
            className={`px-4 py-1.5 rounded-md text-xs font-sans font-semibold tracking-wide transition-all ${
              activeTab === "bridge" 
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            📊 DECISION CONTROL BRIDGE
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab("chat");
            }}
            className={`px-4 py-1.5 rounded-md text-xs font-sans font-semibold tracking-wide transition-all ${
              activeTab === "chat" 
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            🧠 COGNITIVE TERMINAL (AI CHAT)
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "bridge" ? (
          <motion.div
            key="bridge"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            {/* SIGNATURE HERO CENTERPIECE PANEL */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/95 border border-slate-800/80 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Globe className="w-56 h-56 text-orange-400 animate-spin-slow" />
              </div>
              {/* Elegant border glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-cyan-500/5 opacity-40 pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/25 to-transparent" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[11px] font-mono font-bold text-emerald-400 tracking-widest uppercase">
                      SYSTEM STATUS: OPERATIONAL
                    </span>
                    <span className="text-slate-600 font-mono text-[11px]">|</span>
                    <span className="text-[11px] font-mono font-bold text-slate-400 tracking-wider">
                      LAT: 15°13'40&quot;N // LON: 120°01'44&quot;E
                    </span>
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight leading-none">
                    SENTINEL RESEARCH PLATFORM
                  </h1>
                  <p className="text-base text-slate-300 font-sans max-w-3xl leading-relaxed">
                    AI Decision Support Platform for Smart Communities // Developed by <span className="text-orange-400 font-semibold font-display">Sammium Research & Innovation Laboratory</span>.
                  </p>
                </div>
                
                {/* Micro stats grid within hero */}
                <div className="grid grid-cols-2 gap-4 shrink-0 bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 shadow-inner">
                  <div className="space-y-1">
                    <div className="text-slate-400 text-[10px] font-mono font-bold uppercase tracking-wider">Telemetry Sensors</div>
                    <div className="text-xl font-display font-bold text-emerald-400 flex items-center gap-1.5">
                      <Wifi className="w-4 h-4 text-emerald-400" /> 58 Online
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-slate-400 text-[10px] font-mono font-bold uppercase tracking-wider">Decision Models</div>
                    <div className="text-xl font-display font-bold text-cyan-400 flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-cyan-400" /> 12 Active
                    </div>
                  </div>
                  <div className="space-y-1 border-t border-slate-900 pt-2 col-span-2 flex justify-between items-center">
                    <div className="text-slate-400 text-[10px] font-mono font-bold uppercase tracking-wider font-semibold">Research Scope</div>
                    <div className="text-sm font-sans font-bold text-orange-400">
                      24 Projects in Progress
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Today's objective callout */}
              <div className="mt-5 pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/25 text-[10px] font-mono font-bold text-orange-400 uppercase tracking-wider">
                    TODAY'S OBJECTIVE
                  </span>
                  <span className="text-slate-200 font-sans font-medium">
                    Environmental Monitoring & Smart Grid Risk Mitigation Analytics
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-orange-400" /> Last Synchronized: Just Now
                </div>
              </div>
            </div>

            {/* SECONDARY ROW - GENERAL status briefings & Active projects (split columns, increased whitespace and text sizes) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Daily Briefing & Mission (Col-span-7) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.3)] relative overflow-hidden backdrop-blur flex flex-col justify-between gap-5">
                <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
                  <Globe className="w-44 h-44 text-orange-400" />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between gap-5">
                  <div>
                    <div className="flex items-center gap-2 mb-2.5">
                      <Sparkle className="w-4 h-4 text-orange-400 animate-pulse" />
                      <span className="text-xs font-display font-bold text-orange-400 uppercase tracking-widest">
                        DECISION SUPPORT PLATFORM IDENTITY
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-display font-bold text-white tracking-wide leading-tight mb-3">
                      MISSION OVERVIEW
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed font-sans">
                      An integrated, multi-criteria decision-support platform designed for local municipalities, organizations, and research laboratories. Leveraging distributed IoT hardware, autonomous drones, robotics, and high-fidelity spatial GIS modeling to protect and optimize smart community infrastructure.
                    </p>
                  </div>

                  {/* AI Daily Briefing Box */}
                  <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/15">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                      <span className="text-[11px] font-mono font-bold text-orange-400 uppercase tracking-wider">
                        AI DAILY BRIEFING // GENERAL STATUS
                      </span>
                    </div>
                    <p className="text-sm text-slate-200 font-sans leading-relaxed">
                      Good morning, <span className="text-white font-semibold uppercase">{operatorName || "Operator"}</span>. Sentinel is active with <strong>58 sensors online</strong> and <strong>no critical alerts</strong>. High rainfall triggers are computed for tomorrow; river sensor 04 is approaching threshold limits. Research workflows are running at 82% efficiency.
                    </p>
                  </div>

                  {/* Objective Checklists */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                    {[
                      { label: "Environmental Analysis", ok: true },
                      { label: "AI Model Training", ok: true },
                      { label: "Sensor Monitoring", ok: true },
                      { label: "Research Progress", ok: true }
                    ].map((obj, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-950/70 border border-slate-850">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-sm text-slate-300 font-sans font-semibold truncate">{obj.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Research Projects & Progress Bars (Col-span-5) */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.3)] backdrop-blur flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400 animate-pulse" /> ACTIVE RESEARCH IN PROGRESS
                  </h3>
                  
                  <div className="flex flex-col gap-4">
                    {[
                      { label: "🧠 Flood Prediction AI Model", percent: 92, color: "from-orange-500 to-amber-500" },
                      { label: "🤖 Autonomous Rover Soil Analysis", percent: 71, color: "from-cyan-500 to-blue-500" },
                      { label: "🌾 Smart Agriculture Irrigation Forecast", percent: 63, color: "from-emerald-500 to-teal-500" },
                      { label: "📡 IoT Sensor Mesh Orchestration", percent: 98, color: "from-amber-400 to-orange-500" },
                      { label: "🚁 Drone Inspection Spatial Mapping", percent: 48, color: "from-rose-500 to-orange-400" }
                    ].map((proj, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm font-sans font-medium mb-1.5">
                          <span className="text-slate-200">{proj.label}</span>
                          <span className="font-mono text-cyan-400 font-semibold">{proj.percent}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-850/50">
                          <div 
                            className={`h-full bg-gradient-to-r ${proj.color} transition-all duration-1000`}
                            style={{ width: `${proj.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-850/60 pt-3.5 mt-4 flex justify-between items-center text-xs text-slate-400 font-mono">
                  <span>ACTIVE INITIATIVES: 05</span>
                  <span className="text-orange-400 font-bold uppercase">All Systems Synchronized</span>
                </div>
              </div>

            </div>

            {/* SECOND ROW - MAP, WEATHER, AI RECS, AI THOUGHT STREAM */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Botolan GIS Mini Interactive Map (Col-span-7) */}
              <div className="lg:col-span-7 p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-xl backdrop-blur flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-orange-400" />
                    <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">
                      BOTOLAN REGIONAL GIS MINI-MAP OVERLAY
                    </span>
                  </div>
                  
                  {/* Layer Indicator Icons */}
                  <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-850 text-[10px] text-slate-400 font-mono">
                    GRID SCALE: 1:25,000
                  </span>
                </div>

                {/* Simulated Interactive SVG/CSS Map Container */}
                <div className="h-64 bg-slate-950 rounded-lg relative overflow-hidden border border-slate-850/60 group">
                  {/* Background GIS Grid Pattern */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.45)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                  
                  {/* Simulated Topography Contour Lines (Abstract SVG overlay) */}
                  <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10,20 Q120,40 230,15 T450,80" fill="none" stroke="#64748b" strokeWidth="1" />
                    <path d="M30,50 Q160,80 290,40 T480,120" fill="none" stroke="#64748b" strokeWidth="1" />
                    <path d="M50,90 Q180,120 310,80 T510,160" fill="none" stroke="#64748b" strokeWidth="1" />
                    <path d="M20,130 Q150,170 300,120 T540,200" fill="none" stroke="#64748b" strokeWidth="1" />
                  </svg>

                  {/* Draw Bucao River winding from top-right to center-left */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M 500 20 C 420 50, 350 80, 280 60 C 210 40, 150 120, 80 110 T 0 150" 
                      fill="none" 
                      stroke="#0284c7" 
                      strokeWidth="10" 
                      strokeLinecap="round" 
                      className="opacity-30"
                    />
                    <path 
                      d="M 500 20 C 420 50, 350 80, 280 60 C 210 40, 150 120, 80 110 T 0 150" 
                      fill="none" 
                      stroke="#38bdf8" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      className="opacity-65 animate-pulse"
                    />
                  </svg>

                  {/* 🚨 Layer: Flood Zones */}
                  {mapLayers.floodZones && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-[8%] left-[45%] w-32 h-20 bg-red-500/20 border border-red-500/30 rounded-full blur-[4px] animate-pulse" title="High Risk Inundation Area" />
                      <div className="absolute top-[30%] left-[20%] w-48 h-24 bg-red-500/15 border border-red-500/25 rounded-full blur-[6px]" />
                    </div>
                  )}

                  {/* 🏫 Layer: Schools */}
                  {mapLayers.schools && botolanMapData.schools.map((school, i) => (
                    <div 
                      key={school.id} 
                      className="absolute p-1 bg-slate-900 border border-cyan-400 rounded-md shadow-md text-cyan-400 flex items-center justify-center cursor-help z-10"
                      style={{ left: school.x, top: school.y }}
                      title={`${school.name} (Evacuation Center Capable)`}
                    >
                      <School className="w-3.5 h-3.5" />
                      <span className="hidden group-hover:inline text-[8px] ml-1 font-mono">{school.id}</span>
                    </div>
                  ))}

                  {/* 🏥 Layer: Hospitals */}
                  {mapLayers.hospitals && botolanMapData.hospitals.map((hsp, i) => (
                    <div 
                      key={hsp.id} 
                      className="absolute p-1 bg-slate-900 border border-pink-500 rounded-md shadow-md text-pink-400 flex items-center justify-center cursor-help z-10"
                      style={{ left: hsp.x, top: hsp.y }}
                      title={`${hsp.name} (Emergency Triage Ready)`}
                    >
                      <HeartPulse className="w-3.5 h-3.5" />
                      <span className="hidden group-hover:inline text-[8px] ml-1 font-mono">{hsp.id}</span>
                    </div>
                  ))}

                  {/* 📍 Layer: IoT Sensors */}
                  {mapLayers.sensors && botolanMapData.sensors.map((sn, i) => {
                    const isAlert = sn.status === "alert";
                    const isLowBattery = sn.status === "battery-low";
                    return (
                      <div 
                        key={sn.id} 
                        className="absolute cursor-help flex flex-col items-center z-20"
                        style={{ left: sn.x, top: sn.y }}
                        title={`${sn.name} - Status: ${sn.status.toUpperCase()}`}
                      >
                        <div className="relative">
                          <span className={`absolute -inset-1.5 rounded-full opacity-60 animate-ping ${
                            isAlert ? "bg-rose-500" : isLowBattery ? "bg-amber-500" : "bg-emerald-500"
                          }`} />
                          <div className={`w-3 h-3 rounded-full border border-slate-950 flex items-center justify-center ${
                            isAlert ? "bg-rose-500" : isLowBattery ? "bg-amber-500" : "bg-emerald-500"
                          }`} />
                        </div>
                        <span className="bg-slate-950/90 text-[7px] font-mono px-1 rounded border border-slate-800 text-slate-300 mt-1 uppercase">
                          {sn.id}
                        </span>
                      </div>
                    );
                  })}

                  {/* 🚁 Layer: Moving Drone Flight Path */}
                  {mapLayers.dronePath && (
                    <>
                      {/* Dotted path ellipse */}
                      <div className="absolute top-[28%] left-[20%] w-[60%] h-[44%] border border-cyan-500/20 border-dashed rounded-full pointer-events-none" />
                      
                      {/* Interactive Moving Drone Marker */}
                      <div 
                        className="absolute z-30 flex flex-col items-center transition-all duration-150 ease-linear"
                        style={{ left: `${dronePos.x}%`, top: `${dronePos.y}%` }}
                      >
                        <Navigation className="w-4.5 h-4.5 text-orange-400 fill-orange-400 transform rotate-[45deg] drop-shadow-[0_0_5px_rgba(249,115,22,0.6)]" />
                        <span className="bg-orange-500 text-slate-950 text-[7px] font-mono px-1 rounded font-bold mt-1 uppercase shadow">
                          DRN-B7
                        </span>
                      </div>
                    </>
                  )}

                  {/* Map Coordinates overlay */}
                  <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2 py-1 rounded border border-slate-800 text-[9px] font-mono text-slate-400">
                    LAT: 15°13'40&quot;N | LON: 120°01'44&quot;E
                  </div>
                </div>

                {/* Map Layer Controls Checkboxes */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 bg-slate-950/80 p-2.5 rounded-lg border border-slate-850">
                  <span className="col-span-full text-[10px] font-mono text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-1 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-slate-500" /> Toggle GIS Layer Map Overlays:
                  </span>
                  {[
                    { key: "sensors", label: "📍 Sensors Node Network", color: "text-emerald-400" },
                    { key: "schools", label: "🏫 Municipal Schools", color: "text-cyan-400" },
                    { key: "hospitals", label: "🏥 Health Facilities", color: "text-pink-400" },
                    { key: "floodZones", label: "🚨 River Flood Zones", color: "text-rose-400" },
                    { key: "dronePath", label: "🚁 Drone Mission Vector", color: "text-orange-400" }
                  ].map((layer) => (
                    <label key={layer.key} className="flex items-center gap-1.5 cursor-pointer text-[11px] font-sans text-slate-300 hover:text-white select-none">
                      <input 
                        type="checkbox" 
                        checked={(mapLayers as any)[layer.key]}
                        onChange={() => {
                          sounds.playClick();
                          setMapLayers(prev => ({ ...prev, [layer.key]: !(prev as any)[layer.key] }));
                        }}
                        className="rounded bg-slate-900 border-slate-800 text-orange-500 focus:ring-0 focus:ring-offset-0"
                      />
                      <span className={layer.color}>{layer.label.split(" ")[0]}</span>
                      <span className="truncate">{layer.label.substring(layer.label.indexOf(" ") + 1)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Climate Weather & recommendations (Col-span-5) */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                
                {/* 3. Live Weather & 4. Sensor Status Panel */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-xl backdrop-blur grid grid-cols-2 gap-4">
                  
                  {/* Climate Panel */}
                  <div className="border-r border-slate-800/80 pr-4">
                    <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                      <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" /> Climate Analytics
                    </h4>
                    <div className="flex items-baseline gap-2 mb-1.5">
                      <span className="text-3xl font-display font-bold text-white tracking-tight">26°C</span>
                      <span className="text-[11px] text-emerald-400 font-sans font-medium flex items-center gap-0.5">
                        Good AQI
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-xs text-slate-300 font-sans">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Humidity</span>
                        <span className="font-mono text-slate-100">74%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Wind Velocity</span>
                        <span className="font-mono text-slate-100">13 km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Precipitation Prob</span>
                        <span className="font-mono text-slate-100">32%</span>
                      </div>
                    </div>
                  </div>

                  {/* IoT Sensors Health Status */}
                  <div className="pl-1">
                    <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                      <Wifi className="w-3.5 h-3.5 text-emerald-400" /> IoT Sensor Network
                    </h4>
                    <div className="flex items-baseline gap-2 mb-1.5">
                      <span className="text-3xl font-display font-bold text-emerald-400 tracking-tight">58</span>
                      <span className="text-[10px] text-slate-400 font-mono">/ 63 active</span>
                    </div>
                    <div className="flex flex-col gap-1 text-xs text-slate-300 font-sans">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Offline
                        </span>
                        <span className="font-mono text-red-400 font-semibold">2</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Maintenance
                        </span>
                        <span className="font-mono text-blue-400 font-semibold">1</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Battery Low
                        </span>
                        <span className="font-mono text-amber-500 font-semibold">4</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* 7. AI Recommendations */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-xl backdrop-blur flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-mono font-bold text-orange-400 tracking-wider uppercase mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-orange-400" /> SENTINEL AI DECISION RECOMMENDATIONS
                    </h3>
                    
                    <ul className="flex flex-col gap-2 font-sans text-xs text-slate-300">
                      <li className="flex items-start gap-2.5 p-1.5 bg-slate-950/70 rounded border border-slate-850">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
                        <div>
                          <strong className="text-white">Monitor River Sensor 04:</strong> Current level exceeds warning limit (1.82m vs 2.00m threshold). Alert evacuation ready zones.
                        </div>
                      </li>
                      <li className="flex items-start gap-2.5 p-1.5 bg-slate-950/70 rounded border border-slate-850">
                        <Navigation className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white">Deploy Drone Bravo flight deck:</strong> Heavy cloud cover forecast. Mission to map high altitude landslide risks of southern hills.
                        </div>
                      </li>
                      <li className="flex items-start gap-2.5 p-1.5 bg-slate-950/70 rounded border border-slate-850">
                        <Droplets className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white">Precipitation Expected Tomorrow:</strong> Recommended to adjust fertilizer timeline indices to minimize runoff pollution.
                        </div>
                      </li>
                      <li className="flex items-start gap-2.5 p-1.5 bg-slate-950/70 rounded border border-slate-850">
                        <Battery className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white">Review Sensor 18 Battery:</strong> Cell drops below 12.4% storage limit. Schedule field maintenance.
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>

            </div>

            {/* ACTIVE EXPERIMENT FORMULATION WORKSPACE (Milestone 5 - Empty States, Clean Whitespace, Large Body Text, Subtle Depth) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-950/70 border border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-orange-500/5 pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-5">
                <div>
                  <h3 className="text-sm font-mono font-bold text-cyan-400 tracking-wider uppercase flex items-center gap-2">
                    <Database className="w-4 h-4 text-cyan-400" /> ACTIVE EXPERIMENT FORMULATION WORKSPACE
                  </h3>
                  <p className="text-sm text-slate-400 font-sans mt-1">
                    Deploy, calibrate, and simulate custom multi-criteria research algorithms directly inside the Sentinel decision environment.
                  </p>
                </div>
                {!isFormulating && (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setIsFormulating(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 font-sans text-xs font-bold text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Formulate New Experiment
                  </button>
                )}
              </div>

              {/* Formulation Dialog deck inside the card */}
              <AnimatePresence>
                {isFormulating && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleCreateExperiment}
                    className="p-5 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-6 space-y-4 shadow-inner"
                  >
                    <div className="flex justify-between items-center border-b border-slate-900 pb-2 mb-2">
                      <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-orange-400" /> FORMULATE EXPERIMENT METRICS
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          setIsFormulating(false);
                        }}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Project Title</label>
                        <input
                          type="text"
                          required
                          value={newExpTitle}
                          onChange={(e) => setNewExpTitle(e.target.value)}
                          placeholder="e.g. Bucao River Basin Soil Saturation Profiling"
                          className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Research Area Category</label>
                        <select
                          value={newExpArea}
                          onChange={(e) => setNewExpArea(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 rounded-lg px-3.5 py-2 text-sm text-slate-300 focus:outline-none transition-all"
                        >
                          <option value="Environmental Intelligence">Environmental Intelligence</option>
                          <option value="Disaster Risk Reduction">Disaster Risk Reduction</option>
                          <option value="Smart Communities Infrastructure">Smart Communities Infrastructure</option>
                          <option value="Human-Centered AI & GIS">Human-Centered AI & GIS</option>
                        </select>
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Scientific Objective / Method</label>
                        <textarea
                          rows={2}
                          value={newExpObjective}
                          onChange={(e) => setNewExpObjective(e.target.value)}
                          placeholder="Detail the scientific objective, sensor nodes calibrated, or spatial parameters mapped..."
                          className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition-all resize-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">AI Model Architecture</label>
                        <select
                          value={newExpParam}
                          onChange={(e) => setNewExpParam(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 rounded-lg px-3.5 py-2 text-sm text-slate-300 focus:outline-none transition-all"
                        >
                          <option value="Gemini-2.5-Flash (Adaptive)">Gemini-2.5-Flash (Adaptive)</option>
                          <option value="Gemini-2.5-Pro (High-Precision)">Gemini-2.5-Pro (High-Precision)</option>
                          <option value="Sentinel-Regression-Core v6">Sentinel-Regression-Core v6</option>
                        </select>
                      </div>

                      <div className="flex items-end justify-end gap-3 pt-3">
                        <button
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            setIsFormulating(false);
                          }}
                          className="px-4 py-2 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white font-sans text-xs font-semibold transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-sans text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                        >
                          Save Formulation
                        </button>
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* POLISHED EMPTY STATE WITH CALL-TO-ACTION (Milestone 5) */}
              {customExperiments.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-slate-800/80 bg-slate-950/40 text-center shadow-inner relative group">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />
                  
                  <div className="p-4 bg-slate-900/60 rounded-full border border-slate-800 mb-4 text-slate-500 shadow-md group-hover:scale-105 transition-transform duration-300">
                    <FolderPlus className="w-8 h-8 text-slate-400 animate-pulse" />
                  </div>
                  <h4 className="text-base font-display font-bold text-white tracking-wide mb-1">
                    No Active Experiments Formulated
                  </h4>
                  <p className="text-sm text-slate-400 max-w-md mb-5 font-sans leading-relaxed">
                    Create your first academic research project or trigger simulation telemetry from the decision bridge controls to generate model statistics.
                  </p>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setIsFormulating(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500 text-orange-400 hover:text-white font-mono text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    [ Formulate New Experiment ]
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customExperiments.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-5 rounded-xl bg-slate-950/60 border border-slate-850 hover:border-slate-800 transition-all flex flex-col justify-between gap-4 shadow-sm"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono font-bold text-cyan-400">
                            {exp.id}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                            exp.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : exp.status === "running"
                              ? "bg-orange-500/10 text-orange-400 border-orange-500/20 animate-pulse"
                              : "bg-slate-900 text-slate-400 border-slate-800"
                          }`}>
                            {exp.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-sans font-bold text-white">{exp.title}</h4>
                        <p className="text-xs font-sans text-slate-400 leading-normal">{exp.objective}</p>
                        
                        <div className="flex flex-wrap gap-2 pt-1">
                          <span className="text-[10px] font-mono text-slate-500">AREA: <span className="text-slate-300 font-sans font-medium">{exp.area}</span></span>
                          <span className="text-slate-700 font-mono text-[10px]">|</span>
                          <span className="text-[10px] font-mono text-slate-500 font-semibold">MODEL: <span className="text-cyan-400">{exp.modelParam}</span></span>
                        </div>
                      </div>

                      <div className="space-y-2 border-t border-slate-900 pt-3">
                        {exp.status !== "idle" && (
                          <div>
                            <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                              <span>Simulation Sweeping...</span>
                              <span>{exp.progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/60">
                              <div
                                className="h-full bg-gradient-to-r from-orange-500 to-cyan-500 transition-all duration-300"
                                style={{ width: `${exp.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-3">
                          {exp.status === "idle" ? (
                            <button
                              type="button"
                              onClick={() => runExperimentSimulation(exp.id)}
                              className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 font-sans text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5" /> Run Simulation Sweep
                            </button>
                          ) : exp.status === "running" ? (
                            <span className="text-[11px] font-mono text-orange-400 font-bold flex items-center gap-1.5 animate-pulse">
                              <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                              AI SWEEP UNDERWAY...
                            </span>
                          ) : (
                            <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              SIMULATION COMPLETED
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => deleteExperiment(exp.id)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-950/20 text-slate-500 hover:text-red-400 border border-slate-850 hover:border-red-900/50 transition-colors cursor-pointer"
                            title="Discard Formulation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* THIRD ROW - SYSTEM HEALTH RINGS, AI TERMINAL / THOUGHTS LOG, COMMUNITY IMPACT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* 13. AI Thought Stream & Terminal Logs (Col-span-7) */}
              <div className="lg:col-span-7 p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-xl backdrop-blur flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">
                      AI CENTRAL REASONING THOUGHT STREAM
                    </span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>

                <div className="h-44 bg-slate-950/95 rounded-lg border border-slate-850 p-3 font-terminal text-[11px] text-cyan-400 overflow-y-auto scrollbar-thin flex flex-col gap-1.5">
                  {thoughtStream.map((log, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-slate-500 select-none">[{idx + 1}]</span>
                      <span className="text-cyan-300 break-all whitespace-pre-wrap">{log}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-1.5 text-orange-400 animate-pulse mt-1 font-bold">
                    <span className="inline-block w-1.5 h-3 bg-orange-400 animate-ping mr-1" />
                    COGNITIVE LOOP COMPILING...
                  </div>
                </div>

                {/* 8. Activity Timeline of researchers */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-slate-950/50 p-3 rounded-lg border border-slate-850 text-xs">
                  <span className="md:col-span-full font-mono text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-900 pb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" /> LIVE MUNICIPAL ACTIVITY TIMELINE
                  </span>
                  {[
                    { time: "09:42", msg: "Weather parameters synced", sub: "Climate API" },
                    { time: "09:34", msg: "Flood model retrained", sub: "Sentinel AI" },
                    { time: "09:25", msg: "Drone bravo survey done", sub: "Agriculture" },
                    { time: "09:18", msg: "River Sensor 15 online", sub: "IoT Mesh" },
                    { time: "09:02", msg: "GIS elevation file added", sub: "Mapbox S3" }
                  ].map((act, idx) => (
                    <div key={idx} className="flex flex-col border-l border-slate-800 pl-2.5">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">{act.time}</span>
                      <span className="text-slate-200 font-sans font-semibold truncate leading-tight mt-0.5">{act.msg}</span>
                      <span className="text-[9px] text-slate-500 font-mono uppercase mt-0.5">{act.sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 12. System Health & 15. AI Confidence Meter (Col-span-5) */}
              <div className="lg:col-span-5 p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-xl backdrop-blur flex flex-col gap-4">
                
                {/* 15. AI Predictive Model Confidence Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5" /> AI PREDICTION CONFIDENCE GAUGES
                    </span>
                    
                    <select 
                      value={confidenceModel}
                      onChange={(e) => {
                        sounds.playClick();
                        setConfidenceModel(e.target.value as any);
                      }}
                      className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-[10px] font-mono text-orange-400 focus:outline-none"
                    >
                      <option value="flood">Flood Inundation Predictor</option>
                      <option value="landslide">Landslide Risk Classifier</option>
                      <option value="crop">Smart Crop Yield Estimator</option>
                      <option value="solar">Solar Energy Dispatcher</option>
                    </select>
                  </div>

                  <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-850 flex items-center gap-4">
                    {/* Circle Gauge graphic representation */}
                    <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="rgba(30,41,59,0.5)" strokeWidth="4" fill="transparent" />
                        <circle 
                          cx="32" 
                          cy="32" 
                          r="28" 
                          stroke="#f97316" 
                          strokeWidth="4" 
                          fill="transparent" 
                          strokeDasharray={2 * Math.PI * 28}
                          strokeDashoffset={2 * Math.PI * 28 * (1 - confDetails.percent / 100)}
                        />
                      </svg>
                      <div className="absolute font-mono text-sm font-bold text-white">
                        {confDetails.percent}%
                      </div>
                    </div>

                    <div className="flex-1">
                      <h4 className="text-xs font-sans font-bold text-slate-100">{confDetails.label}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5 leading-snug">{confDetails.desc}</p>
                      <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[8px] text-emerald-400 font-mono font-bold uppercase mt-1">
                        High Model Precision
                      </span>
                    </div>
                  </div>
                </div>

                {/* 12. System Health Circular Rings */}
                <div>
                  <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-3.5 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" /> SYSTEM HEALTH RATIOS
                  </h4>

                  <div className="grid grid-cols-5 gap-2 text-center">
                    {[
                      { label: "CPU", val: 72, color: "#ef4444" },
                      { label: "RAM", val: 54, color: "#f97316" },
                      { label: "DB", val: 98, color: "#10b981" },
                      { label: "NET", val: 95, color: "#06b6d4" },
                      { label: "AI CORE", val: 100, color: "#8b5cf6" }
                    ].map((ring, i) => (
                      <div key={i} className="flex flex-col items-center p-1.5 rounded bg-slate-950/60 border border-slate-850">
                        <div className="relative w-11 h-11 flex items-center justify-center mb-1">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="22" cy="22" r="18" stroke="rgba(30,41,59,0.3)" strokeWidth="2.5" fill="transparent" />
                            <circle 
                              cx="22" 
                              cy="22" 
                              r="18" 
                              stroke={ring.color} 
                              strokeWidth="2.5" 
                              fill="transparent" 
                              strokeDasharray={2 * Math.PI * 18}
                              strokeDashoffset={2 * Math.PI * 18 * (1 - ring.val / 100)}
                            />
                          </svg>
                          <span className="absolute font-mono text-[9px] font-bold text-slate-100">{ring.val}%</span>
                        </div>
                        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">{ring.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* FOURTH ROW: COMMUNITY IMPACT, RESEARCH HIGHLIGHTS, RESEARCH ROADMAP, PUBLICATIONS, MISSION QUEUE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* 14. Community Impact Metrics (Col-span-4) */}
              <div className="lg:col-span-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-xl backdrop-blur flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase mb-3 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-cyan-400" /> COMMUNITY IMPACT INSIGHTS
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Population Covered", val: "18,420", desc: "Zambales districts" },
                      { label: "Flood Alerts Issued", val: "14", desc: "Monsoon anomalies" },
                      { label: "Trees Monitored", val: "4,512", desc: "Canopy index grids" },
                      { label: "Evacuation Centers", val: "18", desc: "GIS registered plots" }
                    ].map((stat, i) => (
                      <div key={i} className="p-3 rounded-lg bg-slate-950/70 border border-slate-850 flex flex-col justify-between">
                        <span className="text-[11px] text-slate-400 font-sans font-medium">{stat.label}</span>
                        <span className="text-xl font-display font-bold text-white tracking-tight mt-1 mb-0.5">{stat.val}</span>
                        <span className="text-[9px] text-cyan-500 font-mono uppercase">{stat.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-850/50 pt-2.5 mt-3 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>MUNICIPAL COVERAGE RATIO: 94.2%</span>
                </div>
              </div>

              {/* 9. Research Highlights & 11. Research Roadmap (Col-span-5) */}
              <div className="lg:col-span-5 p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-xl backdrop-blur flex flex-col gap-4">
                
                {/* 9. Research Highlights */}
                <div>
                  <h3 className="text-xs font-mono font-bold text-orange-400 tracking-wider uppercase mb-2 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-orange-400" /> ACADEMIC LABORATORY HIGHLIGHTS
                  </h3>
                  
                  <div className="grid grid-cols-5 gap-2 text-center">
                    {[
                      { count: "24", label: "Projects" },
                      { count: "6", label: "Papers" },
                      { count: "148", label: "Exps" },
                      { count: "31", label: "Datasets" },
                      { count: "8", label: "Staff" }
                    ].map((hl, i) => (
                      <div key={i} className="p-2 rounded bg-slate-950 border border-slate-850">
                        <div className="text-base font-display font-bold text-white">{hl.count}</div>
                        <div className="text-[9px] text-slate-400 font-mono mt-0.5 uppercase">{hl.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 11. Research Roadmap */}
                <div>
                  <h3 className="text-xs font-mono font-bold text-slate-300 tracking-wider uppercase mb-2 flex items-center gap-1.5">
                    <Milestone className="w-3.5 h-3.5 text-slate-300" /> PIPELINE PROJECT ROADMAP
                  </h3>

                  <div className="flex flex-col gap-2 text-xs font-sans">
                    {[
                      { step: "Planning Phase", blocks: "██████", pct: 60 },
                      { step: "Prototype Simulation", blocks: "█████████", pct: 90 },
                      { step: "Field Testing", blocks: "███████", pct: 70 },
                      { step: "Municipal Deployment", blocks: "█████", pct: 50 }
                    ].map((road, i) => (
                      <div key={i} className="flex justify-between items-center p-1.5 rounded bg-slate-950/60 border border-slate-850">
                        <span className="text-slate-300 text-[11px] font-sans truncate pr-1">{road.step}</span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-orange-500/80 tracking-tighter text-[11px] select-none">{road.blocks}</span>
                          <span className="text-cyan-400 font-bold text-[10px] w-8 text-right">{road.pct}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* 16. Mission Queue & 17. Publications (Col-span-3) */}
              <div className="lg:col-span-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-xl backdrop-blur flex flex-col gap-4">
                
                {/* 16. Mission Queue */}
                <div>
                  <h3 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <Bot className="w-3.5 h-3.5" /> Drone Queue
                  </h3>
                  <div className="flex flex-col gap-1.5 text-xs">
                    {[
                      { name: "Drone Survey", sched: "Today", bg: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
                      { name: "Sensor Maint", sched: "Tomorrow", bg: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
                      { name: "Road Inspect", sched: "Friday", bg: "bg-slate-950 text-slate-400 border-slate-850" },
                      { name: "Weather Anal", sched: "Running", bg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20 animate-pulse" }
                    ].map((m, i) => (
                      <div key={i} className={`flex justify-between items-center p-1.5 rounded border ${m.bg}`}>
                        <span className="font-semibold">{m.name}</span>
                        <span className="font-mono text-[9px] uppercase font-bold">{m.sched}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 17. Recent Publications */}
                <div>
                  <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" /> Publications
                  </h3>
                  <div className="flex flex-col gap-1.5 text-xs font-sans">
                    {[
                      { title: "Predictive Flood Mapping", status: "Published", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                      { title: "Drone-assisted Crops", status: "Review", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                      { title: "AI River Monitoring", status: "Draft", color: "text-slate-400 bg-slate-950 border-slate-850" }
                    ].map((pub, i) => (
                      <div key={i} className="p-1.5 rounded bg-slate-950/70 border border-slate-850/50">
                        <div className="text-[11px] font-semibold text-slate-200 truncate">{pub.title}</div>
                        <div className="flex justify-between items-center mt-1 text-[9px] font-mono">
                          <span className="text-slate-500">SAMMIUM LABS</span>
                          <span className={`px-1 rounded border uppercase font-bold ${pub.color}`}>{pub.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Column: Persona selection */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className={`p-4 rounded-xl border bg-slate-900/95 shadow-lg relative overflow-hidden transition-all duration-300 ${
                isRgbOverdrive ? "border-orange-500/50 ring-2 ring-orange-500/20" : "border-slate-800"
              }`}>
                {/* Background Grid Accent */}
                <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>

                <div className="relative z-10">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 mb-3 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 animate-spin-slow" /> [ COGNITIVE_MODEL_SELECTION ]
                  </h3>
                  
                  <p className="text-xs text-slate-400 mb-4 font-mono leading-relaxed">
                    Equip your core with a specialized research co-pilot:
                  </p>

                  <div className="flex flex-col gap-3">
                    {personas.map((persona) => {
                      const isSelected = selectedPersonaId === persona.id;
                      return (
                        <button
                          key={persona.id}
                          onClick={() => {
                            sounds.playClick();
                            setSelectedPersonaId(persona.id);
                          }}
                          onMouseEnter={() => sounds.playHover()}
                          className={`p-3 rounded-lg border text-left transition-all relative ${
                            isSelected
                              ? "bg-slate-950 border-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.25)]"
                              : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900"
                          }`}
                        >
                          {isSelected && (
                            <span className="absolute top-0 left-0 w-1 h-full bg-orange-500 rounded-l-md"></span>
                          )}
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{persona.avatar}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase truncate">
                                {persona.name}
                              </div>
                              <div className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                                <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                                  persona.vibe === "chaotic" ? "bg-red-500 animate-ping" : persona.vibe === "conservative" ? "bg-cyan-500" : "bg-emerald-500"
                                }`} />
                                VIBE: {persona.vibe.toUpperCase()}
                              </div>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono leading-relaxed mt-1.5 border-t border-slate-800/60 pt-1.5">
                            {persona.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Presets */}
              <div className={`p-4 rounded-xl border bg-slate-900/95 shadow-md relative transition-all duration-300 ${
                isRgbOverdrive ? "border-cyan-500/50 ring-2 ring-cyan-500/20" : "border-slate-800"
              }`}>
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> [ PRESET_HYPER_TRANSMISSIONS ]
                </h3>
                <p className="text-[10px] text-slate-400 font-mono mb-3">
                  Inject ready-made scientific queries into the Sentinel brain:
                </p>
                <div className="flex flex-col gap-2">
                  {PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePresetClick(preset)}
                      className="p-2 text-[10px] font-mono text-left bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-cyan-500/80 rounded transition-all text-slate-300 hover:text-cyan-300 leading-snug"
                    >
                      &gt; {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Neural Brain Canvas and Chat Terminal */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="h-44">
                <NeuralBrainCanvas isLoading={loading} isOverdrive={isRgbOverdrive} />
              </div>

              <div className={`flex-1 flex flex-col rounded-xl border bg-slate-950 shadow-2xl relative overflow-hidden transition-all duration-500 ${
                isRgbOverdrive 
                  ? "border-orange-500/60 shadow-[0_0_25px_rgba(249,115,22,0.15)] ring-1 ring-cyan-400/40" 
                  : "border-slate-800"
              }`}>
                {/* Header Bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Terminal className={`w-4 h-4 ${isRgbOverdrive ? "text-orange-400 animate-pulse" : "text-slate-400"}`} />
                    <span className="text-[11px] font-mono font-bold text-slate-300 tracking-wider">
                      SENTINEL BRAIN STREAM // {selectedPersona.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-2 w-2 relative">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${loading ? "bg-amber-400" : "bg-emerald-400"}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${loading ? "bg-amber-500" : "bg-emerald-500"}`}></span>
                    </span>
                    <button 
                      onClick={clearConsole}
                      title="Clear RAM"
                      className="text-slate-500 hover:text-orange-400 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Terminal logs output */}
                <div className="flex-1 p-4 h-[240px] overflow-y-auto font-mono text-xs flex flex-col gap-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                  {terminalHistory.map((item, index) => {
                    if (item.type === "user") {
                      return (
                        <div key={index} className="flex gap-2 text-cyan-300">
                          <span className="text-cyan-500 font-bold shrink-0">&gt; COUPLER_UPLOADER:</span>
                          <span className="break-all whitespace-pre-wrap">{item.text}</span>
                        </div>
                      );
                    }
                    if (item.type === "error") {
                      return (
                        <div key={index} className="flex gap-2 text-rose-400 bg-rose-950/20 p-2.5 rounded border border-rose-900/50">
                          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-bold uppercase tracking-wider text-rose-300 mb-0.5">Quantum Comm Error</div>
                            <p className="leading-relaxed text-[11px]">{item.text}</p>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={index} className="flex flex-col gap-1.5 p-3 rounded bg-slate-900/40 border border-slate-800/40">
                        <div className="flex items-center gap-1.5 text-orange-400 font-bold tracking-wider text-[10px]">
                          <Zap className="w-3 h-3 text-orange-400 animate-pulse" />
                          {item.personaName || "SENTINEL_NET"} INCOMING TELEMETRY STREAM:
                        </div>
                        <div className="text-slate-200 leading-relaxed text-[11px] whitespace-pre-wrap break-words pl-1.5 border-l-2 border-orange-500/40">
                          {item.text}
                        </div>
                      </div>
                    );
                  })}

                  {loading && (
                    <div className="flex flex-col gap-2 p-3 bg-slate-900/30 rounded border border-slate-800/40 animate-pulse">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-[10px]">
                        <RotateCcw className="w-3 h-3 animate-spin text-amber-400" />
                        SYNAPSE CORRELATION PROCESS IN PROGRESS...
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono tracking-widest pl-1.5">
                        [████████████░░░░░] SYNAPSE INFERENCE ROUTING...
                      </div>
                    </div>
                  )}
                </div>

                {/* Command Deck Action Chips */}
                <div className="px-4 py-2 bg-slate-950 border-t border-slate-900 flex flex-wrap items-center gap-1.5 md:gap-2">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mr-1">
                    [ COMMAND DECK QUICK-LINKS ]:
                  </span>
                  {[
                    { label: "🛰 Analyze Typhoon", cmd: "> Analyze Typhoon" },
                    { label: "🚁 Launch Drone Alpha", cmd: "> Launch Drone Alpha" },
                    { label: "🌊 Run Flood Simulation", cmd: "> Run Flood Simulation" },
                    { label: "🤖 Open Robotics Lab", cmd: "> Open Robotics Lab" },
                    { label: "📡 Satellite View", cmd: "> Satellite View" }
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPrompt(chip.cmd);
                        runNeuralSimulation(chip.cmd);
                      }}
                      className="px-2 py-1 rounded bg-slate-900 hover:bg-cyan-950/30 text-[9px] font-mono border border-slate-850 hover:border-cyan-500 text-slate-400 hover:text-cyan-400 transition-all cursor-pointer"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {/* Form input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    runNeuralSimulation(prompt);
                  }}
                  className="p-3 bg-slate-900/80 border-t border-slate-800/80 flex items-center gap-3"
                >
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-cyan-400 text-xs">
                      SYS //:
                    </span>
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Query Sentinel Brain or spatial research co-pilot..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400/80 rounded-lg py-2.5 pl-12 pr-4 text-xs font-mono text-cyan-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !prompt.trim()}
                    onMouseEnter={() => sounds.playHover()}
                    className={`px-4 py-2.5 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 transition-all ${
                      prompt.trim() && !loading
                        ? "bg-gradient-to-r from-orange-500 via-amber-600 to-cyan-500 hover:opacity-90 text-white cursor-pointer hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    FIRE
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
