/**
 * CyberShield Enterprise Cybersecurity Dataset
 * Realistic security telemetry, real-world CVEs, MITRE ATT&CK techniques,
 * audit log histories, and fleet diagnostics data.
 */

export interface SecurityMetric {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  change: string;
  isPositive: boolean;
  trend: number[];
  description: string;
}

export interface SecurityIncident {
  id: string;
  timestamp: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "NOMINAL";
  title: string;
  category: "Zero-Day Exploit" | "Memory Injection" | "Ransomware" | "Privilege Escalation" | "Phishing Vector" | "Compliance Audit";
  cveReference?: string;
  mitreTactic: string;
  mitreId: string;
  targetHost: string;
  affectedProcess: string;
  status: "QUARANTINED" | "CONTAINED" | "INVESTIGATING" | "RESOLVED";
  sha256: string;
  fileLocation: string;
  summary: string;
  remediation: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  ipAddress: string;
  action: string;
  resource: string;
  status: "SUCCESS" | "DENIED" | "FLAGGED";
  complianceStandard: "SOC2" | "ISO27001" | "HIPAA" | "NIST-800";
}

export interface FleetDevice {
  id: string;
  hostname: string;
  os: string;
  osVersion: string;
  ipAddress: string;
  status: "ONLINE" | "SCANNING" | "WARNING" | "ISOLATED";
  securityScore: number;
  cpuLoad: number;
  ramUsage: number;
  diskEncryption: "FileVault 2" | "BitLocker XTS-256" | "LUKS2" | "Hardware AES-256";
  lastAudit: string;
  isolated: boolean;
}

// 1. Executive KPIs
export const mockSecurityMetrics: SecurityMetric[] = [
  {
    id: "posture-score",
    title: "Security Posture Index",
    value: 94,
    unit: "/ 100",
    change: "+3.2% vs last 30d",
    isPositive: true,
    trend: [82, 85, 84, 88, 91, 93, 94],
    description: "Zero-Trust perimeter policy compliance across all managed endpoints.",
  },
  {
    id: "active-nodes",
    title: "Protected Fleet Nodes",
    value: 128,
    unit: "hosts",
    change: "100% active",
    isPositive: true,
    trend: [110, 118, 122, 125, 126, 128, 128],
    description: "All agents connected with TLS 1.3 mutual certificate authentication.",
  },
  {
    id: "blocked-threats",
    title: "Threats Quarantined",
    value: 14,
    unit: "events",
    change: "-42% zero-day vectors",
    isPositive: true,
    trend: [38, 30, 24, 19, 18, 15, 14],
    description: "Autonomous sandbox containment with 0 lateral movement incidents.",
  },
  {
    id: "audit-events",
    title: "Continuous Audit Rate",
    value: "2.4M",
    unit: "req/day",
    change: "99.98% clean",
    isPositive: true,
    trend: [1.8, 1.9, 2.1, 2.2, 2.3, 2.4, 2.4],
    description: "Real-time telemetry parsed through eBPF kernel hooks.",
  },
];

// 2. Incident & Forensic Threat Database
export const mockThreatIncidents: SecurityIncident[] = [
  {
    id: "INC-2026-089",
    timestamp: "2 mins ago",
    severity: "CRITICAL",
    title: "XZ Utils Liblzma Backdoor Payload Detonated",
    category: "Zero-Day Exploit",
    cveReference: "CVE-2024-3094",
    mitreTactic: "Defense Evasion",
    mitreId: "T1027.005",
    targetHost: "prod-gateway-node-04",
    affectedProcess: "sshd.bin (PID 9182)",
    status: "QUARANTINED",
    sha256: "8e2a149c4709d7890fa3844dbd9821a0fb87201c1074e2d3b482089f074a3821",
    fileLocation: "/usr/local/lib/liblzma.so.5.6.0",
    summary: "Obfuscated m4 build script injected malicious ELF payload into cryptographic symbol table to bypass RSA signature checks.",
    remediation: "Binary isolated in kernel sandbox. Reverted to certified release liblzma.so.5.4.5.",
  },
  {
    id: "INC-2026-088",
    timestamp: "14 mins ago",
    severity: "HIGH",
    title: "Suspicious PowerShell Reflective Memory Injection",
    category: "Memory Injection",
    cveReference: "CVE-2023-38606",
    mitreTactic: "Execution",
    mitreId: "T1059.001",
    targetHost: "sec-analyst-ws-01",
    affectedProcess: "powershell.exe (PID 3402)",
    status: "CONTAINED",
    sha256: "4b9101f37e492b95c0199e8274a106f2c39a0081d044238e88e27c191a0c9441",
    fileLocation: "C:\\Users\\Analyst\\AppData\\Local\\Temp\\invoke_stub.ps1",
    summary: "Attempted unhooking of NTDLL.dll memory space to bypass Antivirus Scan Interface (AMSI).",
    remediation: "Process terminated via eBPF driver. Host memory heap scrubbed and encrypted.",
  },
  {
    id: "INC-2026-087",
    timestamp: "1 hour ago",
    severity: "MEDIUM",
    title: "Ransomware Canary Modification Detected",
    category: "Ransomware",
    mitreTactic: "Impact",
    mitreId: "T1486",
    targetHost: "db-replica-east-02",
    affectedProcess: "bg_worker_node (PID 5510)",
    status: "RESOLVED",
    sha256: "1f893e1104e76043bc2091d643890f91a02934ec8192038475a019e09418290f",
    fileLocation: "/data/canary/sys_check.txt.enc",
    summary: "Rapid entropy increase detected in test directories. Suspicious cryptographic routine halted after 2 files.",
    remediation: "Canary trap triggered instant disk freeze. Backups verified intact.",
  },
  {
    id: "INC-2026-086",
    timestamp: "3 hours ago",
    severity: "LOW",
    title: "Unsigned Design Token Manifest Ingestion Blocked",
    category: "Compliance Audit",
    mitreTactic: "Initial Access",
    mitreId: "T1195.002",
    targetHost: "build-runner-ci-09",
    affectedProcess: "figma-token-sync (PID 1124)",
    status: "RESOLVED",
    sha256: "99182390abef4781290348719023471029348120349817203948120934812093",
    fileLocation: "/repos/cybershield/tokens/theme.json",
    summary: "Token payload signature mismatch. Key rotation mismatch between Figma webhook and GitHub Action.",
    remediation: "Token sync halted. Developer alerted to re-authenticate with hardware YubiKey.",
  },
];

