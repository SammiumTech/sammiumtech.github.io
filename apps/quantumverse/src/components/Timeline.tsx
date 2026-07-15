import React, { useState } from "react";
import { 
  Calendar, Award, Globe, BookOpen, Sparkles, ChevronRight, Bookmark 
} from "lucide-react";
import { Physicist, TimelineEvent, ResearchPaper } from "../types";

const TIMELINE_EVENTS: TimelineEvent[] = [
  { year: "1687", scientist: "Isaac Newton", discovery: "Classical Mechanics", description: "Publishes the Principia, describing deterministic motion and continuous orbits.", impact: "Foundation of classical determinism." },
  { year: "1865", scientist: "James Clerk Maxwell", discovery: "Electromagnetism Equations", description: "Unifies electricity, magnetism, and light as continuous electromagnetic waves.", impact: "Pre-quantum classical wave standard." },
  { year: "1900", scientist: "Max Planck", discovery: "Quantum Hypothesis", description: "Discovers that blackbody electromagnetic radiation is emitted in discrete packets (quanta).", impact: "Fictional birth date of quantum mechanics." },
  { year: "1905", scientist: "Albert Einstein", discovery: "Photoelectric Effect", description: "Explains photoelectric electron emission by proving light acts as particles (photons).", impact: "Confirms wave-particle duality." },
  { year: "1913", scientist: "Niels Bohr", discovery: "Quantized Atomic Structure", description: "Models atoms with discrete, quantized non-radiating electron orbital levels.", impact: "First quantum atomic framework." },
  { year: "1924", scientist: "Louis de Broglie", discovery: "Matter Waves", description: "Proposes that solid material particles like electrons have dual wave properties.", impact: "Establishes physical wave mechanics." },
  { year: "1926", scientist: "Erwin Schrödinger", discovery: "Wave Equation", description: "Formulates wave mechanics equation governing wavefunction probability amplitudes.", impact: "Core mathematical foundation." },
  { year: "1927", scientist: "Werner Heisenberg", discovery: "Uncertainty Relation", description: "Proves conjugate subatomic properties cannot be simultaneously measured precisely.", impact: "Eliminates absolute deterministic trajectory." },
  { year: "1928", scientist: "Paul Dirac", discovery: "Relativistic Quantum Mechanics", description: "Formulates Dirac equation merging quantum mechanics with special relativity, predicting antimatter.", impact: "Birth of quantum field theory." },
  { year: "1965", scientist: "Richard Feynman", discovery: "Quantum Electrodynamics (QED)", description: "Unveils Feynman diagram path integrals calculating infinite subatomic interaction pathways.", impact: "Most precise physical theory in history." },
  { year: "2026", scientist: "Modern Physics Teams", discovery: "Coherent Fault-Tolerant Quantum Computing", description: "Achieves stable logical qubit states utilizing topological error-correction.", impact: "The quantum computing age starts." }
];

const PHYSICISTS: Physicist[] = [
  {
    name: "Max Planck",
    years: "1858 – 1947",
    contribution: "Planck's Constant (h)",
    details: "Known as the father of quantum theory. In 1900, he solved the ultraviolet catastrophe by postulating that light energy is emitted only in quantized packets, leading to Planck's Constant.",
    funFact: "Planck was a gifted concert pianist and often debated physics and music with Albert Einstein.",
    imagePrompt: "vintage portrait of max planck looking thoughtful in dark office"
  },
  {
    name: "Werner Heisenberg",
    years: "1901 – 1976",
    contribution: "Matrix Mechanics & Uncertainty Principle",
    details: "Formulated matrix mechanics, the first complete quantum system formalism, and proved the mathematical limit of concurrent measurement precision.",
    funFact: "Heisenberg almost failed his doctoral exam because he neglected to study experimental laboratory techniques, focusing purely on deep theory.",
    imagePrompt: "vintage black and white photo of Werner Heisenberg"
  },
  {
    name: "Paul Dirac",
    years: "1902 – 1984",
    contribution: "Dirac Equation & Antimatter",
    details: "Merged quantum mechanics with Einstein's special relativity. His Dirac equation predicted the positron, proving antimatter existed before it was observed.",
    funFact: "Dirac was famously quiet. His colleagues at Cambridge jokingly defined a unit called 'the dirac', which was equal to saying one word per hour.",
    imagePrompt: "portrait of paul dirac"
  },
  {
    name: "Richard Feynman",
    years: "1918 – 1988",
    contribution: "Quantum Electrodynamics & Path Integrals",
    details: "Formulated quantum electrodynamics utilizing path integrals and intuitive space-time particle diagrams, making calculations highly visual.",
    funFact: "Feynman was a safe-cracker, bongo player, and visited the remote Tuva region, actively living a life of chaotic curiosity.",
    imagePrompt: "richard feynman bongo drums physics board"
  }
];

