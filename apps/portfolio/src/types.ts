export interface Project {
  id: string;
  title: string;
  roles: string[];
  description: string;
  detailedOverview: string;
  techStack: string[];
  category: "AI" | "Full Stack" | "Education" | "Farming" | "Interactive";
  highlights: string[];
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

// Earth Guardian AI types
export interface EarthGuardianChecklistTask {
  title: string;
  description: string;
  assignedTo: string;
}

export interface EarthGuardianPhase {
  phaseName: string;
  tasks: EarthGuardianChecklistTask[];
}

export interface EarthGuardianResponse {
  warningLevel: "Green" | "Orange" | "Red";
  priorityStatement: string;
  phases: EarthGuardianPhase[];
}

// Sammium One types
export interface KanbanTask {
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  estimatedHours: number;
  tag: string;
  status?: "To Do" | "In Progress" | "Review" | "Done";
}

export interface SammiumResponse {
  totalEstimatedHours: number;
  topPriorities: string[];
  kanbanTasks: KanbanTask[];
  draftEmail: {
    subject: string;
    body: string;
  };
}

// Synapse AI visualization types
export interface NeuronNode {
  id: string;
  layer: "input" | "hidden" | "output";
  layerIndex: number; // Index within its layer
  value: number; // Current activation value
  bias: number;
}

export interface ConnectionWeight {
  sourceId: string;
  targetId: string;
  weight: number;
}

// FarmAI types
export interface FarmAIResponse {
  healthStatus: "Optimal" | "Sub-optimal" | "Warning" | "Critical";
  temperatureAssessment: string;
  moistureAssessment: string;
  nitrogenRecommendation: string;
  waterAdvice: string;
  copilotMessage: string;
}
