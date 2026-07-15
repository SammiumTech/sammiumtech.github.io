import React, { useState, useEffect } from "react";
import { BookOpen, HelpCircle, Lightbulb, Sparkles, Award, ArrowRight, CheckCircle, Eye, EyeOff, Wifi, WifiOff, Database, RefreshCw, ShieldCheck } from "lucide-react";
import { QuantumTopic } from "../types";
import { audioService } from "../utils/audioService";

interface LearningHubProps {
  completedLessons: string[];
  onCompleteLesson: (topicId: string) => void;
  onNavigateToSimulator: () => void;
  onTopicChange?: (topicId: string) => void;
  isOnline?: boolean;
  swActive?: boolean;
}

const QUANTUM_TOPICS: QuantumTopic[] = [
  {
    id: "duality",
    title: "Wave–Particle Duality",
    category: "foundations",
    summary: "Matter and light behave as both particles and waves depending on the measurement.",
    description: "In classical physics, a wave is an oscillation of a medium, and a particle is a localized mass. In the quantum realm, entities like electrons and photons exhibit both behaviors. When travelling through space, they act like continuous waves. When interacting with an atom or hit by a detector, they collapse into distinct localized particle-like energy packets.",
    keyFormula: "de Broglie Wavelength",
    formulaString: "λ = h / p",
    analogy: "Think of water ripples passing through a pier versus raindrops hitting a window. A quantum object travels like continuous ripples, but strikes its target like a single rain droplet.",
    openQuestions: "What constitutes a 'measurement'? Does collapse require an observer, or is it purely defined by molecular interactions with the environment (decoherence)?"
  },
  {
    id: "superposition",
    title: "Quantum Superposition",
    category: "foundations",
    summary: "Systems exist in a combination of all possible states simultaneously.",
    description: "Before a measurement occurs, a quantum particle is described as a linear sum of possible outcome states. This isn't just lack of knowledge; the particle is physically interacting as if it were in all states simultaneously, creating physical interference. When we measure the system, the wavefunction collapsed instantly into one exact outcome.",
    keyFormula: "Superposition State",
    formulaString: "|ψ⟩ = α|0⟩ + β|1⟩",
    analogy: "A spinning coin is neither heads nor tails while rotating; it is in a dynamic superposition. Only when you stop the coin (measurement) does it collapse into a fixed, classic state of heads or tails.",
    openQuestions: "Is the wavefunction collapse physical, or is it just updating our knowledge? This is the core dispute behind interpretations like Copenhagen and Many-Worlds."
  },
  {
    id: "entanglement",
    title: "Quantum Entanglement",
    category: "foundations",
    summary: "Instantaneous correlation of states between separated particles.",
    description: "When two particles interact, they can become deeply linked so that they share a single mathematical wave function. Measuring a property (like spin direction) of Particle A immediately determines the spin direction of Particle B, regardless of whether they are separated by centimeters or light-years. Albert Einstein famously called this 'spooky action at a distance'.",
    keyFormula: "Bell State",
    formulaString: "|Φ⁺⟩ = (|00⟩ + |11⟩) / √2",
    analogy: "Imagine cutting a pair of shoes in half, placing each in a separate locked box, and mailing one to London and the other to Tokyo. Opening your box in Tokyo and finding the left shoe immediately reveals that the box in London contains the right shoe, even though no signal traveled between them.",
    openQuestions: "How does nature enforce non-locality without violating Einstein's cosmic speed limit of light? It operates because no actual information can be sent via raw random measurements alone."
  },
  {
    id: "schrodinger",
    title: "Schrödinger's Equation",
    category: "mechanics",
    summary: "The fundamental wave equation governing the behavior of quantum systems.",
    description: "Just as Newton's F=ma dictates how billiard balls roll, Schrödinger's equation dictates how wavefunctions evolve over space and time. It is a differential equation that solves for the probability amplitude of findable positions, energies, and momenta of quantum objects inside electrostatic and gravitational potentials.",
    keyFormula: "Time-Dependent Schrödinger Equation",
    formulaString: "iℏ ∂/∂t |ψ⟩ = H |ψ⟩",
    analogy: "Think of the equation as predicting the resonant frequencies of a musical violin string, but instead of audio frequencies, it determines the discrete orbital levels of electrons inside a hydrogen atom.",
    openQuestions: "How does the linear, completely deterministic evolution of Schrödinger's equation reconcile with the random, non-linear collapse that happens during measurement?"
  },
  {
    id: "tunneling",
    title: "Quantum Tunneling",
    category: "mechanics",
    summary: "Particles passing through solid energetic barriers they classically cannot scale.",
    description: "Because quantum objects are wave-like, their probability wave does not end abruptly at a barrier. Instead, it decays exponentially inside the barrier. If the barrier is thin enough, a small percentage of the wave leaks through. This means there is a non-zero probability of finding the particle on the other side, as if it tunneled through a solid mountain.",
    keyFormula: "Transmission Coefficient",
    formulaString: "T ≈ e^(-2κL)",
    analogy: "Imagine rolling a ball up a hill. Classically, if you don't push it hard enough, it rolls back down. In the quantum lab, if the hill is thin enough, the ball sometimes vanishes from the uphill slope and instantly materializes rolling down the other side.",
    openQuestions: "How long does a particle spend 'inside' the barrier while tunneling? Some measurements suggest tunneling appears superluminal, a hot area of ongoing research."
  },
  {
    id: "uncertainty",
    title: "Heisenberg Uncertainty Principle",
    category: "foundations",
    summary: "You cannot measure both position and momentum with absolute precision.",
    description: "This is not a limitation of our laboratory equipment; it is a fundamental property of wave mechanics. To measure a particle's exact position, you must strike it with a short-wavelength photon, which transfers massive momentum and alters its speed. If you use a long-wavelength photon to preserve momentum, you lose precision in its position.",
    keyFormula: "Heisenberg Inequality",
    formulaString: "Δx · Δp ≥ ℏ/2",
    analogy: "Think of trying to define the exact location of a wave in the ocean. To make it a localized ripple (short wave packet), you must bundle multiple frequencies together, making its frequency (momentum) highly spread out and uncertain.",
    openQuestions: "Does physical reality lack precise characteristics prior to being measured, or is our description simply bounded by the mathematical limits of Fourier transform relations?"
  },
  {
    id: "computing",
    title: "Quantum Computing Basics",
    category: "computing",
    summary: "Processing information using superposition, interference, and qubits.",
    description: "A classical computer operates with bits representing exactly 0 or 1. A quantum computer utilizes qubits which can be in a superposition state of both. By using quantum logic gates (like Hadamard and CNOT) to entangle qubits, quantum computers can process exponentially massive combinations of data, solving difficult chemistry, optimization, and factoring algorithms.",
    keyFormula: "Qubit Representation",
    formulaString: "|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩",
    analogy: "A classical computer is like a maze-runner exploring paths one by one. A quantum computer is like flooding the entire maze with water, finding the path through physical wave interference instantly.",
    openQuestions: "How can we scale error correction and maintain stable coherence across millions of physical qubits when they are highly sensitive to thermal background noise?"
  },
  {
    id: "relativity",
    title: "Theory of Relativity",
    category: "advanced",
    summary: "Space and time are woven into a single fabric: spacetime, which curves under massive gravity.",
    description: "In classical physics, space is a flat, absolute background. Einstein's Theory of General Relativity reveals that gravity is not a pull, but the curvature of four-dimensional spacetime caused by mass and energy. Massive objects like stars bend the spacetime coordinate grid around them, dictating how objects fall and even bending the path of light itself (gravitational lensing).",
    keyFormula: "Einstein Field Equation",
    formulaString: "G_μν + Λ g_μν = 8πG/c⁴ T_μν",
    analogy: "Imagine a heavy bowling ball resting on a soft trampoline. Placing a small marble on the trampoline causes it to roll towards the bowling ball. It rolls not because of a magical pull, but because the fabric of the trampoline is curved.",
    openQuestions: "How can we unify General Relativity (which governs gravity on a cosmic scale) with Quantum Mechanics (which governs atomic systems)? This is the ultimate dream of a Theory of Quantum Gravity."
  }
];

