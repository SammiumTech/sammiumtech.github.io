import React from "react";
import { motion } from "motion/react";
import { 
  Users, Megaphone, TrendingUp, Network, FileDown, 
  Sliders, Cpu, Sprout, Database, Activity, AlertTriangle
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

interface BarangayStaffProps {
  farmersList: Array<{ id: number; name: string; barangay: string; area: string; crop: string; registered: string }>;
  setFarmersList: React.Dispatch<React.SetStateAction<any[]>>;
  announcements: Array<{ id: number; title: string; category: string; date: string; author: string; content: string }>;
  setAnnouncements: React.Dispatch<React.SetStateAction<any[]>>;
  newAnnTitle: string;
  setNewAnnTitle: (val: string) => void;
  newAnnCategory: string;
  setNewAnnCategory: (val: string) => void;
  newAnnContent: string;
  setNewAnnContent: (val: string) => void;
  newFarmerName: string;
  setNewFarmerName: (val: string) => void;
  newFarmerBarangay: string;
  setNewFarmerBarangay: (val: string) => void;
  newFarmerArea: string;
  setNewFarmerArea: (val: string) => void;
  newFarmerCrop: string;
  setNewFarmerCrop: (val: string) => void;
  setAiLogs: React.Dispatch<React.SetStateAction<string[]>>;
}

export function BarangayStaffDashboard({
  farmersList,
  setFarmersList,
  announcements,
  setAnnouncements,
  newAnnTitle,
  setNewAnnTitle,
  newAnnCategory,
  setNewAnnCategory,
  newAnnContent,
  setNewAnnContent,
  newFarmerName,
  setNewFarmerName,
  newFarmerBarangay,
  setNewFarmerBarangay,
  newFarmerArea,
  setNewFarmerArea,
  newFarmerCrop,
  setNewFarmerCrop,
  setAiLogs
}: BarangayStaffProps) {
  return (
    <div className="space-y-8">
      {/* Main Title Banner */}
      <div className="p-6 bg-emerald-900 text-white rounded-3xl border border-emerald-800 shadow-md flex items-center justify-between flex-wrap gap-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent)] pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <span className="text-[10px] font-black uppercase text-emerald-300 tracking-widest block">Municipal Administration Desk</span>
          <h2 className="text-2xl font-black tracking-tight">🏢 Botolan Barangay Strength & Engagement Hub</h2>
          <p className="text-xs text-emerald-100 max-w-xl font-semibold">
            Dispatch regional weather interventions, broadcast subsidies, enroll local farmers, and manage collective cooperative grain reserves.
          </p>
        </div>
        <div className="px-4 py-2 bg-emerald-950 rounded-2xl border border-emerald-700 text-xs font-bold text-emerald-300 relative z-10 flex items-center gap-2">
          <Users className="w-4 h-4 animate-pulse" />
          <span>Cooperative Active Profile</span>
        </div>
      </div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-white/5 shadow-sm space-y-2">
          <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">Registered Farmers</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800 dark:text-white">{farmersList.length}</span>
            <span className="text-xs font-extrabold text-emerald-600">+2 this month</span>
          </div>
          <p className="text-[10px] text-slate-500 font-bold">RSBSA integrated members</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-white/5 shadow-sm space-y-2">
          <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">Cooperative Tractors</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800 dark:text-white">2 / 3</span>
            <span className="text-xs font-bold text-blue-600">Active Pool</span>
          </div>
          <div className="flex items-center justify-between gap-1 mt-1">
            <span className="text-[9px] text-slate-500 font-semibold">Mechanical power pool</span>
            <button 
              onClick={() => {
                alert("Barangay tractor pool schedule dispatched successfully to Sector 3!");
                setAiLogs(prev => [`[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] dispatched cooperative tractor to Sector 3`, ...prev]);
              }}
              className="text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded uppercase hover:bg-emerald-100 cursor-pointer"
            >
              Deploy
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-white/5 shadow-sm space-y-2">
          <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">Emergency Hybrid Seed Reserves</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800 dark:text-white">4,500 <span className="text-xs font-bold text-slate-500">kg</span></span>
          </div>
          <div className="flex items-center justify-between gap-1 mt-1">
            <span className="text-[9px] text-slate-500 font-semibold">NSIC Rc222 & Sweet Corn stock</span>
            <button 
              onClick={() => {
                alert("Restock request submitted to Department of Agriculture Region III!");
                setAiLogs(prev => [`[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] requested emergency seed restock from DA R3`, ...prev]);
              }}
              className="text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded uppercase hover:bg-emerald-100 cursor-pointer"
            >
              Restock
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-white/5 shadow-sm space-y-2">
          <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">Disaster Relief Allocations</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800 dark:text-white">₱120,000</span>
          </div>
          <p className="text-[10px] text-slate-500 font-bold font-mono">Reserved for weather claims</p>
        </div>
      </div>

      {/* Interactivity: Announcements & Farmers Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Announcements Creator & Broadcast Panel */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-150 dark:border-white/5 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
            <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-emerald-500" />
              Dispatch Barangay Announcement
            </h3>
            <span className="text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded dark:bg-emerald-950/40 dark:text-emerald-300">
              Broadcast Module
            </span>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Alert Title</label>
                <input 
                  type="text"
                  placeholder="e.g. Subsidy Claim Day"
                  value={newAnnTitle}
                  onChange={(e) => setNewAnnTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 text-xs font-semibold dark:bg-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Category Type</label>
                <select 
                  value={newAnnCategory}
                  onChange={(e) => setNewAnnCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 text-xs font-bold dark:bg-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="Subsidy">Subsidy Announcement</option>
                  <option value="Weather">Weather Intervention Warning</option>
                  <option value="Health">Crop Health Notification</option>
                  <option value="Meeting">Cooperative Assembly</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Alert Content / Details</label>
              <textarea 
                rows={3}
                placeholder="Enter full instructions, times, locations, and requirements for farmers..."
                value={newAnnContent}
                onChange={(e) => setNewAnnContent(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 text-xs font-semibold dark:bg-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <button
              onClick={() => {
                if (!newAnnTitle || !newAnnContent) {
                  alert("Please provide both a title and description content to broadcast!");
                  return;
                }
                const fresh = {
                  id: Date.now(),
                  title: newAnnTitle,
                  category: newAnnCategory,
                  date: "Just Now",
                  author: "Botolan Office",
                  content: newAnnContent
                };
                setAnnouncements([fresh, ...announcements]);
                setNewAnnTitle("");
                setNewAnnContent("");
                setAiLogs(prev => [`[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] broadcast announcement: ${newAnnTitle}`, ...prev]);
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
            >
              Broadcast to Farmer Applets
            </button>
          </div>

          {/* Announcements Stream */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5">
            <span className="text-[10px] font-black uppercase text-slate-400 block">Active Broadcast Stream</span>
            <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/75 dark:bg-slate-950/40 dark:border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                      ann.category === "Weather" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400"
                    }`}>{ann.category}</span>
                    <span className="text-[9px] font-medium text-slate-400">{ann.date} • {ann.author}</span>
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{ann.title}</h4>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Farmer Registry List */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-150 dark:border-white/5 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
            <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-500" />
              Local Farmers Registry
            </h3>
            <span className="text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded dark:bg-emerald-950/40 dark:text-emerald-300">
              Botolan RSBSA Database
            </span>
          </div>

          {/* Add Farmer Mini-Form */}
          <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-100 dark:border-white/5 space-y-3">
            <span className="text-[9px] font-black uppercase text-slate-400 block">Enroll New Field Producer</span>
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="text" 
                placeholder="Farmer's Name"
                value={newFarmerName}
                onChange={(e) => setNewFarmerName(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/5 bg-white text-xs font-bold dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <input 
                type="text" 
                placeholder="Hectares (e.g. 1.8)"
                value={newFarmerArea}
                onChange={(e) => setNewFarmerArea(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/5 bg-white text-xs font-bold dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={newFarmerBarangay}
                onChange={(e) => setNewFarmerBarangay(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-white/5 bg-white text-xs font-bold dark:bg-slate-900 dark:text-white"
              >
                <option value="Poblacion">Poblacion</option>
                <option value="Batonlapoc">Batonlapoc</option>
                <option value="Villar">Villar</option>
                <option value="Cabangan">Cabangan</option>
              </select>
              <select
                value={newFarmerCrop}
                onChange={(e) => setNewFarmerCrop(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-white/5 bg-white text-xs font-bold dark:bg-slate-900 dark:text-white"
              >
                <option value="Palay Rice (NSIC Rc222)">Palay Rice (Rc222)</option>
                <option value="Sweet Corn (Mais)">Sweet Corn (Mais)</option>
                <option value="Saba Banana (Cavendish)">Saba Banana</option>
              </select>
            </div>
            <button
              onClick={() => {
                if (!newFarmerName || !newFarmerArea) {
                  alert("Please fill in the farmer name and hectare amount!");
                  return;
                }
                const freshFarmer = {
                  id: Date.now(),
                  name: newFarmerName,
                  barangay: newFarmerBarangay,
                  area: `${newFarmerArea} Hectares`,
                  crop: newFarmerCrop,
                  registered: "Just Now"
                };
                setFarmersList([...farmersList, freshFarmer]);
                setNewFarmerName("");
                setNewFarmerArea("");
                setAiLogs(prev => [`[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] registered new farmer ${newFarmerName} in ${newFarmerBarangay}`, ...prev]);
              }}
              className="w-full py-2 bg-slate-900 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 text-xs font-black uppercase rounded-xl transition-all cursor-pointer"
            >
              Enroll Producer
            </button>
          </div>

          {/* Registry Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 uppercase text-[9px] font-black">
                  <th className="pb-3 font-extrabold">Name</th>
                  <th className="pb-3 font-extrabold">Barangay</th>
                  <th className="pb-3 font-extrabold">Area</th>
                  <th className="pb-3 font-extrabold">Primary Crop</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-semibold text-slate-700 dark:text-slate-300">
                {farmersList.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                    <td className="py-3 font-bold text-slate-900 dark:text-white">{f.name}</td>
                    <td className="py-3">{f.barangay}</td>
                    <td className="py-3 font-mono text-[10px]">{f.area}</td>
                    <td className="py-3 text-emerald-600 dark:text-emerald-400 font-bold">{f.crop}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

interface AdministratorProps {
  nodeClusters: Array<{ id: string; location: string; ping: string; uptime: string; status: string; signal: string }>;
  setNodeClusters: React.Dispatch<React.SetStateAction<any[]>>;
  yieldCoefficient: number;
  setYieldCoefficient: React.Dispatch<React.SetStateAction<number>>;
  aiLogs: string[];
  setAiLogs: React.Dispatch<React.SetStateAction<string[]>>;
  showJsonDump: boolean;
  setShowJsonDump: (val: boolean) => void;
  isOnline: boolean;
  municipality: string;
  barangay: string;
  gpsCoords: { lat: number | null; lng: number | null };
  weatherMode: string;
  soilMoisture: number;
  soilTemp: number;
  farmersList: any[];
}

export function AdministratorDashboard({
  nodeClusters,
  setNodeClusters,
  yieldCoefficient,
  setYieldCoefficient,
  aiLogs,
  setAiLogs,
  showJsonDump,
  setShowJsonDump,
  isOnline,
  municipality,
  barangay,
  gpsCoords,
  weatherMode,
  soilMoisture,
  soilTemp,
  farmersList
}: AdministratorProps) {
  return (
    <div className="space-y-8">
      {/* Main Title Banner */}
      <div className="p-6 bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-md flex items-center justify-between flex-wrap gap-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent)] pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <span className="text-[10px] font-black uppercase text-cyan-300 tracking-widest block">Municipal Director Control Console</span>
          <h2 className="text-2xl font-black tracking-tight">👨‍💼 Regional Control & Telemetry Command Console</h2>
          <p className="text-xs text-slate-300 max-w-xl font-semibold">
            Audit physical IoT node health arrays, monitor active AI diagnostic weights, configure regional predictive yield projections, and download raw digital twin logs.
          </p>
        </div>
        <div className="px-4 py-2 bg-slate-900 rounded-2xl border border-slate-700 text-xs font-bold text-cyan-300 relative z-10 flex items-center gap-2">
          <Network className="w-4 h-4 animate-ping" />
          <span>Diagnostic Cluster Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1 & 2: Telemetry Nodes & Yield Projections */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Telemetry Node Clusters Panel */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-150 dark:border-white/5 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
              <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-2">
                <Network className="w-4 h-4 text-cyan-500" />
                IoT Telemetry Node Clusters
              </h3>
              <span className="text-[9px] font-black uppercase bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded dark:bg-cyan-950/40 dark:text-cyan-300">
                4 Stations active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nodeClusters.map((node) => (
                <div key={node.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 dark:bg-slate-950/30 dark:border-white/5 flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[8px] font-mono font-black text-slate-400 uppercase tracking-wider">{node.id}</span>
                      <h4 className="font-extrabold text-xs text-slate-800 dark:text-white mt-0.5">{node.location}</h4>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                      node.status === "online" 
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400" 
                        : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400"
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${node.status === "online" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                      {node.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-[10px] font-semibold text-slate-500 border-t border-slate-100 dark:border-white/5 pt-2.5">
                    <div>
                      <span className="text-[7px] text-slate-400 block uppercase font-bold">Latency</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">{node.ping}</span>
                    </div>
                    <div>
                      <span className="text-[7px] text-slate-400 block uppercase font-bold">Uptime</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">{node.uptime}</span>
                    </div>
                    <div>
                      <span className="text-[7px] text-slate-400 block uppercase font-bold">Signal</span>
                      <span className="capitalize text-slate-700 dark:text-slate-300 font-bold">{node.signal}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => {
                        const updated = nodeClusters.map(n => {
                          if (n.id === node.id) {
                            return { ...n, status: n.status === "online" ? "offline" : "online", ping: n.status === "online" ? "---" : "18ms" };
                          }
                          return n;
                        });
                        setNodeClusters(updated);
                        setAiLogs(prev => [`[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] toggled state of node ${node.id}`, ...prev]);
                      }}
                      className="flex-1 py-1 bg-slate-900 text-white dark:bg-slate-800 hover:bg-slate-700 text-[8px] font-black uppercase rounded-lg transition-all cursor-pointer"
                    >
                      Toggle Link
                    </button>
                    <button
                      onClick={() => {
                        if (node.status === "offline") {
                          alert(`Cannot ping ${node.id} because the station link is currently offline!`);
                          return;
                        }
                        const updated = nodeClusters.map(n => {
                          if (n.id === node.id) {
                            return { ...n, ping: `${Math.floor(Math.random() * 30) + 12}ms` };
                          }
                          return n;
                        });
                        setNodeClusters(updated);
                        alert(`Ping reply from ${node.id} received in ${node.ping}! Station active and secure.`);
                      }}
                      className="py-1 px-2.5 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/40 text-[8px] font-black uppercase rounded-lg hover:bg-cyan-100 cursor-pointer"
                    >
                      Ping Station
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Crop Yield Projections Panel & Recharts Graph */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-150 dark:border-white/5 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  Comparative Crop Yield Estimation Graph
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold">
                  Adjust active yield multipliers to view projected metric tons of Palay across Botolan sectors.
                </p>
              </div>
              <span className="text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded dark:bg-emerald-950/40 dark:text-emerald-300">
                Live Formula Model
              </span>
            </div>

            {/* Live Formula Controller Slider */}
            <div className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Yield Multiplier Coefficient</span>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Based on current solar radiance & soil hydration indices.</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setYieldCoefficient(prev => Math.max(0.5, parseFloat((prev - 0.15).toFixed(2))))}
                  className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white font-black text-center text-sm cursor-pointer active:scale-90"
                >
                  -
                </button>
                <span className="text-lg font-mono font-black text-slate-800 dark:text-white">{yieldCoefficient}x</span>
                <button 
                  onClick={() => setYieldCoefficient(prev => Math.min(2.5, parseFloat((prev + 0.15).toFixed(2))))}
                  className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white font-black text-center text-sm cursor-pointer active:scale-90"
                >
                  +
                </button>
              </div>
            </div>

            {/* Graph */}
            <div className="h-[220px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { sector: "Poblacion", current: 4.2, projected: parseFloat((4.2 * yieldCoefficient).toFixed(1)) },
                  { sector: "Villar", current: 3.1, projected: parseFloat((3.1 * yieldCoefficient).toFixed(1)) },
                  { sector: "Batonlapoc", current: 3.8, projected: parseFloat((3.8 * yieldCoefficient).toFixed(1)) },
                  { sector: "Cabangan", current: 4.5, projected: parseFloat((4.5 * yieldCoefficient).toFixed(1)) }
                ]} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                  <XAxis dataKey="sector" stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                  <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                  <Tooltip contentStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                  <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                  <Line type="monotone" name="Standard Historic Yield (MT/ha)" dataKey="current" stroke="#94a3b8" strokeWidth={2} activeDot={{ r: 4 }} />
                  <Line type="monotone" name="Projected Crop Harvest (MT/ha)" dataKey="projected" stroke="#10b981" strokeWidth={3} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Column 3: AI Diagnostic Auditing & Export */}
        <div className="lg:col-span-1 space-y-8">
          
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-150 dark:border-white/5 shadow-sm space-y-6 flex flex-col justify-between min-h-[500px]">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
                <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-500 animate-pulse" />
                  AI Diagnostic Weights
                </h3>
                <span className="text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded dark:bg-emerald-950/40 dark:text-emerald-300">
                  Uptime 99%
                </span>
              </div>

              {/* Diagnostic details */}
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Inference Engine State</span>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-white/5 rounded-xl flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Model Uptime Index</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">100% Operational</span>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Zambales Digital Twin Sync Logs</span>
                  <div className="bg-slate-950 p-4 rounded-xl font-mono text-[9px] text-slate-300 h-[180px] overflow-y-auto space-y-1.5 border border-slate-800">
                    {aiLogs.map((log, idx) => (
                      <div key={idx} className="leading-normal flex items-start gap-1">
                        <span className="text-cyan-400 shrink-0">➜</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Raw Database Exporter Button */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/5">
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                Download or audit the complete physical memory stack representation of Botolan digital twin.
              </p>
              <button
                onClick={() => setShowJsonDump(!showJsonDump)}
                className="w-full py-3 bg-slate-900 text-white dark:bg-cyan-600 dark:hover:bg-cyan-700 text-xs font-black uppercase tracking-wider rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 animate-pulse"
              >
                <FileDown className="w-4 h-4" />
                <span>{showJsonDump ? "Hide Database Dump" : "Export Raw Telemetry Logs"}</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Inline JSON Dump Modal */}
      {showJsonDump && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-950 p-6 rounded-3xl border border-slate-800 font-mono text-[10px] text-cyan-400 space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Raw Digital Twin State Snapshot (JSON Representation)</span>
            <button 
              onClick={() => setShowJsonDump(false)}
              className="text-slate-400 hover:text-white uppercase font-bold text-[9px]"
            >
              [Dismiss]
            </button>
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap bg-slate-900/40 p-4 rounded-xl leading-normal text-slate-300 border border-slate-800 max-h-[300px]">
            {JSON.stringify({
              timestamp: new Date().toISOString(),
              operator_profile: "Sam (Botolan Field Lead)",
              connectivity: isOnline ? "ONLINE_INTEGRATED" : "OFFLINE_RESILIENT_MODE",
              current_municipal_location: {
                municipality: municipality,
                barangay: barangay,
                coordinates: gpsCoords
              },
              zambales_weather_sensors: {
                preset_mode: weatherMode,
                calculated_humidity: weatherMode === "monsoon" ? "98%" : weatherMode === "rainy" ? "91%" : "44%",
                wind_velocity: weatherMode === "windy" ? "42 km/h" : "12 km/h"
              },
              active_sensor_probes: {
                soil_moisture_percentage: soilMoisture,
                soil_temperature_celsius: soilTemp,
                diagnostic_streak_days: 142
              },
              registered_crop_hectares: farmersList.reduce((acc, curr) => acc + parseFloat(curr.area), 0),
              active_alerts_length: 4,
              ai_confidence_metric: "94%"
            }, null, 2)}
          </pre>
        </motion.div>
      )}

    </div>
  );
}
