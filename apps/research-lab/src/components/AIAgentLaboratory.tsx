import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  Plus, 
  Trash2, 
  Play, 
  Terminal, 
  Settings, 
  Database, 
  FileText, 
  Code, 
  Sparkles, 
  CheckCircle2, 
  Activity, 
  FileSpreadsheet, 
  AlertTriangle, 
  Check, 
  BookOpen, 
  Wrench,
  HelpCircle,
  Clock,
  Cpu,
  Fingerprint,
  Layers,
  ArrowRight,
  TrendingUp,
  Sliders,
  Award
} from "lucide-react";
import { sounds } from "../utils/sounds";

interface AIAgent {
  id: string;
  name: string;
  specialty: string;
  avatar: string; // Bot emoji / icon representations
  status: "idle" | "thinking" | "completed" | "error";
  primaryInput: string;
  functions: string[];
  systemPrompt: string;
  brainCycles: number;
  tokenSavings: number;
  precision: number;
  createdTime: string;
}

const DEFAULT_AGENTS: AIAgent[] = [
  {
    id: "yui-assistant",
    name: "MHCP-001 Yui (Core Assistant)",
    specialty: "Neural Diagnostics & Counseling",
    avatar: "🧚‍♀️",
    status: "idle",
    primaryInput: "Biofeedback & Operator Sync Signals",
    functions: ["Analyze emotion metrics", "Optimize cognitive link stability", "Trigger comforting diagnostic audio"],
    systemPrompt: "You are YUI, Mental Health Counseling Program prototype MHCP-001. Analyze real-time biometrics, vocal telemetry, and system stress indexes to provide deep comforting advice, emotional stabilization, and technical diagnostics. Address the user with great affection.",
    brainCycles: 9999,
    tokenSavings: 99.9,
    precision: 100.0,
    createdTime: "2026-07-02"
  },
  {
    id: "community-analyst",
    name: "Galactic Community Analyst",
    specialty: "Community Insights",
    avatar: "📊",
    status: "idle",
    primaryInput: "Community Database",
    functions: ["Generate reports", "Identify trends", "Compile recommendations"],
    systemPrompt: "You are a cybernetic social-cluster analyst. Parse telemetry feeds, engagement matrices, and member clusters to identify growth vectors, churn flags, and node bonding patterns.",
    brainCycles: 1842,
    tokenSavings: 35.8,
    precision: 98.4,
    createdTime: "2026-06-15"
  },
  {
    id: "research-assistant",
    name: "Hypothesis Synthesis Core",
    specialty: "Scientific Papers",
    avatar: "🔬",
    status: "idle",
    primaryInput: "Research Papers & PDF Lattices",
    functions: ["Summarize papers", "Analyze documents", "Generate ideas"],
    systemPrompt: "You are an autonomous literature-synthesis agent. Scan scientific text corpora to extract causal mechanisms, map experimental bounds, and suggest multi-disciplinary design solutions.",
    brainCycles: 3105,
    tokenSavings: 72.4,
    precision: 99.2,
    createdTime: "2026-06-20"
  },
  {
    id: "coding-agent",
    name: "Syntactic Refactoring Node",
    specialty: "Full-Stack Codebases",
    avatar: "💻",
    status: "idle",
    primaryInput: "TypeScript/Node Source Files",
    functions: ["Code review", "Debugging suggestions", "Architecture suggestions"],
    systemPrompt: "You are an expert compiler-grade coding assistant. Analyze abstract syntax trees, locate race conditions, verify type bounds, and recommend highly scaleable concurrent architectures.",
    brainCycles: 4520,
    tokenSavings: 128.5,
    precision: 99.7,
    createdTime: "2026-06-28"
  }
];

