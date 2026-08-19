"use client";

import React, { useState } from "react";
import {
  Search,
  HelpCircle,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  ChevronsUpDown,
  LayoutGrid,
  Shield,
  ExternalLink,
  Settings,
  Sparkles,
} from "lucide-react";

export interface AppHeaderProps {
  onOpenSpotlight: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  unreadCount?: number;
  onOpenNotifications?: () => void;
  postureScore?: number;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenSpotlight,
  isDark,
  onToggleTheme,
  unreadCount = 2,
  onOpenNotifications,
  postureScore = 94,
}) => {
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);

  return (
    <header className="h-14 w-full px-4 sm:px-6 border-b border-[#E8E8E6] dark:border-slate-800 bg-[#FAFAFA] dark:bg-[#0B0F19] flex items-center justify-between sticky top-0 z-40 select-none transition-colors">
      {/* Left: Workspace / Tenant Switcher */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-900 dark:text-white transition-colors group"
          >
            <div className="w-5 h-5 rounded-md bg-[#00A389] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Shield className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <span className="text-xs font-bold tracking-tight">CyberShield.io</span>
            <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 ml-0.5" />
          </button>

          {/* Workspace Dropdown */}
          {workspaceMenuOpen && (
            <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-[#111622] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-50 text-xs">
              <div className="px-2 py-1.5 font-bold text-[10px] uppercase text-slate-400">
                Workspaces & Fleets
              </div>
              <button
                onClick={() => setWorkspaceMenuOpen(false)}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 font-bold"
              >
                <span>Production Sentinel</span>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              </button>
              <button
                onClick={() => setWorkspaceMenuOpen(false)}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <span>Staging APAC Edge</span>
              </button>
            </div>
          )}
        </div>

        {/* Global Security Posture Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/60 text-[11px] font-semibold text-teal-700 dark:text-teal-300 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
          <span>ZERO-TRUST POSTURE: {postureScore}/100</span>
        </div>
      </div>

      {/* Center: Universal Search Input (Exact Customer.io style) */}
      <div className="flex-1 max-w-md mx-4 hidden sm:block">
        <button
          onClick={onOpenSpotlight}
          className="w-full h-8 px-3 rounded-lg bg-white dark:bg-[#111622] border border-[#E0E0DC] dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-400 flex items-center justify-between text-xs text-slate-400 dark:text-slate-400 transition-all shadow-xs"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search campaigns, threats, nodes...</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-500 dark:text-slate-400 font-medium">
            ⌘ K
          </kbd>
        </button>
      </div>

      {/* Right: Actions, Help, Notifications, Theme, Settings */}
      <div className="flex items-center gap-2 sm:gap-3 text-slate-500 dark:text-slate-400">
        <button
          onClick={() => alert("CyberShield Knowledge Base & SOC Runbooks opened.")}
          className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Need help?</span>
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors relative"
          title="Alerts & Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-teal-500 ring-2 ring-[#FAFAFA] dark:ring-[#0B0F19]" />
          )}
        </button>

        {/* Theme Toggle (Light Primary default) */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-7 h-7 rounded-full bg-[#00A389] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            H
          </div>
        </div>
      </div>
    </header>
  );
};
export default AppHeader;
