import React, { useState, useEffect, useRef } from "react";
import { 
  Book, Sparkles, Award, Trash2, Save, Undo, RefreshCw, 
  HelpCircle, Link2, BookOpen, PenTool, CheckCircle, Brain, Eye
} from "lucide-react";
import { audioService } from "../utils/audioService";

interface JournalEntry {
  id: string;
  timestamp: string;
  title: string;
  content: string;
  sketchDataUrl?: string;
  topicRef?: string;
}

interface AIQuestion {
  question: string;
  answer: string;
  timestamp: string;
}

export default function DiscoveryJournal() {
  const [activeTab, setActiveTab] = useState<"sketches" | "history" | "achievements" | "connections">("sketches");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("duality");
  const [aiQuestions, setAiQuestions] = useState<AIQuestion[]>([]);
  
  // Completed lessons from localStorage or defaults
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [visitedPlayground, setVisitedPlayground] = useState(false);
  const [visitedBlackHole, setVisitedBlackHole] = useState(false);
  const [quizScoreMax, setQuizScoreMax] = useState(0);

  // Drawing Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState<"cyan" | "violet" | "amber" | "eraser">("cyan");
  const [brushSize, setBrushSize] = useState(3);
  const [activePreset, setActivePreset] = useState<"none" | "duality" | "tunneling" | "superposition" | "bloch">("none");

  // Load Saved Data
  useEffect(() => {
    // Load journal entries
    const savedEntries = localStorage.getItem("quantumverse_journal_entries");
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch (e) {
        console.error("Failed to parse journal entries:", e);
      }
    } else {
      // Default initial entries to make the journal feel lived-in
      const initial: JournalEntry[] = [
        {
          id: "1",
          timestamp: new Date(Date.now() - 3600000 * 24 * 2).toLocaleString(),
          title: "Double-Slit Diffraction Patterns",
          content: "Observed how photons create an interference pattern when both slits are unmonitored. When we add a detector, the wave function collapses and we only see two classical bands. This confirms the measurement problem in action!",
          topicRef: "duality"
        },
        {
          id: "2",
          timestamp: new Date(Date.now() - 3600000 * 4).toLocaleString(),
          title: "The Solan Fusion Mechanism",
          content: "Learned that the sun fuses hydrogen atoms into helium largely thanks to quantum tunneling. The thermal pressure inside the core isn't actually hot enough classically to overcome the Coulomb repulsion, but tunneling lets protons leak through!",
          topicRef: "tunneling"
        }
      ];
      setEntries(initial);
      localStorage.setItem("quantumverse_journal_entries", JSON.stringify(initial));
    }

    // Load AI Questions
    const savedQuestions = localStorage.getItem("quantumverse_ai_questions");
    if (savedQuestions) {
      try {
        setAiQuestions(JSON.parse(savedQuestions));
      } catch (e) {}
    } else {
      const initialQ: AIQuestion[] = [
        {
          question: "How does quantum tunneling work in stellar core fusion?",
          answer: "Stellar core temperatures are around 15 million Kelvin, which is classically insufficient for protons to overcome their electrostatic repulsion. However, the proton wavefunctions decay exponentially inside the potential barrier. Because the barrier is thin, there is a small probability they materialize on the other side, enabling fusion.",
          timestamp: new Date(Date.now() - 3600000 * 4).toLocaleString()
        }
      ];
      setAiQuestions(initialQ);
      localStorage.setItem("quantumverse_ai_questions", JSON.stringify(initialQ));
    }

    // Load lesson completion metrics
    try {
      const lessons = localStorage.getItem("quantumverse_completed_lessons");
      if (lessons) {
        setCompletedLessons(JSON.parse(lessons));
      }
      const pg = localStorage.getItem("quantumverse_visited_playground") === "true";
      setVisitedPlayground(pg);
      const bh = localStorage.getItem("quantumverse_visited_blackhole") === "true";
      setVisitedBlackHole(bh);
      const score = localStorage.getItem("quantumverse_max_score");
      if (score) {
        setQuizScoreMax(parseInt(score));
      }
    } catch (e) {}
  }, []);

  // Set up canvas presets
  useEffect(() => {
    drawPreset();
  }, [activePreset]);

  const drawPreset = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw coordinate lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    ctx.font = "8px monospace";
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.fillText("X-AXIS PROJECTION", 10, canvas.height / 2 - 5);
    ctx.fillText("ψ AMPLITUDE", canvas.width / 2 + 5, 12);

    if (activePreset === "duality") {
      // Wave Duality Pattern
      ctx.strokeStyle = "rgba(0, 243, 255, 0.3)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        // Enveloped Sine wave
        const y = canvas.height / 2 + Math.sin(x * 0.1) * Math.exp(-Math.pow(x - canvas.width / 2, 2) / 4000) * 45;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Individual particles
      ctx.fillStyle = "#bd00ff";
      for (let i = 0; i < 15; i++) {
        const px = canvas.width / 2 + (Math.random() - 0.5) * 120;
        const py = canvas.height / 2 + (Math.random() - 0.5) * 30;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "rgba(0, 243, 255, 0.8)";
      ctx.fillText("ψ(x) Wave Packet Envelope", canvas.width / 2 - 60, canvas.height / 2 - 55);
    } else if (activePreset === "tunneling") {
      // Barrier Tunneling Preset
      const barrierX = canvas.width / 2 - 15;
      const barrierW = 30;

      // Draw solid potential barrier
      ctx.fillStyle = "rgba(245, 158, 11, 0.15)";
      ctx.fillRect(barrierX, 20, barrierW, canvas.height - 40);
      ctx.strokeStyle = "rgba(245, 158, 11, 0.5)";
      ctx.strokeRect(barrierX, 20, barrierW, canvas.height - 40);

      // Incoming wave
      ctx.strokeStyle = "#00f3ff";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x < barrierX; x++) {
        const y = canvas.height / 2 + Math.sin(x * 0.15) * 25;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Decaying wave inside barrier
      ctx.strokeStyle = "#a78bfa";
      ctx.beginPath();
      for (let x = barrierX; x <= barrierX + barrierW; x++) {
        const ratio = (x - barrierX) / barrierW;
        const decay = Math.exp(-ratio * 2.5);
        const y = canvas.height / 2 + Math.sin(x * 0.15) * 25 * decay;
        if (x === barrierX) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Transmitted wave
      ctx.strokeStyle = "#bd00ff";
      ctx.beginPath();
      for (let x = barrierX + barrierW; x < canvas.width; x++) {
        const decay = Math.exp(-2.5);
        const y = canvas.height / 2 + Math.sin(x * 0.15) * 25 * decay;
        if (x === barrierX + barrierW) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.fillStyle = "#f59e0b";
      ctx.fillText("POTENTIAL BARRIER (V > E)", barrierX - 25, 30);
      ctx.fillStyle = "#00f3ff";
      ctx.fillText("Incident Wave", 20, canvas.height / 2 - 35);
      ctx.fillStyle = "#bd00ff";
      ctx.fillText("Tunneled Wave", canvas.width - 95, canvas.height / 2 - 25);
    } else if (activePreset === "superposition") {
      // Spinning coin or Bloch sphere circle
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      
      ctx.strokeStyle = "rgba(189, 0, 255, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 60, 0, Math.PI * 2);
      ctx.stroke();

      // Wave probability state vectors
      ctx.strokeStyle = "#00f3ff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + 42, cy - 42); // State vector 1
      ctx.stroke();

      ctx.strokeStyle = "#f59e0b";
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx - 30, cy + 52); // State vector 2
      ctx.stroke();

      // Intersecting orbit cloud
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.beginPath();
      ctx.arc(cx + 42, cy - 42, 4, 0, Math.PI * 2);
      ctx.arc(cx - 30, cy + 52, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#00f3ff";
      ctx.fillText("|0⟩ State", cx + 48, cy - 46);
      ctx.fillStyle = "#f59e0b";
      ctx.fillText("|1⟩ State", cx - 75, cy + 56);
      ctx.fillStyle = "#bd00ff";
      ctx.fillText("|ψ⟩ = α|0⟩ + β|1⟩ Superposition Vector", cx - 110, cy - 70);
    } else if (activePreset === "bloch") {
      // Bloch Sphere geometry
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = 55;

      // Draw sphere outline
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      // Equator ellipse
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, 18, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Z-axis (vertical)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.beginPath();
      ctx.moveTo(cx, cy - r - 10);
      ctx.lineTo(cx, cy + r + 10);
      ctx.stroke();

      // State vector arrow
      ctx.strokeStyle = "#bd00ff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + 25, cy - r * 0.7);
      ctx.stroke();

      ctx.fillStyle = "#bd00ff";
      ctx.beginPath();
      ctx.arc(cx + 25, cy - r * 0.7, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.fillText("|0⟩ (North)", cx - 15, cy - r - 5);
      ctx.fillText("|1⟩ (South)", cx - 15, cy + r + 12);
      ctx.fillStyle = "#00f3ff";
      ctx.fillText("Bloch Sphere Qubit State Representation", cx - 100, cy - 70);
    }
  };

  // Drawing Canvas Methods
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    
    if (audioService.isEnabled()) {
      audioService.playHover("tick", 0.3);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set brush styles based on selected pen
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (penColor === "cyan") {
      ctx.strokeStyle = "#00f3ff";
      ctx.shadowColor = "#00f3ff";
      ctx.shadowBlur = 6;
    } else if (penColor === "violet") {
      ctx.strokeStyle = "#bd00ff";
      ctx.shadowColor = "#bd00ff";
      ctx.shadowBlur = 6;
    } else if (penColor === "amber") {
      ctx.strokeStyle = "#f59e0b";
      ctx.shadowColor = "#f59e0b";
      ctx.shadowBlur = 6;
    } else {
      // Eraser
      ctx.strokeStyle = "#020617";
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.lineWidth = brushSize * 3;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.shadowBlur = 0; // Reset shadow blur to avoid performance hit
    }
  };

  const clearCanvas = () => {
    setActivePreset("none");
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Redraw axes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    audioService.playClick("confirm");
  };

  // Save entry handler
  const handleSaveEntry = () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    audioService.playClick("confirm");
    
    const canvas = canvasRef.current;
    let sketchDataUrl = undefined;
    if (canvas) {
      sketchDataUrl = canvas.toDataURL();
    }

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      title: newTitle,
      content: newContent,
      sketchDataUrl,
      topicRef: selectedTopic
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem("quantumverse_journal_entries", JSON.stringify(updated));

    // Clear input forms
    setNewTitle("");
    setNewContent("");
    
    audioService.playNotification("completed");
  };

  // Delete entry
  const handleDeleteEntry = (id: string) => {
    audioService.playNotification("warning");
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem("quantumverse_journal_entries", JSON.stringify(updated));
  };

  // Determine unlocked achievements
  const totalCompletedLessons = completedLessons.length;
  const isFirstLightUnlocked = totalCompletedLessons >= 1;
  const isStellarCartographerUnlocked = totalCompletedLessons >= 2;
  const isPlanetHunterUnlocked = totalCompletedLessons >= 3;
  const isQuantumExplorerUnlocked = visitedPlayground || totalCompletedLessons >= 4;
  const isEventHorizonResearcherUnlocked = visitedBlackHole || completedLessons.includes("relativity");
  const isCosmicPioneerUnlocked = quizScoreMax === 100;

  const ACHIEVEMENTS_LIST = [
    {
      id: "first_light",
      name: "🌌 First Light",
      description: "Awakened your understanding of quantum space by completing your first curriculum lesson.",
      unlocked: isFirstLightUnlocked,
      requirement: "Complete 1 curriculum lesson"
    },
    {
      id: "stellar_cartographer",
      name: "⭐ Stellar Cartographer",
      description: "Mapped out multiple subatomic vectors in your mental cosmic coordinate grid.",
      unlocked: isStellarCartographerUnlocked,
      requirement: "Complete 2 curriculum lessons"
    },
    {
      id: "planet_hunter",
      name: "🪐 Planet Hunter",
      description: "Discovered and analyzed advanced mechanical behaviors across multi-body physics.",
      unlocked: isPlanetHunterUnlocked,
      requirement: "Complete 3 curriculum lessons"
    },
    {
      id: "quantum_explorer",
      name: "⚛ Quantum Explorer",
      description: "Calibrated logic gates inside the advanced quantum computer console.",
      unlocked: isQuantumExplorerUnlocked,
      requirement: "Visit the Q-Computing Playground or complete 4 lessons"
    },
    {
      id: "event_horizon",
      name: "🕳 Event Horizon Researcher",
      description: "Probed extreme spacetime boundaries and gravitational singularity lensing models.",
      unlocked: isEventHorizonResearcherUnlocked,
      requirement: "Visit the Black Hole Simulator or complete Relativity curriculum"
    },
    {
      id: "cosmic_pioneer",
      name: "🌠 Cosmic Pioneer",
      description: "Achieved 100% coherence and consensus inside the adaptive Quiz Arena.",
      unlocked: isCosmicPioneerUnlocked,
      requirement: "Get 100% on any quantum quiz"
    }
  ];

  // Connection nodes for the Interactive Cosmic Connections Matrix
  const CONNECTIONS = [
    {
      id: "tunneling_fusion",
      title: "Solar Fusion ⟷ Quantum Tunneling",
      relationship: "Nuclear fusion in stars requires hydrogen nuclei (protons) to fuse. Classically, the electrostatic repulsion barrier is too high, meaning our sun shouldn't burn! Quantum tunneling allows protons to leak through this barrier, enabling solar fusion and life itself.",
      topic1: "Quantum Tunneling",
      topic2: "Cosmic Stars & Nuclear Energy"
    },
    {
      id: "blackhole_qm",
      title: "Singularity ⟷ Quantum Gravity",
      relationship: "Black holes warp spacetime infinitely according to relativity. However, at their center, massive amounts of mass are crushed into subatomic spaces. Understanding this singularity requires combining quantum mechanics with general relativity to resolve the Black Hole Information Paradox.",
      topic1: "Theory of Relativity",
      topic2: "Hawking Radiation & Quantum Fields"
    },
    {
      id: "duality_stars",
      title: "Spectral Fingerprints ⟷ Duality",
      relationship: "Stars emit distinct lines of light. Wave-particle duality explains how electrons jumping orbit energy-packets act as particles (absorbing/emitting single photons) while carrying distinct spectral waves, allowing us to map the universe's chemical composition.",
      topic1: "Wave–Particle Duality",
      topic2: "Stellar Cartography"
    },
    {
      id: "superposition_computing",
      title: "Bloch Vectors ⟷ Quantum Computing",
      relationship: "In nature, superposition lets a wave carry infinite pathways. Quantum computers exploit this, mapping superposition states onto a Bloch sphere to perform parallel mathematical transformations that solve highly complex optimization matrices.",
      topic1: "Quantum Superposition",
      topic2: "Qubits & Algorithms"
    }
  ];

  const [selectedConnection, setSelectedConnection] = useState<any>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-left animate-fade-in h-[85vh]">
      {/* Selector sidebar (Journal navigation and entries) */}
      <div className="lg:col-span-1 bg-slate-950/60 p-4 rounded-xl border border-white/5 flex flex-col justify-between h-full overflow-hidden">
        <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
          <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center border-b border-white/5 pb-2 shrink-0">
            <Book className="w-4 h-4 text-cyan-glow mr-2 animate-pulse" /> Living Journal Log
          </h3>

          <div className="flex bg-slate-900 p-0.5 rounded border border-slate-850 shrink-0">
            <button
              onClick={() => {
                setActiveTab("sketches");
                audioService.playClick("tap");
              }}
              className={`flex-1 py-1.5 rounded text-[10px] font-mono font-medium transition-colors ${activeTab === "sketches" ? "bg-cyan-glow text-slate-950 font-bold" : "text-slate-400 hover:text-white"}`}
            >
              LAB ENTRY
            </button>
            <button
              onClick={() => {
                setActiveTab("history");
                audioService.playClick("tap");
              }}
              className={`flex-1 py-1.5 rounded text-[10px] font-mono font-medium transition-colors ${activeTab === "history" ? "bg-cyan-glow text-slate-950 font-bold" : "text-slate-400 hover:text-white"}`}
            >
              LOGS
            </button>
            <button
              onClick={() => {
                setActiveTab("achievements");
                audioService.playClick("tap");
              }}
              className={`flex-1 py-1.5 rounded text-[10px] font-mono font-medium transition-colors ${activeTab === "achievements" ? "bg-cyan-glow text-slate-950 font-bold" : "text-slate-400 hover:text-white"}`}
            >
              MILESTONES
            </button>
          </div>

          {/* Scrolling Content panel inside sidebar */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-3 pt-1">
            {activeTab === "sketches" && (
              <div className="space-y-3.5">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">JOURNAL PRESETS</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => { setActivePreset("duality"); audioService.playPressed("haptic"); }}
                    className={`p-1.5 text-[9px] font-mono rounded border text-center transition-all ${activePreset === "duality" ? "border-cyan-glow text-cyan-glow bg-cyan-glow/5" : "border-slate-800 text-slate-400 hover:border-slate-700"}`}
                  >
                    Wave Duality
                  </button>
                  <button
                    onClick={() => { setActivePreset("tunneling"); audioService.playPressed("haptic"); }}
                    className={`p-1.5 text-[9px] font-mono rounded border text-center transition-all ${activePreset === "tunneling" ? "border-cyan-glow text-cyan-glow bg-cyan-glow/5" : "border-slate-800 text-slate-400 hover:border-slate-700"}`}
                  >
                    Tunneling Barrier
                  </button>
                  <button
                    onClick={() => { setActivePreset("superposition"); audioService.playPressed("haptic"); }}
                    className={`p-1.5 text-[9px] font-mono rounded border text-center transition-all ${activePreset === "superposition" ? "border-cyan-glow text-cyan-glow bg-cyan-glow/5" : "border-slate-800 text-slate-400 hover:border-slate-700"}`}
                  >
                    Superposition
                  </button>
                  <button
                    onClick={() => { setActivePreset("bloch"); audioService.playPressed("haptic"); }}
                    className={`p-1.5 text-[9px] font-mono rounded border text-center transition-all ${activePreset === "bloch" ? "border-cyan-glow text-cyan-glow bg-cyan-glow/5" : "border-slate-800 text-slate-400 hover:border-slate-700"}`}
                  >
                    Qubit Bloch Sphere
                  </button>
                </div>

                <div className="pt-2 border-t border-white/5 space-y-2">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">PEN PROPERTIES</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setPenColor("cyan")}
                      className={`flex-1 p-1 rounded border text-[9px] font-mono text-cyan-400 ${penColor === "cyan" ? "border-cyan-glow bg-cyan-glow/10 font-bold" : "border-slate-800"}`}
                    >
                      Cyan Glow
                    </button>
                    <button
                      onClick={() => setPenColor("violet")}
                      className={`flex-1 p-1 rounded border text-[9px] font-mono text-violet-400 ${penColor === "violet" ? "border-violet-glow bg-violet-glow/10 font-bold" : "border-slate-800"}`}
                    >
                      Violet Glow
                    </button>
                    <button
                      onClick={() => setPenColor("amber")}
                      className={`flex-1 p-1 rounded border text-[9px] font-mono text-amber-500 ${penColor === "amber" ? "border-amber-500/20 bg-amber-500/10 font-bold" : "border-slate-800"}`}
                    >
                      Amber
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPenColor("eraser")}
                      className={`flex-1 p-1 rounded border text-[9px] font-mono text-slate-400 ${penColor === "eraser" ? "border-slate-500 bg-white/5 font-bold" : "border-slate-800"}`}
                    >
                      Eraser
                    </button>
                    <button
                      onClick={clearCanvas}
                      className="p-1 rounded border border-slate-800 hover:border-red-500 text-[9px] font-mono text-red-400 hover:bg-red-950/20 px-2"
                    >
                      Clear
                    </button>
                  </div>

                  {/* Brush size */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[8px] font-mono text-slate-400">
                      <span>Brush Diameter</span>
                      <span>{brushSize}px</span>
                    </div>
                    <input 
                      type="range" min="1" max="10" step="1" value={brushSize} 
                      onChange={(e) => setBrushSize(parseInt(e.target.value))}
                      className="w-full accent-cyan-glow h-1 rounded bg-slate-900 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-3.5">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">SAVED WORKBOOK LOGS</span>
                {entries.length === 0 ? (
                  <div className="text-slate-500 text-xs italic font-mono p-4 text-center">No lab logs recorded. Save observations on the right!</div>
                ) : (
                  entries.map((entry) => (
                    <div key={entry.id} className="p-2 bg-slate-900/40 border border-white/5 rounded space-y-1 text-left relative group">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono text-cyan-glow tracking-wider truncate max-w-[110px]">{entry.title}</span>
                        <button 
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-500 hover:text-red-400 rounded transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed">{entry.content}</p>
                      <span className="text-[8px] font-mono text-slate-500 block">{entry.timestamp}</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "achievements" && (
              <div className="space-y-3">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">STELLAR BADGES</span>
                <div className="space-y-2">
                  {ACHIEVEMENTS_LIST.map((ach) => (
                    <div 
                      key={ach.id} 
                      className={`p-2.5 rounded-lg border text-left flex items-start space-x-2 transition-all ${ach.unlocked ? "bg-gradient-to-tr from-cyan-950/20 to-violet-950/10 border-cyan-glow/20" : "bg-slate-950/80 border-white/5 opacity-50"}`}
                    >
                      <div className="text-base mt-0.5">{ach.unlocked ? "🌟" : "🔒"}</div>
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <h4 className="text-[11px] font-bold text-white truncate">{ach.name}</h4>
                        <p className="text-[9px] text-slate-400 leading-normal">{ach.unlocked ? ach.description : `Unlock: ${ach.requirement}`}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Diagnostic calibration stats */}
        <div className="bg-slate-950 border border-white/5 p-3 rounded text-[9px] font-mono text-slate-500 shrink-0">
          <div>LOG RECORDING: ACTIVE</div>
          <div>JOURNAL STORAGE: ENCRYPTED LOCAL</div>
          <div>COHERENT VECTOR CHANNELS: 100%</div>
        </div>
      </div>

      {/* Main Journal Workspace */}
      <div className="lg:col-span-3 flex flex-col bg-slate-950/40 rounded-xl border border-white/5 overflow-hidden h-full">
        <div className="flex bg-slate-900/60 p-4 border-b border-white/5 items-center justify-between shrink-0">
          <div>
            <span className="text-[9px] font-mono text-cyan-glow uppercase tracking-wider block">Observer Console</span>
            <h2 className="text-base font-bold text-white flex items-center">
              <PenTool className="w-4 h-4 text-cyan-glow mr-2" /> Scientific Discovery Logbook
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveTab("connections");
                audioService.playClick("tap");
              }}
              className={`px-3 py-1.5 rounded text-[10px] font-mono border transition-all ${activeTab === "connections" ? "border-cyan-glow bg-cyan-glow/10 text-cyan-glow font-bold" : "border-slate-800 text-slate-400 hover:text-white"}`}
            >
              🌌 COSMIC CONNECTIONS
            </button>
          </div>
        </div>

        {activeTab === "connections" ? (
          // Connections Matrix Screen
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-cyan-glow uppercase tracking-wider block">Quantum Connections Matrix</span>
              <h3 className="text-xl font-display font-bold text-white">Quantum ⟷ Astrophysical Entanglements</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                The microscopic laws of quantum mechanics directly dictate macroscopic cosmic structures. Click on a connection nexus to bridge the subatomic coordinates with the celestial cosmos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {CONNECTIONS.map((conn) => (
                <div 
                  key={conn.id}
                  onClick={() => {
                    setSelectedConnection(conn);
                    audioService.playClick("confirm");
                  }}
                  className={`p-5 rounded-xl border transition-all cursor-pointer hover:shadow-[0_4px_15px_rgba(0,243,255,0.04)] relative overflow-hidden group ${selectedConnection?.id === conn.id ? "bg-gradient-to-tr from-cyan-950/30 to-slate-900 border-cyan-glow/40" : "bg-slate-950/50 border-white/5 hover:border-cyan-glow/20"}`}
                >
                  <div className="absolute top-2 right-2 text-slate-600 group-hover:text-cyan-glow transition-colors">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-cyan-glow transition-colors">{conn.title}</h4>
                  <div className="flex gap-3 mt-3">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-glow">
                      {conn.topic1}
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-violet-950 text-violet-glow">
                      {conn.topic2}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {selectedConnection && (
              <div className="mt-6 p-5 rounded-xl bg-violet-950/10 border border-violet-glow/15 space-y-3.5 animate-fade-in text-left">
                <div className="flex items-center space-x-2">
                  <span className="text-base">🌌</span>
                  <span className="text-[10px] font-mono text-violet-glow uppercase tracking-widest font-bold">Scientific Core Relationship</span>
                </div>
                <h4 className="text-base font-bold text-white">{selectedConnection.title}</h4>
                <p className="text-slate-300 text-xs leading-relaxed font-sans">{selectedConnection.relationship}</p>
              </div>
            )}
          </div>
        ) : (
          // Sketches & Text Entry Screen
          <div className="p-6 overflow-y-auto flex-1 space-y-6 flex flex-col lg:flex-row gap-6">
            {/* Draw area */}
            <div className="flex-1 flex flex-col space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center">
                  <PenTool className="w-3.5 h-3.5 text-cyan-glow mr-1.5" /> Sketchpad Canvas
                </span>
                <span className="text-[9px] font-mono text-slate-500">PROJECTION SCREEN 800×450</span>
              </div>

              <div className="relative border border-white/10 rounded-xl overflow-hidden bg-slate-950 shrink-0 h-[300px]">
                <canvas
                  ref={canvasRef}
                  width={680}
                  height={300}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full h-full block cursor-crosshair relative z-10"
                />
              </div>

              {/* Pre-drawn instructional hint */}
              <div className="flex justify-between items-center p-2 rounded bg-slate-900/30 border border-white/5 text-[10px] font-mono text-slate-400">
                <span>💡 Choose a preset above, or sketch your observations directly on the canvas grid!</span>
                <button 
                  onClick={clearCanvas}
                  className="text-cyan-glow hover:underline hover:text-white"
                >
                  RESET GRID
                </button>
              </div>
            </div>

            {/* Note taking area */}
            <div className="w-full lg:w-[320px] shrink-0 flex flex-col space-y-4">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Record Observations
              </span>

              <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-white/5 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase">Observer Entry Title</label>
                    <input
                      type="text"
                      placeholder="e.g., Wavefunction Collapsing"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded p-2 text-xs font-sans text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-glow"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase">Scientific Field Notes</label>
                    <textarea
                      placeholder="Write your findings, observations, or conclusions..."
                      rows={5}
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded p-2 text-xs font-sans text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-glow resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase">Topic Coordinates</label>
                    <select
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded p-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-glow"
                    >
                      <option value="duality">Wave Duality</option>
                      <option value="superposition">Superposition</option>
                      <option value="entanglement">Entanglement</option>
                      <option value="tunneling">Tunneling</option>
                      <option value="schrodinger">Schrödinger Equation</option>
                      <option value="computing">Quantum Computing</option>
                      <option value="relativity">Theory of Relativity</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleSaveEntry}
                  disabled={!newTitle.trim() || !newContent.trim()}
                  className="w-full py-2.5 rounded bg-gradient-to-r from-cyan-glow to-quantum-blue text-slate-950 font-bold text-xs font-mono flex items-center justify-center space-x-1.5 hover:opacity-90 transition-all cursor-none disabled:opacity-40"
                >
                  <Save className="w-3.5 h-3.5 fill-slate-950" />
                  <span>COMMIT DISCOVERY LOG</span>
                </button>
              </div>

              {/* Display AI queries as helpful log notes */}
              {aiQuestions.length > 0 && (
                <div className="p-3 rounded-lg border border-cyan-glow/10 bg-cyan-950/5 space-y-2 text-left">
                  <span className="text-[9px] font-mono text-cyan-glow uppercase tracking-wider block flex items-center">
                    <Brain className="w-3 h-3 text-cyan-glow mr-1 animate-pulse" /> Linked AI Query Log
                  </span>
                  <div className="text-[10px] text-slate-200 font-mono italic">
                    "{aiQuestions[0].question}"
                  </div>
                  <div className="text-[9px] text-slate-400 line-clamp-2 leading-relaxed">
                    {aiQuestions[0].answer}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
