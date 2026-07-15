import React, { useState, useEffect, useRef } from "react";
import { 
  Cpu, 
  Activity, 
  Shield, 
  Key, 
  Database, 
  RefreshCw, 
  AlertTriangle, 
  Users, 
  Terminal, 
  Code, 
  Settings, 
  Share2, 
  Layers, 
  Sliders, 
  Play, 
  RotateCcw, 
  Flame, 
  CheckCircle, 
  Clock, 
  Globe, 
  Zap, 
  Network, 
  BookOpen, 
  UserCheck, 
  Trash2, 
  Send, 
  HelpCircle, 
  HardDrive, 
  FileCode, 
  Check, 
  Info,
  Smartphone,
  Tablet,
  Monitor,
  Wifi,
  WifiOff,
  User,
  GitBranch,
  X,
  Plus,
  Brain,
  Wrench
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { sounds } from "../utils/sounds";

interface EnterpriseSuiteProps {
  isRgbOverdrive: boolean;
  operatorName: string;
}

// Simulated active logs seed
const INITIAL_AUDIT_LOGS = [
  { time: "09:30", operator: "Sam", action: "Started AI Simulation Core", type: "SYSTEM", severity: "info" },
  { time: "09:45", operator: "Maria", action: "Approved Robotics Research", type: "SECURITY", severity: "success" },
  { time: "10:10", operator: "System", action: "Database Indexing Completed", type: "DATABASE", severity: "info" },
  { time: "10:35", operator: "Samy_Dev", action: "API Gateway rate limit refreshed", type: "NETWORK", severity: "info" },
  { time: "11:02", operator: "System", action: "AES-256 Verification check succeeded", type: "SECURITY", severity: "success" },
  { time: "11:15", operator: "Sam", action: "Launched drone cluster orbital scan", type: "AI", severity: "warning" },
];

export const EnterpriseSuite: React.FC<EnterpriseSuiteProps> = ({ isRgbOverdrive, operatorName }) => {
  // Global View Mode within the Enterprise Suite
  const [activeSubTab, setActiveSubTab] = useState<"arch-perf" | "ai-security" | "analytics-logs" | "collaboration-docs" | "devops-testing">("arch-perf");
  
  // Developer Mode overlay state (can also be toggled with Ctrl + Shift + D)
  const [isDevConsoleOpen, setIsDevConsoleOpen] = useState(false);
  
  // --- 11. User Roles (RBAC) ---
  type UserRole = "Super Admin" | "Researcher" | "Engineer" | "Analyst" | "Guest";
  const [currentRole, setCurrentRole] = useState<UserRole>("Super Admin");
  
  // --- 15. Accessibility Tools State ---
  const [fontSizeScale, setFontSizeScale] = useState<"sm" | "base" | "lg" | "xl">("base");
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [screenReaderText, setScreenReaderText] = useState("Sentinel OS Enterprise Command center active. Selected Role: Super Admin.");

  // --- 8. Offline & PWA Simulator State ---
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);
  const [backgroundSyncQueue, setBackgroundSyncQueue] = useState<string[]>([]);
  const [pushedNotifications, setPushedNotifications] = useState<{ id: number, text: string, time: string }[]>([]);

  // --- 9. Reliability & Connection Loss State ---
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(1);
  const [hasConnectionFailed, setHasConnectionFailed] = useState(false);

  // --- 10. Real-time WebSockets Stream Simulator ---
  const [webSocketLog, setWebSocketLog] = useState<{ id: number; message: string; timestamp: string; channel: string }[]>([]);
  const [wsConnected, setWsConnected] = useState(true);

  // --- 2. Performance & Web Worker Simulator ---
  const [isAILabLoaded, setIsAILabLoaded] = useState(true);
  const [isRoboticsLoaded, setIsRoboticsLoaded] = useState(false);
  const [isGlobeLoaded, setIsGlobeLoaded] = useState(false);
  const [isWebWorkerRunning, setIsWebWorkerRunning] = useState(false);
  const [webWorkerProgress, setWebWorkerProgress] = useState(0);
  const [threadCalculationResult, setThreadCalculationResult] = useState<string | null>(null);
  const [isInterfaceFrozenDemo, setIsInterfaceFrozenDemo] = useState(false);

  // --- 3. AI Accuracy Pipeline State ---
  const [validationInputQuery, setValidationInputQuery] = useState("Scan tectonic fault sectors");
  const [pipelineStep, setPipelineStep] = useState<number>(-1);
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([]);
  const [computedConfidence, setComputedConfidence] = useState<number | null>(null);

  // --- 4. Security Panel State ---
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(30); // in minutes
  const [isScanningThreats, setIsScanningThreats] = useState(false);
  const [threatStatus, setThreatStatus] = useState<"SAFE" | "CHECKING" | "ALERT">("SAFE");
  const [firewallOnline, setFirewallOnline] = useState(true);
  const [securityLogs, setSecurityLogs] = useState<string[]>([
    "Firewall activated in cluster region EAST-A",
    "SSL/TLS AES-256 certificate handshake verified",
  ]);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState("");

  // --- 5. Telemetry Analytics Live Feed ---
  const [activeUsersCount, setActiveUsersCount] = useState(142);
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [serverLoad, setServerLoad] = useState(42);
  const [ramUsage, setRamUsage] = useState(5.8); // GB

  // --- 7. Viewport Simulator ---
  const [selectedViewportSim, setSelectedViewportSim] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // --- 12. Audit Trail State ---
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [auditFilter, setAuditFilter] = useState("ALL");
  const [searchAuditTerm, setSearchAuditTerm] = useState("");

  // --- 13. Version History & Rollback State ---
  const [sysVersion, setSysVersion] = useState("v6.0.4");
  const [isRollingBack, setIsRollingBack] = useState(false);
  const [rollbackProgress, setRollbackProgress] = useState(0);
  const [versionHistory, setVersionHistory] = useState([
    { version: "v6.0.4", date: "2026-07-01", desc: "Added high-contrast rendering algorithms & cognitive sync" },
    { version: "v6.0.2", date: "2026-06-15", desc: "Integrated cellular automata models & VR HUD system" },
    { version: "v5.9.1", date: "2026-05-10", desc: "Implemented quantum orbit calculation layers" },
  ]);

  // --- 14. Collaboration Space State ---
  const [collaborativeTasks, setCollaborativeTasks] = useState([
    { id: 1, title: "Optimize satellite bandwidth payload", assignedTo: "Maria", status: "In Progress" },
    { id: 2, title: "Audit quantum firewall certificates", assignedTo: "Sam", status: "Review" },
    { id: 3, title: "Calibrate cellular matrix density", assignedTo: "Samy_Dev", status: "Done" },
  ]);
  const [teamComments, setTeamComments] = useState([
    { author: "Maria", text: "The new drone coordinates are loaded into cluster 3.", time: "10:14" },
    { author: "Sam", text: "Excellent work! I will run the telemetry verification now.", time: "10:18" },
  ]);
  const [newCommentText, setNewCommentText] = useState("");
  const [isFileDragging, setIsFileDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>(["architecture_v6_blueprint.pdf", "sensor_stream_calib.json"]);

  // --- 17. DevOps CI/CD Pipeline Simulator State ---
  const [ciStage, setCiStage] = useState<"idle" | "lint" | "test" | "build" | "deploy" | "success" | "fail">("idle");
  const [ciLogs, setCiLogs] = useState<string[]>([]);

  // --- 18. Sandbox Testing Studio State ---
  const [activeRunningTestType, setActiveRunningTestType] = useState<"none" | "unit" | "integration" | "e2e" | "performance">("none");
  const [testConsoleOutput, setTestConsoleOutput] = useState<string[]>([]);

  // --- 19. Scalability Planner State ---
  const [scalabilityUserSlider, setScalabilityUserSlider] = useState(1000);

  // --- Developer mode metrics (Ctrl+Shift+D) ---
  const [fpsVal, setFpsVal] = useState(60);

  // Monitor FPS in developer mode
  useEffect(() => {
    let lastTime = performance.now();
    let frameCount = 0;
    let animId: number;

    const calcFps = () => {
      frameCount++;
      const now = performance.now();
      if (now >= lastTime + 1000) {
        setFpsVal(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(calcFps);
    };

    animId = requestAnimationFrame(calcFps);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Set up Ctrl+Shift+D global event handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.code === "KeyD") {
        e.preventDefault();
        sounds.playOverdrive();
        setIsDevConsoleOpen((prev) => !prev);
        setScreenReaderText(isDevConsoleOpen ? "Developer engineering console closed." : "Developer engineering console activated.");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDevConsoleOpen]);

  // Generate live performance analytics
  useEffect(() => {
    const initialData = Array.from({ length: 15 }, (_, i) => ({
      time: `${i + 1}:00`,
      latency: Math.round(20 + Math.random() * 30),
      errorRate: parseFloat((Math.random() * 2).toFixed(2)),
      aiQueries: Math.round(100 + Math.random() * 150),
    }));
    setAnalyticsData(initialData);

    const interval = setInterval(() => {
      // Simulate live jittering metrics
      setActiveUsersCount((prev) => Math.max(10, prev + Math.round(Math.random() * 10 - 5)));
      setServerLoad((prev) => Math.min(100, Math.max(10, prev + Math.round(Math.random() * 8 - 4))));
      setRamUsage((prev) => parseFloat(Math.min(16.0, Math.max(2.0, prev + (Math.random() * 0.4 - 0.2))).toFixed(2)));

      setAnalyticsData((prev) => {
        const nextTime = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
        const newArr = [...prev.slice(1), {
          time: nextTime,
          latency: Math.round(20 + Math.random() * 30),
          errorRate: parseFloat((Math.random() * 2).toFixed(2)),
          aiQueries: Math.round(100 + Math.random() * 150),
        }];
        return newArr;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // WebSocket Live Log stream
  useEffect(() => {
    if (!wsConnected) return;

    const wsChannels = ["DRONE_TELEM", "SYS_ALIVE", "GEOGRAPHIC_SYNC", "CHAT_MESSAGE", "AUDIT_TRACK"];
    const wsMessages = [
      "Drone Fleet 3 sector 5 payload altitude synchronized to 150m",
      "Gateway node check successful: Latency 14ms",
      "Earth Digital Twin matrix cellular densities recalculated successfully",
      "Comment posted in Research channel by Maria: '@Sam check the orbital line coordinates'",
      "Security audit thread running AES-256 system structural checks"
    ];

    const wsInterval = setInterval(() => {
      const idx = Math.floor(Math.random() * wsMessages.length);
      const newLog = {
        id: Date.now(),
        message: wsMessages[idx],
        timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
        channel: wsChannels[idx]
      };
      setWebSocketLog((prev) => [newLog, ...prev.slice(0, 19)]);
    }, 2500);

    return () => clearInterval(wsInterval);
  }, [wsConnected]);

  // Simulate a Connection Loss and Automated Reconnection (Milestone 9)
  const triggerConnectionDrop = () => {
    sounds.playError();
    setIsOfflineMode(true);
    setHasConnectionFailed(true);
    setWsConnected(false);
    setIsReconnecting(true);
    setRetryAttempt(1);
    setScreenReaderText("Sentinel Connection dropped. Reconnection mechanism activated.");

    // Sequence of retries
    const attempt1 = setTimeout(() => {
      sounds.playClick();
      setRetryAttempt(2);
    }, 2000);

    const attempt2 = setTimeout(() => {
      sounds.playClick();
      setRetryAttempt(3);
    }, 4000);

    const attempt3 = setTimeout(() => {
      sounds.playOverdrive();
      setRetryAttempt(4);
    }, 6000);

    const successHandshake = setTimeout(() => {
      sounds.playLaser();
      setIsReconnecting(false);
      setHasConnectionFailed(false);
      setIsOfflineMode(false);
      setWsConnected(true);
      setScreenReaderText("Sentinel reconnected successfully.");
    }, 8000);

    return () => {
      clearTimeout(attempt1);
      clearTimeout(attempt2);
      clearTimeout(attempt3);
      clearTimeout(successHandshake);
    };
  };

  // Web Worker simulator - Multi-threaded or heavy performance task (Milestone 2)
  const runOrbitalWebWorker = () => {
    if (isWebWorkerRunning) return;
    sounds.playClick();
    setIsWebWorkerRunning(true);
    setWebWorkerProgress(0);
    setThreadCalculationResult(null);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setWebWorkerProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsWebWorkerRunning(false);
        setThreadCalculationResult("ORBIT_COORDINATES_VERIFIED_74.821_X_92.304_Y");
        sounds.playLaser();
        
        // Push background sync or system log
        setBackgroundSyncQueue(prev => [...prev, `Sync_Orbit_${Date.now()}`]);
      }
    }, 150);
  };

  // Demonstrate UI freeze when doing intensive computations on Main Thread vs Web Workers
  const runMainThreadFreezeDemo = () => {
    sounds.playError();
    setIsInterfaceFrozenDemo(true);
    setScreenReaderText("Warning: UI threat test freezing interface for 2.5 seconds.");
    setTimeout(() => {
      setIsInterfaceFrozenDemo(false);
      sounds.playOverdrive();
    }, 2500);
  };

  // AI Accuracy pipeline step-by-step simulator (Milestone 3)
  const triggerAIEvaluationPipeline = () => {
    sounds.playClick();
    setPipelineStep(0);
    setPipelineLogs([]);
    setComputedConfidence(null);

    const stages = [
      { step: 1, text: "[VALIDATION]: Analyzing input search queries and parameters...", time: 1000 },
      { step: 2, text: "[KNOWLEDGE_BASE]: Retrieving verified historical sector data & geological maps...", time: 2200 },
      { step: 3, text: "[AI_MODEL_INFERENCE]: Gemini-2.5-Flash generating spatial predictive parameters...", time: 3500 },
      { step: 4, text: "[FACT_CHECKER]: Cross-referencing against real-time telemetry grid sensors...", time: 4800 },
      { step: 5, text: "[COMPLETE]: Response signed with high Confidence Score.", time: 6000 }
    ];

    stages.forEach((stage, index) => {
      setTimeout(() => {
        setPipelineStep(index + 1);
        setPipelineLogs((prev) => [...prev, stage.text]);
        sounds.playLaser();
        if (index === stages.length - 1) {
          // Final confidence score
          setComputedConfidence(parseFloat((94 + Math.random() * 5.8).toFixed(2)));
        }
      }, stage.time);
    });
  };

  // Multi-Factor Authentication Verification Flow Simulator (Milestone 4)
  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    sounds.playClick();
    setResetStatus("SENDING");
    setTimeout(() => {
      setResetStatus("SENT");
      sounds.playLaser();
    }, 1500);
  };

  // Drag and drop mock files (Milestone 14)
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsFileDragging(true);
  };

  const handleDragLeave = () => {
    setIsFileDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsFileDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      sounds.playLaser();
      const files: string[] = [];
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        files.push(e.dataTransfer.files[i].name);
      }
      setUploadedFiles((prev) => [...prev, ...files]);
    }
  };

  // Trigger DevOps Pipeline Simulation (Milestone 17)
  const triggerDevOpsDeployment = () => {
    if (ciStage !== "idle" && ciStage !== "success" && ciStage !== "fail") return;
    sounds.playClick();
    setCiStage("lint");
    setCiLogs(["[PIPELINE START] Instantiating Cloud Build Environment...", "[LINTING] Checking TypeScript syntax and ESLint formatting..."]);

    setTimeout(() => {
      setCiStage("test");
      setCiLogs((prev) => [...prev, "✓ Linter passed cleanly.", "[TESTING] Running 14 integration and unit test sweeps..."]);
      sounds.playLaser();
    }, 2000);

    setTimeout(() => {
      setCiStage("build");
      setCiLogs((prev) => [...prev, "✓ 14 of 14 tests completed: 100% GREEN.", "[BUILD] Packing bundles using esbuild / vite. NODE_ENV=production..."]);
      sounds.playLaser();
    }, 4000);

    setTimeout(() => {
      setCiStage("deploy");
      setCiLogs((prev) => [...prev, "✓ Production bundle size: 284 KB.", "[DEPLOYMENT] Pushing docker container layers to Google Cloud Run registry..."]);
      sounds.playOverdrive();
    }, 6000);

    setTimeout(() => {
      setCiStage("success");
      setCiLogs((prev) => [...prev, "✓ Container instance active at URL: sentinel-os-cloud-run.", "[DEVOPS SYSTEM CHECK] Deployment Successful. 100% online."]);
      sounds.playLaser();
    }, 8500);
  };

  // Sandbox Testing Studio (Milestone 18)
  const runSandboxTests = (type: "unit" | "integration" | "e2e" | "performance") => {
    setActiveRunningTestType(type);
    sounds.playClick();
    setTestConsoleOutput([`[TEST SUITE]: Initiating ${type.toUpperCase()} tests...`]);

    const outputs = {
      unit: [
        "Analyzing /src/utils/sounds.ts test mocks...",
        "✓ sounds.playBeep oscillator initialization (0.01ms)",
        "✓ sounds.startAmbientHum filters and gains (0.04ms)",
        "✓ SaoLogin username validator (0.02ms)",
        "✓ AIAgentLaboratory model selection mapping (0.12ms)",
        "✓ Test Suite completed. 5 tests passed, 0 failed."
      ],
      integration: [
        "Testing SentinelOS Redux/Local state sync...",
        "✓ App component binds correctly to YuiHologram props (2.4ms)",
        "✓ VrHudOverlay synchronizes to VR Headset simulation events (4.1ms)",
        "✓ SystemStatus updates trigger UI state render ticks (1.5ms)",
        "✓ Test Suite completed. 4 integration targets verified."
      ],
      e2e: [
        "Launching Headless Chrome simulation nodes...",
        "✓ User fills in credentials SAMMIUM-OS-ACCESS (142ms)",
        "✓ Portal loads CinematicBoot stream sequence (1500ms)",
        "✓ Operator triggers Overdrive overclock modes (310ms)",
        "✓ Active station changes load corresponding bento grids (420ms)",
        "✓ E2E completed successfully in 2.373 seconds."
      ],
      performance: [
        "Measuring FPS memory leaking and latency margins...",
        "✓ DOM Element density footprint: 142 components",
        "✓ Garbage collector memory recovery heap: 14.8 MB",
        "✓ Frame draw latency: 16.6ms average (60 FPS)",
        "✓ Web Worker heavy load calculations: 120ms thread offload",
        "✓ Performance benchmarks verified. S-Tier score."
      ]
    };

    outputs[type].forEach((line, index) => {
      setTimeout(() => {
        setTestConsoleOutput((prev) => [...prev, line]);
        sounds.playLaser();
        if (index === outputs[type].length - 1) {
          setActiveRunningTestType("none");
        }
      }, (index + 1) * 600);
    });
  };

  // Filter logs
  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesFilter = auditFilter === "ALL" || log.type === auditFilter;
    const matchesSearch = log.operator.toLowerCase().includes(searchAuditTerm.toLowerCase()) || 
                          log.action.toLowerCase().includes(searchAuditTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div 
      id="enterprise-os-suite" 
      className={`p-6 rounded-2xl border bg-slate-900/95 shadow-2xl relative transition-all duration-300 ${
        isHighContrast ? "border-white bg-black text-white" : "border-slate-800 bg-slate-950/95"
      }`}
    >
      {/* Immersive Glass Neon Header Banner */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 via-pink-500 to-cyan-500" />

      {/* Connection Failure Status Screen Alert */}
      <AnimatePresence>
        {isReconnecting && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-center p-8 text-center"
          >
            <AlertTriangle className="w-16 h-16 text-orange-500 animate-bounce mb-4" />
            <h2 className="text-2xl font-mono font-bold tracking-wider text-orange-400">
              SENTINEL OS PORTAL IS RECONNECTING...
            </h2>
            <p className="text-xs font-mono text-slate-400 max-w-md mt-2">
              The neural gateway detected a connection fluctuation packet drop. Initializing secure fallback recovery mechanisms.
            </p>
            <div className="mt-6 p-4 rounded-xl border border-orange-500/20 bg-orange-500/5 font-mono text-xs max-w-sm w-full flex flex-col gap-2">
              <div className="flex justify-between">
                <span>Attempt count:</span>
                <span className="text-orange-400 font-bold">{retryAttempt} of 5</span>
              </div>
              <div className="flex justify-between">
                <span>Gateway state:</span>
                <span className="text-yellow-400 font-bold animate-pulse">RE-ESTABLISHING SHAKE</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded overflow-hidden mt-1 border border-slate-800">
                <div 
                  className="h-full bg-orange-500 transition-all duration-500"
                  style={{ width: `${(retryAttempt / 4) * 100}%` }}
                />
              </div>
            </div>
            <p className="text-[10px] font-mono text-slate-500 mt-6 animate-pulse">
              Please wait. Transparent fail-safe loop will revive terminal shortly.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Freeze Threat Demo Overlay */}
      <AnimatePresence>
        {isInterfaceFrozenDemo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/60 z-50 pointer-events-auto flex flex-col items-center justify-center backdrop-blur-[1px]"
          >
            <div className="p-4 bg-red-950/90 border border-red-500 rounded-xl text-center flex flex-col items-center gap-2 max-w-xs shadow-[0_0_30px_rgba(239,68,68,0.4)]">
              <span className="animate-spin text-red-500">⚙</span>
              <span className="text-red-500 font-bold font-mono text-xs">[MAIN_THREAD_BLOCKED]</span>
              <p className="text-[10px] text-red-400 font-mono">
                Running intensive orbital coordinate computation on user-interface thread. Frame rate locked. Notice zero buttons responding.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header and User Role Selector */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-orange-500" />
            <h2 className={`text-lg font-mono font-bold tracking-tight text-white uppercase ${
              fontSizeScale === "lg" ? "text-xl" : fontSizeScale === "xl" ? "text-2xl" : "text-lg"
            }`}>
              SENTINEL PLATFORM ENTERPRISE OS
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Startup Suite Milestones 1 - 20 // Fully interactive developer diagnostics sandbox
          </p>
        </div>

        {/* User Role Selection Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-500 font-bold px-2">ROLE_ACCESS:</span>
            {(["Super Admin", "Researcher", "Engineer", "Analyst", "Guest"] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => {
                  sounds.playClick();
                  setCurrentRole(role);
                  setScreenReaderText(`Access Role switched to ${role}. Privileges adapted.`);
                }}
                className={`px-2 py-1 rounded text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                  currentRole === role
                    ? "bg-orange-500 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                {role.split(" ")[0]}
              </button>
            ))}
          </div>

          {/* Quick Access to Dev Console Mode */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsDevConsoleOpen(!isDevConsoleOpen);
            }}
            className="px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer animate-pulse"
            title="Open Developer Console (Ctrl + Shift + D)"
          >
            <Code className="w-3.5 h-3.5" />
            <span>DEV CONSOLE</span>
          </button>
        </div>
      </div>

      {/* Main Grid Layout containing Side Navigation Tabs and active subpanel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Sub Navigation Bar */}
        <div className="lg:col-span-3 flex flex-col gap-2">
          {[
            { id: "arch-perf", label: "🏗 Architecture & Perf", icon: Layers },
            { id: "ai-security", label: "🔒 AI Accuracy & Security", icon: Shield },
            { id: "analytics-logs", label: "📊 Analytics & Audit Trails", icon: Activity },
            { id: "collaboration-docs", label: "🤝 Collaboration & Manuals", icon: Users },
            { id: "devops-testing", label: "🚀 DevOps & Sandbox Tests", icon: Terminal }
          ].map((subTab) => {
            const SubIcon = subTab.icon;
            const isSel = activeSubTab === subTab.id;
            return (
              <button
                key={subTab.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveSubTab(subTab.id as any);
                }}
                className={`p-3.5 rounded-xl border text-left transition-all font-mono font-bold text-xs uppercase flex items-center gap-3 cursor-pointer ${
                  isSel
                    ? "bg-slate-900 border-orange-500/50 text-white shadow-md shadow-orange-500/5"
                    : "bg-slate-950/40 border-slate-850 text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <SubIcon className={`w-4 h-4 ${isSel ? "text-orange-500" : "text-slate-500"}`} />
                <span>{subTab.label}</span>
              </button>
            );
          })}

          {/* Quick Accessibility Config Cards */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex flex-col gap-3 mt-4">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase border-b border-slate-900 pb-2 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-orange-500" /> 15. ACCESSIBILITY COMPLIANCE
            </span>
            
            {/* Font Scale slider */}
            <div className="flex flex-col gap-1 text-[10px] font-mono">
              <div className="flex justify-between text-slate-500">
                <span>FONT SCALE</span>
                <span className="text-orange-400 font-bold uppercase">{fontSizeScale}</span>
              </div>
              <div className="flex gap-1.5 mt-1">
                {(["sm", "base", "lg", "xl"] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => {
                      sounds.playClick();
                      setFontSizeScale(sz);
                    }}
                    className={`flex-1 py-1 rounded border text-center font-bold text-[9px] uppercase cursor-pointer ${
                      fontSizeScale === sz ? "bg-orange-500 text-white border-orange-400" : "bg-slate-900 border-slate-800 text-slate-400"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* High contrast switch */}
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-500">HIGH CONTRAST</span>
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsHighContrast(!isHighContrast);
                }}
                className={`px-2 py-0.5 rounded text-[8px] font-bold cursor-pointer ${
                  isHighContrast ? "bg-white text-black" : "bg-slate-900 text-slate-400 border border-slate-800"
                }`}
              >
                {isHighContrast ? "ACTIVE" : "DISABLED"}
              </button>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-500">REDUCED MOTION</span>
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsReducedMotion(!isReducedMotion);
                }}
                className={`px-2 py-0.5 rounded text-[8px] font-bold cursor-pointer ${
                  isReducedMotion ? "bg-orange-500 text-white" : "bg-slate-900 text-slate-400 border border-slate-800"
                }`}
              >
                {isReducedMotion ? "ACTIVE" : "DISABLED"}
              </button>
            </div>

            {/* Screen Reader Aria live visual block */}
            <div className="p-2 bg-slate-900 border border-slate-800 rounded text-[9px] font-mono text-slate-400 flex flex-col gap-1 leading-normal">
              <span className="text-[7px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ARIA SCREEN READER AUDIO SPOKEN DATA:
              </span>
              <span>"{screenReaderText}"</span>
            </div>
          </div>
        </div>

        {/* Sub Panel Content Container */}
        <div className="lg:col-span-9">
          
          {/* Subpanel 1: Architecture & Performance */}
          {activeSubTab === "arch-perf" && (
            <div className="flex flex-col gap-6">
              
              {/* --- 1. Modular System Architecture Flowchart Component --- */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
                <h3 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-orange-500" /> 1. Modular Platform System Architecture Map
                </h3>
                <p className="text-[11px] text-slate-400 font-mono mb-4">
                  Sentinel OS is mapped out as an enterprise platform. Click nodes to run interactive latency diagnostics ping checks.
                </p>

                {/* Horizontal flow line of modules */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center">
                  {[
                    { name: "Client (React)", role: "Front UI", port: "3000", state: "Active" },
                    { name: "API Gateway", role: "Routing", port: "443", state: "Load-balanced" },
                    { name: "Auth Service", role: "Biometric MFA", port: "8081", state: "Secured" },
                    { name: "AI Inference Service", role: "Gemini Engine", port: "8082", state: "Processing" },
                    { name: "Analytics Agent", role: "Telemetry DB", port: "8083", state: "Aggregating" },
                    { name: "Notification Server", role: "WS/SSE channels", port: "8084", state: "Syncing" },
                    { name: "NoSQL DB Cluster", role: "Firestore Core", port: "5001", state: "Persistent" },
                    { name: "Cloud Blob Storage", role: "Samm-Bucket", port: "443", state: "AES-Encrypted" },
                    { name: "Health Monitoring", role: "Sys Diagnostics", port: "8085", state: "Observing" }
                  ].map((node, idx) => (
                    <button
                      key={node.name}
                      onClick={() => {
                        sounds.playLaser();
                        setScreenReaderText(`Pinging Node: ${node.name} on Port ${node.port}. Status ${node.state}.`);
                      }}
                      className="p-2.5 rounded-lg border border-slate-850 hover:border-orange-500/40 bg-slate-900/60 transition-all text-left flex flex-col gap-1 cursor-pointer hover:bg-slate-900"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-white font-bold tracking-tight">{node.name}</span>
                        <span className="text-[8px] font-mono text-slate-500 font-bold">#{idx + 1}</span>
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
                        <span>{node.role}</span>
                        <span className="text-[8px] bg-slate-950 px-1 py-0.5 rounded text-emerald-400 border border-slate-800">
                          {node.port}
                        </span>
                      </div>
                      <span className="text-[8px] font-mono text-orange-400 mt-1 uppercase font-bold flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-orange-400 animate-ping" />
                        {node.state}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* --- 2. Performance Core: Web Workers, Code Splitting & Lazy Load simulation --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Lazy Load Modules and Code Splitting Simulator */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex flex-col gap-3">
                  <h3 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider border-b border-slate-900 pb-2 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-orange-500" /> 2. Feature-Bundle Lazy Loading status
                  </h3>
                  
                  {/* AI Lab bundle */}
                  <div className="p-2.5 rounded bg-slate-900/60 border border-slate-850 flex items-center justify-between text-xs font-mono">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-white font-bold">AILab_Simulation_Suite</span>
                      <span className="text-[9px] text-slate-500">Size: 42 KB // Dynamic Split Chunk</span>
                    </div>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setIsAILabLoaded(!isAILabLoaded);
                      }}
                      className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer uppercase ${
                        isAILabLoaded ? "bg-emerald-500/10 border border-emerald-500/40 text-emerald-400" : "bg-slate-950 text-slate-400 border border-slate-800"
                      }`}
                    >
                      {isAILabLoaded ? "LOADED // CHUNK_READY" : "EVICTED"}
                    </button>
                  </div>

                  {/* Robotics */}
                  <div className="p-2.5 rounded bg-slate-900/60 border border-slate-850 flex items-center justify-between text-xs font-mono">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-white font-bold">Robotics_Swarm_Core</span>
                      <span className="text-[9px] text-slate-500">Size: 112 KB // Heavy Kinetic Asset</span>
                    </div>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setIsRoboticsLoaded(!isRoboticsLoaded);
                      }}
                      className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer uppercase ${
                        isRoboticsLoaded ? "bg-emerald-500/10 border border-emerald-500/40 text-emerald-400" : "bg-slate-950 text-slate-400 border border-slate-800"
                      }`}
                    >
                      {isRoboticsLoaded ? "LOADED // CHUNK_READY" : "LOAD ON DEMAND"}
                    </button>
                  </div>

                  {/* Globe */}
                  <div className="p-2.5 rounded bg-slate-900/60 border border-slate-850 flex items-center justify-between text-xs font-mono">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-white font-bold">DigitalTwin_EarthGlobe</span>
                      <span className="text-[9px] text-slate-500">Size: 480 KB // WebGL Physics Bundle</span>
                    </div>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setIsGlobeLoaded(!isGlobeLoaded);
                      }}
                      className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer uppercase ${
                        isGlobeLoaded ? "bg-emerald-500/10 border border-emerald-500/40 text-emerald-400" : "bg-slate-950 text-slate-400 border border-slate-800"
                      }`}
                    >
                      {isGlobeLoaded ? "LOADED // CHUNK_READY" : "LOAD ON DEMAND"}
                    </button>
                  </div>

                  <div className="p-2.5 bg-slate-900 rounded border border-slate-850 flex flex-col gap-1 text-[10px] font-mono">
                    <span className="text-slate-400 font-bold">IMAGE OPTIMIZATION RATIO</span>
                    <div className="flex items-center gap-4 text-slate-500 mt-1">
                      <span>Raw PNGs: 2.4 MB</span>
                      <span className="text-orange-400 font-bold">WebP/AVIF: 142 KB</span>
                      <span className="text-emerald-400 font-bold">(-94% Saving)</span>
                    </div>
                  </div>
                </div>

                {/* Multithreading and Web Workers Simulator */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex flex-col justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider border-b border-slate-900 pb-2 flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-orange-500" /> 2. Web Worker Multithreading Offloader
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-2 leading-relaxed">
                      Run heavy telemetry calculations. Using Web Workers ensures the main UI thread never freezes. Compare both models below.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 mt-2">
                    {/* Progress visualizer */}
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-850 flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-slate-400">Worker state:</span>
                        <span className="text-orange-400 font-bold">
                          {isWebWorkerRunning ? `PROCESSING ORBITS... ${webWorkerProgress}%` : "IDLE"}
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded border border-slate-800 overflow-hidden">
                        <div 
                          className="h-full bg-orange-500 transition-all duration-150"
                          style={{ width: `${webWorkerProgress}%` }}
                        />
                      </div>
                      {threadCalculationResult && (
                        <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase">
                          Result: {threadCalculationResult}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        onClick={runOrbitalWebWorker}
                        disabled={isWebWorkerRunning}
                        className="py-2.5 px-3 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:bg-slate-900 text-white font-bold font-mono text-xs uppercase cursor-pointer text-center"
                      >
                        Run in Web Worker
                      </button>
                      <button
                        onClick={runMainThreadFreezeDemo}
                        className="py-2.5 px-3 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-bold font-mono text-xs uppercase cursor-pointer text-center"
                      >
                        Freeze Main Thread
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* --- 7. Adaptive Responsive Simulator Panel --- */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
                <div className="flex justify-between items-center border-b border-slate-900 pb-2.5 mb-4">
                  <h3 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-orange-500" /> 7. Adaptive Viewport Wireframe Previewer
                  </h3>
                  
                  {/* Viewport simulation selector */}
                  <div className="flex gap-1.5 bg-slate-900 p-1 rounded-lg">
                    {[
                      { id: "desktop", icon: Monitor, text: "Desktop" },
                      { id: "tablet", icon: Tablet, text: "Tablet" },
                      { id: "mobile", icon: Smartphone, text: "Mobile" }
                    ].map((sim) => {
                      const SimIcon = sim.icon;
                      return (
                        <button
                          key={sim.id}
                          onClick={() => {
                            sounds.playClick();
                            setSelectedViewportSim(sim.id as any);
                          }}
                          className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer ${
                            selectedViewportSim === sim.id ? "bg-orange-500 text-white" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <SimIcon className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{sim.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 font-mono mb-4 leading-relaxed">
                  Below is a visual mini mockup simulating how the system automatically restructuring elements based on the grid rules of the viewport.
                </p>

                {/* Simulated Device Frame Container */}
                <div className="flex justify-center p-4 bg-slate-900 rounded-xl border border-slate-850">
                  <motion.div 
                    animate={{ 
                      width: selectedViewportSim === "desktop" ? "100%" : selectedViewportSim === "tablet" ? "420px" : "280px" 
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className="p-3 bg-slate-950 rounded-xl border border-slate-800 shadow-inner flex flex-col gap-3 min-h-[142px] transition-all"
                  >
                    {/* Simulated OS header */}
                    <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-850 text-[8px] font-mono text-slate-400">
                      <span className="font-bold text-orange-400">📡 SENTINEL v6</span>
                      <div className="flex gap-2">
                        <span>CPU: 42%</span>
                        <span>MEM: 5.8GB</span>
                      </div>
                    </div>

                    {/* Simulated Body Grid */}
                    <div className={`grid gap-2 ${
                      selectedViewportSim === "desktop" ? "grid-cols-3" : "grid-cols-1"
                    }`}>
                      <div className="p-2.5 bg-slate-900 border border-slate-850 rounded text-[9px] font-mono">
                        <span className="text-orange-400 font-bold block mb-1">COGNITIVE MODULE</span>
                        <span>AI Inference engine parameters stable.</span>
                      </div>
                      <div className="p-2.5 bg-slate-900 border border-slate-850 rounded text-[9px] font-mono">
                        <span className="text-pink-400 font-bold block mb-1">ROBOTICS SWARM</span>
                        <span>Drone diagnostics link online.</span>
                      </div>
                      <div className="p-2.5 bg-slate-900 border border-slate-850 rounded text-[9px] font-mono">
                        <span className="text-emerald-400 font-bold block mb-1">GEO GRAPH</span>
                        <span>Twin Earth telemetry synchronizing.</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

            </div>
          )}

          {/* Subpanel 2: AI Accuracy & Security */}
          {activeSubTab === "ai-security" && (
            <div className="flex flex-col gap-6">
              
              {/* --- 3. AI Accuracy Pipeline Verification Module --- */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
                <h3 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider border-b border-slate-900 pb-2.5 mb-3 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-orange-500" /> 3. Sentinel AI Accuracy Pipeline & Fact-Checker
                </h3>
                <p className="text-[11px] text-slate-400 font-mono mb-4 leading-relaxed">
                  To prevent cognitive model hallucination, all queries are parsed through an interactive factual validation pipe before outputting a confidence summary.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Query Input */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1 text-xs font-mono">
                      <span className="text-slate-400 font-bold">1. USER QUERY</span>
                      <input
                        type="text"
                        value={validationInputQuery}
                        onChange={(e) => setValidationInputQuery(e.target.value)}
                        placeholder="ENTER CRITICAL SEC QUERY..."
                        className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs focus:outline-none focus:border-orange-500 text-white font-mono uppercase"
                      />
                    </div>

                    <div className="flex flex-col gap-1 text-[10px] font-mono text-slate-500 leading-normal">
                      <span>SYSTEM SOURCES REGISTERED:</span>
                      <span className="text-orange-400 font-bold">✓ WEATHER FORECAST METRICS</span>
                      <span className="text-orange-400 font-bold">✓ GEOLOGICAL SATELLITE MESH</span>
                      <span className="text-orange-400 font-bold">✓ DRONE SCANNER NETWORK</span>
                    </div>

                    <button
                      onClick={triggerAIEvaluationPipeline}
                      className="py-2 px-3 rounded bg-orange-500 hover:bg-orange-600 text-white font-bold font-mono text-xs uppercase cursor-pointer"
                    >
                      Audit & Parse Query
                    </button>
                  </div>

                  {/* Processing pipeline visuals */}
                  <div className="md:col-span-2 p-3 bg-slate-900 rounded-xl border border-slate-850 flex flex-col justify-between min-h-[160px]">
                    <span className="text-[9px] font-mono text-slate-500 font-bold border-b border-slate-800 pb-1.5">
                      FACT-CHECKING CONSOLE STREAM
                    </span>
                    
                    <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 mt-2 font-mono text-[10px] max-h-[110px] scrollbar-thin">
                      {pipelineStep === -1 ? (
                        <span className="text-slate-500 italic">Console idle. Awaiting query verification trace...</span>
                      ) : (
                        pipelineLogs.map((logStr, i) => (
                          <div key={i} className="flex gap-2 items-start">
                            <span className="text-orange-400 font-bold shrink-0">➔</span>
                            <span className="text-slate-300">{logStr}</span>
                          </div>
                        ))
                      )}
                    </div>

                    {computedConfidence !== null && (
                      <div className="p-2.5 bg-emerald-950/20 border border-emerald-500/20 rounded mt-2 flex justify-between items-center font-mono">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase">FACT VERIFICATION COMPLETE</span>
                        <div className="flex items-center gap-3 text-xs font-bold text-white">
                          <span>CONFIDENCE SCORE:</span>
                          <span className="text-emerald-400 text-sm drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]">{computedConfidence}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* --- 4. Cyber Security Dashboard Component --- */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
                <h3 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider border-b border-slate-900 pb-2.5 mb-4 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-orange-500" /> 4. Sentinel OS Enterprise Cyber Security Terminal
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Security switches and MFA */}
                  <div className="flex flex-col gap-3.5">
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest block">
                      SECURITY ENGINES
                    </span>

                    {/* MFA Switch */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">MULTI-FACTOR AUTH (MFA)</span>
                      <button
                        onClick={() => {
                          sounds.playClick();
                          setMfaEnabled(!mfaEnabled);
                        }}
                        className={`px-3 py-1 rounded text-[10px] font-bold cursor-pointer uppercase ${
                          mfaEnabled ? "bg-emerald-500/10 border border-emerald-500/40 text-emerald-400" : "bg-slate-900 text-slate-400 border border-slate-800"
                        }`}
                      >
                        {mfaEnabled ? "MFA ONLINE" : "DISABLED"}
                      </button>
                    </div>

                    {/* Firewall Online Switch */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">AES FIREWALL</span>
                      <button
                        onClick={() => {
                          sounds.playClick();
                          const nextState = !firewallOnline;
                          setFirewallOnline(nextState);
                          setSecurityLogs((prev) => [
                            `Firewall manually toggled ${nextState ? "ONLINE" : "STANDBY"} by Super Admin`,
                            ...prev
                          ]);
                        }}
                        className={`px-3 py-1 rounded text-[10px] font-bold cursor-pointer uppercase ${
                          firewallOnline ? "bg-emerald-500/10 border border-emerald-500/40 text-emerald-400" : "bg-red-500/10 border border-red-500/40 text-red-400"
                        }`}
                      >
                        {firewallOnline ? "FIREWALL ONLINE" : "OFFLINE"}
                      </button>
                    </div>

                    {/* Session Timeout Slider */}
                    <div className="flex flex-col gap-1.5 font-mono text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>SESSION TIMEOUT</span>
                        <span className="text-orange-400 font-bold">{sessionTimeout} MIN</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="120"
                        step="5"
                        value={sessionTimeout}
                        onChange={(e) => {
                          setSessionTimeout(parseInt(e.target.value));
                        }}
                        className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                    </div>
                  </div>

                  {/* Threat Scanner and Integrity Status */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-850 flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-slate-500 font-bold border-b border-slate-800 pb-1.5 uppercase">
                      Threat detection scanner
                    </span>

                    <div className="flex flex-col items-center justify-center py-3">
                      {isScanningThreats ? (
                        <div className="flex flex-col items-center gap-1">
                          <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
                          <span className="text-[10px] font-mono text-slate-400 animate-pulse">INTEGRITY ANALYSIS ACTIVE</span>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Shield className="w-8 h-8 text-emerald-400 mx-auto" />
                          <span className="text-xs font-mono text-emerald-400 font-bold block mt-1">AES-256 SYSTEM INTEGRITY</span>
                          <span className="text-[9px] font-mono text-slate-500">Last Scanned: Just Now</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        setIsScanningThreats(true);
                        setTimeout(() => {
                          setIsScanningThreats(false);
                          sounds.playLaser();
                          setSecurityLogs((prev) => [
                            "✓ System scan complete. 0 vulnerabilities or threats found.",
                            ...prev
                          ]);
                        }, 2000);
                      }}
                      className="w-full py-1.5 bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-white uppercase hover:bg-slate-900 cursor-pointer"
                    >
                      Trigger Scan
                    </button>
                  </div>

                  {/* Password Reset simulation */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-850 flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-slate-500 font-bold border-b border-slate-800 pb-1.5 uppercase">
                      SECURE PASSWORD RESET NODE
                    </span>

                    <form onSubmit={handlePasswordReset} className="flex flex-col gap-2 mt-2">
                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="Operator secure email..."
                        className="w-full p-2 text-[10px] font-mono bg-slate-950 border border-slate-850 rounded text-white focus:outline-none focus:border-orange-500"
                      />
                      
                      {resetStatus === "SENT" && (
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/20 p-1 rounded border border-emerald-500/20 uppercase">
                          ✓ Reset decryption link dispatched. Check inbox.
                        </span>
                      )}

                      <button
                        type="submit"
                        disabled={resetStatus === "SENDING"}
                        className="py-1.5 bg-orange-500 text-white font-mono font-bold text-[10px] uppercase cursor-pointer text-center"
                      >
                        {resetStatus === "SENDING" ? "ENCRYPTING LINK..." : "Request Reset"}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Audit secrets & security log list */}
                <div className="mt-4 p-3 bg-slate-950 border border-slate-850 rounded-xl">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-2 border-b border-slate-900 pb-1.5">
                    <span>SECURITY CONSOLE LOGS</span>
                    <span className="text-orange-400 font-bold">AES-256 ACTIVE</span>
                  </div>
                  <div className="flex flex-col gap-1 max-h-[80px] overflow-y-auto scrollbar-thin text-[10px] font-mono text-slate-400">
                    {securityLogs.map((log, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-slate-600">[SEC_SYS]</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Subpanel 3: Analytics & Audit Trails */}
          {activeSubTab === "analytics-logs" && (
            <div className="flex flex-col gap-6">
              
              {/* --- 5. Telemetry Analytics Section --- */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
                <h3 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider border-b border-slate-900 pb-2.5 mb-4 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-orange-500" /> 5. Platform Telemetry, Memory & Live Latency Dashboard
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {/* Card 1 */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-850">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase">Active System nodes</span>
                    <span className="text-xl font-mono font-bold text-white">{activeUsersCount}</span>
                    <span className="text-[9px] font-mono text-emerald-400 block mt-1">✓ HANDSHAKE SUCCESSFUL</span>
                  </div>
                  {/* Card 2 */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-850">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase">Inference Time</span>
                    <span className="text-xl font-mono font-bold text-white">42ms</span>
                    <span className="text-[9px] font-mono text-orange-400 block mt-1">S-Tier Response latency</span>
                  </div>
                  {/* Card 3 */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-850">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase">Server CPU Load</span>
                    <span className="text-xl font-mono font-bold text-white">{serverLoad}%</span>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1.5">
                      <div className="h-full bg-orange-500" style={{ width: `${serverLoad}%` }} />
                    </div>
                  </div>
                  {/* Card 4 */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-850">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase">Allocated Memory</span>
                    <span className="text-xl font-mono font-bold text-white">{ramUsage} GB</span>
                    <span className="text-[9px] font-mono text-emerald-400 block mt-1">Total Limit: 16.0 GB</span>
                  </div>
                </div>

                {/* Graph */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-850">
                  <span className="text-[10px] font-mono text-slate-500 font-bold block mb-4 uppercase">
                    REAL-TIME LATENCY & ERROR RATES MAPPING (LIVE AREA GRAPH)
                  </span>
                  
                  <div className="h-44 w-full text-slate-400">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData}>
                        <defs>
                          <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="#475569" fontSize={8} tickLine={false} />
                        <YAxis stroke="#475569" fontSize={8} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", fontSize: "10px" }} />
                        <Area type="monotone" dataKey="latency" name="Latency (ms)" stroke="#f97316" fillOpacity={1} fill="url(#colorLatency)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* --- 12. Security Audit & Platform Activities Logs --- */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-900 pb-3 mb-4">
                  <h3 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-orange-500" /> 12. Secure Audit Activity Trail & Logs
                  </h3>

                  {/* Filter tabs */}
                  <div className="flex gap-1 bg-slate-900 p-1 rounded-lg">
                    {["ALL", "SYSTEM", "SECURITY", "DATABASE", "NETWORK", "AI"].map((fl) => (
                      <button
                        key={fl}
                        onClick={() => {
                          sounds.playClick();
                          setAuditFilter(fl);
                        }}
                        className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase cursor-pointer ${
                          auditFilter === fl ? "bg-orange-500 text-white" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {fl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    value={searchAuditTerm}
                    onChange={(e) => setSearchAuditTerm(e.target.value)}
                    placeholder="Search logs by operator or action..."
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-xs font-mono focus:outline-none focus:border-orange-500 text-white"
                  />
                </div>

                {/* Log display console */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-850 flex flex-col gap-2 max-h-[160px] overflow-y-auto scrollbar-thin">
                  {filteredAuditLogs.length === 0 ? (
                    <span className="text-[10px] font-mono text-slate-500 italic">No matching logs indexed.</span>
                  ) : (
                    filteredAuditLogs.map((log, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] font-mono border-b border-slate-950 pb-1.5 last:border-0">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 font-bold">{log.time}</span>
                          <span className="text-orange-400 font-bold">[{log.operator}]</span>
                          <span className="text-white">{log.action}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 sm:mt-0">
                          <span className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 text-[8px] font-bold border border-slate-800">
                            {log.type}
                          </span>
                          <span className={`w-2 h-2 rounded-full ${
                            log.severity === "success" ? "bg-emerald-400 animate-pulse" : log.severity === "warning" ? "bg-orange-400" : "bg-cyan-400"
                          }`} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

          {/* Subpanel 4: Collaboration & Manuals */}
          {activeSubTab === "collaboration-docs" && (
            <div className="flex flex-col gap-6">
              
              {/* --- 14. Team Collaboration Workspace --- */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
                <h3 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider border-b border-slate-900 pb-2.5 mb-4 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-orange-500" /> 14. Samm-Labs Real-Time Teammate Collaboration Panel
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Task assigner list */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-850 flex flex-col gap-2.5">
                    <span className="text-[10px] font-mono text-slate-500 font-bold border-b border-slate-800 pb-1.5">
                      ACTIVE TEAM WORKFLOW & TASKS
                    </span>

                    <div className="flex flex-col gap-2">
                      {collaborativeTasks.map((task) => (
                        <div key={task.id} className="p-2 bg-slate-950 rounded border border-slate-850 flex items-center justify-between text-[11px] font-mono">
                          <div className="flex flex-col">
                            <span className="text-white font-bold">{task.title}</span>
                            <span className="text-[9px] text-slate-500">Assignee: {task.assignedTo}</span>
                          </div>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                            task.status === "Done" ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "bg-orange-500/10 border border-orange-500/30 text-orange-400"
                          }`}>
                            {task.status}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Drag and Drop Mock files (Milestone 14) */}
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`p-4 rounded-lg border-2 border-dashed text-center font-mono text-[10px] transition-all flex flex-col items-center justify-center gap-1 mt-1 cursor-pointer ${
                        isFileDragging 
                          ? "border-orange-500 bg-orange-500/10 text-white" 
                          : "border-slate-800 hover:border-orange-500/40 text-slate-400 hover:text-white"
                      }`}
                    >
                      <HardDrive className="w-5 h-5 text-slate-500 mb-1" />
                      <span>Drag & Drop Project Files Here</span>
                      <span className="text-[8px] text-slate-600">Simulate file upload for teammate sharing</span>
                    </div>

                    <div className="flex flex-col gap-1 text-[8px] font-mono text-slate-500 mt-1">
                      <span>SHARED FILES ON WORKSPACE:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {uploadedFiles.map((f, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-slate-950 border border-slate-800 rounded flex items-center gap-1">
                            <FileCode className="w-2.5 h-2.5 text-orange-400" />
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Comment / Mention thread section */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-850 flex flex-col justify-between min-h-[220px]">
                    <span className="text-[10px] font-mono text-slate-500 font-bold border-b border-slate-800 pb-1.5 uppercase">
                      COLLABORATOR COMMENT CHANNELS
                    </span>

                    <div className="flex-1 overflow-y-auto flex flex-col gap-2 mt-2 font-mono text-[10px] max-h-[140px] scrollbar-thin">
                      {teamComments.map((comment, i) => (
                        <div key={i} className="p-2 bg-slate-950 rounded border border-slate-850">
                          <div className="flex justify-between items-center text-slate-500 text-[8px] font-bold mb-1">
                            <span className="text-orange-400">@{comment.author}</span>
                            <span>{comment.time}</span>
                          </div>
                          <span className="text-slate-300">{comment.text}</span>
                        </div>
                      ))}
                    </div>

                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newCommentText) return;
                        sounds.playLaser();
                        const timeStr = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
                        setTeamComments((prev) => [
                          ...prev,
                          { author: operatorName || "Sam", text: newCommentText, time: timeStr }
                        ]);
                        setNewCommentText("");
                      }}
                      className="flex gap-2 mt-3"
                    >
                      <input
                        type="text"
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Type comment (mention with @)..."
                        className="flex-1 p-2 bg-slate-950 border border-slate-850 rounded text-[10px] font-mono text-white focus:outline-none focus:border-orange-500"
                      />
                      <button
                        type="submit"
                        className="px-3 bg-orange-500 rounded text-white font-mono font-bold text-[10px] uppercase cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>

                </div>
              </div>

              {/* --- 16. Technical Startup Documentation Guide --- */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
                <h3 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider border-b border-slate-900 pb-2.5 mb-3 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-orange-500" /> 16. Sentinel OS Startup Technical Documentation Manuals
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { title: "API Endpoint Specs", desc: "GET /api/health // POST /api/analytics // REST routing documentation.", icon: FileCode },
                    { title: "Architecture Schema", desc: "Explains cluster replication, Spanner DB index sync, and secure client-to-server proxies.", icon: Layers },
                    { title: "CI/CD Testing Protocol", desc: "Automated lint checks, integration suite boundaries, and Docker pipeline runtimes.", icon: Wrench }
                  ].map((doc) => {
                    const DocIcon = doc.icon;
                    return (
                      <div key={doc.title} className="p-3 bg-slate-900 rounded-xl border border-slate-850 flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-white font-bold font-mono text-xs">
                          <DocIcon className="w-4 h-4 text-orange-400" />
                          <span>{doc.title}</span>
                        </div>
                        <p className="text-[10px] font-mono text-slate-400 leading-relaxed">
                          {doc.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* Subpanel 5: DevOps & Sandbox Tests */}
          {activeSubTab === "devops-testing" && (
            <div className="flex flex-col gap-6">
              
              {/* --- 17. DevOps Pipeline Stream --- */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
                <h3 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider border-b border-slate-900 pb-2.5 mb-4 flex items-center gap-1.5">
                  <Network className="w-4 h-4 text-orange-500" /> 17. Live DevOps Build & CI/CD Deployment Pipeline Simulator
                </h3>

                <p className="text-[11px] text-slate-400 font-mono mb-4 leading-relaxed">
                  Trigger a mock release of Sentinel OS. Watch GitHub Actions runner compile, test, verify linter rules, and dispatch secure Docker containers to Google Cloud Run.
                </p>

                {/* Pipeline visual blocks */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center mb-4">
                  {[
                    { stage: "lint", label: "1. Syntax Linter", desc: "eslint --fix" },
                    { stage: "test", label: "2. Test Runner", desc: "vitest run" },
                    { stage: "build", label: "3. esbuild Bundle", desc: "vite build" },
                    { stage: "deploy", label: "4. Cloud Run Push", desc: "gcloud deploy" },
                    { stage: "success", label: "5. Active URL", desc: "Live Handshake" }
                  ].map((step, idx) => {
                    const isPassed = 
                      (ciStage === "lint" && idx > 0) ||
                      (ciStage === "test" && idx > 1) ||
                      (ciStage === "build" && idx > 2) ||
                      (ciStage === "deploy" && idx > 3) ||
                      (ciStage === "success");
                    
                    const isCurrent = 
                      (ciStage === step.stage) || 
                      (ciStage === "lint" && idx === 0) ||
                      (ciStage === "test" && idx === 1) ||
                      (ciStage === "build" && idx === 2) ||
                      (ciStage === "deploy" && idx === 3);

                    return (
                      <div 
                        key={step.stage}
                        className={`p-3 rounded-xl border transition-all flex flex-col gap-1 ${
                          isPassed 
                            ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-400" 
                            : isCurrent 
                              ? "bg-orange-500/10 border-orange-500/80 text-orange-400 animate-pulse" 
                              : "bg-slate-900 border-slate-850 text-slate-500"
                        }`}
                      >
                        <span className="text-[10px] font-mono font-bold uppercase">{step.label}</span>
                        <span className="text-[8px] font-mono text-slate-400">{step.desc}</span>
                        <div className="mt-2 flex justify-center">
                          {isPassed ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          ) : isCurrent ? (
                            <RefreshCw className="w-4 h-4 text-orange-400 animate-spin" />
                          ) : (
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* DevOps Console logs output */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-850 flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-slate-500 font-bold border-b border-slate-800 pb-1.5 uppercase">
                    CLOUD PIPELINE ACTIVE BUILD LOGGER OUTPUT
                  </span>
                  <div className="flex flex-col gap-1 mt-2 text-[10px] font-mono text-slate-400 max-h-[80px] overflow-y-auto scrollbar-thin">
                    {ciLogs.length === 0 ? (
                      <span className="italic text-slate-500">Pipeline inactive. Click 'Trigger DevOps deployment' to run.</span>
                    ) : (
                      ciLogs.map((lg, i) => (
                        <div key={i} className="flex gap-2">
                          <span className="text-orange-400 font-bold">➔</span>
                          <span>{lg}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={triggerDevOpsDeployment}
                    disabled={ciStage !== "idle" && ciStage !== "success" && ciStage !== "fail"}
                    className="flex-1 py-2 px-3 rounded bg-orange-500 hover:bg-orange-600 disabled:bg-slate-900 text-white font-mono font-bold text-xs uppercase cursor-pointer text-center"
                  >
                    Trigger DevOps Deployment Release
                  </button>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setCiStage("idle");
                      setCiLogs([]);
                    }}
                    className="py-2 px-3 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white font-mono font-bold text-xs uppercase cursor-pointer"
                  >
                    Reset Pipeline
                  </button>
                </div>
              </div>

              {/* --- 18. Black Screen Terminal Testing Studio Component --- */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
                <h3 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider border-b border-slate-900 pb-2.5 mb-4 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-orange-500" /> 18. Enterprise Sandbox Test Studio Suite
                </h3>

                <p className="text-[11px] text-slate-400 font-mono mb-4 leading-relaxed">
                  Run comprehensive unit, integration, End-to-End, or frame latency benchmark tests inside the Sentinel sandbox console.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  
                  {/* Selectors */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => runSandboxTests("unit")}
                      disabled={activeRunningTestType !== "none"}
                      className="py-2 px-3 rounded bg-slate-900 border border-slate-850 text-slate-300 hover:text-white hover:border-orange-500 text-xs font-mono font-bold uppercase transition-all cursor-pointer text-left"
                    >
                      🧪 Run Unit Tests
                    </button>
                    <button
                      onClick={() => runSandboxTests("integration")}
                      disabled={activeRunningTestType !== "none"}
                      className="py-2 px-3 rounded bg-slate-900 border border-slate-850 text-slate-300 hover:text-white hover:border-orange-500 text-xs font-mono font-bold uppercase transition-all cursor-pointer text-left"
                    >
                      🔄 Run Integration Tests
                    </button>
                    <button
                      onClick={() => runSandboxTests("e2e")}
                      disabled={activeRunningTestType !== "none"}
                      className="py-2 px-3 rounded bg-slate-900 border border-slate-850 text-slate-300 hover:text-white hover:border-orange-500 text-xs font-mono font-bold uppercase transition-all cursor-pointer text-left"
                    >
                      🌐 Run End-to-End Tests
                    </button>
                    <button
                      onClick={() => runSandboxTests("performance")}
                      disabled={activeRunningTestType !== "none"}
                      className="py-2 px-3 rounded bg-slate-900 border border-slate-850 text-slate-300 hover:text-white hover:border-orange-500 text-xs font-mono font-bold uppercase transition-all cursor-pointer text-left"
                    >
                      ⚡ Run Latency Audit
                    </button>
                  </div>

                  {/* Test Console */}
                  <div className="md:col-span-3 p-3 bg-black rounded-xl border border-slate-800 flex flex-col justify-between min-h-[160px]">
                    <div className="flex justify-between items-center text-[8px] font-mono text-slate-600 border-b border-slate-900 pb-1">
                      <span>CONSOLE EXECUTION LOG STREAMER</span>
                      {activeRunningTestType !== "none" && <span className="text-orange-400 animate-pulse font-bold">RUNNING TESTS...</span>}
                    </div>

                    <div className="flex-1 font-mono text-[9px] text-slate-400 flex flex-col gap-1 mt-2 max-h-[110px] overflow-y-auto scrollbar-thin">
                      {testConsoleOutput.map((outStr, idx) => (
                        <span key={idx} className={`${outStr.includes("✓") ? "text-emerald-400" : "text-slate-300"}`}>
                          {outStr}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* --- 19. Scalability, Caching & Resource Planner --- */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
                <h3 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider border-b border-slate-900 pb-2.5 mb-4 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-orange-500" /> 19. Enterprise Scalability Forecast & Budget Calculator
                </h3>

                <p className="text-[11px] text-slate-400 font-mono mb-4 leading-relaxed">
                  Sentinel OS scale planner calculates cloud resource needs, cluster replication requirements, database indexes, and monthly pricing limits on high traffic.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="flex flex-col gap-2 font-mono text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>PROJECTED VOLUME REQUEST RATE (PER SEC):</span>
                      <span className="text-orange-400 font-bold">{scalabilityUserSlider.toLocaleString()} / SEC</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100000"
                      step="500"
                      value={scalabilityUserSlider}
                      onChange={(e) => {
                        setScalabilityUserSlider(parseInt(e.target.value));
                      }}
                      className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />

                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-slate-900 border border-slate-850 text-slate-400 text-[9px] rounded font-bold uppercase">
                        Database indexing: {scalabilityUserSlider > 50000 ? "Sharded Clusters" : "Standard Index"}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-900 border border-slate-850 text-slate-400 text-[9px] rounded font-bold uppercase">
                        Redis Cache hit ratio: {scalabilityUserSlider > 10000 ? "98.4% Hit" : "92.1% Hit"}
                      </span>
                    </div>
                  </div>

                  {/* Calculated metrics outputs */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-850 text-center font-mono">
                      <span className="text-[8px] text-slate-500 block uppercase">SERVER CLUSTERS</span>
                      <span className="text-base font-bold text-white mt-1 block">
                        {Math.ceil(scalabilityUserSlider / 8000)} Nodes
                      </span>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-850 text-center font-mono">
                      <span className="text-[8px] text-slate-500 block uppercase">REDIS SHARDS</span>
                      <span className="text-base font-bold text-white mt-1 block">
                        {Math.ceil(scalabilityUserSlider / 25000)} Shards
                      </span>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-850 text-center font-mono">
                      <span className="text-[8px] text-slate-500 block uppercase">EST. CLOUD COST</span>
                      <span className="text-base font-bold text-orange-400 mt-1 block">
                        ${Math.round(scalabilityUserSlider * 0.08).toLocaleString()} / MO
                      </span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* --- 8. Offline & PWA Service Manager Panel --- */}
      <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-850 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 shrink-0">
            {isOfflineMode ? (
              <WifiOff className="w-5 h-5 text-red-400 animate-pulse" />
            ) : (
              <Wifi className="w-5 h-5 text-emerald-400 animate-pulse" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white uppercase">
                8. Progressive Web App (PWA) Offline Sync Core
              </span>
              <span className="px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-[8px] font-mono text-orange-400 uppercase font-bold">
                PWA ServiceWorker Active
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5 leading-normal">
              Sentinel OS caches local parameters via IndexedDB storage. Simulating offline networks maintains UI integrity gracefully.
            </p>
          </div>
        </div>

        {/* Offline & PWA Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Simulate connection drop test */}
          <button
            onClick={triggerConnectionDrop}
            className="px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 text-xs font-mono font-bold cursor-pointer"
            title="Simulate complete connection packet loss retry loops"
          >
            TEST RETRY LOOP
          </button>

          {/* Offline switch */}
          <button
            onClick={() => {
              sounds.playClick();
              const nextOff = !isOfflineMode;
              setIsOfflineMode(nextOff);
              setWsConnected(!nextOff);
              
              if (nextOff) {
                setScreenReaderText("System set to offline cached mode. Network offline.");
              } else {
                setScreenReaderText("System reconnected to live satellite streams.");
                // Sync queue
                if (backgroundSyncQueue.length > 0) {
                  sounds.playLaser();
                  setScreenReaderText(`PWA Background Sync active: Synchronized ${backgroundSyncQueue.length} orbital datasets.`);
                  setBackgroundSyncQueue([]);
                }
              }
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer ${
              isOfflineMode
                ? "bg-red-500/20 border-red-500/40 text-red-400"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {isOfflineMode ? "OFFLINE CACHE ACTIVE" : "GO OFFLINE"}
          </button>

          {/* Install App */}
          <button
            onClick={() => {
              if (isPwaInstalled) return;
              sounds.playLaser();
              setIsPwaInstalled(true);
              setScreenReaderText("Sentinel OS successfully installed to application desk shortcuts.");
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold cursor-pointer uppercase ${
              isPwaInstalled 
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 cursor-default" 
                : "bg-orange-500 text-white hover:opacity-90 font-bold"
            }`}
          >
            {isPwaInstalled ? "✓ App Installed" : "Install Sentinel OS"}
          </button>
        </div>
      </div>

      {/* --- 13. System Rollback & Version control deck --- */}
      <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-850 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <GitBranch className="w-5 h-5 text-orange-500 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white uppercase">
                13. Global Platform Version Control & Safe Rollback Options
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[8px] font-mono text-slate-400 uppercase font-bold">
                Current: {sysVersion}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5 leading-normal">
              Revert platform modules in case of unstable deployments. Safe Rollback safeguards state parameters instantly.
            </p>
          </div>
        </div>

        {/* Rollback Trigger button */}
        <div className="flex items-center gap-3">
          {isRollingBack ? (
            <div className="p-2 rounded bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono font-bold animate-pulse">
              ROLLING BACK TO v6.0.2... {rollbackProgress}%
            </div>
          ) : (
            <button
              onClick={() => {
                sounds.playClick();
                setIsRollingBack(true);
                setRollbackProgress(0);
                setScreenReaderText("Initiating safe rollback procedures to previous stable deployment version.");
                
                let prog = 0;
                const rollbackTimer = setInterval(() => {
                  prog += 10;
                  setRollbackProgress(prog);
                  if (prog >= 100) {
                    clearInterval(rollbackTimer);
                    setIsRollingBack(false);
                    setSysVersion("v6.0.2");
                    sounds.playLaser();
                    setScreenReaderText("Safe Rollback Complete. Sentinel OS active on v6.0.2.");
                  }
                }, 200);
              }}
              className="px-3.5 py-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer"
            >
              Rollback to v6.0.2 (Staged Stable)
            </button>
          )}
        </div>
      </div>

      {/* --- 20. Ctrl + Shift + D Developer Mode Terminal Overlay --- */}
      <AnimatePresence>
        {isDevConsoleOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed bottom-12 right-6 w-96 bg-slate-950/98 border border-orange-500/60 p-4 rounded-xl shadow-[0_0_30px_rgba(249,115,22,0.3)] z-50 font-mono text-[10px] text-white flex flex-col gap-3 backdrop-blur-md"
          >
            <div className="flex justify-between items-center border-b border-orange-500/40 pb-2">
              <span className="text-xs text-orange-400 font-bold flex items-center gap-1.5">
                <Code className="w-4 h-4 text-orange-500 animate-spin-slow" /> [SENTINEL_ENGINE_DEBUGGER]
              </span>
              <button 
                onClick={() => {
                  sounds.playClick();
                  setIsDevConsoleOpen(false);
                }}
                className="text-slate-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Diagnostics grid */}
            <div className="grid grid-cols-2 gap-2 text-[9px] bg-slate-900/60 p-2.5 rounded border border-slate-850">
              <div className="flex justify-between">
                <span className="text-slate-500">FRAME_DRAW:</span>
                <span className="text-emerald-400 font-bold">{fpsVal} FPS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">API_LATENCY:</span>
                <span className="text-orange-400 font-bold">28 ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">GARBAGE_HEAP:</span>
                <span className="text-cyan-400 font-bold">14.8 MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">AI_INFERENCE:</span>
                <span className="text-pink-400 font-bold">120 ms</span>
              </div>
              <div className="flex justify-between col-span-2 border-t border-slate-950 pt-1.5 mt-1">
                <span className="text-slate-500">WS_STATUS:</span>
                <span className={`font-bold ${wsConnected ? "text-emerald-400" : "text-red-400"}`}>
                  {wsConnected ? "CONNECTED_SECURE" : "DISCONNECTED"}
                </span>
              </div>
            </div>

            {/* Live WebSockets/SSE Log Stream visualizer (Milestone 10) */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[8px] text-slate-500 font-bold uppercase">
                📡 Live WebSockets Channel Events Stream
              </span>
              
              <div className="p-2 bg-black rounded border border-slate-900 max-h-[100px] overflow-y-auto scrollbar-none flex flex-col gap-1">
                {webSocketLog.length === 0 ? (
                  <span className="text-slate-600 italic">No incoming websocket packets.</span>
                ) : (
                  webSocketLog.map((log) => (
                    <div key={log.id} className="flex gap-1.5 text-[8px] leading-normal font-mono">
                      <span className="text-orange-550 shrink-0">[{log.timestamp}]</span>
                      <span className="text-cyan-400 shrink-0 font-bold">#{log.channel}:</span>
                      <span className="text-slate-300 truncate">{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="text-[8px] text-slate-500 text-center uppercase">
              Ctrl + Shift + D globally to show / hide debugger overlay
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
