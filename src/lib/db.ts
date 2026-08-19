export interface ScannedFileRecord {
  id: string;
  name: string;
  size: string;
  type: string;
  sha256: string;
  md5?: string;
  sha1?: string;
  entropy: number;
  isMalicious: boolean;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "CLEAN";
  positives: number;
  totalEngines: number;
  verdict: string;
  familyName?: string;
  mitreTtp?: string;
  timestamp: string;
  quarantined: boolean;
  engineResults?: Record<string, { category: string; result: string }>;
}

export interface PhysicalForensicReport {
  reportId: string;
  generatedAt: string;
  operator: string;
  deviceHostname: string;
  osRelease: string;
  cpuModel: string;
  gpuModel: string;
  ramUsage: string;
  primaryIp: string;
  scannedFilesCount: number;
  criticalThreatsCount: number;
  activeFirewallRulesCount: number;
  riskScore: number;
  digitalSignature: string;
  scannedFiles: ScannedFileRecord[];
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: "SENTINEL_ROOT_ADMIN" | "SECURITY_ANALYST" | "AUDITOR";
  avatar: string;
  createdAt: string;
  lastLogin: string;
}

const STORAGE_KEYS = {
  SCANNED_FILES: "cybershield_scanned_files_db",
  REPORTS: "cybershield_reports_db",
  USERS: "cybershield_users_db",
  SESSION: "cybershield_session",
  FIREWALL_RULES: "cybershield_firewall_rules",
};

// Initial Sample Scans for immediate forensic display
const INITIAL_SCANS: ScannedFileRecord[] = [
  {
    id: "scan-lockbit-01",
    name: "LockBit3_Payload_x64.exe",
    size: "1.42 MB",
    type: "Portable Executable (PE32+)",
    sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    md5: "d41d8cd98f00b204e9800998ecf8427e",
    sha1: "da39a3ee5e6b4b0d3255bfef95601890afd80709",
    entropy: 7.92,
    isMalicious: true,
    severity: "CRITICAL",
    positives: 68,
    totalEngines: 72,
    verdict: "Active LockBit 3.0 Ransomware Cryptor",
    familyName: "Trojan-Ransom.Win64.LockBit",
    mitreTtp: "T1486 (Data Encrypted for Impact), T1490 (Inhibit System Recovery)",
    timestamp: new Date(Date.now() - 3600000).toLocaleString(),
    quarantined: true,
  },
  {
    id: "scan-cobalt-02",
    name: "CobaltStrike_Beacon_Stager.ps1",
    size: "68 KB",
    type: "PowerShell Script",
    sha256: "8f4e2439818816c7ba2ef1a0cbab585f9ff7038cfbe2542a1705e4fa4d5de646",
    entropy: 7.65,
    isMalicious: true,
    severity: "CRITICAL",
    positives: 64,
    totalEngines: 72,
    verdict: "Cobalt Strike In-Memory DLL Reflective Loader",
    familyName: "HackTool.Win32.CobaltStrike",
    mitreTtp: "T1059.001 (PowerShell), T1055 (Process Injection)",
    timestamp: new Date(Date.now() - 7200000).toLocaleString(),
    quarantined: true,
  },
  {
    id: "scan-pegasus-03",
    name: "Pegasus_ZeroClick_Exploit.apk",
    size: "4.8 MB",
    type: "Android Package",
    sha256: "2b3a1a1532c2a05cf4e81561f5f3e7bb0e922f3e8f192b67f1396a51d02c7711",
    entropy: 7.41,
    isMalicious: true,
    severity: "HIGH",
    positives: 59,
    totalEngines: 72,
    verdict: "Pegasus Surveillance Rootkit Exploit",
    familyName: "Spyware.Android.Pegasus",
    mitreTtp: "T1404 (Exploitation for Privilege Escalation)",
    timestamp: new Date(Date.now() - 14400000).toLocaleString(),
    quarantined: false,
  },
];

export const CyberDatabase = {
  // Scanned Files DB
  getScannedFiles(): ScannedFileRecord[] {
    if (typeof window === "undefined") return INITIAL_SCANS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SCANNED_FILES);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.SCANNED_FILES, JSON.stringify(INITIAL_SCANS));
        return INITIAL_SCANS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_SCANS;
    }
  },

  addScannedFile(record: ScannedFileRecord): void {
    if (typeof window === "undefined") return;
    try {
      const current = this.getScannedFiles();
      const updated = [record, ...current.filter((f) => f.sha256 !== record.sha256)];
      localStorage.setItem(STORAGE_KEYS.SCANNED_FILES, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to add scan record", e);
    }
  },

  quarantineFile(sha256: string): void {
    if (typeof window === "undefined") return;
    try {
      const current = this.getScannedFiles();
      const updated = current.map((f) =>
        f.sha256 === sha256 ? { ...f, quarantined: true } : f
      );
      localStorage.setItem(STORAGE_KEYS.SCANNED_FILES, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to quarantine file", e);
    }
  },

  // Physical Reports DB
  getReports(): PhysicalForensicReport[] {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveReport(report: PhysicalForensicReport): void {
    if (typeof window === "undefined") return;
    try {
      const current = this.getReports();
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify([report, ...current]));
    } catch (e) {
      console.error("Failed to save report", e);
    }
  },

  // User Accounts DB
  getUsers(): UserAccount[] {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  registerUser(user: UserAccount): void {
    if (typeof window === "undefined") return;
    try {
      const current = this.getUsers();
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([user, ...current.filter((u) => u.email !== user.email)]));
    } catch (e) {
      console.error("Failed to register user", e);
    }
  },
};
