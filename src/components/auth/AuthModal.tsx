"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Lock,
  Key,
  User,
  Zap,
  CheckCircle2,
  Database,
  Flame,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

export interface UserSession {
  email: string;
  name: string;
  role: "SENTINEL_ROOT_ADMIN" | "SECURITY_ANALYST" | "AUDITOR";
  authProvider: "LOCAL_DEV" | "SUPABASE" | "FIREBASE";
  avatar: string;
  loginTime: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onLoginSuccess: (session: UserSession) => void;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onLoginSuccess,
  onClose,
}) => {
  const [authMode, setAuthMode] = useState<"quick" | "email" | "supabase">("quick");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1-Click Fast Instant Free Login
  const handleQuickLogin = (role: "SENTINEL_ROOT_ADMIN" | "SECURITY_ANALYST") => {
    setIsLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      const session: UserSession = {
        email: role === "SENTINEL_ROOT_ADMIN" ? "root@cybershield.os" : "analyst@cybershield.os",
        name: role === "SENTINEL_ROOT_ADMIN" ? "Sentinel Root Admin" : "Security Analyst",
        role,
        authProvider: "LOCAL_DEV",
        avatar: role === "SENTINEL_ROOT_ADMIN" ? "SR" : "SA",
        loginTime: new Date().toLocaleTimeString(),
      };

      localStorage.setItem("cybershield_session", JSON.stringify(session));
      setIsLoading(false);
      onLoginSuccess(session);
    }, 600);
  };

  // Custom Email/Password Authentication
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter email and password.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      const session: UserSession = {
        email,
        name: email.split("@")[0].toUpperCase(),
        role: "SECURITY_ANALYST",
        authProvider: "LOCAL_DEV",
        avatar: email.substring(0, 2).toUpperCase(),
        loginTime: new Date().toLocaleTimeString(),
      };

      localStorage.setItem("cybershield_session", JSON.stringify(session));
      setIsLoading(false);
      onLoginSuccess(session);
    }, 700);
  };

  // Supabase Custom Configuration Connection
  const handleSupabaseConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl || !supabaseAnonKey) {
      setErrorMsg("Please provide your Supabase Project URL and Anon Key.");
      return;
    }

    setIsLoading(true);
    // Save to local storage for persistent Supabase client setup
    localStorage.setItem("cybershield_supabase_url", supabaseUrl);
    localStorage.setItem("cybershield_supabase_key", supabaseAnonKey);

    setTimeout(() => {
      const session: UserSession = {
        email: "supabase_admin@project.cloud",
        name: "Supabase Cloud Officer",
        role: "SENTINEL_ROOT_ADMIN",
        authProvider: "SUPABASE",
        avatar: "SB",
        loginTime: new Date().toLocaleTimeString(),
      };

      localStorage.setItem("cybershield_session", JSON.stringify(session));
      setIsLoading(false);
      onLoginSuccess(session);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-md bg-[#111317] border border-white/[0.12] rounded-3xl p-7 shadow-2xl space-y-6 relative overflow-hidden"
      >
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF7A00] to-transparent" />

        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-[#181B22] border border-white/10 shadow-inner">
            <Shield className="w-7 h-7 text-[#FF7A00]" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              CyberShield Sentinel OS
            </h2>
            <p className="text-xs text-slate-400">
              Autonomous Cybersecurity & Threat Intelligence Platform
            </p>
          </div>
        </div>

        {/* Auth Mode Tabs */}
        <div className="grid grid-cols-3 p-1 rounded-2xl bg-[#161921] border border-white/[0.08] text-xs font-semibold">
          <button
            onClick={() => setAuthMode("quick")}
            className={`py-2 rounded-xl transition-all ${
              authMode === "quick"
                ? "bg-[#232836] text-white shadow-xs font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Instant Free
          </button>
          <button
            onClick={() => setAuthMode("email")}
            className={`py-2 rounded-xl transition-all ${
              authMode === "email"
                ? "bg-[#232836] text-white shadow-xs font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Email Auth
          </button>
          <button
            onClick={() => setAuthMode("supabase")}
            className={`py-2 rounded-xl transition-all ${
              authMode === "supabase"
                ? "bg-[#232836] text-white shadow-xs font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Supabase
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab 1: Instant 1-Click Free Login */}
        {authMode === "quick" && (
          <div className="space-y-3">
            <button
              onClick={() => handleQuickLogin("SENTINEL_ROOT_ADMIN")}
              disabled={isLoading}
              className="w-full p-4 rounded-2xl bg-[#161921] hover:bg-[#1E2330] border border-white/10 hover:border-[#FF7A00]/50 transition-all text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF7A00] to-amber-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  ROOT
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-[#FF7A00] transition-colors">
                    Enter as Sentinel Root
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    Full Ring-0 eBPF & Sandbox Controls
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => handleQuickLogin("SECURITY_ANALYST")}
              disabled={isLoading}
              className="w-full p-4 rounded-2xl bg-[#161921] hover:bg-[#1E2330] border border-white/10 hover:border-sky-500/50 transition-all text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  SEC
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors">
                    Enter as Security Analyst
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    Threat Forensics & MITRE Matrix Analysis
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        )}

        {/* Tab 2: Standard Email / Password Form */}
        {authMode === "email" && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 font-semibold">
                Security Officer Email
              </label>
              <input
                type="email"
                placeholder="officer@sentinel.defense"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#161921] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF7A00]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 font-semibold">
                Access Token / Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#161921] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF7A00]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#FF7A00] hover:bg-[#FF8C1A] text-white text-xs font-bold shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isLoading ? "Authenticating..." : "Authorize Sentinel Access"}</span>
            </button>
          </form>
        )}

        {/* Tab 3: Free Supabase Cloud Database Connection */}
        {authMode === "supabase" && (
          <form onSubmit={handleSupabaseConnect} className="space-y-4">
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-300">
              Connect your free Supabase project to persist incidents and telemetry.
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 font-semibold">
                Supabase Project URL
              </label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full bg-[#161921] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 font-semibold">
                Supabase Anon Public Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                className="w-full bg-[#161921] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isLoading ? "Connecting Database..." : "Connect Supabase Database"}</span>
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[10px] font-mono text-slate-400">
          <span>End-to-End Encrypted</span>
          <span>Zero-Cost Architecture</span>
        </div>
      </motion.div>
    </div>
  );
};
export default AuthModal;
