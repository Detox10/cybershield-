"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  User,
  KeyRound,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Database,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Terminal,
} from "lucide-react";
import { UserSession } from "@/components/auth/AuthModal";
import { CyberDatabase, UserAccount } from "@/lib/db";

interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [tab, setTab] = useState<"instant" | "custom" | "supabase">("instant");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // 1. Instant Root Access
  const handleInstantRoot = () => {
    const session: UserSession = {
      email: "root@cybershield.os",
      name: "Sentinel Root Administrator",
      role: "SENTINEL_ROOT_ADMIN",
      authProvider: "LOCAL_DEV",
      avatar: "SR",
      loginTime: new Date().toLocaleTimeString(),
    };
    localStorage.setItem("cybershield_session", JSON.stringify(session));
    onLoginSuccess(session);
  };

  // 2. Instant Analyst Access
  const handleInstantAnalyst = () => {
    const session: UserSession = {
      email: "analyst@cybershield.os",
      name: "Lead Threat Analyst",
      role: "SECURITY_ANALYST",
      authProvider: "LOCAL_DEV",
      avatar: "LA",
      loginTime: new Date().toLocaleTimeString(),
    };
    localStorage.setItem("cybershield_session", JSON.stringify(session));
    onLoginSuccess(session);
  };

  // 3. Custom Email Login / Registration
  const handleCustomAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setStatusMessage("Please enter valid credentials.");
      return;
    }

    if (isRegistering) {
      const newUser: UserAccount = {
        id: `user-${Date.now()}`,
        email: email.trim(),
        name: fullName.trim() || email.split("@")[0],
        role: "SECURITY_ANALYST",
        avatar: (fullName[0] || email[0] || "U").toUpperCase(),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      CyberDatabase.registerUser(newUser);

      const session: UserSession = {
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        authProvider: "LOCAL_DEV",
        avatar: newUser.avatar,
        loginTime: new Date().toLocaleTimeString(),
      };
      localStorage.setItem("cybershield_session", JSON.stringify(session));
      onLoginSuccess(session);
    } else {
      // Login existing user
      const users = CyberDatabase.getUsers();
      const match = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

      const session: UserSession = {
        email: email.trim(),
        name: match ? match.name : email.split("@")[0],
        role: match ? match.role : "SECURITY_ANALYST",
        authProvider: "LOCAL_DEV",
        avatar: match ? match.avatar : email[0].toUpperCase(),
        loginTime: new Date().toLocaleTimeString(),
      };
      localStorage.setItem("cybershield_session", JSON.stringify(session));
      onLoginSuccess(session);
    }
  };

  // 4. Supabase Connection
  const handleSupabaseConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
      setStatusMessage("Please provide Supabase Project URL and Anon Public Key.");
      return;
    }

    const session: UserSession = {
      email: "operator@supabase.cloud",
      name: "Supabase Authenticated Operator",
      role: "SENTINEL_ROOT_ADMIN",
      authProvider: "SUPABASE",
      avatar: "SB",
      loginTime: new Date().toLocaleTimeString(),
    };
    localStorage.setItem("cybershield_supabase_url", supabaseUrl);
    localStorage.setItem("cybershield_session", JSON.stringify(session));
    onLoginSuccess(session);
  };

  return (
    <div className="min-h-screen w-screen bg-[#07080B] text-slate-100 flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden font-sans select-none">
      {/* Background Cybernetic Grids & Ambient Glows */}
      <div className="absolute top-[-120px] left-[-120px] w-[600px] h-[600px] bg-gradient-to-br from-[#FF6A00]/20 via-[#FF3B00]/10 to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-gradient-to-tl from-emerald-600/10 to-transparent rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      {/* Top Brand Header */}
      <div className="relative z-10 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF7A00] via-[#FF4500] to-[#991B1B] p-0.5 shadow-[0_0_25px_rgba(255,106,0,0.4)] flex items-center justify-center">
            <div className="w-full h-full bg-[#101217] rounded-[14px] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF7A00" strokeWidth="2.2">
                <circle cx="8" cy="8" r="4" />
                <circle cx="16" cy="8" r="4" />
                <circle cx="8" cy="8" r="4" />
                <circle cx="16" cy="16" r="4" />
              </svg>
            </div>
          </div>
          <div>
            <div className="text-base font-extrabold tracking-wider text-white">CYBERSHIELD</div>
            <div className="text-[10px] font-mono text-slate-400">SENTINEL DEFENSE OS • RING-0</div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>eBPF Telemetry Live</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-[#141720] border border-white/10 text-slate-300">
            Zero-Trust Enforced
          </span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 max-w-md w-full mx-auto my-auto pt-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
          className="bg-[#101319]/90 border border-white/[0.1] rounded-3xl p-8 shadow-2xl backdrop-blur-2xl space-y-6"
        >
          {/* Emblem & Title */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#1E2330] to-[#141722] border border-white/10 mx-auto flex items-center justify-center shadow-inner">
              <Shield className="w-6 h-6 text-[#FF7A00]" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Console Authentication
            </h1>
            <p className="text-xs text-slate-400">
              Select an access profile or connect with credentials.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#161922] border border-white/5 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => {
                setTab("instant");
                setStatusMessage(null);
              }}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                tab === "instant" ? "bg-[#222735] text-white shadow-xs" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              1-Click Free
            </button>
            <button
              onClick={() => {
                setTab("custom");
                setStatusMessage(null);
              }}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                tab === "custom" ? "bg-[#222735] text-white shadow-xs" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Custom Auth
            </button>
            <button
              onClick={() => {
                setTab("supabase");
                setStatusMessage(null);
              }}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                tab === "supabase" ? "bg-[#222735] text-white shadow-xs" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Supabase
            </button>
          </div>

          {/* Tab 1: Instant 1-Click Free Access */}
          {tab === "instant" && (
            <div className="space-y-3">
              <button
                onClick={handleInstantRoot}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#171B24] to-[#1C212E] hover:from-[#1E2432] hover:to-[#242A3C] border border-white/10 hover:border-[#FF7A00]/50 transition-all flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/20 border border-[#FF7A00]/40 flex items-center justify-center font-mono font-bold text-xs text-[#FF7A00]">
                    ROOT
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-[#FF7A00] transition-colors">
                      Enter as Sentinel Root
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      Full Ring-0 eBPF & Kernel Privileges
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#FF7A00] group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={handleInstantAnalyst}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#171B24] to-[#1C212E] hover:from-[#1E2432] hover:to-[#242A3C] border border-white/10 hover:border-sky-500/50 transition-all flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center font-mono font-bold text-xs text-sky-400">
                    ANL
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors">
                      Enter as Security Analyst
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      Threat Radar, MITRE Matrix & Scanners
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          )}

          {/* Tab 2: Custom Credentials */}
          {tab === "custom" && (
            <form onSubmit={handleCustomAuth} className="space-y-4">
              {isRegistering && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Mercer"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#151821] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF7A00]"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400">Operator Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@enterprise.corp"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#151821] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF7A00]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#151821] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF7A00]"
                />
              </div>

              {statusMessage && (
                <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800 text-[11px] text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#FF7A00] hover:bg-[#FF8C1A] text-white text-xs font-bold transition-all shadow-lg cursor-pointer"
              >
                {isRegistering ? "Register New Operator" : "Authenticate Session"}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setStatusMessage(null);
                  }}
                  className="text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {isRegistering ? "Already have an account? Sign In" : "Need a new account? Register"}
                </button>
              </div>
            </form>
          )}

          {/* Tab 3: Supabase Integration */}
          {tab === "supabase" && (
            <form onSubmit={handleSupabaseConnect} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400">Supabase Project URL</label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#151821] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF7A00]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400">Anon Public Key</label>
                <input
                  type="password"
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#151821] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF7A00]"
                />
              </div>

              {statusMessage && (
                <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800 text-[11px] text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg cursor-pointer"
              >
                Connect to Supabase Cloud
              </button>
            </form>
          )}

          {/* Footer Security Badges */}
          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>End-to-End Encrypted</span>
            </span>
            <span>Zero-Cost Architecture</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Footer Info */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500 border-t border-white/[0.06] pt-6">
        <div>CyberShield Autonomous Defense OS • Release v2.4.8-LTS</div>
        <div className="flex items-center gap-4">
          <span>MITRE ATT&CK® v14</span>
          <span>•</span>
          <span>VirusTotal v3</span>
          <span>•</span>
          <span>Kernel eBPF</span>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
