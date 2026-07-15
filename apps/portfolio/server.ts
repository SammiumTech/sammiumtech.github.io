import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Endpoint 1: Earth Guardian AI Disaster Checklist Generator
app.post("/api/earth-guardian/checklist", async (req, res) => {
  try {
    const { disasterType, windSpeed, rainLevel, regionName } = req.body;

    const prompt = `You are Earth Guardian AI, an expert disaster management planner. 
Generate a localized emergency response checklist for the region of ${regionName || "Botolan, Zambales"} experiencing a ${disasterType || "Typhoon"}.
Current metrics:
- Wind Speed: ${windSpeed || 0} km/h
- Rain Level: ${rainLevel || 0} mm/h

The checklist must be structured into three distinct phases:
1. Immediate Actions (Next 1-2 hours)
2. Mid-term Safety & Search (Next 6-12 hours)
3. Recovery & Support (Next 24+ hours)

Structure the checklist with highly actionable, professional tasks tailored for local emergency responders and community leaders. Keep it concise, high-impact, and directly based on the metrics. Do not include introductory text, start directly with the JSON.

Generate the output in JSON format with the following schema:
{
  "warningLevel": "Green" | "Orange" | "Red",
  "priorityStatement": "string summarizing the main focus",
  "phases": [
    {
      "phaseName": "string",
      "tasks": [
        { "title": "string", "description": "string", "assignedTo": "string" }
      ]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            warningLevel: { type: Type.STRING },
            priorityStatement: { type: Type.STRING },
            phases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseName: { type: Type.STRING },
                  tasks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        assignedTo: { type: Type.STRING }
                      },
                      required: ["title", "description", "assignedTo"]
                    }
                  }
                },
                required: ["phaseName", "tasks"]
              }
            }
          },
          required: ["warningLevel", "priorityStatement", "phases"]
        }
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Earth Guardian checklist error:", error);
    res.status(500).json({ error: error.message || "Failed to generate checklist" });
  }
});

// Endpoint 2: Sammium One AI Task Orchestration
app.post("/api/sammium/orchestrate", async (req, res) => {
  try {
    const { rawInputText } = req.body;

    if (!rawInputText) {
      return res.status(400).json({ error: "Input text is required" });
    }

    const prompt = `You are Sammium AI, the central orchestration core for the Sammium One productivity workspace.
The user has provided a messy, loose draft of thoughts, notes, and tasks:
"${rawInputText}"

Analyze this raw input and structure it into clean, cohesive components:
1. A clean list of structured project tasks that can be imported directly into a Kanban board (including standard title, description, priority, and estimation).
2. A professionally drafted, context-aware follow-up email/memo draft.
3. A summary of top priorities and estimated total hours needed.

Generate the output in JSON format with the following schema:
{
  "totalEstimatedHours": number,
  "topPriorities": ["string"],
  "kanbanTasks": [
    {
      "title": "string",
      "description": "string",
      "priority": "Low" | "Medium" | "High",
      "estimatedHours": number,
      "tag": "string"
    }
  ],
  "draftEmail": {
    "subject": "string",
    "body": "string"
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalEstimatedHours: { type: Type.NUMBER },
            topPriorities: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            kanbanTasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  priority: { type: Type.STRING },
                  estimatedHours: { type: Type.NUMBER },
                  tag: { type: Type.STRING }
                },
                required: ["title", "description", "priority", "estimatedHours", "tag"]
              }
            },
            draftEmail: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING },
                body: { type: Type.STRING }
              },
              required: ["subject", "body"]
            }
          },
          required: ["totalEstimatedHours", "topPriorities", "kanbanTasks", "draftEmail"]
        }
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Sammium orchestration error:", error);
    res.status(500).json({ error: error.message || "Failed to orchestrate workspace tasks" });
  }
});

// Endpoint 3: FarmAI Crop Advisor chat and optimizer
app.post("/api/crop-advisor/chat", async (req, res) => {
  try {
    const { cropType, temperature, moisture, questions } = req.body;

    const prompt = `You are FarmAI Co-Pilot, an advanced smart agriculture advisor.
We are cultivating ${cropType || "Rice"} in Botolan, Zambales, Philippines.
Current environmental factors:
- Temperature: ${temperature || 30}°C
- Soil Moisture: ${moisture || 60}%

The user has the following questions/concerns:
"${questions || "How can I optimize the current yield under these conditions?"}"

Provide a concise, practical, scientific analysis of the crop health and actionable solutions. Tell them exactly how to adjust watering, soil nutrients, and potential pest control. Use clear bullet points and professional agronomy advice. Keep it under 250 words, structured nicely.

Generate the output in JSON format with the following schema:
{
  "healthStatus": "Optimal" | "Sub-optimal" | "Warning" | "Critical",
  "temperatureAssessment": "string",
  "moistureAssessment": "string",
  "nitrogenRecommendation": "string",
  "waterAdvice": "string",
  "copilotMessage": "string containing detailed conversational recommendations (HTML/Markdown supported but keep it clean)"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            healthStatus: { type: Type.STRING },
            temperatureAssessment: { type: Type.STRING },
            moistureAssessment: { type: Type.STRING },
            nitrogenRecommendation: { type: Type.STRING },
            waterAdvice: { type: Type.STRING },
            copilotMessage: { type: Type.STRING }
          },
          required: ["healthStatus", "temperatureAssessment", "moistureAssessment", "nitrogenRecommendation", "waterAdvice", "copilotMessage"]
        }
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("FarmAI advisor error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze crop" });
  }
});

// Setup Vite Dev Server / Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode with Static Assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
