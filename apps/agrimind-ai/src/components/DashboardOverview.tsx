import React, { useMemo, useState, useEffect } from "react";
import { 
  Sprout, CloudSun, Bug, Droplets, TrendingUp, Wallet, 
  Pipette, Radio, Thermometer, ArrowUpRight, ArrowDownRight, RefreshCw, MapPin,
  CheckCircle, ArrowRight, AlertTriangle, Calendar, History, TrendingDown, Eye,
  Sun, Moon, Wind, Zap, Sparkles, Cpu, ShieldCheck, Compass,
  Search, Plus, Check, Activity, Database, BookOpen, Info, X, Users,
  Megaphone, Sliders, Network, FileDown, WifiOff
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { WeatherData, MarketPrice, SensorData } from "../types";
import { motion, AnimatePresence } from "motion/react";
import LivingCard from "./LivingCard";
import { BarangayStaffDashboard, AdministratorDashboard } from "./RoleDashboards";
import SoilHealthMap from "./SoilHealthMap";

// Premium AI Typewriter component for Living Intelligence greeting
const Typewriter = ({ text, delay = 35 }: { text: string; delay?: number; key?: string | number }) => {
  const [currentText, setCurrentText] = useState("");
  
  useEffect(() => {
    let index = 0;
    setCurrentText("");
    const interval = setInterval(() => {
      setCurrentText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, delay);
    return () => clearInterval(interval);
  }, [text, delay]);

  return <span className="font-mono">{currentText}</span>;
};

// Premium digit roll odometer for Temperature changes
const RollingOdometer = ({ value }: { value: number | string }) => {
  return (
    <motion.span
      key={value}
      initial={{ y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -8, opacity: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      className="inline-block"
    >
      {value}
    </motion.span>
  );
};

// Premium interactive liquid fill effect for humidity gauge
const LiquidHumidityGauge = ({ percentage }: { percentage: number }) => {
  return (
    <div className="relative w-full bg-blue-950/20 rounded-full h-3.5 overflow-hidden border border-blue-300/30 mt-1.5">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-400 relative"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <motion.div
          className="absolute inset-0 bg-white/20"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "linear",
          }}
          style={{
            skewX: -25,
          }}
        />
      </motion.div>
    </div>
  );
};

// SVG sparkline for visual backdrop in Market trends cards
const Sparkline = ({ trend }: { trend: "up" | "down" | "stable" }) => {
  const points = trend === "up" 
    ? "0,25 15,22 30,12 45,18 60,8 75,10 90,2" 
    : trend === "down"
    ? "0,2 15,8 30,18 45,12 60,22 75,18 90,26"
    : "0,15 15,15 30,16 45,15 60,16 75,15 90,15";
    
  const color = trend === "up" ? "#10b981" : trend === "down" ? "#f43f5e" : "#94a3b8";

  return (
    <svg className="absolute bottom-0 left-0 w-full h-10 opacity-20 pointer-events-none" viewBox="0 0 90 30" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${trend}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.4} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        points={points}
      />
      <polygon
        fill={`url(#grad-${trend})`}
        points={`0,30 ${points} 90,30`}
      />
    </svg>
  );
};

// Premium stock board flip styled MarketCard
const MarketCard = ({ p, idx, onSelectTab }: { p: MarketPrice; idx: number; onSelectTab: (tab: string) => void; key?: string | number }) => {
  const isUp = p.trend === "up";
  const isDown = p.trend === "down";
  
  return (
    <LivingCard
      delay={idx * 0.1}
      className="p-4 bg-white/70 border border-sleek-border rounded-xl relative overflow-hidden flex flex-col justify-between min-h-[105px] cursor-pointer hover:border-emerald-500/30 transition-colors"
      onClick={() => onSelectTab("community")}
    >
      <Sparkline trend={p.trend} />
      
      <div className="relative z-10">
        <span className="text-[9px] uppercase tracking-wider font-extrabold text-sleek-muted block">
          {p.grade}
        </span>
        <span className="font-extrabold text-sleek-title text-sm mt-0.5 block truncate">
          {p.cropName}
        </span>
      </div>

      <div className="flex items-end justify-between mt-2 relative z-10">
        <div className="flex flex-col">
          <span className="text-lg font-black text-sleek-title tracking-tight">
            ₱{p.pricePerKg}/kg
          </span>
        </div>

        <motion.span
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          className={`inline-flex items-center gap-0.5 text-[10px] font-black px-1.5 py-0.5 rounded-md ${
            isUp 
              ? "text-emerald-700 bg-emerald-50 border border-emerald-200" 
              : isDown 
              ? "text-rose-700 bg-rose-50 border border-rose-200" 
              : "text-sleek-text bg-white border border-sleek-border"
          }`}
        >
          {isUp ? (
            <motion.div
              animate={{ y: [1, -2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
            </motion.div>
          ) : isDown ? (
            <motion.div
              animate={{ y: [-1, 2, -1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
            </motion.div>
          ) : null}
          ₱{Math.abs(p.pricePerKg - p.previousPrice)}
        </motion.span>
      </div>
    </LivingCard>
  );
};

interface OverviewProps {
  weather: WeatherData | null;
  loadingWeather: boolean;
  onRefreshWeather: () => void;
  marketPrices: MarketPrice[];
  loadingPrices: boolean;
  onSelectTab: (tab: string) => void;
  sensorData: SensorData[];
  simulationEnabled: boolean;
  setSimulationEnabled: (val: boolean) => void;
  soilMoisture: number;
  setSoilMoisture: (val: number) => void;
  soilTemp: number;
  setSoilTemp: (val: number) => void;
  weatherMode: "sunny" | "rainy" | "windy" | "monsoon";
  setWeatherMode: (val: "sunny" | "rainy" | "windy" | "monsoon") => void;
  isNight: boolean;
  setIsNight: (val: boolean) => void;
  municipality: string;
  setMunicipality: (val: string) => void;
  barangay: string;
  setBarangay: (val: string) => void;
  gpsCoords: { lat: number | null; lng: number | null };
  setGpsCoords: (val: { lat: number | null; lng: number | null }) => void;
  userRole: "farmer" | "staff" | "admin";
  setUserRole: (role: "farmer" | "staff" | "admin") => void;
  outdoorMode: boolean;
  setOutdoorMode: (val: boolean) => void;
  isOnline: boolean;
  setIsOnline: (val: boolean) => void;
}

export default function DashboardOverview({
  weather,
  loadingWeather,
  onRefreshWeather,
  marketPrices,
  loadingPrices,
  onSelectTab,
  sensorData,
  soilMoisture,
  setSoilMoisture,
  soilTemp,
  setSoilTemp,
  weatherMode,
  setWeatherMode,
  isNight,
  setIsNight,
  municipality,
  setMunicipality,
  barangay,
  setBarangay,
  gpsCoords,
  setGpsCoords,
  userRole,
  setUserRole,
  outdoorMode,
  setOutdoorMode,
  isOnline,
  setIsOnline
}: OverviewProps) {
  // 1. Season State for Seasonal Theme Selector
  const [season, setSeason] = useState<"dry" | "rainy" | "planting" | "harvest">("dry");

  // Data Trust Indicator simulated state
  const [weatherSimState, setWeatherSimState] = useState<"verified" | "failed">("verified");
  const [isTrustExpanded, setIsTrustExpanded] = useState(false);

  // --- NEW ADAPTIVE UI: Barangay Staff & Admin State Pools ---
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: "Monsoon Fertilizer Subsidy Distribution", category: "Subsidy", date: "Today 10:15 AM", author: "Poblacion Office", content: "Botolan Barangay Hall will distribute organic nitrogen fertilizer inputs tomorrow from 8:00 AM to 2:00 PM. Please bring your RSBSA registration card." },
    { id: 2, title: "PAGASA Low Pressure Wind Advisory", category: "Weather", date: "Yesterday 4:30 PM", author: "PAGASA", content: "Strong wind velocities are expected to sweep southern sectors. Secure high-canopy banana crops and clear drainage canals." }
  ]);
  const [newAnnTitle, setNewAnnTitle] = useState("");
  const [newAnnCategory, setNewAnnCategory] = useState("Subsidy");
  const [newAnnContent, setNewAnnContent] = useState("");

  const [farmersList, setFarmersList] = useState([
    { id: 1, name: "Mang Juan de la Cruz", barangay: "Poblacion", area: "1.5 Hectares", crop: "Palay Rice (NSIC Rc222)", registered: "March 2026" },
    { id: 2, name: "Aling Nena Santos", barangay: "Batonlapoc", area: "2.3 Hectares", crop: "Saba Banana (Cavendish)", registered: "April 2026" },
    { id: 3, name: "Mang Tomas Magsaysay", barangay: "Villar", area: "0.8 Hectares", crop: "Sweet Corn (Mais)", registered: "June 2026" }
  ]);
  const [newFarmerName, setNewFarmerName] = useState("");
  const [newFarmerBarangay, setNewFarmerBarangay] = useState("Poblacion");
  const [newFarmerArea, setNewFarmerArea] = useState("");
  const [newFarmerCrop, setNewFarmerCrop] = useState("Palay Rice (NSIC Rc222)");

  const [nodeClusters, setNodeClusters] = useState([
    { id: "NODE-POB-01", location: "Poblacion Barangay Hall", ping: "14ms", uptime: "99.8%", status: "online", signal: "strong" },
    { id: "NODE-VIL-02", location: "Villar Uplands Peak", ping: "42ms", uptime: "97.4%", status: "online", signal: "medium" },
    { id: "NODE-CAB-03", location: "Cabangan Fields Hub", ping: "28ms", uptime: "99.1%", status: "online", signal: "strong" },
    { id: "NODE-BUC-04", location: "Bucao Flood Valve IoT", ping: "---", uptime: "84.2%", status: "offline", signal: "weak" }
  ]);

  const [yieldCoefficient, setYieldCoefficient] = useState(1.15);
  const [showJsonDump, setShowJsonDump] = useState(false);

  // 2. Smart Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  // 3. Quick Action Modal State
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // 4. Report Pest State
  const [pestReport, setPestReport] = useState({ barangay: "Santos Grove", pestType: "Rice Blast", severity: "Warning", notes: "" });
  const [pestSubmitted, setPestSubmitted] = useState(false);

  // 5. Add Crop State
  const [newCrop, setNewCrop] = useState({ name: "", category: "Palay Rice", hectares: "", barangay: "Poblacion" });
  const [cropSubmitted, setCropSubmitted] = useState(false);

  // 6. Ask AI Chat State
  const [aiChatQuery, setAiChatQuery] = useState("");
  const [aiChatResponses, setAiChatResponses] = useState<any[]>([
    { role: "assistant", text: "Hello! I am Sentinel AgriMind AI. Ask me anything about Botolan soil conditions, rice diseases, or weather patterns!" }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // 7. Dynamic AI Log simulation
  const [aiLogs, setAiLogs] = useState<string[]>([
    "10:22 - Analyzed PAGASA local satellite weather bulletin.",
    "10:23 - Ran soil moisture stress model on Lopez Farm sensors.",
    "10:24 - Calibrated irrigation guidelines for Santos Mango Grove.",
    "10:25 - Synchronized community carbon reduction indices."
  ]);

  // Seasonal Styling Theme Configurator
  const seasonStyles = useMemo(() => {
    switch (season) {
      case "dry":
        return {
          bannerBg: "bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent",
          border: "border-amber-500/30",
          text: "text-amber-700 dark:text-amber-400",
          accent: "amber",
          textColor: "text-amber-600",
          accentColor: "text-amber-500",
          borderColor: "border-amber-500/30",
          glow: "shadow-amber-500/10",
          bgLight: "bg-amber-50/50 dark:bg-amber-950/20"
        };
      case "rainy":
        return {
          bannerBg: "bg-gradient-to-r from-blue-500/10 via-sky-500/5 to-transparent",
          border: "border-blue-500/30",
          text: "text-blue-700 dark:text-blue-400",
          accent: "blue",
          textColor: "text-blue-600",
          accentColor: "text-blue-500",
          borderColor: "border-blue-500/30",
          glow: "shadow-blue-500/10",
          bgLight: "bg-blue-50/50 dark:bg-blue-950/20"
        };
      case "planting":
        return {
          bannerBg: "bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent",
          border: "border-emerald-500/30",
          text: "text-emerald-700 dark:text-emerald-400",
          accent: "emerald",
          textColor: "text-emerald-600",
          accentColor: "text-emerald-500",
          borderColor: "border-emerald-500/30",
          glow: "shadow-emerald-500/10",
          bgLight: "bg-emerald-50/50 dark:bg-emerald-950/20"
        };
      case "harvest":
        return {
          bannerBg: "bg-gradient-to-r from-yellow-500/10 via-orange-500/5 to-transparent",
          border: "border-yellow-500/30",
          text: "text-yellow-700 dark:text-yellow-400",
          accent: "yellow",
          textColor: "text-yellow-600",
          accentColor: "text-yellow-500",
          borderColor: "border-yellow-500/30",
          glow: "shadow-yellow-500/10",
          bgLight: "bg-yellow-50/50 dark:bg-yellow-950/20"
        };
    }
  }, [season]);

  const searchableTopics = useMemo(() => [
    { query: "Rice disease", label: "Inspect Rice Blast & Pest Pathology", action: () => { onSelectTab("diagnostics"); } },
    { query: "Irrigation", label: "Schedule water & view Soil Moisture", action: () => { onSelectTab("planners"); } },
    { query: "Rain tomorrow", label: "Check Agri-Weather & PAGASA Outlook", action: () => { window.scrollTo({ top: 500, behavior: "smooth" }); } },
    { query: "Soil pH", label: "Inspect Digital Twin Soil pH Models", action: () => { onSelectTab("digital_twin"); } },
    { query: "Market price", label: "View Botolan Wholesale Indices", action: () => { onSelectTab("community"); } },
    { query: "Nearest agriculture office", label: "Open Botolan Municipal Command Hub", action: () => { onSelectTab("community"); } },
    { query: "Sustainability dashboard", label: "Track Carbon Reduction & Green score", action: () => { onSelectTab("sustainability"); } },
    { query: "Live AI chatbot", label: "Chat with Sentinel Core AI", action: () => { onSelectTab("sentinel_advisor"); } }
  ], [onSelectTab]);

  const filteredTopics = useMemo(() => {
    if (!searchQuery) return [];
    return searchableTopics.filter(t => 
      t.query.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, searchableTopics]);

  // Date range and active metric state for the historical comparison chart
  const [dateRange, setDateRange] = useState<"24H" | "3D" | "7D">("7D");
  const [activeMetric, setActiveMetric] = useState<"moisture" | "temperature">("moisture");

  // Get latest readings
  const latestSensor = sensorData[sensorData.length - 1] || {
    moisture: soilMoisture,
    temperature: soilTemp,
    status: "optimal"
  };

  const getMoistureStatus = (m: number) => {
    if (m < 25) return { text: "Critical Dry", color: "bg-rose-50 text-rose-800 border-rose-200/60" };
    if (m < 40) return { text: "Low Moisture", color: "bg-amber-50 text-amber-800 border-amber-200/60" };
    if (m > 80) return { text: "Over-Saturated", color: "bg-blue-50 text-blue-800 border-blue-200/60" };
    return { text: "Optimal", color: "bg-emerald-50 text-emerald-800 border-emerald-200/60" };
  };

  const currentStatus = getMoistureStatus(latestSensor.moisture);

  // --- 24-Hour Comparison Data (Mock Baseline) ---
  const data24H = useMemo(() => {
    const ticks = ["24h ago", "21h ago", "18h ago", "15h ago", "12h ago", "9h ago", "6h ago", "3h ago", "Now"];
    const moisturePrevWeek = [41.5, 41.0, 40.5, 40.0, 39.8, 40.2, 40.5, 41.0, 41.5];
    const moistureCurrent = [35.5, 35.0, 34.5, 34.0, 33.8, 33.5, 34.0, 34.5, soilMoisture];

    const tempPrevWeek = [26.0, 25.5, 25.0, 27.5, 29.0, 29.5, 28.5, 27.0, 26.5];
    const tempCurrent = [32.0, 31.5, 31.0, 32.5, 34.0, 34.5, 33.5, 32.0, soilTemp];

    return ticks.map((tick, i) => ({
      name: tick,
      currentMoisture: moistureCurrent[i],
      previousMoisture: moisturePrevWeek[i],
      currentTemp: tempCurrent[i],
      previousTemp: tempPrevWeek[i],
    }));
  }, [soilMoisture, soilTemp]);

  // --- 3-Day Comparison Data (Mock Baseline) ---
  const data3D = useMemo(() => {
    const ticks = ["48h ago", "40h ago", "32h ago", "24h ago", "16h ago", "8h ago", "Now"];
    const moisturePrevWeek = [44.0, 43.0, 42.5, 45.0, 48.5, 46.0, 43.0];
    const moistureCurrent = [38.0, 39.5, 37.0, 36.5, 35.0, 34.2, soilMoisture];

    const tempPrevWeek = [28.0, 29.5, 27.0, 26.5, 28.0, 29.2, 28.0];
    const tempCurrent = [31.0, 32.5, 33.0, 32.2, 34.0, 33.5, soilTemp];

    return ticks.map((tick, i) => ({
      name: tick,
      currentMoisture: moistureCurrent[i],
      previousMoisture: moisturePrevWeek[i],
      currentTemp: tempCurrent[i],
      previousTemp: tempPrevWeek[i],
    }));
  }, [soilMoisture, soilTemp]);

  // --- 7-Day Comparison Data (Mock Baseline) ---
  const data7D = useMemo(() => {
    const days = ["6 Days Ago", "5 Days Ago", "4 Days Ago", "3 Days Ago", "2 Days Ago", "Yesterday", "Today"];
    const moisturePrevWeek = [42.0, 40.5, 48.0, 55.0, 52.0, 46.5, 41.0];
    const moistureCurrent = [45.0, 43.5, 41.0, 39.0, 37.5, 36.0, soilMoisture];

    const tempPrevWeek = [27.5, 28.0, 26.5, 25.0, 26.0, 27.2, 28.5];
    const tempCurrent = [29.0, 30.5, 31.0, 32.5, 33.0, 31.8, soilTemp];

    return days.map((day, i) => ({
      name: day,
      currentMoisture: moistureCurrent[i],
      previousMoisture: moisturePrevWeek[i],
      currentTemp: tempCurrent[i],
      previousTemp: tempPrevWeek[i],
    }));
  }, [soilMoisture, soilTemp]);

  // --- Active Data Selection based on Date Range Filter ---
  const activeChartData = useMemo(() => {
    if (dateRange === "24H") return data24H;
    if (dateRange === "3D") return data3D;
    return data7D;
  }, [dateRange, data24H, data3D, data7D]);

  // --- Chart Summary Statistics ---
  const chartStats = useMemo(() => {
    let currentSum = 0;
    let prevSum = 0;
    let currentMax = -Infinity;
    let currentMin = Infinity;
    let prevMax = -Infinity;
    let prevMin = Infinity;

    activeChartData.forEach(d => {
      const curVal = activeMetric === "moisture" ? d.currentMoisture : d.currentTemp;
      const prevVal = activeMetric === "moisture" ? d.previousMoisture : d.previousTemp;
      
      currentSum += curVal;
      prevSum += prevVal;

      if (curVal > currentMax) currentMax = curVal;
      if (curVal < currentMin) currentMin = curVal;
      if (prevVal > prevMax) prevMax = prevVal;
      if (prevVal < prevMin) prevMin = prevVal;
    });

    const currentAvg = Math.round((currentSum / activeChartData.length) * 10) / 10;
    const prevAvg = Math.round((prevSum / activeChartData.length) * 10) / 10;
    const avgDiff = Math.round((currentAvg - prevAvg) * 10) / 10;

    return {
      currentAvg,
      prevAvg,
      avgDiff,
      currentMax,
      currentMin,
      prevMax,
      prevMin
    };
  }, [activeChartData, activeMetric]);

  interface FarmAlert {
    id: string;
    type: "irrigation" | "pest" | "heat";
    severity: "critical" | "warning";
    crop: string;
    field: string;
    title: string;
    message: string;
    actionLabel: string;
    onAction: () => void;
  }

  const activeAlerts = useMemo<FarmAlert[]>(() => {
    const alerts: FarmAlert[] = [];

    // --- Irrigation & Moisture Alerts ---
    if (soilMoisture < 25) {
      alerts.push({
        id: "irr-rice-critical",
        type: "irrigation",
        severity: "critical",
        crop: "Rice (Palay)",
        field: "Lopez Farm (Plat A)",
        title: "Critical Moisture Depletion",
        message: `Soil moisture is extremely low at ${soilMoisture}%. Standing water has evaporated, threatening rice panicle development and grain filling.`,
        actionLabel: "Emergency Flood Irrigation",
        onAction: () => setSoilMoisture(70),
      });
      alerts.push({
        id: "irr-mango-critical",
        type: "irrigation",
        severity: "critical",
        crop: "Carabao Mango",
        field: "Santos Mango Grove",
        title: "Severe Drought Stress",
        message: `Santos Mango Grove is at ${soilMoisture}% moisture. Deep root dehydration detected. High risk of fruit dropping.`,
        actionLabel: "Trigger Drip Irrigation",
        onAction: () => setSoilMoisture(45),
      });
    } else if (soilMoisture < 40) {
      alerts.push({
        id: "irr-rice-warning",
        type: "irrigation",
        severity: "warning",
        crop: "Rice (Palay)",
        field: "Lopez Farm (Plat A)",
        title: "Sub-Optimal Soil Moisture",
        message: `Moisture level (${soilMoisture}%) is insufficient for wet-paddy Rice requirements. High risk of soil cracking.`,
        actionLabel: "Initiate Supplementary Irrigation",
        onAction: () => setSoilMoisture(65),
      });
      alerts.push({
        id: "irr-corn-warning",
        type: "irrigation",
        severity: "warning",
        crop: "Yellow Corn",
        field: "Del Rosario Cornfield",
        title: "Moisture Deficit Warning",
        message: `Yellow Corn is at ${soilMoisture}% moisture. Leaves are showing signs of mild rolling/stress.`,
        actionLabel: "Apply Sprinkler Cycle",
        onAction: () => setSoilMoisture(55),
      });
    } else if (soilMoisture > 80) {
      alerts.push({
        id: "irr-corn-over",
        type: "irrigation",
        severity: "critical",
        crop: "Yellow Corn",
        field: "Del Rosario Cornfield",
        title: "Root Waterlogging & Leaching Risk",
        message: `Excessive soil moisture (${soilMoisture}%) in the Cornfield. Corn roots cannot breathe. Threat of nitrogen leaching and seedling yellowing.`,
        actionLabel: "Activate Sub-Drainage Pump",
        onAction: () => setSoilMoisture(50),
      });
      alerts.push({
        id: "irr-kamote-over",
        type: "irrigation",
        severity: "warning",
        crop: "Sweet Potato",
        field: "Poblacion Kamote Patch",
        title: "Kamote Tuber Rot Hazard",
        message: `Excess saturation (${soilMoisture}%) on Sweet Potatoes. High risk of fungal root rot and tuber damage.`,
        actionLabel: "Open Drainage Furrows",
        onAction: () => setSoilMoisture(45),
      });
    }

    // --- Temperature & Heat Stress Alerts ---
    if (soilTemp > 35) {
      alerts.push({
        id: "temp-mango-heat",
        type: "heat",
        severity: "warning",
        crop: "Carabao Mango",
        field: "Santos Mango Grove",
        title: "Solar Heat & Fruit Sunburn Risk",
        message: `Extreme soil temperature of ${soilTemp}°C. Mango canopy suffering high evapotranspiration stress. Threat of fruit drop and skin sunburn.`,
        actionLabel: "Deploy Mulching / Shade Net",
        onAction: () => setSoilTemp(28),
      });
    }

    // --- Pest & Disease Susceptibility Alerts (Dynamic Interaction of Moisture & Temperature) ---
    if (soilMoisture > 70 && soilTemp > 28) {
      alerts.push({
        id: "pest-rice-blast",
        type: "pest",
        severity: "critical",
        crop: "Rice (Palay)",
        field: "Lopez Farm (Plat A)",
        title: "Rice Blast Disease Fungal Spike",
        message: `High relative humidity indicator from ${soilMoisture}% moisture and warm ${soilTemp}°C temperature. Perfect sporulation incubators for Magnaporthe oryzae (Rice Blast).`,
        actionLabel: "Spray Copper Fungicide / Neem Emulsion",
        onAction: () => {
          setSoilMoisture(Math.max(50, soilMoisture - 10));
        },
      });
    }

    if (soilMoisture < 45 && soilTemp > 33) {
      alerts.push({
        id: "pest-mango-hopper",
        type: "pest",
        severity: "critical",
        crop: "Carabao Mango",
        field: "Santos Mango Grove",
        title: "Mango Leafhopper Outbreak Threat",
        message: `Hot, dry microclimate detected (${soilMoisture}% moisture, ${soilTemp}°C). Mango Leafhoppers are multiplying rapidly in the canopy. Sapsucking panicle damage is active.`,
        actionLabel: "Apply Soap Spray / Biological Release",
        onAction: () => {
          setSoilTemp(27);
          setSoilMoisture(55);
        },
      });
    }

    if (soilMoisture < 50 && soilTemp > 30) {
      alerts.push({
        id: "pest-corn-armyworm",
        type: "pest",
        severity: "warning",
        crop: "Yellow Corn",
        field: "Del Rosario Cornfield",
        title: "Fall Armyworm Hatching Surge",
        message: `Warm microclimate (${soilTemp}°C) accelerating Fall Armyworm egg-incubation rates. Check the inner leaves / whorls of Corn spikes.`,
        actionLabel: "Dispense Bacillus thuringiensis (Bt)",
        onAction: () => {
          setSoilTemp(26);
        },
      });
    }

    if (soilMoisture > 75 && soilTemp > 26) {
      alerts.push({
        id: "pest-kamote-weevil",
        type: "pest",
        severity: "warning",
        crop: "Sweet Potato",
        field: "Poblacion Kamote Patch",
        title: "Sweet Potato Weevil Vector Alert",
        message: `Moist, warm conditions are favorable for Cylas formicarius (Weevil) burrowing. Stems and tuber crowns are highly vulnerable.`,
        actionLabel: "Trigger Hilling-up / Apply Metarhizium",
        onAction: () => {
          setSoilMoisture(50);
        },
      });
    }

    return alerts;
  }, [soilMoisture, soilTemp, setSoilMoisture, setSoilTemp]);

  const dynamicGreeting = useMemo(() => {
    if (weatherMode === "rainy" || weatherMode === "monsoon") {
      return "Heavy monsoon patterns detected. Canopy drainage is fully operational. Standard rice fields are currently optimized.";
    }
    if (weatherMode === "windy") {
      return "High structural wind shear logged at 28 km/h. Advisory: stabilize nursery structure perimeters.";
    }
    return "Solar index holding at 920 W/m². Soil moisture in Santos Grove is stable. Ready for photosynthesis scans.";
  }, [weatherMode]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`space-y-8 ${outdoorMode ? "text-slate-950 font-black tracking-wide" : ""}`}
    >
      {/* 0. NEW ADAPTIVE RESILIENT ALERTS & OFFLINE BANNER */}
      {!isOnline && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }} 
          animate={{ height: "auto", opacity: 1 }}
          className="bg-amber-500 text-black px-6 py-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 font-black border-2 border-amber-600 shadow-md relative overflow-hidden"
        >
          <div className="flex items-center gap-3">
            <span className="p-1.5 bg-black/10 rounded-xl">
              <WifiOff className="w-5 h-5 text-black" />
            </span>
            <div>
              <span className="text-[10px] tracking-widest uppercase block text-black/75 font-black leading-none mb-1">Local Fail-safe State Triggered</span>
              <span className="text-sm">OFFLINE RESILIENT MODE ACTIVE</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-black/15 px-2.5 py-1 rounded-lg">Last Sync: Today 12:15 PM</span>
            <span className="bg-black text-amber-400 px-2.5 py-1 rounded-lg">Cached AI Available</span>
          </div>
        </motion.div>
      )}

      {outdoorMode && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }} 
          animate={{ height: "auto", opacity: 1 }}
          className="bg-yellow-400 text-black px-6 py-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 font-black border-4 border-black shadow-none"
        >
          <div className="flex items-center gap-3">
            <span className="p-1.5 bg-black text-yellow-400 rounded-xl">
              <Sun className="w-5 h-5 text-yellow-400 animate-spin" style={{ animationDuration: '8s' }} />
            </span>
            <div>
              <span className="text-[10px] tracking-widest uppercase block text-black/75 font-black leading-none mb-1">Outdoor Display Profile</span>
              <span className="text-sm">OUTDOOR SUNLIGHT CONTEXT ACTIVE (High-Contrast Buttons & Large-Fonts Loaded)</span>
            </div>
          </div>
          <button 
            onClick={() => setOutdoorMode(false)}
            className="bg-black text-yellow-400 hover:bg-black/95 px-3 py-1.5 rounded-xl text-xs font-black uppercase border-2 border-black tracking-wider cursor-pointer"
          >
            Disable Profile
          </button>
        </motion.div>
      )}

      {/* 1. DYNAMIC STATUS BAR & SEASONAL HIGHLIGHT */}
      <div className={`p-1.5 rounded-3xl border transition-all duration-1000 ${seasonStyles.border} ${seasonStyles.bannerBg} ${seasonStyles.glow}`}>
        <div className="bg-emerald-950/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 md:px-6 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-white relative overflow-hidden">
          {/* Decorative glowing season orb */}
          <div className={`absolute top-0 right-1/4 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-1000 ${
            season === "dry" ? "bg-amber-400" : season === "rainy" ? "bg-blue-400" : season === "planting" ? "bg-emerald-400" : "bg-yellow-400"
          }`} />

          <div className="flex items-center gap-3 relative z-10">
            <span className="text-base animate-bounce">{isNight ? "🌙" : "🌞"}</span>
            <div>
              <span className="text-slate-400 text-[10px] block font-extrabold uppercase tracking-widest">Active Operator</span>
              <span className="text-slate-100 font-extrabold text-xs">Good {isNight ? "Evening" : "Morning"}, Sam</span>
            </div>
          </div>

          <span className="h-6 w-px bg-white/10 hidden sm:inline" />

          <div className="flex items-center gap-2.5 relative z-10">
            <div className="p-1.5 bg-white/5 rounded-lg">
              <CloudSun className={`w-4 h-4 ${seasonStyles.textColor}`} />
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block font-extrabold uppercase tracking-widest">Agri-Weather</span>
              <span className="text-slate-100 capitalize font-extrabold text-xs">Favorable • {weatherMode}</span>
            </div>
          </div>

          <span className="h-6 w-px bg-white/10 hidden md:inline" />

          <div className="flex items-center gap-2.5 relative z-10">
            <div className="p-1.5 bg-white/5 rounded-lg">
              <Sprout className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block font-extrabold uppercase tracking-widest">Sector Diagnostics</span>
              <span className="text-slate-100 font-extrabold text-xs">
                {activeAlerts.length > 0 ? `${activeAlerts.length} crops need attention` : "All crops optimal"}
              </span>
            </div>
          </div>

          <span className="h-6 w-px bg-white/10 hidden lg:inline" />

          <div className="flex items-center gap-2.5 relative z-10">
            <div className="p-1.5 bg-white/5 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block font-extrabold uppercase tracking-widest">Disaster Level</span>
              <span className="text-slate-100 font-extrabold text-xs">No active disasters</span>
            </div>
          </div>

          <span className="h-6 w-px bg-white/10 hidden lg:inline" />

          <div className="flex items-center gap-2.5 relative z-10">
            <div className="p-1.5 bg-white/5 rounded-lg">
              <Cpu className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: "8s" }} />
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block font-extrabold uppercase tracking-widest">Active Mind</span>
              <span className="text-emerald-400 font-extrabold text-xs flex items-center gap-1">
                AI Monitoring <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DATA TRUST INDICATOR BANNER */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-md overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent)] pointer-events-none" />
        
        {/* Core Header Banner */}
        <div 
          className="p-4 md:p-5 flex flex-wrap items-center justify-between gap-4 relative z-10 cursor-pointer select-none" 
          onClick={() => setIsTrustExpanded(!isTrustExpanded)}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${weatherSimState === "verified" ? "bg-emerald-400" : "bg-amber-400"}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${weatherSimState === "verified" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
              </span>
              <div className={`p-2.5 rounded-2xl border ${weatherSimState === "verified" ? "bg-emerald-950/50 border-emerald-500/25" : "bg-amber-950/50 border-amber-500/25"}`}>
                <ShieldCheck className={`w-5 h-5 ${weatherSimState === "verified" ? "text-emerald-400" : "text-amber-400"}`} />
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none">System Integrity State</span>
                <span className={`border text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase ${
                  weatherSimState === "verified" 
                    ? "bg-emerald-900/40 text-emerald-300 border-emerald-500/30" 
                    : "bg-amber-950 text-amber-300 border-amber-500/30 animate-pulse"
                }`}>
                  {weatherSimState === "verified" ? "Verified" : "Degraded Feed"}
                </span>
              </div>
              <h4 className="text-sm font-black tracking-tight mt-1 flex items-center gap-1.5">
                Data Trust Score: <span className={`text-base font-black transition-colors ${weatherSimState === "verified" ? "text-emerald-400" : "text-amber-400"}`}>
                  {weatherSimState === "verified" ? "98.4%" : "89.1%"}
                </span>
              </h4>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="hidden lg:flex items-center gap-6 text-[10px] text-slate-400 font-bold">
            <div className="flex items-center gap-1.5 border-r border-slate-800 pr-5">
              <span className={weatherSimState === "verified" ? "text-emerald-400" : "text-amber-400"}>
                {weatherSimState === "verified" ? "✓" : "⚠"}
              </span>
              <span>Weather: {weatherSimState === "verified" ? "Verified (PAGASA)" : "Cached / Outage"}</span>
            </div>
            <div className="flex items-center gap-1.5 border-r border-slate-800 pr-5">
              <span className="text-emerald-400">✓</span>
              <span>RSBSA Farm Records Validated</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span>
              <span>AI Suggestion Review Enforced</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-black uppercase rounded-xl border border-slate-700 transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsTrustExpanded(!isTrustExpanded);
              }}
            >
              {isTrustExpanded ? "Hide Panel" : "Inspect Integrity"}
            </button>
          </div>
        </div>

        {/* Collapsible Inspection Details Panel */}
        <AnimatePresence>
          {isTrustExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-slate-800/80 bg-slate-950/60"
            >
              <div className="p-5 space-y-5">
                
                {/* Visual Grid of Validation Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  
                  {/* Weather feed validation card */}
                  <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black uppercase text-slate-500 tracking-wider">Feed A: Weather Bulletins</span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${weatherSimState === "verified" ? "bg-emerald-950 text-emerald-400 border border-emerald-900" : "bg-amber-950 text-amber-400 border border-amber-900 animate-pulse"}`}>
                          {weatherSimState === "verified" ? "Verified" : "Waiting"}
                        </span>
                      </div>
                      <h5 className="font-extrabold text-xs text-slate-200 mt-1">Sourcing Sincerity</h5>
                      <p className="text-[9px] text-slate-400 font-medium leading-normal mt-1">
                        {weatherSimState === "verified" 
                          ? "PAGASA radar and satellite feeds synced. Retrieval time: 08:35 AM (UTC)." 
                          : "Waiting for verified telemetry... Displaying offline cached readings for stability."}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                      <span className="text-[8px] text-slate-500 font-mono">PAGASA Feed</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setWeatherSimState(prev => prev === "verified" ? "failed" : "verified");
                        }}
                        className="text-[8px] font-black uppercase text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        {weatherSimState === "verified" ? "Simulate Drop" : "Re-Verify"}
                      </button>
                    </div>
                  </div>

                  {/* Farm Records Validation card */}
                  <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black uppercase text-slate-500 tracking-wider">Feed B: Registry Sync</span>
                        <span className="text-[8px] font-black uppercase bg-emerald-950 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded">
                          Validated
                        </span>
                      </div>
                      <h5 className="font-extrabold text-xs text-slate-200 mt-1">RSBSA Verification</h5>
                      <p className="text-[9px] text-slate-400 font-medium leading-normal mt-1">
                        All farmer profiles have gone through strict length, character type, and boundary validation matching Zambales criteria.
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[8px] text-slate-500 font-mono">
                      <span>32 Active Farmers</span>
                      <span className="text-emerald-400">100% Validated</span>
                    </div>
                  </div>

                  {/* Database Integrity & Transaction checks */}
                  <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black uppercase text-slate-500 tracking-wider">Referential Key Locks</span>
                        <span className="text-[8px] font-black uppercase bg-emerald-950 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded">
                          Enforced
                        </span>
                      </div>
                      <h5 className="font-extrabold text-xs text-slate-200 mt-1">UUID Isolation</h5>
                      <p className="text-[9px] text-slate-400 font-medium leading-normal mt-1">
                        Tables use random, cryptographically secure keys (UUID-v4). Foreign constraints ensure crops always map to registered farm land.
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[8px] text-slate-500 font-mono">
                      <span>Zero Orphaned Records</span>
                      <span className="text-emerald-400">Active</span>
                    </div>
                  </div>

                  {/* AI Recommendation review workflow */}
                  <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black uppercase text-slate-500 tracking-wider">Advisory Safeguard</span>
                        <span className="text-[8px] font-black uppercase bg-emerald-950 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded">
                          91% Conf
                        </span>
                      </div>
                      <h5 className="font-extrabold text-xs text-slate-200 mt-1">AI Recommendation</h5>
                      <p className="text-[9px] text-slate-400 font-medium leading-normal mt-1">
                        AI outputs are designated as guidelines only. Database state cannot be directly altered by AI without manual user confirmation.
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[8px] text-slate-500 font-mono">
                      <span>Operator Approvals</span>
                      <span className="text-emerald-400">Enforced</span>
                    </div>
                  </div>

                </div>

                {/* Footer block linking to full Operations Center */}
                <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-slate-900 rounded-2xl border border-slate-800/80 gap-3">
                  <div className="flex items-center gap-2">
                    <Database className="w-4.5 h-4.5 text-cyan-400" />
                    <span className="text-[10px] text-slate-300 font-semibold text-center sm:text-left">
                      Sammium AgriMind guarantees 100% audit traceability. Test schemas, simulate database transactions, and inspect soft-delete histories inside the Operations Center.
                    </span>
                  </div>
                  <button 
                    onClick={() => onSelectTab("security_trust")}
                    className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Inspect Security Hub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 2. SMART SEARCH, SEASON THEME & QUICK ACTION PANEL */}
      <div className={`p-6 bg-white dark:bg-slate-900 border border-slate-150 dark:border-white/5 rounded-3xl shadow-sm space-y-4 transition-all duration-1000 ${seasonStyles.glow}`}>
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* A. Smart Search Input */}
          <div className="relative w-full lg:max-w-xl">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchSuggestions(true);
                }}
                onFocus={() => setShowSearchSuggestions(true)}
                placeholder='Search: "Rice disease", "Irrigation", "Market price"...'
                className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-white/5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-slate-50/50 dark:bg-slate-950/30 dark:text-white"
              />
              {searchQuery && (
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setShowSearchSuggestions(false);
                  }} 
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {showSearchSuggestions && searchQuery && (
              <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl shadow-xl z-50 p-2 space-y-1 max-h-[300px] overflow-y-auto">
                <div className="px-3 py-1.5 text-[9px] font-black uppercase text-slate-400 tracking-wider">Search suggestions</div>
                {filteredTopics.length > 0 ? (
                  filteredTopics.map((topic, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        topic.action();
                        setShowSearchSuggestions(false);
                        setSearchQuery("");
                      }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-emerald-500">•</span>
                        {topic.label}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  ))
                ) : (
                  <div className="px-3.5 py-3 text-xs text-slate-500">No matching agri-knowledge categories found. Try "Rice" or "Soil".</div>
                )}
              </div>
            )}
          </div>

          {/* B. Theme Season Selector */}
          <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-center">
            <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Seasonal Theme:
            </span>
            <div className="inline-flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200/50 dark:border-white/5">
              {(["dry", "rainy", "planting", "harvest"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSeason(s)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-1 cursor-pointer ${
                    season === s
                      ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  <span>{s === "dry" ? "🌞 Dry" : s === "rainy" ? "🌧 Rainy" : s === "planting" ? "🌱 Plant" : "🌾 Harvest"}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* C. Quick Action Panel */}
        <div className="border-t border-slate-100 dark:border-white/5 pt-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mr-1.5">Quick Actions:</span>
            
            <button
              onClick={() => {
                setPestSubmitted(false);
                setActiveModal("pest");
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-rose-50 border border-rose-100 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-300 transition-colors text-[10px] font-extrabold uppercase cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-rose-500" /> Report Pest
            </button>
            
            <button
              onClick={() => {
                setCropSubmitted(false);
                setActiveModal("crop");
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-300 transition-colors text-[10px] font-extrabold uppercase cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-500" /> Add Crop
            </button>
            
            <button
              onClick={() => setActiveModal("photo")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-300 transition-colors text-[10px] font-extrabold uppercase cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-blue-500" /> Upload Photo
            </button>
            
            <button
              onClick={() => setActiveModal("ai")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/30 dark:text-indigo-300 transition-colors text-[10px] font-extrabold uppercase cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-500" /> Ask AI
            </button>
            
            <button
              onClick={() => setActiveModal("alerts")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-300 transition-colors text-[10px] font-extrabold uppercase cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-500" /> View Alerts ({activeAlerts.length})
            </button>
          </div>
        </div>
      </div>

      {userRole === "farmer" && (
        <>
          {/* ========================================== */}
          {/* I. TOP SECTION: WEATHER, ALERTS & AI       */}
      {/* ========================================== */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-l-4 border-emerald-500 pl-4 py-1.5">
          <div className="p-1 bg-emerald-50 rounded-lg text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest block">Phase I Core</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Weather, Alerts & Intelligence Summary</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 1. Living Intelligence Personalized Greeting & Advisor Panel */}
          <div className="lg:col-span-2 space-y-6">
            <LivingCard 
              delay={0}
              className="bg-white p-8 rounded-3xl border border-sleek-border shadow-md relative overflow-hidden flex flex-col justify-between min-h-[300px] hover:shadow-lg transition-all"
            >
              {/* Decorative subtle gradient background nodes */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -inset-y-12 left-0 w-16 bg-gradient-to-r from-transparent via-emerald-50/10 to-transparent rotate-12 translate-x-32 pointer-events-none" />
              
              <div className="space-y-6">
                {/* Branding Indicator */}
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-black tracking-widest text-emerald-700 uppercase w-fit dark:bg-emerald-950/30 dark:border-emerald-900/30 dark:text-emerald-300">
                  <Sprout className="w-3.5 h-3.5 text-emerald-500 animate-bounce" />
                  Sammium Research Labs • SCOS Core
                </div>

                {/* Personalized Greeting Title */}
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                    {isNight ? "🌙 Good Evening, Sam." : "🌤 Good Morning, Sam."}
                  </h1>
                  <p className="text-slate-500 text-xs mt-2 font-medium">
                    "Lead with Compassion. Code with Purpose." Here is your dynamic crop telemetry overview.
                  </p>
                </div>

                {/* Living Intelligence Dynamic Bullet Summaries */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-slate-800 dark:text-slate-100 text-sm font-semibold">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold dark:bg-blue-950/40 dark:text-blue-400 shrink-0">🌤</span>
                    <span>
                      {weatherMode === "rainy" || weatherMode === "monsoon" ? (
                        "Today's weather is wet with rain. Suspension of active irrigation recommended."
                      ) : weatherMode === "windy" ? (
                        "High wind advisory active. Supplementary physical canopy checks advised."
                      ) : (
                        "Today's weather is favorable and dry. Standard crop irrigation is optimal."
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-800 dark:text-slate-100 text-sm font-semibold">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold dark:bg-emerald-950/40 dark:text-emerald-400 shrink-0">🤖</span>
                    <span>
                      {activeAlerts.length > 0 
                        ? `${activeAlerts.length} AI recommendation${activeAlerts.length === 1 ? '' : 's'} available to process.` 
                        : "0 active recommendations. All farm systems are stable."}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-800 dark:text-slate-100 text-sm font-semibold">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 text-amber-600 text-xs font-bold dark:bg-amber-950/40 dark:text-amber-400 shrink-0">📋</span>
                    <span>
                      {activeAlerts.length > 0 
                        ? "1 critical advisory issued: Adjust local parameters to protect foliage." 
                        : "No active critical advisories issued."}
                    </span>
                  </div>
                </div>
              </div>

              {/* Typewriter AI Greeting Speech Effect */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mt-6 dark:bg-slate-900/50 dark:border-white/5 relative z-30 min-h-[75px]">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-600 dark:text-emerald-400 block mb-1">Live Sentinel AI Speech:</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                  <Typewriter key={dynamicGreeting} text={dynamicGreeting} />
                </p>
              </div>
            </LivingCard>
          </div>

          {/* 2. Sentinel AI Status & Hardware Hud */}
          <div className="lg:col-span-1">
            <LivingCard 
              delay={0.15}
              className="bg-white p-8 rounded-3xl border border-sleek-border shadow-md flex flex-col justify-between min-h-[300px] hover:shadow-lg transition-all"
            >
              <div className="space-y-4">
                <h3 className="text-xs font-black tracking-widest text-slate-900 uppercase flex items-center gap-2 pb-2 border-b border-slate-100 dark:text-white">
                  <Cpu className="w-4 h-4 text-emerald-500 animate-pulse" />
                  Sentinel AI Status
                </h3>
                <p className="text-[10px] text-slate-400 leading-relaxed mb-1">
                  Active diagnostic models running on local micro-networks for low latency and physical resilience.
                </p>
                
                {/* AI Confidence Meter & Logs Grid */}
                <div className="space-y-3.5">
                  {/* AI Confidence Meter */}
                  <div className="p-3 bg-emerald-50/70 border border-emerald-100/80 rounded-2xl dark:bg-emerald-950/20 dark:border-emerald-900/30">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest dark:text-emerald-400">AI Confidence</span>
                      <span className="text-[9px] font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-md dark:bg-emerald-950 dark:text-emerald-300">High Confidence</span>
                    </div>
                    <div className="flex items-center justify-between mt-2 font-mono text-xs font-black">
                      <span className="text-emerald-600 tracking-wider">█████████░</span>
                      <span className="text-emerald-700 dark:text-emerald-400">93%</span>
                    </div>
                  </div>

                  {/* 4 Grid Metrics */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-2.5 bg-slate-50 border border-slate-100/80 rounded-xl flex flex-col justify-between dark:bg-slate-900/40 dark:border-white/5">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Weather Sync</span>
                      <span className="text-xs font-mono font-black text-emerald-600 mt-1">98.9%</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-100/80 rounded-xl flex flex-col justify-between dark:bg-slate-900/40 dark:border-white/5">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Soil Diagnostics</span>
                      <span className="text-xs font-mono font-black text-cyan-600 mt-1">READY</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-100/80 rounded-xl flex flex-col justify-between dark:bg-slate-900/40 dark:border-white/5">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Pest Models</span>
                      <span className="text-xs font-mono font-black text-cyan-600 mt-1">ONLINE</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-100/80 rounded-xl flex flex-col justify-between dark:bg-slate-900/40 dark:border-white/5">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Drone Mesh</span>
                      <span className="text-xs font-mono font-black text-amber-600 mt-1">STANDBY</span>
                    </div>
                  </div>

                  {/* AI Activity Log */}
                  <div className="space-y-1.5 border-t border-slate-100 pt-3 dark:border-white/5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 dark:text-slate-500">
                      <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> 
                      AI Activity Log
                    </span>
                    <div className="space-y-1.5 max-h-[80px] overflow-y-auto pr-0.5">
                      {aiLogs.map((log, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[9px] leading-relaxed text-slate-600 dark:text-slate-400 font-semibold border-l-2 border-emerald-500 pl-2">
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[9px] text-slate-400 font-mono mt-4 flex items-center gap-1.5 pt-2 border-t border-slate-100">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                <span>All networks calibrated & active</span>
              </div>
            </LivingCard>
          </div>

        </div>

        {/* 3. Weather Advisor & 4. Alerts Real-Time Action Center */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Weather Forecast Card - Blue thematic glass */}
          <div className="bg-[#E0F2FE] p-8 rounded-3xl border border-[#BAE6FD] shadow-md lg:col-span-2 flex flex-col justify-between min-h-[360px] hover:shadow-lg transition-all">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-black text-sky-950 flex items-center gap-2.5">
                  <CloudSun className="w-6 h-6 text-amber-500" />
                  Agri-Weather Advisor
                </h2>
                <button 
                  onClick={onRefreshWeather} 
                  disabled={loadingWeather}
                  className="p-2 text-sky-700 hover:text-sky-950 hover:bg-white/40 rounded-xl transition-all border border-sky-300/60 cursor-pointer active:scale-95"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingWeather ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {loadingWeather ? (
                <div className="py-16 flex flex-col items-center justify-center space-y-3">
                  <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-sky-800 font-semibold">Retrieving real-time local coordinates bulletin...</p>
                </div>
              ) : weather ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/60 p-5 rounded-2xl border border-sky-200">
                    <div className="text-center md:text-left">
                      <span className="text-xs text-sky-800 block font-bold uppercase tracking-wider">Temperature</span>
                      <span className="text-3xl font-black text-sky-950 flex items-center justify-center md:justify-start gap-1 font-mono mt-1">
                        <Thermometer className="w-6 h-6 text-rose-500 inline shrink-0" />
                        <RollingOdometer value={weather.temperature} />°C
                      </span>
                    </div>
                    <div className="text-center md:text-left border-t border-sky-300/30 pt-3 md:pt-0 md:border-t-0 md:border-l pl-0 md:pl-4">
                      <span className="text-xs text-sky-800 block font-bold uppercase tracking-wider">Rain Chance</span>
                      <span className="text-3xl font-black text-sky-950 flex items-center justify-center md:justify-start gap-1 font-mono mt-1">
                        <Droplets className="w-6 h-6 text-blue-600 inline shrink-0" />
                        {weather.rainfallProbability}%
                      </span>
                    </div>
                    <div className="text-center md:text-left border-t border-sky-300/30 pt-3 md:pt-0 md:border-t-0 md:border-l pl-0 md:pl-4">
                      <span className="text-xs text-sky-800 block font-bold uppercase tracking-wider">Air Humidity</span>
                      <div className="text-3xl font-black text-sky-950 font-mono mt-1">
                        {weather.humidity}%
                      </div>
                      <LiquidHumidityGauge percentage={weather.humidity} />
                    </div>
                    <div className="text-center md:text-left border-t border-sky-300/30 pt-3 md:pt-0 md:border-t-0 md:border-l pl-0 md:pl-4 flex flex-col justify-between">
                      <div>
                        <span className="text-xs text-sky-800 block font-bold uppercase tracking-wider">Wind Speed</span>
                        <span className="text-3xl font-black text-sky-950 flex items-center justify-center md:justify-start gap-1.5 font-mono mt-1">
                          <motion.div
                            animate={{ rotate: weatherMode === "windy" ? [0, 360] : [0, 65, 45] }}
                            transition={{
                              rotate: {
                                repeat: weatherMode === "windy" ? Infinity : 0,
                                duration: weatherMode === "windy" ? 3 : 1.5,
                                ease: "easeInOut"
                              }
                            }}
                            className="inline-block shrink-0"
                          >
                            <Compass className="w-6 h-6 text-sky-800 inline" />
                          </motion.div>
                          {weather.windSpeed} km/h
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/70 border border-sky-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Sprout className="w-5 h-5 text-sky-950 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-[10px] font-black text-sky-950 uppercase tracking-widest">Zambales Provincial Bulletin</h4>
                        <p className="text-xs text-sky-900 mt-1 leading-relaxed font-bold">{weather.advisory}</p>
                      </div>
                    </div>
                  </div>

                  {/* 5-Day Forecast Grid */}
                  <div>
                    <h4 className="text-[10px] font-black text-sky-900 uppercase tracking-widest mb-3">5-Day Regional Agricultural Outlook</h4>
                    <div className="grid grid-cols-5 gap-3">
                      {weather.forecast.map((f, idx) => (
                        <div key={idx} className="bg-white/50 p-3 rounded-xl border border-sky-200 text-center hover:bg-white transition-all">
                          <span className="text-xs font-black text-sky-900 block">{f.day}</span>
                          <span className="text-[9px] text-sky-700 font-bold block mt-1 truncate">{f.condition}</span>
                          <span className="text-sm font-black text-sky-950 block mt-1.5">{f.temperature}°C</span>
                          <span className="text-[9px] text-sky-600 font-bold block mt-1">{f.rainfallProbability}% rain</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sky-800 text-sm py-12 text-center">Failed to load live weather bulletin.</p>
              )}
            </div>
          </div>

          {/* Action Center - Soil & Crop Alerts */}
          <div className="bg-white p-8 rounded-3xl border border-sleek-border shadow-md flex flex-col justify-between min-h-[360px] hover:shadow-lg transition-all">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <span className="relative flex h-3.5 w-3.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${activeAlerts.length > 0 ? 'bg-rose-400' : 'bg-emerald-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${activeAlerts.length > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                </span>
                <h2 className="text-lg font-black text-slate-900">Real-Time Action Center</h2>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
                Automated advisory triggers keyed directly off IoT moisture limits and camera streams.
              </p>

              {activeAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-center">
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full mb-3">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-emerald-950 text-xs uppercase tracking-wider">All Fields Optimal</h3>
                  <p className="text-[10px] text-emerald-800 mt-1.5 leading-relaxed max-w-xs">
                    No immediate moisture warnings, heat stress anomalies, or pest spikes detected in farm sectors.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                  {activeAlerts.map((alert) => (
                    <div 
                      key={alert.id}
                      className={`p-4 rounded-xl border flex flex-col justify-between ${
                        alert.severity === "critical"
                          ? "bg-rose-50/70 border-rose-200 text-rose-950"
                          : "bg-amber-50/70 border-amber-200 text-amber-950"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md ${
                            alert.severity === "critical"
                              ? "bg-rose-100 text-rose-800 border border-rose-300"
                              : "bg-amber-100 text-amber-800 border border-amber-300"
                          }`}>
                            {alert.severity}
                          </span>
                          <span className="text-[9px] font-bold text-slate-500">{alert.field}</span>
                        </div>
                        <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                          {alert.title}
                        </h4>
                        <p className="text-[10px] text-slate-600 mt-1 leading-normal">
                          {alert.message}
                        </p>
                      </div>

                      <button
                        onClick={alert.onAction}
                        className={`mt-3 py-1.5 px-3 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 text-white cursor-pointer ${
                          alert.severity === "critical"
                            ? "bg-rose-600 hover:bg-rose-700"
                            : "bg-amber-600 hover:bg-amber-700"
                        } active:scale-95`}
                      >
                        <span>{alert.actionLabel}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-[9px] text-slate-400 font-mono mt-4 pt-2 border-t border-slate-100">
              Telemetry checked 2 minutes ago (Real-time live)
            </div>
          </div>

        </div>
      </div>

      {/* ========================================== */}
      {/* NEW: AI RECOMMENDATIONS & COMMUNITY IMPACT */}
      {/* ========================================== */}
      <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-3 border-l-4 border-amber-500 pl-4 py-1.5">
          <div className="p-1 bg-amber-50 rounded-lg text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest block">AI Explainability & Community</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">AI Transparency & Local Impact Hub</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card 1: "Why?" Panel for Irrigation Recommendations */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-150 dark:border-white/5 shadow-md flex flex-col justify-between min-h-[380px] hover:shadow-lg transition-all">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider dark:text-white flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-emerald-500" />
                  🌱 Irrigation Recommendation
                </span>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full dark:bg-emerald-950 dark:text-emerald-300">
                  Explainable AI
                </span>
              </div>

              {/* Status Section */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl dark:bg-slate-950/50 dark:border-white/5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Recommendation Status</span>
                <span className="text-sm font-extrabold text-slate-800 dark:text-white mt-1 block">
                  {soilMoisture > 75 || weatherMode === "rainy" || weatherMode === "monsoon"
                    ? "Delay irrigation for 24 hours."
                    : "Initiate supplementary 15-minute drip cycle."}
                </span>
              </div>

              {/* Reason list */}
              <div className="space-y-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Reasoning Core</span>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-bold">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500">•</span>
                    <span>{weatherMode === "rainy" || weatherMode === "monsoon" ? "85% probability of natural precipitation" : "Dry atmosphere requires stable transpiration"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500">•</span>
                    <span>Soil moisture is {soilMoisture > 50 ? "sufficient" : "approaching critical limit"} at {soilMoisture}%</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500">•</span>
                    <span>High air humidity detected ({weather?.humidity || 78}%)</span>
                  </li>
                </ul>
              </div>

              {/* Confidence Score Gauge */}
              <div className="space-y-1 pt-1.5 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-500">
                  <span>AI Confidence Score</span>
                  <span className="text-emerald-500">94%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-950">
                  <div className="h-full bg-emerald-500" style={{ width: "94%" }}></div>
                </div>
              </div>

              {/* Data Sources and Logs */}
              <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Weather API
                </div>
                <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Soil Sensor
                </div>
                <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Historical Weather
                </div>
              </div>
            </div>

            <div className="text-[9px] text-slate-400 font-mono mt-4 pt-2 border-t border-slate-100">
              Last Updated: 2 minutes ago
            </div>
          </div>

          {/* Card 2: Community Impact Dashboard */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-150 dark:border-white/5 shadow-md flex flex-col justify-between min-h-[380px] hover:shadow-lg transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider dark:text-white flex items-center gap-2">
                  <Users className="w-4.5 h-4.5 text-emerald-500 animate-pulse" />
                  Community Impact Overview
                </span>
                <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full dark:bg-amber-950/40 dark:text-amber-300">
                  Botolan Regional
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Aggregated, anonymized statistics from our regional Zambales agricultural twin framework.
              </p>

              {/* Impact stats grid */}
              <div className="grid grid-cols-2 gap-3.5 pt-1.5">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl dark:bg-slate-950/50 dark:border-white/5">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Farmers</span>
                  <span className="text-lg font-black text-slate-800 dark:text-white mt-0.5 block">2,154</span>
                  <span className="text-[8px] font-bold text-emerald-600 block mt-0.5">Active profiles</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl dark:bg-slate-950/50 dark:border-white/5">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Farmland</span>
                  <span className="text-lg font-black text-slate-800 dark:text-white mt-0.5 block">1,842 ha</span>
                  <span className="text-[8px] font-bold text-emerald-600 block mt-0.5">Under management</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl dark:bg-slate-950/50 dark:border-white/5">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Water Saved</span>
                  <span className="text-lg font-black text-slate-800 dark:text-white mt-0.5 block">18,000 L</span>
                  <span className="text-[8px] font-bold text-emerald-600 block mt-0.5">This month alone</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl dark:bg-slate-950/50 dark:border-white/5">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Accepted Advice</span>
                  <span className="text-lg font-black text-slate-800 dark:text-white mt-0.5 block">3,542</span>
                  <span className="text-[8px] font-bold text-emerald-600 block mt-0.5">AI optimizations</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl dark:bg-slate-950/50 dark:border-white/5 col-span-2 flex items-center justify-between">
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Carbon Reduction</span>
                    <span className="text-sm font-black text-slate-800 dark:text-white mt-0.5 block">4.3 Tons CO₂ Equivalent</span>
                  </div>
                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md dark:bg-emerald-950 dark:text-emerald-300">EST. MITIGATION</span>
                </div>
              </div>
            </div>

            <div className="text-[9px] text-slate-400 font-mono mt-4 pt-2 border-t border-slate-100 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span>Anonymized community consensus active</span>
            </div>
          </div>

          {/* Card 3: Planning Timeline */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-150 dark:border-white/5 shadow-md flex flex-col justify-between min-h-[380px] hover:shadow-lg transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  Chronological Planning Timeline
                </span>
                <span className="text-[10px] font-black text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full dark:bg-sky-950/40 dark:text-sky-300">
                  Regional Feed
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Review automated farm diagnostic schedules and regional weather interventions over time.
              </p>

              {/* Horizontal / Vertical Timeline flow */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3 relative">
                  <div className="absolute top-4 bottom-[-16px] left-2 w-0.5 bg-slate-100 dark:bg-slate-800" />
                  <div className="w-4 h-4 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center text-[8px] font-black shrink-0 relative z-10 dark:bg-slate-950 dark:border-slate-800">✓</div>
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Yesterday</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5 block">Weather Alert Resolved</span>
                    <span className="text-[9px] text-slate-500 block leading-relaxed">High winds perimeter advisory fully completed.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 relative">
                  <div className="absolute top-4 bottom-[-16px] left-2 w-0.5 bg-slate-100 dark:bg-slate-800" />
                  <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-emerald-400 flex items-center justify-center text-[8px] font-black text-white shrink-0 relative z-10">●</div>
                  <div>
                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-wider block">Today</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white mt-0.5 block">Crop Pathology Diagnostics</span>
                    <span className="text-[9px] text-slate-500 block leading-relaxed">Palay checks find no active Rice Blast spore vectors.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 relative">
                  <div className="absolute top-4 bottom-[-16px] left-2 w-0.5 bg-slate-100 dark:bg-slate-800" />
                  <div className="w-4 h-4 rounded-full bg-sky-100 border-2 border-sky-300 flex items-center justify-center text-[8px] font-black text-sky-800 shrink-0 relative z-10 dark:bg-slate-950 dark:border-sky-900/30">→</div>
                  <div>
                    <span className="text-[8px] font-black text-sky-600 uppercase tracking-wider block">Tomorrow</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5 block">Standard Harvest Window</span>
                    <span className="text-[9px] text-slate-500 block leading-relaxed">Maximum solar index window optimal for Corn field.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-[8px] font-black text-amber-800 shrink-0 relative z-10 dark:bg-slate-950 dark:border-amber-900/30">⏰</div>
                  <div>
                    <span className="text-[8px] font-black text-amber-600 uppercase tracking-wider block">Next Week</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5 block">Monsoon Planning Loop</span>
                    <span className="text-[9px] text-slate-500 block leading-relaxed">Prepare sub-drainage furrows for deep rain loads.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[9px] text-slate-400 font-mono mt-4 pt-2 border-t border-slate-100">
              Interventions synchronized: 5 minutes ago
            </div>
          </div>

        </div>
      </div>

      {/* ========================================== */}
      {/* II. MIDDLE SECTION: CROP, SOIL & MARKET    */}
      {/* ========================================== */}
      <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-3 border-l-4 border-cyan-500 pl-4 py-1.5">
          <div className="p-1 bg-cyan-50 rounded-lg text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-cyan-600 tracking-widest block">Phase II Analytics</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Crop, Soil & Market Operations</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 1. Soil Health Station with LARGE tablet-friendly typography */}
          <div className="lg:col-span-1">
            <LivingCard 
              delay={0.2}
              className="bg-white p-8 rounded-3xl border border-sleek-border shadow-md flex flex-col justify-between min-h-[460px] hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xs font-black tracking-widest text-slate-900 uppercase flex items-center gap-2 dark:text-white">
                    <Radio className="w-4 h-4 text-emerald-500" />
                    Soil Sensor Station
                  </h3>
                  <span className="text-[9px] font-black uppercase px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                    Live IoT Link
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed mb-6">
                  Interactive real-time soil values. Telemetry fonts are enlarged for clarity when viewed outdoors on tablets.
                </p>

                {/* BIG Telemetry Values */}
                <div className="space-y-6">
                  
                  {/* Moisture */}
                  <div className="p-5 bg-slate-50 border border-slate-100/75 rounded-2xl flex flex-col justify-center relative overflow-hidden dark:bg-slate-900/40 dark:border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-blue-500" />
                        Soil Moisture
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${currentStatus.color}`}>
                        {currentStatus.text}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-6xl sm:text-7xl font-black text-slate-900 font-mono tracking-tighter dark:text-white">
                        {latestSensor.moisture}
                      </span>
                      <span className="text-2xl font-bold text-slate-400 font-mono">%</span>
                    </div>
                  </div>

                  {/* Temp */}
                  <div className="p-5 bg-slate-50 border border-slate-100/75 rounded-2xl flex flex-col justify-center relative overflow-hidden dark:bg-slate-900/40 dark:border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                        Soil Temperature
                      </span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full border bg-white border-slate-100 text-slate-700 dark:bg-slate-900/80 dark:border-white/5 dark:text-slate-200">
                        {latestSensor.temperature > 35 ? "Heat Stress" : latestSensor.temperature < 15 ? "Cool" : "Optimal"}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-6xl sm:text-7xl font-black text-slate-900 font-mono tracking-tighter dark:text-white">
                        {latestSensor.temperature}
                      </span>
                      <span className="text-2xl font-bold text-slate-400 font-mono">°C</span>
                    </div>
                  </div>

                </div>

                {/* IoT sliders */}
                <div className="mt-6 pt-5 border-t border-slate-100 space-y-4">
                  <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5 dark:text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Interactive Simulator Sliders
                  </h4>
                  
                  <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span className="font-semibold">Simulate Moisture</span>
                      <span className="font-mono font-black text-slate-900 dark:text-white">{soilMoisture}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={soilMoisture}
                      onChange={(e) => setSoilMoisture(Number(e.target.value))}
                      className="w-full accent-emerald-500 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span className="font-semibold">Simulate Temperature</span>
                      <span className="font-mono font-black text-slate-900 dark:text-white">{soilTemp}°C</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="50" 
                      value={soilTemp}
                      onChange={(e) => setSoilTemp(Number(e.target.value))}
                      className="w-full accent-rose-500 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer dark:bg-slate-800"
                    />
                  </div>
                </div>

              </div>
              
              <div className="text-[9px] text-slate-400 font-mono italic mt-4 pt-3 border-t border-slate-100">
                * Calibrated specifically for regional sandy-loam mango soils
              </div>
            </LivingCard>
          </div>

          {/* 2. Crop Health Fast Nav Grid (Diagnostics) */}
          <div className="lg:col-span-1">
            <LivingCard 
              delay={0.25}
              className="bg-white p-8 rounded-3xl border border-sleek-border shadow-md flex flex-col justify-between min-h-[460px] hover:shadow-lg transition-all"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black tracking-widest text-slate-900 uppercase flex items-center gap-2 dark:text-white">
                    <Sprout className="w-4 h-4 text-emerald-500" />
                    Crop Health fast nav
                  </h3>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-cyan-50 text-cyan-700 border border-cyan-200 rounded-md">
                    Bento Portal
                  </span>
                </div>
                
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Quick-launch targeted agricultural applications or inspect sub-field parameters.
                </p>

                {/* Sub-field Crop indicators */}
                <div className="space-y-3 bg-slate-50/50 p-4 border border-slate-100 rounded-2xl dark:bg-slate-900/30 dark:border-white/5">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Active Farm Canopy Indicators</span>
                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100/50">
                    <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">🥭 Carabao Mango</span>
                    <span className="font-mono text-emerald-600 font-black uppercase">Flowering (92%)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100/50">
                    <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">🌾 NSIC Rc222 Rice</span>
                    <span className="font-mono text-emerald-600 font-black uppercase">Tillering (88%)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">🍠 Kamote Tuber</span>
                    <span className="font-mono text-cyan-600 font-black uppercase">Growth (Optimum)</span>
                  </div>
                </div>

                {/* Grid Links */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => onSelectTab("digital_twin")}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-left hover:border-emerald-500/30 hover:shadow-sm transition-all group cursor-pointer dark:bg-slate-900/30 dark:border-white/5"
                  >
                    <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg w-fit group-hover:bg-emerald-100 transition-colors">
                      <Sprout className="w-4 h-4" />
                    </div>
                    <h4 className="font-black text-slate-800 text-[11px] mt-2 flex items-center justify-between dark:text-white">
                      Digital Twin
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500" />
                    </h4>
                  </button>

                  <button 
                    onClick={() => onSelectTab("diagnostics")}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-left hover:border-emerald-500/30 hover:shadow-sm transition-all group cursor-pointer dark:bg-slate-900/30 dark:border-white/5"
                  >
                    <div className="p-1.5 bg-amber-50 text-amber-700 rounded-lg w-fit group-hover:bg-amber-100 transition-colors">
                      <Bug className="w-4 h-4" />
                    </div>
                    <h4 className="font-black text-slate-800 text-[11px] mt-2 flex items-center justify-between dark:text-white">
                      Pathology Lab
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500" />
                    </h4>
                  </button>

                  <button 
                    onClick={() => onSelectTab("finance")}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-left hover:border-emerald-500/30 hover:shadow-sm transition-all group cursor-pointer dark:bg-slate-900/30 dark:border-white/5"
                  >
                    <div className="p-1.5 bg-blue-50 text-blue-700 rounded-lg w-fit group-hover:bg-blue-100 transition-colors">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <h4 className="font-black text-slate-800 text-[11px] mt-2 flex items-center justify-between dark:text-white">
                      AgriProfit
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500" />
                    </h4>
                  </button>

                  <button 
                    onClick={() => onSelectTab("planners")}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-left hover:border-emerald-500/30 hover:shadow-sm transition-all group cursor-pointer dark:bg-slate-900/30 dark:border-white/5"
                  >
                    <div className="p-1.5 bg-rose-50 text-rose-700 rounded-lg w-fit group-hover:bg-rose-100 transition-colors">
                      <Pipette className="w-4 h-4" />
                    </div>
                    <h4 className="font-black text-slate-800 text-[11px] mt-2 flex items-center justify-between dark:text-white">
                      Resource Planners
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500" />
                    </h4>
                  </button>
                </div>
              </div>

              <div className="text-[9px] text-slate-400 font-mono mt-4 pt-3 border-t border-slate-100">
                Tap shortcuts to open diagnostic dashboards
              </div>
            </LivingCard>
          </div>

          {/* 3. Market Trends Highlight Board */}
          <div className="lg:col-span-1">
            <LivingCard 
              delay={0.3}
              className="bg-white p-8 rounded-3xl border border-sleek-border shadow-md flex flex-col justify-between min-h-[460px] hover:shadow-lg transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black tracking-widest text-slate-900 uppercase flex items-center gap-2 dark:text-white">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    Zambales Markets
                  </h3>
                  <button 
                    onClick={() => onSelectTab("community")}
                    className="text-[10px] font-black text-emerald-600 hover:text-emerald-800 flex items-center gap-0.5 hover:underline cursor-pointer"
                  >
                    Enter Hub <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Real-time wholesale indices compiled directly from Botolan municipal and regional market traders.
                </p>

                {/* Grid Lists of wholesale card flips */}
                {loadingPrices ? (
                  <div className="py-12 flex justify-center">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {marketPrices.slice(0, 3).map((p, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between dark:bg-slate-900/30 dark:border-white/5">
                        <div>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">{p.grade}</span>
                          <span className="font-bold text-slate-800 text-xs mt-0.5 block dark:text-white">{p.cropName}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-slate-900 font-mono dark:text-white">₱{p.pricePerKg}/kg</span>
                          <span className={`text-[9px] font-bold block ${p.trend === "up" ? "text-emerald-600" : p.trend === "down" ? "text-rose-600" : "text-slate-400"}`}>
                            {p.trend === "up" ? "▲" : p.trend === "down" ? "▼" : "•"} ₱{Math.abs(p.pricePerKg - p.previousPrice)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-[9px] text-slate-400 font-mono mt-4 pt-3 border-t border-slate-100">
                Prices update every morning at 6:00 AM PHT
              </div>
            </LivingCard>
          </div>

        </div>
      </div>

      {/* ========================================== */}
      {/* III. BOTTOM SECTION: ANALYTICS, HISTORY, MAPS */}
      {/* ========================================== */}
      <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-3 border-l-4 border-slate-500 pl-4 py-1.5">
          <div className="p-1 bg-slate-50 rounded-lg text-slate-600 dark:bg-slate-950/40 dark:text-slate-400">
            <History className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest block">Phase III Archival</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Analytics, History & Regional Mapping</h2>
          </div>
        </div>

        {/* Soil Health Map Overlay */}
        <SoilHealthMap soilMoisture={soilMoisture} soilTemp={soilTemp} />

        {/* Sensor History Recharts Area */}
        <LivingCard delay={0.35} className="bg-white p-8 rounded-3xl border border-sleek-border shadow-md hover:shadow-lg transition-all">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-5 dark:border-white/5">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-500" />
                Sensor History Analytics & Comparisons
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Compare current microclimate sensors with previous week's performance data.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Metric Selector Tabs */}
              <div className="bg-slate-50 p-1 rounded-xl border border-slate-100 flex gap-1 dark:bg-slate-900/50 dark:border-white/5">
                <button
                  onClick={() => setActiveMetric("moisture")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeMetric === "moisture"
                      ? "bg-white text-emerald-800 shadow-sm border border-slate-100 dark:bg-slate-900 dark:text-white dark:border-white/5"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                  }`}
                >
                  <Droplets className="w-3.5 h-3.5" />
                  Soil Moisture
                </button>
                <button
                  onClick={() => setActiveMetric("temperature")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeMetric === "temperature"
                      ? "bg-white text-rose-800 shadow-sm border border-slate-100 dark:bg-slate-900 dark:text-white dark:border-white/5"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                  }`}
                >
                  <Thermometer className="w-3.5 h-3.5" />
                  Soil Temp
                </button>
              </div>

              {/* Date Range Selector Buttons */}
              <div className="bg-slate-50 p-1 rounded-xl border border-slate-100 flex gap-1 dark:bg-slate-900/50 dark:border-white/5">
                {(["24H", "3D", "7D"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      dateRange === range
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                    }`}
                  >
                    {range === "24H" ? "24 Hours" : range === "3D" ? "3 Days" : "7 Days"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Comparison Analysis Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100/75 dark:bg-slate-900/30 dark:border-white/5">
              <span className="text-[9px] text-slate-400 font-black block uppercase tracking-wider">Current Period Average</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {chartStats.currentAvg}
                  {activeMetric === "moisture" ? "%" : "°C"}
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100/75 dark:bg-slate-900/30 dark:border-white/5">
              <span className="text-[9px] text-slate-400 font-black block uppercase tracking-wider">Previous Week Average</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-extrabold text-slate-500 font-mono">
                  {chartStats.prevAvg}
                  {activeMetric === "moisture" ? "%" : "°C"}
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100/75 flex flex-col justify-between dark:bg-slate-900/30 dark:border-white/5">
              <span className="text-[9px] text-slate-400 font-black block uppercase tracking-wider">Comparative Trend Delta</span>
              <div className="flex items-center gap-1.5 mt-1">
                {chartStats.avgDiff > 0 ? (
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-black ${
                    activeMetric === "moisture" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
                  }`}>
                    <TrendingUp className="w-4 h-4" />
                    +{chartStats.avgDiff}
                    {activeMetric === "moisture" ? "% Moister" : "°C Warmer"}
                  </span>
                ) : chartStats.avgDiff < 0 ? (
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-black ${
                    activeMetric === "moisture" ? "bg-amber-50 text-amber-800" : "bg-blue-50 text-blue-800"
                  }`}>
                    <TrendingDown className="w-4 h-4" />
                    {chartStats.avgDiff}
                    {activeMetric === "moisture" ? "% Drier" : "°C Cooler"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-black bg-stone-100 text-stone-700">
                    Stable (0.0 Change)
                  </span>
                )}
                <span className="text-[9px] text-slate-400">vs last week</span>
              </div>
            </div>
          </div>

          {/* Recharts Comparison Line Chart */}
          <div className="h-80 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={activeChartData}
                margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeMetric === "moisture" ? "#10b981" : "#f43f5e"} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={activeMetric === "moisture" ? "#10b981" : "#f43f5e"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={11}
                  domain={activeMetric === "moisture" ? [0, 100] : [10, 50]}
                  tickLine={false}
                  axisLine={false}
                  unit={activeMetric === "moisture" ? "%" : "°C"}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#ffffff", 
                    border: "1px solid #e2e8f0", 
                    borderRadius: "12px", 
                    fontSize: "12px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)"
                  }} 
                  formatter={(value: any, name: any) => {
                    const formattedName = name === "current" 
                      ? "Current Reading" 
                      : "Previous Week Reading";
                    const unit = activeMetric === "moisture" ? "%" : "°C";
                    return [`${value}${unit}`, formattedName];
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "11px", fontWeight: "600", color: "#475569" }}
                />
                <Line
                  type="monotone"
                  name="current"
                  dataKey={activeMetric === "moisture" ? "currentMoisture" : "currentTemp"}
                  stroke={activeMetric === "moisture" ? "#10b981" : "#f43f5e"}
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 1.5, fill: "#ffffff" }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={true}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
                <Line
                  type="monotone"
                  name="previous"
                  dataKey={activeMetric === "moisture" ? "previousMoisture" : "previousTemp"}
                  stroke={activeMetric === "moisture" ? "#34d399" : "#fda4af"}
                  strokeWidth={2.5}
                  strokeDasharray="6 6"
                  dot={{ r: 3, strokeWidth: 1.5, fill: "#ffffff" }}
                  isAnimationActive={true}
                  animationDuration={1800}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-2 mt-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl dark:bg-slate-900/30 dark:border-white/5">
            <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-[11px] text-slate-500 leading-normal">
              <strong>Historical Analysis Mode:</strong> Comparing active sensor stream data with identical days from the <strong>previous week cycle (July 2026)</strong>. Standardizing trends against monsoon thresholds.
            </p>
          </div>
        </LivingCard>

        {/* 2. Zambales Location Hub & 3. Environmental Modulator */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Zambales District Selector & GPS Lock */}
          <LivingCard 
            delay={0.4}
            className="bg-white p-8 rounded-3xl border border-sleek-border shadow-md flex flex-col justify-between min-h-[240px] hover:shadow-lg transition-all"
          >
            <div className="space-y-4">
              <h3 className="text-xs font-black tracking-widest text-slate-900 uppercase flex items-center gap-2 dark:text-white">
                <MapPin className="w-4 h-4 text-emerald-500" />
                Zambales Location Hub
              </h3>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Switch Zambales districts to retrieve grounded weather advisories or lock on browser GPS coordinates.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Municipality Select */}
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Municipality</label>
                  <select
                    value={municipality}
                    onChange={(e) => {
                      setMunicipality(e.target.value);
                      setGpsCoords({ lat: null, lng: null }); // reset GPS on manual switch
                      if (e.target.value !== "Botolan") {
                        setBarangay("Poblacion"); // Default other towns
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-100 text-xs rounded-xl p-2.5 font-bold text-slate-800 outline-none cursor-pointer dark:bg-slate-900/30 dark:border-white/5 dark:text-white"
                  >
                    {["Botolan", "Cabangan", "San Felipe", "Iba", "Palauig", "Castillejos", "San Narciso", "San Antonio", "Subic", "Olongapo"].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Barangay Select (If Botolan) */}
                {municipality === "Botolan" ? (
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Barangay</label>
                    <select
                      value={barangay}
                      onChange={(e) => {
                        setBarangay(e.target.value);
                        setGpsCoords({ lat: null, lng: null }); // reset GPS
                      }}
                      className="w-full bg-slate-50 border border-slate-100 text-xs rounded-xl p-2.5 font-bold text-slate-800 outline-none cursor-pointer dark:bg-slate-900/30 dark:border-white/5 dark:text-white"
                    >
                      {["Poblacion", "Baquilan", "Binuclutan", "Burgos", "Capayawan", "Carael", "Mambog", "Moraza", "Panan", "Paco", "Poonbato", "Porac", "San Juan", "Villar"].map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Barangay Sector</label>
                    <div className="w-full bg-slate-50 border border-slate-100 text-xs rounded-xl p-2.5 font-bold text-slate-400 dark:bg-slate-900/30 dark:border-white/5">
                      Poblacion District
                    </div>
                  </div>
                )}
              </div>

              {/* GPS Coordinates & Action */}
              <div className="pt-3 border-t border-slate-100 dark:border-white/5">
                <button
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          const lat = Number(position.coords.latitude.toFixed(4));
                          const lng = Number(position.coords.longitude.toFixed(4));
                          setGpsCoords({ lat, lng });
                        },
                        (err) => {
                          alert(`GPS Lock Failed: ${err.message}. Ensure location permissions are active in this browser frame.`);
                        },
                        { enableHighAccuracy: true, timeout: 8000 }
                      );
                    } else {
                      alert("Geolocation is not supported by your browser.");
                    }
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                    gpsCoords.lat !== null
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-300"
                      : "bg-slate-50 border-slate-100 text-slate-800 hover:bg-slate-100 dark:bg-slate-900/30 dark:border-white/5 dark:text-white"
                  }`}
                >
                  <Compass className={`w-4 h-4 ${gpsCoords.lat !== null ? "text-emerald-600 animate-spin" : "text-slate-600 dark:text-slate-400"}`} />
                  {gpsCoords.lat !== null ? "GPS Telemetry Lock Active" : "Query Browser GPS Location"}
                </button>

                {gpsCoords.lat !== null && (
                  <div className="mt-2 text-center text-[10px] font-mono text-emerald-700 bg-emerald-50/50 p-1.5 rounded-lg border border-emerald-100 flex items-center justify-center gap-1.5 dark:bg-emerald-950/10 dark:border-emerald-900/20 dark:text-emerald-300">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span>Lat: {gpsCoords.lat}° N • Lng: {gpsCoords.lng}° E</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-[9px] font-mono text-slate-400 mt-4 pt-2 border-t border-slate-100">
              Active region: <span className="text-emerald-600 font-extrabold dark:text-emerald-400">{barangay && municipality === "Botolan" ? `${barangay}, ` : ""}{municipality}</span>
            </div>
          </LivingCard>

          {/* Environmental Simulators (Weather presets + Time cycle) */}
          <LivingCard 
            delay={0.45}
            className="bg-white p-8 rounded-3xl border border-sleek-border shadow-md flex flex-col justify-between min-h-[240px] hover:shadow-lg transition-all"
          >
            <div>
              <h3 className="text-xs font-black tracking-widest text-slate-900 uppercase flex items-center gap-2 mb-2 dark:text-white">
                <Compass className="w-4 h-4 text-emerald-500" />
                Environmental Modulator
              </h3>
              <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
                Override local microclimates to preview crop stress scenarios and rain impacts.
              </p>

              {/* Time of Day Cycle Toggle */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-white/5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Day / Night Cycle</span>
                <button
                  onClick={() => setIsNight(!isNight)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isNight
                      ? "bg-slate-950 text-cyan-400 border-slate-800 shadow-[0_0_12px_rgba(34,211,238,0.2)]"
                      : "bg-amber-50 text-amber-800 border-amber-200 shadow-sm"
                  } active:scale-95 hover:brightness-105`}
                >
                  {isNight ? (
                    <>
                      <Moon className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      Night mode active
                    </>
                  ) : (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                      Day mode active
                    </>
                  )}
                </button>
              </div>

              {/* Weather Mode buttons */}
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase text-slate-400 block">Weather Presets Simulation</span>
                <div className="grid grid-cols-4 gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100 dark:bg-slate-900/50 dark:border-white/5">
                  {(["sunny", "rainy", "windy", "monsoon"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setWeatherMode(mode)}
                      className={`py-2 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer text-center ${
                        weatherMode === mode
                          ? "bg-emerald-600 text-white shadow-md scale-[1.03] shadow-emerald-600/25"
                          : "text-slate-500 hover:text-slate-800 hover:bg-white dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-[9px] font-mono text-slate-400 mt-4 pt-2 border-t border-slate-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
              <span>Simulations synced to local digital twin</span>
            </div>
          </LivingCard>

        </div>
      </div>
        </>
      )}

      {/* ========================================================= */}
      {/* II. BARANGAY STAFF DASHBOARD VIEW                         */}
      {/* ========================================================= */}
      {userRole === "staff" && (
        <BarangayStaffDashboard
          farmersList={farmersList}
          setFarmersList={setFarmersList}
          announcements={announcements}
          setAnnouncements={setAnnouncements}
          newAnnTitle={newAnnTitle}
          setNewAnnTitle={setNewAnnTitle}
          newAnnCategory={newAnnCategory}
          setNewAnnCategory={setNewAnnCategory}
          newAnnContent={newAnnContent}
          setNewAnnContent={setNewAnnContent}
          newFarmerName={newFarmerName}
          setNewFarmerName={setNewFarmerName}
          newFarmerBarangay={newFarmerBarangay}
          setNewFarmerBarangay={setNewFarmerBarangay}
          newFarmerArea={newFarmerArea}
          setNewFarmerArea={setNewFarmerArea}
          newFarmerCrop={newFarmerCrop}
          setNewFarmerCrop={setNewFarmerCrop}
          setAiLogs={setAiLogs}
        />
      )}

      {/* ========================================================= */}
      {/* III. SYSTEM ADMINISTRATOR DASHBOARD VIEW                  */}
      {/* ========================================================= */}
      {userRole === "admin" && (
        <AdministratorDashboard
          nodeClusters={nodeClusters}
          setNodeClusters={setNodeClusters}
          yieldCoefficient={yieldCoefficient}
          setYieldCoefficient={setYieldCoefficient}
          aiLogs={aiLogs}
          setAiLogs={setAiLogs}
          showJsonDump={showJsonDump}
          setShowJsonDump={setShowJsonDump}
          isOnline={isOnline}
          municipality={municipality}
          barangay={barangay}
          gpsCoords={gpsCoords}
          weatherMode={weatherMode}
          soilMoisture={soilMoisture}
          soilTemp={soilTemp}
          farmersList={farmersList}
        />
      )}

      {/* ========================================== */}
      {/* QUICK ACTION MODALS OVERLAYS               */}
      {/* ========================================== */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20">
              <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-2">
                {activeModal === "pest" && "🚨 Report Pest & Disease Spore vectors"}
                {activeModal === "crop" && "🌱 Register New Crop Variety"}
                {activeModal === "photo" && "📸 Upload Physical Field Photo"}
                {activeModal === "ai" && "🤖 Consult Sentinel AI Assistant"}
                {activeModal === "alerts" && "⚠️ Current System Alerts Diagnostic"}
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[450px] overflow-y-auto space-y-4">
              
              {/* 1. REPORT PEST MODAL */}
              {activeModal === "pest" && (
                <>
                  {pestSubmitted ? (
                    <div className="text-center py-6 space-y-3">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-50 text-rose-500 dark:bg-rose-950/40">
                        <Check className="w-6 h-6" />
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">Pest Vector Logged Successfully</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        The regional Zambales crop pathology model has incorporated this incidence report. Neighbors notified.
                      </p>
                      <button
                        onClick={() => setActiveModal(null)}
                        className="mt-2 px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-black uppercase cursor-pointer"
                      >
                        Dismiss Modal
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-[11px] text-slate-400">
                        Report suspected leaf rust, rice bug infestation, or caterpillars to allow AI regional warning system alerts.
                      </p>
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Target Crop Field / Barangay</label>
                        <select 
                          value={pestReport.barangay}
                          onChange={(e) => setPestReport({ ...pestReport, barangay: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 text-xs font-bold dark:bg-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                        >
                          <option value="Santos Grove">Santos Grove (Palay Rice)</option>
                          <option value="Magsaysay Sector">Magsaysay Sector (Corn)</option>
                          <option value="Batonlapoc">Batonlapoc Uplands (Legumes)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Observed Pest Type</label>
                        <select 
                          value={pestReport.pestType}
                          onChange={(e) => setPestReport({ ...pestReport, pestType: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 text-xs font-bold dark:bg-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                        >
                          <option value="Rice Bug (Atangya)">Rice Bug (Atangya)</option>
                          <option value="Leaf Rust (Fungal Spore)">Leaf Rust (Fungal Spore)</option>
                          <option value="Fall Armyworm">Fall Armyworm</option>
                          <option value="Bacterial Blight">Bacterial Leaf Blight</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Severity Assessment</label>
                        <div className="grid grid-cols-3 gap-2">
                          {["low", "medium", "critical"].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setPestReport({ ...pestReport, severity: s as any })}
                              className={`py-2 rounded-xl text-[10px] font-black uppercase cursor-pointer text-center border transition-all ${
                                pestReport.severity === s
                                  ? "bg-rose-600 border-rose-500 text-white shadow-md shadow-rose-600/20"
                                  : "bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-950 dark:border-white/5 dark:text-slate-400"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Optional Descriptive Notes</label>
                        <textarea 
                          rows={3}
                          value={pestReport.notes}
                          onChange={(e) => setPestReport({ ...pestReport, notes: e.target.value })}
                          placeholder="Provide details about infected leaves, approximate area, or visible spore density..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 text-xs font-semibold dark:bg-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                        />
                      </div>
                      <button
                        onClick={() => {
                          setPestSubmitted(true);
                          setAiLogs(prev => [
                            `[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] reported ${pestReport.pestType} in ${pestReport.barangay}`,
                            ...prev
                          ]);
                        }}
                        className="w-full py-3 bg-rose-600 text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/25 active:scale-[0.98] cursor-pointer"
                      >
                        Submit Regional Alert
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* 2. REGISTER NEW CROP MODAL */}
              {activeModal === "crop" && (
                <>
                  {cropSubmitted ? (
                    <div className="text-center py-6 space-y-3">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-950/40">
                        <Check className="w-6 h-6" />
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">New Crop Variety Registered</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        The agricultural twin simulator model is calculating specific optimal moisture/temp curves.
                      </p>
                      <button
                        onClick={() => setActiveModal(null)}
                        className="mt-2 px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-black uppercase cursor-pointer"
                      >
                        Dismiss Modal
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-[11px] text-slate-400">
                        Input crop metadata to begin monitoring specific soil hydration thresholds and optimal harvesting parameters.
                      </p>
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Crop Variety Name</label>
                        <input 
                          type="text"
                          value={newCrop.name}
                          onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
                          placeholder="e.g. NSIC Rc222 (Tubigan rice)"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 text-xs font-bold dark:bg-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Crop Category</label>
                        <select 
                          value={newCrop.category}
                          onChange={(e) => setNewCrop({ ...newCrop, category: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 text-xs font-bold dark:bg-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        >
                          <option value="Rice (Palay)">Rice (Palay)</option>
                          <option value="Sweet Corn">Sweet Corn (Mais)</option>
                          <option value="Saba Banana">Saba Banana</option>
                          <option value="Legumes">Legumes / Beans</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Hectares Planted</label>
                          <input 
                            type="number"
                            step="0.1"
                            value={newCrop.hectares}
                            onChange={(e) => setNewCrop({ ...newCrop, hectares: e.target.value })}
                            placeholder="e.g. 1.2"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 text-xs font-bold dark:bg-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Target Barangay</label>
                          <input 
                            type="text"
                            value={newCrop.barangay}
                            onChange={(e) => setNewCrop({ ...newCrop, barangay: e.target.value })}
                            placeholder="e.g. Batonlapoc"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 text-xs font-bold dark:bg-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setCropSubmitted(true);
                          setAiLogs(prev => [
                            `[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] registered new crop ${newCrop.name} in ${newCrop.barangay}`,
                            ...prev
                          ]);
                        }}
                        className="w-full py-3 bg-emerald-600 text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/25 active:scale-[0.98] cursor-pointer"
                      >
                        Begin Monitoring Routine
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* 3. UPLOAD FIELD PHOTO */}
              {activeModal === "photo" && (
                <div className="space-y-4">
                  <p className="text-[11px] text-slate-400 text-center">
                    Upload a high-resolution photo of crops or soil under direct sunlight to trigger computer-vision diagnostics for nitrogen levels or pest anomalies.
                  </p>
                  <div className="border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl p-8 text-center bg-slate-50/50 dark:bg-slate-950/20 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-colors">
                    <span className="text-3xl block mb-2">📸</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Drag & Drop crop image here</span>
                    <span className="text-[10px] text-slate-400 block mt-1">Supports JPEG, PNG up to 8MB</span>
                  </div>
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      setAiLogs(prev => [
                        `[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] received computer-vision field photograph`,
                        ...prev
                      ]);
                    }}
                    className="w-full py-3 bg-blue-600 text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Simulate Upload Completion
                  </button>
                </div>
              )}

              {/* 4. ASK SENTINEL AI ASSISTANT (CHAT) */}
              {activeModal === "ai" && (
                <div className="space-y-4">
                  <p className="text-[11px] text-slate-400">
                    Ask real questions about irrigation, soil diagnostics, fertilizer schedules, or regional Zambales market forecasts.
                  </p>
                  
                  {/* Chat logs */}
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl space-y-3 h-[200px] overflow-y-auto border border-slate-100 dark:border-white/5">
                    {aiChatResponses.map((msg, idx) => (
                      <div key={idx} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">
                          {msg.role === "user" ? "You (Sam)" : "Sentinel Assistant"}
                        </span>
                        <div className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed max-w-[85%] ${
                          msg.role === "user"
                            ? "bg-emerald-600 text-white"
                            : "bg-white border border-slate-200/80 text-slate-800 dark:bg-slate-900 dark:border-white/5 dark:text-white"
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isAiTyping && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                        <span>Sentinel thinking...</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={aiChatQuery}
                      onChange={(e) => setAiChatQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && aiChatQuery.trim()) {
                          const userMsg = aiChatQuery;
                          setAiChatQuery("");
                          setAiChatResponses(prev => [...prev, { role: "user", text: userMsg }]);
                          setIsAiTyping(true);
                          
                          setTimeout(() => {
                            let responseText = "Understood, Sam. I am analyzing the regional Zambales agricultural twin telemetry to calculate your answer. All variables look stable.";
                            if (userMsg.toLowerCase().includes("rice") || userMsg.toLowerCase().includes("palay")) {
                              responseText = "NSIC Rc222 (Tubigan) Rice leaf Rust susceptibility is currently low due to wind shearing and dry conditions. Soil moisture is optimal at 63%. No extra irrigation needed.";
                            } else if (userMsg.toLowerCase().includes("market") || userMsg.toLowerCase().includes("price")) {
                              responseText = "Palay farmgate prices in Botolan are currently holding at ₱19.50/kg, while Corn is steady at ₱17.20/kg. Retail remains favorable.";
                            }
                            setIsAiTyping(false);
                            setAiChatResponses(prev => [...prev, { role: "assistant", text: responseText }]);
                            setAiLogs(prev => [
                              `[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] answered query: "${userMsg.slice(0, 20)}..."`,
                              ...prev
                            ]);
                          }, 1000);
                        }
                      }}
                      placeholder="Ask something (e.g. How is the rice leaf rust risk?)..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 text-xs font-semibold dark:bg-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <button
                      onClick={() => {
                        if (!aiChatQuery.trim()) return;
                        const userMsg = aiChatQuery;
                        setAiChatQuery("");
                        setAiChatResponses(prev => [...prev, { role: "user", text: userMsg }]);
                        setIsAiTyping(true);
                        
                        setTimeout(() => {
                          let responseText = "Understood, Sam. I am analyzing the regional Zambales agricultural twin telemetry to calculate your answer. All variables look stable.";
                          if (userMsg.toLowerCase().includes("rice") || userMsg.toLowerCase().includes("palay")) {
                            responseText = "NSIC Rc222 (Tubigan) Rice leaf Rust susceptibility is currently low due to wind shearing and dry conditions. Soil moisture is optimal at 63%. No extra irrigation needed.";
                          } else if (userMsg.toLowerCase().includes("market") || userMsg.toLowerCase().includes("price")) {
                            responseText = "Palay farmgate prices in Botolan are currently holding at ₱19.50/kg, while Corn is steady at ₱17.20/kg. Retail remains favorable.";
                          }
                          setIsAiTyping(false);
                          setAiChatResponses(prev => [...prev, { role: "assistant", text: responseText }]);
                          setAiLogs(prev => [
                            `[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] answered query: "${userMsg.slice(0, 20)}..."`,
                            ...prev
                          ]);
                        }, 1000);
                      }}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase cursor-pointer hover:bg-emerald-700 transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}

              {/* 5. VIEW CURRENT ALERTS SYSTEM */}
              {activeModal === "alerts" && (
                <div className="space-y-4">
                  {activeAlerts.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs font-bold">
                      No active alerts. All fields optimal!
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {activeAlerts.map((alert) => (
                        <div key={alert.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 dark:bg-slate-950/40 dark:border-white/5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] font-black uppercase text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded dark:bg-slate-800">{alert.field}</span>
                            <span className="text-[8px] font-black uppercase text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded dark:bg-rose-950/40">{alert.severity}</span>
                          </div>
                          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">{alert.title}</h4>
                          <p className="text-[10px] text-slate-500 leading-normal">{alert.message}</p>
                          <button
                            onClick={() => {
                              alert.onAction();
                              setActiveModal(null);
                            }}
                            className="w-full mt-2 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-[9px] font-black uppercase cursor-pointer"
                          >
                            Execute Action: {alert.actionLabel}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}

      {/* Powered by / Integrity declaration */}
      <div className="text-center text-[10px] font-mono text-slate-400 py-6 border-t border-slate-100 dark:border-white/5">
        <span>SCOS (Smart Community Organizers System) • Powered by Sammium Research Labs • "Lead with Compassion. Code with Purpose."</span>
      </div>

    </motion.div>
  );
}
