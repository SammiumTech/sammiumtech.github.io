import React, { useEffect } from "react";
import { ArrowLeft, Sparkles, Code2, Shield, Heart, HelpCircle, GitMerge, Settings, Compass, Cpu, Zap, Activity, Sprout } from "lucide-react";
import SammiumSim from "./SammiumSim";
import QuantumConsciousnessSim from "./QuantumConsciousnessSim";
import FarmAISim from "./FarmAISim";
import EarthGuardianSim from "./EarthGuardianSim";

interface ProjectCaseStudyProps {
  projectId: string;
  onBack: () => void;
}

export default function ProjectCaseStudy({ projectId, onBack }: ProjectCaseStudyProps) {
  // Scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [projectId]);

  // Project Specific Detailed Data Content
  const detailsMap: Record<string, {
    title: string;
    subtitle: string;
    tagline: string;
    category: string;
    accentColor: string;
    glowBg: string;
    overview: string;
    inspiration: string;
    features: { icon: React.ReactNode; name: string; desc: string }[];
    technologies: string[];
    designProcess: string[];
    challenges: string;
    futureRoadmap: string[];
  }> = {
    "sammium-one": {
      title: "Sammium ONE",
      subtitle: "AI Operating System",
      tagline: "Unifying intelligent task orchestration, natural language compilers, and autonomous workflows.",
      category: "Full-Stack AI Operating System",
      accentColor: "border-blue-500 text-blue-400",
      glowBg: "from-blue-500/10 via-slate-950 to-slate-950",
      overview: "Sammium ONE represents the future of user interfaces—an operating system where tasks aren't isolated apps, but collaborative flows guided by generative artificial intelligence. By feeding disorganized brainstorming logs or unstructured voice transcript dumps into the core processor, Sammium ONE compiles clear, actionable tasks into drag-and-drop Kanban blocks, estimates efforts, and composes executive briefings automatically.",
      inspiration: "Traditional productivity tools force users to perform manual data copying between notes, chats, planners, and draft boxes. We set out to design a singular cognitive workspace that operates dynamically, managing memory and state autonomously based on sheer user intent.",
      features: [
        {
          icon: <Activity className="w-5 h-5 text-blue-400 animate-pulse" />,
          name: "Unstructured Cognitive Compiler",
          desc: "Transforms chaotic meeting transcript data or personal thoughts directly into organized database schemas."
        },
        {
          icon: <GitMerge className="w-5 h-5 text-purple-400" />,
          name: "Interactive State Kanban Boards",
          desc: "Full drag-and-drop workflow simulator supporting column transition triggers and automated prioritization."
        },
        {
          icon: <Settings className="w-5 h-5 text-emerald-400 animate-spin" style={{ animationDuration: "10s" }} />,
          name: "Smart Executive Briefing Generator",
          desc: "Drafts elegant, executive-level summaries containing exact deadlines and progress coordinates."
        }
      ],
      technologies: ["React 18", "Express.js Proxy", "Gemini 3.5 Flash", "Biquad Filter Synths", "Tailwind CSS"],
      designProcess: [
        "Phase 01: Wireframing a unified dashboard in Figma to eliminate multi-window fatigue.",
        "Phase 02: Structuring server-side prompt engineering pipelines to ensure highly repeatable JSON output formatting.",
        "Phase 03: Prototyping state transitions and integrating soundscape feedbacks."
      ],
      challenges: "Maintaining reliable state coherence across complex client-side interactions while ensuring the backend models execute fast, stable proxy queries using secure developer tokens.",
      futureRoadmap: [
        "Integration of local secure vector database embeddings for offline memory.",
        "Smart multi-agent task dispatchers capable of resolving sub-issues.",
        "Live voice-to-interface command loops using continuous audio stream models."
      ]
    },
    "quantum-universe": {
      title: "Quantum Universe Core",
      subtitle: "Scientific Visualization",
      tagline: "Endless 3D procedural simulation of neural consciousness and quantum wave dynamics.",
      category: "Interactive 3D Simulation",
      accentColor: "border-emerald-500 text-emerald-400",
      glowBg: "from-emerald-500/10 via-slate-950 to-slate-950",
      overview: "The Quantum Universe Core (originally Quantum Consciousness Core) is a cinematic 3D simulation of a thinking artificial mind. Built entirely inside high-performance canvas layers, the scene projects hundreds of glowing emerald, cyan, and white synaptic nodes linked by moving photon packets. A slow, stabilized camera dolly drifts infinitely, generating procedural networks ahead and fading them behind.",
      inspiration: "To move beyond 'flat' data charts and translate the mathematical complexity of neural systems into a physically visible, breathtaking, and infinite experience inspired by NVIDIA Omniverse.",
      features: [
        {
          icon: <Cpu className="w-5 h-5 text-emerald-400" />,
          name: "Infinite Procedural Generation",
          desc: "Dynamically calculates and spawns 3D neural cells on-the-fly, keeping coordinates stable forever."
        },
        {
          icon: <Zap className="w-5 h-5 text-cyan-400" />,
          name: "Quantum Resonance Sweeps",
          desc: "Discharges radial electromagnetic pulse waves accompanied by a cascade of drifting golden particles."
        },
        {
          icon: <Activity className="w-5 h-5 text-purple-400" />,
          name: "Live Web Audio Synthesizer",
          desc: "Generates deep sub-bass tones and triangular chiming signals in-browser to represent mental workloads."
        }
      ],
      technologies: ["HTML5 Canvas 3D", "Spring Projection Physics", "Biquad Filter Drone", "React Hooks", "Fira Code"],
      designProcess: [
        "Phase 01: Formulating 3D coordinate projection mathematics (FOV, perspective clipping, and radial depth maps).",
        "Phase 02: Creating a spatial deflection vector algorithm to bend space coordinates when the user's cursor approaches.",
        "Phase 03: Balancing particle count and audio oscillators to secure 60FPS on target devices."
      ],
      challenges: "Rendering hundreds of physics-based nodes and light trails concurrently on standard browser context layers without creating memory leaks or overloading CPU cycles.",
      futureRoadmap: [
        "Transition to full WebGL custom fragment shaders for hyper-realistic volumetric fog.",
        "Real-time audio-reactivity mapping nodes to user's local microphone inputs.",
        "Multi-dimensional coordinate warps simulating deep gravitational black holes."
      ]
    },
    "ai-agriculture": {
      title: "AI Agriculture",
      subtitle: "Intelligent Farming Platform",
      tagline: "Bridging environmental telemetry and expert agronomist recommendations for Central Luzon.",
      category: "Agrotech Smart Platform",
      accentColor: "border-green-500 text-green-400",
      glowBg: "from-green-500/10 via-slate-950 to-slate-950",
      overview: "AI Agriculture (powered by FarmAI Co-Pilot) is an advisory platform designed to optimize crop cultivation in Central Luzon. By combining real-time telemetry gauges (such as soil moisture percentage and temperature) with specific crop parameters, the advisor generates localized agronomy prescriptions, saving irrigation water and boosting seasonal yields.",
      inspiration: "Many regional farmers lack access to expensive soil analysis equipment or instant consulting. We wanted to build a simple, robust interface that transforms raw climate data into structured advice.",
      features: [
        {
          icon: <Sprout className="w-5 h-5 text-green-400" />,
          name: "Soil Humidity & Weather Presets",
          desc: "Allows quick simulation of optimal, dry, critical, or flooded crop variables."
        },
        {
          icon: <Settings className="w-5 h-5 text-cyan-400" />,
          name: "Diagnostic Priority Monitors",
          desc: "Color-coded status alerts warning teams when parameters deviate from target thresholds."
        },
        {
          icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
          name: "Agronomy Consulting Copilot",
          desc: "Enables direct, localized conversational queries requesting solutions for crop diseases or fertilization."
        }
      ],
      technologies: ["React", "Gemini 3.5 Flash", "Agronomy Heuristics", "Tailwind CSS", "SVG Gauges"],
      designProcess: [
        "Phase 01: Mapping critical agronomical variables (Rice, Corn, Vegetables) and safety thresholds.",
        "Phase 02: Crafting the expert agronomist advisor prompts to output concise, actionable guidance.",
        "Phase 03: Creating highly readable, high-contrast dashboard gauges optimized for direct field consulting."
      ],
      challenges: "Developing stable localized prompt structures that address agricultural issues specific to the weather conditions of Central Luzon.",
      futureRoadmap: [
        "Integration of actual IoT soil sensor hardware feeds via continuous MQTT APIs.",
        "Satellite image ingestion to detect regional crop chlorosis patterns automatically.",
        "Offline SMS-based fallback gateway for field operations without cellular web data."
      ]
    },
    "sentinel-research": {
      title: "Sentinel Research",
      subtitle: "Research Intelligence Dashboard",
      tagline: "High-contrast flood mapping and automated disaster response plans for coastal communities.",
      category: "Civic Hazard Intelligence",
      accentColor: "border-red-500 text-red-400",
      glowBg: "from-red-500/10 via-slate-950 to-slate-950",
      overview: "Sentinel Research (powered by Earth Guardian AI) is a disaster preparation dashboard designed to secure families in Botolan, Zambales during severe storm events. By analyzing wind speeds and localized rainfall metrics, the system dynamically calculates immediate crisis tasks, drafts coordination memos, and coordinates civic teams.",
      inspiration: "Botolan lies adjacent to active floodplains and coastal surges. Standard disaster check-sheets are static; we aimed to build an active dashboard that updates guidelines dynamically as telemetry escalates.",
      features: [
        {
          icon: <Shield className="w-5 h-5 text-red-400" />,
          name: "Localized Critical Escalation Slider",
          desc: "Adjusts storm classification in real-time, instantly shifting guidelines from standby to active rescue."
        },
        {
          icon: <GitMerge className="w-5 h-5 text-blue-400" />,
          name: "Action Plan Copilot Node",
          desc: "Leverages Gemini to write dynamic context-aware response sheets tailored for high water levels."
        },
        {
          icon: <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />,
          name: "Role Dispatcher Checksheets",
          desc: "Segregates tasks for civic leaders, medical responders, and community volunteers seamlessly."
        }
      ],
      technologies: ["React", "Express.js Server", "Gemini 3.5 Flash", "Warning Sirens", "Tailwind CSS"],
      designProcess: [
        "Phase 01: Structuring hazard mitigation steps based on civic emergency blueprints.",
        "Phase 02: Developing the high-contrast dashboard with alarm indicators and status counters.",
        "Phase 03: Incorporating an interactive siren alert using the Web Audio oscillator library."
      ],
      challenges: "Securing immediate, zero-latency rendering of crisis checklists even when external server-side model processing is delayed by bad weather networks.",
      futureRoadmap: [
        "Integrating live regional weather satellite coordinates to automate the wind/rain telemetry inputs.",
        "Adding localized sirens and strobe lights using hardware microcontroller integrations.",
        "Public community map tracker displaying clear, real-time safety shelter locations."
      ]
    }
  };

  const project = detailsMap[projectId] || detailsMap["sammium-one"];

  // Render the appropriate live simulator
  const renderSimulator = () => {
    switch (projectId) {
      case "sammium-one":
        return <SammiumSim />;
      case "quantum-universe":
        return <QuantumConsciousnessSim />;
      case "ai-agriculture":
        return <FarmAISim />;
      case "sentinel-research":
        return <EarthGuardianSim />;
      default:
        return <SammiumSim />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased pb-24">
      {/* 1. Glassmorphic Sticky Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-850 hover:bg-slate-850 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK TO PORTFOLIO
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
            {project.subtitle}
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono text-slate-500 uppercase">
            // SAMMIUM TECH LABS
          </span>
        </div>
      </header>

      {/* 2. Panoramic Project Hero Banner */}
      <div className={`relative h-[300px] w-full bg-gradient-to-b ${project.glowBg} flex items-end p-6 sm:p-12 overflow-hidden border-b border-slate-900`}>
        {/* Sci-fi absolute grid coordinates overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.12)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        
        <div className="absolute top-8 right-8 text-[10px] font-mono text-slate-700 space-y-0.5 text-right hidden md:block">
          <div>LOC_REF_X: {(Math.random() * 9999).toFixed(0)}</div>
          <div>SYSTEM_MOD: STABLE</div>
          <div>RENDERER_CORE: WebGL_STRETCH</div>
        </div>

        <div className="relative z-10 max-w-4xl space-y-3">
          <span className="text-xs font-mono text-blue-400 tracking-widest uppercase font-semibold block">
            {project.category}
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-none drop-shadow-md">
            {project.title}
          </h1>
          <p className="text-slate-300 text-sm sm:text-lg max-w-2xl font-sans leading-relaxed font-normal">
            {project.tagline}
          </p>
        </div>
      </div>

      {/* 3. Three-Column Main Case Study Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Strategic Details & Tech Spec (Col Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Overview Block */}
          <div className="p-6 rounded-2xl bg-slate-900/45 border border-slate-850 space-y-3.5">
            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase block font-semibold">
              Project Overview
            </span>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {project.overview}
            </p>
          </div>

          {/* Inspiration Block */}
          <div className="p-6 rounded-2xl bg-slate-900/45 border border-slate-850 space-y-3.5">
            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase block font-semibold">
              The Inspiration
            </span>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {project.inspiration}
            </p>
          </div>

          {/* Technologies Tag Box */}
          <div className="p-6 rounded-2xl bg-slate-900/45 border border-slate-850 space-y-3.5">
            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase block font-semibold">
              Technical Stack Used
            </span>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-slate-950 border border-slate-900 px-3 py-1.5 rounded-lg text-slate-300 font-mono font-medium"
                >
                  ⚙️ {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Local Challenges Segment */}
          <div className="p-6 rounded-2xl bg-slate-900/45 border border-slate-850 space-y-3.5">
            <div className="flex items-center gap-2 border-b border-slate-850 pb-2">
              <Code2 className="w-4 h-4 text-pink-400" />
              <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase block font-semibold">
                Technical Challenges
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              {project.challenges}
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Sandbox Engine & Specifications (Col Span 8) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* INTERACTIVE SIMULATOR CARD EMBED (Centerpiece of Depth) */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold font-mono text-emerald-400 tracking-widest uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
                LIVE INTERACTIVE PRODUCT SIMULATION
              </span>
              <span className="text-[10px] text-slate-500 font-mono">100% Sandbox Sandbox</span>
            </div>

            <div className="rounded-2xl bg-slate-900/20 border border-slate-850 p-1 shadow-2xl overflow-hidden bg-gradient-to-b from-slate-900/60 to-slate-950">
              {renderSimulator()}
            </div>
          </div>

          {/* Deep Feature list */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-slate-400 border-b border-slate-900 pb-2.5">
              Featured Systems & Functions
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {project.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-slate-850 bg-slate-900/10 hover:bg-slate-900/30 transition duration-200 space-y-2.5"
                >
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-850/80 w-fit">
                    {feat.icon}
                  </div>
                  <h4 className="font-display text-xs font-bold text-white tracking-wide">
                    {feat.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Structural Design Process steps inside Case Study */}
          <div className="space-y-4 pt-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-slate-400 border-b border-slate-900 pb-2.5">
              Chronological Project Evolution
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {project.designProcess.map((step, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-slate-850 bg-slate-900/5 hover:border-slate-800 transition duration-200 relative overflow-hidden"
                >
                  <div className="absolute top-2 right-3 font-mono text-[10px] text-slate-700 font-bold">
                    STEP_0{idx + 1}
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed pt-2">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Future Roadmap section */}
          <div className="p-6 rounded-2xl bg-slate-900/35 border border-slate-850 space-y-3.5">
            <div className="flex items-center gap-2 border-b border-slate-850 pb-2">
              <Compass className="w-4 h-4 text-yellow-400 animate-spin" style={{ animationDuration: "12s" }} />
              <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase block font-semibold">
                Strategic Future Roadmap
              </span>
            </div>
            
            <ul className="space-y-2 text-xs text-slate-300 font-sans leading-relaxed list-disc list-inside">
              {project.futureRoadmap.map((point, idx) => (
                <li key={idx} className="hover:text-white transition">
                  {point}
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
