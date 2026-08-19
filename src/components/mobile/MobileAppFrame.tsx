"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, Monitor, Wifi, Battery, Signal, Moon, Sun, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MobileAppFrameProps {
  children: React.ReactNode;
}

export const MobileAppFrame: React.FC<MobileAppFrameProps> = ({ children }) => {
  const [viewMode, setViewMode] = useState<"phone" | "fluid">("phone");
  const [currentTime, setCurrentTime] = useState("9:41");

  return (
    <div className="w-full flex flex-col items-center py-6 px-2 sm:px-4">
      {/* Top Viewport Mode Switcher Toolbar */}
      <div className="flex items-center gap-2 mb-6 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-sm">
        <button
          onClick={() => setViewMode("phone")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
            viewMode === "phone"
              ? "bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          )}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile Device Mockup</span>
        </button>
        <button
          onClick={() => setViewMode("fluid")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
            viewMode === "fluid"
              ? "bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          )}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Full Responsive View</span>
        </button>
      </div>

      {/* Main Container */}
      {viewMode === "phone" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-[420px] rounded-[48px] border-[10px] border-slate-900 dark:border-slate-800 bg-white dark:bg-[#070B14] shadow-[0_25px_70px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col min-h-[860px]"
        >
          {/* Hardware Frame Speaker / Notch / Dynamic Island */}
          <div className="sticky top-0 z-50 bg-white/90 dark:bg-[#070B14]/90 backdrop-blur-md pt-3 pb-2 px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60">
            <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
              {currentTime}
            </span>

            {/* Dynamic Island Pill */}
            <div className="w-24 h-5 rounded-full bg-slate-950 flex items-center justify-center px-2 gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-mono font-bold text-cyan-300">
                SENTINEL
              </span>
            </div>

            {/* Status Icons */}
            <div className="flex items-center gap-1.5 text-slate-900 dark:text-white">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Scrollable Phone App Content */}
          <div className="flex-1 pb-24 overflow-y-auto no-scrollbar">{children}</div>

          {/* Bottom Gesture Bar */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400 dark:bg-slate-600 rounded-full z-50 pointer-events-none" />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-4xl pb-24"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};
