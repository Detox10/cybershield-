"use client";

import React, { useState } from "react";
import { ToggleLeft, ToggleRight, AlertTriangle } from "lucide-react";
import { AdminRole, ROLES, ALL_TOOLS } from "./roles";

export function ToolAccessControl() {
  // Per-role tool toggles — editable by Root Admin only
  const [toolMatrix, setToolMatrix] = useState<Record<AdminRole, Record<string, boolean>>>(() => {
    const matrix = {} as Record<AdminRole, Record<string, boolean>>;
    (Object.keys(ROLES) as AdminRole[]).forEach((role) => {
      matrix[role] = {};
      ALL_TOOLS.forEach((tool) => {
        matrix[role][tool.id] = ROLES[role].permissions.includes(tool.id);
      });
    });
    return matrix;
  });

  const [saved, setSaved] = useState(false);

  const toggle = (role: AdminRole, toolId: string) => {
    if (role === "ROOT_ADMIN") return; // ROOT_ADMIN always has everything
    setToolMatrix((prev) => ({
      ...prev,
      [role]: { ...prev[role], [toolId]: !prev[role][toolId] },
    }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const roles = (Object.keys(ROLES) as AdminRole[]).filter((r) => r !== "ROOT_ADMIN");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Tool Access Control</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Toggle which tools each role can access. Root Admin always has full access.
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            saved
              ? "bg-emerald-950/60 border border-emerald-800/40 text-emerald-400"
              : "bg-white/[0.06] border border-white/[0.10] text-white hover:bg-white/[0.1]"
          }`}
        >
          {saved ? "✓ Saved" : "Save Changes"}
        </button>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-950/20 border border-amber-800/30">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-300">
          Changes take effect on next login. Active sessions are not immediately affected.
        </p>
      </div>

      <div className="space-y-4">
        {ALL_TOOLS.map((tool) => (
          <div key={tool.id} className="p-4 rounded-2xl bg-[#13161E] border border-white/[0.07]">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{tool.icon}</span>
              <span className="text-sm font-bold text-white">{tool.label}</span>
              <code className="text-[10px] font-mono text-slate-500 ml-1">{tool.id}</code>
            </div>

            <div className="flex flex-wrap gap-3">
              {/* ROOT_ADMIN — always on, locked */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-950/20 border border-rose-800/20">
                <ToggleRight className="w-4 h-4 text-rose-400" />
                <span className="text-[11px] font-mono font-bold text-rose-400">ROOT_ADMIN</span>
                <span className="text-[10px] text-slate-600">(locked)</span>
              </div>

              {roles.map((role) => {
                const cfg = ROLES[role];
                const enabled = toolMatrix[role][tool.id];
                return (
                  <button
                    key={role}
                    onClick={() => toggle(role, tool.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-[11px] font-mono font-bold ${
                      enabled
                        ? "border-opacity-40 hover:opacity-80"
                        : "bg-white/[0.02] border-white/[0.06] text-slate-500 hover:border-white/[0.14] hover:text-slate-400"
                    }`}
                    style={enabled ? {
                      color: cfg.color,
                      borderColor: cfg.color + "40",
                      backgroundColor: cfg.color + "14",
                    } : {}}
                  >
                    {enabled
                      ? <ToggleRight className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                      : <ToggleLeft className="w-3.5 h-3.5 text-slate-500" />
                    }
                    {cfg.badge}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
