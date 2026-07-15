import React from "react";
import { BookOpen, MapPin, Award, ShieldAlert, Languages, User, Compass, Cpu } from "lucide-react";

export default function About() {
  const bioBullets = [
    {
      icon: <Compass className="w-4 h-4 text-emerald-400" />,
      title: "Vision & Philosophy",
      description: "Believes in engineering with compassion and purpose. Strives to combine human-centered design with reliable server-side models to empower people locally."
    },
    {
      icon: <ShieldAlert className="w-4 h-4 text-blue-400" />,
      title: "Disaster & Civic Support Focus",
      description: "Passionate about building safety prototypes (like Earth Guardian AI) designed for hazard forecasting and response workflows in floodplains like Botolan."
    },
    {
      icon: <Cpu className="w-4 h-4 text-purple-400" />,
      title: "AI & Human Workflows",
      description: "Enjoys bridging modern LLM capabilities (via Gemini) and real-time frontend charts or canvases to explain complex, hidden math concepts visually."
    }
  ];

  return (
    <section id="about" className="py-24 bg-slate-950 border-t border-slate-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] tracking-widest uppercase">
            <User className="w-3.5 h-3.5" />
            FOUNDER STORY & BIOGRAPHY
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            The Mind Behind the Work
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm font-sans leading-relaxed">
            I design immersive AI interfaces, scientific visualizations, and interactive digital experiences that explore the future of intelligent systems.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Narrative & Milestones (Span 7) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4 font-sans text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              <p>
                Through Sammium Tech, I experiment with concepts ranging from AI operating systems to quantum-inspired simulations and research dashboards. My work bridges raw machine learning complexity with highly refined, beautiful user interfaces that anyone can understand.
              </p>
              <p>
                My projects target practical, high-impact categories: from local disaster management checklists built for Botolan, Zambales, to smart agriculture co-pilots configured to advise Central Luzon crop cultivation on real-time temperature and soil moisture diagnostics.
              </p>
            </div>

            {/* Core Pillars Lists */}
            <div className="space-y-4">
              <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-slate-400 border-b border-slate-900 pb-2">
                Core Pillars of Work
              </h4>
              <div className="space-y-3">
                {bioBullets.map((bullet, idx) => (
                  <div key={idx} className="flex gap-3.5 p-3 rounded-lg hover:bg-slate-900/20 transition-colors border border-transparent hover:border-slate-900">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 self-start">
                      {bullet.icon}
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-white font-mono">{bullet.title}</h5>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">{bullet.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Structured Education Card (Appears lower on the page) */}
            <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-850/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-display">Academic Foundation</h4>
                    <p className="text-[10px] text-slate-500 font-mono">BACHELOR OF SCIENCE IN IT</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Expected Graduation: 2028
                </span>
              </div>
              
              <div className="space-y-3 font-sans text-xs text-slate-300 leading-relaxed">
                <p>
                  Currently an incoming 3rd-year student at Central Luzon specializing in modern web design, object-oriented systems, and relational databases. Learning integrates key software methodologies and user experience frameworks.
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-[10px] font-mono">
                  <div className="bg-slate-950 p-2 rounded border border-slate-900">
                    <span className="text-slate-500 block">Vertical 01</span>
                    <span className="text-slate-300 font-medium">Software Engineering</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-900">
                    <span className="text-slate-500 block">Vertical 02</span>
                    <span className="text-slate-300 font-medium">Database Management</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-900">
                    <span className="text-slate-500 block">Vertical 03</span>
                    <span className="text-slate-300 font-medium">Human-Computer Interaction</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Fact Sheets & Personal Information (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Stats Sheet */}
            <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-850/80 space-y-4">
              <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase block font-semibold">
                Developer Directory Details
              </span>
              
              <div className="space-y-3 font-sans text-xs">
                <div className="flex items-center justify-between p-2.5 rounded bg-slate-950/40 border border-slate-900">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-400 font-medium">Location</span>
                  </div>
                  <span className="text-white font-mono font-medium">Botolan, Zambales, PH</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded bg-slate-950/40 border border-slate-900">
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-400 font-medium">Citizenship</span>
                  </div>
                  <span className="text-white font-mono font-medium">Filipino</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded bg-slate-950/40 border border-slate-900">
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-purple-400" />
                    <span className="text-slate-400 font-medium">Languages</span>
                  </div>
                  <span className="text-white font-mono font-medium">English, Filipino</span>
                </div>
              </div>
            </div>

            {/* Certifications Card */}
            <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-850/80 space-y-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase font-semibold">
                  Certifications & Learning
                </span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 font-sans leading-relaxed list-disc list-inside">
                <li>Currently studying robust full-stack patterns in React, Node, and SQL.</li>
                <li>Familiarizing with Git, GitHub versioning, and secure API integrations.</li>
                <li>Trained on Oracle Cloud Infrastructure core concepts and prompt pipelines.</li>
              </ul>
            </div>

            {/* Soft Skills Board */}
            <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-850/80 space-y-3">
              <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase block font-semibold">
                Professional Strengths
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Problem Solving",
                  "Active Communication",
                  "Cross-Functional Teamwork",
                  "Critical Analysis",
                  "Self-Directed Learning",
                  "Ethical Leadership",
                  "User Empathy"
                ].map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-slate-950 border border-slate-900 text-slate-300 px-2.5 py-1 rounded-md font-mono"
                  >
                    ✦ {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
