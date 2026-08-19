"use client";

import React from "react";
import { motion } from "framer-motion";
import { MoreHorizontal, ShieldCheck } from "lucide-react";
import { useTelemetryStore } from "@/store/telemetryStore";

export const RadialRevenueDonut: React.FC = () => {
  const securityScore = useTelemetryStore(state => state.securityScore);
  const size = 200;
  const center = size / 2;

  // Outer ring (Neutralized Attacks - Orange)
  const radiusOuter = 78;
  const strokeOuter = 9;
  const circOuter = 2 * Math.PI * radiusOuter;
  const percentOuter = 0.88; // 88%
  const offsetOuter = circOuter * (1 - percentOuter);

  // Inner ring (Kernel Intercepts - Yellow)
  const radiusInner = 60;
  const strokeInner = 6;
  const circInner = 2 * Math.PI * radiusInner;
  const percentInner = 0.74; // 74%
  const offsetInner = circInner * (1 - percentInner);

  return (
    <div className="w-full bg-[#121418]/90 border border-white/[0.08] rounded-3xl p-6 shadow-xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Shield Defense Health</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Zero-Trust posture & kernel ring-0 integrity.
          </p>
        </div>

        <button className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.04] transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Legend Dots */}
      <div className="flex items-center justify-center gap-6 pt-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF6A00] shadow-[0_0_8px_#FF6A00]" />
          <span>Neutralized Vectors</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFB700] shadow-[0_0_8px_#FFB700]" />
          <span>Kernel Intercepts</span>
        </div>
      </div>

      {/* Radial Donut Display */}
      <div className="relative flex items-center justify-center my-4">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="rotate-[-90deg] overflow-visible"
        >
          {/* Ambient Glow Filter */}
          <defs>
            <filter id="orangeDonutGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="yellowDonutGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer Track Background */}
          <circle
            cx={center}
            cy={center}
            r={radiusOuter}
            fill="none"
            stroke="#1C1F28"
            strokeWidth={strokeOuter}
          />

          {/* Outer Progress Arc (Orange) */}
          <motion.circle
            cx={center}
            cy={center}
            r={radiusOuter}
            fill="none"
            stroke="#FF6A00"
            strokeWidth={strokeOuter}
            strokeDasharray={circOuter}
            strokeDashoffset={offsetOuter}
            strokeLinecap="round"
            filter="url(#orangeDonutGlow)"
            initial={{ strokeDashoffset: circOuter }}
            animate={{ strokeDashoffset: offsetOuter }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          {/* Inner Track Background */}
          <circle
            cx={center}
            cy={center}
            r={radiusInner}
            fill="none"
            stroke="#1C1F28"
            strokeWidth={strokeInner}
          />

          {/* Inner Progress Arc (Yellow) */}
          <motion.circle
            cx={center}
            cy={center}
            r={radiusInner}
            fill="none"
            stroke="#FFB700"
            strokeWidth={strokeInner}
            strokeDasharray={circInner}
            strokeDashoffset={offsetInner}
            strokeLinecap="round"
            filter="url(#yellowDonutGlow)"
            initial={{ strokeDashoffset: circInner }}
            animate={{ strokeDashoffset: offsetInner }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
          />
        </svg>

        {/* Center Text Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <div className="text-2xl font-black text-white tracking-tight">
            {securityScore}%
          </div>
          <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{securityScore >= 95 ? "SHIELD SECURE" : "AT RISK"}</span>
          </div>
        </div>
      </div>

      {/* Bottom Summary Pill */}
      <div className="text-center pt-2 border-t border-white/[0.04]">
        <span className="text-xs font-mono text-slate-400">
          32,064 Attacks Mitigated • 0 Active Leaks
        </span>
      </div>
    </div>
  );
};
export default RadialRevenueDonut;
