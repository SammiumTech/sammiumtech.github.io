export interface QuantumTopic {
  id: string;
  title: string;
  category: "foundations" | "mechanics" | "computing" | "advanced";
  summary: string;
  description: string;
  keyFormula: string;
  formulaString: string;
  analogy: string;
  openQuestions: string;
}

export interface Physicist {
  name: string;
  years: string;
  contribution: string;
  details: string;
  funFact: string;
  imagePrompt: string;
}

export interface TimelineEvent {
  year: string;
  scientist: string;
  discovery: string;
  description: string;
  impact: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ResearchPaper {
  title: string;
  year: string;
  authors: string;
  summary: string;
  significance: string;
}

export interface QuantumFormula {
  id: string;
  name: string;
  latex: string;
  concept: string;
  components: { symbol: string; name: string; desc: string }[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
}
