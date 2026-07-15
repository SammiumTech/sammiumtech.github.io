import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Activity, Cpu, Database, Network, X, Minimize2, CheckCircle2, ChevronDown } from "lucide-react";
import { sounds } from "../utils/sounds";

interface SystemStatusProps {
  operatorName: string;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ operatorName }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<"diagnostics" | "cores">("diagnostics");

  // Play status sound when it slides down
  useEffect(() => {
    // Add a slight delay to trigger after entering
    const timer = setTimeout(() => {
      sounds.playClick();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="system-status-container"
          initial={{ y: -100, x: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, x: 0, opacity: 1, scale: 1 }}
          exit={{ y: -50, x: 50, opacity: 0, scale: 0.9 }}
          transition={{ 
            type: "spring",
            stiffness: 110,
            damping: 18,
            delay: 0.8 // Trigger right as the app fades in
          }}
          className="fixed top-4 right-4 z-40 w-80 font-mono"
        >
          {/* SAO Style Floating Diagnostic Card */}
          <div className="relative overflow-hidden bg-slate-900/95 backdrop-blur-md rounded-2xl border border-cyan-500/30 shadow-[0_10px_35px_rgba(6,182,212,0.15)] flex flex-col">
            
            {/* Header top neon strip */}
            <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-pink-500 to-cyan-500" />
            
            {/* Top Bar Info */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950/60 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">
                  SENTINEL STATUS // HUD
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsVisible(false);
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-all cursor-pointer"
                  title="Dismiss Status Interface"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Summary Banner */}
            <div className="p-4 bg-slate-950/40 border-b border-slate-850 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[8px] text-slate-500 uppercase tracking-widest leading-none">
                  SECURE DEPLOYMENT
                </div>
                <div className="text-xs font-bold text-white truncate uppercase">
                  {operatorName || "Research_Operator"} // ACTIVE
                </div>
                <div className="text-[9px] text-emerald-400 flex items-center gap-1 mt-0.5 font-bold uppercase">
                  <CheckCircle2 className="w-2.5 h-2.5" /> GIS Link Active
                </div>
              </div>
            </div>

            {/* Toggle tabs */}
            <div className="grid grid-cols-2 text-[9px] border-b border-slate-850">
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab("diagnostics");
                }}
                className={`py-2 text-center border-r border-slate-850 transition-colors cursor-pointer ${
                  activeTab === "diagnostics" 
                    ? "text-cyan-400 bg-slate-950/60 font-bold" 
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                DIAGNOSTICS
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab("cores");
                }}
                className={`py-2 text-center transition-colors cursor-pointer ${
                  activeTab === "cores" 
                    ? "text-pink-400 bg-slate-950/60 font-bold" 
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                CORE SYSTEM
              </button>
            </div>

            {/* Tab content */}
            <div className="p-4 flex flex-col gap-3 max-h-64 overflow-y-auto">
              {activeTab === "diagnostics" ? (
                <>
                  {/* Neural Link */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[9px]">
                      <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Activity className="w-3 h-3 text-cyan-400" /> GIS Satellite Link
                      </span>
                      <span className="text-emerald-400 font-bold uppercase">STABLE</span>
                    </div>
                    <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 w-full rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                    </div>
                  </div>

                  {/* Data Uplink */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[9px]">
                      <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Database className="w-3 h-3 text-pink-400" /> Data Uplink
                      </span>
                      <span className="text-pink-400 font-bold">100%</span>
                    </div>
                    <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-pink-500 w-full rounded-full shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                    </div>
                  </div>

                  {/* Cores */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[9px]">
                      <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Cpu className="w-3 h-3 text-purple-400" /> Cores Optimization
                      </span>
                      <span className="text-purple-400 font-bold uppercase">OPTIMIZED</span>
                    </div>
                    <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 w-full rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2 text-[10px] text-slate-400">
                  <div className="flex justify-between items-center py-1 border-b border-slate-850/50">
                    <span className="text-slate-500 uppercase">Gateway Core</span>
                    <span className="text-slate-300">Sentinel OS v6.0</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-850/50">
                    <span className="text-slate-500 uppercase">Local Address</span>
                    <span className="text-cyan-400 font-bold">Port 3000</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-850/50">
                    <span className="text-slate-500 uppercase">AI Processor</span>
                    <span className="text-slate-300">Sammium AI Core</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500 uppercase">Congestion Rate</span>
                    <span className="text-emerald-400 font-bold">0.02%</span>
                  </div>
                </div>
              )}
            </div>

            {/* Diagnostics footer info */}
            <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-850 flex items-center justify-between text-[8px] text-slate-500">
              <span className="uppercase">Quantum Link Matrix</span>
              <span className="uppercase text-[7px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/20">
                SECURE
              </span>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
