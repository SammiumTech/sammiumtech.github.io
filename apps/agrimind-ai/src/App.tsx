import React, { useState, useEffect } from "react";
import { 
  Sprout, CloudSun, Bug, Droplets, TrendingUp, Wallet, 
  Pipette, Radio, Menu, X, Landmark, RefreshCw, Calendar, Clock, MapPin,
  Sparkles, Users, Heart, Leaf, Map, Wifi, WifiOff, Sun, ChevronDown, UserCheck, Shield,
  Download, FolderGit2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { WeatherData, MarketPrice, SensorData } from "./types";
import DashboardOverview from "./components/DashboardOverview";
import CropRecommendations from "./components/CropRecommendations";
import MarketPrices from "./components/MarketPrices";

// Ecosystem Modular Components
import DigitalTwin from "./components/DigitalTwin";
import SentinelAdvisor from "./components/SentinelAdvisor";
import DiagnosticsLab from "./components/DiagnosticsLab";
import ResourcePlanners from "./components/ResourcePlanners";
import FinanceSimulator from "./components/FinanceSimulator";
import CommunityMarket from "./components/CommunityMarket";
import LivestockManager from "./components/LivestockManager";
import SustainabilityDashboard from "./components/SustainabilityDashboard";
import LeafCursor from "./components/LeafCursor";
import AmbientWallpaper from "./components/AmbientWallpaper";
import AiLoadingScreen from "./components/AiLoadingScreen";
import BrandTransition from "./components/BrandTransition";
import SecurityTrustCenter from "./components/SecurityTrustCenter";
import PortfolioProjects from "./components/PortfolioProjects";

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isTabTransitioning, setIsTabTransitioning] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [calibrated, setCalibrated] = useState(false);

  // New Adaptive & Resilient UI States
  const [userRole, setUserRole] = useState<"farmer" | "staff" | "admin">("farmer");
  const [outdoorMode, setOutdoorMode] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const changeTab = (tabId: string) => {
    if (tabId === activeTab) return;
    setIsTabTransitioning(true);
    
    // Switch active tab content exactly as the pulse wave peaks
    setTimeout(() => {
      setActiveTab(tabId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 380);

    // Complete the overlay transition sequence
    setTimeout(() => {
      setIsTabTransitioning(false);
    }, 850);
  };

  // Environmental states
  const [weatherMode, setWeatherMode] = useState<"sunny" | "rainy" | "windy" | "monsoon">("sunny");
  const [isNight, setIsNight] = useState(false);

  // Hyperlocal Location Awareness states
  const [municipality, setMunicipality] = useState("Botolan");
  const [barangay, setBarangay] = useState("Poblacion");
  const [gpsCoords, setGpsCoords] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });

  // Core full-stack state
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [loadingPrices, setLoadingPrices] = useState(false);

  // Sensor Simulation state
  const [soilMoisture, setSoilMoisture] = useState(42);
  const [soilTemp, setSoilTemp] = useState(27.8);
  const [sensorHistory, setSensorHistory] = useState<SensorData[]>([]);

  // Fetch Weather Forecast & Advisory with active location variables
  const fetchWeather = async (m = municipality, b = barangay, coords = gpsCoords) => {
    setLoadingWeather(true);
    try {
      let url = `/api/weather?municipality=${encodeURIComponent(m)}&barangay=${encodeURIComponent(b)}`;
      if (coords.lat !== null && coords.lng !== null) {
        url += `&lat=${coords.lat}&lng=${coords.lng}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.error("Failed to fetch weather forecast:", err);
    } finally {
      setLoadingWeather(false);
    }
  };

  // Fetch Crop Market Price Index
  const fetchMarketPrices = async () => {
    setLoadingPrices(true);
    try {
      const res = await fetch("/api/market-prices");
      const data = await res.json();
      setMarketPrices(data);
    } catch (err) {
      console.error("Failed to fetch market prices:", err);
    } finally {
      setLoadingPrices(false);
    }
  };

  // Fetch weather automatically when location changes, and on boot
  useEffect(() => {
    fetchWeather(municipality, barangay, gpsCoords);
  }, [municipality, barangay, gpsCoords]);

  // Fetch market price data on boot
  useEffect(() => {
    fetchMarketPrices();
  }, []);

  // Download ZIP using Blob fetch to handle iframe/sandbox environments smoothly
  const [isDownloading, setIsDownloading] = useState(false);
  const handleDownloadZip = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const response = await fetch("/api/download-zip");
      if (!response.ok) throw new Error("Download endpoint returned non-OK status");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "agrimind-project.zip";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("ZIP Download Failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Sensor Simulation loop (adds realistic organic fluctuation over time)
  useEffect(() => {
    const interval = setInterval(() => {
      setSoilMoisture((prev) => {
        const delta = (Math.random() - 0.5) * 1.5;
        const next = Math.max(10, Math.min(95, prev + delta));
        return Math.round(next * 10) / 10;
      });

      setSoilTemp((prev) => {
        const delta = (Math.random() - 0.5) * 0.4;
        const next = Math.max(15, Math.min(45, prev + delta));
        return Math.round(next * 10) / 10;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Sync simulated values with historical logger
  useEffect(() => {
    const newReading: SensorData = {
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      moisture: soilMoisture,
      temperature: soilTemp,
      status: soilMoisture < 30 ? 'dry' : soilMoisture > 75 ? 'wet' : 'optimal'
    };

    setSensorHistory((prev) => {
      const updated = [...prev, newReading];
      if (updated.length > 15) updated.shift(); // keep last 15 ticks
      return updated;
    });
  }, [soilMoisture, soilTemp]);

  const [currentTime, setCurrentTime] = useState("");
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: "overview", label: "Dashboard Overview", icon: Radio },
    { id: "digital_twin", label: "AI Farm Digital Twin", icon: Sprout },
    { id: "sentinel_advisor", label: "Sentinel AI Advisor", icon: Sparkles },
    { id: "diagnostics", label: "Diagnostics Lab", icon: Bug },
    { id: "planners", label: "Resource Planners", icon: Droplets },
    { id: "finance", label: "AgriProfit & Finance", icon: Wallet },
    { id: "community", label: "Community & Market", icon: Users },
    { id: "livestock", label: "Livestock Tracker", icon: Heart },
    { id: "sustainability", label: "Sustainability & Carbon", icon: Leaf },
    { id: "portfolio_projects", label: "Developer Projects", icon: FolderGit2 },
    { id: "security_trust", label: "Security & Trust Center", icon: Shield },
  ];

  if (!calibrated) {
    return <AiLoadingScreen onComplete={() => setCalibrated(true)} />;
  }

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-1000 ${isNight ? "bg-slate-950 text-slate-100 selection:bg-cyan-900 selection:text-cyan-100" : "bg-sleek-bg text-sleek-text selection:bg-mint-100 selection:text-forest-900"}`}>
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-forest-900 border-r border-forest-800 shrink-0 sticky top-0 h-screen justify-between p-6">
        <div className="space-y-6">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-2.5 px-1">
            <motion.div 
              className="p-2 bg-emerald-500 text-white rounded-xl shadow-inner relative"
              animate={{
                rotate: [0, 4, -4, 0],
                scale: [1, 1.05, 0.98, 1],
                boxShadow: [
                  "0 0 0px rgba(16, 185, 129, 0)",
                  "0 0 14px rgba(16, 185, 129, 0.6)",
                  "0 0 14px rgba(34, 211, 238, 0.6)",
                  "0 0 0px rgba(16, 185, 129, 0)"
                ]
              }}
              transition={{
                rotate: { repeat: Infinity, duration: 8, ease: "easeInOut" },
                scale: { repeat: Infinity, duration: 8, ease: "easeInOut" },
                boxShadow: { repeat: Infinity, duration: 8, ease: "easeInOut" }
              }}
            >
              <Sprout className="w-5 h-5 animate-pulse" />
            </motion.div>
            <div>
              <span className="text-[10px] tracking-widest uppercase font-black text-mint-400 block leading-none">Botolan, PH</span>
              <h1 className="text-sm font-extrabold text-white mt-1 tracking-tight">Sentinel AgriMind</h1>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => changeTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive 
                      ? "bg-emerald-500 text-white shadow-sm" 
                      : "text-mint-50/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dynamic Location & Local Time indicator */}
        <div className="border-t border-white/10 pt-4 space-y-2.5">
          <div className="flex items-center gap-2 text-mint-50/70 text-xs font-bold px-1">
            <Clock className="w-4 h-4 text-mint-400 shrink-0" />
            <span>Local Time: {currentTime || "Loading..."}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-semibold text-mint-50/80 bg-forest-800/50 p-2.5 rounded-xl border border-white/5">
            <MapPin className="w-3.5 h-3.5 text-mint-400 shrink-0" />
            <span>Botolan Municipal Office • Zambales</span>
          </div>
          <div className="pt-2">
            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-700 text-white transition-all cursor-pointer shadow-sm shadow-emerald-500/10 uppercase text-center disabled:cursor-not-allowed"
            >
              <Download className={`w-4 h-4 text-white shrink-0 ${isDownloading ? 'animate-bounce' : ''}`} />
              {isDownloading ? "Downloading..." : "Download .ZIP"}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header - Mobile view trigger, Adaptive Role Selector, Outdoor toggle, Connectivity toggle */}
        <header className={`py-3.5 px-4 md:px-6 sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 transition-all duration-500 ${
          outdoorMode 
            ? "bg-yellow-400 border-b-4 border-black text-black" 
            : isNight 
            ? "bg-slate-900/95 border-b border-white/10 text-white backdrop-blur-md" 
            : "bg-white border-b border-sleek-border text-sleek-text"
        }`}>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`lg:hidden p-2 rounded-xl border ${
                outdoorMode
                  ? "border-black text-black hover:bg-black/10"
                  : isNight 
                  ? "text-slate-200 border-white/10 hover:bg-white/5" 
                  : "text-sleek-text border-sleek-border hover:bg-sleek-bg"
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2 lg:hidden">
              <Sprout className={`w-5 h-5 ${outdoorMode ? "text-black animate-bounce" : "text-emerald-500"}`} />
              <span className={`font-black text-sm uppercase tracking-tight ${outdoorMode ? "text-black" : isNight ? "text-white" : "text-forest-900"}`}>Sentinel AgriMind</span>
            </div>

            {/* Desktop breadcrumb & Mode Indicators */}
            <div className="hidden lg:flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider ${
                outdoorMode 
                  ? "bg-black text-yellow-400" 
                  : "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-400"
              }`}>
                Command Console
              </span>
              <span className="text-xs font-extrabold opacity-70">/ Botolan Municipal Hub</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 ml-auto lg:ml-0">
            {/* A. User Role Segments */}
            <div className={`hidden sm:inline-flex p-1 rounded-xl border items-center gap-0.5 ${
              outdoorMode 
                ? "bg-white border-black" 
                : "bg-slate-50 dark:bg-slate-950 border-slate-200/50 dark:border-white/5"
            }`}>
              {(["farmer", "staff", "admin"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setUserRole(role)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-1 cursor-pointer ${
                    userRole === role
                      ? outdoorMode
                        ? "bg-black text-yellow-400"
                        : "bg-emerald-500 text-white shadow-sm"
                      : outdoorMode
                      ? "text-slate-600 hover:text-black"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  <span>{role === "farmer" ? "🌾 Farmer" : role === "staff" ? "🏢 Staff" : "💼 Admin"}</span>
                </button>
              ))}
            </div>

            {/* B. Outdoor Mode Toggle */}
            <button
              onClick={() => setOutdoorMode(!outdoorMode)}
              className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center gap-1.5 cursor-pointer text-[10px] font-black uppercase ${
                outdoorMode
                  ? "bg-black border-black text-yellow-400 shadow-[0_0_12px_rgba(0,0,0,0.15)] animate-pulse"
                  : isNight
                  ? "border-white/10 hover:bg-white/5 text-amber-400"
                  : "border-slate-200 hover:bg-slate-50 text-slate-700"
              }`}
              title="Toggle Outdoor High Contrast Mode"
            >
              <Sun className={`w-4 h-4 ${outdoorMode ? "text-yellow-400" : "text-amber-500"}`} />
              <span className="hidden md:inline">{outdoorMode ? "Outdoor: On" : "Outdoor Mode"}</span>
            </button>

            {/* C. Connectivity Toggle */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center gap-1.5 cursor-pointer text-[10px] font-black uppercase ${
                outdoorMode
                  ? isOnline
                    ? "bg-white border-black text-emerald-800"
                    : "bg-black border-black text-amber-400"
                  : isOnline
                  ? isNight
                    ? "border-white/10 hover:bg-white/5 text-emerald-400"
                    : "border-slate-200 hover:bg-slate-50 text-emerald-600"
                  : isNight
                  ? "border-rose-900/30 bg-rose-950/20 text-rose-400"
                  : "border-rose-100 bg-rose-50 text-rose-600"
              }`}
              title={isOnline ? "Simulate Offline Mode" : "Simulate Online Mode"}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4 text-emerald-500 animate-pulse" />
                  <span className="hidden md:inline">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-rose-500" />
                  <span className="hidden md:inline">Offline (Cached)</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Content canvas with route animation */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.24, ease: "easeInOut" }}
            >
              {activeTab === "overview" && (
                <DashboardOverview
                  weather={weather}
                  loadingWeather={loadingWeather}
                  onRefreshWeather={() => fetchWeather(municipality, barangay, gpsCoords)}
                  marketPrices={marketPrices}
                  loadingPrices={loadingPrices}
                  onSelectTab={(tab) => {
                    changeTab(tab);
                  }}
                  sensorData={sensorHistory}
                  simulationEnabled={true}
                  setSimulationEnabled={() => {}}
                  soilMoisture={soilMoisture}
                  setSoilMoisture={setSoilMoisture}
                  soilTemp={soilTemp}
                  setSoilTemp={setSoilTemp}
                  weatherMode={weatherMode}
                  setWeatherMode={setWeatherMode}
                  isNight={isNight}
                  setIsNight={setIsNight}
                  municipality={municipality}
                  setMunicipality={setMunicipality}
                  barangay={barangay}
                  setBarangay={setBarangay}
                  gpsCoords={gpsCoords}
                  setGpsCoords={setGpsCoords}
                  userRole={userRole}
                  setUserRole={setUserRole}
                  outdoorMode={outdoorMode}
                  setOutdoorMode={setOutdoorMode}
                  isOnline={isOnline}
                  setIsOnline={setIsOnline}
                />
              )}

              {activeTab === "digital_twin" && <DigitalTwin />}

              {activeTab === "sentinel_advisor" && <SentinelAdvisor />}

              {activeTab === "diagnostics" && <DiagnosticsLab />}

              {activeTab === "planners" && <ResourcePlanners />}

              {activeTab === "finance" && <FinanceSimulator />}

              {activeTab === "community" && <CommunityMarket />}

              {activeTab === "livestock" && <LivestockManager />}

              {activeTab === "sustainability" && <SustainabilityDashboard />}

              {activeTab === "portfolio_projects" && <PortfolioProjects />}

              {activeTab === "security_trust" && <SecurityTrustCenter />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Capstone Engineering Footer: Transparency & Sourcing */}
        <footer className={`py-8 px-6 md:px-8 mt-auto border-t transition-all duration-1000 ${isNight ? "bg-slate-950/80 border-white/5 text-slate-400" : "bg-stone-50/60 border-sleek-border text-sleek-muted"}`}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Branding & Mission */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-500" />
                <span className={`font-black text-xs uppercase tracking-wider ${isNight ? "text-white" : "text-stone-900"}`}>
                  Sammium Research Labs
                </span>
              </div>
              <p className="text-[11px] leading-relaxed font-medium">
                Lead with Compassion. Code with Purpose.
              </p>
              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block mb-1">
                  Three Pillars. One Purpose.
                </span>
                <div className="flex items-center gap-3 text-[10px] font-black">
                  <span className="hover:text-emerald-500 transition-colors">INNOVATION</span>
                  <span className="h-2 w-px bg-stone-700"></span>
                  <span className="hover:text-emerald-500 transition-colors">SERVICE</span>
                  <span className="h-2 w-px bg-stone-700"></span>
                  <span className="hover:text-emerald-500 transition-colors">INTEGRITY</span>
                </div>
              </div>
            </div>

            {/* Capstone Transparency / Sourcing */}
            <div className="space-y-2 md:col-span-2">
              <span className={`text-[10px] font-black tracking-widest uppercase block ${isNight ? "text-slate-300" : "text-stone-700"}`}>
                Capstone Project Platform Transparency Logs
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px]">
                <div className="space-y-1">
                  <div>
                    <span className="font-extrabold text-emerald-500 mr-1.5">Weather:</span>
                    <span>PAGASA / NOAA Satellite telemetry ingestion feeds</span>
                  </div>
                  <div>
                    <span className="font-extrabold text-emerald-500 mr-1.5">Agricultural Guidance:</span>
                    <span>Zambales Agricultural Extension Advisory Service (Local KB)</span>
                  </div>
                  <div>
                    <span className="font-extrabold text-emerald-500 mr-1.5">Geospatial Mapping:</span>
                    <span>OpenStreetMap / Leaflet Engine (Slippy Tiles)</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div>
                    <span className="font-extrabold text-emerald-500 mr-1.5">Intelligence Engine:</span>
                    <span>Sentinel AgriMind AI Model Core (Gemini 2.0 Ingest)</span>
                  </div>
                  <div>
                    <span className="font-extrabold text-emerald-500 mr-1.5">Focus Municipality:</span>
                    <span>Botolan, Zambales Regional Twin Command Hub</span>
                  </div>
                  <div className="text-[9px] text-stone-500 pt-1">
                    Compiled for academic capstone defense • Registered under Sammium AgriMind Systems © 2026.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </footer>
      </div>

      {/* Drawer Menu - Mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-50 lg:hidden"
            />

            {/* Sidebar drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-72 bg-forest-900 border-r border-forest-800 z-50 p-6 flex flex-col justify-between shadow-xl lg:hidden text-mint-50"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-500 text-white rounded-xl">
                      <Sprout className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] tracking-widest uppercase font-black text-mint-400 block">Botolan, PH</span>
                      <h1 className="text-xs font-black text-white">Sentinel AgriMind</h1>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-mint-50/70 hover:bg-white/5 rounded-lg border border-white/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile Role Switcher in Drawer Menu */}
                <div className="bg-forest-950/60 border border-white/5 p-3 rounded-2xl space-y-2 mb-4">
                  <span className="text-[9px] font-black uppercase text-mint-400 tracking-wider flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" /> Select Active Role:
                  </span>
                  <div className="grid grid-cols-3 gap-1">
                    {(["farmer", "staff", "admin"] as const).map((role) => (
                      <button
                        key={role}
                        onClick={() => {
                          setUserRole(role);
                          setMobileMenuOpen(false);
                        }}
                        className={`py-1.5 rounded-lg text-[9px] font-black uppercase text-center transition-all cursor-pointer ${
                          userRole === role
                            ? "bg-emerald-500 text-white shadow-sm"
                            : "bg-white/5 text-mint-100/60 hover:text-white"
                        }`}
                      >
                        {role === "farmer" ? "Farmer" : role === "staff" ? "Staff" : "Admin"}
                      </button>
                    ))}
                  </div>
                </div>

                <nav className="space-y-1.5">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          changeTab(tab.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isActive 
                            ? "bg-emerald-500 text-white shadow-sm" 
                            : "text-mint-50/70 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2.5">
                <div className="flex items-center gap-2 text-mint-50/70 text-xs font-bold">
                  <Clock className="w-4 h-4 text-mint-400" />
                  <span>Local Time: {currentTime}</span>
                </div>
                <div className="text-[10px] font-semibold text-mint-50/80 bg-forest-800/50 p-3 rounded-xl border border-white/5">
                  Botolan Municipal Office • Zambales
                </div>
                <div className="pt-2">
                  <button
                    onClick={handleDownloadZip}
                    disabled={isDownloading}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-700 text-white transition-all cursor-pointer shadow-sm shadow-emerald-500/10 uppercase text-center disabled:cursor-not-allowed"
                  >
                    <Download className={`w-4 h-4 text-white shrink-0 ${isDownloading ? 'animate-bounce' : ''}`} />
                    {isDownloading ? "Downloading..." : "Download .ZIP"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <LeafCursor />
      <AmbientWallpaper weatherMode={weatherMode} isNight={isNight} />
      <BrandTransition isTransitioning={isTabTransitioning} />
    </div>
  );
}
