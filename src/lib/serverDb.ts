import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "CLEAN" | string;
  positives: number;
  totalEngines: number;
  verdict: string;
  familyName?: string;
  mitreTtp?: string;
  timestamp: string;
  quarantined: boolean;
  engineResults?: Record<string, { category: string; result: string }>;
  originalPath?: string;
  quarantineDate?: string;
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
  role: "SENTINEL_ROOT_ADMIN" | "SECURITY_ANALYST" | "AUDITOR" | string;
  avatar: string;
  createdAt: string;
  lastLogin: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  type: "critical" | "warning" | "info" | "success" | string;
}

export interface ThreatIncident {
  id: string;
  threatName: string;
  cveTtp: string;
  targetHost: string;
  vector: string;
  severity: "CRITICAL" | "HIGH" | "ELEVATED" | "MITIGATED" | string;
  timestamp: string;
  status: "QUARANTINED" | "BLOCKED" | "SANDBOXED" | "ANALYZING" | string;
  aiSummary: string;
}

// Singleton database class (now Prisma backed)
export class ServerDB {
  
  // --- Scans ---
  static async getScans(): Promise<ScannedFileRecord[]> {
    const records = await prisma.scannedFileRecord.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return records.map(r => ({
      ...r,
      md5: r.md5 || undefined,
      sha1: r.sha1 || undefined,
      familyName: r.familyName || undefined,
      mitreTtp: r.mitreTtp || undefined,
      engineResults: r.engineResults ? JSON.parse(r.engineResults) : undefined,
      originalPath: r.originalPath || undefined,
      quarantineDate: r.quarantineDate || undefined,
    }));
  }

  static async addScan(scan: ScannedFileRecord): Promise<void> {
    await prisma.scannedFileRecord.upsert({
      where: { id: scan.id },
      update: {},
      create: {
        id: scan.id,
        name: scan.name,
        size: scan.size,
        type: scan.type,
        sha256: scan.sha256,
        md5: scan.md5 || null,
        sha1: scan.sha1 || null,
        entropy: scan.entropy,
        isMalicious: scan.isMalicious,
        severity: scan.severity,
        positives: scan.positives,
        totalEngines: scan.totalEngines,
        verdict: scan.verdict,
        familyName: scan.familyName || null,
        mitreTtp: scan.mitreTtp || null,
        timestamp: scan.timestamp,
        quarantined: scan.quarantined,
        engineResults: scan.engineResults ? JSON.stringify(scan.engineResults) : null,
        originalPath: scan.originalPath || null,
        quarantineDate: scan.quarantineDate || null,
      }
    });
  }

  static async quarantineFile(sha256: string): Promise<void> {
    // 1. Update the scan
    const scans = await prisma.scannedFileRecord.findMany({ where: { sha256 } });
    for (const scan of scans) {
      await prisma.scannedFileRecord.update({
        where: { id: scan.id },
        data: { quarantined: true, quarantineDate: new Date().toISOString() }
      });
    }

    // 2. Update incidents mentioning the hash
    const incidents = await prisma.incident.findMany({
      where: { aiSummary: { contains: sha256 } }
    });
    for (const inc of incidents) {
      await prisma.incident.update({
        where: { id: inc.id },
        data: { status: "QUARANTINED" }
      });
    }

    // 3. Add CyberEvent if we updated a scan
    if (scans.length > 0) {
      await prisma.cyberEvent.create({
        data: {
          eventId: `evt-${Date.now()}`,
          deviceId: 'system', // or the relevant agent ID if we tracked it
          type: "QUARANTINE_EXECUTED",
          severity: "HIGH",
          source: "Sentinel Dashboard",
          evidence: JSON.stringify({
             title: "File Quarantined",
             description: `Artifact ${sha256.substring(0,8)}... moved to secure vault.`
          }),
          status: "RESOLVED"
        }
      });
    }
  }

