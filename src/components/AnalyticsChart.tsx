"use client";

import React, { useState } from "react";
import { BarChart3, Activity, PieChart, ShieldAlert, ArrowUpRight } from "lucide-react";

export default function AnalyticsChart() {
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d">("24h");

  const vectors = [
    { name: "Layer 7 DDoS Floods", percentage: 38, count: "1,248,390", color: "bg-cyan-500" },
    { name: "SQL Injection & RCE Probes", percentage: 24, count: "788,120", color: "bg-purple-500" },
    { name: "Credential Stuffing / Botnets", percentage: 20, count: "656,760", color: "bg-emerald-500" },
    { name: "Zero-Day Memory Corruptions", percentage: 12, count: "394,060", color: "bg-rose-500" },
    { name: "DNS Amplification / Spoofing", percentage: 6, count: "197,030", color: "bg-amber-500" },
  ];

  const hourlyVolume = [
    { hour: "00:00", value: 45 },
    { hour: "03:00", value: 30 },
    { hour: "06:00", value: 65 },
    { hour: "09:00", value: 92 },
    { hour: "12:00", value: 78 },
    { hour: "15:00", value: 88 },
    { hour: "18:00", value: 95 },
    { hour: "21:00", value: 60 },
  ];

  return (
    <div className="cyber-card rounded-2xl p-5 border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              THREAT VECTOR ANALYTICS
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              ATTACK SURFACE TELEMETRY & SPECTRUM BREAKDOWN
            </p>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          {(["24h", "7d", "30d"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 rounded transition-all uppercase ${
                timeframe === t
                  ? "bg-cyan-500 text-black font-bold shadow-glow-cyan"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vector Distribution Bars */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-cyan-400" />
            ATTACK DISTRIBUTION BY VECTOR
          </h3>

          <div className="space-y-3">
            {vectors.map((vec) => (
              <div key={vec.name} className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>{vec.name}</span>
                  <span className="text-slate-400">
                    <span className="text-cyan-300 font-bold">{vec.percentage}%</span> ({vec.count})
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full ${vec.color} rounded-full transition-all duration-700`}
                    style={{ width: `${vec.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attack Volume Histogram */}
        <div className="lg:col-span-5 bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              PEAK ATTACK FREQUENCY (Gbps)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              SCRUBBING ACTIVE
            </span>
          </div>

          <div className="flex items-end justify-between h-36 gap-2 pt-4 px-2">
            {hourlyVolume.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full bg-slate-900 rounded-t-sm h-28 flex items-end overflow-hidden">
                  <div
                    className="w-full bg-gradient-to-t from-cyan-600 to-emerald-400 group-hover:from-cyan-400 group-hover:to-white transition-all rounded-t-sm"
                    style={{ height: `${item.value}%` }}
                  />
                </div>
                <span className="text-[9px] font-mono text-slate-500 group-hover:text-cyan-300">
                  {item.hour}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Peak Bandwidth Absorbed:</span>
            <span className="text-emerald-400 font-bold">1.48 Tbps</span>
          </div>
        </div>
      </div>
    </div>
  );
}
