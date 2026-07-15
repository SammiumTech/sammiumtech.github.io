export type FlagshipProject = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  preview: string;
  demoPath: string;
  tags: string[];
  status: "Interactive Prototype" | "Research Platform" | "Product Prototype";
  accent: "cyan" | "emerald" | "violet";
  highlights: string[];
};

export const flagshipProjects: FlagshipProject[] = [
  {
    slug: "quantumverse",
    title: "Sammium QuantumVerse",
    eyebrow: "Immersive quantum learning universe",
    description:
      "A cinematic, interactive science platform that combines quantum visualizations, simulations, guided learning, an AI mentor, and discovery tools in one explorable interface.",
    preview: "./previews/quantumverse.jpg",
    demoPath: "./projects/quantumverse/index.html",
    tags: ["React 19", "Canvas", "Motion", "AI Learning", "Web Audio"],
    status: "Interactive Prototype",
    accent: "cyan",
    highlights: [
      "Living quantum field visualization",
      "Interactive learning and quiz systems",
      "Responsive scientific dashboard experience",
    ],
  },
  {
    slug: "agrimind-ai",
    title: "Sammium AgriMind AI",
    eyebrow: "Agricultural intelligence operating system",
    description:
      "A complete smart-farming command center for crop planning, diagnostics, market intelligence, finance, irrigation, livestock, sustainability, and localized decision support.",
    preview: "./previews/agrimind-ai.jpg",
    demoPath: "./projects/agrimind-ai/index.html",
    tags: ["React 19", "AgriTech", "AI Copilot", "Analytics", "Decision Support"],
    status: "Product Prototype",
    accent: "emerald",
    highlights: [
      "Unified farm operations dashboard",
      "Localized agronomy and diagnostics workflows",
      "Financial, resource, and sustainability planning",
    ],
  },
  {
    slug: "research-lab",
    title: "Sammium Research Lab",
    eyebrow: "Advanced AI experimentation environment",
    description:
      "An immersive research interface for AI experiments, neural observatories, simulations, telemetry, knowledge exploration, prototype testing, and system intelligence.",
    preview: "./previews/research-lab.jpg",
    demoPath: "./projects/research-lab/index.html",
    tags: ["React 19", "D3", "Recharts", "AI Research", "Simulation"],
    status: "Research Platform",
    accent: "violet",
    highlights: [
      "Experiment generation and research workflows",
      "Real-time telemetry and neural visualizations",
      "Prototype sandbox and knowledge systems",
    ],
  },
];

export const getFlagshipProject = (slug: string) =>
  flagshipProjects.find((project) => project.slug === slug);
