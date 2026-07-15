import React, { useState, useEffect } from "react";
import { 
  Plus, Trash2, Calendar, TrendingUp, Sparkles, AlertCircle, 
  HelpCircle, DollarSign, Wallet, ArrowUpRight, Scale, Info, Play
} from "lucide-react";
import ExpenseTracker from "./ExpenseTracker";

interface SimulationResult {
  revenueEstimate: number;
  costEstimate: number;
  netProfitEstimate: number;
  breakEvenPrice: number;
  riskRating: string;
  advisory: string[];
}

export default function FinanceSimulator() {
  const [activeSubTab, setActiveSubTab] = useState<"simulator" | "ledger">("simulator");

  // Simulator Inputs
  const [cropType, setCropType] = useState("rice");
  const [hectares, setHectares] = useState<number>(2.5);
  const [techLevel, setTechLevel] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);

  // Financial Ledger States
  const [incomes, setIncomes] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [incomeForm, setIncomeForm] = useState({
    source: "Sold 14 Tons Rice Palay",
    amount: 280000,
    cropCycle: "2026 Wet Season"
  });
  const [loanForm, setLoanForm] = useState({
    lender: "LandBank Botolan Branch",
    principal: 50000,
    interestRate: 6,
    dueDate: "2027-02-15"
  });

  useEffect(() => {
    // Load local storage for incomes and loans
    const savedIncomes = localStorage.getItem("botolan_farm_incomes");
    const savedLoans = localStorage.getItem("botolan_farm_loans");

    if (savedIncomes) setIncomes(JSON.parse(savedIncomes));
    else {
      const initialInc = [
        { id: "1", date: "2026-04-28", source: "Sold 8.2 Tons Carabao Mangoes", amount: 164000, cropCycle: "2026 Mango Harvest" }
      ];
      setIncomes(initialInc);
      localStorage.setItem("botolan_farm_incomes", JSON.stringify(initialInc));
    }

    if (savedLoans) setLoans(JSON.parse(savedLoans));
    else {
      const initialLoans = [
        { id: "1", lender: "LandBank Botolan Branch", principal: 50000, interestRate: 6, dueDate: "2027-02-15", paid: false }
      ];
      setLoans(initialLoans);
      localStorage.setItem("botolan_farm_loans", JSON.stringify(initialLoans));
    }
  }, []);

  const handleSimulate = async () => {
    setLoading(true);
    setError(null);
    setSimResult(null);

    try {
      const response = await fetch("/api/ai-simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cropType, hectares, techLevel })
      });

      if (!response.ok) throw new Error("Simulator backend failed.");
      const data = await response.json();
      setSimResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to calculate simulation scenario.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    const newInc = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      source: incomeForm.source,
      amount: Number(incomeForm.amount),
      cropCycle: incomeForm.cropCycle
    };
    const updated = [newInc, ...incomes];
    setIncomes(updated);
    localStorage.setItem("botolan_farm_incomes", JSON.stringify(updated));
    setIncomeForm({ source: "", amount: 50000, cropCycle: "" });
  };

  const handleDeleteIncome = (id: string) => {
    const updated = incomes.filter(i => i.id !== id);
    setIncomes(updated);
    localStorage.setItem("botolan_farm_incomes", JSON.stringify(updated));
  };

  const handleAddLoan = (e: React.FormEvent) => {
    e.preventDefault();
    const newLoan = {
      id: Date.now().toString(),
      lender: loanForm.lender,
      principal: Number(loanForm.principal),
      interestRate: Number(loanForm.interestRate),
      dueDate: loanForm.dueDate,
      paid: false
    };
    const updated = [newLoan, ...loans];
    setLoans(updated);
    localStorage.setItem("botolan_farm_loans", JSON.stringify(updated));
    setLoanForm({ lender: "LandBank Botolan Branch", principal: 30000, interestRate: 5, dueDate: "" });
  };

  const toggleLoanPaid = (id: string) => {
    const updated = loans.map(l => l.id === id ? { ...l, paid: !l.paid } : l);
    setLoans(updated);
    localStorage.setItem("botolan_farm_loans", JSON.stringify(updated));
  };

  const handleDeleteLoan = (id: string) => {
    const updated = loans.filter(l => l.id !== id);
    setLoans(updated);
    localStorage.setItem("botolan_farm_loans", JSON.stringify(updated));
  };

  const totalRevenue = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalLoans = loans.reduce((sum, l) => sum + (l.paid ? 0 : l.principal), 0);

  return (
    <div className="space-y-6">
      
      {/* Tab select */}
      <div className="flex bg-white p-1 rounded-xl border border-sleek-border w-fit shadow-xs">
        <button
          onClick={() => setActiveSubTab("simulator")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "simulator"
              ? "bg-emerald-500 text-white shadow-xs"
              : "text-sleek-text hover:bg-sleek-bg"
          }`}
        >
          <Scale className="w-4 h-4" />
          AI Profit & Scenario Simulator
        </button>
        <button
          onClick={() => setActiveSubTab("ledger")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "ledger"
              ? "bg-emerald-500 text-white shadow-xs"
              : "text-sleek-text hover:bg-sleek-bg"
          }`}
        >
          <Wallet className="w-4 h-4" />
          Farm Financial Intelligence Ledger
        </button>
      </div>

      {activeSubTab === "simulator" ? (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-sleek-border shadow-sm">
            <h2 className="text-xl font-bold text-sleek-title flex items-center gap-2">
              <Sparkles className="w-5.5 h-5.5 text-amber-500" />
              AI Profit & Scenario Simulator
            </h2>
            <p className="text-sleek-muted text-xs mt-1.5 leading-relaxed">
              Model cultivation scenarios before planting a single seed. Change crop types, plot sizes, and technology level (organic vs chemical vs high-tech precision) to see expected revenues, break-even price tags, and agronomic risk warnings.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Input parameters */}
            <div className="bg-white p-6 rounded-2xl border border-sleek-border shadow-sm h-fit space-y-4">
              <h3 className="font-bold text-sleek-title text-xs uppercase tracking-wider mb-2 border-b border-sleek-border pb-2 flex items-center gap-1.5">
                Simulation settings
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-sleek-muted uppercase tracking-wider mb-1.5">Target Crop</label>
                  <select
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-3 py-2 text-xs font-bold focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="rice">Rice (Wet Season Palay)</option>
                    <option value="corn">Yellow Field Corn</option>
                    <option value="mango">Carabao Mango Orchard</option>
                    <option value="vegetables">Mixed High-Value Vegetables (Ampalaya/Tomato)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sleek-muted uppercase tracking-wider mb-1.5">Cultivated Area (Hectares)</label>
                  <input 
                    type="number"
                    min="0.1"
                    max="100"
                    step="0.1"
                    value={hectares}
                    onChange={(e) => setHectares(Number(e.target.value))}
                    className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-3 py-2 text-xs font-black focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sleek-muted uppercase tracking-wider mb-1.5">Agrotechnology Level</label>
                  <select
                    value={techLevel}
                    onChange={(e) => setTechLevel(e.target.value)}
                    className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-3 py-2 text-xs font-bold focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="low">Traditional / Low Input (Manure, Hand-tooling)</option>
                    <option value="medium">Standard / Fertilizer-Pesticide Split Integration</option>
                    <option value="high">Precision AI Twin + IoT Drip Sensors + Drone Sprays</option>
                  </select>
                </div>

                <button
                  onClick={handleSimulate}
                  disabled={loading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Play className="w-4 h-4 fill-current" />
                  {loading ? "Modeling crop scenario..." : "Run Economic Simulation"}
                </button>
              </div>
            </div>

            {/* Results pane */}
            <div className="lg:col-span-2 space-y-4">
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {loading ? (
                <div className="bg-white rounded-2xl border border-sleek-border p-16 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-amber-100 rounded-full"></div>
                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sleek-title text-sm">Consulting Agronomic Profit models</h4>
                    <p className="text-sleek-muted text-xs mt-1">Modeling capital investments, fertilizer costs, labor, and weather depreciation coefficients...</p>
                  </div>
                </div>
              ) : simResult ? (
                <div className="bg-white p-6 rounded-2xl border border-sleek-border shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-sleek-border pb-4">
                    <div>
                      <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Botolan AI Ag-Economic model</span>
                      <h3 className="text-base font-black text-sleek-title mt-0.5">Cultivation Scenario Projections</h3>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase border ${
                      simResult.riskRating.toLowerCase() === "low" ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                      simResult.riskRating.toLowerCase() === "moderate" ? "bg-amber-50 text-amber-800 border-amber-200" :
                      "bg-rose-50 text-rose-800 border-rose-200"
                    }`}>
                      Risk: {simResult.riskRating}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-sleek-bg p-4 border border-sleek-border rounded-xl">
                      <span className="text-[9px] font-black text-sleek-muted uppercase block">Est. Revenue</span>
                      <span className="text-base font-black text-emerald-700 block mt-1">₱{simResult.revenueEstimate.toLocaleString()}</span>
                      <span className="text-[9px] text-sleek-muted block mt-0.5">Based on local miller rates</span>
                    </div>

                    <div className="bg-sleek-bg p-4 border border-sleek-border rounded-xl">
                      <span className="text-[9px] font-black text-sleek-muted uppercase block">Est. cost</span>
                      <span className="text-base font-black text-rose-700 block mt-1">₱{simResult.costEstimate.toLocaleString()}</span>
                      <span className="text-[9px] text-sleek-muted block mt-0.5">Seeds, fertilizer & labor</span>
                    </div>

                    <div className="bg-sleek-bg p-4 border border-sleek-border rounded-xl">
                      <span className="text-[9px] font-black text-sleek-muted uppercase block">Projected Profit</span>
                      <span className="text-lg font-black text-sleek-title block mt-1">₱{simResult.netProfitEstimate.toLocaleString()}</span>
                      <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">+{Math.round((simResult.netProfitEstimate / simResult.costEstimate) * 100)}% ROI</span>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-emerald-800 font-black uppercase tracking-wider block">Target Break-Even Market Price</span>
                      <span className="text-xs font-semibold text-sleek-muted">You will recoup all costs if selling price exceeds:</span>
                    </div>
                    <span className="text-lg font-black text-emerald-900 shrink-0">₱{simResult.breakEvenPrice}/kg</span>
                  </div>

                  {/* Advisory buls */}
                  <div className="border-t border-sleek-border pt-4">
                    <h4 className="text-xs font-black text-sleek-title uppercase tracking-wider mb-2.5">AI Strategic Agri-Recommendations</h4>
                    <ul className="space-y-2">
                      {simResult.advisory.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-sleek-muted font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-sleek-border rounded-2xl p-16 text-center text-sleek-muted flex flex-col items-center justify-center space-y-2.5 shadow-sm">
                  <Scale className="w-10 h-10 text-stone-300 stroke-1" />
                  <p className="text-xs font-bold text-sleek-title">Awaiting Scenario Parameters</p>
                  <p className="text-[11px] text-sleek-muted max-w-sm">Configure cultivated area and agrotechnology levels on the left to compute predictive investment curves.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      ) : (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm text-center">
              <span className="text-[9px] text-sleek-muted font-black uppercase tracking-wider">Total Season Income</span>
              <span className="text-xl font-black text-emerald-600 block mt-1">₱{totalRevenue.toLocaleString()}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm text-center">
              <span className="text-[9px] text-sleek-muted font-black uppercase tracking-wider">Outstanding Ag-Loans</span>
              <span className="text-xl font-black text-rose-600 block mt-1">₱{totalLoans.toLocaleString()}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm text-center">
              <span className="text-[9px] text-sleek-muted font-black uppercase tracking-wider">Operational Health Index</span>
              <span className="text-xl font-black text-sleek-title block mt-1">Excellent</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Income logger */}
            <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm space-y-4">
              <h3 className="font-bold text-xs text-sleek-title uppercase tracking-wider border-b border-sleek-border pb-2">
                Log Harvest / Crop Sales
              </h3>

              <form onSubmit={handleAddIncome} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-sleek-muted uppercase mb-1">Sale Source Description</label>
                    <input 
                      type="text" 
                      value={incomeForm.source}
                      onChange={(e) => setIncomeForm({ ...incomeForm, source: e.target.value })}
                      className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl p-2 text-xs font-semibold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-sleek-muted uppercase mb-1">Revenue amount (₱)</label>
                    <input 
                      type="number" 
                      value={incomeForm.amount}
                      onChange={(e) => setIncomeForm({ ...incomeForm, amount: Number(e.target.value) })}
                      className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl p-2 text-xs font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-sleek-muted uppercase mb-1">Crop Cycle</label>
                    <input 
                      type="text" 
                      value={incomeForm.cropCycle}
                      onChange={(e) => setIncomeForm({ ...incomeForm, cropCycle: e.target.value })}
                      className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl p-2 text-xs font-semibold"
                      placeholder="e.g. 2026 Wet Season"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      Add Income
                    </button>
                  </div>
                </div>
              </form>

              <div className="space-y-2 max-h-[160px] overflow-y-auto">
                {incomes.map((i) => (
                  <div key={i.id} className="p-2.5 bg-sleek-bg border border-sleek-border rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-sleek-title">{i.source}</span>
                      <span className="text-[9px] text-sleek-muted font-bold block">{i.date} • {i.cropCycle}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-emerald-700">+₱{i.amount.toLocaleString()}</span>
                      <button onClick={() => handleDeleteIncome(i.id)} className="text-sleek-muted hover:text-red-500 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Micro Agricultural Loans */}
            <div className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm space-y-4">
              <h3 className="font-bold text-xs text-sleek-title uppercase tracking-wider border-b border-sleek-border pb-2">
                Outstanding Crop Micro-loans
              </h3>

              <form onSubmit={handleAddLoan} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-sleek-muted uppercase mb-1">Lender / Program</label>
                    <input 
                      type="text" 
                      value={loanForm.lender}
                      onChange={(e) => setLoanForm({ ...loanForm, lender: e.target.value })}
                      className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl p-2 text-xs font-semibold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-sleek-muted uppercase mb-1">Principal principal (₱)</label>
                    <input 
                      type="number" 
                      value={loanForm.principal}
                      onChange={(e) => setLoanForm({ ...loanForm, principal: Number(e.target.value) })}
                      className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl p-2 text-xs font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-sleek-muted uppercase mb-1">Interest % (Annual)</label>
                    <input 
                      type="number" 
                      value={loanForm.interestRate}
                      onChange={(e) => setLoanForm({ ...loanForm, interestRate: Number(e.target.value) })}
                      className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl p-2 text-xs font-bold"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      Add Loan
                    </button>
                  </div>
                </div>
              </form>

              <div className="space-y-2 max-h-[160px] overflow-y-auto">
                {loans.map((l) => (
                  <div key={l.id} className="p-2.5 bg-sleek-bg border border-sleek-border rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <span className={`font-bold text-sleek-title ${l.paid ? 'line-through text-sleek-muted' : ''}`}>{l.lender}</span>
                      <span className="text-[9px] text-sleek-muted font-bold block">Rate: {l.interestRate}% • Due: {l.dueDate || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-black ${l.paid ? 'text-sleek-muted' : 'text-rose-700'}`}>
                        ₱{l.principal.toLocaleString()}
                      </span>
                      <button
                        onClick={() => toggleLoanPaid(l.id)}
                        className={`px-2 py-0.5 rounded-md text-[8px] font-bold border cursor-pointer ${
                          l.paid ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-white text-sleek-muted border-sleek-border'
                        }`}
                      >
                        {l.paid ? "Paid" : "Mark Paid"}
                      </button>
                      <button onClick={() => handleDeleteLoan(l.id)} className="text-sleek-muted hover:text-red-500 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <ExpenseTracker />

        </div>
      )}

    </div>
  );
}
