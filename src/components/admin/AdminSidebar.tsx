"use client";

import React from "react";
import {
  Shield, Users, Lock, FileText, Activity, Settings,
  Monitor, LogOut, ChevronRight, ServerCrash,
} from "lucide-react";
import { AdminRole, ROLES } from "./roles";

interface AdminSidebarProps {
  activePanel: string;
  onPanelChange: (p: string) => void;
  currentRole: AdminRole;
}

const ALL_PANELS = [
  { id: "overview",    label: "Command Overview",     icon: Monitor,   roles: ["ROOT_ADMIN","ANALYST","SOC_OPS","DEV_MGR","VIEWER"] },
  { id: "backend",     label: "Database & Backend APIs", icon: ServerCrash, roles: ["ROOT_ADMIN"] },
  { id: "users",       label: "User Management",      icon: Users,     roles: ["ROOT_ADMIN"] },
  { id: "roles",       label: "Role Permissions",     icon: Shield,    roles: ["ROOT_ADMIN","ANALYST"] },
  { id: "tools",       label: "Tool Access Control",  icon: Settings,  roles: ["ROOT_ADMIN"] },
  { id: "telemetry",   label: "Live Telemetry",       icon: Activity,  roles: ["ROOT_ADMIN","SOC_OPS","DEV_MGR"] },
  { id: "audit",       label: "Admin Audit Trail",    icon: FileText,  roles: ["ROOT_ADMIN","ANALYST","SOC_OPS"] },
  { id: "sessions",    label: "Session Manager",      icon: Lock,      roles: ["ROOT_ADMIN"] },
];

export function AdminSidebar({ activePanel, onPanelChange, currentRole }: AdminSidebarProps) {
  const roleCfg = ROLES[currentRole];
  const visible = ALL_PANELS.filter((p) => p.roles.includes(currentRole));

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 bg-[#0C0F16] border-r border-white/[0.07] flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-white/[0.07]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-white tracking-tight">CyberShield</p>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Admin Console</p>
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div className="px-4 py-3 border-b border-white/[0.05]">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold"
          style={{ borderColor: roleCfg.color + "40", backgroundColor: roleCfg.color + "14", color: roleCfg.color }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: roleCfg.color }} />
          {roleCfg.label}
          <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {visible.map((item) => {
          const Icon = item.icon;
          const isActive = activePanel === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onPanelChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                isActive
                  ? "bg-white/[0.08] text-white border border-white/[0.12]"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
              {item.label}
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/[0.07] space-y-2">
        <a
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Back to Dashboard
        </a>
        <p className="text-[10px] font-mono text-slate-600 px-3">Admin Console v2.4</p>
      </div>
    </aside>
  );
}