export const AIAgentLaboratory: React.FC<{ isRgbOverdrive: boolean }> = ({ isRgbOverdrive }) => {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  
  // Custom Agent Creation Form states
  const [isCreating, setIsCreating] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customSpecialty, setCustomSpecialty] = useState("Autonomous Logic");
  const [customAvatar, setCustomAvatar] = useState("🤖");
  const [customInput, setCustomInput] = useState("Raw Text Prompt");
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedFunctions, setSelectedFunctions] = useState<string[]>([]);

  // Simulation states
  const [selectedInputFeed, setSelectedInputFeed] = useState<string>("");
  const [customUserPrompt, setCustomUserPrompt] = useState<string>("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [activeOutputTab, setActiveOutputTab] = useState<string>("");
  const [taskCompleted, setTaskCompleted] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);

  // Load and Persist Agents
  useEffect(() => {
    const saved = localStorage.getItem("sam_ai_agents");
    if (saved) {
      try {
        let parsed = JSON.parse(saved);
        if (!parsed.some((a: any) => a.id === "yui-assistant")) {
          parsed = [DEFAULT_AGENTS[0], ...parsed];
          localStorage.setItem("sam_ai_agents", JSON.stringify(parsed));
        }
        setAgents(parsed);
        if (parsed.length > 0) setSelectedAgent(parsed[0]);
      } catch (e) {
        setAgents(DEFAULT_AGENTS);
        setSelectedAgent(DEFAULT_AGENTS[0]);
      }
    } else {
      setAgents(DEFAULT_AGENTS);
      setSelectedAgent(DEFAULT_AGENTS[0]);
    }
  }, []);

  const saveAgents = (updated: AIAgent[]) => {
    localStorage.setItem("sam_ai_agents", JSON.stringify(updated));
  };

  // Set default output tab when agent changes
  useEffect(() => {
    if (selectedAgent && selectedAgent.functions.length > 0) {
      setActiveOutputTab(selectedAgent.functions[0]);
      setTaskCompleted(false);
      setTerminalLogs([]);
    }
  }, [selectedAgent]);

  // Handle auto-scroll of terminal
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  // Preset input feeds based on agent
  const getInputFeeds = (agent: AIAgent | null) => {
    if (!agent) return [];
    if (agent.id === "community-analyst") {
      return ["Discord Activity Logs (July 2026).csv", "Beta Tester Survey Feedback.sql", "Community Growth Telemetry.json"];
    }
    if (agent.id === "research-assistant") {
      return ["arXiv-Quantum-Gravity-Lattice.pdf", "Deep-Reinforcement-Learning-Swarms.txt", "Bio-Automata-Cellular-Bounds.json"];
    }
    if (agent.id === "coding-agent") {
      return ["server.ts // Main Entrypoint", "InteractiveStarfield.tsx // Canvas Parallax", "package.json // Dependency Tree"];
    }
    return ["Standard Galactic Network Stream", "Sensor Telemetry Matrix Dump", "Custom Text Console Input"];
  };

  // Form options
  const AVAILABLE_FUNCTIONS = [
    "Summarize papers",
    "Analyze documents",
    "Generate ideas",
    "Code review",
    "Debugging suggestions",
    "Architecture suggestions",
    "Generate reports",
    "Identify trends",
    "Compile recommendations",
    "Pattern recognition",
    "Synthesize neural logs"
  ];

  const AVATARS = ["🤖", "🧠", "🧬", "💻", "📊", "🔬", "🛰️", "🛸", "🛡️", "🔥"];

  const handleCheckboxChange = (func: string) => {
    sounds.playClick();
    if (selectedFunctions.includes(func)) {
      setSelectedFunctions(prev => prev.filter(f => f !== func));
    } else {
      setSelectedFunctions(prev => [...prev, func]);
    }
  };

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) {
      sounds.playError();
      return;
    }
    sounds.playLaser();

    const newAgent: AIAgent = {
      id: "agent-" + Date.now(),
      name: customName,
      specialty: customSpecialty,
      avatar: customAvatar,
      status: "idle",
      primaryInput: customInput,
      functions: selectedFunctions.length > 0 ? selectedFunctions : ["Process custom logs"],
      systemPrompt: customPrompt || `You are a high-fidelity specialized AI agent designated for ${customSpecialty}. Perform targeted operations utilizing selected vector matrices.`,
      brainCycles: Math.floor(Math.random() * 500) + 100,
      tokenSavings: 0,
      precision: Math.round(95 + Math.random() * 4.9 * 10) / 10,
      createdTime: new Date().toISOString().split("T")[0]
    };

    const updated = [newAgent, ...agents];
    setAgents(updated);
    saveAgents(updated);
    setSelectedAgent(newAgent);
    setIsCreating(false);

    // Reset Form
    setCustomName("");
    setCustomSpecialty("Autonomous Logic");
    setCustomAvatar("🤖");
    setCustomInput("Raw Text Prompt");
    setCustomPrompt("");
    setSelectedFunctions([]);
  };

  const handleDeleteAgent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playError();
    const filtered = agents.filter(a => a.id !== id);
    setAgents(filtered);
    saveAgents(filtered);
    if (selectedAgent?.id === id) {
      setSelectedAgent(filtered[0] || null);
    }
  };

  // Run the Simulation
  const handleExecuteAgent = () => {
    if (!selectedAgent) return;
    sounds.playSingularity();
    setIsExecuting(true);
    setTaskCompleted(false);
    setTerminalLogs([]);

    const feed = selectedInputFeed || getInputFeeds(selectedAgent)[0] || "Custom Workspace Feed";

    const logs = [
      `[SYSTEM] Spawning specialized containment cell for "${selectedAgent.name}"...`,
      `[SECURITY] Applying sandbox encryption layers // Integrity Verified`,
      `[SYSTEM] Allocating dynamic brain cycles (Pool: ${selectedAgent.brainCycles} cycles)...`,
      `[VECTORS] Synchronizing ${selectedAgent.functions.length} targeted function handlers...`,
      `[METRIC] Target Accuracy Factor calibrated to ${selectedAgent.precision}%`,
      `[DATA] Hooking data stream: "${feed}"...`,
      `[PARSER] Streaming binary tokens into attention registry...`,
      `[COMPUTING] Performing high-dimensional tensor matrix calculations...`,
      `[NEURAL] Mapping contextual relationships on system ports...`,
      `[SYNTHESIS] Collating specialized output blocks...`,
      `[COMPLETE] Execution context released safely. Results mapped to standard sandbox buffer.`
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      setTerminalLogs(prev => [...prev, logs[currentLogIndex]]);
      sounds.playHover();
      currentLogIndex++;
      if (currentLogIndex >= logs.length) {
        clearInterval(interval);
        setIsExecuting(false);
        setTaskCompleted(true);
        sounds.playLaser();
      }
    }, 450);
  };

  // Specialized Output generators based on Selected Agent & Active Tab Function
  const renderAgentOutputs = () => {
    if (!selectedAgent) return null;

    // Community Analyst Agent Responses
    if (selectedAgent.id === "community-analyst") {
      if (activeOutputTab === "Generate reports") {
        return (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold border-b border-slate-800 pb-1.5 mb-2">
              <FileText className="w-4 h-4 text-cyan-400" /> COMMUNITY FEEDBACK REPORT MATRIX
            </div>
            <p className="text-slate-300 leading-relaxed">
              Based on the surveys and Discord active telemetry logs, aggregate community index shows an overall **8.4/10** engagement score, a **14.2% growth** in organic node creation.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2 bg-slate-900/60 p-2.5 rounded border border-slate-800">
              <div>
                <span className="text-slate-500 text-[10px] block">TOTAL ACTIVE USERS:</span>
                <span className="text-slate-200 font-bold">12,450 accounts</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">DAILY MESSAGE MATRIX:</span>
                <span className="text-slate-200 font-bold">89,210 nodes/day</span>
              </div>
            </div>
          </div>
        );
      }
      if (activeOutputTab === "Identify trends") {
        return (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-pink-400 font-bold border-b border-slate-800 pb-1.5 mb-2">
              <TrendingUp className="w-4 h-4 text-pink-400" /> IDENTIFIED ENGAGEMENT TRENDS
            </div>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-1.5">
                <span className="text-pink-500">▶</span>
                <span>**Peak Traffic Shift**: Highest cluster density occurs between **17:00 and 21:00 UTC**, representing developer-centric evening routines.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-pink-500">▶</span>
                <span>**Interactive Content Spike**: Post-announcement threads containing sandbox files receive **3.4x higher** retention rates.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-pink-500">▶</span>
                <span>**Feature Requests**: 42.5% of feedback centers around *Autonomous Multi-agent playground environments* (matching this core laboratory!).</span>
              </li>
            </ul>
          </div>
        );
      }
      if (activeOutputTab === "Compile recommendations") {
        return (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold border-b border-slate-800 pb-1.5 mb-2">
              <Award className="w-4 h-4 text-emerald-400" /> COMMUNITY RECONSTRUCTION RECOMMENDATIONS
            </div>
            <div className="p-3 bg-slate-900/40 rounded border border-slate-800 space-y-2">
              <div className="text-cyan-300 font-bold">#1 Implement Autonomous Discord Node</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Connect a server-side bot mimicking the "Galactic Community Analyst" into chat rooms to auto-categorize and summarize requests instantly.
              </p>
            </div>
            <div className="p-3 bg-slate-900/40 rounded border border-slate-800 space-y-2">
              <div className="text-pink-300 font-bold">#2 Gamified Verification Badges</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Offer special cryptographic "Sammium Enthusiast" roles based on sandbox activity to minimize user churn and double network cohesion.
              </p>
            </div>
          </div>
        );
      }
    }

    // Research Assistant Agent Responses
    if (selectedAgent.id === "research-assistant") {
      if (activeOutputTab === "Summarize papers") {
        return (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold border-b border-slate-800 pb-1.5 mb-2">
              <BookOpen className="w-4 h-4 text-cyan-400" /> SCIENTIFIC COMPACT ABSTRACT
            </div>
            <p className="text-slate-300 leading-relaxed">
              The provided literature describes a **hybrid 5-Dimensional string lattice** mapping quantum entropic fields directly onto deep neural network layers.
            </p>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-cyan-400 text-[10px] font-bold block mb-1">KEY TAKEAWAY:</span>
              <p className="text-[11px] text-slate-400">
                By setting the tunneling parameters to ℏ (reduced Planck constant), the gradients bypass backpropagation deadlocks under deep dimensional loads with 99.2% accuracy.
              </p>
            </div>
          </div>
        );
      }
      if (activeOutputTab === "Analyze documents") {
        return (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-pink-400 font-bold border-b border-slate-800 pb-1.5 mb-2">
              <Layers className="w-4 h-4 text-pink-400" /> CRITICAL DOCUMENT STRUCTURE ANALYSIS
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-slate-900/60 px-2 py-1 rounded">
                <span className="text-slate-400">Mathematical Proof Cohesion:</span>
                <span className="text-emerald-400 font-bold">VALID (98.4%)</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/60 px-2 py-1 rounded">
                <span className="text-slate-400">Experimental Replicability Index:</span>
                <span className="text-amber-400 font-bold">MODERATE (65.2%)</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/60 px-2 py-1 rounded">
                <span className="text-slate-400">Cognitive Bias/Hallucination Factor:</span>
                <span className="text-emerald-500 font-bold">LOW (0.02%)</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              *Analysis identifies missing correlation bounds in Equation 4b. Recommends recalculating thermal drift factors.*
            </p>
          </div>
        );
      }
      if (activeOutputTab === "Generate ideas") {
        return (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold border-b border-slate-800 pb-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-emerald-400" /> BIO-AUTOMATA IDEA GENERATION SEEDS
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div className="p-2.5 bg-slate-900/50 border border-slate-800 rounded">
                <span className="text-pink-400 text-[10px] font-bold block mb-1">IDEA ALPHA: CRYPTO-BOID DUST</span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Inject lightweight cryptographic signatures into individual swarm boids to track entropy mapping in real time.
                </p>
              </div>
              <div className="p-2.5 bg-slate-900/50 border border-slate-800 rounded">
                <span className="text-cyan-400 text-[10px] font-bold block mb-1">IDEA BETA: THERMAL ANNEALING FEED</span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Modulate background server heat output into the optimization grid to naturally settle chaotic gradients into absolute minimums.
                </p>
              </div>
            </div>
          </div>
        );
      }
    }

    // Coding Agent Responses
    if (selectedAgent.id === "coding-agent") {
      if (activeOutputTab === "Code review") {
        return (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold border-b border-slate-800 pb-1.5 mb-2">
              <Code className="w-4 h-4 text-cyan-400" /> SYSTEM ARCHITECTURE & CODE REVIEW
            </div>
            <div className="bg-slate-950 p-2.5 rounded border border-slate-850 space-y-1.5">
              <div className="text-rose-400 font-bold">❌ Critical Issue: Infinite State Re-render</div>
              <p className="text-[11px] text-slate-400">
                In `AICognitiveNexus.tsx`, updating the model configuration state directly inside the main render scope causes consecutive recalculations.
              </p>
              <div className="text-emerald-400 font-mono text-[10px] bg-slate-900 p-1.5 rounded mt-1.5">
                // FIX: Wrap within useEffect with primitive dependencies<br />
                useEffect(() =&gt; &#123; updateLatticeValues(); &#125;, [overdriveSpeed]);
              </div>
            </div>
          </div>
        );
      }
      if (activeOutputTab === "Debugging suggestions") {
        return (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-pink-400 font-bold border-b border-slate-800 pb-1.5 mb-2">
              <Wrench className="w-4 h-4 text-pink-400" /> TARGETED DEBUGGING PATHWAYS
            </div>
            <div className="space-y-2 text-slate-300">
              <div className="p-2 bg-slate-900/60 rounded border border-slate-800 flex gap-2 items-start">
                <span className="text-amber-400 font-bold">#1</span>
                <div>
                  <div className="font-bold text-slate-200">Express v5 Route Mapping</div>
                  <p className="text-[11px] text-slate-400">Change wildcard catches from `app.get('*', ...)` to `app.get('*all', ...)` to support Express 5 type bindings.</p>
                </div>
              </div>
              <div className="p-2 bg-slate-900/60 rounded border border-slate-800 flex gap-2 items-start">
                <span className="text-amber-400 font-bold">#2</span>
                <div>
                  <div className="font-bold text-slate-200">WebSocket Ping Timeouts</div>
                  <p className="text-[11px] text-slate-400">Disable Vite HMR fallback triggers inside sandboxed iframe containers. Suppress websocket connection warnings safely.</p>
                </div>
              </div>
            </div>
          </div>
        );
      }
      if (activeOutputTab === "Architecture suggestions") {
        return (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold border-b border-slate-800 pb-1.5 mb-2">
              <Cpu className="w-4 h-4 text-emerald-400" /> SECURE CYBER-GRID MICROSERVICES
            </div>
            <p className="text-slate-300 leading-relaxed">
              We recommend separating the heavy particle calculations (like those in `QuantumOrbit` and `RoboticSwarm`) from the main React main UI threads.
            </p>
            <div className="p-3 bg-slate-900/40 rounded border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-1">PROPOSED SOLUTION: WEB WORKER PIXEL BOUND</span>
              <p className="text-[11px] text-slate-400">
                Offload the canvas coordinate recalculation loops to a standard dedicated background Web Worker thread. Post message vectors to React only on frame render states.
              </p>
            </div>
          </div>
        );
      }
    }

    // Dynamic Generic Output for custom-created agents
    return (
      <div className="space-y-3 font-mono text-xs">
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold border-b border-slate-800 pb-1.5 mb-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" /> TASK EXECUTION SUMMARY
        </div>
        <p className="text-slate-300 leading-relaxed">
          The custom agent <span className="text-pink-400 font-bold">"{selectedAgent.name}"</span> successfully executed the function <span className="text-cyan-300 font-bold">"{activeOutputTab}"</span> against the loaded source input.
        </p>

        <div className="p-3 bg-slate-900/60 rounded border border-slate-800 space-y-2">
          <span className="text-slate-400 font-bold block">[ NEURAL AGENT LOG RESULTS ]</span>
          <p className="text-slate-200 leading-relaxed text-[11px]">
            Hypothesis verified! High-dimensional spatial maps settled into optimum configurations with **{selectedAgent.precision}%** precision factor. Brain cycle efficiency is within normal tolerance indices.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mt-2 text-[10px] text-slate-500">
          <div>BRAIN CYCLES USED: {selectedAgent.brainCycles} c</div>
          <div>VIRTUAL SPACE BUFFER: OK</div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="ai-agent-laboratory">
      {/* Left Sidebar: Lab Agents Deck */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className={`p-4 rounded-xl border bg-slate-900/95 shadow-xl relative overflow-hidden transition-all duration-300 ${
          isRgbOverdrive ? "border-rose-glow ring-2 ring-rose-500/20" : "border-slate-800"
        }`}>
          {/* Subtle grid backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(#f43f5e_0.8px,transparent_0.8px)] [background-size:14px_14px] opacity-10 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col h-[525px]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-rose-400 flex items-center gap-1.5">
                <Bot className="w-4 h-4 animate-pulse text-rose-500" /> [ AGENT_LAB_CORES ]
              </h3>
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsCreating(!isCreating);
                }}
                className="p-1 px-2 rounded bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-[10px] font-mono text-rose-400 font-bold flex items-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                BUILD
              </button>
            </div>

            {/* Scrollable list of agents */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {agents.map((agent) => {
                const isSelected = selectedAgent?.id === agent.id;
                return (
                  <div
                    key={agent.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedAgent(agent);
                      setIsCreating(false);
                      setTaskCompleted(false);
                      setTerminalLogs([]);
                    }}
                    onMouseEnter={() => sounds.playHover()}
                    className={`p-3.5 rounded-lg border text-left transition-all relative cursor-pointer group ${
                      isSelected
                        ? "bg-slate-950 border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.25)]"
                        : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    {/* Active Indicator Strip */}
                    {isSelected && (
                      <span className="absolute top-0 left-0 w-1 h-full bg-rose-500 rounded-l-md" />
                    )}

                    <div className="flex justify-between items-start gap-2">
                      <div className="flex gap-2.5 items-center">
                        <span className="text-2xl bg-slate-950 p-1.5 rounded-md border border-slate-800">{agent.avatar}</span>
                        <div>
                          <div className="text-xs font-mono font-bold tracking-wider text-slate-100 uppercase group-hover:text-rose-400 transition-colors">
                            {agent.name}
                          </div>
                          <div className="text-[10px] font-mono text-cyan-400 tracking-wide mt-0.5">
                            Specialty: {agent.specialty}
                          </div>
                        </div>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-850 text-[8px] font-mono font-bold text-slate-400">
                        {agent.id.startsWith("agent-") ? "CUSTOM" : "SYSTEM"}
                      </span>
                    </div>

                    {/* Meta values */}
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-800/60 text-[9px] font-mono text-slate-400 text-center">
                      <div>
                        <span className="text-slate-500 block">PRECISION:</span>
                        <span className="text-slate-200 font-bold">{agent.precision}%</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">CYCLES:</span>
                        <span className="text-slate-200 font-bold">{agent.brainCycles}c</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">SAVED:</span>
                        <span className="text-slate-200 font-bold">{agent.tokenSavings || 12.4}k tok</span>
                      </div>
                    </div>

                    {/* Delete Custom Agent trigger */}
                    {agent.id.startsWith("agent-") && (
                      <button
                        onClick={(e) => handleDeleteAgent(agent.id, e)}
                        title="Dismantle Custom Agent"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 rounded hover:bg-slate-950/40 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}

              {agents.length === 0 && (
                <div className="text-center py-12 text-slate-500 font-mono text-xs">
                  NO ACTIVE AGENT SCHEMATICS LOADED.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Main Column: Workspace & Console */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        {isCreating ? (
          /* Specialized Custom Agent Creation Workbench */
          <form 
            onSubmit={handleCreateAgent}
            className={`p-6 rounded-xl border bg-slate-900/95 shadow-2xl relative transition-all duration-300 h-[525px] overflow-y-auto flex flex-col justify-between ${
              isRgbOverdrive ? "border-cyan-glow ring-2 ring-cyan-500/20" : "border-slate-800"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-slate-800">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                  <Fingerprint className="w-4 h-4 text-cyan-400 animate-pulse" /> [ PROVISION_SPECIALIZED_CORE ]
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setIsCreating(false);
                  }}
                  className="text-slate-500 hover:text-slate-300 font-mono text-xs cursor-pointer"
                >
                  CANCEL
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase">Agent Identity Name:</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Community Analyst Bot"
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-2 text-xs font-mono text-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase">Domain Specialty:</label>
                  <input
                    type="text"
                    value={customSpecialty}
                    onChange={(e) => setCustomSpecialty(e.target.value)}
                    placeholder="e.g. Document Summarization"
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-2 text-xs font-mono text-cyan-300 focus:outline-none"
                  />
                </div>
              </div>

              {/* Bot Avatar Chooser */}
              <div className="mb-4">
                <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase">Synthesized Visual Core (Avatar Emoji):</label>
                <div className="flex gap-2 flex-wrap bg-slate-950 p-2 rounded border border-slate-800">
                  {AVATARS.map((emoji) => {
                    const isSel = customAvatar === emoji;
                    return (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          setCustomAvatar(emoji);
                        }}
                        className={`w-9 h-9 rounded text-lg flex items-center justify-center transition-all cursor-pointer border ${
                          isSel 
                            ? "bg-cyan-500 border-cyan-400 text-slate-950 font-bold scale-110 shadow-[0_0_8px_rgba(6,182,212,0.4)]" 
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                        }`}
                      >
                        {emoji}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary Input Source Selector */}
              <div className="mb-4">
                <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase">Standard Inbound Feed Type:</label>
                <select
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-2 text-xs font-mono text-cyan-300 cursor-pointer focus:outline-none"
                >
                  <option value="Community Database">📊 Community Database (Reports, Trends, recommendations)</option>
                  <option value="Research Papers & PDF Lattices">🔬 Research Documents (Summaries, ideas, papers)</option>
                  <option value="TypeScript/Node Source Files">💻 TypeScript/CJS Source Code (Review, debug, architecture)</option>
                  <option value="Raw Text Prompt">📝 Standard System Inbound Feed</option>
                </select>
              </div>

              {/* Specialized Capability Checkboxes */}
              <div className="mb-4">
                <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase">Specialized Capability Functions (Check Multiples):</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-slate-950 p-3 rounded border border-slate-800 max-h-[110px] overflow-y-auto">
                  {AVAILABLE_FUNCTIONS.map((func) => {
                    const checked = selectedFunctions.includes(func);
                    return (
                      <label 
                        key={func} 
                        className={`flex items-center gap-2 px-2 py-1 border rounded text-[10px] font-mono select-none cursor-pointer transition-all ${
                          checked 
                            ? "bg-cyan-500/10 border-cyan-500 text-cyan-300" 
                            : "bg-slate-900 border-slate-850 text-slate-500 hover:border-slate-800"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleCheckboxChange(func)}
                          className="hidden"
                        />
                        <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center text-[8px] font-bold ${
                          checked ? "bg-cyan-500 border-cyan-400 text-slate-950" : "border-slate-700 bg-slate-950"
                        }`}>
                          {checked && "✔"}
                        </span>
                        {func}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* System Instructions Prompt */}
              <div className="mb-4">
                <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase">Primary System Directives / Instructions:</label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={2}
                  placeholder="e.g. You are a high-speed parser. Focus on analyzing documents and suggesting core algorithmic patches."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-2 text-xs font-mono text-cyan-300 focus:outline-none resize-none h-[50px]"
                />
              </div>
            </div>

            <button
              type="submit"
              onMouseEnter={() => sounds.playHover()}
              className="w-full p-2.5 rounded bg-gradient-to-r from-cyan-500 to-rose-500 text-slate-950 hover:opacity-95 font-mono font-bold text-xs uppercase tracking-widest cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
            >
              ⚡ PROVISION AGENT IN CORE ARRAY
            </button>
          </form>
        ) : selectedAgent ? (
          /* Active Agent Execution Sandbox */
          <div className={`flex flex-col rounded-xl border bg-slate-950 shadow-2xl relative overflow-hidden transition-all duration-500 h-[525px] ${
            isRgbOverdrive 
              ? "border-rose-500/60 shadow-[0_0_25px_rgba(244,63,94,0.15)]" 
              : "border-slate-800"
          }`}>
            
            {/* Workbench Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 py-3 bg-slate-900/90 border-b border-slate-800 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl bg-slate-950 p-1 rounded border border-slate-800">{selectedAgent.avatar}</span>
                <div>
                  <div className="text-[10px] font-mono font-bold tracking-widest text-rose-400 uppercase">
                    🛠️ AGENT_WORKBENCH
                  </div>
                  <h3 className="text-sm font-mono font-bold tracking-tight text-slate-100 uppercase mt-0.5">
                    {selectedAgent.name}
                  </h3>
                </div>
              </div>

              {/* Status display */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-slate-500">PRECISION COEFFICIENT:</span>
                <span className="text-xs font-mono text-rose-400 font-bold bg-slate-950 border border-slate-800 px-2 py-0.5 rounded">
                  {selectedAgent.precision}%
                </span>
              </div>
            </div>

            {/* Main console sandbox interface */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-slate-950 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {/* Directives and configurations panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Custom system directives */}
                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-850 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                      System Prompt Directives
                    </span>
                    <p className="text-[11px] font-mono text-slate-300 leading-normal italic text-slate-400">
                      "{selectedAgent.systemPrompt}"
                    </p>
                  </div>
                  <div className="mt-3.5 pt-2 border-t border-slate-850 text-[9px] font-mono text-slate-500 flex justify-between">
                    <span>PRIMARY FEED: {selectedAgent.primaryInput.toUpperCase()}</span>
                    <span>CYCLES: {selectedAgent.brainCycles}c</span>
                  </div>
                </div>

                {/* Simulated inputs controller */}
                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-850 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mb-2">
                      Choose Source Input Feed
                    </span>
                    <select
                      value={selectedInputFeed}
                      onChange={(e) => {
                        sounds.playClick();
                        setSelectedInputFeed(e.target.value);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs font-mono text-cyan-400 cursor-pointer focus:outline-none"
                    >
                      {getInputFeeds(selectedAgent).map((feedName, i) => (
                        <option key={i} value={feedName}>
                          📂 {feedName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-2">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                      Optional Console Query prompt
                    </span>
                    <input
                      type="text"
                      value={customUserPrompt}
                      onChange={(e) => setCustomUserPrompt(e.target.value)}
                      placeholder="e.g. Highlight anomalous traffic vectors or issues..."
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] font-mono text-slate-300 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {/* RUN AGENT TRIGGER BUTTON */}
              <button
                onClick={handleExecuteAgent}
                disabled={isExecuting}
                onMouseEnter={() => sounds.playHover()}
                className={`w-full p-3 rounded-lg font-mono font-bold text-xs uppercase tracking-widest cursor-pointer transition-all flex items-center justify-center gap-2 border ${
                  isExecuting
                    ? "bg-rose-500/15 border-rose-500/30 text-rose-400 cursor-not-allowed animate-pulse"
                    : "bg-gradient-to-r from-rose-500 via-pink-500 to-cyan-500 hover:opacity-95 text-slate-950 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                }`}
              >
                <Activity className={`w-4.5 h-4.5 ${isExecuting ? "animate-spin" : ""}`} />
                {isExecuting ? "EXECUTING NEURAL MATRIX LOOPS..." : `SPAWN & RUN ${selectedAgent.name.toUpperCase()} PROCESS`}
              </button>

              {/* Execution feedback section */}
              {terminalLogs.length > 0 && (
                <div className="flex-1 border border-slate-850 bg-slate-950 rounded-xl overflow-hidden flex flex-col h-[180px] min-h-[140px]">
                  {/* Logs title */}
                  <div className="px-3.5 py-1.5 bg-slate-900 border-b border-slate-850 flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold text-slate-400 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> LIVE TERMINAL OUTPUT INDEX
                    </span>
                    <span className="text-[8px] font-mono text-slate-500">
                      SECURE BUFFER // PORT 3000
                    </span>
                  </div>

                  {/* Log stream lines */}
                  <div className="flex-1 p-3 overflow-y-auto space-y-1 font-mono text-[10px] text-slate-400 bg-slate-950 select-text scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                    {terminalLogs.map((log, idx) => (
                      <div key={idx} className="flex gap-2 leading-relaxed">
                        <span className="text-slate-600">[{idx + 1}]</span>
                        <span className={log.includes("SYSTEM") ? "text-cyan-400 font-bold" : log.includes("COMPLETE") ? "text-emerald-400 font-bold" : "text-slate-300"}>
                          {log}
                        </span>
                      </div>
                    ))}
                    <div ref={logsEndRef} />
                  </div>
                </div>
              )}

              {/* Specialized data output deck when complete */}
              {taskCompleted && (
                <div className="border border-emerald-500/30 bg-emerald-500/5 rounded-xl p-4 space-y-3 shadow-lg transition-all duration-500 animate-fade-in">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-emerald-500/20 pb-2 gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                        🟢 TARGET_FUNCTIONS_RESOLVED
                      </span>
                    </div>

                    {/* Output function tabs */}
                    <div className="flex gap-1 bg-slate-950 p-0.5 rounded border border-slate-800">
                      {selectedAgent.functions.map((func) => {
                        const isTabActive = activeOutputTab === func;
                        return (
                          <button
                            key={func}
                            onClick={() => {
                              sounds.playClick();
                              setActiveOutputTab(func);
                            }}
                            className={`px-2 py-0.5 rounded text-[8px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
                              isTabActive
                                ? "bg-emerald-500 text-slate-950"
                                : "text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            {func}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Render simulated output matrix */}
                  <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-850 relative">
                    {renderAgentOutputs()}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-[525px] flex items-center justify-center text-slate-500 font-mono text-xs">
            SELECT AN AGENT SCHEMATIC FROM THE CORES REGISTRY.
          </div>
        )}
      </div>
    </div>
  );
};
