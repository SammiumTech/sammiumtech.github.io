import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Sparkles, Terminal, Cpu, Info } from "lucide-react";
import { motion } from "motion/react";

interface AIExperimentProps {
  onActivityLog: (log: string) => void;
}

const PRESETS = [
  {
    title: "Ecosystem Swarms",
    prompt: "Formulate a mathematical system for cooperative multi-agent swarms trying to optimize resource collection under high gravitational noise.",
  },
  {
    title: "Singularity Orbit",
    prompt: "A theoretical model of quantum particle refraction when passing within 1 millimeter of a laboratory-stabilized micro singularity.",
  },
  {
    title: "Cellular Logic",
    prompt: "Draft a specification showing how cellular automata grids can be designed to act as physical logic gates (AND, OR, NOT) using live-cell pathways.",
  },
  {
    title: "Robotic Hivemind",
    prompt: "Deconstruct the emergent behavior of a decentralized swarm of 500 nano-bots when exposed to a single centralized electromagnetic threat.",
  },
];

const INSTRUCTIONS = {
  theoretician: "You are Dr. Sammium, a visionary quantum researcher at Sammium Lab. Speak with immense intellectual fervor, introducing elegant scientific hypotheses, combining cybernetics and cosmological poetry.",
  skeptic: "You are a cold, precise robotic ethicist. Deconstruct hypotheses into clean logic, bulleted constraints, and code-ready algorithms with rigorous skepticism.",
  synthesizer: "You are a digital nature synthesizer. Describe the intersection of biology, software, physics, and organic patterns. Provide inspiring, creative analogies."
};

