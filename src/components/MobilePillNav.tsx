"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  FileSearch,
  Bot,
  AlertTriangle,
  Activity,
  Bell,
  Search,
  Smartphone,
  Mail,
} from "lucide-react";
import { NavTab } from "@/types/cybershield";

interface MobilePillNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenSpotlight: () => void;
  unreadCount?: number;
}

export default function MobilePillNav({
  activeTab,
  onTabChange,
  onOpenSpotlight,
  unreadCount = 2,
}: MobilePillNavProps) {
  const tabs = [
    { id: "dashboard" as NavTab, label: "Shield", icon: Shield },
    { id: "email" as NavTab, label: "Email", icon: Mail },
    { id: "studio" as NavTab, label: "Studio", icon: Smartphone },
    { id: "scan" as NavTab, label: "Scan", icon: FileSearch },
    { id: "assistant" as NavTab, label: "AI", icon: Bot },
    { id: "threats" as NavTab, label: "Threats", icon: AlertTriangle },
    { id: "diagnostics" as NavTab, label: "Twin", icon: Activity },
    {
      id: "notifications" as NavTab,
      label: "Alerts",
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-5 inset-x-0 z-40 flex items-center justify-center px-4 pointer-events-none">
      <nav className="glass-pill pointer-events-auto flex items-center justify-around gap-1 px-3 py-2 rounded-full border border-slate-200/90 dark:border-white/10 shadow-glass3 max-w-md w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-full text-xs transition-all ${
                isActive
                  ? "text-sky-600 dark:text-cyan-400 font-semibold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110" : ""}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>

              {isActive && (
                <motion.div
                  layoutId="activeMobilePill"
                  className="absolute inset-0 bg-sky-500/10 dark:bg-cyan-500/20 rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}

        {/* Spotlight Mobile Trigger Button */}
        <button
          onClick={onOpenSpotlight}
          className="flex flex-col items-center justify-center py-1.5 px-2.5 rounded-full text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-cyan-400 transition-colors"
          title="Search"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Find</span>
        </button>
      </nav>
    </div>
  );
}
