export type FlagshipProject = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  preview: string;
  demoPath: string;
  sourcePath?: string;
  deploymentNote?: string;
  tags: string[];
  status:
    | "Interactive Prototype"
    | "Research Platform"
    | "Product Prototype"
    | "Production Deployment";
  accent: "cyan" | "emerald" | "violet";
  highlights: string[];
};

export const flagshipProjects: FlagshipProject[] = [

  {
    slug: "nexusops",
    title: "Sammium NexusOps",
    eyebrow: "Event-driven systems integration platform",
    description:
      "A production-deployed integration command center that normalizes payment events, persists them in PostgreSQL, routes them through Redis and BullMQ, and processes CRM and Slack actions through a Fastify API and background worker.",
    preview: "./previews/nexusops-preview.png",
    demoPath: "https://nexusops-web-production.up.railway.app",
    tags: [
      "React",
      "TypeScript",
      "Fastify",
      "PostgreSQL",
      "Redis",
      "BullMQ",
      "OpenAPI",
      "Docker",
      "Railway"
    ],
    status: "Production Deployment",
    accent: "cyan",
    highlights: [
      "Live Web, API, Worker, PostgreSQL, and Redis services deployed on Railway",
      "Canonical event normalization, correlation IDs, idempotency, retries, and dead-letter recovery",
      "Interactive OpenAPI documentation with automated GitHub Actions validation",
      "End-to-end payment.succeeded processing through a production queue worker"
    ]
  },
{
  slug: "orbitlabs-jovian-frontier",
  title: "OrbitLabs 6.0: Jovian Frontier",
  eyebrow: "Jovian Exploration · Spacecraft Simulation · Scientific Computing",
  description:
    "A browser-based Jovian exploration and spacecraft-systems simulator featuring third-person flight, adaptive autopilot, scientific missions, crew command, radiation hazards, procedural audio, and a twelve-mission campaign across Jupiter and its moons.",
  preview: "./previews/orbitlabs-jovian-frontier.png",
  demoPath: "https://zelop301.github.io/sammium-orbitlab/",
  tags: [
    "Three.js",
    "WebGL",
    "JavaScript",
    "Procedural Audio",
    "Space Simulation",
    "GitHub Pages",
  ],
 status: "Product Prototype",
  accent: "cyan",
  highlights: [
    "Third-person Pathfinder-07 flight with stabilized chase camera",
    "Adaptive autopilot, station keeping, orbital guidance, and scientific instruments",
    "Twelve-mission campaign featuring Jupiter, its moons, a black hole, and an alien mothership",
  ],
},
{
  slug: "sentinelops",
  title: "Sammium SentinelOps",
  eyebrow: "Cyber incident command platform",
  description:
    "A full-stack cyber incident command and response platform featuring secure authentication, role-based access, live threat alerts, incident workflows, evidence management, audit trails, and real-time WebSocket synchronization.",
  preview: "./previews/sentinelops-preview.png",
  demoPath: "https://sammium-sentinelops.onrender.com",
  tags: [
    "React",
    "TypeScript",
    "Node.js",
    "WebSockets",
    "JWT",
    "RBAC",
    "Cybersecurity",
  ],
  status: "Product Prototype",
  accent: "cyan",
  highlights: [
    "Real-time incident response and threat-alert synchronization",
    "JWT authentication with Administrator, Analyst, and Viewer roles",
    "Evidence management, analyst timelines, and attributable audit trails",
  ],
},
 
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
  {
    slug: "cosmos-os",
    title: "Sammium Cosmos OS",
    eyebrow: "Interactive cosmic observatory",
    description:
      "An immersive browser-based universe observatory featuring real-time 3D galaxy visualization, scientific laboratories, orbital simulations, and an AI-assisted astronomy guide.",
    preview: "./previews/cosmos-os.png",
    demoPath: "./projects/cosmos-os/index.html",
    tags: ["React 19", "TypeScript", "Three.js", "WebGL", "Space Science"],
    status: "Interactive Prototype",
    accent: "violet",
    highlights: [
      "Interactive real-time Three.js galaxy simulator",
      "Black-hole, quantum, orbital, and planetary-defense laboratories",
      "Responsive WebGL rendering with device-aware performance",
    ],
  },
  {
    slug: "sentinel-sense",
    title: "Sammium Sentinel Sense",
    eyebrow: "AI-assisted predictive risk awareness",
    description:
      "A cinematic hazard-simulation and predictive risk-awareness dashboard featuring nine risk domains, deterministic offline analysis, interactive telemetry, and optional Gemini-assisted predictions.",
    preview: "./previews/sentinel-sense.png",
    demoPath: "./projects/sentinel-sense/index.html",
    tags: [
      "React 19",
      "TypeScript",
      "Risk Analytics",
      "Data Visualization",
      "Gemini AI",
    ],
    status: "Interactive Prototype",
    accent: "cyan",
    highlights: [
      "Nine simulated hazard and infrastructure risk domains",
      "Optimized real-time telemetry and predictive timeline",
      "Deterministic offline engine with optional AI analysis",
    ],
  },
  {
    slug: "aetherverse",
    title: "Sammium AetherVerse",
    eyebrow: "Immersive holographic command universe",
    description:
      "A cinematic sci-fi command platform featuring a procedural holographic citadel, seven functional orbiting sectors, click-to-dock interfaces, persistent progression, adaptive performance, and a secure Node.js API.",
    preview: "./previews/aetherverse.webp",
    demoPath: "https://sammium-aetherverse.onrender.com",
    sourcePath: "https://github.com/zelop301/sammium-aetherverse",
    deploymentNote:
      "AetherVerse runs as a live Node.js service on Render. The free instance can take up to 50 seconds to wake after inactivity.",
    tags: [
      "JavaScript",
      "Node.js",
      "Canvas",
      "CSS 3D",
      "Web Audio",
      "Render",
    ],
    status: "Production Deployment",
    accent: "cyan",
    highlights: [
      "Procedural holographic citadel with seven functional orbiting sectors",
      "Cinematic hyperdrive, synchronized soundscape, and docking interactions",
      "Adaptive graphics, persistent progression, and secure API services",
    ],
  },

];

export const getFlagshipProject = (slug: string) =>
  flagshipProjects.find((project) => project.slug === slug);


