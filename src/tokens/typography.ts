/**
 * CyberShield Typography Scale
 */
export const typography = {
  fonts: {
    sans: 'var(--font-sans, "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
    mono: 'var(--font-mono, "JetBrains Mono", "Fira Code", monospace)',
  },
  weights: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  },
  sizes: {
    "2xs": { size: "0.625rem", lineHeight: "0.875rem" }, // 10px
    xs: { size: "0.75rem", lineHeight: "1rem" },          // 12px
    sm: { size: "0.875rem", lineHeight: "1.25rem" },      // 14px
    base: { size: "1rem", lineHeight: "1.5rem" },         // 16px
    lg: { size: "1.125rem", lineHeight: "1.75rem" },      // 18px
    xl: { size: "1.25rem", lineHeight: "1.75rem" },       // 20px
    "2xl": { size: "1.5rem", lineHeight: "2rem" },        // 24px
    "3xl": { size: "1.875rem", lineHeight: "2.25rem" },   // 30px
    "4xl": { size: "2.25rem", lineHeight: "2.5rem" },     // 36px
  },
} as const;
