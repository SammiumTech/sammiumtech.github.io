import React, { useState, useEffect, useRef } from "react";
import { 
  Atom, Sliders, Play, Pause, RotateCcw, HelpCircle, Eye, EyeOff, Sparkles, 
  Settings2, Activity, ShieldAlert, Cpu, CheckCircle2, ChevronRight, XCircle, 
  Download, BookOpen, GraduationCap, Compass, Layers, Volume2, ZoomIn, ZoomOut
} from "lucide-react";
import QuantumProbabilityGrid from "./QuantumProbabilityGrid";
import QuantumFieldCanvas from "./QuantumFieldCanvas";
import { audioService } from "../utils/audioService";

type SimType = "field" | "grid" | "slit" | "cloud" | "superposition" | "tunneling" | "entanglement" | "bloch";

interface UniversalSimProps {
  isPlaying: boolean;
  simSpeed: number;
  cameraZoom: number;
  cameraPanX: number;
  cameraPanY: number;
  onDataUpdate?: (data: any) => void;
  onMetricsUpdate?: (metrics: any) => void;
}

// Quiz Types
interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const quizzes: Record<SimType, QuizQuestion[]> = {
  field: [
    {
      question: "What corresponds to a 'particle' in quantum field theory?",
      options: [
        "A classical rigid sphere",
        "A localized excitation or ripple of a quantum field",
        "A mathematical point with no physical field interaction",
        "A transient gravitational vortex"
      ],
      correctIndex: 1,
      explanation: "In QFT, particles are not billiard balls; they are quantized, localized excitations of their underlying fields."
    },
    {
      question: "What is the Lagrangian term representing field mass in Klein-Gordon theory?",
      options: [
        "λ φ⁴",
        "1/2 m² φ²",
        "1/2 (∂ φ)²",
        "i ℏ ∂/∂t"
      ],
      correctIndex: 1,
      explanation: "The quadratic term 1/2 m² φ² in the Klein-Gordon Lagrangian density corresponds directly to the rest mass of the field excitations."
    }
  ],
  grid: [
    {
      question: "What does the square of the absolute wave function |Ψ|² represent?",
      options: [
        "The particle momentum amplitude",
        "The probability density of locating the particle",
        "The potential energy density",
        "The total thermodynamic entropy"
      ],
      correctIndex: 1,
      explanation: "According to the Born Rule, |Ψ(x)|² represents the probability density of finding the particle at coordinate x."
    }
  ],
  slit: [
    {
      question: "What happens to the interference pattern when we detect which slit each electron went through?",
      options: [
        "The interference fringes brighten and double",
        "The pattern collapses into two classical impact bands",
        "The waves shift phase by exactly 90 degrees",
        "The pattern remains completely unchanged"
      ],
      correctIndex: 1,
      explanation: "Active measurement collapses the path superposition, destroying the phase coherence needed for self-interference."
    }
  ],
  cloud: [
    {
      question: "Which quantum number determines the geometric shape of the electron orbital?",
      options: [
        "Principal quantum number (n)",
        "Angular momentum quantum number (l)",
        "Magnetic quantum number (m)",
        "Spin quantum number (s)"
      ],
      correctIndex: 1,
      explanation: "The angular momentum quantum number (l) governs orbital angular momentum and defines orbital shapes (s, p, d, f)."
    }
  ],
  superposition: [
    {
      question: "Which of these is a valid mathematical representation of a superposed qubit state?",
      options: [
        "|ψ⟩ = α|0⟩ + β|1⟩ where |α|² + |β|² = 1",
        "|ψ⟩ = |0⟩ × |1⟩",
        "|ψ⟩ = α|0⟩ - β|1⟩ where α + β = 1",
        "|ψ⟩ = (|0⟩ + |1⟩) / 2"
      ],
      correctIndex: 0,
      explanation: "A quantum state is represented as a linear combination of basis vectors where the sum of squared amplitudes is 1."
    }
  ],
  tunneling: [
    {
      question: "What happens to the wave function inside the forbidden potential barrier during tunneling?",
      options: [
        "It oscillates with twice the frequency",
        "It decays exponentially as an evanescent wave",
        "It instantly drops to absolute zero",
        "It reflects with inverted phase"
      ],
      correctIndex: 1,
      explanation: "Inside the potential barrier, the wave function has an imaginary momentum, causing it to decay exponentially."
    }
  ],
  entanglement: [
    {
      question: "If Alice and Bob share an entangled Singlet pair, and Alice measures spin UP, what does Bob measure?",
      options: [
        "Bob has a 50/50 chance of measuring UP or DOWN",
        "Bob immediately measures spin DOWN with 100% correlation",
        "Bob immediately measures spin UP with 100% correlation",
        "Bob's state remains coherent until measured twice"
      ],
      correctIndex: 1,
      explanation: "The EPR Singlet state has complete anti-correlation. Measuring Alice's state instantly collapses Bob's state to the exact opposite spin."
    }
  ],
  bloch: [
    {
      question: "Where are all pure quantum states located on the Bloch Sphere representation?",
      options: [
        "At the exact center of the sphere",
        "On the outer surface of the sphere",
        "Strictly on the north and south poles",
        "Strictly on the equatorial plane"
      ],
      correctIndex: 1,
      explanation: "Pure qubit states lie on the outer shell (surface) of the Bloch Sphere, whereas mixed states lie inside."
    }
  ]
};

