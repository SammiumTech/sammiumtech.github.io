import React, { useState } from "react";
import { AlertTriangle, ShieldAlert, CheckSquare, Users, Clock, FlameKindling, CloudRain, Activity } from "lucide-react";
import { EarthGuardianResponse, EarthGuardianPhase } from "../types";

export default function EarthGuardianSim() {
  const [disasterType, setDisasterType] = useState<string>("Typhoon");
  const [windSpeed, setWindSpeed] = useState<number>(85);
  const [rainLevel, setRainLevel] = useState<number>(45);
  const [regionName, setRegionName] = useState<string>("Botolan, Zambales");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<EarthGuardianResponse | null>({
    warningLevel: "Orange",
    priorityStatement: "Secure low-lying coastal areas and prepare backup communications immediately.",
    phases: [
      {
        phaseName: "Immediate Actions (Next 1-2 hours)",
        tasks: [
          { title: "Deploy Coast Guard and local rescue teams", description: "Position rubber boats near the Bucao River floodplains.", assignedTo: "Local DRRMC" },
          { title: "Initiate preemptive evacuation", description: "Evacuate families in landslide-prone sitíos of Poonbato.", assignedTo: "Barangay Health Workers" }
        ]
      },
      {
        phaseName: "Mid-term Safety & Search (Next 6-12 hours)",
        tasks: [
          { title: "Establish localized communications", description: "Deploy satellite phones and VHF radios to isolation points.", assignedTo: "Comms Division" },
          { title: "Distribute dry rations", description: "Deliver 12-hour survival packs to designated evacuation hubs.", assignedTo: "CSWD Volunteers" }
        ]
      }
    ]
  });
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/earth-guardian/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disasterType, windSpeed, rainLevel, regionName })
      });
      if (!response.ok) {
        throw new Error("Failed to contact the Earth Guardian intelligence node.");
      }
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const getWarningBadge = (level: string) => {
    switch (level) {
      case "Red":
        return <span className="bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1 rounded text-xs font-mono font-bold animate-pulse flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5" /> RED CRITICAL ALERT</span>;
      case "Orange":
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded text-xs font-mono font-bold flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> ORANGE WARNING</span>;
      default:
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded text-xs font-mono font-bold flex items-center gap-1"><Activity className="w-3.5 h-3.5" /> GREEN ALERT</span>;
    }
  };

  return (
    <div className="space-y-6" id="earth-guardian-sim">
      <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 neon-glow-blue">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Simulation Portal
            </span>
            <h3 className="font-display text-lg font-bold text-white mt-1">
              Earth Guardian AI Command Center
            </h3>
          </div>
          <div className="text-slate-400 text-xs font-mono">
            Location Target: <span className="text-blue-400 font-semibold">{regionName}</span>
          </div>
        </div>

        {/* Input Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Target Region Name</label>
              <input 
                type="text" 
                value={regionName} 
                onChange={(e) => setRegionName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition font-mono"
                placeholder="e.g. Botolan, Zambales"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase font-medium">Disaster Scenario</label>
              <div className="grid grid-cols-2 gap-2">
                {["Typhoon", "Flooding", "Landslide", "Earthquake"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setDisasterType(type)}
                    className={`py-2 px-3 text-xs font-mono rounded border text-left transition ${
                      disasterType === type 
                        ? "bg-blue-600/10 border-blue-500 text-blue-300 font-semibold" 
                        : "bg-slate-900 border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-slate-350"
                    }`}
                  >
                    {type === "Typhoon" && "🌀 "}
                    {type === "Flooding" && "🌧️ "}
                    {type === "Landslide" && "⛰️ "}
                    {type === "Earthquake" && "🫨 "}
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-slate-900/50 p-4 rounded-lg border border-slate-850">
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span className="flex items-center gap-1"><FlameKindling className="w-3.5 h-3.5 text-orange-400" /> WIND SPEED</span>
                <span className="text-blue-400 font-bold">{windSpeed} km/h</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="250" 
                value={windSpeed} 
                onChange={(e) => setWindSpeed(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <span className="text-[10px] text-slate-500 font-mono flex justify-between">
                <span>0 km/h (Calm)</span>
                <span>250 km/h (Super Typhoon)</span>
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span className="flex items-center gap-1"><CloudRain className="w-3.5 h-3.5 text-blue-400" /> RAINFALL LEVEL</span>
                <span className="text-blue-400 font-bold">{rainLevel} mm/h</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={rainLevel} 
                onChange={(e) => setRainLevel(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <span className="text-[10px] text-slate-500 font-mono flex justify-between">
                <span>0 mm/h (None)</span>
                <span>100 mm/h (Extreme)</span>
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full relative py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono font-semibold text-xs tracking-wider uppercase shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition duration-300 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              CONSULTING EARTH GUARDIAN ENGINE...
            </>
          ) : (
            "GENERATE EMERGENCY CHECKLIST & HAZARD LEVEL"
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-950/50 border border-red-900/60 text-red-200 text-xs font-mono">
          ⚠️ {error}
        </div>
      )}

      {/* Checklist Output */}
      {result && (
        <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/60 p-4 rounded-lg border border-slate-850">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">AI PRIORITY STATEMENT</span>
              <p className="text-sm text-slate-200 leading-relaxed font-sans font-medium">
                "{result.priorityStatement}"
              </p>
            </div>
            <div className="shrink-0">
              {getWarningBadge(result.warningLevel)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.phases.map((phase: EarthGuardianPhase, idx: number) => (
              <div key={idx} className="bg-slate-950/30 border border-slate-850 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-blue-400 border-b border-slate-800 pb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">{phase.phaseName}</span>
                </div>
                <div className="space-y-3">
                  {phase.tasks.map((task, tIdx) => (
                    <div key={tIdx} className="p-3 bg-slate-900/80 rounded border border-slate-800/80 hover:border-slate-700 transition space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-semibold text-white font-sans">{task.title}</h4>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">{task.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-850">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>ASSIGNED TO: <strong className="text-slate-300 font-semibold">{task.assignedTo}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
