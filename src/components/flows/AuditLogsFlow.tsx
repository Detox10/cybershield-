"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Activity,
} from "lucide-react";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  level: "INFO" | "WARN" | "CRITICAL";
  ip: string;
}

const INITIAL_LOGS: AuditLog[] = [
  {
    id: "LOG-5819",
    timestamp: "08:14:22",
    user: "sentinel_ai_engine",
    action: "QUARANTINE_PAYLOAD_EXEC",
    resource: "e3b0c44298fc1c14... (LockBit3)",
    level: "CRITICAL",
    ip: "10.0.4.12",
  },
  {
    id: "LOG-5820",
    timestamp: "08:11:05",
    user: "root@cybershield.os",
    action: "EBPF_FILTER_ATTACH",
    resource: "kprobe/sys_enter_execve",
    level: "INFO",
    ip: "127.0.0.1",
  },
  {
    id: "LOG-5821",
    timestamp: "07:58:33",
    user: "analyst@cybershield.os",
    action: "ZERO_TRUST_RULE_UPDATE",
    resource: "Firewall / Port 22 SSH Drop",
    level: "WARN",
    ip: "192.168.1.104",
  },
  {
    id: "LOG-5822",
    timestamp: "07:44:19",
    user: "system_heartbeat",
    action: "TELEMETRY_SAMPLE_INGEST",
    resource: "Network Ingress Buffer (0 dropped)",
    level: "INFO",
    ip: "127.0.0.1",
  },
  {
    id: "LOG-5823",
    timestamp: "07:30:00",
    user: "sentinel_root",
    action: "DATABASE_SESSION_AUTH",
    resource: "Supabase Sentinel Store",
    level: "INFO",
    ip: "127.0.0.1",
  },
];

export const AuditLogsFlow: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>(INITIAL_LOGS);
  const [filterLevel, setFilterLevel] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.resource.toLowerCase().includes(search.toLowerCase());
    const matchesLvl = filterLevel === "ALL" || log.level === filterLevel;
    return matchesSearch && matchesLvl;
  });

  const handleExportCsv = () => {
    let csv = "ID,Timestamp,User,Action,Resource,Level,IP\n";
    logs.forEach((l) => {
      csv += `"${l.id}","${l.timestamp}","${l.user}","${l.action}","${l.resource}","${l.level}","${l.ip}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `cybershield_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="bg-[#111317] border border-white/[0.08] rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Immutable Security Audit Trail
            </h2>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-sky-950/80 border border-sky-800 text-sky-400">
              TAMPER-PROOF
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete cryptographic audit log of all administrative actions, rule mutations, and eBPF events.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#161921] hover:bg-[#1E2330] border border-white/10 text-xs font-semibold text-white transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Trail (.CSV)</span>
        </button>
      </div>

      {/* Log Feed Card */}
      <div className="bg-[#111317] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audit actions, users, or resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#161921] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF7A00]"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#161921] border border-white/[0.08] text-xs font-semibold">
            {["ALL", "INFO", "WARN", "CRITICAL"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  filterLevel === lvl ? "bg-[#222733] text-white font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] text-slate-400 font-mono text-[10px] uppercase">
                <th className="pb-3">Timestamp</th>
                <th className="pb-3">Level</th>
                <th className="pb-3">Actor / User</th>
                <th className="pb-3">Action Type</th>
                <th className="pb-3">Resource Target</th>
                <th className="pb-3 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 font-mono text-slate-400">{log.timestamp}</td>
                  <td className="py-3">
                    <span
                      className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded ${
                        log.level === "CRITICAL"
                          ? "bg-rose-950 text-rose-400 border border-rose-800"
                          : log.level === "WARN"
                          ? "bg-amber-950 text-amber-400 border border-amber-800"
                          : "bg-slate-800 text-slate-300 border border-slate-700"
                      }`}
                    >
                      {log.level}
                    </span>
                  </td>
                  <td className="py-3 font-bold text-white">{log.user}</td>
                  <td className="py-3 font-mono text-slate-300">{log.action}</td>
                  <td className="py-3 text-slate-400 truncate max-w-xs">{log.resource}</td>
                  <td className="py-3 font-mono text-slate-400 text-right">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AuditLogsFlow;
