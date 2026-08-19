/**
 * CyberShield Elevation & Shadow Tokens
 */
export const shadows = {
  // Light Theme Shadows (Soft, layered, ambient)
  light: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
    glow: "0 0 20px -3px rgba(2, 132, 199, 0.25)",
  },

  // Dark Theme Shadows (Deep, contrast-edge, neon ambient)
  dark: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.5)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.6), 0 2px 4px -2px rgba(0, 0, 0, 0.4)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.7), 0 4px 6px -4px rgba(0, 0, 0, 0.5)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.8), 0 8px 10px -6px rgba(0, 0, 0, 0.6)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.9)",
    glow: "0 0 25px -3px rgba(56, 189, 248, 0.35)",
  },
} as const;
