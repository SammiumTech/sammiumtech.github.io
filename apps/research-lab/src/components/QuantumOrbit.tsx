import React, { useRef, useEffect, useState } from "react";
import { Play, Pause, RotateCcw, Orbit, Info, Radio, Zap } from "lucide-react";
import { sounds } from "../utils/sounds";
import { PhysicsParticle, GravityWell } from "../types";

interface QuantumOrbitProps {
  isRgbOverdrive: boolean;
}

export const QuantumOrbit: React.FC<QuantumOrbitProps> = ({ isRgbOverdrive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gravityG, setGravityG] = useState(0.15);
  const [singularityMass, setSingularityMass] = useState(1200);
  const [initialLaunchVelocity, setInitialLaunchVelocity] = useState(4.2);
  const [particleMass, setParticleMass] = useState(1);
  const [trailOpacity, setTrailOpacity] = useState(0.12);
  const [isPlaying, setIsPlaying] = useState(true);

  // Core physics arrays
  const [particles, setParticles] = useState<PhysicsParticle[]>([]);
  const [wells, setWells] = useState<GravityWell[]>([
    { x: 320, y: 190, mass: 1200, radius: 14 }, // Central Singularity
  ]);

  const stateRef = useRef({
    particles: [] as PhysicsParticle[],
    wells: [] as GravityWell[],
    gravityG,
    singularityMass,
    initialLaunchVelocity,
    particleMass,
    trailOpacity,
    isPlaying,
  });

  useEffect(() => {
    stateRef.current = {
      particles,
      wells,
      gravityG,
      singularityMass,
      initialLaunchVelocity,
      particleMass,
      trailOpacity,
      isPlaying,
    };
  }, [particles, wells, gravityG, singularityMass, initialLaunchVelocity, particleMass, trailOpacity, isPlaying]);

  // Seed initial particles in stable Keplerian orbits
  const initSimulation = () => {
    sounds.playSingularity();
    const center = { x: 320, y: 190 };
    const numParticles = 24;
    const seeded: PhysicsParticle[] = [];

    for (let i = 0; i < numParticles; i++) {
      // Calculate random distance from center well
      const radius = 60 + Math.random() * 110;
      const angle = (i * (Math.PI * 2)) / numParticles + (Math.random() - 0.5) * 0.4;
      
      const px = center.x + Math.cos(angle) * radius;
      const py = center.y + Math.sin(angle) * radius;

      // Keplerian velocity approximation: v = sqrt(G * M / r)
      const speed = Math.sqrt((gravityG * singularityMass) / radius) * (0.95 + Math.random() * 0.1);
      
      // Velocity vector perpendicular to radial position vector
      const vx = -Math.sin(angle) * speed;
      const vy = Math.cos(angle) * speed;

      const hue = (i * 15) % 360;

      seeded.push({
        x: px,
        y: py,
        vx,
        vy,
        color: `hsl(${hue}, 100%, 60%)`,
        size: 3 + Math.random() * 3,
        history: [],
        mass: particleMass,
      });
    }

    setParticles(seeded);
  };

  useEffect(() => {
    initSimulation();
  }, [gravityG]);

  // Click on canvas launches a particle or places an attractor depending on modifier keys
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    sounds.playLaser();
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Check if clicked near current well to dissolve, else launch particle pointing towards center well
    const center = wells[0] || { x: 320, y: 190, radius: 14 };
    const distToCenter = Math.hypot(clickX - center.x, clickY - center.y);
    
    if (distToCenter < 25) {
      // Shift singularity position
      setWells([{ ...center, x: clickX, y: clickY, mass: singularityMass, radius: center.radius }]);
      return;
    }

    // Launch a pair of quantum particles orbiting the attractor
    const angle = Math.atan2(clickY - center.y, clickX - center.x);
    // Perpendicular velocity direction
    const launchSpeed = initialLaunchVelocity;
    const vx = -Math.sin(angle) * launchSpeed;
    const vy = Math.cos(angle) * launchSpeed;

    const randomHue = Math.floor(Math.random() * 360);

    const newParticle: PhysicsParticle = {
      x: clickX,
      y: clickY,
      vx,
      vy,
      color: `hsl(${randomHue}, 100%, 65%)`,
      size: 4 + Math.random() * 3,
      history: [],
      mass: particleMass,
    };

    setParticles([...particles, newParticle]);
  };

  // Main high-fidelity canvas simulation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const updateFrame = () => {
      const current = stateRef.current;
      if (!current.isPlaying) {
        animationId = requestAnimationFrame(updateFrame);
        return;
      }

      const width = canvas.width;
      const height = canvas.height;

      // Draw starry galaxy dark overlay with custom decay trailing
      ctx.fillStyle = `rgba(11, 10, 24, ${current.trailOpacity})`;
      ctx.fillRect(0, 0, width, height);

      // Star field micro-background
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      for (let i = 0; i < 5; i++) {
        const sx = (Math.sin(Date.now() + i * 500) * 0.5 + 0.5) * width;
        const sy = (Math.cos(Date.now() + i * 900) * 0.5 + 0.5) * height;
        ctx.fillRect(sx, sy, 1.2, 1.2);
      }

      // Draw Gravity Wells (Singularities)
      current.wells.forEach((well) => {
        const pulse = Math.sin(Date.now() / 120) * 5;
        const radialGlow = ctx.createRadialGradient(
          well.x,
          well.y,
          well.radius / 3,
          well.x,
          well.y,
          well.radius + 35 + pulse
        );
        radialGlow.addColorStop(0, "rgba(168, 85, 247, 1)"); // Bright Violet Singularity
        radialGlow.addColorStop(0.3, "rgba(236, 72, 153, 0.4)"); // Hot pink ring
        radialGlow.addColorStop(0.7, "rgba(6, 182, 212, 0.1)");  // Cyan outer corona
        radialGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = radialGlow;
        ctx.beginPath();
        ctx.arc(well.x, well.y, well.radius + 35 + pulse, 0, Math.PI * 2);
        ctx.fill();

        // Singularity core (Absence of light - Black hole core with neon ring)
        ctx.fillStyle = "#020617";
        ctx.beginPath();
        ctx.arc(well.x, well.y, well.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = isRgbOverdrive ? "#06b6d4" : "#a855f7";
        ctx.lineWidth = 3;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(well.x, well.y, well.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow
      });

      // Update and Draw Orbiting Particles
      const activeParticles = current.particles.map((p) => {
        let totalAx = 0;
        let totalAy = 0;

        // Calculate gravity vectors from each attractor well (F = G * M1 * M2 / r^2)
        current.wells.forEach((well) => {
          const dx = well.x - p.x;
          const dy = well.y - p.y;
          const distSq = dx * dx + dy * dy + 100; // Adding softening factor to prevent infinite speeds
          const dist = Math.sqrt(distSq);

          // Force strength
          const force = (current.gravityG * well.mass) / distSq;
          
          // Acceleration vectors
          totalAx += (dx / dist) * force;
          totalAy += (dy / dist) * force;
        });

        // Apply acceleration to velocity
        const nextVx = p.vx + totalAx;
        const nextVy = p.vy + totalAy;

        // Apply velocity to coordinates
        const nextX = p.x + nextVx;
        const nextY = p.y + nextVy;

        // Record orbital history path
        const nextHistory = [...p.history, { x: p.x, y: p.y }].slice(-25);

        // Draw particle trail paths
        ctx.beginPath();
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.45;
        if (nextHistory.length > 1) {
          ctx.moveTo(nextHistory[0].x, nextHistory[0].y);
          for (let i = 1; i < nextHistory.length; i++) {
            ctx.lineTo(nextHistory[i].x, nextHistory[i].y);
          }
          ctx.stroke();
        }
        ctx.globalAlpha = 1.0;

        // Draw Particle Core
        ctx.fillStyle = isRgbOverdrive 
          ? `hsl(${(Date.now() / 20 + p.x) % 360}, 100%, 65%)` 
          : p.color;
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = isRgbOverdrive ? 12 : 5;
        
        ctx.beginPath();
        ctx.arc(nextX, nextY, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset

        return {
          ...p,
          x: nextX,
          y: nextY,
          vx: nextVx,
          vy: nextVy,
          history: nextHistory,
        };
      }).filter((p) => {
        // Filter out particles that dive directly into the black hole center
        let escaped = true;
        current.wells.forEach((well) => {
          const dist = Math.hypot(well.x - p.x, well.y - p.y);
          if (dist < well.radius + 2) {
            escaped = false;
            sounds.playLaser(); // trigger short implosion sound
          }
        });

        // Dissolve if way out of scope bounds
        if (p.x < -100 || p.x > width + 100 || p.y < -100 || p.y > height + 100) {
          escaped = false;
        }

        return escaped;
      });

      // Commit update to ref
      stateRef.current.particles = activeParticles;
      animationId = requestAnimationFrame(updateFrame);
    };

    animationId = requestAnimationFrame(updateFrame);
    return () => cancelAnimationFrame(animationId);
  }, [isRgbOverdrive]);

  return (
    <div id="quantum-orbit-station" className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* Gravity Sandbox Viewport */}
      <div className="xl:col-span-8 flex flex-col gap-3">
        <div className={`relative rounded-xl border bg-slate-950 overflow-hidden shadow-2xl transition-all duration-300 ${
          isRgbOverdrive 
            ? "border-pink-500/50 shadow-[0_0_20px_rgba(244,63,94,0.15)]" 
            : "border-slate-800"
        }`}>
          {/* Top telemetry bar overlay */}
          <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-lg border border-slate-800/80">
            <div className="flex items-center gap-2">
              <Orbit className="w-4 h-4 text-purple-400 animate-spin-slow" />
              <span className="text-[10px] font-mono font-bold tracking-wider text-slate-300 uppercase">
                GRAVITY SINGULARITY REACTOR // {particles.length} ORBITING MATRIXES
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsPlaying(!isPlaying);
                }}
                className="p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-purple-500 text-slate-300 transition-colors hover:text-purple-400"
                title={isPlaying ? "Pause Orbit Mechanics" : "Resume Orbit Mechanics"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={initSimulation}
                className="p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-cyan-400 text-slate-300 transition-colors hover:text-cyan-400"
                title="Reset Cosmic Decays"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Canvas Viewport */}
          <canvas
            ref={canvasRef}
            width={640}
            height={380}
            onClick={handleCanvasClick}
            className="w-full bg-[#0a0712] block cursor-crosshair"
            style={{ maxHeight: "380px" }}
          />

          {/* Interactive footer overlay info */}
          <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded border border-slate-800 text-[9px] font-mono text-slate-400 flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>Click to spawn planetary bodies. Click near center to warp the gravity singularity.</span>
          </div>
        </div>
      </div>

      {/* Physics Factor Calibration */}
      <div className="xl:col-span-4 flex flex-col gap-4">
        <div className={`p-4 rounded-xl border bg-slate-900/95 shadow-md relative transition-all duration-300 ${
          isRgbOverdrive ? "border-purple-glow" : "border-slate-800"
        }`}>
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400 mb-3.5 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-purple-400" /> [ GRAVITATIONAL_WAVE_CALIBRATORS ]
          </h3>

          <div className="flex flex-col gap-4">
            {/* Singularity mass scale */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                <span>SINGULARITY MASS INERTIA</span>
                <span className="text-purple-400 font-bold">{singularityMass} EXATONS</span>
              </div>
              <input
                type="range"
                min="400"
                max="3000"
                step="100"
                value={singularityMass}
                onChange={(e) => {
                  sounds.playHover();
                  const m = parseInt(e.target.value);
                  setSingularityMass(m);
                  setWells(wells.map((w) => ({ ...w, mass: m })));
                }}
                className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
              />
            </div>

            {/* Solar constant constant */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                <span>UNIVERSAL GRAVITY CONSTANT (G)</span>
                <span className="text-pink-400 font-bold">{gravityG.toFixed(3)} G-UNITS</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.02"
                value={gravityG}
                onChange={(e) => {
                  sounds.playHover();
                  setGravityG(parseFloat(e.target.value));
                }}
                className="w-full accent-pink-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
              />
            </div>

            {/* Launch velocity vector scale */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                <span>LAUNCH SPEED (PLANETARY THRUST)</span>
                <span className="text-cyan-400 font-bold">{initialLaunchVelocity.toFixed(1)} KM/S</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="8.0"
                step="0.5"
                value={initialLaunchVelocity}
                onChange={(e) => {
                  sounds.playHover();
                  setInitialLaunchVelocity(parseFloat(e.target.value));
                }}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
              />
            </div>

            {/* Orbital history decay tracker */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                <span>COSMIC SPACE DECAY SPEED</span>
                <span className="text-amber-400 font-bold">{((1 - trailOpacity) * 100).toFixed(0)}% RATE</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.4"
                step="0.02"
                value={trailOpacity}
                onChange={(e) => {
                  sounds.playHover();
                  setTrailOpacity(parseFloat(e.target.value));
                }}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
              />
            </div>

            {/* Informational telemetry alerts */}
            <div className="mt-2.5 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex gap-2.5">
              <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div className="text-[9px] font-mono text-slate-400 leading-relaxed">
                Planets coordinate trajectories using real Newton calculations. If a planet ventures inside the purple singularity core, it is dissolved into raw ambient space energy.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