// 3. SOC2 / ISO Audit Log Dataset
export const mockAuditLogs: AuditLogEntry[] = [
  {
    id: "LOG-9921",
    timestamp: "2026-08-06 04:51:12 UTC",
    actor: "sarah.jenkins@enterprise.com",
    actorRole: "Security Admin",
    ipAddress: "192.168.1.104",
    action: "ROTATE_RSA_SIGNING_KEYS",
    resource: "Perimeter Keyring / Group A",
    status: "SUCCESS",
    complianceStandard: "SOC2",
  },
  {
    id: "LOG-9920",
    timestamp: "2026-08-06 04:48:33 UTC",
    actor: "system_daemon_ebpf",
    actorRole: "Automated Sentinel",
    ipAddress: "10.0.4.12",
    action: "ISOLATE_KERNEL_HEAP",
    resource: "Process PID 9182",
    status: "SUCCESS",
    complianceStandard: "ISO27001",
  },
  {
    id: "LOG-9919",
    timestamp: "2026-08-06 04:30:19 UTC",
    actor: "unauthorized_ext_ip",
    actorRole: "Unknown Actor",
    ipAddress: "185.220.101.44",
    action: "SSH_BRUTE_FORCE_ATTEMPT",
    resource: "Gateway Port 22",
    status: "DENIED",
    complianceStandard: "NIST-800",
  },
  {
    id: "LOG-9918",
    timestamp: "2026-08-06 04:12:05 UTC",
    actor: "marcus.vance@enterprise.com",
    actorRole: "Design Ops Lead",
    ipAddress: "192.168.1.88",
    action: "SYNC_DESIGN_TOKENS_GIT",
    resource: "repo:cybershield-ui/tokens",
    status: "SUCCESS",
    complianceStandard: "SOC2",
  },
  {
    id: "LOG-9917",
    timestamp: "2026-08-06 03:55:40 UTC",
    actor: "ci_runner_github_04",
    actorRole: "Automated Pipeline",
    ipAddress: "140.82.112.21",
    action: "COMPILE_NATIVE_SWIFT_KOTLIN",
    resource: "ThemeTokens.swift & ColorTokens.kt",
    status: "SUCCESS",
    complianceStandard: "ISO27001",
  },
  {
    id: "LOG-9916",
    timestamp: "2026-08-06 03:30:00 UTC",
    actor: "automated_backup_cron",
    actorRole: "Backup Daemon",
    ipAddress: "10.0.0.2",
    action: "ENCRYPTED_SNAPSHOT_GCS",
    resource: "bucket:sec-audit-cold-storage",
    status: "SUCCESS",
    complianceStandard: "HIPAA",
  },
];

// 4. Fleet Device Inventory
export const mockFleetDevices: FleetDevice[] = [
  {
    id: "DEV-01",
    hostname: "macbook-pro-m3-sarah",
    os: "macOS Sonoma 14.6",
    osVersion: "Build 23G80",
    ipAddress: "192.168.1.104",
    status: "ONLINE",
    securityScore: 98,
    cpuLoad: 18,
    ramUsage: 42,
    diskEncryption: "FileVault 2",
    lastAudit: "Just now",
    isolated: false,
  },
  {
    id: "DEV-02",
    hostname: "ws-win11-threat-intel",
    os: "Windows 11 Pro Enterprise",
    osVersion: "23H2 (22631.3880)",
    ipAddress: "192.168.1.105",
    status: "ONLINE",
    securityScore: 94,
    cpuLoad: 34,
    ramUsage: 68,
    diskEncryption: "BitLocker XTS-256",
    lastAudit: "4 mins ago",
    isolated: false,
  },
  {
    id: "DEV-03",
    hostname: "ubuntu-server-prod-node-04",
    os: "Ubuntu Linux 24.04 LTS",
    osVersion: "Kernel 6.8.0-38-generic",
    ipAddress: "10.0.4.12",
    status: "WARNING",
    securityScore: 78,
    cpuLoad: 72,
    ramUsage: 89,
    diskEncryption: "LUKS2",
    lastAudit: "2 mins ago",
    isolated: false,
  },
  {
    id: "DEV-04",
    hostname: "iphone15-pro-mobile-qa",
    os: "iOS 18.0",
    osVersion: "Build 22A3354",
    ipAddress: "192.168.1.140",
    status: "ONLINE",
    securityScore: 100,
    cpuLoad: 8,
    ramUsage: 25,
    diskEncryption: "Hardware AES-256",
    lastAudit: "12 mins ago",
    isolated: false,
  },
  {
    id: "DEV-05",
    hostname: "pixel9-pro-android-test",
    os: "Android 15",
    osVersion: "Security Patch Aug 2026",
    ipAddress: "192.168.1.141",
    status: "ONLINE",
    securityScore: 99,
    cpuLoad: 12,
    ramUsage: 30,
    diskEncryption: "Hardware AES-256",
    lastAudit: "18 mins ago",
    isolated: false,
  },
];
