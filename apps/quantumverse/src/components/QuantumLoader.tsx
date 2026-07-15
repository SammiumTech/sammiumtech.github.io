import React, { useEffect, useRef, useState } from "react";
import { 
  Volume2, VolumeX, Shield, RefreshCw, ArrowRight,
  Atom, Database, Layers, Bot, Cpu, Sparkles, BookOpen, Activity
} from "lucide-react";
import { audioService } from "../utils/audioService";

interface QuantumLoaderProps {
  onComplete: () => void;
}

// 10 sequential phases mapping the boot flow precisely
type SceneType = 
  | "scene1_dark"            // Phase 01: Awakening part A (completely black, silent)
  | "scene2_ignition"        // Phase 01: Awakening part B (centered pulsing blue photon, "Quantum synchronization initiated")
  | "scene3_calibration"     // Phase 02: Identity Synchronization (concentric holographic scanner, elegant confirmations)
  | "scene4_charging"        // Phase 03: Quantum Lattice (connected glowing 3D lattice assembling, mouse reaction)
  | "scene5_hyperdrive"      // Phase 04: Dimensional Fold (geometric wireframe folds, spiral curved warp tunnels)
  | "scene6_portal"          // Phase 05: Quantum Corridor (infinite receding corridor of light, floating scientific equations & orbitals)
  | "scene7_materialization" // Phase 06: Knowledge Stream (streams of knowledge text fields merging to center)
  | "scene8_ai"              // Phase 07: AI Core Emergence (glowing waveform breathing core, "Quantum environment stabilized")
  | "scene9_diagnostics"     // Phase 08 & 09: Logo Materialization & Research Lab Creation part A
  | "scene10_reveal";        // Phase 10: Arrival (logo assembled atom-by-atom, Shockwave pulse, ready state)

interface Particle3D {
  x: number; 
  y: number; 
  z: number; 
  targetX?: number; // For atom-by-atom logo assembly
  targetY?: number; // For atom-by-atom logo assembly
  size: number;
  color: string;
  speed: number;
  angle: number;
  angleSpeed: number;
}

interface Subsystem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  status: "pending" | "active" | "complete";
  description: string;
}

const INITIAL_SUBSYSTEMS: Subsystem[] = [
  { id: "engine", name: "Quantum Engine", icon: Atom, status: "pending", description: "Spin-state eigenvalue arrays calibrated." },
  { id: "ai", name: "AI Core", icon: Bot, status: "pending", description: "Gemini cognitive inference pipelines online." },
  { id: "database", name: "Scientific Database", icon: Database, status: "pending", description: "Peer-reviewed source consensus verified." },
  { id: "simulator", name: "Particle Simulator", icon: Activity, status: "pending", description: "Schrödinger wave equation solvers active." },
  { id: "wave", name: "Wave Function Engine", icon: Layers, status: "pending", description: "Fourier wave-packet superposition matched." },
  { id: "visualizer", name: "Quantum Visualization", icon: Sparkles, status: "pending", description: "Accelerated canvas projection mapped." },
  { id: "library", name: "Research Library", icon: BookOpen, status: "pending", description: "Academic archives initialized." },
  { id: "lab", name: "Laboratory Systems", icon: Cpu, status: "pending", description: "Primary instrumentation channels aligned." }
];

interface FloatingSymbol {
  text?: string;
  type?: "orbital" | "dna" | "circuit" | "formula";
  x: number;
  y: number;
  z: number;
  rot: number;
  rotSpeed: number;
  scale: number;
}

// 3D floating scientific structures for the Corridor phase
const floatingSymbols: FloatingSymbol[] = [
  { text: "iℏ(∂/∂t)Ψ = ĤΨ", type: "formula", x: -260, y: -160, z: 450, rot: Math.random() * 2, rotSpeed: 0.003, scale: 1.15 },
  { text: "Δx · Δp ≥ ℏ/2", type: "formula", x: 250, y: -130, z: 350, rot: Math.random() * 2, rotSpeed: -0.004, scale: 1.0 },
  { text: "|Ψ⟩ = α|0⟩ + β|1⟩", type: "formula", x: -210, y: 150, z: 500, rot: Math.random() * 2, rotSpeed: 0.002, scale: 1.2 },
  { text: "E = mc²", type: "formula", x: 290, y: 170, z: 280, rot: Math.random() * 2, rotSpeed: -0.005, scale: 0.95 },
  { text: "∇ × B = μ₀J + μ₀ε₀(∂E/∂t)", type: "formula", x: -160, y: -220, z: 550, rot: Math.random() * 2, rotSpeed: 0.001, scale: 1.0 },
  { text: "Ĥ |Ψ⟩ = E |Ψ⟩", type: "formula", x: 180, y: -190, z: 480, rot: Math.random() * 2, rotSpeed: -0.003, scale: 1.05 },
  { type: "orbital", x: -320, y: 30, z: 380, rot: 0, rotSpeed: 0.008, scale: 1.0 },
  { type: "dna", x: 310, y: -50, z: 440, rot: 0, rotSpeed: 0.006, scale: 1.0 },
  { type: "circuit", x: 30, y: -180, z: 360, rot: 0, rotSpeed: 0.004, scale: 1.0 }
];

