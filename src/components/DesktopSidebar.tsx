"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  FileSearch,
  Bot,
  AlertTriangle,
  Activity,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { NavTab, ShieldCoreState } from "@/types/cybershield";
import GeometricSecurityGauge from "./GeometricSecurityGauge";

interface DesktopSidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenSpotlight: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  coreState: ShieldCoreState;
  unreadAlertsCount?: number;
}

export default function DesktopSidebar({
  activeTab,
  onTabChange,
  onOpenSpotlight,
  isDark,
  onToggleTheme,
  coreState,
  unreadAlertsCount = 2,
}: DesktopSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const NAV_ITEMS = [
    { id: "dashboard" as NavTab, label: "Command Center", icon: Shield },
    { id: "scan" as NavTab, label: "Deep File Scan", icon: FileSearch },
    { id: "assistant" as NavTab, label: "AI Workspace", icon: Bot },
    { id: "threats" as NavTab, label: "Threat Intel", icon: AlertTriangle },
    { id: "diagnostics" as NavTab, label: "Digital Twin", icon: Activity },
    { id: "audit" as NavTab, label: "Alerts & Audit", icon: Bell, badge: 2 },
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 76 : 240 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="hidden md:flex flex-col h-screen sticky top-0 bg-[#FBFBFA] dark:bg-[#0B0F19] border-r border-[#EAEAE8] dark:border-slate-800/80 select-none justify-between p-3.5 transition-colors shrink-0 z-30"
    >
      {/* Top Section */}
      <div className="space-y-4">
        {/* Logo & Header */}
        <div className="flex items-center justify-between px-1.5 pt-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 shrink-0 flex items-center justify-center">
              <GeometricSecurityGauge size="mini" score={96} state="SECURE" showScore={false} />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white truncate">
                    CyberShield
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    OS v2.4
                  </span>
                </div>
                <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 truncate">
                  Enterprise Sentinel
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Search Command Input */}
        <button
          onClick={onOpenSpotlight}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-slate-300 dark:hover:border-slate-700 transition-all text-xs shadow-2xs group"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Search className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
            {!isCollapsed && <span className="truncate text-[11px]">Search commands...</span>}
          </div>
          {!isCollapsed && (
            <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-400">
              ⌘ K
            </kbd>
          )}
        </button>

        {/* Main Navigation Links */}
        <nav className="space-y-1 pt-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeTab === item.id ||
              (item.id === "assistant" && activeTab === "assistant") ||
              (item.id === "audit" && activeTab === "audit");

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative group ${
                  isActive
                    ? "bg-[#111622] dark:bg-white text-white dark:text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                    isActive
                      ? "text-white dark:text-slate-900 stroke-[2.2]"
                      : "text-slate-500 dark:text-slate-400 stroke-[1.8]"
                  }`}
                />

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="w-4 h-4 rounded-full text-[10px] font-bold bg-rose-500 text-white flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Section */}
      <div className="space-y-3 pt-3 border-t border-slate-200/90 dark:border-slate-800/80">
        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            {!isCollapsed && <span className="font-semibold text-[11px]">Dark Mode</span>}
          </div>
          {!isCollapsed && (
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 dark:text-slate-500">
              {isDark ? "DARK" : "LIGHT"}
            </span>
          )}
        </button>

        {/* Admin Console Link */}
        <a
          href="/admin"
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 transition-colors"
        >
          <ShieldCheck className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Admin Console</span>}
          {!isCollapsed && (
            <span className="ml-auto text-[9px] font-mono bg-rose-500 text-white px-1.5 py-0.5 rounded">ROOT</span>
          )}
        </a>

        {/* User Account Tile */}
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl bg-white dark:bg-[#111622] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="w-7 h-7 rounded-lg bg-[#111622] dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs flex items-center justify-center shrink-0">
            H
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight">
                Himanshu
              </p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Protected Tier</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
