import React, { useState } from "react";
import { Pipette, Sparkles, AlertCircle, Plus, Info, CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";
import { FertilizerPlan } from "../types";

export default function FertilizerPlanner() {
  const [crop, setCrop] = useState("rice");
  const [areaSize, setAreaSize] = useState(1); // in Hectares
  const [soilN, setSoilN] = useState<'low' | 'medium' | 'high'>('low');
  const [soilP, setSoilP] = useState<'low' | 'medium' | 'high'>('low');
  const [soilK, setSoilK] = useState<'low' | 'medium' | 'high'>('low');

  const [plan, setPlan] = useState<FertilizerPlan | null>(null);

  const calculatePlan = () => {
    // Basic Filipino agronomy N-P-K recommendation rules in kg/ha
    let recN = 90;
    let recP = 30;
    let recK = 30;

    if (crop === "rice") {
      recN = soilN === 'low' ? 100 : soilN === 'medium' ? 60 : 30;
      recP = soilP === 'low' ? 40 : soilP === 'medium' ? 20 : 0;
      recK = soilK === 'low' ? 40 : soilK === 'medium' ? 20 : 0;
    } else if (crop === "mango") {
      recN = soilN === 'low' ? 120 : soilN === 'medium' ? 80 : 40;
      recP = soilP === 'low' ? 60 : soilP === 'medium' ? 40 : 20;
      recK = soilK === 'low' ? 150 : soilK === 'medium' ? 100 : 50;
    } else if (crop === "kamote" || crop === "singkamas") {
      recN = soilN === 'low' ? 60 : soilN === 'medium' ? 40 : 20;
      recP = soilP === 'low' ? 60 : soilP === 'medium' ? 30 : 10;
      recK = soilK === 'low' ? 120 : soilK === 'medium' ? 80 : 40;
    } else { // corn
      recN = soilN === 'low' ? 120 : soilN === 'medium' ? 80 : 45;
      recP = soilP === 'low' ? 50 : soilP === 'medium' ? 30 : 15;
      recK = soilK === 'low' ? 60 : soilK === 'medium' ? 40 : 20;
    }

    // Adjust by area size (Hectares)
    const targetN = recN * areaSize;
    const targetP = recP * areaSize;
    const targetK = recK * areaSize;

    // Convert required nutrient kg to commercial bags (50kg each)
    // Urea is 46% N (46-0-0)
    // Complete is 14% N, 14% P, 14% K (14-14-14)
    // Muriate of Potash is 60% K (0-0-60)
    
    // We cover Phosphorus entirely using Complete 14-14-14
    // Complete bag contains 7kg N, 7kg P, 7kg K
    const completeBagsNeeded = Math.ceil(targetP / 7);
    
    // Complete bags supply:
    const nSuppliedByComplete = completeBagsNeeded * 7;
    const kSuppliedByComplete = completeBagsNeeded * 7;

    // Remaining N needed:
    const remainingN = Math.max(0, targetN - nSuppliedByComplete);
    // Urea bag contains 23kg N (50 * 0.46)
    const ureaBagsNeeded = Math.ceil(remainingN / 23);

    // Remaining K needed:
    const remainingK = Math.max(0, targetK - kSuppliedByComplete);
    // MOP bag contains 30kg K (50 * 0.60)
    const mopBagsNeeded = Math.ceil(remainingK / 30);

    // split schedules
    const applications = [];
    if (crop === "rice") {
      applications.push({ timing: "Basal (At Planting)", fertilizerType: "Complete (14-14-14)", rateKgHa: Math.round((completeBagsNeeded * 50) / areaSize) });
      applications.push({ timing: "Early Tillering (15 days)", fertilizerType: "Urea (46-0-0)", rateKgHa: Math.round((ureaBagsNeeded * 25) / areaSize) });
      applications.push({ timing: "Panicle Initiation (45 days)", fertilizerType: "Urea (46-0-0) + Muriate of Potash", rateKgHa: Math.round(((ureaBagsNeeded * 25) + (mopBagsNeeded * 50)) / areaSize) });
    } else {
      applications.push({ timing: "Basal dressing", fertilizerType: "Complete (14-14-14)", rateKgHa: Math.round((completeBagsNeeded * 50) / areaSize) });
      applications.push({ timing: "Vegetative Side-dress", fertilizerType: "Urea (46-0-0)", rateKgHa: Math.round((ureaBagsNeeded * 50) / areaSize) });
      applications.push({ timing: "Fruit/Tuber Bulking", fertilizerType: "Muriate of Potash (0-0-60)", rateKgHa: Math.round((mopBagsNeeded * 50) / areaSize) });
    }

    setPlan({
      cropName: crop === "rice" ? "Rice (Palay)" : crop === "mango" ? "Carabao Mango" : crop === "kamote" ? "Sweet Potato (Kamote)" : "Yellow Corn",
      nitrogenNeeded: Math.round(targetN),
      phosphorusNeeded: Math.round(targetP),
      potassiumNeeded: Math.round(targetK),
      plannedApplications: applications,
      calculatedBagRequirement: {
        urea: ureaBagsNeeded,
        npk14_14_14: completeBagsNeeded,
        mop: mopBagsNeeded
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-white rounded-2xl border border-sleek-border shadow-sm">
        <h2 className="text-xl font-bold text-sleek-title flex items-center gap-2">
          <Pipette className="w-5.5 h-5.5 text-rose-500" />
          Smart N-P-K Fertilizer Planner
        </h2>
        <p className="text-sleek-muted text-xs mt-1.5 leading-relaxed">
          Avoid costly fertilizer waste. Select your crop, enter targeted farm acreage, and current nitrogen-phosphorus-potassium (N-P-K) soil ratings to calculate the exact commercial fertilizer bag combination.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Planner Inputs */}
        <div className="bg-white p-6 rounded-2xl border border-sleek-border shadow-sm h-fit space-y-4">
          <h3 className="font-bold text-sleek-title text-sm mb-2 border-b border-sleek-border pb-2">Target Profile</h3>
          
          {/* Crop Selector */}
          <div>
            <label className="block text-xs font-semibold text-sleek-muted uppercase tracking-wider mb-1.5">Target Crop</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold cursor-pointer"
            >
              <option value="rice">Rice (Palay)</option>
              <option value="mango">Carabao Mango Orchard</option>
              <option value="kamote">Sweet Potato / Jicama (Root crops)</option>
              <option value="corn">Yellow / White Corn</option>
            </select>
          </div>

          {/* Area size */}
          <div>
            <label className="block text-xs font-semibold text-sleek-muted uppercase tracking-wider mb-1.5">Cultivated Area (Hectares)</label>
            <input 
              type="number" 
              min="0.1" 
              step="0.1"
              value={areaSize}
              onChange={(e) => setAreaSize(Number(e.target.value))}
              className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
            />
            <span className="text-[10px] text-sleek-muted font-medium block mt-1">* 1 Hectare = 10,000 square meters</span>
          </div>

          {/* Soil Nutrients Rating */}
          <div className="space-y-3.5 border-t border-sleek-border pt-3">
            <span className="block text-xs font-bold text-sleek-title">Estimated Current Soil Nutrients</span>
            
            {/* Nitrogen */}
            <div>
              <span className="block text-[10px] font-semibold text-sleek-muted uppercase mb-1">Nitrogen (N) Rating</span>
              <div className="grid grid-cols-3 gap-1.5">
                {["low", "medium", "high"].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setSoilN(n as any)}
                    className={`py-1 rounded-lg text-[10px] font-bold border capitalize transition-all cursor-pointer ${
                      soilN === n ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-sleek-muted border-sleek-border hover:bg-sleek-bg"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Phosphorus */}
            <div>
              <span className="block text-[10px] font-semibold text-sleek-muted uppercase mb-1">Phosphorus (P) Rating</span>
              <div className="grid grid-cols-3 gap-1.5">
                {["low", "medium", "high"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSoilP(p as any)}
                    className={`py-1 rounded-lg text-[10px] font-bold border capitalize transition-all cursor-pointer ${
                      soilP === p ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-sleek-muted border-sleek-border hover:bg-sleek-bg"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Potassium */}
            <div>
              <span className="block text-[10px] font-semibold text-sleek-muted uppercase mb-1">Potassium (K) Rating</span>
              <div className="grid grid-cols-3 gap-1.5">
                {["low", "medium", "high"].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setSoilK(k as any)}
                    className={`py-1 rounded-lg text-[10px] font-bold border capitalize transition-all cursor-pointer ${
                      soilK === k ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-sleek-muted border-sleek-border hover:bg-sleek-bg"
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={calculatePlan}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5 mt-2"
          >
            <Sparkles className="w-4 h-4" />
            Generate Fertilizer Schedule
          </button>
        </div>

        {/* Results Plan Display */}
        <div className="lg:col-span-2 space-y-4">
          {plan ? (
            <div className="space-y-6">
              
              {/* Bag Requirements Grid */}
              <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm">
                <h4 className="text-xs font-bold text-sleek-title uppercase tracking-wider mb-4 border-b border-sleek-border pb-2">
                  Total Bag Requirements for {areaSize} Ha of {plan.cropName}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Urea */}
                  <div className="p-4 bg-sleek-bg border border-sleek-border rounded-xl text-center">
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-md uppercase">
                      Urea (46-0-0)
                    </span>
                    <span className="text-3xl font-black text-sleek-title block mt-3">{plan.calculatedBagRequirement.urea}</span>
                    <span className="text-[10px] text-sleek-muted font-bold uppercase block mt-1">Bags (50 kg each)</span>
                  </div>

                  {/* Complete */}
                  <div className="p-4 bg-sleek-bg border border-sleek-border rounded-xl text-center">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md uppercase">
                      Complete (14-14-14)
                    </span>
                    <span className="text-3xl font-black text-sleek-title block mt-3">{plan.calculatedBagRequirement.npk14_14_14}</span>
                    <span className="text-[10px] text-sleek-muted font-bold uppercase block mt-1">Bags (50 kg each)</span>
                  </div>

                  {/* Potash */}
                  <div className="p-4 bg-sleek-bg border border-sleek-border rounded-xl text-center">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md uppercase">
                      Potash (0-0-60)
                    </span>
                    <span className="text-3xl font-black text-sleek-title block mt-3">{plan.calculatedBagRequirement.mop}</span>
                    <span className="text-[10px] text-sleek-muted font-bold uppercase block mt-1">Bags (50 kg each)</span>
                  </div>

                </div>

                <div className="mt-4 flex flex-wrap gap-4 justify-between text-xs text-sleek-muted border-t border-sleek-border pt-3">
                  <div>Required Nitrogen: <strong className="text-sleek-title">{plan.nitrogenNeeded} kg</strong></div>
                  <div>Required Phosphorus: <strong className="text-sleek-title">{plan.phosphorusNeeded} kg</strong></div>
                  <div>Required Potassium: <strong className="text-sleek-title">{plan.potassiumNeeded} kg</strong></div>
                </div>
              </div>

              {/* Split Calendar */}
              <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm">
                <h4 className="text-xs font-bold text-sleek-title uppercase tracking-wider mb-4 border-b border-sleek-border pb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                  Split-Application Schedule Calendar
                </h4>

                <div className="space-y-3">
                  {plan.plannedApplications.map((app, idx) => (
                    <div key={idx} className="p-4 bg-sleek-bg border border-sleek-border rounded-xl flex items-start gap-3">
                      <span className="p-2 bg-mint-50 border border-emerald-200 text-emerald-800 font-black rounded-lg text-xs leading-none">
                        0{idx + 1}
                      </span>
                      <div>
                        <span className="text-[10px] font-extrabold text-sleek-muted uppercase tracking-wider">{app.timing}</span>
                        <h5 className="text-xs font-bold text-sleek-title mt-0.5">{app.fertilizerType}</h5>
                        <p className="text-[11px] text-sleek-muted mt-1">
                          Recommended average dosage rate of **{app.rateKgHa} kg** per Hectare. Adjust based on local rain patterns.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-sleek-border rounded-2xl p-12 text-center text-sleek-muted flex flex-col items-center justify-center space-y-2 shadow-sm">
              <Pipette className="w-10 h-10 text-stone-300 stroke-1" />
              <p className="text-xs font-semibold">Select your crop characteristics and trigger calculation.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
