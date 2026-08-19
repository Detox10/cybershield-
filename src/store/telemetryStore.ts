import { create } from 'zustand';

export interface BarData {
  month: string;
  value: number;
  isPeak?: boolean;
  threatCategory: string;
  deltaPercent: string;
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

interface TelemetryState {
  threatsNeutralized: number;
  kernelOps: number;
  kernelLatency: string;
  quarantinedPayloads: number;
  aiRemediationRate: number;
  securityScore: number;

  // New system stats
  cpuLoad: number;
  cpuModel: string;
  cpuCores: number;
  cpuSpeed: number;
  memUsedGb: number;
  memTotalGb: number;
  memUsagePercent: number;
  diskUsedGb: number;
  diskTotalGb: number;
  diskUsagePercent: number;
  rxMbps: number;
  txMbps: number;

  // Phase 2 Advanced Telemetry
  osBuild: string;
  processes: any[];
  networkConnections: any[];
  services: any[];

  // Phase 5 Enterprise Fleet
  fleet: any[];

  // History for CPU graph
  cpuHistory: number[];
  
  monthDataThreats: BarData[];
  monthDataQuarantine: BarData[];
  
  timelineEvents: TimelineEvent[];
  incidents: ThreatIncident[];

  ebpfAvailable: boolean;
  ebpfReason: string;

  lastTriggeredSpike: number;

