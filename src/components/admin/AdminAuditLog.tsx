"use client";

import React, { useState } from "react";
import { Search, Filter } from "lucide-react";

type LogLevel = "INFO" | "WARN" | "CRITICAL" | "AUTH";

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  target: string;
  level: LogLevel;
  ip: string;
}

const MOCK_LOGS: AuditEntry[] = [
  { id: "1",  timestamp: "21:34:02", actor: "Sentinel Root", actorRole: "ROOT_ADMIN", action: "Role changed: James Osei → SUSPENDED",          target: "user:j.osei",         level: "WARN",     ip: "192.168.1.100" },
  { id: "2",  timestamp: "21:33:55", actor: "Aria Singh",    actorRole: "ANALYST",    action: "Threat scan initiated on /sys/kernel/debug",    target: "scanner:deep",        level: "INFO",     ip: "192.168.1.104" },
  { id: "3",  timestamp: "21:33:40", actor: "Sentinel Root", actorRole: "ROOT_ADMIN", action: "Tool access toggled: ai_assistant → ANALYST",   target: "policy:tool_access",  level: "INFO",     ip: "192.168.1.100" },
  { id: "4",  timestamp: "21:32:18", actor: "Marcus Webb",   actorRole: "SOC_OPS",    action: "Alert acknowledged: SYN Flood (194.26.29.112)", target: "alert:net_flood_44",  level: "INFO",     ip: "192.168.1.112" },
  { id: "5",  timestamp: "21:31:05", actor: "SYSTEM",        actorRole: "SYSTEM",     action: "eBPF probe buffer overflow — auto-reset",       target: "ebpf:ring0_buf",      level: "CRITICAL", ip: "127.0.0.1" },
  { id: "6",  timestamp: "21:30:44", actor: "Lena Fischer",  actorRole: "ANALYST",    action: "Login attempt failed (invalid OTP)",            target: "auth:l.fischer",      level: "WARN",     ip: "10.0.0.14" },
  { id: "7",  timestamp: "21:29:22", actor: "Priya Nair",    actorRole: "DEV_MGR",    action: "Device diagnostics pulled for NODE-07",         target: "device:node-07",      level: "INFO",     ip: "192.168.1.108" },
  { id: "8",  timestamp: "21:28:58", actor: "Sentinel Root", actorRole: "ROOT_ADMIN", action: "Session force-terminated: j.osei@cs.internal",  target: "session:8f2a1c",      level: "WARN",     ip: "192.168.1.100" },
  { id: "9",  timestamp: "21:27:11", actor: "Dev Console",   actorRole: "SOC_OPS",    action: "Heartbeat check: all nodes nominal",            target: "monitor:mesh",        level: "INFO",     ip: "127.0.0.1" },
  { id: "10", timestamp: "21:26:44", actor: "Aria Singh",    actorRole: "ANALYST",    action: "Zero-Trust rule exported to /backup/zt_rules",  target: "policy:zero_trust",   level: "INFO",     ip: "192.168.1.104" },
  { id: "11", timestamp: "21:25:02", actor: "SYSTEM",        actorRole: "SYSTEM",     action: "TLS certificate rotated on gateway:443",        target: "cert:tls_gw",         level: "INFO",     ip: "127.0.0.1" },
  { id: "12", timestamp: "21:24:19", actor: "Sentinel Root", actorRole: "ROOT_ADMIN", action: "New user invited: lena.fischer@cs.internal",    target: "user:l.fischer",      level: "AUTH",     ip: "192.168.1.100" },
];

const LEVEL_STYLE: Record<LogLevel, string> = {
  INFO:     "bg-slate-800/60 text-slate-300 border-slate-700/40",
  WARN:     "bg-amber-950/60 text-amber-400 border-amber-800/40",
  CRITICAL: "bg-rose-950/60 text-rose-400 border-rose-800/40",
  AUTH:     "bg-sky-950/60 text-sky-400 border-sky-800/40",
};

export function AdminAuditLog() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<"ALL" | LogLevel>("ALL");

  const filtered = MOCK_LOGS.filter((e) => {
    const matchLevel = levelFilter === "ALL" || e.level === levelFilter;
    const matchSearch = e.actor.toLowerCase().includes(search.toLowerCase()) ||
                        e.action.toLowerCase().includes(search.toLowerCase());
    return matchLevel && matchSearch;
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-white">Admin Audit Trail</h2>
        <p className="text-xs text-slate-400 mt-0.5">All privileged actions are immutably logged.</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by actor or action..."
            className="w-full pl-9 pr-4 py-2 bg-[#13161E] border border-white/[0.08] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-[#13161E] border border-white/[0.08] rounded-xl">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as any)}
            className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Levels</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="AUTH">AUTH</option>
          </select>
        </div>
      </div>

      <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
        {filtered.map((entry) => (
          <div
            key={entry.id}
            className="p-3 rounded-2xl bg-[#13161E] border border-white/[0.05] hover:border-white/[0.10] transition-colors flex items-start gap-3"
          >
            <span className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded border mt-0.5 ${LEVEL_STYLE[entry.level]}`}>
              {entry.level}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-200 leading-snug">{entry.action}</p>
              <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-slate-500">
                <span className="text-slate-400 font-semibold">{entry.actor}</span>
                <span>•</span>
                <span>{entry.actorRole}</span>
                <span>•</span>
                <span>{entry.target}</span>
              </div>
            </div>
            <div className="text-right text-[10px] font-mono text-slate-500 shrink-0">
              <p>{entry.timestamp}</p>
              <p className="text-slate-600">{entry.ip}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
