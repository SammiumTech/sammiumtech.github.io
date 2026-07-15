import React, { useState, useMemo } from "react";
import { 
  Droplets, Pipette, Layers, Map, Info, Sparkles, 
  TrendingUp, CheckCircle, AlertTriangle, Activity, 
  Compass, ArrowRight, ShieldCheck, Thermometer
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SoilHealthMapProps {
  soilMoisture: number;
  soilTemp: number;
}

type ParameterType = "moisture" | "nitrogen" | "phosphorus" | "potassium" | "ph";

interface PlotData {
  id: string;
  name: string;
  crop: string;
  area: string;
  moisture: number;
  nitrogen: number; // mg/kg
  phosphorus: number; // mg/kg
  potassium: number; // mg/kg
  ph: number;
  path: string; // SVG path
  centerText: { x: number; y: number };
}

export default function SoilHealthMap({ soilMoisture, soilTemp }: SoilHealthMapProps) {
  const [activeParam, setActiveParam] = useState<ParameterType>("moisture");
  const [selectedPlotId, setSelectedPlotId] = useState<string>("plot-1");
  const [hoveredPlotId, setHoveredPlotId] = useState<string | null>(null);

  // Define farm plots with customized SVG paths representing the layout of the Botolan farm sectors
  const plots: PlotData[] = useMemo(() => {
    return [
      {
        id: "plot-1",
        name: "North Field",
        crop: "Palay Rice (NSIC Rc222)",
        area: "1.5 Hectares",
        moisture: soilMoisture,
        nitrogen: 48,
        phosphorus: 22,
        potassium: 38,
        ph: 6.2,
        // Top-left polygon
        path: "M 20 20 L 180 20 L 160 110 L 20 110 Z",
        centerText: { x: 90, y: 65 }
      },
      {
        id: "plot-2",
        name: "South Field",
        crop: "Palay Rice (NSIC Rc222)",
        area: "1.2 Hectares",
        moisture: Math.max(10, Math.min(100, Math.round(soilMoisture * 1.15))),
        nitrogen: 35,
        phosphorus: 14,
        potassium: 28,
        ph: 5.7,
        // Top-right polygon
        path: "M 195 20 L 380 20 L 380 110 L 175 110 Z",
        centerText: { x: 280, y: 65 }
      },
      {
        id: "plot-3",
        name: "Santos Mango Grove",
        crop: "Carabao Mango",
        area: "2.3 Hectares",
        moisture: Math.max(10, Math.min(100, Math.round(soilMoisture * 0.75))),
        nitrogen: 55,
        phosphorus: 25,
        potassium: 48,
        ph: 6.6,
        // Mid-left polygon
        path: "M 20 120 L 155 120 L 140 210 L 20 210 Z",
        centerText: { x: 80, y: 165 }
      },
      {
        id: "plot-4",
        name: "Del Rosario Cornfield",
        crop: "Yellow Corn (Pioneer)",
        area: "1.8 Hectares",
        moisture: Math.max(10, Math.min(100, Math.round(soilMoisture * 0.85))),
        nitrogen: 18,
        phosphorus: 9,
        potassium: 22,
        ph: 5.1,
        // Mid-right polygon
        path: "M 170 120 L 380 120 L 350 210 L 150 210 Z",
        centerText: { x: 265, y: 165 }
      },
      {
        id: "plot-5",
        name: "Poblacion Kamote Patch",
        crop: "Sweet Potato (Kamote)",
        area: "0.8 Hectares",
        moisture: Math.max(10, Math.min(100, Math.round(soilMoisture * 1.05))),
        nitrogen: 42,
        phosphorus: 19,
        potassium: 35,
        ph: 6.4,
        // Bottom-left polygon
        path: "M 20 220 L 135 220 L 115 310 L 20 310 Z",
        centerText: { x: 70, y: 265 }
      },
      {
        id: "plot-6",
        name: "Upland Banana Nursery",
        crop: "Saba Banana (Cavendish)",
        area: "1.1 Hectares",
        moisture: Math.max(10, Math.min(100, Math.round(soilMoisture * 1.25))),
        nitrogen: 52,
        phosphorus: 24,
        potassium: 42,
        ph: 7.1,
        // Bottom-right polygon
        path: "M 150 220 L 380 220 L 380 310 L 125 310 Z",
        centerText: { x: 245, y: 265 }
      }
    ];
  }, [soilMoisture]);

  const activePlot = useMemo(() => {
    return plots.find(p => p.id === selectedPlotId) || plots[0];
  }, [plots, selectedPlotId]);

  const hoveredPlot = useMemo(() => {
    return hoveredPlotId ? plots.find(p => p.id === hoveredPlotId) : null;
  }, [plots, hoveredPlotId]);

  // Determine the color coding based on thresholds for each nutrient or parameter
  const getParamInfo = (plot: PlotData, param: ParameterType) => {
    const val = plot[param];
    switch (param) {
      case "moisture":
        if (val < 25) {
          return {
            value: `${val}%`,
            status: "Critical Dry",
            colorClass: "bg-rose-500/10 border-rose-500 text-rose-500",
            mapFill: "rgba(244, 63, 94, 0.75)", // rose-500
            mapStroke: "#f43f5e",
            badge: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200"
          };
        } else if (val < 40) {
          return {
            value: `${val}%`,
            status: "Deficient / Low",
            colorClass: "bg-amber-500/10 border-amber-500 text-amber-500",
            mapFill: "rgba(245, 158, 11, 0.7)", // amber-500
            mapStroke: "#f59e0b",
            badge: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200"
          };
        } else if (val > 80) {
          return {
            value: `${val}%`,
            status: "Waterlogged",
            colorClass: "bg-blue-600/10 border-blue-500 text-blue-500",
            mapFill: "rgba(37, 99, 235, 0.75)", // blue-600
            mapStroke: "#2563eb",
            badge: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200"
          };
        } else {
          return {
            value: `${val}%`,
            status: "Optimal",
            colorClass: "bg-emerald-500/10 border-emerald-500 text-emerald-500",
            mapFill: "rgba(16, 185, 129, 0.75)", // emerald-500
            mapStroke: "#10b981",
            badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200"
          };
        }
      case "nitrogen":
        if (val < 25) {
          return {
            value: `${val} mg/kg`,
            status: "Highly Deficient",
            colorClass: "bg-rose-500/10 border-rose-500 text-rose-500",
            mapFill: "rgba(244, 63, 94, 0.75)",
            mapStroke: "#f43f5e",
            badge: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200"
          };
        } else if (val < 40) {
          return {
            value: `${val} mg/kg`,
            status: "Moderate Deficient",
            colorClass: "bg-amber-500/10 border-amber-500 text-amber-500",
            mapFill: "rgba(245, 158, 11, 0.7)",
            mapStroke: "#f59e0b",
            badge: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200"
          };
        } else {
          return {
            value: `${val} mg/kg`,
            status: "Optimal",
            colorClass: "bg-emerald-500/10 border-emerald-500 text-emerald-500",
            mapFill: "rgba(16, 185, 129, 0.75)",
            mapStroke: "#10b981",
            badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200"
          };
        }
      case "phosphorus":
        if (val < 10) {
          return {
            value: `${val} mg/kg`,
            status: "Deficient",
            colorClass: "bg-rose-500/10 border-rose-500 text-rose-500",
            mapFill: "rgba(244, 63, 94, 0.75)",
            mapStroke: "#f43f5e",
            badge: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200"
          };
        } else if (val < 15) {
          return {
            value: `${val} mg/kg`,
            status: "Slightly Low",
            colorClass: "bg-amber-500/10 border-amber-500 text-amber-500",
            mapFill: "rgba(245, 158, 11, 0.7)",
            mapStroke: "#f59e0b",
            badge: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200"
          };
        } else {
          return {
            value: `${val} mg/kg`,
            status: "Optimal",
            colorClass: "bg-emerald-500/10 border-emerald-500 text-emerald-500",
            mapFill: "rgba(16, 185, 129, 0.75)",
            mapStroke: "#10b981",
            badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200"
          };
        }
      case "potassium":
        if (val < 25) {
          return {
            value: `${val} mg/kg`,
            status: "Deficient",
            colorClass: "bg-rose-500/10 border-rose-500 text-rose-500",
            mapFill: "rgba(244, 63, 94, 0.75)",
            mapStroke: "#f43f5e",
            badge: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200"
          };
        } else if (val < 35) {
          return {
            value: `${val} mg/kg`,
            status: "Slightly Low",
            colorClass: "bg-amber-500/10 border-amber-500 text-amber-500",
            mapFill: "rgba(245, 158, 11, 0.7)",
            mapStroke: "#f59e0b",
            badge: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200"
          };
        } else {
          return {
            value: `${val} mg/kg`,
            status: "Optimal",
            colorClass: "bg-emerald-500/10 border-emerald-500 text-emerald-500",
            mapFill: "rgba(16, 185, 129, 0.75)",
            mapStroke: "#10b981",
            badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200"
          };
        }
      case "ph":
        if (val < 5.5) {
          return {
            value: `${val} pH`,
            status: "Strongly Acidic",
            colorClass: "bg-rose-500/10 border-rose-500 text-rose-500",
            mapFill: "rgba(244, 63, 94, 0.75)",
            mapStroke: "#f43f5e",
            badge: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200"
          };
        } else if (val < 6.0) {
          return {
            value: `${val} pH`,
            status: "Slightly Acidic",
            colorClass: "bg-amber-500/10 border-amber-500 text-amber-500",
            mapFill: "rgba(245, 158, 11, 0.7)",
            mapStroke: "#f59e0b",
            badge: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200"
          };
        } else if (val > 7.0) {
          return {
            value: `${val} pH`,
            status: "Alkaline",
            colorClass: "bg-blue-500/10 border-blue-500 text-blue-500",
            mapFill: "rgba(59, 130, 246, 0.75)",
            mapStroke: "#3b82f6",
            badge: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200"
          };
        } else {
          return {
            value: `${val} pH`,
            status: "Optimal Neutral",
            colorClass: "bg-emerald-500/10 border-emerald-500 text-emerald-500",
            mapFill: "rgba(16, 185, 129, 0.75)",
            mapStroke: "#10b981",
            badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200"
          };
        }
    }
  };

  // Get dynamic AI prescription and recommendations for the selected plot and active parameter
  const aiPrescription = useMemo(() => {
    const info = getParamInfo(activePlot, activeParam);
    const plotName = activePlot.name;
    const crop = activePlot.crop;

    if (activeParam === "moisture") {
      if (activePlot.moisture < 25) {
        return {
          title: "Critical Water Depletion Advisory",
          severity: "critical",
          action: `Initiate immediate supplementary flood/irrigation in ${plotName} (${crop}). Dry sandy-loam soils are cracking, exposing root nodes to oxygen stress.`,
          solution: "Deploy a 30-minute flood pulse or trigger a high-volume sprinkler sequence."
        };
      } else if (activePlot.moisture < 40) {
        return {
          title: "Slight Moisture Deficit Advisory",
          severity: "warning",
          action: `Deliver standard scheduled irrigation in ${plotName}. Avoid delayed cycles during peak solar heat index (11 AM to 2 PM PHT) to reduce evapotranspiration.`,
          solution: "Trigger a standard 15-minute drip cycle or apply leaf-shade mulching."
        };
      } else if (activePlot.moisture > 80) {
        return {
          title: "Root Waterlogging Hazard",
          severity: "critical",
          action: `Suspend all active irrigation in ${plotName} immediately. Excessive moisture levels are waterlogging ${crop} root nodules, starving root respiration and risking root rot.`,
          solution: "Open secondary drainage furrows or activate the sub-drainage pump grid."
        };
      } else {
        return {
          title: "Optimal Hydration Status",
          severity: "optimal",
          action: `Soil hydration in ${plotName} is perfectly tuned for photosynthesis support. Maintain the standard sensor trigger thresholds.`,
          solution: "No direct mechanical intervention is needed. Continue background tracking."
        };
      }
    } else if (activeParam === "nitrogen") {
      if (activePlot.nitrogen < 25) {
        return {
          title: "Severe Nitrogen (N) Starvation",
          severity: "critical",
          action: `Foliage yellowing risk detected on ${crop} inside ${plotName}. Nitrogen levels are critical. Immediate N replenishment required to avoid stunting.`,
          solution: "Apply organic urea or organic poultry manure inputs during early morning hours."
        };
      } else if (activePlot.nitrogen < 40) {
        return {
          title: "Slight Nitrogen Deficient Index",
          severity: "warning",
          action: `Moderate nitrogen levels inside ${plotName}. Recommend supplementary vegetative nutrition within the next 48 hours to maintain tiller growth.`,
          solution: "Incorporate organic seaweed extract or legume-based cover mulching."
        };
      } else {
        return {
          title: "Optimal Nitrogen Balance",
          severity: "optimal",
          action: `Nitrogen concentration of ${activePlot.nitrogen} mg/kg is perfectly suited for standard vegetative growth of ${crop}.`,
          solution: "Standard complete fertilizer is sufficient. Avoid nitrogen over-dosing."
        };
      }
    } else if (activeParam === "phosphorus") {
      if (activePlot.phosphorus < 10) {
        return {
          title: "Severe Phosphorus (P) Deficiency",
          severity: "critical",
          action: `Phosphorus concentration in ${plotName} is extremely low (${activePlot.phosphorus} mg/kg). High risk of restricted root development and reduced flowering.`,
          solution: "Apply steamed bone meal or localized soft phosphate applications directly to the soil root zone."
        };
      } else if (activePlot.phosphorus < 15) {
        return {
          title: "Sub-Optimal Phosphate Levels",
          severity: "warning",
          action: `Foliar analysis indicates a minor phosphate deficit. Recommend applying balanced complete plant food to stimulate future seedling viability.`,
          solution: "Incorporate organic composted farmyard manure around crop drip borders."
        };
      } else {
        return {
          title: "Optimal Phosphorus Balance",
          severity: "optimal",
          action: `Phosphorus levels are in the optimal zone (${activePlot.phosphorus} mg/kg). Strong root anchorages and robust flower buds are confirmed.`,
          solution: "No direct adjustments needed. Maintain current compost cycling rate."
        };
      }
    } else if (activeParam === "potassium") {
      if (activePlot.potassium < 25) {
        return {
          title: "Potassium (K) Defect / Leaf Scorch Risk",
          severity: "critical",
          action: `Potassium level is deficient inside ${plotName} (${activePlot.potassium} mg/kg). High risk of cellular weakness and leaf-edge burning, leading to pest vulnerability.`,
          solution: "Apply wood ash or premium organic sulfate of potash inputs immediately."
        };
      } else if (activePlot.potassium < 35) {
        return {
          title: "Moderate Potassium Index",
          severity: "warning",
          action: `Slight potassium deficit recorded. Supplement potassium levels to enhance water retention efficiency and reinforce disease defenses.`,
          solution: "Introduce banana leaf compost or composted green crop materials."
        };
      } else {
        return {
          title: "Optimal Potassium Vigor",
          severity: "optimal",
          action: `Potassium content is perfectly healthy (${activePlot.potassium} mg/kg). Osmotic pressure control and stalk rigidness are at maximum capacity.`,
          solution: "Continue background IoT status verification. No adjustments required."
        };
      }
    } else { // pH
      if (activePlot.ph < 5.5) {
        return {
          title: "Severe Rhizosphere Acidity",
          severity: "critical",
          action: `Soil pH in ${plotName} is strongly acidic (${activePlot.ph} pH). Toxic metal leaching is possible, and standard nutrients (N-P-K) are chemically locked/unusable.`,
          solution: "Incorporate agricultural lime (calcium carbonate) or dolomite at 100g/sq.m. to buffer the soil."
        };
      } else if (activePlot.ph < 6.0) {
        return {
          title: "Slight Rhizosphere Acidity",
          severity: "warning",
          action: `Soil is moderately acidic. Trace nutrient uptake might be slightly restricted. Ideal for specialized root tubers, but sub-optimal for Palay.`,
          solution: "Apply hydrated lime or composted wood ash to slowly nudge pH upward."
        };
      } else if (activePlot.ph > 7.0) {
        return {
          title: "Alkaline Soil pH Restriction",
          severity: "warning",
          action: `Soil pH is slightly alkaline (${activePlot.ph} pH). Risk of iron chlorosis (yellowing of leaves) due to micronutrient locking.`,
          solution: "Incorporate elemental sulfur or organic pine needle mulch to nudge pH downward."
        };
      } else {
        return {
          title: "Optimal Rhizosphere pH",
          severity: "optimal",
          action: `Soil pH is in the golden zone (${activePlot.ph} pH). Maximum biological nutrient solubility and root absorption indices are active.`,
          solution: "Continue standard compost mulching to maintain soil chemical buffering."
        };
      }
    }
  }, [activePlot, activeParam]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-sleek-border shadow-md p-6 lg:p-8 space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-white/5">
        <div>
          <span className="text-[10px] font-black tracking-widest text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-1 mb-1">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Interactive Geospatial Twin
          </span>
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Map className="w-5 h-5 text-emerald-500" />
            Interactive Soil Health Map Overlay
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-normal max-w-2xl">
            Click on any farm parcel block to run detailed localized diagnostic overlays, inspect active soil indices, and deploy specific organic counter-measures.
          </p>
        </div>

        {/* Live Linking Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-2xl text-[10px] font-extrabold text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-900/30 dark:text-emerald-300 w-fit shrink-0">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          Live linked to IoT Simulators
        </div>
      </div>

      {/* Selector Button Group */}
      <div className="flex flex-wrap gap-2 pb-2">
        <button
          onClick={() => setActiveParam("moisture")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase transition-all border cursor-pointer ${
            activeParam === "moisture"
              ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/10"
              : "bg-slate-50 hover:bg-slate-100 border-slate-150 text-slate-600 dark:bg-slate-950 dark:border-white/5 dark:text-slate-400"
          }`}
        >
          <Droplets className="w-4 h-4" />
          Moisture
        </button>
        <button
          onClick={() => setActiveParam("nitrogen")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase transition-all border cursor-pointer ${
            activeParam === "nitrogen"
              ? "bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-500/10"
              : "bg-slate-50 hover:bg-slate-100 border-slate-150 text-slate-600 dark:bg-slate-950 dark:border-white/5 dark:text-slate-400"
          }`}
        >
          <Pipette className="w-4 h-4 text-emerald-500" />
          Nitrogen (N)
        </button>
        <button
          onClick={() => setActiveParam("phosphorus")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase transition-all border cursor-pointer ${
            activeParam === "phosphorus"
              ? "bg-amber-600 border-amber-500 text-white shadow-md shadow-amber-500/10"
              : "bg-slate-50 hover:bg-slate-100 border-slate-150 text-slate-600 dark:bg-slate-950 dark:border-white/5 dark:text-slate-400"
          }`}
        >
          <Pipette className="w-4 h-4 text-amber-500" />
          Phosphorus (P)
        </button>
        <button
          onClick={() => setActiveParam("potassium")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase transition-all border cursor-pointer ${
            activeParam === "potassium"
              ? "bg-rose-600 border-rose-500 text-white shadow-md shadow-rose-500/10"
              : "bg-slate-50 hover:bg-slate-100 border-slate-150 text-slate-600 dark:bg-slate-950 dark:border-white/5 dark:text-slate-400"
          }`}
        >
          <Pipette className="w-4 h-4 text-rose-500" />
          Potassium (K)
        </button>
        <button
          onClick={() => setActiveParam("ph")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase transition-all border cursor-pointer ${
            activeParam === "ph"
              ? "bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-500/10"
              : "bg-slate-50 hover:bg-slate-100 border-slate-150 text-slate-600 dark:bg-slate-950 dark:border-white/5 dark:text-slate-400"
          }`}
        >
          <Activity className="w-4 h-4 text-violet-500" />
          Soil pH
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SVG Interactive Farm Map (Col span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative bg-slate-950 rounded-2xl border border-slate-800 p-4 overflow-hidden h-[360px] flex items-center justify-center">
            {/* Compass Rose Backdrop */}
            <div className="absolute top-4 right-4 text-slate-700 font-mono text-[9px] flex flex-col items-center gap-1 select-none pointer-events-none">
              <Compass className="w-6 h-6 text-slate-700 animate-spin" style={{ animationDuration: '40s' }} />
              <span>N 15.22° / E 120.02°</span>
            </div>

            {/* Scale Grid overlay lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:30px_30px] opacity-15 pointer-events-none" />

            {/* Soil Health Parameter Overlay Key Indicator */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[9px] font-mono text-white flex items-center gap-2 select-none pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="uppercase font-bold">Active Layer: {activeParam} map overlay</span>
            </div>

            {/* SVG Interactive Map elements */}
            <svg 
              viewBox="0 0 400 330" 
              className="w-full h-full max-h-[320px] select-none cursor-pointer relative z-10"
            >
              <g id="farm-plots">
                {plots.map((plot) => {
                  const info = getParamInfo(plot, activeParam);
                  const isSelected = plot.id === selectedPlotId;
                  const isHovered = plot.id === hoveredPlotId;

                  return (
                    <g 
                      key={plot.id}
                      onClick={() => setSelectedPlotId(plot.id)}
                      onMouseEnter={() => setHoveredPlotId(plot.id)}
                      onMouseLeave={() => setHoveredPlotId(null)}
                      className="group"
                    >
                      {/* Dynamic Color Filled Field Shape */}
                      <motion.path
                        d={plot.path}
                        fill={info.mapFill}
                        stroke={isSelected ? "#ffffff" : isHovered ? "#93c5fd" : info.mapStroke}
                        strokeWidth={isSelected ? 3.5 : isHovered ? 2.5 : 1.5}
                        strokeLinejoin="round"
                        style={{ filter: isSelected ? "drop-shadow(0 0 8px rgba(255,255,255,0.25))" : "" }}
                        animate={{
                          fill: info.mapFill,
                        }}
                        transition={{ duration: 0.4 }}
                        className="transition-colors cursor-pointer"
                      />

                      {/* Display Text Labels inside the fields */}
                      <text
                        x={plot.centerText.x}
                        y={plot.centerText.y}
                        textAnchor="middle"
                        fill="#ffffff"
                        className="font-sans font-black text-[9px] tracking-tight drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.9)] pointer-events-none select-none"
                      >
                        {plot.name}
                      </text>
                      <text
                        x={plot.centerText.x}
                        y={plot.centerText.y + 11}
                        textAnchor="middle"
                        fill="#93c5fd"
                        className="font-mono text-[8px] font-extrabold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.9)] pointer-events-none select-none"
                      >
                        {info.value}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Simple tooltip box inside the canvas */}
            <AnimatePresence>
              {hoveredPlot && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-4 left-4 bg-slate-900/95 backdrop-blur-md border border-slate-700/60 rounded-xl p-3 shadow-xl pointer-events-none max-w-xs z-30"
                >
                  <span className="text-[8px] font-black text-slate-400 block uppercase tracking-widest">{hoveredPlot.crop}</span>
                  <span className="text-xs font-black text-white mt-0.5 block">{hoveredPlot.name}</span>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">
                      {activeParam === "moisture" ? "Soil Moisture" : activeParam === "ph" ? "pH Level" : "Nutrient Concentr."}:
                    </span>
                    <span className="text-xs font-black text-white font-mono">
                      {getParamInfo(hoveredPlot, activeParam).value}
                    </span>
                  </div>
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[8px] font-black uppercase ${getParamInfo(hoveredPlot, activeParam).badge}`}>
                    {getParamInfo(hoveredPlot, activeParam).status}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Color Indicator Legend Grid */}
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-wrap items-center justify-between gap-3 dark:bg-slate-950/40 dark:border-white/5">
            <span className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> Map Legend:
            </span>
            <div className="flex flex-wrap gap-4 text-[10px] font-extrabold">
              {activeParam === "moisture" ? (
                <>
                  <div className="flex items-center gap-1.5 text-rose-600">
                    <span className="w-3 h-3 rounded-md bg-rose-500/70 border border-rose-500" />
                    <span>Critical Dry (&lt;25%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-600">
                    <span className="w-3 h-3 rounded-md bg-amber-500/70 border border-amber-400" />
                    <span>Dry Deficient (25%-40%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <span className="w-3 h-3 rounded-md bg-emerald-500/70 border border-emerald-500" />
                    <span>Optimal (40%-80%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-blue-600">
                    <span className="w-3 h-3 rounded-md bg-blue-600/70 border border-blue-500" />
                    <span>Waterlogged (&gt;80%)</span>
                  </div>
                </>
              ) : activeParam === "ph" ? (
                <>
                  <div className="flex items-center gap-1.5 text-rose-600">
                    <span className="w-3 h-3 rounded-md bg-rose-500/70 border border-rose-500" />
                    <span>Acidic (&lt;5.5)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-600">
                    <span className="w-3 h-3 rounded-md bg-amber-500/70 border border-amber-400" />
                    <span>Slightly Acidic (5.5-6.0)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <span className="w-3 h-3 rounded-md bg-emerald-500/70 border border-emerald-500" />
                    <span>Optimal (6.0-7.0)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-blue-600">
                    <span className="w-3 h-3 rounded-md bg-blue-500/70 border border-blue-500" />
                    <span>Alkaline (&gt;7.0)</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1.5 text-rose-600">
                    <span className="w-3 h-3 rounded-md bg-rose-500/70 border border-rose-500" />
                    <span>Deficient (&lt;25 mg)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-600">
                    <span className="w-3 h-3 rounded-md bg-amber-500/70 border border-amber-400" />
                    <span>Low Range (25-40 mg)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <span className="w-3 h-3 rounded-md bg-emerald-500/70 border border-emerald-500" />
                    <span>Optimal (&gt;40 mg)</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Selected Plot Insights Card (Col span 1) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex flex-col justify-between min-h-[360px] dark:bg-slate-950/30 dark:border-white/5">
            <div className="space-y-4.5">
              
              {/* Selected plot indicator header */}
              <div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Active Geographic Target</span>
                <h4 className="text-base font-black text-slate-900 dark:text-white mt-0.5">{activePlot.name}</h4>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 mt-1">
                  <span>Crop: {activePlot.crop}</span>
                  <span>•</span>
                  <span>Size: {activePlot.area}</span>
                </div>
              </div>

              {/* Selected Parameter State & Value */}
              <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between dark:bg-slate-900/60 dark:border-white/5">
                <div>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Selected Parameter</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 block capitalize">{activeParam}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-slate-900 dark:text-white font-mono block">
                    {getParamInfo(activePlot, activeParam).value}
                  </span>
                  <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[8px] font-black uppercase ${getParamInfo(activePlot, activeParam).badge}`}>
                    {getParamInfo(activePlot, activeParam).status}
                  </span>
                </div>
              </div>

              {/* Dynamic AI Diagnostic & Counter-measure Suggestion */}
              <div className="space-y-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  AI Localized Prescription
                </span>
                <div className={`p-4 rounded-2xl border ${
                  aiPrescription.severity === "critical"
                    ? "bg-rose-50/50 border-rose-100 text-rose-950 dark:bg-rose-950/10 dark:border-rose-900/30 dark:text-rose-300"
                    : aiPrescription.severity === "warning"
                    ? "bg-amber-50/50 border-amber-100 text-amber-950 dark:bg-amber-950/10 dark:border-amber-900/30 dark:text-amber-300"
                    : "bg-emerald-50/50 border-emerald-100 text-emerald-950 dark:bg-emerald-950/10 dark:border-emerald-900/30 dark:text-emerald-300"
                }`}>
                  <h5 className="text-xs font-extrabold flex items-center gap-1.5">
                    {aiPrescription.severity === "critical" ? (
                      <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                    ) : aiPrescription.severity === "warning" ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    )}
                    {aiPrescription.title}
                  </h5>
                  <p className="text-[11px] mt-2 leading-relaxed text-slate-700 dark:text-slate-300 font-bold">
                    {aiPrescription.action}
                  </p>
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-white/5 text-[10px] text-slate-500">
                    <strong className="text-slate-700 dark:text-slate-300">Recommended Input:</strong> {aiPrescription.solution}
                  </div>
                </div>
              </div>

              {/* Full N-P-K status checklist for active plot */}
              <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-2">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Plot Macro-Nutrient Levels</span>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                  <div className="p-2 bg-white rounded-xl border border-slate-100 dark:bg-slate-900/60 dark:border-white/5">
                    <span className="text-[8px] font-bold text-slate-400 uppercase block">Nitrogen</span>
                    <span className="font-bold text-slate-900 dark:text-white mt-1 block">{activePlot.nitrogen}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-100 dark:bg-slate-900/60 dark:border-white/5">
                    <span className="text-[8px] font-bold text-slate-400 uppercase block">Phos.</span>
                    <span className="font-bold text-slate-900 dark:text-white mt-1 block">{activePlot.phosphorus}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-100 dark:bg-slate-900/60 dark:border-white/5">
                    <span className="text-[8px] font-bold text-slate-400 uppercase block">Potass.</span>
                    <span className="font-bold text-slate-900 dark:text-white mt-1 block">{activePlot.potassium}</span>
                  </div>
                </div>
              </div>

            </div>

            <div className="text-[9px] font-mono text-slate-400 mt-4 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>SCOS Diagnostics Engine</span>
              <span>v1.8.4</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
