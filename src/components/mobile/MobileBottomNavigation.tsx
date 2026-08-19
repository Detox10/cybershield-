"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Layers, ShieldCheck, Activity, Settings, Plus, Sparkles, X, RefreshCw, Key, Download } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MobileBottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onQuickAction?: (action: string) => void;
}

export const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
  activeTab,
  onTabChange,
  onQuickAction,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const TABS = [
    { id: "home", label: "Studio", icon: <Home className="w-5 h-5" /> },
    { id: "tokens", label: "Tokens", icon: <Layers className="w-5 h-5" /> },
    { id: "fab", label: "", icon: null }, // Center Action FAB
    { id: "threats", label: "Defense", icon: <ShieldCheck className="w-5 h-5" /> },
    { id: "settings", label: "Config", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Floating Bottom Nav Bar */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[94%] max-w-md z-40">
        <div className="h-16 px-4 rounded-3xl bg-white/85 dark:bg-[#0E1526]/90 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl backdrop-blur-xl flex items-center justify-between relative">
          {TABS.map((tab) => {
            if (tab.id === "fab") {
              return (
                <div key="center-fab" className="relative -top-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setIsDrawerOpen(true)}
                    className="w-12 h-12 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-400/30 border-2 border-white dark:border-[#0E1526]"
                    aria-label="Quick Action"
                  >
                    <Plus className="w-6 h-6 stroke-[2.5]" />
                  </motion.button>
                </div>
              );
            }

            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex flex-col items-center justify-center w-12 h-full transition-colors relative",
                  isActive
                    ? "text-sky-600 dark:text-sky-400 font-bold"
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                {tab.icon}
                <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute -bottom-1 w-5 h-1 bg-sky-500 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Action Bottom Sheet Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Drawer Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0E1526] rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-6 z-10 shadow-2xl space-y-4"
            >
              {/* Drawer Handle */}
              <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />

              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-500" />
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    Quick Studio Actions
                  </h3>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Action Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    onQuickAction?.("sync");
                    setIsDrawerOpen(false);
                  }}
                  className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/40 flex flex-col items-start gap-2 hover:bg-indigo-100 transition-colors text-left"
                >
                  <RefreshCw className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Trigger Token Sync
                    </p>
                    <p className="text-[10px] text-slate-500">Sync Figma with Git repos</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onQuickAction?.("verify");
                    setIsDrawerOpen(false);
                  }}
                  className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 flex flex-col items-start gap-2 hover:bg-emerald-100 transition-colors text-left"
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Audit Security
                    </p>
                    <p className="text-[10px] text-slate-500">Zero-Trust signature check</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onQuickAction?.("export");
                    setIsDrawerOpen(false);
                  }}
                  className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 flex flex-col items-start gap-2 hover:bg-amber-100 transition-colors text-left"
                >
                  <Download className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Export Swift / Kotlin
                    </p>
                    <p className="text-[10px] text-slate-500">Generate native files</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onQuickAction?.("keys");
                    setIsDrawerOpen(false);
                  }}
                  className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/40 flex flex-col items-start gap-2 hover:bg-purple-100 transition-colors text-left"
                >
                  <Key className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Rotate RSA Keys
                    </p>
                    <p className="text-[10px] text-slate-500">Zero-day key containment</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
