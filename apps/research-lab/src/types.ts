export interface TelemetryData {
  status: string;
  systemCore: string;
  cpuUsage: number;
  memoryUsage: number;
  uptimeSeconds: number;
  activeQuantumNodes: number;
}

export interface ResearchProposal {
  id: string;
  title: string;
  department: "ai" | "robotics" | "physics" | "cellular";
  description: string;
  proposer: string;
  timestamp: string;
  votes: number;
}

export type LabExperimentId = "ai-cognitive" | "robotic-swarm" | "quantum-orbit" | "cellular-automata";

export interface LabExperiment {
  id: LabExperimentId;
  name: string;
  tagline: string;
  description: string;
  status: "active" | "experimental" | "idle";
  symbol: string;
  metrics: { label: string; value: string | number }[];
}

// Particle interface for Physics singualrity orbit sandbox
export interface PhysicsParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  history: { x: number; y: number }[];
  mass: number;
}

export interface GravityWell {
  x: number;
  y: number;
  mass: number;
  radius: number;
}

// Boid interface for Robotic Swarm simulation
export interface RoboticsBoid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  id: number;
  energy: number;
  chargeColor: string;
}

export interface TargetSource {
  x: number;
  y: number;
  energy: number;
  radius: number;
}
