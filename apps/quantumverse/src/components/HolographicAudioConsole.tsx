import React, { useEffect, useRef, useState } from "react";
import { 
  Volume2, VolumeX, Sliders, Navigation, Radio, Play, 
  HelpCircle, Sparkles, Orbit, Waves, ShieldAlert, Cpu
} from "lucide-react";
import { audioService } from "../utils/audioService";

export default function HolographicAudioConsole() {
  const [soundOn, setSoundOn] = useState(audioService.isEnabled());
  const [masterVol, setMasterVol] = useState(audioService.getMasterVolume());
  const [ambientVol, setAmbientVol] = useState(audioService.getAmbientVolume());
  const [sfxVol, setSfxVol] = useState(audioService.getSFXVolume());
  const [narrationVol, setNarrationVol] = useState(audioService.getNarrationVolume());
  const [spatialOn, setSpatialOn] = useState(audioService.isSpatialEnabled());
  const [activeEnv, setActiveEnv] = useState(audioService.getActiveEnvironment());
  
  // Coordinates for the 2D spatial panner radar grid
  const [panPos, setPanPos] = useState({ x: 0.0, y: 0.0 });
  const radarRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sync state with audioService properties periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSoundOn(audioService.isEnabled());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Live Audio Analyzer spectrum loop
  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 320;
    canvas.height = 70;

    // Buffer to retrieve analyser byte frequency data
    const bufferLength = 128;
    const dataArray = new Uint8Array(bufferLength);

    const drawSpectrum = () => {
      animationId = requestAnimationFrame(drawSpectrum);

      ctx.fillStyle = "rgba(5, 8, 22, 0.2)"; // Trailing effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!soundOn || !audioService.analyserNode) {
        // Draw flat idle digital grid lines if sound is muted
        ctx.strokeStyle = "rgba(0, 243, 255, 0.05)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < canvas.width; i += 15) {
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
        }
        ctx.stroke();

        // Soft center line
        ctx.strokeStyle = "rgba(0, 243, 255, 0.2)";
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        return;
      }

      // Retrieve actual real-time frequency data from the synthesizer!
      audioService.analyserNode.getByteFrequencyData(dataArray);

      // Render futuristic double symmetrical holographic equalizer bars
      const barWidth = (canvas.width / (bufferLength / 2)) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength / 2; i++) {
        const value = dataArray[i];
        const percent = value / 255;
        const barHeight = percent * canvas.height * 0.9;

        // Custom gradient for frequency bands representing quantum photon spectrum
        const grad = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
        if (activeEnv === "blackhole") {
          grad.addColorStop(0, "rgba(139, 92, 246, 0.2)");
          grad.addColorStop(1, "rgba(167, 139, 250, 0.8)");
        } else if (activeEnv === "quantum") {
          grad.addColorStop(0, "rgba(16, 185, 129, 0.2)");
          grad.addColorStop(1, "rgba(52, 211, 153, 0.8)");
        } else if (activeEnv === "solarsystem") {
          grad.addColorStop(0, "rgba(245, 158, 11, 0.2)");
          grad.addColorStop(1, "rgba(251, 191, 36, 0.8)");
        } else {
          grad.addColorStop(0, "rgba(6, 182, 212, 0.2)");
          grad.addColorStop(1, "rgba(34, 211, 238, 0.8)");
        }

        ctx.fillStyle = grad;
        // Symmetrical display
        ctx.fillRect(canvas.width / 2 + x, canvas.height - barHeight, barWidth - 1, barHeight);
        ctx.fillRect(canvas.width / 2 - x - barWidth, canvas.height - barHeight, barWidth - 1, barHeight);

        x += barWidth;
      }

      // Draw horizontal reference lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.25); ctx.lineTo(canvas.width, canvas.height * 0.25);
      ctx.moveTo(0, canvas.height * 0.5);  ctx.lineTo(canvas.width, canvas.height * 0.5);
      ctx.moveTo(0, canvas.height * 0.75); ctx.lineTo(canvas.width, canvas.height * 0.75);
      ctx.stroke();
    };

    drawSpectrum();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [soundOn, activeEnv]);

  // Coordinate Radar Interactions
  const handleRadarMove = (clientX: number, clientY: number) => {
    const radar = radarRef.current;
    if (!radar) return;
    const rect = radar.getBoundingClientRect();
    
    // Convert to relative coordinates inside the radar box (-1.0 to 1.0)
    const relativeX = ((clientX - rect.left) / rect.width) * 2.0 - 1.0;
    const relativeY = -(((clientY - rect.top) / rect.height) * 2.0 - 1.0); // flip Y axis

    const clampedX = Math.max(-1.0, Math.min(1.0, relativeX));
    const clampedY = Math.max(-1.0, Math.min(1.0, relativeY));

    setPanPos({ x: clampedX, y: clampedY });
    audioService.updateSpatialPanning(clampedX, clampedY);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    handleRadarMove(e.clientX, e.clientY);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDraggingRef.current = false;
    };
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        handleRadarMove(e.clientX, e.clientY);
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("mousemove", handleGlobalMouseMove);

    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, []);

  const handleToggleSound = () => {
    const target = !soundOn;
    audioService.setSoundEnabled(target);
    setSoundOn(target);
    audioService.playClick("pulse");
  };

  const handleEnvChange = (env: "galaxy" | "blackhole" | "quantum" | "solarsystem" | "evolution") => {
    setActiveEnv(env);
    audioService.setEnvironment(env);
    audioService.playClick("confirm");
    audioService.playCalibration("wave");
  };

  const triggerVoiceCalibration = () => {
    audioService.playClick("tap");
    audioService.speak(
      `Quantum observatory soundscapes aligned. Active environment set to ${
        activeEnv === "galaxy" ? "Galaxy Laboratory" :
        activeEnv === "blackhole" ? "Black Hole accretion disk" :
        activeEnv === "quantum" ? "Quantum Interference grid" :
        activeEnv === "solarsystem" ? "Solar System electromagnetics" :
        "Cosmic Evolution engine"
      }. Core spatial coherence is optimal.`
    );
  };

  return (
    <div className="glass-panel rounded-xl border border-white/10 p-5 space-y-5 relative overflow-hidden text-left" id="audio-console">
      {/* Background neon glows representing resonance fields */}
      <div className={`absolute top-0 right-0 w-28 h-28 rounded-full blur-3xl -z-10 transition-colors duration-1000 ${
        activeEnv === "galaxy" ? "bg-cyan-500/10" :
        activeEnv === "blackhole" ? "bg-violet-500/10" :
        activeEnv === "quantum" ? "bg-emerald-500/10" :
        activeEnv === "solarsystem" ? "bg-amber-500/10" :
        "bg-fuchsia-500/10"
      }`}></div>

      {/* Title block with Sound on/off Indicator */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-cyan-glow animate-pulse" />
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">Quantum Soundscape</h3>
            <p className="text-[9px] font-mono text-slate-400">ACOUSTIC SYNTHESIZER V2.5</p>
          </div>
        </div>

        <button
          onClick={handleToggleSound}
          className={`py-1 px-3 text-[10px] font-mono rounded border font-bold transition-all flex items-center space-x-1 ${
            soundOn 
              ? "bg-cyan-glow/15 border-cyan-glow/40 text-cyan-glow shadow-[0_0_10px_rgba(0,243,255,0.15)]" 
              : "bg-transparent border-slate-700 text-slate-500 hover:text-slate-300"
          }`}
        >
          {soundOn ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-ping mr-1"></span>
              <span>SYNTH ACTIVE</span>
            </>
          ) : (
            <span>MUTED</span>
          )}
        </button>
      </div>

      {/* Dynamic Spectrum Equalizer Canvas */}
      <div className="space-y-1 bg-slate-950/80 rounded-lg p-2 border border-white/5 relative overflow-hidden">
        <div className="flex justify-between items-center px-1 text-[9px] font-mono text-slate-500">
          <span>SPECTRUM ANALYZER (Hertz)</span>
          <span className="text-cyan-glow font-semibold">{soundOn ? "PROURAL DATA STREAM" : "OFFLINE"}</span>
        </div>
        <div className="h-[70px] w-full flex items-center justify-center rounded overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
      </div>

      {/* Environment selector (3D Ambient Layers) */}
      <div className="space-y-2">
        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center">
          <Orbit className="w-3 h-3 text-cyan-glow mr-1.5" /> 1. Selected Observatory Environment
        </label>
        
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: "galaxy", name: "Galaxy Lab", desc: "Cosmic deep pads", color: "hover:border-cyan-glow text-cyan-glow" },
            { id: "blackhole", name: "Black Hole", desc: "Sub-bass gravitational warp", color: "hover:border-violet-glow text-violet-glow" },
            { id: "quantum", name: "Quantum Lab", desc: "Superposition shimmers", color: "hover:border-emerald-glow text-emerald-400" },
            { id: "solarsystem", name: "Solar System", desc: "Electromagnetic orbital sweep", color: "hover:border-amber-glow text-amber-400" },
            { id: "evolution", name: "Cosmic Engine", desc: "Orchestral universe expansion", color: "hover:border-fuchsia-glow text-fuchsia-400" }
          ].map((env) => {
            const isSelected = activeEnv === env.id;
            return (
              <button
                key={env.id}
                onClick={() => handleEnvChange(env.id as any)}
                disabled={!soundOn}
                className={`p-2 rounded-lg border text-left transition-all relative overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed ${
                  isSelected 
                    ? "bg-white/5 border-white/30 text-white shadow-[0_2px_8px_rgba(255,255,255,0.05)]" 
                    : "bg-slate-950/50 border-white/5 text-slate-400 hover:bg-white/[0.02]"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-cyan-glow"></span>
                )}
                <span className={`text-[11px] font-display font-bold block ${isSelected ? "text-white" : "group-hover:text-white"}`}>{env.name}</span>
                <span className="text-[8px] font-mono text-slate-500 block truncate mt-0.5">{env.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D Positional Spatial Audio Coordinate radar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center">
            <Navigation className="w-3 h-3 text-cyan-glow mr-1.5" /> 2. Immersive 3D Spatial Radar
          </label>
          
          <button
            onClick={() => {
              const target = !spatialOn;
              audioService.setSpatialEnabled(target);
              setSpatialOn(target);
              audioService.playClick("tap");
            }}
            disabled={!soundOn}
            className={`text-[8px] font-mono border px-1.5 py-0.5 rounded transition-colors ${
              spatialOn ? "border-cyan-glow/40 text-cyan-glow bg-cyan-glow/5" : "border-slate-800 text-slate-500"
            }`}
          >
            {spatialOn ? "SPATIAL COUPLING ON" : "SPATIAL COUPLING OFF"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          {/* 2D Drag-and-Drop Radar Frame */}
          <div className="md:col-span-2 relative">
            <div 
              ref={radarRef}
              onMouseDown={handleMouseDown}
              className={`h-28 bg-slate-950/90 border border-white/10 rounded-lg relative overflow-hidden cursor-crosshair flex items-center justify-center ${
                !soundOn && "opacity-40 pointer-events-none"
              }`}
            >
              {/* Radar concentric circular grid rings */}
              <div className="absolute w-24 h-24 rounded-full border border-white/[0.03] pointer-events-none"></div>
              <div className="absolute w-16 h-16 rounded-full border border-white/[0.03] pointer-events-none"></div>
              <div className="absolute w-8 h-8 rounded-full border border-white/[0.03] pointer-events-none"></div>

              {/* Radar Crosshairs */}
              <div className="absolute left-0 right-0 h-[1px] bg-white/[0.04] pointer-events-none"></div>
              <div className="absolute top-0 bottom-0 w-[1px] bg-white/[0.04] pointer-events-none"></div>

              {/* Glowing Dynamic Panned Source Node */}
              <div 
                className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full flex items-center justify-center transition-transform hover:scale-125"
                style={{
                  left: `${(panPos.x + 1.0) * 50}%`,
                  top: `${(-panPos.y + 1.0) * 50}%`,
                }}
              >
                <span className="absolute inset-0 bg-cyan-glow/40 rounded-full animate-ping"></span>
                <span className="w-2.5 h-2.5 bg-cyan-glow rounded-full shadow-[0_0_8px_#00f3ff]"></span>
              </div>
            </div>
            {/* Info overlays */}
            <div className="absolute bottom-1 right-2 text-[8px] font-mono text-slate-500 pointer-events-none">
              {panPos.x > 0 ? `Right: ${Math.round(panPos.x * 100)}%` : panPos.x < 0 ? `Left: ${Math.round(Math.abs(panPos.x) * 100)}%` : "Center"}
            </div>
          </div>

          {/* Coordinates and description */}
          <div className="space-y-2 text-xs font-mono text-slate-400 bg-slate-950/40 p-2.5 rounded border border-white/5 h-28 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[9px] text-slate-500 block uppercase font-bold">Vector Coordinates</span>
              <div className="grid grid-cols-2 gap-1 text-[10px]">
                <div>X: <span className="text-cyan-glow font-bold">{panPos.x.toFixed(2)}</span></div>
                <div>Y: <span className="text-violet-glow font-bold">{panPos.y.toFixed(2)}</span></div>
              </div>
            </div>
            <p className="text-[8px] leading-relaxed text-slate-500 italic">
              Drag node to dynamically pan sound left/right and attenuate volume based on relative distance.
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Mixer Sliders */}
      <div className="space-y-2.5">
        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center">
          <Sliders className="w-3 h-3 text-cyan-glow mr-1.5" /> 3. Synthesizer Console Mixer
        </label>

        <div className="space-y-2 bg-slate-950/30 p-3 rounded-lg border border-white/5">
          {/* Master Volume */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-slate-300">Master Level</span>
              <span className="text-cyan-glow font-bold">{Math.round(masterVol * 100)}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={masterVol}
              disabled={!soundOn}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setMasterVol(val);
                audioService.setMasterVolume(val);
              }}
              className="w-full accent-cyan-glow bg-slate-950 h-1 rounded cursor-pointer disabled:opacity-30"
            />
          </div>

          {/* Ambient Volume */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-slate-300">Ambient Drone</span>
              <span className="text-violet-glow font-bold">{Math.round(ambientVol * 100)}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={ambientVol}
              disabled={!soundOn}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setAmbientVol(val);
                audioService.setAmbientVolume(val);
              }}
              className="w-full accent-violet-glow bg-slate-950 h-1 rounded cursor-pointer disabled:opacity-30"
            />
          </div>

          {/* SFX Volume */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-slate-300">Interaction feedback (SFX)</span>
              <span className="text-emerald-400 font-bold">{Math.round(sfxVol * 100)}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={sfxVol}
              disabled={!soundOn}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setSfxVol(val);
                audioService.setSFXVolume(val);
              }}
              className="w-full accent-emerald-400 bg-slate-950 h-1 rounded cursor-pointer disabled:opacity-30"
            />
          </div>

          {/* Narration Volume */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-slate-300">AI Vocal Narration</span>
              <span className="text-amber-400 font-bold">{Math.round(narrationVol * 100)}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={narrationVol}
              disabled={!soundOn}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setNarrationVol(val);
                audioService.setNarrationVolume(val);
              }}
              className="w-full accent-amber-400 bg-slate-950 h-1 rounded cursor-pointer disabled:opacity-30"
            />
          </div>
        </div>
      </div>

      {/* Voice Assistant / Narration check */}
      <div className="flex items-center justify-between bg-cyan-950/20 border border-cyan-glow/10 rounded-lg p-2.5">
        <div className="space-y-0.5">
          <span className="text-[9px] font-mono text-cyan-glow uppercase tracking-wider flex items-center">
            <Radio className="w-3 h-3 text-cyan-glow mr-1 animate-pulse" /> vocal core calibration
          </span>
          <p className="text-[8px] font-mono text-slate-500">Test scientific narration feedback</p>
        </div>

        <button
          onClick={triggerVoiceCalibration}
          disabled={!soundOn}
          className="px-3 py-1.5 rounded bg-cyan-glow/10 border border-cyan-glow/20 hover:bg-cyan-glow/20 text-cyan-glow text-[9px] font-mono font-bold flex items-center space-x-1 transition-all disabled:opacity-30"
        >
          <Play className="w-2.5 h-2.5 fill-cyan-glow" />
          <span>TRIGGER TEST</span>
        </button>
      </div>
    </div>
  );
}
