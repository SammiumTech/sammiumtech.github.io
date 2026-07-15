import React, { useState } from "react";
import { 
  KanbanSquare, 
  Sparkles, 
  ArrowRight, 
  Mail, 
  Clock, 
  ListTodo, 
  CheckCircle, 
  Copy, 
  Check, 
  ChevronRight 
} from "lucide-react";
import { SammiumResponse, KanbanTask } from "../types";

export default function SammiumSim() {
  const [rawInput, setRawInput] = useState<string>(
    "Prepare the community meeting deck for Botolan water system. Design 5 slides about budget and logistics (takes about 4 hours). Need to draft a brief status update email to the Barangay captain. I also need to review the leaflet integration code (takes 2 hours) on Thursday."
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Default demo state
  const [result, setResult] = useState<SammiumResponse | null>({
    totalEstimatedHours: 6,
    topPriorities: [
      "Design 5 slides for water system logistics",
      "Draft status update email to Barangay Captain"
    ],
    kanbanTasks: [
      {
        title: "Figma Slides: Water Logistics",
        description: "Create 5 slide designs detailing localized budget estimates and logistics pathing.",
        priority: "High",
        estimatedHours: 4,
        tag: "Design",
        status: "To Do"
      },
      {
        title: "Code Review: Leaflet Maps",
        description: "Review and refactor the geographical leaflet mapping marker clustering module.",
        priority: "Medium",
        estimatedHours: 2,
        tag: "Dev",
        status: "In Progress"
      }
    ],
    draftEmail: {
      subject: "PROJECT UPDATE: Botolan Water Logistics Deck & Code Refactor",
      body: "Hi Captain,\n\nI hope this email finds you well. I wanted to share a brief update on our progress.\n\nI am currently finalizing the logistics deck designs, which cover the local water systems. Additionally, we are completing a code review on the interactive maps to ensure seamless marker loading. I anticipate wrapping this up shortly and will present the full designs to you soon.\n\nBest regards,\nSam Lopez"
    }
  });

  const handleOrchestrate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/sammium/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawInputText: rawInput })
      });
      if (!response.ok) {
        throw new Error("Failed to contact the Sammium Intelligence node.");
      }
      const data = await response.json();
      
      // Inject "To Do" as initial status for all parsed tasks
      const tasksWithStatus = data.kanbanTasks.map((t: KanbanTask) => ({
        ...t,
        status: "To Do"
      }));
      
      setResult({
        ...data,
        kanbanTasks: tasksWithStatus
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Click-to-move task staging
  const moveTask = (taskIndex: number) => {
    if (!result) return;
    const statuses: Array<"To Do" | "In Progress" | "Review" | "Done"> = ["To Do", "In Progress", "Review", "Done"];
    const updatedTasks = [...result.kanbanTasks];
    const currentStatus = updatedTasks[taskIndex].status || "To Do";
    const nextIdx = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    updatedTasks[taskIndex].status = statuses[nextIdx];
    setResult({ ...result, kanbanTasks: updatedTasks });
  };

  const copyEmail = () => {
    if (!result) return;
    navigator.clipboard.writeText(`${result.draftEmail.subject}\n\n${result.draftEmail.body}`);
    setCopiedIndex(true);
    setTimeout(() => setCopiedIndex(false), 2000);
  };

  return (
    <div className="space-y-6" id="sammium-sim">
      <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 neon-glow-purple">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div>
            <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Simulation Portal
            </span>
            <h3 className="font-display text-lg font-bold text-white mt-1">
              Sammium AI Workspace Parser
            </h3>
          </div>
          <div className="text-slate-400 text-xs font-mono">
            Powered by <span className="text-purple-400 font-semibold">Gemini 3.5 Flash</span>
          </div>
        </div>

        {/* Input Text Area */}
        <div className="space-y-2 mb-4">
          <label className="block text-xs font-mono text-slate-400 uppercase">
            Messy Thoughts, Chat Logs, or Draft Notes
          </label>
          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            className="w-full h-28 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 rounded p-3 text-xs focus:outline-none focus:border-purple-500 transition font-sans leading-relaxed"
            placeholder="Type your messy tasks here..."
          />
          <span className="text-[10px] text-slate-500 italic block">
            Tip: Include dynamic mentions of tasks, approximate hours, or email recipients.
          </span>
        </div>

        <button
          onClick={handleOrchestrate}
          disabled={loading || !rawInput.trim()}
          className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-semibold text-xs tracking-wider uppercase shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition duration-300 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              ORCHESTRATING WORKSPACE...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              ORCHESTRATE WORKSPACE ITEMS
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-950/50 border border-red-900/60 text-red-200 text-xs font-mono">
          ⚠️ {error}
        </div>
      )}

      {/* Structured Result Display */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Key Metrics and Priorities */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-850 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-mono block">ESTIMATED EFFORT</span>
                <span className="text-lg font-bold text-white font-display">{result.totalEstimatedHours} hours</span>
              </div>
            </div>

            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-850 md:col-span-2 space-y-1.5">
              <span className="text-[10px] text-slate-500 font-mono block">AI DETECTED CORE FOCUS</span>
              <ul className="text-xs text-slate-300 space-y-1 font-sans">
                {result.topPriorities.map((p, i) => (
                  <li key={i} className="flex items-center gap-1.5 truncate">
                    <ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Kanban Board Simulation */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Interactive Kanban Board</span>
              <span className="text-[10px] text-slate-500 italic font-sans">Click on any task to cycle its columns</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Columns */}
              {(["To Do", "In Progress", "Review", "Done"] as const).map((column) => {
                const columnTasks = result.kanbanTasks.filter((t) => (t.status || "To Do") === column);
                
                return (
                  <div key={column} className="bg-slate-950/40 rounded-xl border border-slate-850 p-3 min-h-[160px] flex flex-col space-y-2.5">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-1.5 mb-1">
                      <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          column === "To Do" ? "bg-slate-400" :
                          column === "In Progress" ? "bg-blue-400" :
                          column === "Review" ? "bg-purple-400" : "bg-emerald-400"
                        }`} />
                        {column}
                      </span>
                      <span className="text-[10px] bg-slate-900 text-slate-400 px-1.5 py-0.2 rounded font-mono font-medium">
                        {columnTasks.length}
                      </span>
                    </div>

                    <div className="flex-1 space-y-2">
                      {columnTasks.map((task) => {
                        const globalIndex = result.kanbanTasks.findIndex((t) => t.title === task.title);
                        return (
                          <div
                            key={globalIndex}
                            onClick={() => moveTask(globalIndex)}
                            className="p-2.5 bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-lg cursor-pointer transition shadow-sm hover:shadow-purple-500/5 select-none space-y-2"
                          >
                            <div className="flex justify-between items-start gap-1">
                              <span className="text-[9px] font-mono uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1 py-0.2 rounded">
                                {task.tag}
                              </span>
                              <span className={`text-[9px] font-mono font-bold ${
                                task.priority === "High" ? "text-red-400" :
                                task.priority === "Medium" ? "text-amber-400" : "text-slate-400"
                              }`}>
                                {task.priority}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold text-white leading-snug font-sans">{task.title}</h4>
                              <p className="text-[11px] text-slate-400 font-sans mt-1 line-clamp-2">{task.description}</p>
                            </div>
                            <div className="flex justify-between items-center pt-1.5 border-t border-slate-950 text-[9px] font-mono text-slate-500">
                              <span>⏱️ {task.estimatedHours}h</span>
                              <span className="text-purple-400 flex items-center gap-0.5">Move <ArrowRight className="w-2.5 h-2.5" /></span>
                            </div>
                          </div>
                        );
                      })}
                      {columnTasks.length === 0 && (
                        <div className="h-full flex items-center justify-center border border-dashed border-slate-850 rounded-lg py-6 text-center">
                          <span className="text-[10px] text-slate-600 font-mono">Empty</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Draft Email Generator Output */}
          <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-purple-400" />
                Draft Executive Email / Memo
              </span>
              <button
                onClick={copyEmail}
                className="py-1 px-2.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-[10px] transition flex items-center gap-1"
              >
                {copiedIndex ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    COPIED
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    COPY MEMO
                  </>
                )}
              </button>
            </div>
            
            <div className="space-y-1.5 font-mono text-[11px] bg-slate-950 p-3 rounded border border-slate-850 text-slate-300">
              <p><strong className="text-slate-400">SUBJECT:</strong> {result.draftEmail.subject}</p>
              <div className="w-full h-px bg-slate-900 my-2" />
              <p className="whitespace-pre-wrap leading-relaxed font-sans text-xs pt-1">
                {result.draftEmail.body}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
