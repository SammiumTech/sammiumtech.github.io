import React, { useState, useEffect } from "react";
import { 
  Sprout, Leaf, Trash2, ShieldCheck, Heart, Info, Plus, Star 
} from "lucide-react";

interface TreeRecord {
  id: string;
  date: string;
  species: string;
  quantity: number;
  location: string;
}

export default function SustainabilityDashboard() {
  const [trees, setTrees] = useState<TreeRecord[]>([]);
  const [form, setForm] = useState({
    species: "Carabao Mango",
    quantity: 15,
    location: "Western Orchard"
  });

  useEffect(() => {
    const saved = localStorage.getItem("botolan_tree_records");
    if (saved) {
      setTrees(JSON.parse(saved));
    } else {
      const initial: TreeRecord[] = [
        { id: "1", date: "2026-05-15", species: "Narra Windbreak", quantity: 20, location: "North Boundary Ridgeline" },
        { id: "2", date: "2026-06-02", species: "Carabao Mango", quantity: 8, location: "Western Hill Slope" }
      ];
      setTrees(initial);
      localStorage.setItem("botolan_tree_records", JSON.stringify(initial));
    }
  }, []);

  const handleAddTree = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: TreeRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      species: form.species,
      quantity: Number(form.quantity),
      location: form.location
    };
    const updated = [newRecord, ...trees];
    setTrees(updated);
    localStorage.setItem("botolan_tree_records", JSON.stringify(updated));
    setForm({ species: "Carabao Mango", quantity: 10, location: "" });
  };

  const handleDeleteTree = (id: string) => {
    const updated = trees.filter(t => t.id !== id);
    setTrees(updated);
    localStorage.setItem("botolan_tree_records", JSON.stringify(updated));
  };

  const totalTrees = trees.reduce((sum, t) => sum + t.quantity, 0);
  // Narrative carbon storage multiplier: Narra tree stores approx 22kg CO2/year, mango stores approx 15kg CO2/year. Let's do a round 18kg (0.018 Tons) CO2 per tree per year.
  const carbonSequestrationTons = Number((totalTrees * 0.018).toFixed(3));

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-2xl border border-sleek-border shadow-sm">
        <h2 className="text-xl font-bold text-sleek-title flex items-center gap-2">
          <Leaf className="w-5.5 h-5.5 text-emerald-500" />
          Carbon & Sustainability Dashboard
        </h2>
        <p className="text-sleek-muted text-xs mt-1.5 leading-relaxed">
          Monitor your ecological legacy. Log fruit-bearing or windbreak trees planted across your Botolan farm grid, track estimated metric tons of Carbon sequestrations, and verify water conservation indexes.
        </p>
      </div>

      {/* Sustainability Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm text-center">
          <span className="text-[9px] text-sleek-muted font-black uppercase tracking-wider block">Trees Planted Counter</span>
          <span className="text-2xl font-black text-emerald-600 block mt-1">{totalTrees} Trees</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm text-center">
          <span className="text-[9px] text-sleek-muted font-black uppercase tracking-wider block">Carbon Storage (Tons CO₂e/yr)</span>
          <span className="text-2xl font-black text-emerald-600 block mt-1">+{carbonSequestrationTons} Tons</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm text-center">
          <span className="text-[9px] text-sleek-muted font-black uppercase tracking-wider block">Eco Score Rating</span>
          <span className="text-2xl font-black text-emerald-700 block mt-1 flex items-center justify-center gap-1">
            <Star className="w-5 h-5 text-amber-500 fill-current" />
            Gold Standard
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Logger */}
        <div className="bg-white p-6 rounded-2xl border border-sleek-border shadow-sm h-fit space-y-4">
          <h3 className="font-bold text-xs text-sleek-title uppercase tracking-wider border-b border-sleek-border pb-2 flex items-center gap-1">
            <Plus className="w-4 h-4 text-emerald-500" />
            Log Tree Plantation
          </h3>

          <form onSubmit={handleAddTree} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-sleek-muted uppercase mb-1">Tree / Flora Species</label>
              <select
                value={form.species}
                onChange={(e) => setForm({ ...form, species: e.target.value })}
                className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-2 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Carabao Mango">Carabao Mango (Fruit/Arid resilience)</option>
                <option value="Narra Windbreak">Narra (Sturdy typhoon windbreak)</option>
                <option value="Gliricidia Sepium">Gliricidia / Kakawate (Soil Nitrogen-fixing)</option>
                <option value="Bamboo Grass">Kawayan / Bamboo (Canal structural support)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-sleek-muted uppercase mb-1">Quantity</label>
                <input 
                  type="number" 
                  min="1"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                  className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-3 py-1.5 text-xs font-black"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-sleek-muted uppercase mb-1">Location Zone</label>
                <input 
                  type="text" 
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-3 py-1.5 text-xs font-semibold"
                  placeholder="e.g. South Slope"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Add Tree Entry
            </button>
          </form>
        </div>

        {/* Plantation history list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm">
            <h3 className="font-extrabold text-xs text-sleek-title uppercase tracking-wider border-b border-sleek-border pb-2 mb-4">
              Arbor Plantation History
            </h3>

            {trees.length === 0 ? (
              <p className="text-center text-xs text-sleek-muted py-8">No trees registered. Plant some seedlings on the left!</p>
            ) : (
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                {trees.map((t) => (
                  <div key={t.id} className="p-3 bg-sleek-bg border border-sleek-border rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sleek-title">{t.species}</span>
                        <span className="text-[9px] font-extrabold text-stone-700 bg-white border border-sleek-border px-1.5 py-0.2 rounded-md">
                          +{t.quantity} Seedlings
                        </span>
                      </div>
                      <span className="text-[9px] text-sleek-muted font-bold block mt-0.5">{t.date} • Zone: {t.location}</span>
                    </div>

                    <button 
                      onClick={() => handleDeleteTree(t.id)}
                      className="p-1.5 text-sleek-muted hover:text-red-500 hover:bg-white rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-2.5">
            <Info className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">Kakawate Nitrogen Fixing Impact</h4>
              <p className="text-[11px] text-emerald-900 leading-relaxed mt-1 font-semibold">
                Intercropping Kakawate (Gliricidia sepium) bushes directly alongside dry land crops supplies up to **40kg of biological Nitrogen per hectare** naturally, dramatically reducing standard chemical fertilizer costs.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
