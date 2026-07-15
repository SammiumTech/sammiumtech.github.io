import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { 
  BookOpen, 
  FileText, 
  Folder, 
  Compass, 
  Search, 
  Plus, 
  Trash2, 
  Sparkles, 
  HelpCircle, 
  Send, 
  GraduationCap, 
  Layers, 
  ChevronRight, 
  Check, 
  MessageSquare,
  Bookmark,
  Share2,
  Calendar,
  User,
  Tags,
  Sliders,
  Database
} from "lucide-react";
import { motion } from "motion/react";
import { sounds } from "../utils/sounds";

export interface KnowledgeDoc {
  id: string;
  type: "Research Paper" | "Documentation" | "Experiment" | "Tutorial";
  title: string;
  category: string;
  author: string;
  year: string;
  summary: string;
  content: string;
  tags: string[];
  isCustom?: boolean;
}

const DEFAULT_DOCUMENTS: KnowledgeDoc[] = [
  {
    id: "paper-quantum-sync",
    type: "Research Paper",
    title: "Dynamic Neural Synchronization in Quantum Bio-Fields",
    category: "Agriculture Intelligence",
    author: "Dr. S. Sammium & Dr. L. Thorne",
    year: "2026",
    tags: ["Quantum Net", "Bio-Sensors", "Agriculture"],
    summary: "A fundamental framework proposing decentralized neural weight synchrony between crop-monitoring drone nodes and terrestrial bio-reactors, optimizing yield estimation by 43.6%.",
    content: `### 1. Abstract
The integration of multi-agent cognitive arrays into dry-land agriculture requires adaptive communication buffers. We present a novel protocol for real-time synchronization of neural weight lattices across low-power telemetry receivers operating in quantum-entangled or pseudo-random frequency bands.

### 2. Quantum Lattices in Swarms
Swarm drones (e.g., *Project Ceres Swarm*) periodically exchange local gradient vectors. The synchrony constant is formulated as:
\`\`\`
ω_i = Σ A_ij * sin(θ_j - θ_i)
\`\`\`
Where A_ij is the local bio-field coupling parameter of the sensor array.

### 3. Key Findings
- Yield estimations were improved by 43.6% in trials across arid regions.
- High-vibration scenarios (above 40Hz) are mitigated by dynamic low-frequency filters.`
  },
  {
    id: "paper-biosensing",
    type: "Research Paper",
    title: "Predictive Biosensing and Localized Community Healthcare Networks",
    category: "Healthcare AI",
    author: "Dr. S. Sammium & Prof. H. Vance",
    year: "2025",
    tags: ["Healthcare AI", "Biosensing", "Wearables"],
    summary: "Investigation into wearable biosensors linked with smart helmet active HUD displays to automate triage of carbon-monoxide exposure in deep subterranean habitats.",
    content: `### 1. Executive Summary
This paper outlines our efforts in community-based healthcare systems. By binding non-invasive dermal receptors to miniature neural nodes, we can map localized telemetry to active heads-up displays (HUDs) for rapid emergency response.

### 2. Physical Sensing Architecture
We monitor three primary health vectors:
1. Blood Oxygen Saturation (SpO2)
2. Coaxial Heart Rate Dynamics
3. Ambient Carbon Monoxide Exposure

If localized nodes detect oxygen levels dropping below 92%, an active HUD alarm triggers immediately to prompt immediate ascent.

### 3. Implementation and Safety Drill Results
- Response latency dropped under 450ms.
- True-positive safety alerts reached 99.8% precision.`
  },
  {
    id: "doc-core-protocols",
    type: "Documentation",
    title: "Sammium-v5.0 Core Node Protocols",
    category: "Community Systems",
    author: "Sammium System Architects",
    year: "2026",
    tags: ["API", "Decentralized", "Node Protocols"],
    summary: "Technical interface and API specifications for setting up and binding decentralized intelligence hubs to localized public infrastructure grids.",
    content: `### Sammium-v5.0 API Integration Guide

This document covers setup instructions for community nodes connecting on Port 3000.

#### 1. Node Registration Payload
To register a new decentralized hub, issue a POST request to:
\`\`\`json
POST /api/nodes/register
\`\`\`
Payload schema:
\`\`\`json
{
  "nodeId": "omega-hub-7",
  "location": "North Sector Grid",
  "capabilities": ["sensing", "summarization"],
  "securityKey": "SECURE_LATTICE_KEY"
}
\`\`\`

#### 2. Network Stability Standard
Nodes maintain a persistent socket ping. If ping drops above 120ms, the system initiates an automatic bypass, routing vital telemetry through alternate adjacent nodes.`
  },
  {
    id: "tutorial-calibration",
    type: "Tutorial",
    title: "Calibrating Multi-Agent Swarm Joint Matrices",
    category: "Robotic Swarms",
    author: "M. Ramirez, Lead Robotics Tech",
    year: "2026",
    tags: ["Swarm", "Robotics", "Tutorial"],
    summary: "A practical walkthrough for engineering technicians to align, tune, and calibrate physical joint tolerances on autonomous robotic drone arms.",
    content: `### Joint Alignment Calibration Protocol

Follow these sequential steps to align robotic arms after assembly:

#### Step 1: Engage Zero-State Torque
Turn off external power feeds, leaving only backing capacitor reserves active. The indicator light should pulse soft magenta.

#### Step 2: Launch Calibration Sequence
From your workspace terminal, execute:
\`\`\`bash
npm run calibrate --swarm=ceres-arm-1
\`\`\`
The joint matrices will shift through five axes of freedom.

#### Step 3: Verify Alignment Readout
Check that standard joint tolerances are within +/- 0.05 mm bounds. If any axis exceeds this, replace the titanium actuator spacer immediately.`
  }
];

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  time: string;
}

