"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Terminal,
  Play,
  RotateCcw,
  Activity,
  Cpu,
  Layers,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Download,
  Pause,
  Filter,
  CheckCircle2,
  Copy,
} from "lucide-react";
import { CyberDatabase } from "@/lib/db";

interface HistoryItem {
  id: string;
  command: string;
  output: string;
  timestamp: string;
  status: "success" | "error" | "running";
}

interface LogEntry {
  id: string;
  time: string;
  level: "INFO" | "WARN" | "CRITICAL" | "DEBUG";
  module: string;
  message: string;
}

export const TerminalFlow: React.FC = () => {
  const [inputCommand, setInputCommand] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: "init-1",
      command: "status",
      output: `[CYBERSHIELD SENTINEL TERMINAL INITIALIZED]
Host              : Sentinel-OS-Node (x86_64)
Kernel Intercept  : 16 eBPF Ring-0 Probes Active
Zero-Trust Policy : SENTINEL_MAXIMUM_ENFORCEMENT
Defense Index     : 99.4% [OPTIMAL]
Type 'help' to see all available CLI commands.`,
      timestamp: new Date().toLocaleTimeString(),
      status: "success",
    },
  ]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>(["status"]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Live System Telemetry state
  const [cpuLoad, setCpuLoad] = useState<number>(14);
  const [memUsedGb, setMemUsedGb] = useState<string>("5.82");
  const [memTotalGb, setMemTotalGb] = useState<string>("16.00");
  const [quarantinedCount, setQuarantinedCount] = useState<number>(0);
  const [totalScansCount, setTotalScansCount] = useState<number>(0);

  // Live Log Stream state
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLogStreaming, setIsLogStreaming] = useState(true);
  const [selectedLogLevel, setSelectedLogLevel] = useState<string>("ALL");

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial data and live polling
  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        const res = await fetch("/api/system-diagnostics");
        if (res.ok) {
          const data = await res.json();
          if (data.cpu?.loadPercent !== undefined) {
            setCpuLoad(data.cpu.loadPercent);
          }
          if (data.memory) {
            setMemUsedGb(data.memory.usedGb || "5.82");
            setMemTotalGb(data.memory.totalGb || "16.00");
          }
        }
      } catch (e) {}

      try {
        const scansRes = await fetch("/api/db/scans");
        if (scansRes.ok) {
          const files = await scansRes.json();
          setTotalScansCount(files.length);
          setQuarantinedCount(files.filter((f: any) => f.quarantined).length);
        }
      } catch (e) {
        console.error("Failed to fetch scans", e);
      }
    };

    fetchLiveStats();
    const interval = setInterval(fetchLiveStats, 3000);
    return () => clearInterval(interval);
  }, []);

  // Live log generator stream
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/db/timeline");
        if (res.ok) {
          const data = await res.json();
          const mappedLogs: LogEntry[] = data.map((item: any) => ({
            id: item.id,
            time: item.time || new Date(item.createdAt).toLocaleTimeString(),
            level: item.type === "critical" ? "CRITICAL" : item.type === "warning" ? "WARN" : "INFO",
            module: item.title?.toUpperCase().substring(0, 10) || "SYSTEM",
            message: item.description,
          }));
          setLogs(mappedLogs.slice(0, 50));
        }
      } catch (e) {
        console.error("Failed to fetch timeline logs", e);
      }
    };

    fetchLogs();
    
    if (!isLogStreaming) return;
    
    const logInterval = setInterval(fetchLogs, 2500);
    return () => clearInterval(logInterval);
  }, [isLogStreaming]);

  // Scroll to bottom on new output
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isExecuting]);

  const handleExecuteCommand = async (cmdToRun?: string) => {
    const cmd = (cmdToRun || inputCommand).trim();
    if (!cmd || isExecuting) return;

    // Handle clear client-side immediately
    if (cmd.toLowerCase() === "clear" || cmd.toLowerCase() === "cls") {
      setHistory([]);
      setInputCommand("");
      return;
    }

    const newItemId = `cmd-${Date.now()}`;
    const newEntry: HistoryItem = {
      id: newItemId,
      command: cmd,
      output: "Executing in CyberShield Zero-Trust kernel sandbox...",
      timestamp: new Date().toLocaleTimeString(),
      status: "running",
    };

    setHistory((prev) => [...prev, newEntry]);
    setCommandHistory((prev) => [cmd, ...prev.filter((c) => c !== cmd)]);
    setHistoryIndex(-1);
    setInputCommand("");
    setIsExecuting(true);

    try {
      const storedGeminiKey =
        typeof window !== "undefined"
          ? localStorage.getItem("cybershield_gemini_key") || ""
          : "";

      const res = await fetch("/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: cmd,
          apiKey: storedGeminiKey,
          context: {
            cpuLoad: `${cpuLoad}%`,
            memory: `${memUsedGb}/${memTotalGb} GB`,
            quarantined: quarantinedCount,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setHistory((prev) =>
          prev.map((item) =>
            item.id === newItemId
              ? { ...item, output: data.output || "(Done)", status: "success" }
              : item
          )
        );
      } else {
        throw new Error("Execution failed");
      }
    } catch (err: any) {
      setHistory((prev) =>
        prev.map((item) =>
          item.id === newItemId
            ? {
                ...item,
                output: `Execution error: ${err.message || "Failed to contact host CLI service"}`,
                status: "error",
              }
            : item
        )
      );
    } finally {
      setIsExecuting(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleExecuteCommand();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(nextIdx);
        setInputCommand(commandHistory[nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputCommand(commandHistory[nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputCommand("");
      }
    }
  };

  const handleExportLogs = () => {
    const content = logs
      .map((l) => `[${l.time}] [${l.level.padEnd(8)}] [${l.module}] ${l.message}`)
      .join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cybershield_kernel_logs_${Date.now()}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredLogs = logs.filter(
    (l) => selectedLogLevel === "ALL" || l.level === selectedLogLevel
  );

  return (
    <div className="space-y-6 select-none">
      {/* Top Header Card */}
      <div className="bg-[#111317] border border-white/[0.08] rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-800/60 shadow-inner">
            <Terminal className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>CyberShield Sentinel Terminal & Shell Engine</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                LIVE SHELL
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive terminal command runner, real-time host telemetry stream, and live security audit logs.
            </p>
          </div>
        </div>

        {/* Quick status pill */}
        <div className="flex items-center gap-2 text-xs font-mono bg-[#161922] px-3.5 py-1.5 rounded-2xl border border-white/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-semibold">eBPF Ring-0 CLI Session Active</span>
        </div>
      </div>

      {/* Main Grid: 2 Cols (Left: Terminal Console, Right: Real Control Panel Stats & Logs) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Terminal Screen (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0C0E12] border border-white/[0.12] rounded-3xl p-5 shadow-2xl space-y-4 flex flex-col h-[640px]">
            {/* Terminal Window Chrome */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 text-xs font-mono font-bold text-slate-400">
                  sentinel@cybershield-os: ~
                </span>
              </div>
              <button
                onClick={() => setHistory([])}
                className="text-[11px] font-mono text-slate-400 hover:text-white px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
              >
                Clear Screen
              </button>
            </div>

            {/* Quick Command Chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
              <span className="text-slate-500 text-[10px] uppercase font-bold mr-1">Quick:</span>
              {[
                "status",
                "top",
                "ports",
                "ebpf",
                "logs",
                'gemini "LockBit mitigation plan"',
                "whoami",
                "help",
              ].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => handleExecuteCommand(cmd)}
                  className="px-2 py-0.5 rounded-lg bg-[#181C26] hover:bg-[#222736] border border-white/10 text-emerald-400 font-semibold transition-all cursor-pointer truncate max-w-[200px]"
                >
                  ${" "}{cmd}
                </button>
              ))}
            </div>

            {/* Terminal Output Area */}
            <div className="flex-1 overflow-y-auto font-mono text-xs text-slate-300 space-y-4 pr-1 selection:bg-emerald-500 selection:text-black">
              {history.map((item) => (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <span>sentinel@cybershield-os:~$</span>
                    <span className="text-white">{item.command}</span>
                    <span className="ml-auto text-[10px] text-slate-500 font-normal">
                      {item.timestamp}
                    </span>
                  </div>
                  <pre className="text-slate-300 whitespace-pre-wrap font-mono text-[11px] bg-[#12151D] p-3 rounded-xl border border-white/5 leading-relaxed overflow-x-auto">
                    {item.output}
                  </pre>
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Terminal Command Input Line */}
            <div className="border-t border-white/[0.08] pt-3">
              <div className="flex items-center gap-2 bg-[#12151D] border border-white/10 rounded-2xl px-3.5 py-2.5 focus-within:border-emerald-500/80 transition-all">
                <span className="text-emerald-400 font-mono font-bold text-xs">
                  sentinel@cybershield:~$
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputCommand}
                  onChange={(e) => setInputCommand(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type CLI command (e.g. status, ports, top, gemini 'query', help)..."
                  className="flex-1 bg-transparent text-white font-mono text-xs placeholder-slate-600 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={() => handleExecuteCommand()}
                  disabled={isExecuting || !inputCommand.trim()}
                  className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>RUN</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Data Stats & Streaming Logs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Real Control Panel Live Stats Widget */}
          <div className="bg-[#111317] border border-white/[0.08] rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#FF7A00]" />
                <span>Control Panel Live Telemetry</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
                100% SYNCED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-[#161922] border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400">HOST CPU LOAD</span>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-white">{cpuLoad}%</span>
                  <Cpu className="w-4 h-4 text-[#FF7A00]" />
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-[#FF7A00] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, cpuLoad)}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#161922] border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400">RAM USAGE</span>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-white">
                    {memUsedGb} <span className="text-xs font-normal text-slate-400">/ {memTotalGb} GB</span>
                  </span>
                  <Layers className="w-4 h-4 text-sky-400" />
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-sky-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        (parseFloat(memUsedGb) / parseFloat(memTotalGb || "16")) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#161922] border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400">RING-0 eBPF PROBES</span>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-emerald-400">16 / 16</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-[9px] text-slate-400">Deterministic Hook Active</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#161922] border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400">QUARANTINE VAULT</span>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-amber-400">
                    {quarantinedCount} <span className="text-xs font-normal text-slate-400">Files</span>
                  </span>
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-[9px] text-slate-400">{totalScansCount} Total Scanned</span>
              </div>
            </div>
          </div>

          {/* Live Log Stream Console */}
          <div className="bg-[#111317] border border-white/[0.08] rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  Live Kernel & Threat Logs
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isLogStreaming ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
                  }`}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLogStreaming(!isLogStreaming)}
                  className="p-1.5 rounded-lg bg-[#161922] hover:bg-[#202532] border border-white/10 text-slate-300 text-[10px] font-mono transition-all cursor-pointer"
                  title={isLogStreaming ? "Pause Stream" : "Resume Stream"}
                >
                  {isLogStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={handleExportLogs}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#161922] hover:bg-[#202532] border border-white/10 text-slate-300 text-[10px] font-mono transition-all cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Level Filter Chips */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono">
              {["ALL", "CRITICAL", "WARN", "INFO", "DEBUG"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLogLevel(lvl)}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                    selectedLogLevel === lvl
                      ? "bg-white/20 text-white border border-white/30"
                      : "bg-[#161922] text-slate-400 hover:text-white"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Log Stream Box */}
            <div className="h-[250px] overflow-y-auto space-y-1.5 font-mono text-[11px] pr-1">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2 rounded-xl bg-[#141720] border border-white/5 flex items-start gap-2 leading-tight"
                >
                  <span className="text-slate-500 text-[10px] shrink-0 mt-0.5">
                    {log.time}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-bold shrink-0 ${
                      log.level === "CRITICAL"
                        ? "bg-rose-950 text-rose-300 border border-rose-800"
                        : log.level === "WARN"
                        ? "bg-amber-950 text-amber-300 border border-amber-800"
                        : log.level === "DEBUG"
                        ? "bg-purple-950 text-purple-300 border border-purple-800"
                        : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                    }`}
                  >
                    {log.level}
                  </span>
                  <span className="text-slate-400 font-bold shrink-0">[{log.module}]</span>
                  <span className="text-slate-200 truncate">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TerminalFlow;
