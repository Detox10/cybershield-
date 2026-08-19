/**
 * CyberShield Enterprise Design System - Color Tokens
 * Light-theme primary experience with refined dark theme support
 */

export const colors = {
  // Brand Primary & Accents
  primary: {
    50: "#F0F9FF",
    100: "#E0F2FE",
    200: "#BAE6FD",
    300: "#7DD3FC",
    400: "#38BDF8",
    500: "#0EA5E9",
    600: "#0284C7", // Core Primary Light
    700: "#0369A1",
    800: "#075985",
    900: "#0C4A6E",
    950: "#082F49",
  },

  // Light Theme Semantic Surfaces & Text (Primary Experience)
  light: {
    background: "#F8FAFC", // Main application canvas
    surface: "#FFFFFF",    // Primary card/modal surface
    surfaceSubtle: "#F1F5F9",
    surfaceMuted: "#E2E8F0",
    border: "#E2E8F0",
    borderHover: "#CBD5E1",
    borderFocus: "#0284C7",
    
    textPrimary: "#0F172A",   // Slate 900
    textSecondary: "#475569", // Slate 600
    textMuted: "#94A3B8",     // Slate 400
    textInverse: "#FFFFFF",
  },

  // Dark Theme Semantic Surfaces & Text
  dark: {
    background: "#070B14", // Deep Navy/Onyx
    surface: "#0E1526",    // Dark Slate Card
    surfaceSubtle: "#162035",
    surfaceMuted: "#1E2C48",
    border: "rgba(255, 255, 255, 0.08)",
    borderHover: "rgba(255, 255, 255, 0.16)",
    borderFocus: "#38BDF8",

    textPrimary: "#F8FAFC",
    textSecondary: "#94A3B8",
    textMuted: "#64748B",
    textInverse: "#0F172A",
  },

  // Status & Severity Colors (WCAG AA Compliant in both themes)
  status: {
    success: {
      light: "#059669",
      lightBg: "#ECFDF5",
      lightBorder: "#A7F3D0",
      dark: "#10B981",
      darkBg: "rgba(16, 185, 129, 0.12)",
      darkBorder: "rgba(16, 185, 129, 0.25)",
    },
    warning: {
      light: "#D97706",
      lightBg: "#FFFBEB",
      lightBorder: "#FDE68A",
      dark: "#F59E0B",
      darkBg: "rgba(245, 158, 11, 0.12)",
      darkBorder: "rgba(245, 158, 11, 0.25)",
    },
    critical: {
      light: "#DC2626",
      lightBg: "#FEF2F2",
      lightBorder: "#FECACA",
      dark: "#EF4444",
      darkBg: "rgba(239, 68, 68, 0.12)",
      darkBorder: "rgba(239, 68, 68, 0.25)",
    },
    info: {
      light: "#0284C7",
      lightBg: "#F0F9FF",
      lightBorder: "#BAE6FD",
      dark: "#38BDF8",
      darkBg: "rgba(56, 189, 248, 0.12)",
      darkBorder: "rgba(56, 189, 248, 0.25)",
    },
  },
} as const;

export type ColorTokens = typeof colors;
