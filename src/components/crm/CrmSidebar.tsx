"use client";

import React from "react";
import Link from "next/link";
import {
  Shield,
  Radar,
  Bug,
  Activity,
  Bot,
  AlertOctagon,
  Lock,
  Laptop,
  FileText,
  Sliders,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Sparkles,
  User,
  Terminal,
  ServerCrash,
  Download,
  Share2,
} from "lucide-react";
import { UserSession } from "@/components/auth/AuthModal";
import DownloadShareModal from "@/components/modals/DownloadShareModal";

interface CrmSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userSession: UserSession | null;
  onLockConsole: () => void;
}

export const CrmSidebar: React.FC<CrmSidebarProps> = ({
  activeTab,
  setActiveTab,
  userSession,
  onLockConsole,
}) => {
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = React.useState(false);

  const activeClass = {
    backgroundColor: "var(--cs-bg-hover)",
    border: "1px solid var(--cs-border-strong)",
    color: "var(--cs-text-primary)",
    fontWeight: 600,
  } as React.CSSProperties;

  const inactiveClass = {
    color: "var(--cs-text-secondary)",
    border: "1px solid transparent",
  } as React.CSSProperties;

  return (
    <aside
      className="w-64 border-r flex flex-col justify-between py-6 px-4 select-none shrink-0 h-full backdrop-blur-2xl"
      style={{ backgroundColor: "var(--cs-bg-sidebar)", borderColor: "var(--cs-border)" }}
    >
      {/* Top Section */}
      <div className="space-y-6">
        {/* Brand Logo Emblem */}
        <div
          data-hud-title="CyberShield Kernel Core"
          data-hud-info="Autonomous Ring-0 Defense OS running deterministic eBPF heuristics and zero-trust policy enforcement."
          className="px-2 flex items-center gap-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF7A00] via-[#FF4500] to-[#991B1B] p-0.5 shadow-[0_0_20px_rgba(255,106,0,0.4)] flex items-center justify-center">
            <div className="w-full h-full rounded-[14px] flex items-center justify-center" style={{ backgroundColor: "var(--cs-bg-card)" }}>
              {/* Interlocking 4-petal geometric loop */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FF7A00"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="8" cy="8" r="4" />
                <circle cx="16" cy="8" r="4" />
                <circle cx="8" cy="8" r="4" />
                <circle cx="16" cy="16" r="4" />
              </svg>
            </div>
          </div>
          <div>
            <div
              className="text-sm font-extrabold tracking-wide flex items-center gap-1.5"
              style={{ color: "var(--cs-text-primary)" }}
            >
              <span>CYBERSHIELD</span>
            </div>
            <div className="text-[10px] font-mono" style={{ color: "var(--cs-text-muted)" }}>
              SENTINEL DEFENSE OS
            </div>
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="space-y-5 text-xs">
          {/* CORE SUITE */}
          <div className="space-y-1">
            <span
              className="px-3 text-[10px] font-mono font-bold tracking-wider uppercase"
              style={{ color: "var(--cs-text-muted)" }}
            >
              CORE SUITE
            </span>

            <button
              onClick={() => setActiveTab("dashboard")}
              data-hud-title="Threat Radar"
              data-hud-info="Primary real-time telemetry HUD displaying monthly attack frequencies, live packet streams, and active incident streams."
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
              style={activeTab === "dashboard" ? activeClass : inactiveClass}
            >
              <Radar className="w-4 h-4" style={{ color: "var(--cs-accent)" }} />
              <span className="flex-1 text-left">Threat Radar</span>
            </button>

            <button
              onClick={() => setActiveTab("scanner")}
              data-hud-title="Malware Hunter"
              data-hud-info="File artifact uploader computing cryptographic SHA-256 hashes, byte Shannon entropy, and 72+ AV engine verdicts via VirusTotal."
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
              style={activeTab === "scanner" ? activeClass : inactiveClass}
            >
              <Bug className="w-4 h-4" style={{ color: "var(--cs-text-secondary)" }} />
              <span className="flex-1 text-left">Malware Scanner</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 font-bold">
                LIVE
              </span>
            </button>

            <button
              onClick={() => setActiveTab("diagnostics")}
              data-hud-title="Live Telemetry & Spikes"
              data-hud-info="Real-time volumetric spike graphs, coordinate hover crosshairs, and live system log stream correlating anomalies."
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
              style={activeTab === "diagnostics" ? activeClass : inactiveClass}
            >
              <Activity className="w-4 h-4" style={{ color: "var(--cs-text-secondary)" }} />
              <span className="flex-1 text-left">Live Telemetry & Spikes</span>
            </button>

            <button
              onClick={() => setActiveTab("assistant")}
              data-hud-title="AI Copilot Workspace"
              data-hud-info="Autonomous cybersecurity reasoning canvas that answers any query, generates remediation scripts, and executes playbooks."
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
              style={activeTab === "assistant" ? activeClass : inactiveClass}
            >
              <Bot className="w-4 h-4" style={{ color: "var(--cs-text-secondary)" }} />
              <span className="flex-1 text-left">AI Copilot</span>
              <Sparkles className="w-3 h-3" style={{ color: "var(--cs-accent)" }} />
            </button>

            <button
              onClick={() => setActiveTab("terminal")}
              data-hud-title="Interactive Terminal & Shell"
              data-hud-info="Execute host diagnostics, query eBPF probes, run live commands, inspect processes, and tail security logs."
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
              style={activeTab === "terminal" ? activeClass : inactiveClass}
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="flex-1 text-left">Sentinel Terminal</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 font-bold">
                CLI
              </span>
            </button>
          </div>

          {/* SECURITY RECORDS */}
          <div className="space-y-1">
            <span
              className="px-3 text-[10px] font-mono font-bold tracking-wider uppercase"
              style={{ color: "var(--cs-text-muted)" }}
            >
              SECURITY RECORDS
            </span>

            <button
              onClick={() => setActiveTab("threats")}
              data-hud-title="Incidents Feed"
              data-hud-info="Triage real-time security events mapped to MITRE ATT&CK tactics, with CSV export and severity filters."
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl transition-all cursor-pointer"
              style={activeTab === "threats" ? activeClass : inactiveClass}
            >
              <div className="flex items-center gap-3">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                <span>Incidents Feed</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5" style={{ color: "var(--cs-text-muted)" }} />
            </button>

            <button
              onClick={() => setActiveTab("quarantine")}
              data-hud-title="Quarantine Vault"
              data-hud-info="Isolated microVM sandbox storage for high-risk binaries, with real-time detonation trace simulations."
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
              style={activeTab === "quarantine" ? activeClass : inactiveClass}
            >
              <Lock className="w-4 h-4" style={{ color: "var(--cs-text-secondary)" }} />
              <span>Quarantine Vault</span>
            </button>

            <button
              onClick={() => setActiveTab("endpoints")}
              data-hud-title="Fleet Endpoints & Hardware Diagnostics"
              data-hud-info="Live host diagnostics querying authentic Windows CPU cores, load %, GPU graphics controller, and memory."
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
              style={activeTab === "endpoints" ? activeClass : inactiveClass}
            >
              <Laptop className="w-4 h-4" style={{ color: "var(--cs-text-secondary)" }} />
              <span>Fleet Endpoints</span>
            </button>
          </div>

          {/* GOVERNANCE */}
          <div className="space-y-1">
            <span
              className="px-3 text-[10px] font-mono font-bold tracking-wider uppercase"
              style={{ color: "var(--cs-text-muted)" }}
            >
              GOVERNANCE
            </span>

            <button
              onClick={() => setActiveTab("audit")}
              data-hud-title="Audit Logs"
              data-hud-info="Immutable, cryptographically signed ledger of operator actions, policy updates, and authentication events."
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
              style={activeTab === "audit" ? activeClass : inactiveClass}
            >
              <FileText className="w-4 h-4" style={{ color: "var(--cs-text-secondary)" }} />
              <span>Audit Logs</span>
            </button>

            <button
              onClick={() => setActiveTab("policy")}
              data-hud-title="Zero-Trust Rules Engine"
              data-hud-info="Manage deterministic inbound/outbound firewall rules, port policies, and eBPF kernel enforcement hooks."
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
              style={activeTab === "policy" ? activeClass : inactiveClass}
            >
              <ShieldCheck className="w-4 h-4" style={{ color: "var(--cs-text-secondary)" }} />
              <span>Zero-Trust Rules</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              data-hud-title="Defense Configuration"
              data-hud-info="Configure system appearances and parameters."
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
              style={activeTab === "settings" ? activeClass : inactiveClass}
            >
              <Sliders className="w-4 h-4" style={{ color: "var(--cs-text-secondary)" }} />
              <span>Defense Config</span>
            </button>

            <button
              onClick={() => setDownloadModalOpen(true)}
              data-hud-title="Download & Share App"
              data-hud-info="Download standalone desktop app, get sharable link, or export diagnostic reports."
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition-all cursor-pointer text-sky-400 hover:bg-sky-500/10 border border-sky-500/20"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span className="font-bold">Download &amp; Share</span>
            </button>

            <Link
              href="/admin"
              data-hud-title="Dedicated Admin & Backend Access"
              data-hud-info="Access the isolated Admin Console for Database credentials, API Keys, and Role Permissions."
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl transition-all cursor-pointer text-rose-400 hover:bg-rose-500/10 border border-rose-500/20"
            >
              <Lock className="w-4 h-4 text-rose-400" />
              <span className="font-bold">Admin &amp; Database</span>
            </Link>
          </div>
        </div>
      </div>

      {/* User Info & Bottom Logout / Lock */}
      <div className="pt-4 space-y-3 relative" style={{ borderTop: "1px solid var(--cs-border)" }}>
        {userSession && (
          <div
            onClick={() => setProfileOpen(!profileOpen)}
            data-hud-title="Active Operator Session"
            data-hud-info={`Logged in as ${userSession.name} (${userSession.email}) with ${userSession.role} privileges.`}
            className="flex items-center gap-3 px-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs"
              style={{
                backgroundColor: "var(--cs-bg-hover)",
                border: "1px solid var(--cs-border-strong)",
                color: "var(--cs-accent)",
              }}
            >
              {userSession.avatar || "SR"}
            </div>
            <div className="overflow-hidden">
              <div
                className="text-xs font-bold truncate flex items-center gap-1"
                style={{ color: "var(--cs-text-primary)" }}
              >
                {userSession.name}
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </div>
              <div className="text-[9px] font-mono text-emerald-400">
                {userSession.role === "SENTINEL_ROOT_ADMIN" ? "ROOT ACCESS" : "ANALYST"}
              </div>
            </div>
          </div>
        )}

        {profileOpen && (
          <div className="absolute bottom-[calc(100%+8px)] left-2 right-2 rounded-xl shadow-xl border overflow-hidden animate-in fade-in slide-in-from-bottom-2 z-50" style={{ backgroundColor: "var(--cs-bg-card)", borderColor: "var(--cs-border-strong)" }}>
            <div className="px-3 py-2 border-b text-[10px] font-mono text-slate-500" style={{ borderColor: "var(--cs-border)" }}>
              {userSession?.email}
            </div>
            <button className="w-full text-left px-3 py-2 text-xs hover:bg-slate-500/10 transition-colors" style={{ color: "var(--cs-text-primary)" }}>
              Edit Profile
            </button>
            <button className="w-full text-left px-3 py-2 text-xs hover:bg-slate-500/10 transition-colors" style={{ color: "var(--cs-text-primary)" }}>
              Preferences
            </button>
          </div>
        )}

        <button
          onClick={onLockConsole}
          data-hud-title="Lock Console"
          data-hud-info="Locks the current operator session and transitions back to the Sentinel Authentication Portal."
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl hover:bg-rose-950/20 hover:text-rose-400 transition-colors text-xs font-medium cursor-pointer"
          style={{ color: "var(--cs-text-secondary)" }}
        >
          <LogOut className="w-4 h-4" />
          <span>Lock Console / Switch User</span>
        </button>
      </div>

      <DownloadShareModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />
    </aside>
  );
};
export default CrmSidebar;
