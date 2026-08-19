import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Light-First Master Theme
        shield: {
          bg: "#FAFBFC",
          surface: "#FFFFFF",
          surfaceSubtle: "#F8F9FA",
          silver: "#E5E7EB",
          border: "#E2E8F0",
          borderSubtle: "rgba(226, 232, 240, 0.8)",
          glass: "rgba(255, 255, 255, 0.75)",
          glassDark: "rgba(15, 23, 42, 0.75)",
          
          // Aurora Gradient Spectrum
          sky: "#0EA5E9",
          cyan: "#06B6D4",
          teal: "#14B8A6",
          lavender: "#A78BFA",

          // Status States (Natural & Muted)
          secure: "#10B981",
          warning: "#F59E0B",
          critical: "#EF4444",
          neutral: "#6B7280",
          positive: "#059669",

          // Dark Mode specific
          darkBg: "#050811",
          darkCard: "#070B14",
          darkElevated: "#0E1526",
          darkBorder: "rgba(255, 255, 255, 0.08)",
        },
      },
      borderRadius: {
        card: "24px",
        cardSm: "20px",
        btn: "14px",
        icon: "12px",
      },
      boxShadow: {
        glass1: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        glass2: "0 4px 20px -2px rgba(0,0,0,0.06), 0 2px 6px -1px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
        glass3: "0 12px 36px -4px rgba(0,0,0,0.08), 0 4px 12px -2px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)",
        coreGlow: "0 0 50px -10px rgba(14, 165, 233, 0.35)",
        secureGlow: "0 0 50px -10px rgba(16, 185, 129, 0.35)",
        warningGlow: "0 0 50px -10px rgba(245, 158, 11, 0.35)",
        threatGlow: "0 0 50px -10px rgba(239, 68, 68, 0.35)",
      },
      backgroundImage: {
        "aurora-gradient": "linear-gradient(135deg, #0EA5E9 0%, #06B6D4 35%, #14B8A6 70%, #A78BFA 100%)",
        "aurora-subtle": "linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(6, 182, 212, 0.08) 35%, rgba(20, 184, 166, 0.08) 70%, rgba(167, 139, 250, 0.08) 100%)",
        "shield-radial": "radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.12) 0%, transparent 70%)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 12s linear infinite",
        "shimmer": "shimmer 2s infinite linear",
        "breath": "breath 3.5s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        breath: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.95" },
          "50%": { transform: "scale(1.05)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
