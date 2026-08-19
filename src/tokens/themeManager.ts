"use client";

export type ThemeMode = "dark" | "light" | "system";
export type AccentColor = "amber" | "cyan" | "emerald" | "indigo" | "crimson";
export type GradientTheme =
  | "cyber-aurora"
  | "solar-flare"
  | "neon-cyber"
  | "deep-space"
  | "emerald-pulse";

export interface ThemeConfig {
  mode: ThemeMode;
  accent: AccentColor;
  gradient: GradientTheme;
}

export const DEFAULT_THEME: ThemeConfig = {
  mode: "light",
  accent: "crimson",
  gradient: "cyber-aurora",
};

export const ACCENT_PALETTES: Record<
  AccentColor,
  { name: string; hex: string; lightBg: string; border: string; glow: string }
> = {
  amber: {
    name: "Cyber Amber",
    hex: "#FF7A00",
    lightBg: "rgba(255, 122, 0, 0.12)",
    border: "#FF7A00",
    glow: "rgba(255, 122, 0, 0.35)",
  },
  cyan: {
    name: "Electric Cyan",
    hex: "#06B6D4",
    lightBg: "rgba(6, 182, 212, 0.12)",
    border: "#06B6D4",
    glow: "rgba(6, 182, 212, 0.35)",
  },
  emerald: {
    name: "Neon Emerald",
    hex: "#10B981",
    lightBg: "rgba(16, 185, 129, 0.12)",
    border: "#10B981",
    glow: "rgba(16, 185, 129, 0.35)",
  },
  indigo: {
    name: "Royal Indigo",
    hex: "#6366F1",
    lightBg: "rgba(99, 102, 241, 0.12)",
    border: "#6366F1",
    glow: "rgba(99, 102, 241, 0.35)",
  },
  crimson: {
    name: "Crimson Sentinel",
    hex: "#EF4444",
    lightBg: "rgba(239, 68, 68, 0.12)",
    border: "#EF4444",
    glow: "rgba(239, 68, 68, 0.35)",
  },
};

export const GRADIENT_THEMES: Record<
  GradientTheme,
  { name: string; css: string; preview: string }
> = {
  "cyber-aurora": {
    name: "Cyber Aurora",
    css: "linear-gradient(135deg, #FF7A00 0%, #06B6D4 50%, #8B5CF6 100%)",
    preview: "from-[#FF7A00] via-[#06B6D4] to-[#8B5CF6]",
  },
  "solar-flare": {
    name: "Solar Flare",
    css: "linear-gradient(135deg, #FF4500 0%, #FF7A00 50%, #FBBF24 100%)",
    preview: "from-[#FF4500] via-[#FF7A00] to-[#FBBF24]",
  },
  "neon-cyber": {
    name: "Neon Cyber",
    css: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 50%, #10B981 100%)",
    preview: "from-[#06B6D4] via-[#3B82F6] to-[#10B981]",
  },
  "deep-space": {
    name: "Deep Space Indigo",
    css: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)",
    preview: "from-[#6366F1] via-[#8B5CF6] to-[#EC4899]",
  },
  "emerald-pulse": {
    name: "Emerald Sentinel Pulse",
    css: "linear-gradient(135deg, #10B981 0%, #059669 50%, #06B6D4 100%)",
    preview: "from-[#10B981] via-[#059669] to-[#06B6D4]",
  },
};

export class ThemeManager {
  private static STORAGE_KEY = "cybershield_theme_config";

  static getTheme(): ThemeConfig {
    if (typeof window === "undefined") return DEFAULT_THEME;
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_THEME, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn("Error reading theme config:", e);
    }
    return DEFAULT_THEME;
  }

  static applyTheme(config: ThemeConfig) {
    if (typeof window === "undefined") return;

    // Save to storage
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));

    // Resolve effective mode (handle "system")
    let effectiveMode: "light" | "dark" = "dark";
    if (config.mode === "light") {
      effectiveMode = "light";
    } else if (config.mode === "system") {
      effectiveMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    // Handle dark/light mode class on <html>
    const root = document.documentElement;
    if (effectiveMode === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }

    // Inject semantic surface tokens so all components respond to theme
    if (effectiveMode === "light") {
      root.style.setProperty("--cs-bg-base", "#F1F5F9");
      root.style.setProperty("--cs-bg-sidebar", "#E8EDF5");
      root.style.setProperty("--cs-bg-card", "#FFFFFF");
      root.style.setProperty("--cs-bg-surface", "#F8FAFC");
      root.style.setProperty("--cs-bg-input", "#F1F5F9");
      root.style.setProperty("--cs-bg-hover", "#E2E8F0");
      root.style.setProperty("--cs-bg-chip", "#EFF3F8");
      root.style.setProperty("--cs-text-primary", "#0F172A");
      root.style.setProperty("--cs-text-secondary", "#334155");
      root.style.setProperty("--cs-text-muted", "#64748B");
      root.style.setProperty("--cs-border", "rgba(15,23,42,0.10)");
      root.style.setProperty("--cs-border-strong", "rgba(15,23,42,0.16)");
      root.style.setProperty("--cs-terminal-bg", "#1E293B");
      root.style.setProperty("--cs-terminal-surface", "#0F172A");
      root.style.setProperty("--background", "#F1F5F9");
      root.style.setProperty("--foreground", "#0F172A");
    } else {
      root.style.setProperty("--cs-bg-base", "#0B0C10");
      root.style.setProperty("--cs-bg-sidebar", "#0E1014");
      root.style.setProperty("--cs-bg-card", "#111317");
      root.style.setProperty("--cs-bg-surface", "#151820");
      root.style.setProperty("--cs-bg-input", "#0E1015");
      root.style.setProperty("--cs-bg-hover", "#1A1F2C");
      root.style.setProperty("--cs-bg-chip", "#161922");
      root.style.setProperty("--cs-text-primary", "#F1F5F9");
      root.style.setProperty("--cs-text-secondary", "#CBD5E1");
      root.style.setProperty("--cs-text-muted", "#64748B");
      root.style.setProperty("--cs-border", "rgba(255,255,255,0.08)");
      root.style.setProperty("--cs-border-strong", "rgba(255,255,255,0.12)");
      root.style.setProperty("--cs-terminal-bg", "#0C0E12");
      root.style.setProperty("--cs-terminal-surface", "#12151D");
      root.style.setProperty("--background", "#0B0C10");
      root.style.setProperty("--foreground", "#F1F5F9");
    }

    // Apply accent CSS variables
    const palette = ACCENT_PALETTES[config.accent] || ACCENT_PALETTES.amber;
    root.style.setProperty("--cs-accent", palette.hex);
    root.style.setProperty("--cs-accent-glow", palette.glow);
    root.style.setProperty("--cs-accent-bg", palette.lightBg);

    // Apply gradient CSS variable
    const grad = GRADIENT_THEMES[config.gradient] || GRADIENT_THEMES["cyber-aurora"];
    root.style.setProperty("--cs-gradient", grad.css);

    // Trigger custom event for real-time reactivity
    window.dispatchEvent(new CustomEvent("cybershield_theme_changed", { detail: config }));
  }

  static resetToDefault(): ThemeConfig {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.STORAGE_KEY);
    }
    this.applyTheme(DEFAULT_THEME);
    return DEFAULT_THEME;
  }
}
