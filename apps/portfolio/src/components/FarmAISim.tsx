import React, { useState } from "react";
import { Sprout, Thermometer, Droplets, Send, RefreshCw, CheckCircle, HelpCircle } from "lucide-react";
import { FarmAIResponse } from "../types";

export default function FarmAISim() {
  const [cropType, setCropType] = useState<string>("Rice");
  const [temperature, setTemperature] = useState<number>(32);
  const [moisture, setMoisture] = useState<number>(68);
  const [questions, setQuestions] = useState<string>("What specific organic fertilizers should I apply to maximize rice yields during this hot season?");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [result, setResult] = useState<FarmAIResponse | null>({
    healthStatus: "Optimal",
    temperatureAssessment: "32°C is high but within tolerable threshold for tropical Rice cultivation under adequate wet-paddy irrigation.",
    moistureAssessment: "68% soil moisture is highly favorable, keeping root zones sufficiently hydrated.",
    nitrogenRecommendation: "Apply a targeted split-nitrogen dressing (Urea/Ammonium Sulfate) during the panicle initiation stage to optimize grain count.",
    waterAdvice: "Maintain shallow standing water levels of 2-5 cm. Implement Alternate Wetting and Drying (AWD) to reduce water consumption.",
    copilotMessage: "<strong>Greetings from FarmAI Co-Pilot!</strong><br/><br/>Your Rice crop is currently showing robust, optimal health under these environmental settings in Botolan. The 68% soil moisture is excellent. To safeguard against potential heat stress under 32°C, focus on water conservation: implement AWD (Alternate Wetting and Drying) to let the soil breathe while saving precious reservoir water. For nutrient management, apply the second nitrogen dressing soon. Watch closely for signs of early brown planthopper activity due to warm humidity!"
  });

  const presetQuestions = [
    "What specific organic fertilizers should I apply to maximize rice yields during this hot season?",
    "How do I prevent root rot or fungal disease if moisture reaches 90%?",
    "How often should I irrigate this crop under 35°C heat?"
  ];

  const handleConsult = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/crop-advisor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cropType, temperature, moisture, questions })
      });
      if (!response.ok) {
        throw new Error("Failed to reach the FarmAI telemetry node.");
      }
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Optimal":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Sub-optimal":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "Warning":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse";
      case "Critical":
      default:
        return "bg-red-500/10 text-red-400 border-red-500/30 animate-pulse font-bold";
    }
  };

  return (
    <div className="space-y-6" id="farmai-sim">
      <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 neon-glow-emerald">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Simulation Portal
            </span>
            <h3 className="font-display text-lg font-bold text-white mt-1">
              FarmAI Telemetry & Crop Advisor
            </h3>
          </div>
          <div className="text-slate-400 text-xs font-mono">
            Location: <span className="text-emerald-400 font-semibold">Botolan, Zambales</span>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase font-medium">Select Crop Variant</label>
              <div className="grid grid-cols-4 gap-1.5">
                {["Rice", "Corn", "Coconut", "Vegetables"].map((crop) => (
                  <button
                    key={crop}
                    onClick={() => setCropType(crop)}
                    className={`py-1.5 px-1 rounded text-[10px] font-mono border text-center transition ${
                      cropType === crop
                        ? "bg-emerald-600/10 border-emerald-500 text-emerald-400 font-bold"
                        : "bg-slate-900 border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-slate-350"
                    }`}
                  >
                    {crop === "Rice" && "🌾"}
                    {crop === "Corn" && "🌽"}
                    {crop === "Coconut" && "🥥"}
                    {crop === "Vegetables" && "🥬"}
                    <span className="block mt-0.5">{crop}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-slate-400 uppercase">Consultation Inquiry / Concern</label>
              <textarea
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
                className="w-full h-20 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 rounded p-2 text-xs focus:outline-none focus:border-emerald-500 transition font-sans"
                placeholder="Ask our Co-Pilot anything..."
              />
              <div className="flex flex-wrap gap-1">
                {presetQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuestions(q)}
                    className="text-[9px] bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-400 hover:text-slate-300 px-1.5 py-0.5 rounded transition truncate max-w-[200px]"
                    title={q}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-slate-900/50 p-4 rounded-lg border border-slate-850 justify-center flex flex-col">
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-amber-500" /> AMBIENT TEMP</span>
                <span className="text-emerald-400 font-bold">{temperature}°C</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="50" 
                value={temperature} 
                onChange={(e) => setTemperature(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-[10px] text-slate-500 font-mono flex justify-between">
                <span>10°C (Cold)</span>
                <span>50°C (Extreme Heat)</span>
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-blue-400" /> SOIL MOISTURE</span>
                <span className="text-emerald-400 font-bold">{moisture}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={moisture} 
                onChange={(e) => setMoisture(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-[10px] text-slate-500 font-mono flex justify-between">
                <span>0% (Bone Dry)</span>
                <span>100% (Saturated)</span>
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleConsult}
          disabled={loading || !questions.trim()}
          className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-semibold text-xs tracking-wider uppercase shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition duration-300 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              RETRIEVING AGRONOMIC INSIGHTS...
            </>
          ) : (
            <>
              <Sprout className="w-3.5 h-3.5" />
              SUBMIT SENSOR TELEMETRY & INQUIRY
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-950/50 border border-red-900/60 text-red-200 text-xs font-mono">
          ⚠️ {error}
        </div>
      )}

      {/* Advisory Output */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-in">
          {/* Detailed analysis cards */}
          <div className="md:col-span-1 space-y-3">
            <div className={`p-4 rounded-xl border ${getStatusColor(result.healthStatus)} flex flex-col items-center justify-center text-center`}>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">ANALYZED STATUS</span>
              <span className="text-xl font-bold font-display mt-1">{result.healthStatus}</span>
            </div>

            <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-850 space-y-3.5 text-xs">
              <div>
                <span className="font-mono text-[10px] text-slate-400 block uppercase font-bold text-amber-500">🌡️ Temperature Assessment</span>
                <p className="text-slate-300 mt-1 leading-relaxed font-sans">{result.temperatureAssessment}</p>
              </div>
              <div className="w-full h-px bg-slate-850" />
              <div>
                <span className="font-mono text-[10px] text-slate-400 block uppercase font-bold text-blue-400">💧 Moisture Assessment</span>
                <p className="text-slate-300 mt-1 leading-relaxed font-sans">{result.moistureAssessment}</p>
              </div>
            </div>
          </div>

          {/* Copilot feedback & recommendations */}
          <div className="md:col-span-2 space-y-4">
            <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-850 space-y-3">
              <span className="text-[10px] text-slate-400 font-mono tracking-wide uppercase font-bold block border-b border-slate-850 pb-1.5 text-emerald-400">🌱 Immediate Crop Prescriptions</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="p-3 bg-slate-950/40 rounded border border-slate-850 space-y-1">
                  <strong className="text-slate-200 text-xs font-mono text-emerald-400 block font-bold">Fertilizer Dressing</strong>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{result.nitrogenRecommendation}</p>
                </div>
                <div className="p-3 bg-slate-950/40 rounded border border-slate-850 space-y-1">
                  <strong className="text-slate-200 text-xs font-mono text-teal-400 block font-bold">Irrigation Protocol</strong>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{result.waterAdvice}</p>
                </div>
              </div>
            </div>

            <div className="relative p-5 rounded-xl bg-slate-950/80 border border-slate-850 shadow-inner">
              <div className="absolute top-3 right-3 text-[10px] font-mono text-slate-600 bg-slate-900 border border-slate-850 px-1.5 py-0.2 rounded font-semibold uppercase">
                CO-PILOT MESSAGE
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  🤖
                </div>
                <div className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
                  <div dangerouslySetInnerHTML={{ __html: result.copilotMessage }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
