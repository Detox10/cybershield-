export type ShieldCoreState = "IDLE" | "SCANNING" | "SECURE" | "WARNING" | "THREAT";

export type NavTab = 
  | "dashboard" 
  | "scan" 
  | "email"
  | "assistant" 
  | "threats" 
  | "diagnostics" 
  | "timeline" 
  | "audit"
  | "notifications"
  | "studio"
  | "settings";

export interface ScanStage {
  id: number;
  title: string;
  subtitle: string;
  status: "pending" | "active" | "completed";
  detail: string;
}

export interface ThreatAnalysisItem {
  id: string;
  name: string;
  category: "Trojan" | "Ransomware" | "Zero-Day Exploit" | "Memory Injection" | "Phishing Vector" | "Suspicious Library";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  aiConfidence: number;
  reasoning: string;
  eli5Explanation: string;
  timestamp: string;
  detectedLocation: string;
  affectedComponents: string[];
  mitreAttack: {
    tactic: string;
    techniqueId: string;
    techniqueName: string;
    description: string;
  }[];
  fileInfo: {
    fileName: string;
    fileSize: string;
    fileType: string;
    sha256: string;
  };
  recommendedAction: "QUARANTINE" | "ALLOW" | "SUBMIT_FOR_REVIEW";
  status: "ACTIVE_THREAT" | "QUARANTINED" | "RESOLVED" | "ANALYZING";
}

export interface DeviceHealthMetric {
  id: string;
  name: string;
  category: "cpu" | "ram" | "storage" | "battery" | "network" | "services";
  value: number;
  unit: string;
  status: "healthy" | "warning" | "critical";
  summary: string;
  details: { label: string; value: string }[];
}

export interface AICompanionMessage {
  id: string;
  sender: "user" | "assistant";
  timestamp: string;
  text: string;
  confidence?: "High Confidence" | "Standard Confidence" | "Tentative";
  technicalDetails?: string;
  actions?: { label: string; actionId: string; variant?: "primary" | "secondary" }[];
  recommendations?: string[];
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  description?: string;
  body?: string;
  timestamp: string;
  read: boolean;
  severity?: "CRITICAL" | "HIGH" | "MEDIUM" | "INFO";
  actionLabel?: string;
  actionText?: string;
  actionPayload?: string;
}

export interface AIRecommendation {
  id: string;
  category: "PATCH" | "IDENTITY" | "NETWORK" | "STORAGE" | "CHECKLIST";
  title: string;
  impactScore: number;
  description: string;
  actionText: string;
  timeToFix: string;
  status: "pending" | "completed";
}
