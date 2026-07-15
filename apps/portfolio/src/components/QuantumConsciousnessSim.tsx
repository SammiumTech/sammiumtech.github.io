import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Zap, Compass, Volume2, VolumeX, Eye, Info, Sparkles, Activity } from "lucide-react";

// 3D Nodes
interface Node3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  color: string;
  size: number;
  pulseSpeed: number;
  pulsePhase: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
}

// 3D Connections
interface QuantumFiber {
  source: Node3D;
  target: Node3D;
  energyPos: number;
  energySpeed: number;
}

// Holographic Floating Symbols
interface FloatingSymbol {
  text: string;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  alpha: number;
  scale: number;
}

// Drifting Digital Dust
interface DigitalDust {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  alpha: number;
  color: string;
}

// Holographic Wireframe 3D Cubes
interface ComputationCube {
  x: number;
  y: number;
  z: number;
  size: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  rotSpeedX: number;
  rotSpeedY: number;
  color: string;
}

// Synaptic Discharge Arcs
interface EnergyArc {
  sourceIndex: number;
  targetIndex: number;
  life: number; // 0 to 1
  points: { x: number; y: number; z: number }[];
}

// Golden Quantum Sparks
interface GoldenSpark {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  size: number;
}

export default function QuantumConsciousnessSim() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientOscillatorsRef = useRef<any[]>([]);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [cameraSpeed, setCameraSpeed] = useState(1);
  const [resonanceActive, setResonanceActive] = useState(false);
  const [nodeDensity, setNodeDensity] = useState(130);
  const [activeTelemetry, setActiveTelemetry] = useState("COGNITIVE_SYNAPSE_ONLINE");

  // Keep state in refs for maximum animation loop performance (strictly 60FPS, no react re-renders)
  const isPlayingRef = useRef(true);
  const cameraSpeedRef = useRef(1);
  const cameraZRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const resonanceActiveRef = useRef(false);

  // Synaptic network refs
  const nodesRef = useRef<Node3D[]>([]);
  const fibersRef = useRef<QuantumFiber[]>([]);
  const symbolsRef = useRef<FloatingSymbol[]>([]);
  const dustRef = useRef<DigitalDust[]>([]);
  const cubesRef = useRef<ComputationCube[]>([]);
  const arcsRef = useRef<EnergyArc[]>([]);
  const sparksRef = useRef<GoldenSpark[]>([]);

  const randomMathPool = [
    "Ψ(x,t)", "∇²", "∫ e^-x² dx", "Matrix[16x16]", "Tensor(T_μν)", "λ = h/p",
    "0x3F", "0xFA92", "W_ij", "tanh(x)", "σ(Wx + b)", "ReLU", "dQ/dt", "|0⟩ + |1⟩",
    "H|ψ⟩ = E|ψ⟩", "∑(w*x + b)", "∂L/∂W", "Exp(-ΔE/kT)", "U_q(sl_2)", "QuantumCore",
    "G_μν + Λg_μν = 8πG/c⁴ T_μν", "ρ(∂v/∂t + v·∇v) = -∇p + μ∇²v", "iℏ ∂/∂t Ψ = Ĥ Ψ"
  ];

  // Sync state changes with refs immediately
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    cameraSpeedRef.current = cameraSpeed;
  }, [cameraSpeed]);

  useEffect(() => {
    resonanceActiveRef.current = resonanceActive;
  }, [resonanceActive]);

  // Audio synthesis logic for mysterious, peaceful, and infinitely powerful atmosphere
  const startAmbientSynth = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // 1. Deep Sub-bass drone (A0 note - 55Hz & Sub frequencies)
      const droneOsc = ctx.createOscillator();
      const droneGain = ctx.createGain();
      droneOsc.type = "sine";
      droneOsc.frequency.setValueAtTime(55, ctx.currentTime);
      droneGain.gain.setValueAtTime(0.04, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(120, ctx.currentTime);

      droneOsc.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(ctx.destination);
      droneOsc.start();

      // 2. High ethereal harmony (Triangular frequency modulation)
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.type = "sine";
      chimeOsc.frequency.setValueAtTime(220, ctx.currentTime); // A3
      chimeGain.gain.setValueAtTime(0.012, ctx.currentTime);

      // Slow breathe LFO
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.1, ctx.currentTime); // 10-second breath loop
      lfoGain.gain.setValueAtTime(0.008, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(chimeGain.gain);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chimeOsc.start();
      lfo.start();

      // 3. Resonating high ambient hum
      const highOsc = ctx.createOscillator();
      const highGain = ctx.createGain();
      highOsc.type = "sine";
      highOsc.frequency.setValueAtTime(330, ctx.currentTime); // E4
      highGain.gain.setValueAtTime(0.005, ctx.currentTime);

      highOsc.connect(highGain);
      highGain.connect(ctx.destination);
      highOsc.start();

      ambientOscillatorsRef.current = [
        { osc: droneOsc, gain: droneGain },
        { osc: chimeOsc, gain: chimeGain },
        { osc: lfo, gain: lfoGain },
        { osc: highOsc, gain: highGain }
      ];
    } catch (e) {
      console.warn("Audio Context failed initialization:", e);
    }
  };

  const stopAmbientSynth = () => {
    ambientOscillatorsRef.current.forEach((obj) => {
      try {
        obj.osc.stop();
      } catch (e) {}
    });
    ambientOscillatorsRef.current = [];
  };

  const toggleAudio = () => {
    if (isAudioMuted) {
      startAmbientSynth();
      setIsAudioMuted(false);
    } else {
      stopAmbientSynth();
      setIsAudioMuted(true);
    }
  };

  // Quantum Resonance shockwave
  const triggerResonance = () => {
    if (resonanceActive) return;
    setResonanceActive(true);

    // Ethereal swell effect audio trigger
    if (!isAudioMuted && audioContextRef.current) {
      try {
        const ctx = audioContextRef.current;
        const swellOsc = ctx.createOscillator();
        const swellGain = ctx.createGain();
        swellOsc.type = "sine";
        swellOsc.frequency.setValueAtTime(82.4, ctx.currentTime); // E2
        swellOsc.frequency.exponentialRampToValueAtTime(329.6, ctx.currentTime + 1.4); // E4

        swellGain.gain.setValueAtTime(0.001, ctx.currentTime);
        swellGain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 0.4);
        swellGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);

        swellOsc.connect(swellGain);
        swellGain.connect(ctx.destination);
        swellOsc.start();
        swellOsc.stop(ctx.currentTime + 2.0);
      } catch (e) {}
    }

    // Trigger golden sparks explosion at random nodes
    const nodes = nodesRef.current;
    if (nodes.length > 0) {
      for (let i = 0; i < 40; i++) {
        const randNode = nodes[Math.floor(Math.random() * nodes.length)];
        sparksRef.current.push({
          x: randNode.x,
          y: randNode.y,
          z: randNode.z,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          vz: (Math.random() - 0.5) * 6,
          life: 1.0,
          size: Math.random() * 2.5 + 1.5
        });
      }
    }

    setTimeout(() => {
      setResonanceActive(false);
    }, 1800);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resizeCanvas = () => {
      const container = containerRef.current;
      if (container && canvas) {
        canvas.width = container.clientWidth;
        canvas.height = 480; // Full visualizer screen height
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 3D Matrix Space constants
    const width3D = 1400;
    const height3D = 900;
    const depth3D = 1000;

    // Helper: Build a beautiful single 3D node
    const createNode = (zOverride?: number): Node3D => {
      const sizeVal = Math.random() * 3.5 + 1.5;
      const pulseSpeed = Math.random() * 0.03 + 0.008;
      // High-tech matrix colors: Emerald, Cyan, or clean Pure White
      const rand = Math.random();
      const color = rand > 0.6 ? "#10b981" : rand > 0.25 ? "#06b6d4" : "#f8fafc";

      return {
        x: (Math.random() - 0.5) * width3D,
        y: (Math.random() - 0.5) * height3D,
        z: zOverride !== undefined ? zOverride : Math.random() * depth3D,
        baseX: (Math.random() - 0.5) * width3D,
        baseY: (Math.random() - 0.5) * height3D,
        baseZ: zOverride !== undefined ? zOverride : Math.random() * depth3D,
        color,
        size: sizeVal,
        pulseSpeed,
        pulsePhase: Math.random() * Math.PI * 2,
        orbitRadius: Math.random() * 12 + 6,
        orbitSpeed: (Math.random() - 0.5) * 0.08,
        orbitPhase: Math.random() * Math.PI * 2
      };
    };

    // Populate active Nodes
    const tempNodes: Node3D[] = [];
    for (let i = 0; i < nodeDensity; i++) {
      tempNodes.push(createNode());
    }
    nodesRef.current = tempNodes;

    // Connect synaptic fibers between nearby node pairs
    const rebuildFibers = () => {
      const fibers: QuantumFiber[] = [];
      const nodes = nodesRef.current;
      for (let i = 0; i < nodes.length; i++) {
        const source = nodes[i];
        // Find closest nodes using distance calculation
        const targets = [...nodes]
          .filter((n) => n !== source)
          .sort((a, b) => {
            const distA = Math.pow(a.x - source.x, 2) + Math.pow(a.y - source.y, 2) + Math.pow(a.z - source.z, 2);
            const distB = Math.pow(b.x - source.x, 2) + Math.pow(b.y - source.y, 2) + Math.pow(b.z - source.z, 2);
            return distA - distB;
          })
          .slice(0, 2);

        targets.forEach((target) => {
          fibers.push({
            source,
            target,
            energyPos: Math.random(),
            energySpeed: Math.random() * 0.009 + 0.004
          });
        });
      }
      fibersRef.current = fibers;
    };
    rebuildFibers();

    // Populate Floating Equations inside transparent space
    const tempSymbols: FloatingSymbol[] = [];
    for (let i = 0; i < 30; i++) {
      tempSymbols.push({
        text: randomMathPool[Math.floor(Math.random() * randomMathPool.length)],
        x: (Math.random() - 0.5) * width3D,
        y: (Math.random() - 0.5) * height3D,
        z: Math.random() * depth3D,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        vz: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.6 + 0.2,
        scale: Math.random() * 0.4 + 0.7
      });
    }
    symbolsRef.current = tempSymbols;

    // Drifting Micro Dust (120+ tiny ambient floating white/emerald/cyan specs)
    const tempDust: DigitalDust[] = [];
    for (let i = 0; i < 120; i++) {
      const color = Math.random() > 0.5 ? "rgba(16, 185, 129, " : Math.random() > 0.5 ? "rgba(6, 182, 212, " : "rgba(248, 250, 252, ";
      tempDust.push({
        x: (Math.random() - 0.5) * width3D,
        y: (Math.random() - 0.5) * height3D,
        z: Math.random() * depth3D,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        vz: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        color
      });
    }
    dustRef.current = tempDust;

    // Translucent AI Computation 3D Wireframe Cubes (Miniature Galaxies inside)
    const tempCubes: ComputationCube[] = [];
    for (let i = 0; i < 6; i++) {
      tempCubes.push({
        x: (Math.random() - 0.5) * (width3D * 0.8),
        y: (Math.random() - 0.5) * (height3D * 0.8),
        z: Math.random() * depth3D,
        size: Math.random() * 60 + 40,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        rotSpeedX: Math.random() * 0.015 + 0.005,
        rotSpeedY: Math.random() * 0.015 + 0.005,
        color: i % 2 === 0 ? "#10b981" : "#06b6d4" // Emerald or Cyan
      });
    }
    cubesRef.current = tempCubes;

    // Track mouse coordinates for magnetic spatial deflection
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left - rect.width / 2) * 1.6,
        y: (e.clientY - rect.top - rect.height / 2) * 1.6
      };
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    // 3D Projection configuration
    const FOV = 450;

    const project = (point: { x: number; y: number; z: number }, cx: number, cy: number) => {
      let relativeZ = (point.z - cameraZRef.current) % depth3D;
      if (relativeZ < 0) relativeZ += depth3D;

      // Volumetric clipping
      if (relativeZ <= 5) return null;

      const scale = FOV / relativeZ;
      const x2d = cx + point.x * scale;
      const y2d = cy + point.y * scale;

      return { x: x2d, y: y2d, scale, relativeZ };
    };

    let frameCount = 0;

    // Helper: Draw 3D wireframe box
    const drawWireframeCube = (cube: ComputationCube, cx: number, cy: number) => {
      // Rotate cube vertices around its local center in 3D
      const rx = cube.rotX;
      const ry = cube.rotY;

      // Local 3D vertex offsets
      const d = cube.size / 2;
      const localVertices = [
        { x: -d, y: -d, z: -d },
        { x: d, y: -d, z: -d },
        { x: d, y: d, z: -d },
        { x: -d, y: d, z: -d },
        { x: -d, y: -d, z: d },
        { x: d, y: -d, z: d },
        { x: d, y: d, z: d },
        { x: -d, y: d, z: d }
      ];

      // Apply rotation matrices locally
      const rotVertices = localVertices.map((v) => {
        // Rot Y
        let x1 = v.x * Math.cos(ry) - v.z * Math.sin(ry);
        let z1 = v.x * Math.sin(ry) + v.z * Math.cos(ry);
        // Rot X
        let y2 = v.y * Math.cos(rx) - z1 * Math.sin(rx);
        let z2 = v.y * Math.sin(rx) + z1 * Math.cos(rx);

        return {
          x: cube.x + x1,
          y: cube.y + y2,
          z: cube.z + z2
        };
      });

      // Project vertices to 2D
      const projVertices = rotVertices.map((v) => project(v, cx, cy));

      // Draw wire lines if all vertices projected successfully
      if (projVertices.every((pv) => pv !== null)) {
        const pvs = projVertices as { x: number; y: number; scale: number; relativeZ: number }[];
        const avgZ = pvs.reduce((acc, v) => acc + v.relativeZ, 0) / 8;
        const depthAlpha = Math.max(0, 1 - avgZ / depth3D);

        ctx.strokeStyle = cube.color === "#10b981" 
          ? `rgba(16, 185, 129, ${depthAlpha * 0.28})` 
          : `rgba(6, 182, 212, ${depthAlpha * 0.28})`;
        ctx.lineWidth = Math.min(1.2, pvs[0].scale * 0.4);

        // Cube edges (12 lines)
        const connections = [
          [0, 1], [1, 2], [2, 3], [3, 0], // front face
          [4, 5], [5, 6], [6, 7], [7, 4], // back face
          [0, 4], [1, 5], [2, 6], [3, 7]  // bridge lines
        ];

        ctx.beginPath();
        connections.forEach(([start, end]) => {
          ctx.moveTo(pvs[start].x, pvs[start].y);
          ctx.lineTo(pvs[end].x, pvs[end].y);
        });
        ctx.stroke();

        // Draw miniature glowing AI galaxy computation center inside cube
        const centerProj = project({ x: cube.x, y: cube.y, z: cube.z }, cx, cy);
        if (centerProj) {
          ctx.beginPath();
          ctx.arc(centerProj.x, centerProj.y, cube.size * 0.15 * centerProj.scale, 0, Math.PI * 2);
          ctx.fillStyle = cube.color === "#10b981" ? "rgba(16, 185, 129, 0.12)" : "rgba(6, 182, 212, 0.12)";
          ctx.fill();
        }
      }
    };

    // Helper: Draw massive rotating quantum holographic ring
    const drawHoloRing = (z: number, radius: number, speed: number, color: string, cx: number, cy: number) => {
      const angleOffset = frameCount * speed;
      const numPoints = 60;
      const ringPoints: { x: number; y: number; z: number }[] = [];

      for (let i = 0; i < numPoints; i++) {
        const theta = (i / numPoints) * Math.PI * 2;
        // Construct ring in horizontal flat plane
        ringPoints.push({
          x: Math.cos(theta + angleOffset) * radius,
          y: Math.sin(theta + angleOffset) * radius * 0.4, // squashed flat 3D elliptical tilt
          z: z
        });
      }

      ctx.beginPath();
      let first = true;
      ringPoints.forEach((p) => {
        const proj = project(p, cx, cy);
        if (proj) {
          if (first) {
            ctx.moveTo(proj.x, proj.y);
            first = false;
          } else {
            ctx.lineTo(proj.x, proj.y);
          }
        }
      });
      ctx.closePath();

      const projCenter = project({ x: 0, y: 0, z }, cx, cy);
      if (projCenter) {
        const depthAlpha = Math.max(0, 1 - projCenter.relativeZ / depth3D);
        ctx.strokeStyle = color === "cyan" 
          ? `rgba(6, 182, 212, ${depthAlpha * 0.15})` 
          : `rgba(16, 185, 129, ${depthAlpha * 0.15})`;
        ctx.lineWidth = Math.min(2.0, projCenter.scale * 0.6);
        ctx.stroke();
      }
    };

    // Main Canvas Render Loop
    const render = () => {
      if (!ctx || !canvas) return;
      frameCount++;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Smooth camera forward progression through infinite space
      if (isPlayingRef.current) {
        cameraZRef.current += cameraSpeedRef.current * 0.7;
      }

      // 1. Deep cinematic blackness with soft emerald-navy center gradient
      const bgGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, canvas.width * 0.75);
      bgGrad.addColorStop(0, "rgba(4, 18, 28, 1)");
      bgGrad.addColorStop(0.6, "rgba(2, 6, 12, 1)");
      bgGrad.addColorStop(1, "rgba(0, 0, 0, 1)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Volumetric fog rendering (Subtle organic light rays drifting)
      const fogBreathe = Math.sin(frameCount * 0.008) * 0.1 + 0.18;
      ctx.fillStyle = `rgba(16, 185, 129, ${fogBreathe * 0.1})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render Matrix scanning digital dust rays
      ctx.fillStyle = "rgba(16, 185, 129, 0.008)";
      ctx.fillRect(0, (frameCount * 0.5) % canvas.height, canvas.width, 2);

      // Draw massive holographic background rings rotating around invisible cores
      drawHoloRing(300, 480, 0.002, "cyan", cx, cy);
      drawHoloRing(650, 560, -0.0015, "emerald", cx, cy);

      // Render 3D computation cubes
      const cubes = cubesRef.current;
      cubes.forEach((cube) => {
        if (isPlayingRef.current) {
          cube.rotX += cube.rotSpeedX;
          cube.rotY += cube.rotSpeedY;
        }
        drawWireframeCube(cube, cx, cy);

        // Replenish cubes as they pass behind the camera
        const relativeZ = (cube.z - cameraZRef.current) % depth3D;
        if (relativeZ < 10) {
          cube.z = cameraZRef.current + depth3D - Math.random() * 80;
        }
      });

      // Update & render drifting digital micro dust particles
      const dust = dustRef.current;
      for (let i = 0; i < dust.length; i++) {
        const d = dust[i];
        if (isPlayingRef.current) {
          d.x += d.vx;
          d.y += d.vy;
          d.z += d.vz;
        }

        const proj = project(d, cx, cy);
        if (proj) {
          const depthAlpha = Math.max(0, 1 - proj.relativeZ / depth3D);
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, d.size * proj.scale * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `${d.color}${d.alpha * depthAlpha})`;
          ctx.fill();
        }

        // Loop dust infinitely
        const relativeZ = (d.z - cameraZRef.current) % depth3D;
        if (relativeZ < 5 || relativeZ > depth3D - 10) {
          d.z = (cameraZRef.current + depth3D - Math.random() * 50) % depth3D;
        }
      }

      // Trigger random synaptic energy discharge arcs connecting nearby active nodes (illuminating thoughts)
      const nodes = nodesRef.current;
      if (isPlayingRef.current && Math.random() > 0.94 && nodes.length > 4) {
        // Select random close node indices
        const sIdx = Math.floor(Math.random() * nodes.length);
        const source = nodes[sIdx];

        // Find nearest neighbor index
        let bestTargetIdx = 0;
        let bestDist = Infinity;
        for (let j = 0; j < nodes.length; j++) {
          if (j === sIdx) continue;
          const dist = Math.pow(nodes[j].x - source.x, 2) + Math.pow(nodes[j].y - source.y, 2);
          if (dist < bestDist) {
            bestDist = dist;
            bestTargetIdx = j;
          }
        }

        // Only build arc if reasonably close
        if (bestDist < 60000) {
          // Generate 4 lightning fracture points in 3D
          const target = nodes[bestTargetIdx];
          const points = [];
          for (let step = 0; step <= 4; step++) {
            const ratio = step / 4;
            const px = source.x + (target.x - source.x) * ratio + (Math.random() - 0.5) * 20;
            const py = source.y + (target.y - source.y) * ratio + (Math.random() - 0.5) * 20;
            const pz = source.z + (target.z - source.z) * ratio + (Math.random() - 0.5) * 15;
            points.push({ x: px, y: py, z: pz });
          }

          arcsRef.current.push({
            sourceIndex: sIdx,
            targetIndex: bestTargetIdx,
            life: 1.0,
            points
          });
        }
      }

      // Draw active synaptic lightning energy arcs
      const arcs = arcsRef.current;
      ctx.save();
      for (let i = arcs.length - 1; i >= 0; i--) {
        const arc = arcs[i];
        ctx.beginPath();
        let started = false;

        arc.points.forEach((p) => {
          const proj = project(p, cx, cy);
          if (proj) {
            if (!started) {
              ctx.moveTo(proj.x, proj.y);
              started = true;
            } else {
              ctx.lineTo(proj.x, proj.y);
            }
          }
        });

        // Decay life over frames for rapid flash synapse behavior
        if (isPlayingRef.current) {
          arc.life -= 0.12;
        }

        if (started) {
          ctx.strokeStyle = `rgba(167, 139, 250, ${arc.life * 0.75})`; // bright white-electric violet arc
          ctx.lineWidth = Math.random() * 2 + 1;
          ctx.shadowBlur = 8;
          ctx.shadowColor = "#8b5cf6";
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        if (arc.life <= 0) {
          arcs.splice(i, 1);
        }
      }
      ctx.restore();

      // Render Golden Quantum Sparks (Amber glowing debris particles)
      const sparks = sparksRef.current;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        if (isPlayingRef.current) {
          s.x += s.vx;
          s.y += s.vy;
          s.z += s.vz;
          s.life -= 0.025; // fade out life
        }

        const proj = project(s, cx, cy);
        if (proj && s.life > 0) {
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, s.size * proj.scale * s.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(245, 158, 11, ${s.life})`; // pure golden amber
          ctx.fill();
        }

        if (s.life <= 0) {
          sparks.splice(i, 1);
        }
      }

      // Render connecting quantum fibers
      const fibers = fibersRef.current;
      ctx.save();
      for (let i = 0; i < fibers.length; i++) {
        const fiber = fibers[i];
        const projSrc = project(fiber.source, cx, cy);
        const projTgt = project(fiber.target, cx, cy);

        if (projSrc && projTgt) {
          const avgZ = (projSrc.relativeZ + projTgt.relativeZ) / 2;
          const depthAlpha = Math.max(0, 1 - avgZ / depth3D);

          ctx.beginPath();
          ctx.moveTo(projSrc.x, projSrc.y);
          ctx.lineTo(projTgt.x, projTgt.y);

          // Electric matrix/cyan gradient stroke
          const isRes = resonanceActiveRef.current;
          ctx.strokeStyle = isRes 
            ? `rgba(236, 72, 153, ${depthAlpha * 0.28})` // pink discharge on resonance
            : `rgba(6, 182, 212, ${depthAlpha * 0.18})`; // cyan-blue glow
          ctx.lineWidth = Math.min(1.4, projSrc.scale * 0.45);
          ctx.stroke();

          // Render moving photon wave packets sliding down fibers
          if (isPlayingRef.current) {
            fiber.energyPos += fiber.energySpeed;
            if (fiber.energyPos > 1) fiber.energyPos = 0;
          }

          const ex = projSrc.x + (projTgt.x - projSrc.x) * fiber.energyPos;
          const ey = projSrc.y + (projTgt.y - projSrc.y) * fiber.energyPos;
          const eSize = Math.max(1.2, projSrc.scale * 1.5);

          ctx.beginPath();
          ctx.arc(ex, ey, eSize, 0, Math.PI * 2);
          ctx.fillStyle = isRes ? "#f59e0b" : "#f8fafc"; // Gold sparks or pure white packets
          ctx.fill();
        }
      }
      ctx.restore();

      // Render floating holographic mathematical matrices / equations
      const symbols = symbolsRef.current;
      ctx.save();
      ctx.font = "bold 11px 'JetBrains Mono', monospace";
      for (let i = 0; i < symbols.length; i++) {
        const sym = symbols[i];
        if (isPlayingRef.current) {
          sym.x += sym.vx;
          sym.y += sym.vy;
          sym.z += sym.vz;
        }

        const proj = project(sym, cx, cy);
        if (proj) {
          const depthAlpha = Math.max(0, 1 - proj.relativeZ / depth3D);
          ctx.fillStyle = `rgba(16, 185, 129, ${sym.alpha * depthAlpha * (resonanceActiveRef.current ? 1.6 : 1.0)})`;

          ctx.save();
          ctx.translate(proj.x, proj.y);
          ctx.scale(proj.scale * sym.scale * 0.55, proj.scale * sym.scale * 0.55);
          ctx.fillText(sym.text, 0, 0);
          ctx.restore();
        }

        // Recycle symbols passing camera boundary
        const relativeZ = (sym.z - cameraZRef.current) % depth3D;
        if (relativeZ < 10 || relativeZ > depth3D - 10) {
          sym.z = (cameraZRef.current + depth3D - Math.random() * 80) % depth3D;
        }
      }
      ctx.restore();

      // Update and render main synaptic nodes & their orbiting photons
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Anharmonic node heartbeat pulse
        node.pulsePhase += node.pulseSpeed;
        const pulseRatio = Math.sin(node.pulsePhase) * 0.22 + 0.95;

        // Apply spatial pointer deflection wave field
        const dx = node.x - mouseRef.current.x;
        const dy = node.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let deflectX = 0;
        let deflectY = 0;

        if (dist < 250) {
          const force = (250 - dist) / 250;
          deflectX = (dx / dist) * force * 24;
          deflectY = (dy / dist) * force * 24;
        }

        const finalPos = {
          x: node.baseX + deflectX,
          y: node.baseY + deflectY,
          z: node.z
        };

        const proj = project(finalPos, cx, cy);
        if (proj) {
          const depthAlpha = Math.max(0, 1 - proj.relativeZ / depth3D);
          const activeRadius = node.size * proj.scale * pulseRatio * (resonanceActiveRef.current ? 1.8 : 1.0);

          // Draw neon outer light glow
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, activeRadius, 0, Math.PI * 2);

          if (resonanceActiveRef.current) {
            ctx.fillStyle = "#fbbf24";
            ctx.shadowColor = "#fbbf24";
            ctx.shadowBlur = 14;
          } else {
            ctx.fillStyle = node.color;
            ctx.shadowColor = node.color;
            ctx.shadowBlur = Math.min(12, proj.scale * 4);
          }

          ctx.fill();
          ctx.shadowBlur = 0; // reset for optimization

          // Render orbiting tiny photons surrounding node core (thought vectors)
          if (isPlayingRef.current) {
            node.orbitPhase += node.orbitSpeed;
          }
          const ox = finalPos.x + Math.cos(node.orbitPhase) * node.orbitRadius;
          const oy = finalPos.y + Math.sin(node.orbitPhase) * node.orbitRadius;
          const projPhoton = project({ x: ox, y: oy, z: finalPos.z }, cx, cy);

          if (projPhoton) {
            ctx.beginPath();
            ctx.arc(projPhoton.x, projPhoton.y, Math.max(1, projPhoton.scale * 0.8), 0, Math.PI * 2);
            ctx.fillStyle = "rgba(248, 250, 252, 0.8)";
            ctx.fill();
          }
        }

        // Loop nodes passing camera Z boundary
        let relativeZ = (node.z - cameraZRef.current) % depth3D;
        if (relativeZ < 0) relativeZ += depth3D;

        if (relativeZ < 15) {
          node.z = cameraZRef.current + depth3D - Math.random() * 50;
        }
      }

      // Volumetric resonance expansion wave overlay
      if (resonanceActiveRef.current) {
        ctx.beginPath();
        ctx.arc(cx, cy, (frameCount % 110) * 5.2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(16, 185, 129, ${Math.max(0, 1 - (frameCount % 110) / 110) * 0.22})`;
        ctx.lineWidth = 3.5;
        ctx.stroke();
      }

      // 3. Simulated Lens Chromatic Aberration overlay filter at viewport edges
      ctx.fillStyle = "rgba(239, 68, 68, 0.012)"; // edge red split
      ctx.fillRect(0, 0, 14, canvas.height);
      ctx.fillRect(canvas.width - 14, 0, 14, canvas.height);
      ctx.fillStyle = "rgba(6, 182, 212, 0.012)"; // edge cyan split
      ctx.fillRect(0, 0, canvas.width, 10);
      ctx.fillRect(0, canvas.height - 10, canvas.width, 10);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [nodeDensity, resonanceActive, isAudioMuted]);

  // Cleanup synthesizer on component tear down
  useEffect(() => {
    return () => {
      stopAmbientSynth();
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans" ref={containerRef}>
      
      {/* Cinematic 3D Canvas screen container */}
      <div className="relative h-[420px] w-full bg-black overflow-hidden border-b border-slate-900 group">
        <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair" />

        {/* Matrix Futuristic HUD Telemetry overlay left */}
        <div className="absolute top-4 left-4 p-3 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl space-y-1.5 font-mono text-[10px] text-slate-300 pointer-events-none select-none max-w-xs shadow-2xl">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>
            <span>SYSTEM CONSCIOUSNESS STATE: ACTIVE</span>
          </div>
          <div className="space-y-0.5 border-t border-slate-800 pt-1.5 text-slate-400">
            <div>D-DOLLY_PROP: <span className="text-white font-bold">{(cameraZRef.current).toFixed(1)} mm</span></div>
            <div>SYNAPTIC_NODES: <span className="text-emerald-400">{nodeDensity} CORES</span></div>
            <div>PHYSICS_RESOLVE: <span className="text-cyan-400">SPRING_DEFLECTION</span></div>
            <div>QUANTUM_MODULATION: <span className="text-purple-400">ASYNC_DEVIATE</span></div>
            <div>FPS_LOCK: <span className="text-white">60.0 FPS [STABLE]</span></div>
          </div>
        </div>

        {/* Matrix Futuristic HUD Telemetry overlay right */}
        <div className="absolute top-4 right-4 p-3 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl space-y-1 font-mono text-[10px] text-slate-300 pointer-events-none select-none hidden md:block max-w-xs shadow-2xl">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>NVIDIA OMNIVERSE STENCIL</span>
          </div>
          <div className="space-y-0.5 border-t border-slate-800 pt-1.5 text-slate-400">
            <div>MATRIX_STATION: <span className="text-white">INFINITE_SPACE</span></div>
            <div>GLOBAL_ILLUM: <span className="text-emerald-400">RAY_TRACED_AMBIENT</span></div>
            <div>VOLUMETRIC_FOG: <span className="text-emerald-400">ENABLED (0.18)</span></div>
            <div>CH_ABERRATION: <span className="text-red-400">0.05 SPLIT</span></div>
          </div>
        </div>

        {/* Ethereal Watermark Bottom Left */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[9px] font-mono text-slate-500 pointer-events-none">
          <span className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400 uppercase">OS_LAYER_3</span>
          <span>// INFINITE LIVING ARTIFICIAL INTELLIGENCE CONSCIOUSNESS</span>
        </div>

        {/* Active Thought notification toast bottom-right */}
        <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-800 text-[10px] font-mono text-emerald-400 animate-bounce pointer-events-none hidden sm:flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>THOUGHT_PROPAGATION: {Math.floor((Date.now() / 150) % 899 + 100)} T_FLOPS</span>
        </div>
      </div>

      {/* Controller cockpit dashboard */}
      <div className="p-4 bg-slate-900/40 space-y-4 border-t border-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-850">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <div>
              <h5 className="text-xs font-bold font-display text-white">Quantum Core Controller Deck</h5>
              <p className="text-[10px] text-slate-400 font-sans">Fine-tune holographic parameters and dimensional warp forces</p>
            </div>
          </div>

          {/* Action buttons panel */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Play/Pause camera movement */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-mono"
              title={isPlaying ? "Freeze cinematic camera forward travel" : "Resume slow cinematic dolly"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-blue-400 animate-pulse" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              {isPlaying ? "FREEZE CAMERA" : "RESUME CAMERA"}
            </button>

            {/* Resonance shockwave sweep */}
            <button
              onClick={triggerResonance}
              className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-950"
              title="Discharge a radial quantum expansion wave and golden particles"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-300 animate-bounce" />
              RESONANCE SWEEP
            </button>

            {/* Synthesizer on/off soundscape */}
            <button
              onClick={toggleAudio}
              className={`p-2 rounded-lg border text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${
                isAudioMuted
                  ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  : "bg-blue-600/15 border-blue-500/20 text-blue-400 font-bold shadow-lg"
              }`}
              title="Activate background soundscape synthesized live in Web Audio API"
            >
              {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-blue-400 animate-pulse" />}
              AI AMBIENCE
            </button>
          </div>
        </div>

        {/* Configurations sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Dolly velocity slider */}
          <div className="p-3 bg-slate-950/30 rounded-xl border border-slate-850 space-y-2">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>CAMERA DOLLY VELOCITY (SPEED)</span>
              <span className="text-blue-400 font-bold">{cameraSpeed}x</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={cameraSpeed}
              onChange={(e) => setCameraSpeed(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
            />
            <span className="text-[9px] text-slate-500 block font-sans">Adjusts forward movement speed through the endless procedural structures</span>
          </div>

          {/* Density of synaptic points slider */}
          <div className="p-3 bg-slate-950/30 rounded-xl border border-slate-850 space-y-2">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>SYNAPTIC CORE POINTS (DENSITY)</span>
              <span className="text-emerald-400 font-bold">{nodeDensity} CORES</span>
            </div>
            <input
              type="range"
              min="50"
              max="200"
              step="10"
              value={nodeDensity}
              onChange={(e) => setNodeDensity(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
            />
            <span className="text-[9px] text-slate-500 block font-sans">Increases the density of 3D nodes and their connected quantum fibers</span>
          </div>

        </div>

        {/* Deflection force explanation notice */}
        <div className="p-3 rounded-lg bg-slate-950/20 border border-slate-850 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
          <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
            <strong>Intelligent Interaction Deck:</strong> Moving your mouse pointer over the interactive viewport emits an invisible gravitational deflection field. This bends space, deflecting and warping nodes and orbiting thoughts locally in real-time. Turn on **AI AMBIENCE** to experience a live-synthesized sub-bass soundscape representing active computational thoughts!
          </p>
        </div>
      </div>

    </div>
  );
}
