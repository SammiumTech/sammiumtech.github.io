import React from "react";
import { GitCommit, Star, Rocket, Cpu, Calendar, Shield, Sprout, ArrowDown } from "lucide-react";

export default function VisualTimeline() {
  const events = [
    {
      year: "2025",
      title: "Started Experimenting with AI Interfaces",
      subtitle: "First Ventures into Prompt Space",
      description: "Began deconstructing large language models and linking local frontend canvas components (using React and early Web Audio synthesizers) to demonstrate complex scientific concepts.",
      icon: <GitCommit className="w-5 h-5 text-purple-400" />,
      color: "border-purple-500/30 text-purple-400",
      bg: "bg-purple-500/5",
    },
    {
      year: "2026",
      title: "Founded Sammium Tech",
      subtitle: "Autonomous Research & Creative Lab",
      description: "Established an experimental engineering studio to research the frontier of human-AI software interactions. Shifting standard résumés into deeply interactive, high-fidelity products.",
      icon: <Rocket className="w-5 h-5 text-emerald-400 animate-pulse" />,
      color: "border-emerald-500/30 text-emerald-400",
      bg: "bg-emerald-500/5",
    },
    {
      year: "2026",
      title: "Project Infinity",
      subtitle: "The Master Architecture",
      description: "The parent concept unifying Sam Lopez's creative portfolio. Building customized interactive portals and fully sandboxed models to make computing feel alive.",
      icon: <Star className="w-5 h-5 text-yellow-400" />,
      color: "border-yellow-500/30 text-yellow-400",
      bg: "bg-yellow-500/5",
    },
    {
      year: "2026",
      title: "Quantum Universe Core",
      subtitle: "Scientific Visualization",
      description: "Engineered an infinite procedural 3D visualizer simulating neural networks, quantum vectors, and wave operations. Complete with a live sub-bass synthesizer.",
      icon: <Cpu className="w-5 h-5 text-blue-400" />,
      color: "border-blue-500/30 text-blue-400",
      bg: "bg-blue-500/5",
    },
    {
      year: "2026",
      title: "Sentinel Research Dashboard",
      subtitle: "Disaster Response Framework",
      description: "Engineered high-contrast warning maps and automated response plans powered by Gemini 3.5 Flash to safeguard floodplains in Botolan, Zambales.",
      icon: <Shield className="w-5 h-5 text-red-400" />,
      color: "border-red-500/30 text-red-400",
      bg: "bg-red-500/5",
    },
    {
      year: "2026",
      title: "AI Agriculture (FarmAI)",
      subtitle: "Intelligent Farming Platform",
      description: "Constructed an agrotech co-pilot processing regional climate telemetry and advising Central Luzon farming teams with live agronomic prescriptions.",
      icon: <Sprout className="w-5 h-5 text-emerald-400" />,
      color: "border-emerald-500/30 text-emerald-400",
      bg: "bg-emerald-500/5",
    }
  ];

  return (
    <section id="timeline" className="py-24 bg-slate-950 border-t border-slate-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Section Title */}
        <div className="space-y-2 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-[10px] tracking-widest uppercase">
            <Calendar className="w-3.5 h-3.5" />
            CHRONOLOGICAL MILESTONES
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Journey Timeline: Progression & Output
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm font-sans leading-relaxed">
            Trace the steps behind Sam's evolution from writing early interactive code components to scaling fully realized AI architectures.
          </p>
        </div>

        {/* Timeline Path Flow */}
        <div className="relative border-l border-slate-800 ml-4 sm:ml-8 space-y-10 py-4">
          {events.map((event, idx) => (
            <div key={idx} className="relative pl-8 sm:pl-12 group">
              {/* Timeline Bullet Anchor */}
              <div className={`absolute -left-5 top-1.5 flex items-center justify-center w-10 h-10 rounded-full border bg-slate-950 shadow-xl transition-all duration-300 group-hover:scale-115 ${event.color}`}>
                {event.icon}
              </div>

              {/* Connecting arrow indicators */}
              {idx < events.length - 1 && (
                <div className="absolute -left-2.5 top-12 flex flex-col items-center justify-center pointer-events-none opacity-40">
                  <ArrowDown className="w-5 h-5 text-slate-700 animate-bounce" style={{ animationDuration: "3s" }} />
                </div>
              )}

              {/* Event Content Card */}
              <div className={`p-6 rounded-2xl border border-slate-850/80 hover:border-slate-750 transition-all duration-300 space-y-2.5 relative overflow-hidden group shadow-lg ${event.bg}`}>
                {/* Visual Glow Layer */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/20 to-transparent pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-850 pb-2">
                  <div>
                    <h3 className="font-display text-base font-bold text-white tracking-wide group-hover:text-blue-300 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono tracking-wide">
                      {event.subtitle}
                    </p>
                  </div>
                  <span className="self-start sm:self-center font-mono text-xs font-bold px-3 py-1 bg-slate-950 border border-slate-850 text-slate-300 rounded-lg shadow-inner">
                    {event.year}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans font-normal">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
