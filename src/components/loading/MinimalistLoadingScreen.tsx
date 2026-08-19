"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MinimalistLoadingScreenProps {
  onComplete?: () => void;
  minDurationMs?: number;
}

const SYSTEM_STAGES = [
  "INITIALIZING KERNEL TELEMETRY...",
  "ESTABLISHING ZERO-TRUST HANDSHAKE...",
  "LOADING ANALYTICS & REVENUE ENGINE...",
  "SYNCHRONIZING SENTINEL AGENTS...",
  "ALL SYSTEMS ONLINE & VERIFIED",
];

export const MinimalistLoadingScreen: React.FC<MinimalistLoadingScreenProps> = ({
  onComplete,
  minDurationMs = 2800,
}) => {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    const startTime = performance.now();

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(100, (elapsed / minDurationMs) * 100);

      // Smooth progress update
      setProgress(rawProgress);

      // Map progress to current stage
      const currentStage = Math.min(
        SYSTEM_STAGES.length - 1,
        Math.floor((rawProgress / 100) * SYSTEM_STAGES.length)
      );
      setStageIndex(currentStage);

      if (rawProgress < 100) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        setTimeout(() => {
          setIsFinished(true);
          if (onComplete) onComplete();
        }, 400);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(animationFrameId);
  }, [minDurationMs, onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 0.99,
            filter: "blur(6px)",
            transition: { duration: 0.5, ease: [0.65, 0, 0.35, 1] },
          }}
          className="fixed inset-0 z-50 bg-[#0B0C10] flex flex-col items-center justify-center select-none overflow-hidden"
        >
          {/* Ambient Warm Glow in Background */}
          <div className="absolute w-[440px] h-[440px] bg-gradient-to-tr from-[#FF6A00]/18 via-[#FF3B00]/10 to-transparent rounded-full blur-[130px] pointer-events-none" />

          {/* Center Card Container */}
          <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 space-y-8 text-center">
            {/* Minimalist Geometric Emblem */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              {/* Outer pulsing ring */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.0,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-2xl border border-[#FF6A00]/50 shadow-[0_0_24px_rgba(255,106,0,0.35)]"
              />

              {/* Inner geometric core */}
              <div className="w-14 h-14 rounded-2xl bg-[#121418] border border-white/10 flex items-center justify-center shadow-2xl">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FF7A00"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="8" cy="8" r="4" />
                  <circle cx="16" cy="8" r="4" />
                  <circle cx="8" cy="16" r="4" />
                  <circle cx="16" cy="16" r="4" />
                </svg>
              </div>
            </div>

            {/* Brand Title */}
            <div className="space-y-1.5">
              <h1 className="text-base font-black tracking-[0.25em] text-white uppercase">
                CYBERSHIELD OS
              </h1>
              <p className="text-xs font-mono text-slate-400 tracking-wider">
                SENTINEL KERNEL v2.4
              </p>
            </div>

            {/* Highly Visible, Fluid Mechanical Progress Bar */}
            <div className="w-full space-y-3.5">
              {/* Outer Track */}
              <div className="w-full h-2.5 rounded-full bg-[#151821] border border-white/[0.1] overflow-hidden relative shadow-inner p-[1px]">
                {/* Active Progress Fill */}
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FF3B00] via-[#FF6A00] to-[#FFB700] shadow-[0_0_16px_rgba(255,106,0,0.8)] relative transition-all duration-75 ease-out"
                  style={{ width: `${progress}%` }}
                >
                  {/* Glowing Leading Head Light */}
                  <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/70 rounded-full blur-[1px]" />
                </div>
              </div>

              {/* Progress Readout & Status Ticker */}
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 truncate max-w-[240px] text-left">
                  {SYSTEM_STAGES[stageIndex]}
                </span>
                <span className="text-[#FF7A00] font-black text-sm tabular-nums">
                  {Math.floor(progress).toString().padStart(2, "0")}%
                </span>
              </div>
            </div>

            {/* Micro Dot-Matrix Indicator */}
            <div className="flex items-center justify-center gap-2 pt-1">
              {[0, 1, 2, 3, 4].map((idx) => {
                const isActive = stageIndex >= idx;
                return (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-[#FF6A00] shadow-[0_0_8px_#FF6A00] scale-110"
                        : "bg-slate-800"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default MinimalistLoadingScreen;
