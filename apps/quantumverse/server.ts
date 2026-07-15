import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily/safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined. Falling back to local educational simulator mode.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Fallback educational quantum database when Gemini API key is missing or calls fail
const FALLBACK_QUIZZES: Record<string, any> = {
  "superposition": [
    {
      question: "What does quantum superposition allow a system to do?",
      options: [
        "Be in multiple states simultaneously until a measurement is made",
        "Move faster than the speed of light through empty space",
        "Maintain absolute certainty of position and momentum",
        "Destroy any particle that comes near it"
      ],
      correctIndex: 0,
      explanation: "Superposition allows a quantum system to exist in a linear combination of multiple states at once. When measured, it collapses into a single classical state."
    },
    {
      question: "In Dirac notation, what does a state |ψ⟩ = α|0⟩ + β|1⟩ represent?",
      options: [
        "The system is definitely in state 0",
        "The system is in state 1 with probability 100%",
        "A superposition of states |0⟩ and |1⟩ where |α|² and |β|² are the respective probabilities",
        "A chemical bond between two hydrogen atoms"
      ],
      correctIndex: 2,
      explanation: "This is the classic qubit state. The coefficients α and β are probability amplitudes, where their squared magnitudes represent the probabilities of measuring 0 or 1."
    }
  ],
  "duality": [
    {
      question: "In the double-slit experiment, what happens when we observe/measure which slit the electron passes through?",
      options: [
        "The interference pattern becomes sharper and more visible",
        "The interference pattern disappears, and particles behave classically",
        "The electron splits into two separate entities",
        "The detector explodes from thermal energy"
      ],
      correctIndex: 1,
      explanation: "Measuring the 'which-way' information collapses the quantum wavefunction, causing the wave-like interference pattern to disappear and revealing a classical particle-like distribution."
    }
  ],
  "entanglement": [
    {
      question: "What did Einstein famously call quantum entanglement?",
      options: [
        "Spooky action at a distance",
        "Cosmic glue of the universe",
        "The non-local relative mechanism",
        "Subatomic gravity waves"
      ],
      correctIndex: 0,
      explanation: "Albert Einstein doubted the completeness of quantum mechanics and referred to the non-local correlation of entangled states as 'spooky action at a distance' ('spukhafte Fernwirkung')."
    }
  ]
};

// 1. Quantum AI Mentor Chat Endpoint
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Simulate friendly local physics mentor response
      return res.json({
        text: `Greetings from the local Quantum Simulator! I am here to help you learn physics. (Note: Gemini API key is not currently set in Secrets, so I'm running in offline educational tutor mode.)\n\nTo answer your question: quantum mechanics operates on the subatomic level, where properties like position and momentum are described by wavefunctions instead of classical trajectories. What quantum simulation would you like to explore next?`
      });
    }

    const ai = getGeminiClient();
    
    // Format history for chats
    // history is expected as an array of { role: 'user' | 'model', text: string }
    const formattedHistory = (history || []).map((h: any) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.text }]
    }));

    let response;
    let currentModel = "gemini-3.5-flash";
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        attempts++;
        const chat = ai.chats.create({
          model: currentModel,
          config: {
            systemInstruction: `You are the Sammium Quantum Mentor, a prestigious, extremely friendly and engaging quantum physicist. 
Your goal is to make quantum mechanics understandable, inspiring, and beautiful to people of all backgrounds.
- Explain complex mathematical formulas (like Schrödinger's equation or Bloch Spheres) using clean, vivid real-world analogies (e.g. musical instruments, spinning coins, water waves).
- Differentiate clearly between accepted physics (e.g. quantum mechanics math, wave-particle duality) and interpretations (e.g. Copenhagen, Many-Worlds, Pilot Wave), and emphasize what remains an open question.
- Keep answers structured with short paragraphs, clear sections, bullet points, and occasionally formatted LaTeX-style formulas (like |ψ⟩).
- Encourage active learning and suggest the next simulator they should try.`,
          },
          history: formattedHistory
        });

        response = await chat.sendMessage({ message: message });
        break; // Success!
      } catch (err: any) {
        const isTransient = err.message?.includes("503") || err.message?.includes("UNAVAILABLE") || err.message?.includes("demand") || err.status === 503;
        if (isTransient && attempts < maxAttempts) {
          console.warn(`[Resilient Chat] Model ${currentModel} returned 503/UNAVAILABLE on attempt ${attempts}. Retrying in 500ms...`);
          await new Promise(resolve => setTimeout(resolve, 500));
          if (attempts === maxAttempts - 1) {
            currentModel = "gemini-3.1-flash-lite";
            console.warn(`[Resilient Chat] Switching to fallback model: ${currentModel}`);
          }
        } else {
          throw err;
        }
      }
    }

    if (!response) {
      throw new Error("Empty response received from AI Mentor");
    }

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    return res.status(500).json({ 
      error: "Failed to communicate with AI Mentor", 
      details: error.message,
      text: "Apologies, fellow researcher! My quantum coherence was disrupted by background thermal noise (server communication error). Please check your internet or retry."
    });
  }
});

