import React from "react";
import { Lightbulb, Search, Sparkles, Palette, Layers, RefreshCw, Trophy, ArrowRight } from "lucide-react";

export default function DesignProcess() {
  const steps = [
    {
      id: "01",
      title: "Idea",
      icon: <Lightbulb className="w-5 h-5 text-yellow-400" />,
      description: "Deconstructing localized real-world crises, user frictions, and scientific queries.",
      accent: "from-yellow-500/20 to-transparent",
      borderColor: "group-hover:border-yellow-500/50"
    },
    {
      id: "02",
      title: "Research",
      icon: <Search className="w-5 h-5 text-cyan-400" />,
      description: "Analyzing technical physics constraints, regional telemetry ranges, and model prompts.",
      accent: "from-cyan-500/20 to-transparent",
      borderColor: "group-hover:border-cyan-500/50"
    },
    {
      id: "03",
      title: "AI Studio",
      icon: <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />,
      description: "Fine-tuning Gemini model logic parameters and structuring system orchestration rules.",
      accent: "from-emerald-500/20 to-transparent",
      borderColor: "group-hover:border-emerald-500/50"
    },
    {
      id: "04",
      title: "Interface Design",
      icon: <Palette className="w-5 h-5 text-purple-400" />,
      description: "Developing high-fidelity, high-contrast layouts, grids, and typography pairs in Figma.",
      accent: "from-purple-500/20 to-transparent",
      borderColor: "group-hover:border-purple-500/50"
    },
    {
      id: "05",
      title: "Prototype",
      icon: <Layers className="w-5 h-5 text-blue-400" />,
      description: "Implementing fluid client-side sandboxes, reactive mathematical canvases, and simulation nodes.",
      accent: "from-blue-500/20 to-transparent",
      borderColor: "group-hover:border-blue-500/50"
    },
    {
      id: "06",
      title: "Iteration",
      icon: <RefreshCw className="w-5 h-5 text-pink-400 animate-spin" style={{ animationDuration: "12s" }} />,
      description: "Optimizing 3D rendering framerates and calibrating active sensor thresholds under live tests.",
      accent: "from-pink-500/20 to-transparent",
      borderColor: "group-hover:border-pink-500/50"
    },
    {
      id: "07",
      title: "Final Experience",
      icon: <Trophy className="w-5 h-5 text-orange-400" />,
      description: "Deploying high-performance web spaces with live-synthesized audio environments.",
      accent: "from-orange-500/20 to-transparent",
      borderColor: "group-hover:border-orange-500/50"
    }
  ];

  return (
    <section id="design-process" className="py-24 bg-slate-950 border-t border-slate-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Title */}
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[10px] tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "6s" }} />
            ENGINEERING WORKFLOW
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            How I Work: My Design Process
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm font-sans leading-relaxed">
            Many portfolios only show the end product. I believe in demonstrating how structured design principles translate wild concepts into reliable, production-grade tools.
          </p>
        </div>

        {/* Stepper Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl border border-slate-850/80 bg-slate-900/10 hover:bg-slate-900/40 p-5 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl"
            >
              {/* Radial background ambient gradient */}
              <div className={`absolute inset-0 bg-gradient-to-b ${step.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

              {/* Step number identifier badge */}
              <div className="flex items-center justify-between z-10">
                <span className="text-[10px] font-mono font-extrabold text-slate-500 group-hover:text-slate-300 transition-colors">
                  PHASE {step.id}
                </span>
                <span className="p-1.5 rounded-lg bg-slate-950 border border-slate-850/60 shadow-inner group-hover:scale-110 transition-transform">
                  {step.icon}
                </span>
              </div>

              {/* Text copy */}
              <div className="space-y-2.5 mt-8 z-10">
                <h4 className="font-display text-sm font-bold text-white tracking-wide group-hover:text-blue-300 transition-colors">
                  {step.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans group-hover:text-slate-300 transition-colors">
                  {step.description}
                </p>
              </div>

              {/* Grid separator arrow on large screens (drawn as absolute element to connect card right edges) */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-2 transform -translate-y-1/2 z-20 bg-slate-950 border border-slate-850 text-slate-500 rounded-full p-0.5 shadow-md">
                  <ArrowRight className="w-3 h-3 text-slate-400 animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