const KNOWLEDGE_STREAMS = [
  { name: "PHYSICS", angle: 0, color: "rgba(0, 243, 255, 0.95)" },
  { name: "MATHEMATICS", angle: Math.PI / 3, color: "rgba(189, 0, 255, 0.95)" },
  { name: "ASTRONOMY", angle: (2 * Math.PI) / 3, color: "rgba(34, 197, 94, 0.95)" },
  { name: "CHEMISTRY", angle: Math.PI, color: "rgba(234, 179, 8, 0.95)" },
  { name: "COMPUTER SCIENCE", angle: (4 * Math.PI) / 3, color: "rgba(239, 68, 68, 0.95)" },
  { name: "ENGINEERING", angle: (5 * Math.PI) / 3, color: "rgba(59, 130, 246, 0.95)" },
  { name: "ARTIFICIAL INTELLIGENCE", angle: Math.PI * 2, color: "rgba(255, 255, 255, 0.98)" }
];

export default function QuantumLoader({ onComplete }: QuantumLoaderProps) {
  const [isRepeat, setIsRepeat] = useState(false);
  const [skipAllowed, setSkipAllowed] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(audioService.isEnabled());
  const [currentScene, setCurrentScene] = useState<SceneType>("scene1_dark");
  const [sceneProgress, setSceneProgress] = useState(0);
  const [subsystems, setSubsystems] = useState<Subsystem[]>(INITIAL_SUBSYSTEMS);
  const [systemLogs, setSystemLogs] = useState<string[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  const mousePosRef = useRef({ x: -1000, y: -1000 });
  const clickRipplesRef = useRef<{ x: number; y: number; r: number; alpha: number }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isTabActiveRef = useRef(true);

  // Time stamp to track assembly timing in scene10
  const scene10StartRef = useRef<number>(0);

  // Fallback Text-to-Speech gentle voice synthesizer
  const speakAI = (text: string) => {
    if (!soundEnabled || typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      
      // Look for smooth, high-quality, professional English voices
      const voice = voices.find(v => v.lang.startsWith("en") && (
        v.name.includes("Google") || 
        v.name.includes("Natural") || 
        v.name.includes("Zira") || 
        v.name.includes("Samantha") || 
        v.name.includes("Hazel")
      )) || voices.find(v => v.lang.startsWith("en")) || voices[0];
      
      if (voice) {
        utterance.voice = voice;
      }
      utterance.pitch = 0.95; // Calm, slightly deeper pitch
      utterance.rate = 0.95;  // Slightly measured pace
      utterance.volume = 0.65; // Balanced volume
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis initialization error:", e);
    }
  };

  // Check storage for repeat visit and reduced motion pref
  useEffect(() => {
    const visited = localStorage.getItem("quantumverse_visited") === "true";
    setIsRepeat(visited);
    localStorage.setItem("quantumverse_visited", "true");

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    // Skip is allowed after a short moment
    const skipTimer = setTimeout(() => {
      setSkipAllowed(true);
    }, 1200);

    const handleVisibilityChange = () => {
      isTabActiveRef.current = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Pre-load voices so speechSynthesis behaves perfectly
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }

    return () => {
      clearTimeout(skipTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Handle overall 10-Scene automatic transition timeline
  useEffect(() => {
    const factor = isRepeat ? 0.45 : 1.0; // Fast track on subsequent visits for high usability

    const timeline: { scene: SceneType; delay: number; log: string }[] = [
      { scene: "scene1_dark", delay: 0, log: "Quantum synchronization initiated. Absolute darkness calibration active." },
      { scene: "scene2_ignition", delay: 1000 * factor, log: "Phase 01: Awakening // Single blue photon coherence triggered." },
      { scene: "scene3_calibration", delay: 2200 * factor, log: "Phase 02: Identity Synchronization // Running holographic scanners..." },
      { scene: "scene4_charging", delay: 3500 * factor, log: "Phase 03: Quantum Lattice // self-assembling particle fields." },
      { scene: "scene5_hyperdrive", delay: 4800 * factor, log: "Phase 04: Dimensional Fold // Lattice warping spacetime contours." },
      { scene: "scene6_portal", delay: 6100 * factor, log: "Phase 05: Quantum Corridor // Infinite wave-guide tunnel active." },
      { scene: "scene7_materialization", delay: 7400 * factor, log: "Phase 06: Knowledge Stream // Inter-disciplinary coordinates merging." },
      { scene: "scene8_ai", delay: 8700 * factor, log: "Phase 07: AI Core Emergence // Gemini intelligence core breathing." },
      { scene: "scene9_diagnostics", delay: 10000 * factor, log: "Phase 08 & 09: Logo Materialization & Research Lab Creation..." },
      { scene: "scene10_reveal", delay: 11200 * factor, log: "Phase 10: Arrival // Coherence locked. QuantumVerse environment ready." }
    ];

    const timeouts: NodeJS.Timeout[] = [];

    timeline.forEach((item, index) => {
      const timeoutId = setTimeout(() => {
        if (!isTabActiveRef.current) return;
        setCurrentScene(item.scene);
        setSceneProgress(Math.round(((index + 1) / timeline.length) * 100));
        setSystemLogs((prev) => [...prev, item.log]);
        triggerSynthTrans(item.scene);

        if (item.scene === "scene4_charging") {
          runSubsystemBootSequence(factor);
        }

        if (item.scene === "scene9_diagnostics") {
          setSubsystems((prev) => prev.map(s => ({ ...s, status: "complete" })));
        }
      }, item.delay);
      timeouts.push(timeoutId);
    });

    // Auto complete after final reveal
    const completeTimeoutId = setTimeout(() => {
      handleArrivalComplete();
    }, 14500 * factor);
    timeouts.push(completeTimeoutId);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isRepeat]);

  // Iteratively activate subsystems with visual feedback
  const runSubsystemBootSequence = (factor: number) => {
    INITIAL_SUBSYSTEMS.forEach((sub, idx) => {
      setTimeout(() => {
        setSubsystems((prev) => {
          const next = [...prev];
          if (next[idx]) {
            next[idx].status = "active";
            if (idx > 0 && next[idx - 1]) {
              next[idx - 1].status = "complete";
            }
          }
          return next;
        });
        
        setSystemLogs((prev) => [...prev, `✓ Subsystem [${sub.name}] active.`]);
        playSubsystemChime(idx);
      }, idx * 160 * factor);
    });
  };

  const toggleSound = () => {
    const nextState = !soundEnabled;
    audioService.setSoundEnabled(nextState);
    setSoundEnabled(nextState);
  };

  const playSubsystemChime = (index: number) => {
    if (!soundEnabled) return;
    const sub = INITIAL_SUBSYSTEMS[index];
    if (sub) {
      audioService.playCalibration(sub.id);
    }
  };

  const triggerSynthTrans = (scene: SceneType) => {
    if (!soundEnabled) return;
    if (scene === "scene2_ignition") {
      audioService.playHover("sparkle");
      speakAI("Welcome. Before you is a universe nearly 14 billion years old. Every point of light represents a story waiting to be explored.");
    } else if (scene === "scene3_calibration") {
      audioService.playHover("shimmer");
    } else if (scene === "scene5_hyperdrive") {
      audioService.playHyperdriveCharging();
    } else if (scene === "scene6_portal") {
      audioService.playQuantumJump();
    } else if (scene === "scene8_ai") {
      audioService.playAICoreBoot();
      speakAI("Quantum environment stabilized.");
    } else if (scene === "scene10_reveal") {
      audioService.playDashboardArrival();
    }
  };

  const playClickBeep = () => {
    if (!soundEnabled) return;
    audioService.playClick("pulse");
  };

  const handleArrivalComplete = () => {
    if (soundEnabled) {
      audioService.playDashboardArrival();
    } else {
      audioService.stopAmbience();
    }
    onComplete();
  };

  // Generates 2D targets for the particles during the atom-by-atom reveal phase
  const sampleLogoTargetCoordinates = (width: number, height: number): { x: number; y: number }[] => {
    const coords: { x: number; y: number }[] = [];
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return [];

    tempCtx.fillStyle = "#000";
    tempCtx.fillRect(0, 0, width, height);

    tempCtx.fillStyle = "#fff";
    tempCtx.font = "black 900 68px 'Inter', sans-serif";
    tempCtx.textAlign = "center";
    tempCtx.textBaseline = "middle";
    tempCtx.fillText("QUANTUMVERSE", width / 2, height / 2 - 20);

    const imgData = tempCtx.getImageData(0, 0, width, height);
    const data = imgData.data;

    const step = 5; // Fine scanning step for pristine density
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * width + x) * 4;
        const r = data[index];
        if (r > 128) {
          coords.push({ x, y });
        }
      }
    }
    return coords;
  };

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let logoCoordinates: { x: number; y: number }[] = [];

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      logoCoordinates = sampleLogoTargetCoordinates(width, height);
    };
    window.addEventListener("resize", handleResize);

    logoCoordinates = sampleLogoTargetCoordinates(width, height);

    // Instantiate 3D Particle Cloud
    const particleCount = 400; // Increased density
    const particles: Particle3D[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 1200,
        y: (Math.random() - 0.5) * 1200,
        z: Math.random() * 900 + 100,
        size: Math.random() * 2.5 + 0.5,
        color: i % 4 === 0 
          ? "rgba(0, 243, 255, 0.9)" 
          : i % 4 === 1 
            ? "rgba(189, 0, 255, 0.8)" 
            : i % 4 === 2 
              ? "rgba(255, 255, 255, 0.95)" 
              : "rgba(34, 197, 94, 0.7)",
        speed: Math.random() * 0.4 + 0.15,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.012
      });
    }

    let photonX = width / 2;
    let photonY = height / 2;
    let waveRipples: { x: number; y: number; r: number; alpha: number }[] = [];

    let frameCount = 0;

    const loop = () => {
      if (!isTabActiveRef.current) {
        requestAnimationFrame(loop);
        return;
      }
      frameCount++;

      // Background clearing with custom trail settings per scene
      if (currentScene === "scene5_hyperdrive") {
        ctx.fillStyle = "rgba(4, 7, 18, 0.28)"; // Flowing trails
      } else if (currentScene === "scene10_reveal") {
        ctx.fillStyle = "rgba(4, 7, 18, 0.4)";  // Clean assembly fade
      } else {
        ctx.fillStyle = "rgba(4, 7, 18, 0.15)";
      }
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const fov = 350;

      let cameraShake = 0;
      if (!prefersReducedMotion) {
        if (currentScene === "scene5_hyperdrive") {
          cameraShake = Math.sin(frameCount * 2.5) * 3.5;
        } else if (currentScene === "scene4_charging") {
          cameraShake = Math.sin(frameCount * 0.7) * 0.8;
        }
      }

      ctx.save();
      ctx.translate(cameraShake, cameraShake);

      // Render manual interactive click ripples
      clickRipplesRef.current = clickRipplesRef.current
        .map((r) => ({ ...r, r: r.r + 4.2, alpha: r.alpha - 0.016 }))
        .filter((r) => r.alpha > 0);

      clickRipplesRef.current.forEach((r) => {
        ctx.strokeStyle = `rgba(0, 243, 255, ${r.alpha * 0.65})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(189, 0, 255, ${r.alpha * 0.35})`;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r * 1.3, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Render spatial coordinates or reference grid lines
      let gridAlpha = 0.0;
      if (currentScene === "scene2_ignition") gridAlpha = 0.015;
      else if (currentScene === "scene3_calibration") gridAlpha = 0.08;
      else if (currentScene === "scene4_charging") gridAlpha = 0.05;
      else if (currentScene === "scene5_hyperdrive") gridAlpha = 0.01;
      else if (currentScene === "scene6_portal") gridAlpha = 0.04;
      else if (currentScene === "scene7_materialization") gridAlpha = 0.03;
      else if (currentScene === "scene8_ai" || currentScene === "scene9_diagnostics") gridAlpha = 0.04;

      if (gridAlpha > 0) {
        ctx.strokeStyle = `rgba(0, 243, 255, ${gridAlpha})`;
        ctx.lineWidth = 1;
        const step = 64;
        const warpActive = currentScene === "scene3_calibration";

        for (let x = 0; x < width; x += step) {
          ctx.beginPath();
          const warpVal = warpActive ? Math.sin(x * 0.01 + frameCount * 0.04) * 18 : 0;
          ctx.moveTo(x, 0);
          ctx.lineTo(x + warpVal, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += step) {
          ctx.beginPath();
          const warpVal = warpActive ? Math.cos(y * 0.01 + frameCount * 0.04) * 18 : 0;
          ctx.moveTo(0, y);
          ctx.lineTo(width, y + warpVal);
          ctx.stroke();
        }
      }

      // Handle 3D Particles cloud projection
      particles.forEach((p, idx) => {
        let speedMultiplier = 1.0;
        if (currentScene === "scene5_hyperdrive") {
          speedMultiplier = prefersReducedMotion ? 3.0 : 32.0;
        } else if (currentScene === "scene3_calibration") {
          speedMultiplier = 1.8;
        } else if (currentScene === "scene10_reveal") {
          speedMultiplier = 0.25;
        }

        p.z -= p.speed * speedMultiplier;

        if (p.z <= 1 && currentScene !== "scene10_reveal") {
          p.z = 1000;
          p.x = (Math.random() - 0.5) * 1200;
          p.y = (Math.random() - 0.5) * 1200;
        }

        // Curved light tunnel spiral projection during hyperdrive / fold phases
        let px = cx + (p.x / p.z) * fov;
        let py = cy + (p.y / p.z) * fov;

        if ((currentScene === "scene4_charging" || currentScene === "scene5_hyperdrive") && !prefersReducedMotion) {
          const spiralAngle = (p.z / 1000) * Math.PI * 1.5;
          const rotatedX = p.x * Math.cos(spiralAngle) - p.y * Math.sin(spiralAngle);
          const rotatedY = p.x * Math.sin(spiralAngle) + p.y * Math.cos(spiralAngle);
          px = cx + (rotatedX / p.z) * fov;
          py = cy + (rotatedY / p.z) * fov;
        }

        // Phase 08 Logo assembly: spring particles to letter positions
        if (currentScene === "scene10_reveal" && logoCoordinates.length > 0) {
          if (scene10StartRef.current === 0) {
            scene10StartRef.current = frameCount;
          }
          const targetCoord = logoCoordinates[idx % logoCoordinates.length];
          if (targetCoord) {
            const progress = Math.min(1.0, (frameCount - scene10StartRef.current) / 110);
            
            // Spiralling inward trajectory
            const spiralAngle = (1.0 - progress) * Math.PI * 4;
            const spiralRad = (1.0 - progress) * Math.max(width, height) * 0.55;
            
            const targetX = targetCoord.x;
            const targetY = targetCoord.y;

            px = targetX + Math.cos(p.angle + spiralAngle) * spiralRad;
            py = targetY + Math.sin(p.angle + spiralAngle) * spiralRad;
          }
        }

        // Mouse interaction: nearby nodes react to cursor
        const dx = px - mousePosRef.current.x;
        const dy = py - mousePosRef.current.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 140) {
          const force = (140 - dist) / 140;
          px += (dx / dist) * force * 15;
          py += (dy / dist) * force * 15;
        }

        const sizeOnScreen = Math.max(0.2, (1.0 - p.z / 1000) * p.size * 3.4);

        if (currentScene === "scene5_hyperdrive" && !prefersReducedMotion) {
          // Curved tunnel ribbon streak lines
          const prevZ = p.z + p.speed * speedMultiplier;
          const spiralAnglePrev = (prevZ / 1000) * Math.PI * 1.5;
          const rotPrevX = p.x * Math.cos(spiralAnglePrev) - p.y * Math.sin(spiralAnglePrev);
          const rotPrevY = p.x * Math.sin(spiralAnglePrev) + p.y * Math.cos(spiralAnglePrev);
          const ppx = cx + (rotPrevX / prevZ) * fov;
          const ppy = cy + (rotPrevY / prevZ) * fov;

          ctx.strokeStyle = p.color;
          ctx.lineWidth = sizeOnScreen * 1.6;
          ctx.beginPath();
          ctx.moveTo(ppx, ppy);
          ctx.lineTo(px, py);
          ctx.stroke();
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(px, py, sizeOnScreen, 0, Math.PI * 2);
          ctx.fill();
        }

        // Phase 03: self-assembling 3D lattice (connecting nodes within proximity)
        if (currentScene === "scene4_charging" && idx % 3 === 0) {
          for (let j = idx + 1; j < Math.min(idx + 12, particles.length); j++) {
            const op = particles[j];
            const opx = cx + (op.x / op.z) * fov;
            const opy = cy + (op.y / op.z) * fov;
            const ldx = px - opx;
            const ldy = py - opy;
            const ldist = Math.sqrt(ldx*ldx + ldy*ldy);
            if (ldist < 75) {
              ctx.strokeStyle = `rgba(0, 243, 255, ${(1.0 - ldist / 75) * 0.18})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(px, py);
              ctx.lineTo(opx, opy);
              ctx.stroke();
            }
          }
        }
      });

      // Phase 01: Awakening (centered blue photon, pulsing slowly)
      if (currentScene === "scene2_ignition" || currentScene === "scene3_calibration") {
        const pulse = 1.0 + Math.sin(frameCount * 0.05) * 0.15;
        
        // SCANNER RIPPLES forming around the photon
        if (frameCount % 18 === 0) {
          waveRipples.push({ x: cx, y: cy, r: 8, alpha: 0.9 });
        }

        waveRipples.forEach((ripple, rIdx) => {
          ripple.r += 4.8;
          ripple.alpha -= 0.012;
          if (ripple.alpha <= 0) {
            waveRipples.splice(rIdx, 1);
            return;
          }

          ctx.strokeStyle = `rgba(0, 243, 255, ${ripple.alpha * 0.35})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ripple.r, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = `rgba(189, 0, 255, ${ripple.alpha * 0.18})`;
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ripple.r * 1.3, 0, Math.PI * 2);
          ctx.stroke();
        });

        // Photon core
        const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 32 * pulse);
        glowGrad.addColorStop(0, "rgba(255, 255, 255, 1.0)");
        glowGrad.addColorStop(0.35, "rgba(0, 243, 255, 0.95)");
        glowGrad.addColorStop(0.7, "rgba(189, 0, 255, 0.32)");
        glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 32 * pulse, 0, Math.PI * 2);
        ctx.fill();
      }

      // Phase 02 Scanner: Concentric thin holographic scanner rings
      if (currentScene === "scene3_calibration") {
        const ringRadius = 130 + Math.sin(frameCount * 0.03) * 6;
        ctx.strokeStyle = "rgba(0, 243, 255, 0.22)";
        ctx.lineWidth = 1.2;
        
        ctx.save();
        ctx.translate(cx, cy);
        
        ctx.rotate(frameCount * 0.008);
        ctx.beginPath();
        ctx.setLineDash([15, 30, 45, 15]);
        ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.rotate(-frameCount * 0.015);
        ctx.strokeStyle = "rgba(189, 0, 255, 0.16)";
        ctx.beginPath();
        ctx.setLineDash([25, 15, 35, 25]);
        ctx.arc(0, 0, ringRadius * 1.35, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
        ctx.setLineDash([]);
      }

      // Phase 04 Fold: Impossible geometric wireframes folding
      if (currentScene === "scene5_hyperdrive") {
        ctx.strokeStyle = "rgba(0, 243, 255, 0.15)";
        ctx.lineWidth = 1;
        const radiusLimit = Math.max(width, height) * 0.7;
        for (let r = 80; r < radiusLimit; r += 140) {
          ctx.beginPath();
          ctx.arc(cx, cy, r + Math.sin(frameCount * 0.06) * 22, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Phase 05 Corridor: Concentric receding space tunnel with rotating equations
      if (currentScene === "scene6_portal") {
        const tunnelSpeed = (frameCount * 0.015) % 1;
        ctx.lineWidth = 1.2;
        for (let i = 0; i < 7; i++) {
          const zDepth = (7 - i - tunnelSpeed) / 7;
          const r = zDepth * Math.max(width, height) * 0.65;
          const alpha = (1 - zDepth) * 0.32;
          ctx.strokeStyle = `rgba(0, 243, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Float rotating scientific symbols & equations
        floatingSymbols.forEach((sym) => {
          sym.rot += sym.rotSpeed;
          const px = cx + (sym.x / sym.z) * fov;
          const py = cy + (sym.y / sym.z) * fov;
          const sizeScale = (1.0 - sym.z / 1000) * sym.scale;
          const alpha = Math.max(0.12, (1.0 - sym.z / 1000) * 0.75);

          if (px > 0 && px < width && py > 0 && py < height) {
            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(sym.rot);
            
            ctx.fillStyle = `rgba(0, 243, 255, ${alpha})`;
            ctx.strokeStyle = `rgba(189, 0, 255, ${alpha * 0.6})`;
            ctx.lineWidth = 1.2;

            if (sym.type === "formula" && sym.text) {
              ctx.font = `bold ${Math.round(13 * sizeScale)}px 'JetBrains Mono', monospace`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(sym.text, 0, 0);
            } else if (sym.type === "orbital") {
              ctx.beginPath();
              ctx.ellipse(0, 0, 40 * sizeScale, 14 * sizeScale, Math.PI / 4, 0, Math.PI * 2);
              ctx.stroke();
              ctx.beginPath();
              ctx.ellipse(0, 0, 40 * sizeScale, 14 * sizeScale, -Math.PI / 4, 0, Math.PI * 2);
              ctx.stroke();
              ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
              ctx.beginPath();
              ctx.arc(0, 0, 3 * sizeScale, 0, Math.PI * 2);
              ctx.fill();
            } else if (sym.type === "dna") {
              const dLength = 70 * sizeScale;
              ctx.beginPath();
              for (let t = -dLength/2; t <= dLength/2; t += 2) {
                const sineVal = Math.sin(t * 0.08 + frameCount * 0.04) * 12 * sizeScale;
                const cosVal = -Math.sin(t * 0.08 + frameCount * 0.04) * 12 * sizeScale;
                ctx.fillStyle = "rgba(0, 243, 255, 0.8)";
                ctx.fillRect(t, sineVal, 1.5, 1.5);
                ctx.fillStyle = "rgba(189, 0, 255, 0.8)";
                ctx.fillRect(t, cosVal, 1.5, 1.5);
              }
            } else if (sym.type === "circuit") {
              const w = 50 * sizeScale;
              ctx.beginPath();
              ctx.moveTo(-w/2, -8 * sizeScale);
              ctx.lineTo(w/2, -8 * sizeScale);
              ctx.moveTo(-w/2, 8 * sizeScale);
              ctx.lineTo(w/2, 8 * sizeScale);
              ctx.stroke();
              ctx.fillRect(-12 * sizeScale, -15 * sizeScale, 24 * sizeScale, 16 * sizeScale);
              ctx.strokeRect(-12 * sizeScale, -15 * sizeScale, 24 * sizeScale, 16 * sizeScale);
            }
            ctx.restore();
          }
        });
      }

      // Phase 06 Knowledge Stream: fields flowing in from screen corners
      if (currentScene === "scene7_materialization") {
        const streamProgress = Math.min(1.0, (frameCount % 130) / 110);
        KNOWLEDGE_STREAMS.forEach((stream) => {
          const startDist = Math.max(width, height) * 0.45;
          const dist = startDist * (1.0 - streamProgress);
          const sx = cx + Math.cos(stream.angle) * dist;
          const sy = cy + Math.sin(stream.angle) * dist;
          
          ctx.fillStyle = stream.color;
          ctx.font = "bold 12px 'JetBrains Mono', monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(stream.name, sx, sy);

          ctx.strokeStyle = stream.color;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(cx, cy);
          ctx.stroke();
        });
      }

      // Phase 07: AI Core Emergence (Spherical breathing, Waveform rings)
      if (currentScene === "scene8_ai" || currentScene === "scene9_diagnostics") {
        const pulseRatio = 1.0 + Math.sin(frameCount * 0.06) * 0.12;
        const radius = 62 * pulseRatio;

        // Circular vibrating energy wave
        ctx.strokeStyle = "rgba(0, 243, 255, 0.38)";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += 0.04) {
          const waveDisplacement = Math.sin(a * 12 + frameCount * 0.12) * 7 * pulseRatio;
          const wx = cx + Math.cos(a) * (radius + waveDisplacement);
          const wy = cy + Math.sin(a) * (radius + waveDisplacement);
          if (a === 0) ctx.moveTo(wx, wy);
          else ctx.lineTo(wx, wy);
        }
        ctx.closePath();
        ctx.stroke();

        // Core light gradients
        const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 48 * pulseRatio);
        coreGrad.addColorStop(0, "rgba(255, 255, 255, 1.0)");
        coreGrad.addColorStop(0.22, "rgba(0, 243, 255, 0.9)");
        coreGrad.addColorStop(0.68, "rgba(189, 0, 255, 0.36)");
        coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 48 * pulseRatio, 0, Math.PI * 2);
        ctx.fill();

        // Circulating orbital micro-photons
        for (let j = 0; j < 3; j++) {
          const orbitAngle = frameCount * 0.042 + (j * Math.PI * 2) / 3;
          const ox = cx + Math.cos(orbitAngle) * (110 * pulseRatio);
          const oy = cy + Math.sin(orbitAngle) * (38 * pulseRatio);
          ctx.fillStyle = j === 0 ? "#00f3ff" : j === 1 ? "#bd00ff" : "#22c55e";
          ctx.beginPath();
          ctx.arc(ox, oy, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Phase 08 Logo Assembly shockwave pulse wave
      if (currentScene === "scene10_reveal" && scene10StartRef.current > 0) {
        const pulseFrame = frameCount - scene10StartRef.current;
        if (pulseFrame > 115 && pulseFrame < 215) {
          const waveRadius = (pulseFrame - 115) * 20;
          ctx.strokeStyle = `rgba(0, 243, 255, ${(1.0 - (pulseFrame - 115) / 100) * 0.55})`;
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.arc(cx, cy, waveRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      ctx.restore();
      requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [currentScene]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    clickRipplesRef.current.push({ x, y, r: 4, alpha: 0.9 });
    playClickBeep();
  };

  const getBootSequenceTitle = () => {
    switch (currentScene) {
      case "scene1_dark": return "PHASE 01 // COHERENCE INIT";
      case "scene2_ignition": return "PHASE 01 // PHOTON SPARK DETECTED";
      case "scene3_calibration": return "PHASE 02 // IDENTITY SYNCHRONIZATION";
      case "scene4_charging": return "PHASE 03 // COHERENT QUANTUM LATTICE";
      case "scene5_hyperdrive": return "PHASE 04 // DIMENSIONAL RE-FOLD ENGAGED";
      case "scene6_portal": return "PHASE 05 // QUANTUM CORRIDOR ACTIVE";
      case "scene7_materialization": return "PHASE 06 // MERGING KNOWLEDGE STREAMS";
      case "scene8_ai": return "PHASE 07 // COGNITIVE CORE STABILIZED";
      case "scene9_diagnostics": return "PHASE 08 // ASSEMBLING COHESIVE LOGO";
      case "scene10_reveal": return "PHASE 10 // ARRIVAL // EXPERIMENT READY";
      default: return "BOOT COHERENCE LOADED";
    }
  };

  return (
    <div 
      className="relative w-full h-screen bg-[#040712] text-slate-100 overflow-hidden font-sans select-none flex flex-col justify-between p-6 md:p-10 scanline cursor-none"
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
    >
      {/* Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Volumetric glow */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-glow/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050816] to-transparent pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-full border border-cyan-glow/40 flex items-center justify-center bg-cyan-950/30 animate-pulse">
            <Shield className="w-4.5 h-4.5 text-cyan-glow" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-cyan-glow tracking-widest uppercase flex items-center gap-2">
              <span>QuantumVerse Console</span>
              {isRepeat && (
                <span className="text-[8px] bg-cyan-950 border border-cyan-glow/35 text-white px-1.5 rounded uppercase font-bold">
                  Fast Track Active
                </span>
              )}
            </div>
            <div className="text-xs font-semibold text-slate-400">Security Access: VERIFIED SCIENTIST</div>
          </div>
        </div>

        {/* Audio controls */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSound();
          }}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-glow/30 text-xs text-slate-300 font-mono transition-all hover:text-cyan-glow"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-cyan-glow animate-pulse" />
              <span>SOUND ENABLED</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-slate-500" />
              <span>SOUND MUTED</span>
            </>
          )}
        </button>
      </div>

      {/* Central Immersive Panel */}
      <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center justify-center text-center my-auto px-4 pointer-events-none">
        
        {/* Sequence Title Badge */}
        <div className="mb-4">
          <div className="flex items-center space-x-2.5 bg-slate-950/85 border border-white/5 px-4.5 py-1.5 rounded-full text-[10px] font-mono text-cyan-glow uppercase tracking-widest shadow-lg">
            <RefreshCw className="w-3 h-3 text-cyan-glow animate-spin" />
            <span>{getBootSequenceTitle()}</span>
          </div>
        </div>

        {/* Cinematic Content Rendering */}
        {currentScene !== "scene10_reveal" ? (
          <div className="space-y-2 animate-fade-in">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-glow">
              QUANTUMVERSE
            </h1>
            <p className="text-[9px] md:text-xs font-mono tracking-[0.25em] text-slate-400 uppercase max-w-lg mx-auto leading-relaxed">
              Scientific Quantum Simulations & Collaborative Knowledge Hub
            </p>
          </div>
        ) : (
          <div className="h-[100px] flex flex-col items-center justify-end animate-fade-in">
            <div className="text-[11px] font-mono tracking-[0.35em] text-cyan-glow uppercase animate-pulse mb-1.5 font-bold">
              WELCOME, RESEARCHER
            </div>
            <div className="text-xs text-slate-400 font-serif italic">
              "Curiosity drives discovery. Knowledge advances humanity."
            </div>
          </div>
        )}

        {/* Phase 02 Scanner Display elegant confirmations */}
        {currentScene === "scene3_calibration" && (
          <div className="w-full max-w-sm mt-8 bg-slate-950/80 p-4.5 rounded-lg border border-white/5 text-left font-mono text-[11px] text-cyan-glow/85 space-y-1.5 shadow-2xl animate-fade-in leading-normal">
            <div>&gt; Scanning Environment... <span className="text-emerald-400 font-bold">COMPLETE</span></div>
            <div>&gt; Synchronizing User Session... <span className="text-emerald-400 font-bold">VERIFIED</span></div>
            <div>&gt; Verifying Research Workspace... <span className="text-emerald-400 font-bold">READY</span></div>
          </div>
        )}

        {/* Interactive Dashboard showing Subsystems (Scene 4 & 9 focus) */}
        {(currentScene === "scene4_charging" || currentScene === "scene9_diagnostics") && (
          <div className="w-full max-w-2xl mt-8 bg-slate-950/90 p-5 rounded-xl border border-white/5 text-left space-y-4 shadow-2xl animate-fade-in">
            <span className="text-[10px] font-mono text-cyan-glow uppercase tracking-widest block border-b border-white/5 pb-2">
              QUANTUMVERSE SUBSYSTEM INVENTORY
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {subsystems.map((sub) => {
                const Icon = sub.icon;
                return (
                  <div key={sub.id} className="flex items-center space-x-3 p-2 rounded bg-slate-900/40 border border-transparent hover:border-cyan-glow/10 transition-all">
                    <div className={`p-1.5 rounded ${sub.status === "complete" ? "bg-emerald-950/60 text-emerald-400" : sub.status === "active" ? "bg-cyan-950 text-cyan-glow animate-pulse" : "bg-slate-950 text-slate-600"}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-[11px]">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-300 font-bold">{sub.name}</span>
                        <span className={sub.status === "complete" ? "text-emerald-400 font-bold" : sub.status === "active" ? "text-cyan-glow font-bold animate-pulse" : "text-slate-600"}>
                          {sub.status.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-500 block leading-relaxed mt-0.5">{sub.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* System Ledger Log Box */}
        {currentScene !== "scene3_calibration" && currentScene !== "scene4_charging" && currentScene !== "scene9_diagnostics" && (
          <div className="w-full max-w-lg mt-8 bg-slate-950/80 p-4 rounded-xl border border-white/5 text-left space-y-3 shadow-2xl relative overflow-hidden animate-fade-in">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-glow/5 to-violet-glow/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between text-xs font-mono border-b border-white/5 pb-2">
              <span className="text-slate-400">COHERENCE SYNCHRONIZER</span>
              <span className="text-cyan-glow font-bold">{sceneProgress}%</span>
            </div>

            <div className="w-full bg-slate-900 h-2 rounded overflow-hidden p-0.5 border border-slate-800">
              <div 
                className="bg-gradient-to-r from-cyan-glow via-quantum-blue to-violet-glow h-full rounded transition-all duration-300"
                style={{ width: `${sceneProgress}%` }}
              ></div>
            </div>

            {/* Scrolling Realtime Logs */}
            <div className="h-16 overflow-y-auto space-y-1 text-[10px] font-mono text-slate-400 pr-1 scrollbar-thin">
              {systemLogs.map((log, idx) => (
                <div key={idx} className="flex items-start space-x-1 border-b border-white/5 pb-1 last:border-0 last:pb-0">
                  <span className="text-cyan-glow font-bold shrink-0">✓</span>
                  <span>{log}</span>
                </div>
              ))}
              {systemLogs.length === 0 && (
                <div className="text-slate-600 animate-pulse">Synchronizing quantum particle grid array...</div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Bottom Footer Controls */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-4">
        <div className="text-[9px] font-mono text-slate-500 text-center sm:text-left mb-3 sm:mb-0">
          <div>QUANTUMVERSE v10.0 // LABORATORY BOOT SEQUENCE</div>
          <div>REAL-TIME DECOHERENCE ENGINE // ACCELERATED WEB GRAPHICS</div>
        </div>

        {skipAllowed && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleArrivalComplete();
            }}
            className="group px-5 py-2.5 rounded bg-cyan-glow hover:bg-white text-slate-950 font-mono text-xs font-bold transition-all duration-300 shadow-[0_0_15px_rgba(0,243,255,0.2)] flex items-center space-x-2 hover:scale-[1.03]"
          >
            <span>{isRepeat ? "BYPASS SYSTEM ACCESS" : "SKIP INTRO"}</span>
            <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

    </div>
  );
}