// 2. Adaptive Quantum Quiz Generator Endpoint
app.post("/api/generate-quiz", async (req, res) => {
  const { topic, difficulty } = req.body;
  const targetTopic = topic || "superposition";
  const targetDifficulty = difficulty || "beginner";

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback to offline educational database
      const fallbackQuestions = FALLBACK_QUIZZES[targetTopic] || FALLBACK_QUIZZES["superposition"];
      return res.json({ questions: fallbackQuestions });
    }

    const ai = getGeminiClient();
    const prompt = `Generate a high-quality multiple choice quiz about the quantum physics topic: "${targetTopic}".
The target difficulty is: "${targetDifficulty}".
Generate exactly 3 relevant and scientifically accurate multiple choice questions.
For each question, provide 4 options, the exact index (0-3) of the correct option, and a deep explanatory note of why it is correct and others are wrong.
Keep the language extremely educational, correct, and professional. Use LaTeX style state symbols like |0⟩ or |1⟩ when talking about quantum states or qubits.`;

    let response;
    let currentModel = "gemini-3.5-flash";
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        attempts++;
        response = await ai.models.generateContent({
          model: currentModel,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              required: ["questions"],
              properties: {
                questions: {
                  type: Type.ARRAY,
                  description: "List of multiple-choice questions",
                  items: {
                    type: Type.OBJECT,
                    required: ["question", "options", "correctIndex", "explanation"],
                    properties: {
                      question: {
                        type: Type.STRING,
                        description: "The multiple choice question text."
                      },
                      options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Four distinct options for the answer."
                      },
                      correctIndex: {
                        type: Type.INTEGER,
                        description: "The index of the correct option (0, 1, 2, or 3)."
                      },
                      explanation: {
                        type: Type.STRING,
                        description: "An engaging, deep physical explanation of the answer, explaining why it is correct."
                      }
                    }
                  }
                }
              }
            }
          }
        });
        break; // Success!
      } catch (err: any) {
        const isTransient = err.message?.includes("503") || err.message?.includes("UNAVAILABLE") || err.message?.includes("demand") || err.status === 503;
        if (isTransient && attempts < maxAttempts) {
          console.warn(`[Resilient Quiz] Model ${currentModel} returned 503/UNAVAILABLE on attempt ${attempts}. Retrying in 500ms...`);
          await new Promise(resolve => setTimeout(resolve, 500));
          if (attempts === maxAttempts - 1) {
            currentModel = "gemini-3.1-flash-lite";
            console.warn(`[Resilient Quiz] Switching to fallback model: ${currentModel}`);
          }
        } else {
          throw err;
        }
      }
    }

    if (!response) {
      throw new Error("Empty response received from Quiz Generator");
    }

    const jsonText = response.text?.trim() || "{}";
    const quizData = JSON.parse(jsonText);
    return res.json(quizData);

  } catch (error: any) {
    console.error("Gemini Quiz Generation Error:", error);
    // Graceful fallback to static database
    const fallbackQuestions = FALLBACK_QUIZZES[targetTopic] || FALLBACK_QUIZZES["superposition"];
    return res.json({ 
      questions: fallbackQuestions, 
      warning: "Offline educational quiz mode active due to quantum static (API key not active or limit reached)." 
    });
  }
});

