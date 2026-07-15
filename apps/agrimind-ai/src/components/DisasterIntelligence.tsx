import React, { useState, useEffect } from "react";
import { 
  AlertTriangle, Phone, Map, Radio, ShieldAlert, Navigation, 
  Flame, BatteryCharging, Zap, Compass, Send, CheckCircle2, CloudLightning
} from "lucide-react";
import LivingCard from "./LivingCard";
import { motion } from "motion/react";

interface EvacShelter {
  name: string;
  location: string;
  distanceKm: number;
  capacityMax: number;
  capacityCurrent: number;
  amenities: string[];
  safeStatus: "Optimal Safe" | "Nearing Capacity" | "Flooding Advisory";
}

interface SosBeacon {
  id: string;
  senderName: string;
  location: string;
  urgency: "Immediate Evacuation" | "Medical Assistance" | "Resource Shortage";
  details: string;
  timestamp: string;
  status: "Broadcasting..." | "Relayed via Mesh" | "Responder Dispatched";
}

interface DisasterIntelProps {
  emergencyMode: boolean;
  setEmergencyMode: (val: boolean) => void;
  offlineMode: boolean;
}

export default function DisasterIntelligence({ emergencyMode, setEmergencyMode, offlineMode }: DisasterIntelProps) {
  const [activeDisaster, setActiveDisaster] = useState<"typhoon" | "earthquake" | "ashfall">("typhoon");
  
  // Local SOS beacons
  const [beacons, setBeacons] = useState<SosBeacon[]>([]);
  const [newSos, setNewSos] = useState({ senderName: "Farmer Sam", location: "Purok 4, Moraza", urgency: "Immediate Evacuation" as any, details: "" });
  const [sosSent, setSosSent] = useState(false);

  useEffect(() => {
    const cachedBeacons = localStorage.getItem("scos_beacons");
    if (cachedBeacons) setBeacons(JSON.parse(cachedBeacons));
    else {
      const initial: SosBeacon[] = [
        { id: "bcon-1", senderName: "Teodoro de Guzman", location: "Villar Creek border", urgency: "Medical Assistance", details: "Elderly resident needs diabetic insulin refrigeration. Power grid outage warning.", timestamp: "04:55 AM", status: "Relayed via Mesh" },
        { id: "bcon-2", senderName: "Maria Santos", location: "Poonbato flatlands", urgency: "Resource Shortage", details: "Potable water well contaminated by silt runoffs. Requesting clean water canister delivery.", timestamp: "05:12 AM", status: "Responder Dispatched" }
      ];
      setBeacons(initial);
      localStorage.setItem("scos_beacons", JSON.stringify(initial));
    }
  }, []);

  const handleSendSos = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSos.details) return;

    const bcon: SosBeacon = {
      id: `bcon-${Date.now()}`,
      senderName: newSos.senderName,
      location: newSos.location,
      urgency: newSos.urgency,
      details: newSos.details,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: offlineMode ? "Broadcasting..." : "Relayed via Mesh"
    };

    const updated = [bcon, ...beacons];
    setBeacons(updated);
    localStorage.setItem("scos_beacons", JSON.stringify(updated));
    setNewSos({ ...newSos, details: "" });
    setSosSent(true);
    setTimeout(() => setSosSent(false), 4000);
  };

  // Botolan Shelter Data
  const shelters: EvacShelter[] = [
    { name: "Botolan Municipal Gymnasium", location: "Poblacion proper", distanceKm: 2.1, capacityMax: 1200, capacityCurrent: 980, amenities: ["Emergency Rations", "First Aid Station", "Power Banks", "Water Purifier"], safeStatus: "Nearing Capacity" },
    { name: "Poonbato Primary School", location: "Barangay Poonbato (high ground)", distanceKm: 5.4, capacityMax: 600, capacityCurrent: 240, amenities: ["Emergency Rations", "Basic Shelter Beds", "Solar Power Grid"], safeStatus: "Optimal Safe" },
    { name: "Baquilan Resettlement Center", location: "Baquilan Foothills (solid foundation)", distanceKm: 8.1, capacityMax: 1500, capacityCurrent: 180, amenities: ["Complete Medical Clinic", "Water Tankers", "Ham Radio Comms"], safeStatus: "Optimal Safe" },
    { name: "Capayawan Barangay Hall", location: "Lowland flat fields", distanceKm: 3.5, capacityMax: 400, capacityCurrent: 350, amenities: ["Rations Only"], safeStatus: "Flooding Advisory" }
  ];

  // Utility Infrastructure Grids status under emergency
  const utilities = [
    { name: "Luzon Hydro-Power Grid", status: "Outage / Substation Tripped", statusType: "critical", comment: "Poblacion blackout. Substation isolated due to flash mudflow threat." },
    { name: "Municipal Clean Water Supply", status: "Intermittent / Sediment Warning", statusType: "warning", comment: "Moraza pumps offline. Volcano ash and silt detected in river runoffs." },
    { name: "SCOS Local Terrestrial Mesh Network", status: "Active (95% Availability)", statusType: "optimal", comment: "Loral radio transceivers and backup solar battery cells operational." },
    { name: "DRRMO Telecommunications link", status: "Emergency Satellite Active", statusType: "optimal", comment: "Direct satellite terminal routing active for municipal emergency agents." }
  ];

  return (
    <div className={`space-y-6 transition-all duration-700 ${emergencyMode ? "p-1.5 md:p-3 bg-red-950/20 rounded-3xl border border-red-500/30" : ""}`}>
      
      {/* Dynamic Alarm / Action banner */}
      <div className={`p-6 rounded-2xl border transition-all shadow-md ${
        emergencyMode 
          ? "bg-red-950 border-red-500 text-white shadow-[0_0_24px_rgba(239,68,68,0.25)]" 
          : "bg-white border-sleek-border text-sleek-text"
      }`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <CloudLightning className={`w-6.5 h-6.5 ${emergencyMode ? "text-red-400 animate-bounce" : "text-amber-500"}`} />
              <div>
                <span className={`text-[10px] font-black uppercase tracking-widest block ${emergencyMode ? "text-red-300" : "text-amber-600"}`}>
                  SCOS Disaster Preparedness & Action
                </span>
                <h2 className="text-xl font-black tracking-tight">
                  {emergencyMode ? "🚨 ACTIVE EMERGENCY HUD OVERRIDE ACTIVE" : "Disaster Preparedness HUD"}
                </h2>
              </div>
            </div>
            <p className={`text-xs leading-relaxed max-w-2xl ${emergencyMode ? "text-red-200" : "text-sleek-muted"}`}>
              {emergencyMode 
                ? "WARNING: Typhoon Bising (Category 3) landfall predicted within 3 hours. High contrast, low-power minimalist HUD active. All local IoT actions are locked to defensive modes."
                : "Switch into Emergency HUD Mode during Active typhoons, volcanic ashfall, or river floods to streamline distress transmissions and trace real-time evacuation shelters."}
            </p>
          </div>

          <button
            onClick={() => setEmergencyMode(!emergencyMode)}
            className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 border shadow-lg ${
              emergencyMode 
                ? "bg-white text-red-950 border-white hover:bg-red-100" 
                : "bg-red-600 hover:bg-red-700 text-white border-red-500"
            }`}
          >
            <ShieldAlert className="w-4 h-4 animate-pulse" />
            {emergencyMode ? "Deactivate Emergency Mode" : "Simulate Emergency Mode"}
          </button>
        </div>
      </div>

      {/* RENDER EMERGENCY PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COL 1: ACTIVE WARNINGS & SHELTER MAPS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Evacuation Shelters */}
          <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-sleek-border pb-2.5">
              <h3 className="font-extrabold text-sleek-title text-sm uppercase tracking-wider flex items-center gap-1.5">
                <Map className="w-4.5 h-4.5 text-emerald-500" />
                Active Evacuation Shelters
              </h3>
              <span className="text-[10px] font-black uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                Grounded GPS Locations
              </span>
            </div>

            <p className="text-[11px] text-sleek-muted leading-relaxed">
              Evacuate immediately if residing near river basins in Moraza/Poonbato or low-lying flatlands. Follow coordinates below.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shelters.map((s, idx) => (
                <div key={idx} className="p-4 bg-sleek-bg border border-sleek-border rounded-xl flex flex-col justify-between hover:border-emerald-500 transition-colors">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-extrabold text-sleek-title text-xs leading-tight">{s.name}</span>
                      <span className={`text-[8.5px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                        s.safeStatus === "Optimal Safe" 
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-100" 
                          : s.safeStatus === "Flooding Advisory"
                          ? "bg-rose-50 text-rose-800 border border-rose-200 animate-pulse"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}>
                        {s.safeStatus}
                      </span>
                    </div>

                    <span className="text-[9.5px] text-sleek-muted font-bold block mb-1">Sector: {s.location}</span>
                    <span className="text-[10px] font-mono text-emerald-600 font-extrabold flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5" /> Distance: {s.distanceKm} km
                    </span>

                    {/* Progress Bar for Capacity */}
                    <div className="mt-3.5 space-y-1">
                      <div className="flex justify-between text-[8.5px] font-bold text-sleek-muted">
                        <span>CAPACITY UTILIZATION</span>
                        <span>{s.capacityCurrent} / {s.capacityMax} ({Math.round((s.capacityCurrent / s.capacityMax) * 100)}%)</span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full ${s.capacityCurrent / s.capacityMax > 0.8 ? "bg-amber-500" : "bg-emerald-500"}`} 
                          style={{ width: `${(s.capacityCurrent / s.capacityMax) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-sleek-border/60 flex flex-wrap gap-1">
                    {s.amenities.map((a, i) => (
                      <span key={i} className="text-[8px] font-extrabold bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded-md border border-stone-200/50">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure Utility Grid Status */}
          <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm space-y-4">
            <h3 className="font-extrabold text-sleek-title text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-sleek-border pb-2.5">
              <Zap className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
              Infrastructure Utility & Utility Grid Status
            </h3>

            <div className="space-y-3">
              {utilities.map((u, idx) => (
                <div key={idx} className="p-3 bg-sleek-bg border border-sleek-border rounded-xl grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                  <div>
                    <span className="font-extrabold text-sleek-title text-xs block">{u.name}</span>
                  </div>
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase border ${
                      u.statusType === "critical" 
                        ? "bg-rose-50 border-rose-200 text-rose-700 animate-pulse" 
                        : u.statusType === "warning"
                        ? "bg-amber-50 border-amber-200 text-amber-700"
                        : "bg-emerald-50 border-emerald-200 text-emerald-800"
                    }`}>
                      {u.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-sleek-muted font-bold leading-tight">{u.comment}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* COL 2: SOS BEACONS & ONE-TAP DIALS */}
        <div className="space-y-6">
          
          {/* Distress transmitter (SOS Transceiver) */}
          <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm space-y-4">
            <h3 className="font-extrabold text-sleek-title text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-sleek-border pb-2.5">
              <Radio className="w-4.5 h-4.5 text-red-500 animate-ping" />
              SOS Transceiver (Beacon)
            </h3>

            <p className="text-[11px] text-sleek-muted leading-relaxed">
              Need immediate help? Broadcast your distress beacon. This panel works completely offline—queued logs transmit via local SCOS terrestrial radio relays.
            </p>

            {sosSent && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Distress signal registered in SCOS offline queue!</span>
              </div>
            )}

            <form onSubmit={handleSendSos} className="space-y-3">
              <div>
                <label className="text-[8.5px] font-black uppercase text-sleek-muted block mb-0.5">Applicant Name</label>
                <input 
                  type="text" 
                  value={newSos.senderName}
                  onChange={(e) => setNewSos({ ...newSos, senderName: e.target.value })}
                  className="w-full bg-sleek-bg border border-sleek-border text-[11px] rounded-lg p-2 font-bold text-sleek-title"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[8.5px] font-black uppercase text-sleek-muted block mb-0.5">Coordinates / Purok</label>
                  <input 
                    type="text" 
                    value={newSos.location}
                    onChange={(e) => setNewSos({ ...newSos, location: e.target.value })}
                    className="w-full bg-sleek-bg border border-sleek-border text-[11px] rounded-lg p-2 font-bold text-sleek-title"
                  />
                </div>
                <div>
                  <label className="text-[8.5px] font-black uppercase text-sleek-muted block mb-0.5">Urgency Level</label>
                  <select 
                    value={newSos.urgency}
                    onChange={(e) => setNewSos({ ...newSos, urgency: e.target.value })}
                    className="w-full bg-sleek-bg border border-sleek-border text-[11px] rounded-lg p-1.5 font-bold text-sleek-title"
                  >
                    <option value="Immediate Evacuation">Evacuation</option>
                    <option value="Medical Assistance">Medical Aid</option>
                    <option value="Resource Shortage">Shortage</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[8.5px] font-black uppercase text-sleek-muted block mb-0.5">Distress details</label>
                <textarea 
                  rows={2}
                  value={newSos.details}
                  onChange={(e) => setNewSos({ ...newSos, details: e.target.value })}
                  placeholder="e.g., Saturated slope shifting behind my mango plot. Mud encroaching..."
                  className="w-full bg-sleek-bg border border-sleek-border text-[11px] rounded-lg p-2 font-bold text-sleek-title outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer border border-red-500 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" /> Broadcast Distress SOS
              </button>
            </form>

            <div className="border-t border-sleek-border/70 pt-3 space-y-2">
              <span className="text-[9px] font-black text-sleek-muted uppercase tracking-wider block">Local Beacon Stream</span>
              <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                {beacons.map((b) => (
                  <div key={b.id} className="p-2.5 bg-sleek-bg border border-sleek-border rounded-lg text-[10px]">
                    <div className="flex justify-between items-start font-bold">
                      <span className="text-sleek-title">{b.senderName} ({b.location})</span>
                      <span className="text-[8.5px] text-red-600 bg-red-50 px-1 rounded-sm">{b.timestamp}</span>
                    </div>
                    <p className="text-sleek-muted mt-1 leading-normal font-medium">"{b.details}"</p>
                    <span className="text-[8.5px] text-emerald-600 font-extrabold block mt-1.5">📡 Status: {b.status}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* One-tap Speed Dial list */}
          <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm space-y-4">
            <h3 className="font-extrabold text-sleek-title text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-sleek-border pb-2.5">
              <Phone className="w-4.5 h-4.5 text-emerald-500" />
              One-Tap Hotlines (Botolan)
            </h3>

            <div className="space-y-2.5">
              {[
                { label: "Botolan DRRMO Command", num: "0917-543-9876", sub: "Disaster Emergency Team" },
                { label: "Barangay Police Desk", num: "0998-123-4567", sub: "Poblacion Station" },
                { label: "Municipal Health Clinic", num: "0921-987-6543", sub: "Ambulance / Medics Dispatch" },
                { label: "Zambales Provincial Hospital", num: "(047) 224-2211", sub: "Direct Line" }
              ].map((h, i) => (
                <a
                  key={i}
                  href={`tel:${h.num.replace(/[^0-9]/g, "")}`}
                  className="p-3 bg-sleek-bg hover:bg-red-50 border border-sleek-border hover:border-red-200 rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                >
                  <div>
                    <span className="text-xs font-black text-sleek-title group-hover:text-red-950 block">{h.label}</span>
                    <span className="text-[9px] text-sleek-muted font-bold block mt-0.5">{h.sub}</span>
                  </div>
                  <span className="text-[11px] font-mono font-black text-emerald-700 bg-emerald-50 group-hover:bg-red-100 group-hover:text-red-800 px-2.5 py-1 rounded-lg border border-emerald-100 group-hover:border-red-200 transition-colors">
                    {h.num}
                  </span>
                </a>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