const RESEARCH_PAPERS: ResearchPaper[] = [
  {
    title: "On the Constitution of Atoms and Molecules",
    year: "1913",
    authors: "Niels Bohr",
    summary: "Introduces the Bohr model of the atom, postulating quantized circular orbits where electrons do not emit electromagnetic waves unless transitioning states.",
    significance: "Established quantum rules within atomic models."
  },
  {
    title: "Can Quantum-Mechanical Description of Physical Reality be Considered Complete?",
    year: "1935",
    authors: "A. Einstein, B. Podolsky, N. Rosen",
    summary: "Introduces the famous EPR paradox, arguing that quantum entanglement implies non-local 'spooky action' which would contradict special relativity, suggesting hidden variables.",
    significance: "Forced physics to mathematically formulate quantum non-locality."
  },
  {
    title: "On the Einstein Podolsky Rosen Paradox",
    year: "1964",
    authors: "John Stewart Bell",
    summary: "Formulates Bell's Theorem, proving that no local hidden-variable theory can reproduce the correlation predictions of quantum entanglement.",
    significance: "Opened the door to testing non-locality in actual laser labs."
  }
];

export default function Timeline() {
  const [activeTab, setActiveTab] = useState<"timeline" | "library" | "papers">("timeline");
  const [selectedPhysicist, setSelectedPhysicist] = useState<Physicist | null>(PHYSICISTS[0]);

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Navigation tabs */}
      <div className="flex bg-slate-950/60 p-1 rounded-xl border border-white/5 max-w-md">
        {(["timeline", "library", "papers"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-xs font-mono font-medium rounded-lg uppercase transition-all ${activeTab === tab ? "bg-cyan-glow text-slate-950 font-bold" : "text-slate-400 hover:text-white"}`}
          >
            {tab === "timeline" ? "Discovery Timeline" : tab === "library" ? "Research Library" : "Famous Papers"}
          </button>
        ))}
      </div>

      {activeTab === "timeline" && (
        <div className="rounded-xl glass-panel border border-white/5 p-6 md:p-8 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-glow/5 to-violet-glow/5 rounded-full blur-3xl -z-10"></div>

          <div className="border-b border-white/5 pb-4">
            <h2 className="text-xl font-display font-bold text-white flex items-center">
              <Calendar className="w-5 h-5 text-cyan-glow mr-2" /> Discovery Timeline
            </h2>
            <p className="text-xs text-slate-400">Milestones of continuous waves evolving to subatomic wavefunctions</p>
          </div>

          {/* Vertical Timeline Tree */}
          <div className="relative border-l border-white/10 pl-6 md:pl-8 space-y-6">
            {TIMELINE_EVENTS.map((ev, idx) => (
              <div key={idx} className="relative group">
                {/* Node dot */}
                <div className="absolute -left-[31px] md:-left-[39px] top-1 w-4 h-4 rounded-full border border-cyan-glow/50 bg-slate-950 flex items-center justify-center group-hover:scale-125 transition-transform">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-pulse"></div>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-cyan-glow font-mono text-xs font-bold bg-cyan-950/40 border border-cyan-glow/20 px-2 py-0.5 rounded">
                        {ev.year}
                      </span>
                      <span className="font-semibold text-white text-sm">{ev.discovery}</span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">{ev.scientist}</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">{ev.description}</p>
                  <span className="block text-[10px] font-mono text-slate-500 uppercase">Impact: {ev.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "library" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left panel: Physicists list */}
          <div className="md:col-span-1 bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2 px-1">PHYSICISTS</span>
            {PHYSICISTS.map((p) => (
              <button
                key={p.name}
                onClick={() => setSelectedPhysicist(p)}
                className={`w-full text-left p-3 rounded-lg border text-xs flex flex-col space-y-1 transition-all ${selectedPhysicist?.name === p.name ? "bg-gradient-to-r from-cyan-950/40 to-violet-950/20 border-cyan-glow/40 shadow-sm" : "border-transparent hover:bg-white/5"}`}
              >
                <span className="font-semibold text-white">{p.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">{p.years}</span>
              </button>
            ))}
          </div>

          {/* Right panel: Detailed Physicist card */}
          <div className="md:col-span-2">
            {selectedPhysicist ? (
              <div className="rounded-xl glass-panel border border-white/5 p-6 md:p-8 space-y-6 relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-glow/5 to-violet-glow/5 rounded-full blur-3xl -z-10"></div>

                <div className="border-b border-white/5 pb-4">
                  <span className="text-[10px] font-mono text-cyan-glow uppercase tracking-wider block mb-1">Theoretical Contributor</span>
                  <h2 className="text-2xl font-display font-bold text-white tracking-tight">{selectedPhysicist.name}</h2>
                  <span className="text-xs text-slate-400 font-mono">{selectedPhysicist.years}</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] font-mono text-slate-500 uppercase">Primary Contribution</h4>
                    <span className="text-sm font-semibold text-cyan-glow block mt-0.5">{selectedPhysicist.contribution}</span>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-mono text-slate-500 uppercase">Scientific Summary</h4>
                    <p className="text-slate-300 text-xs leading-relaxed mt-1">{selectedPhysicist.details}</p>
                  </div>

                  <div className="bg-violet-950/15 p-4 rounded-lg border border-violet-glow/15 space-y-1">
                    <span className="text-[9px] font-mono text-violet-glow uppercase tracking-wider block">Intriguing Fact</span>
                    <p className="text-slate-300 text-xs italic leading-relaxed">"{selectedPhysicist.funFact}"</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl glass-panel border border-white/5 p-20 text-center text-slate-500 font-mono text-xs">
                Select a famous physicist from the registry sidebar to read their historical contribution dossiers.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "papers" && (
        <div className="rounded-xl glass-panel border border-white/5 p-6 md:p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-glow/5 to-violet-glow/5 rounded-full blur-3xl -z-10"></div>

          <div className="border-b border-white/5 pb-4">
            <h2 className="text-xl font-display font-bold text-white flex items-center">
              <BookOpen className="w-5 h-5 text-cyan-glow mr-2" /> Historical Papers & Documents
            </h2>
            <p className="text-xs text-slate-400">Summaries of peer-reviewed articles that altered physics history</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RESEARCH_PAPERS.map((paper, idx) => (
              <div key={idx} className="bg-slate-950/40 border border-white/5 p-5 rounded-lg flex flex-col justify-between hover:border-cyan-glow/30 transition-all">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                    <span>{paper.year}</span>
                    <span className="text-cyan-glow uppercase">Publication</span>
                  </div>
                  <h4 className="font-semibold text-white text-sm leading-snug">{paper.title}</h4>
                  <span className="block text-[10px] font-mono text-slate-400">Authors: {paper.authors}</span>
                  <p className="text-slate-300 text-xs leading-relaxed">{paper.summary}</p>
                </div>
                <div className="border-t border-white/5 pt-3 mt-4 text-[10px] font-mono text-slate-500">
                  <span className="text-[9px] text-cyan-glow block mb-0.5 uppercase">Significance</span>
                  {paper.significance}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