// 3. Formula Explainer Endpoint
app.post("/api/explain-formula", async (req, res) => {
  const { formulaName, formulaString } = req.body;

  if (!formulaName) {
    return res.status(400).json({ error: "formulaName is required" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        formulaName: formulaName,
        formulaString: formulaString || "H|ψ⟩ = E|ψ⟩",
        analogy: "Think of a guitar string. Just like a guitar string has fixed harmonics (fundamental frequency, overtones) depending on its tension and length, a quantum wave function has fixed discrete energy states (eigenstates) depending on its potential energy boundaries.",
        breakdown: [
          { symbol: "H", name: "Hamiltonian Operator", description: "Represents the total energy of the system (kinetic + potential energy)." },
          { symbol: "|ψ⟩", name: "State Vector / Wavefunction", description: "Contains all the information about the quantum state of the system." },
          { symbol: "E", name: "Energy Eigenvalue", description: "The specific measurable energy level that the system can occupy." }
        ],
        conceptOverview: "Schrödinger's Equation is the fundamental equation of quantum mechanics. Instead of predicting the exact path of a particle like classical physics, it calculates the wave of probability amplitudes that tells us where a particle is most likely to materialize when we measure it.",
        deepFact: "Because the wavefunction is a wave, particles can exhibit interference, superposition, and even tunnel through physical solid barriers they wouldn't have enough kinetic energy to climb classically!"
      });
    }

    const ai = getGeminiClient();
    const prompt = `Explain the quantum mechanics formula: "${formulaName}" (given mathematically as: "${formulaString}").
Provide a structured breakdown explaining:
1. A powerful real-world analogy.
2. An array of the key mathematical symbols, their names, and descriptions.
3. A conceptual overview.
4. An amazing mind-blowing deep quantum fact.
Format the output as a strict JSON matching the requested schema.`;

    let response;
    let currentModel = "gemini-3.5-flash";
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        attempts++;
        response = await ai.models.generateContent({
          model: currentModel,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              required: ["formulaName", "formulaString", "analogy", "breakdown", "conceptOverview", "deepFact"],
              properties: {
                formulaName: { type: Type.STRING },
                formulaString: { type: Type.STRING },
                analogy: { type: Type.STRING, description: "A simple, highly relatable analogy for a high school or college student." },
                breakdown: {
                  type: Type.ARRAY,
                  description: "Array of formula components.",
                  items: {
                    type: Type.OBJECT,
                    required: ["symbol", "name", "description"],
                    properties: {
                      symbol: { type: Type.STRING },
                      name: { type: Type.STRING },
                      description: { type: Type.STRING }
                    }
                  }
                },
                conceptOverview: { type: Type.STRING, description: "Clear explanation of what the formula means physically." },
                deepFact: { type: Type.STRING, description: "A mind-blowing quantum fact about this equation or its applications." }
              }
            }
          }
        });
        break; // Success!
      } catch (err: any) {
        const isTransient = err.message?.includes("503") || err.message?.includes("UNAVAILABLE") || err.message?.includes("demand") || err.status === 503;
        if (isTransient && attempts < maxAttempts) {
          console.warn(`[Resilient Formula] Model ${currentModel} returned 503/UNAVAILABLE on attempt ${attempts}. Retrying in 500ms...`);
          await new Promise(resolve => setTimeout(resolve, 500));
          if (attempts === maxAttempts - 1) {
            currentModel = "gemini-3.1-flash-lite";
            console.warn(`[Resilient Formula] Switching to fallback model: ${currentModel}`);
          }
        } else {
          throw err;
        }
      }
    }

    if (!response) {
      throw new Error("Empty response received from Formula Explainer");
    }

    const jsonText = response.text?.trim() || "{}";
    return res.json(JSON.parse(jsonText));

  } catch (error: any) {
    console.warn("Gemini Formula Explainer Offline Fallback Triggered:", error.message || error);
    return res.json({
      formulaName: formulaName,
      formulaString: formulaString || "H|ψ⟩ = E|ψ⟩",
      analogy: "Think of a musical instrument's harmonics. Just like a guitar string resonates only at integer-related resonant frequencies, quantum states are resonant waves trapped inside potential wells, creating quantized states.",
      breakdown: [
        { symbol: "H", name: "Hamiltonian Operator", description: "An operator representing the total energy of the system." },
        { symbol: "|ψ⟩", name: "Psi / Wavefunction", description: "The mathematical state vector containing all probability amplitudes." },
        { symbol: "E", name: "Energy Levels", description: "Discrete energy values that are physically observable." }
      ],
      conceptOverview: "This quantum equation acts as the central pillar of non-relativistic quantum physics, describing how the quantum state of a physical system changes over time.",
      deepFact: "This equation is fully deterministic; it is only the act of classical measurement that introduces probability and randomness!"
    });
  }
});

// Vite middleware setup or Static file hosting depending on NODE_ENV
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode with static file hosting...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sammium QuantumVerse Server successfully listening on http://localhost:${PORT}`);
  });
}

startServer();
