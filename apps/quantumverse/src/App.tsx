import React, { useState, useEffect, useRef } from "react";
import { 
  Atom, Globe, BookOpen, Activity, Bot, Brain, Calendar, Cpu, Award, ShieldCheck, Volume2, VolumeX, Sparkles, Book
} from "lucide-react";

import QuantumLoader from "./components/QuantumLoader";
import QuantumDashboard from "./components/QuantumDashboard";
import LearningHub from "./components/LearningHub";
import Simulations from "./components/Simulations";
import AIMentor from "./components/AIMentor";
import QuizArena from "./components/QuizArena";
import ComputingPlayground from "./components/ComputingPlayground";
import Timeline from "./components/Timeline";
import ScientificTrustCenter from "./components/ScientificTrustCenter";
import QuantumFieldCanvas from "./components/QuantumFieldCanvas";
import QuantumCursor from "./components/QuantumCursor";
import LivingQuantumUniverse from "./components/LivingQuantumUniverse";
import DiscoveryJournal from "./components/DiscoveryJournal";
import QuantumCoreNav from "./components/QuantumCoreNav";
import HolographicPanel from "./components/HolographicPanel";
import { audioService } from "./utils/audioService";

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [loaderMounted, setLoaderMounted] = useState(true);
  const [loaderFading, setLoaderFading] = useState(false);
  
  const [activeModule, setActiveModule] = useState<
    "dashboard" | "hub" | "sims" | "mentor" | "quiz" | "playground" | "timeline" | "trust" | "journal"
  >("dashboard");

  const [transitionState, setTransitionState] = useState<"idle" | "detection" | "activation" | "assembly" | "transition" | "reconstruction" | "sync">("idle");
  const [targetModule, setTargetModule] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string>("duality");

  const [graphicsMode, setGraphicsMode] = useState<"performance" | "balanced" | "ultra">("balanced");
  const [graphicsAutoDetected, setGraphicsAutoDetected] = useState(false);
  const [autoDetectLog, setAutoDetectLog] = useState("");

  const [soundEnabled, setSoundEnabled] = useState(audioService.isEnabled());
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [swActive, setSwActive] = useState(false);

  // Global user progression state
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("quantumverse_completed_lessons");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("quantumverse_unlocked_badges");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Adaptive Graphics Auto-Detection Routine
  useEffect(() => {
    try {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const cores = navigator.hardwareConcurrency || 4;
      // @ts-ignore
      const memory = navigator.deviceMemory || 8;
      
      let optimal: "performance" | "balanced" | "ultra" = "balanced";
      let logMsg = "";

      if (isMobile || cores <= 4 || memory <= 4) {
        optimal = "performance";
        logMsg = `Mobile/Low-Spec Hardware (${cores} Cores, ${memory}GB RAM)`;
      } else if (cores >= 12 && memory >= 16) {
        optimal = "ultra";
        logMsg = `High-End Workstation (${cores} Cores, ${memory}GB RAM)`;
      } else {
        optimal = "balanced";
        logMsg = `Standard Hardware (${cores} Cores, ${memory}GB RAM)`;
      }

      setGraphicsMode(optimal);
      setGraphicsAutoDetected(true);
      setAutoDetectLog(logMsg);
    } catch (err) {
      setGraphicsMode("balanced");
    }
  }, []);

  // Network Offline Resiliency & Service Worker Alignment
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      try {
        audioService.playNotification("success");
      } catch (e) {}
    };

    const handleOffline = () => {
      setIsOnline(false);
      try {
        audioService.playNotification("error");
      } catch (e) {}
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Register Quantum Service Worker for brief interruption shielding
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register(new URL("./sw.js", window.location.href), { scope: "./" })
        .then((registration) => {
          console.log("[Quantum SW] Coherence Shield online. Scope:", registration.scope);
          setSwActive(true);
          
          // Listen for controller changes (new service worker taking control)
          navigator.serviceWorker.addEventListener("controllerchange", () => {
            setSwActive(true);
          });
        })
        .catch((error) => {
          console.warn("[Quantum SW] Registration bypassed:", error);
          setSwActive(false);
        });
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Sound initialization check or skip
  const handleLoaderComplete = () => {
    setLoaderFading(true);
    // Smooth transition: mount dashboard first, fade out loader overlay over 1.2s, then unmount
    setTimeout(() => {
      setIsInitialized(true);
      setLoaderMounted(false);
      setSoundEnabled(audioService.isEnabled());
    }, 1200);
  };

  useEffect(() => {
    if (isInitialized && soundEnabled) {
      audioService.startAmbience(activeModule);
    } else {
      audioService.stopAmbience();
    }
    return () => {
      audioService.stopAmbience();
    };
  }, [isInitialized, soundEnabled, activeModule]);

  const handleNavigate = (module: string) => {
    let target = module;
    if (module === "simulations") target = "sims";
    else if (module === "learning-hub") target = "hub";
    else if (module === "ai-mentor") target = "mentor";
    else if (module === "computing") target = "playground";
    else if (module === "quiz-arena") target = "quiz";
    else if (module === "discovery-journal" || module === "journal") target = "journal";

    if (transitionState !== "idle" || activeModule === target) return;

    setTargetModule(target);
    
    // Track some specific exploration milestones
    if (target === "playground") {
      localStorage.setItem("quantumverse_visited_playground", "true");
    }

    // Phase 1 — Intelligent Detection (0–100 ms)
    setTransitionState("detection");
    audioService.playClick("tap"); // Soft crystalline tap

    // Phase 2 — Nanophotonic Activation (100–250 ms)
    setTimeout(() => {
      setTransitionState("activation");
      audioService.playClick("pulse"); // Soft energy pulse
    }, 100);

    // Phase 3 — Nano Assembly (250–500 ms)
    setTimeout(() => {
      setTransitionState("assembly");
      audioService.playCalibration("wave"); // Nanophotonic wave sweep
    }, 250);

    // Phase 4 — Quantum Transition (500–750 ms)
    setTimeout(() => {
      setActiveModule(target as any);
      setTransitionState("transition");
      
      // Dynamic, subtle sound effect that changes based on target module
      if (target === "sims") {
        audioService.playModuleOpen("sims");
      } else if (target === "hub") {
        audioService.playModuleOpen("hub");
      } else if (target === "mentor") {
        audioService.playModuleOpen("mentor");
      } else if (target === "timeline") {
        audioService.playModuleOpen("timeline");
      } else if (target === "playground") {
        audioService.playCalibration("engine");
      } else if (target === "quiz") {
        audioService.playClick("confirm");
      } else if (target === "journal") {
        audioService.playHover("sparkle", 1.25);
      } else if (target === "dashboard") {
        audioService.playDashboardArrival();
      } else {
        audioService.playCalibration("simulator");
      }
    }, 500);

    // Phase 5 — Nano Reconstruction (750–1000 ms)
    setTimeout(() => {
      setTransitionState("reconstruction");
      audioService.playNotification("completed"); // Warm spatial bloom tone
    }, 750);

    // Phase 6 — Environmental Synchronization (1000–1200 ms)
    setTimeout(() => {
      setTransitionState("sync");
    }, 1000);

    // Reset to Idle (1200ms)
    setTimeout(() => {
      setTransitionState("idle");
      setTargetModule(null);
    }, 1200);
  };

  const markLessonCompleted = (topicId: string) => {
    if (!completedLessons.includes(topicId)) {
      setCompletedLessons((prev) => {
        const next = [...prev, topicId];
        localStorage.setItem("quantumverse_completed_lessons", JSON.stringify(next));
        return next;
      });
    }
  };

  const handleQuizCompleted = (score: number, topic: string) => {
    const prevMax = parseInt(localStorage.getItem("quantumverse_max_score") || "0");
    if (score > prevMax) {
      localStorage.setItem("quantumverse_max_score", score.toString());
    }
    
    if (score === 100) {
      let badgeName = "Superposition Sovereign";
      if (topic === "duality") badgeName = "Duality Overlord";
      if (topic === "entanglement") badgeName = "Entanglement Sage";

      if (!unlockedBadges.includes(badgeName)) {
        setUnlockedBadges((prev) => {
          const next = [...prev, badgeName];
          localStorage.setItem("quantumverse_unlocked_badges", JSON.stringify(next));
          return next;
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100 flex flex-col font-sans relative overflow-x-hidden select-none cursor-none">
      
      {/* Living Quantum Background System v8.0 */}
      <LivingQuantumUniverse 
        activeModule={activeModule}
        completedLessonsCount={completedLessons.length}
        unlockedBadgesCount={unlockedBadges.length}
        transitionState={transitionState}
        selectedTopicId={selectedTopicId}
        graphicsMode={graphicsMode}
      />

      {/* Custom QuantumVerse Cursor */}
      <QuantumCursor isLoading={loaderMounted} activeModule={activeModule} />

      {/* Cinematic Boot Sequence Overlay (No Fade-To-Black transition) */}
      {loaderMounted && (
        <div className={`fixed inset-0 z-50 transition-opacity duration-1000 ${loaderFading ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <QuantumLoader onComplete={handleLoaderComplete} />
        </div>
      )}
      {/* Dynamic scanlines & volumetric glow overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none z-50 opacity-15"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-cyan-glow/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-violet-glow/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      {/* Primary Holographic Header Frame */}
      <header className="border-b border-white/10 bg-slate-950/65 backdrop-blur-md px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => handleNavigate("dashboard")}
            onMouseEnter={() => audioService.playHover("tick")}
          >
            <Atom className="w-8 h-8 text-cyan-glow animate-spin-slow" />
            <div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-cyan-glow/15 border border-cyan-glow/25 text-cyan-glow">
                LAB MODULE ACTIVE
              </span>
              <h1 className="text-xl font-display font-black tracking-tight text-white mt-0.5">
                Sammium Quantum<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-glow to-violet-glow">Verse</span>
              </h1>
            </div>
          </div>

          {/* Core Lab Telemetry Indicators */}
          <div className="flex items-center space-x-4 md:space-x-6 text-[11px] font-mono">
            {/* Audio Toggle */}
            <button
              onClick={() => {
                const nextVal = !soundEnabled;
                audioService.setSoundEnabled(nextVal);
                setSoundEnabled(nextVal);
                audioService.playClick("pulse");
              }}
              onMouseEnter={() => audioService.playHover("tick")}
              className={`py-1 px-2.5 rounded border transition-all flex items-center space-x-1.5 ${soundEnabled ? "border-cyan-glow/30 text-cyan-glow bg-cyan-glow/10" : "border-slate-800 text-slate-500 hover:text-slate-300 bg-transparent"}`}
              title={soundEnabled ? "Mute Laboratory Ambience" : "Unmute Laboratory Ambience"}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  <span className="text-[9px]">SOUND ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-bold">MUTED</span>
                </>
              )}
            </button>
            <div className="w-[1px] h-6 bg-white/10"></div>
            <div className="text-left">
              <span className="text-slate-500 block text-[9px] uppercase">COHERENCE STATE</span>
              {isOnline ? (
                <span className="text-cyan-glow font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-pulse"></span>
                  99.982% COHERENT {swActive && <span className="text-[9px] text-cyan-400/60 font-semibold">(SHIELD)</span>}
                </span>
              ) : (
                <span className="text-amber-500 font-bold flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                  87.412% BACKUP {swActive && <span className="text-[9px] text-amber-400 font-extrabold">(SW SHIELDED)</span>}
                </span>
              )}
            </div>
            <div className="w-[1px] h-6 bg-white/10"></div>
            <div className="text-left">
              <span className="text-slate-500 block text-[9px] uppercase">BADGES UNLOCKED</span>
              <span className="text-violet-glow font-bold">{unlockedBadges.length} / 3</span>
            </div>
            <div className="w-[1px] h-6 bg-white/10"></div>
            <div className="text-left">
              <span className="text-slate-500 block text-[9px] uppercase">TELESCOPE STATE</span>
              <span className="text-emerald-400 font-bold">ACQUIRED</span>
            </div>
          </div>
        </div>
      </header>

      {/* Perspective Wrapper for Cinematic Depth */}
      <div 
        className="flex-1 flex flex-col"
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d"
        }}
      >
        {/* Main Content Arena with GPU-accelerated Quantum Dimensional Fold */}
        <main 
          className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8 transition-all duration-500 ease-out origin-center"
          style={{
            transform: 
              transitionState === "detection" ? "scale(0.995) translateZ(-5px)" :
              transitionState === "activation" ? "scale(0.98) translateZ(-20px) rotateX(1deg)" :
              transitionState === "assembly" ? "scale(0.95) translateZ(-80px) rotateX(4deg) rotateY(5deg)" :
              transitionState === "transition" ? "scale(0.9) rotateY(25deg) translateZ(-250px) rotateX(-8deg)" :
              transitionState === "reconstruction" ? "scale(1.04) rotateY(-10deg) translateZ(100px) rotateX(2deg)" :
              transitionState === "sync" ? "scale(1.01) translateZ(15px) rotateX(0.5deg)" :
              "scale(1) rotateY(0deg) translateZ(0px) rotateX(0deg) blur(0px)",
            opacity:
              transitionState === "assembly" ? 0.4 :
              transitionState === "transition" ? 0 :
              transitionState === "reconstruction" ? 0.5 :
              transitionState === "sync" ? 0.95 :
              1,
            filter: 
              transitionState === "activation" ? "blur(0.5px) brightness(1.1) contrast(1.05)" :
              transitionState === "assembly" ? "blur(4px) brightness(0.7) contrast(1.1) saturate(0.5)" :
              transitionState === "transition" ? "blur(15px) brightness(0.1)" :
              transitionState === "reconstruction" ? "blur(6px) brightness(1.4) contrast(1.2) saturate(1.3)" :
              transitionState === "sync" ? "blur(1px) brightness(1.05)" :
              "blur(0px) brightness(1)",
            backfaceVisibility: "hidden"
          }}
        >
        {activeModule === "dashboard" ? (
          <div className="space-y-8 animate-fade-in">
            {/* Centered Massive Quantum Core with Concentric Nav Nodes */}
            <QuantumCoreNav 
              activeModule={activeModule}
              onNavigate={handleNavigate}
              transitionState={transitionState}
            />
            
            <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-950/45 p-1 md:p-2 min-h-[400px]">
              {/* Reactive background quantum field canvas */}
              <QuantumFieldCanvas isBackground />
              
              <div className="relative z-10">
                <QuantumDashboard 
                  progress={{
                    completedLessons,
                    quizzesTaken: unlockedBadges.length > 0 ? unlockedBadges.length : 0,
                    highestScore: unlockedBadges.length > 0 ? 100 : 0,
                    unlockedBadges
                  }}
                  onNavigate={(module) => handleNavigate(module as any)}
                  hideHero={true}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
            {/* Persistent Compact Navigation Side Column containing the live core */}
            <div className="lg:col-span-4 sticky top-28 z-30 space-y-4">
              <HolographicPanel theme="cyan" headerText="PRIMARY INSTRUMENT REACTOR">
                <div className="h-[430px] relative overflow-hidden -m-5 md:-m-6">
                  <QuantumCoreNav 
                    activeModule={activeModule}
                    onNavigate={handleNavigate}
                    transitionState={transitionState}
                  />
                </div>
              </HolographicPanel>
            </div>

            {/* Active Module Panel wrapped in the spectacular 3D tilt HolographicPanel */}
            <div className="lg:col-span-8">
              <HolographicPanel 
                theme={
                  activeModule === "hub" || activeModule === "playground" ? "violet" : "cyan"
                }
                headerText={
                  activeModule === "hub" ? "Learning Hub Observatory" :
                  activeModule === "sims" ? "Virtual Particle Accelerator" :
                  activeModule === "mentor" ? "AI Quantum Mentor Interface" :
                  activeModule === "quiz" ? "Quiz Arena Coherence Test" :
                  activeModule === "playground" ? "Q-Computing Gate Composer" :
                  activeModule === "journal" ? "Discovery Journal Hypothesis Logs" :
                  activeModule === "timeline" ? "Discovery Timeline Archive" :
                  "Laboratory Security Protocols"
                }
              >
                {activeModule === "hub" && (
                  <LearningHub 
                    completedLessons={completedLessons}
                    onCompleteLesson={markLessonCompleted}
                    onNavigateToSimulator={() => handleNavigate("sims")}
                    onTopicChange={setSelectedTopicId}
                    isOnline={isOnline}
                    swActive={swActive}
                  />
                )}

                {activeModule === "sims" && (
                  <Simulations />
                )}

                {activeModule === "mentor" && (
                  <AIMentor />
                )}

                {activeModule === "quiz" && (
                  <QuizArena onQuizCompleted={handleQuizCompleted} />
                )}

                {activeModule === "playground" && (
                  <ComputingPlayground />
                )}

                {activeModule === "journal" && (
                  <DiscoveryJournal />
                )}

                {activeModule === "timeline" && (
                  <Timeline />
                )}

                {activeModule === "trust" && (
                  <ScientificTrustCenter />
                )}
              </HolographicPanel>
            </div>
          </div>
        )}
      </main>
      </div>

      {/* --- Quantum Transition Overlay Systems (NTE v9.0) --- */}
      
      {/* Phase 1: Intelligent Detection Overlay */}
      {transitionState === "detection" && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden bg-cyan-500/5 backdrop-blur-[0.5px] transition-all duration-100 animate-pulse">
          <div className="absolute top-4 right-4 bg-cyan-950/80 border border-cyan-500/30 rounded px-2 py-1 text-[9px] font-mono text-cyan-400 flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></span>
            <span>NTE DETECT: ROUTE ENGAGED</span>
          </div>
        </div>
      )}

      {/* Phase 2: Nanophotonic Activation Overlay */}
      {transitionState === "activation" && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden bg-gradient-to-tr from-cyan-glow/5 via-transparent to-violet-glow/5">
          {/* Holographic matrix activation lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-100"></div>
          
          <div className="absolute top-4 right-4 bg-cyan-950/80 border border-cyan-400/50 rounded px-2 py-1 text-[9px] font-mono text-cyan-400 flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
            <span>NTE ACTIVE: ENERGIZING CORES</span>
          </div>

          {/* Glowing quantum circuits sweep */}
          <div className="absolute top-0 left-[10%] w-[1px] h-full bg-gradient-to-b from-cyan-400 via-transparent to-transparent opacity-40 shadow-[0_0_8px_rgba(0,243,255,0.4)] animate-grid-scan"></div>
          <div className="absolute top-0 right-[15%] w-[1px] h-full bg-gradient-to-b from-violet-400 via-transparent to-transparent opacity-40 shadow-[0_0_8px_rgba(189,0,255,0.4)] animate-grid-scan" style={{ animationDelay: "100ms" }}></div>
        </div>
      )}

      {/* Phase 3: Nano Assembly / Dissolution Overlay */}
      {transitionState === "assembly" && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden bg-slate-950/30 backdrop-blur-[1px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.03),transparent_70%)]"></div>
          
          <div className="absolute top-4 right-4 bg-violet-950/80 border border-violet-400/50 rounded px-2 py-1 text-[9px] font-mono text-violet-400 flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <Cpu className="w-3 h-3 text-violet-400 animate-spin" />
            <span>NTE DISSOLVE: DISASSEMBLING SCENE</span>
          </div>

          {/* Floating disintegrating math elements */}
          <div className="absolute inset-0 flex flex-col justify-between p-12 opacity-30">
            <div className="flex justify-around">
              <span className="font-mono text-xs text-cyan-300/30 animate-float">{"Ψ(r, t) → ∑ c_n ψ_n(r) e^{-iE_nt/ℏ}"}</span>
              <span className="font-mono text-xs text-violet-300/30 animate-float" style={{ animationDelay: "1s" }}>{"[X̂, P̂] = iℏ"}</span>
            </div>
            <div className="flex justify-around">
              <span className="font-mono text-xs text-indigo-300/20 animate-float" style={{ animationDelay: "0.5s" }}>{"H_op Ψ = E Ψ"}</span>
              <span className="font-mono text-xs text-emerald-300/25 animate-float" style={{ animationDelay: "1.5s" }}>{"ρ = |Ψ|²"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Phase 4: Quantum Transition Overlay */}
      {transitionState === "transition" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden bg-slate-950/45 backdrop-blur-[3px]">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-glow/10 via-transparent to-violet-glow/10 animate-pulse"></div>
          
          <div className="absolute top-4 right-4 bg-cyan-950/80 border border-cyan-400/70 rounded px-2 py-1 text-[9px] font-mono text-cyan-400 flex items-center gap-1.5 shadow-[0_0_20px_rgba(6,182,212,0.5)] animate-bounce">
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-ping"></span>
            <span>NTE PORTAL: DIMENSIONAL WARP</span>
          </div>

          {/* Holographic scanning laser lines */}
          <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-cyan-glow to-transparent shadow-[0_0_20px_#00f3ff] absolute top-0 left-0 animate-grid-scan"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-60"></div>

          {/* Flying Equations rushing forward */}
          <div className="absolute top-[30%] left-[15%] text-cyan-glow/20 font-mono text-lg animate-pulse select-none">
            iℏ ∂/∂t |Ψ(t)⟩ = Ĥ |Ψ(t)⟩
          </div>
          <div className="absolute bottom-[25%] right-[15%] text-violet-glow/20 font-mono text-md animate-pulse select-none">
            Δx · Δp ≥ ℏ/2
          </div>

          {/* Quantum Portal Core Ring */}
          <div className="w-96 h-96 border-2 border-dashed border-cyan-glow/30 rounded-full animate-spin-slow flex items-center justify-center shadow-[0_0_30px_rgba(0,243,255,0.15)]">
            <div className="w-80 h-80 border border-dotted border-violet-glow/40 rounded-full flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-double border-cyan-glow/20 rounded-full flex items-center justify-center">
                <Atom className="w-24 h-24 text-cyan-glow/40 animate-spin" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phase 5: Nano Reconstruction Overlay */}
      {transitionState === "reconstruction" && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          {/* Bright blue swept light mask */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-glow/15 to-transparent transform -translate-y-full animate-light-sweep"></div>
          
          <div className="absolute top-4 right-4 bg-emerald-950/80 border border-emerald-400/50 rounded px-2 py-1 text-[9px] font-mono text-emerald-400 flex items-center gap-1.5 shadow-[0_0_15px_rgba(52,211,153,0.3)]">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
            <span>NTE RECONSTRUCT: ASSEMBLING SYSTEM</span>
          </div>

          {/* Crystallizing Endpoints (Left and Right Rails drawing lines) */}
          <div className="absolute left-6 top-10 bottom-10 w-[1px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-50 shadow-[0_0_8px_rgba(0,243,255,0.4)]"></div>
          <div className="absolute right-6 top-10 bottom-10 w-[1px] bg-gradient-to-b from-transparent via-violet-400 to-transparent opacity-50 shadow-[0_0_8px_rgba(189,0,255,0.4)]"></div>
        </div>
      )}

      {/* Phase 6: Environmental Synchronization Overlay */}
      {transitionState === "sync" && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden bg-cyan-500/[0.02] backdrop-blur-[0.2px]">
          <div className="absolute top-4 right-4 bg-cyan-950/80 border border-cyan-400/60 rounded px-2 py-1 text-[9px] font-mono text-cyan-400 flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] animate-pulse">
            <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
            <span>NTE SYNC: METRICS COHERENT</span>
          </div>
          
          {/* Synchronized flash ripple ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full max-w-4xl max-h-4xl border border-cyan-500/10 rounded-full animate-ping"></div>
          </div>
        </div>
      )}

      {/* Human Lab Footer */}
      <footer className="border-t border-white/5 py-6 px-6 bg-slate-950/40 text-center text-[10px] font-mono text-slate-500">
        <div>SAMMIUM QUANTUMVERSE LABORATORY CONSOLE SYSTEM</div>
        <div className="mt-1">PRECISION PHYSICS INTERACTIVE EDUCATION METRICS</div>
      </footer>
    </div>
  );
}
