"use client";

import React, { useState, useEffect } from "react";
import { motion, useSpring } from "framer-motion";
import { ShieldCoreState } from "@/types/cybershield";
import DigitResolver from "./motion/DigitResolver";

interface GeometricSecurityGaugeProps {
  score?: number;
  state?: ShieldCoreState;
  size?: "mini" | "compact" | "normal" | "hero";
  className?: string;
  showScore?: boolean;
  label?: string;
}

export default function GeometricSecurityGauge({
  score = 96,
  state = "SECURE",
  size = "hero",
  className = "",
  showScore = true,
  label,
}: GeometricSecurityGaugeProps) {
  const config = {
    mini: { px: 40, radius: 16, stroke: 2.5, tickCount: 12, tickLength: 3, font: "text-[10px]" },
    compact: { px: 72, radius: 28, stroke: 3, tickCount: 24, tickLength: 4, font: "text-sm" },
    normal: { px: 110, radius: 44, stroke: 3.5, tickCount: 36, tickLength: 5, font: "text-xl" },
    hero: { px: 160, radius: 64, stroke: 4.5, tickCount: 48, tickLength: 7, font: "text-3xl" },
  }[size];

  // Palette definitions
  const theme = {
    IDLE: {
      primary: "#0284C7",
      secondary: "rgba(2, 132, 199, 0.12)",
      accent: "#38BDF8",
      statusText: "Active",
    },
    SCANNING: {
      primary: "#00A389", // Teal
      secondary: "rgba(0, 163, 137, 0.15)",
      accent: "#34D399",
      statusText: "Analyzing",
    },
    SECURE: {
      primary: "#00A389", // Nothing-style emerald-teal
      secondary: "rgba(0, 163, 137, 0.12)",
      accent: "#34D399",
      statusText: "Optimal",
    },
    WARNING: {
      primary: "#D97706",
      secondary: "rgba(217, 119, 6, 0.12)",
      accent: "#FBBF24",
      statusText: "Review",
    },
    THREAT: {
      primary: "#DC2626",
      secondary: "rgba(220, 38, 38, 0.14)",
      accent: "#F87171",
      statusText: "Isolated",
    },
  }[state];

  // Animated score spring
  const springScore = useSpring(0, { duration: 800, bounce: 0 });
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    springScore.set(score);
    const unsubscribe = springScore.on("change", (latest) => {
      setDisplayScore(Math.round(latest));
    });
    return () => unsubscribe();
  }, [score, springScore]);

  const circumference = 2 * Math.PI * config.radius;
  const strokeDashoffset = circumference - (circumference * score) / 100;
  const center = config.px / 2;

  // Generate precision tick marks
  const ticks = Array.from({ length: config.tickCount }, (_, i) => {
    const angle = (i * 360) / config.tickCount;
    const rad = (angle * Math.PI) / 180;
    const rOuter = config.radius + (size === "hero" ? 11 : 7);
    const rInner = rOuter - config.tickLength;
    const x1 = center + Math.cos(rad) * rInner;
    const y1 = center + Math.sin(rad) * rInner;
    const x2 = center + Math.cos(rad) * rOuter;
    const y2 = center + Math.sin(rad) * rOuter;
    const isHighlighted = (i / config.tickCount) * 100 <= displayScore;

    return { x1, y1, x2, y2, angle, isHighlighted };
  });

  // Breathing cycle: 4s sine wave at idle, 2s during scan
  const breathingDuration = state === "SCANNING" ? 2.0 : 4.0;

  return (
    <motion.div
      animate={{
        scale: [1.0, 1.02, 1.0],
      }}
      transition={{
        duration: breathingDuration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: config.px, height: config.px }}
    >
      <svg
        width={config.px}
        height={config.px}
        viewBox={`0 0 ${config.px} ${config.px}`}
        className="transform -rotate-90 overflow-visible"
      >
        {/* Subtle Outer Concentric Ring */}
        <circle
          cx={center}
          cy={center}
          r={config.radius + (size === "hero" ? 12 : 8)}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.75"
          className="text-slate-200 dark:text-white/10"
        />

        {/* Fine Radial Ticks */}
        {ticks.map((t, idx) => (
          <line
            key={idx}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={t.isHighlighted ? theme.primary : "currentColor"}
            strokeWidth={idx % 4 === 0 ? 1.5 : 0.75}
            strokeOpacity={t.isHighlighted ? 0.7 : 0.15}
            className={!t.isHighlighted ? "text-slate-300 dark:text-white/20" : ""}
          />
        ))}

        {/* Background Track Circle */}
        <circle
          cx={center}
          cy={center}
          r={config.radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.stroke}
          className="text-slate-100 dark:text-white/5"
        />

        {/* Active Progress Arc */}
        <motion.circle
          cx={center}
          cy={center}
          r={config.radius}
          fill="none"
          stroke={theme.primary}
          strokeWidth={config.stroke}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
          strokeLinecap="round"
        />

        {/* Scanning Rotation Arc indicator if scanning */}
        {state === "SCANNING" && (
          <motion.circle
            cx={center}
            cy={center}
            r={config.radius - 8}
            fill="none"
            stroke={theme.accent}
            strokeWidth="1.5"
            strokeDasharray={`${circumference * 0.25} ${circumference * 0.75}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "center" }}
            strokeLinecap="round"
          />
        )}
      </svg>

      {/* Central Typographic Display with Digit "Resolve" effect */}
      {showScore && size !== "mini" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <div className="flex flex-col items-center">
            <div className="flex items-baseline">
              <span className={`font-semibold tracking-tight text-slate-900 dark:text-white ${config.font}`}>
                <DigitResolver value={score} durationMs={160} />
              </span>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 ml-0.5">%</span>
            </div>

            {size === "hero" && (
              <div className="flex items-center space-x-1 mt-0.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: theme.primary }}
                />
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {label || theme.statusText}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mini indicator */}
      {size === "mini" && (
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: theme.primary }}
        />
      )}
    </motion.div>
  );
}
