// Shared role definitions used across admin components

export type AdminRole = "ROOT_ADMIN" | "ANALYST" | "SOC_OPS" | "DEV_MGR" | "VIEWER";

export interface RoleConfig {
  label: string;
  badge: string;
  color: string;
  description: string;
  permissions: string[];
}

export const ROLES: Record<AdminRole, RoleConfig> = {
  ROOT_ADMIN: {
    label: "Root Admin",
    badge: "ROOT_ADMIN",
    color: "#F43F5E",
    description: "Full system access — users, roles, policies, telemetry, and sessions.",
    permissions: ["user_manage","role_edit","tool_toggle","telemetry","audit_view","session_manage","policy_edit","scan","ai_assistant","threat_intel"],
  },
  ANALYST: {
    label: "Security Analyst",
    badge: "ANALYST",
    color: "#F59E0B",
    description: "Threat analysis, scan, AI assistant, and audit log access.",
    permissions: ["scan","ai_assistant","threat_intel","audit_view","role_view","telemetry"],
  },
  SOC_OPS: {
    label: "SOC Operator",
    badge: "SOC_OPS",
    color: "#38BDF8",
    description: "Live dashboard, alerts, and incident feed monitoring.",
    permissions: ["telemetry","audit_view"],
  },
  DEV_MGR: {
    label: "Device Manager",
    badge: "DEV_MGR",
    color: "#34D399",
    description: "Device diagnostics, hardware telemetry, and system health.",
    permissions: ["telemetry"],
  },
  VIEWER: {
    label: "Read-Only Viewer",
    badge: "VIEWER",
    color: "#94A3B8",
    description: "Dashboard view-only access with no action capability.",
    permissions: [],
  },
};

export const ALL_TOOLS = [
  { id: "user_manage",     label: "User Management",       icon: "👥" },
  { id: "role_edit",       label: "Role Editor",           icon: "🛡️" },
  { id: "role_view",       label: "Role View",             icon: "👁️" },
  { id: "tool_toggle",     label: "Tool Access Control",   icon: "⚙️" },
  { id: "telemetry",       label: "Live Telemetry",        icon: "📡" },
  { id: "audit_view",      label: "Audit Trail",           icon: "📋" },
  { id: "session_manage",  label: "Session Manager",       icon: "🔐" },
  { id: "policy_edit",     label: "Security Policies",     icon: "📜" },
  { id: "scan",            label: "Deep File Scan",        icon: "🔍" },
  { id: "ai_assistant",    label: "AI Assistant",          icon: "🤖" },
  { id: "threat_intel",    label: "Threat Intelligence",   icon: "⚠️" },
];