export default function AIExperiment({ onActivityLog }: AIExperimentProps) {
  const [prompt, setPrompt] = useState("");
  const [vibe, setVibe] = useState<"balanced" | "chaotic" | "conservative">("balanced");
  const [persona, setPersona] = useState<"theoretician" | "skeptic" | "synthesizer">("theoretician");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);
    onActivityLog(`Cognitive Sandbox initiated: [Vibe: ${vibe}] [Persona: ${persona}]`);

    try {
      const res = await fetch("/api/experiments/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          vibe,
          systemInstruction: INSTRUCTIONS[persona],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate theoretical output.");
      }

      setResponse(data.text || "Cognitive engine response empty.");
      onActivityLog(`Cognitive engine generated ${data.text ? data.text.split(" ").length : 0} words of output.`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred.");
      onActivityLog(`Cognitive sandbox execution failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0f1d]/40 backdrop-blur-md rounded-2xl border border-blue-500/10 overflow-hidden text-gray-200" id="ai-cognitive-container">
      {/* Experiment Header */}
      <div className="px-6 py-4 border-b border-blue-500/10 bg-[#0f172a]/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-sans font-medium text-lg tracking-tight text-white flex items-center gap-2">
              Cognitive Engine Sandbox
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 tracking-wider font-semibold border border-blue-500/30">
                Gemini 3.5 Flash
              </span>
            </h2>
            <p className="text-xs text-gray-400 font-sans">Synthesize hypotheses and structural designs via cognitive models</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-blue-500/10 overflow-y-auto">
        {/* Settings panel - Left */}
        <div className="w-full md:w-80 p-5 bg-[#0a0f1d]/30 flex flex-col gap-5 overflow-y-auto shrink-0">
          <div>
            <h3 className="text-xs uppercase font-mono text-blue-400 font-semibold mb-3 tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> Personas & Tuning
            </h3>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-400 font-sans">Cognitive Archetype</label>
              <div className="grid grid-cols-1 gap-1">
                {(Object.keys(INSTRUCTIONS) as Array<keyof typeof INSTRUCTIONS>).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPersona(p)}
                    className={`text-left text-xs px-3 py-2 rounded-lg transition-all border ${
                      persona === p
                        ? "bg-blue-500/15 border-blue-500/30 text-blue-300 font-medium"
                        : "bg-slate-900/40 border-transparent text-gray-400 hover:bg-slate-900/80"
                    }`}
                  >
                    {p === "theoretician" && "🧬 Fringe Theoretician"}
                    {p === "skeptic" && "🤖 Cyber-Skeptic"}
                    {p === "synthesizer" && "🌿 Aesthetic Synthesizer"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-400 font-sans">Experiment Vibe (Entropy)</label>
            <div className="grid grid-cols-3 gap-1 bg-slate-950/50 p-1 rounded-lg border border-blue-500/5">
              {(["conservative", "balanced", "chaotic"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setVibe(v)}
                  className={`text-[10px] uppercase font-mono py-1 rounded transition-all font-semibold ${
                    vibe === v
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 italic mt-1 font-sans">
              {vibe === "conservative" && "Minimal temperature. Highly structured, logical outputs."}
              {vibe === "balanced" && "Balanced temperature. Realistic and professional research outputs."}
              {vibe === "chaotic" && "High temperature. Wild speculative concepts, fringe ideas."}
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase font-mono text-gray-400 mb-2 tracking-wider flex items-center gap-1">
              <Terminal className="w-3 h-3 text-blue-400" /> Research Seeds
            </h4>
            <div className="flex flex-col gap-1.5">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(p.prompt);
                    onActivityLog(`Seeded cognitive sandbox with: "${p.title}"`);
                  }}
                  className="text-left text-xs p-2 rounded bg-slate-900/30 hover:bg-slate-900/60 border border-blue-500/5 text-gray-300 transition-colors hover:border-blue-500/20"
                >
                  <div className="font-medium text-blue-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    {p.title}
                  </div>
                  <div className="text-[10px] text-gray-500 line-clamp-2 mt-1">{p.prompt}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Console / Workspace - Right */}
        <div className="flex-1 flex flex-col h-[500px] md:h-auto min-h-0">
          <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 bg-[#070b14]/50 font-mono text-sm leading-relaxed relative">
            {response ? (
              <div className="space-y-4 markdown-body text-gray-300 text-sm max-w-full overflow-x-hidden selection:bg-blue-500/30">
                <div className="border-b border-blue-500/10 pb-2 flex items-center justify-between">
                  <span className="text-xs uppercase font-mono text-blue-400 flex items-center gap-1.5 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Output Synthesized Successfully
                  </span>
                  <button 
                    onClick={() => { setResponse(""); onActivityLog("Cognitive sandbox response cleared."); }}
                    className="text-[10px] text-gray-500 hover:text-gray-300 font-mono hover:underline"
                  >
                    Clear Output
                  </button>
                </div>
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                {loading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-blue-500 animate-spin"></div>
                      <Sparkles className="w-5 h-5 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-blue-400 font-mono animate-pulse uppercase tracking-wider font-semibold">Synthesizing Neural Pathway...</p>
                      <p className="text-[10px] text-gray-500 font-sans italic">Consulting model archives on server grid</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 max-w-md">
                    <Sparkles className="w-8 h-8 text-blue-500/30 mx-auto" />
                    <p className="text-xs text-gray-400 font-sans">
                      Select an experimental <span className="text-blue-400 font-mono">research seed</span> from the left sidebar or input a custom query to fire up the Sammium Cognitive Sandbox.
                    </p>
                    <div className="flex items-center gap-2 justify-center text-[10px] text-blue-400/50 bg-blue-500/5 px-2.5 py-1.5 rounded border border-blue-500/10">
                      <Info className="w-3.5 h-3.5 shrink-0" />
                      <span>The prompt is proxied to a server-side Gemini 3.5 Flash container.</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/20 text-red-300 text-xs mt-auto font-sans flex flex-col gap-1">
                <span className="font-mono font-bold uppercase tracking-wider text-red-400">Sandbox Compile Error:</span>
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Form input - Bottom */}
          <form onSubmit={handleSubmit} className="p-3 bg-[#0a0f1d]/80 border-t border-blue-500/10 flex items-center gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Inject conceptual seed, system architecture, or query Dr. Sammium..."
              className="flex-1 bg-slate-950/60 border border-blue-500/10 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-blue-500/30 placeholder-gray-500 font-mono"
              disabled={loading}
              id="ai-prompt-input"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="p-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 disabled:opacity-30 disabled:hover:bg-blue-500 transition-colors shrink-0 border border-blue-400/20 flex items-center justify-center shadow-lg shadow-blue-500/10"
              id="ai-submit-button"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
