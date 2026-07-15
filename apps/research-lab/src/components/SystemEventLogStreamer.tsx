import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Play, Pause, Trash2, Shield, Radio, Activity, ChevronRight, Server, Download, ListCollapse } from "lucide-react";
import { sounds } from "../utils/sounds";

interface SystemEventLogStreamerProps {
  operatorName: string;
  activeStation: string;
  isRgbOverdrive: boolean;
}

interface LogEntry {
  id: string;
  timestamp: string;
  category: "QUANTUM" | "NEURAL" | "CELLULAR" | "ROBOTICS" | "AI" | "SYSTEM" | "ERROR" | "SUCCESS";
  message: string;
  code: string;
}

const CATEGORY_COLORS = {
  QUANTUM: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  NEURAL: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  CELLULAR: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  ROBOTICS: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  AI: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  SYSTEM: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  ERROR: "text-red-400 bg-red-500/10 border-red-500/20",
  SUCCESS: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
};

const SAMPLE_LOG_TEMPLATES = [
  { category: "QUANTUM" as const, message: "Satellite orbit telemetry flux drift stabilized at optimum amplitude", code: "ORBIT_OK // 0.042%" },
  { category: "QUANTUM" as const, message: "Botolan elevation contour digital terrain models loaded", code: "GIS_CONTOUR // Δ=0.0001" },
  { category: "NEURAL" as const, message: "Sentinel Smart GIS spatial overlays aligned and initialized", code: "GIS_OVERLAYS // 100% MATCH" },
  { category: "NEURAL" as const, message: "Operator cognitive decision models established", code: "DECISION_MODELS // 1.2ms" },
  { category: "CELLULAR" as const, message: "Botolan 3D Digital Twin simulation grids updated", code: "TWIN_GRID // ITER_942" },
  { category: "CELLULAR" as const, message: "Municipal forest density ratio recalculated", code: "CANOPY_RATIO // D=0.618" },
  { category: "ROBOTICS" as const, message: "Agricultural mobile robot swarm coordinate vectors synced", code: "ROBOT_SWARM // 0xF4A9" },
  { category: "ROBOTICS" as const, message: "Agricultural assessment drone flight plans calibrated", code: "DRONE_PLAN // THRUST_1.0" },
  { category: "AI" as const, message: "Artificial Intelligence Research Lab prediction models configured", code: "AI_DEPTH // FLOOD_MODEL_v2" },
  { category: "AI" as const, message: "Gemini response parsed, categorizing community report features", code: "GEMINI_OK // TOKENS=452" },
  { category: "SYSTEM" as const, message: "Secure gateway connection linked on port 3000", code: "HOST_PORT // localhost:3000" },
  { category: "SYSTEM" as const, message: "Smart community statistics diagnostics broadcast complete", code: "HUD_BROADCAST // OK" },
  { category: "SUCCESS" as const, message: "Operator permission level verified securely", code: "AUTH_OK // LEVEL_4" },
  { category: "SUCCESS" as const, message: "Sentinel Overclock metrics synchronized", code: "OVERCLOCK // ACTIVE" },
  { category: "ERROR" as const, message: "Packet jitter detected on IoT sensor network", code: "JITTER_WARN // 0.02%" },
  { category: "ERROR" as const, message: "Local IoT sensor node temperature threshold check triggered", code: "NODE_HEAT // T=42C" }
];

