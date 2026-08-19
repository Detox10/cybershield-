"use client";

import React, { useState } from "react";
import { Search, MoreHorizontal, UserCheck, UserX, Shield, Edit2 } from "lucide-react";
import { AdminRole, ROLES } from "./roles";

interface User {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
  lastSeen: string;
  loginCount: number;
  avatar: string;
}

const MOCK_USERS: User[] = [
  { id: "1", name: "Sentinel Root Admin", email: "root@cybershield.os", role: "ROOT_ADMIN", status: "ACTIVE", lastSeen: "Just now", loginCount: 482, avatar: "SR" },
  { id: "2", name: "Aria Singh", email: "aria.singh@cs.internal", role: "ANALYST", status: "ACTIVE", lastSeen: "2 min ago", loginCount: 214, avatar: "AS" },
  { id: "3", name: "Marcus Webb", email: "m.webb@cs.internal", role: "SOC_OPS", status: "ACTIVE", lastSeen: "14 min ago", loginCount: 97, avatar: "MW" },
  { id: "4", name: "Priya Nair", email: "p.nair@cs.internal", role: "DEV_MGR", status: "ACTIVE", lastSeen: "1h ago", loginCount: 55, avatar: "PN" },
  { id: "5", name: "James Osei", email: "j.osei@cs.internal", role: "VIEWER", status: "SUSPENDED", lastSeen: "3d ago", loginCount: 12, avatar: "JO" },
  { id: "6", name: "Lena Fischer", email: "l.fischer@cs.internal", role: "ANALYST", status: "PENDING", lastSeen: "Never", loginCount: 0, avatar: "LF" },
  { id: "7", name: "Dev Console Bot", email: "bot@cs.internal", role: "SOC_OPS", status: "ACTIVE", lastSeen: "5s ago", loginCount: 9841, avatar: "DB" },
];

export function UserManagementPanel({ isReadOnly }: { isReadOnly: boolean }) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [filter, setFilter] = useState<"ALL" | AdminRole>("ALL");

  const filtered = users.filter((u) => {
    const matchRole = filter === "ALL" || u.role === filter;
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const toggleStatus = (id: string) => {
    if (isReadOnly) return;
    setUsers((prev) => prev.map((u) =>
      u.id === id ? { ...u, status: u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" } : u
    ));
  };

  const STATUS_STYLE: Record<string, string> = {
    ACTIVE:    "bg-emerald-950/60 text-emerald-400 border-emerald-800/40",
    SUSPENDED: "bg-rose-950/60 text-rose-400 border-rose-800/40",
    PENDING:   "bg-amber-950/60 text-amber-400 border-amber-800/40",
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">User Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">{users.length} users registered • {users.filter(u => u.status === "ACTIVE").length} active</p>
        </div>
        {!isReadOnly && (
          <button className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.10] text-white text-xs font-bold hover:bg-white/[0.1] transition-colors">
            + Invite User
          </button>
        )}
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-9 pr-4 py-2 bg-[#13161E] border border-white/[0.08] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-3 py-2 bg-[#13161E] border border-white/[0.08] rounded-xl text-xs text-slate-300 focus:outline-none cursor-pointer"
        >
          <option value="ALL">All Roles</option>
          {(Object.keys(ROLES) as AdminRole[]).map((r) => (
            <option key={r} value={r}>{ROLES[r].label}</option>
          ))}
        </select>
      </div>

      {/* User Table */}
      <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[#13161E] border-b border-white/[0.06]">
              <th className="text-left px-4 py-3 text-slate-400 font-semibold">User</th>
              <th className="text-left px-4 py-3 text-slate-400 font-semibold">Role</th>
              <th className="text-left px-4 py-3 text-slate-400 font-semibold">Status</th>
              <th className="text-left px-4 py-3 text-slate-400 font-semibold">Last Seen</th>
              <th className="text-left px-4 py-3 text-slate-400 font-semibold">Logins</th>
              {!isReadOnly && <th className="text-left px-4 py-3 text-slate-400 font-semibold">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, i) => {
              const roleCfg = ROLES[user.role];
              return (
                <tr
                  key={user.id}
                  className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.01]"}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-extrabold text-white shrink-0"
                        style={{ background: `linear-gradient(135deg, ${roleCfg.color}88, ${roleCfg.color}44)`, border: `1px solid ${roleCfg.color}40` }}
                      >
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{user.name}</p>
                        <p className="text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold border"
                      style={{ color: roleCfg.color, borderColor: roleCfg.color + "40", backgroundColor: roleCfg.color + "14" }}
                    >
                      {roleCfg.badge}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${STATUS_STYLE[user.status]}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{user.lastSeen}</td>
                  <td className="px-4 py-3 text-slate-400 font-mono">{user.loginCount.toLocaleString()}</td>
                  {!isReadOnly && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleStatus(user.id)}
                          className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-400 hover:text-white transition-colors"
                          title={user.status === "ACTIVE" ? "Suspend user" : "Activate user"}
                        >
                          {user.status === "ACTIVE" ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-400 hover:text-white transition-colors" title="Edit role">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-400 hover:text-white transition-colors">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
