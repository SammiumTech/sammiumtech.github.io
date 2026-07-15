import React, { useState } from "react";
import { Sprout, AlertTriangle, Sparkles, HelpCircle, FileText, Coins, Droplets } from "lucide-react";
import { CropRecommendationInput, CropRecommendationResult } from "../types";

export default function CropRecommendations() {
  const [input, setInput] = useState<CropRecommendationInput>({
    soilType: "loamy",
    phLevel: 6.5,
    waterAvailability: "moderate",
    season: "dry",
    budget: "moderate"
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CropRecommendationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/crop-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      });
      if (!response.ok) {
        throw new Error("Failed to compile AI recommendations. Please check your network connection.");
      }
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="p-6 bg-white rounded-2xl border border-sleek-border shadow-sm">
        <h2 className="text-xl font-bold text-sleek-title flex items-center gap-2">
          <Sprout className="w-5.5 h-5.5 text-emerald-500" />
          AI-Powered Crop Recommendation Engine
        </h2>
        <p className="text-sleek-muted text-xs mt-1.5 leading-relaxed">
          Our agronomist AI analyzes your unique farm conditions—including soil composition, pH balance, seasonal irrigation capability, and market budget constraints—to suggest high-yield local crops tailored specifically for Botolan, Zambales.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Farm Parameters Form */}
        <div className="bg-white p-6 rounded-2xl border border-sleek-border shadow-sm h-fit">
          <h3 className="font-bold text-sleek-title text-sm mb-4 border-b border-sleek-border pb-2">Farm Parameters</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Soil Type */}
            <div>
              <label className="block text-xs font-semibold text-sleek-muted uppercase tracking-wider mb-1.5">Soil Type</label>
              <select 
                value={input.soilType}
                onChange={(e: any) => setInput({ ...input, soilType: e.target.value })}
                className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                <option value="sandy">Sandy (Coastal, Mt. Pinatubo ash-rich)</option>
                <option value="loamy">Loamy (Highly organic, balanced)</option>
                <option value="clay">Clay (Dense water-retaining clay loam)</option>
                <option value="silt">Silt (Riverine deposit, alluvial)</option>
              </select>
            </div>

            {/* pH Level */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-sleek-muted uppercase tracking-wider">Soil pH Level</label>
                <span className="text-xs font-bold text-forest-900 bg-mint-100 px-2 py-0.5 rounded-md">{input.phLevel}</span>
              </div>
              <input 
                type="range" 
                min="4.5" 
                max="8.5" 
                step="0.1"
                value={input.phLevel}
                onChange={(e) => setInput({ ...input, phLevel: Number(e.target.value) })}
                className="w-full accent-emerald-500 h-1.5 bg-sleek-bg rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-sleek-muted font-semibold px-0.5 mt-1">
                <span>Highly Acidic (4.5)</span>
                <span>Neutral (7.0)</span>
                <span>Alkaline (8.5)</span>
              </div>
            </div>

            {/* Water Availability */}
            <div>
              <label className="block text-xs font-semibold text-sleek-muted uppercase tracking-wider mb-1.5">Irrigation Capability</label>
              <div className="grid grid-cols-3 gap-2">
                {["low", "moderate", "high"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setInput({ ...input, waterAvailability: level as any })}
                    className={`py-2 text-xs font-bold border rounded-xl capitalize transition-all cursor-pointer ${
                      input.waterAvailability === level 
                        ? "bg-emerald-500 text-white border-emerald-500 shadow-sm" 
                        : "bg-white text-sleek-text border-sleek-border hover:bg-sleek-bg"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Seasonal Setting */}
            <div>
              <label className="block text-xs font-semibold text-sleek-muted uppercase tracking-wider mb-1.5">Current Season</label>
              <div className="grid grid-cols-2 gap-2">
                {["dry", "wet"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setInput({ ...input, season: s as any })}
                    className={`py-2 text-xs font-bold border rounded-xl capitalize transition-all cursor-pointer ${
                      input.season === s 
                        ? "bg-emerald-500 text-white border-emerald-500 shadow-sm" 
                        : "bg-white text-sleek-text border-sleek-border hover:bg-sleek-bg"
                    }`}
                  >
                    {s === "dry" ? "Dry Season (Amihan)" : "Wet Season (Habagat)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-xs font-semibold text-sleek-muted uppercase tracking-wider mb-1.5">Investment Budget</label>
              <select
                value={input.budget}
                onChange={(e: any) => setInput({ ...input, budget: e.target.value })}
                className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                <option value="low">Low (Seeds, minimal fertilizers/organic)</option>
                <option value="moderate">Moderate (Some machinery, standard NPK)</option>
                <option value="high">High (Drip systems, intensive high-value inputs)</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm py-2.5 px-4 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating Recommendations...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze & Recommend
                </>
              )}
            </button>
          </form>
        </div>

        {/* AI Results Output */}
        <div className="lg:col-span-2 space-y-4">
          {error && (
            <div className="p-4 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 flex items-start gap-2 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-2xl border border-sleek-border p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-emerald-100 rounded-full"></div>
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                <Sprout className="w-5 h-5 text-emerald-500 absolute top-3.5 left-3.5 animate-bounce" />
              </div>
              <div>
                <h4 className="font-bold text-sleek-title text-sm">Consulting Agronomy AI Agent</h4>
                <p className="text-sleek-muted text-xs mt-1 max-w-sm">Generating optimal Philippine crop configurations and expected revenues for the Zambales plain...</p>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-6">
              
              {/* Crop Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.recommendedCrops.map((crop, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm flex flex-col justify-between hover:border-emerald-500 transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-sleek-title text-base">{crop.name}</h4>
                        <span className="text-xs font-bold text-forest-900 bg-mint-100 border border-mint-400/20 px-2 py-0.5 rounded-lg">
                          {crop.suitabilityScore}% Match
                        </span>
                      </div>

                      <p className="text-sleek-text text-xs leading-relaxed font-medium mb-4">{crop.whySelected}</p>

                      <div className="space-y-2 border-t border-sleek-border pt-3">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Coins className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="text-sleek-muted">Est. Revenue:</span>
                          <span className="font-bold text-sleek-title">{crop.estimatedRevenue}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <Droplets className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span className="text-sleek-muted">Water Need:</span>
                          <span className="font-semibold text-sleek-title">{crop.waterRequirement}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <FileText className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span className="text-sleek-muted">Expected Yield:</span>
                          <span className="font-semibold text-sleek-title">{crop.expectedYield}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 bg-sleek-bg p-3 rounded-xl border border-sleek-border text-[11px] leading-relaxed text-sleek-text font-medium">
                      <strong className="text-sleek-title uppercase block mb-1">Quick Guide:</strong>
                      {crop.plantingGuide}
                    </div>
                  </div>
                ))}
              </div>

              {/* General Advice */}
              <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm">
                <h4 className="font-bold text-sleek-title text-sm mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Zambales Agronomist General Counsel
                </h4>
                <p className="text-sleek-text text-xs leading-relaxed font-medium">{result.generalAdvice}</p>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-sleek-border rounded-2xl p-12 text-center text-sleek-muted flex flex-col items-center justify-center space-y-2 shadow-sm">
              <Sprout className="w-10 h-10 text-stone-300 stroke-1" />
              <p className="text-xs font-semibold">Enter your farm details on the left and trigger analysis.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
