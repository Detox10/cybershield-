"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface BarDataPoint {
  date: string;
  label: string;
  count: number;
  threatsBlocked: number;
  avgLatency: string;
}

const DATA: BarDataPoint[] = [
  { date: "June 1", label: "Jun 1", count: 2400, threatsBlocked: 12, avgLatency: "8ms" },
  { date: "June 3", label: "Jun 3", count: 5200, threatsBlocked: 28, avgLatency: "9ms" },
  { date: "June 6", label: "Jun 6", count: 6800, threatsBlocked: 45, avgLatency: "11ms" },
  { date: "June 8", label: "Jun 8", count: 3900, threatsBlocked: 18, avgLatency: "7ms" },
  { date: "June 11", label: "Jun 11", count: 4800, threatsBlocked: 22, avgLatency: "8ms" },
  { date: "June 13", label: "Jun 13", count: 3100, threatsBlocked: 14, avgLatency: "6ms" },
  { date: "June 16", label: "Jun 16", count: 6900, threatsBlocked: 51, avgLatency: "12ms" },
  { date: "June 18", label: "Jun 18", count: 4200, threatsBlocked: 19, avgLatency: "8ms" },
  { date: "June 21", label: "Jun 21", count: 5100, threatsBlocked: 25, avgLatency: "9ms" },
  { date: "June 23", label: "Jun 23", count: 6200, threatsBlocked: 36, avgLatency: "10ms" },
  { date: "June 26", label: "Jun 26", count: 4600, threatsBlocked: 20, avgLatency: "8ms" },
  { date: "June 28", label: "Jun 28", count: 5800, threatsBlocked: 31, avgLatency: "9ms" },
];

const MAX_VALUE = 7500;

export const CustomerIoBarChart: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="w-full h-64 sm:h-72 pt-4 pb-2 relative flex flex-col justify-between select-none">
      {/* Chart Canvas Area */}
      <div className="flex-1 flex items-end gap-2 sm:gap-3 px-8 sm:px-12 relative border-b border-slate-200 dark:border-slate-800/80 pb-2">
        {/* Y-Axis Grid Lines & Values */}
        <div className="absolute inset-x-0 inset-y-0 pointer-events-none flex flex-col justify-between text-[11px] font-mono text-slate-400 dark:text-slate-500 pl-1">
          <div className="border-b border-slate-100 dark:border-slate-800/40 w-full flex items-center justify-between pr-2">
            <span>7.5k</span>
          </div>
          <div className="border-b border-slate-100 dark:border-slate-800/40 w-full flex items-center justify-between pr-2">
            <span>5k</span>
          </div>
          <div className="border-b border-slate-100 dark:border-slate-800/40 w-full flex items-center justify-between pr-2">
            <span>2.5k</span>
          </div>
          <div className="border-b border-slate-100 dark:border-slate-800/40 w-full flex items-center justify-between pr-2">
            <span>1k</span>
          </div>
          <div className="w-full flex items-center justify-between pr-2">
            <span>0</span>
          </div>
        </div>

        {/* Bars Container */}
        <div className="w-full h-full flex items-end justify-between gap-1.5 sm:gap-2.5 z-10 pl-7">
          {DATA.map((item, idx) => {
            const heightPercent = (item.count / MAX_VALUE) * 100;
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={item.date}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="flex-1 h-full flex flex-col items-center justify-end relative cursor-pointer group"
              >
                {/* Floating Tooltip */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute bottom-full mb-3 z-30 pointer-events-none whitespace-nowrap bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg px-3 py-2 text-[11px] font-sans shadow-xl border border-slate-700 dark:border-slate-200"
                  >
                    <p className="font-bold text-xs text-sky-400 dark:text-sky-600">
                      {item.date}: {item.count.toLocaleString()} Telemetry Events
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-300 dark:text-slate-600">
                      <span>🛡️ {item.threatsBlocked} Threats Blocked</span>
                      <span>⚡ {item.avgLatency} Latency</span>
                    </div>
                    {/* Tooltip arrow */}
                    <div className="w-2 h-2 bg-slate-900 dark:bg-white rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                  </motion.div>
                )}

                {/* The Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.03, ease: [0.16, 1, 0.3, 1] }}
                  className={`w-full max-w-[28px] rounded-t-sm transition-all duration-200 ${
                    isHovered
                      ? "bg-teal-500 dark:bg-teal-400 shadow-md shadow-teal-500/30 scale-x-105"
                      : "bg-[#79D2C0] dark:bg-[#2DD4BF]/80 group-hover:bg-teal-400"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* X-Axis Date Labels */}
      <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 dark:text-slate-500 pt-2 px-10 sm:px-14">
        <span>June 1</span>
        <span>June 6</span>
        <span>June 11</span>
        <span>June 16</span>
        <span>June 21</span>
        <span>June 26</span>
      </div>
    </div>
  );
};
export default CustomerIoBarChart;
