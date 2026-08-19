"use client";

import React from "react";
import {
  ShieldCheck,
  Zap,
  Globe2,
  Lock,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Play,
} from "lucide-react";

interface HeroProps {
  stats: {
    threatsBlocked: number;
    activeNodes: number;
    mitigationLatency: number;
    defenseScore: number;
  };
  onSimulateAttack: () => void;
  onOpenConsole: () => void;
}

export default function Hero({
  stats,
  onSimulateAttack,
  onOpenConsole,
}: HeroProps) {
  return (
    <div className="relative pt-6 pb-8 overflow-hidden">
      {/* Background glow flares */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Hero Title & Description */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span>NEURAL DEFENSE LAYER 7 // ACTIVE MONITORING</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Autonomous Cybersecurity &{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                Zero-Trust Shield
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              CyberShield delivers autonomous real-time threat detection, AI-driven
              incident containment, and quantum-hardened edge encryption to safeguard
              distributed infrastructure against sophisticated zero-day attack vectors.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenConsole}
                className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-sm shadow-glow-cyan transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Launch Security Suite</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={onSimulateAttack}
                className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-rose-300 border border-rose-500/40 hover:border-rose-400 text-sm font-medium transition-all shadow-glow-red hover:scale-[1.02] active:scale-[0.98]"
              >
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Simulate Zero-Day Breach</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Telemetry Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {/* Stat Card 1: Threats Blocked */}
            <div className="cyber-card p-4 rounded-xl border border-slate-800/80 hover:border-cyan-500/40">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-mono">THREATS INTERCEPTED</span>
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-cyan-300">
                {stats.threatsBlocked.toLocaleString()}
              </div>
              <div className="flex items-center space-x-1 mt-1 text-[11px] text-emerald-400 font-mono">
                <TrendingUp className="w-3 h-3" />
                <span>+14.2% mitigated past 24h</span>
              </div>
            </div>

            {/* Stat Card 2: Mitigation Latency */}
            <div className="cyber-card p-4 rounded-xl border border-slate-800/80 hover:border-emerald-500/40">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-mono">LATENCY (CONTAINMENT)</span>
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400">
                {stats.mitigationLatency.toFixed(1)} ms
              </div>
              <div className="mt-1 text-[11px] text-slate-400 font-mono">
                Sub-millisecond AI edge bypass
              </div>
            </div>

            {/* Stat Card 3: Global Active Nodes */}
            <div className="cyber-card p-4 rounded-xl border border-slate-800/80 hover:border-purple-500/40">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-mono">PERIMETER NODES</span>
                <Globe2 className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-purple-300">
                {stats.activeNodes}
              </div>
              <div className="mt-1 text-[11px] text-cyan-400 font-mono">
                Global mesh synced (100%)
              </div>
            </div>

            {/* Stat Card 4: Security Posture Score */}
            <div className="cyber-card p-4 rounded-xl border border-slate-800/80 hover:border-teal-500/40">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-mono">SHIELD INTEGRITY</span>
                <Lock className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-teal-300">
                {stats.defenseScore}%
              </div>
              <div className="mt-1 text-[11px] text-emerald-400 font-mono">
                Grade: AAA+ Enterprise Posture
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
