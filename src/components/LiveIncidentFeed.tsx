"use client";

import React, { useState } from "react";
import {
  ListFilter,
  Search,
  CheckCircle,
  AlertTriangle,
  Pause,
  Play,
  Terminal,
  Shield,
} from "lucide-react";

export interface IncidentLog {
  id: string;
  time: string;
  sourceIp: string;
  destination: string;
  eventType: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  actionTaken: string;
}

interface LiveIncidentFeedProps {
  logs: IncidentLog[];
  isStreaming: boolean;
  onToggleStreaming: () => void;
  onClearLogs: () => void;
}

export default function LiveIncidentFeed({
  logs,
  isStreaming,
  onToggleStreaming,
  onClearLogs,
}: LiveIncidentFeedProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = logs.filter(
    (log) =>
      log.sourceIp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actionTaken.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "text-red-400 bg-red-500/10 border-red-500/30";
      case "HIGH":
        return "text-orange-400 bg-orange-500/10 border-orange-500/30";
      case "MEDIUM":
        return "text-amber-400 bg-amber-500/10 border-amber-500/30";
      case "LOW":
      default:
        return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
    }
  };

  return (
    <div className="cyber-card rounded-2xl p-5 border border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              AUTONOMOUS INCIDENT FEED
              {isStreaming ? (
                <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-700/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  LIVE STREAM
                </span>
              ) : (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  PAUSED
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              REAL-TIME EDGE PACKET INSPECTION & MITIGATION
            </p>
          </div>
        </div>

        {/* Controls: Search, Stream toggle, Clear */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter IP or vector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900/90 text-xs font-mono pl-8 pr-3 py-1.5 rounded-lg border border-slate-800 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 w-40 sm:w-56"
            />
          </div>

          <button
            onClick={onToggleStreaming}
            className={`p-2 rounded-lg border text-xs font-mono transition-all ${
              isStreaming
                ? "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800"
                : "bg-cyan-500/20 text-cyan-300 border-cyan-500/50"
            }`}
            title={isStreaming ? "Pause Feed" : "Resume Feed"}
          >
            {isStreaming ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            onClick={onClearLogs}
            className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-all"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Log Feed Table */}
      <div className="overflow-x-auto max-h-80 overflow-y-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 sticky top-0">
            <tr>
              <th className="py-2.5 px-3">TIMESTAMP</th>
              <th className="py-2.5 px-3">SEVERITY</th>
              <th className="py-2.5 px-3">SOURCE IP</th>
              <th className="py-2.5 px-3">ENDPOINT TARGET</th>
              <th className="py-2.5 px-3">THREAT VECTOR</th>
              <th className="py-2.5 px-3 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-900/50 transition-colors group"
                >
                  <td className="py-2.5 px-3 text-slate-400">{log.time}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] border ${getSeverityStyle(
                        log.severity
                      )}`}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-cyan-300 font-semibold">
                    {log.sourceIp}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">{log.destination}</td>
                  <td className="py-2.5 px-3 text-purple-300">{log.eventType}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle className="w-3 h-3" />
                      {log.actionTaken}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-slate-500 font-mono text-xs"
                >
                  No incidents matching your filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
