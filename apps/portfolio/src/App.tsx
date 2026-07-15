import React, { useState, useEffect } from "react";
import { 
  Terminal, 
  Sparkles, 
  Sprout, 
  BrainCircuit, 
  ChevronRight, 
  ShieldAlert, 
  CheckCircle, 
  Layers, 
  Cpu, 
  Code2, 
  Globe, 
  ExternalLink 
} from "lucide-react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import EarthGuardianSim from "./components/EarthGuardianSim";
import SammiumSim from "./components/SammiumSim";
import SynapseSim from "./components/SynapseSim";
import FarmAISim from "./components/FarmAISim";
import QuantumConsciousnessSim from "./components/QuantumConsciousnessSim";
import CosmosPointer from "./components/CosmosPointer";
import DesignProcess from "./components/DesignProcess";
import VisualTimeline from "./components/VisualTimeline";
import ProjectCaseStudy from "./components/ProjectCaseStudy";
import CalibrationLoader from "./components/CalibrationLoader";
import FlagshipProjects from "./components/FlagshipProjects";
import FlagshipProjectExperience from "./components/FlagshipProjectExperience";
import { Project } from "./types";

const shouldRunCalibration = () => {
  if (typeof window === "undefined") return true;

  const forceCalibration = new URLSearchParams(window.location.search).get("calibrate") === "1";
  if (forceCalibration) return true;

  try {
    return window.sessionStorage.getItem("sammium-interface-calibrated") !== "true";
  } catch {
    return true;
  }
};

