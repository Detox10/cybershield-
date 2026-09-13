-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "osBuild" TEXT,
    "credentialSecret" TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "hasAdminPrivileges" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelemetrySnapshot" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cpuLoadPercent" DOUBLE PRECISION NOT NULL,
    "memUsagePercent" DOUBLE PRECISION NOT NULL,
    "rxMbps" DOUBLE PRECISION NOT NULL,
    "txMbps" DOUBLE PRECISION NOT NULL,
    "processes" TEXT,
    "services" TEXT,
    "networkConnections" TEXT,

    CONSTRAINT "TelemetrySnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CyberEvent" (
    "eventId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL DEFAULT 'default-org',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "processName" TEXT,
    "commandLine" TEXT,
    "fileHash" TEXT,
    "networkInfo" TEXT,
    "evidence" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',

    CONSTRAINT "CyberEvent_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'INVESTIGATING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cveTtp" TEXT,
    "targetHost" TEXT,
    "vector" TEXT,
    "aiSummary" TEXT,
    "aiSeverity" TEXT,
    "aiConfidence" TEXT,
    "aiEvidence" TEXT,
    "aiTimeline" TEXT,
    "aiTechniques" TEXT,
    "aiRecommendations" TEXT,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidence" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hash" TEXT,
    "value" TEXT,
    "metadata" TEXT,
    "confidence" DOUBLE PRECISION,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailAnalysis" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT,
    "subject" TEXT,
    "sender" TEXT,
    "recipient" TEXT,
    "date" TIMESTAMP(3),
    "observedSpf" TEXT,
    "observedDkim" TEXT,
    "observedDmarc" TEXT,
    "sourceIp" TEXT,
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "riskLevel" TEXT NOT NULL,

    CONSTRAINT "EmailAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailHeader" (
    "id" TEXT NOT NULL,
    "emailAnalysisId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "EmailHeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailUrl" (
    "id" TEXT NOT NULL,
    "emailAnalysisId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "domain" TEXT,
    "riskLevel" TEXT NOT NULL,

    CONSTRAINT "EmailUrl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailAttachment" (
    "id" TEXT NOT NULL,
    "emailAnalysisId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT,
    "sha256" TEXT,
    "riskLevel" TEXT NOT NULL,

    CONSTRAINT "EmailAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThreatIndicator" (
    "id" TEXT NOT NULL,
    "emailAnalysisId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "reputation" TEXT NOT NULL,
    "source" TEXT NOT NULL,

    CONSTRAINT "ThreatIndicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimelineEvent" (
    "id" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimelineEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhysicalForensicReport" (
    "reportId" TEXT NOT NULL,
    "generatedAt" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "deviceHostname" TEXT NOT NULL,
    "osRelease" TEXT NOT NULL,
    "cpuModel" TEXT NOT NULL,
    "gpuModel" TEXT NOT NULL,
    "ramUsage" TEXT NOT NULL,
    "primaryIp" TEXT NOT NULL,
    "scannedFilesCount" INTEGER NOT NULL,
    "criticalThreatsCount" INTEGER NOT NULL,
    "activeFirewallRulesCount" INTEGER NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "digitalSignature" TEXT NOT NULL,
    "scannedFiles" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PhysicalForensicReport_pkey" PRIMARY KEY ("reportId")
);

-- CreateTable
CREATE TABLE "ScannedFileRecord" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sha256" TEXT NOT NULL,
    "md5" TEXT,
    "sha1" TEXT,
    "entropy" DOUBLE PRECISION NOT NULL,
    "isMalicious" BOOLEAN NOT NULL,
    "severity" TEXT NOT NULL,
    "positives" INTEGER NOT NULL,
    "totalEngines" INTEGER NOT NULL,
    "verdict" TEXT NOT NULL,
    "familyName" TEXT,
    "mitreTtp" TEXT,
    "timestamp" TEXT NOT NULL,
    "quarantined" BOOLEAN NOT NULL,
    "engineResults" TEXT,
    "originalPath" TEXT,
    "quarantineDate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScannedFileRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailAnalysis_incidentId_key" ON "EmailAnalysis"("incidentId");

-- AddForeignKey
ALTER TABLE "TelemetrySnapshot" ADD CONSTRAINT "TelemetrySnapshot_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CyberEvent" ADD CONSTRAINT "CyberEvent_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailAnalysis" ADD CONSTRAINT "EmailAnalysis_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailHeader" ADD CONSTRAINT "EmailHeader_emailAnalysisId_fkey" FOREIGN KEY ("emailAnalysisId") REFERENCES "EmailAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailUrl" ADD CONSTRAINT "EmailUrl_emailAnalysisId_fkey" FOREIGN KEY ("emailAnalysisId") REFERENCES "EmailAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailAttachment" ADD CONSTRAINT "EmailAttachment_emailAnalysisId_fkey" FOREIGN KEY ("emailAnalysisId") REFERENCES "EmailAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreatIndicator" ADD CONSTRAINT "ThreatIndicator_emailAnalysisId_fkey" FOREIGN KEY ("emailAnalysisId") REFERENCES "EmailAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
