import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  Cpu, 
  Activity, 
  Volume2, 
  VolumeX, 
  Compass, 
  Terminal, 
  User, 
  Lock, 
  Zap, 
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Eye,
  Camera,
  Fingerprint
} from "lucide-react";
import { sounds } from "../utils/sounds";

interface SaoLoginProps {
  onLoginSuccess: (username: string) => void;
  isRgbOverdrive: boolean;
}

export const SaoLogin: React.FC<SaoLoginProps> = ({ onLoginSuccess, isRgbOverdrive }) => {
  const [username, setUsername] = useState("Research_Operator");
  const [password, setPassword] = useState("SAMMIUM-OS-ACCESS");
  const [neuralGateway, setNeuralGateway] = useState<"Silicon" | "Quantum" | "BioDigital">("Quantum");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [status, setStatus] = useState<"login" | "linking" | "success">("login");
  const [progressText, setProgressText] = useState<string>("");
  const [sysLog, setSysLog] = useState<string[]>([]);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Fast scrolling radial colorful streaks for the immersive neural dive animation tunnel
  const [tunnelRays, setTunnelRays] = useState<{
    id: number;
    colorClass: string;
    shadowColor: string;
    angle: number;
    delay: number;
    duration: number;
    width: number;
    height: number;
    maxRadius: number;
  }[]>([]);

  // Generate immersive tunnel stream particles representing consciousness entering the virtual OS
  useEffect(() => {
    if (status === "linking") {
      const colors = [
        { tw: "bg-orange-500", glow: "rgba(249, 115, 22, 0.85)" },
        { tw: "bg-amber-400", glow: "rgba(251, 191, 36, 0.85)" },
        { tw: "bg-cyan-400", glow: "rgba(34, 211, 238, 0.85)" },
        { tw: "bg-emerald-400", glow: "rgba(52, 211, 153, 0.85)" },
        { tw: "bg-blue-500", glow: "rgba(59, 130, 246, 0.85)" },
        { tw: "bg-indigo-500", glow: "rgba(99, 102, 241, 0.85)" }
      ];
      
      const rays = Array.from({ length: 150 }, (_, i) => {
        const colorPair = colors[i % colors.length];
        return {
          id: i,
          colorClass: colorPair.tw,
          shadowColor: colorPair.glow,
          angle: Math.random() * 360,
          delay: Math.random() * 1.2,
          duration: 0.4 + Math.random() * 0.8, // extremely fast speed-line rush
          width: 40 + Math.random() * 250,    // varied lengths of light streaks
          height: 1.5 + Math.random() * 3.5,  // thickness of rays
          maxRadius: 1100 + Math.random() * 500
        };
      });
      setTunnelRays(rays);
    }
  }, [status]);

  // Hook to trigger sounds matching the state/transition changes
  useEffect(() => {
    if (status === "linking" && soundEnabled) {
      sounds.playLinkStart();
    } else if (status === "success" && soundEnabled) {
      sounds.playTimeJump();
    }
  }, [status, soundEnabled]);

  // Handle the Sentinel Neural Boot sequence
  const handleLinkStart = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername) {
      sounds.playError();
      setValidationError("Operator ID code cannot be empty.");
      return;
    }

    if (!cleanPassword) {
      sounds.playError();
      setValidationError("Neural Link Encryption Key is required.");
      return;
    }

    setValidationError(null);
    sounds.toggle(soundEnabled);
    setStatus("linking");

    const logs = [
      "ESTABLISHING SECURE GATEWAY ENVELOPE...",
      "HARDWARE VERIFIED: Sammium Quantum Core v6.0.1",
      "SENSORY RECEPTRON TUNING: ACTIVE",
      "CALIBRATING SYNAPTIC CONNECTIVITY... OK (100%)",
      "POLARIZING NEURAL SIGNAL BUFFERS... OK (100%)",
      "ESTABLISHING REAL-TIME DIGITAL TWIN EARTH HOSTS...",
      "AI INITIATION ENGINE SYNC ... OK (98%)",
      "SATELLITE INTELLIGENCE NETWORK ... ONLINE (100%)",
      "DRONE SWARM TELEMETRY ROUTING ROUTE COMPLETED",
      "SENTINEL ASSISTANT SERVICES INITIALIZED",
      "LOCAL SECURE WORKSPACE STABILIZED ON PORT 3000",
      "SENTINEL OS KERNEL DEPLOYMENT: GRANTED."
    ];

    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex < logs.length) {
        setSysLog(prev => [...prev, logs[logIndex]]);
        setProgressText(logs[logIndex]);
        logIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setStatus("success");
          setTimeout(() => {
            onLoginSuccess(cleanUsername);
          }, 4500); // More time for biometric face-scan and AI authentication
        }, 600);
      }
    }, 200);
  };

  const selectModel = (model: typeof neuralGateway) => {
    sounds.playClick();
    setNeuralGateway(model);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 flex items-center justify-center overflow-hidden font-sans">
      
      {/* Dynamic particles background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.75)_0%,rgba(2,6,23,1)_100%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      {/* Atmospheric glowing color orbs */}
      <div className="absolute top-1/4 left-1/4 w-[45rem] h-[45rem] bg-orange-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[45rem] h-[45rem] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />

      <AnimatePresence mode="wait">
        {status === "login" && (
          <motion.div
            key="sentinel-login-card"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-lg p-1 px-4 sm:px-0 relative z-10"
          >
            
            {/* Transparent Glass Window Framework */}
            <div className="bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden relative">
              
              {/* Top Branding Banner */}
              <div className="relative h-24 bg-gradient-to-r from-orange-600 via-amber-600 to-cyan-750 flex items-center justify-between px-8 overflow-hidden">
                <div className="absolute inset-0 bg-black/35" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.1)_0%,transparent_60%)]" />
                
                <div className="relative flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner animate-pulse">
                    <Compass className="w-5 h-5 text-orange-400 animate-spin-slow" />
                  </div>
                  <div>
                    <h1 className="text-sm font-bold tracking-widest text-white leading-none uppercase">
                      SENTINEL OS LOGIN
                    </h1>
                    <span className="text-[9px] text-orange-300/80 uppercase tracking-widest font-bold">
                      SAMMIUM RESEARCH LABS // BUILD 6.0
                    </span>
                  </div>
                </div>

              {/* Sound control toggle on login card */}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSoundEnabled(!soundEnabled);
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer relative z-20 ${
                    soundEnabled 
                      ? "bg-white/10 border-white/30 text-white hover:bg-white/20" 
                      : "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                  }`}
                  title="Toggle Sound Effects"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>

              {/* Form Fields */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLinkStart();
                }}
                className="p-8 flex flex-col gap-6"
              >
                
                {/* Gateway core selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-orange-400" /> SELECT NEURAL GATEWAY
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "Silicon", label: "Silicon Synapse", desc: "Core A-10", icon: "🧬" },
                      { id: "Quantum", label: "Quantum Optical", desc: "Core B-24", icon: "🛰" },
                      { id: "BioDigital", label: "Bio-Digital", desc: "Core C-90", icon: "🌌" }
                    ].map((model) => (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => selectModel(model.id as any)}
                        className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col gap-1 cursor-pointer ${
                          neuralGateway === model.id
                            ? "bg-orange-500/10 border-orange-500/60 shadow-[0_0_12px_rgba(249,115,22,0.15)]"
                            : "bg-slate-950/40 border-slate-850 hover:border-slate-800 hover:bg-slate-950/80"
                        }`}
                      >
                        <span className="absolute top-2 right-2 text-xs opacity-60">{model.icon}</span>
                        <span className={`text-xs font-bold leading-none ${
                          neuralGateway === model.id ? "text-orange-400" : "text-slate-300"
                        }`}>
                          {model.label}
                        </span>
                        <span className="text-[8px] text-slate-500 uppercase">
                          {model.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Operator Credentials */}
                <div className="flex flex-col gap-4">
                  
                  {/* Account Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-400" /> OPERATOR IDENTIFICATION CODES
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onFocus={(e) => e.target.select()}
                        placeholder="ENTER OPERATOR NAME..."
                        className="w-full bg-slate-950/80 border border-slate-850 hover:border-slate-800 focus:border-orange-500/80 p-3 pl-10 rounded-xl text-xs text-white focus:outline-none transition-all placeholder:text-slate-600 uppercase"
                      />
                      <User className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  {/* Encryption Key */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" /> NEURAL LINK ENCRYPTION KEY
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={(e) => e.target.select()}
                        placeholder="ENTER SECURE KEY..."
                        className="w-full bg-slate-950/80 border border-slate-850 hover:border-slate-800 focus:border-orange-500/80 p-3 pl-10 rounded-xl text-xs text-white focus:outline-none transition-all placeholder:text-slate-600"
                      />
                      <Lock className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                </div>

                {/* Validation Error Message */}
                {validationError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-950/50 border border-red-500/40 rounded-xl text-xs text-red-400 flex items-center gap-2"
                  >
                    <span className="text-red-500 font-bold font-mono">⚠️ [AUTH_FAIL]</span>
                    <span>{validationError}</span>
                  </motion.div>
                )}

                {/* Status Bar */}
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-850 flex items-center justify-between text-[9px] text-slate-500">
                  <span className="flex items-center gap-1 uppercase">
                    <Activity className="w-3 h-3 text-emerald-450 animate-pulse" /> CALIBRATION: READY
                  </span>
                  <span className="text-orange-400 uppercase font-bold">
                    PORT 3000 INGRESS: EXCELLENT
                  </span>
                </div>

                {/* INITIALIZE BUTTON */}
                <div className="relative group mt-2">
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-amber-500 to-cyan-500 rounded-2xl blur-md opacity-60 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse" />
                  
                  <button
                    type="submit"
                    className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-white font-bold py-4 rounded-xl text-sm uppercase tracking-[0.25em] relative z-10 transition-all flex items-center justify-center gap-2 group-active:scale-[0.98] cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-yellow-400 animate-bounce" />
                    BOOT SENTINEL OS
                  </button>
                </div>

                {/* Diagnostics and logs */}
                <div className="flex justify-between items-center text-[9px] text-slate-500">
                  <button 
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setShowEasterEgg(!showEasterEgg);
                    }}
                    className="hover:text-orange-400 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Terminal className="w-3 h-3" /> System Diagnostics
                  </button>
                  <span className="uppercase">
                    SAMMIUM QUANTUM SHIELD ACTIVE
                  </span>
                </div>

                {showEasterEgg && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3.5 bg-slate-950/90 rounded-xl border border-dashed border-slate-800 text-[10px] text-slate-450 leading-relaxed flex flex-col gap-1.5"
                  >
                    <span className="text-orange-400 font-bold">🧪 Dr. Sammium Research Diary:</span>
                    <p>
                      "Welcome to Sentinel OS. Our platform merges boid flight physics, multi-agent AI cores, and Digital Twin satellites into a single container running behind Nginx. All channels output cleanly on Port 3000."
                    </p>
                  </motion.div>
                )}

              </form>
            </div>

            {/* Bottom brand tagline */}
            <div className="text-center mt-6 text-[10px] text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
              <Shield className="w-3.5 h-3.5 text-slate-500" />
              <span>SENTINEL AI AUTHENTICATION PLATFORM</span>
            </div>

          </motion.div>
        )}

        {status === "linking" && (
          <motion.div
            key="sentinel-boot-sequence"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-[99999]"
          >
            {/* DEEP INTERSTELLAR NEURAL DIVE TUNNEL */}
            <div className="absolute inset-0 overflow-hidden bg-black flex items-center justify-center">
              
              {/* Rotating radar grids */}
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute w-[900px] h-[900px] rounded-full border border-orange-500/5 flex items-center justify-center opacity-30 pointer-events-none"
              >
                {Array.from({ length: 12 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="absolute w-full h-[1px] bg-orange-500/10"
                    style={{ transform: `rotate(${idx * 15}deg)` }}
                  />
                ))}
              </motion.div>

              <motion.div
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute w-[600px] h-[600px] rounded-full border border-dashed border-cyan-500/10 pointer-events-none"
              />

              {/* Pulsing circular tunnel rings */}
              {Array.from({ length: 8 }).map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0, opacity: 0.05 }}
                  animate={{ 
                    scale: [0, 4.5], 
                    opacity: [0, 0.7, 0] 
                  }}
                  transition={{ 
                    duration: 1.8, 
                    repeat: Infinity, 
                    delay: idx * 0.22,
                    ease: "easeOut"
                  }}
                  className="absolute w-44 h-44 rounded-full border border-dashed border-orange-400/30"
                  style={{
                    boxShadow: "0 0 45px rgba(249, 115, 22, 0.08)"
                  }}
                />
              ))}

              {/* Radial speed rays shooting outward */}
              {tunnelRays.map((ray) => (
                <div
                  key={ray.id}
                  className="absolute left-1/2 top-1/2 pointer-events-none"
                  style={{
                    transform: `rotate(${ray.angle}deg)`,
                    transformOrigin: "left center",
                  }}
                >
                  <motion.div
                    initial={{ x: 20, width: 0, opacity: 0 }}
                    animate={{
                      x: [20, ray.maxRadius],
                      width: [10, ray.width, 30],
                      opacity: [0, 1, 0.85, 0],
                    }}
                    transition={{
                      duration: ray.duration,
                      delay: ray.delay,
                      repeat: Infinity,
                      ease: "easeIn",
                    }}
                    className={`rounded-full ${ray.colorClass}`}
                    style={{
                      height: `${ray.height}px`,
                      boxShadow: `0 0 14px ${ray.shadowColor}, 0 0 5px #fff`,
                    }}
                  />
                </div>
              ))}

              {/* Neon geometric core */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="w-80 h-80 rounded-full border border-orange-500/20 flex items-center justify-center border-dashed relative"
              >
                <div className="absolute w-64 h-64 rounded-full border border-cyan-500/20 border-dotted animate-spin-slow" />
                <div className="absolute w-52 h-52 rounded-full border border-orange-500/25" />
                <div className="absolute w-36 h-36 rounded-full border border-dashed border-amber-500/15 animate-pulse" />
              </motion.div>

            </div>

            {/* Neural Diagnostics HUD overlay */}
            <div className="relative z-10 w-full max-w-lg px-6 flex flex-col gap-6 text-center">
              
              <div className="flex flex-col gap-2">
                <motion.h2 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: [1, 1.05, 1], opacity: 1 }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
                  className="text-3xl md:text-4xl font-black tracking-[0.2em] text-white select-none drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] uppercase pl-[0.2em]"
                >
                  BOOTING SENTINEL
                </motion.h2>
                <span className="text-xs font-bold text-orange-400 tracking-widest uppercase">
                  SAMMIUM LABS COGNITIVE OS LOAD
                </span>
              </div>

              {/* Progress Terminal */}
              <div className="bg-slate-900/90 border border-slate-850 rounded-2xl p-4 text-left text-[10px] text-slate-300 max-h-[160px] overflow-y-auto flex flex-col gap-1 shadow-2xl relative">
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[8px] text-slate-500">LIVE PROCESSOR LOGS</span>
                </div>
                {sysLog.map((log, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-orange-500 font-bold">&gt;&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="flex flex-col gap-1 text-center">
                <span className="text-[10px] text-orange-400 tracking-wider uppercase animate-pulse">
                  {progressText || "COGNITIVE SYNAPSE LOADING..."}
                </span>
                <div className="w-48 h-1 bg-slate-950 rounded-full mx-auto overflow-hidden border border-slate-900">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.6, ease: "linear" }}
                    className="h-full bg-gradient-to-r from-orange-500 to-cyan-500"
                  />
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            key="sentinel-ai-authentication"
            className="fixed inset-0 z-[999999] overflow-hidden flex items-center justify-center bg-slate-950"
          >
            {/* BIOMETRIC IRIS & NEURAL SCANNER SCAN LINE */}
            <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
              {/* Vertical Sweep Laser line */}
              <motion.div 
                initial={{ y: "-100%" }}
                animate={{ y: "100%" }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-1 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,1)] absolute inset-x-0"
              />
              
              {/* Floating Camera Aperture Corner Frames */}
              <div className="w-[340px] h-[340px] border border-cyan-500/20 rounded-3xl relative flex items-center justify-center">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400" />
                
                {/* Micro scanning widgets */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-slate-900 px-3 py-1 border border-cyan-500/30 text-[8px] text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 animate-pulse" />
                  <span>BIOMETRIC CAMERA FEED RETRIEVED</span>
                </div>

                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900 px-3 py-1 border border-orange-500/30 text-[8px] text-orange-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Fingerprint className="w-3.5 h-3.5 text-orange-400 animate-spin-slow" />
                  <span>NEURAL RESONANCE DETECTED</span>
                </div>
              </div>
            </div>

            {/* Success Hologram Content */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ 
                scale: [0.85, 1.03, 1], 
                opacity: [0, 1, 1],
                y: [10, 0, 0] 
              }}
              exit={{ scale: 1.15, opacity: 0 }}
              transition={{ duration: 0.85, times: [0, 0.7, 1] }}
              className="text-white text-center flex flex-col items-center gap-4 relative z-30 px-6"
            >
              {/* Circular Radar Hologram */}
              <div className="relative flex items-center justify-center">
                <motion.div 
                  animate={{ scale: [1, 1.45, 1], opacity: [0.3, 0.08, 0.3] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="absolute w-28 h-28 rounded-full border border-orange-400"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
                  className="absolute w-24 h-24 rounded-full border border-dashed border-cyan-500/40"
                />
                <div className="w-16 h-16 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shadow-xl">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-pulse" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-black tracking-[0.2em] text-white uppercase drop-shadow-[0_0_12px_rgba(255,255,255,0.45)] pl-[0.2em]">
                  AUTH GRANTED
                </h2>
                <div className="text-[10px] text-orange-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin-slow" />
                  <span>WELCOMING TO SENTINEL COGNITION</span>
                </div>
              </div>

              {/* Status badge */}
              <div className="mt-4 px-4 py-2.5 rounded-xl bg-slate-950/95 border border-slate-800 text-[10px] text-slate-400 max-w-sm flex flex-col gap-1 shadow-inner">
                <span className="text-slate-300 font-bold">OPERATOR IDENTITY GRANTED</span>
                <span className="text-emerald-400 uppercase tracking-widest font-bold">
                  {username} // SECURITY LEVEL ALPHA
                </span>
              </div>
            </motion.div>

            {/* Shutter Wipe - Top Panel */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: "-100%" }}
              transition={{ delay: 3.4, duration: 0.95, ease: [0.77, 0, 0.175, 1] }}
              className="absolute top-0 left-0 w-full h-1/2 bg-slate-900 border-b border-orange-500/30 flex flex-col justify-end p-6 z-40 shadow-[0_5px_35px_rgba(249,115,22,0.2)]"
            >
              <div className="flex justify-between items-center text-[10px] text-orange-500/60 uppercase tracking-widest max-w-7xl mx-auto w-full mb-3">
                <span>SYSTEM LINKAGE: ACTIVE</span>
                <span>SECURE INGRESS ON PORT 3000 // QUANTUM CORE</span>
              </div>
              <div className="h-0.5 w-full bg-gradient-to-r from-orange-500/10 via-orange-500/50 to-cyan-500/10" />
            </motion.div>

            {/* Shutter Wipe - Bottom Panel */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: "100%" }}
              transition={{ delay: 3.4, duration: 0.95, ease: [0.77, 0, 0.175, 1] }}
              className="absolute bottom-0 left-0 w-full h-1/2 bg-slate-900 border-t border-cyan-500/30 p-6 z-40 shadow-[0_-5px_35px_rgba(34,211,238,0.2)]"
            >
              <div className="h-0.5 w-full bg-gradient-to-r from-orange-500/10 via-cyan-500/50 to-cyan-500/10 mb-3" />
              <div className="flex justify-between items-center text-[10px] text-cyan-500/60 uppercase tracking-widest max-w-7xl mx-auto w-full">
                <span>CHIEF OPERATOR: {username}</span>
                <span>SENTINEL COGNITIVE KERNEL: DEPLOYED</span>
              </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