  // --- Reports ---
  static async getReports(): Promise<PhysicalForensicReport[]> {
    const records = await prisma.physicalForensicReport.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return records.map(r => ({
      reportId: r.reportId,
      generatedAt: r.generatedAt,
      operator: r.operator,
      deviceHostname: r.deviceHostname,
      osRelease: r.osRelease,
      cpuModel: r.cpuModel,
      gpuModel: r.gpuModel,
      ramUsage: r.ramUsage,
      primaryIp: r.primaryIp,
      scannedFilesCount: r.scannedFilesCount,
      criticalThreatsCount: r.criticalThreatsCount,
      activeFirewallRulesCount: r.activeFirewallRulesCount,
      riskScore: r.riskScore,
      digitalSignature: r.digitalSignature,
      scannedFiles: JSON.parse(r.scannedFiles)
    }));
  }

  static async addReport(report: PhysicalForensicReport): Promise<void> {
    await prisma.physicalForensicReport.create({
      data: {
        reportId: report.reportId,
        generatedAt: report.generatedAt,
        operator: report.operator,
        deviceHostname: report.deviceHostname,
        osRelease: report.osRelease,
        cpuModel: report.cpuModel,
        gpuModel: report.gpuModel,
        ramUsage: report.ramUsage,
        primaryIp: report.primaryIp,
        scannedFilesCount: report.scannedFilesCount,
        criticalThreatsCount: report.criticalThreatsCount,
        activeFirewallRulesCount: report.activeFirewallRulesCount,
        riskScore: report.riskScore,
        digitalSignature: report.digitalSignature,
        scannedFiles: JSON.stringify(report.scannedFiles),
      }
    });
  }

  // --- Users ---
  static async getUsers(): Promise<UserAccount[]> {
    // Skipping UserAccount DB migration per instructions, return empty or mock if needed.
    return [];
  }

  static async addUser(user: UserAccount): Promise<void> {
    // No-op for now.
  }

  // --- Incidents & Timeline ---
  static async getTimeline(): Promise<TimelineEvent[]> {
    const events = await prisma.cyberEvent.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100
    });
    return events.map(e => {
      let title = e.type;
      let description = `Severity: ${e.severity} | Source: ${e.source}`;
      let typeStr = "info";
      
      if (e.severity === "CRITICAL" || e.severity === "HIGH") typeStr = "critical";
      else if (e.severity === "WARNING") typeStr = "warning";
      
      if (e.evidence) {
         try {
           const ev = JSON.parse(e.evidence);
           if (ev.title) title = ev.title;
           if (ev.description) description = ev.description;
           if (ev.command) description = `Command: ${ev.command}`;
         } catch(err) { /* ignore */ }
      }
      
      return {
        id: e.eventId,
        time: e.timestamp.toLocaleTimeString(),
        title,
        description,
        type: typeStr,
      };
    });
  }

  static async addTimelineEvent(event: TimelineEvent): Promise<void> {
    await prisma.cyberEvent.create({
      data: {
        eventId: event.id || `evt-${Date.now()}`,
        deviceId: 'system',
        type: event.title || "SYSTEM_EVENT",
        severity: event.type === "critical" ? "HIGH" : (event.type === "warning" ? "WARNING" : "INFO"),
        source: "Legacy API",
        evidence: JSON.stringify({ description: event.description, title: event.title }),
        status: "RESOLVED"
      }
    });
  }

  static async getIncidents(): Promise<ThreatIncident[]> {
    const incidents = await prisma.incident.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    return incidents.map(i => ({
      id: i.id,
      threatName: i.title,
      cveTtp: i.cveTtp || "Unknown",
      targetHost: i.targetHost || "Unknown",
      vector: i.vector || "Unknown",
      severity: i.severity,
      timestamp: i.createdAt.toISOString(),
      status: i.status,
      aiSummary: i.aiSummary || ""
    }));
  }

  static async addIncident(incident: ThreatIncident): Promise<void> {
    await prisma.incident.create({
      data: {
        id: incident.id,
        title: incident.threatName,
        cveTtp: incident.cveTtp,
        targetHost: incident.targetHost,
        vector: incident.vector,
        severity: incident.severity,
        status: incident.status,
        aiSummary: incident.aiSummary,
      }
    });
  }

  // Utility to clear DB (for "Historical Degradation" verification)
  static async clearDB(): Promise<void> {
    // Danger: Only use in tests/resets.
    await prisma.scannedFileRecord.deleteMany();
    await prisma.cyberEvent.deleteMany();
    await prisma.physicalForensicReport.deleteMany();
    await prisma.incident.deleteMany();
  }
}
