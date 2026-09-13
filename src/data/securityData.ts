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

// All mock data purged as per Phase 4 final verification.
// The UI will depend on PostgreSQL / WSS data from agents.

export const mockSecurityMetrics: SecurityMetric[] = [];
export const mockThreatIncidents: SecurityIncident[] = [];
export const mockAuditLogs: AuditLogEntry[] = [];
export const mockFleetDevices: FleetDevice[] = [];
export const mockMalwareScannerResults: any[] = [];
export const mockForensicAnalysis: any = {};
