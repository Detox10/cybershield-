import fs from 'fs';
import path from 'path';

// Using process.cwd() ensures it works in Next.js backend
const DATA_FILE = path.join(process.cwd(), 'cybershield_data.json');

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

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  type: "critical" | "warning" | "info" | "success";
}

export interface ThreatIncident {
  id: string;
  threatName: string;
  cveTtp: string;
  targetHost: string;
  vector: string;
  severity: "CRITICAL" | "HIGH" | "ELEVATED" | "MITIGATED";
  timestamp: string;
  status: "QUARANTINED" | "BLOCKED" | "SANDBOXED" | "ANALYZING";
  aiSummary: string;
}

interface DBState {
  scans: ScannedFileRecord[];
  reports: PhysicalForensicReport[];
  users: UserAccount[];
  timeline: TimelineEvent[];
  incidents: ThreatIncident[];
}

const DEFAULT_STATE: DBState = {
  scans: [],
  reports: [],
  users: [],
  timeline: [],
  incidents: []
};

// Singleton database class
export class ServerDB {
  private static readDB(): DBState {
    try {
      if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_STATE, null, 2));
        return DEFAULT_STATE;
      }
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error("Failed to read database, returning default state", err);
      return DEFAULT_STATE;
    }
  }

  private static writeDB(data: DBState) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error("Failed to write to database", err);
    }
  }

  // --- Scans ---
  static getScans() {
    return this.readDB().scans;
  }

  static addScan(scan: ScannedFileRecord) {
    const db = this.readDB();
    // Prepend, prevent duplicate hash
    db.scans = [scan, ...db.scans.filter(s => s.sha256 !== scan.sha256)];
    this.writeDB(db);
  }

  static quarantineFile(sha256: string) {
    const db = this.readDB();
    let updated = false;
    db.scans = db.scans.map(s => {
      if (s.sha256 === sha256) {
        updated = true;
        return { ...s, quarantined: true };
      }
      return s;
    });
    
    // Also update incidents related to this hash
    db.incidents = db.incidents.map(inc => {
      // Very basic linking - if incident mentions hash
      if (inc.aiSummary.includes(sha256)) {
        return { ...inc, status: "QUARANTINED" };
      }
      return inc;
    });
    
    if (updated) {
       // add timeline event
       const evt: TimelineEvent = {
           id: `evt-${Date.now()}`,
           time: new Date().toLocaleTimeString(),
           title: "File Quarantined",
           description: `Artifact ${sha256.substring(0,8)}... moved to secure vault.`,
           type: "success"
       };
       db.timeline = [evt, ...db.timeline].slice(0, 100);
    }

    this.writeDB(db);
  }

  // --- Reports ---
  static getReports() {
    return this.readDB().reports;
  }

  static addReport(report: PhysicalForensicReport) {
    const db = this.readDB();
    db.reports = [report, ...db.reports];
    this.writeDB(db);
  }

  // --- Users ---
  static getUsers() {
    return this.readDB().users;
  }

  static addUser(user: UserAccount) {
    const db = this.readDB();
    db.users = [user, ...db.users.filter(u => u.email !== user.email)];
    this.writeDB(db);
  }

  // --- Incidents & Timeline ---
  static getTimeline() {
    return this.readDB().timeline;
  }

  static addTimelineEvent(event: TimelineEvent) {
    const db = this.readDB();
    db.timeline = [event, ...db.timeline].slice(0, 100); // keep last 100
    this.writeDB(db);
  }

  static getIncidents() {
    return this.readDB().incidents;
  }

  static addIncident(incident: ThreatIncident) {
    const db = this.readDB();
    db.incidents = [incident, ...db.incidents].slice(0, 50); // keep last 50
    this.writeDB(db);
  }

  // Utility to clear DB (for "Historical Degradation" verification)
  static clearDB() {
    this.writeDB(DEFAULT_STATE);
  }
}
