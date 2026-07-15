import React, { useState, useEffect } from "react";
import { 
  Users, FileText, Megaphone, UserPlus, Check, X, ShieldCheck, 
  Search, Plus, Trash2, Calendar, Award, Building, UserCheck
} from "lucide-react";
import LivingCard from "./LivingCard";
import { motion } from "motion/react";

interface Resident {
  id: string;
  name: string;
  barangay: string;
  farmType: string;
  farmSize: number;
  status: "Active" | "Calamity Affected" | "Suspended";
  registeredDate: string;
}

interface Clearance {
  id: string;
  farmerName: string;
  barangay: string;
  requestType: "Seed Subsidy Grant" | "Fuel Subsidy" | "Calamity Financial Aid" | "Tractor Slot Allocation";
  status: "Pending Officer Review" | "Approved" | "Rejected";
  dateRequested: string;
  justification: string;
  reviewer: string;
}

interface Announcement {
  id: string;
  title: string;
  category: "Agricultural Advisory" | "Subsidy Alert" | "DRRMO Typhoon Warning" | "Community Event";
  content: string;
  date: string;
  publisher: string;
  isPinned: boolean;
}

interface BarangayPortalProps {
  userRole: "officer" | "farmer" | "agronomist";
  userName: string;
  offlineMode: boolean;
}

