"use client";

import React from "react";
import {
  ShieldCheck,
  Cpu,
  Lock,
  Flame,
  Binary,
  Radio,
  Sliders,
  Check,
} from "lucide-react";

interface DefenseModule {
  id: string;
  name: string;
  status: "ACTIVE" | "OPTIMIZED" | "SCANNING" | "STANDBY";
  efficiency: number;
  description: string;
}

interface ShieldStatusProps {
  shieldMode: "SENTINEL" | "LOCKDOWN" | "STEALTH";
  onModeChange: (mode: "SENTINEL" | "LOCKDOWN" | "STEALTH") => void;
  modules: DefenseModule[];
  onToggleModule: (id: string) => void;
}

export default function ShieldStatus({
  shieldMode,
  onModeChange,
  modules,
  onToggleModule,
}: ShieldStatusProps) {
  return (
    <div className="cyber-card rounded-2xl p-5 border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              ZERO-TRUST DEFENSE MATRIX
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              PERIMETER INTEGRITY & CRYPTOGRAPHIC POLICIES
            </p>
          </div>
        </div>

        {/* Shield Mode Selector */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <span className="text-slate-400 px-2 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            MODE:
          </span>
          {(["SENTINEL", "LOCKDOWN", "STEALTH"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onModeChange(mode)}
              className={`px-3 py-1 rounded transition-all ${
                shieldMode === mode
                  ? mode === "LOCKDOWN"
                    ? "bg-rose-500 text-white font-bold shadow-glow-red"
                    : "bg-cyan-500 text-black font-bold shadow-glow-cyan"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((mod) => (
          <div
            key={mod.id}
            className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 hover:border-cyan-500/40 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-sm font-semibold text-slate-200">
                    {mod.name}
                  </span>
                </div>
                <button
                  onClick={() => onToggleModule(mod.id)}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-all ${
                    mod.status === "ACTIVE"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/40"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                >
                  {mod.status}
                </button>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                {mod.description}
              </p>
            </div>

            {/* Efficiency Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>Efficiency</span>
                <span className="text-cyan-300 font-bold">{mod.efficiency}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${mod.efficiency}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
