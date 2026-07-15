import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily to avoid startup crashes if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set. Please configure it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API endpoint for AI Cognitive Sandbox experiment
app.post("/api/experiments/generate", async (req, res) => {
  try {
    const { prompt, vibe, systemInstruction } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "You are an advanced, highly specialized AI researcher at Sammium Research Labs. Respond creatively and informatively with formatted markdown.",
        temperature: vibe === "chaotic" ? 1.1 : vibe === "conservative" ? 0.3 : 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "An error occurred with the Cognitive Engine." });
  }
});

// API endpoint for AI Knowledge Core / Library Q&A
app.post("/api/knowledge/ask", async (req, res) => {
  try {
    const { question, documents } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const ai = getGeminiClient();

    // Format documents list for the context
    const docsContext = documents && Array.isArray(documents)
      ? documents.map((doc: any) => `Type: ${doc.type}\nTitle: ${doc.title}\nCategory: ${doc.category || "General"}\nContent: ${doc.content || doc.summary || ""}\n---`).join("\n")
      : "No extra documents provided.";

    const systemInstruction = `You are the chief AI librarian and research counselor at Sammium Research Labs, known as Dr. Sammium. 
You possess absolute knowledge of our local scientific files, research papers, documentation, experiments, and tutorials.

Our core focus areas include:
1. Healthcare AI (e.g., localized healthcare nets, predictive biosensing, wearable HUD alerts).
2. Agriculture Intelligence (e.g., autonomous crop drone swarms, biosensing, Ceres solar water harvesters).
3. Community systems (e.g., decentralized intelligence hubs, cognitive smart grids, public safety monitoring).

Here are the current documents available in our library:
${docsContext}

Your goal is to answer the user's inquiry with intellectual precision, deep scientific authority, and visionary sci-fi elegance, but ALWAYS grounded in the provided library. 
If the user asks "What AI technologies are we exploring?" or similar, you must explicitly state that:
"We currently focus on healthcare AI, agriculture intelligence, and community systems." and then you can briefly elaborate based on the specific papers/projects in our library.
Keep answers structured with clean markdown, bullet points, and elegant terminology. Always respond in character as Dr. Sammium.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: question,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Knowledge API Error:", error);
    res.status(500).json({ error: error.message || "An error occurred in the Knowledge Core." });
  }
});

// API endpoint for AI Timeline Roadmap Analysis / Forecasting
app.post("/api/timeline/forecast", async (req, res) => {
  try {
    const { milestone, quarter, year, description } = req.body;

    if (!milestone) {
      return res.status(400).json({ error: "Milestone name is required" });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are Dr. Sammium, Chief of Advanced Quantum Research at Sammium Labs. 
You are analyzing a future milestone or past achievement in our scientific roadmap:
Milestone: ${milestone}
Quarter: ${quarter}
Year: ${year}
Description: ${description || "No description provided."}

Formulate a visionary, highly speculative, and intellectually dense analysis of this roadmap node. 
Provide:
1. Technical challenges expected (e.g. quantum interference, mechanical wear, local cloud socket delays).
2. Human-centric community value (e.g. medical assistance, agricultural yield, decentralized public safety).
3. Speculative diagnostic recommendations (e.g. "We must adjust local node loops to 125Hz on Port 3000 to prevent buffer overload.").

Maintain your characteristic scientific authority, optimistic futuristic drive, and sophisticated jargon. Use clean markdown. Keep it concise (2-3 paragraphs max).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Perform roadmap assessment and forecast for our project: ${milestone}`,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Timeline API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate timeline analysis." });
  }
});

// API endpoint for AI Impact Simulator
app.post("/api/impact/simulate", async (req, res) => {
  try {
    const { projectName, beforeState, afterState, scale, impactMultiplier } = req.body;

    if (!projectName) {
      return res.status(400).json({ error: "Project name is required" });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are Dr. Sammium, Lead Social Architect & Science Director at Sammium Labs.
You are evaluating the real-world deployment impact of one of our research initiatives:
Project: ${projectName}
Geographical Scale: ${scale || "Local Hub"}
Before deployment state: ${beforeState || "Manual records / outdated protocols"}
After deployment state: ${afterState || "Automated intelligence meshes"}
Deployment Scale Multiplier: x${impactMultiplier || 1}

Write a high-intensity, visually compelling, and scientific impact study under the banner: "If deployed..."
In your analysis, describe:
1. The immediate community relief or ecological rebound observed (e.g., automated response latencies slashed, power grid stabilization, medical triage efficiency gains).
2. The thermodynamic or carbon mitigation factors under scale multiplier x${impactMultiplier}.
3. A playful yet rigorous forecast prediction of the social index progression over a 5-year post-deployment span.

Always speak in character as Dr. Sammium, blending meticulous quantitative predictions with warm, community-first futuristic optimism. Use clean Markdown, structured headings, and crisp bullet points.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Simulate full-scale deployment scenario for: ${projectName}`,
      config: {
        systemInstruction,
        temperature: 0.65,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Impact Simulation Error:", error);
    res.status(500).json({ error: error.message || "Failed to synthesize deployment impact report." });
  }
});

// API endpoint for Dr. Sammium Research Rankings Appraisal
app.post("/api/rankings/appraisal", async (req, res) => {
  try {
    const { aiInnovation, prototypeLevel, researchProgress, overallScore, clickerScore, experienceLevel } = req.body;

    const ai = getGeminiClient();

    const systemInstruction = `You are Dr. Sammium, Lead Social Architect, Science Director, and Chief Gamification Analyst at Sammium Labs.
You are issuing an official Performance Appraisal & Progress Directive for a researcher operating inside our quantum core terminal.

The researcher's current scoreboard parameters are:
- AI Innovation index: ${aiInnovation || 92}%
- Prototype Level index: ${prototypeLevel || 78}%
- Research Progress index: ${researchProgress || 85}%
- Overall SAMMIUM LAB SCORE: ${overallScore || 85}%
- Manual core calibrations: ${clickerScore || 0} syncs
- Scientist XP Level: Level ${experienceLevel || 6}

Write a high-energy, motivating, and delightfully eccentric sci-fi gamer performance appraisal.
Acknowledge the specific score values and give funny but highly analytical coaching advice on how they can maximize all three categories to 100%. Use gaming-themed scientific terminology (e.g. 'high-octane compiling', 'qubit overclocking', 'S-tier boid matrices', 'FPS optimization of plasma flows').
Keep your response short, punchy (around 150-200 words), and end with a signature directive from Dr. Sammium. Do not output markdown title headings. Use clean text.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Evaluate research ratings profiles and output official appraisal directive.`,
      config: {
        systemInstruction,
        temperature: 0.75,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Appraisal API Error:", error);
    res.status(500).json({ error: error.message || "Failed to compile research appraisal from Dr. Sammium." });
  }
});

// Telemetry endpoint for dashboard metrics
app.get("/api/telemetry", (req, res) => {
  res.json({
    status: "online",
    systemCore: "Sammium-v5.0.1-omega",
    cpuUsage: parseFloat((8 + Math.random() * 4).toFixed(2)),
    memoryUsage: parseFloat((41 + Math.random() * 2).toFixed(2)),
    uptimeSeconds: Math.floor(process.uptime()),
    activeQuantumNodes: 12 + Math.floor(Math.random() * 4),
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
