"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { useTelemetryStore } from "@/store/telemetryStore";

export const GlowingBarChart: React.FC = () => {
  const [viewType, setViewType] = useState<"threats" | "quarantined">("threats");
  const [hoveredBar, setHoveredBar] = useState<string>("Jun");
  
  const { cpuHistory } = useTelemetryStore();
  
  // Transform cpuHistory into bar format
  const activeData = cpuHistory.map((val, idx) => ({
    time: `T-${30 - idx}s`,
    value: val,
    isPeak: val > 80
  }));
  
  const maxHeight = 165; // in px
  const maxValue = 100; // 100% scale

  const currentHoveredItem = activeData.find((d) => d.time === hoveredBar) || activeData[activeData.length - 1];

  return (
    <div
      data-hud-info="Threat Ingress Progressive Graph: Visualizes real-time and historical volumetric threat telemetry across monthly inspection cycles."
      className="w-full bg-[#121418]/90 border border-white/[0.08] rounded-3xl p-6 shadow-xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between h-full group"
    >
      {/* Ambient Peak Glow */}
      <div className="absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#FF6A00]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>CPU Processing Telemetry</span>
            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE TELEMETRY</span>
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-core processing load and compute capacity utilization.
          </p>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-2">
          {/* Timeframe Dropdown */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#1A1D24] border border-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white transition-colors">
            <span>Last 30 Seconds</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative pt-12 pb-2 flex-1 flex items-end min-h-[220px]">
        {/* Y-Axis Gridlines & Labels */}
        <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between pointer-events-none opacity-30 text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1">
            <span className="w-6">100%</span>
          </div>
          <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1">
            <span className="w-6">80%</span>
          </div>
          <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1">
            <span className="w-6">60%</span>
          </div>
          <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1">
            <span className="w-6">40%</span>
          </div>
          <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1">
            <span className="w-6">20%</span>
          </div>
        </div>

        {/* Floating Progressive Dynamic Tooltip */}
        <div className="absolute top-1 inset-x-0 flex justify-center pointer-events-none z-20">
          <motion.div
            key={`${currentHoveredItem.time}-${viewType}`}
            initial={{ scale: 0.92, opacity: 0, y: -4 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-[#1C202B]/95 border border-white/20 px-4 py-2 rounded-2xl text-xs text-white shadow-2xl flex items-center gap-3 backdrop-blur-md"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF6A00] animate-pulse" />
              <span className="font-extrabold text-white">
                {currentHoveredItem.time}: {currentHoveredItem.value}% CPU Load
              </span>
            </div>
          </motion.div>
        </div>

        {/* 3D Capsule Progressive Bars */}
        <div className="w-full flex items-end justify-between pl-10 pr-4 z-10">
          {activeData.map((item, idx) => {
            const isHovered = hoveredBar === item.time;
            const isPeak = item.isPeak;
            const targetHeightPx = (item.value / maxValue) * maxHeight;

            return (
              <div
                key={item.time}
                className="flex flex-col items-center gap-3 group/bar cursor-pointer"
                onMouseEnter={() => setHoveredBar(item.time)}
                data-hud-info={`CPU Load at ${item.time}: ${item.value}%`}
              >
                {/* 3D Capsule Bar with Framer Motion Progressive Scale */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${targetHeightPx}px` }}
                  transition={{
                    duration: 0.6,
                    delay: 0, // removed progressive delay for real-time feel
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                  className="relative w-3 sm:w-4 rounded-2xl"
                >
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className={`absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold whitespace-nowrap ${
                      isPeak ? "text-[#FF6A00]" : "text-slate-300 opacity-0 group-hover/bar:opacity-100"
                    }`}
                  >
                    {item.value}%
                  </motion.div>

                  {isPeak ? (
                    // Glowing Fiery Orange Peak Capsule
                    <div className="relative w-full h-full rounded-2xl bg-gradient-to-t from-[#FF3B00] via-[#FF6A00] to-[#FFA800] p-[1.5px] shadow-[0_0_35px_rgba(255,106,0,0.75)] group-hover/bar:shadow-[0_0_50px_rgba(255,106,0,0.95)] transition-all">
                      <div className="w-full h-full rounded-[14px] bg-gradient-to-t from-[#FF3B00] via-[#FF6A00] to-[#FFA800] flex flex-col justify-between overflow-hidden">
                        {/* Top specular reflection */}
                        <div className="w-full h-3 bg-white/40 rounded-t-2xl blur-[1px]" />
                        {/* Bottom inner glow */}
                        <div className="w-full h-4 bg-amber-300/30 rounded-b-2xl" />
                      </div>
                    </div>
                  ) : (
                    // Glowing Amber Standard Capsule
                    <div className={`relative w-full h-full rounded-2xl p-[1px] transition-all duration-300 ${
                      isHovered
                        ? "bg-gradient-to-t from-orange-600 via-amber-500 to-yellow-400 shadow-[0_0_20px_rgba(251,146,60,0.5)] scale-110 z-10"
                        : "bg-gradient-to-t from-orange-900/40 via-orange-700/50 to-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                    }`}>
                      <div className="w-full h-full rounded-[14px] bg-gradient-to-t from-[#0B0F19] to-orange-900/40 flex flex-col justify-between overflow-hidden">
                        {/* Top specular reflection */}
                        <div className="w-full h-2 bg-yellow-300/40 rounded-t-2xl blur-[0.5px]" />
                        {/* Bottom inner glow */}
                        <div className="w-full h-3 bg-orange-500/20 rounded-b-2xl" />
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* X-Axis Month Label */}
                <span
                  className={`text-[9px] font-mono font-bold transition-colors ${
                    isPeak
                      ? "text-white"
                      : isHovered
                      ? "text-slate-200"
                      : "text-slate-600"
                  } ${idx % 5 === 0 ? "opacity-100" : "opacity-0"}`}
                >
                  {item.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default GlowingBarChart;
