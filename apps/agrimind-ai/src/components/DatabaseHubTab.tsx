import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Database, FileText, FileCode, Terminal, MapPin, Lock, Search, 
  RefreshCw, Upload, Check, Copy, CheckCircle2, XCircle, AlertTriangle, 
  Shield, ShieldAlert, Download, Send, Info, Globe, ChevronDown, ChevronRight
} from "lucide-react";
import { DATABASE_SCHEMAS } from "../data/databaseSchemas";

interface DatabaseHubTabProps {
  dbRecordsCount: number;
  setDbRecordsCount: React.Dispatch<React.SetStateAction<number>>;
  farmProfiles: any[];
  setFarmProfiles: React.Dispatch<React.SetStateAction<any[]>>;
  addLog: (event: string, severity: "info" | "warning" | "critical", source: string, details: string) => void;
}

const DOMAINS_LIST = [
  "All",
  "Identity & Access",
  "Agriculture",
  "Weather",
  "Soil",
  "AI",
  "Community",
  "Disaster Management",
  "Notifications",
  "Analytics",
  "Security & Audit",
  "System Configuration"
];

export default function DatabaseHubTab({
  dbRecordsCount,
  setDbRecordsCount,
  farmProfiles,
  setFarmProfiles,
  addLog
}: DatabaseHubTabProps) {
  // Navigation & Filtering
  const [storageSubTab, setStorageSubTab] = useState<"dictionary" | "schemas" | "transactions" | "spatial" | "backups">("dictionary");
  const [dictionarySearchQuery, setDictionarySearchQuery] = useState("");
  const [dictionarySelectedDomain, setDictionarySelectedDomain] = useState<string>("All");
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({ users: true, crops: true });

  // Schema Explorer States
  const [selectedSchemaTable, setSelectedSchemaTable] = useState<string>("users");
  const [schemaCodeTab, setSchemaCodeTab] = useState<"drizzle" | "postgres">("drizzle");
  const [copiedType, setCopiedType] = useState<"drizzle" | "postgres" | null>(null);

  // Transaction Simulator States
  const [txWorkflowType, setTxWorkflowType] = useState<"register_farmer" | "record_harvest">("register_farmer");
  const [txFailAtStep, setTxFailAtStep] = useState<"none" | "step3" | "step4">("none");
  const [txStatus, setTxStatus] = useState<"idle" | "running" | "success" | "rolledback">("idle");
  const [txStep, setTxStep] = useState<number>(0);
  const [txDetailLogs, setTxDetailLogs] = useState<string[]>([]);

  // PostGIS & Object Storage States
  const [selectedGisLayer, setSelectedGisLayer] = useState<"farms" | "barangays" | "flood">("farms");
  const [spatialIntersectionResult, setSpatialIntersectionResult] = useState<string>("Click 'Query Spatial Boundaries' below to trigger PostGIS overlay execution.");
  const [isQueryingSpatial, setIsQueryingSpatial] = useState(false);
  const [spatialTargetFarm, setSpatialTargetFarm] = useState("550e8400-e29b-41d4-a716-446655440001");
  const [isUploadingStorage, setIsUploadingStorage] = useState(false);
  const [fileCategory, setFileCategory] = useState<"pest" | "crop" | "report">("pest");
  const [mockFileToUpload, setMockFileToUpload] = useState<string>("rice_ear_bug_damage.jpg");
  const [mockFileSizeToUpload, setMockFileSizeToUpload] = useState<string>("1.8 MB");
  const [storageFileList, setStorageFileList] = useState<Array<{ id: string; originalName: string; size: string; secureUrl: string; uploader: string; uploadedAt: string; category: string }>>([
    { id: "media-001", originalName: "corn_borer_pest_july.jpg", size: "1.4 MB", secureUrl: "https://supabase.co/agrimind-storage/pest-media/media_8a39b2c1.jpg", uploader: "admin_operator", uploadedAt: "2026-07-06 14:22 UTC", category: "pest" },
    { id: "media-002", originalName: "rice_blast_fungus.png", size: "2.1 MB", secureUrl: "https://supabase.co/agrimind-storage/pest-media/media_2f8d38a4.png", uploader: "staff_nena", uploadedAt: "2026-07-07 08:45 UTC", category: "pest" }
  ]);

  // Backups & RBAC Policy States
  const [selectedRestoreBackupId, setSelectedRestoreBackupId] = useState<string>("backup-20260707");
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [restoreVerificationStatus, setRestoreVerificationStatus] = useState<"idle" | "verifying_signature" | "verifying_schema" | "success">("idle");
  const [restorationLog, setRestorationLog] = useState<string[]>([]);
  const [selectedClassRole, setSelectedClassRole] = useState<"farmer" | "staff" | "admin">("farmer");
  const [selectedClassResource, setSelectedClassResource] = useState<string>("public_weather");
  const [classificationAuditResult, setClassificationAuditResult] = useState<any | null>(null);

  const [backupLogs, setBackupLogs] = useState([
    { id: "backup-20260707", filename: "agrimind_prod_dump_20260707.sql.enc", size: "18.4 MB", type: "incremental", timestamp: "2026-07-07 04:00 UTC", md5: "e4d3122abb3942b0aef4847d12f384c2" },
    { id: "backup-20260706", filename: "agrimind_prod_dump_20260706.sql.enc", size: "18.2 MB", type: "incremental", timestamp: "2026-07-06 04:00 UTC", md5: "c2aefd559432128b03aa00ef12dcfef8" },
    { id: "backup-weekly-26", filename: "agrimind_weekly_snap_w26.sql.enc", size: "112.5 MB", type: "full", timestamp: "2026-07-05 02:00 UTC", md5: "88f39ab1b4cf49eeea2b918342a39b22" }
  ]);

  // Badging colors helpers
  const getDomainColor = (domain: string) => {
    switch (domain) {
      case "Identity & Access": return "bg-sky-500/10 text-sky-500 border-sky-500/20";
      case "Agriculture": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "Weather": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Soil": return "bg-amber-700/10 text-amber-700 border-amber-700/20";
      case "AI": return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      case "Community": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "Disaster Management": return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "Notifications": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "Analytics": return "bg-teal-500/10 text-teal-500 border-teal-500/20";
      case "Security & Audit": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  const getClassificationBadge = (classification: string) => {
    switch (classification) {
      case "Public": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "Internal": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Confidential": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "Restricted": return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  // Toggle Table Card Expansion
  const toggleTableExpanded = (tableName: string) => {
    setExpandedTables(prev => ({ ...prev, [tableName]: !prev[tableName] }));
  };

  // Data dictionary filters
  const filteredTables = Object.values(DATABASE_SCHEMAS).filter(table => {
    const matchesDomain = dictionarySelectedDomain === "All" || table.domain === dictionarySelectedDomain;
    const matchesSearch = table.name.toLowerCase().includes(dictionarySearchQuery.toLowerCase()) ||
                          table.description.toLowerCase().includes(dictionarySearchQuery.toLowerCase()) ||
                          table.primaryKey.toLowerCase().includes(dictionarySearchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  // Shortcut link to schema code view
  const inspectSchemaTable = (tableName: string) => {
    setSelectedSchemaTable(tableName);
    setStorageSubTab("schemas");
  };

  // Clipboard copies
  const handleCopyCode = (text: string, type: "drizzle" | "postgres") => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Transaction Simulator Execution
  const handleRunTransaction = () => {
    setTxStatus("running");
    setTxStep(1);
    setTxDetailLogs([]);
    
    const isFarmer = txWorkflowType === "register_farmer";
    
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
          
          if (txFailAtStep === "step4") { 
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

  // Spatial query simulation
  const handleRunSpatialQuery = () => {
    setIsQueryingSpatial(true);
    setSpatialIntersectionResult("Executing ST_Intersects overlay computation...");
    addLog("PostGIS Intersection Started", "info", "PostGIS_Engine", `Running spatial overlay calculation on geometry field boundary for farm UUID ${spatialTargetFarm}...`);
    
    setTimeout(() => {
      setIsQueryingSpatial(false);
      let queryOutput = "";
      if (selectedGisLayer === "farms") {
        queryOutput = `PostgreSQL 16.2 Spatial Output (WGS84 EPSG:4326):
--------------------------------------------------------------
QUERY: SELECT name, ST_Area(boundary_geom::geography)/10000 AS ha, 
       ST_AsText(ST_Centroid(boundary_geom)) AS centroid 
       FROM farms WHERE farm_id = '${spatialTargetFarm}';

RESULT:
- Farm Name: Mang Juan de la Cruz Fields
- Calculated Area: 2.518 Hectares
- Centroid Coordinate: POINT(120.012541 15.291244)
- Verification Status: Spatial boundaries validated compliant. No overlap clashes with neighboring RSBSA plots.`;
        addLog("PostGIS Area Calculated", "info", "PostGIS_Engine", `Area query compiled. Centroid: POINT(120.012541 15.291244). 2.518 Hectares.`);
      } else if (selectedGisLayer === "barangays") {
        queryOutput = `PostgreSQL 16.2 Spatial Output (ST_Contains):
--------------------------------------------------------------
QUERY: SELECT b.name FROM barangay_boundaries b, farms f
       WHERE ST_Contains(b.geom, ST_Centroid(f.boundary_geom))
       AND f.farm_id = '${spatialTargetFarm}';

RESULT:
- Farm Intersection: CONTAINED
- Enclosing Barangay Name: Poblacion, Botolan, Zambales
- Admin GeoCode: PH037102001
- Boundary Code Alignment: 100% Match with municipal tax declarations.`;
        addLog("PostGIS Containment Verified", "info", "PostGIS_Engine", "Farm centroid matches Poblacion municipal geofence limits.");
      } else {
        queryOutput = `PostgreSQL 16.2 Spatial Output (ST_Intersects Flood Zones):
--------------------------------------------------------------
QUERY: SELECT f.name, hz.severity, ST_Area(ST_Intersection(f.boundary_geom, hz.geom))
       FROM farms f, hazard_zones hz 
       WHERE ST_Intersects(f.boundary_geom, hz.geom) 
       AND hz.hazard_type = 'FLOOD' AND f.farm_id = '${spatialTargetFarm}';

RESULT:
- Flood Hazard Intersect: DETECTED
- Hazard Zone Severity Rating: HIGH SUSCEPTIBILITY (Zambales River Outflow Zone)
- Intersecting Area: 0.84 Hectares (33.3% of total crop field)
- Action: Dispatched priority early planting advice or weather alerts.`;
        addLog("PostGIS Hazard Alert", "warning", "PostGIS_Engine", "WARNING: 0.84 hectares (33%) of farm overlaps high-susceptibility flood zone.");
      }
      setSpatialIntersectionResult(queryOutput);
    }, 1200);
  };

  // Upload file simulation
  const handleUploadStorageFile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploadingStorage(true);
    addLog("CDN Upload Connection Opened", "info", "Storage_Service", `Streaming raw multipart binary array for ${mockFileToUpload}...`);
    
    setTimeout(() => {
      setIsUploadingStorage(false);
      const uuid = Math.random().toString(36).substring(2, 10);
      const categoryPath = fileCategory === "pest" ? "pest-media" : fileCategory === "crop" ? "crop-photos" : "reports-pdf";
      const newFile = {
        id: `media-${uuid}`,
        originalName: mockFileToUpload,
        size: mockFileSizeToUpload,
        secureUrl: `https://supabase.co/agrimind-storage/${categoryPath}/${uuid}_${mockFileToUpload}`,
        uploader: "municipal_operator",
        uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + " UTC",
        category: fileCategory
      };
      
      setStorageFileList(prev => [newFile, ...prev]);
      addLog("Storage Meta Synced", "info", "PG_Connector", `INSERT INTO file_storage_registry (file_id, original_name, secure_url, size, uploader, file_category) VALUES ('media-${uuid}', '${mockFileToUpload}', '${newFile.secureUrl}', '${mockFileSizeToUpload}', 'municipal_operator', '${fileCategory}');`);
    }, 1500);
  };

  // Backup Rotation trigger
  const handleTriggerStorageBackup = (type: "incremental" | "full") => {
    setIsCreatingBackup(true);
    addLog("pg_dump Worker Spawned", "info", "Backup_Coordinator", `Starting pg_dump session with gzip compression. Target schemas: all 11 relational domains...`);
    
    setTimeout(() => {
      setIsCreatingBackup(false);
      const d = new Date();
      const timestampStr = d.toISOString().replace(/[-:T]/g, "").substring(0, 8);
      const uuidStr = Math.random().toString(36).substring(2, 8);
      const newBackup = {
        id: `backup-${timestampStr}-${uuidStr}`,
        filename: `agrimind_prod_dump_${timestampStr}_${uuidStr}.sql.enc`,
        size: type === "incremental" ? "18.5 MB" : "114.2 MB",
        type: type,
        timestamp: d.toISOString().replace('T', ' ').substring(0, 19) + " UTC",
        md5: Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 16)
      };
      setBackupLogs(prev => [newBackup, ...prev]);
      addLog("Backup Snapshot Saved", "info", "Backup_Coordinator", `Database pg_dump dump written safely. Encrypted AES-256 key rotation successful. Filename: ${newBackup.filename}`);
    }, 1800);
  };

  // Restore snapshot sequence testing
  const handleVerifyAndRestoreBackup = () => {
    setRestoreVerificationStatus("verifying_signature");
    setRestorationLog(["[1] Loading encrypted snapshot headers...", "[2] Authenticating secure pg_key ring signature..."]);
    addLog("Restoration Audit Triggered", "info", "Restore_Auditor", "Decryption and schema restore checksum check started...");

    setTimeout(() => {
      setRestoreVerificationStatus("verifying_schema");
      setRestorationLog(prev => [...prev, "[3] Checksum matching MD5 hash: PASSED.", "[4] Initializing container schema sandbox...", "[5] Comparing schema integrity with current 3NF definitions..."]);
      
      setTimeout(() => {
        setRestoreVerificationStatus("success");
        setRestorationLog(prev => [...prev, "[6] Executing sandbox schema SQL inserts...", "[7] Testing 38-table foreign-key referential integrity... PASSED.", "[8] All 11 structural domain structures matched: 100% compliant.", "[9] Sandboxed restoration test execution completed successfully."]);
        addLog("Restoration Audit Passed", "info", "Restore_Auditor", "Checksum validated. Schema sandbox constraints verify structural matching.");
      }, 1000);
    }, 1000);
  };

  // Validate Storage Classification & Security RBAC policy
  const handleAuditDataClassification = () => {
    let allowed = false;
    let classification = "Public";
    let reason = "";

    if (selectedClassResource === "public_weather") {
      classification = "Public";
      allowed = true; 
      reason = "Allowed: Weather records are classified as Public Open-Data. Reads are granted to any client context regardless of credential level.";
    } else if (selectedClassResource === "internal_analytics") {
      classification = "Internal";
      if (selectedClassRole === "staff" || selectedClassRole === "admin") {
        allowed = true;
        reason = `Allowed: Soil analytics carry an Internal classification. Authorized for role: ${selectedClassRole.toUpperCase()}.`;
      } else {
        allowed = false;
        reason = "Denied: Farmers are restricted from viewing aggregate municipal analytical soil tables. Requires municipal internal clearances.";
      }
    } else if (selectedClassResource === "confidential_contact") {
      classification = "Confidential";
      if (selectedClassRole === "staff" || selectedClassRole === "admin") {
        allowed = true;
        reason = `Allowed: Farmer contact credentials carry Confidential isolation flags. Authorized for administrative role: ${selectedClassRole.toUpperCase()}.`;
      } else {
        allowed = false;
        reason = "Denied: Confidential profile queries are isolated. Farmers may only fetch their OWN single row via strict JWT session IDs, never batch queries.";
      }
    } else if (selectedClassResource === "restricted_passwords") {
      classification = "Restricted";
      if (selectedClassRole === "admin") {
        allowed = true;
        reason = "Allowed: Root password registries carry Restricted classifications. Authorized for ROOT ADMINISTRATOR roles only.";
      } else {
        allowed = false;
        reason = `Denied: Security alert! Role ${selectedClassRole.toUpperCase()} lacks cryptography master keys. Action has been flagged and logged to security audit tables.`;
      }
    }

    setClassificationAuditResult({ allowed, classification, reason });
    if (allowed) {
      addLog("RBAC Audit Granted", "info", "SecurityShield", `Authorized role '${selectedClassRole.toUpperCase()}' reading resources marked '${classification}'`);
    } else {
      addLog("RBAC Policy Blocked", "critical", "SecurityShield", `BLOCKED VIOLATION: Role '${selectedClassRole.toUpperCase()}' requested access to '${classification}' data!`);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-150 dark:border-white/5 shadow-sm space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4 flex-wrap gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-500 animate-pulse" />
            Enterprise Master Database & Data Dictionary Hub (3NF)
          </h3>
          <p className="text-[10px] text-slate-400 font-semibold">
            Explore normalized schemas, master data dictionaries, run PostGIS query calculations, simulate ACID transactions, and review automated database configurations.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          <span>PostgreSQL 16.2 Active</span>
        </div>
      </div>

      {/* Subtabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-white/5 pb-2">
        <button
          onClick={() => setStorageSubTab("dictionary")}
          className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            storageSubTab === "dictionary"
              ? "bg-slate-900 text-white dark:bg-cyan-600"
              : "text-slate-500 hover:text-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950/50"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>🗃️ Master Data Dictionary</span>
        </button>
        <button
          onClick={() => setStorageSubTab("schemas")}
          className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            storageSubTab === "schemas"
              ? "bg-slate-900 text-white dark:bg-cyan-600"
              : "text-slate-500 hover:text-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950/50"
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>📐 3NF Schema & ORM</span>
        </button>
        <button
          onClick={() => setStorageSubTab("transactions")}
          className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            storageSubTab === "transactions"
              ? "bg-slate-900 text-white dark:bg-cyan-600"
              : "text-slate-500 hover:text-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950/50"
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>⚡ ACID Simulator</span>
        </button>
        <button
          onClick={() => setStorageSubTab("spatial")}
          className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            storageSubTab === "spatial"
              ? "bg-slate-900 text-white dark:bg-cyan-600"
              : "text-slate-500 hover:text-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950/50"
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>🗺️ PostGIS & Object Storage</span>
        </button>
        <button
          onClick={() => setStorageSubTab("backups")}
          className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            storageSubTab === "backups"
              ? "bg-slate-900 text-white dark:bg-cyan-600"
              : "text-slate-500 hover:text-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950/50"
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>💾 Backups & RBAC Auditor</span>
        </button>
      </div>

      {/* SUB-TAB CONTENTS */}
      <AnimatePresence mode="wait">
        {/* SUBTAB 1: MASTER DATA DICTIONARY */}
        {storageSubTab === "dictionary" && (
          <motion.div
            key="dictionary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 space-y-1">
                <span className="text-[8px] font-black uppercase text-slate-400 block">Total Database Tables</span>
                <span className="text-xl font-black text-slate-900 dark:text-white block">38 Entities</span>
                <span className="text-[8px] text-cyan-500 font-bold uppercase block font-mono">11 Logical Domains Isolated</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 space-y-1">
                <span className="text-[8px] font-black uppercase text-slate-400 block">Normalization Standard</span>
                <span className="text-xl font-black text-slate-900 dark:text-white block">Strict 3NF</span>
                <span className="text-[8px] text-emerald-500 font-bold uppercase block font-mono">Guarantees Data Integrity</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 space-y-1">
                <span className="text-[8px] font-black uppercase text-slate-400 block">Database Engine</span>
                <span className="text-xl font-black text-slate-900 dark:text-white block">PostgreSQL</span>
                <span className="text-[8px] text-blue-500 font-bold uppercase block font-mono">PostGIS Geometry Active</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 space-y-1">
                <span className="text-[8px] font-black uppercase text-slate-400 block">Relational Auditing</span>
                <span className="text-xl font-black text-slate-900 dark:text-white block">Active Triggers</span>
                <span className="text-[8px] text-rose-500 font-bold uppercase block font-mono">Immutable audit_logs footprints</span>
              </div>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-white/5">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={dictionarySearchQuery}
                  onChange={(e) => setDictionarySearchQuery(e.target.value)}
                  placeholder="Search database tables, primary keys, descriptions..."
                  className="w-full text-[10px] pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-bold focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
                <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Domain Group:</span>
                <select
                  value={dictionarySelectedDomain}
                  onChange={(e) => setDictionarySelectedDomain(e.target.value)}
                  className="text-[10px] p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-bold focus:outline-none cursor-pointer"
                >
                  {DOMAINS_LIST.map(dom => (
                    <option key={dom} value={dom}>{dom}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* List / Data Dictionary */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <span className="text-[9px] font-black uppercase text-slate-400">
                  Data Dictionary Registry ({filteredTables.length} tables found)
                </span>
                <span className="text-[8px] text-slate-400 font-mono">
                  *Click any card header to expand column structure
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {filteredTables.length > 0 ? (
                  filteredTables.map((table) => {
                    const isExpanded = expandedTables[table.name];
                    return (
                      <div 
                        key={table.name} 
                        className="rounded-2xl border border-slate-150 dark:border-white/5 bg-white dark:bg-slate-900 overflow-hidden"
                      >
                        {/* Accordion Trigger */}
                        <div 
                          onClick={() => toggleTableExpanded(table.name)}
                          className="p-4 flex flex-wrap gap-4 items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors select-none"
                        >
                          <div className="flex items-center gap-3">
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-black text-slate-900 dark:text-white font-mono">
                                  {table.name}
                                </span>
                                <span className={`text-[7px] font-black uppercase px-2 py-0.5 border rounded-full ${getDomainColor(table.domain)}`}>
                                  {table.domain}
                                </span>
                                <span className={`text-[7px] font-black uppercase px-2 py-0.5 border rounded-full ${getClassificationBadge(table.classification)}`}>
                                  {table.classification}
                                </span>
                              </div>
                              <p className="text-[9px] text-slate-500 font-semibold mt-0.5 max-w-2xl leading-relaxed">
                                {table.description}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[7px] font-black text-slate-400 uppercase block">Primary Key</span>
                            <span className="text-[9px] font-bold text-slate-800 dark:text-slate-200 block font-mono">{table.primaryKey}</span>
                          </div>
                        </div>

                        {/* Collapsible details */}
                        {isExpanded && (
                          <div className="border-t border-slate-100 dark:border-white/5 p-4 bg-slate-50/40 dark:bg-slate-950/10 space-y-4">
                            {/* Visual ERD & Columns Grid */}
                            <div className="space-y-2">
                              <span className="text-[8px] font-black uppercase text-slate-400 block tracking-wider">Estimated Table Schema Breakdown & Integrity Bounds</span>
                              
                              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950">
                                <table className="w-full text-[9px] text-left border-collapse">
                                  <thead>
                                    <tr className="bg-slate-100 dark:bg-slate-900/60 text-slate-400 border-b border-slate-200 dark:border-slate-800 font-bold">
                                      <th className="p-2">Column Name</th>
                                      <th className="p-2">Type</th>
                                      <th className="p-2">Constraints / Key</th>
                                      <th className="p-2">Nullability</th>
                                      <th className="p-2">Classification</th>
                                      <th className="p-2">System Purpose</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 font-semibold text-slate-700 dark:text-slate-300">
                                    <tr>
                                      <td className="p-2 font-mono text-cyan-600 dark:text-cyan-400">{table.name === "users" ? "user_id" : table.primaryKey.split(" ")[0]}</td>
                                      <td className="p-2 font-mono text-slate-500 text-[8px]">UUID</td>
                                      <td className="p-2 text-rose-500 font-bold">PRIMARY KEY</td>
                                      <td className="p-2">NOT NULL</td>
                                      <td className="p-2"><span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-500 text-[7px] font-black uppercase">Internal</span></td>
                                      <td className="p-2 text-slate-400 text-[8px]">Immutable, system-assigned secure unique key.</td>
                                    </tr>
                                    {table.name === "users" && (
                                      <>
                                        <tr>
                                          <td className="p-2 font-mono text-cyan-600 dark:text-cyan-400">email</td>
                                          <td className="p-2 font-mono text-slate-500 text-[8px]">VARCHAR(255)</td>
                                          <td className="p-2 text-amber-500 font-bold">UNIQUE INDEX</td>
                                          <td className="p-2">NOT NULL</td>
                                          <td className="p-2"><span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[7px] font-black uppercase">Confidential</span></td>
                                          <td className="p-2 text-slate-400 text-[8px]">Primary unique login index descriptor.</td>
                                        </tr>
                                        <tr>
                                          <td className="p-2 font-mono text-cyan-600 dark:text-cyan-400">password_hash</td>
                                          <td className="p-2 font-mono text-slate-500 text-[8px]">VARCHAR(255)</td>
                                          <td className="p-2 text-slate-400">-</td>
                                          <td className="p-2">NOT NULL</td>
                                          <td className="p-2"><span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 text-[7px] font-black uppercase">Restricted</span></td>
                                          <td className="p-2 text-slate-400 text-[8px]">Argon2id cryptographic passcode key.</td>
                                        </tr>
                                      </>
                                    )}
                                    {table.name !== "users" && (
                                      <tr>
                                        <td className="p-2 font-mono text-cyan-600 dark:text-cyan-400">created_at</td>
                                        <td className="p-2 font-mono text-slate-500 text-[8px]">TIMESTAMP</td>
                                        <td className="p-2 text-slate-400">-</td>
                                        <td className="p-2">NOT NULL</td>
                                        <td className="p-2"><span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[7px] font-black uppercase">Public</span></td>
                                        <td className="p-2 text-slate-400 text-[8px]">Automatic log stamp (audit helper).</td>
                                      </tr>
                                    )}
                                    <tr>
                                      <td className="p-2 font-mono text-cyan-600 dark:text-cyan-400">deleted_at</td>
                                      <td className="p-2 font-mono text-slate-500 text-[8px]">TIMESTAMP</td>
                                      <td className="p-2 text-slate-400">SOFT DELETE</td>
                                      <td className="p-2 text-slate-400">NULLABLE</td>
                                      <td className="p-2"><span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[7px] font-black uppercase">Internal</span></td>
                                      <td className="p-2 text-slate-400 text-[8px]">Marks soft-deleted profiles (enables safe historical auditing).</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                              <button
                                onClick={() => inspectSchemaTable(table.name)}
                                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white text-[8px] font-black uppercase rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <FileCode className="w-3 h-3" />
                                <span>📐 View ORM & DDL Code</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400">
                    <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2 animate-bounce" />
                    <span className="text-[10px] font-extrabold uppercase">No table matching search or domain filter</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* SUBTAB 2: SCHEMA CODE EXPLORER */}
        {storageSubTab === "schemas" && (
          <motion.div
            key="schemas"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-white/5 space-y-6"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-cyan-600 dark:text-cyan-400 tracking-wider block">📐 3NF Schema & ORM Definition Center</span>
              <p className="text-[9px] text-slate-400 font-semibold">
                Review complete relational model statements. Toggle between TypeScript Drizzle ORM mappings and PostgreSQL DDL structures.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Selector */}
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">Table Schema Registry</span>
                <div className="max-h-96 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-2xl p-2 bg-white dark:bg-slate-950 space-y-1 scrollbar-thin">
                  {Object.keys(DATABASE_SCHEMAS).map((tblKey) => {
                    const tbl = DATABASE_SCHEMAS[tblKey];
                    const isSelected = selectedSchemaTable === tblKey;
                    return (
                      <button
                        key={tblKey}
                        onClick={() => setSelectedSchemaTable(tblKey)}
                        className={`w-full p-2 rounded-xl text-left transition-all text-[10px] font-bold flex items-center justify-between border cursor-pointer ${
                          isSelected 
                            ? "bg-slate-900 text-white dark:bg-cyan-600 border-slate-900 dark:border-cyan-500" 
                            : "bg-transparent text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <span className="font-mono">{tblKey}</span>
                        <span className={`text-[7px] font-black uppercase px-1.5 py-0.2 rounded ${
                          tbl.classification === "Public" ? "bg-emerald-500/15 text-emerald-500" :
                          tbl.classification === "Internal" ? "bg-blue-500/15 text-blue-500" :
                          tbl.classification === "Confidential" ? "bg-amber-500/15 text-amber-500" : "bg-rose-500/15 text-rose-500"
                        }`}>
                          {tbl.classification}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Details & Code Display */}
              <div className="md:col-span-2 space-y-4">
                {DATABASE_SCHEMAS[selectedSchemaTable] ? (
                  <>
                    <div className="p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900 dark:text-white uppercase font-mono">{DATABASE_SCHEMAS[selectedSchemaTable].name}</span>
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${getDomainColor(DATABASE_SCHEMAS[selectedSchemaTable].domain)}`}>
                            {DATABASE_SCHEMAS[selectedSchemaTable].domain}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1">
                          {DATABASE_SCHEMAS[selectedSchemaTable].description}
                        </p>
                      </div>

                      <div className="shrink-0 space-y-0.5">
                        <span className="text-[7px] font-black uppercase text-slate-400 block">Primary Key</span>
                        <span className="text-[9px] font-bold text-slate-800 dark:text-slate-100 block font-mono">{DATABASE_SCHEMAS[selectedSchemaTable].primaryKey}</span>
                      </div>
                    </div>

                    {/* Code tabs selector & copies */}
                    <div className="border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-950 overflow-hidden">
                      <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-2.5">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSchemaCodeTab("drizzle")}
                            className={`px-3 py-1 text-[8px] font-black uppercase rounded-lg border transition-all cursor-pointer ${
                              schemaCodeTab === "drizzle"
                                ? "bg-slate-900 text-white dark:bg-cyan-600 border-slate-900 dark:border-cyan-500"
                                : "bg-white dark:bg-slate-950 text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-700"
                            }`}
                          >
                            drizzle.schema.ts
                          </button>
                          <button
                            onClick={() => setSchemaCodeTab("postgres")}
                            className={`px-3 py-1 text-[8px] font-black uppercase rounded-lg border transition-all cursor-pointer ${
                              schemaCodeTab === "postgres"
                                ? "bg-slate-900 text-white dark:bg-cyan-600 border-slate-900 dark:border-cyan-500"
                                : "bg-white dark:bg-slate-950 text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-700"
                            }`}
                          >
                            raw_schema.sql
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            const code = schemaCodeTab === "drizzle" 
                              ? DATABASE_SCHEMAS[selectedSchemaTable].drizzleCode 
                              : DATABASE_SCHEMAS[selectedSchemaTable].sqlCode;
                            handleCopyCode(code, schemaCodeTab);
                          }}
                          className="px-2.5 py-1 text-[8px] font-black uppercase bg-slate-900 hover:bg-slate-800 dark:bg-slate-850 dark:hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        >
                          {copiedType === schemaCodeTab ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Monospace Code window */}
                      <pre className="p-4 text-[9px] font-mono leading-relaxed h-72 overflow-y-auto bg-slate-950 text-emerald-400 scrollbar-thin">
                        <code>
                          {schemaCodeTab === "drizzle" 
                            ? DATABASE_SCHEMAS[selectedSchemaTable].drizzleCode 
                            : DATABASE_SCHEMAS[selectedSchemaTable].sqlCode}
                        </code>
                      </pre>
                    </div>
                  </>
                ) : (
                  <div className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400">
                    <span className="text-[10px] font-extrabold uppercase">No Table Model Selected</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* SUBTAB 3: ACID SERIALIZABLE TRANSACTION SIMULATOR */}
        {storageSubTab === "transactions" && (
          <motion.div
            key="transactions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-white/5 space-y-6"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-cyan-600 dark:text-cyan-400 tracking-wider block">⚡ ACID Serializable Transaction Simulator</span>
              <p className="text-[9px] text-slate-400 font-semibold">
                Verify transactional atomicity (all-or-nothing writes) under Postgres strict serialization safety levels. Simulate happy path inserts or rollback failures.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Simulation Form controls */}
              <div className="p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">Transaction parameters</span>
                
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-400 block">Workflow Target</label>
                  <select
                    value={txWorkflowType}
                    onChange={(e: any) => {
                      setTxWorkflowType(e.target.value);
                      setTxStatus("idle");
                      setTxStep(0);
                      setTxDetailLogs([]);
                    }}
                    disabled={txStatus === "running"}
                    className="w-full text-[10px] p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="register_farmer">Farmer Registration & Access Provisioning</option>
                    <option value="record_harvest">Seasonal Crop Sowing & Soil Initial Record</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-400 block">Fail Condition Simulation</label>
                  <select
                    value={txFailAtStep}
                    onChange={(e: any) => {
                      setTxFailAtStep(e.target.value);
                      setTxStatus("idle");
                      setTxStep(0);
                      setTxDetailLogs([]);
                    }}
                    disabled={txStatus === "running"}
                    className="w-full text-[10px] p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="none">No Failures (Complete Success / COMMIT)</option>
                    <option value="step3">Unique Constraint Clash (ROLLBACK at Step 2)</option>
                    <option value="step4">PostGIS Geometry Self-Intersection Clash (ROLLBACK at Step 4)</option>
                  </select>
                </div>

                <button
                  onClick={handleRunTransaction}
                  disabled={txStatus === "running"}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white text-[10px] font-black uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Terminal className={`w-4 h-4 ${txStatus === "running" ? "animate-spin" : ""}`} />
                  <span>{txStatus === "running" ? "Executing Serializable Operations..." : "Run Transaction Workflow"}</span>
                </button>
              </div>

              {/* Steps Visualizer */}
              <div className="lg:col-span-2 space-y-4">
                <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">Serializable Steps Flow</span>
                
                {/* Horizontal flow track */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                  {[
                    { id: 1, label: "1. Zod Verification" },
                    { id: 2, label: "2. Identity Credentials" },
                    { id: 3, label: "3. Farmer Profile" },
                    { id: 4, label: "4. Geometry & Alerts" },
                    { id: 5, label: "5. Secure Log" },
                    { id: 6, label: "6. COMMIT/ROLLBACK" }
                  ].map((step) => {
                    const isActive = txStep === step.id;
                    const isPassed = txStep > step.id;
                    const isFailed = txStatus === "rolledback" && txStep === step.id;
                    
                    let bg = "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400";
                    if (isFailed) {
                      bg = "bg-rose-500 text-white border-rose-500 animate-pulse";
                    } else if (isActive) {
                      bg = "bg-cyan-500 text-white border-cyan-500 animate-pulse shadow-md shadow-cyan-500/20";
                    } else if (isPassed) {
                      bg = "bg-emerald-500 text-white border-emerald-500";
                    }
                    
                    return (
                      <div key={step.id} className={`p-2.5 rounded-xl border text-center transition-all flex flex-col justify-between items-center gap-1.5 h-20 ${bg}`}>
                        <span className="text-[7px] font-black uppercase tracking-wider block leading-none">Step {step.id}</span>
                        <span className="text-[8px] font-black leading-tight block">{step.label}</span>
                        <div className="shrink-0">
                          {isFailed ? (
                            <XCircle className="w-3.5 h-3.5 text-white" />
                          ) : isActive ? (
                            <RefreshCw className="w-3.5 h-3.5 text-white animate-spin" />
                          ) : isPassed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Simulated SQL Output terminal */}
                <div className="space-y-1.5">
                  <span className="text-[8px] font-black uppercase text-slate-400 block font-mono">ACID Database Session stream output</span>
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 h-64 overflow-y-auto scrollbar-thin space-y-3 font-mono text-[9px]">
                    {txDetailLogs.length > 0 ? (
                      txDetailLogs.map((logLine, index) => (
                        <div key={index} className="space-y-1.5 border-b border-slate-900 pb-2.5 last:border-0 last:pb-0">
                          <pre className="text-emerald-400 leading-relaxed whitespace-pre-wrap">{logLine}</pre>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-500 italic h-full flex items-center justify-center">
                        No transaction sequence loaded. Select parameters and click 'Run Transaction Workflow' above to trigger Postgres serial isolation logs.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* SUBTAB 4: POSTGIS & STORAGE */}
        {storageSubTab === "spatial" && (
          <motion.div
            key="spatial"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* GIS / PostGIS console */}
            <div className="p-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-cyan-600 dark:text-cyan-400 tracking-wider block">2. PostGIS Spatial Polygon Intersects Query Console</span>
                <p className="text-[9px] text-slate-400 font-semibold">
                  Calculate overlay polygons dynamically using PostgreSQL spatial extensions. Enforce real-time containment validations against municipal geofences and hazard charts.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-400 block">Select Farm Geometry Object</label>
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
                  <label className="text-[8px] font-black uppercase text-slate-400 block font-mono">GIS Overlay query layer</label>
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

              {/* Terminal query window */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[8px] font-black text-slate-400 font-mono">
                  <span>PostGIS Spatial Query Console Output</span>
                  <span className="text-cyan-500 uppercase">EPSG:4326 WGS84</span>
                </div>

                <div className="relative">
                  <pre className="p-4 bg-slate-900 text-emerald-400 rounded-2xl border border-slate-800 text-[9px] font-mono leading-relaxed h-44 overflow-y-auto scrollbar-thin">
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

            {/* Storage meta manager */}
            <div className="p-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-cyan-600 dark:text-cyan-400 tracking-wider block">3. CDN Cloud Object Storage & Meta-Reference Manager</span>
                  <p className="text-[9px] text-slate-400 font-semibold">
                    Avoid storing heavy files or crop photos directly in SQL. Upload to CDN object buckets, then commit the secure URL strings in relational tables.
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
                    <div className="px-3 py-2 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase text-center">
                      {fileCategory}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <button
                      type="submit"
                      disabled={isUploadingStorage}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white text-[10px] font-black uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Upload className="w-3.5 h-3.5 animate-bounce" />
                      <span>{isUploadingStorage ? "Uploading CDN Object..." : "Upload File & Sync Meta-Ref"}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Registered Files list */}
              <div className="space-y-2 mt-4">
                <span className="text-[8px] font-black uppercase text-slate-400 block font-mono">Relational File Registry Table (`file_storage_registry`)</span>
                <div className="max-h-28 overflow-y-auto space-y-1 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 bg-white dark:bg-slate-950/20 scrollbar-thin">
                  {storageFileList.map((file) => (
                    <div key={file.id} className="flex justify-between items-center text-[8px] font-bold p-1.5 border-b border-slate-100 dark:border-slate-800/60 last:border-0 leading-tight">
                      <div>
                        <span className="text-slate-800 dark:text-white font-mono block">{file.originalName}</span>
                        <span className="text-slate-400 truncate block max-w-xs font-semibold">{file.secureUrl}</span>
                      </div>
                      <div className="text-right shrink-0 font-mono">
                        <span className="text-cyan-600 dark:text-cyan-400 block">{file.size}</span>
                        <span className="text-slate-400 block text-[7px] font-semibold">{file.uploadedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* SUBTAB 5: BACKUPS & RBAC SECURITY AUDITOR */}
        {storageSubTab === "backups" && (
          <motion.div
            key="backups"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Backups module */}
              <div className="p-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-cyan-600 dark:text-cyan-400 tracking-wider block">5. Backup Rotation Schedule & Restore Test Auditor</span>
                  <p className="text-[9px] text-slate-400 font-semibold">
                    Verify cryptographically encrypted backups. Trigger manual snapshots (Daily Incremental, Weekly Full, Monthly Archive) and run restoration trials.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] font-black uppercase text-slate-400 block font-mono">Select Backup Snapshot to Verify</label>
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

                <div className="p-3 bg-slate-900 text-slate-300 rounded-2xl border border-slate-800 h-28 overflow-y-auto scrollbar-thin space-y-1.5 font-mono text-[8px]">
                  <div className="flex justify-between items-center">
                    <span className="text-[7px] text-slate-500 font-black block uppercase font-mono">Restoration Audit Console Output</span>
                    <span className={`text-[7px] font-black uppercase px-1 rounded ${
                      restoreVerificationStatus === "success" ? "bg-emerald-500/15 text-emerald-400" :
                      restoreVerificationStatus === "verifying_signature" || restoreVerificationStatus === "verifying_schema" ? "bg-cyan-500/15 text-cyan-400" : "bg-slate-800 text-slate-400"
                    }`}>
                      {restoreVerificationStatus === "success" ? "PASSED" : restoreVerificationStatus === "idle" ? "IDLE" : "RUNNING"}
                    </span>
                  </div>

                  <div className="space-y-1 leading-normal">
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

              {/* RBAC Policy section */}
              <div className="p-6 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-cyan-600 dark:text-cyan-400 tracking-wider block">6. Storage Data Classification & RBAC Policy Auditor Tester</span>
                  <p className="text-[9px] text-slate-400 font-semibold">
                    Ensure secure data isolation complying with regulatory classifications: Public (readable by anyone), Internal (agricultural officers), Confidential (farmer personal fields), and Restricted (credential logs).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
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

                  <div>
                    <label className="text-[8px] font-black uppercase text-transparent block hidden md:block">Audit Action</label>
                    <button
                      onClick={handleAuditDataClassification}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white text-[10px] font-black uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Validate RBAC Policy</span>
                    </button>
                  </div>
                </div>

                {/* Audit results */}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
