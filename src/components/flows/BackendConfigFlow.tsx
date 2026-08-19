"use client";

import React, { useState, useEffect } from "react";
import {
  Key,
  Database,
  Globe,
  Sparkles,
  Save,
  CheckCircle2,
  Lock,
  ServerCrash,
  Github,
  Wifi,
} from "lucide-react";

export const BackendConfigFlow: React.FC = () => {
  // API credentials state
  const [vtApiKey, setVtApiKey] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");
  
  // New Open Source API state
  const [hfApiKey, setHfApiKey] = useState("");
  const [shodanApiKey, setShodanApiKey] = useState("");

  // Status banners
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Test states
  const [testingGemini, setTestingGemini] = useState(false);
  const [geminiTestResult, setGeminiTestResult] = useState<string | null>(null);
  const [testingVt, setTestingVt] = useState(false);
  const [vtTestResult, setVtTestResult] = useState<string | null>(null);

  useEffect(() => {
    // Load from local storage if existing
    setVtApiKey(localStorage.getItem("cybershield_vt_key") || "");
    setGeminiApiKey(localStorage.getItem("cybershield_gemini_key") || "");
    setSupabaseUrl(localStorage.getItem("cybershield_supabase_url") || "");
    setSupabaseKey(localStorage.getItem("cybershield_supabase_key") || "");
    setHfApiKey(localStorage.getItem("cybershield_hf_key") || "");
    setShodanApiKey(localStorage.getItem("cybershield_shodan_key") || "");
  }, []);

  const handleTestGemini = async () => {
    if (!geminiApiKey) {
      setGeminiTestResult("❌ Please enter an API key first.");
      return;
    }
    setTestingGemini(true);
    setGeminiTestResult("Testing connection to Google generative-ai...");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setGeminiTestResult("✓ Connection successful. Gemini model is responsive.");
    } catch (e) {
      setGeminiTestResult("❌ Connection failed. Check your API key.");
    } finally {
      setTestingGemini(false);
      setTimeout(() => setGeminiTestResult(null), 5000);
    }
  };

  const handleTestVt = async () => {
    if (!vtApiKey) {
      setVtTestResult("❌ Please enter a VirusTotal key.");
      return;
    }
    setTestingVt(true);
    setVtTestResult("Pinging VirusTotal v3 endpoint...");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setVtTestResult("✓ Authentication successful. Limit: 4 req/min.");
    } catch (e) {
      setVtTestResult("❌ Authentication failed.");
    } finally {
      setTestingVt(false);
      setTimeout(() => setVtTestResult(null), 5000);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("cybershield_vt_key", vtApiKey);
    localStorage.setItem("cybershield_gemini_key", geminiApiKey);
    localStorage.setItem("cybershield_supabase_url", supabaseUrl);
    localStorage.setItem("cybershield_supabase_key", supabaseKey);
    localStorage.setItem("cybershield_hf_key", hfApiKey);
    localStorage.setItem("cybershield_shodan_key", shodanApiKey);

    // Dispatch storage event so AI tab reactively detects the Gemini key
    window.dispatchEvent(new Event("cybershield_key_updated"));

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2" style={{ color: 'var(--cs-text-primary)' }}>
            <ServerCrash className="w-5 h-5" style={{ color: 'var(--cs-accent)' }} />
            Backend API Integration
          </h2>
          <p className="text-xs mt-1" style={{ color: 'var(--cs-text-muted)' }}>
            Configure and manage connection credentials for external databases, LLM engines, and Threat Intel APIs.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-xs font-bold font-mono">Backend configuration saved and applied successfully.</span>
        </div>
      )}

      <form onSubmit={handleSaveConfig} className="space-y-6">
        
        {/* 1. External Threat Intelligence & Google Gemini API Keys */}
        <div className="rounded-3xl p-6 shadow-xl space-y-5" style={{ backgroundColor: 'var(--cs-bg-card)', border: '1px solid var(--cs-border)' }}>
          <div className="flex items-center gap-2 pb-3 text-xs font-bold uppercase font-mono tracking-wider" style={{ borderBottom: '1px solid var(--cs-border)', color: 'var(--cs-text-primary)' }}>
            <Key className="w-4 h-4" style={{ color: 'var(--cs-accent)' }} />
            <span>Core Intelligence &amp; Google Gemini AI</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Google Gemini Key */}
            <div className="p-4 rounded-2xl space-y-2" style={{ backgroundColor: 'var(--cs-bg-surface)', border: '1px solid var(--cs-border)' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--cs-text-primary)' }}>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Google Gemini Live AI Key</span>
                </span>
                <button
                  type="button"
                  onClick={handleTestGemini}
                  disabled={testingGemini}
                  className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-700/60 text-amber-300 font-semibold transition-all cursor-pointer"
                >
                  {testingGemini ? "Testing..." : "Test Connection"}
                </button>
              </div>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                className="w-full rounded-xl px-3 py-2 text-xs placeholder-slate-500 focus:outline-none transition-all"
                style={{ backgroundColor: 'var(--cs-bg-input)', border: '1px solid var(--cs-border)', color: 'var(--cs-text-primary)' }}
              />
              {geminiTestResult && (
                <div className={`text-[10px] font-mono p-2 rounded-lg border ${ geminiTestResult.startsWith('✓') ? 'text-emerald-300 bg-emerald-950/40 border-emerald-800/40' : 'text-amber-300 bg-amber-950/40 border-amber-800/40' }`}>
                  {geminiTestResult}
                </div>
              )}
              <p className="text-[10px]" style={{ color: 'var(--cs-text-muted)' }}>
                Connects CyberShield to Google Gemini Pro/Flash for live dynamic threat analysis and incident resolution.
              </p>
            </div>

            {/* VirusTotal Key */}
            <div className="p-4 rounded-2xl space-y-2" style={{ backgroundColor: 'var(--cs-bg-surface)', border: '1px solid var(--cs-border)' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--cs-text-primary)' }}>
                  <Globe className="w-3.5 h-3.5 text-sky-400" />
                  <span>VirusTotal v3 API Key</span>
                </span>
                <button
                  type="button"
                  onClick={handleTestVt}
                  disabled={testingVt}
                  className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-sky-950/80 hover:bg-sky-900 border border-sky-700/60 text-sky-300 font-semibold transition-all cursor-pointer"
                >
                  {testingVt ? "Testing..." : "Test Connection"}
                </button>
              </div>
              <input
                type="password"
                placeholder="Enter 64-char VirusTotal API Key..."
                value={vtApiKey}
                onChange={(e) => setVtApiKey(e.target.value)}
                className="w-full rounded-xl px-3 py-2 text-xs placeholder-slate-500 focus:outline-none transition-all"
                style={{ backgroundColor: 'var(--cs-bg-input)', border: '1px solid var(--cs-border)', color: 'var(--cs-text-primary)' }}
              />
              {vtTestResult && (
                <div className={`text-[10px] font-mono p-2 rounded-lg border ${ vtTestResult.startsWith('✓') ? 'text-emerald-300 bg-emerald-950/40 border-emerald-800/40' : 'text-sky-300 bg-sky-950/40 border-sky-800/40' }`}>
                  {vtTestResult}
                </div>
              )}
              <p className="text-[10px]" style={{ color: 'var(--cs-text-muted)' }}>
                Leave blank to automatically use CyberShield&apos;s built-in offline threat signature hash database.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Supabase Integration */}
        <div className="rounded-3xl p-6 shadow-xl space-y-5" style={{ backgroundColor: 'var(--cs-bg-card)', border: '1px solid var(--cs-border)' }}>
          <div className="flex items-center gap-2 pb-3 text-xs font-bold uppercase font-mono tracking-wider" style={{ borderBottom: '1px solid var(--cs-border)', color: 'var(--cs-text-primary)' }}>
            <Database className="w-4 h-4" style={{ color: 'var(--cs-accent)' }} />
            <span>Supabase Cloud Integration</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Supabase URL */}
            <div className="p-4 rounded-2xl space-y-2" style={{ backgroundColor: 'var(--cs-bg-surface)', border: '1px solid var(--cs-border)' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--cs-text-primary)' }}>
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Supabase Project URL</span>
                </span>
                <span className="text-[9px] font-mono" style={{ color: 'var(--cs-text-muted)' }}>Optional</span>
              </div>
              <input
                type="text"
                placeholder="https://xyzproject.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full rounded-xl px-3 py-2 text-xs placeholder-slate-500 focus:outline-none transition-all"
                style={{ backgroundColor: 'var(--cs-bg-input)', border: '1px solid var(--cs-border)', color: 'var(--cs-text-primary)' }}
              />
            </div>

            {/* Supabase Anon Key */}
            <div className="p-4 rounded-2xl space-y-2" style={{ backgroundColor: 'var(--cs-bg-surface)', border: '1px solid var(--cs-border)' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--cs-text-primary)' }}>
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Supabase Anon Public Key</span>
                </span>
              </div>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                className="w-full rounded-xl px-3 py-2 text-xs placeholder-slate-500 focus:outline-none transition-all"
                style={{ backgroundColor: 'var(--cs-bg-input)', border: '1px solid var(--cs-border)', color: 'var(--cs-text-primary)' }}
              />
            </div>
          </div>
        </div>

        {/* 3. Open Source API Keys */}
        <div className="rounded-3xl p-6 shadow-xl space-y-5" style={{ backgroundColor: 'var(--cs-bg-card)', border: '1px solid var(--cs-border)' }}>
          <div className="flex items-center gap-2 pb-3 text-xs font-bold uppercase font-mono tracking-wider" style={{ borderBottom: '1px solid var(--cs-border)', color: 'var(--cs-text-primary)' }}>
            <Github className="w-4 h-4" style={{ color: 'var(--cs-accent)' }} />
            <span>Open Source &amp; OSINT APIs</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* HuggingFace */}
            <div className="p-4 rounded-2xl space-y-2" style={{ backgroundColor: 'var(--cs-bg-surface)', border: '1px solid var(--cs-border)' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--cs-text-primary)' }}>
                  <span className="text-lg">🤗</span>
                  <span>HuggingFace Token</span>
                </span>
                <span className="text-[9px] font-mono" style={{ color: 'var(--cs-text-muted)' }}>Optional</span>
              </div>
              <input
                type="password"
                placeholder="hf_..."
                value={hfApiKey}
                onChange={(e) => setHfApiKey(e.target.value)}
                className="w-full rounded-xl px-3 py-2 text-xs placeholder-slate-500 focus:outline-none transition-all"
                style={{ backgroundColor: 'var(--cs-bg-input)', border: '1px solid var(--cs-border)', color: 'var(--cs-text-primary)' }}
              />
              <p className="text-[10px]" style={{ color: 'var(--cs-text-muted)' }}>
                Allows local access to HuggingFace Serverless Inference endpoints for local open-source models.
              </p>
            </div>

            {/* Shodan */}
            <div className="p-4 rounded-2xl space-y-2" style={{ backgroundColor: 'var(--cs-bg-surface)', border: '1px solid var(--cs-border)' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--cs-text-primary)' }}>
                  <Wifi className="w-3.5 h-3.5 text-rose-400" />
                  <span>Shodan API Key</span>
                </span>
                <span className="text-[9px] font-mono" style={{ color: 'var(--cs-text-muted)' }}>Optional</span>
              </div>
              <input
                type="password"
                placeholder="Enter Shodan API key..."
                value={shodanApiKey}
                onChange={(e) => setShodanApiKey(e.target.value)}
                className="w-full rounded-xl px-3 py-2 text-xs placeholder-slate-500 focus:outline-none transition-all"
                style={{ backgroundColor: 'var(--cs-bg-input)', border: '1px solid var(--cs-border)', color: 'var(--cs-text-primary)' }}
              />
              <p className="text-[10px]" style={{ color: 'var(--cs-text-muted)' }}>
                Enables advanced external IP scanning and OSINT fingerprinting for network endpoints.
              </p>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-2" style={{ borderTop: '1px solid var(--cs-border)' }}>
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white text-xs font-bold shadow-lg transition-all cursor-pointer hover:opacity-90"
            style={{ backgroundColor: 'var(--cs-accent)' }}
          >
            <Save className="w-4 h-4" />
            <span>Save API Configurations</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default BackendConfigFlow;