export default function BarangayPortal({ userRole, userName, offlineMode }: BarangayPortalProps) {
  const [activeTab, setActiveTab] = useState<"directory" | "clearances" | "announcements">("announcements");

  // State lists
  const [residents, setResidents] = useState<Resident[]>([]);
  const [clearances, setClearances] = useState<Clearance[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Search/Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", category: "Agricultural Advisory" as any, content: "", isPinned: false });
  const [newResident, setNewResident] = useState({ name: "", barangay: "Poblacion", farmType: "Carabao Mango", farmSize: 1.5 });
  const [newClearance, setNewClearance] = useState({ requestType: "Seed Subsidy Grant" as any, justification: "" });

  // Notifications
  const [notif, setNotif] = useState<string | null>(null);

  useEffect(() => {
    // Load local storage caches
    const cachedResidents = localStorage.getItem("scos_residents");
    const cachedClearances = localStorage.getItem("scos_clearances");
    const cachedAnnouncements = localStorage.getItem("scos_announcements");

    if (cachedResidents) setResidents(JSON.parse(cachedResidents));
    else {
      const initial: Resident[] = [
        { id: "res-1", name: "Samy Lopez (Farmer Sam)", barangay: "Moraza", farmType: "Carabao Mango / Sweet Potato", farmSize: 2.5, status: "Active", registeredDate: "2025-11-12" },
        { id: "res-2", name: "Juan de la Cruz", barangay: "Poblacion", farmType: "Wet Rice (Palay)", farmSize: 1.8, status: "Active", registeredDate: "2026-01-20" },
        { id: "res-3", name: "Maria Santos", barangay: "Poonbato", farmType: "Jicama (Singkamas)", farmSize: 1.2, status: "Calamity Affected", registeredDate: "2026-03-05" },
        { id: "res-4", name: "Orlando Castro", barangay: "Panan", farmType: "Yellow Corn & Peanuts", farmSize: 3.0, status: "Active", registeredDate: "2025-08-15" },
        { id: "res-5", name: "Teodoro de Guzman", barangay: "Villar", farmType: "Organic Vegetables", farmSize: 0.8, status: "Active", registeredDate: "2026-05-18" }
      ];
      setResidents(initial);
      localStorage.setItem("scos_residents", JSON.stringify(initial));
    }

    if (cachedClearances) setClearances(JSON.parse(cachedClearances));
    else {
      const initial: Clearance[] = [
        { id: "clr-1", farmerName: "Farmer Sam", barangay: "Moraza", requestType: "Seed Subsidy Grant", status: "Approved", dateRequested: "2026-07-02", justification: "Requesting hybrid mango saplings for expanding orchard near Moraza foothills.", reviewer: "Officer Juan de la Cruz" },
        { id: "clr-2", farmerName: "Maria Santos", barangay: "Poonbato", requestType: "Calamity Financial Aid", status: "Pending Officer Review", dateRequested: "2026-07-05", justification: "Livelihood severely affected by recent seasonal heavy rainfall; soil saturation ruined singkamas crop rootbeds.", reviewer: "Pending" },
        { id: "clr-3", farmerName: "Orlando Castro", barangay: "Panan", requestType: "Tractor Slot Allocation", status: "Pending Officer Review", dateRequested: "2026-07-06", justification: "Requesting municipal tractor support on July 10 for deep tillage prior to dry corn sowing.", reviewer: "Pending" }
      ];
      setClearances(initial);
      localStorage.setItem("scos_clearances", JSON.stringify(initial));
    }

    if (cachedAnnouncements) setAnnouncements(JSON.parse(cachedAnnouncements));
    else {
      const initial: Announcement[] = [
        { id: "ann-1", title: "Official Seed and Organic Fertilizer Distribution", category: "Subsidy Alert", content: "The Botolan Municipal Agriculture Office (MAO) will distribute certified palay seeds and organic compost sacks starting Tuesday at the Poblacion Gymnasium. Please bring your registered SCOS ID cards.", date: "2026-07-05", publisher: "Municipal Agronomist", isPinned: true },
        { id: "ann-2", title: "La Niña Preparation: Clearing Farm Drainage Runoffs", category: "Agricultural Advisory", content: "Barangay agricultural officers advise all farmers in flatland Moraza and Baquilan to clear primary irrigation channels of debris. Saturated volcanic sand siltation can trigger heavy soil shifting.", date: "2026-07-06", publisher: "DRRMO Botolan", isPinned: true },
        { id: "ann-3", title: "Regional Agronomist Caravan: Soil Assays", category: "Community Event", content: "Join the Sammium Research Labs caravan on July 12 for free soil pH and Nitrogen-Phosphorus-Potassium level testing directly at the Poonbato evacuation field.", date: "2026-07-04", publisher: "Dr. Elena Santos", isPinned: false }
      ];
      setAnnouncements(initial);
      localStorage.setItem("scos_announcements", JSON.stringify(initial));
    }
  }, []);

  const triggerNotif = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 4000);
  };

  // Add Announcement (Officer / Agronomist only)
  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.content) return;

    const ann: Announcement = {
      id: `ann-${Date.now()}`,
      title: newAnnouncement.title,
      category: newAnnouncement.category,
      content: newAnnouncement.content,
      date: new Date().toISOString().split("T")[0],
      publisher: userName,
      isPinned: newAnnouncement.isPinned
    };

    const updated = [ann, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem("scos_announcements", JSON.stringify(updated));
    setNewAnnouncement({ title: "", category: "Agricultural Advisory", content: "", isPinned: false });
    triggerNotif("Official Bulletin broadcasted and recorded in local registry!");
  };

  // Create Resident Registry entry (Officer only)
  const handleRegisterResident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResident.name) return;

    const res: Resident = {
      id: `res-${Date.now()}`,
      name: newResident.name,
      barangay: newResident.barangay,
      farmType: newResident.farmType,
      farmSize: Number(newResident.farmSize),
      status: "Active",
      registeredDate: new Date().toISOString().split("T")[0]
    };

    const updated = [...residents, res];
    setResidents(updated);
    localStorage.setItem("scos_residents", JSON.stringify(updated));
    setNewResident({ name: "", barangay: "Poblacion", farmType: "Carabao Mango", farmSize: 1.5 });
    triggerNotif(`Successfully registered ${res.name} to SCOS database.`);
  };

  // Apply for Clearance (Farmer only)
  const handleApplyClearance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClearance.justification) return;

    const clr: Clearance = {
      id: `clr-${Date.now()}`,
      farmerName: userName,
      barangay: "Moraza", // Simulated from farmer location
      requestType: newClearance.requestType,
      status: "Pending Officer Review",
      dateRequested: new Date().toISOString().split("T")[0],
      justification: newClearance.justification,
      reviewer: "Pending"
    };

    const updated = [clr, ...clearances];
    setClearances(updated);
    localStorage.setItem("scos_clearances", JSON.stringify(updated));
    setNewClearance({ requestType: "Seed Subsidy Grant", justification: "" });
    triggerNotif("Subsidy request filed under Human-in-the-Loop review queue.");
  };

  // Approve / Reject Clearance (Officer only)
  const handleReviewClearance = (id: string, approve: boolean) => {
    const updated = clearances.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: approve ? "Approved" as const : "Rejected" as const,
          reviewer: userName
        };
      }
      return c;
    });
    setClearances(updated);
    localStorage.setItem("scos_clearances", JSON.stringify(updated));
    triggerNotif(`Subsidy request #${id.split("-")[1] || id} has been ${approve ? "officially APPROVED and digitally signed!" : "REJECTED."}`);
  };

  const filteredResidents = residents.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.barangay.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.farmType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header card with SCOS styling */}
      <div className="p-6 bg-white rounded-2xl border border-sleek-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building className="w-5.5 h-5.5 text-emerald-600" />
            <h2 className="text-xl font-bold text-sleek-title">SCOS Barangay Portal & Bulletins</h2>
          </div>
          <p className="text-sleek-muted text-xs mt-1.5 leading-relaxed max-w-2xl">
            SCOS Version 1 Community Operating System. Administer registered land holdings, coordinate public agricultural subsidies, publish official bulletins, and digitally sign local clearance permits.
          </p>
        </div>

        {/* Sync / Offline indicator */}
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${offlineMode ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
          <span className="text-[10px] font-black uppercase tracking-wider text-sleek-title bg-sleek-bg p-2 rounded-xl border border-sleek-border">
            {offlineMode ? "Offline-First Local Storage Cache Sync" : "Cloud Connection Secure"}
          </span>
        </div>
      </div>

      {notif && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2"
        >
          <UserCheck className="w-4 h-4 text-emerald-600" />
          <span>{notif}</span>
        </motion.div>
      )}

      {/* SCOS Portal Sub-tabs */}
      <div className="flex bg-white p-1 rounded-xl border border-sleek-border w-fit shadow-xs">
        <button
          onClick={() => setActiveTab("announcements")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "announcements" ? "bg-emerald-500 text-white shadow-xs" : "text-sleek-text hover:bg-sleek-bg"
          }`}
        >
          <Megaphone className="w-4 h-4" />
          Barangay Announcements ({announcements.length})
        </button>
        <button
          onClick={() => setActiveTab("clearances")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "clearances" ? "bg-emerald-500 text-white shadow-xs" : "text-sleek-text hover:bg-sleek-bg"
          }`}
        >
          <FileText className="w-4 h-4" />
          Agri-Clearance Subsidies ({clearances.filter(c => c.status.includes("Pending")).length} Pending)
        </button>
        <button
          onClick={() => setActiveTab("directory")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "directory" ? "bg-emerald-500 text-white shadow-xs" : "text-sleek-text hover:bg-sleek-bg"
          }`}
        >
          <Users className="w-4 h-4" />
          Farmer & Land Registry ({residents.length})
        </button>
      </div>

      {/* RENDER TAB CONTENTS */}
      <div>
        
        {/* --- TAB 1: ANNOUNCEMENTS & BULLETIN BOARD --- */}
        {activeTab === "announcements" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Bulletins list */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-black tracking-widest text-sleek-title uppercase">Official Public Broadcast Bulletin</h3>
              
              <div className="space-y-3.5">
                {announcements.map((ann) => (
                  <LivingCard 
                    key={ann.id} 
                    className={`p-5 bg-white border rounded-2xl relative shadow-xs flex flex-col justify-between ${
                      ann.isPinned ? "border-emerald-500/40 bg-emerald-50/5" : "border-sleek-border"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase border ${
                          ann.category === "DRRMO Typhoon Warning" 
                            ? "bg-rose-50 border-rose-200 text-rose-700 animate-pulse"
                            : "bg-emerald-50 border-emerald-100 text-emerald-800"
                        }`}>
                          {ann.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-sleek-muted text-[10px] font-bold">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>{ann.date}</span>
                        </div>
                      </div>

                      <h4 className="font-extrabold text-sleek-title text-sm flex items-center gap-1.5">
                        {ann.isPinned && <span className="text-emerald-500 text-xs shrink-0">📌 [PINNED]</span>}
                        {ann.title}
                      </h4>
                      <p className="text-sleek-muted text-xs leading-relaxed mt-2 font-medium">{ann.content}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-sleek-border/60 flex justify-between items-center text-[10px] text-sleek-muted font-bold">
                      <span>Publisher: {ann.publisher}</span>
                      <span className="text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 inline" /> Verified SCOS Broadcast
                      </span>
                    </div>
                  </LivingCard>
                ))}
              </div>
            </div>

            {/* Right Col: Write Announcement (Officers only) */}
            <div className="space-y-4">
              <h3 className="text-xs font-black tracking-widest text-sleek-title uppercase">Publisher Controls</h3>
              
              {userRole === "officer" || userRole === "agronomist" ? (
                <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm space-y-4">
                  <h4 className="font-extrabold text-sleek-title text-xs uppercase tracking-wider pb-2 border-b border-sleek-border">
                    Broadcast Official Bulletin
                  </h4>
                  <form onSubmit={handlePublishAnnouncement} className="space-y-3.5">
                    <div>
                      <label className="text-[10px] uppercase font-black text-sleek-muted block mb-1">Title</label>
                      <input 
                        type="text"
                        value={newAnnouncement.title}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                        placeholder="e.g., La Niña Calamity Grant Guidelines"
                        className="w-full bg-sleek-bg border border-sleek-border text-xs rounded-xl p-2.5 font-bold text-sleek-title focus:ring-1 focus:ring-emerald-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-black text-sleek-muted block mb-1">Category</label>
                      <select
                        value={newAnnouncement.category}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value as any })}
                        className="w-full bg-sleek-bg border border-sleek-border text-xs rounded-xl p-2.5 font-bold text-sleek-title focus:ring-1 focus:ring-emerald-500 outline-none"
                      >
                        <option value="Agricultural Advisory">Agricultural Advisory</option>
                        <option value="Subsidy Alert">Subsidy Alert</option>
                        <option value="DRRMO Typhoon Warning">DRRMO Typhoon Warning</option>
                        <option value="Community Event">Community Event</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-black text-sleek-muted block mb-1">Content</label>
                      <textarea
                        rows={4}
                        value={newAnnouncement.content}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                        placeholder="Write official message bulletin text here..."
                        className="w-full bg-sleek-bg border border-sleek-border text-xs rounded-xl p-2.5 font-semibold text-sleek-title focus:ring-1 focus:ring-emerald-500 outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox"
                        id="isPinned"
                        checked={newAnnouncement.isPinned}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, isPinned: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <label htmlFor="isPinned" className="text-xs font-bold text-sleek-title select-none">Pin bulletin at top</label>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Megaphone className="w-4 h-4" /> Broadcast Announcement
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-slate-50 p-5 rounded-2xl border border-dashed border-slate-200 text-center text-slate-500 text-xs">
                  <Building className="w-8 h-8 mx-auto mb-2 text-slate-400 stroke-1" />
                  <p className="font-bold">Publishing Locked</p>
                  <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                    Only authorized SCOS Barangay Officers and Municipal Agronomists can broadcast official public bulletins. Please change your active session role in the dashboard sidebar to unlock.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* --- TAB 2: AGRI-CLEARANCES & SUBSIDY APPROVALS (HUMAN-IN-THE-LOOP DEMO) --- */}
        {activeTab === "clearances" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Clearances review stream */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-black tracking-widest text-sleek-title uppercase">Subsidy Grant Clearance Registry (Human-in-the-Loop Queue)</h3>
              
              <div className="space-y-3.5">
                {clearances.map((c) => (
                  <LivingCard key={c.id} className="p-5 bg-white border border-sleek-border rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2 pb-2 border-b border-sleek-border/60">
                        <div>
                          <span className="text-[9px] font-black text-sleek-muted block uppercase tracking-wider">Request ID: #{c.id.split("-")[1] || c.id}</span>
                          <span className="text-xs font-extrabold text-sleek-title">{c.requestType}</span>
                        </div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase border ${
                          c.status === "Approved" 
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                            : c.status === "Rejected"
                            ? "bg-rose-50 border-rose-200 text-rose-800"
                            : "bg-amber-50 border-amber-200 text-amber-800 animate-pulse"
                        }`}>
                          {c.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-[11px] mb-3 font-bold text-sleek-title">
                        <div>
                          <span className="text-[9px] text-sleek-muted block uppercase tracking-wider">Farmer Applicant</span>
                          <span>{c.farmerName} ({c.barangay})</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-sleek-muted block uppercase tracking-wider">Date Filed</span>
                          <span>{c.dateRequested}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-sleek-text bg-sleek-bg p-3 rounded-xl border border-sleek-border font-semibold italic">
                        " {c.justification} "
                      </p>
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-sleek-border/60 flex justify-between items-center">
                      <span className="text-[10px] text-sleek-muted font-bold block">
                        Reviewer Sign-off: <span className="text-sleek-title">{c.reviewer}</span>
                      </span>

                      {/* Action trigger: HITL approval for Officer Role */}
                      {c.status === "Pending Officer Review" && (userRole === "officer" || userRole === "agronomist") && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleReviewClearance(c.id, false)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 hover:border-rose-300 rounded-lg text-xs font-extrabold cursor-pointer transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleReviewClearance(c.id, true)}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-extrabold cursor-pointer transition-all flex items-center gap-1 shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve & Sign
                          </button>
                        </div>
                      )}
                    </div>
                  </LivingCard>
                ))}
              </div>
            </div>

            {/* Right Col: Apply for clearances (Farmer role only) */}
            <div className="space-y-4">
              <h3 className="text-xs font-black tracking-widest text-sleek-title uppercase">Farmer Submissions</h3>
              
              {userRole === "farmer" ? (
                <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm space-y-4">
                  <h4 className="font-extrabold text-sleek-title text-xs uppercase tracking-wider pb-2 border-b border-sleek-border">
                    Request Seed/Aid Clearance
                  </h4>
                  <form onSubmit={handleApplyClearance} className="space-y-3.5">
                    <div>
                      <label className="text-[10px] uppercase font-black text-sleek-muted block mb-1">Clearance Category</label>
                      <select
                        value={newClearance.requestType}
                        onChange={(e) => setNewClearance({ ...newClearance, requestType: e.target.value as any })}
                        className="w-full bg-sleek-bg border border-sleek-border text-xs rounded-xl p-2.5 font-bold text-sleek-title focus:ring-1 focus:ring-emerald-500 outline-none"
                      >
                        <option value="Seed Subsidy Grant">Seed Subsidy Grant</option>
                        <option value="Fuel Subsidy">Fuel Subsidy</option>
                        <option value="Calamity Financial Aid">Calamity Financial Aid</option>
                        <option value="Tractor Slot Allocation">Tractor Slot Allocation</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-black text-sleek-muted block mb-1">Justification Detail</label>
                      <textarea
                        rows={4}
                        value={newClearance.justification}
                        onChange={(e) => setNewClearance({ ...newClearance, justification: e.target.value })}
                        placeholder="e.g., Requesting financial relief due to high soil salinity damage in my Moraza plot..."
                        className="w-full bg-sleek-bg border border-sleek-border text-xs rounded-xl p-2.5 font-semibold text-sleek-title focus:ring-1 focus:ring-emerald-500 outline-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <FileText className="w-4 h-4" /> File Subsidy Application
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-slate-50 p-5 rounded-2xl border border-dashed border-slate-200 text-center text-slate-500 text-xs">
                  <UserPlus className="w-8 h-8 mx-auto mb-2 text-slate-400 stroke-1" />
                  <p className="font-bold">Filing Locked</p>
                  <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                    Only registered Resident Farmers (like Farmer Sam) can submit subsidy clearance applications. Please change your active session role to 'Resident Farmer' in the sidebar to test filing.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* --- TAB 3: RESIDENT DIRECTORY & LAND REGISTRY --- */}
        {activeTab === "directory" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Registry list with search */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-xs font-black tracking-widest text-sleek-title uppercase">Registered SCOS Farmer Registry</h3>
                
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search residents..."
                    className="w-full bg-white text-sleek-title border border-sleek-border rounded-xl pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  />
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-sleek-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-sleek-bg border-b border-sleek-border text-[9px] font-black uppercase tracking-wider text-sleek-muted">
                        <th className="p-3.5">Full Name</th>
                        <th className="p-3.5">Barangay</th>
                        <th className="p-3.5">Primary Cultivation</th>
                        <th className="p-3.5">Farm Acreage</th>
                        <th className="p-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sleek-border text-xs text-sleek-text">
                      {filteredResidents.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3.5 font-bold text-sleek-title flex items-center gap-2">
                            <span className="w-7 h-7 bg-emerald-50 text-emerald-800 rounded-full font-black text-[10px] flex items-center justify-center border border-emerald-100">
                              {r.name.charAt(0)}
                            </span>
                            <div>
                              <span>{r.name}</span>
                              <span className="text-[9px] text-sleek-muted font-bold block mt-0.5">UID: {r.id.toUpperCase()}</span>
                            </div>
                          </td>
                          <td className="p-3.5 font-bold">{r.barangay}</td>
                          <td className="p-3.5 font-semibold text-[11px]">{r.farmType}</td>
                          <td className="p-3.5 font-mono font-black">{r.farmSize} Hectares</td>
                          <td className="p-3.5">
                            <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase border ${
                              r.status === "Active" 
                                ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                                : "bg-rose-50 border-rose-200 text-rose-800"
                            }`}>
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Col: Register New Resident (Officer Only) */}
            <div className="space-y-4">
              <h3 className="text-xs font-black tracking-widest text-sleek-title uppercase">Admin Registration</h3>
              
              {userRole === "officer" ? (
                <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm space-y-4">
                  <h4 className="font-extrabold text-sleek-title text-xs uppercase tracking-wider pb-2 border-b border-sleek-border">
                    Enroll New SCOS Resident
                  </h4>
                  <form onSubmit={handleRegisterResident} className="space-y-3.5">
                    <div>
                      <label className="text-[10px] uppercase font-black text-sleek-muted block mb-1">Full Name</label>
                      <input 
                        type="text"
                        value={newResident.name}
                        onChange={(e) => setNewResident({ ...newResident, name: e.target.value })}
                        placeholder="e.g., Benjamin Santos"
                        className="w-full bg-sleek-bg border border-sleek-border text-xs rounded-xl p-2.5 font-bold text-sleek-title focus:ring-1 focus:ring-emerald-500 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-black text-sleek-muted block mb-1">Barangay Sector</label>
                      <select
                        value={newResident.barangay}
                        onChange={(e) => setNewResident({ ...newResident, barangay: e.target.value })}
                        className="w-full bg-sleek-bg border border-sleek-border text-xs rounded-xl p-2.5 font-bold text-sleek-title focus:ring-1 focus:ring-emerald-500 outline-none"
                      >
                        {["Poblacion", "Moraza", "Poonbato", "Panan", "Villar", "Burgos", "Carael", "Moraza"].map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-black text-sleek-muted block mb-1">Crop Type(s)</label>
                      <input 
                        type="text"
                        value={newResident.farmType}
                        onChange={(e) => setNewResident({ ...newResident, farmType: e.target.value })}
                        placeholder="e.g., Wet Rice, Siling Labuyo"
                        className="w-full bg-sleek-bg border border-sleek-border text-xs rounded-xl p-2.5 font-bold text-sleek-title focus:ring-1 focus:ring-emerald-500 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-black text-sleek-muted block mb-1">Farm Land Size (Hectares)</label>
                      <input 
                        type="number"
                        step="0.1"
                        value={newResident.farmSize}
                        onChange={(e) => setNewResident({ ...newResident, farmSize: Number(e.target.value) })}
                        placeholder="1.5"
                        className="w-full bg-sleek-bg border border-sleek-border text-xs rounded-xl p-2.5 font-bold text-sleek-title focus:ring-1 focus:ring-emerald-500 outline-none"
                        required
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <UserPlus className="w-4 h-4" /> Register & Issue SCOS UID
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-slate-50 p-5 rounded-2xl border border-dashed border-slate-200 text-center text-slate-500 text-xs">
                  <Building className="w-8 h-8 mx-auto mb-2 text-slate-400 stroke-1" />
                  <p className="font-bold">Administrative Lock</p>
                  <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                    Only authorized SCOS Barangay Officers (like Officer Juan) can register new residents and allocate local land holding UIDs. Change your active session role to test enrollment.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