export const SystemEventLogStreamer: React.FC<SystemEventLogStreamerProps> = ({
  operatorName,
  activeStation,
  isRgbOverdrive
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [showFullLogs, setShowFullLogs] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate a random log entry helper
  const createRandomLog = (customMessage?: string, customCategory?: LogEntry["category"]): LogEntry => {
    const time = new Date();
    const formattedTime = time.toLocaleTimeString("en-US", { hour12: false });
    
    let template = SAMPLE_LOG_TEMPLATES[Math.floor(Math.random() * SAMPLE_LOG_TEMPLATES.length)];
    
    // Override category sometimes to match active station
    if (activeStation && !customCategory && Math.random() > 0.4) {
      if (activeStation === "ai-nexus" || activeStation === "ai-lab" || activeStation === "ai-vault") {
        template = { category: "AI", message: `Station ${activeStation.toUpperCase()} analysis payload streamed`, code: "AI_STATION // RUNNING" };
      } else if (activeStation === "robotics-swarm") {
        template = { category: "ROBOTICS", message: "Swarm kinetic telemetry response package accepted", code: "SWARM_OK // LIVE" };
      } else if (activeStation === "quantum-orbit") {
        template = { category: "QUANTUM", message: "Orbit decay simulator matrix recalculated", code: "ORBIT_DECAY // CALC" };
      } else if (activeStation === "cellular-matrix") {
        template = { category: "CELLULAR", message: "Matrix cell neighborhood updated automatically", code: "CELL_GEN_T // RUNNING" };
      }
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: formattedTime,
      category: customCategory || template.category,
      message: customMessage || template.message,
      code: template.code
    };
  };

  // Populate initial logs on component mount
  useEffect(() => {
    const initialLogs = Array.from({ length: 8 }).map((_, idx) => {
      const template = SAMPLE_LOG_TEMPLATES[idx % SAMPLE_LOG_TEMPLATES.length];
      const time = new Date(Date.now() - (8 - idx) * 10000);
      return {
        id: `init-${idx}`,
        timestamp: time.toLocaleTimeString("en-US", { hour12: false }),
        category: template.category,
        message: template.message,
        code: template.code
      };
    });
    setLogs(initialLogs);
  }, []);

  // Listen for manually injected event logs from other components (like Voice Commands)
  useEffect(() => {
    const handleInjectedLog = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string; category: LogEntry["category"]; code: string }>;
      if (customEvent.detail) {
        const { message, category, code } = customEvent.detail;
        const formattedTime = new Date().toLocaleTimeString("en-US", { hour12: false });
        
        setLogs((prev) => {
          const newLog: LogEntry = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: formattedTime,
            category,
            message,
            code
          };
          const nextLogs = [...prev, newLog];
          if (nextLogs.length > 40) {
            return nextLogs.slice(nextLogs.length - 40);
          }
          return nextLogs;
        });
      }
    };

    window.addEventListener("inject-system-log", handleInjectedLog);
    return () => {
      window.removeEventListener("inject-system-log", handleInjectedLog);
    };
  }, []);

  // Set up periodic logging interval
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setLogs((prev) => {
        const nextLogs = [...prev, createRandomLog()];
        // Keep last 40 logs to avoid memory issues and too much clutter
        if (nextLogs.length > 40) {
          return nextLogs.slice(nextLogs.length - 40);
        }
        return nextLogs;
      });

      // Subtle feedback sound
      if (Math.random() > 0.75) {
        // play a tiny chiptune tick
      }
    }, 2800); // New log every 2.8 seconds

    return () => clearInterval(interval);
  }, [isPaused, activeStation]);

  // Keep scrolled to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  // Trigger custom manual event
  const triggerManualDiagnostics = () => {
    sounds.playClick();
    setLogs((prev) => [
      ...prev,
      createRandomLog(
        `Operator ${operatorName || "Kirito"} initiated manual diagnostic probe`,
        "SYSTEM"
      )
    ]);
  };

  // Export diagnostic report
  const handleExport = () => {
    sounds.playClick();
    const content = logs.map(l => `[${l.timestamp}] [${l.category}] ${l.message} (${l.code})`).join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sammium-diagnostic-${Date.now()}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    sounds.playClick();
    setLogs([]);
  };

  return (
    <div id="system-event-log-container" className="flex flex-col h-full font-mono text-white select-none">
      
      {/* Container Frame styled nicely with lab aesthetic */}
      <div className={`flex-1 flex flex-col bg-slate-900/80 rounded-2xl border border-slate-800/90 shadow-xl overflow-hidden backdrop-blur-md relative transition-all duration-300 ${
        isRgbOverdrive ? "border-pink-500/40 shadow-[0_4px_25px_rgba(244,63,94,0.1)]" : "border-slate-800/90"
      }`}>
        
        {/* Subtle accent line on top */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 via-pink-500 to-purple-500 opacity-80" />

        {/* Streamer Header */}
        <div className="flex items-center justify-between p-3.5 bg-slate-950/60 border-b border-slate-850">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-pink-500 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-widest text-slate-200">
                DATASTREAM // EVENTS
              </span>
              <span className="text-[7px] text-cyan-400 font-bold uppercase tracking-widest">
                REAL-TIME RESEARCH LOGS
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                sounds.playClick();
                setIsPaused(!isPaused);
              }}
              className={`p-1 rounded-md text-[9px] font-bold border flex items-center gap-1 px-1.5 transition-all cursor-pointer ${
                isPaused 
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400" 
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
              }`}
              title={isPaused ? "Resume Streaming" : "Pause Streaming"}
            >
              {isPaused ? <Play className="w-2.5 h-2.5" /> : <Pause className="w-2.5 h-2.5" />}
              <span>{isPaused ? "PAUSED" : "LIVE"}</span>
            </button>
          </div>
        </div>

        {/* Quick controls bar */}
        <div className="px-3.5 py-2 bg-slate-950/20 border-b border-slate-850 flex items-center justify-between text-[8px] text-slate-400">
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>BUFFER: {logs.length}/40 ITEMS</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleExport}
              className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1"
              title="Download Log Dump"
            >
              <Download className="w-2.5 h-2.5" />
              <span>EXPORT</span>
            </button>
            <span className="text-slate-700">|</span>
            <button 
              onClick={handleClear}
              className="hover:text-red-400 transition-colors cursor-pointer flex items-center gap-1"
              title="Clear Active Screen Buffer"
            >
              <Trash2 className="w-2.5 h-2.5" />
              <span>CLEAR</span>
            </button>
          </div>
        </div>

        {/* Event Logs Content Area */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 max-h-[500px] lg:max-h-none scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-800"
        >
          {logs.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500 gap-2">
              <Terminal className="w-8 h-8 text-slate-600 animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest">
                No telemetry streamed yet.
              </span>
              <button 
                onClick={triggerManualDiagnostics}
                className="mt-2 text-[9px] font-bold uppercase text-cyan-400 border border-cyan-400/30 hover:bg-cyan-400/10 px-2 py-1 rounded transition-all cursor-pointer"
              >
                Trigger Probe
              </button>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: 15, y: 5 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="p-2 rounded-lg bg-slate-950/40 border border-slate-850/60 hover:border-slate-800 transition-all flex flex-col gap-1 relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between gap-1">
                    {/* Event Category Badge */}
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded border ${CATEGORY_COLORS[log.category]}`}>
                        {log.category}
                      </span>
                      <span className="text-[8px] text-slate-500 font-bold font-mono">
                        {log.timestamp}
                      </span>
                    </div>
                    {/* Mini visual state indicator */}
                    <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400 tracking-tighter opacity-70 group-hover:opacity-100 transition-opacity">
                      <span>{log.code.split(" // ")[0]}</span>
                    </div>
                  </div>

                  {/* Message details */}
                  <span className="text-[10px] text-slate-300 leading-normal font-medium tracking-wide break-words">
                    {log.message}
                  </span>

                  {/* Micro-HUD element inside */}
                  <div className="flex items-center justify-between text-[7px] text-slate-600 border-t border-slate-850/40 pt-1 group-hover:text-slate-400 transition-colors">
                    <span>SYS_LOC // STN_{activeStation.toUpperCase().replace("-", "_")}</span>
                    <span>{log.code.split(" // ")[1]}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Bottom manual override trigger pad */}
        <div className="p-3 bg-slate-950/50 border-t border-slate-850 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[7px] text-slate-500 uppercase font-bold">Diagnostics Injector</span>
            <span className="text-[9px] text-slate-300 font-bold uppercase truncate max-w-[120px]">
              {operatorName || "Kirito"}
            </span>
          </div>
          <button
            onClick={triggerManualDiagnostics}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-400/40 hover:bg-cyan-500/25 text-cyan-400 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm hover:shadow-cyan-500/10"
          >
            PING DIAGNOSTICS
          </button>
        </div>

      </div>
    </div>
  );
};