export const KnowledgeCore: React.FC<{ isRgbOverdrive: boolean }> = ({ isRgbOverdrive }) => {
  const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDoc | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");

  // Form states for creating new document
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<"Research Paper" | "Documentation" | "Experiment" | "Tutorial">("Research Paper");
  const [newCategory, setNewCategory] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newYear, setNewYear] = useState("2026");
  const [newSummary, setNewSummary] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTagsInput, setNewTagsInput] = useState("");

  // Chat/Ask states
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentQuery, setCurrentQuery] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load and save from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sammium_knowledge_docs");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDocuments(parsed);
        if (parsed.length > 0) setSelectedDoc(parsed[0]);
      } catch (e) {
        setDocuments(DEFAULT_DOCUMENTS);
        setSelectedDoc(DEFAULT_DOCUMENTS[0]);
      }
    } else {
      setDocuments(DEFAULT_DOCUMENTS);
      setSelectedDoc(DEFAULT_DOCUMENTS[0]);
    }

    // Set initial welcome chat
    const initialWelcome: ChatMessage = {
      sender: "ai",
      text: "Welcome to the Sammium Research Knowledge Core. I am Dr. Sammium, your chief AI research counselor. You can search our repository of papers, documentation, experiments, and tutorials, or ask me any question directly. \n\n*Try asking me: 'What AI technologies are we exploring?'*",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory([initialWelcome]);
  }, []);

  const saveToStorage = (updated: KnowledgeDoc[]) => {
    localStorage.setItem("sammium_knowledge_docs", JSON.stringify(updated));
  };

  // Add document
  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSummary || !newContent) {
      sounds.playError();
      return;
    }

    sounds.playLaser();
    const parsedTags = newTagsInput
      ? newTagsInput.split(",").map(t => t.trim()).filter(Boolean)
      : ["General"];

    const newDoc: KnowledgeDoc = {
      id: "doc-" + Date.now(),
      type: newType,
      title: newTitle,
      category: newCategory || "Uncategorized",
      author: newAuthor || "Dr. Sammium",
      year: newYear || "2026",
      summary: newSummary,
      content: newContent,
      tags: parsedTags,
      isCustom: true
    };

    const updated = [newDoc, ...documents];
    setDocuments(updated);
    saveToStorage(updated);
    setSelectedDoc(newDoc);
    setIsAdding(false);

    // Reset Form
    setNewTitle("");
    setNewType("Research Paper");
    setNewCategory("");
    setNewAuthor("");
    setNewYear("2026");
    setNewSummary("");
    setNewContent("");
    setNewTagsInput("");
  };

  // Delete document
  const handleDeleteDoc = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playError();
    const updated = documents.filter(doc => doc.id !== id);
    setDocuments(updated);
    saveToStorage(updated);
    if (selectedDoc?.id === id) {
      setSelectedDoc(updated[0] || null);
    }
  };

  // Ask AI function
  const handleAskAi = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || isAiLoading) return;

    sounds.playClick();
    setCurrentQuery("");
    
    const userMsg: ChatMessage = {
      sender: "user",
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory(prev => [...prev, userMsg]);
    setIsAiLoading(true);
    setAiError(null);

    try {
      const res = await fetch("/api/knowledge/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: trimmed,
          documents: documents // Sends library context so the server can ground itself
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to communicate with research node.");
      }

      sounds.playLaser();
      const aiMsg: ChatMessage = {
        sender: "ai",
        text: data.text || "I was unable to synthesize a response at this time.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      sounds.playError();
      setAiError(err.message || "Lost synchronization with the AI brain.");
      const errorMsg: ChatMessage = {
        sender: "ai",
        text: "🚨 *Cognitive Transmission Error:* " + (err.message || "The research core server did not respond."),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isAiLoading]);

  // Filtered documents
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === "All" || doc.type === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="knowledge-core-station">
      {/* Column 1: Document Deck (Librarian Desk) */}
      <div className="xl:col-span-4 flex flex-col gap-4">
        <div className={`p-4 rounded-xl border bg-slate-900/95 shadow-xl relative overflow-hidden transition-all duration-300 ${
          isRgbOverdrive ? "border-pink-500/40 ring-2 ring-pink-500/10" : "border-slate-800"
        }`}>
          {/* Grid background decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(#ec4899_0.8px,transparent_0.8px)] [background-size:14px_14px] opacity-10 pointer-events-none" />

          <div className="relative z-10 flex flex-col h-[560px]">
            {/* Header Desk Controls */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-pink-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-pink-500 animate-pulse" /> [ KNOWLEDGE_DECK ]
              </h3>
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsAdding(!isAdding);
                }}
                className="p-1 px-2.5 rounded bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-[10px] font-mono text-pink-400 font-bold flex items-center gap-1 cursor-pointer transition-all shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                FILE DOC
              </button>
            </div>

            {/* Search inputs */}
            <div className="flex flex-col gap-2 mb-4 shrink-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search title, tags, summary..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500 rounded p-2 pl-8 text-xs font-mono text-slate-100 focus:outline-none placeholder-slate-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-3" />
              </div>

              {/* Type Filter Buttons */}
              <div className="grid grid-cols-5 gap-1">
                {["All", "Research Paper", "Documentation", "Experiment", "Tutorial"].map((type) => {
                  const label = type === "Research Paper" ? "Paper" : type === "Documentation" ? "Docs" : type === "Experiment" ? "Exps" : type === "Tutorial" ? "Tuts" : "All";
                  const isSelected = selectedType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedType(type);
                      }}
                      className={`p-1 text-[9px] font-mono rounded text-center border cursor-pointer truncate transition-all ${
                        isSelected
                          ? "bg-pink-500/20 border-pink-500/50 text-pink-400 font-bold"
                          : "bg-slate-950/60 border-slate-850 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Document Cards List */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {filteredDocs.map((doc) => {
                const isSelected = selectedDoc?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedDoc(doc);
                      setIsAdding(false);
                    }}
                    onMouseEnter={() => sounds.playHover()}
                    className={`p-3 rounded-lg border text-left transition-all relative cursor-pointer group ${
                      isSelected
                        ? "bg-slate-950 border-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.15)]"
                        : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-0 left-0 w-1 h-full bg-pink-500 rounded-l-md" />
                    )}

                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase shrink-0 ${
                        doc.type === "Research Paper"
                          ? "bg-pink-500/10 border border-pink-500/20 text-pink-400"
                          : doc.type === "Documentation"
                          ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
                          : doc.type === "Experiment"
                          ? "bg-purple-500/10 border border-purple-500/20 text-purple-400"
                          : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                      }`}>
                        {doc.type}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500 shrink-0">{doc.year}</span>
                    </div>

                    <h4 className="text-xs font-mono font-bold tracking-tight text-slate-200 line-clamp-1 group-hover:text-pink-400 transition-colors">
                      {doc.title}
                    </h4>

                    <p className="text-[10px] text-slate-400 font-mono line-clamp-2 mt-1 leading-relaxed">
                      {doc.summary}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doc.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[8px] font-mono text-slate-500 px-1 py-0.5 bg-slate-950/40 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Delete button for custom files */}
                    {doc.isCustom && (
                      <button
                        onClick={(e) => handleDeleteDoc(doc.id, e)}
                        title="Delete custom file from matrix"
                        className="absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 rounded transition-all cursor-pointer bg-slate-950/80"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}

              {filteredDocs.length === 0 && (
                <div className="text-center py-16 text-slate-500 font-mono text-xs">
                  NO CORRESPONDING FILES RETRIEVED in matrix search.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Column 2: Document Reader (Middle) & Ask AI Chat (Right) */}
      <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Middle: Document Reader Viewport */}
        <div className="md:col-span-7 flex flex-col gap-4">
          {isAdding ? (
            /* File New Document Form */
            <form
              onSubmit={handleAddDoc}
              className={`p-5 rounded-xl border bg-slate-900/95 shadow-2xl relative transition-all duration-300 h-[560px] overflow-y-auto flex flex-col justify-between ${
                isRgbOverdrive ? "border-cyan-glow ring-2 ring-cyan-500/10" : "border-slate-800"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-cyan-400" /> [ INJECT_KNOWLEDGE_DOCUMENT ]
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setIsAdding(false);
                    }}
                    className="text-slate-500 hover:text-slate-300 font-mono text-xs cursor-pointer"
                  >
                    CANCEL
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-[9px] font-mono text-slate-400 mb-1 uppercase">Title:</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Bio-Swarm Flight Vectors"
                      required
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-1.5 text-xs font-mono text-cyan-300 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-slate-400 mb-1 uppercase">Doc Type:</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-1.5 text-xs font-mono text-cyan-300 focus:outline-none cursor-pointer"
                    >
                      <option value="Research Paper">Research Paper</option>
                      <option value="Documentation">Documentation</option>
                      <option value="Experiment">Experiment</option>
                      <option value="Tutorial">Tutorial</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="col-span-2">
                    <label className="block text-[9px] font-mono text-slate-400 mb-1 uppercase">Category:</label>
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="e.g. Healthcare AI"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-1.5 text-xs font-mono text-cyan-300 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-slate-400 mb-1 uppercase">Year:</label>
                    <input
                      type="text"
                      value={newYear}
                      onChange={(e) => setNewYear(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-1.5 text-xs font-mono text-cyan-300 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-[9px] font-mono text-slate-400 mb-1 uppercase">Author / Source:</label>
                    <input
                      type="text"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="e.g. Dr. Sammium"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-1.5 text-xs font-mono text-cyan-300 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-slate-400 mb-1 uppercase">Tags (Comma Sep):</label>
                    <input
                      type="text"
                      value={newTagsInput}
                      onChange={(e) => setNewTagsInput(e.target.value)}
                      placeholder="e.g. Flight, UAV, Drone"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-1.5 text-xs font-mono text-cyan-300 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-[9px] font-mono text-slate-400 mb-1 uppercase">One-sentence Summary:</label>
                  <input
                    type="text"
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                    placeholder="Brief description for search lists..."
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-1.5 text-xs font-mono text-cyan-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-slate-400 mb-1 uppercase">Full Content (Markdown supported):</label>
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows={6}
                    required
                    placeholder="### 1. Abstract\nDetailed engineering formulations or guides go here..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded p-1.5 text-xs font-mono text-cyan-300 focus:outline-none resize-none h-[140px] scrollbar-thin scrollbar-thumb-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                onMouseEnter={() => sounds.playHover()}
                className="w-full p-2.5 rounded bg-gradient-to-r from-cyan-500 to-pink-500 text-slate-950 hover:opacity-95 font-mono font-bold text-xs uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all shrink-0 mt-3"
              >
                💾 INTEGRATE DOCUMENT INTO SCIENTIFIC INDEX
              </button>
            </form>
          ) : selectedDoc ? (
            /* Document Reader Screen */
            <div className={`flex flex-col rounded-xl border bg-slate-950 shadow-2xl relative overflow-hidden transition-all duration-500 h-[560px] ${
              isRgbOverdrive ? "border-pink-500/60 shadow-[0_0_25px_rgba(244,63,94,0.08)]" : "border-slate-800"
            }`}>
              {/* Document Header details */}
              <div className="p-4 bg-slate-900/95 border-b border-slate-800 flex flex-col gap-2 shrink-0">
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                    selectedDoc.type === "Research Paper"
                      ? "bg-pink-500/10 border border-pink-500/20 text-pink-400"
                      : selectedDoc.type === "Documentation"
                      ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
                      : selectedDoc.type === "Experiment"
                      ? "bg-purple-500/10 border border-purple-500/20 text-purple-400"
                      : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                  }`}>
                    {selectedDoc.type}
                  </span>
                  <span>/</span>
                  <span className="text-cyan-400 font-bold">{selectedDoc.category}</span>
                </div>

                <h2 className="text-sm md:text-base font-mono font-bold text-slate-100 uppercase tracking-tight leading-snug">
                  {selectedDoc.title}
                </h2>

                {/* Meta details line */}
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-pink-500" /> {selectedDoc.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-500" /> {selectedDoc.year}
                  </span>
                  <span className="flex items-center gap-1">
                    <Database className="w-3.5 h-3.5 text-purple-500" /> Citation Index: {selectedDoc.isCustom ? "Local Node" : "Sammium Core-Q"}
                  </span>
                </div>
              </div>

              {/* Reader Body Viewport */}
              <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-850 mb-5">
                  <span className="text-[9px] font-mono text-pink-400 uppercase tracking-wider block mb-1">
                    [ EXECUTIVE SUMMARY ]
                  </span>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed">
                    {selectedDoc.summary}
                  </p>
                </div>

                {/* Full text markdown parser */}
                <div className="markdown-body text-xs font-mono text-slate-300 leading-relaxed space-y-4">
                  <ReactMarkdown>{selectedDoc.content}</ReactMarkdown>
                </div>

                {/* Tags line */}
                <div className="flex flex-wrap gap-1.5 mt-8 pt-4 border-t border-slate-850">
                  {selectedDoc.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-[9px] font-mono text-pink-400 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reader status bar */}
              <div className="p-3 bg-slate-900/90 border-t border-slate-800 text-[9px] font-mono text-slate-500 flex justify-between items-center shrink-0">
                <span>INDEX_LOC_HEX: {(selectedDoc.id).toUpperCase()}</span>
                <span className="text-emerald-400">🟢 LOCAL NODE ONLINE</span>
              </div>
            </div>
          ) : (
            <div className="h-[560px] border border-slate-800 rounded-xl bg-slate-950 flex flex-col items-center justify-center text-center p-8">
              <BookOpen className="w-10 h-10 text-slate-700 animate-spin-slow mb-3" />
              <p className="text-xs text-slate-500 font-mono">
                Select a document from the left deck or add a new concept file to initialize reader protocols.
              </p>
            </div>
          )}
        </div>

        {/* Right: Ask Sammium Research AI Chat */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div className={`flex flex-col rounded-xl border bg-slate-950 shadow-2xl relative overflow-hidden transition-all duration-500 h-[560px] ${
            isRgbOverdrive ? "border-pink-500/60 shadow-[0_0_25px_rgba(244,63,94,0.08)]" : "border-slate-800"
          }`}>
            {/* AI Console Header */}
            <div className="px-3.5 py-3 bg-slate-900/95 border-b border-slate-800 flex justify-between items-center shrink-0">
              <div>
                <span className="text-[9px] font-mono font-bold text-pink-400 tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-pulse" /> ASK_SAMMIUM_RESEARCH
                </span>
                <span className="text-[8px] font-mono text-slate-500 block mt-0.5">Grounding over active library docs</span>
              </div>
              <span className="text-[8px] font-mono text-slate-500 font-bold bg-slate-950 px-1.5 py-0.5 rounded border border-slate-850">
                GEMINI 3.5
              </span>
            </div>

            {/* Chat Messages Viewport */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {chatHistory.map((msg, i) => {
                const isAi = msg.sender === "ai";
                return (
                  <div
                    key={i}
                    className={`flex flex-col max-w-[85%] ${
                      isAi ? "mr-auto items-start" : "ml-auto items-end"
                    }`}
                  >
                    <div className="text-[8px] font-mono text-slate-500 mb-1 px-1">
                      {isAi ? "DR. SAMMIUM" : "RESEARCHER"} • {msg.time}
                    </div>
                    <div className={`p-2.5 rounded-lg border font-mono text-[10px] leading-relaxed text-left ${
                      isAi 
                        ? "bg-slate-900 border-slate-800 text-slate-200" 
                        : "bg-pink-500/10 border-pink-500/30 text-pink-300"
                    }`}>
                      <div className="markdown-body">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isAiLoading && (
                <div className="flex flex-col items-start max-w-[85%] mr-auto">
                  <div className="text-[8px] font-mono text-pink-400 animate-pulse mb-1 px-1">
                    DR. SAMMIUM IS SYNTHESIZING...
                  </div>
                  <div className="p-3 rounded-lg border bg-slate-900 border-slate-800 text-slate-400 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Presets and Chat Inputs */}
            <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex flex-col gap-2 shrink-0">
              {/* Presets labels for quick questions */}
              <div className="space-y-1">
                <span className="text-[8px] font-mono text-slate-500 block uppercase select-none">
                  ⚡ Recommended Inquiries:
                </span>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleAskAi("What AI technologies are we exploring?")}
                    className="p-1 px-1.5 text-[8px] text-left font-mono bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-pink-500/40 text-slate-400 hover:text-pink-400 rounded transition-all cursor-pointer truncate"
                  >
                    &gt; What AI technologies are we exploring?
                  </button>
                  <button
                    onClick={() => handleAskAi("Tell me about our agricultural drone swarms")}
                    className="p-1 px-1.5 text-[8px] text-left font-mono bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-400 rounded transition-all cursor-pointer truncate"
                  >
                    &gt; Tell me about our agricultural drone swarms
                  </button>
                </div>
              </div>

              {/* Chat Input form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskAi(currentQuery);
                }}
                className="flex gap-1.5 border-t border-slate-800 pt-2 mt-1"
              >
                <input
                  type="text"
                  value={currentQuery}
                  onChange={(e) => setCurrentQuery(e.target.value)}
                  placeholder="Ask about AI focus or papers..."
                  disabled={isAiLoading}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[10px] font-mono text-pink-300 placeholder-slate-600 focus:outline-none focus:border-pink-500/50"
                />
                <button
                  type="submit"
                  disabled={isAiLoading || !currentQuery.trim()}
                  className="p-1.5 px-3 bg-pink-500 text-slate-950 font-bold rounded text-[10px] font-mono hover:opacity-90 disabled:opacity-30 cursor-pointer shrink-0 flex items-center justify-center"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
