import React, { useMemo, useState } from "react";
import {
  BrainCircuit,
  CloudCog,
  Code2,
  Database,
  Gamepad2,
  Palette,
  Server,
  Settings,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";

type SkillStatus = "Production" | "Project-Proven" | "Active Build";

type SkillItem = {
  name: string;
  status: SkillStatus;
  desc: string;
};

const statusClasses: Record<SkillStatus, string> = {
  Production:
    "bg-emerald-500/10 text-emerald-300 border border-emerald-500/25",
  "Project-Proven":
    "bg-blue-500/10 text-blue-300 border border-blue-500/25",
  "Active Build":
    "bg-violet-500/10 text-violet-300 border border-violet-500/25",
};

const skillsData = [
  {
    category: "Languages & Foundations",
    icon: Terminal,
    iconClass: "text-cyan-400",
    footer: "CORE ENGINEERING LANGUAGES",
    items: [
      {
        name: "TypeScript",
        status: "Production",
        desc: "Typed React applications, API contracts, reusable models, and safer refactoring.",
      },
      {
        name: "JavaScript",
        status: "Project-Proven",
        desc: "Asynchronous workflows, browser systems, simulations, and modular application logic.",
      },
      {
        name: "C#",
        status: "Project-Proven",
        desc: "Unity gameplay systems, vehicle logic, input handling, and interactive prototypes.",
      },
      {
        name: "SQL",
        status: "Production",
        desc: "Relational modeling, joins, constraints, transactions, and operational queries.",
      },
      {
        name: "HTML5 / CSS3",
        status: "Project-Proven",
        desc: "Semantic interfaces, responsive layouts, accessibility, animation, and visual systems.",
      },
    ] satisfies SkillItem[],
  },
  {
    category: "Frontend Engineering",
    icon: Code2,
    iconClass: "text-emerald-400",
    footer: "INTERACTIVE WEB EXPERIENCES",
    items: [
      {
        name: "React 19",
        status: "Production",
        desc: "Component architecture, hooks, state synchronization, dashboards, and product interfaces.",
      },
      {
        name: "Tailwind CSS 4",
        status: "Project-Proven",
        desc: "Responsive design systems, adaptive layouts, dark interfaces, and rapid UI iteration.",
      },
      {
        name: "Vite",
        status: "Production",
        desc: "Fast development workflows, optimized builds, environment configuration, and asset delivery.",
      },
      {
        name: "Motion",
        status: "Project-Proven",
        desc: "Interface transitions, cinematic micro-interactions, and animated application states.",
      },
      {
        name: "Responsive UI",
        status: "Project-Proven",
        desc: "Desktop, tablet, mobile, and performance-aware interface adaptation.",
      },
    ] satisfies SkillItem[],
  },
  {
    category: "Backend & API Engineering",
    icon: Server,
    iconClass: "text-purple-400",
    footer: "SERVICE AND API LAYER",
    items: [
      {
        name: "Node.js",
        status: "Production",
        desc: "Server runtimes, asynchronous processing, environment configuration, and service orchestration.",
      },
      {
        name: "Express",
        status: "Production",
        desc: "API routes, middleware chains, static delivery, request validation, and server integration.",
      },
      {
        name: "Fastify",
        status: "Production",
        desc: "High-performance APIs, schema-driven endpoints, plugins, and structured service architecture.",
      },
      {
        name: "REST APIs",
        status: "Production",
        desc: "Resource-oriented endpoints, JSON contracts, error handling, authorization, and CORS.",
      },
      {
        name: "OpenAPI",
        status: "Production",
        desc: "Interactive API documentation, contract validation, and integration-ready service definitions.",
      },
    ] satisfies SkillItem[],
  },
  {
    category: "Data & Async Systems",
    icon: Database,
    iconClass: "text-amber-400",
    footer: "PERSISTENCE AND EVENT FLOW",
    items: [
      {
        name: "PostgreSQL",
        status: "Production",
        desc: "Relational persistence, constraints, indexed queries, transactions, and event records.",
      },
      {
        name: "Redis",
        status: "Production",
        desc: "Fast shared state, queue support, caching patterns, and distributed coordination.",
      },
      {
        name: "BullMQ",
        status: "Production",
        desc: "Background jobs, retries, queue workers, failure recovery, and dead-letter handling.",
      },
      {
        name: "Background Workers",
        status: "Production",
        desc: "Asynchronous task execution, durable processing, retry strategies, and workload separation.",
      },
      {
        name: "Event Pipelines",
        status: "Project-Proven",
        desc: "Event normalization, correlation IDs, idempotency, routing, and downstream integrations.",
      },
    ] satisfies SkillItem[],
  },
  {
    category: "Game, 3D & Simulation",
    icon: Gamepad2,
    iconClass: "text-fuchsia-400",
    footer: "REAL-TIME INTERACTIVE SYSTEMS",
    items: [
      {
        name: "Unity",
        status: "Project-Proven",
        desc: "Playable game prototypes, vehicle systems, world interactions, UI, and WebGL delivery.",
      },
      {
        name: "Three.js",
        status: "Project-Proven",
        desc: "Real-time 3D scenes, galaxy simulations, environments, cameras, materials, and effects.",
      },
      {
        name: "React Three Fiber",
        status: "Project-Proven",
        desc: "Declarative React-driven 3D scenes, reusable game components, and state-connected rendering.",
      },
      {
        name: "WebGL / WebGL 2",
        status: "Project-Proven",
        desc: "Browser graphics, rendering pipelines, performance tuning, and interactive visual systems.",
      },
      {
        name: "Canvas & Web Audio",
        status: "Project-Proven",
        desc: "Scientific visualizations, procedural effects, responsive sound, and simulation feedback.",
      },
    ] satisfies SkillItem[],
  },
  {
    category: "AI & Data Intelligence",
    icon: BrainCircuit,
    iconClass: "text-indigo-400",
    footer: "INTELLIGENT PRODUCT WORKFLOWS",
    items: [
      {
        name: "Gemini API",
        status: "Project-Proven",
        desc: "AI copilots, guided analysis, structured outputs, and server-side model integration.",
      },
      {
        name: "Prompt Engineering",
        status: "Project-Proven",
        desc: "System instructions, structured prompting, output constraints, and reliable task workflows.",
      },
      {
        name: "AI Copilot Systems",
        status: "Project-Proven",
        desc: "Domain-focused assistants for agriculture, research, astronomy, learning, and risk awareness.",
      },
      {
        name: "D3.js",
        status: "Project-Proven",
        desc: "Custom data visualizations, scientific views, interactive diagrams, and analytical interfaces.",
      },
      {
        name: "Recharts",
        status: "Project-Proven",
        desc: "Responsive charts, operational dashboards, telemetry displays, and comparative analytics.",
      },
    ] satisfies SkillItem[],
  },
  {
    category: "Security & Real-Time Systems",
    icon: ShieldCheck,
    iconClass: "text-rose-400",
    footer: "CONTROL, TRUST AND OBSERVABILITY",
    items: [
      {
        name: "WebSockets",
        status: "Project-Proven",
        desc: "Live alerts, synchronized dashboards, incident updates, and real-time application state.",
      },
      {
        name: "JWT Authentication",
        status: "Project-Proven",
        desc: "Token-based sessions, protected routes, identity checks, and secure API access.",
      },
      {
        name: "RBAC",
        status: "Project-Proven",
        desc: "Administrator, analyst, viewer, and domain-specific permission boundaries.",
      },
      {
        name: "Audit Trails",
        status: "Project-Proven",
        desc: "Attributable actions, event history, evidence timelines, and operational accountability.",
      },
      {
        name: "Alerts & Fault Logic",
        status: "Active Build",
        desc: "Hazard detection, telemetry thresholds, incident escalation, and recovery-oriented workflows.",
      },
    ] satisfies SkillItem[],
  },
  {
    category: "DevOps & Delivery",
    icon: CloudCog,
    iconClass: "text-sky-400",
    footer: "BUILD, SHIP AND OPERATE",
    items: [
      {
        name: "Git & GitHub",
        status: "Production",
        desc: "Version control, branching, merge recovery, repository maintenance, and release workflows.",
      },
      {
        name: "Docker",
        status: "Production",
        desc: "Containerized services, consistent environments, multi-service deployment, and portability.",
      },
      {
        name: "GitHub Actions",
        status: "Production",
        desc: "Automated validation, build checks, deployment workflows, and release confidence.",
      },
      {
        name: "Railway / Render",
        status: "Production",
        desc: "Cloud deployment for web applications, APIs, workers, databases, and managed services.",
      },
      {
        name: "GitHub Pages",
        status: "Production",
        desc: "Static project publishing, browser demos, portfolio integrations, and public releases.",
      },
    ] satisfies SkillItem[],
  },
  {
    category: "Product & Experience Design",
    icon: Palette,
    iconClass: "text-pink-400",
    footer: "HUMAN-CENTERED PRODUCT DESIGN",
    items: [
      {
        name: "Figma",
        status: "Project-Proven",
        desc: "High-fidelity concepts, layout planning, reusable components, and interaction prototypes.",
      },
      {
        name: "UI/UX Design",
        status: "Project-Proven",
        desc: "Information hierarchy, navigation, interaction patterns, usability, and visual clarity.",
      },
      {
        name: "Design Systems",
        status: "Project-Proven",
        desc: "Reusable tokens, components, states, spacing rules, and consistent product language.",
      },
      {
        name: "Canva",
        status: "Project-Proven",
        desc: "Marketing assets, brand visuals, presentations, graphics, and rapid content production.",
      },
      {
        name: "Accessibility & Performance",
        status: "Active Build",
        desc: "Readable interfaces, keyboard-aware interactions, responsive behavior, and device optimization.",
      },
    ] satisfies SkillItem[],
  },
];

export default function Skills() {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  const totalSkills = useMemo(
    () => skillsData.reduce((total, group) => total + group.items.length, 0),
    [],
  );

  return (
    <section
      id="skills"
      className="relative overflow-hidden border-t border-slate-900 bg-slate-950 px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.08),transparent_28%),radial-gradient(circle_at_85%_35%,rgba(139,92,246,0.08),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl space-y-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-md border border-blue-500/20 bg-blue-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-blue-300">
              <Settings className="h-3.5 w-3.5" />
              TECHNOLOGY ARSENAL // 2026
            </div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
              Full-Stack, AI, Game & Real-Time Systems
            </h2>
            <p className="max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
              A project-backed capability map spanning production web services,
              intelligent applications, immersive simulations, secure real-time
              platforms, and product design.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="min-w-24 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-3 text-center">
              <span className="block font-display text-xl font-black text-white">
                {skillsData.length}
              </span>
              <span className="font-mono text-[8px] uppercase tracking-wider text-slate-500">
                Domains
              </span>
            </div>
            <div className="min-w-24 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-3 text-center">
              <span className="block font-display text-xl font-black text-white">
                {totalSkills}
              </span>
              <span className="font-mono text-[8px] uppercase tracking-wider text-slate-500">
                Capabilities
              </span>
            </div>
            <div className="min-w-24 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-3 text-center">
              <span className="block font-display text-xl font-black text-emerald-300">
                LIVE
              </span>
              <span className="font-mono text-[8px] uppercase tracking-wider text-emerald-500/80">
                Build Mode
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skillsData.map((categoryGroup) => {
            const Icon = categoryGroup.icon;

            return (
              <article
                key={categoryGroup.category}
                className="group flex min-h-[430px] flex-col justify-between rounded-2xl border border-slate-800/90 bg-slate-900/35 p-5 shadow-[0_18px_60px_rgba(2,6,23,0.28)] transition duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900/55 sm:p-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                    <div className="shrink-0 rounded-lg border border-slate-800 bg-slate-950 p-2.5">
                      <Icon className={`h-4.5 w-4.5 ${categoryGroup.iconClass}`} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-sm font-bold text-white">
                        {categoryGroup.category}
                      </h3>
                      <p className="mt-0.5 font-mono text-[8px] uppercase tracking-widest text-slate-600">
                        {categoryGroup.items.length} verified capabilities
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {categoryGroup.items.map((skill) => {
                      const skillKey = `${categoryGroup.category}-${skill.name}`;
                      const isActive = activeSkill === skillKey;

                      return (
                        <button
                          key={skill.name}
                          type="button"
                          aria-expanded={isActive}
                          onMouseEnter={() => setActiveSkill(skillKey)}
                          onMouseLeave={() => setActiveSkill(null)}
                          onFocus={() => setActiveSkill(skillKey)}
                          onBlur={() => setActiveSkill(null)}
                          onClick={() =>
                            setActiveSkill((current) =>
                              current === skillKey ? null : skillKey,
                            )
                          }
                          className="w-full rounded-lg border border-slate-900 bg-slate-950/55 p-2.5 text-left transition-colors duration-200 hover:border-slate-700 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-mono text-[11px] font-semibold text-slate-200 sm:text-xs">
                              {skill.name}
                            </span>
                            <span
                              className={`shrink-0 rounded px-2 py-0.5 font-mono text-[8px] font-bold ${statusClasses[skill.status]}`}
                            >
                              {skill.status}
                            </span>
                          </div>

                          <p
                            className={`overflow-hidden font-sans text-[10px] leading-relaxed text-slate-400 transition-all duration-200 ${
                              isActive
                                ? "mt-2 max-h-20 opacity-100"
                                : "max-h-0 opacity-0"
                            }`}
                          >
                            {skill.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4 font-mono text-[8px] uppercase tracking-widest text-slate-600">
                  <span>{categoryGroup.footer}</span>
                  <Sparkles className="h-3 w-3 text-blue-500/70" />
                </div>
              </article>
            );
          })}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/20 p-4 text-center sm:flex-row sm:text-left">
          <div className="space-y-1">
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-slate-500">
              SAMMIUM ENGINEERING DIRECTIVE
            </span>
            <p className="text-xs text-slate-300">
              Code with purpose. Lead with compassion. Build systems that help
              people move forward.
            </p>
          </div>
          <span className="shrink-0 rounded border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1.5 font-mono text-[9px] text-emerald-300">
            SYS: CONTINUOUS BUILD
          </span>
        </div>
      </div>
    </section>
  );
}