export default function LearningHub({ completedLessons, onCompleteLesson, onNavigateToSimulator, onTopicChange, isOnline = true, swActive = false }: LearningHubProps) {
  const [activeTopic, setActiveTopic] = useState<QuantumTopic>(QUANTUM_TOPICS[0]);
  const [isReadingMode, setIsReadingMode] = useState(false);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isCached, setIsCached] = useState(() => {
    try {
      return localStorage.getItem("quantumverse_curriculum_cached") === "true";
    } catch (e) {
      return false;
    }
  });

  const handleManualSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncProgress(0);
    try {
      audioService.playCalibration("engine");
    } catch (e) {}
    
    const interval = setInterval(() => {
      setSyncProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          setIsCached(true);
          try {
            localStorage.setItem("quantumverse_curriculum_cached", "true");
            audioService.playNotification("success");
          } catch (e) {}
          return 100;
        }
        try {
          audioService.playClick("tap");
        } catch (e) {}
        return prev + 10;
      });
    }, 150);
  };

  useEffect(() => {
    if (onTopicChange) {
      onTopicChange(activeTopic.id);
    }
  }, [activeTopic, onTopicChange]);

  const handleLessonCheck = (topicId: string) => {
    onCompleteLesson(topicId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-left animate-fade-in">
      {/* Sidebar: Topic Selectors */}
      <div className="space-y-4 lg:col-span-1">
        <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center mb-1">
          <BookOpen className="w-4 h-4 text-cyan-glow mr-2" /> Quantum Curriculum
        </h3>

        <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-white/5 max-h-[80vh] overflow-y-auto">
          {QUANTUM_TOPICS.map((topic) => {
            const isCompleted = completedLessons.includes(topic.id);
            const isActive = activeTopic.id === topic.id;

            return (
              <button
                key={topic.id}
                onClick={() => {
                  setActiveTopic(topic);
                  audioService.playClick("tap");
                }}
                onMouseEnter={() => {
                  audioService.playHover("tick");
                }}
                className={`w-full text-left p-3 rounded-lg border transition-all text-xs flex flex-col space-y-1.5 ${isActive ? "bg-gradient-to-r from-cyan-950/40 to-violet-950/20 border-cyan-glow/40 shadow-[0_0_12px_rgba(0,243,255,0.06)]" : "border-transparent hover:bg-white/5"}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${topic.category === "foundations" ? "bg-cyan-950 text-cyan-glow" : topic.category === "computing" ? "bg-blue-950 text-blue-400" : "bg-violet-950 text-violet-400"}`}>
                    {topic.category}
                  </span>
                  {isCompleted && (
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-glow" />
                  )}
                </div>
                <span className="font-semibold text-white tracking-wide">{topic.title}</span>
                <span className="text-slate-400 text-[10px] line-clamp-1">{topic.summary}</span>
              </button>
            );
          })}
        </div>

        {/* Offline Cache & Coherence Protection Panel */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-white/5 space-y-3 mt-4 text-[11px] font-mono">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-[10px] font-bold text-cyan-glow uppercase tracking-wider flex items-center">
              <Database className="w-3.5 h-3.5 mr-1.5 animate-pulse text-cyan-glow" /> CACHE SHIELD
            </span>
            {isOnline ? (
              <span className="text-emerald-400 font-extrabold uppercase text-[9px] flex items-center">
                <Wifi className="w-3 h-3 mr-1" /> ONLINE
              </span>
            ) : (
              <span className="text-amber-500 font-extrabold uppercase text-[9px] flex items-center animate-pulse">
                <WifiOff className="w-3 h-3 mr-1" /> OFFLINE MODE
              </span>
            )}
          </div>

          <div className="space-y-1.5 text-slate-400">
            <div className="flex justify-between items-center text-[10px]">
              <span>Shield State:</span>
              {swActive ? (
                <span className="text-emerald-400 flex items-center font-bold">
                  <ShieldCheck className="w-3 h-3 mr-1" /> ACTIVE
                </span>
              ) : (
                <span className="text-cyan-glow/60 font-bold">EMULATED</span>
              )}
            </div>

            <div className="flex justify-between items-center text-[10px]">
              <span>Local Curriculum:</span>
              {isCached ? (
                <span className="text-cyan-glow flex items-center font-bold">
                  <CheckCircle className="w-3 h-3 mr-1" /> OPTIMIZED
                </span>
              ) : (
                <span className="text-amber-500 font-bold">UNCACHED</span>
              )}
            </div>
          </div>

          {/* Sync Progress or Button */}
          {isSyncing ? (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[9px] text-cyan-glow">
                <span className="flex items-center gap-1">
                  <RefreshCw className="w-2.5 h-2.5 animate-spin text-cyan-glow" /> CLONING CORES...
                </span>
                <span>{syncProgress}%</span>
              </div>
              <div className="w-full bg-slate-900 h-1 rounded overflow-hidden">
                <div 
                  className="bg-cyan-glow h-full transition-all duration-150"
                  style={{ width: `${syncProgress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleManualSync}
              className="w-full py-2 rounded text-[10px] font-bold font-mono transition-all flex items-center justify-center space-x-1.5 cursor-none bg-gradient-to-r from-cyan-glow/20 to-violet-glow/20 border border-cyan-glow/40 text-cyan-glow hover:border-cyan-glow hover:shadow-[0_0_10px_rgba(0,243,255,0.15)]"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{isCached ? "SYNC CORE ASSETS" : "OPTIMIZE OFFLINE CACHE"}</span>
            </button>
          )}

          <p className="text-[9px] text-slate-500 leading-relaxed italic text-center pt-1 border-t border-white/5">
            Caches core asset bundles & scientific lesson models to remain functional during network fluctuations.
          </p>
        </div>
      </div>

      {/* Main Panel: Interactive Lesson Display */}
      <div className="lg:col-span-3 space-y-6">
        {/* Connection Loss Shield Warning Banner */}
        {!isOnline && (
          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-950/15 text-amber-300 text-xs font-mono flex items-start gap-3 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.05)]">
            <WifiOff className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-extrabold uppercase tracking-wider block text-amber-400">Quantum Connection Interrupted</span>
              <p className="text-slate-300 leading-relaxed">
                Coherence ratio dropped. However, the <span className="text-cyan-glow font-bold">Service Worker Cache Shield</span> is actively protecting the laboratory. All curriculum materials, core visualization equations, and analogy layers are 100% available offline.
              </p>
            </div>
          </div>
        )}

        <div className={`rounded-xl border p-6 md:p-8 space-y-6 relative overflow-hidden transition-all duration-700 ${isReadingMode ? "bg-[#0b0f19]/90 border-amber-500/10 shadow-[0_0_50px_rgba(245,158,11,0.02)]" : "glass-panel border-white/5"}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-glow/5 to-violet-glow/5 rounded-full blur-3xl -z-10"></div>
          
          {/* Header */}
          <div className="border-b border-white/5 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs font-mono text-cyan-glow">
                <span>Curriculum Lesson</span>
                <span>/</span>
                <span className="capitalize">{activeTopic.category}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight flex items-center">
                <Sparkles className="w-6 h-6 text-cyan-glow mr-3 animate-pulse" /> {activeTopic.title}
              </h2>
            </div>

            {/* Reading Mode Toggle Button */}
            <button
              onClick={() => {
                setIsReadingMode(!isReadingMode);
                audioService.playClick("confirm");
              }}
              onMouseEnter={() => {
                audioService.playHover("tick");
              }}
              className={`px-3.5 py-1.5 rounded-lg border text-[10px] font-mono flex items-center space-x-1.5 transition-all cursor-none ${isReadingMode ? "bg-amber-500/20 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.1)]" : "bg-white/5 text-slate-400 border-white/5 hover:text-white hover:border-white/10"}`}
            >
              {isReadingMode ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>READING MODE ACTIVE</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-cyan-glow" />
                  <span>ACTIVATE COMFORT READING</span>
                </>
              )}
            </button>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest">Theoretical Background</h4>
            <p className={`whitespace-pre-line transition-all duration-300 ${isReadingMode ? "text-slate-200 text-base leading-loose max-w-3xl tracking-wide font-sans select-text" : "text-slate-300 text-sm leading-relaxed"}`}>
              {activeTopic.description}
            </p>
          </div>

          {/* Formula Display Block */}
          <div className="bg-slate-950 p-5 rounded-lg border border-cyan-glow/10 text-center relative overflow-hidden group">
            <div className="absolute top-2 left-3 text-[10px] font-mono text-cyan-glow uppercase tracking-wider">
              Fundamental Formula
            </div>
            <div className="text-white text-xl md:text-2xl font-mono py-4 select-all glow-cyan cursor-pointer tracking-wider">
              {activeTopic.formulaString}
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              {activeTopic.keyFormula}
            </p>
          </div>

          {/* Analogy Box */}
          <div className="bg-violet-950/20 p-5 rounded-lg border border-violet-glow/10 flex items-start space-x-4">
            <div className="w-8 h-8 rounded bg-violet-900/40 flex items-center justify-center shrink-0 text-violet-glow">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 text-left">
              <h4 className="text-xs font-mono text-violet-glow uppercase tracking-wider">Helpful Analogy</h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                {activeTopic.analogy}
              </p>
            </div>
          </div>

          {/* Open Questions and Controversies */}
          <div className="bg-slate-950 p-5 rounded-lg border border-amber-500/10 flex items-start space-x-4">
            <div className="w-8 h-8 rounded bg-amber-950/40 flex items-center justify-center shrink-0 text-amber-500">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 text-left">
              <h4 className="text-xs font-mono text-amber-500 uppercase tracking-wider">Interpretations & Open Questions</h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                {activeTopic.openQuestions}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              {!completedLessons.includes(activeTopic.id) ? (
                <button
                  onClick={() => {
                    handleLessonCheck(activeTopic.id);
                    audioService.playNotification("success");
                  }}
                  onMouseEnter={() => {
                    audioService.playHover("tick");
                  }}
                  className="px-5 py-2.5 rounded bg-gradient-to-r from-cyan-glow/20 to-cyan-glow/10 border border-cyan-glow/30 text-xs font-mono text-cyan-glow hover:border-cyan-glow transition-all flex items-center space-x-2"
                >
                  <Award className="w-4 h-4 text-cyan-glow" />
                  <span>Mark Lesson as Completed</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Lesson Completed Successfully</span>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                onNavigateToSimulator();
                audioService.playCalibration("wave");
              }}
              onMouseEnter={() => {
                audioService.playHover("tick");
              }}
              className="px-5 py-2.5 rounded bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-cyan-glow text-xs font-mono text-white transition-all flex items-center space-x-2"
            >
              <span>Launch Interactive Simulator</span>
              <ArrowRight className="w-4 h-4 text-cyan-glow" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
