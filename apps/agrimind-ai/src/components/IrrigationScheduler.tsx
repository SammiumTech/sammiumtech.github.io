import React, { useState, useEffect } from "react";
import { 
  Droplets, Plus, Trash2, Calendar, AlertCircle, CheckCircle2, CloudRain, ShieldAlert, Sparkles
} from "lucide-react";
import { IrrigationSchedule, WeatherData } from "../types";

interface IrrigationProps {
  weather: WeatherData | null;
}

export default function IrrigationScheduler({ weather }: IrrigationProps) {
  const [schedules, setSchedules] = useState<IrrigationSchedule[]>([]);
  const [showProposal, setShowProposal] = useState(true);
  const [proposalApproved, setProposalApproved] = useState(false);
  const [form, setForm] = useState({
    cropName: "Carabao Mango",
    fieldLocation: "South Orchard",
    growthStage: "flowering" as any,
    areaSizeSqm: 100
  });

  // Calculate recommended liters based on crop type & growth stage
  const calculateWaterLiters = (crop: string, stage: string, sqm: number): number => {
    let multiplier = 2; // base liters per sqm per day
    
    // adjust by crop type
    const lowWaterCrops = ["mango", "kamote", "sweet potato", "singkamas", "jicama", "peanut"];
    const highWaterCrops = ["rice", "palay", "bittergourd", "ampalaya", "tomato", "eggplant"];
    
    const isLow = lowWaterCrops.some(c => crop.toLowerCase().includes(c));
    const isHigh = highWaterCrops.some(c => crop.toLowerCase().includes(c));

    if (isLow) multiplier = 1.2;
    else if (isHigh) multiplier = 4.5;

    // adjust by growth stage
    switch (stage) {
      case "germination": multiplier *= 1.2; break;
      case "vegetative": multiplier *= 1.5; break;
      case "flowering": multiplier *= 2.0; break; // peak water demand
      case "fruiting": multiplier *= 1.8; break;
      case "harvest": multiplier *= 0.5; break; // minimize water
    }

    return Math.round(multiplier * sqm);
  };

  useEffect(() => {
    const saved = localStorage.getItem("botolan_irrigation_schedules");
    if (saved) {
      setSchedules(JSON.parse(saved));
    } else {
      const initial: IrrigationSchedule[] = [
        {
          id: "1",
          cropName: "Palay (Dry Season Rice)",
          fieldLocation: "North Flatland",
          waterAmountLiters: 1800,
          frequencyDays: 1,
          nextScheduledTime: new Date(Date.now() + 12 * 3600 * 1000).toISOString().split("T")[0] + " 06:00 AM",
          status: "pending",
          growthStage: "vegetative"
        },
        {
          id: "2",
          cropName: "Sweet Potato (Kamote)",
          fieldLocation: "East Sandy Plot",
          waterAmountLiters: 450,
          frequencyDays: 3,
          nextScheduledTime: new Date(Date.now() + 36 * 3600 * 1000).toISOString().split("T")[0] + " 07:00 AM",
          status: "pending",
          growthStage: "fruiting"
        }
      ];
      setSchedules(initial);
      localStorage.setItem("botolan_irrigation_schedules", JSON.stringify(initial));
    }
  }, []);

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const liters = calculateWaterLiters(form.cropName, form.growthStage, form.areaSizeSqm);
    
    const newSched: IrrigationSchedule = {
      id: Date.now().toString(),
      cropName: form.cropName,
      fieldLocation: form.fieldLocation,
      waterAmountLiters: liters,
      frequencyDays: form.growthStage === "flowering" ? 2 : 3,
      nextScheduledTime: new Date(Date.now() + 24 * 3600 * 1000).toISOString().split("T")[0] + " 06:30 AM",
      status: "pending",
      growthStage: form.growthStage
    };

    const updated = [newSched, ...schedules];
    setSchedules(updated);
    localStorage.setItem("botolan_irrigation_schedules", JSON.stringify(updated));
  };

  const handleToggleStatus = (id: string, action: 'completed' | 'skipped') => {
    const updated = schedules.map(s => {
      if (s.id === id) {
        return { ...s, status: action };
      }
      return s;
    });
    setSchedules(updated);
    localStorage.setItem("botolan_irrigation_schedules", JSON.stringify(updated));
  };

  const handleDeleteSchedule = (id: string) => {
    const updated = schedules.filter(s => s.id !== id);
    setSchedules(updated);
    localStorage.setItem("botolan_irrigation_schedules", JSON.stringify(updated));
  };

  const handleApproveProposal = () => {
    const approvedSched: IrrigationSchedule = {
      id: "proposal-" + Date.now(),
      cropName: "Carabao Mango (Orchard)",
      fieldLocation: "South Orchard Hill",
      waterAmountLiters: 1500,
      frequencyDays: 2,
      nextScheduledTime: new Date(Date.now() + 12 * 3600 * 1000).toISOString().split("T")[0] + " 06:00 AM",
      status: "pending",
      growthStage: "flowering"
    };

    const updated = [approvedSched, ...schedules];
    setSchedules(updated);
    localStorage.setItem("botolan_irrigation_schedules", JSON.stringify(updated));
    setShowProposal(false);
    setProposalApproved(true);
    setTimeout(() => setProposalApproved(false), 5000);
  };

  // Weather-aware alert check (if rain chance is > 60%, trigger skip advice)
  const isRainImminent = weather && weather.rainfallProbability >= 60;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-white rounded-2xl border border-sleek-border shadow-sm">
        <h2 className="text-xl font-bold text-sleek-title flex items-center gap-2">
          <Droplets className="w-5.5 h-5.5 text-blue-500" />
          Smart Irrigation Scheduler & Water Log
        </h2>
        <p className="text-sleek-muted text-xs mt-1.5 leading-relaxed">
          Keep crops appropriately hydrated while practicing wise resource conservation. Create schedules and calculate accurate water volume needs by matching target area sizes with individual plant transpiration coefficients.
        </p>
      </div>

      {/* Weather Rain Aware warning banner */}
      {isRainImminent && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3">
          <CloudRain className="w-5.5 h-5.5 text-blue-500 animate-bounce shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-black text-blue-900 uppercase tracking-wide">Weather-Aware Irrigation Advisory</h4>
            <p className="text-xs text-blue-800 font-semibold mt-1 leading-relaxed">
              Botolan is forecast to experience a **{weather?.rainfallProbability}% chance of rain** today ({weather?.condition}). We highly recommend **SKIPPING** or reducing planned irrigation cycles to prevent root rot and minimize water expenses.
            </p>
          </div>
        </div>
      )}

      {/* --- HUMAN-IN-THE-LOOP (HITL) INTERACTIVE PROPOSAL --- */}
      {showProposal && (
        <div className="p-5 bg-gradient-to-r from-blue-50/50 via-white to-blue-50/20 border border-blue-300/60 rounded-2xl shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-blue-700 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-500 animate-spin" style={{ animationDuration: '4s' }} />
              🤖 Sentinel AI Automated Irrigation Proposal
            </span>
            <h4 className="text-sm font-black text-sleek-title">
              Proposal: Apply <span className="text-blue-600 font-black">1,500 Liters</span> to South Orchard Hill (Carabao Mango)
            </h4>
            <p className="text-[11px] text-sleek-muted leading-relaxed max-w-3xl">
              <strong>XAI Reasoning:</strong> Moraza sensors report soil moisture dropped to 32% (optimal threshold 45%). Zero precipitation forecasted for Zambales over the next 48 hours. Peak flowering stage requires deep hydration.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[8.5px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-sm uppercase">AI Confidence: 94%</span>
              <span className="text-[8.5px] font-bold bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded-sm uppercase">Source: Botolan Sensor Array & Weather Outlook</span>
              <span className="text-[8.5px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-sm uppercase">Category: Verified Advisory</span>
            </div>
          </div>

          <div className="flex gap-2 shrink-0 w-full md:w-auto">
            <button 
              onClick={() => setShowProposal(false)}
              className="flex-1 md:flex-none px-3.5 py-2 hover:bg-stone-100 text-stone-500 border border-stone-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Dismiss
            </button>
            <button 
              onClick={handleApproveProposal}
              className="flex-1 md:flex-none px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1"
            >
              <CheckCircle2 className="w-4 h-4" /> Approve & Queue
            </button>
          </div>
        </div>
      )}

      {proposalApproved && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
          <span>Approved by Farmer: AI recommendation successfully queued into active water sequence log.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Creator Form */}
        <div className="bg-white p-6 rounded-2xl border border-sleek-border shadow-sm h-fit">
          <h3 className="font-bold text-sleek-title text-sm mb-4 border-b border-sleek-border pb-2 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-blue-500" />
            Plan Watering Cycle
          </h3>
          <form onSubmit={handleAddSchedule} className="space-y-4">
            
            <div>
              <label className="block text-xs font-semibold text-sleek-muted uppercase tracking-wider mb-1.5">Crop / Variety</label>
              <input 
                type="text" 
                value={form.cropName}
                onChange={(e) => setForm({ ...form, cropName: e.target.value })}
                className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                placeholder="e.g. Dry Season Rice"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-sleek-muted uppercase tracking-wider mb-1.5">Field Plot / Zone</label>
              <input 
                type="text" 
                value={form.fieldLocation}
                onChange={(e) => setForm({ ...form, fieldLocation: e.target.value })}
                className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                placeholder="e.g. North Plain"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-sleek-muted uppercase tracking-wider mb-1.5">Growth Stage</label>
                <select 
                  value={form.growthStage}
                  onChange={(e: any) => setForm({ ...form, growthStage: e.target.value })}
                  className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                >
                  <option value="germination">Germination</option>
                  <option value="vegetative">Vegetative</option>
                  <option value="flowering">Flowering</option>
                  <option value="fruiting">Fruiting</option>
                  <option value="harvest">Harvest</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sleek-muted uppercase tracking-wider mb-1.5">Plot Size (m²)</label>
                <input 
                  type="number" 
                  min="1"
                  value={form.areaSizeSqm}
                  onChange={(e) => setForm({ ...form, areaSizeSqm: Number(e.target.value) })}
                  className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  required
                />
              </div>
            </div>

            {/* Smart Estimates Preview */}
            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-center">
              <span className="text-[10px] text-blue-600 uppercase font-bold tracking-wider block">Estimated Required Vol.</span>
              <span className="text-xl font-extrabold text-blue-900 mt-1 block">
                {calculateWaterLiters(form.cropName, form.growthStage, form.areaSizeSqm).toLocaleString()} Liters
              </span>
              <span className="text-[9px] text-sleek-muted block mt-1 font-medium">* Calculated for typical Zambales conditions</span>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add to Calendar
            </button>
          </form>
        </div>

        {/* Calendar and schedule list */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm">
            <h3 className="font-bold text-sleek-title text-xs uppercase tracking-wider mb-4 border-b border-sleek-border pb-2 flex items-center justify-between">
              <span>Watering Schedule Logs</span>
              <span className="text-[10px] font-bold text-sleek-muted">Total: {schedules.length} Cycles</span>
            </h3>

            {schedules.length === 0 ? (
              <p className="text-center text-xs text-sleek-muted py-6">No irrigation cycles listed.</p>
            ) : (
              <div className="space-y-3.5">
                {schedules.map((s) => (
                  <div key={s.id} className="p-4 bg-sleek-bg border border-sleek-border rounded-xl relative group flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-sleek-title">{s.cropName}</span>
                        <span className="text-[9px] font-extrabold text-sleek-muted bg-white/60 border border-sleek-border px-1.5 py-0.5 rounded-md uppercase">
                          {s.growthStage}
                        </span>
                        <span className="text-[10px] font-semibold text-blue-500 bg-blue-50 px-2 py-0.2 rounded-full">
                          {s.waterAmountLiters.toLocaleString()} Liters
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold text-sleek-muted">
                        <span>Zone: {s.fieldLocation}</span>
                        <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Next: {s.nextScheduledTime}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {s.status === "pending" ? (
                        <>
                          {isRainImminent && (
                            <button
                              onClick={() => handleToggleStatus(s.id, "skipped")}
                              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[10px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <AlertCircle className="w-3.5 h-3.5" />
                              Skip (Pre-Rain)
                            </button>
                          )}
                          <button
                            onClick={() => handleToggleStatus(s.id, "completed")}
                            className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            Water Done
                          </button>
                        </>
                      ) : (
                        <span className={`text-[10px] uppercase tracking-wide font-black px-2.5 py-1 rounded-md border ${
                          s.status === "completed" ? "bg-mint-50 text-emerald-800 border-emerald-100" : "bg-white text-sleek-muted border-sleek-border"
                        }`}>
                          {s.status}
                        </span>
                      )}

                      <button
                        onClick={() => handleDeleteSchedule(s.id)}
                        className="p-1.5 text-sleek-muted hover:text-red-600 hover:bg-white rounded-lg transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Conservational Advice */}
          <div className="bg-sleek-bg p-4 border border-sleek-border rounded-2xl flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-sleek-title uppercase tracking-wide">Farming Pro-Tip</h4>
              <p className="text-[11px] text-sleek-muted leading-relaxed mt-1 font-medium">
                Watering early in the morning (before 7:00 AM) or late in the afternoon reduces evaporation by up to 30%, ensuring the water penetrates deep into the soil rhizosphere.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
