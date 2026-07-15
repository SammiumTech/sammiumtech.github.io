import React, { useState } from "react";
import { Bug, Pipette } from "lucide-react";
import PestDetection from "./PestDetection";
import SoilHealth from "./SoilHealth";

export default function DiagnosticsLab() {
  const [activeSubTab, setActiveSubTab] = useState<"pathology" | "soil">("pathology");

  return (
    <div className="space-y-6">
      {/* Sub-navigation inside Diagnostics Lab */}
      <div className="flex bg-white p-1 rounded-xl border border-sleek-border w-fit shadow-xs">
        <button
          onClick={() => setActiveSubTab("pathology")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "pathology"
              ? "bg-emerald-500 text-white shadow-xs"
              : "text-sleek-text hover:bg-sleek-bg"
          }`}
        >
          <Bug className="w-4 h-4" />
          AI Pathology Lab (Crop Doctor)
        </button>
        <button
          onClick={() => setActiveSubTab("soil")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "soil"
              ? "bg-emerald-500 text-white shadow-xs"
              : "text-sleek-text hover:bg-sleek-bg"
          }`}
        >
          <Pipette className="w-4 h-4" />
          Soil Nutrient Ledger & Assays
        </button>
      </div>

      <div>
        {activeSubTab === "pathology" && <PestDetection />}
        {activeSubTab === "soil" && <SoilHealth />}
      </div>
    </div>
  );
}
