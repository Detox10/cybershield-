"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Play, CheckCircle2, Shield, Activity, RefreshCw } from "lucide-react";
import { FloatingMotionTokens } from "./FloatingMotionTokens";
import { cn } from "@/lib/utils";

export interface MobileHeroSectionProps {
  onPlayDemo?: () => void;
  onGetStarted?: () => void;
}

export const MobileHeroSection: React.FC<MobileHeroSectionProps> = ({
  onPlayDemo,
  onGetStarted,
}) => {
  const [activeTab, setActiveTab] = useState<"tokens" | "analytics" | "code">("tokens");
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1200);
  };

  return (
    <section className="relative w-full pt-6 pb-12 px-4 flex flex-col items-center text-center overflow-hidden">
      {/* Top Pill / Badge */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-[11px] font-semibold text-slate-700 dark:text-slate-300 shadow-sm mb-4"
      >
        <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
        <span>STUDIO 3.0 FOR MOBILE & WEB</span>
      </motion.div>

      {/* Main Bold Display Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight uppercase leading-[1.08] max-w-xl"
      >
        DESIGN SYSTEMS, <br />
        <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 dark:from-sky-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
          FULLY AUTOMATED
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md font-medium leading-relaxed"
      >
        Automate design tokens, threat telemetry, and cross-platform UI sync from Figma into Swift, Kotlin, and React in milliseconds.
      </motion.p>

      {/* CTA Button Group */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full max-w-xs"
      >
        <button
          onClick={onGetStarted}
          className="flex-1 min-w-[140px] h-11 px-5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-400/25 transition-transform active:scale-95"
        >
          <span>Get Free App</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onPlayDemo}
          className="h-11 px-4 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-transform active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-current text-sky-500" />
          <span>See In Action</span>
        </button>
      </motion.div>

      {/* Central Interactive Motion Graphic Stage */}
      <div className="relative w-full max-w-md mt-10 px-2">
        {/* Floating Isometric 3D Tokens Layer */}
        <FloatingMotionTokens />

        {/* Central Dashboard Studio Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="relative z-10 w-full rounded-2xl bg-white dark:bg-[#0E1526] border border-slate-200/90 dark:border-slate-800/90 shadow-2xl p-4 sm:p-5 text-left overflow-hidden backdrop-blur-xl"
        >
          {/* Card Top Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
                STUDIO LIVE FEED
              </span>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg text-[10px] font-semibold">
              <button
                onClick={() => setActiveTab("tokens")}
                className={cn(
                  "px-2 py-1 rounded-md transition-all",
                  activeTab === "tokens"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500"
                )}
              >
                Tokens
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={cn(
                  "px-2 py-1 rounded-md transition-all",
                  activeTab === "analytics"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500"
                )}
              >
                Sync
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={cn(
                  "px-2 py-1 rounded-md transition-all",
                  activeTab === "code"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500"
                )}
              >
                JSON
              </button>
            </div>
          </div>

          {/* Tab 1: Tokens / Visual Charts */}
          {activeTab === "tokens" && (
            <div className="pt-3 space-y-3">
              {/* Mini Column Chart */}
              <div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
                  <span>TOKEN DISTRIBUTION ACCROSS PLATFORMS</span>
                  <span className="font-mono text-emerald-500 font-bold">100% IN SYNC</span>
                </div>
                <div className="grid grid-cols-6 gap-1.5 h-16 items-end pt-2">
                  {[45, 75, 60, 95, 80, 100].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.6, delay: i * 0.08 }}
                      className="bg-gradient-to-t from-indigo-600 to-purple-400 rounded-t-md relative group cursor-pointer"
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono bg-slate-900 text-white px-1 rounded transition-opacity">
                        {h}%
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="grid grid-cols-6 gap-1.5 text-center text-[8px] font-mono text-slate-400 mt-1">
                  <span>IOS</span>
                  <span>AND</span>
                  <span>WEB</span>
                  <span>FIG</span>
                  <span>CLI</span>
                  <span>API</span>
                </div>
              </div>

              {/* Mini Status Rows */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-800/40 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <div>
                    <p className="text-[9px] text-purple-700 dark:text-purple-300 font-bold uppercase">
                      Engine Latency
                    </p>
                    <p className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
                      1.2 ms
                    </p>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/40 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-[9px] text-emerald-700 dark:text-emerald-300 font-bold uppercase">
                      Zero-Trust Rule
                    </p>
                    <p className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
                      STRICT
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Sync Health */}
          {activeTab === "analytics" && (
            <div className="pt-3 space-y-3 text-center">
              <div className="py-2 flex flex-col items-center justify-center">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200 dark:text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-sky-500 transition-all duration-1000"
                      strokeDasharray="98.5, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-sm font-bold font-mono text-slate-900 dark:text-slate-100">
                    99.8%
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                  Continuous Asset Health
                </p>
                <p className="text-[10px] text-slate-500">
                  4,120 design tokens verified across 18 repositories
                </p>
              </div>

              <button
                onClick={handleSync}
                className="w-full py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", isSyncing && "animate-spin")} />
                <span>{isSyncing ? "Syncing Pipeline..." : "Trigger Manual Re-Sync"}</span>
              </button>
            </div>
          )}

          {/* Tab 3: Live JSON */}
          {activeTab === "code" && (
            <div className="pt-3 font-mono text-[10px] bg-slate-950 text-slate-300 p-3 rounded-xl overflow-x-auto">
              <p className="text-purple-400">{"{"}</p>
              <p className="pl-3 text-sky-400">&quot;token_version&quot;: &quot;3.4.0&quot;,</p>
              <p className="pl-3 text-amber-400">&quot;target_ecosystem&quot;: [&quot;iOS&quot;, &quot;Android&quot;, &quot;Next.js&quot;],</p>
              <p className="pl-3 text-emerald-400">&quot;encryption_cipher&quot;: &quot;AES-256-GCM&quot;,</p>
              <p className="pl-3 text-cyan-400">&quot;autonomous_containment&quot;: true</p>
              <p className="text-purple-400">{"}"}</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
