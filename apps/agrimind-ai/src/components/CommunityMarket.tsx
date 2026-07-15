import React, { useState, useEffect } from "react";
import { 
  Users, Share2, Calendar, ShoppingBag, Plus, Sparkles, 
  MapPin, Bell, Check, ArrowRight, ShieldCheck, Heart
} from "lucide-react";

interface ForumPost {
  id: string;
  author: string;
  role: string;
  text: string;
  likes: number;
  comments: number;
  liked?: boolean;
}

interface OutbreakNode {
  id: string;
  barangay: string;
  threat: string;
  severity: "moderate" | "critical";
  distanceKm: number;
}

export default function CommunityMarket() {
  const [activeSubTab, setActiveSubTab] = useState<"social" | "sharing" | "marketplace">("social");

  // Outbreaks (Community Intelligence Warning Network)
  const [outbreaks, setOutbreaks] = useState<OutbreakNode[]>([
    { id: "o-1", barangay: "Poonbato (Sito Target)", threat: "Fall Armyworm (Corn)", severity: "critical", distanceKm: 4.8 },
    { id: "o-2", barangay: "Cabangan (Border Grid)", threat: "Rice Tungro Leafhopper", severity: "moderate", distanceKm: 12.0 },
    { id: "o-3", barangay: "Panan Orchard Zones", threat: "Mango Leafhopper Blight", severity: "critical", distanceKm: 8.5 }
  ]);

  const [forumPosts, setForumPosts] = useState<ForumPost[]>([
    { id: "post-1", author: "Mang Pedring Lopez", role: "Palay Agronomist", text: "Mga kasama, mataas po ang halumigmig (humidity) ngayon sa Poonbato. Mag-ingat po sa Rice Blast. Ang gamit ko po ay biological neem extract para iwas kemikal.", likes: 14, comments: 3 },
    { id: "post-2", author: "Nene Del Rosario", role: "Carabao Mango Specialist", text: "Has anyone tried the new Solar Dryer in Barangay Bucao? Is the drying rate optimal for mango skins?", likes: 8, comments: 2 }
  ]);

  const [newPostText, setNewPostText] = useState("");

  // Booking states
  const [equipmentList, setEquipmentList] = useState([
    { id: "eq-1", name: "Kubota L5018 Tractor", cost: "₱1,200/day", status: "Available", desc: "Heavy disc-plowing for clayey rice plots.", host: "MAO Cooperatives" },
    { id: "eq-2", name: "Sammium Spray Drone Kit", cost: "₱2,500/day", status: "Booked", desc: "Precision liquid fertilizer foliar application.", host: "Santos Tech Hub" },
    { id: "eq-3", name: "Solar Drying Floor Plot", cost: "₱400/day", status: "Available", desc: "Batch-dry palay seeds down to 14% moisture.", host: "Barangay Bucao Postharvest" }
  ]);
  const [bookingLogs, setBookingLogs] = useState<string[]>([]);

  // Crop list
  const [marketplaceLots, setMarketplaceLots] = useState([
    { id: "lot-1", crop: "Organic Rice Palay (Stage 5)", amount: "4.5 Tons", moisture: "13.8%", price: "₱24.50/kg", buyerQuery: "Looking for Grade A millable Rice, moisture <= 14%.", buyerName: "Zambales Millers Inc." },
    { id: "lot-2", crop: "Premium Carabao Mangoes", amount: "1.2 Tons", moisture: "N/A", price: "₱120.00/kg", buyerQuery: "Direct hotel contract, Grade A sweet mangoes.", buyerName: "Subic Bay Resorts" }
  ]);

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    const newPost: ForumPost = {
      id: Date.now().toString(),
      author: "Local Farmer (You)",
      role: "Botolan Agronomist",
      text: newPostText,
      likes: 0,
      comments: 0
    };
    setForumPosts([newPost, ...forumPosts]);
    setNewPostText("");
  };

  const handleLikePost = (id: string) => {
    setForumPosts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          likes: p.liked ? p.likes - 1 : p.likes + 1,
          liked: !p.liked
        };
      }
      return p;
    }));
  };

  const triggerOutbreakReport = () => {
    const alerts = [
      { id: String(Date.now()), barangay: "San Juan Orchard", threat: "Mealybug Infestation", severity: "moderate" as any, distanceKm: 3.2 },
      { id: String(Date.now() + 1), barangay: "Barangay Carael", threat: "Bacterial Leaf Streak", severity: "critical" as any, distanceKm: 6.1 }
    ];
    const picked = alerts[Math.floor(Math.random() * alerts.length)];
    setOutbreaks([picked, ...outbreaks]);
  };

  const handleBookEquipment = (eqId: string, eqName: string) => {
    setBookingLogs(prev => [`Successfully requested booking for ${eqName}. Pending cooperative approval.`, ...prev]);
    setEquipmentList(prev => prev.map(eq => eq.id === eqId ? { ...eq, status: "Pending approval" } : eq));
  };

  return (
    <div className="space-y-6">
      
      {/* Sub tabs */}
      <div className="flex bg-white p-1 rounded-xl border border-sleek-border w-fit shadow-xs">
        <button
          onClick={() => setActiveSubTab("social")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "social"
              ? "bg-emerald-500 text-white shadow-xs"
              : "text-sleek-text hover:bg-sleek-bg"
          }`}
        >
          <Users className="w-4 h-4" />
          Community & Outbreak Warnings
        </button>
        <button
          onClick={() => setActiveSubTab("sharing")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "sharing"
              ? "bg-emerald-500 text-white shadow-xs"
              : "text-sleek-text hover:bg-sleek-bg"
          }`}
        >
          <Share2 className="w-4 h-4" />
          Equipment Sharing Network
        </button>
        <button
          onClick={() => setActiveSubTab("marketplace")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "marketplace"
              ? "bg-emerald-500 text-white shadow-xs"
              : "text-sleek-text hover:bg-sleek-bg"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Wholesale Smart Market
        </button>
      </div>

      {activeSubTab === "social" && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-sleek-border shadow-sm">
            <h2 className="text-xl font-bold text-sleek-title flex items-center gap-2">
              <Users className="w-5.5 h-5.5 text-emerald-500" />
              Community Outbreak warning & Farmer Forum
            </h2>
            <p className="text-sleek-muted text-xs mt-1.5 leading-relaxed">
              Connect with fellow farmers in Botolan. Share real-time local disease outbreak vectors, ask municipal agronomist guild experts, and coordinate biological quarantine efforts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Outbreaks map / alert feed */}
            <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-sleek-border pb-3">
                <h3 className="font-extrabold text-sleek-title text-sm uppercase tracking-wider flex items-center gap-1.5">
                  <Bell className="w-4.5 h-4.5 text-rose-500" />
                  Regional Vector Risks
                </h3>
                <button
                  onClick={triggerOutbreakReport}
                  className="px-2 py-1 text-[9px] font-black text-rose-600 bg-rose-50 border border-rose-100 rounded-md hover:bg-rose-100 cursor-pointer"
                >
                  Report Incident
                </button>
              </div>

              <p className="text-[11px] text-sleek-muted leading-relaxed">
                Active pathogens flagged within a 15km perimeter of Botolan. Coordinate immediate preventative sprays.
              </p>

              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {outbreaks.map((o) => (
                  <div key={o.id} className="p-3 bg-sleek-bg border border-sleek-border rounded-xl flex items-start gap-3 relative">
                    <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                      o.severity === "critical" ? "bg-red-500 animate-pulse" : "bg-amber-500"
                    }`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-black text-sleek-title block truncate">{o.threat}</span>
                        <span className="text-[9px] font-bold text-sleek-muted shrink-0 ml-1">
                          {o.distanceKm} km away
                        </span>
                      </div>
                      <span className="text-[10px] text-sleek-muted font-bold block mt-0.5">Location: {o.barangay}</span>
                      <span className={`text-[8px] font-bold uppercase mt-1 px-1.5 py-0.2 border rounded-md inline-block ${
                        o.severity === "critical" ? "bg-red-50 text-red-800 border-red-100" : "bg-amber-50 text-amber-800 border-amber-100"
                      }`}>
                        {o.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Discussion Feed */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm">
                <h3 className="font-extrabold text-xs text-sleek-title uppercase tracking-wider mb-3 pb-2 border-b border-sleek-border">
                  Say something on the Farmer Bulletin
                </h3>

                <form onSubmit={handleAddPost} className="flex gap-2">
                  <input 
                    type="text" 
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    placeholder="e.g. 'I identified sweet potato weevils near Barangay Bucao western ridge...'"
                    className="flex-1 bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Post
                  </button>
                </form>
              </div>

              {/* Forum Entries */}
              <div className="space-y-3.5">
                {forumPosts.map((post) => (
                  <div key={post.id} className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-sleek-border pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center font-black text-xs text-stone-700 border border-sleek-border">
                          {post.author[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-sleek-title text-xs">{post.author}</h4>
                          <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">{post.role}</span>
                        </div>
                      </div>
                      <span className="text-[9px] text-sleek-muted font-bold">1 hour ago</span>
                    </div>

                    <p className="text-xs text-sleek-text leading-relaxed font-semibold">
                      {post.text}
                    </p>

                    <div className="flex items-center gap-4 pt-2 border-t border-sleek-border/60">
                      <button 
                        onClick={() => handleLikePost(post.id)}
                        className={`text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                          post.liked ? "text-rose-600" : "text-sleek-muted hover:text-rose-600"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />
                        {post.likes} Likes
                      </button>
                      <span className="text-[10px] text-sleek-muted font-bold">
                        💬 {post.comments} Comments
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {activeSubTab === "sharing" && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-sleek-border shadow-sm">
            <h2 className="text-xl font-bold text-sleek-title flex items-center gap-2">
              <Share2 className="w-5.5 h-5.5 text-emerald-500" />
              Agricultural Equipment Sharing Network
            </h2>
            <p className="text-sleek-muted text-xs mt-1.5 leading-relaxed">
              Lease expensive equipment directly from municipal cooperative pools or certified local operators. Book tractors, spray drones, or batch solar drying pads securely to reduce operational capital limits.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Booking listings */}
            <div className="lg:col-span-2 space-y-4">
              {equipmentList.map((eq) => (
                <div key={eq.id} className="p-5 bg-white border border-sleek-border rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-emerald-500 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-sleek-title">{eq.name}</h4>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase ${
                        eq.status === "Available" ? "bg-emerald-50 text-emerald-800 border-emerald-100" : "bg-stone-50 text-stone-600 border-stone-200"
                      }`}>
                        {eq.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-sleek-muted font-bold block">Provided by: {eq.host}</span>
                    <p className="text-xs text-sleek-muted mt-2 leading-relaxed font-semibold">{eq.desc}</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-sleek-border">
                    <div className="text-right">
                      <span className="text-[9px] text-sleek-muted font-bold block uppercase">Cost</span>
                      <span className="text-base font-black text-sleek-title">{eq.cost}</span>
                    </div>

                    <button
                      onClick={() => handleBookEquipment(eq.id, eq.name)}
                      disabled={eq.status !== "Available"}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:bg-stone-100 disabled:text-stone-400 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Request Lease
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Booking log timeline */}
            <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm space-y-4 h-fit">
              <h3 className="font-extrabold text-xs text-sleek-title uppercase tracking-wider mb-2 pb-2 border-b border-sleek-border">
                Your Booking Requests
              </h3>

              <div className="space-y-3">
                {bookingLogs.length === 0 ? (
                  <p className="text-center text-xs text-sleek-muted py-8">No booking logs listed. Lease an item on the left.</p>
                ) : (
                  bookingLogs.map((log, idx) => (
                    <div key={idx} className="p-3 bg-sleek-bg border border-sleek-border rounded-xl text-[11px] leading-normal font-semibold text-emerald-900 bg-emerald-50/50 border-emerald-100 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{log}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {activeSubTab === "marketplace" && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-sleek-border shadow-sm">
            <h2 className="text-xl font-bold text-sleek-title flex items-center gap-2">
              <ShoppingBag className="w-5.5 h-5.5 text-emerald-500" />
              Wholesale Smart Marketplace
            </h2>
            <p className="text-sleek-muted text-xs mt-1.5 leading-relaxed">
              Wholesale buyers, nearby hotels, and municipal millers match automatically with your listed harvest lots. Keep transaction intermediary fees at 0%.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {marketplaceLots.map((lot) => (
              <div key={lot.id} className="bg-white p-5 border border-sleek-border rounded-2xl shadow-sm space-y-4">
                <div className="flex items-start justify-between border-b border-sleek-border pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-sleek-title">{lot.crop}</h3>
                    <span className="text-[10px] text-sleek-muted font-bold block mt-0.5">Lot Volume: {lot.amount} • Moisture: {lot.moisture}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-sleek-muted font-bold block uppercase">Est. Price</span>
                    <span className="text-base font-black text-emerald-700">{lot.price}</span>
                  </div>
                </div>

                <div className="p-4 bg-sleek-bg border border-sleek-border rounded-xl">
                  <span className="text-[9px] text-sleek-muted uppercase font-bold block mb-1">Target buyer matching request</span>
                  <p className="text-xs text-sleek-title font-semibold">{lot.buyerQuery}</p>
                  <span className="text-[10px] text-emerald-600 font-extrabold block mt-2">Buyer: {lot.buyerName}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Matched 98%
                  </span>

                  <button className="text-xs font-black text-emerald-600 hover:text-emerald-800 flex items-center gap-1 cursor-pointer">
                    Chat Buyer <ArrowRight className="w-4 h-4 inline" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
