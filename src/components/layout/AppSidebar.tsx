"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  FileSearch,
  Bot,
  AlertTriangle,
  Activity,
  FileText,
  Smartphone,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AppRoute =
  | "dashboard"
  | "scan"
  | "assistant"
  | "threats"
  | "diagnostics"
  | "audit"
  | "studio"
  | "settings";

export interface AppSidebarProps {
  activeRoute: AppRoute;
  onRouteChange: (route: AppRoute) => void;
  unreadCount?: number;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeRoute,
  onRouteChange,
  unreadCount = 2,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const NAV_ITEMS = [
    { id: "dashboard" as AppRoute, label: "Command Center", icon: Shield, shortcut: "⌘1" },
    { id: "scan" as AppRoute, label: "Deep Threat Scan", icon: FileSearch, shortcut: "⌘S" },
    { id: "assistant" as AppRoute, label: "AI Security Copilot", icon: Bot, shortcut: "⌘A" },
    { id: "threats" as AppRoute, label: "MITRE ATT&CK Matrix", icon: AlertTriangle, shortcut: "⌘T" },
    { id: "diagnostics" as AppRoute, label: "Fleet Diagnostics", icon: Activity, shortcut: "⌘D" },
    { id: "audit" as AppRoute, label: "Compliance & Audit", icon: FileText, shortcut: "⌘L" },
    { id: "studio" as AppRoute, label: "Mobile Token Studio", icon: Smartphone, badge: "NEW" },
    { id: "settings" as AppRoute, label: "Zero-Trust Settings", icon: Settings },
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 76 : 256 }}
      transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
      className="hidden md:flex flex-col h-[calc(100vh-4rem)] sticky top-16 bg-white dark:bg-[#0A0E1A] border-r border-slate-200/90 dark:border-slate-800 p-3 select-none justify-between transition-colors shrink-0 z-20"
    >
      {/* Nav List */}
      <div className="space-y-1 overflow-y-auto no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeRoute === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onRouteChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative group",
                isActive
                  ? "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 shadow-2xs font-bold border border-sky-200/80 dark:border-sky-800/60"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white border border-transparent"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-transform group-hover:scale-110",
                  isActive ? "text-sky-600 dark:text-sky-400 stroke-[2.25]" : "text-slate-400 dark:text-slate-500"
                )}
              />

              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="truncate">{item.label}</span>
                  {item.shortcut && (
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                      {item.shortcut}
                    </span>
                  )}
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold font-mono bg-sky-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {isActive && (
                <motion.div
                  layoutId="sidebarActivePill"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-sky-500 rounded-r-full"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Collapse Toggle */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>CORE NOMINAL</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mx-auto"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
};
