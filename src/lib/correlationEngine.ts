import { prisma } from '@/lib/prisma';

export interface CorrelatedEvent {
  confidence: number;
  reason: string;
  incidentId: string;
}

export class CorrelationEngine {
  
  /**
   * Links a newly detected endpoint event to an existing Email Incident.
   * e.g., A file download or process execution that matches an email attachment.
   */
  static async correlateEndpointEvent(event: any): Promise<CorrelatedEvent | null> {
    // 1. Look for matching file hash in EmailAttachments
    const hash = event.hashSha256 || event.fileHash;
    if (hash) {
      const match = await prisma.emailAttachment.findFirst({
        where: { sha256: hash },
        include: { emailAnalysis: true }
      });
      
      if (match && match.emailAnalysis?.incidentId) {
        // High confidence match based on cryptographic hash
        await prisma.evidence.create({
          data: {
            incidentId: match.emailAnalysis.incidentId,
            type: event.type === 'PROCESS_STARTED' ? 'ENDPOINT_PROCESS' : 'ENDPOINT_FILE',
            source: 'WINDOWS_AGENT',
            hash: hash,
            value: event.processName || match.filename,
            metadata: JSON.stringify(event),
            confidence: 0.95
          }
        });
        
        return { confidence: 0.95, reason: 'Exact SHA-256 match with email attachment.', incidentId: match.emailAnalysis.incidentId };
      }
    }
    
    // 2. Look for matching filename (medium confidence)
    if (event.processName || event.commandLine) {
      const potentialMatches = await prisma.emailAttachment.findMany({
        where: {
          filename: event.processName
        },
        include: { emailAnalysis: true }
      });
      
      if (potentialMatches.length > 0) {
        // We take the most recent
        const match = potentialMatches[0];
        if (match.emailAnalysis?.incidentId) {
          await prisma.evidence.create({
            data: {
              incidentId: match.emailAnalysis.incidentId,
              type: 'ENDPOINT_PROCESS',
              source: 'WINDOWS_AGENT',
              value: event.processName,
              metadata: JSON.stringify(event),
              confidence: 0.65
            }
          });
          
          return { confidence: 0.65, reason: 'Filename match with recent email attachment.', incidentId: match.emailAnalysis.incidentId };
        }
      }
    }
    
    // 3. Look for network connection to known malicious URL from email (IP match)
    if (event.networkInfo && event.networkInfo.remoteIp) {
      // Simplistic check for MVP
      const urls = await prisma.emailUrl.findMany({
        include: { emailAnalysis: true }
      });
      
      const matchedUrl = urls.find(u => u.url.includes(event.networkInfo.remoteIp));
      if (matchedUrl && matchedUrl.emailAnalysis?.incidentId) {
        await prisma.evidence.create({
            data: {
              incidentId: matchedUrl.emailAnalysis.incidentId,
              type: 'ENDPOINT_NETWORK',
              source: 'WINDOWS_AGENT',
              value: event.networkInfo.remoteIp,
              metadata: JSON.stringify(event),
              confidence: 0.85
            }
        });
        
        return { confidence: 0.85, reason: 'Network connection matches IP/Domain from email body.', incidentId: matchedUrl.emailAnalysis.incidentId };
      }
    }

    return null;
  }
}
