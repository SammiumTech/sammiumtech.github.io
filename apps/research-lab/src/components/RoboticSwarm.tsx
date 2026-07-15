import React, { useRef, useEffect, useState } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  HelpCircle, 
  Activity, 
  Disc, 
  Zap,
  Cpu,
  Eye,
  Compass,
  Video,
  ArrowDown,
  Layers,
  Crosshair,
  Sparkles,
  TrendingUp,
  HardDrive
} from "lucide-react";
import { sounds } from "../utils/sounds";
import { RoboticsBoid, TargetSource } from "../types";

interface RoboticSwarmProps {
  isRgbOverdrive: boolean;
}

export const RoboticSwarm: React.FC<RoboticSwarmProps> = ({ isRgbOverdrive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [boidCount, setBoidCount] = useState(60);
  const [speedLimit, setSpeedLimit] = useState(3.5);
  const [separationForce, setSeparationForce] = useState(1.5);
  const [cohesionForce, setCohesionForce] = useState(1.0);
  const [alignmentForce, setAlignmentForce] = useState(1.0);
  const [trailLength, setTrailLength] = useState(8);
  const [rgbTrails, setRgbTrails] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  // Robotics Research Division states
  const [researchTab, setResearchTab] = useState<"sensors" | "movement" | "navigation">("sensors");
  const [blueprintSubsystem, setBlueprintSubsystem] = useState<"camera" | "sensors" | "movement" | "navigation">("camera");
  const [aiVisionTargetIndex, setAiVisionTargetIndex] = useState(0);
  const [simulatedCoords, setSimulatedCoords] = useState({ x: 120, y: 90, width: 45, height: 45 });
  const [telemetryTick, setTelemetryTick] = useState(0);

  // Simulation states
  const [boids, setBoids] = useState<RoboticsBoid[]>([]);
  const [beacons, setBeacons] = useState<TargetSource[]>([
    { x: 300, y: 180, energy: 100, radius: 15 },
  ]);

  // Keep references for animation loop to avoid dependency-related restarts
  const stateRef = useRef({
    boids: [] as RoboticsBoid[],
    beacons: [] as TargetSource[],
    speedLimit,
    separationForce,
    cohesionForce,
    alignmentForce,
    rgbTrails,
    isPlaying,
  });

  useEffect(() => {
    stateRef.current = {
      boids,
      beacons,
      speedLimit,
      separationForce,
      cohesionForce,
      alignmentForce,
      rgbTrails,
      isPlaying,
    };
  }, [boids, beacons, speedLimit, separationForce, cohesionForce, alignmentForce, rgbTrails, isPlaying]);

  // Initialize swarm
  const resetSwarm = () => {
    sounds.playSingularity();
    const width = canvasRef.current?.width || 600;
    const height = canvasRef.current?.height || 360;
    const newBoids: RoboticsBoid[] = Array.from({ length: boidCount }, (_, idx) => {
      const hue = (idx * (360 / boidCount)) % 360;
      return {
        id: idx,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speedLimit * 2,
        vy: (Math.random() - 0.5) * speedLimit * 2,
        energy: 100,
        chargeColor: `hsl(${hue}, 100%, 60%)`,
      };
    });
    setBoids(newBoids);
  };

  // Run initial reset
  useEffect(() => {
    resetSwarm();
  }, [boidCount]);

  // Robotics Division live simulation ticks
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetryTick(prev => prev + 1);

      // Randomly drift camera target coordinates to simulate active visual tracking scanning
      setSimulatedCoords(prev => {
        const driftX = (Math.random() - 0.5) * 12;
        const driftY = (Math.random() - 0.5) * 9;
        const nextX = Math.max(40, Math.min(180, prev.x + driftX));
        const nextY = Math.max(40, Math.min(120, prev.y + driftY));
        const nextW = Math.max(35, Math.min(55, prev.width + (Math.random() - 0.5) * 3));
        return { x: nextX, y: nextY, width: nextW, height: nextW };
      });
    }, 350);

    return () => clearInterval(timer);
  }, []);

  // Periodic target cycle (every 4 seconds, swap the target identified in camera)
  useEffect(() => {
    const targetTimer = setInterval(() => {
      setAiVisionTargetIndex(prev => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(targetTimer);
  }, []);

  // Canvas interaction to place target beacons
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    sounds.playLaser();
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Check if clicked near an existing beacon to remove it, else place new
    const clickedBeaconIdx = beacons.findIndex(
      (b) => Math.hypot(b.x - clickX, b.y - clickY) < b.radius + 10
    );

    if (clickedBeaconIdx !== -1) {
      setBeacons(beacons.filter((_, idx) => idx !== clickedBeaconIdx));
    } else {
      setBeacons([...beacons, { x: clickX, y: clickY, energy: 100, radius: 12 }]);
    }
  };

  // Main animation frame loop
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

      // Draw faint translucent space-grid trails
      ctx.fillStyle = "rgba(10, 15, 30, 0.22)";
      ctx.fillRect(0, 0, width, height);

      // Draw Grid Matrix Lines for gamer high-tech aesthetic
      ctx.strokeStyle = "rgba(30, 41, 59, 0.15)";
      ctx.lineWidth = 1;
      const gridSize = 40;
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

      // Draw Attractor Energy Beacons
      current.beacons.forEach((beacon) => {
        const pulse = Math.sin(Date.now() / 150) * 4;
        const outerGlow = ctx.createRadialGradient(
          beacon.x,
          beacon.y,
          2,
          beacon.x,
          beacon.y,
          beacon.radius + 15 + pulse
        );
        outerGlow.addColorStop(0, "rgba(236, 72, 153, 0.8)"); // Pink/Magenta
        outerGlow.addColorStop(0.4, "rgba(236, 72, 153, 0.2)");
        outerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(beacon.x, beacon.y, beacon.radius + 15 + pulse, 0, Math.PI * 2);
        ctx.fill();

        // Inner core
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(beacon.x, beacon.y, beacon.radius / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#ec4899";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(beacon.x, beacon.y, beacon.radius, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Update and Draw Nanobots
      const nextBoids = current.boids.map((boid) => {
        let alignX = 0, alignY = 0;
        let cohesionX = 0, cohesionY = 0;
        let separationX = 0, separationY = 0;
        let neighborCount = 0;

        // Constants for distances
        const visualRange = 45;
        const minDistance = 18;

        current.boids.forEach((other) => {
          if (other.id === boid.id) return;
          const dist = Math.hypot(other.x - boid.x, other.y - boid.y);

          if (dist < visualRange) {
            // Alignment
            alignX += other.vx;
            alignY += other.vy;

            // Cohesion
            cohesionX += other.x;
            cohesionY += other.y;

            neighborCount++;
          }

          if (dist < minDistance) {
            // Separation
            separationX += boid.x - other.x;
            separationY += boid.y - other.y;
          }
        });

        // Steering vector components
        let targetVx = boid.vx;
        let targetVy = boid.vy;

        if (neighborCount > 0) {
          alignX /= neighborCount;
          alignY /= neighborCount;
          targetVx += (alignX - boid.vx) * 0.05 * current.alignmentForce;
          targetVy += (alignY - boid.vy) * 0.05 * current.alignmentForce;

          cohesionX /= neighborCount;
          cohesionY /= neighborCount;
          targetVx += (cohesionX - boid.x) * 0.003 * current.cohesionForce;
          targetVy += (cohesionY - boid.y) * 0.003 * current.cohesionForce;
        }

        targetVx += separationX * 0.06 * current.separationForce;
        targetVy += separationY * 0.06 * current.separationForce;

        // Gravitational steering towards Energy Beacons
        current.beacons.forEach((beacon) => {
          const distToBeacon = Math.hypot(beacon.x - boid.x, beacon.y - boid.y);
          if (distToBeacon < 180) {
            targetVx += ((beacon.x - boid.x) / distToBeacon) * 0.12;
            targetVy += ((beacon.y - boid.y) / distToBeacon) * 0.12;
          }
        });

        // Handle boundaries gently
        const margin = 20;
        const turnSpeed = 0.5;
        if (boid.x < margin) targetVx += turnSpeed;
        if (boid.x > width - margin) targetVx -= turnSpeed;
        if (boid.y < margin) targetVy += turnSpeed;
        if (boid.y > height - margin) targetVy -= turnSpeed;

        // Speed limit clamp
        const currentSpeed = Math.hypot(targetVx, targetVy);
        if (currentSpeed > current.speedLimit) {
          targetVx = (targetVx / currentSpeed) * current.speedLimit;
          targetVy = (targetVy / currentSpeed) * current.speedLimit;
        }

        // Apply velocities
        let nextX = boid.x + targetVx;
        let nextY = boid.y + targetVy;

        // Wrap around boundaries absolutely if way out of bounds
        if (nextX < 0) nextX = width;
        if (nextX > width) nextX = 0;
        if (nextY < 0) nextY = height;
        if (nextY > height) nextY = 0;

        // Draw Nanobot Arrowhead with RGB glow trails
        const angle = Math.atan2(targetVy, targetVx);
        ctx.save();
        ctx.translate(nextX, nextY);
        ctx.rotate(angle);

        // Core fill (RGB shift or standard color)
        const boidColor = current.rgbTrails 
          ? `hsl(${(boid.id * 8 + Date.now() / 40) % 360}, 100%, 60%)` 
          : boid.chargeColor;

        ctx.fillStyle = boidColor;
        ctx.shadowBlur = isRgbOverdrive ? 10 : 4;
        ctx.shadowColor = boidColor;

        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(-6, -5);
        ctx.lineTo(-4, 0);
        ctx.lineTo(-6, 5);
        ctx.closePath();
        ctx.fill();

        // Draw small energy booster flames
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.beginPath();
        ctx.arc(-6, 0, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        return {
          ...boid,
          x: nextX,
          y: nextY,
          vx: targetVx,
          vy: targetVy,
        };
      });

      // Commit changes to ref
      stateRef.current.boids = nextBoids;
      animationId = requestAnimationFrame(updateFrame);
    };

    animationId = requestAnimationFrame(updateFrame);
    return () => cancelAnimationFrame(animationId);
  }, [isRgbOverdrive]);

  return (
    <div className="flex flex-col gap-6" id="robotic-division-parent">
      {/* Existing Swarm Flocking Simulation Grid */}
      <div id="robotic-swarm-station" className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Simulation Playground Viewport */}
        <div className="xl:col-span-8 flex flex-col gap-3">
          <div className={`relative rounded-xl border bg-slate-950 overflow-hidden shadow-2xl transition-all duration-300 ${
            isRgbOverdrive 
              ? "border-pink-500/50 shadow-[0_0_20px_rgba(244,63,94,0.15)]" 
              : "border-slate-800"
          }`}>
            {/* Controls overlay in top bar */}
            <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-lg border border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-300 uppercase">
                  CYBER SWARM VISUAL DECK // {boids.length} NANOBOTS ACTIVE
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsPlaying(!isPlaying);
                  }}
                  className={`p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-pink-500 text-slate-300 transition-colors hover:text-pink-400`}
                  title={isPlaying ? "Pause Simulation" : "Resume Simulation"}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={resetSwarm}
                  className="p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-cyan-400 text-slate-300 transition-colors hover:text-cyan-400"
                  title="Reset Swarm Matrix"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive HTML5 Canvas */}
            <canvas
              ref={canvasRef}
              width={640}
              height={380}
              onClick={handleCanvasClick}
              className="w-full bg-slate-950 block cursor-crosshair"
              style={{ maxHeight: "380px" }}
            />

            {/* Holographic Instruction overlay */}
            <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded border border-slate-800 text-[9px] font-mono text-slate-400">
              💡 Click on viewport to toggle <strong className="text-pink-400">Energy Attractor Beacons</strong>
            </div>
          </div>
        </div>

        {/* Flocking Customization Deck */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          <div className={`p-4 rounded-xl border bg-slate-900/95 shadow-md relative transition-all duration-300 ${
            isRgbOverdrive ? "border-pink-glow" : "border-slate-800"
          }`}>
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-pink-400 mb-3.5 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-pink-400" /> [ STEERING_VECTOR_FORCE_FIELDS ]
            </h3>

            <div className="flex flex-col gap-4">
              {/* Swarm size */}
              <div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                  <span>ACTIVE BOT COUNT</span>
                  <span className="text-pink-400 font-bold">{boidCount} NODES</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="150"
                  step="5"
                  value={boidCount}
                  onChange={(e) => {
                    sounds.playHover();
                    setBoidCount(parseInt(e.target.value));
                  }}
                  className="w-full accent-pink-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
                />
              </div>

              {/* Velocity Limit */}
              <div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                  <span>MAX FLOCK KINETICS</span>
                  <span className="text-cyan-400 font-bold">{speedLimit.toFixed(1)} M/S</span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="8.0"
                  step="0.5"
                  value={speedLimit}
                  onChange={(e) => {
                    sounds.playHover();
                    setSpeedLimit(parseFloat(e.target.value));
                  }}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
                />
              </div>

              {/* Separation Force */}
              <div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                  <span>SEPARATION (COLLISION AVOIDANCE)</span>
                  <span className="text-amber-400 font-bold">x{separationForce.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.2"
                  value={separationForce}
                  onChange={(e) => {
                    sounds.playHover();
                    setSeparationForce(parseFloat(e.target.value));
                  }}
                  className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
                />
              </div>

              {/* Cohesion Force */}
              <div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                  <span>COHESION (HERD INSTINCT)</span>
                  <span className="text-purple-400 font-bold">x{cohesionForce.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2.5"
                  step="0.1"
                  value={cohesionForce}
                  onChange={(e) => {
                    sounds.playHover();
                    setCohesionForce(parseFloat(e.target.value));
                  }}
                  className="w-full accent-purple-400 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
                />
              </div>

              {/* Alignment Force */}
              <div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                  <span>ALIGNMENT (COORDINATED DIRECTION)</span>
                  <span className="text-emerald-400 font-bold">x{alignmentForce.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2.5"
                  step="0.1"
                  value={alignmentForce}
                  onChange={(e) => {
                    sounds.playHover();
                    setAlignmentForce(parseFloat(e.target.value));
                  }}
                  className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
                />
              </div>

              {/* RGB Laser Mode Toggle */}
              <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono font-bold text-pink-400 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-pink-400" /> RAINBOW TRAIL CHROMATIC FIELD
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 leading-relaxed mt-0.5">
                    Shift nanobot LED color array dynamically using local oscillators.
                  </div>
                </div>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setRgbTrails(!rgbTrails);
                  }}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                    rgbTrails ? "bg-pink-500" : "bg-slate-800"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                      rgbTrails ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Robotics Division Research Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 border-t border-slate-850" id="robotics-research-section">
        
        {/* Header Block across 12 cols */}
        <div className="lg:col-span-12 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900/40 p-4 rounded-xl border border-slate-850 gap-3">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-slate-950 border border-slate-800 text-pink-400 rounded-lg text-xl">
              🦾
            </span>
            <div>
              <div className="text-[9px] font-mono font-bold text-pink-400 tracking-widest uppercase">
                🦾 ROBOTICS_RESEARCH_CENTRAL
              </div>
              <h2 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider">
                Autonomous Systems & AI Vision Labs
              </h2>
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2.5 py-1 rounded border border-slate-850">
            SYSTEM_STATUS: <strong className="text-emerald-400">RESEARCH ACTIVE</strong>
          </div>
        </div>

        {/* Card 1: Autonomous Robot Concept [EXPERIMENTS] (lg:col-span-4) */}
        <div className="lg:col-span-4 p-4 rounded-xl border bg-slate-900/60 hover:bg-slate-900/80 border-slate-850 transition-all flex flex-col justify-between min-h-[400px]">
          <div>
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-850">
              <span className="text-[11px] font-mono font-bold text-pink-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> EXPERIMENTS: CONCEPT_BLUEPRINT
              </span>
              <span className="text-[9px] font-mono text-slate-500">
                ACTIVE TESTBED
              </span>
            </div>

            <p className="text-[11px] text-slate-400 font-mono mb-4 leading-relaxed">
              Select a subsystem hotspot node to inspect the <strong className="text-pink-400">Autonomous Robot Concept</strong> telemetry.
            </p>

            {/* Interactive SVG blueprint schematic */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-850/60 relative flex justify-center items-center h-[180px] overflow-hidden">
              {/* Dynamic grid backdrop */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px] opacity-20 pointer-events-none" />
              
              {/* Wireframe Robot representation SVG */}
              <svg className="w-32 h-32 text-slate-600 relative z-10" viewBox="0 0 100 100">
                {/* Antennas */}
                <line x1="50" y1="20" x2="50" y2="10" stroke={blueprintSubsystem === "camera" ? "#ec4899" : "#475569"} strokeWidth="1.5" className={blueprintSubsystem === "camera" ? "animate-pulse" : ""} />
                <circle cx="50" cy="10" r="2.5" fill={blueprintSubsystem === "camera" ? "#ec4899" : "#64748b"} />

                {/* Head (Camera) */}
                <rect x="35" y="20" width="30" height="15" rx="3" fill="#020617" stroke={blueprintSubsystem === "camera" ? "#ec4899" : "#475569"} strokeWidth="1.5" />
                <circle cx="50" cy="27" r="4.5" fill="#020617" stroke={blueprintSubsystem === "camera" ? "#ec4899" : "#06b6d4"} strokeWidth="1.5" />
                {/* Blink camera lens point */}
                <circle cx="50" cy="27" r="1.5" fill={telemetryTick % 2 === 0 ? "#ec4899" : "#ffffff"} />

                {/* Neck */}
                <line x1="50" y1="35" x2="50" y2="40" stroke="#475569" strokeWidth="2" />

                {/* Body/Chassis (Sensors & Navigation) */}
                <rect x="25" y="40" width="50" height="35" rx="6" fill="#020617" stroke={blueprintSubsystem === "sensors" || blueprintSubsystem === "navigation" ? "#ec4899" : "#475569"} strokeWidth="1.5" />
                
                {/* Inner heart/navigation core glowing circle */}
                <circle cx="50" cy="58" r="8" fill="#020617" stroke={blueprintSubsystem === "navigation" ? "#a855f7" : "#1e293b"} strokeWidth="1" className="animate-pulse" />
                <polygon points="50,53 55,61 45,61" fill={blueprintSubsystem === "navigation" ? "#a855f7" : "#475569"} />

                {/* Left arm/actuator */}
                <path d="M 25,45 L 12,55 L 12,70" fill="none" stroke={blueprintSubsystem === "movement" ? "#ec4899" : "#475569"} strokeWidth="1.5" />
                <circle cx="12" cy="70" r="3" fill={blueprintSubsystem === "movement" ? "#ec4899" : "#475569"} />

                {/* Right arm/actuator */}
                <path d="M 75,45 L 88,55 L 88,70" fill="none" stroke={blueprintSubsystem === "movement" ? "#ec4899" : "#475569"} strokeWidth="1.5" />
                <circle cx="88" cy="70" r="3" fill={blueprintSubsystem === "movement" ? "#ec4899" : "#475569"} />

                {/* Wheels/Movement legs */}
                <circle cx="35" cy="85" r="7" fill="#020617" stroke={blueprintSubsystem === "movement" ? "#ec4899" : "#475569"} strokeWidth="1.5" />
                <circle cx="35" cy="85" r="2" fill="#475569" />
                <circle cx="65" cy="85" r="7" fill="#020617" stroke={blueprintSubsystem === "movement" ? "#ec4899" : "#475569"} strokeWidth="1.5" />
                <circle cx="65" cy="85" r="2" fill="#475569" />
              </svg>

              {/* Subsystem nodes floating label links */}
              <button 
                onClick={() => { sounds.playClick(); setBlueprintSubsystem("camera"); }}
                className={`absolute top-4 left-4 px-1.5 py-0.5 rounded text-[8px] font-mono border transition-all cursor-pointer ${
                  blueprintSubsystem === "camera" ? "bg-pink-950 text-pink-400 border-pink-500" : "bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700"
                }`}
              >
                [01_AI_VISION]
              </button>

              <button 
                onClick={() => { sounds.playClick(); setBlueprintSubsystem("sensors"); }}
                className={`absolute bottom-4 left-4 px-1.5 py-0.5 rounded text-[8px] font-mono border transition-all cursor-pointer ${
                  blueprintSubsystem === "sensors" ? "bg-pink-950 text-pink-400 border-pink-500" : "bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700"
                }`}
              >
                [02_SENSORS]
              </button>

              <button 
                onClick={() => { sounds.playClick(); setBlueprintSubsystem("movement"); }}
                className={`absolute bottom-4 right-4 px-1.5 py-0.5 rounded text-[8px] font-mono border transition-all cursor-pointer ${
                  blueprintSubsystem === "movement" ? "bg-pink-950 text-pink-400 border-pink-500" : "bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700"
                }`}
              >
                [03_MOVEMENT]
              </button>

              <button 
                onClick={() => { sounds.playClick(); setBlueprintSubsystem("navigation"); }}
                className={`absolute top-4 right-4 px-1.5 py-0.5 rounded text-[8px] font-mono border transition-all cursor-pointer ${
                  blueprintSubsystem === "navigation" ? "bg-pink-950 text-pink-400 border-pink-500" : "bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700"
                }`}
              >
                [04_NAV]
              </button>
            </div>
          </div>

          {/* Subsystem diagnostics details readouts */}
          <div className="mt-3 p-2.5 bg-slate-950 rounded border border-slate-850 text-[10px] font-mono">
            {blueprintSubsystem === "camera" && (
              <div>
                <span className="text-pink-400 font-bold block mb-1">01_AI_VISION CAMERA EYE</span>
                <span className="text-slate-500">APERTURE:</span> <span className="text-slate-200">F/1.8 WIDE</span><br />
                <span className="text-slate-500">PIXEL MATRIX:</span> <span className="text-slate-200">1024x1024 SPECTRAL</span><br />
                <span className="text-slate-500">LENS TEMPERATURE:</span> <span className="text-amber-400">34.2 °C</span>
              </div>
            )}
            {blueprintSubsystem === "sensors" && (
              <div>
                <span className="text-pink-400 font-bold block mb-1">02_LIDAR & ULTRASONIC ARRAY</span>
                <span className="text-slate-500">RANGE CAPACITY:</span> <span className="text-slate-200">0.1m - 12.0m</span><br />
                <span className="text-slate-500">SWEEP WAVE RATE:</span> <span className="text-slate-200">360° / 20 Hz</span><br />
                <span className="text-slate-500">PING LATENCY:</span> <span className="text-cyan-400">1.8ms</span>
              </div>
            )}
            {blueprintSubsystem === "movement" && (
              <div>
                <span className="text-pink-400 font-bold block mb-1">03_SERVO MOVEMENT ACTUATORS</span>
                <span className="text-slate-500">DRIVE TYPE:</span> <span className="text-slate-200">COORDINATED TRI-WHEEL</span><br />
                <span className="text-slate-500">MOTOR TORQUE:</span> <span className="text-slate-200">0.82 Nm NOMINAL</span><br />
                <span className="text-slate-500">CURRENT FEED:</span> <span className="text-emerald-400">1.45 Amps</span>
              </div>
            )}
            {blueprintSubsystem === "navigation" && (
              <div>
                <span className="text-pink-400 font-bold block mb-1">04_COGNITIVE PATHFINDING NAVIGATION</span>
                <span className="text-slate-500">MAPPING SYSTEM:</span> <span className="text-slate-200">SLAM GRAPH v3.2</span><br />
                <span className="text-slate-500">WAYPOINT CAPACITY:</span> <span className="text-slate-200">128 BOUNDS</span><br />
                <span className="text-slate-500">DECISION RATE:</span> <span className="text-cyan-400">125 / SEC</span>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Research Subsections Tabs (lg:col-span-4) */}
        <div className="lg:col-span-4 p-4 rounded-xl border bg-slate-900/60 hover:bg-slate-900/80 border-slate-850 transition-all flex flex-col justify-between min-h-[400px]">
          <div>
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-850">
              <span className="text-[11px] font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" /> RESEARCH_SUBSECTIONS
              </span>
              <span className="text-[9px] font-mono text-slate-500">
                ACTIVE CORES
              </span>
            </div>

            {/* Sub-tab navigations */}
            <div className="grid grid-cols-3 gap-1 mb-4">
              {["sensors", "movement", "navigation"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    sounds.playClick();
                    setResearchTab(tab as any);
                  }}
                  className={`py-1.5 rounded text-[9px] font-mono font-bold tracking-wider cursor-pointer border transition-all ${
                    researchTab === tab
                      ? "bg-slate-950 text-cyan-400 border-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.15)]"
                      : "bg-slate-900/40 text-slate-400 border-slate-850 hover:border-slate-800"
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Interactive Research Data Panel */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850/60 font-mono text-[11px] min-h-[220px] flex flex-col justify-between">
              
              {researchTab === "sensors" && (
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] text-cyan-400 font-bold mb-2 flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5" /> [SENSORY INPUT MATRIX]
                    </div>
                    <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">
                      LIDAR laser sweeps and ultrasonic reflections feed distance profiles into containment filters.
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-900 text-[10px]">
                    <div>
                      <div className="flex justify-between text-slate-400 mb-0.5">
                        <span>LIDAR SCAN DISTANCE:</span>
                        <span className="text-cyan-400 font-bold">{(3.4 + Math.sin(telemetryTick / 8) * 0.45).toFixed(2)}m</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                        <div className="bg-cyan-400 h-full transition-all" style={{ width: `${30 + (Math.sin(telemetryTick / 8) * 10)}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-0.5">
                        <span>IMU ACCEL GYRO DRIFT:</span>
                        <span className="text-pink-400 font-bold">0.02° roll/s</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                        <div className="bg-pink-500 h-full" style={{ width: "15%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-0.5">
                        <span>PULSED RADAR ENVELOPE:</span>
                        <span className="text-amber-400 font-bold">{(120 + (telemetryTick % 12)).toFixed(0)} Hz</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full" style={{ width: "55%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {researchTab === "movement" && (
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] text-amber-400 font-bold mb-2 flex items-center gap-1">
                      <Disc className="w-3.5 h-3.5" /> [KINEMATIC MOTOR DYNAMICS]
                    </div>
                    <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">
                      Tri-wheel mechanical constraints calculate wheel torque distribution ratios to eliminate micro-skidding.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-900 text-[10px]">
                    <div>
                      <div className="flex justify-between text-slate-400 mb-0.5">
                        <span>WHEEL SERVO CURRENT:</span>
                        <span className="text-amber-400 font-bold">{(1.2 + (telemetryTick % 5) * 0.12).toFixed(2)} Amps</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full" style={{ width: `${45 + (telemetryTick % 5) * 5}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-0.5">
                        <span>TORQUE FEEDBACK COEFFICIENT:</span>
                        <span className="text-emerald-400 font-bold">0.78 Nm</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full" style={{ width: "78%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-0.5">
                        <span>BOOSTER FLAME PWM:</span>
                        <span className="text-pink-400 font-bold">{(180 + Math.sin(telemetryTick) * 30).toFixed(0)} Hz</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                        <div className="bg-pink-500 h-full" style={{ width: "82%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {researchTab === "navigation" && (
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] text-purple-400 font-bold mb-2 flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5" /> [COGNITIVE ROUTE ANALYSIS]
                    </div>
                    <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">
                      A* heuristic algorithms generate path containment meshes with obstacles identified by camera sensors.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-900 text-[10px]">
                    <div>
                      <div className="flex justify-between text-slate-400 mb-0.5">
                        <span>SLAM CONFIDENCE MATRIX:</span>
                        <span className="text-purple-400 font-bold">{(98.2 + Math.cos(telemetryTick / 10) * 0.8).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full" style={{ width: "98%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-0.5">
                        <span>WAYPOINT DRIFT VECTOR:</span>
                        <span className="text-cyan-400 font-bold">&lt;0.015m</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                        <div className="bg-cyan-400 h-full" style={{ width: "8%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-0.5">
                        <span>MESH WAYPOINTS RETRIEVED:</span>
                        <span className="text-emerald-400 font-bold">12 / 128 LOOPS</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full" style={{ width: "12%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          <div className="text-[9px] font-mono text-slate-500 mt-2 text-right">
            HEURISTIC ENGINE REFRESH: 15Hz
          </div>
        </div>

        {/* Card 3: AI Vision Robot [Camera ➔ AI Detection ➔ Decision] Pipeline flow (lg:col-span-4) */}
        <div className="lg:col-span-4 p-4 rounded-xl border bg-slate-900/60 hover:bg-slate-900/80 border-slate-850 transition-all flex flex-col justify-between min-h-[400px]">
          <div>
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-850">
              <span className="text-[11px] font-mono font-bold text-pink-400 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-pink-400" /> AI VISION ROBOT
              </span>
              <span className="text-[9px] font-mono text-slate-500">
                PIPELINE FEED
              </span>
            </div>

            {/* FLOW INDICATOR STEP BAR: Camera -> Detection -> Decision */}
            <div className="grid grid-cols-3 gap-1 mb-3 text-center text-[9px] font-mono">
              <div className="p-1 bg-slate-950 border border-slate-850 rounded text-slate-300 font-bold flex items-center justify-center gap-1">
                <Video className="w-3 h-3 text-cyan-400" /> CAMERA
              </div>
              <div className="p-1 bg-slate-950 border border-slate-850 rounded text-slate-300 font-bold flex items-center justify-center gap-1">
                <Eye className="w-3 h-3 text-pink-400" /> AI DETECT
              </div>
              <div className="p-1 bg-slate-950 border border-slate-850 rounded text-slate-300 font-bold flex items-center justify-center gap-1">
                <Cpu className="w-3 h-3 text-purple-400" /> DECISION
              </div>
            </div>

            {/* 1. Camera Viewfinder Screen simulation */}
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-850 relative h-[120px] overflow-hidden flex flex-col justify-between">
              {/* Green targeting grid */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.3)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
              
              {/* Scanline sweep */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-bounce pointer-events-none" style={{ animationDuration: '4s' }} />

              {/* Viewfinder overlay coordinates corners */}
              <div className="absolute top-1 left-1 text-[8px] font-mono text-slate-600 select-none">REC [30 FPS]</div>
              <div className="absolute top-1 right-1 text-[8px] font-mono text-slate-600 select-none">ZOOM x1.5</div>

              {/* Moving camera target marker bounding box */}
              <div 
                className="absolute border-2 border-emerald-500/80 rounded transition-all duration-300 ease-out pointer-events-none flex items-start justify-start p-1"
                style={{ 
                  left: `${simulatedCoords.x}px`, 
                  top: `${simulatedCoords.y}px`, 
                  width: `${simulatedCoords.width}px`, 
                  height: `${simulatedCoords.height}px` 
                }}
              >
                {/* Neon focus lines in corner */}
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-emerald-400" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-emerald-400" />
                
                {/* Small text label over focus point */}
                <span className="text-[6px] font-mono font-bold bg-emerald-950/80 text-emerald-400 px-0.5 rounded leading-none shrink-0 uppercase select-none">
                  {[
                    "SWARM_BOID",
                    "SWARM_BEACON",
                    "SAMMIUM_ORE",
                    "COLLISION_LIMIT"
                  ][aiVisionTargetIndex]}
                </span>
              </div>

              {/* Center pointer focus indicator */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <Crosshair className="w-5 h-5 text-slate-800/20" />
              </div>

              {/* Status block info */}
              <div className="relative z-10 text-[8px] font-mono text-slate-500 mt-auto flex justify-between bg-slate-950/75 p-1 rounded border border-slate-900">
                <span>COORD: X:{simulatedCoords.x.toFixed(0)} Y:{simulatedCoords.y.toFixed(0)}</span>
                <span className="text-emerald-500 font-bold">SCANNING FEED_OK</span>
              </div>
            </div>

            {/* Downward connection indicator */}
            <div className="flex justify-center my-1.5 text-slate-600">
              <ArrowDown className="w-3.5 h-3.5 animate-bounce text-pink-500" />
            </div>

            {/* 2. AI Detection Core statistics */}
            <div className="p-2 bg-slate-950 rounded-lg border border-slate-850 text-[10px] font-mono flex flex-col gap-1">
              <div className="flex justify-between items-center pb-1 border-b border-slate-900 mb-1">
                <span className="text-pink-400 font-bold flex items-center gap-1">
                  <Eye className="w-3 h-3 text-pink-400" /> [AI_DETECTION_ENGINE]
                </span>
                <span className="text-[8px] text-slate-500">SWIFT CLASSIFICATION</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">OBJECT FOUND:</span>
                <span className="text-slate-200 font-bold">
                  {[
                    "Active Nanobot #41",
                    "Energy Attractor Alpha",
                    "Silicon Base Ore Node",
                    "Sector Containment Limit"
                  ][aiVisionTargetIndex]}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">CLASS TYPE:</span>
                <span className="text-pink-400 font-bold">
                  {[
                    "SWARM_BOID",
                    "SWARM_BEACON",
                    "SAMMIUM_ORE",
                    "COLLISION_LIMIT"
                  ][aiVisionTargetIndex]}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">CONFIDENCE RATING:</span>
                <span className="text-emerald-400 font-bold">
                  {[
                    (98.4 + Math.sin(telemetryTick) * 0.2).toFixed(1) + "%",
                    (99.1 + Math.cos(telemetryTick) * 0.1).toFixed(1) + "%",
                    (94.6 + Math.sin(telemetryTick) * 0.4).toFixed(1) + "%",
                    (96.8 + Math.cos(telemetryTick) * 0.3).toFixed(1) + "%"
                  ][aiVisionTargetIndex]}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">LATENCY PROCESS:</span>
                <span className="text-cyan-400 font-bold">
                  {[
                    "12.4ms",
                    "8.1ms",
                    "14.2ms",
                    "10.5ms"
                  ][aiVisionTargetIndex]}
                </span>
              </div>
            </div>

            {/* Downward connection indicator */}
            <div className="flex justify-center my-1.5 text-slate-600">
              <ArrowDown className="w-3.5 h-3.5 animate-bounce text-purple-500" />
            </div>

            {/* 3. Decision loop readout */}
            <div className="p-2 bg-slate-950 rounded-lg border border-slate-850 text-[10px] font-mono flex flex-col gap-1">
              <div className="flex justify-between items-center pb-1 border-b border-slate-900 mb-1">
                <span className="text-purple-400 font-bold flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-purple-400" /> [DECISION_CORE_ACTION]
                </span>
                <span className="text-[8px] text-slate-500">COMMAND FLUX</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">ACTION EXECUTED:</span>
                <span className="text-slate-100 font-bold">
                  {[
                    "CALCULATE_HERD_COHESION",
                    "STEER_TOWARDS_SOURCE",
                    "INITIATE_CORE_HARVEST",
                    "APPLY_STEERING_REPULSION"
                  ][aiVisionTargetIndex]}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">STEERING COMMAND:</span>
                <span className="text-cyan-400 font-bold font-mono">
                  {[
                    "STEER_ACCEL_SWARM",
                    "ORIENT_TOWARDS_BEACON",
                    "STATIONARY_ALIGN_HARVEST",
                    "EMERGENCY_STEER_BOUNCE"
                  ][aiVisionTargetIndex]}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">MOTOR FORCE PWM:</span>
                <span className="text-amber-400 font-bold">
                  {[
                    "180 / 255",
                    "240 / 255",
                    "40 / 255",
                    "255 / 255"
                  ][aiVisionTargetIndex]}
                </span>
              </div>
            </div>

          </div>

          <div className="text-[9px] font-mono text-slate-500 mt-2">
            DECISION PATHWAY FEED: <strong className="text-purple-400">OPTIMAL</strong>
          </div>
        </div>

      </div>
    </div>
  );
};