export default function Simulations() {
  const [activeSim, setActiveSim] = useState<SimType>("field");

  // Universal Live Simulation Engine state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1.0); // 0.25x to 3x

  // Camera state
  const [cameraZoom, setCameraZoom] = useState<number>(1.0);
  const [cameraPanX, setCameraPanX] = useState<number>(0);
  const [cameraPanY, setCameraPanY] = useState<number>(0);
  const [autoCinematic, setAutoCinematic] = useState<boolean>(false);

  // Active Research panel tabs
  const [activeTab, setActiveTab] = useState<"assistant" | "data" | "educational">("assistant");
  
  // Educational subtabs
  const [activeEduTab, setActiveEduTab] = useState<"learn" | "experiment" | "challenge" | "quiz">("learn");

  // Active quiz states
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizQuestionIdx, setQuizQuestionIdx] = useState<number>(0);

  // Simulation metrics and data references for live graphing & CSV export
  const [liveMetrics, setLiveMetrics] = useState<any>({
    fps: 60,
    entropy: 0.24,
    coherence: 0.98,
    precision: "FP64",
    threadLatency: 4.12
  });

  const [simulationData, setSimulationData] = useState<any[]>([
    { timestamp: 0, amplitude: 0.45, energy: 65, probability: 0.5 }
  ]);

  // Handle auto-cinematic slow drift
  useEffect(() => {
    if (!autoCinematic || !isPlaying) return;
    let animId: number;
    let angle = 0;

    const drift = () => {
      angle += 0.015;
      setCameraPanX(Math.sin(angle) * 15);
      setCameraPanY(Math.cos(angle * 0.7) * 10);
      setCameraZoom(1.0 + Math.sin(angle * 0.4) * 0.08);
      animId = requestAnimationFrame(drift);
    };
    drift();
    return () => cancelAnimationFrame(animId);
  }, [autoCinematic, isPlaying]);

  // Trigger metrics refresh or incremental logs
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPlaying) return;
      const step = simSpeed;
      setSimulationData(prev => {
        const nextTime = prev.length > 0 ? prev[prev.length - 1].timestamp + 1 : 0;
        let amp = Math.abs(Math.sin(nextTime * 0.08 * step) * 0.7 + (Math.random() - 0.5) * 0.1);
        let nrg = 65 + Math.sin(nextTime * 0.03 * step) * 5;
        let prob = Math.min(1.0, Math.max(0, 0.5 + Math.cos(nextTime * 0.05 * step) * 0.4));
        const newData = [...prev, { timestamp: nextTime, amplitude: parseFloat(amp.toFixed(3)), energy: parseFloat(nrg.toFixed(1)), probability: parseFloat(prob.toFixed(3)) }];
        if (newData.length > 100) newData.shift();
        return newData;
      });

      // Update random telemetry metrics
      setLiveMetrics({
        fps: Math.floor(58 + Math.random() * 4),
        entropy: parseFloat((0.2 + Math.random() * 0.1).toFixed(3)),
        coherence: parseFloat((0.95 + Math.random() * 0.04).toFixed(3)),
        precision: "FP64",
        threadLatency: parseFloat((3.9 + Math.random() * 0.5).toFixed(2))
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isPlaying, simSpeed]);

  // Reset quiz states when active simulation changes
  useEffect(() => {
    setQuizQuestionIdx(0);
    setQuizAnswered(false);
    setSelectedOption(null);
    setQuizScore(0);
  }, [activeSim]);

  // Export CSV Data
  const exportData = (format: "csv" | "json") => {
    let content = "";
    let filename = `quantumverse_${activeSim}_data.json`;
    let mimeType = "application/json";

    if (format === "json") {
      content = JSON.stringify({ activeSim, metrics: liveMetrics, data: simulationData }, null, 2);
    } else {
      filename = `quantumverse_${activeSim}_data.csv`;
      mimeType = "text/csv";
      const headers = "timestamp,amplitude,energy,probability\n";
      const rows = simulationData.map(row => `${row.timestamp},${row.amplitude},${row.energy},${row.probability}`).join("\n");
      content = headers + rows;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    audioService.playClick("confirm");
  };

  // State-dependent AI explanations (Dynamic Custom Assistant)
  const getDynamicAIExplanation = () => {
    switch (activeSim) {
      case "field":
        return {
          title: "Quantum Field Ripple",
          equation: "𝔏 = ½(∂_μ φ)² - ½ m² φ² - λ φ⁴",
          insight: "This simulation calculates live coordinate displacements across a relativistic fields scalar manifold. You are observing fundamental excitations (particles) propagating as localized waves.",
          history: "Derived from the Klein-Gordon relativistic equation in 1926. It became the foundation of quantum electrodynamics (QED) and particle physics.",
          misconception: "Common Misconception: Particles are small solid spheres. In reality, particles are localized field vibrations in constant vacuum fluctuation.",
          application: "Higgs Field discovery at CERN, electromagnetic field propagation, semiconductor particle confinement."
        };
      case "grid":
        return {
          title: "2D Schrödinger Probability Field",
          equation: "iℏ ∂/∂t |Ψ⟩ = Ĥ |Ψ⟩",
          insight: "A complete numerical integration of the time-dependent Schrödinger wave equation. The height represents probability amplitudes while colors map complex phase angles.",
          history: "Formulated by Erwin Schrödinger in late 1925, earning him the Nobel Prize in Physics for capturing atomic wave behaviors.",
          misconception: "Common Misconception: The wave represents a physical dispersion of the electron. It is actually a wave of mathematical probability density.",
          application: "Nanotube charge modeling, electron microscope lenses, quantum dot semiconductors."
        };
      case "slit":
        return {
          title: "Double-Slit Interference",
          equation: "d sin θ = m λ",
          insight: "Electrons fired through double apertures interfere with themselves, creating diffraction fringes on the detector. Activating the observer collapses this wavefunction into two classical bands.",
          history: "Thomas Young first demonstrated optical interference in 1801. In 1961, Claus Jönsson successfully repeated it with physical electrons.",
          misconception: "Common Misconception: The observer requires a conscious human mind. In physics, any physical measurement or interaction causes collapse.",
          application: "Diffraction crystallography, electron holography, verification of quantum coherence limit."
        };
      case "cloud":
        return {
          title: "Hydrogenic Electron Orbitals",
          equation: "ψ_nℓm(r,θ,φ) = R_nℓ(r) Y_ℓ^m(θ,φ)",
          insight: "A Monte Carlo probabilistic reconstruction of the electron probability density cloud around a single proton nucleus.",
          history: "Derived by Erwin Schrödinger by solving his wave equation in spherical coordinates for a Coulomb potential.",
          misconception: "Common Misconception: Electrons orbit the nucleus like planets. In reality, they are cloud-like probability fields representing statistical locations.",
          application: "Chemical bonding dynamics, molecular structure modeling, spectroscopy analysis."
        };
      case "superposition":
        return {
          title: "Superposition & State Collapse",
          equation: "|ψ⟩ = α|0⟩ + β|1⟩",
          insight: "Control the probability amplitudes of ground and excited states before clicking measurement, causing wavefunction collapse.",
          history: "Superposition was formalized by Paul Dirac, establishing that a quantum state can exist in multiple eigenstates simultaneously.",
          misconception: "Common Misconception: A qubit is 'spinning' between 0 and 1. It is statically in a definite state of probability space.",
          application: "Quantum computation registers, secure cryptographic distribution, quantum key generators."
        };
      case "tunneling":
        return {
          title: "Quantum Barrier Penetration",
          equation: "T ≈ e^(-2κL)",
          insight: "Calculates wave packets colliding with potential energy barriers. The evanescent wave inside the barrier allows leakages into classically forbidden zones.",
          history: "Discovered by Friedrich Hund in 1927, and later formalized by George Gamow to explain alpha radioactive decays.",
          misconception: "Common Misconception: Particles physically break or punch holes through barriers. They actually leak mathematically as wavefunctions.",
          application: "Flash memory chips, Scanning Tunneling Microscopes (STM), stellar hydrogen fusion."
        };
      case "entanglement":
        return {
          title: "Entanglement EPR Linker",
          equation: "|Ψ⁻⟩ = (|01⟩ - |10⟩)/√2",
          insight: "EPR singlet state showing total spin anti-correlation. Measuring one particle instantly determines the state of the other across space.",
          history: "Proposed as a paradox by Einstein, Podolsky, and Rosen (EPR) in 1935. Disproven by John Stewart Bell's inequality in 1964.",
          misconception: "Common Misconception: Entanglement allows faster-than-light communication. No actual classical information or message can be transmitted this way.",
          application: "Quantum teleportation, superdense coding, quantum internet routing."
        };
      case "bloch":
        return {
          title: "3D Bloch Sphere Positioning",
          equation: "|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩",
          insight: "Geometrical representation of pure states as coordinates on a 3D sphere. Theta represents ground-to-excited ratio while Phi is the phase angle.",
          history: "Conceived by Felix Bloch in 1946 to model nuclear magnetic resonance spin vectors.",
          misconception: "Common Misconception: The sphere is a physical orbit. It is a mathematical mapping of a complex Hilbert space onto 3D coordinates.",
          application: "Qubit pulse calibration, MRI scanners, quantum logic gate engineering."
        };
    }
  };

  const currentAI = getDynamicAIExplanation();
  const activeQuizList = quizzes[activeSim];

  // Handle quiz options clicked
  const handleSelectOption = (idx: number) => {
    if (quizAnswered) return;
    setSelectedOption(idx);
    setQuizAnswered(true);
    const isCorrect = idx === activeQuizList[quizQuestionIdx].correctIndex;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      audioService.playClick("confirm");
    } else {
      audioService.playClick("tap");
    }
  };

  const handleNextQuiz = () => {
    setQuizAnswered(false);
    setSelectedOption(null);
    if (quizQuestionIdx < activeQuizList.length - 1) {
      setQuizQuestionIdx(prev => prev + 1);
    } else {
      setQuizQuestionIdx(0);
      setQuizScore(0);
    }
    audioService.playPressed("haptic");
  };

  return (
    <div className="space-y-6 text-left animate-fade-in relative">
      
      {/* Header and top HUD controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-950/80 p-5 rounded-xl border border-white/5 gap-4">
        <div>
          <span className="text-[10px] font-mono text-cyan-glow uppercase tracking-widest flex items-center mb-1">
            <Cpu className="w-3.5 h-3.5 text-cyan-glow mr-1.5 animate-spin-slow" /> Quantum Laboratory Platform
          </span>
          <h1 className="text-xl font-display font-black text-white tracking-tight uppercase">
            Holographic Experimentation Hub
          </h1>
        </div>

        {/* Engine Timing & Play state controls */}
        <div className="flex items-center flex-wrap gap-3 bg-slate-900/60 p-2 rounded-lg border border-white/5 text-xs font-mono">
          <button
            onClick={() => {
              setIsPlaying(!isPlaying);
              audioService.playClick("confirm");
            }}
            className={`p-1.5 rounded flex items-center space-x-1.5 ${isPlaying ? "bg-cyan-glow/10 text-cyan-glow" : "bg-red-950/20 text-red-400"}`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="text-[10px]">{isPlaying ? "RUNNING" : "PAUSED"}</span>
          </button>

          <button
            onClick={() => {
              // Trigger frame forward
              setSimulationData(prev => [...prev, { timestamp: Date.now(), amplitude: Math.random() * 0.5, energy: 65, probability: Math.random() }]);
              audioService.playClick("tap");
            }}
            disabled={isPlaying}
            className="p-1.5 rounded hover:bg-white/5 disabled:opacity-40 flex items-center"
            title="Step Frame Forward"
          >
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-[8px] ml-1">STEP</span>
          </button>

          {/* Simulation Speed Slider */}
          <div className="flex items-center space-x-2 border-l border-white/5 pl-3">
            <span className="text-slate-500 text-[10px]">SPEED:</span>
            <input 
              type="range" 
              min="0.25" 
              max="3.0" 
              step="0.25" 
              value={simSpeed}
              onChange={(e) => {
                setSimSpeed(parseFloat(e.target.value));
                audioService.playClick("tap");
              }}
              className="w-16 h-1 bg-slate-950 rounded cursor-pointer accent-cyan-glow"
            />
            <span className="text-white text-[10px] font-bold w-8">{simSpeed.toFixed(2)}x</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar laboratory navigation */}
        <div className="space-y-3 lg:col-span-1">
          <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center mb-1">
            <Sliders className="w-4 h-4 text-cyan-glow mr-2" /> Experiment Rigs
          </h3>

          <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-white/5">
            {(
              [
                { id: "field", name: "Quantum Field Ripple", desc: "Interactive relativistic scalar field" },
                { id: "grid", name: "2D Probability Field", desc: "Schrödinger probability manifold" },
                { id: "slit", name: "Double-Slit Duality", desc: "Coherence vs measurement collapse" },
                { id: "cloud", name: "Electron Cloud (H)", desc: "Probabilistic atomic orbitals" },
                { id: "superposition", name: "Superposition Explorer", desc: "State vector superposition collapse" },
                { id: "tunneling", name: "Quantum Tunneling", desc: "Classical barrier evasion leak" },
                { id: "entanglement", name: "Entanglement Linker", desc: "EPR singlet spin anti-correlations" },
                { id: "bloch", name: "Bloch Sphere", desc: "3D Hilbert space positioning" }
              ] as const
            ).map((sim) => (
              <button
                key={sim.id}
                onClick={() => {
                  setActiveSim(sim.id);
                  audioService.playPressed("haptic");
                  audioService.playCalibration(sim.id === "bloch" || sim.id === "entanglement" ? "engine" : "wave");
                }}
                onMouseEnter={() => {
                  audioService.playHover("tick");
                }}
                className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs flex flex-col space-y-1 ${activeSim === sim.id ? "bg-gradient-to-r from-cyan-950/40 to-violet-950/20 border-cyan-glow/40 shadow-[0_0_12px_rgba(0,243,255,0.06)]" : "border-transparent hover:bg-white/5"}`}
              >
                <span className="font-semibold text-white tracking-wide">{sim.name}</span>
                <span className="text-slate-400 text-[10px] leading-normal">{sim.desc}</span>
              </button>
            ))}
          </div>

          {/* Quick HUD Camera stage controls */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-white/5 space-y-3 font-mono text-xs text-left">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center">
              <Compass className="w-3.5 h-3.5 text-cyan-glow mr-1.5" /> Camera Stage Controller
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setCameraZoom(prev => Math.min(2.2, prev + 0.15));
                  audioService.playClick("tap");
                }}
                className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-white/5 flex items-center justify-center space-x-1"
              >
                <ZoomIn className="w-3 h-3 text-cyan-glow" />
                <span className="text-[9px]">ZOOM IN</span>
              </button>
              <button
                onClick={() => {
                  setCameraZoom(prev => Math.max(0.65, prev - 0.15));
                  audioService.playClick("tap");
                }}
                className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-white/5 flex items-center justify-center space-x-1"
              >
                <ZoomOut className="w-3 h-3 text-cyan-glow" />
                <span className="text-[9px]">ZOOM OUT</span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-1 text-center font-bold">
              <button
                onClick={() => { setCameraPanY(prev => prev - 10); audioService.playClick("tap"); }}
                className="p-1 bg-slate-900 hover:bg-slate-800 rounded text-slate-300"
              >
                ▲
              </button>
              <button
                onClick={() => { setCameraPanX(prev => prev - 10); audioService.playClick("tap"); }}
                className="p-1 bg-slate-900 hover:bg-slate-800 rounded text-slate-300"
              >
                ◀
              </button>
              <button
                onClick={() => { setCameraPanY(prev => prev + 10); audioService.playClick("tap"); }}
                className="p-1 bg-slate-900 hover:bg-slate-800 rounded text-slate-300"
              >
                ▼
              </button>
              <button
                onClick={() => { setCameraPanX(prev => prev + 10); audioService.playClick("tap"); }}
                className="p-1 bg-slate-900 hover:bg-slate-800 rounded text-slate-300"
              >
                ▶
              </button>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/5">
              <span className="text-[9px] text-slate-500">AUTO DRIFT:</span>
              <button
                onClick={() => {
                  setAutoCinematic(!autoCinematic);
                  audioService.playClick("confirm");
                }}
                className={`px-2 py-0.5 rounded text-[9px] ${autoCinematic ? "bg-cyan-glow/20 text-cyan-glow" : "bg-slate-900 text-slate-400"}`}
              >
                {autoCinematic ? "ON" : "OFF"}
              </button>
            </div>

            <button
              onClick={() => {
                setCameraZoom(1.0);
                setCameraPanX(0);
                setCameraPanY(0);
                setAutoCinematic(false);
                audioService.playClick("tap");
              }}
              className="w-full py-1 bg-slate-900 hover:bg-slate-800 text-[9px] font-bold rounded flex items-center justify-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RESET PERSPECTIVE</span>
            </button>
          </div>
        </div>

        {/* Central Active Simulation RIG Sandbox */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Main Stage with HUD Overlays */}
          <div className="relative border border-white/5 rounded-xl overflow-hidden bg-slate-950/70 p-1">
            
            {/* Holographic hud markers */}
            <div className="absolute top-4 left-4 z-10 flex items-center space-x-3 pointer-events-none">
              <div className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse"></div>
              <span className="text-[10px] font-mono text-cyan-glow tracking-widest uppercase">
                ACTIVE LAB FEED: {activeSim.toUpperCase()}_STREAM
              </span>
            </div>

            <div className="absolute top-4 right-4 z-10 font-mono text-[9px] text-slate-400 bg-slate-950/80 px-2 py-1 rounded border border-white/5 pointer-events-none space-x-2">
              <span>FPS: <span className="text-cyan-glow font-bold">{liveMetrics.fps}</span></span>
              <span>COHERENCE: <span className="text-violet-glow font-bold">{liveMetrics.coherence}</span></span>
              <span>ZOOM: <span className="text-white">{cameraZoom.toFixed(2)}x</span></span>
            </div>

            <div className="w-full">
              {activeSim === "field" && (
                <QuantumFieldCanvas />
              )}
              {activeSim === "grid" && (
                <QuantumProbabilityGrid />
              )}
              {activeSim === "slit" && (
                <DoubleSlitSim 
                  isPlaying={isPlaying} 
                  simSpeed={simSpeed}
                  cameraZoom={cameraZoom}
                  cameraPanX={cameraPanX}
                  cameraPanY={cameraPanY}
                />
              )}
              {activeSim === "cloud" && (
                <ElectronCloudSim 
                  isPlaying={isPlaying}
                  simSpeed={simSpeed}
                  cameraZoom={cameraZoom}
                  cameraPanX={cameraPanX}
                  cameraPanY={cameraPanY}
                />
              )}
              {activeSim === "superposition" && (
                <SuperpositionSim 
                  isPlaying={isPlaying}
                  simSpeed={simSpeed}
                  cameraZoom={cameraZoom}
                  cameraPanX={cameraPanX}
                  cameraPanY={cameraPanY}
                />
              )}
              {activeSim === "tunneling" && (
                <TunnelingSim 
                  isPlaying={isPlaying}
                  simSpeed={simSpeed}
                  cameraZoom={cameraZoom}
                  cameraPanX={cameraPanX}
                  cameraPanY={cameraPanY}
                />
              )}
              {activeSim === "entanglement" && (
                <EntanglementSim 
                  isPlaying={isPlaying}
                  simSpeed={simSpeed}
                  cameraZoom={cameraZoom}
                  cameraPanX={cameraPanX}
                  cameraPanY={cameraPanY}
                />
              )}
              {activeSim === "bloch" && (
                <BlochSphereSim 
                  isPlaying={isPlaying}
                  simSpeed={simSpeed}
                  cameraZoom={cameraZoom}
                  cameraPanX={cameraPanX}
                  cameraPanY={cameraPanY}
                />
              )}
            </div>
          </div>

          {/* Master Laboratory Dashboard Tabs: AI Assistant | Scientific Data | Educational Layers */}
          <div className="glass-panel rounded-xl border border-white/5 overflow-hidden">
            <div className="flex border-b border-white/5 bg-slate-950/60 font-mono text-xs">
              {[
                { id: "assistant", label: "AI Research Assistant", icon: Cpu },
                { id: "data", label: "Scientific Data Ledger", icon: Activity },
                { id: "educational", label: "Educational Curriculum", icon: GraduationCap }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      audioService.playClick("confirm");
                    }}
                    className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 border-r border-white/5 last:border-r-0 transition-colors ${activeTab === tab.id ? "bg-slate-900/40 text-cyan-glow border-b border-cyan-glow/45 font-bold" : "text-slate-400 hover:text-slate-200"}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-5 text-left">
              
              {/* Tab 1: AI Research Assistant */}
              {activeTab === "assistant" && (
                <div className="space-y-4 animate-fade-in font-mono text-xs">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[10px] text-cyan-glow uppercase tracking-wider flex items-center">
                      <Cpu className="w-4 h-4 text-cyan-glow mr-2 animate-spin-slow" /> Core Model Commentary
                    </span>
                    <span className="text-white font-bold text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-white/5">
                      {currentAI.title}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-3.5">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 uppercase">Live Scientific Insight:</span>
                        <p className="text-slate-200 leading-relaxed text-xs">
                          {currentAI.insight}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 uppercase">Historical Background:</span>
                        <p className="text-slate-400 leading-relaxed text-[11px]">
                          {currentAI.history}
                        </p>
                      </div>

                      <div className="p-3 bg-red-950/20 border border-red-500/10 rounded text-[11px] text-red-300 space-y-1">
                        <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider flex items-center">
                          <ShieldAlert className="w-3.5 h-3.5 mr-1.5" /> Quantum Misconception Debugger:
                        </span>
                        <p className="leading-relaxed font-sans">{currentAI.misconception}</p>
                      </div>
                    </div>

                    <div className="space-y-4 bg-slate-950 p-4 rounded-lg border border-white/5">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 uppercase block">Equation Manifest:</span>
                        <div className="py-2.5 px-3 bg-slate-900/60 rounded text-center text-white font-bold border border-white/5 text-xs">
                          {currentAI.equation}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] text-slate-500 uppercase block">Practical Applications:</span>
                        <p className="text-cyan-glow text-[11px] leading-relaxed">
                          {currentAI.application}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          audioService.playClick("confirm");
                          audioService.speak(`Now exploring ${currentAI.title}. The corresponding mathematical equation is ${currentAI.equation}.`);
                        }}
                        className="w-full py-1.5 bg-cyan-glow/10 hover:bg-cyan-glow/20 border border-cyan-glow/30 rounded text-cyan-glow font-bold text-[9px] tracking-wider uppercase flex items-center justify-center space-x-1.5 transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Query Audio Commentary</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Scientific Data Ledger */}
              {activeTab === "data" && (
                <div className="space-y-5 animate-fade-in font-mono text-xs">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[10px] text-cyan-glow uppercase tracking-wider flex items-center">
                      <Activity className="w-4 h-4 text-cyan-glow mr-2 animate-pulse" /> Live Telemetry Ledger
                    </span>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => exportData("csv")}
                        className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-white/10 text-[9px] text-slate-300 flex items-center space-x-1.5 transition-colors"
                      >
                        <Download className="w-3 h-3 text-cyan-glow" />
                        <span>EXPORT CSV</span>
                      </button>
                      <button
                        onClick={() => exportData("json")}
                        className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-white/10 text-[9px] text-slate-300 flex items-center space-x-1.5 transition-colors"
                      >
                        <Download className="w-3 h-3 text-cyan-glow" />
                        <span>EXPORT JSON</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Live plotting canvas of coordinates */}
                    <div className="md:col-span-2 space-y-3">
                      <span className="text-[10px] text-slate-500 uppercase block">Real-time Parameter Waveform</span>
                      <div className="bg-slate-950 p-3 rounded-lg border border-white/5 relative h-36 flex items-end overflow-hidden">
                        
                        {/* Live graphing lines */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                          <Layers className="w-16 h-16 text-cyan-glow animate-pulse" />
                        </div>

                        <div className="w-full flex items-end justify-between h-24 px-2">
                          {simulationData.map((d, idx) => {
                            const barHeight = d.amplitude * 100;
                            return (
                              <div 
                                key={idx} 
                                className="w-1.5 bg-gradient-to-t from-cyan-glow via-purple-500 to-transparent rounded-t transition-all duration-300"
                                style={{ height: `${Math.max(4, barHeight)}px` }}
                                title={`Timestamp: ${d.timestamp}, Amp: ${d.amplitude}`}
                              />
                            );
                          })}
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-500 text-center block">Scrolling distribution tracking the last 100 calculated frame intervals</span>
                    </div>

                    <div className="space-y-4">
                      <span className="text-[10px] text-slate-500 uppercase block">State Metrics Vector</span>
                      <div className="bg-slate-950 p-4 rounded-lg border border-white/5 space-y-2.5 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-slate-400">FPS Performance:</span>
                          <span className="text-emerald-400 font-bold">{liveMetrics.fps} Hz</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">State Entropy:</span>
                          <span className="text-cyan-glow font-bold">{liveMetrics.entropy} kB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">System Coherence:</span>
                          <span className="text-violet-glow font-bold">{(liveMetrics.coherence * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Thread Latency:</span>
                          <span className="text-white font-bold">{liveMetrics.threadLatency} ms</span>
                        </div>
                        <div className="flex justify-between border-t border-white/5 pt-2">
                          <span className="text-slate-500">IEEE Precision:</span>
                          <span className="text-white font-bold">{liveMetrics.precision}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Educational Curriculum */}
              {activeTab === "educational" && (
                <div className="space-y-4 animate-fade-in text-xs">
                  
                  {/* Edu subtabs menu */}
                  <div className="flex space-x-2 border-b border-white/5 pb-2 font-mono text-[10px]">
                    {[
                      { id: "learn", label: "LEARN CONCEPT", icon: BookOpen },
                      { id: "experiment", label: "PROCEDURAL EXPERIMENT", icon: Compass },
                      { id: "quiz", label: "KNOWLEDGE CHECK", icon: GraduationCap }
                    ].map((sTab) => {
                      const Icon = sTab.icon;
                      return (
                        <button
                          key={sTab.id}
                          onClick={() => {
                            setActiveEduTab(sTab.id as any);
                            audioService.playClick("tap");
                          }}
                          className={`px-3 py-1.5 rounded flex items-center space-x-1.5 border transition-all ${activeEduTab === sTab.id ? "bg-cyan-glow/15 border-cyan-glow/35 text-cyan-glow font-bold" : "bg-slate-900 border-white/5 text-slate-400 hover:text-white"}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{sTab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Edu Section 1: Learn Concept */}
                  {activeEduTab === "learn" && (
                    <div className="space-y-4 animate-fade-in font-sans">
                      <div className="space-y-1 text-left font-mono">
                        <h4 className="text-white font-bold uppercase text-xs tracking-wider">
                          📚 Academic Lecture: {currentAI.title}
                        </h4>
                        <p className="text-slate-400 text-xs">Progressive disclosures for physics scholars.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-xs text-slate-300">
                        <div className="space-y-3">
                          <p>
                            To master this module, scholars must understand how quantum states deviate from everyday classical intuition. While macroscopic objects possess deterministic coordinates, quantum elements are governed by probability fields.
                          </p>
                          <p>
                            Adjusting the active sliders dynamically changes the parameters of the partial differential wave equations. Observe how the live rendering adapts instantly to physical changes.
                          </p>
                        </div>
                        <div className="bg-slate-950 p-4 rounded-lg border border-white/5 space-y-2.5 font-mono text-[11px]">
                          <span className="text-[10px] text-cyan-glow uppercase tracking-wider block">Reference Formulation:</span>
                          <p className="text-white font-bold">{currentAI.equation}</p>
                          <div className="border-t border-white/5 pt-2 text-slate-400 text-[10px]">
                            <span className="text-slate-500 block">Practical Application:</span>
                            {currentAI.application}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Edu Section 2: Procedural Experiment */}
                  {activeEduTab === "experiment" && (
                    <div className="space-y-3 animate-fade-in font-sans text-xs">
                      <h4 className="text-white font-bold font-mono uppercase text-xs tracking-wider flex items-center">
                        <Compass className="w-4 h-4 text-cyan-glow mr-1.5" /> Step-by-Step Rig Procedure
                      </h4>
                      <p className="text-slate-400 font-mono text-[11px] pb-1 border-b border-white/5">
                        Follow these experimental procedures to analyze system limits:
                      </p>

                      <ol className="list-decimal list-inside space-y-2 text-slate-300 text-xs leading-relaxed">
                        <li>
                          <strong className="text-white">Adjust the variable controls:</strong> Manipulate the primary parameter values using the responsive sliders.
                        </li>
                        <li>
                          <strong className="text-white">Observe Wave Coherence:</strong> Watch the telemetry ledger under the Scientific Data tab and monitor stability indices.
                        </li>
                        <li>
                          <strong className="text-white">Warp the camera frame:</strong> Zoom or Pan using the camera controller sidebar to focus closely on the collision center.
                        </li>
                        <li>
                          <strong className="text-white">Conduct Calibration:</strong> Click the run calibration sweep button in the Trust Center or reset parameters to verify baseline integrity.
                        </li>
                      </ol>
                    </div>
                  )}

                  {/* Edu Section 3: Interactive Knowledge Check (Quiz) */}
                  {activeEduTab === "quiz" && (
                    <div className="space-y-4 animate-fade-in font-sans text-xs">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2 font-mono">
                        <span className="text-[10px] text-cyan-glow uppercase tracking-wider">
                          🧪 Knowledge Assessment Rig
                        </span>
                        <span className="text-slate-400">
                          Score: <span className="text-cyan-glow font-bold">{quizScore} / {activeQuizList.length}</span>
                        </span>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-lg border border-white/5 space-y-3">
                        <span className="text-[9px] font-mono text-slate-500 block uppercase">
                          Question {quizQuestionIdx + 1} of {activeQuizList.length}
                        </span>
                        <h4 className="text-white font-bold font-sans text-xs leading-normal">
                          {activeQuizList[quizQuestionIdx].question}
                        </h4>

                        <div className="space-y-2 pt-2">
                          {activeQuizList[quizQuestionIdx].options.map((opt, oIdx) => {
                            let optionStyle = "bg-slate-900 hover:bg-slate-800 border-white/5 text-slate-300";
                            if (quizAnswered) {
                              if (oIdx === activeQuizList[quizQuestionIdx].correctIndex) {
                                optionStyle = "bg-emerald-950/40 border-emerald-500/40 text-emerald-300";
                              } else if (selectedOption === oIdx) {
                                optionStyle = "bg-red-950/40 border-red-500/40 text-red-300";
                              } else {
                                optionStyle = "bg-slate-900/40 border-white/5 text-slate-500 opacity-60";
                              }
                            }

                            return (
                              <button
                                key={oIdx}
                                onClick={() => handleSelectOption(oIdx)}
                                disabled={quizAnswered}
                                className={`w-full text-left p-2.5 rounded border text-[11px] transition-all flex items-center justify-between ${optionStyle}`}
                              >
                                <span>{opt}</span>
                                {quizAnswered && oIdx === activeQuizList[quizQuestionIdx].correctIndex && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                )}
                                {quizAnswered && selectedOption === oIdx && oIdx !== activeQuizList[quizQuestionIdx].correctIndex && (
                                  <XCircle className="w-4 h-4 text-red-400" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {quizAnswered && (
                          <div className="pt-3 border-t border-white/5 space-y-3">
                            <div className="p-3 bg-cyan-950/20 border border-cyan-500/10 rounded text-[11px] text-cyan-300 leading-relaxed">
                              <span className="font-bold block text-white text-[10px] font-mono uppercase mb-1">Feedback Explanation:</span>
                              {activeQuizList[quizQuestionIdx].explanation}
                            </div>

                            <button
                              onClick={handleNextQuiz}
                              className="w-full py-2 bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow font-bold text-[10px] font-mono uppercase rounded hover:bg-cyan-glow/20 transition-all flex items-center justify-center space-x-1"
                            >
                              <span>
                                {quizQuestionIdx < activeQuizList.length - 1 ? "Next Question" : "Complete & Restart"}
                              </span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* 1. Double Slit Simulator */
function DoubleSlitSim({
  isPlaying,
  simSpeed,
  cameraZoom,
  cameraPanX,
  cameraPanY,
  onDataUpdate
}: UniversalSimProps) {
  const [wavelength, setWavelength] = useState<number>(450); // nm
  const [slitWidth, setSlitWidth] = useState<number>(20); // arbitrary
  const [observed, setObserved] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hitsRef = useRef<{ x: number; y: number; age: number }[]>([]);

  // Clear hits when settings change
  useEffect(() => {
    hitsRef.current = [];
  }, [wavelength, slitWidth, observed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const width = (canvas.width = 540);
    const height = (canvas.height = 240);

    const draw = () => {
      // Clean background (Always drawn static)
      ctx.fillStyle = "#050816";
      ctx.fillRect(0, 0, width, height);

      // Save context for perspective matrix transformation
      ctx.save();
      ctx.translate(width / 2 + cameraPanX, height / 2 + cameraPanY);
      ctx.scale(cameraZoom, cameraZoom);
      ctx.translate(-width / 2, -height / 2);

      // Render electron gun (emitter)
      ctx.fillStyle = "#0066ff";
      ctx.fillRect(10, height / 2 - 12, 25, 24);
      ctx.strokeStyle = "#00f3ff";
      ctx.strokeRect(10, height / 2 - 12, 25, 24);
      
      // Gun barrel
      ctx.fillStyle = "#00f3ff";
      ctx.fillRect(35, height / 2 - 3, 10, 6);

      // Slits barrier
      const barrierX = 220;
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.fillRect(barrierX, 0, 8, height);

      // Draw two slit holes
      const slitGap = 50;
      const slitSize = 25 - slitWidth * 0.4;
      const topSlitY = height / 2 - slitGap / 2 - slitSize / 2;
      const bottomSlitY = height / 2 + slitGap / 2 - slitSize / 2;

      ctx.fillStyle = "#050816";
      ctx.fillRect(barrierX - 1, topSlitY, 10, slitSize);
      ctx.fillRect(barrierX - 1, bottomSlitY, 10, slitSize);

      ctx.strokeStyle = "rgba(0, 243, 255, 0.4)";
      ctx.strokeRect(barrierX - 1, topSlitY, 10, slitSize);
      ctx.strokeRect(barrierX - 1, bottomSlitY, 10, slitSize);

      // Particle emissions
      if (isPlaying) {
        time += 1.5 * simSpeed;
        if (Math.random() < 0.2) {
          let finalY = height / 2;
          if (observed) {
            const chooseTop = Math.random() < 0.5;
            const slitCenter = chooseTop ? (topSlitY + slitSize/2) : (bottomSlitY + slitSize/2);
            finalY = slitCenter + (Math.random() - 0.5) * 35;
          } else {
            let found = false;
            let attempts = 0;
            while (!found && attempts < 100) {
              attempts++;
              const testY = Math.random() * height;
              const yNormalized = (testY - height / 2) / 60;
              const d = slitWidth * 0.15 + 1.2;
              const lam = wavelength * 0.003;
              const term = (Math.PI * d * yNormalized) / lam;
              const intensity = Math.pow(Math.cos(term), 2) / (1 + yNormalized * yNormalized * 0.8);
              if (Math.random() < intensity) {
                finalY = testY;
                found = true;
              }
            }
          }

          hitsRef.current.push({
            x: width - 50,
            y: finalY,
            age: 0
          });
        }
      }

      // Draw wavefront propagation lines (Left to Right) before barrier
      if (!observed) {
        ctx.strokeStyle = `rgba(0, 243, 255, 0.08)`;
        ctx.lineWidth = 1;
        const waveSpacing = 25;
        for (let i = 0; i < 8; i++) {
          const wX = 45 + ((time * 0.4 + i * waveSpacing) % 170);
          ctx.beginPath();
          ctx.arc(45, height / 2, wX, -Math.PI / 3, Math.PI / 3);
          ctx.stroke();
        }

        // Interference patterns propagating past the slits
        ctx.strokeStyle = `rgba(189, 0, 255, 0.06)`;
        for (let i = 0; i < 6; i++) {
          const r = ((time * 0.5 + i * waveSpacing) % 250);
          if (r < 250) {
            ctx.beginPath();
            ctx.arc(barrierX, topSlitY + slitSize/2, r, -Math.PI/2, Math.PI/2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(barrierX, bottomSlitY + slitSize/2, r, -Math.PI/2, Math.PI/2);
            ctx.stroke();
          }
        }
      } else {
        ctx.fillStyle = "rgba(239, 68, 68, 0.04)";
        ctx.fillRect(barrierX - 60, 0, 120, height);

        ctx.fillStyle = "rgba(0, 243, 255, 0.8)";
        const bulletX = 45 + ((time * 1.2) % 170);
        const bulletY = height / 2;
        ctx.beginPath();
        ctx.arc(bulletX, bulletY, 3, 0, Math.PI * 2);
        ctx.fill();

        const bulletX2 = barrierX + ((time * 1.2) % 250);
        if (bulletX2 < width - 50) {
          ctx.beginPath();
          ctx.arc(bulletX2, topSlitY + slitSize/2, 3, 0, Math.PI * 2);
          ctx.arc(bulletX2 - 40, bottomSlitY + slitSize/2, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw detection plate on far right
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(width - 50, 0, 10, height);
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.strokeRect(width - 50, 0, 10, height);

      // Render accumulated hits
      hitsRef.current.forEach((hit) => {
        hit.age += 1;
        const alpha = Math.min(1.0, hit.age / 5);
        ctx.fillStyle = observed ? `rgba(239, 68, 68, ${alpha})` : `rgba(0, 243, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(hit.x + 5, hit.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw distribution curve
      ctx.fillStyle = "rgba(0, 243, 255, 0.05)";
      ctx.strokeStyle = observed ? "rgba(239, 68, 68, 0.8)" : "rgba(0, 243, 255, 0.8)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let y = 0; y < height; y += 4) {
        const yNormalized = (y - height / 2) / 60;
        let intensity = 0;
        if (observed) {
          const t1 = (y - topSlitY - slitSize/2) / 18;
          const t2 = (y - bottomSlitY - slitSize/2) / 18;
          intensity = 0.45 * (Math.exp(-t1*t1) + Math.exp(-t2*t2));
        } else {
          const d = slitWidth * 0.15 + 1.2;
          const lam = wavelength * 0.003;
          const term = (Math.PI * d * yNormalized) / lam;
          intensity = 0.8 * Math.pow(Math.cos(term), 2) / (1 + yNormalized * yNormalized * 0.8);
        }

        const plotX = (width - 40) + intensity * 38;
        if (y === 0) ctx.moveTo(plotX, y);
        else ctx.lineTo(plotX, y);
      }
      ctx.stroke();

      ctx.restore(); // Restore camera matrix transformation

      // Static overlays
      if (observed) {
        ctx.fillStyle = "rgba(239, 68, 68, 0.8)";
        ctx.font = "9px monospace";
        ctx.fillText("COLLAPSED STATE: CLASSICAL CORPUSCLES", 15, 20);
      } else {
        ctx.fillStyle = "rgba(0, 243, 255, 0.8)";
        ctx.font = "9px monospace";
        ctx.fillText("COHERENT WAVEFUNCTION COEXISTENCE", 15, 20);
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [wavelength, slitWidth, observed, isPlaying, simSpeed, cameraZoom, cameraPanX, cameraPanY]);

  return (
    <div className="rounded-xl glass-panel border border-white/5 p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4 gap-3">
        <div>
          <h2 className="text-base font-display font-bold text-white flex items-center">
            <Atom className="w-4 h-4 text-cyan-glow mr-2 animate-spin-slow" /> Double-Slit Experiment
          </h2>
          <p className="text-[11px] text-slate-400">Wave-particle duality wavefunction dispersion</p>
        </div>

        <button
          onClick={() => {
            setObserved(!observed);
            audioService.playClick("confirm");
          }}
          className={`px-3 py-1 rounded text-[10px] font-mono flex items-center space-x-1.5 border transition-all ${observed ? "bg-red-950/45 border-red-500/50 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]" : "bg-slate-900 border-slate-700 hover:border-cyan-glow hover:text-cyan-glow text-slate-300"}`}
        >
          {observed ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          <span>{observed ? "Which-Way Active" : "Observe Path"}</span>
        </button>
      </div>

      <div className="relative border border-white/5 rounded-lg overflow-hidden bg-slate-950/80">
        <canvas ref={canvasRef} className="w-full h-auto block" />
        {observed && (
          <div className="absolute top-2 left-3 bg-red-950/80 border border-red-500/30 text-red-400 text-[9px] font-mono px-2 py-0.5 rounded flex items-center">
            <ShieldAlert className="w-3 h-3 mr-1" /> wavefunction collapsed
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="space-y-1 text-left">
          <label className="flex justify-between text-slate-400 text-[10px]">
            <span>SLIT SPACING (D)</span>
            <span className="text-cyan-glow font-bold">{slitWidth} pm</span>
          </label>
          <input
            type="range" min="5" max="45" value={slitWidth}
            onChange={(e) => { setSlitWidth(parseInt(e.target.value)); audioService.playClick("tap"); }}
            className="w-full h-1 bg-slate-950 rounded cursor-pointer accent-cyan-glow"
          />
        </div>

        <div className="space-y-1 text-left">
          <label className="flex justify-between text-slate-400 text-[10px]">
            <span>WAVELENGTH (λ)</span>
            <span className="text-cyan-glow font-bold" style={{ color: wavelength < 500 ? "#8b5cf6" : wavelength > 600 ? "#ef4444" : "#00f3ff" }}>
              {wavelength} nm
            </span>
          </label>
          <input
            type="range" min="380" max="750" value={wavelength}
            onChange={(e) => { setWavelength(parseInt(e.target.value)); audioService.playClick("tap"); }}
            className="w-full h-1 bg-slate-950 rounded cursor-pointer accent-cyan-glow"
          />
        </div>
      </div>
    </div>
  );
}

/* 2. Electron Cloud Simulator */
function ElectronCloudSim({
  isPlaying,
  simSpeed,
  cameraZoom,
  cameraPanX,
  cameraPanY
}: UniversalSimProps) {
  const [n, setN] = useState<number>(2); // principal quantum number (1 to 4)
  const [l, setL] = useState<number>(1); // angular momentum (0 to n-1)
  const [m, setM] = useState<number>(0); // magnetic (restricted to -l to l)
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Keep L bounded by N
  useEffect(() => {
    if (l >= n) {
      setL(n - 1);
    }
  }, [n]);

  // Keep M bounded by L
  useEffect(() => {
    if (Math.abs(m) > l) {
      setM(0);
    }
  }, [l]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = 540);
    const height = (canvas.height = 240);
    const cx = width / 2;
    const cy = height / 2;
    let time = 0;

    const drawCloud = () => {
      ctx.fillStyle = "#050816";
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(cx + cameraPanX, cy + cameraPanY);
      ctx.scale(cameraZoom, cameraZoom);
      ctx.translate(-cx, -cy);

      if (isPlaying) {
        time += 0.05 * simSpeed;
      }

      // Draw nucleus
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();

      // Monte Carlo orbital particle simulator matching Schrodinger orbitals
      const numDots = 280;
      for (let i = 0; i < numDots; i++) {
        const theta = Math.random() * Math.PI * 2;
        let r = 0;
        
        if (n === 1) {
          r = -Math.log(Math.random()) * 25;
        } else if (n === 2) {
          if (l === 0) {
            r = Math.random() < 0.3 ? (Math.random() * 20) : (40 + Math.random() * 30);
          } else {
            const angularFactor = Math.pow(Math.cos(theta), 2);
            if (Math.random() < angularFactor) {
              r = (30 + Math.random() * 50);
            } else {
              continue;
            }
          }
        } else if (n === 3) {
          if (l === 0) {
            r = Math.random() * 95;
          } else if (l === 1) {
            const angularFactor = Math.pow(Math.cos(theta), 2);
            if (Math.random() < angularFactor) {
              r = (40 + Math.random() * 60);
            } else {
              continue;
            }
          } else {
            const angularFactor = Math.pow(Math.cos(2 * theta), 2);
            if (Math.random() < angularFactor) {
              r = (45 + Math.random() * 65);
            } else {
              continue;
            }
          }
        } else {
          r = Math.random() * 110 + 20;
        }

        const px = cx + Math.cos(theta) * r;
        const py = cy + Math.sin(theta) * r;

        // Color based on phase node
        const phase = Math.sin(r * 0.1 - time * 0.2);
        ctx.fillStyle = phase > 0 ? "rgba(0, 243, 255, 0.4)" : "rgba(189, 0, 255, 0.35)";
        ctx.fillRect(px, py, 1.5, 1.5);
      }

      ctx.restore(); // Restore camera modifications

      // Static text HUD overlay
      ctx.fillStyle = "rgba(0, 243, 255, 0.85)";
      ctx.font = "9px monospace";
      ctx.fillText(`Atomic Wavefunction: n=${n}, l=${l}, m=${m}`, 15, 20);

      animId = requestAnimationFrame(drawCloud);
    };

    drawCloud();

    return () => cancelAnimationFrame(animId);
  }, [n, l, m, isPlaying, simSpeed, cameraZoom, cameraPanX, cameraPanY]);

  return (
    <div className="rounded-xl glass-panel border border-white/5 p-6 space-y-6">
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-base font-display font-bold text-white flex items-center">
          <Eye className="w-4 h-4 text-cyan-glow mr-2" /> Electron Cloud Probability
        </h2>
        <p className="text-[11px] text-slate-400">Monte Carlo simulation of Hydrogen orbitals based on wave mechanics</p>
      </div>

      <div className="border border-white/5 rounded-lg overflow-hidden bg-slate-950/80">
        <canvas ref={canvasRef} className="w-full h-auto block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div className="space-y-1 text-left">
          <label className="flex justify-between text-slate-400 text-[10px]">
            <span>PRINCIPAL (N)</span>
            <span className="text-cyan-glow font-bold">n = {n}</span>
          </label>
          <input
            type="range" min="1" max="4" value={n}
            onChange={(e) => { setN(parseInt(e.target.value)); audioService.playClick("tap"); }}
            className="w-full h-1 bg-slate-950 rounded cursor-pointer accent-cyan-glow"
          />
        </div>

        <div className="space-y-1 text-left">
          <label className="flex justify-between text-slate-400 text-[10px]">
            <span>ANGULAR (L)</span>
            <span className="text-cyan-glow font-bold">l = {l} ({l === 0 ? "s" : l === 1 ? "p" : l === 2 ? "d" : "f"})</span>
          </label>
          <input
            type="range" min="0" max={n - 1} value={l}
            onChange={(e) => { setL(parseInt(e.target.value)); audioService.playClick("tap"); }}
            className="w-full h-1 bg-slate-950 rounded cursor-pointer accent-cyan-glow"
          />
        </div>

        <div className="space-y-1 text-left">
          <label className="flex justify-between text-slate-400 text-[10px]">
            <span>MAGNETIC (M)</span>
            <span className="text-cyan-glow font-bold">m = {m}</span>
          </label>
          <input
            type="range" min={-l} max={l} value={m}
            onChange={(e) => { setM(parseInt(e.target.value)); audioService.playClick("tap"); }}
            className="w-full h-1 bg-slate-950 rounded cursor-pointer accent-cyan-glow"
          />
        </div>
      </div>
    </div>
  );
}

/* 3. Superposition Explorer */
function SuperpositionSim({
  isPlaying,
  simSpeed,
  cameraZoom,
  cameraPanX,
  cameraPanY
}: UniversalSimProps) {
  const [theta, setTheta] = useState<number>(Math.PI / 4); // superposed state angle
  const [measureResult, setMeasureResult] = useState<null | number>(null);
  const [isCollapsing, setIsCollapsing] = useState(false);

  // Calculate amplitudes
  const amp0 = Math.cos(theta / 2);
  const amp1 = Math.sin(theta / 2);
  const prob0 = Math.pow(amp0, 2);
  const prob1 = Math.pow(amp1, 2);

  const handleMeasure = () => {
    setIsCollapsing(true);
    setMeasureResult(null);
    audioService.playHyperdriveCharging();

    setTimeout(() => {
      const outcome = Math.random() < prob0 ? 0 : 1;
      setMeasureResult(outcome);
      setIsCollapsing(false);
      audioService.playClick("confirm");
      audioService.playCalibration("engine");
    }, 1200 / simSpeed);
  };

  return (
    <div className="rounded-xl glass-panel border border-white/5 p-6 space-y-6 text-left">
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-base font-display font-bold text-white flex items-center">
          <Cpu className="w-4 h-4 text-cyan-glow mr-2" /> Superposition Measurement Explorer
        </h2>
        <p className="text-[11px] text-slate-400">Control probability amplitudes before collapsing the wavefunction</p>
      </div>

      <div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        style={{
          transform: `translate(${cameraPanX}px, ${cameraPanY}px) scale(${cameraZoom})`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <div className="bg-slate-950 p-6 rounded-lg border border-white/5 flex flex-col justify-between items-center relative overflow-hidden min-h-[220px]">
          <div className="text-[10px] font-mono text-cyan-glow uppercase absolute top-2 left-3">Quantum State Vector |ψ⟩</div>

          <div className="flex items-center justify-center space-x-12 my-auto">
            <div className="relative w-28 h-28 rounded-full border border-slate-800 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-glow/20 animate-spin-slow"></div>
              <div 
                className="absolute h-14 w-1 bg-gradient-to-t from-transparent to-cyan-glow origin-bottom bottom-14 rounded-full transition-transform duration-300"
                style={{ transform: `rotate(${theta * (180 / Math.PI)}deg)` }}
              ></div>
              <div className="absolute w-2 h-2 rounded-full bg-white"></div>
            </div>

            <div className="w-24 h-24 rounded-lg border border-cyan-glow/20 bg-slate-900/60 flex flex-col items-center justify-center relative">
              <div className="text-[8px] font-mono text-slate-500 absolute top-1.5 uppercase">Output</div>
              {isCollapsing ? (
                <div className="text-cyan-glow font-mono animate-spin text-sm">COLLAPSING...</div>
              ) : measureResult !== null ? (
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-white tracking-widest">|{measureResult}⟩</div>
                  <div className="text-[9px] font-mono text-cyan-glow uppercase mt-1">Observed</div>
                </div>
              ) : (
                <div className="text-slate-500 font-mono text-xs italic">Unmeasured</div>
              )}
            </div>
          </div>

          <div className="w-full text-center text-xs font-mono">
            <span className="text-slate-400">Mathematical state vector:</span>
            <div className="text-white font-bold mt-1 glow-cyan">
              |ψ⟩ = {amp0.toFixed(3)}|0⟩ + {amp1.toFixed(3)}|1⟩
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="flex justify-between font-mono text-xs text-slate-300">
              <span>STATE COHERENCE DIAL (θ)</span>
              <span className="text-cyan-glow font-bold">{(theta * (180 / Math.PI)).toFixed(1)}°</span>
            </label>
            <input
              type="range" min="0" max={Math.PI} step="0.05" value={theta}
              onChange={(e) => {
                setTheta(parseFloat(e.target.value));
                setMeasureResult(null);
                audioService.playClick("tap");
              }}
              className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-glow"
            />
          </div>

          <div className="space-y-2 border-t border-white/5 pt-4 font-mono">
            <h4 className="text-[10px] text-slate-500 uppercase">State Probabilities</h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-3 rounded border border-white/5 text-left">
                <span className="text-slate-400">PROBABILITY |0⟩</span>
                <span className="block text-lg font-bold text-white mt-1">{(prob0 * 100).toFixed(1)}%</span>
              </div>
              <div className="bg-slate-950 p-3 rounded border border-white/5 text-left">
                <span className="text-slate-400">PROBABILITY |1⟩</span>
                <span className="block text-lg font-bold text-white mt-1">{(prob1 * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleMeasure}
            disabled={isCollapsing}
            className="w-full py-2.5 rounded bg-gradient-to-r from-cyan-glow to-quantum-blue hover:opacity-90 font-mono text-xs font-bold text-slate-950 transition-all hover:shadow-[0_0_15px_rgba(0,243,255,0.2)] disabled:opacity-50"
          >
            {isCollapsing ? "COLLAPSING COHERENCE..." : "ACTIVATE MEASUREMENT COLLAPSE"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* 4. Quantum Tunneling Simulator */
function TunnelingSim({
  isPlaying,
  simSpeed,
  cameraZoom,
  cameraPanX,
  cameraPanY
}: UniversalSimProps) {
  const [barrierWidth, setBarrierWidth] = useState<number>(30); // pm
  const [barrierHeight, setBarrierHeight] = useState<number>(100); // potential energy (eV)
  const [particleEnergy, setParticleEnergy] = useState<number>(65); // wave kinetic energy (eV)
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;
    const width = (canvas.width = 540);
    const height = (canvas.height = 240);

    const drawTunnel = () => {
      ctx.fillStyle = "#050816";
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2 + cameraPanX, height / 2 + cameraPanY);
      ctx.scale(cameraZoom, cameraZoom);
      ctx.translate(-width / 2, -height / 2);

      if (isPlaying) {
        time += 0.15 * simSpeed;
      }

      const barrierX = width / 2 - barrierWidth / 2;
      const amplitude = 30;

      // 1. Draw Barrier
      ctx.fillStyle = "rgba(189, 0, 255, 0.15)";
      ctx.strokeStyle = "rgba(189, 0, 255, 0.4)";
      ctx.lineWidth = 1;
      const barrierTopY = height - barrierHeight * 1.5;
      ctx.fillRect(barrierX, barrierTopY, barrierWidth, barrierHeight * 1.5);
      ctx.strokeRect(barrierX, barrierTopY, barrierWidth, barrierHeight * 1.5);

      // 2. Draw classical energy level line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, height - particleEnergy * 1.5);
      ctx.lineTo(width, height - particleEnergy * 1.5);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Render Quantum Wavefunction packet
      ctx.strokeStyle = "#00f3ff";
      ctx.lineWidth = 1.8;
      ctx.beginPath();

      const calculatedTransmission = Math.max(0.01, Math.exp(-0.04 * (barrierHeight - particleEnergy) * barrierWidth * 0.05));

      for (let x = 0; x < width; x++) {
        let waveY = 0;

        if (x < barrierX) {
          waveY = amplitude * Math.sin(x * 0.1 - time) + (amplitude * 0.4 * Math.sin(x * 0.1 + time));
        } else if (x >= barrierX && x <= barrierX + barrierWidth) {
          const fraction = (x - barrierX) / barrierWidth;
          const decay = Math.exp(-fraction * 3.5);
          waveY = amplitude * Math.sin(x * 0.1 - time) * decay;
        } else {
          waveY = amplitude * calculatedTransmission * Math.sin(x * 0.1 - time);
        }

        const plotY = height - particleEnergy * 1.5 - waveY;
        if (x === 0) ctx.moveTo(x, plotY);
        else ctx.lineTo(x, plotY);
      }
      ctx.stroke();

      // Draw particle bullet riding the wave
      ctx.fillStyle = "#ffffff";
      const particleX = (time * 8) % width;
      let particleY = height - particleEnergy * 1.5;
      if (particleX < barrierX) {
        particleY -= amplitude * Math.sin(particleX * 0.1 - time);
      } else if (particleX >= barrierX && particleX <= barrierX + barrierWidth) {
        const fraction = (particleX - barrierX) / barrierWidth;
        const decay = Math.exp(-fraction * 3.5);
        particleY -= amplitude * Math.sin(particleX * 0.1 - time) * decay;
      } else {
        particleY -= amplitude * calculatedTransmission * Math.sin(particleX * 0.1 - time);
      }

      ctx.beginPath();
      ctx.arc(particleX, particleY, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore(); // Restore camera perspective matrix

      // Labels inside canvas (Always static)
      ctx.fillStyle = "rgba(189, 0, 255, 0.8)";
      ctx.font = "9px monospace";
      ctx.fillText("Potential Barrier (U₀)", barrierX - 25 + cameraPanX, barrierTopY - 8 + cameraPanY);

      ctx.fillStyle = "rgba(0, 243, 255, 0.8)";
      ctx.fillText(`Transmission Probability (T): ${(calculatedTransmission * 100).toFixed(2)}%`, 15, 20);

      animId = requestAnimationFrame(drawTunnel);
    };

    drawTunnel();

    return () => cancelAnimationFrame(animId);
  }, [barrierWidth, barrierHeight, particleEnergy, isPlaying, simSpeed, cameraZoom, cameraPanX, cameraPanY]);

  return (
    <div className="rounded-xl glass-panel border border-white/5 p-6 space-y-6">
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-base font-display font-bold text-white flex items-center">
          <Activity className="w-4 h-4 text-cyan-glow mr-2 animate-pulse" /> Quantum Tunneling Simulator
        </h2>
        <p className="text-[11px] text-slate-400">Evanescent wavefunction leakage penetrates forbidden boundaries</p>
      </div>

      <div className="border border-white/5 rounded-lg overflow-hidden bg-slate-950/80">
        <canvas ref={canvasRef} className="w-full h-auto block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div className="space-y-1 text-left">
          <label className="flex justify-between text-slate-400 text-[10px]">
            <span>BARRIER WIDTH (L)</span>
            <span className="text-cyan-glow font-bold">{barrierWidth} pm</span>
          </label>
          <input
            type="range" min="10" max="80" value={barrierWidth}
            onChange={(e) => { setBarrierWidth(parseInt(e.target.value)); audioService.playClick("tap"); }}
            className="w-full h-1 bg-slate-950 rounded cursor-pointer accent-cyan-glow"
          />
        </div>

        <div className="space-y-1 text-left">
          <label className="flex justify-between text-slate-400 text-[10px]">
            <span>BARRIER HEIGHT (U₀)</span>
            <span className="text-cyan-glow font-bold">{barrierHeight} eV</span>
          </label>
          <input
            type="range" min="80" max="140" value={barrierHeight}
            onChange={(e) => { setBarrierHeight(parseInt(e.target.value)); audioService.playClick("tap"); }}
            className="w-full h-1 bg-slate-950 rounded cursor-pointer accent-cyan-glow"
          />
        </div>

        <div className="space-y-1 text-left">
          <label className="flex justify-between text-slate-400 text-[10px]">
            <span>PARTICLE ENERGY (E)</span>
            <span className="text-cyan-glow font-bold">{particleEnergy} eV</span>
          </label>
          <input
            type="range" min="40" max="78" value={particleEnergy}
            onChange={(e) => { setParticleEnergy(parseInt(e.target.value)); audioService.playClick("tap"); }}
            className="w-full h-1 bg-slate-950 rounded cursor-pointer accent-cyan-glow"
          />
        </div>
      </div>
    </div>
  );
}

/* 5. Entanglement Simulator */
function EntanglementSim({
  isPlaying,
  simSpeed,
  cameraZoom,
  cameraPanX,
  cameraPanY
}: UniversalSimProps) {
  const [particleAState, setParticleAState] = useState<null | "UP" | "DOWN">(null);
  const [particleBState, setParticleBState] = useState<null | "UP" | "DOWN">(null);

  const handleMeasureParticle = (measured: "A" | "B") => {
    const outcomeA = Math.random() < 0.5 ? "UP" : "DOWN";
    const outcomeB = outcomeA === "UP" ? "DOWN" : "UP";

    if (measured === "A") {
      setParticleAState(outcomeA);
      setParticleBState(outcomeB);
    } else {
      setParticleBState(outcomeB);
      setParticleAState(outcomeA);
    }
    audioService.playClick("confirm");
  };

  const resetParticles = () => {
    setParticleAState(null);
    setParticleBState(null);
    audioService.playClick("tap");
  };

  return (
    <div className="rounded-xl glass-panel border border-white/5 p-6 space-y-6 text-left">
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-base font-display font-bold text-white flex items-center">
          <Sparkles className="w-4 h-4 text-cyan-glow mr-2 animate-pulse" /> Entanglement Linker
        </h2>
        <p className="text-[11px] text-slate-400">Action-at-a-distance: Anti-correlated wavefunction collapse</p>
      </div>

      <div 
        className="bg-slate-950 p-8 rounded-lg border border-white/5 flex flex-col justify-between items-center min-h-[220px] relative"
        style={{
          transform: `translate(${cameraPanX}px, ${cameraPanY}px) scale(${cameraZoom})`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <div className="text-[10px] font-mono text-cyan-glow absolute top-2 left-3 uppercase">Singlet EPR State (|01⟩ - |10⟩)/√2</div>

        <div className="flex items-center justify-between w-full max-w-md my-auto relative">
          <div className={`absolute left-1/2 -translate-x-1/2 w-48 h-0.5 -z-10 ${particleAState ? "bg-slate-800" : "bg-gradient-to-r from-cyan-glow via-purple-500 to-violet-glow animate-pulse"}`}></div>

          <div className="flex flex-col items-center space-y-3">
            <span className="text-[10px] font-mono text-slate-400">PARTICLE A</span>
            <div 
              onClick={() => particleAState === null && handleMeasureParticle("A")}
              className={`w-16 h-16 rounded-full border flex items-center justify-center cursor-pointer transition-all ${particleAState === null ? "border-cyan-glow/30 hover:border-cyan-glow hover:scale-105 bg-cyan-950/20 shadow-[0_0_12px_rgba(0,243,255,0.1)]" : "border-slate-800 bg-slate-900"}`}
            >
              {particleAState === null ? (
                <div className="text-[10px] font-mono text-cyan-glow animate-pulse uppercase">Coherent</div>
              ) : (
                <div className="text-center">
                  <span className={`text-sm font-bold font-mono ${particleAState === "UP" ? "text-cyan-glow" : "text-violet-glow"}`}>{particleAState}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center space-y-3">
            <span className="text-[10px] font-mono text-slate-400">PARTICLE B</span>
            <div 
              onClick={() => particleBState === null && handleMeasureParticle("B")}
              className={`w-16 h-16 rounded-full border flex items-center justify-center cursor-pointer transition-all ${particleBState === null ? "border-violet-glow/30 hover:border-violet-glow hover:scale-105 bg-violet-950/20 shadow-[0_0_12px_rgba(189,0,255,0.1)]" : "border-slate-800 bg-slate-900"}`}
            >
              {particleBState === null ? (
                <div className="text-[10px] font-mono text-violet-glow animate-pulse uppercase">Coherent</div>
              ) : (
                <div className="text-center">
                  <span className={`text-sm font-bold font-mono ${particleBState === "UP" ? "text-cyan-glow" : "text-violet-glow"}`}>{particleBState}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center text-xs font-mono">
          {particleAState === null ? (
            <span className="text-slate-400">Click either particle to measure and collapse the shared state!</span>
          ) : (
            <span className="text-emerald-400 font-bold flex items-center justify-center">
              Coherence collapsed. Correlation: {particleAState} / {particleBState}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={resetParticles}
        className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-white transition-all"
      >
        RESET TO COHERENT SINGLET STATE
      </button>
    </div>
  );
}

/* 6. Bloch Sphere Simulator */
function BlochSphereSim({
  isPlaying,
  simSpeed,
  cameraZoom,
  cameraPanX,
  cameraPanY
}: UniversalSimProps) {
  const [theta, setTheta] = useState<number>(0); // Polar angle 0 to PI
  const [phi, setPhi] = useState<number>(0);     // Azimuthal angle 0 to 2*PI
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = 540);
    const height = (canvas.height = 240);
    const cx = width / 2;
    const cy = height / 2;

    const drawSphere = () => {
      ctx.fillStyle = "#050816";
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(cx + cameraPanX, cy + cameraPanY);
      ctx.scale(cameraZoom, cameraZoom);
      ctx.translate(-cx, -cy);

      const r = 70; // sphere radius

      // Draw outer circle
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      // Equator
      ctx.strokeStyle = "rgba(0, 243, 255, 0.15)";
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Meridian
      ctx.strokeStyle = "rgba(189, 0, 255, 0.15)";
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * 0.3, r, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Axes lines (Z, X, Y)
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.beginPath();
      ctx.moveTo(cx, cy - r - 10);
      ctx.lineTo(cx, cy + r + 10);
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.font = "9px monospace";
      ctx.fillText("|0⟩ (+z)", cx - 18, cy - r - 15);
      ctx.fillText("|1⟩ (-z)", cx - 18, cy + r + 20);

      ctx.beginPath();
      ctx.moveTo(cx - r - 10, cy);
      ctx.lineTo(cx + r + 10, cy);
      ctx.stroke();
      ctx.fillText("|+⟩ (+x)", cx + r + 15, cy + 3);

      // State Vector calculations
      const stateZ = Math.cos(theta);
      const stateX = Math.sin(theta) * Math.cos(phi);
      const stateY = Math.sin(theta) * Math.sin(phi);

      const mappedX = cx + stateX * r + stateY * r * 0.3;
      const mappedY = cy - stateZ * r + stateX * r * 0.1;

      // State vector line
      ctx.strokeStyle = "#00f3ff";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(mappedX, mappedY);
      ctx.stroke();

      // Glowing state coordinates
      const grad = ctx.createRadialGradient(mappedX, mappedY, 0, mappedX, mappedY, 7);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.3, "#00f3ff");
      grad.addColorStop(1, "rgba(0, 243, 255, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(mappedX, mappedY, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore(); // Restore camera matrix

      // Labels (Static relative to perspective)
      ctx.fillStyle = "rgba(0, 243, 255, 0.85)";
      ctx.font = "9px monospace";
      ctx.fillText(`Qubit Vector Coordinates:`, 15, 20);
      ctx.fillText(`X = ${stateX.toFixed(3)}`, 15, 33);
      ctx.fillText(`Y = ${stateY.toFixed(3)}`, 15, 46);
      ctx.fillText(`Z = ${stateZ.toFixed(3)}`, 15, 59);
    };

    drawSphere();

  }, [theta, phi, cameraZoom, cameraPanX, cameraPanY]);

  return (
    <div className="rounded-xl glass-panel border border-white/5 p-6 space-y-6">
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-base font-display font-bold text-white flex items-center">
          <Cpu className="w-4 h-4 text-cyan-glow mr-2" /> Bloch Sphere Explorer
        </h2>
        <p className="text-[11px] text-slate-400">Positioning a qubit's state vector in 3D Hilbert space representation</p>
      </div>

      <div className="border border-white/5 rounded-lg overflow-hidden bg-slate-950/80">
        <canvas ref={canvasRef} className="w-full h-auto block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="space-y-1 text-left">
          <label className="flex justify-between text-slate-400 text-[10px]">
            <span>POLAR COHERENCE (θ)</span>
            <span className="text-cyan-glow font-bold">{(theta * (180 / Math.PI)).toFixed(0)}°</span>
          </label>
          <input
            type="range" min="0" max={Math.PI} step="0.05" value={theta}
            onChange={(e) => { setTheta(parseFloat(e.target.value)); audioService.playClick("tap"); }}
            className="w-full h-1 bg-slate-950 rounded cursor-pointer accent-cyan-glow"
          />
        </div>

        <div className="space-y-1 text-left">
          <label className="flex justify-between text-slate-400 text-[10px]">
            <span>AZIMUTHAL PHASE (φ)</span>
            <span className="text-cyan-glow font-bold">{(phi * (180 / Math.PI)).toFixed(0)}°</span>
          </label>
          <input
            type="range" min="0" max={Math.PI * 2} step="0.05" value={phi}
            onChange={(e) => { setPhi(parseFloat(e.target.value)); audioService.playClick("tap"); }}
            className="w-full h-1 bg-slate-950 rounded cursor-pointer accent-cyan-glow"
          />
        </div>
      </div>
    </div>
  );
}