const getFlagshipSlugFromHash = () => {
  if (typeof window === "undefined") return null;
  const match = window.location.hash.match(/^#\/projects\/([^/?#]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

export default function App() {
  const [isCalibrating, setIsCalibrating] = useState(shouldRunCalibration);
  const [flagshipProjectSlug, setFlagshipProjectSlug] = useState<string | null>(getFlagshipSlugFromHash);
  const projects: Project[] = [
    {
      id: "quantum-consciousness",
      title: "Quantum Consciousness Core",
      roles: ["Lead AI Architect", "Quantum Simulation Specialist"],
      description: "Infinite cinematic 3D simulation of a superintelligent AI neural conscious state, incorporating matrix aesthetics and quantum particle physics.",
      detailedOverview: "The Quantum Consciousness Core is a movie-quality procedural digital environment simulating active cognitive pathways. Formed from hundreds of glowing emerald and cyan synaptic nodes mapped in true 3D perspective, the system generates real-time floating matrix tensors, mathematical wave formulas, and moving quantum energy discharges. A slow cinematic dolly camera glides through the infinite universe as nodes pulse asynchronously and react to human pointer deflection fields.",
      techStack: ["HTML5 Canvas 3D", "React Hooks", "Biquad Filter Audio Synth", "Matrix Particle Systems", "Spring Physics"],
      category: "Interactive",
      highlights: [
        "Endless procedural generation of volumetric 3D quantum networks",
        "Interactive mouse deflection fields warping space coordinates",
        "Ethereal audio soundscape synthesized directly in-browser using Web Audio API",
        "High-performance render loop locked at 60FPS using requestAnimationFrame"
      ]
    },
    {
      id: "earth-guardian",
      title: "Earth Guardian AI",
      roles: ["Product Designer", "UI/UX Designer", "System Planner"],
      description: "AI-powered disaster management platform for communities and local governments featuring interactive dashboards, mapping, reporting, and analytics.",
      detailedOverview: "Earth Guardian AI acts as an emergency response blueprint generator. Designed specifically to solve real-world disaster management challenges in Botolan, Zambales, the system ingests localized environmental metrics like wind speed and rainfall intensity. Powered by server-side Gemini 3.5 Flash, it outputs custom context-aware checklists with immediate, mid-term, and recovery phases, distributing clear roles among responders.",
      techStack: ["React", "Express.js", "Gemini 3.5 Flash", "Tailwind CSS", "Node.js"],
      category: "AI",
      highlights: [
        "Localized hazard response automation for Botolan and Zambales floodplains",
        "Sensor-triggered response workflows adjusting automatically to wind/rain metrics",
        "Aesthetic dashboard utilizing high-contrast alerts to focus attention during crises"
      ]
    },
    {
      id: "sammium-one",
      title: "Sammium One Workspace",
      roles: ["Product Designer", "UI/UX Designer", "Product Vision"],
      description: "AI-powered productivity workspace designed to unify intelligent workflows, automation, and modern team operations.",
      detailedOverview: "Sammium One acts as an intelligent orchestration core for complex professional workloads. Instead of managing chaotic task lists and back-and-forth updates manually, users can paste a loose, unstructured dump of meeting transcripts, chats, or thoughts. Sammium uses Gemini AI to parse the text into structured Kanban tasks, evaluate effort estimates, prioritize issues, and draft high-fidelity executive update emails ready to copy.",
      techStack: ["Figma", "React", "Express.js", "Gemini 3.5 Flash", "Node.js"],
      category: "Full Stack",
      highlights: [
        "Unstructured brainstorming parsed instantaneously into tidy JSON board schemas",
        "Interactive client-side Kanban board supporting intuitive column transition cycles",
        "AI-composed executive memos matching the exact details and urgency of inputs"
      ]
    },
    {
      id: "synapse",
      title: "Synapse Neural Visualizer",
      roles: ["Product Designer", "Educational UX", "System Planner"],
      description: "Interactive neural network visualization platform that helps students understand AI and machine learning through simulations.",
      detailedOverview: "Synapse is an educational toolkit mapping the underlying mathematics of feedforward artificial neural networks. Built specifically for students and teachers, it bypasses complex code to represent layers, node activations, and weight biases visually. Users can adjust input triggers, toggle activation functions (Sigmoid, ReLU, Tanh), and modify synapses on an interactive SVG canvas to see mathematical outputs cascade instantly.",
      techStack: ["React", "SVG Canvas", "Tailwind CSS", "Educational UX"],
      category: "Education",
      highlights: [
        "Fully client-side reactive feedforward math engine updating instantaneously",
        "Dynamic SVG network diagram illustrating positive/negative synapse weights via neon hues",
        "Interactive slider inputs and function toggles for intuitive learning"
      ]
    },
    {
      id: "farmai",
      title: "FarmAI Co-Pilot",
      roles: ["Product Designer", "UI/UX Designer", "Product Vision"],
      description: "Smart agriculture advisor and sensor telemetry platform optimized for local crop cultivation.",
      detailedOverview: "FarmAI Co-Pilot is an agronomy assistant designed to boost farming yields in Central Luzon. By combining physical factors (ambient temperature, soil moisture) with targeted crop parameters (Rice, Corn, Coconut, Vegetables), the platform processes local telemetry and leverages Gemini to produce structured health ratings, nitrogen prescriptions, and water management protocols.",
      techStack: ["React", "Express.js", "Gemini 3.5 Flash", "Tailwind CSS", "Agronomy APIs"],
      category: "Farming",
      highlights: [
        "Soil humidity and climate sensor calibration presets",
        "Metric-informed safety diagnostics (Optimal, Warning, Critical)",
        "Direct natural language chat consults with an expert virtual agronom Agtech engine"
      ]
    }
  ];

  const [activeProjectId, setActiveProjectId] = useState<string>("quantum-consciousness");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [selectedProjectPage, setSelectedProjectPage] = useState<string | null>(null);

  useEffect(() => {
    const syncRoute = () => setFlagshipProjectSlug(getFlagshipSlugFromHash());
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  // Scroll spy to highlight active nav link on scroll
  useEffect(() => {
    const sections = ["hero", "about", "projects", "skills", "contact"];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for navbar height and visual triggers

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check on mount
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isCalibrating) {
    return <CalibrationLoader onComplete={() => setIsCalibrating(false)} />;
  }

  if (flagshipProjectSlug) {
    return (
      <FlagshipProjectExperience
        slug={flagshipProjectSlug}
        onBack={() => {
          window.location.hash = "featured-projects";
          setFlagshipProjectSlug(null);
        }}
      />
    );
  }

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const filteredProjects = filterCategory === "All" 
    ? projects 
    : projects.filter((p) => p.category === filterCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "AI":
        return <BrainCircuit className="w-4 h-4" />;
      case "Full Stack":
        return <Code2 className="w-4 h-4" />;
      case "Education":
        return <Layers className="w-4 h-4" />;
      case "Farming":
        return <Sprout className="w-4 h-4" />;
      case "Interactive":
        return <Cpu className="w-4 h-4 text-emerald-400 animate-pulse" />;
      default:
        return <Terminal className="w-4 h-4" />;
    }
  };



  if (selectedProjectPage) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-blue-500/30 selection:text-white" id="main-portfolio-root">
        <ProjectCaseStudy projectId={selectedProjectPage} onBack={() => setSelectedProjectPage(null)} />
        <CosmosPointer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-blue-500/30 selection:text-white" id="main-portfolio-root">
      
      {/* 1. Glassmorphic Navigation Header */}
      <Navbar activeSection={activeSection} />

      {/* 2. Main Content Stack */}
      <main className="flex flex-col">
        
        {/* 2a. Cinematic Hero view */}
        <Hero />

        {/* 2a-1. Unified Flagship Projects */}
        <FlagshipProjects
          onOpen={(slug) => {
            window.location.hash = `/projects/${slug}`;
            setFlagshipProjectSlug(slug);
          }}
        />

        {/* 2a-2. Design Process Section */}
        <DesignProcess />

        {/* 2a-3. Visual Timeline Section */}
        <VisualTimeline />

        {/* 2b. Concise Personal Bio & About */}
        <About />

        {/* 2c. Epic Projects Sandbox & Simulator Showcase */}
        <section id="projects" className="py-24 bg-slate-950 border-t border-slate-900 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-12">
            
            {/* Projects Header Title */}
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[10px] tracking-widest uppercase">
                <Code2 className="w-3.5 h-3.5" />
                INTERACTIVE PREVIEW SANDBOX
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Case Studies & Live Simulations
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm font-sans leading-relaxed">
                Interact with high-fidelity frontend simulators of actual projects. Toggle environmental criteria or parse logs to watch the server-side AI engines execute live.
              </p>
            </div>

            {/* Quick Category Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/30 border border-slate-850/80 p-4 rounded-2xl">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase font-semibold">Vertical Filter Presets</span>
                <p className="text-xs text-slate-400 font-sans">Toggle specific developer focuses</p>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {["All", "AI", "Full Stack", "Education", "Farming", "Interactive"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`py-1.5 px-3.5 rounded-xl text-xs font-mono border transition duration-200 cursor-pointer ${
                      filterCategory === cat
                        ? "bg-blue-600/10 border-blue-500 text-blue-300 font-bold shadow-sm"
                        : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-300 hover:bg-slate-900"
                    }`}
                  >
                    {cat === "All" ? "🌌 All Projects" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Workspace Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Story, Roles, Specifications (Col Span 5) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                      {getCategoryIcon(activeProject.category)}
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase font-semibold">{activeProject.category} FOCUS</span>
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">{activeProject.title}</h3>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                    {activeProject.description}
                  </p>

                  {/* Role Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeProject.roles.map((role, i) => (
                      <span key={i} className="text-[10px] bg-slate-900 border border-slate-850 text-slate-300 px-2.5 py-0.5 rounded-full font-mono">
                        ⚙️ {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Technical Blueprint */}
                <div className="p-4 rounded-2xl bg-slate-900/30 border border-slate-850/80 space-y-2.5">
                  <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase block font-semibold">Technical Blueprint</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProject.techStack.map((tech, i) => (
                      <span key={i} className="text-xs bg-slate-950 text-slate-200 border border-slate-900 hover:border-slate-850 px-2 py-1 rounded font-medium transition">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Detailed Narrative */}
                <div className="space-y-3">
                  <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-slate-400 border-b border-slate-900 pb-2">
                    Case Narrative
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans font-normal">
                    {activeProject.detailedOverview}
                  </p>
                </div>

                {/* Key Milestones */}
                <div className="space-y-3">
                  <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-slate-400 border-b border-slate-900 pb-2">
                    Key Deliverables
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
                    {activeProject.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed">
                        <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column: THE LIVE INTERACTIVE PREVIEW SANDBOX (Col Span 7) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs font-bold font-mono text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
                    Interactive Simulator Active
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Live Demo</span>
                </div>

                <div className="rounded-2xl bg-slate-900/20 border border-slate-850 p-1 bg-gradient-to-b from-slate-900/40 to-slate-950 shadow-2xl overflow-hidden">
                  {activeProject.id === "quantum-consciousness" && <QuantumConsciousnessSim />}
                  {activeProject.id === "earth-guardian" && <EarthGuardianSim />}
                  {activeProject.id === "sammium-one" && <SammiumSim />}
                  {activeProject.id === "synapse" && <SynapseSim />}
                  {activeProject.id === "farmai" && <FarmAISim />}
                </div>
              </div>

            </div>

            {/* Selector Gallery of Case Studies */}
            <div className="space-y-4 pt-8 border-t border-slate-900/80">
              <div className="space-y-1">
                <h3 className="font-display text-sm font-bold text-white tracking-wide uppercase">
                  Explore other project blueprints & simulators
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  Click on any project profile block below to swap the detail workspace and start its respective interactive simulation engine!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setActiveProjectId(p.id)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition duration-300 group ${
                      activeProjectId === p.id
                        ? "bg-blue-600/5 border-blue-500 shadow-lg shadow-blue-500/5"
                        : "bg-slate-900/30 border-slate-850/80 hover:bg-slate-900/70 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-1 mb-2.5">
                      <span className={`p-1.5 rounded-lg text-xs ${
                        activeProjectId === p.id ? "bg-blue-500/10 text-blue-400" : "bg-slate-950 text-slate-400"
                      }`}>
                        {getCategoryIcon(p.category)}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
                        {p.category}
                      </span>
                    </div>
                    
                    <h4 className="text-xs font-bold text-white font-display group-hover:text-blue-400 transition">
                      {p.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-sans mt-1 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                    
                    <div className="flex justify-between items-center pt-2.5 mt-2.5 border-t border-slate-900 text-[10px] font-mono">
                      <span className="text-slate-500">Core: {p.techStack[0]}</span>
                      <span className={`flex items-center gap-0.5 ${
                        activeProjectId === p.id ? "text-blue-400 font-bold" : "text-slate-400 group-hover:text-white"
                      }`}>
                        {activeProjectId === p.id ? "ACTIVE" : "LAUNCH"}
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* 2d. Grouped Technical Skills Grid */}
        <Skills />

        {/* 2e. Validated Contact Section */}
        <Contact />

      </main>

      {/* 3. Global Futuristic Accent Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 px-4 sm:px-6 lg:px-8 text-center space-y-3">
        <div className="inline-flex items-center justify-center p-2 rounded-full bg-slate-900 border border-slate-850 text-slate-400 text-xs gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>PORTFOLIO MAIN BRANCH SECURE</span>
        </div>
        <p className="text-xs text-slate-400 italic font-display uppercase tracking-wider">
          "Lead with compassion. Code with purpose."
        </p>
        <p className="text-[10px] text-slate-500 font-mono">
          © {new Date().getFullYear()} SAM LOPEZ. POWERED BY GOOGLE AI STUDIO. ALL RIGHTS RESERVED.
        </p>
      </footer>

      {/* 4. Immersive Cosmos Pointer physics overlay */}
      <CosmosPointer />

    </div>
  );
}
