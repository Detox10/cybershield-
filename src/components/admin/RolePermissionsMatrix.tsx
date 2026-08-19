"use client";

import React, { useState } from "react";
import { Check, X, Lock } from "lucide-react";
import { AdminRole, ROLES, ALL_TOOLS } from "./roles";

export function RolePermissionsMatrix({ isEditable }: { isEditable: boolean }) {
  const [perms, setPerms] = useState<Record<AdminRole, string[]>>(() => {
    const initial = {} as Record<AdminRole, string[]>;
    (Object.keys(ROLES) as AdminRole[]).forEach((r) => {
      initial[r] = [...ROLES[r].permissions];
    });
    return initial;
  });

  const toggle = (role: AdminRole, toolId: string) => {
    if (!isEditable) return;
    // ROOT_ADMIN always has all permissions — not editable
    if (role === "ROOT_ADMIN") return;
    setPerms((prev) => {
      const has = prev[role].includes(toolId);
      return {
        ...prev,
        [role]: has ? prev[role].filter((p) => p !== toolId) : [...prev[role], toolId],
      };
    });
  };

  const roles = Object.keys(ROLES) as AdminRole[];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-white">Role Permissions Matrix</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {isEditable ? "Click cells to toggle permissions for non-root roles." : "Read-only view of current permissions."}
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.07] overflow-x-auto">
        <table className="w-full text-xs min-w-[640px]">
          <thead>
            <tr className="bg-[#13161E] border-b border-white/[0.06]">
              <th className="text-left px-4 py-3 text-slate-400 font-semibold w-44">Tool / Permission</th>
              {roles.map((role) => {
                const cfg = ROLES[role];
                return (
                  <th key={role} className="text-center px-3 py-3 font-semibold">
                    <span
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold border"
                      style={{ color: cfg.color, borderColor: cfg.color + "40", backgroundColor: cfg.color + "14" }}
                    >
                      {cfg.badge}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {ALL_TOOLS.map((tool, i) => (
              <tr
                key={tool.id}
                className={`border-b border-white/[0.04] ${i % 2 === 0 ? "" : "bg-white/[0.01]"}`}
              >
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2 text-slate-300 font-medium">
                    <span className="text-base">{tool.icon}</span>
                    {tool.label}
                  </div>
                </td>
                {roles.map((role) => {
                  const hasPerm = perms[role].includes(tool.id);
                  const isRootAdmin = role === "ROOT_ADMIN";
                  const clickable = isEditable && !isRootAdmin;

                  return (
                    <td key={role} className="text-center px-3 py-2.5">
                      <button
                        onClick={() => toggle(role, tool.id)}
                        disabled={!clickable}
                        className={`w-7 h-7 rounded-lg mx-auto flex items-center justify-center transition-all ${
                          hasPerm
                            ? isRootAdmin
                              ? "bg-rose-950/60 border border-rose-800/40 text-rose-400"
                              : "bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 hover:bg-emerald-900/40"
                            : clickable
                              ? "bg-white/[0.03] border border-white/[0.06] text-slate-600 hover:border-white/20 hover:text-slate-400"
                              : "bg-white/[0.03] border border-white/[0.04] text-slate-700"
                        }`}
                      >
                        {hasPerm ? (
                          isRootAdmin ? <Lock className="w-3 h-3" /> : <Check className="w-3 h-3" />
                        ) : (
                          <X className="w-3 h-3" />
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role cards summary */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {roles.map((role) => {
          const cfg = ROLES[role];
          const count = perms[role].length;
          return (
            <div
              key={role}
              className="p-3 rounded-2xl border"
              style={{ borderColor: cfg.color + "30", backgroundColor: cfg.color + "08" }}
            >
              <p className="text-[10px] font-mono font-bold" style={{ color: cfg.color }}>{cfg.badge}</p>
              <p className="text-xl font-extrabold text-white mt-1">{count}</p>
              <p className="text-[10px] text-slate-500">permissions</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
