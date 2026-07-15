import React, { useState, useEffect } from "react";
import { 
  Check, Plus, Trash2, Calendar, Scale, Heart, AlertCircle, Info, ChevronRight 
} from "lucide-react";

interface LivestockNode {
  id: string;
  tagId: string;
  type: "Goat" | "Cow" | "Pig" | "Chicken";
  breed: string;
  weightKg: number;
  healthStatus: "Excellent" | "Fair" | "Under treatment";
  vaccineDone: boolean;
  nextVaccineDate: string;
  notes: string;
}

export default function LivestockManager() {
  const [animals, setAnimals] = useState<LivestockNode[]>([]);
  const [form, setForm] = useState({
    tagId: "TAG-G14",
    type: "Goat" as any,
    breed: "Boer Goat Cross",
    weightKg: 38,
    healthStatus: "Excellent" as any,
    vaccineDone: false,
    nextVaccineDate: "2026-09-10",
    notes: ""
  });

  useEffect(() => {
    const saved = localStorage.getItem("botolan_livestock_records");
    if (saved) {
      setAnimals(JSON.parse(saved));
    } else {
      const initial: LivestockNode[] = [
        { id: "1", tagId: "TAG-G14", type: "Goat", breed: "Boer Cross", weightKg: 38, healthStatus: "Excellent", vaccineDone: true, nextVaccineDate: "2026-09-10", notes: "Regular grazing. Given vitamins." },
        { id: "2", tagId: "TAG-C08", type: "Cow", breed: "Brahman Bull", weightKg: 420, healthStatus: "Excellent", vaccineDone: false, nextVaccineDate: "2026-07-25", notes: "Checked by local veterinarian. Healthy." },
        { id: "3", tagId: "TAG-P22", type: "Pig", breed: "Landrace White", weightKg: 95, healthStatus: "Under treatment", vaccineDone: true, nextVaccineDate: "2026-08-01", notes: "Recovering from minor foot inflammation." }
      ];
      setAnimals(initial);
      localStorage.setItem("botolan_livestock_records", JSON.stringify(initial));
    }
  }, []);

  const handleAddAnimal = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnimal: LivestockNode = {
      id: Date.now().toString(),
      tagId: form.tagId,
      type: form.type,
      breed: form.breed,
      weightKg: Number(form.weightKg),
      healthStatus: form.healthStatus,
      vaccineDone: form.vaccineDone,
      nextVaccineDate: form.nextVaccineDate,
      notes: form.notes
    };

    const updated = [newAnimal, ...animals];
    setAnimals(updated);
    localStorage.setItem("botolan_livestock_records", JSON.stringify(updated));
    setForm({
      tagId: `TAG-${form.type[0].toUpperCase()}${Math.floor(Math.random() * 90) + 10}`,
      type: "Goat",
      breed: "",
      weightKg: 35,
      healthStatus: "Excellent",
      vaccineDone: false,
      nextVaccineDate: "2026-08-30",
      notes: ""
    });
  };

  const handleDeleteAnimal = (id: string) => {
    const updated = animals.filter(a => a.id !== id);
    setAnimals(updated);
    localStorage.setItem("botolan_livestock_records", JSON.stringify(updated));
  };

  const toggleVaccine = (id: string) => {
    const updated = animals.map(a => a.id === id ? { ...a, vaccineDone: !a.vaccineDone } : a);
    setAnimals(updated);
    localStorage.setItem("botolan_livestock_records", JSON.stringify(updated));
  };

  const simulateWeightGain = () => {
    // Simulated weight gain over active cycle
    setAnimals(prev => prev.map(a => {
      const multiplier = a.type === "Cow" ? 1.5 : a.type === "Pig" ? 0.8 : 0.3;
      const gain = Number((Math.random() * multiplier).toFixed(1));
      return {
        ...a,
        weightKg: Number((a.weightKg + gain).toFixed(1))
      };
    }));
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-2xl border border-sleek-border shadow-sm">
        <h2 className="text-xl font-bold text-sleek-title flex items-center gap-2">
          <Heart className="w-5.5 h-5.5 text-rose-500 fill-rose-100" />
          Livestock Intelligence ledger
        </h2>
        <p className="text-sleek-muted text-xs mt-1.5 leading-relaxed">
          Monitor your goats, cows, pigs, or chickens. Log weights, manage vaccination schedules, track treatment cycles, and run localized feed calculations dynamically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Registry Form */}
        <div className="bg-white p-6 rounded-2xl border border-sleek-border shadow-sm h-fit space-y-4">
          <h3 className="font-bold text-xs text-sleek-title uppercase tracking-wider border-b border-sleek-border pb-2 flex items-center gap-1">
            <Plus className="w-4 h-4 text-emerald-500" />
            Register Animal
          </h3>

          <form onSubmit={handleAddAnimal} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-sleek-muted uppercase mb-1">Tag ID</label>
                <input 
                  type="text" 
                  value={form.tagId}
                  onChange={(e) => setForm({ ...form, tagId: e.target.value })}
                  className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-3 py-1.5 text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-sleek-muted uppercase mb-1">Animal type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as any, tagId: `TAG-${e.target.value[0].toUpperCase()}${Math.floor(Math.random() * 90) + 10}` })}
                  className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-2 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Goat">Goat</option>
                  <option value="Cow">Cow</option>
                  <option value="Pig">Pig</option>
                  <option value="Chicken">Chicken</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-sleek-muted uppercase mb-1">Breed</label>
                <input 
                  type="text" 
                  value={form.breed}
                  onChange={(e) => setForm({ ...form, breed: e.target.value })}
                  className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-3 py-1.5 text-xs font-semibold"
                  placeholder="e.g. Boer cross"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-sleek-muted uppercase mb-1">Weight (kg)</label>
                <input 
                  type="number" 
                  value={form.weightKg}
                  onChange={(e) => setForm({ ...form, weightKg: Number(e.target.value) })}
                  className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-3 py-1.5 text-xs font-black"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-sleek-muted uppercase mb-1">Health status</label>
                <select
                  value={form.healthStatus}
                  onChange={(e) => setForm({ ...form, healthStatus: e.target.value as any })}
                  className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-2 py-1.5 text-xs font-semibold"
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Fair">Fair</option>
                  <option value="Under treatment">Under treatment</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-sleek-muted uppercase mb-1">Next vaccine</label>
                <input 
                  type="date" 
                  value={form.nextVaccineDate}
                  onChange={(e) => setForm({ ...form, nextVaccineDate: e.target.value })}
                  className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-3 py-1.5 text-[11px] font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-sleek-muted uppercase mb-1">Notes / Diet schedule</label>
              <textarea 
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-3 py-1.5 text-xs font-medium h-16 resize-none"
                placeholder="e.g. Grass grazing, 200g grain meal per day..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Add Livestock Tag
            </button>
          </form>
        </div>

        {/* List of active animals */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm">
            <div className="flex items-center justify-between border-b border-sleek-border pb-3 mb-4">
              <h3 className="font-extrabold text-xs text-sleek-title uppercase tracking-wider">
                Active Herd registry
              </h3>
              <button
                onClick={simulateWeightGain}
                className="px-2.5 py-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-md hover:bg-emerald-100 cursor-pointer"
              >
                Simulate Herd Weight Gain
              </button>
            </div>

            {animals.length === 0 ? (
              <p className="text-center text-xs text-sleek-muted py-8">No livestock currently listed. Register an animal on the left.</p>
            ) : (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {animals.map((a) => (
                  <div key={a.id} className="p-4 bg-sleek-bg border border-sleek-border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative group">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-sleek-title">{a.type} ({a.breed})</span>
                        <span className="text-[9px] font-extrabold text-stone-700 bg-white border border-sleek-border px-1.5 py-0.2 rounded-md uppercase">
                          {a.tagId}
                        </span>
                        <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.2 border rounded-md ${
                          a.healthStatus === "Excellent" ? "bg-emerald-50 text-emerald-800 border-emerald-100" :
                          a.healthStatus === "Fair" ? "bg-amber-50 text-amber-800 border-amber-100" :
                          "bg-rose-50 text-rose-800 border-rose-100"
                        }`}>
                          {a.healthStatus}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[10px] text-sleek-muted font-bold">
                        <span className="flex items-center gap-1">
                          <Scale className="w-3.5 h-3.5 text-stone-400" />
                          Weight: {a.weightKg} kg
                        </span>
                        <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          Vaccine Due: {a.nextVaccineDate || "None"}
                        </span>
                      </div>

                      {a.notes && (
                        <p className="text-[10px] leading-relaxed text-sleek-muted mt-1 font-semibold p-2 bg-white rounded-lg border border-sleek-border">
                          {a.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleVaccine(a.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border cursor-pointer transition-colors ${
                          a.vaccineDone 
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                            : "bg-white text-sleek-muted border-sleek-border hover:bg-sleek-bg"
                        }`}
                      >
                        {a.vaccineDone ? "✓ Immunized" : "Mark Vaccinated"}
                      </button>

                      <button
                        onClick={() => handleDeleteAnimal(a.id)}
                        className="p-1.5 text-sleek-muted hover:text-red-500 hover:bg-white rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-2.5">
            <Info className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">Dynamic Herd Nutrition Calculations</h4>
              <p className="text-[11px] text-emerald-900 leading-relaxed mt-1 font-semibold">
                Daily forage needs equal roughly 3-4% of a goat's bodyweight or 2-3% of a cow's bodyweight in high-quality dry matter feed. Based on your active herd size, recommend preparing at least **14.8 kg** of supplementary forage feed daily.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
