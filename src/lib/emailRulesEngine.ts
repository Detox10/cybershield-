export interface EmailFeatures {
  observedSpf: string;
  observedDkim: string;
  observedDmarc: string;
  attachmentCount: number;
  urlCount: number;
  hasMaliciousAttachment: boolean;
}

export interface RuleEvaluation {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  flags: string[];
}

export class EmailRulesEngine {
  static evaluate(features: EmailFeatures): RuleEvaluation {
    let riskScore = 0;
    const flags: string[] = [];

    // Authentication Checks
    if (features.observedSpf === 'FAIL') {
      riskScore += 20;
      flags.push('SPF_FAILED');
    }
    if (features.observedDkim === 'FAIL') {
      riskScore += 20;
      flags.push('DKIM_FAILED');
    }
    if (features.observedDmarc === 'FAIL') {
      riskScore += 20;
      flags.push('DMARC_FAILED');
    }

    // Heuristics
    if (features.attachmentCount > 0) {
      riskScore += 10;
      flags.push('HAS_ATTACHMENTS');
    }
    if (features.urlCount > 3) {
      riskScore += 10;
      flags.push('HIGH_URL_COUNT');
    }

    // Threat Intel (e.g. VT)
    if (features.hasMaliciousAttachment) {
      riskScore += 50;
      flags.push('MALICIOUS_ATTACHMENT_DETECTED');
    }

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (riskScore > 30 && riskScore <= 60) riskLevel = 'MEDIUM';
    if (riskScore > 60) riskLevel = 'HIGH';

    return {
      riskScore,
      riskLevel,
      flags
    };
  }
}
