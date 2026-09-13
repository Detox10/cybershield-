"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  TrendingUp,
  ShieldCheck,
  Award,
  Twitter,
  Linkedin,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import ShieldCore from "./ShieldCore";

interface WeeklyDigestModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export default function WeeklyDigestModal({ isOpen, onClose }: WeeklyDigestModalProps) {
  if (!isOpen) return null;

  const sparklineData = [88, 90, 89, 92, 94, 95, 98];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl glass-card rounded-card p-6 sm:p-8 space-y-6 overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-layer-4"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center space-x-3.5">
            <ShieldCore size="compact" state="SECURE" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-sky-600 dark:text-cyan-400">
                  Weekly Executive Digest
                </span>
                <span className="text-xs text-slate-400">• Aug 5, 2026</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Your Digital Ecosystem is Thriving
              </h2>
            </div>
          </div>

          {/* Headline Score & 7-Day Trend */}
          <div className="p-4 rounded-cardSm bg-gradient-to-r from-sky-500/10 via-teal-500/10 to-indigo-500/10 border border-sky-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  98%
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +4 pts this week
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                More resilient than <strong className="text-slate-800 dark:text-slate-200">92% of enterprise endpoints</strong> <span className="text-[10px] text-slate-500 ml-2">· [SIMULATED]</span>.
              </p>
            </div>

            {/* 7-Day Sparkline SVG */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono text-slate-400 mb-1">7-Day Score Trajectory</span>
              <svg width="120" height="32" className="overflow-visible">
                <polyline
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={sparklineData
                    .map((val, i) => `${i * 20},${32 - ((val - 85) / 15) * 28}`)
                    .join(" ")}
                />
                {sparklineData.map((val, i) => (
                  <circle
                    key={i}
                    cx={i * 20}
                    cy={32 - ((val - 85) / 15) * 28}
                    r={i === sparklineData.length - 1 ? 3.5 : 2}
                    fill={i === sparklineData.length - 1 ? "#10B981" : "#0284C7"}
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-cardSm bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
              <span className="text-slate-400 text-[11px] block">Scans Completed</span>
              <span className="text-base font-bold text-slate-900 dark:text-white font-mono">47</span>
            </div>
            <div className="p-3 rounded-cardSm bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
              <span className="text-slate-400 text-[11px] block">Threats Blocked</span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">3</span>
            </div>
            <div className="p-3 rounded-cardSm bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
              <span className="text-slate-400 text-[11px] block">Hardening Steps</span>
              <span className="text-base font-bold text-sky-600 dark:text-cyan-400 font-mono">5</span>
            </div>
            <div className="p-3 rounded-cardSm bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
              <span className="text-slate-400 text-[11px] block">Zero-Days</span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">0</span>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Security Badges & Milestones
            </span>
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                <Award className="w-3.5 h-3.5 text-emerald-500" />
                <span>30-Day Threat-Free Streak</span>
              </div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-300 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />
                <span>Quantum TLS 1.3 Key Active</span>
              </div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span>Firewall Armed</span>
              </div>
            </div>
          </div>

          {/* Action & Sharing Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-white/10">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => window.open("https://twitter.com", "_blank", "noopener,noreferrer")}
                className="p-2 rounded-btn bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <Twitter className="w-3.5 h-3.5 fill-current" />
                <span>Share</span>
              </button>
              <button
                onClick={() => window.open("https://linkedin.com", "_blank", "noopener,noreferrer")}
                className="p-2 rounded-btn bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <Linkedin className="w-3.5 h-3.5 fill-current" />
                <span>LinkedIn</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-btn bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold shadow-sm hover:scale-[1.02] transition-all flex items-center gap-1.5"
            >
              <span>View Full Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