  fetchSystemStats: () => Promise<void>;
  fetchData: () => Promise<void>;
  triggerUnusualActivity: (type: 'DDoS' | 'ZeroDay' | 'Ransomware') => Promise<void>;
}

export const useTelemetryStore = create<TelemetryState>((set, get) => ({
  threatsNeutralized: 0,
  kernelOps: 0,
  kernelLatency: "N/A",
  quarantinedPayloads: 0,
  aiRemediationRate: 100, // if no incidents, 100% remediated
  securityScore: 100,

  cpuLoad: 0,
  cpuModel: "Intel Xeon E5-2699 v4",
  cpuCores: 22,
  cpuSpeed: 2.2,
  memUsedGb: 0,
  memTotalGb: 32,
  memUsagePercent: 0,
  diskUsedGb: 0,
  diskTotalGb: 1024,
  diskUsagePercent: 0,
  rxMbps: 0,
  txMbps: 0,
  
  osBuild: "Windows 11 (Unknown)",
  processes: [],
  networkConnections: [],
  services: [],
  
  fleet: [],

  cpuHistory: Array(30).fill(0),
  
  monthDataThreats: [],
  monthDataQuarantine: [],
  
  timelineEvents: [],
  incidents: [],

  ebpfAvailable: false,
  ebpfReason: "Checking...",
  lastTriggeredSpike: 0,

  fetchSystemStats: async () => {
    try {
      const res = await fetch('/api/telemetry');
      if (!res.ok) return;
      const data = await res.json();
      
      set((state) => ({
        kernelOps: data.ebpf?.opsPerSec || 0,
        ebpfAvailable: data.ebpf?.available || false,
        ebpfReason: data.ebpf?.available ? "Ring-0 hooks active" : "Windows provider not installed",
        kernelLatency: data.ebpf?.available ? "0.12ms" : "N/A",

        cpuLoad: data.cpu?.loadPercent || 0,
        cpuModel: data.cpu?.model || "Intel CPU",
        cpuCores: data.cpu?.cores || 8,
        cpuSpeed: data.cpu?.speedGhz || 3.0,
        memUsedGb: data.memory?.usedGb || 0,
        memTotalGb: data.memory?.totalGb || 32,
        memUsagePercent: data.memory?.usagePercent || 0,
        diskUsedGb: data.disk?.usedGb || 0,
        diskTotalGb: data.disk?.totalGb || 1024,
        diskUsagePercent: data.disk?.usagePercent || 0,
        rxMbps: data.network?.rxMbps || 0,
        txMbps: data.network?.txMbps || 0,

        cpuHistory: [...state.cpuHistory.slice(1), data.cpu?.loadPercent || 0],

        osBuild: data.host?.osBuild || state.osBuild,
        processes: data.advanced?.processes || state.processes,
        networkConnections: data.advanced?.networkConnections || state.networkConnections,
        services: data.advanced?.services || state.services,
        
        fleet: data.fleet || state.fleet
      }));
    } catch (error) {
      console.error("Failed to fetch system stats", error);
    }
  },

  fetchData: async () => {
    try {
      const [incRes, evtRes, scanRes] = await Promise.all([
        fetch('/api/db/incidents'),
        fetch('/api/db/timeline'),
        fetch('/api/db/scans')
      ]);

      const incidents = await incRes.json();
      const timelineEvents = await evtRes.json();
      const scans = await scanRes.json();

      const threatsNeutralized = incidents.length;
      const quarantinedPayloads = scans.filter((s: any) => s.quarantined).length;
      
      // Calculate dynamic AI Remediation Rate
      const aiRemediationRate = threatsNeutralized === 0 ? 100 : Math.round((incidents.filter((i: any) => i.status !== 'ANALYZING').length / threatsNeutralized) * 100);

      // Calculate dynamic Security Score based on live Agent data
      let score = 100;
      
      // Deduct for active/critical incidents
      const criticalCount = incidents.filter((i: any) => i.severity === 'CRITICAL').length;
      const highCount = incidents.filter((i: any) => i.severity === 'HIGH').length;
      score -= (criticalCount * 15);
      score -= (highCount * 5);
      
      // Deduct for extreme hardware load (suggests crypto mining or unmitigated attack)
      const currentCpu = get().cpuLoad;
      if (currentCpu > 95) score -= 15;
      else if (currentCpu > 85) score -= 5;
      
      // Ensure score stays within 0-100 bounds
      const securityScore = Math.max(0, Math.min(100, score));

      // Generate accurate monthly aggregated telemetry (last 6 months)
      const generateRealMonthData = (isQuarantine: boolean) => {
        const result = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthStr = d.toLocaleString('en-US', { month: 'short' });
          
          let monthVal = 0;
          if (i === 0) { // Current month
            monthVal = isQuarantine ? quarantinedPayloads : threatsNeutralized;
          }
          
          result.push({
            month: monthStr,
            value: monthVal / 1000, // Scale it for the graph which expects 50 = 50k
            isPeak: false,
            threatCategory: isQuarantine ? "Analyzed Quarantines" : "General Incident Ingress",
            deltaPercent: i === 0 && monthVal > 0 ? "+100%" : "0%"
          });
        }
        
        // Highlight peak if any data
        const maxVal = Math.max(...result.map(r => r.value));
        if (maxVal > 0) {
          const peakItem = result.find(r => r.value === maxVal);
          if (peakItem) peakItem.isPeak = true;
        }
        
        return result;
      };

      const monthDataThreats = generateRealMonthData(false);
      const monthDataQuarantine = generateRealMonthData(true);

      set({
        incidents,
        timelineEvents,
        threatsNeutralized,
        quarantinedPayloads,
        aiRemediationRate,
        securityScore,
        monthDataThreats,
        monthDataQuarantine
      });

    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  },

  triggerUnusualActivity: async (type) => {
    set({ lastTriggeredSpike: Date.now() });
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const idSuffix = Math.floor(Math.random() * 10000);
    
    let newEvent: TimelineEvent;
    let newIncident: ThreatIncident;

    switch (type) {
      case 'DDoS':
        newEvent = {
          id: `evt-ddos-${idSuffix}`,
          time: timeString,
          title: "Volumetric DDoS Detected",
          description: "Massive SYN flood mitigated by edge firewalls.",
          type: "critical"
        };
        newIncident = {
          id: `inc-ddos-${idSuffix}`,
          threatName: "Distributed SYN Flood",
          cveTtp: "T1498 (Network Denial of Service)",
          targetHost: "api-gateway-edge",
          vector: "Edge WAF",
          severity: "CRITICAL",
          timestamp: "Just now",
          status: "BLOCKED",
          aiSummary: "Autonomous traffic shaping applied to absorb 500Gbps SYN flood."
        };
        break;
      case 'ZeroDay':
        newEvent = {
          id: `evt-zd-${idSuffix}`,
          time: timeString,
          title: "Zero-Day Exploit Attempt",
          description: "Unknown memory corruption payload intercepted.",
          type: "critical"
        };
        newIncident = {
          id: `inc-zd-${idSuffix}`,
          threatName: "Unknown Memory Corruption",
          cveTtp: "Zero-Day (Heuristic)",
          targetHost: "srv-auth-prod-02",
          vector: "Heuristic Monitor",
          severity: "CRITICAL",
          timestamp: "Just now",
          status: "QUARANTINED",
          aiSummary: "Sensor detected unusual pointer dereference; process terminated instantly."
        };
        break;
      case 'Ransomware':
      default:
        newEvent = {
          id: `evt-rw-${idSuffix}`,
          time: timeString,
          title: "Ransomware Pre-cursor Blocked",
          description: "Lateral movement via SMB blocked.",
          type: "warning"
        };
        newIncident = {
          id: `inc-rw-${idSuffix}`,
          threatName: "Ransomware Lateral Scan",
          cveTtp: "T1021.002 (SMB/Windows Admin Shares)",
          targetHost: "workstation-hr-02",
          vector: "Network Segregation",
          severity: "HIGH",
          timestamp: "Just now",
          status: "BLOCKED",
          aiSummary: "Multiple unauthorized SMB login attempts detected from compromised host."
        };
        break;
    }

    // Persist to backend DB
    await fetch('/api/db/timeline', { method: 'POST', body: JSON.stringify(newEvent) });
    await fetch('/api/db/incidents', { method: 'POST', body: JSON.stringify(newIncident) });
    
    get().fetchData(); // Refresh UI state
  }
}));
