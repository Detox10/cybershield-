"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  FileSearch,
  Bot,
  Activity,
  Plus,
  X,
  RefreshCw,
  Download,
  Key,
  ShieldCheck,
} from "lucide-react";
import { AppRoute } from "./AppSidebar";
import { cn } from "@/lib/utils";

export interface MobileNavProps {
  activeRoute: AppRoute;
  onRouteChange: (route: AppRoute) => void;
  onQuickAction?: (action: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeRoute,
  onRouteChange,
  onQuickAction,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const TABS = [
    { id: "dashboard" as AppRoute, label: "Shield", icon: Shield },
    { id: "scan" as AppRoute, label: "Scan", icon: FileSearch },
    { id: "fab" as any, label: "", icon: null },
    { id: "assistant" as AppRoute, label: "Copilot", icon: Bot },
    { id: "diagnostics" as AppRoute, label: "Fleet", icon: Activity },
  ];

  return (
    <>
      {/* Mobile Floating Bottom Bar */}
      <div className="md:hidden fixed bottom-3 inset-x-0 z-40 flex items-center justify-center px-3 pointer-events-none">
        <div className="pointer-events-auto h-16 w-full max-w-sm rounded-3xl bg-white/90 dark:bg-[#0E1526]/90 border border-slate-200/90 dark:border-slate-800 shadow-2xl backdrop-blur-xl flex items-center justify-around px-2">
          {TABS.map((tab) => {
            if (tab.id === "fab") {
              return (
                <div key="center-fab" className="relative -top-4">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setIsDrawerOpen(true)}
                    className="w-12 h-12 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 border-2 border-white dark:border-[#0E1526]"
                    aria-label="Quick Actions"
                  >
                    <Plus className="w-5 h-5 stroke-[2.5]" />
                  </motion.button>
                </div>
              );
            }

            const Icon = tab.icon!;
            const isActive = activeRoute === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onRouteChange(tab.id)}
                className={cn(
                  "flex flex-col items-center justify-center w-12 h-full transition-colors relative",
                  isActive
                    ? "text-sky-600 dark:text-sky-400 font-bold"
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                <Icon className={cn("w-5 h-5 transition-transform", isActive && "scale-110")} />
                <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveIndicator"
                    className="absolute -bottom-1 w-4 h-1 bg-sky-500 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Action Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:p-4 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0E1526] rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-6 z-10 shadow-2xl space-y-4"
            >
              <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />

              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Quick Security Operations
                </h3>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    onQuickAction?.("scan");
                    onRouteChange("scan");
                    setIsDrawerOpen(false);
                  }}
                  className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/60 dark:border-sky-800/40 text-left hover:bg-sky-100 transition-colors"
                >
                  <FileSearch className="w-5 h-5 text-sky-600 dark:text-sky-400 mb-2" />
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Run Deep Scan</p>
                  <p className="text-[10px] text-slate-500">Heuristic memory pipeline</p>
                </button>

                <button
                  onClick={() => {
                    onQuickAction?.("audit");
                    onRouteChange("audit");
                    setIsDrawerOpen(false);
                  }}
                  className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-left hover:bg-emerald-100 transition-colors"
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2" />
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Audit Zero-Trust</p>
                  <p className="text-[10px] text-slate-500">Verify RSA-4096 signatures</p>
                </button>

                <button
                  onClick={() => {
                    onQuickAction?.("export");
                    setIsDrawerOpen(false);
                  }}
                  className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/40 text-left hover:bg-purple-100 transition-colors"
                >
                  <Download className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2" />
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Export SOC2 Logs</p>
                  <p className="text-[10px] text-slate-500">CSV & JSON evidence</p>
                </button>

                <button
                  onClick={() => {
                    onQuickAction?.("keys");
                    setIsDrawerOpen(false);
                  }}
                  className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 text-left hover:bg-amber-100 transition-colors"
                >
                  <Key className="w-5 h-5 text-amber-600 dark:text-amber-400 mb-2" />
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Rotate RSA Key</p>
                  <p className="text-[10px] text-slate-500">Fleet cryptographic cipher</p>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
