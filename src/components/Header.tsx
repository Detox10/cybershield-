"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Radio,
  Terminal,
  Activity,
  Bell,
  Lock,
  Cpu,
  RefreshCw,
} from "lucide-react";

interface HeaderProps {
  onOpenConsole: () => void;
  threatLevel: "NORMAL" | "ELEVATED" | "CRITICAL";
  isScanning: boolean;
  onTriggerScan: () => void;
}

export default function Header({
  onOpenConsole,
  threatLevel,
  isScanning,
  onTriggerScan,
}: HeaderProps) {
  const [time, setTime] = useState<string>("");
  const [notificationCount, setNotificationCount] = useState<number>(3);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getThreatBadge = () => {
    switch (threatLevel) {
      case "CRITICAL":
        return {
          label: "DEFCON 1 // CRITICAL",
          color: "bg-red-500/10 text-red-400 border-red-500/40 animate-pulse",
          icon: <ShieldAlert className="w-4 h-4 text-red-400" />,
        };
      case "ELEVATED":
        return {
          label: "DEFCON 2 // ELEVATED",
          color: "bg-amber-500/10 text-amber-400 border-amber-500/40",
          icon: <Activity className="w-4 h-4 text-amber-400" />,
        };
      case "NORMAL":
      default:
        return {
          label: "DEFCON 4 // NOMINAL",
          color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/40",
          icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
        };
    }
  };

  const threatBadge = getThreatBadge();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#050811]/85 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-600/30 border border-cyan-500/40 shadow-glow-cyan">
              <ShieldCheck className="w-6 h-6 text-cyan-400 animate-pulse-slow" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-cyan-400 via-blue-300 to-purple-400 bg-clip-text text-transparent">
                  CYBERSHIELD
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-700/50">
                  v4.8-PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                AUTONOMOUS THREAT INTELLIGENCE
              </p>
            </div>
          </div>

          {/* Center: Live Status & DEFCON Badge */}
          <div className="hidden md:flex items-center space-x-4">
            <div
              className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-mono tracking-wide ${threatBadge.color}`}
            >
              {threatBadge.icon}
              <span>{threatBadge.label}</span>
            </div>

            <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono bg-slate-900/60 px-3 py-1 rounded-md border border-slate-800">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>NODES: 142 ONLINE</span>
            </div>

            <div className="text-xs text-slate-400 font-mono hidden lg:block">
              {time || "SYNCING UTC CLOCK..."}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onTriggerScan}
              disabled={isScanning}
              className={`flex items-center space-x-1.5 text-xs font-mono px-3 py-2 rounded-lg border transition-all ${
                isScanning
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 cursor-wait"
                  : "bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-cyan-500/50"
              }`}
              title="Execute Deep System Threat Scan"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isScanning ? "animate-spin text-cyan-400" : "text-slate-400"
                }`}
              />
              <span className="hidden sm:inline">
                {isScanning ? "SCANNING..." : "QUICK SCAN"}
              </span>
            </button>

            <button
              onClick={onOpenConsole}
              className="flex items-center space-x-1.5 text-xs font-mono px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-600/30 hover:from-cyan-500/30 hover:to-blue-600/40 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan transition-all"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold">CONSOLE</span>
            </button>

            <button
              onClick={() => setNotificationCount(0)}
              className="relative p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all"
              title="Security Alerts"
            >
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-black bg-cyan-400 rounded-full">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
