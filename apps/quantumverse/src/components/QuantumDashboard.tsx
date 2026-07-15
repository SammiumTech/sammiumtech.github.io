import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, Award, Atom, BookOpen, Cpu, BrainCircuit, Play, Pause,
  HelpCircle, ChevronRight, Activity, Calendar, Trophy, Bookmark, Globe,
  CloudRain, Zap, RefreshCw, RotateCcw, Compass, Crosshair
} from "lucide-react";
import { audioService } from "../utils/audioService";
import HolographicAudioConsole from "./HolographicAudioConsole";

interface QuantumDashboardProps {
  onNavigate: (module: string) => void;
  progress: {
    completedLessons: string[];
    quizzesTaken: number;
    highestScore: number;
    unlockedBadges: string[];
  };
  hideHero?: boolean;
}

const DISCOVERIES = [
  {
    title: "Physicists Observe Real-time Quantum Tunneling in Molecular Bonds",
    source: "Nature Physics",
    date: "July 2026",
    summary: "Researchers have captured sub-femtosecond snapshots of electrons traversing solid state potentials."
  },
  {
    title: "1,000 Qubit Quantum Processor Achieves Fault-Tolerant Logical Coherence",
    source: "Sammium Science Hub",
    date: "June 2026",
    summary: "Novel error-correction codes keep qubits entangled for over 10 minutes at millikelvin temperatures."
  },
  {
    title: "Direct Observation of Non-Local Entanglement Wavefront Propagation",
    source: "Physical Review Letters",
    date: "May 2026",
    summary: "A laser interferometer confirms correlation wave fronting at speed scales exceeding standard classical limits."
  }
];

const QUOTES = [
  {
    text: "If quantum mechanics hasn't profoundly shocked you, you haven't understood it yet.",
    author: "Niels Bohr"
  },
  {
    text: "I think I can safely say that nobody understands quantum mechanics.",
    author: "Richard Feynman"
  },
  {
    text: "God does not play dice with the universe.",
    author: "Albert Einstein"
  },
  {
    text: "The wavefunction does not map physical objects, but rather our state of knowledge concerning them.",
    author: "Werner Heisenberg"
  },
  {
    text: "There is no quantum world. There is only an abstract physical description.",
    author: "Niels Bohr"
  }
];

const COSMIC_WEATHER_TEMPLATES = [
  {
    condition: "Solar Proton Storm (Level G3)",
    description: "Highly energetic solar wind flux heading outward from Coronal Hole 418. Magnetosphere is vibrating at resonant ultra-low frequencies.",
    density: "42.8 protons/cm³",
    flux: "12.4 microTesla",
    nebula: "Carina Nebula Outflow",
    harmonic: "Schumann Resonance (8.15 Hz)",
    color: "text-amber-400 bg-amber-950/25 border-amber-500/30",
    glowColor: "shadow-amber-500/30"
  },
  {
    condition: "Chronos Temporal Trough (Phase -0.04)",
    description: "A minor gravity gradient from a micro-singularity passing within 1.2 parsecs is inducing sub-picosecond atomic clock dilatation.",
    density: "0.00 neutrinos/m³",
    flux: "0.04 microTesla",
    nebula: "Pleiades Cluster Dust",
    harmonic: "Gravitational Soliton (0.002 Hz)",
    color: "text-violet-400 bg-violet-950/25 border-violet-500/30",
    glowColor: "shadow-violet-500/30"
  },
  {
    condition: "Quantum Decoherence Cascade",
    description: "Localized high-frequency electrostatic turbulence is degrading superconducting qubit T2 times. Heavy tuning recommended.",
    density: "9.2 ions/cm³",
    flux: "41.5 microTesla",
    nebula: "Orion Nebula Rim",
    harmonic: "De Broglie Wave Interfere (124 MHz)",
    color: "text-rose-400 bg-rose-950/25 border-rose-500/30",
    glowColor: "shadow-rose-500/30"
  },
  {
    condition: "Higgs Field Fluctuations",
    description: "Local vacuum energy densities are showing stable vacuum expectation deviations. Mass profiles of virtual Bosons are constant.",
    density: "N/A (Vacuum expectation)",
    flux: "0.00 microTesla",
    nebula: "Crab Pulsar Core",
    harmonic: "Higgs Resonance Mode (125.09 GeV)",
    color: "text-emerald-400 bg-emerald-950/25 border-emerald-500/30",
    glowColor: "shadow-emerald-500/30"
  },
  {
    condition: "Neutrino Radiation Drizzle",
    description: "A peaceful stream of nearly massless particles from a nearby core collapse supernova is passing through the planet unimpeded.",
    density: "3.4 × 10¹⁴ neutrinos/s",
    flux: "0.01 microTesla",
    nebula: "Lagoon Emerald Flare",
    harmonic: "Binaural Phase Shift (1.61 Hz)",
    color: "text-sky-400 bg-sky-950/25 border-sky-500/30",
    glowColor: "shadow-sky-500/30"
  }
];

