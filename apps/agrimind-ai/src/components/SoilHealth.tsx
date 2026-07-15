import React, { useState, useEffect } from "react";
import { 
  Pipette, Plus, Trash2, Calendar, FileText, TrendingUp, AlertTriangle, CheckCircle 
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { SoilHealthRecord } from "../types";
import { motion } from "motion/react";

export default function SoilHealth() {
  const [records, setRecords] = useState<SoilHealthRecord[]>([]);
  const [form, setForm] = useState({
    fieldLocation: "North Field (Palay)",
    ph: 6.2,
    nitrogen: 45,
    phosphorus: 20,
    potassium: 35,
    moisture: 40,
    notes: ""
  });

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("botolan_soil_records");
    if (saved) {
      setRecords(JSON.parse(saved));
    } else {
      // Default initial seeds
      const initial: SoilHealthRecord[] = [
        { id: "1", date: "2026-04-10", fieldLocation: "North Field (Palay)", ph: 6.5, nitrogen: 50, phosphorus: 22, potassium: 40, moisture: 45, notes: "Post-harvest soil analysis. Good condition." },
        { id: "2", date: "2026-05-15", fieldLocation: "North Field (Palay)", ph: 6.3, nitrogen: 40, phosphorus: 18, potassium: 35, moisture: 35, notes: "Before fertilizer application." },
        { id: "3", date: "2026-06-20", fieldLocation: "North Field (Palay)", ph: 6.2, nitrogen: 58, phosphorus: 25, potassium: 42, moisture: 50, notes: "Two weeks after complete fertilizer application." }
      ];
      setRecords(initial);
      localStorage.setItem("botolan_soil_records", JSON.stringify(initial));
    }
  }, []);

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: SoilHealthRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      fieldLocation: form.fieldLocation,
      ph: Number(form.ph),
      nitrogen: Number(form.nitrogen),
      phosphorus: Number(form.phosphorus),
      potassium: Number(form.potassium),
      moisture: Number(form.moisture),
      notes: form.notes
    };

    const updated = [newRecord, ...records];
    setRecords(updated);
    localStorage.setItem("botolan_soil_records", JSON.stringify(updated));

    // Reset notes
    setForm({
      ...form,
      notes: ""
    });
  };

  const handleDeleteRecord = (id: string) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    localStorage.setItem("botolan_soil_records", JSON.stringify(updated));
  };

  // Format data for Recharts (reverse to chronological order for line chart)
  const chartData = [...records].reverse().map(r => ({
    date: r.date,
    pH: r.ph,
    Nitrogen: r.nitrogen,
    Phosphorus: r.phosphorus,
    Potassium: r.potassium,
    Moisture: r.moisture
  }));

  const getPhStatus = (ph: number) => {
    if (ph < 5.5) return { label: "Acidic", color: "text-red-700 bg-red-50 border-red-100" };
    if (ph > 7.5) return { label: "Alkaline", color: "text-blue-700 bg-blue-50 border-blue-100" };
    return { label: "Optimal", color: "text-emerald-700 bg-emerald-50 border-emerald-100" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-white rounded-2xl border border-sleek-border shadow-sm">
        <h2 className="text-xl font-bold text-sleek-title flex items-center gap-2">
          <Pipette className="w-5.5 h-5.5 text-emerald-500" />
          Soil Nutrient & Health Ledger
        </h2>
        <p className="text-sleek-muted text-xs mt-1.5 leading-relaxed">
          Maintain exhaustive chronicles of your soil conditions. Log seasonal nutrient assays (pH, N-P-K concentrations, and moisture percentages) to plot charts and track crop suitability changes dynamically.
        </p>
      </div>

      {/* Immersive Soil Physical Cross-Section & Moisture HUD */}
      <div className="bg-gradient-to-br from-stone-900 via-[#2a2723] to-stone-950 rounded-2xl border border-stone-800 p-6 text-white shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        
        {/* Left column: HUD data */}
        <div className="flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] text-cyan-400 font-black tracking-widest uppercase block">Live Rhizosphere Telemetry</span>
            <h3 className="text-base font-extrabold mt-1">Rhizosphere Cross-Section</h3>
            <p className="text-stone-400 text-xs mt-1 leading-relaxed">
              Real-time modeling of sub-surface soil root expansion, moisture migration pathways, and water saturation indexes.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-stone-900/60 p-3 rounded-xl border border-stone-800">
            <div>
              <span className="text-[9px] text-stone-500 uppercase font-bold block">Current Moisture</span>
              <span className="text-base font-black text-cyan-400">{(records[0]?.moisture ?? form.moisture)}%</span>
            </div>
            <div>
              <span className="text-[9px] text-stone-500 uppercase font-bold block">Soil pH Vigor</span>
              <span className="text-base font-black text-emerald-400">{(records[0]?.ph ?? form.ph)} pH</span>
            </div>
          </div>
        </div>

        {/* Center column: Beautiful Animated SVG Cross-Section */}
        <div className="relative flex items-center justify-center bg-stone-950/80 rounded-xl p-4 border border-stone-800/50 h-56">
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-stone-950 pointer-events-none" />
          
          <svg viewBox="0 0 300 200" className="w-full h-full z-10">
            {/* Ground top line */}
            <line x1="10" y1="35" x2="290" y2="35" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 3" />
            
            {/* Surface Grass blades (animated) */}
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.path
                key={i}
                d={`M ${20 + i * 18} 35 L ${20 + i * 18 + 2} 18`}
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                animate={{
                  d: [
                    `M ${20 + i * 18} 35 L ${20 + i * 18 + 2} 18`,
                    `M ${20 + i * 18} 35 L ${20 + i * 18 - 3} 19`,
                    `M ${20 + i * 18} 35 L ${20 + i * 18 + 2} 18`,
                  ]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4 + (i % 3),
                  ease: "easeInOut"
                }}
              />
            ))}

            {/* Expanding Roots (SVG Path) */}
            <motion.path
              d="M 150 35 C 150 70 140 90 120 130 M 150 35 C 150 80 165 110 185 150 M 145 65 C 125 80 115 105 95 120 M 152 75 C 170 95 180 110 205 135"
              fill="none"
              stroke="#854d0e"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.2, ease: "easeOut" }}
            />

            {/* Core Taproot */}
            <motion.path
              d="M 150 35 L 150 170"
              fill="none"
              stroke="#a16207"
              strokeWidth="4.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
            />

            {/* Glowing Blue Water Droplets/Pulses traveling down the roots */}
            <motion.circle
              r="4"
              fill="#06b6d4"
              className="shadow-[0_0_8px_#06b6d4]"
              animate={{
                cx: [150, 150, 140, 120],
                cy: [35, 70, 90, 130],
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 3.5,
                ease: "linear"
              }}
            />

            <motion.circle
              r="4.5"
              fill="#38bdf8"
              className="shadow-[0_0_10px_#38bdf8]"
              animate={{
                cx: [150, 150, 165, 185],
                cy: [35, 80, 110, 150],
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                delay: 1.2,
                ease: "linear"
              }}
            />

            <motion.circle
              r="3.5"
              fill="#67e8f9"
              animate={{
                cx: [150, 150],
                cy: [35, 170],
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 2.8,
                delay: 0.5,
                ease: "linear"
              }}
            />
          </svg>
        </div>

        {/* Right column: Moisture Meter with liquid filling effect */}
        <div className="flex flex-col justify-between items-center bg-stone-900/40 p-4 rounded-xl border border-stone-800">
          <div className="w-full text-center">
            <span className="text-[9px] text-stone-500 uppercase font-bold tracking-wider block">Fluid Moisture Balance</span>
            <span className="text-xl font-black text-cyan-400 mt-1 block">{(records[0]?.moisture ?? form.moisture)}%</span>
          </div>

          {/* Liquid cylinder glass container */}
          <div className="relative w-16 h-32 bg-stone-950 rounded-full border-2 border-stone-800 flex items-end justify-center overflow-hidden my-3 shadow-inner">
            {/* The liquid content */}
            <motion.div
              className="w-full bg-gradient-to-t from-cyan-600 via-sky-500 to-cyan-400 rounded-b-full relative"
              initial={{ height: 0 }}
              animate={{ height: `${records[0]?.moisture ?? form.moisture}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 12 }}
            >
              {/* Dynamic glass shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{
                  y: ["0%", "10%", "0%"],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            
            {/* Overlay Cylinder measurement markings */}
            <div className="absolute inset-y-0 w-full flex flex-col justify-between py-3 px-1 pointer-events-none select-none text-[8px] text-stone-600 font-mono font-bold">
              <span className="border-t border-stone-800 pl-1">100%</span>
              <span className="border-t border-stone-800 pl-1">75%</span>
              <span className="border-t border-stone-800 pl-1">50%</span>
              <span className="border-t border-stone-800 pl-1">25%</span>
              <span className="border-t border-stone-800 pl-1">0%</span>
            </div>
          </div>

          <span className="text-[10px] text-stone-500 font-bold">Capillary saturation state</span>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Record logger form */}
        <div className="bg-white p-6 rounded-2xl border border-sleek-border shadow-sm h-fit">
          <h3 className="font-bold text-sleek-title text-sm mb-4 border-b border-sleek-border pb-2 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-emerald-500" />
            Log New Analysis
          </h3>
          <form onSubmit={handleAddRecord} className="space-y-4">
            
            <div>
              <label className="block text-xs font-semibold text-sleek-muted uppercase tracking-wider mb-1.5">Field / plot</label>
              <input 
                type="text" 
                value={form.fieldLocation}
                onChange={(e) => setForm({ ...form, fieldLocation: e.target.value })}
                className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-sleek-muted uppercase tracking-wider mb-1.5">Soil pH</label>
                <input 
                  type="number" 
                  min="3.0" 
                  max="10.0" 
                  step="0.1"
                  value={form.ph}
                  onChange={(e) => setForm({ ...form, ph: Number(e.target.value) })}
                  className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sleek-muted uppercase tracking-wider mb-1.5">Moisture (%)</label>
                <input 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={form.moisture}
                  onChange={(e) => setForm({ ...form, moisture: Number(e.target.value) })}
                  className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 border-t border-sleek-border pt-3">
              <span className="block text-xs font-bold text-sleek-title">Nutrients (PPM or kg/ha equivalent)</span>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-sleek-muted uppercase mb-1">Nitrogen (N)</label>
                  <input 
                    type="number" 
                    value={form.nitrogen}
                    onChange={(e) => setForm({ ...form, nitrogen: Number(e.target.value) })}
                    className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl p-2 text-xs text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-sleek-muted uppercase mb-1">Phosphorus (P)</label>
                  <input 
                    type="number" 
                    value={form.phosphorus}
                    onChange={(e) => setForm({ ...form, phosphorus: Number(e.target.value) })}
                    className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl p-2 text-xs text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-sleek-muted uppercase mb-1">Potassium (K)</label>
                  <input 
                    type="number" 
                    value={form.potassium}
                    onChange={(e) => setForm({ ...form, potassium: Number(e.target.value) })}
                    className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl p-2 text-xs text-center font-bold"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-sleek-muted uppercase tracking-wider mb-1.5">Observation / Notes</label>
              <textarea 
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="e.g. Added agricultural lime to treat soil acidity..."
                className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 h-20 font-medium resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Save Soil Analysis
            </button>
          </form>
        </div>

        {/* Charting & Logs list */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Trend Analysis Graph */}
          {records.length > 0 ? (
            <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm">
              <h3 className="font-bold text-sleek-title text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <TrendingUp className="w-4.5 h-4.5 text-emerald-500" />
                Soil Health Trends Over Time
              </h3>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B7280' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                    <Line type="monotone" dataKey="pH" stroke="#059669" strokeWidth={2.5} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="Moisture" stroke="#2563eb" strokeWidth={2} />
                    <Line type="monotone" dataKey="Nitrogen" stroke="#ea580c" strokeWidth={1.5} strokeDasharray="3 3" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : null}

          {/* Ledger logs */}
          <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm">
            <h3 className="font-bold text-sleek-title text-xs uppercase tracking-wider mb-4 border-b border-sleek-border pb-2">
              Soil History Ledger
            </h3>

            {records.length === 0 ? (
              <p className="text-center text-xs text-sleek-muted py-6">No soil logs found. Create one above.</p>
            ) : (
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {records.map((r) => {
                  const phStatus = getPhStatus(r.ph);
                  return (
                    <div key={r.id} className="p-4 bg-sleek-bg rounded-xl border border-sleek-border relative group">
                      <button 
                        onClick={() => handleDeleteRecord(r.id)}
                        className="absolute top-4 right-4 p-1.5 text-sleek-muted hover:text-red-600 hover:bg-white rounded-lg transition-all md:opacity-0 md:group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex flex-wrap items-center gap-2 text-sleek-muted font-bold text-[10px]">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>{r.date}</span>
                        <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                        <span className="text-sleek-text">{r.fieldLocation}</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3">
                        <div className="bg-white p-2 rounded-lg border border-sleek-border">
                          <span className="text-[9px] uppercase tracking-wider text-sleek-muted block font-bold">pH Level</span>
                          <span className="text-sm font-black text-sleek-title flex items-center gap-1.5 mt-0.5">
                            {r.ph}
                            <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold uppercase border ${phStatus.color}`}>
                              {phStatus.label}
                            </span>
                          </span>
                        </div>

                        <div className="bg-white p-2 rounded-lg border border-sleek-border">
                          <span className="text-[9px] uppercase tracking-wider text-sleek-muted block font-bold">Moisture</span>
                          <span className="text-sm font-black text-sleek-title mt-0.5 block">{r.moisture}%</span>
                        </div>

                        <div className="bg-white p-2 rounded-lg border border-sleek-border">
                          <span className="text-[9px] uppercase tracking-wider text-sleek-muted block font-bold">Nitrogen (N)</span>
                          <span className="text-sm font-black text-sleek-title mt-0.5 block">{r.nitrogen} ppm</span>
                        </div>

                        <div className="bg-white p-2 rounded-lg border border-sleek-border">
                          <span className="text-[9px] uppercase tracking-wider text-sleek-muted block font-bold">Phosphorus (P)</span>
                          <span className="text-sm font-black text-sleek-title mt-0.5 block">{r.phosphorus} ppm</span>
                        </div>

                        <div className="bg-white p-2 rounded-lg border border-sleek-border">
                          <span className="text-[9px] uppercase tracking-wider text-sleek-muted block font-bold">Potassium (K)</span>
                          <span className="text-sm font-black text-sleek-title mt-0.5 block">{r.potassium} ppm</span>
                        </div>
                      </div>

                      {r.notes && (
                        <p className="text-[11px] leading-relaxed text-sleek-muted font-medium mt-2.5 bg-white border border-sleek-border px-2.5 py-1.5 rounded-lg flex items-start gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                          <span>{r.notes}</span>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
