import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const DATA_FILE = path.join(process.cwd(), 'cybershield_data.json');

async function main() {
  if (!fs.existsSync(DATA_FILE)) {
    console.log("No cybershield_data.json found. Nothing to migrate.");
    return;
  }
  
  console.log(`Reading data from ${DATA_FILE}...`);
  const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
  const data = JSON.parse(rawData);
  
  const stats = {
    scans: { source: data.scans?.length || 0, migrated: 0, skipped: 0, failed: 0 },
    timeline: { source: data.timeline?.length || 0, migrated: 0, skipped: 0, failed: 0 },
    reports: { source: data.reports?.length || 0, migrated: 0, skipped: 0, failed: 0 },
    incidents: { source: data.incidents?.length || 0, migrated: 0, skipped: 0, failed: 0 }
  };
  
  console.log("Starting Transactional Migration...");
  
  // We use sequential processing with upsert to handle duplicates cleanly.
  // We wrap logically related groupings in transactions where appropriate, but here we iterate individually 
  // to collect detailed error reasoning for failures.

  // 1. Migrate ScannedFileRecords
  if (data.scans) {
    console.log("Migrating Scans...");
    for (const scan of data.scans) {
      try {
        const existing = await prisma.scannedFileRecord.findUnique({ where: { id: scan.id } });
        if (existing) {
          stats.scans.skipped++;
          continue;
        }
        await prisma.scannedFileRecord.create({
          data: {
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
        stats.scans.migrated++;
      } catch (err: any) {
        console.error(`Failed to migrate scan ${scan.id}: ${err.message}`);
        stats.scans.failed++;
      }
    }
  }

  // 2. Migrate TimelineEvents
  if (data.timeline) {
    console.log("Migrating Timeline Events...");
    for (const event of data.timeline) {
      try {
        const existing = await prisma.cyberEvent.findUnique({ where: { eventId: event.id } });
        if (existing) {
          stats.timeline.skipped++;
          continue;
        }
        await prisma.cyberEvent.create({
          data: {
            eventId: event.id,
            deviceId: 'system',
            type: event.title || 'MIGRATED_EVENT',
            severity: event.type === "critical" ? "HIGH" : (event.type === "warning" ? "WARNING" : "INFO"),
            source: 'Legacy Migration',
            evidence: JSON.stringify({ description: event.description, title: event.title }),
            status: "RESOLVED"
          }
        });
        stats.timeline.migrated++;
      } catch (err: any) {
        console.error(`Failed to migrate timeline event ${event.id}: ${err.message}`);
        stats.timeline.failed++;
      }
    }
  }

  // 3. Migrate Reports
  if (data.reports) {
    console.log("Migrating Reports...");
    for (const report of data.reports) {
      try {
        const existing = await prisma.physicalForensicReport.findUnique({ where: { reportId: report.reportId } });
        if (existing) {
          stats.reports.skipped++;
          continue;
        }
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
        stats.reports.migrated++;
      } catch (err: any) {
        console.error(`Failed to migrate report ${report.reportId}: ${err.message}`);
        stats.reports.failed++;
      }
    }
  }

  // 4. Migrate Incidents
  if (data.incidents) {
    console.log("Migrating Incidents...");
    for (const incident of data.incidents) {
      try {
        const existing = await prisma.incident.findUnique({ where: { id: incident.id } });
        if (existing) {
          stats.incidents.skipped++;
          continue;
        }
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
        stats.incidents.migrated++;
      } catch (err: any) {
        console.error(`Failed to migrate incident ${incident.id}: ${err.message}`);
        stats.incidents.failed++;
      }
    }
  }

  console.log("\n====== MIGRATION STATISTICS ======");
  console.table(stats);
  console.log("==================================");
  console.log("NOTE: cybershield_data.json has been preserved as a backup.");
}

main()
  .catch(e => {
    console.error("Migration fatal error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
