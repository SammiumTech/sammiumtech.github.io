import React, { useState, useEffect, useMemo } from "react";
import { 
  Sprout, Map, Camera, Wind, Play, Compass, RefreshCw, 
  AlertTriangle, ShieldAlert, CheckCircle, Navigation, Info, Eye
} from "lucide-react";
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from "recharts";

interface FieldNode {
  id: string;
  name: string;
  crop: string;
  area: number;
  stage: string;
  health: number;
  water: number;
  risk: "LOW" | "MODERATE" | "HIGH";
  harvestDate: string;
  expectedYield: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-stone-900 border border-stone-800 text-white p-3 rounded-xl shadow-lg text-xs space-y-1.5 z-50">
        <p className="font-extrabold text-stone-300 border-b border-white/10 pb-1 mb-1">{label}</p>
        {payload.map((pld: any) => (
          <div key={pld.name} className="flex items-center gap-4 justify-between">
            <span className="flex items-center gap-1.5 font-semibold" style={{ color: pld.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pld.color }} />
              {pld.name}:
            </span>
            <span className="font-mono font-black">{pld.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DigitalTwin() {
  const [fields, setFields] = useState<FieldNode[]>([
    { id: "field-1", name: "Lopez Farm (Plat A)", crop: "Rice (Palay)", area: 2.8, stage: "Stage 3 (Flowering)", health: 96, water: 72, risk: "LOW", harvestDate: "2026-09-28", expectedYield: 14.8 },
    { id: "field-2", name: "Santos Mango Grove", crop: "Carabao Mango", area: 1.5, stage: "Fruiting Stage", health: 88, water: 55, risk: "LOW", harvestDate: "2026-08-15", expectedYield: 8.2 },
    { id: "field-3", name: "Del Rosario Cornfield", crop: "Yellow Corn", area: 2.0, stage: "Stage 2 (Vegetative)", health: 91, water: 64, risk: "MODERATE", harvestDate: "2026-10-10", expectedYield: 11.0 },
    { id: "field-4", name: "Poblacion Kamote Patch", crop: "Sweet Potato", area: 0.8, stage: "Late Development", health: 94, water: 70, risk: "LOW", harvestDate: "2026-07-30", expectedYield: 4.5 }
  ]);

  const [selectedFieldId, setSelectedFieldId] = useState<string>("field-1");
  const selectedField = fields.find(f => f.id === selectedFieldId) || fields[0];

  const forecastData = useMemo(() => {
    const data = [];
    for (let day = 0; day <= 30; day += 3) {
      const entry: any = { 
        dayNumber: day,
        day: `Day ${day}` 
      };
      fields.forEach(f => {
        let baseProgress = 0;
        let dailyRate = 1.0;
        
        if (f.crop.toLowerCase().includes("rice")) {
          baseProgress = 60;
          dailyRate = 1.1;
        } else if (f.crop.toLowerCase().includes("mango")) {
          baseProgress = 75;
          dailyRate = 0.5;
        } else if (f.crop.toLowerCase().includes("corn")) {
          baseProgress = 35;
          dailyRate = 1.8;
        } else if (f.crop.toLowerCase().includes("potato")) {
          baseProgress = 70;
          dailyRate = 0.9;
        } else {
          baseProgress = 50;
          dailyRate = 1.0;
        }

        const vigorFactor = (f.health * 0.6 + f.water * 0.4) / 100;
        const progress = baseProgress + (dailyRate * day * vigorFactor);
        entry[f.crop] = Math.min(100, Math.round(progress * 10) / 10);
      });
      data.push(entry);
    }
    return data;
  }, [fields]);

  // Satellite Monitoring layer
  const [activeLayer, setActiveLayer] = useState<"none" | "water" | "chlorophyll" | "pest" | "growth">("none");

  // Drone planner
  const [droneMission, setDroneMission] = useState<string>("crop_inspection");
  const [isDroneFlying, setIsDroneFlying] = useState(false);
  const [droneLogs, setDroneLogs] = useState<string[]>([]);
  const [droneBattery, setDroneBattery] = useState(100);

  // AI Farm Camera
  const [cameraAlerts, setCameraAlerts] = useState([
    { id: "alert-1", time: "10 mins ago", type: "Intruder Alert", text: "Stray livestock detected entering southern gate of Field B.", severity: "moderate", thumb: "🐄" },
    { id: "alert-2", time: "2 hours ago", type: "Storm Assessment", text: "Heavy rain detected. Soil moisture saturated. Drainage active.", severity: "low", thumb: "🌧️" }
  ]);
  const [cameraFeedStatus, setCameraFeedStatus] = useState<"idle" | "scanning" | "clear">("clear");

  // Emergency rescue
  const [emergencyActive, setEmergencyActive] = useState(true);
  const [emergencyChecklist, setEmergencyChecklist] = useState([
    { id: "chk-1", text: "Harvest ready-to-reap crops immediately (Stage 4 / 5)", checked: true },
    { id: "chk-2", text: "Secure and tie down greenhouses and protective nursery structures", checked: false },
    { id: "chk-3", text: "Clear sand and silt blockages in peripheral drainage ditches", checked: true },
    { id: "chk-4", text: "Anchor machinery and heavy tractors to concrete bases", checked: false },
    { id: "chk-5", text: "Evacuate livestock (Cows, Pigs) to municipal emergency holding pens", checked: false }
  ]);

  const toggleChecklist = (id: string) => {
    setEmergencyChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const simulateUpdateTwin = () => {
    // Fluctuates metrics using AI "Digital Twin" simulation
    setFields(prev => prev.map(f => {
      const healthDelta = Math.floor((Math.random() - 0.4) * 3);
      const waterDelta = Math.floor((Math.random() - 0.5) * 5);
      return {
        ...f,
        health: Math.max(70, Math.min(100, f.health + healthDelta)),
        water: Math.max(40, Math.min(100, f.water + waterDelta))
      };
    }));
  };

  const startDroneMission = () => {
    setIsDroneFlying(true);
    setDroneBattery(100);
    setDroneLogs(["Drone bootup sequence initiated.", "Awaiting satellite coordinates for Botolan farm mesh...", "Drone launched from Base Station A.", "Altitude locked at 45m. Wind speed: 12 km/h - stable."]);
  };

  useEffect(() => {
    if (!isDroneFlying) return;
    const interval = setInterval(() => {
      setDroneBattery(b => {
        if (b <= 10) {
          setIsDroneFlying(false);
          setDroneLogs(l => [...l, "Battery critical. Drone returning to base station.", "Mission successfully uploaded to Sammium AgriMind cloud."]);
          return 0;
        }
        return b - 15;
      });

      const missionLogs: Record<string, string[]> = {
        crop_inspection: [
          "Scanning plant canopy density...",
          "Spectroscopic index: Chlorophyll A absorption nominal.",
          "Anomaly alert: Yellow leaf stress spots detected in grid row B-14."
        ],
        fertilizer_mapping: [
          "Generating fertilizer nitrogen absorption matrix...",
          "Plotting N-P-K nutrient depletion heat zones.",
          "Completed fertilizer spread coordinates vector map."
        ],
        flood_assessment: [
          "Measuring topographic elevation and water pooling levels...",
          "Ditching flow indices normal.",
          "Low-lying mud risk confirmed near eastern canal."
        ]
      };

      const selectedLogs = missionLogs[droneMission] || ["Scanning field grid coordinate matrix..."];
      const randomLog = selectedLogs[Math.floor(Math.random() * selectedLogs.length)];
      setDroneLogs(l => [...l, randomLog]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isDroneFlying, droneMission]);

  const triggerCameraAnalysis = () => {
    setCameraFeedStatus("scanning");
    setTimeout(() => {
      const events = [
        { id: String(Date.now()), time: "Just now", type: "Animals Detected", text: "Two goats wandering near sweet potato patch perimeter.", severity: "moderate", thumb: "🐐" },
        { id: String(Date.now() + 1), time: "Just now", type: "Security Log", text: "No human or thermal intruders identified. Area secure.", severity: "low", thumb: "👤" },
        { id: String(Date.now() + 2), time: "Just now", type: "Foliage Alert", text: "Spotted smoke trace in distance. Likely local clearing. Monitoring air quality.", severity: "high", thumb: "🔥" }
      ];
      const selected = events[Math.floor(Math.random() * events.length)];
      setCameraAlerts(prev => [selected, ...prev]);
      setCameraFeedStatus("clear");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Upper Grid: Twin Selection & Interactive Core */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Field Selection / Twin List */}
        <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-sleek-border pb-2.5">
            <h3 className="font-extrabold text-sleek-title text-sm uppercase tracking-wider flex items-center gap-1.5">
              <Sprout className="w-4.5 h-4.5 text-emerald-500" />
              Active Twin list
            </h3>
            <button 
              onClick={simulateUpdateTwin}
              className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200/60 flex items-center gap-1 text-[10px] font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Simulate Sync
            </button>
          </div>

          <p className="text-[11px] text-sleek-muted leading-relaxed">
            The AI continuously updates each field's twin using weather grounding, farm sensors, and satellite indicators.
          </p>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {fields.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFieldId(f.id)}
                className={`w-full p-4 text-left rounded-xl border transition-all flex items-start justify-between cursor-pointer ${
                  selectedFieldId === f.id 
                    ? "bg-mint-50/70 border-emerald-500 shadow-xs" 
                    : "bg-white border-sleek-border hover:bg-sleek-bg"
                }`}
              >
                <div>
                  <h4 className="font-bold text-sleek-title text-xs">{f.name}</h4>
                  <span className="text-[10px] text-sleek-muted font-bold block mt-0.5">{f.crop} • {f.area} ha</span>
                  <div className="flex items-center gap-3 mt-2.5">
                    <div>
                      <span className="text-[8px] text-sleek-muted uppercase font-bold block">Health</span>
                      <span className="text-xs font-black text-sleek-title">{f.health}%</span>
                    </div>
                    <span className="h-4 w-px bg-sleek-border"></span>
                    <div>
                      <span className="text-[8px] text-sleek-muted uppercase font-bold block">Water</span>
                      <span className="text-xs font-black text-sleek-title">{f.water}%</span>
                    </div>
                  </div>
                </div>

                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                  f.risk === "LOW" ? "bg-emerald-50 text-emerald-800 border-emerald-100" : "bg-amber-50 text-amber-800 border-amber-100"
                }`}>
                  {f.risk} Risk
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Digital Twin Focus State */}
        <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-sleek-border pb-3 mb-4">
              <div>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block">AI Farm Digital Twin</span>
                <h3 className="text-base font-extrabold text-sleek-title mt-0.5">{selectedField.name}</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-sleek-muted">Synchronized</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-sleek-bg p-4 rounded-xl border border-sleek-border text-center">
                <span className="text-[9px] font-black text-sleek-muted uppercase block">Growth Cycle</span>
                <span className="text-sm font-black text-emerald-700 block mt-1">{selectedField.stage}</span>
                <span className="text-[9px] text-sleek-muted font-medium block mt-1">Est. harvest: {selectedField.harvestDate}</span>
              </div>

              <div className="bg-sleek-bg p-4 rounded-xl border border-sleek-border text-center">
                <span className="text-[9px] font-black text-sleek-muted uppercase block">Yield Prediction</span>
                <span className="text-xl font-black text-sleek-title block mt-1">+{selectedField.expectedYield} Tons</span>
                <span className="text-[9px] text-sleek-muted font-medium block mt-1">On {selectedField.area} Hectares</span>
              </div>

              <div className="bg-sleek-bg p-4 rounded-xl border border-sleek-border text-center col-span-2 md:col-span-1">
                <span className="text-[9px] font-black text-sleek-muted uppercase block">Climate Health Rate</span>
                <span className="text-xl font-black text-sleek-title block mt-1">{selectedField.health}%</span>
                <span className="text-[9px] text-emerald-600 font-bold block mt-1">Optimal vigor</span>
              </div>
            </div>

            {/* Simulated Satellite Frame Canvas */}
            <div className="mt-5 bg-stone-900 rounded-xl p-4 text-white relative overflow-hidden h-48 border border-stone-800 flex flex-col justify-between">
              
              {/* Mesh Field Grid */}
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-4 opacity-25">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`border border-white/40 transition-all duration-500 ${
                      activeLayer === "water" && i % 3 === 0 ? "bg-blue-500/80" :
                      activeLayer === "chlorophyll" && i % 4 === 0 ? "bg-emerald-500/80" :
                      activeLayer === "pest" && i % 7 === 0 ? "bg-red-500/80" :
                      activeLayer === "growth" && i % 5 === 0 ? "bg-amber-500/80" : ""
                    }`}
                  />
                ))}
              </div>

              <div className="relative flex justify-between items-start">
                <div className="bg-black/60 backdrop-blur-xs p-2 rounded-lg border border-white/15">
                  <span className="text-[9px] font-bold text-white uppercase block flex items-center gap-1">
                    <Compass className="w-3 h-3 text-emerald-400 animate-spin" />
                    Sammium-Sat IR-7
                  </span>
                  <span className="text-[8px] text-white/75 block mt-0.5">Orbit Alt: 412 km • BOTOLAN</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {["water", "chlorophyll", "pest", "growth"].map((layer) => (
                    <button
                      key={layer}
                      onClick={() => setActiveLayer(activeLayer === layer ? "none" : layer as any)}
                      className={`px-2 py-1 rounded-md text-[9px] font-bold border capitalize cursor-pointer transition-all ${
                        activeLayer === layer 
                          ? "bg-emerald-500 text-white border-emerald-500" 
                          : "bg-black/50 text-white/80 border-white/10 hover:bg-black/70"
                      }`}
                    >
                      {layer}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative flex justify-between items-end">
                <span className="text-[9px] bg-black/60 backdrop-blur-xs px-2 py-1 rounded-md text-white border border-white/15">
                  {activeLayer === "none" ? "Visible Spectrum Layer" : `Active Overlay: ${activeLayer.toUpperCase()} index`}
                </span>
                <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-1 rounded-md border border-emerald-800">
                  96% Match
                </span>
              </div>
            </div>

          </div>

          <div className="mt-4 flex items-center gap-1 text-[11px] text-sleek-muted font-medium bg-sleek-bg p-2.5 rounded-lg border border-sleek-border">
            <Info className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Select different overlays above (e.g. <strong>pest</strong> to view threat hot-zones or <strong>water</strong> for stress indexing).</span>
          </div>
        </div>

      </div>

      {/* 30-Day Growth Forecast Section */}
      <div className="bg-white p-6 rounded-2xl border border-sleek-border shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-sleek-border pb-4 gap-2">
          <div>
            <h3 className="font-extrabold text-sleek-title text-sm uppercase tracking-wider flex items-center gap-1.5">
              <Sprout className="w-4.5 h-4.5 text-emerald-500" />
              30-Day Growth Projection Model
            </h3>
            <p className="text-xs text-sleek-muted mt-1 leading-normal">
              Digital twin trajectory simulations computed using leaf chlorophyll index ({fields.map(f => `${f.crop.split(" ")[0]}: ${f.health}%`).join(", ")}) and moisture parameters.
            </p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl flex items-center gap-2 self-start md:self-auto shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] text-emerald-800 font-bold">Live Sensor-Backed Physics</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Chart Frame */}
          <div className="xl:col-span-3 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 600 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  domain={[0, 100]}
                  tickFormatter={(val) => `${val}%`}
                  tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 600 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#374151' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Rice (Palay)" 
                  stroke="#10b981" 
                  strokeWidth={2.5}
                  dot={{ r: 3, strokeWidth: 1.5 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Carabao Mango" 
                  stroke="#f59e0b" 
                  strokeWidth={2.5}
                  dot={{ r: 3, strokeWidth: 1.5 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Yellow Corn" 
                  stroke="#eab308" 
                  strokeWidth={2.5}
                  dot={{ r: 3, strokeWidth: 1.5 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Sweet Potato" 
                  stroke="#a855f7" 
                  strokeWidth={2.5}
                  dot={{ r: 3, strokeWidth: 1.5 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Context Panel */}
          <div className="bg-sleek-bg p-4.5 rounded-xl border border-sleek-border flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-sleek-muted uppercase tracking-wider">Dynamic Growth Factors</h4>
              
              <div className="space-y-3">
                {fields.map((f) => {
                  const vigor = (f.health * 0.6 + f.water * 0.4) / 100;
                  let dailyRate = 1.0;
                  if (f.crop.toLowerCase().includes("rice")) dailyRate = 1.1;
                  else if (f.crop.toLowerCase().includes("mango")) dailyRate = 0.5;
                  else if (f.crop.toLowerCase().includes("corn")) dailyRate = 1.8;
                  else if (f.crop.toLowerCase().includes("potato")) dailyRate = 0.9;

                  const actualDailyGrowth = (dailyRate * vigor).toFixed(2);
                  
                  return (
                    <div key={f.id} className="text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sleek-title text-[11px] truncate max-w-[130px]">{f.crop}</span>
                        <span className="text-[10px] font-mono font-black text-emerald-600">+{actualDailyGrowth}% / day</span>
                      </div>
                      <div className="w-full bg-stone-200/60 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            f.crop.toLowerCase().includes("rice") ? "bg-emerald-500" :
                            f.crop.toLowerCase().includes("mango") ? "bg-amber-500" :
                            f.crop.toLowerCase().includes("corn") ? "bg-yellow-500" : "bg-purple-500"
                          }`}
                          style={{ width: `${Math.min(100, Number(actualDailyGrowth) * 50)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2.5 border-t border-sleek-border text-[10px] text-sleek-muted leading-relaxed">
              <span className="font-black text-sleek-title block uppercase mb-1">💡 Sandbox Integration</span>
              Try clicking the <strong className="text-emerald-600">Simulate Sync</strong> button on the twin list to alter health or water levels and watch the predictive growth velocities adjust instantly!
            </div>
          </div>
        </div>
      </div>

      {/* Drone Mission Planner & AI Farm Camera */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Drone Mission Planner */}
        <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-sleek-border pb-3">
            <h3 className="font-extrabold text-sleek-title text-sm uppercase tracking-wider flex items-center gap-1.5">
              <Navigation className="w-4.5 h-4.5 text-emerald-500" />
              Drone Mission Planner
            </h3>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase">
              Battery: {droneBattery}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-sleek-muted uppercase mb-1">Select Mission Goal</label>
              <select
                value={droneMission}
                onChange={(e) => setDroneMission(e.target.value)}
                className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-emerald-500"
              >
                <option value="crop_inspection">Crop inspection</option>
                <option value="fertilizer_mapping">Fertilizer mapping</option>
                <option value="flood_assessment">Flood assessment</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={startDroneMission}
                disabled={isDroneFlying}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-stone-100 disabled:text-stone-400 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Launch Mission
              </button>
            </div>
          </div>

          <div className="bg-stone-950 rounded-xl p-4 font-mono text-[10px] text-emerald-400 h-40 overflow-y-auto space-y-1 border border-stone-900">
            {droneLogs.length === 0 ? (
              <span className="text-stone-500 block text-center py-10">* Awaiting launch parameters...</span>
            ) : (
              droneLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-stone-600">[{idx + 1}]</span>
                  <span>{log}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Farm Camera */}
        <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-sleek-border pb-3">
            <h3 className="font-extrabold text-sleek-title text-sm uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-4.5 h-4.5 text-emerald-500" />
              AI Farm Camera (CCTV Link)
            </h3>
            <button
              onClick={triggerCameraAnalysis}
              className="px-2 py-1 text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-md hover:bg-emerald-100"
            >
              Analyze Live Feed
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Visual Feed Screen */}
            <div className="bg-stone-900 rounded-xl h-36 flex flex-col justify-between p-3 relative overflow-hidden border border-stone-800 md:col-span-1">
              <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60"></div>
              <div className="relative flex justify-between items-center text-white">
                <span className="text-[8px] bg-red-600 px-1 py-0.2 rounded-sm font-bold uppercase animate-pulse">Live</span>
                <span className="text-[8px] text-white/80 font-mono">CAM-01</span>
              </div>

              {cameraFeedStatus === "scanning" ? (
                <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-xs flex items-center justify-center text-emerald-400 text-center font-bold text-xs">
                  <span className="animate-pulse">Analyzing Canopy...</span>
                </div>
              ) : null}

              <div className="text-[9px] text-stone-300 font-bold tracking-tight text-center relative mt-4 block">
                [Lopez Field S-Gate View]
              </div>

              <div className="relative flex justify-between text-[8px] text-stone-400 font-mono">
                <span>60 FPS</span>
                <span>ZAMBALES</span>
              </div>
            </div>

            {/* AI Alerts log */}
            <div className="md:col-span-2 space-y-2 max-h-[144px] overflow-y-auto">
              <h4 className="text-[10px] font-black text-sleek-muted uppercase tracking-wider">AI Detection Stream</h4>
              {cameraAlerts.map((alert) => (
                <div key={alert.id} className="p-2.5 bg-sleek-bg border border-sleek-border rounded-lg flex items-start gap-2.5">
                  <span className="text-xl p-1 bg-white border border-sleek-border rounded-lg shrink-0">{alert.thumb}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-sleek-title">{alert.type}</span>
                      <span className="text-[8px] text-sleek-muted font-bold">{alert.time}</span>
                    </div>
                    <p className="text-[10px] text-sleek-muted mt-0.5 leading-normal">{alert.text}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* Emergency Crop Rescue System */}
      {emergencyActive && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200 pb-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
                <ShieldAlert className="w-5.5 h-5.5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">Crisis Protection Module</span>
                <h3 className="text-base font-black text-amber-950 mt-0.5">Emergency Crop Rescue Protocol</h3>
                <p className="text-xs text-amber-900 mt-1">Typhoon approach flagged within Central Luzon. Complete the agricultural safety procedures immediately.</p>
              </div>
            </div>
            <div>
              <button 
                onClick={() => setEmergencyActive(false)}
                className="px-4 py-2 bg-amber-950 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors"
              >
                Dismiss Alerts
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyChecklist.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`p-3.5 rounded-xl border text-left cursor-pointer flex items-center justify-between transition-all ${
                  item.checked 
                    ? "bg-emerald-50 border-emerald-200/80 text-emerald-900" 
                    : "bg-white border-amber-200 hover:bg-amber-50 text-amber-950"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    item.checked ? "bg-emerald-500 border-emerald-500 text-white" : "border-amber-300"
                  }`}>
                    {item.checked && <CheckCircle className="w-3 h-3 text-white fill-current" />}
                  </span>
                  <span className="text-xs font-bold leading-normal">{item.text}</span>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border shrink-0 ml-2">
                  {item.checked ? "Secured" : "Pending"}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
