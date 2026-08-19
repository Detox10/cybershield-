"use client";

import React, { useState, useEffect } from "react";
import { Cpu, Wifi, Activity, HardDrive } from "lucide-react";

interface TelemetrySnap {
  cpu: { loadPercent: number; speedGhz: number; cores: number; model: string };
  network: { rxMbps: number; txMbps: number; totalMbps: number; interface: string };
  ebpf: { available: boolean; opsPerSec: number };
  host: { processCount: number; threadCount: number };
  memory: { usagePercent: number; usedGb: number; totalGb: number };
}

function SparkLine({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return null;
  const max = Math.max(...values, 1);
  const w = 120; const h = 36;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - (v / max) * h}`).join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(w)} cy={h - (values[values.length - 1] / max) * h} r="3" fill={color} />
    </svg>
  );
}

export function LiveTelemetryMini() {
  const [data, setData] = useState<TelemetrySnap | null>(null);
  const [cpuHistory, setCpuHistory] = useState<number[]>([]);
  const [netHistory, setNetHistory] = useState<number[]>([]);
  const [memHistory, setMemHistory] = useState<number[]>([]);
  const [apiOk, setApiOk] = useState(true);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/telemetry", { cache: "no-store" });
        const d: TelemetrySnap = await res.json();
        setData(d);
        setApiOk(true);
        setCpuHistory((p) => [...p.slice(-29), d.cpu.loadPercent]);
        setNetHistory((p) => [...p.slice(-29), d.network.totalMbps]);
        setMemHistory((p) => [...p.slice(-29), d.memory.usagePercent]);
      } catch {
        setApiOk(false);
      }
    };
    poll();
    const iv = setInterval(poll, 1200);
    return () => clearInterval(iv);
  }, []);

  const metrics = [
    {
      label: "CPU Load", icon: Cpu, color: "#38BDF8",
      value: data ? `${data.cpu.loadPercent}%` : "—",
      sub: data ? `${data.cpu.cores} cores • ${data.cpu.speedGhz} GHz` : "Connecting…",
      history: cpuHistory,
      alert: (data?.cpu.loadPercent ?? 0) > 80,
    },
    {
      label: "Network I/O", icon: Wifi, color: "#00C48C",
      value: data ? `${data.network.totalMbps} Mb/s` : "—",
      sub: data ? `↓${data.network.rxMbps} ↑${data.network.txMbps} Mb/s` : "—",
      history: netHistory,
      alert: false,
    },
    {
      label: "RAM Usage", icon: HardDrive, color: "#A78BFA",
      value: data ? `${data.memory.usagePercent}%` : "—",
      sub: data ? `${data.memory.usedGb} / ${data.memory.totalGb} GB` : "—",
      history: memHistory,
      alert: (data?.memory.usagePercent ?? 0) > 85,
    },
    {
      label: "eBPF Ops/s", icon: Activity, color: "#FF7A00",
      value: data ? (data.ebpf.available ? `${(data.ebpf.opsPerSec / 1000).toFixed(1)}k` : "N/A") : "—",
      sub: data ? `${data.host.processCount} proc • ${data.host.threadCount} threads` : "—",
      history: [],
      alert: false,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Live System Telemetry</h2>
          <p className="text-xs text-slate-400 mt-0.5">{data?.cpu.model || "Polling /api/telemetry…"}</p>
        </div>
        <span className={`text-[10px] font-mono px-2 py-1 rounded-lg border font-bold flex items-center gap-1.5 ${
          apiOk ? "bg-emerald-950/60 border-emerald-800/40 text-emerald-400" : "bg-amber-950/60 border-amber-800/40 text-amber-400"
        }`}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: apiOk ? "#34D399" : "#F59E0B" }} />
          {apiOk ? "LIVE HOST" : "FALLBACK"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className={`p-4 rounded-2xl bg-[#13161E] border transition-colors ${
                m.alert ? "border-rose-800/50" : "border-white/[0.07]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4" style={{ color: m.color }} />
                    <span className="text-[11px] font-mono text-slate-400">{m.label}</span>
                    {m.alert && <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-950 border border-rose-800/40 text-rose-400 font-bold">HIGH</span>}
                  </div>
                  <p className="text-2xl font-extrabold text-white tabular-nums">{m.value}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-mono">{m.sub}</p>
                </div>
                {m.history.length > 1 && (
                  <div className="opacity-70">
                    <SparkLine values={m.history} color={m.color} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
