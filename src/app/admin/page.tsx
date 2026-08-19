"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ShieldCheck, ShieldAlert } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { CommandOverview }      from "@/components/admin/CommandOverview";
import { UserManagementPanel }  from "@/components/admin/UserManagementPanel";
import { RolePermissionsMatrix } from "@/components/admin/RolePermissionsMatrix";
import { ToolAccessControl }    from "@/components/admin/ToolAccessControl";
import { LiveTelemetryMini }    from "@/components/admin/LiveTelemetryMini";
import { AdminAuditLog }        from "@/components/admin/AdminAuditLog";
import { SessionManager }       from "@/components/admin/SessionManager";
import { BackendConfigFlow }    from "@/components/flows/BackendConfigFlow";
import { AdminRole, ROLES }     from "@/components/admin/roles";

const PANEL_LABELS: Record<string, string> = {
  overview:  "Command Overview",
  backend:   "Database & Backend APIs",
  users:     "User Management",
  roles:     "Role Permissions",
  tools:     "Tool Access Control",
  telemetry: "Live Telemetry",
  audit:     "Admin Audit Trail",
  sessions:  "Session Manager",
};

// Which panels each role can see
const PANEL_ACCESS: Record<AdminRole, string[]> = {
  ROOT_ADMIN: ["overview","backend","users","roles","tools","telemetry","audit","sessions"],
  ANALYST:    ["overview","roles","telemetry","audit"],
  SOC_OPS:    ["overview","telemetry","audit"],
  DEV_MGR:    ["overview","telemetry"],
  VIEWER:     ["overview"],
};

export default function AdminPage() {
  const [currentRole, setCurrentRole]   = useState<AdminRole>("ROOT_ADMIN");
  const [activePanel, setActivePanel]   = useState("overview");
  const [roleDropOpen, setRoleDropOpen] = useState(false);

  const roleCfg = ROLES[currentRole];

  // When role changes, snap to a panel the new role can see
  const handleRoleChange = (role: AdminRole) => {
    setCurrentRole(role);
    setRoleDropOpen(false);
    if (!PANEL_ACCESS[role].includes(activePanel)) {
      setActivePanel("overview");
    }
  };

  const handlePanelChange = (panel: string) => {
    if (!PANEL_ACCESS[currentRole].includes(panel)) return;
    setActivePanel(panel);
  };

  const isReadOnly = currentRole === "VIEWER";
  const isRootAdmin = currentRole === "ROOT_ADMIN";

  const renderPanel = () => {
    switch (activePanel) {
      case "overview":  return <CommandOverview currentRole={currentRole} />;
      case "backend":   return <BackendConfigFlow />;
      case "users":     return <UserManagementPanel isReadOnly={!isRootAdmin} />;
      case "roles":     return <RolePermissionsMatrix isEditable={isRootAdmin} />;
      case "tools":     return <ToolAccessControl />;
      case "telemetry": return <LiveTelemetryMini />;
      case "audit":     return <AdminAuditLog />;
      case "sessions":  return <SessionManager isReadOnly={!isRootAdmin} />;
      default:          return <CommandOverview currentRole={currentRole} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#080A0F] font-sans">
      {/* Sidebar */}
      <AdminSidebar
        activePanel={activePanel}
        onPanelChange={handlePanelChange}
        currentRole={currentRole}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="shrink-0 h-14 flex items-center justify-between px-6 border-b border-white/[0.07] bg-[#0C0F16]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {isRootAdmin
                ? <ShieldCheck className="w-4 h-4 text-rose-400" />
                : <ShieldAlert className="w-4 h-4 text-amber-400" />}
              <span className="text-sm font-bold text-white">{PANEL_LABELS[activePanel]}</span>
            </div>
            <span className="text-slate-600">•</span>
            <nav className="flex items-center gap-1 text-xs text-slate-500">
              <span>Admin</span>
              <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
              <span className="text-slate-300">{PANEL_LABELS[activePanel]}</span>
            </nav>
          </div>

          {/* Role Switcher — for demo/dev purposes */}
          <div className="relative">
            <button
              onClick={() => setRoleDropOpen(!roleDropOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all hover:opacity-80"
              style={{
                color: roleCfg.color,
                borderColor: roleCfg.color + "40",
                backgroundColor: roleCfg.color + "14",
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: roleCfg.color }} />
              {roleCfg.label}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${roleDropOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {roleDropOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-52 bg-[#13161E] border border-white/[0.10] rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-2 border-b border-white/[0.06]">
                    <p className="text-[10px] font-mono text-slate-500 px-2 py-1 uppercase tracking-wider">Switch Role (Demo)</p>
                  </div>
                  <div className="p-2 space-y-0.5">
                    {(Object.keys(ROLES) as AdminRole[]).map((role) => {
                      const cfg = ROLES[role];
                      const isActive = role === currentRole;
                      return (
                        <button
                          key={role}
                          onClick={() => handleRoleChange(role)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
                            isActive ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white">{cfg.label}</p>
                            <p className="text-[10px] text-slate-500 truncate">{cfg.permissions.length} permissions</p>
                          </div>
                          {isActive && <span className="text-[10px] text-emerald-400 font-bold">ACTIVE</span>}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Panel Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Access-denied guard */}
          {!PANEL_ACCESS[currentRole].includes(activePanel) ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-950/40 border border-rose-800/30 flex items-center justify-center">
                <ShieldAlert className="w-8 h-8 text-rose-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Access Denied</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Your role <span className="font-bold" style={{ color: roleCfg.color }}>{roleCfg.label}</span> does not have permission to view this panel.
                </p>
              </div>
              <button
                onClick={() => setActivePanel("overview")}
                className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white text-sm font-semibold hover:bg-white/[0.1] transition-colors"
              >
                Go to Overview
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activePanel + currentRole}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                {renderPanel()}
              </motion.div>
            </AnimatePresence>
          )}
        </main>

        {/* Footer */}
        <footer className="shrink-0 px-6 py-2 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-slate-600">
          <span>CyberShield Admin Console v2.4 — Sentinel Defense OS</span>
          <span>Role: {currentRole} • Session secured via TLS 1.3</span>
        </footer>
      </div>
    </div>
  );
}
