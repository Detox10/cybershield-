"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Terminal,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Activity,
  CheckCircle2,
  RefreshCw,
  Layers,
} from "lucide-react";
import GeometricSecurityGauge from "../GeometricSecurityGauge";
import DigitResolver from "../motion/DigitResolver";
import DotGridCanvas from "../motion/DotGridCanvas";

export interface DashboardFlowProps {
  onStartScan: () => void;
  onNavigateThreats: () => void;
  onOpenCopilot: () => void;
}

export const DashboardFlow: React.FC<DashboardFlowProps> = ({
  onStartScan,
  onNavigateThreats,
  onOpenCopilot,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  // Trigger 3-Second Nothing OS Gear Scan Sequence
  const handleInitiateScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);

    const startTime = performance.now();
    const duration = 3000; // 3-second exact mechanical scan

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(Math.round((elapsed / duration) * 100), 100);
      setScanProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsScanning(false);
          setScanProgress(0);
        }, 300);
      }
    }, 40);
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 2400);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 pb-12 select-none">
      {/* Hero Card with Embedded Dot-Matrix Scan Shader */}
      <div className="bg-white dark:bg-[#111622] rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs relative overflow-hidden transition-colors card-mechanical">
        {/* Dot Grid Background & Active Scan Shader */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <DotGridCanvas isScanning={isScanning} scanProgress={scanProgress} />
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          {/* Left Hero Details */}
          <div className="space-y-4 max-w-2xl">
            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <span
                className={`w-2 h-2 rounded-full ${
                  isScanning ? "bg-cyan-400 animate-ping" : "bg-emerald-500 animate-pulse"
                }`}
              />
              <span>
                {isScanning
                  ? `Gear Scan in Progress: ${scanProgress}%`
                  : "CyberShield AI Sentinel v2.4 Active"}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Your digital environment is calm and secure, Himanshu.
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
              {isScanning
                ? "Illuminating kernel eBPF memory rings and verifying 148,290 cryptographic binary signatures..."
                : "Continuous zero-trust telemetry is monitoring 142 background daemons and network egress points. Last full file verification completed 2 hours ago."}
            </p>

            {/* Linear Progress Bar during Scan Sequence */}
            {isScanning && (
              <div className="w-full max-w-md h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-400"
                  style={{ width: `${scanProgress}%` }}
                  transition={{ ease: [0.65, 0, 0.35, 1] }}
                />
              </div>
            )}

            {/* Action Buttons (Hard 1px mechanical press) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleInitiateScan}
                disabled={isScanning}
                className="btn-mechanical px-5 py-2.5 rounded-xl bg-[#111622] dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center gap-2 shadow-xs hover:opacity-95"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>SCANNING ({scanProgress}%)</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Sync Gear & Deep Scan</span>
                  </>
                )}
              </button>

              <button
                onClick={onOpenCopilot}
                className="btn-mechanical px-4 py-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/80 font-bold text-xs flex items-center gap-2 hover:bg-sky-100 dark:hover:bg-sky-900/60"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Ask AI Assistant</span>
              </button>

              <button
                onClick={handleSimulate}
                className="btn-mechanical px-4 py-2.5 rounded-xl bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-xs flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>{isSimulating ? "Simulating Ingress..." : "Simulate Ingress"}</span>
              </button>
            </div>
          </div>

          {/* Right Hero Protection Radial Gauge (Accelerates breathing to 2s during scan) */}
          <div className="flex flex-col items-center justify-center shrink-0 w-full lg:w-auto pt-4 lg:pt-0">
            <div className="p-4 rounded-2xl bg-[#FAFAFA] dark:bg-[#0B0F19] border border-slate-200/80 dark:border-slate-800/80 shadow-2xs card-mechanical">
              <GeometricSecurityGauge
                size="hero"
                score={isScanning ? 99 : 96}
                state={isScanning ? "SCANNING" : "SECURE"}
                label={isScanning ? "SCANNING GEAR" : "PROTECTION INDEX"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Banner Insight Bar */}
      <div className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors card-mechanical">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500">
                TODAY&apos;S CORE INSIGHT
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                Continuous AI Guard
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
              Protection score is <span className="font-bold text-emerald-600">+4 points higher</span> than last week with 0 zero-day vulnerabilities.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateThreats}
          className="btn-mechanical text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 shrink-0 self-end sm:self-center"
        >
          <span>View Security Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3-Column Metrics Grid with Digit "Resolve" Typography */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Posture Matrix */}
        <div className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4 card-mechanical">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Posture Matrix
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              Tier 1 • A+
            </span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Kernel eBPF filters, zero unpatched CVEs, and TLS 1.3 quantum-resistant key exchange.
          </p>

          <div className="space-y-2 pt-1 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-600 dark:text-slate-400">Zero-Trust Firewall</span>
              <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                <CheckCircle2 className="w-3 h-3" /> Active
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-600 dark:text-slate-400">Disk Encryption</span>
              <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                <CheckCircle2 className="w-3 h-3" /> AES-256
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-600 dark:text-slate-400">Memory Guard</span>
              <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                <CheckCircle2 className="w-3 h-3" /> Armed
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Device Telemetry with Digit "Resolve" effect */}
        <div className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4 card-mechanical">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Cpu className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Device Telemetry
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
              Live 1.2s
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* CPU */}
            <div className="p-2.5 rounded-xl bg-[#FAFAFA] dark:bg-[#0B0F19] border border-slate-200/60 dark:border-slate-800/80">
              <span className="text-[10px] font-medium text-slate-400 block">CPU Load</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white block mt-0.5">
                <DigitResolver value="14.2%" durationMs={180} />
              </span>
              <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                <div className="w-[14.2%] h-full bg-cyan-500 rounded-full" />
              </div>
            </div>

            {/* RAM */}
            <div className="p-2.5 rounded-xl bg-[#FAFAFA] dark:bg-[#0B0F19] border border-slate-200/60 dark:border-slate-800/80">
              <span className="text-[10px] font-medium text-slate-400 block">RAM Workload</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white block mt-0.5">
                <DigitResolver value="4.8 GB" durationMs={200} />
              </span>
              <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                <div className="w-[30%] h-full bg-sky-500 rounded-full" />
              </div>
            </div>

            {/* NVMe */}
            <div className="p-2.5 rounded-xl bg-[#FAFAFA] dark:bg-[#0B0F19] border border-slate-200/60 dark:border-slate-800/80">
              <span className="text-[10px] font-medium text-slate-400 block">NVMe Free</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white block mt-0.5">
                <DigitResolver value="218 GB" durationMs={220} />
              </span>
              <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                <div className="w-[70%] h-full bg-purple-500 rounded-full" />
              </div>
            </div>

            {/* Latency */}
            <div className="p-2.5 rounded-xl bg-[#FAFAFA] dark:bg-[#0B0F19] border border-slate-200/60 dark:border-slate-800/80">
              <span className="text-[10px] font-medium text-slate-400 block">Edge Latency</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white block mt-0.5">
                <DigitResolver value="1.2 ms" durationMs={160} />
              </span>
              <span className="text-[9px] font-mono text-emerald-600 block mt-1">PoP #04</span>
            </div>
          </div>
        </div>

        {/* Card 3: Integrity Verification with Digit "Resolve" */}
        <div className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4 card-mechanical">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Integrity Verification
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
              2h ago
            </span>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400">Binaries Verified</span>
              <span className="font-extrabold text-slate-900 dark:text-white font-mono">
                <DigitResolver value="148,290" durationMs={240} />
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400">Malicious Signatures</span>
              <span className="font-extrabold text-emerald-600 font-mono">
                0 Found
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500 dark:text-slate-400">AI Confidence</span>
              <span className="font-extrabold text-emerald-600 font-mono">
                <DigitResolver value="99.8%" durationMs={200} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardFlow;
