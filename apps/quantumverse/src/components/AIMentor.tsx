import React, { useState, useEffect, useRef } from "react";
import { 
  BrainCircuit, Send, Sparkles, RefreshCw, HelpCircle, 
  BookOpen, Play, ChevronRight, CheckCircle, Quote, Mic, MicOff
} from "lucide-react";
import { ChatMessage, QuantumFormula } from "../types";
import { audioService } from "../utils/audioService";
import AICoreCompanion from "./AICoreCompanion";

const FORMULAS_LIST = [
  { id: "schrodinger", name: "Time-Dependent Schrödinger Equation", math: "iℏ ∂/∂t |ψ⟩ = H |ψ⟩" },
  { id: "uncertainty", name: "Heisenberg's Uncertainty Principle", math: "Δx · Δp ≥ ℏ/2" },
  { id: "debroglie", name: "de Broglie Wavelength", math: "λ = h / p" },
  { id: "einstein_photo", name: "Photoelectric Energy", math: "E = hν - Φ" },
  { id: "bell_state", name: "Bell State Singlet Entanglement", math: "|Φ⁺⟩ = (|00⟩ + |11⟩) / √2" }
];

export default function AIMentor() {
  const [activeTab, setActiveTab] = useState<"chat" | "formulas">("chat");
  const [chatInput, setChatInput] = useState("");
  const [companionStatus, setCompanionStatus] = useState<"idle" | "thinking" | "answering" | "explaining">("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "model",
      text: "Greetings, fellow researcher! I am your Sammium Quantum AI Mentor. I am calibrated to explain subatomic anomalies, generate intuitive analogies, translate mathematical state equations, and suggest paths of curiosity.\n\nWhat quantum concept can I demystify for you today?",
      timestamp: new Date()
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Formula Explainer States
  const [selectedFormulaId, setSelectedFormulaId] = useState("schrodinger");
  const [formulaExplanation, setFormulaExplanation] = useState<any>(null);
  const [isFormulaLoading, setIsFormulaLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load initial formula explanation
  useEffect(() => {
    explainFormula(selectedFormulaId);
  }, [selectedFormulaId]);

  const explainFormula = async (id: string) => {
    setIsFormulaLoading(true);
    setCompanionStatus("thinking");
    const selected = FORMULAS_LIST.find((f) => f.id === id);
    if (!selected) return;

    try {
      const response = await fetch("/api/explain-formula", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formulaName: selected.name,
          formulaString: selected.math
        })
      });
      const data = await response.json();
      setFormulaExplanation(data);
      setCompanionStatus("explaining");
      audioService.playCalibration("mentor");
      
      // Auto-revert back to idle status after 6s
      setTimeout(() => {
        setCompanionStatus((prev) => prev === "explaining" ? "idle" : prev);
      }, 6000);
    } catch (error) {
      console.error("Failed to explain formula:", error);
      setCompanionStatus("idle");
    } finally {
      setIsFormulaLoading(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    audioService.playClick("tap");
    setCompanionStatus("thinking");

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: chatInput,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      // Map previous messages to format expected by server history helper
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          history: historyPayload
        })
      });

      const data = await response.json();
      
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: data.text || "Disruptive thermal noise interfered with the transmission. Please try transmitting again.",
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, modelMsg]);
      setCompanionStatus("answering");
      audioService.playNotification("info");

      // Save to Discovery Journal AI Logs!
      try {
        const savedQStr = localStorage.getItem("quantumverse_ai_questions");
        const savedQ = savedQStr ? JSON.parse(savedQStr) : [];
        const newQ = {
          question: userMsg.text,
          answer: modelMsg.text,
          timestamp: new Date().toLocaleString()
        };
        // Keep top 10 questions
        const updatedQ = [newQ, ...savedQ].slice(0, 10);
        localStorage.setItem("quantumverse_ai_questions", JSON.stringify(updatedQ));
      } catch (e) {
        console.error("Failed to append AI question to journal:", e);
      }

      // Auto-revert back to idle status after 5s
      setTimeout(() => {
        setCompanionStatus((prev) => prev === "answering" ? "idle" : prev);
      }, 5000);
    } catch (error) {
      console.error("Chat API communication error:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: "Thermal decoherence detected (connection timeout). Please re-establish satellite link and retry.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
      setCompanionStatus("idle");
      audioService.playNotification("warning");
    } finally {
      setIsChatLoading(false);
    }
  };

  const suggestedPrompts = [
    "Explain entanglement with a cooking analogy.",
    "Is Schrodinger's cat physically alive and dead?",
    "Why does quantum tunneling matter for solar fusion?",
    "What is the difference between Copenhagen and Many-Worlds?"
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-left animate-fade-in h-[80vh]">
      {/* Selector sidebar (Formulas list or Sugestions) */}
      <div className="lg:col-span-1 bg-slate-950/60 p-4 rounded-xl border border-white/5 flex flex-col justify-between h-full">
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center border-b border-white/5 pb-2">
            <BrainCircuit className="w-4 h-4 text-cyan-glow mr-2 animate-pulse" /> AI Knowledge Core
          </h3>

          {/* Living AI Companion Floating Core Canvas */}
          <div className="relative rounded-lg overflow-hidden bg-slate-950/40 border border-white/5">
            <div className="absolute top-2 left-2 text-[8px] font-mono text-slate-500 uppercase">HOLOGRAPHIC QUANTUM LINK</div>
            <AICoreCompanion status={companionStatus} />
          </div>

          <div className="flex bg-slate-900 p-0.5 rounded border border-slate-850">
            <button
              onClick={() => {
                setActiveTab("chat");
                audioService.playClick("tap");
              }}
              onMouseEnter={() => audioService.playHover("tick")}
              className={`flex-1 py-1.5 rounded text-xs font-mono font-medium transition-colors ${activeTab === "chat" ? "bg-cyan-glow text-slate-950 font-bold" : "text-slate-400 hover:text-white"}`}
            >
              CHANNELS
            </button>
            <button
              onClick={() => {
                setActiveTab("formulas");
                audioService.playClick("tap");
              }}
              onMouseEnter={() => audioService.playHover("tick")}
              className={`flex-1 py-1.5 rounded text-xs font-mono font-medium transition-colors ${activeTab === "formulas" ? "bg-cyan-glow text-slate-950 font-bold" : "text-slate-400 hover:text-white"}`}
            >
              FORMULAS
            </button>
          </div>

          {activeTab === "chat" ? (
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">SUGGESTED ENQUIRIES</span>
              <div className="space-y-2">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setChatInput(prompt);
                      audioService.playClick("pulse");
                    }}
                    onMouseEnter={() => audioService.playHover("tick")}
                    className="w-full text-left p-2.5 rounded bg-slate-900/40 hover:bg-slate-900 border border-transparent hover:border-cyan-glow/20 transition-all text-xs text-slate-300 leading-relaxed block"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-1 pt-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">SELECT FORMULA</span>
              {FORMULAS_LIST.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setSelectedFormulaId(f.id);
                    audioService.playPressed("haptic");
                  }}
                  onMouseEnter={() => audioService.playHover("tick")}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs flex flex-col space-y-1 transition-all ${selectedFormulaId === f.id ? "bg-gradient-to-r from-cyan-950/40 to-violet-950/20 border-cyan-glow/40 shadow-sm" : "border-transparent hover:bg-white/5"}`}
                >
                  <span className="font-semibold text-white truncate">{f.name}</span>
                  <span className="text-[10px] text-cyan-glow font-mono truncate">{f.math}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-950 border border-white/5 p-3 rounded text-[10px] font-mono text-slate-500">
          <div>MODEL: GEMINI-3.5-FLASH</div>
          <div>CONTEXT LENGTH: 32K TOKENS</div>
          <div>TEMPERATURE: 0.35 (PRECISION)</div>
        </div>
      </div>

      {/* Main chat window or explanation panel */}
      <div className="lg:col-span-3 flex flex-col bg-slate-950/40 rounded-xl border border-white/5 overflow-hidden h-full">
        {activeTab === "chat" ? (
          // Chat Interface
          <div className="flex flex-col justify-between h-full relative">
            {/* Messages scrolling list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[calc(80vh-76px)]">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xl rounded-xl p-4 text-xs leading-relaxed border ${m.role === "user" ? "bg-gradient-to-tr from-cyan-950/40 to-cyan-900/20 border-cyan-glow/20 text-white" : "glass-panel border-white/10 text-slate-200"}`}>
                    <div className="flex items-center space-x-1.5 text-[9px] font-mono mb-1.5 uppercase tracking-wider text-slate-400">
                      <span>{m.role === "user" ? "Researcher" : "Quantum Mentor"}</span>
                    </div>
                    <div className="whitespace-pre-wrap">{m.text}</div>
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="glass-panel rounded-xl p-4 text-xs border border-white/10 flex items-center space-x-2">
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-glow animate-spin" />
                    <span className="text-slate-400 font-mono">Calibrating quantum coherence channels...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom input bar */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-slate-950/60 flex items-center space-x-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask your physics mentor anything about quantum physics..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-md py-2.5 px-4 text-xs font-sans text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow"
              />
              <button
                type="submit"
                disabled={isChatLoading || !chatInput.trim()}
                className="p-2.5 rounded bg-gradient-to-r from-cyan-glow to-quantum-blue text-slate-950 hover:opacity-90 transition-all font-bold disabled:opacity-50"
              >
                <Send className="w-4 h-4 fill-slate-950" />
              </button>
            </form>
          </div>
        ) : (
          // Formula Explanation Panel
          <div className="p-6 overflow-y-auto space-y-6 h-full max-h-[80vh]">
            {isFormulaLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-3">
                <RefreshCw className="w-8 h-8 text-cyan-glow animate-spin" />
                <span className="font-mono text-xs text-slate-400">Solving eigenvalues of selected equation...</span>
              </div>
            ) : formulaExplanation ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="border-b border-white/5 pb-4">
                  <span className="text-[10px] font-mono text-cyan-glow uppercase tracking-wider block mb-1">Interactive Equation Explainer</span>
                  <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight">{formulaExplanation.formulaName}</h2>
                </div>

                {/* Big Formula Centerpiece */}
                <div className="bg-slate-950 py-6 rounded-lg border border-cyan-glow/10 text-center relative overflow-hidden group">
                  <span className="absolute top-2 left-3 text-[8px] font-mono text-slate-500 uppercase">LATEX MATHEMATICS</span>
                  <div className="text-white text-2xl md:text-3xl font-mono tracking-wider glow-cyan">{formulaExplanation.formulaString}</div>
                </div>

                {/* Grid: Analogy & Concept overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Analogy */}
                  <div className="bg-violet-950/15 p-5 rounded-lg border border-violet-glow/15 space-y-2">
                    <span className="text-[10px] font-mono text-violet-glow uppercase tracking-wider block">Conceptual Analogy</span>
                    <p className="text-slate-300 text-xs leading-relaxed">{formulaExplanation.analogy}</p>
                  </div>

                  {/* Concept Overview */}
                  <div className="bg-slate-950 p-5 rounded-lg border border-white/5 space-y-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Physical Meaning</span>
                    <p className="text-slate-300 text-xs leading-relaxed">{formulaExplanation.conceptOverview}</p>
                  </div>
                </div>

                {/* Mathematical breakdown */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Mathematical Variable Breakdown</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {formulaExplanation.breakdown?.map((item: any, idx: number) => (
                      <div key={idx} className="bg-slate-950/80 border border-white/5 p-4 rounded-lg flex flex-col justify-between">
                        <span className="text-lg font-mono font-bold text-cyan-glow mb-1">{item.symbol}</span>
                        <div>
                          <span className="block font-semibold text-white text-[11px]">{item.name}</span>
                          <span className="block text-slate-400 text-[10px] leading-relaxed mt-1">{item.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deep Quantum Fact */}
                <div className="bg-gradient-to-r from-cyan-950/40 via-slate-950 to-violet-950/20 p-5 rounded-lg border border-cyan-glow/20 flex items-start space-x-3.5">
                  <Quote className="w-5 h-5 text-cyan-glow shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-cyan-glow uppercase tracking-wider">Mind-Blowing Quantum Fact</span>
                    <p className="text-slate-300 text-xs italic leading-relaxed">"{formulaExplanation.deepFact}"</p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-20 text-slate-500 font-mono text-xs">
                Select an equation from the sidebar core to load interactive explanation modules.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
