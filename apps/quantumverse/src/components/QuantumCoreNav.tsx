import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Orbit, Cpu, Sparkles, Activity, ShieldCheck, HelpCircle, 
  LayoutDashboard, BookOpen, Microscope, Brain, FileText, 
  Clock, Play, Pause, RotateCcw, ZoomIn, ZoomOut, Compass, HelpCircle as HelpIcon, Flame
} from "lucide-react";
import { audioService } from "../utils/audioService";
import PhotonButton from "./PhotonButton";

export type VisualizationMode = 
  | "bohr" 
  | "cloud" 
  | "wavefunction" 
  | "bloch" 
  | "lattice" 
  | "circuit" 
  | "photon" 
  | "spin";

interface QuantumCoreNavProps {
  activeModule: string;
  onNavigate: (module: string) => void;
  transitionState: string;
}

interface OrbitalModule {
  id: string;
  name: string;
  shortDesc: string;
  icon: React.ComponentType<any>;
  orbitRadius: number; // concentric orbit levels
  speed: number;       // base rotational speed
  color: string;
  glowColor: string;
  phaseOffset: number; // initial orbital position
}

export default function QuantumCoreNav({
  activeModule,
  onNavigate,
  transitionState
}: QuantumCoreNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Core Visual configuration states
  const [visMode, setVisMode] = useState<VisualizationMode>("bohr");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(1.0);
  const [rotation, setRotation] = useState<{ pitch: number; yaw: number }>({ pitch: 0.3, yaw: 0.5 });
  const [selectedOrbitShell, setSelectedOrbitShell] = useState<number | null>(null);

  // Hover state for modules
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  // Dragging states for 3D navigation
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Concentric modules layout config
  const modulesList: OrbitalModule[] = [
    { id: "mentor", name: "AI Mentor", shortDesc: "Real-time Dirac GPT feedback and quantum concept decoding", icon: Brain, orbitRadius: 105, speed: 0.006, color: "rgba(189, 0, 255, 0.85)", glowColor: "#bd00ff", phaseOffset: 0.2 },
    { id: "dashboard", name: "Dashboard", shortDesc: "Main observatory hub, telemetry stats, and lab calibration reports", icon: LayoutDashboard, orbitRadius: 135, speed: 0.004, color: "rgba(0, 243, 255, 0.85)", glowColor: "#00f3ff", phaseOffset: 1.5 },
    { id: "sims", name: "Virtual Lab", shortDesc: "Interactive particle accelerators, wave chambers, and potential wells", icon: Microscope, orbitRadius: 175, speed: 0.003, color: "rgba(34, 197, 94, 0.85)", glowColor: "#22c55e", phaseOffset: 2.8 },
    { id: "quiz", name: "Quiz Arena", shortDesc: "Challenge quantum mechanics, orbital mechanics, and quantum computing", icon: Cpu, orbitRadius: 175, speed: 0.003, color: "rgba(239, 68, 68, 0.85)", glowColor: "#ef4444", phaseOffset: 2.8 + Math.PI },
    { id: "hub", name: "Learning Hub", shortDesc: "Curated curriculum on quantum mechanics and particle physics", icon: BookOpen, orbitRadius: 215, speed: 0.002, color: "rgba(245, 158, 11, 0.85)", glowColor: "#f59e0b", phaseOffset: 4.1 },
    { id: "playground", name: "Q-Computing", shortDesc: "Visual quantum gate composer, Bloch sphere, and circuit compiler", icon: Sparkles, orbitRadius: 215, speed: 0.002, color: "rgba(99, 102, 241, 0.85)", glowColor: "#6366f1", phaseOffset: 4.1 + Math.PI },
    { id: "journal", name: "Discovery Journal", shortDesc: "Record hypothesis logs, track insights, and claim research credentials", icon: FileText, orbitRadius: 255, speed: 0.0015, color: "rgba(236, 72, 153, 0.85)", glowColor: "#ec4899", phaseOffset: 5.4 },
    { id: "timeline", name: "Timeline Archive", shortDesc: "Historic scientific discoveries and key quantum breakthroughs", icon: Clock, orbitRadius: 295, speed: 0.001, color: "rgba(168, 85, 247, 0.85)", glowColor: "#a855f7", phaseOffset: 0.8 },
    { id: "trust", name: "Trust Center", shortDesc: "Audit security protocols, encryption logs, and system standards", icon: ShieldCheck, orbitRadius: 295, speed: 0.001, color: "rgba(16, 185, 129, 0.85)", glowColor: "#10b981", phaseOffset: 0.8 + Math.PI },
  ];

  // Track rotational angles dynamically to prevent snap jumps
  const phasesRef = useRef<Record<string, number>>({});
  useEffect(() => {
    modulesList.forEach((m) => {
      phasesRef.current[m.id] = m.phaseOffset;
    });
  }, []);

  // Spatial Audio panning based on module positions
  const updateSpatialAudioForModule = (modId: string, angle: number, radius: number) => {
    // Convert polar to normalized Cartesian coordinates (-1 to +1)
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    audioService.updateSpatialPanning(x * (radius / 300), y * (radius / 300));
  };

  // Canvas animation core loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let width = canvas.parentElement?.clientWidth || 700;
    let height = canvas.parentElement?.clientHeight || 600;

    const setupCanvasSize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.parentElement.clientWidth;
        height = canvas.parentElement.clientHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
    };
    setupCanvasSize();

    const handleResize = () => {
      setupCanvasSize();
    };
    window.addEventListener("resize", handleResize);

    let animationId: number;
    let time = 0;

    // 3D coordinate projection function
    const project3D = (x: number, y: number, z: number) => {
      const cosP = Math.cos(rotation.pitch);
      const sinP = Math.sin(rotation.pitch);
      const y1 = y * cosP - z * sinP;
      const z1 = y * sinP + z * cosP;

      const cosY = Math.cos(rotation.yaw);
      const sinY = Math.sin(rotation.yaw);
      const x2 = x * cosY + z1 * sinY;
      const z2 = -x * sinY + z1 * cosY;

      // Camera projection variables
      const cx = width / 2;
      const cy = height / 2;
      const distance = 380;
      const fov = 280;
      const scale = (fov / (distance + z2)) * zoom;

      return {
        x: cx + x2 * scale,
        y: cy + y1 * scale,
        z: z2,
        scale
      };
    };

    // Pre-generate stable quantum probability cloud coordinates (reusable random fields)
    const cloudPoints: { x: number; y: number; z: number; phase: number }[] = [];
    for (let i = 0; i < 350; i++) {
      // Hydrogen 2p_z orbital mathematical shape representation
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;
      // Probabilistic lobes matching absolute values of wavefunction
      const r = (Math.pow(Math.random(), 1.5) * 60 + 10) * (Math.abs(Math.cos(theta)) + 0.3);
      cloudPoints.push({
        x: r * Math.sin(theta) * Math.cos(phi),
        y: r * Math.sin(theta) * Math.sin(phi),
        z: r * Math.cos(theta),
        phase: Math.random() * Math.PI * 2
      });
    }

    // Pre-generate stable quantum lattice coordinate matrices
    const latticeNodes: { x: number; y: number; z: number }[] = [];
    const latticeSize = 2; // grid width/height
    const spacing = 45;
    for (let dx = -latticeSize; dx <= latticeSize; dx++) {
      for (let dy = -latticeSize; dy <= latticeSize; dy++) {
        for (let dz = -latticeSize; dz <= latticeSize; dz++) {
          // Sphere restriction to mimic crystal grain boundary
          if (Math.hypot(dx, dy, dz) <= latticeSize) {
            latticeNodes.push({
              x: dx * spacing,
              y: dy * spacing,
              z: dz * spacing
            });
          }
        }
      }
    }

    // Pre-generate quantum circuit gates positions
    const circuitPoints: { wire: number; gate: string; t: number }[] = [
      { wire: -40, gate: "H", t: 0.1 },
      { wire: -40, gate: "X", t: 0.4 },
      { wire: 0, gate: "H", t: 0.25 },
      { wire: 0, gate: "CNOT_C", t: 0.6 },
      { wire: 40, gate: "CNOT_T", t: 0.6 },
      { wire: 40, gate: "Z", t: 0.8 },
    ];

    // Master render routine
    const render = () => {
      ctx.save();
      ctx.scale(dpr, dpr);

      if (isPlaying) {
        time += 0.02;
      }

      // Draw beautiful dark sci-fi background inside the local viewport
      ctx.fillStyle = "rgba(5, 8, 22, 0.18)"; // clean translucent fading paths
      ctx.fillRect(0, 0, width, height);

      // Cybernetic grid floor lines (holographic ground plane)
      ctx.strokeStyle = "rgba(0, 243, 255, 0.015)";
      ctx.lineWidth = 0.5;
      for (let i = -10; i <= 10; i++) {
        // Horizontal coordinates
        const pStartH = project3D(-250, 150, i * 50);
        const pEndH = project3D(250, 150, i * 50);
        ctx.beginPath();
        ctx.moveTo(pStartH.x, pStartH.y);
        ctx.lineTo(pEndH.x, pEndH.y);
        ctx.stroke();

        // Vertical coordinates
        const pStartV = project3D(i * 50, 150, -250);
        const pEndV = project3D(i * 50, 150, 250);
        ctx.beginPath();
        ctx.moveTo(pStartV.x, pStartV.y);
        ctx.lineTo(pEndV.x, pEndV.y);
        ctx.stroke();
      }

      // Dynamic central focal center
      const cx = width / 2;
      const cy = height / 2;

      // ----------------------------------------------------
      // DRAW 1. ACTIVE CORE MODULES AND ORBITAL NAVIGATION
      // ----------------------------------------------------
      modulesList.forEach((m) => {
        // Dynamically increment orbital angles
        if (isPlaying) {
          const isHovered = hoveredModule === m.id;
          const isActive = activeModule === m.id;
          
          // Slow down orbits of hovered elements for precision clicks
          let speedFactor = m.speed;
          if (isHovered) speedFactor *= 0.15;
          else if (isActive) speedFactor *= 0.4; // selected orbits are more stable

          phasesRef.current[m.id] += speedFactor;
        }

        const angle = phasesRef.current[m.id];
        let radius = m.orbitRadius;

        // Visual expansion of active or hovered shells
        const isHoveredShell = hoveredModule === m.id;
        const isActiveShell = activeModule === m.id;
        if (isActiveShell) {
          radius += 18; // swell active orbit
        } else if (isHoveredShell) {
          radius += 8;
        }

        // Draw Orbiting Paths
        ctx.beginPath();
        ctx.lineWidth = isActiveShell ? 1.5 : isHoveredShell ? 1.0 : 0.6;
        
        let pathGlow = `rgba(255,255,255,0.035)`;
        if (isActiveShell) {
          pathGlow = `${m.color.replace("0.85", "0.35")}`;
        } else if (isHoveredShell) {
          pathGlow = `${m.color.replace("0.85", "0.2")}`;
        }
        ctx.strokeStyle = pathGlow;

        // Draw Projected 3D Circle
        let firstPoint = true;
        for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.08) {
          const px = Math.cos(a) * radius;
          const pz = Math.sin(a) * radius;
          const p = project3D(px, 0, pz);

          if (firstPoint) {
            ctx.moveTo(p.x, p.y);
            firstPoint = false;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();

        // Calculate current 3D node coordinates
        const nodeX3D = Math.cos(angle) * radius;
        const nodeZ3D = Math.sin(angle) * radius;
        const nodePos = project3D(nodeX3D, 0, nodeZ3D);

        // Update spatial panning parameters periodically
        if (isActiveShell) {
          updateSpatialAudioForModule(m.id, angle, radius);
        }

        // Animated Energy Filament (Warp filaments linking Core to the Node)
        ctx.beginPath();
        ctx.lineWidth = isActiveShell ? 0.9 : 0.4;
        ctx.strokeStyle = isActiveShell ? m.color : "rgba(0, 243, 255, 0.08)";
        const corePos = project3D(0, 0, 0);
        ctx.moveTo(corePos.x, corePos.y);
        
        // Quad curve to add nice organic sweep curvature
        const controlX = (corePos.x + nodePos.x) / 2 + Math.sin(time + radius) * 20;
        const controlY = (corePos.y + nodePos.y) / 2 - 20;
        ctx.quadraticCurveTo(controlX, controlY, nodePos.x, nodePos.y);
        ctx.stroke();

        // Draw sliding energy particles on filaments
        if (isPlaying) {
          const progress = (time * 0.45 + radius * 0.1) % 1.0;
          const px = corePos.x + (nodePos.x - corePos.x) * progress + Math.sin(progress * Math.PI) * 10;
          const py = corePos.y + (nodePos.y - corePos.y) * progress - Math.sin(progress * Math.PI) * 15;
          
          ctx.fillStyle = m.color;
          ctx.shadowBlur = 6;
          ctx.shadowColor = m.glowColor;
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Draw Interactive Orbital Luminous Node
        const sizeMultiplier = isActiveShell ? 1.15 : isHoveredShell ? 1.05 : 0.95;
        const nodeSize = 14 * sizeMultiplier * nodePos.scale;

        // Base circular gradient representing holographic light particle
        const nodeGrad = ctx.createRadialGradient(
          nodePos.x, nodePos.y, 0,
          nodePos.x, nodePos.y, nodeSize
        );
        nodeGrad.addColorStop(0, "#ffffff");
        nodeGrad.addColorStop(0.3, m.color);
        nodeGrad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = nodeGrad;
        ctx.shadowBlur = isHoveredShell || isActiveShell ? 18 : 6;
        ctx.shadowColor = m.glowColor;
        ctx.beginPath();
        ctx.arc(nodePos.x, nodePos.y, nodeSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Node Border Frame Ring
        ctx.strokeStyle = isActiveShell ? m.color : isHoveredShell ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.15)";
        ctx.lineWidth = isActiveShell ? 1.8 : 0.8;
        ctx.beginPath();
        ctx.arc(nodePos.x, nodePos.y, nodeSize + 4, 0, Math.PI * 2);
        ctx.stroke();

        // Draw beautiful micro outer orbit dots on node rings
        const dotAngle = time * (isActiveShell ? 4 : 2);
        const dx = nodePos.x + Math.cos(dotAngle) * (nodeSize + 4);
        const dy = nodePos.y + Math.sin(dotAngle) * (nodeSize + 4);
        ctx.fillStyle = m.glowColor;
        ctx.beginPath();
        ctx.arc(dx, dy, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Draw Module Label directly on canvas
        if (nodePos.scale > 0.4) {
          ctx.fillStyle = isActiveShell ? "#ffffff" : isHoveredShell ? "rgba(0, 243, 255, 0.9)" : "rgba(255,255,255,0.5)";
          ctx.font = `bold ${isActiveShell ? "10px" : "9px"} monospace`;
          ctx.textAlign = "center";
          ctx.fillText(m.name.toUpperCase(), nodePos.x, nodePos.y + nodeSize + 16);
        }
      });

      // ----------------------------------------------------
      // DRAW 2. CENTRAL QUANTUM CORE VISUALIZATION MODES
      // ----------------------------------------------------
      const coreCenter = project3D(0, 0, 0);

      // Render Active Mode
      if (visMode === "bohr") {
        // Concentric Bohr quantum orbital atomic rings
        const shells = [25, 45, 65];
        shells.forEach((sRadius, idx) => {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 243, 255, ${0.15 - idx * 0.03})`;
          ctx.lineWidth = 1.0;
          
          let firstP = true;
          for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.1) {
            const px = Math.cos(a) * sRadius;
            const pz = Math.sin(a) * sRadius;
            const p = project3D(px, 0, pz);
            if (firstP) {
              ctx.moveTo(p.x, p.y);
              firstP = false;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          }
          ctx.stroke();

          // Orbiting coherent electron particles
          const eAngle = time * (3 - idx) * 0.8;
          const ex = Math.cos(eAngle) * sRadius;
          const ez = Math.sin(eAngle) * sRadius;
          const ep = project3D(ex, 0, ez);

          ctx.fillStyle = "#ffffff";
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#00f3ff";
          ctx.beginPath();
          ctx.arc(ep.x, ep.y, 3 * ep.scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Wavefunction crest packet glow
          ctx.strokeStyle = "rgba(0, 243, 255, 0.4)";
          ctx.beginPath();
          ctx.arc(ep.x, ep.y, 6 * ep.scale, 0, Math.PI * 2);
          ctx.stroke();
        });
      } 
      else if (visMode === "cloud") {
        // Probabilistic Electron Wave Cloud (dense particles)
        cloudPoints.forEach((pt) => {
          // Dynamic breathing vibration
          const wave = Math.sin(time * 2.0 + pt.phase) * 1.5;
          const x = pt.x + wave * (pt.x / 40);
          const y = pt.y + wave * (pt.y / 40);
          const z = pt.z + wave * (pt.z / 40);

          const p = project3D(x, y, z);

          // Energy coloration based on distance
          const dist = Math.hypot(pt.x, pt.y, pt.z);
          const alpha = Math.max(0.08, (1.0 - dist / 75) * 0.65);
          
          ctx.fillStyle = dist < 25 ? `rgba(255, 255, 255, ${alpha})` : dist < 45 ? `rgba(0, 243, 255, ${alpha})` : `rgba(189, 0, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.2 * p.scale, 0, Math.PI * 2);
          ctx.fill();
        });
      } 
      else if (visMode === "wavefunction") {
        // Interconnected sinusoidal quantum wave harmonics
        ctx.beginPath();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = "rgba(0, 243, 255, 0.7)";
        let firstP = true;

        for (let angle = -Math.PI * 2; angle <= Math.PI * 2; angle += 0.1) {
          // Curving quantum helix wave
          const radius = 35;
          const amp = 15;
          const k = 4.0; // wave wavenumber
          const wavePhase = angle * k - time * 3.5;
          
          const x = Math.cos(angle) * radius;
          const y = Math.sin(wavePhase) * amp;
          const z = Math.sin(angle) * radius;

          const p = project3D(x, y, z);
          if (firstP) {
            ctx.moveTo(p.x, p.y);
            firstP = false;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();

        // Wave packets
        for (let i = 0; i < 4; i++) {
          const packAngle = -Math.PI * 2 + (i / 3) * Math.PI * 4 + Math.sin(time) * 0.5;
          const radius = 35;
          const wavePhase = packAngle * 4.0 - time * 3.5;
          const x = Math.cos(packAngle) * radius;
          const y = Math.sin(wavePhase) * 15;
          const z = Math.sin(packAngle) * radius;
          const p = project3D(x, y, z);

          ctx.fillStyle = "#ffffff";
          ctx.shadowBlur = 8;
          ctx.shadowColor = "#00f3ff";
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3 * p.scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      } 
      else if (visMode === "bloch") {
        // Bloch Sphere qubit state representative
        const sRad = 55;
        
        // Draw latitude and longitude spherical grids
        ctx.strokeStyle = "rgba(0, 243, 255, 0.12)";
        ctx.lineWidth = 0.8;
        
        // Draw main equator
        ctx.beginPath();
        let firstP = true;
        for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.1) {
          const p = project3D(Math.cos(a) * sRad, 0, Math.sin(a) * sRad);
          if (firstP) { ctx.moveTo(p.x, p.y); firstP = false; }
          else { ctx.lineTo(p.x, p.y); }
        }
        ctx.stroke();

        // Draw vertical pole ring
        ctx.beginPath();
        firstP = true;
        for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.1) {
          const p = project3D(0, Math.cos(a) * sRad, Math.sin(a) * sRad);
          if (firstP) { ctx.moveTo(p.x, p.y); firstP = false; }
          else { ctx.lineTo(p.x, p.y); }
        }
        ctx.stroke();

        // Draw main Z-axis lines
        const pole0 = project3D(0, -sRad, 0);
        const pole1 = project3D(0, sRad, 0);
        ctx.strokeStyle = "rgba(189, 0, 255, 0.4)";
        ctx.beginPath();
        ctx.moveTo(pole0.x, pole0.y);
        ctx.lineTo(pole1.x, pole1.y);
        ctx.stroke();

        // Draw Pole Labels (|0> and |1>)
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText("|0⟩ (NORTH)", pole0.x, pole0.y - 6);
        ctx.fillText("|1⟩ (SOUTH)", pole1.x, pole1.y + 12);

        // State vector calculations (Quantum Precession)
        const theta = 1.1 + Math.sin(time * 0.6) * 0.4; // superposition theta angle
        const phi = time * 0.8;                         // phase rotation
        const sx = sRad * Math.sin(theta) * Math.cos(phi);
        const sy = sRad * Math.cos(theta); // Y is vertical in projection
        const sz = sRad * Math.sin(theta) * Math.sin(phi);

        const sPos = project3D(sx, sy, sz);

        // Draw dynamic state arrow line
        ctx.strokeStyle = "#00f3ff";
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(coreCenter.x, coreCenter.y);
        ctx.lineTo(sPos.x, sPos.y);
        ctx.stroke();

        // Vector state ball
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#bd00ff";
        ctx.beginPath();
        ctx.arc(sPos.x, sPos.y, 4 * sPos.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label $|ψ>$ state
        ctx.fillStyle = "#00f3ff";
        ctx.font = "bold 8px monospace";
        ctx.fillText("|Ψ⟩", sPos.x + 10, sPos.y - 4);
      } 
      else if (visMode === "lattice") {
        // Crystalline Quantum Solid Lattice Matrix
        latticeNodes.forEach((node) => {
          // Dynamic thermal/quantum displacement vibration
          const rx = node.x + Math.sin(time * 5.0 + node.y) * 1.5;
          const ry = node.y + Math.cos(time * 4.0 + node.x) * 1.5;
          const rz = node.z + Math.sin(time * 3.5 + node.z) * 1.5;

          const p = project3D(rx, ry, rz);

          // Draw connections to neighboring nodes (lattice bonds)
          ctx.strokeStyle = "rgba(0, 243, 255, 0.06)";
          ctx.lineWidth = 0.5;
          latticeNodes.forEach((n2) => {
            const dist = Math.hypot(node.x - n2.x, node.y - n2.y, node.z - n2.z);
            if (dist > 0 && dist < 55) { // nearest-neighbor check
              const p2 = project3D(n2.x, n2.y, n2.z);
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          });

          // Draw atomic mesh point nodes
          ctx.fillStyle = "rgba(0, 243, 255, 0.55)";
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.2 * p.scale, 0, Math.PI * 2);
          ctx.fill();
        });
      } 
      else if (visMode === "circuit") {
        // Qubit Circuit timelines and gate matrices
        const wires = [-40, 0, 40];
        
        // Draw 3 qubit wires
        wires.forEach((wy) => {
          const startP = project3D(-75, wy, 0);
          const endP = project3D(75, wy, 0);

          ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo(startP.x, startP.y);
          ctx.lineTo(endP.x, endP.y);
          ctx.stroke();
        });

        // Draw floating gates
        circuitPoints.forEach((g) => {
          const gx = -75 + g.t * 150;
          const p = project3D(gx, g.wire, 0);

          // Render Gate block
          const size = 12 * p.scale;
          ctx.fillStyle = g.gate.startsWith("CNOT") ? "rgba(189, 0, 255, 0.35)" : "rgba(0, 243, 255, 0.25)";
          ctx.strokeStyle = g.gate.startsWith("CNOT") ? "#bd00ff" : "#00f3ff";
          ctx.lineWidth = 1.0;
          ctx.fillRect(p.x - size, p.y - size, size * 2, size * 2);
          ctx.strokeRect(p.x - size, p.y - size, size * 2, size * 2);

          // Letter Label
          ctx.fillStyle = "#ffffff";
          ctx.font = `bold ${Math.round(8 * p.scale)}px monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(g.gate.slice(0, 1), p.x, p.y);
          ctx.textBaseline = "alphabetic";
        });

        // Sliding wave-packet pulses representing coherent calculations
        const pulseT = (time * 0.15) % 1.0;
        const px = -75 + pulseT * 150;
        wires.forEach((wy) => {
          const p = project3D(px, wy, 0);
          ctx.fillStyle = "#00f3ff";
          ctx.shadowBlur = 8;
          ctx.shadowColor = "#00f3ff";
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.5 * p.scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      } 
      else if (visMode === "photon") {
        // Photon Electromagnet Wave Polarization fields
        ctx.beginPath();
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = "rgba(189, 0, 255, 0.55)";
        
        let firstP = true;
        for (let xCoord = -60; xCoord <= 60; xCoord += 2) {
          const wavePhase = xCoord * 0.1 - time * 3.0;
          // Entangled polarization field vertical vectors
          const y = Math.sin(wavePhase) * 20;
          const p = project3D(xCoord, y, 0);

          if (firstP) {
            ctx.moveTo(p.x, p.y);
            firstP = false;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();

        // Entangled peer channel
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0, 243, 255, 0.45)";
        firstP = true;
        for (let xCoord = -60; xCoord <= 60; xCoord += 2) {
          const wavePhase = xCoord * 0.1 - time * 3.0 + Math.PI; // inverse entangling phase
          const z = Math.sin(wavePhase) * 20;
          const p = project3D(xCoord, 0, z); // 90 deg polarized

          if (firstP) {
            ctx.moveTo(p.x, p.y);
            firstP = false;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();

        // Center particle
        const p1 = project3D(Math.sin(time * 2) * 25, 0, 0);
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#00f3ff";
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      } 
      else if (visMode === "spin") {
        // Electron Dipole Spin Up and Down representing Precession
        const dipoles = [
          { x: -30, dy: -15, label: "SPIN_UP", color: "#00f3ff" },
          { x: 30, dy: 15, label: "SPIN_DOWN", color: "#bd00ff" }
        ];

        dipoles.forEach((dp) => {
          const dCenter = project3D(dp.x, 0, 0);
          
          // Spin axis precession cones
          ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          
          let firstP = true;
          for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.1) {
            const rx = dp.x + Math.cos(a) * 12;
            const rz = Math.sin(a) * 12;
            const p = project3D(rx, dp.dy, rz);
            if (firstP) { ctx.moveTo(p.x, p.y); firstP = false; }
            else { ctx.lineTo(p.x, p.y); }
          }
          ctx.stroke();

          // Rotating spin pointer
          const spAngle = time * 2.2;
          const sx = dp.x + Math.cos(spAngle) * 12;
          const sy = dp.dy;
          const sz = Math.sin(spAngle) * 12;

          const arrowTip = project3D(sx, sy, sz);

          // Vector Line
          ctx.strokeStyle = dp.color;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(dCenter.x, dCenter.y);
          ctx.lineTo(arrowTip.x, arrowTip.y);
          ctx.stroke();

          // Arrow tip bead
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(arrowTip.x, arrowTip.y, 3 * arrowTip.scale, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // ----------------------------------------------------
      // DRAW 3. CENTRAL ATOMIC NUCLEUS REACTOR SHIELD
      // ----------------------------------------------------
      ctx.shadowBlur = 14;
      ctx.shadowColor = visMode === "bloch" || visMode === "spin" ? "#bd00ff" : "#00f3ff";

      const pulseCore = 1.0 + Math.sin(time * 3.0) * 0.08;
      const coreGrad = ctx.createRadialGradient(
        coreCenter.x, coreCenter.y, 2,
        coreCenter.x, coreCenter.y, 18 * pulseCore * coreCenter.scale
      );
      coreGrad.addColorStop(0, "#ffffff");
      coreGrad.addColorStop(0.3, "rgba(0, 243, 255, 0.85)");
      coreGrad.addColorStop(0.7, "rgba(189, 0, 255, 0.3)");
      coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(coreCenter.x, coreCenter.y, 18 * pulseCore * coreCenter.scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Outer plasma ring boundary
      ctx.strokeStyle = "rgba(0, 243, 255, 0.25)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(coreCenter.x, coreCenter.y, 26 * pulseCore * coreCenter.scale, 0, Math.PI * 2);
      ctx.stroke();

      // Floating quantum energy sparks emitted from reactor center
      if (isPlaying && Math.random() < 0.15) {
        const theta = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 2;
        const size = Math.random() * 2 + 1;
        const color = Math.random() > 0.5 ? "#00f3ff" : "#bd00ff";
        
        // Push a short burst animation
        let sparkLife = 0;
        const maxSparkLife = 20;
        const renderSpark = () => {
          sparkLife++;
          const dist = sparkLife * speed;
          const sx = Math.cos(theta) * dist;
          const sy = Math.sin(theta) * dist;
          const sp = project3D(sx, sy, 0);

          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, size * (1 - sparkLife / maxSparkLife), 0, Math.PI * 2);
          ctx.fill();

          if (sparkLife < maxSparkLife) {
            requestAnimationFrame(renderSpark);
          }
        };
        renderSpark();
      }
      
      ctx.restore();
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [visMode, isPlaying, zoom, rotation, activeModule, hoveredModule]);

  // Handle Dragging to rotate camera in 3D
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    audioService.playPressed("haptic");
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check hover bounds for orbital nodes
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // 1. Mouse Drag Camera Rotate
    if (isDraggingRef.current) {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;

      setRotation((prev) => ({
        yaw: prev.yaw + dx * 0.007,
        pitch: Math.max(-1.4, Math.min(1.4, prev.pitch + dy * 0.007))
      }));

      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    // 2. Node Hover Detection (3D projection alignment check)
    let foundHoveredId: string | null = null;
    const fov = 280;
    const distance = 380;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    for (let i = 0; i < modulesList.length; i++) {
      const m = modulesList[i];
      const angle = phasesRef.current[m.id] || m.phaseOffset;
      let radius = m.orbitRadius;
      if (activeModule === m.id) radius += 18;

      const nodeX3D = Math.cos(angle) * radius;
      const nodeZ3D = Math.sin(angle) * radius;

      // Project manual formula matching the loop projection
      const cosP = Math.cos(rotation.pitch);
      const sinP = Math.sin(rotation.pitch);
      const y1 = -0 * sinP;
      const z1 = nodeZ3D * cosP;

      const cosY = Math.cos(rotation.yaw);
      const sinY = Math.sin(rotation.yaw);
      const x2 = nodeX3D * cosY + z1 * sinY;
      const z2 = -nodeX3D * sinY + z1 * cosY;

      const scale = (fov / (distance + z2)) * zoom;
      const projX = cx + x2 * scale;
      const projY = cy + y1 * scale;

      const mouseNodeDist = Math.hypot(mx - projX, my - projY);
      const nodeSize = 14 * scale;

      if (mouseNodeDist < nodeSize + 12) {
        foundHoveredId = m.id;
        break;
      }
    }

    if (foundHoveredId !== hoveredModule) {
      setHoveredModule(foundHoveredId);
      if (foundHoveredId) {
        audioService.playHover("sparkle", 0.35);
      }
    }
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (hoveredModule) {
      audioService.playClick("pulse");
      onNavigate(hoveredModule);
    }
  };

  // Switch modes confirmation sound
  const handleModeChange = (mode: VisualizationMode) => {
    setVisMode(mode);
    audioService.playCalibration(
      mode === "bohr" ? "wave" : mode === "circuit" ? "database" : mode === "cloud" ? "simulator" : "engine"
    );
  };

  return (
    <div className="relative w-full h-[480px] md:h-[580px] bg-slate-950/30 rounded-2xl border border-white/5 overflow-hidden flex flex-col justify-between select-none">
      
      {/* Background radial space lighting */}
      <div className="absolute inset-0 bg-radial-gradient from-cyan-glow/5 via-transparent to-transparent pointer-events-none" />

      {/* 1. Header HUD Diagnostic Overlay */}
      <div className="relative z-20 px-4 pt-3 flex items-center justify-between pointer-events-none">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <Orbit className="w-4 h-4 text-cyan-glow animate-spin-slow" />
            <span className="font-display font-bold text-[10px] md:text-xs uppercase tracking-widest text-white">
              COHERENT QUANTUM CORE REACTOR
            </span>
          </div>
          <p className="text-[9px] font-mono text-slate-400">
            RAD_SHELL: {visMode.toUpperCase()} | SYSTEM_PITCH: {rotation.pitch.toFixed(2)} | YAW: {rotation.yaw.toFixed(2)}
          </p>
        </div>

        {/* Hover quick module preview tooltip */}
        <AnimatePresence>
          {hoveredModule && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-12 right-4 z-30 p-3 max-w-[260px] bg-slate-950/90 backdrop-blur-md rounded-lg border border-cyan-400/30 shadow-[0_0_20px_rgba(0,243,255,0.15)] font-mono text-left"
            >
              {(() => {
                const modObj = modulesList.find((m) => m.id === hoveredModule);
                if (!modObj) return null;
                const Icon = modObj.icon;
                return (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 border-b border-white/10 pb-1">
                      <Icon className="w-4.5 h-4.5 text-cyan-glow" style={{ color: modObj.glowColor }} />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">{modObj.name}</span>
                    </div>
                    <p className="text-[9px] text-slate-300 leading-tight">{modObj.shortDesc}</p>
                    <div className="text-[8px] text-cyan-400 animate-pulse pt-1 uppercase">
                      &gt;&gt; click orbital node to warp
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Main Interactive Canvas Stage */}
      <div className="relative w-full flex-1 min-h-0 cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onClick={handleCanvasClick}
          className="absolute inset-0 w-full h-full block"
        />

        {/* Floating Instruction overlay inside canvas */}
        <div className="absolute top-3 left-4 bg-slate-950/80 p-2 rounded border border-white/5 font-mono text-[9px] text-slate-400 pointer-events-none space-y-0.5">
          <div className="text-white font-bold uppercase tracking-wider">OBSERVATORY FEED: LIVE</div>
          <div>[DRAG] Rotate Camera 3D</div>
          <div>[HOVER] Decelerate & Expand Node</div>
          <div>[CLICK] Trigger Quantum Warp Gateway</div>
        </div>
      </div>

      {/* 3. Bottom controls and interactive mode-switcher console */}
      <div className="relative z-20 p-4 bg-slate-950/70 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Playback, zoom, reset */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setIsPlaying(!isPlaying);
              audioService.playClick("tap");
            }}
            className="p-1.5 rounded bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
            title={isPlaying ? "Pause core evolution" : "Resume core evolution"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => {
              setZoom((z) => Math.min(1.5, z + 0.1));
              audioService.playHover("tick");
            }}
            className="p-1.5 rounded bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setZoom((z) => Math.max(0.6, z - 0.1));
              audioService.playHover("tick");
            }}
            className="p-1.5 rounded bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setRotation({ pitch: 0.3, yaw: 0.5 });
              setZoom(1.0);
              audioService.playCalibration("wave");
            }}
            className="p-1.5 rounded bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
            title="Reset observatory camera view"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Vis mode selector shell buttons */}
        <div className="flex flex-wrap gap-1.5 justify-center md:justify-end">
          {[
            { id: "bohr", name: "Bohr Model" },
            { id: "cloud", name: "Probability Lobe" },
            { id: "wavefunction", name: "Ψ-Wave helix" },
            { id: "bloch", name: "Bloch Sphere" },
            { id: "lattice", name: "Solid Lattice" },
            { id: "circuit", name: "Gate Circuit" },
            { id: "photon", name: "Photon Field" },
            { id: "spin", name: "Spin Precession" }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => handleModeChange(m.id as any)}
              className={`px-2 py-1 rounded text-[8px] font-mono font-bold uppercase border transition-all ${
                visMode === m.id 
                  ? "bg-cyan-glow/20 border-cyan-glow text-white shadow-[0_0_10px_rgba(0,243,255,0.25)]" 
                  : "bg-slate-900/50 border-white/5 text-slate-400 hover:border-white/15 hover:text-slate-200"
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>

      </div>

    </div>
  );
}
