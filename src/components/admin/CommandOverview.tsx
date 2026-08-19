"use client";

import React from "react";
import { Users, Shield, AlertTriangle, Activity, Lock, TrendingUp, Server, Zap } from "lucide-react";
import { AdminRole, ROLES } from "./roles";

interface OverviewProps {
  currentRole: AdminRole;
}

const STAT_CARDS = [
  { label: "Total Users",        value: "7",    sub: "4 active now",        icon: Users,         color: "#38BDF8", roles: ["ROOT_ADMIN","ANALYST"] },
  { label: "Active Sessions",    value: "5",    sub: "1 this session",       icon: Lock,          color: "#A78BFA", roles: ["ROOT_ADMIN"] },
  { label: "Threat Events (24h)",value: "14",   sub: "3 critical",           icon: AlertTriangle, color: "#F43F5E", roles: ["ROOT_ADMIN","ANALYST","SOC_OPS"] },
  { label: "Policy Violations",  value: "2",    sub: "Pending review",       icon: Shield,        color: "#F59E0B", roles: ["ROOT_ADMIN","ANALYST"] },
  { label: "Devices Monitored",  value: "12",   sub: "All nominal",          icon: Server,        color: "#34D399", roles: ["ROOT_ADMIN","DEV_MGR","SOC_OPS"] },
  { label: "Avg CPU Load",       value: "18%",  sub: "Last 30 min",          icon: Activity,      color: "#00C48C", roles: ["ROOT_ADMIN","SOC_OPS","DEV_MGR"] },
  { label: "Uptime",             value: "99.8%", sub: "30-day SLA",          icon: TrendingUp,    color: "#818CF8", roles: ["ROOT_ADMIN","ANALYST","SOC_OPS","DEV_MGR","VIEWER"] },
  { label: "eBPF Events",        value: "48.2k", sub: "ops/s avg",           icon: Zap,           color: "#FF7A00", roles: ["ROOT_ADMIN","ANALYST","SOC_OPS"] },
];

const RECENT_ACTIONS = [
  { time: "21:34", actor: "Sentinel Root", action: "Suspended user: j.osei@cs.internal", level: "WARN" },
  { time: "21:33", actor: "System",        action: "eBPF probe overflow — auto-reset",   level: "CRITICAL" },
  { time: "21:32", actor: "Marcus Webb",   action: "Alert acknowledged: SYN Flood",      level: "INFO" },
  { time: "21:31", actor: "Aria Singh",    action: "Deep scan initiated",                 level: "INFO" },
  { time: "21:29", actor: "System",        action: "TLS cert rotated on gateway:443",     level: "INFO" },
];

const LEVEL_STYLE: Record<string, string> = {
  INFO:     "text-slate-400",
  WARN:     "text-amber-400",
  CRITICAL: "text-rose-400",
};

export function CommandOverview({ currentRole }: OverviewProps) {
  const roleCfg = ROLES[currentRole];
  const visibleCards = STAT_CARDS.filter((c) => c.roles.includes(currentRole));

  return (
    <div className="space-y-6">
      {/* Role banner */}
      <div
        className="p-4 rounded-2xl border flex items-center gap-4"
        style={{ borderColor: roleCfg.color + "30", backgroundColor: roleCfg.color + "0A" }}
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-extrabold"
          style={{ backgroundColor: roleCfg.color + "22", border: `1px solid ${roleCfg.color}40`, color: roleCfg.color }}
        >
          {currentRole === "ROOT_ADMIN" ? "🛡️" :
           currentRole === "ANALYST"    ? "🔍" :
           currentRole === "SOC_OPS"    ? "📡" :
           currentRole === "DEV_MGR"    ? "🖥️" : "👁️"}
        </div>
        <div>
          <p className="text-sm font-extrabold text-white">
            Viewing as: <span style={{ color: roleCfg.color }}>{roleCfg.label}</span>
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{roleCfg.description}</p>
        </div>
        <div className="ml-auto hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-500">
          <span>{roleCfg.permissions.length} permissions</span>
        </div>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {visibleCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="p-4 rounded-2xl bg-[#13161E] border border-white/[0.07] hover:border-white/[0.12] transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.color + "20" }}>
                  <Icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: card.color }} />
              </div>
              <p className="text-2xl font-extrabold text-white tabular-nums">{card.value}</p>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{card.label}</p>
              <p className="text-[10px] text-slate-600 mt-0.5">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Recent activity + role info side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Admin Actions */}
        <div className="lg:col-span-2 p-4 rounded-2xl bg-[#13161E] border border-white/[0.07]">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-mono">Recent Admin Actions</h3>
          <div className="space-y-2">
            {RECENT_ACTIONS.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-white/[0.04] last:border-0">
                <span className="text-[10px] font-mono text-slate-500 shrink-0 pt-0.5">{a.time}</span>
                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] font-bold mr-2 ${LEVEL_STYLE[a.level]}`}>[{a.level}]</span>
                  <span className="text-xs text-slate-300">{a.action}</span>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">{a.actor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Role access summary */}
        <div className="p-4 rounded-2xl bg-[#13161E] border border-white/[0.07]">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-mono">Your Access</h3>
          <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
            {roleCfg.permissions.length === 0 ? (
              <p className="text-xs text-slate-500">Read-only access — no permitted actions.</p>
            ) : (
              roleCfg.permissions.map((perm) => (
                <div key={perm} className="flex items-center gap-2 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-mono text-slate-300">{perm}</span>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.05]">
            <p className="text-[10px] text-slate-600 font-mono">DENIED TOOLS</p>
            <div className="space-y-1 mt-1.5">
              {["user_manage","role_edit","tool_toggle","session_manage","policy_edit"]
                .filter((p) => !roleCfg.permissions.includes(p))
                .slice(0, 4)
                .map((p) => (
                  <div key={p} className="flex items-center gap-2 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-800 shrink-0" />
                    <span className="font-mono text-slate-600 line-through">{p}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
