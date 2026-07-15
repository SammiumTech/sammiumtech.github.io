import React, { useState } from "react";
import { TrendingUp, RefreshCw, Search, ArrowUpRight, ArrowDownRight, Info, HelpCircle } from "lucide-react";
import { MarketPrice } from "../types";

interface PriceProps {
  prices: MarketPrice[];
  loading: boolean;
  onRefresh: () => void;
}

export default function MarketPrices({ prices, loading, onRefresh }: PriceProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<'name' | 'price_asc' | 'price_desc'>('name');

  const filteredPrices = prices
    .filter(p => p.cropName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.cropName.localeCompare(b.cropName);
      if (sortBy === 'price_asc') return a.pricePerKg - b.pricePerKg;
      if (sortBy === 'price_desc') return b.pricePerKg - a.pricePerKg;
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-white rounded-2xl border border-sleek-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-sleek-title flex items-center gap-2">
            <TrendingUp className="w-5.5 h-5.5 text-emerald-500" />
            Zambales Farmgate Crop Price Board
          </h2>
          <p className="text-sleek-muted text-xs mt-1.5 leading-relaxed">
            Monitor real-time agricultural commodity prices. Estimates are dynamically scraped using grounded web searches, helping Botolan farmers negotiate fair market pricing with wholesalers.
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Price Feed
        </button>
      </div>

      {/* Grid: Search, Filters & Price Cards */}
      <div className="space-y-4">
        
        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-sleek-border shadow-sm">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input 
              type="text" 
              placeholder="Search local crops..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-sleek-bg text-sleek-title border border-sleek-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold shrink-0"
          >
            <option value="name">Sort by: Name (A-Z)</option>
            <option value="price_desc">Sort by: Price (High-Low)</option>
            <option value="price_asc">Sort by: Price (Low-High)</option>
          </select>
        </div>

        {/* Dynamic Cards Grid */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-sleek-border p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-sm">
            <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-sleek-muted font-semibold">Grounded AI is crawling Central Luzon wholesale agricultural bulletins...</p>
          </div>
        ) : filteredPrices.length === 0 ? (
          <p className="text-center text-xs text-sleek-muted py-12 bg-sleek-bg border border-sleek-border rounded-2xl">
            No crops found matching "{search}".
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrices.map((p, idx) => {
              const diff = p.pricePerKg - p.previousPrice;
              return (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-sleek-border shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-sleek-muted uppercase tracking-wider">{p.grade}</span>
                      <span className="text-[9px] text-sleek-muted font-semibold">Updated: {p.lastUpdated}</span>
                    </div>

                    <h3 className="font-extrabold text-sleek-title text-base mt-1.5">{p.cropName}</h3>
                  </div>

                  <div className="flex items-end justify-between mt-5 border-t border-sleek-border pt-3">
                    <div>
                      <span className="text-[9px] font-bold text-sleek-muted uppercase block">Farmgate Price</span>
                      <span className="text-2xl font-black text-sleek-title">₱{p.pricePerKg} <span className="text-xs text-sleek-muted font-semibold">/ kg</span></span>
                    </div>

                    <div className="text-right">
                      <span className={`inline-flex items-center gap-0.5 text-xs font-black px-2 py-1 rounded-lg ${
                        p.trend === 'up' ? 'text-emerald-700 bg-mint-50 border border-emerald-100' : p.trend === 'down' ? 'text-rose-700 bg-rose-50/50 border border-rose-100' : 'text-stone-600 bg-sleek-bg border border-sleek-border'
                      }`}>
                        {p.trend === 'up' ? (
                          <>
                            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                            +₱{diff}
                          </>
                        ) : p.trend === 'down' ? (
                          <>
                            <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
                            -₱{Math.abs(diff)}
                          </>
                        ) : (
                          "Stable"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Grounding Attribution Info tip */}
        <div className="p-4 bg-sleek-bg border border-sleek-border rounded-2xl flex items-start gap-2.5">
          <Info className="w-4.5 h-4.5 text-sleek-muted shrink-0 mt-0.5" />
          <p className="text-[11px] text-sleek-muted leading-relaxed font-semibold">
            Note: Farmgate values can fluctuate based on transport costs, municipal trading center (bagsakan) supplies, and weather disruptions. Double-check local agricultural extension offices before closing trade volume deals.
          </p>
        </div>

      </div>
    </div>
  );
}
