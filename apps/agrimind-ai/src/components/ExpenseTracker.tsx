import React, { useState, useEffect } from "react";
import { 
  Wallet, Plus, Trash2, Calendar, DollarSign, Tag, TrendingUp, Sparkles, AlertCircle 
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { FarmExpense } from "../types";

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<FarmExpense[]>([]);
  const [form, setForm] = useState({
    category: "seeds" as any,
    description: "Carabao Mango Grafted Saplings",
    amount: 3500,
    cropCycle: "2026 Mango Harvest"
  });

  useEffect(() => {
    const saved = localStorage.getItem("botolan_farm_expenses");
    if (saved) {
      setExpenses(JSON.parse(saved));
    } else {
      const initial: FarmExpense[] = [
        { id: "1", date: "2026-05-10", category: "seeds", description: "Carabao Mango Grafted Saplings", amount: 3500, cropCycle: "2026 Mango Harvest" },
        { id: "2", date: "2026-05-12", category: "fertilizer", description: "Complete NPK (14-14-14) 2 Bags", amount: 5400, cropCycle: "2026 Rice Cycle" },
        { id: "3", date: "2026-05-20", category: "labor", description: "Plot clearing and land prep crew", amount: 7500, cropCycle: "2026 Rice Cycle" },
        { id: "4", date: "2026-06-02", category: "fuel", description: "Irrigation pump gasoline", amount: 1200, cropCycle: "2026 Rice Cycle" },
        { id: "5", date: "2026-06-15", category: "pesticides", description: "Organic Neem Extract Spray", amount: 1800, cropCycle: "2026 Mango Harvest" }
      ];
      setExpenses(initial);
      localStorage.setItem("botolan_farm_expenses", JSON.stringify(initial));
    }
  }, []);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: FarmExpense = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      category: form.category,
      description: form.description,
      amount: Number(form.amount),
      cropCycle: form.cropCycle
    };

    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    localStorage.setItem("botolan_farm_expenses", JSON.stringify(updated));

    // Reset description & amount
    setForm({
      ...form,
      description: "",
      amount: 1000
    });
  };

  const handleDeleteExpense = (id: string) => {
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    localStorage.setItem("botolan_farm_expenses", JSON.stringify(updated));
  };

  // Grouping data for charts
  const categoryTotals = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(categoryTotals).map(cat => ({
    name: cat.toUpperCase(),
    value: categoryTotals[cat]
  }));

  const COLORS = ["#047857", "#0284c7", "#ea580c", "#e11d48", "#ca8a04", "#7c3aed", "#2563eb", "#4b5563"];

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-white rounded-2xl border border-sleek-border shadow-sm">
        <h2 className="text-xl font-bold text-sleek-title flex items-center gap-2">
          <Wallet className="w-5.5 h-5.5 text-emerald-500" />
          Farm Expense & Budget Ledger
        </h2>
        <p className="text-sleek-muted text-xs mt-1.5 leading-relaxed">
          Log labor fees, seed stocks, fertilizers, and mechanical diesel purchases. Gain immediate visual clarity on seasonal production expenditure to plan and maximize final market profit margins.
        </p>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-sleek-border shadow-sm">
          <span className="text-[10px] text-sleek-muted uppercase font-bold tracking-wider block">Total Season Investment</span>
          <span className="text-2xl font-black text-sleek-title mt-1 block">₱{totalSpent.toLocaleString()}</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-sleek-border shadow-sm">
          <span className="text-[10px] text-sleek-muted uppercase font-bold tracking-wider block">Fertilizer Inputs Cost</span>
          <span className="text-2xl font-black text-sleek-title mt-1 block">
            ₱{(categoryTotals["fertilizer"] || 0).toLocaleString()}
          </span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-sleek-border shadow-sm">
          <span className="text-[10px] text-sleek-muted uppercase font-bold tracking-wider block">Manual Labor Cost</span>
          <span className="text-2xl font-black text-sleek-title mt-1 block">
            ₱{(categoryTotals["labor"] || 0).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Input Form */}
        <div className="bg-white p-6 rounded-2xl border border-sleek-border shadow-sm h-fit">
          <h3 className="font-bold text-sleek-title text-sm mb-4 border-b border-sleek-border pb-2 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-emerald-500" />
            Add Farm Expense
          </h3>
          <form onSubmit={handleAddExpense} className="space-y-4">
            
            <div>
              <label className="block text-xs font-semibold text-sleek-muted uppercase tracking-wider mb-1.5">Category</label>
              <select 
                value={form.category}
                onChange={(e: any) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                <option value="seeds">Seeds / Saplings</option>
                <option value="fertilizer">Fertilizers / Nutrients</option>
                <option value="labor">Labor / Wage Fees</option>
                <option value="fuel">Fuel / Gas for Pump</option>
                <option value="equipment">Equipment Lease/Parts</option>
                <option value="irrigation">Water/Irrigation Utilities</option>
                <option value="pesticides">Pesticides / Biological Spray</option>
                <option value="other">Other Unclassified Expenses</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-sleek-muted uppercase tracking-wider mb-1.5">Description</label>
              <input 
                type="text" 
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                placeholder="e.g. 5 bags of high-yield hybrid Palay seeds"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-sleek-muted uppercase tracking-wider mb-1.5">Amount (PHP ₱)</label>
                <input 
                  type="number" 
                  min="1"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                  className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sleek-muted uppercase tracking-wider mb-1.5">Crop Cycle</label>
                <input 
                  type="text" 
                  value={form.cropCycle}
                  onChange={(e) => setForm({ ...form, cropCycle: e.target.value })}
                  className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  placeholder="e.g. Wet Season Rice 2026"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Save Record
            </button>
          </form>
        </div>

        {/* Charting & Spreadsheet Grid */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Chart visualizers */}
          {expenses.length > 0 ? (
            <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm">
              <h3 className="font-bold text-sleek-title text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <TrendingUp className="w-4.5 h-4.5 text-emerald-500" />
                Capital Allocation Breakdown
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-1.5">
                  {pieData.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-1.5 text-sleek-muted">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                        <span className="capitalize">{entry.name.toLowerCase()}</span>
                      </div>
                      <span className="text-sleek-title font-bold">₱{entry.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {/* Ledger Lists */}
          <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm">
            <h3 className="font-bold text-sleek-title text-xs uppercase tracking-wider mb-3 border-b border-sleek-border pb-2">
              Expense Records
            </h3>

            {expenses.length === 0 ? (
              <p className="text-center text-xs text-sleek-muted py-6">No records created.</p>
            ) : (
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                {expenses.map((e) => (
                  <div key={e.id} className="p-3 bg-sleek-bg border border-sleek-border rounded-xl flex items-center justify-between relative group">
                    <div className="space-y-1 pr-8">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-sleek-title">{e.description}</span>
                        <span className="text-[9px] font-extrabold text-sleek-muted bg-white/60 border border-sleek-border px-1.5 py-0.5 rounded-md uppercase">
                          {e.category}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-sleek-muted font-bold">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        <span>{e.date}</span>
                        {e.cropCycle && (
                          <>
                            <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                            <span>{e.cropCycle}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-black text-sleek-title">₱{e.amount.toLocaleString()}</span>
                      <button 
                        onClick={() => handleDeleteExpense(e.id)}
                        className="p-1 text-sleek-muted hover:text-red-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
