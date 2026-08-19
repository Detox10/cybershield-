"use client";

import React, { useState } from "react";
import { LogOut, Monitor, Smartphone, Globe, AlertCircle } from "lucide-react";

interface Session {
  id: string;
  user: string;
  role: string;
  roleColor: string;
  device: "desktop" | "mobile" | "browser";
  location: string;
  ip: string;
  since: string;
  current: boolean;
}

const MOCK_SESSIONS: Session[] = [
  { id: "ses_1a2b", user: "Sentinel Root Admin", role: "ROOT_ADMIN",   roleColor: "#F43F5E", device: "desktop", location: "Lahore, PK",     ip: "192.168.1.100", since: "21:04:12", current: true  },
  { id: "ses_3c4d", user: "Aria Singh",          role: "ANALYST",      roleColor: "#F59E0B", device: "browser", location: "Mumbai, IN",     ip: "192.168.1.104", since: "20:48:55", current: false },
  { id: "ses_5e6f", user: "Marcus Webb",         role: "SOC_OPS",      roleColor: "#38BDF8", device: "desktop", location: "London, UK",     ip: "192.168.1.112", since: "19:30:02", current: false },
  { id: "ses_7g8h", user: "Dev Console Bot",     role: "SOC_OPS",      roleColor: "#38BDF8", device: "browser", location: "localhost",       ip: "127.0.0.1",     since: "00:00:01", current: false },
  { id: "ses_9i0j", user: "Priya Nair",          role: "DEV_MGR",      roleColor: "#34D399", device: "mobile",  location: "Bengaluru, IN",  ip: "10.0.0.22",     since: "21:01:44", current: false },
];

const DEVICE_ICON = {
  desktop: Monitor,
  mobile:  Smartphone,
  browser: Globe,
};

export function SessionManager({ isReadOnly }: { isReadOnly: boolean }) {
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
  const [terminating, setTerminating] = useState<string | null>(null);

  const terminate = async (id: string) => {
    if (isReadOnly) return;
    setTerminating(id);
    await new Promise((r) => setTimeout(r, 800));
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setTerminating(null);
  };

  const terminateAll = async () => {
    if (isReadOnly) return;
    const others = sessions.filter((s) => !s.current).map((s) => s.id);
    for (const id of others) await terminate(id);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Session Manager</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {sessions.length} active sessions • {sessions.filter((s) => !s.current).length} remote
          </p>
        </div>
        {!isReadOnly && sessions.filter((s) => !s.current).length > 0 && (
          <button
            onClick={terminateAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/60 border border-rose-800/40 text-rose-400 text-xs font-bold hover:bg-rose-900/60 transition-colors"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Force-Logout All Others
          </button>
        )}
      </div>

      <div className="space-y-3">
        {sessions.map((session) => {
          const DeviceIcon = DEVICE_ICON[session.device];
          const isTerminating = terminating === session.id;

          return (
            <div
              key={session.id}
              className={`p-4 rounded-2xl border transition-all ${
                session.current
                  ? "bg-emerald-950/20 border-emerald-800/30"
                  : "bg-[#13161E] border-white/[0.07] hover:border-white/[0.12]"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                {/* Left: user info */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-extrabold text-white shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${session.roleColor}88, ${session.roleColor}33)`,
                      border: `1px solid ${session.roleColor}40`,
                    }}
                  >
                    {session.user.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white">{session.user}</p>
                      {session.current && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800/40 text-emerald-400 font-bold">THIS SESSION</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border"
                        style={{ color: session.roleColor, borderColor: session.roleColor + "40", backgroundColor: session.roleColor + "14" }}
                      >
                        {session.role}
                      </span>
                      <span className="text-[10px] text-slate-500">since {session.since}</span>
                    </div>
                  </div>
                </div>

                {/* Right: device + location + action */}
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <div className="flex items-center gap-1.5 justify-end text-[11px] text-slate-400">
                      <DeviceIcon className="w-3.5 h-3.5" />
                      {session.location}
                    </div>
                    <p className="text-[10px] font-mono text-slate-600 mt-0.5">{session.ip}</p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-slate-600 hidden md:block">{session.id}</span>
                    {!session.current && !isReadOnly && (
                      <button
                        onClick={() => terminate(session.id)}
                        disabled={!!isTerminating}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-800/30 text-rose-400 text-[11px] font-bold hover:bg-rose-900/50 transition-all disabled:opacity-50"
                      >
                        {isTerminating ? (
                          <span className="w-3 h-3 border border-rose-400/40 border-t-rose-400 rounded-full animate-spin" />
                        ) : (
                          <LogOut className="w-3 h-3" />
                        )}
                        {isTerminating ? "..." : "Terminate"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sessions.length === 0 && (
        <div className="text-center py-12 text-slate-600">
          <LogOut className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No active sessions</p>
        </div>
      )}
    </div>
  );
}
