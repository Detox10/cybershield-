"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, ShieldCheck, Sparkles, Code2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export const MobileVideoDemoSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(30);
  const [stepIndex, setStepIndex] = useState(0);

  const DEMO_STEPS = [
    {
      title: "1. Parsing Figma Design Tokens",
      status: "EXTRACTING",
      code: "const colors = specify.fetchTokens('figma://cybershield');",
      badge: "FIGMA API v2",
    },
    {
      title: "2. Zero-Trust Security Verification",
      status: "AUDITING",
      code: "crypto.verifySignature(tokenPayload, RSA_PUB_KEY);",
      badge: "ZERO TRUST OK",
    },
    {
      title: "3. Generating Cross-Platform Assets",
      status: "COMPILING",
      code: "compiler.export({ ios: 'SwiftUI', web: 'Tailwind' });",
      badge: "60 FPS READY",
    },
    {
      title: "4. Live Deployment Complete",
      status: "DEPLOYED",
      code: "sentinel.broadcastSync('v3.4.0', targetClusters);",
      badge: "LIVE SYNCHRONIZED",
    },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 5;
        });
        setStepIndex((prev) => (prev + 1) % DEMO_STEPS.length);
      }, 900);
    }
    return () => clearInterval(interval);
  }, [isPlaying, DEMO_STEPS.length]);

  return (
    <section className="w-full py-10 px-4 flex flex-col items-center text-center">
      {/* Section Header */}
      <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tight leading-none mb-6">
        WATCH THE REAL THING <br />
        <span className="text-sky-500">IN ACTION</span>
      </h2>

      {/* Interactive Media Player Container */}
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/80 shadow-2xl">
        {/* Mock App Window Header */}
        <div className="h-8 bg-slate-950 px-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            studio-runtime-v3.mp4
          </span>
          <div className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            LIVE
          </div>
        </div>

        {/* Video / Interactive Canvas Area */}
        <div className="relative h-64 sm:h-72 p-4 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-[#0C1222] to-slate-950 text-left overflow-hidden">
          {/* Animated Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

          {/* Top Status */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {DEMO_STEPS[stepIndex].badge}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              00:{playbackProgress < 10 ? `0${playbackProgress}` : playbackProgress} / 01:00
            </span>
          </div>

          {/* Middle Live Step Display */}
          <div className="relative z-10 my-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={stepIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-white">
                    {DEMO_STEPS[stepIndex].title}
                  </h4>
                </div>
                <div className="p-3 rounded-xl bg-black/60 border border-slate-800 font-mono text-xs text-emerald-400 shadow-inner">
                  <code>{DEMO_STEPS[stepIndex].code}</code>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Central Pulsing Play/Pause Button */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="pointer-events-auto w-14 h-14 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center justify-center shadow-xl shadow-cyan-400/30 transition-transform cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-1" />
              )}
            </motion.button>
          </div>

          {/* Host / Presenter Avatar Chip (matching reference bottom corner) */}
          <div className="relative z-10 flex items-center gap-2 pt-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-slate-800">
              AI
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-200 leading-none">
                Sentinel AI Agent
              </p>
              <p className="text-[9px] text-slate-400">Autonomous Orchestrator</p>
            </div>
          </div>
        </div>

        {/* Video Scrubber & Controls */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          {/* Progress bar */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newProgress = Math.round((clickX / rect.width) * 100);
              setPlaybackProgress(newProgress);
            }}
            className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer relative"
          >
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-sky-500 rounded-full transition-all"
              style={{ width: `${playbackProgress}%` }}
            />
          </div>
          <button
            onClick={() => {
              setPlaybackProgress(0);
              setIsPlaying(true);
            }}
            className="text-slate-400 hover:text-white transition-colors"
            title="Restart"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
