"use client";

import React, { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ShieldAlert,
  Lock,
  Zap,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

interface ThreatIncident {
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



import { useTelemetryStore } from "@/store/telemetryStore";

export const DealsTable: React.FC = () => {
  const incidents = useTelemetryStore((state) => state.incidents);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<any | null>(null);

  const filteredIncidents = incidents.filter(
    (inc) =>
      inc.threatName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.cveTtp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.targetHost.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredIncidents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredIncidents.map((i) => i.id));
    }
  };

  return (
    <div className="w-full bg-[#121418]/90 border border-white/[0.08] rounded-3xl p-6 shadow-xl backdrop-blur-xl space-y-5">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Active Threat Incidents & Mitigation Feed</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time telemetry stream of intercepted malware, CVE exploits, and automated mitigations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search threat, CVE, or host..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#161922] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/20 transition-all"
            />
          </div>

          {/* Filter Button */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161922] border border-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#1E222E] transition-colors">
            <SlidersHorizontal className="w-3 h-3 text-slate-400" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/[0.06] text-[10px] font-mono uppercase tracking-wider text-slate-400">
              <th className="py-3 px-3 w-8">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length === filteredIncidents.length &&
                    filteredIncidents.length > 0
                  }
                  onChange={toggleSelectAll}
                  className="rounded bg-[#1A1D25] border-white/20 text-[#FF7A00] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
              </th>
              <th className="py-3 px-3 font-bold">THREAT PAYLOAD / ARTIFACT</th>
              <th className="py-3 px-3 font-bold">CVE / ATT&CK TTP</th>
              <th className="py-3 px-3 font-bold">TARGET HOST / IP</th>
              <th className="py-3 px-3 font-bold">DETECTION VECTOR</th>
              <th className="py-3 px-3 font-bold">TIMESTAMP</th>
              <th className="py-3 px-3 font-bold">STATUS</th>
              <th className="py-3 px-3 font-bold text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filteredIncidents.map((incident) => {
              const isSelected = selectedIds.includes(incident.id);
              return (
                <tr
                  key={incident.id}
                  className={`group hover:bg-white/[0.02] transition-colors ${
                    isSelected ? "bg-white/[0.03]" : ""
                  }`}
                >
                  <td className="py-3.5 px-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(incident.id)}
                      className="rounded bg-[#1A1D25] border-white/20 text-[#FF7A00] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                  </td>
                  <td className="py-3.5 px-3 font-bold text-white flex items-center gap-2">
                    <ShieldAlert
                      className={`w-4 h-4 ${
                        incident.severity === "CRITICAL"
                          ? "text-rose-400"
                          : "text-amber-400"
                      }`}
                    />
                    <span>{incident.threatName}</span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-[11px]">
                      {incident.cveTtp}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-400">
                    {incident.targetHost}
                  </td>
                  <td className="py-3.5 px-3 text-slate-300">
                    {incident.vector}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-400">
                    {incident.timestamp}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                        incident.status === "QUARANTINED"
                          ? "bg-rose-950/60 text-rose-400 border border-rose-800/40"
                          : incident.status === "BLOCKED"
                          ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                          : "bg-amber-950/60 text-amber-400 border border-amber-800/40"
                      }`}
                    >
                      {incident.status === "QUARANTINED" && (
                        <Lock className="w-3 h-3" />
                      )}
                      {incident.status === "BLOCKED" && (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      {incident.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => setSelectedIncident(incident)}
                      className="px-2.5 py-1 rounded-lg bg-[#161922] hover:bg-[#1E222E] border border-white/10 text-slate-200 text-xs font-semibold transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Selected Incident AI Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121418] border border-white/15 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-white">
                  {selectedIncident.threatName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕ CLOSE
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between font-mono text-slate-300">
                <span>CVE / ATT&CK:</span>
                <span className="text-[#FF7A00] font-bold">{selectedIncident.cveTtp}</span>
              </div>
              <div className="flex justify-between font-mono text-slate-300">
                <span>Target Host:</span>
                <span>{selectedIncident.targetHost}</span>
              </div>
              <div className="flex justify-between font-mono text-slate-300">
                <span>Mitigation Status:</span>
                <span className="text-emerald-400 font-bold">{selectedIncident.status}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#161A24] border border-white/10 space-y-1 mt-2">
                <div className="flex items-center gap-1.5 text-slate-200 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF7A00]" />
                  <span>AI Neural Analysis</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {selectedIncident.aiSummary}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  alert("Host successfully isolated from network mesh.");
                  setSelectedIncident(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition-all"
              >
                Isolate Host Node
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DealsTable;
