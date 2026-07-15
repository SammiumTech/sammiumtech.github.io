import React, { useState, useEffect } from "react";
import { 
  Award, 
  Sparkles, 
  Sliders, 
  Play, 
  RotateCcw, 
  TrendingUp, 
  Shield, 
  Zap, 
  Cpu, 
  Brain, 
  Wrench, 
  Flame, 
  ChevronRight, 
  Terminal, 
  AlertCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { sounds } from "../utils/sounds";

interface ResearchRankingsProps {
  isRgbOverdrive: boolean;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  status: "Dr. Sammium" | "Ally Node" | "Rival System" | "You";
  title: string;
}

export const ResearchRankings: React.FC<ResearchRankingsProps> = ({ isRgbOverdrive }) => {
  // Primary requested stats - set as local state so they are dynamic and interactive!
  const [aiInnovation, setAiInnovation] = useState(92);
  const [prototypeLevel, setPrototypeLevel] = useState(78);
  const [researchProgress, setResearchProgress] = useState(85);

  // Active game-like mechanics
  const [clickerScore, setClickerScore] = useState(0);
  const [selectedMinigame, setSelectedMinigame] = useState<"ai" | "prototype" | "research">("ai");
  const [experience, setExperience] = useState(17420);
  const [showRanksResetAlert, setShowRanksResetAlert] = useState(false);
  
  // Dr. Sammium AI appraisal states
  const [appraisalText, setAppraisalText] = useState("");
  const [isGeneratingAppraisal, setIsGeneratingAppraisal] = useState(false);
  const [appraisalHistory, setAppraisalHistory] = useState<string>("");

  // Grid for cellular game-like defragger
  const [defragGrid, setDefragGrid] = useState<boolean[]>(
    Array.from({ length: 16 }, () => Math.random() > 0.5)
  );

  // Calibrate current weighted overall score
  const overallScore = Math.round((aiInnovation + prototypeLevel + researchProgress) / 3);

  // Leaderboard lists
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, name: "Dr. Sammium Core", avatar: "🧬", score: 98.8, status: "Dr. Sammium", title: "AURA GRAND ARCHITECT" },
    { rank: 2, name: "SAMMIUM RESEARCH LAB (User-Node)", avatar: "⚡", score: 85.0, status: "You", title: "CHRONOS OUTPOST OPERATOR" },
    { rank: 3, name: "NanoGamer-99 Net", avatar: "👾", score: 82.1, status: "Ally Node", title: "CYBER SWARM TACTICIAN" },
    { rank: 4, name: "AstroCoder-Alpha", avatar: "🛸", score: 76.5, status: "Ally Node", title: "STELLAR COMPILER" },
    { rank: 5, name: "Glitch-Sentinel-Retro", avatar: "🎮", score: 69.9, status: "Rival System", title: "FRAGMENTED ENCODER" }
  ]);

  // Keep leaderboard synced with dynamic overall score
  useEffect(() => {
    setLeaderboard(prev => {
      const updated = prev.map(entry => {
        if (entry.status === "You") {
          return { ...entry, score: parseFloat(overallScore.toFixed(1)) };
        }
        return entry;
      });
      // Sort descending by score
      const sorted = [...updated].sort((a, b) => b.score - a.score);
      return sorted.map((entry, index) => ({ ...entry, rank: index + 1 }));
    });
  }, [overallScore]);

  // Handle Training clicks to raise subscores
  const boostStat = (stat: "ai" | "prototype" | "research") => {
    sounds.playLaser();
    setExperience(prev => prev + 185);

    if (stat === "ai") {
      setAiInnovation(prev => Math.min(100, prev + 1));
      setClickerScore(prev => prev + 1);
    } else if (stat === "prototype") {
      setPrototypeLevel(prev => Math.min(100, prev + 1));
      setClickerScore(prev => prev + 1);
    } else {
      setResearchProgress(prev => Math.min(100, prev + 1));
      setClickerScore(prev => prev + 1);
    }
  };

  // Cell Defrag action
  const toggleDefragCell = (index: number) => {
    sounds.playClick();
    const updated = [...defragGrid];
    updated[index] = !updated[index];
    setDefragGrid(updated);
    
    // If all clean (false) or randomized, boost research progress!
    const activeCorrupted = updated.filter(c => c).length;
    if (activeCorrupted === 0) {
      sounds.playOverdrive();
      setResearchProgress(prev => Math.min(100, prev + 3));
      setExperience(prev => prev + 500);
      // Reset
      setDefragGrid(Array.from({ length: 16 }, () => Math.random() > 0.6));
    } else {
      setResearchProgress(prev => Math.min(100, prev + 0.4));
    }
  };

  // Reset metrics
  const handleResetRankings = () => {
    sounds.playClick();
    setAiInnovation(92);
    setPrototypeLevel(78);
    setResearchProgress(85);
    setClickerScore(0);
    setExperience(17420);
    setShowRanksResetAlert(false);
  };

  // Generate customized performance appraisal using server-side Gemini client
  const fetchDrSammiumAppraisal = async () => {
    sounds.playClick();
    setIsGeneratingAppraisal(true);
    setAppraisalText("");

    try {
      const res = await fetch("/api/rankings/appraisal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          aiInnovation,
          prototypeLevel,
          researchProgress,
          overallScore,
          clickerScore,
          experienceLevel: Math.floor(experience / 2500)
        })
      });

      const data = await res.json();
      if (res.ok && data.text) {
        sounds.playLaser();
        setAppraisalText(data.text);
        setAppraisalHistory(data.text);
      } else {
        throw new Error(data.error || "Failed to contact Dr. Sammium's appraisal node.");
      }
    } catch (err: any) {
      sounds.playError();
      setAppraisalText(`🚨 APPRAISAL LINK_ERROR: Core connection failed. ${err.message || "Ensure key is configured."}`);
    } finally {
      setIsGeneratingAppraisal(false);
    }
  };

  // Format experience levels
  const currentLevel = Math.floor(experience / 2500);
  const nextLevelXp = (currentLevel + 1) * 2500;
  const currentLevelXp = currentLevel * 2500;
  const xpPercentage = Math.min(100, Math.max(0, ((experience - currentLevelXp) / 2500) * 100));

  return (
    <div id="sammium-research-rankings-panel" className="flex flex-col gap-6">
      
      {/* Immersive HUD Status Banner */}
      <div className={`p-5 rounded-2xl border bg-slate-900/90 shadow-2xl relative overflow-hidden transition-all duration-300 ${
        isRgbOverdrive ? "border-pink-500/50 shadow-[0_0_15px_rgba(244,63,94,0.15)]" : "border-slate-800"
      }`}>
        <div className="absolute inset-0 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />
        
        {/* Neon top line marker */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          {/* Main big HUD display for score */}
          <div className="flex items-center gap-5">
            <div className="relative flex items-center justify-center shrink-0">
              {/* Outer spinning neon circle */}
              <div className={`absolute w-24 h-24 rounded-full border-2 border-dashed animate-spin-slow ${
                isRgbOverdrive ? "border-pink-400/40" : "border-cyan-400/30"
              }`} />
              {/* Inner score circular plate */}
              <div className="w-20 h-20 rounded-full bg-slate-950 border border-slate-800 flex flex-col items-center justify-center shadow-inner">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest leading-none">SCORE</span>
                <span className={`text-3xl font-mono font-bold tracking-tighter ${
                  isRgbOverdrive ? "text-pink-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" : "text-cyan-400"
                }`}>
                  {overallScore}%
                </span>
                <span className="text-[7px] font-mono text-emerald-400 tracking-wider">S-TIER</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-5 h-5 text-pink-400 animate-pulse" />
                <h2 className="text-lg font-mono font-bold tracking-tight text-white uppercase">
                  SAMMIUM LAB SCOREBOARD
                </h2>
              </div>
              <p className="text-xs font-mono text-slate-400 max-w-lg">
                Your experimental activities, AI neural trainings, and sandboxed prototypes have been indexed by Dr. Sammium's global telemetry meshes.
              </p>
            </div>
          </div>

          {/* XP & Level Status Gauge */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-850 w-full md:w-72 flex flex-col gap-2 shrink-0">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-400 uppercase font-bold">RANK STATUS</span>
              <span className="text-cyan-400 font-bold">LEVEL {currentLevel} SCIENTIST</span>
            </div>

            {/* XP ProgressBar */}
            <div className="w-full h-2.5 rounded bg-slate-900 border border-slate-800 overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-pink-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
              <span>{experience.toLocaleString()} XP TOTAL</span>
              <span>{Math.round(xpPercentage)}% TO NEXT RANK</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Scoring Grid & interactive trainer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Column 1: Core HUD Rankings Display (The explicit requested metrics) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/95 shadow-lg relative flex flex-col gap-4">
            
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5 border-b border-slate-800/80 pb-2.5">
              <Sliders className="w-4 h-4 text-cyan-400" /> [ EXPERIMENTAL_METRICS ]
            </h3>

            {/* AI INNOVATION HUD COMPONENT */}
            <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-slate-950 border border-slate-900">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-cyan-400" />
                  AI INNOVATION
                </span>
                <span className="text-cyan-400 font-bold drop-shadow-[0_0_5px_rgba(34,211,238,0.4)]">{aiInnovation}%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded overflow-hidden">
                <div 
                  className="h-full bg-cyan-400 transition-all duration-300"
                  style={{ width: `${aiInnovation}%` }}
                />
              </div>
              <span className="text-[9px] font-mono text-slate-500">
                Measures neural parameters, Gemini prompt depth, and cognitive models.
              </span>
            </div>

            {/* PROTOTYPE LEVEL HUD COMPONENT */}
            <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-slate-950 border border-slate-900">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-pink-400" />
                  PROTOTYPE LEVEL
                </span>
                <span className="text-pink-400 font-bold drop-shadow-[0_0_5px_rgba(244,63,94,0.4)]">{prototypeLevel}%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded overflow-hidden">
                <div 
                  className="h-full bg-pink-500 transition-all duration-300"
                  style={{ width: `${prototypeLevel}%` }}
                />
              </div>
              <span className="text-[9px] font-mono text-slate-500">
                Reflects mechanical calibrations, active sandbox drafts, and kinetic hardware.
              </span>
            </div>

            {/* RESEARCH PROGRESS HUD COMPONENT */}
            <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-slate-950 border border-slate-900">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  RESEARCH PROGRESS
                </span>
                <span className="text-emerald-400 font-bold drop-shadow-[0_0_5px_rgba(52,211,153,0.4)]">{researchProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-300"
                  style={{ width: `${researchProgress}%` }}
                />
              </div>
              <span className="text-[9px] font-mono text-slate-500">
                Quantifies cellular iterations, timeline completions, and database votes.
              </span>
            </div>

            {/* Mini Game / Optimization selector tabs */}
            <div className="mt-2 flex flex-col gap-2">
              <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">TACTICAL CALIBRATION UNITS</span>
              <div className="grid grid-cols-3 gap-1">
                {(["ai", "prototype", "research"] as const).map((game) => (
                  <button
                    key={game}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedMinigame(game);
                    }}
                    className={`py-1.5 px-1.5 rounded border text-[10px] font-mono font-bold uppercase transition-all ${
                      selectedMinigame === game
                        ? "bg-slate-950 border-pink-500 text-pink-400"
                        : "bg-slate-950/40 border-slate-850 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {game === "ai" ? "🧠 AI Neural" : game === "prototype" ? "⚙️ Mech Fit" : "🧬 Core Data"}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Quick HUD Score Calibrator clicker minigame based on chosen tab */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/95 shadow-lg relative flex flex-col gap-3">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-pink-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-yellow-400 animate-bounce" /> [ STIMULATE_CORE_HARMONICS ]
            </h4>

            {selectedMinigame === "ai" && (
              <div className="flex flex-col gap-3 text-center">
                <p className="text-[10px] font-mono text-slate-400 leading-relaxed">
                  Calibrate AI model synapses by sending magnetic light bursts into the matrix. Boosts AI Innovation.
                </p>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 flex flex-col items-center justify-center gap-3">
                  <div className="text-3xl font-mono text-cyan-400 animate-pulse font-bold">
                    {clickerScore} Syncs
                  </div>
                  <button
                    onClick={() => boostStat("ai")}
                    className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-mono font-bold text-xs shadow-lg transition-all active:scale-95 cursor-pointer"
                  >
                    🔥 TRIGGER SYNAPSE BURST (+1%)
                  </button>
                </div>
              </div>
            )}

            {selectedMinigame === "prototype" && (
              <div className="flex flex-col gap-3 text-center">
                <p className="text-[10px] font-mono text-slate-400 leading-relaxed">
                  Tension physical servo-joints and align electro-magnetic brackets in real-time. Boosts Prototype Level.
                </p>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 flex flex-col items-center justify-center gap-3">
                  <div className="text-3xl font-mono text-pink-400 animate-pulse font-bold">
                    {clickerScore} Torque
                  </div>
                  <button
                    onClick={() => boostStat("prototype")}
                    className="px-5 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-slate-100 font-mono font-bold text-xs shadow-lg transition-all active:scale-95 cursor-pointer"
                  >
                    ⚙️ ADJUST SERVO PRESSURE (+1%)
                  </button>
                </div>
              </div>
            )}

            {selectedMinigame === "research" && (
              <div className="flex flex-col gap-3">
                <p className="text-[10px] font-mono text-slate-400 text-center leading-relaxed">
                  Click on defragmented red matrix nodes to clean galactic arrays! Clean the entire grid to unlock massive research boosts!
                </p>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex flex-col items-center justify-center gap-3">
                  <div className="grid grid-cols-4 gap-1.5 w-full max-w-[180px]">
                    {defragGrid.map((isActive, index) => (
                      <button
                        key={index}
                        onClick={() => toggleDefragCell(index)}
                        className={`w-8 h-8 rounded border transition-all cursor-pointer ${
                          isActive
                            ? "bg-rose-500/20 border-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.4)] animate-pulse"
                            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase">
                    Active anomalies: {defragGrid.filter(c => c).length}
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Column 2: Leaderboard rankings (Gamer Vibe) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/95 shadow-lg relative flex-1 flex flex-col gap-4">
            
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-pink-400 flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-pink-400" /> [ LEADERBOARD_RANKINGS ]
              </span>
              <span className="px-1.5 py-0.5 rounded bg-pink-500/10 text-[8px] border border-pink-500/20 text-pink-400 font-mono">
                REGIONAL-GALAXY
              </span>
            </h3>

            {/* List entries */}
            <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto pr-1">
              {leaderboard.map((user) => {
                const isUser = user.status === "You";
                const isSammium = user.status === "Dr. Sammium";
                return (
                  <div 
                    key={user.name}
                    className={`p-3 rounded-lg border transition-all duration-300 flex items-center justify-between gap-3 ${
                      isUser
                        ? "bg-pink-500/10 border-pink-500/40 shadow-[0_0_10px_rgba(244,63,94,0.1)]"
                        : isSammium
                          ? "bg-cyan-500/5 border-cyan-500/20"
                          : "bg-slate-950/80 border-slate-850"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank Indicator Badge */}
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                        user.rank === 1 
                          ? "bg-yellow-500 text-slate-950" 
                          : user.rank === 2 
                            ? "bg-slate-300 text-slate-900" 
                            : user.rank === 3 
                              ? "bg-amber-700 text-slate-100" 
                              : "bg-slate-850 text-slate-400"
                      }`}>
                        {user.rank}
                      </span>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{user.avatar}</span>
                          <span className={`text-xs font-mono font-bold ${
                            isUser ? "text-pink-400" : isSammium ? "text-cyan-400" : "text-slate-200"
                          }`}>
                            {user.name}
                          </span>
                        </div>
                        <span className="text-[8px] font-mono text-slate-500 tracking-wider">
                          {user.title}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-sm font-mono font-bold ${
                        isUser ? "text-pink-400" : isSammium ? "text-cyan-400" : "text-slate-300"
                      }`}>
                        {user.score.toFixed(1)}%
                      </span>
                      <div className="text-[7px] font-mono text-slate-500 uppercase tracking-widest">
                        SCORE
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Quick Actions at Bottom of rankings */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
              <button
                onClick={() => setShowRanksResetAlert(true)}
                className="text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Stats
              </button>
              <span className="text-slate-600">AUTO-SYNC IN 2.4S</span>
            </div>

          </div>
        </div>

        {/* Column 3: Dr. Sammium Appraisal Core (AI-powered dynamic performance review) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/95 shadow-lg relative flex-1 flex flex-col gap-3">
            
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5 border-b border-slate-800/80 pb-2.5">
              <Brain className="w-4 h-4 text-emerald-400" /> [ DR_SAMMIUM_APPRAISAL_NODE ]
            </h3>

            <p className="text-[10px] font-mono text-slate-400 leading-relaxed">
              Initiate a high-performance evaluation from Dr. Sammium. The AI core analyzes your dynamic score parameters and returns high-vibe advice on reaching level completion!
            </p>

            {/* Appraisal Terminal Display screen */}
            <div className="bg-slate-950 rounded-lg p-3.5 border border-slate-850 font-mono text-xs text-slate-300 flex-1 flex flex-col min-h-[220px] max-h-[350px] overflow-y-auto relative">
              <div className="absolute top-2 right-2 text-[8px] text-slate-600">
                LINK: ENCRYPTED_AURA
              </div>

              {appraisalText ? (
                <div className="flex-1 flex flex-col gap-2 leading-relaxed">
                  <div className="text-[10px] text-pink-400 font-bold">
                    DR. SAMMIUM APPRAISAL RESULT //:
                  </div>
                  <div className="text-xs text-slate-300 whitespace-pre-wrap">
                    {appraisalText}
                  </div>
                </div>
              ) : isGeneratingAppraisal ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-8">
                  <div className="w-8 h-8 rounded-full border-2 border-t-pink-500 border-r-cyan-500 animate-spin" />
                  <span className="text-[10px] text-pink-400 uppercase tracking-widest animate-pulse">
                    Analyzing Quantum Scores...
                  </span>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 py-12 gap-2">
                  <Terminal className="w-8 h-8 text-slate-600 animate-pulse" />
                  <span className="text-[10px] uppercase tracking-wider font-bold">
                    Appraisal Core Idle
                  </span>
                  <span className="text-[9px] text-slate-600 max-w-[180px]">
                    Click generate below to evaluate your current score stats.
                  </span>
                </div>
              )}
            </div>

            {/* Appraisal Generate buttons */}
            <button
              onClick={fetchDrSammiumAppraisal}
              disabled={isGeneratingAppraisal}
              className={`py-2.5 px-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isGeneratingAppraisal
                  ? "bg-slate-850 border border-slate-800 text-slate-500"
                  : "bg-emerald-500 text-slate-950 hover:bg-emerald-600 shadow-[0_0_12px_rgba(52,211,153,0.3)] hover:shadow-[0_0_15px_rgba(52,211,153,0.5)]"
              }`}
            >
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              {isGeneratingAppraisal ? "COMPUTING EVALUATION..." : "SOLICIT PERFORMANCE APPRAISAL"}
            </button>

          </div>
        </div>

      </div>

      {/* Reset confirmation modal */}
      <AnimatePresence>
        {showRanksResetAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-red-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <div className="flex items-center gap-3 text-red-400 mb-3">
                <AlertCircle className="w-6 h-6" />
                <h4 className="font-mono font-bold uppercase tracking-tight">
                  RESET EXPERIMENT SCORES?
                </h4>
              </div>
              <p className="text-xs font-mono text-slate-400 leading-relaxed mb-6">
                Are you sure you want to reset your interactive scoreboard stats? This will restore the requested default baseline ratings (AI Innovation: 92%, Prototype Level: 78%, Research Progress: 85%) and reset your gamer experience levels.
              </p>
              <div className="flex items-center justify-end gap-3 font-mono text-xs">
                <button
                  onClick={() => setShowRanksResetAlert(false)}
                  className="px-4 py-2 rounded bg-slate-950 border border-slate-850 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleResetRankings}
                  className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white font-bold cursor-pointer"
                >
                  YES, RESET STATS
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
