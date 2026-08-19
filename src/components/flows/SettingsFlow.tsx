"use client";

import React, { useState, useEffect } from "react";
import {
  Sliders,
  Key,
  Database,
  Globe,
  Sparkles,
  Save,
  CheckCircle2,
  Lock,
  Sun,
  Moon,
  Laptop,
  Palette,
  RotateCcw,
} from "lucide-react";
import {
  ThemeManager,
  ThemeMode,
  AccentColor,
  GradientTheme,
  ACCENT_PALETTES,
  GRADIENT_THEMES,
} from "@/tokens/themeManager";

export const SettingsFlow: React.FC = () => {
  // Theme state
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");
  const [accentColor, setAccentColor] = useState<AccentColor>("amber");
  const [gradientTheme, setGradientTheme] = useState<GradientTheme>("cyber-aurora");

  // API credentials state
  const [vtApiKey, setVtApiKey] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");

  // Sensitivity parameters
  const [entropyThreshold, setEntropyThreshold] = useState(7.5);
  const [ebpfInterval, setEbpfInterval] = useState(250);

  // Status banners
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Test states
  const [testingGemini, setTestingGemini] = useState(false);
  const [geminiTestResult, setGeminiTestResult] = useState<string | null>(null);
  const [testingVt, setTestingVt] = useState(false);
  const [vtTestResult, setVtTestResult] = useState<string | null>(null);

  useEffect(() => {
    // Load stored theme configuration
    const currentTheme = ThemeManager.getTheme();
    setThemeMode(currentTheme.mode);
    setAccentColor(currentTheme.accent);
    setGradientTheme(currentTheme.gradient);

    // Load from local storage if existing
    setVtApiKey(localStorage.getItem("cybershield_vt_key") || "");
    setGeminiApiKey(localStorage.getItem("cybershield_gemini_key") || "");
    setSupabaseUrl(localStorage.getItem("cybershield_supabase_url") || "");
    setSupabaseKey(localStorage.getItem("cybershield_supabase_key") || "");
    const savedEntropy = localStorage.getItem("cybershield_entropy_threshold");
    if (savedEntropy) setEntropyThreshold(parseFloat(savedEntropy));
    const savedEbpf = localStorage.getItem("cybershield_ebpf_interval");
    if (savedEbpf) setEbpfInterval(parseInt(savedEbpf));
  }, []);

  const handleThemeModeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    ThemeManager.applyTheme({
      mode,
      accent: accentColor,
      gradient: gradientTheme,
    });
  };

  const handleAccentChange = (accent: AccentColor) => {
    setAccentColor(accent);
    ThemeManager.applyTheme({
      mode: themeMode,
      accent,
      gradient: gradientTheme,
    });
  };

  const handleGradientChange = (gradient: GradientTheme) => {
    setGradientTheme(gradient);
    ThemeManager.applyTheme({
      mode: themeMode,
      accent: accentColor,
      gradient,
    });
  };

  const handleResetToDefaults = () => {
    const defaultConf = ThemeManager.resetToDefault();
    setThemeMode(defaultConf.mode);
    setAccentColor(defaultConf.accent);
    setGradientTheme(defaultConf.gradient);
    setEntropyThreshold(7.5);
    setEbpfInterval(250);
    setGeminiTestResult(null);
    setVtTestResult(null);

    localStorage.setItem("cybershield_entropy_threshold", "7.5");
    localStorage.setItem("cybershield_ebpf_interval", "250");

    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3500);
  };

  const handleTestGemini = async () => {
    if (!geminiApiKey) {
      setGeminiTestResult("⚠️ Please enter a Google Gemini API key first.");
      return;
    }
    setTestingGemini(true);
    setGeminiTestResult(null);
    try {
      const res = await fetch("/api/ai-diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "Verify CyberShield Zero-Trust connection and status.",
          apiKey: geminiApiKey,
        }),
      });
      const data = await res.json();
      if (data.success && data.source?.includes("GEMINI")) {
        setGeminiTestResult(`✓ Connected to ${data.source}! Live AI ready.`);
      } else if (data.success) {
        setGeminiTestResult("✓ Fallback reasoning engine verified.");
      } else {
        setGeminiTestResult(`⚠️ ${data.error || "Connection test returned an error."}`);
      }
    } catch (e: any) {
      setGeminiTestResult(`⚠️ Error testing key: ${e.message}`);
    } finally {
      setTestingGemini(false);
    }
  };

  const handleTestVt = async () => {
    if (!vtApiKey) {
      setVtTestResult("⚠️ Please enter a VirusTotal API key first.");
      return;
    }
    setTestingVt(true);
    setVtTestResult(null);
    try {
      const res = await fetch("/api/virustotal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
          apiKey: vtApiKey,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setVtTestResult(`✓ Connected to ${data.source}! Ready for live scans.`);
      } else {
        setVtTestResult(`⚠️ ${data.error || "VirusTotal test failed."}`);
      }
    } catch (e: any) {
      setVtTestResult(`⚠️ Error testing key: ${e.message}`);
    } finally {
      setTestingVt(false);
    }
  };
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("cybershield_entropy_threshold", entropyThreshold.toString());
    localStorage.setItem("cybershield_ebpf_interval", ebpfInterval.toString());

    ThemeManager.applyTheme({
      mode: themeMode,
      accent: accentColor,
      gradient: gradientTheme,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 select-none" style={{ color: 'var(--cs-text-primary)' }}>
      {/* Header with Save & Reset buttons */}
      <div className="rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ backgroundColor: 'var(--cs-bg-card)', border: '1px solid var(--cs-border)' }}>
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--cs-accent)' }} />
            <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--cs-text-primary)' }}>
              Defense Engine, Theme &amp; Integration Settings
            </h2>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--cs-accent-bg)', border: '1px solid var(--cs-accent)', color: 'var(--cs-accent)' }}>
              SENTINEL v2.4
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--cs-text-muted)' }}>
            Customize appearance, light/dark themes, accent colors, and connect Google Gemini &amp; VirusTotal APIs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer hover:opacity-80"
            style={{ backgroundColor: 'var(--cs-bg-surface)', border: '1px solid var(--cs-border)', color: 'var(--cs-text-secondary)' }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>

          {savedSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Config Saved</span>
            </div>
          )}

          {resetSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-700 text-amber-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Restored Defaults</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSaveConfig} className="space-y-6">
        {/* 1. Appearance, Light/Dark Theme & Color Swatches */}
        <div className="rounded-3xl p-6 shadow-xl space-y-6" style={{ backgroundColor: 'var(--cs-bg-card)', border: '1px solid var(--cs-border)' }}>
          <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid var(--cs-border)' }}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase font-mono tracking-wider" style={{ color: 'var(--cs-text-primary)' }}>
              <Palette className="w-4 h-4" style={{ color: 'var(--cs-accent)' }} />
              <span>Appearance, Theme Mode &amp; Color Accent</span>
            </div>
            <span className="text-[10px] font-mono" style={{ color: 'var(--cs-text-muted)' }}>
              Live Real-Time Reactive
            </span>
          </div>

          {/* Theme Mode Selector (Dark, Light, System) */}
          <div className="space-y-3">
            <span className="text-xs font-semibold" style={{ color: 'var(--cs-text-secondary)' }}>Application Canvas Mode</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                onClick={() => handleThemeModeChange("dark")}
                className="p-4 rounded-2xl transition-all cursor-pointer flex items-center gap-3"
                style={{
                  backgroundColor: themeMode === "dark" ? 'var(--cs-bg-hover)' : 'var(--cs-bg-surface)',
                  border: themeMode === "dark" ? '2px solid var(--cs-accent)' : '1px solid var(--cs-border)',
                  boxShadow: themeMode === "dark" ? '0 0 15px var(--cs-accent-glow)' : 'none',
                }}
              >
                <div className="p-2.5 rounded-xl" style={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid var(--cs-border)', color: 'var(--cs-accent)' }}>
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold" style={{ color: 'var(--cs-text-primary)' }}>Dark Obsidian</div>
                  <div className="text-[10px]" style={{ color: 'var(--cs-text-muted)' }}>Deep luxury glassmorphism</div>
                </div>
              </div>

              <div
                onClick={() => handleThemeModeChange("light")}
                className="p-4 rounded-2xl transition-all cursor-pointer flex items-center gap-3"
                style={{
                  backgroundColor: themeMode === "light" ? 'var(--cs-bg-hover)' : 'var(--cs-bg-surface)',
                  border: themeMode === "light" ? '2px solid var(--cs-accent)' : '1px solid var(--cs-border)',
                  boxShadow: themeMode === "light" ? '0 0 15px var(--cs-accent-glow)' : 'none',
                }}
              >
                <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-500">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold" style={{ color: 'var(--cs-text-primary)' }}>Light Enterprise</div>
                  <div className="text-[10px]" style={{ color: 'var(--cs-text-muted)' }}>Ultra-crisp off-white canvas</div>
                </div>
              </div>

              <div
                onClick={() => handleThemeModeChange("system")}
                className="p-4 rounded-2xl transition-all cursor-pointer flex items-center gap-3"
                style={{
                  backgroundColor: themeMode === "system" ? 'var(--cs-bg-hover)' : 'var(--cs-bg-surface)',
                  border: themeMode === "system" ? '2px solid var(--cs-accent)' : '1px solid var(--cs-border)',
                  boxShadow: themeMode === "system" ? '0 0 15px var(--cs-accent-glow)' : 'none',
                }}
              >
                <div className="p-2.5 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-400">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold" style={{ color: 'var(--cs-text-primary)' }}>System Auto</div>
                  <div className="text-[10px]" style={{ color: 'var(--cs-text-muted)' }}>Synchronize with OS</div>
                </div>
              </div>
            </div>
          </div>

          {/* Accent Color Palette Switcher */}
          <div className="space-y-3">
            <span className="text-xs font-semibold" style={{ color: 'var(--cs-text-secondary)' }}>Accent Color Swatch</span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {(Object.keys(ACCENT_PALETTES) as AccentColor[]).map((key) => {
                const item = ACCENT_PALETTES[key];
                const isSelected = accentColor === key;
                return (
                  <div
                    key={key}
                    onClick={() => handleAccentChange(key)}
                    className="p-3 rounded-2xl transition-all cursor-pointer flex flex-col items-center gap-2"
                    style={{
                      backgroundColor: isSelected ? 'var(--cs-bg-hover)' : 'var(--cs-bg-surface)',
                      border: isSelected ? `2px solid ${item.hex}` : '1px solid var(--cs-border)',
                      boxShadow: isSelected ? `0 0 12px ${item.glow}` : 'none',
                      transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-full border border-white/20 shadow-md"
                      style={{ backgroundColor: item.hex }}
                    />
                    <span className="text-[11px] font-bold text-center" style={{ color: 'var(--cs-text-secondary)' }}>
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gradient Theme Switcher */}
          <div className="space-y-3">
            <span className="text-xs font-semibold" style={{ color: 'var(--cs-text-secondary)' }}>Dynamic Aurora Gradient Theme</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(Object.keys(GRADIENT_THEMES) as GradientTheme[]).map((key) => {
                const item = GRADIENT_THEMES[key];
                const isSelected = gradientTheme === key;
                return (
                  <div
                    key={key}
                    onClick={() => handleGradientChange(key)}
                    className="p-3.5 rounded-2xl transition-all cursor-pointer space-y-2"
                    style={{
                      backgroundColor: isSelected ? 'var(--cs-bg-hover)' : 'var(--cs-bg-surface)',
                      border: isSelected ? '2px solid var(--cs-border-strong)' : '1px solid var(--cs-border)',
                      boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                    }}
                  >
                    <div
                      className="w-full h-3 rounded-full shadow-inner"
                      style={{ background: item.css }}
                    />
                    <div className="text-[11px] font-bold" style={{ color: 'var(--cs-text-primary)' }}>{item.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. Advanced Heuristics */}
        <div className="rounded-3xl p-6 shadow-xl space-y-6" style={{ backgroundColor: 'var(--cs-bg-card)', border: '1px solid var(--cs-border)' }}>
          <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid var(--cs-border)' }}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase font-mono tracking-wider" style={{ color: 'var(--cs-text-primary)' }}>
              <Sliders className="w-4 h-4" style={{ color: 'var(--cs-accent)' }} />
              <span>Advanced Heuristics &amp; Engine Parameters</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="p-4 rounded-2xl space-y-3" style={{ backgroundColor: 'var(--cs-bg-surface)', border: '1px solid var(--cs-border)' }}>
              <div className="flex items-center justify-between text-xs font-bold" style={{ color: 'var(--cs-text-primary)' }}>
                <span>Entropy Auto-Quarantine Trigger</span>
                <span className="font-mono" style={{ color: 'var(--cs-accent)' }}>{entropyThreshold} / 8.0</span>
              </div>
              <input
                type="range"
                min="6.0"
                max="8.0"
                step="0.1"
                value={entropyThreshold}
                onChange={(e) => setEntropyThreshold(parseFloat(e.target.value))}
                className="w-full accent-[#FF7A00] cursor-pointer"
              />
              <p className="text-[10px]" style={{ color: 'var(--cs-text-muted)' }}>
                Binaries exceeding this Shannon entropy threshold automatically trigger microVM sandbox isolation.
              </p>
            </div>

            <div className="p-4 rounded-2xl space-y-3" style={{ backgroundColor: 'var(--cs-bg-surface)', border: '1px solid var(--cs-border)' }}>
              <div className="flex items-center justify-between text-xs font-bold" style={{ color: 'var(--cs-text-primary)' }}>
                <span>eBPF Telemetry Stream Frequency</span>
                <span className="font-mono text-sky-400">{ebpfInterval} ms</span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={ebpfInterval}
                onChange={(e) => setEbpfInterval(parseInt(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
              <p className="text-[10px]" style={{ color: 'var(--cs-text-muted)' }}>
                Sampling frequency for ring-0 syscall interception and volumetric packet buffers.
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2" style={{ borderTop: '1px solid var(--cs-border)' }}>
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white text-xs font-bold shadow-lg transition-all cursor-pointer hover:opacity-90"
              style={{ backgroundColor: 'var(--cs-accent)' }}
            >
              <Save className="w-4 h-4" />
              <span>Save &amp; Apply All Settings</span>
            </button>

            <button
              type="button"
              onClick={handleResetToDefaults}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer hover:opacity-80"
              style={{ backgroundColor: 'var(--cs-bg-surface)', border: '1px solid var(--cs-border)', color: 'var(--cs-text-secondary)' }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default System Baseline</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default SettingsFlow;