export default function QuantumDashboard({ onNavigate, progress, hideHero = false }: QuantumDashboardProps) {
  const [selectedOrbital, setSelectedOrbital] = useState<"s" | "p" | "d" | "core">("core");
  const [coreSpeed, setCoreSpeed] = useState(1.0);
  const [lobeCount, setLobeCount] = useState(6);
  const [latticeType, setLatticeType] = useState<"diamond" | "cube" | "none">("diamond");
  const [quote, setQuote] = useState(QUOTES[0]);
  const [weatherIndex, setWeatherIndex] = useState(() => Math.floor(Math.random() * 5));
  const [isScanningWeather, setIsScanningWeather] = useState(false);
  const atomCanvasRef = useRef<HTMLCanvasElement>(null);

  // Advanced Holographic Quantum Core Observatory States (v3)
  const [vizMode, setVizMode] = useState<"orbitals" | "cloud" | "wave" | "bloch" | "lattice" | "density" | "accelerator" | "circuit" | "photon" | "radar">("orbitals");
  const [isPaused, setIsPaused] = useState(false);
  const [isInspecting, setIsInspecting] = useState(true);

  // References for mouse drag rotation, wheel zoom, and real-time cursor hover telemetry
  const pitchRef = useRef(0.2);
  const yawRef = useRef(0.35);
  const zoomRef = useRef(1.0);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const hoverPosRef = useRef<{ x: number; y: number } | null>(null);

  const isPausedRef = useRef(isPaused);
  const vizModeRef = useRef(vizMode);
  const isInspectingRef = useRef(isInspecting);

  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { vizModeRef.current = vizMode; }, [vizMode]);
  useEffect(() => { isInspectingRef.current = isInspecting; }, [isInspecting]);

  const handleScanWeather = () => {
    if (isScanningWeather) return;
    setIsScanningWeather(true);
    audioService.playCalibration("wave");
    
    setTimeout(() => {
      let nextIdx = Math.floor(Math.random() * 5);
      if (nextIdx === weatherIndex) {
        nextIdx = (nextIdx + 1) % 5;
      }
      setWeatherIndex(nextIdx);
      setIsScanningWeather(false);
      audioService.playNotification("completed");
    }, 1500);
  };

  // Rotate quotes
  useEffect(() => {
    const qIndex = Math.floor(Math.random() * QUOTES.length);
    setQuote(QUOTES[qIndex]);
  }, []);

  // Beautiful interactive canvas Bohr/Schrödinger orbital atom model & 10 Scientific Modes
  useEffect(() => {
    const canvas = atomCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const dpr = window.devicePixelRatio || 1;
    let width = canvas.parentElement?.clientWidth || 280;
    let height = canvas.parentElement?.clientHeight || width;
    let time = 0;

    let cx = width / 2;
    let cy = height / 2;

    const setupCanvasSize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.parentElement.clientWidth;
        height = canvas.parentElement.clientHeight || width;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        cx = width / 2;
        cy = height / 2;
      }
    };
    setupCanvasSize();

    const resizeObserver = new ResizeObserver(() => {
      setupCanvasSize();
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Persisted background 3D stars for core
    const stars: {x: number; y: number; z: number; phase: number; speed: number}[] = [];
    for (let i = 0; i < 45; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 170,
        y: (Math.random() - 0.5) * 170,
        z: (Math.random() - 0.5) * 170,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.012 + 0.004,
      });
    }

    // Persisted electron cloud probability points (Mode 2)
    const cloudPoints: {x: number; y: number; z: number; color: string; speed: number}[] = [];
    for (let i = 0; i < 180; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const dist = Math.pow(Math.random(), 2.2) * 90; // High probability density near nucleus
      cloudPoints.push({
        x: dist * Math.sin(phi) * Math.cos(theta),
        y: dist * Math.sin(phi) * Math.sin(theta),
        z: dist * Math.cos(phi),
        color: i % 2 === 0 ? "#00f3ff" : "#bd00ff",
        speed: Math.random() * 0.015 + 0.005,
      });
    }

    // Rotating 3D project function
    const project = (x: number, y: number, z: number, pitch: number, yaw: number, roll: number) => {
      // Rotate around X (pitch) with manual drag offset
      const finalPitch = pitch + pitchRef.current;
      const finalYaw = yaw + yawRef.current;

      const cosP = Math.cos(finalPitch);
      const sinP = Math.sin(finalPitch);
      const y1 = y * cosP - z * sinP;
      const z1 = y * sinP + z * cosP;

      // Rotate around Y (yaw)
      const cosY = Math.cos(finalYaw);
      const sinY = Math.sin(finalYaw);
      const x2 = x * cosY + z1 * sinY;
      const z2 = -x * sinY + z1 * cosY;

      // Rotate around Z (roll)
      const cosR = Math.cos(roll);
      const sinR = Math.sin(roll);
      const x3 = x2 * cosR - y1 * sinR;
      const y3 = x2 * sinR + y1 * cosR;

      const distance = 250;
      const fovVal = 190;
      // Scale by perspective AND interactive scroll zoom value
      const scaleOnScreen = (fovVal / (distance + z2)) * zoomRef.current;
      const sx = cx + x3 * scaleOnScreen;
      const sy = cy + y3 * scaleOnScreen;
      return { x: sx, y: sy, z: z2, scale: scaleOnScreen };
    };

    const drawAtom = () => {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Trigger time tick if not paused
      if (!isPausedRef.current) {
        time += 0.02 * coreSpeed;
      }

      if (selectedOrbital === "core") {
        const mode = vizModeRef.current;

        // Draw 3D projected floating background star sparks
        stars.forEach((star) => {
          if (!isPausedRef.current) {
            star.phase += star.speed * coreSpeed;
          }
          const pulse = 0.35 + Math.abs(Math.sin(star.phase)) * 0.65;
          const starPt = project(star.x, star.y, star.z, time * 0.1, time * 0.08, time * 0.03);

          const starSize = Math.max(0.4, 2.2 * starPt.scale * pulse);
          ctx.fillStyle = `rgba(255, 255, 255, ${0.85 * pulse})`;
          ctx.beginPath();
          ctx.arc(starPt.x, starPt.y, starSize, 0, Math.PI * 2);
          ctx.fill();

          // Spark faint glow crosshair
          if (star.phase % (Math.PI * 2) < 0.2) {
            ctx.strokeStyle = "rgba(0, 243, 255, 0.25)";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(starPt.x - 3, starPt.y);
            ctx.lineTo(starPt.x + 3, starPt.y);
            ctx.moveTo(starPt.x, starPt.y - 3);
            ctx.lineTo(starPt.x, starPt.y + 3);
            ctx.stroke();
          }
        });

        // DRAW TARGET SCIENTIFIC SUB-VISUALIZATION MODES
        if (mode === "orbitals") {
          // --- Mode 1: Atomic Orbitals ---
          const getOrbitTilt = (idx: number, total: number) => {
            const fraction = idx / total;
            return {
              pitch: (fraction * Math.PI) + (time * 0.3),
              yaw: (fraction * Math.PI * 2) - (time * 0.4),
              roll: (fraction * Math.PI * 0.5) + (time * 0.1)
            };
          };

          const colors = [
            ["rgba(255, 122, 0, 0.4)", "rgba(255, 180, 0, 0.1)", "rgba(255, 122, 0, 0)"],
            ["rgba(0, 243, 255, 0.4)", "rgba(0, 150, 255, 0.1)", "rgba(0, 243, 255, 0)"],
            ["rgba(189, 0, 255, 0.4)", "rgba(100, 0, 255, 0.1)", "rgba(189, 0, 255, 0)"],
            ["rgba(34, 197, 94, 0.4)", "rgba(0, 243, 255, 0.1)", "rgba(34, 197, 94, 0)"],
            ["rgba(255, 0, 127, 0.4)", "rgba(255, 0, 255, 0.1)", "rgba(255, 0, 127, 0)"],
            ["rgba(255, 190, 0, 0.4)", "rgba(255, 100, 0, 0.1)", "rgba(255, 190, 0, 0)"]
          ];

          for (let i = 0; i < lobeCount; i++) {
            const tilts = getOrbitTilt(i, lobeCount);
            const lobeColorSet = colors[i % colors.length];

            // Draw thick ribbon ring
            ctx.beginPath();
            let firstPoint = true;
            for (let theta = 0; theta <= Math.PI * 2 + 0.01; theta += 0.08) {
              const pt = project(82 * Math.cos(theta), 82 * Math.sin(theta), 0, tilts.pitch, tilts.yaw, tilts.roll);
              if (firstPoint) {
                ctx.moveTo(pt.x, pt.y);
                firstPoint = false;
              } else {
                ctx.lineTo(pt.x, pt.y);
              }
            }
            ctx.strokeStyle = lobeColorSet[0];
            ctx.lineWidth = 2.8;
            ctx.stroke();

            // Thin bright core
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Draw trailing particles along orbits
            const particleAngle = (time * 1.6 + (i * Math.PI * 2) / lobeCount) % (Math.PI * 2);
            for (let tailIdx = 0; tailIdx < 8; tailIdx++) {
              const tailAngle = particleAngle - tailIdx * 0.07;
              const tpt = project(82 * Math.cos(tailAngle), 82 * Math.sin(tailAngle), 0, tilts.pitch, tilts.yaw, tilts.roll);
              const tailSize = Math.max(0.5, (4.5 - tailIdx * 0.5) * tpt.scale);
              const alphaVal = 0.85 * (1 - tailIdx / 8);

              ctx.fillStyle = lobeColorSet[0].replace("0.4)", `${alphaVal})`);
              ctx.beginPath();
              ctx.arc(tpt.x, tpt.y, tailSize, 0, Math.PI * 2);
              ctx.fill();

              if (tailIdx === 0) {
                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                ctx.arc(tpt.x, tpt.y, tailSize * 0.6, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }

          // Central Plasmoid
          const pulse = 1.0 + Math.sin(time * 3.5) * 0.08;
          const nucleusGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 18 * pulse);
          nucleusGrad.addColorStop(0, "#ffffff");
          nucleusGrad.addColorStop(0.35, "rgba(0, 243, 255, 0.75)");
          nucleusGrad.addColorStop(0.7, "rgba(189, 0, 255, 0.3)");
          nucleusGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
          
          ctx.fillStyle = nucleusGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, 18 * pulse, 0, Math.PI * 2);
          ctx.fill();

        } else if (mode === "cloud") {
          // --- Mode 2: Electron Cloud Probability Plot ---
          cloudPoints.forEach((p) => {
            if (!isPausedRef.current) {
              p.x += (Math.random() - 0.5) * p.speed * 2;
              p.y += (Math.random() - 0.5) * p.speed * 2;
              p.z += (Math.random() - 0.5) * p.speed * 2;
            }
            const pt = project(p.x, p.y, p.z, time * 0.04, time * 0.02, 0);
            const size = Math.max(0.6, 1.8 * pt.scale);
            const alpha = 0.2 + 0.65 * Math.abs(Math.sin(time * p.speed + p.x * 0.01));

            ctx.fillStyle = p.color === "#00f3ff" ? `rgba(0, 243, 255, ${alpha})` : `rgba(189, 0, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, size, 0, Math.PI * 2);
            ctx.fill();
          });

          // Glow nucleus core
          ctx.fillStyle = "rgba(0, 243, 255, 0.15)";
          ctx.beginPath();
          ctx.arc(cx, cy, 30, 0, Math.PI * 2);
          ctx.fill();

        } else if (mode === "wave") {
          // --- Mode 3: Wave Function Shells ---
          const waveCount = 3;
          for (let w = 0; w < waveCount; w++) {
            ctx.strokeStyle = w % 2 === 0 ? "rgba(0, 243, 255, 0.45)" : "rgba(189, 0, 255, 0.45)";
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            let first = true;
            for (let theta = 0; theta < Math.PI * 2 + 0.05; theta += 0.08) {
              const amp = 14 * Math.sin(theta * 5 + time * 3.5 + w * Math.PI / 3);
              const r = 72 + amp;
              const tiltX = w * 0.35;
              const tiltY = w * 0.5;
              const pt = project(r * Math.cos(theta), r * Math.sin(theta), Math.sin(theta * 2) * 12, tiltX, tiltY, 0);
              if (first) {
                ctx.moveTo(pt.x, pt.y);
                first = false;
              } else {
                ctx.lineTo(pt.x, pt.y);
              }
            }
            ctx.closePath();
            ctx.stroke();
          }

          // Center nucleus
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(cx, cy, 5, 0, Math.PI * 2);
          ctx.fill();

        } else if (mode === "bloch") {
          // --- Mode 4: Bloch Sphere Coordinate Shell ---
          ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
          ctx.lineWidth = 1;
          
          // Latitude rings
          ctx.beginPath();
          for (let th = 0; th <= Math.PI * 2; th += 0.08) {
            const pt = project(80 * Math.cos(th), 80 * Math.sin(th), 0, 0, 0, 0);
            if (th === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y);
          }
          ctx.closePath(); ctx.stroke();

          // Longitudinal rings
          ctx.strokeStyle = "rgba(0, 243, 255, 0.12)";
          ctx.beginPath();
          for (let th = 0; th <= Math.PI * 2; th += 0.08) {
            const pt = project(80 * Math.cos(th), 0, 80 * Math.sin(th), 0, 0, 0);
            if (th === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y);
          }
          ctx.closePath(); ctx.stroke();

          // Vertical Z axis
          const zStart = project(0, -85, 0, 0, 0, 0);
          const zEnd = project(0, 85, 0, 0, 0, 0);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
          ctx.beginPath(); ctx.moveTo(zStart.x, zStart.y); ctx.lineTo(zEnd.x, zEnd.y); ctx.stroke();

          // Labels
          ctx.fillStyle = "rgba(255,255,255,0.7)";
          ctx.font = "8px monospace";
          ctx.fillText("|0⟩", zStart.x - 12, zStart.y + 1);
          ctx.fillText("|1⟩", zEnd.x - 12, zEnd.y + 4);

          // Dynamic State Vector
          const vecTheta = time * 0.45;
          const vecPhi = Math.PI / 3 + Math.sin(time * 0.15) * 0.3;
          const vx = 80 * Math.sin(vecPhi) * Math.cos(vecTheta);
          const vy = 80 * Math.cos(vecPhi);
          const vz = 80 * Math.sin(vecPhi) * Math.sin(vecTheta);

          const centerPt = project(0, 0, 0, 0, 0, 0);
          const arrowPt = project(vx, vy, vz, 0, 0, 0);

          ctx.strokeStyle = "#00f3ff";
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(centerPt.x, centerPt.y);
          ctx.lineTo(arrowPt.x, arrowPt.y);
          ctx.stroke();

          ctx.fillStyle = "#ffffff";
          ctx.beginPath(); ctx.arc(arrowPt.x, arrowPt.y, 4, 0, Math.PI * 2); ctx.fill();

        } else if (mode === "lattice") {
          // --- Mode 5: Crystalline Quantum Lattice ---
          let vertices: {x: number; y: number; z: number}[] = [];
          let edges: number[][] = [];

          if (latticeType === "diamond") {
            vertices = [
              { x: 0, y: -45, z: 0 },
              { x: 0, y: 45, z: 0 },
              { x: -32, y: 0, z: -32 },
              { x: 32, y: 0, z: -32 },
              { x: 32, y: 0, z: 32 },
              { x: -32, y: 0, z: 32 }
            ];
            edges = [
              [0, 2], [0, 3], [0, 4], [0, 5],
              [1, 2], [1, 3], [1, 4], [1, 5],
              [2, 3], [3, 4], [4, 5], [5, 2]
            ];
          } else {
            const cs = 28;
            for (let dx of [-1, 1]) {
              for (let dy of [-1, 1]) {
                for (let dz of [-1, 1]) {
                  vertices.push({ x: dx * cs, y: dy * cs, z: dz * cs });
                }
              }
            }
            edges = [
              [0, 1], [1, 3], [3, 2], [2, 0],
              [4, 5], [5, 7], [7, 6], [6, 4],
              [0, 4], [1, 5], [2, 6], [3, 7]
            ];
          }

          ctx.strokeStyle = "rgba(0, 243, 255, 0.45)";
          ctx.lineWidth = 1.2;
          edges.forEach(([sIdx, eIdx]) => {
            const ptStart = project(vertices[sIdx].x, vertices[sIdx].y, vertices[sIdx].z, 0, 0, 0);
            const ptEnd = project(vertices[eIdx].x, vertices[eIdx].y, vertices[eIdx].z, 0, 0, 0);
            ctx.beginPath();
            ctx.moveTo(ptStart.x, ptStart.y);
            ctx.lineTo(ptEnd.x, ptEnd.y);
            ctx.stroke();
          });

          vertices.forEach((v) => {
            const ptNode = project(v.x, v.y, v.z, 0, 0, 0);
            ctx.fillStyle = "#bd00ff";
            ctx.beginPath();
            ctx.arc(ptNode.x, ptNode.y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(ptNode.x, ptNode.y, 1.8, 0, Math.PI * 2);
            ctx.fill();
          });

        } else if (mode === "density") {
          // --- Mode 6: Radial Probability Density ---
          const ringCount = 4;
          for (let rIdx = 0; rIdx < ringCount; rIdx++) {
            const rBase = ((time * 16) + (rIdx * 25)) % 95;
            const rAlpha = Math.max(0, 1.0 - (rBase / 95));
            ctx.strokeStyle = `rgba(0, 243, 255, ${rAlpha * 0.45})`;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            for (let th = 0; th <= Math.PI * 2 + 0.1; th += 0.1) {
              const pt = project(rBase * Math.cos(th), rBase * Math.sin(th), 0, 0, 0, 0);
              if (th === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y);
            }
            ctx.closePath();
            ctx.stroke();

            ctx.fillStyle = `rgba(189, 0, 255, ${rAlpha * 0.04})`;
            ctx.fill();
          }

        } else if (mode === "accelerator") {
          // --- Mode 7: Particle Accelerator Collider ---
          ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
          ctx.lineWidth = 3.2;
          ctx.beginPath();
          for (let th = 0; th <= Math.PI * 2; th += 0.05) {
            const pt = project(75 * Math.cos(th), 75 * Math.sin(th), 0, 0, 0, 0);
            if (th === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y);
          }
          ctx.closePath(); ctx.stroke();

          const accAng1 = time * 2.2;
          const accAng2 = -time * 1.8;

          const ptAcc1 = project(75 * Math.cos(accAng1), 75 * Math.sin(accAng1), 0, 0, 0, 0);
          const ptAcc2 = project(75 * Math.cos(accAng2), 75 * Math.sin(accAng2), 0, 0, 0, 0);

          ctx.fillStyle = "#00f3ff";
          ctx.beginPath(); ctx.arc(ptAcc1.x, ptAcc1.y, 4.5, 0, Math.PI * 2); ctx.fill();

          ctx.fillStyle = "#bd00ff";
          ctx.beginPath(); ctx.arc(ptAcc2.x, ptAcc2.y, 4.5, 0, Math.PI * 2); ctx.fill();

          const diffAngle = Math.abs((accAng1 - accAng2) % (Math.PI * 2));
          if (diffAngle < 0.16 || diffAngle > (Math.PI * 2 - 0.16)) {
            const cxProj = (ptAcc1.x + ptAcc2.x) / 2;
            const cyProj = (ptAcc1.y + ptAcc2.y) / 2;
            
            ctx.fillStyle = "#ffffff";
            ctx.shadowBlur = 12;
            ctx.shadowColor = "#ffffff";
            ctx.beginPath(); ctx.arc(cxProj, cyProj, 8, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;

            ctx.strokeStyle = "#00f3ff";
            ctx.lineWidth = 1;
            for (let s = 0; s < 10; s++) {
              const sAng = s * (Math.PI * 2 / 10) + time * 5;
              ctx.beginPath();
              ctx.moveTo(cxProj, cyProj);
              ctx.lineTo(cxProj + Math.cos(sAng) * 25, cyProj + Math.sin(sAng) * 25);
              ctx.stroke();
            }
          }

        } else if (mode === "circuit") {
          // --- Mode 8: Quantum Gate Circuit ---
          const circuitWires = [-30, 0, 30];
          circuitWires.forEach((wireY, wIdx) => {
            const ptStart = project(-90, wireY, 0, 0, 0, 0);
            const ptEnd = project(90, wireY, 0, 0, 0, 0);
            
            ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
            ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.moveTo(ptStart.x, ptStart.y); ctx.lineTo(ptEnd.x, ptEnd.y); ctx.stroke();

            const gatePoints = [-45, 10, 55];
            const gateLabels = ["H", "X", "•"];
            gatePoints.forEach((gateX, gIdx) => {
              const ptGate = project(gateX, wireY, 0, 0, 0, 0);
              
              ctx.fillStyle = "rgba(5, 8, 22, 0.85)";
              ctx.strokeStyle = "#00f3ff";
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.rect(ptGate.x - 7, ptGate.y - 7, 14, 14);
              ctx.fill();
              ctx.stroke();

              ctx.fillStyle = "#ffffff";
              ctx.font = "8px monospace";
              ctx.fillText(gateLabels[gIdx], ptGate.x - 3, ptGate.y + 3);
            });

            const packetX = -90 + ((time * 38 + wIdx * 60) % 180);
            const ptPacket = project(packetX, wireY, 0, 0, 0, 0);
            ctx.fillStyle = "#00f3ff";
            ctx.beginPath(); ctx.arc(ptPacket.x, ptPacket.y, 3.2, 0, Math.PI * 2); ctx.fill();
          });

        } else if (mode === "photon") {
          // --- Mode 9: Entangled Photon Network ---
          const nodes = [
            { x: 0, y: -50, z: 0 },
            { x: -55, y: 15, z: -35 },
            { x: 55, y: 15, z: -35 },
            { x: -40, y: 45, z: 40 },
            { x: 40, y: 45, z: 40 },
          ];

          ctx.strokeStyle = "rgba(189, 0, 255, 0.18)";
          ctx.lineWidth = 1;
          for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
              const p1 = project(nodes[i].x, nodes[i].y, nodes[i].z, 0, 0, 0);
              const p2 = project(nodes[j].x, nodes[j].y, nodes[j].z, 0, 0, 0);
              ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
            }
          }

          nodes.forEach((n, idx) => {
            const pt = project(n.x, n.y, n.z, 0, 0, 0);
            ctx.fillStyle = idx === 0 ? "#00f3ff" : "#bd00ff";
            ctx.beginPath(); ctx.arc(pt.x, pt.y, 4.8, 0, Math.PI * 2); ctx.fill();

            const nextIdx = (idx + 1) % nodes.length;
            const slideProgress = (time * 0.4) % 1.0;
            const sx = n.x + (nodes[nextIdx].x - n.x) * slideProgress;
            const sy = n.y + (nodes[nextIdx].y - n.y) * slideProgress;
            const sz = n.z + (nodes[nextIdx].z - n.z) * slideProgress;
            
            const ptSlide = project(sx, sy, sz, 0, 0, 0);
            ctx.fillStyle = "#ffffff";
            ctx.beginPath(); ctx.arc(ptSlide.x, ptSlide.y, 2, 0, Math.PI * 2); ctx.fill();
          });

        } else if (mode === "radar") {
          // --- Mode 10: Research Observatory Radar Sweep ---
          ctx.strokeStyle = "rgba(0, 243, 255, 0.14)";
          ctx.lineWidth = 1;
          [30, 60, 90].forEach((r) => {
            ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
          });

          const radarSweepAng = (time * 1.5) % (Math.PI * 2);
          
          ctx.fillStyle = "rgba(0, 243, 255, 0.012)";
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, 90, radarSweepAng - 0.45, radarSweepAng);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = "rgba(0, 243, 255, 0.55)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(radarSweepAng) * 90, cy + Math.sin(radarSweepAng) * 90);
          ctx.stroke();

          const radarTargets = [
            { x: cx - 45, y: cy - 25, label: "DEC_4.5" },
            { x: cx + 55, y: cy + 35, label: "TUN_7.2" },
            { x: cx - 20, y: cy + 55, label: "ENT_0.8" }
          ];

          radarTargets.forEach((t) => {
            const tarAngle = Math.atan2(t.y - cy, t.x - cx);
            const rawDiff = Math.abs(tarAngle - radarSweepAng);
            const normalizedDiff = Math.min(rawDiff, Math.PI * 2 - rawDiff);
            
            let tarAlpha = 0.15;
            if (normalizedDiff < 0.25) {
              tarAlpha = 1.0 - (normalizedDiff / 0.25) * 0.75;
            }
            
            ctx.fillStyle = `rgba(0, 243, 255, ${tarAlpha})`;
            ctx.beginPath(); ctx.arc(t.x, t.y, 3, 0, Math.PI * 2); ctx.fill();
            
            if (tarAlpha > 0.4) {
              ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
              ctx.font = "7px monospace";
              ctx.fillText(t.label, t.x + 5, t.y - 2);
            }
          });
        }

      } else {
        // --- Fall back to classic S/P/D orbitals (Pristine backward-compatibility) ---
        const nucleusRadius = 14;
        const nucleusGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, nucleusRadius);
        nucleusGrad.addColorStop(0, "#ffffff");
        nucleusGrad.addColorStop(0.4, "#00f3ff");
        nucleusGrad.addColorStop(1, "rgba(0, 243, 255, 0)");
        ctx.fillStyle = nucleusGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, nucleusRadius + 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#00f3ff";
        ctx.beginPath();
        ctx.arc(cx - 3, cy - 2, 4, 0, Math.PI * 2);
        ctx.arc(cx + 4, cy + 3, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#bd00ff";
        ctx.beginPath();
        ctx.arc(cx + 4, cy - 3, 4, 0, Math.PI * 2);
        ctx.arc(cx - 3, cy + 4, 4, 0, Math.PI * 2);
        ctx.fill();

        if (selectedOrbital === "s") {
          ctx.strokeStyle = "rgba(0, 243, 255, 0.12)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(cx, cy, 80, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = "rgba(0, 243, 255, 0.35)";
          ctx.beginPath();
          for (let a = 0; a < Math.PI * 2; a += 0.05) {
            const r = 80 + Math.sin(a * 8 + time * 1.5) * 4;
            const px = cx + Math.cos(a) * r;
            const py = cy + Math.sin(a) * r;
            if (a === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();

          const eAngle = time * 0.8;
          const ex = cx + Math.cos(eAngle) * 80;
          const ey = cy + Math.sin(eAngle) * 80;
          
          const eGrad = ctx.createRadialGradient(ex, ey, 0, ex, ey, 10);
          eGrad.addColorStop(0, "#ffffff");
          eGrad.addColorStop(0.3, "#00f3ff");
          eGrad.addColorStop(1, "rgba(0, 243, 255, 0)");
          ctx.fillStyle = eGrad;
          ctx.beginPath();
          ctx.arc(ex, ey, 10, 0, Math.PI * 2);
          ctx.fill();

        } else if (selectedOrbital === "p") {
          ctx.strokeStyle = "rgba(189, 0, 255, 0.1)";
          ctx.lineWidth = 1.5;
          
          ctx.beginPath();
          for (let a = 0; a < Math.PI * 2; a += 0.05) {
            const r = 100 * Math.abs(Math.cos(a));
            const px = cx + Math.cos(a) * r;
            const py = cy + Math.sin(a) * r;
            if (a === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();

          ctx.beginPath();
          for (let a = 0; a < Math.PI * 2; a += 0.05) {
            const r = 100 * Math.abs(Math.sin(a));
            const px = cx + Math.cos(a) * r;
            const py = cy + Math.sin(a) * r;
            if (a === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();

          const eAngle = time * 0.9;
          const rDumbbell = 100 * Math.abs(Math.cos(eAngle));
          const ex = cx + Math.cos(eAngle) * rDumbbell;
          const ey = cy + Math.sin(eAngle) * rDumbbell;

          const eGrad = ctx.createRadialGradient(ex, ey, 0, ex, ey, 9);
          eGrad.addColorStop(0, "#ffffff");
          eGrad.addColorStop(0.35, "#bd00ff");
          eGrad.addColorStop(1, "rgba(189, 0, 255, 0)");
          ctx.fillStyle = eGrad;
          ctx.beginPath();
          ctx.arc(ex, ey, 9, 0, Math.PI * 2);
          ctx.fill();

        } else if (selectedOrbital === "d") {
          ctx.strokeStyle = "rgba(0, 243, 255, 0.08)";
          ctx.lineWidth = 1.5;

          for (let l = 0; l < 4; l++) {
            ctx.beginPath();
            const angleOffset = (l * Math.PI) / 2;
            for (let a = 0; a < Math.PI * 2; a += 0.05) {
              const r = 110 * Math.abs(Math.cos(a * 2 + angleOffset));
              const px = cx + Math.cos(a) * r;
              const py = cy + Math.sin(a) * r;
              if (a === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.stroke();
          }

          const eAngle = time * 1.1;
          const rClover = 110 * Math.abs(Math.cos(eAngle * 2));
          const ex = cx + Math.cos(eAngle) * rClover;
          const ey = cy + Math.sin(eAngle) * rClover;

          const eGrad = ctx.createRadialGradient(ex, ey, 0, ex, ey, 8);
          eGrad.addColorStop(0, "#ffffff");
          eGrad.addColorStop(0.35, "#00f3ff");
          eGrad.addColorStop(1, "rgba(0, 243, 255, 0)");
          ctx.fillStyle = eGrad;
          ctx.beginPath();
          ctx.arc(ex, ey, 8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // DISPLAY REAL-TIME COORDINATES TELEMETRY OVERLAY (V3 DESIGN)
      if (isInspectingRef.current && hoverPosRef.current) {
        const mx = hoverPosRef.current.x;
        const my = hoverPosRef.current.y;

        ctx.strokeStyle = "rgba(0, 243, 255, 0.18)";
        ctx.lineWidth = 0.5;
        ctx.setLineDash([2, 3]);

        ctx.beginPath();
        ctx.moveTo(mx, 0); ctx.lineTo(mx, height);
        ctx.moveTo(0, my); ctx.lineTo(width, my);
        ctx.stroke();

        ctx.setLineDash([]); // Reset line dash

        ctx.strokeStyle = "#00f3ff";
        ctx.lineWidth = 1;
        ctx.strokeRect(mx - 4, my - 4, 8, 8);

        const rValue = Math.hypot(mx - cx, my - cy).toFixed(1);
        const thetaValue = (Math.atan2(my - cy, mx - cx) * (180 / Math.PI)).toFixed(0);
        ctx.fillStyle = "rgba(0, 243, 255, 0.85)";
        ctx.font = "8px monospace";
        ctx.fillText(`r:${rValue}px  θ:${thetaValue}°`, mx + 8, my - 4);
      }

      ctx.restore();
      animationId = requestAnimationFrame(drawAtom);
    };

    drawAtom();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [selectedOrbital, coreSpeed, lobeCount, latticeType]);

  // Canvas Mouse / Touch drag to rotate handlers
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = atomCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    hoverPosRef.current = { x, y };

    if (!dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    
    yawRef.current += dx * 0.007;
    pitchRef.current += dy * 0.007;
    
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleCanvasMouseUp = () => {
    dragStartRef.current = null;
  };

  const handleCanvasWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    zoomRef.current = Math.max(0.4, Math.min(2.5, zoomRef.current - e.deltaY * 0.0015));
  };

  const handleResetOrientation = () => {
    pitchRef.current = 0.2;
    yawRef.current = 0.35;
    zoomRef.current = 1.0;
    audioService.playPressed("haptic");
  };

  const activeFormula = {
    orbitals: "ψ(r,θ,φ) = R_nl(r) * Y_lm(θ,φ)",
    cloud: "P(r) = |ψ(r)|² * 4πr²",
    wave: "Ψ(x,t) = A·e^(i(kx - ωt))",
    bloch: "|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩",
    lattice: "H = -J ∑ ⟨i,j⟩ S_i · S_j",
    density: "ρ(r) = -e |ψ_1s(r)|²",
    accelerator: "E² = (pc)² + (m₀c²)²",
    circuit: "H|0⟩ = (|0⟩ + |1⟩)/√2",
    photon: "|Φ⁺⟩ = (|00⟩ + |11⟩)/√2",
    radar: "S(f) = ∫ s(t)e^(-2πift) dt"
  }[vizMode];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header Card */}
      {!hideHero && (
        <div className="relative overflow-hidden rounded-2xl glass-panel border border-cyan-glow/20 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-cyan-glow/10 to-violet-glow/10 rounded-full blur-3xl -z-10"></div>
          
          <div className="space-y-4 max-w-xl text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-glow/10 border border-cyan-glow/30 text-xs font-mono text-cyan-glow">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Laboratory Online</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight leading-tight">
              Explore the <span className="text-cyan-glow">Wavefunction</span> of the Universe
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Welcome to Sammium QuantumVerse. Unveil quantum superposition, witness the wave-particle double-slit duality, model qubits in a Bloch Sphere, and research historic discoveries.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => {
                  onNavigate("simulations");
                }}
                onMouseEnter={() => audioService.playHover("tick")}
                className="px-5 py-2 rounded-md bg-gradient-to-r from-cyan-glow to-quantum-blue hover:opacity-90 font-mono text-xs font-bold text-slate-950 flex items-center space-x-2 shadow-lg transition-transform hover:-translate-y-0.5"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                <span>LAUNCH SIMULATIONS</span>
              </button>
              <button
                onClick={() => {
                  onNavigate("learning-hub");
                }}
                onMouseEnter={() => audioService.playHover("tick")}
                className="px-5 py-2 rounded-md bg-slate-900 border border-slate-700 hover:border-cyan-glow hover:text-cyan-glow font-mono text-xs text-slate-200 flex items-center space-x-2 transition-all"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>EXPLORE CONCEPTS</span>
              </button>
            </div>
          </div>

          {/* Interactive Holographic Quantum Core Observatory Panel */}
          <div className="glass-panel-cyan rounded-xl p-4 border border-cyan-glow/20 flex flex-col items-center text-center w-[330px] shrink-0">
            <div className="flex justify-between w-full items-center mb-2 px-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center">
                <Atom className="w-3 h-3 text-cyan-glow mr-1 animate-spin-slow" /> Core Observatory
              </span>
              <div className="flex bg-slate-950 p-0.5 rounded border border-slate-800">
                {(["s", "p", "d", "core"] as const).map((orb) => (
                  <button
                    key={orb}
                    onClick={() => {
                      setSelectedOrbital(orb);
                      audioService.playPressed("haptic");
                      audioService.playHover("sparkle", 0.7);
                    }}
                    onMouseEnter={() => audioService.playHover("tick")}
                    className={`px-2 py-0.5 text-[9px] font-mono rounded uppercase transition-colors ${selectedOrbital === orb ? "bg-cyan-glow text-slate-950 font-bold" : "text-slate-400 hover:text-white"}`}
                  >
                    {orb === "core" ? "⚡ CORE" : orb}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Canvas Area */}
            <div className="relative w-full aspect-square bg-slate-950/70 rounded-lg border border-white/5 overflow-hidden group">
              <canvas 
                ref={atomCanvasRef} 
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
                onWheel={handleCanvasWheel}
                className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" 
              />

              {/* Quick Overlays */}
              <div className="absolute top-2 right-2 flex space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setIsPaused(!isPaused)} 
                  title={isPaused ? "Play Animation" : "Pause Animation"}
                  className={`w-6 h-6 rounded flex items-center justify-center bg-slate-950/80 border border-white/10 text-slate-300 hover:text-cyan-glow transition-colors`}
                >
                  {isPaused ? <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" /> : <Pause className="w-3 h-3 text-cyan-glow" />}
                </button>
                <button 
                  onClick={() => setIsInspecting(!isInspecting)} 
                  title="Toggle Coordinates Telemetry"
                  className={`w-6 h-6 rounded flex items-center justify-center bg-slate-950/80 border border-white/10 ${isInspecting ? "text-cyan-glow border-cyan-glow/40 bg-cyan-glow/10" : "text-slate-300"}`}
                >
                  <Crosshair className="w-3 h-3" />
                </button>
                <button 
                  onClick={handleResetOrientation} 
                  title="Reset Camera view"
                  className="w-6 h-6 rounded flex items-center justify-center bg-slate-950/80 border border-white/10 text-slate-300 hover:text-cyan-glow transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              {/* Hint Overlay */}
              <div className="absolute bottom-2 left-2 pointer-events-none text-[8px] font-mono text-slate-500 uppercase tracking-widest bg-slate-950/40 px-1 py-0.5 rounded">
                Drag to Rotate • Scroll to Zoom
              </div>
            </div>

            <p className="text-[10px] font-mono text-slate-400 mt-2 italic min-h-[30px] flex items-center justify-center px-1">
              {selectedOrbital === "s" && "1s Ground state spherical probability cloud"}
              {selectedOrbital === "p" && "2p Dumbbell states showing distinct directional wave phases"}
              {selectedOrbital === "d" && "3d Complex cloverleaf configuration mapping angular nodes"}
              {selectedOrbital === "core" && (
                <span className="text-cyan-glow animate-pulse font-semibold">
                  [V3 MODE] Scientific Formula: <span className="text-white font-bold block mt-0.5 font-mono">{activeFormula}</span>
                </span>
              )}
            </p>

            {/* Interactive Core Controls & 10 Modes Grid Selector */}
            {selectedOrbital === "core" && (
              <div className="w-full mt-2 pt-2 border-t border-white/5 space-y-3 text-left animate-fade-in">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Select Scientific Visualization Mode:
                </span>
                <div className="grid grid-cols-5 gap-1">
                  {([
                    { id: "orbitals", label: "Orbit", short: "ORB" },
                    { id: "cloud", label: "Cloud", short: "CLD" },
                    { id: "wave", label: "Wave", short: "WAV" },
                    { id: "bloch", label: "Bloch", short: "BLC" },
                    { id: "lattice", label: "Latt", short: "LAT" },
                    { id: "density", label: "Dens", short: "DEN" },
                    { id: "accelerator", label: "Accel", short: "ACL" },
                    { id: "circuit", label: "Circ", short: "CCT" },
                    { id: "photon", label: "Phtn", short: "PTN" },
                    { id: "radar", label: "Sweep", short: "SWP" }
                  ] as const).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setVizMode(m.id);
                        audioService.playPressed("haptic");
                        audioService.playHover("sparkle", 0.6);
                      }}
                      onMouseEnter={() => audioService.playHover("tick")}
                      title={m.label}
                      className={`h-6 text-[8px] font-mono rounded font-bold uppercase transition-all flex flex-col items-center justify-center border ${vizMode === m.id ? "bg-cyan-glow text-slate-950 border-cyan-glow font-extrabold shadow-[0_0_8px_rgba(0,243,255,0.3)]" : "bg-slate-950/80 border-white/5 text-slate-400 hover:text-white"}`}
                    >
                      <span>{m.short}</span>
                    </button>
                  ))}
                </div>

                {/* Slider for speed */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-slate-400 uppercase">Core Speed</span>
                    <span className="text-[9px] font-mono text-cyan-glow font-bold">{coreSpeed.toFixed(1)}x</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.2" 
                    max="2.5" 
                    step="0.1" 
                    value={coreSpeed}
                    onChange={(e) => {
                      setCoreSpeed(parseFloat(e.target.value));
                      audioService.playClick("tap");
                    }}
                    className="w-full accent-cyan-glow bg-slate-950 h-1 rounded cursor-pointer"
                  />
                </div>

                {/* Extras depending on sub-modes */}
                {vizMode === "orbitals" && (
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-slate-400 uppercase">Lobe Geometry</span>
                    <div className="flex gap-1 bg-slate-950/80 p-0.5 rounded border border-slate-800">
                      {[3, 4, 6].map((num) => (
                        <button
                          key={num}
                          onClick={() => {
                            setLobeCount(num);
                            audioService.playPressed("haptic");
                          }}
                          className={`px-1.5 py-0.5 text-[8px] font-mono rounded transition-colors ${lobeCount === num ? "bg-cyan-glow text-slate-950 font-bold" : "text-slate-400 hover:text-white"}`}
                        >
                          {num}L
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {vizMode === "lattice" && (
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-slate-400 uppercase">Lattice Mesh</span>
                    <div className="flex gap-1 bg-slate-950/80 p-0.5 rounded border border-slate-800">
                      {["diamond", "cube"].map((mesh) => (
                        <button
                          key={mesh}
                          onClick={() => {
                            setLatticeType(mesh as any);
                            audioService.playPressed("haptic");
                          }}
                          className={`px-1.5 py-0.5 text-[8px] font-mono rounded uppercase transition-colors ${latticeType === mesh ? "bg-violet-glow text-slate-950 font-bold" : "text-slate-400 hover:text-white"}`}
                        >
                          {mesh}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid: 1. Core Modules Navigation   2. Progress Tracker & Daily Fact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Modules Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center">
            <Activity className="w-4 h-4 text-cyan-glow mr-2" /> Select Research Core
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Simulation Lab */}
            <div 
              onClick={() => {
                onNavigate("simulations");
              }}
              onMouseEnter={() => {
                audioService.playHover("shimmer", 0.8);
                audioService.playCalibration("simulator");
              }}
              className="group p-5 rounded-xl glass-panel border border-white/5 hover:border-cyan-glow/40 transition-all cursor-pointer hover:shadow-[0_4px_20px_rgba(0,243,255,0.08)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-glow/5 rounded-full blur-2xl -z-10 group-hover:bg-cyan-glow/10 transition-colors"></div>
              <div className="w-10 h-10 rounded-lg bg-cyan-950/40 border border-cyan-glow/20 flex items-center justify-center mb-4 text-cyan-glow group-hover:scale-110 transition-transform">
                <Atom className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-white text-lg group-hover:text-cyan-glow transition-colors">Quantum Simulation Lab</h4>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                Interact with the Double-Slit wavefronts, custom Tunneling barriers, Quantum Entanglement correlations, and the Bloch Sphere.
              </p>
              <div className="mt-4 flex items-center text-cyan-glow text-xs font-mono group-hover:translate-x-1 transition-transform">
                <span>Enter Simulator</span> <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>

            {/* Quantum AI Mentor */}
            <div 
              onClick={() => {
                onNavigate("ai-mentor");
              }}
              onMouseEnter={() => {
                audioService.playHover("shimmer", 0.8);
                audioService.playCalibration("mentor");
              }}
              className="group p-5 rounded-xl glass-panel border border-white/5 hover:border-violet-glow/40 transition-all cursor-pointer hover:shadow-[0_4px_20px_rgba(189,0,255,0.08)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-glow/5 rounded-full blur-2xl -z-10 group-hover:bg-violet-glow/10 transition-colors"></div>
              <div className="w-10 h-10 rounded-lg bg-violet-950/40 border border-violet-glow/20 flex items-center justify-center mb-4 text-violet-glow group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-white text-lg group-hover:text-violet-glow transition-colors">Quantum AI Mentor</h4>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                Receive interactive formulas step-by-step, generate customized physics analogies, and quiz explanations tailored to your level.
              </p>
              <div className="mt-4 flex items-center text-violet-glow text-xs font-mono group-hover:translate-x-1 transition-transform">
                <span>Consult AI Core</span> <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>

            {/* Quantum Computing Playground */}
            <div 
              onClick={() => {
                onNavigate("computing");
              }}
              onMouseEnter={() => {
                audioService.playHover("shimmer", 0.8);
                audioService.playCalibration("engine");
              }}
              className="group p-5 rounded-xl glass-panel border border-white/5 hover:border-cyan-glow/40 transition-all cursor-pointer hover:shadow-[0_4px_20px_rgba(0,243,255,0.08)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-glow/5 rounded-full blur-2xl -z-10 group-hover:bg-cyan-glow/10 transition-colors"></div>
              <div className="w-10 h-10 rounded-lg bg-cyan-950/40 border border-cyan-glow/20 flex items-center justify-center mb-4 text-cyan-glow group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-white text-lg group-hover:text-cyan-glow transition-colors">Computing Playground</h4>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                Build circuits with Hadamard, Pauli-X/Z, and CNOT quantum gates. Measure qubits and observe probabilities collapsing instantly.
              </p>
              <div className="mt-4 flex items-center text-cyan-glow text-xs font-mono group-hover:translate-x-1 transition-transform">
                <span>Build Circuits</span> <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>

            {/* Quiz Arena */}
            <div 
              onClick={() => {
                onNavigate("quiz-arena");
              }}
              onMouseEnter={() => {
                audioService.playHover("shimmer", 0.8);
                audioService.playCalibration("database");
              }}
              className="group p-5 rounded-xl glass-panel border border-white/5 hover:border-violet-glow/40 transition-all cursor-pointer hover:shadow-[0_4px_20px_rgba(189,0,255,0.08)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-glow/5 rounded-full blur-2xl -z-10 group-hover:bg-violet-glow/10 transition-colors"></div>
              <div className="w-10 h-10 rounded-lg bg-violet-950/40 border border-violet-glow/20 flex items-center justify-center mb-4 text-violet-glow group-hover:scale-110 transition-transform">
                <Trophy className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-white text-lg group-hover:text-violet-glow transition-colors">Quiz Arena</h4>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                Take adaptive, real-time physics quizzes. Unlock special achievement badges as you master superposition and non-locality.
              </p>
              <div className="mt-4 flex items-center text-violet-glow text-xs font-mono group-hover:translate-x-1 transition-transform">
                <span>Join Arena</span> <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Analytics, Fact of Day, News */}
        <div className="space-y-6">
          {/* Analytics / Progress */}
          <div className="glass-panel p-5 rounded-xl border border-white/5">
            <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-4 flex items-center">
              <Trophy className="w-4 h-4 text-cyan-glow mr-2" /> Research Progress
            </h3>

            <div className="space-y-3.5 text-left">
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                  <span>Lessons Unlocked</span>
                  <span className="text-cyan-glow font-bold">{progress.completedLessons.length} / 10</span>
                </div>
                <div className="w-full bg-slate-900 h-1 rounded overflow-hidden">
                  <div className="bg-cyan-glow h-full rounded" style={{ width: `${(progress.completedLessons.length / 10) * 100}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400 pt-2 border-t border-white/5">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Quizzes Completed</span>
                  <span className="text-white font-semibold text-sm">{progress.quizzesTaken}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Highest Arena Score</span>
                  <span className="text-cyan-glow font-semibold text-sm">{progress.highestScore}%</span>
                </div>
              </div>

              {/* Unlocked Badges */}
              <div className="pt-3 border-t border-white/5">
                <span className="text-[10px] font-mono text-slate-500 block uppercase mb-2">Unlocked Badges</span>
                <div className="flex flex-wrap gap-1.5">
                  {progress.unlockedBadges.length === 0 ? (
                    <span className="text-[11px] font-mono text-slate-400 italic">No badges unlocked yet</span>
                  ) : (
                    progress.unlockedBadges.map((badge, idx) => (
                      <span key={idx} className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-cyan-950/40 border border-cyan-glow/20 text-[9px] font-mono text-cyan-glow">
                        <Award className="w-3 h-3 text-cyan-glow" />
                        <span>{badge}</span>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Cosmic Weather Station */}
          <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase text-slate-300 tracking-wider flex items-center">
                <CloudRain className="w-4 h-4 text-cyan-glow mr-2 animate-pulse" /> COSMIC WEATHER STATION
              </h3>
              <span className="text-[8px] font-mono bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow px-1.5 py-0.5 rounded uppercase tracking-widest animate-pulse">
                {isScanningWeather ? "Scanning..." : "Active"}
              </span>
            </div>

            <div className={`p-3.5 rounded-lg border text-left transition-all relative overflow-hidden ${COSMIC_WEATHER_TEMPLATES[weatherIndex].color} ${COSMIC_WEATHER_TEMPLATES[weatherIndex].glowColor}`}>
              <div className="flex items-start justify-between mb-2">
                <span className="font-display font-bold text-sm tracking-tight text-white block">
                  {COSMIC_WEATHER_TEMPLATES[weatherIndex].condition}
                </span>
                <Zap className="w-4 h-4 text-cyan-glow shrink-0 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed mb-4">
                {COSMIC_WEATHER_TEMPLATES[weatherIndex].description}
              </p>

              {/* Weather Telemetry stats */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono border-t border-white/5 pt-3 text-slate-400">
                <div>
                  <span className="text-[8px] text-slate-500 block uppercase">FLUX INFLUX</span>
                  <span className="text-white font-semibold">{COSMIC_WEATHER_TEMPLATES[weatherIndex].flux}</span>
                </div>
                <div>
                  <span className="text-[8px] text-slate-500 block uppercase">PARTICLE DENSITY</span>
                  <span className="text-white font-semibold">{COSMIC_WEATHER_TEMPLATES[weatherIndex].density}</span>
                </div>
                <div className="col-span-2 pt-1.5">
                  <span className="text-[8px] text-slate-500 block uppercase">ACTIVE NEBULA</span>
                  <span className="text-cyan-glow font-bold">{COSMIC_WEATHER_TEMPLATES[weatherIndex].nebula}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[8px] text-slate-500 block uppercase">SPACE HARMONIC</span>
                  <span className="text-violet-glow font-bold">{COSMIC_WEATHER_TEMPLATES[weatherIndex].harmonic}</span>
                </div>
              </div>

              {/* Scanning visual overlay */}
              {isScanningWeather && (
                <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center space-y-2 animate-fade-in z-20">
                  <RefreshCw className="w-5 h-5 text-cyan-glow animate-spin" />
                  <span className="text-[9px] font-mono text-cyan-glow tracking-widest uppercase">TUNING TRANSCEIVER...</span>
                </div>
              )}
            </div>

            <button
              onClick={handleScanWeather}
              disabled={isScanningWeather}
              onMouseEnter={() => audioService.playHover("tick")}
              className="w-full py-2 rounded bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-glow/40 text-slate-300 hover:text-cyan-glow transition-all font-mono text-[9px] font-bold flex items-center justify-center space-x-2"
            >
              <RefreshCw className={`w-3 h-3 ${isScanningWeather ? "animate-spin text-cyan-glow" : ""}`} />
              <span>{isScanningWeather ? "RE-TUNING TRANSCEIVER..." : "SCAN DEEP COSMOS WEATHER"}</span>
            </button>
          </div>

          {/* Advanced Holographic Synthesizer & Spatial Control Console */}
          <HolographicAudioConsole />

          {/* Fact and Quote of the Day */}
          <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-4">
            <div>
              <span className="text-[9px] font-mono text-cyan-glow uppercase tracking-wider flex items-center mb-1">
                <Globe className="w-3 h-3 text-cyan-glow mr-1" /> Physicist Quote of the Day
              </span>
              <p className="text-slate-300 text-xs italic leading-relaxed text-left">
                "{quote.text}"
              </p>
              <span className="text-[10px] font-mono text-slate-500 block text-right mt-1.5">— {quote.author}</span>
            </div>

            <div className="border-t border-white/5 pt-4">
              <span className="text-[9px] font-mono text-violet-glow uppercase tracking-wider flex items-center mb-1">
                <Calendar className="w-3 h-3 text-violet-glow mr-1" /> Daily Quantum Fact
              </span>
              <p className="text-slate-300 text-xs leading-relaxed text-left">
                The quantum state vector lives in Hilbert space, a multi-dimensional mathematical space containing all possible probability wave vectors.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Discoveries and Research Publications Section */}
      <div className="glass-panel p-6 rounded-xl border border-white/5 text-left">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-mono uppercase text-slate-300 tracking-wider flex items-center">
            <Globe className="w-4 h-4 text-cyan-glow mr-2 animate-pulse-slow" /> Recent Quantum Discoveries
          </h3>
          <span className="text-[10px] font-mono text-slate-500 uppercase">Updates Daily</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DISCOVERIES.map((disc, index) => (
            <div key={index} className="space-y-2 border-l border-white/10 pl-4 py-1 hover:border-cyan-glow/50 transition-colors">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-cyan-glow">{disc.source}</span>
                <span className="text-slate-500">{disc.date}</span>
              </div>
              <h4 className="font-semibold text-white text-sm leading-snug hover:text-cyan-glow cursor-pointer transition-colors">
                {disc.title}
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                {disc.summary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
