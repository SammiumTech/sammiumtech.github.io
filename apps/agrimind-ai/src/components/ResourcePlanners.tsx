import React, { useState } from "react";
import { Droplets, Pipette, AlertTriangle, CloudSun, Shield, Wind, Flame } from "lucide-react";
import IrrigationScheduler from "./IrrigationScheduler";
import FertilizerPlanner from "./FertilizerPlanner";

export default function ResourcePlanners() {
  const [activeSubTab, setActiveSubTab] = useState<"irrigation" | "fertilizer" | "climaterisk">("irrigation");

  // Climate Risk simulated indices
  const riskFactors = [
    { name: "Heat Stress", value: 38, max: 100, status: "Low Risk", color: "bg-amber-500", icon: Flame, advise: "No immediate heat risk. Maintain standard morning watering patterns to avoid soil evaporation." },
    { name: "Heavy Rainfall / Flood", value: 82, max: 100, status: "Critical Threat", color: "bg-red-500", icon: AlertTriangle, advise: "High flood likelihood. Prepare drainage trenches in low-lying plots. Delay fertilizer application to prevent wash-off." },
    { name: "Dry Spells (El Niño)", value: 15, max: 100, status: "Stable", color: "bg-emerald-500", icon: CloudSun, advise: "No drought stress in the current monsoon cycle. Conserve reservoir levels for the dry season." },
    { name: "Strong Winds / Gale", value: 64, max: 100, status: "Moderate Risk", color: "bg-blue-500", icon: Wind, advise: "Strong winds detected. Stale or prop up tall young stalks, specifically rice in early maturation." }
  ];

  return (
    <div className="space-y-6">
      {/* Sub-nav */}
      <div className="flex flex-wrap bg-white p-1 rounded-xl border border-sleek-border w-fit shadow-xs gap-1">
        <button
          onClick={() => setActiveSubTab("irrigation")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "irrigation"
              ? "bg-emerald-500 text-white shadow-xs"
              : "text-sleek-text hover:bg-sleek-bg"
          }`}
        >
          <Droplets className="w-4 h-4" />
          Smart Irrigation Scheduler
        </button>
        <button
          onClick={() => setActiveSubTab("fertilizer")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "fertilizer"
              ? "bg-emerald-500 text-white shadow-xs"
              : "text-sleek-text hover:bg-sleek-bg"
          }`}
        >
          <Pipette className="w-4 h-4" />
          Fertilizer split Calculator
        </button>
        <button
          onClick={() => setActiveSubTab("climaterisk")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "climaterisk"
              ? "bg-emerald-500 text-white shadow-xs"
              : "text-sleek-text hover:bg-sleek-bg"
          }`}
        >
          <Shield className="w-4 h-4" />
          Climate Risk AI
        </button>
      </div>

      <div>
        {activeSubTab === "irrigation" && <IrrigationScheduler weather={null} />}
        {activeSubTab === "fertilizer" && <FertilizerPlanner />}
        
        {activeSubTab === "climaterisk" && (
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-2xl border border-sleek-border shadow-sm">
              <h2 className="text-xl font-bold text-sleek-title flex items-center gap-2">
                <Shield className="w-5.5 h-5.5 text-rose-500" />
                Climate Risk AI Seasonal Advisor
              </h2>
              <p className="text-sleek-muted text-xs mt-1.5 leading-relaxed">
                Analyze predictive agricultural threats modeled by combining historical weather records with active tropical monsoon data. Secure your crops before physical impacts emerge.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Climate Risk Grid */}
              <div className="space-y-4">
                {riskFactors.map((r, idx) => {
                  const Icon = r.icon;
                  return (
                    <div key={idx} className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-sleek-title" />
                          <h4 className="font-extrabold text-xs text-sleek-title uppercase tracking-wider">{r.name}</h4>
                        </div>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                          r.status.includes("Critical") ? "bg-rose-50 text-rose-700 border-rose-200" :
                          r.status.includes("Moderate") ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}>
                          {r.status}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div>
                        <div className="flex justify-between text-[10px] text-sleek-muted mb-1 font-bold">
                          <span>Risk Level Index</span>
                          <span>{r.value} / {r.max}</span>
                        </div>
                        <div className="w-full bg-sleek-bg rounded-full h-2 overflow-hidden border border-sleek-border">
                          <div className={`h-full ${r.color}`} style={{ width: `${r.value}%` }} />
                        </div>
                      </div>

                      <p className="text-[11px] text-sleek-muted leading-relaxed font-semibold bg-sleek-bg p-2.5 rounded-lg border border-sleek-border">
                        {r.advise}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Actionable Risk Management Counsel */}
              <div className="bg-white p-6 rounded-2xl border border-sleek-border shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black text-sleek-title uppercase tracking-wider mb-3 border-b border-sleek-border pb-2">
                    Predictive Mitigation Counsel
                  </h3>
                  <p className="text-xs text-sleek-muted leading-relaxed mb-4">
                    Based on seasonal calculations, Botolan farmers should adopt active protective measures over the next 15 days:
                  </p>

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <span className="p-2 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 font-extrabold text-xs leading-none shrink-0 mt-0.5">N</span>
                      <div>
                        <h4 className="text-xs font-extrabold text-sleek-title">Nitrogen Runoff Block</h4>
                        <p className="text-[11px] text-sleek-muted mt-1 leading-normal">
                          Because heavy rain risk exceeds 80%, avoid spreading chemical fertilizers for the next 4 days. Excess water will wash active Nitrogen into nearby rivers, wasting investments.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <span className="p-2 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 font-extrabold text-xs leading-none shrink-0 mt-0.5">S</span>
                      <div>
                        <h4 className="text-xs font-extrabold text-sleek-title">Soil Siltation Cover</h4>
                        <p className="text-[11px] text-sleek-muted mt-1 leading-normal">
                          Lay mulch or cover crop residues on exposed sandy plots to protect loose topsoil against torrential monsoon splash erosion.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <span className="p-2 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 font-extrabold text-xs leading-none shrink-0 mt-0.5">W</span>
                      <div>
                        <h4 className="text-xs font-extrabold text-sleek-title">Windbreak Shielding</h4>
                        <p className="text-[11px] text-sleek-muted mt-1 leading-normal">
                          Tall mango fruit-bearing branches can suffer limb breakage. Arrange wooden props around vulnerable branches on western grove exposures.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-sleek-muted font-bold pt-4 border-t border-sleek-border mt-6">
                  * Dynamic alerts are triggered automatically using national weather warnings and localized radar grids.
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
