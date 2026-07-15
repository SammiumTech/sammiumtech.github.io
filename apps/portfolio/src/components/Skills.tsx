import React, { useState } from "react";
import { Terminal, Code, Database, Layout, Settings, Sparkles, Server } from "lucide-react";

export default function Skills() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const skillsData = [
    {
      category: "Programming & Foundations",
      icon: <Terminal className="w-4.5 h-4.5 text-blue-400" />,
      items: [
        { name: "HTML5", level: "Expert", desc: "Semantic markup and strict accessibility" },
        { name: "CSS3", level: "Expert", desc: "Custom layouts, responsive queries, keyframe physics" },
        { name: "JavaScript", level: "Advanced", desc: "Asynchronous architectures, event queues, ESM modules" },
        { name: "SQL", level: "Intermediate", desc: "Data modeling, table relationships, query indexing" }
      ]
    },
    {
      category: "Frontend Development",
      icon: <Code className="w-4.5 h-4.5 text-emerald-400" />,
      items: [
        { name: "React", level: "Advanced", desc: "Hooks, custom hooks, state synchronization, component lifecycles" },
        { name: "Tailwind CSS", level: "Expert", desc: "Utility-first design, mobile-first responsive grids, dark overrides" },
        { name: "Vite", level: "Advanced", desc: "Asset bundling, plugin setup, environment bindings, proxy servers" }
      ]
    },
    {
      category: "Backend & Systems",
      icon: <Server className="w-4.5 h-4.5 text-purple-400" />,
      items: [
        { name: "Node.js", level: "Intermediate", desc: "Async task loops, server-side modules, process managers" },
        { name: "Express.js", level: "Advanced", desc: "RESTful routes, router split engines, middleware chains, static proxy setup" },
        { name: "REST APIs", level: "Advanced", desc: "JSON payloads, authorization guards, CORS configurations" }
      ]
    },
    {
      category: "Databases & Engines",
      icon: <Database className="w-4.5 h-4.5 text-yellow-400" />,
      items: [
        { name: "PostgreSQL", level: "Intermediate", desc: "Relational constraints, joins, transaction handling" },
        { name: "MySQL", level: "Intermediate", desc: "Table layouts, primary keys, simple data queries" }
      ]
    },
    {
      category: "UI/UX & Product Design",
      icon: <Layout className="w-4.5 h-4.5 text-pink-400" />,
      items: [
        { name: "Figma", level: "Advanced", desc: "Component variants, auto-layouts, high-fidelity mockups" },
        { name: "UI/UX", level: "Advanced", desc: "Aesthetic color systems, structural grids, touch targets" },
        { name: "Canva", level: "Advanced", desc: "Graphic assets, visual marketing resources, logos" }
      ]
    },
    {
      category: "Modern Tools & AI Integrations",
      icon: <Sparkles className="w-4.5 h-4.5 text-indigo-400" />,
      items: [
        { name: "Git", level: "Advanced", desc: "Branching workflows, merge conflict resolutions, status tracking" },
        { name: "GitHub", level: "Advanced", desc: "Repositories, project tracking boards, version control" },
        { name: "Prompt Engineering", level: "Advanced", desc: "System directives, few-shot prompting, JSON schema outputs" },
        { name: "AI Studio", level: "Advanced", desc: "Gemini 3.5 integrations, server-side prompts, developer telemetry" }
      ]
    }
  ];

  return (
    <section id="skills" className="py-24 bg-slate-950 border-t border-slate-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Title */}
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[10px] tracking-widest uppercase">
            <Settings className="w-3.5 h-3.5" />
            ENGINEERING WORKSPACE
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Technical Stack & Ecosystem
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm font-sans leading-relaxed">
            A comprehensive blueprint of languages, tools, frameworks, and AI workflows that I actively utilize to build solutions.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillsData.map((categoryGroup, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-slate-900/30 border border-slate-850/80 space-y-4 hover:border-slate-800 transition duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-900 shrink-0">
                    {categoryGroup.icon}
                  </div>
                  <h4 className="text-sm font-bold text-white font-display">
                    {categoryGroup.category}
                  </h4>
                </div>

                {/* Badges/Specs List */}
                <div className="space-y-3">
                  {categoryGroup.items.map((skill, sIdx) => (
                    <div
                      key={sIdx}
                      onMouseEnter={() => setHoveredSkill(skill.name)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      className="relative p-2.5 rounded-lg bg-slate-950/40 border border-slate-900 hover:border-slate-800 transition-colors duration-200 cursor-help"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-200 font-mono group-hover:text-white">
                          {skill.name}
                        </span>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                          skill.level === "Expert" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          skill.level === "Advanced" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                          "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        }`}>
                          {skill.level}
                        </span>
                      </div>
                      
                      {/* Explanatory description visible on hover / focus */}
                      <p className={`text-[10px] text-slate-400 mt-1 transition-all duration-200 leading-relaxed font-sans ${
                        hoveredSkill === skill.name ? "opacity-100 max-h-12 mt-1.5" : "opacity-0 max-h-0 overflow-hidden"
                      }`}>
                        {skill.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini Status Marker */}
              <div className="pt-4 border-t border-slate-900 mt-4 text-[9px] font-mono text-slate-500 text-right">
                CATEGORY COMPLETED // SECURE
              </div>
            </div>
          ))}
        </div>

        {/* Micro HUD Accent Quote */}
        <div className="p-4 rounded-xl bg-slate-900/10 border border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase font-bold">LIFELONG EDUCATION DICTATE</span>
            <p className="text-xs text-slate-400 font-sans">
              "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice."
            </p>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/20 font-mono">
            SYS: LEARNING ACTIVE
          </span>
        </div>
      </div>
    </section>
  );
}
