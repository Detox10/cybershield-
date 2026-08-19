"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  Search,
  Download,
  Filter,
  CheckCircle2,
  Lock,
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { ForensicsModal, Incident } from "../modals/ForensicsModal";

// Interface exported from ForensicsModal

const INITIAL_INCIDENTS: Incident[] = [
  {
    id: "INC-9021",
    severity: "CRITICAL",
    title: "XZ Utils Liblzma Backdoor Payload Detonated",
    vector: "CVE-2024-3094 • sshd.bin (PID 9182)",
    mitreTtp: "T1027.005 (Defense Evasion)",
    targetHost: "prod-gateway-node-04",
    status: "QUARANTINED",
    timestamp: "08:14:22",
  },
  {
    id: "INC-9022",
    severity: "HIGH",
    title: "Suspicious PowerShell Reflective Memory Injection",
    vector: "CVE-2023-38606 • powershell.exe (PID 3402)",
    mitreTtp: "T1059.001 (Execution)",
    targetHost: "sec-analyst-ws-01",
    status: "CONTAINED",
    timestamp: "08:11:05",
  },
  {
    id: "INC-9023",
    severity: "MEDIUM",
    title: "Ransomware Canary Modification Detected",
    vector: "Zero-Day • bg_worker_node (PID 5510)",
    mitreTtp: "T1486 (Impact)",
    targetHost: "db-replica-east-02",
    status: "RESOLVED",
    timestamp: "07:54:19",
  },
  {
    id: "INC-9024",
    severity: "LOW",
    title: "Unsigned Design Token Manifest Ingestion Blocked",
    vector: "Zero-Day • figma-token-sync (PID 1124)",
    mitreTtp: "T1195.002 (Initial Access)",
    targetHost: "build-runner-ci-09",
    status: "RESOLVED",
    timestamp: "07:42:01",
  },
];

export const ThreatAnalysisFlow: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const filtered = incidents.filter((inc) => {
    const matchesSearch =
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.vector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.targetHost.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSev = severityFilter === "ALL" || inc.severity === severityFilter;
    return matchesSearch && matchesSev;
  });

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(incidents, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cybershield_incidents_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="bg-[#111317] border border-white/[0.08] rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              MITRE ATT&CK Threat Intelligence Matrix
            </h2>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800 text-rose-400">
              ACTIVE FORENSICS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Forensic disassembly, binary SHA-256 analysis, and isolated microVM sandbox detonation.
          </p>
        </div>

        <button
          onClick={handleExportJson}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#161921] hover:bg-[#1E2330] border border-white/10 text-xs font-semibold text-white transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Incident Reports (.JSON)</span>
        </button>
      </div>

      {/* MITRE Stage Capsules */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#151820] border border-white/[0.06] space-y-1">
          <div className="text-[10px] font-mono text-slate-400">TA0001</div>
          <div className="text-xs font-bold text-white">Initial Access</div>
          <div className="text-[10px] font-mono text-emerald-400">1 Ingress Signature</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#151820] border border-white/[0.06] space-y-1">
          <div className="text-[10px] font-mono text-slate-400">TA0002</div>
          <div className="text-xs font-bold text-white">Execution</div>
          <div className="text-[10px] font-mono text-emerald-400">2 Ingress Signatures</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#151820] border border-rose-900/40 space-y-1">
          <div className="text-[10px] font-mono text-rose-400">TA0005</div>
          <div className="text-xs font-bold text-rose-300">Defense Evasion</div>
          <div className="text-[10px] font-mono text-rose-400 font-bold">3 Intercepts (Active)</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#151820] border border-white/[0.06] space-y-1">
          <div className="text-[10px] font-mono text-slate-400">TA0040</div>
          <div className="text-xs font-bold text-white">Impact / Ransom</div>
          <div className="text-[10px] font-mono text-emerald-400">1 Ingress Signature</div>
        </div>
      </div>

      {/* Incidents Forensics Table */}
      <div className="bg-[#111317] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search threats, CVEs, or hosts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#161921] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF7A00]"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#161921] border border-white/[0.08] text-xs font-semibold">
            {["ALL", "CRITICAL", "HIGH", "MEDIUM"].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  severityFilter === sev
                    ? "bg-[#222733] text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] text-slate-400 font-mono text-[10px] uppercase">
                <th className="pb-3">Severity</th>
                <th className="pb-3">Threat Vector & CVE</th>
                <th className="pb-3">MITRE ATT&CK</th>
                <th className="pb-3">Target Host</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((inc) => (
                <tr key={inc.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3">
                    <span
                      className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded ${
                        inc.severity === "CRITICAL"
                          ? "bg-rose-950 text-rose-400 border border-rose-800"
                          : inc.severity === "HIGH"
                          ? "bg-amber-950 text-amber-400 border border-amber-800"
                          : "bg-sky-950 text-sky-400 border border-sky-800"
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="font-bold text-white">{inc.title}</div>
                    <div className="text-[10px] font-mono text-slate-400">{inc.vector}</div>
                  </td>
                  <td className="py-3 font-mono text-slate-300">{inc.mitreTtp}</td>
                  <td className="py-3 font-mono text-slate-400">{inc.targetHost}</td>
                  <td className="py-3">
                    <span className="text-[10px] font-mono font-bold text-emerald-400">
                      ● {inc.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setSelectedIncident(inc)}
                      className="px-2.5 py-1 rounded-lg bg-[#161921] hover:bg-[#202534] border border-white/10 text-[10px] font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      Inspect Forensics
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Forensic Deep Dive Modal */}
      <ForensicsModal 
        incident={selectedIncident} 
        onClose={() => setSelectedIncident(null)} 
      />
    </div>
  );
};
export default ThreatAnalysisFlow;
