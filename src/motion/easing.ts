/**
 * CyberShield Easing Curves & Spring Physics
 */

export const easings = {
  // Ultra-smooth deceleration for natural UI entrances
  smoothOut: [0.16, 1, 0.3, 1] as [number, number, number, number],
  
  // Sharp acceleration for quick dismissals and exits
  sharpIn: [0.4, 0, 1, 1] as [number, number, number, number],
  
  // Symmetrical fluid curve for continuous state transitions
  fluidInOut: [0.4, 0, 0.2, 1] as [number, number, number, number],

  // Anticipation curve with slight overshoot
  anticipate: [0.34, 1.56, 0.64, 1] as [number, number, number, number],

  // Standard CSS-compatible cubic-bezier strings
  cssSmooth: "cubic-bezier(0.16, 1, 0.3, 1)",
  cssSharp: "cubic-bezier(0.4, 0, 1, 1)",
  cssFluid: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

export const springs = {
  // Snappy spring for buttons, tabs, pills
  snappy: {
    type: "spring",
    stiffness: 400,
    damping: 30,
  },
  
  // Smooth spring for modals, sheets, sidebars
  smooth: {
    type: "spring",
    stiffness: 260,
    damping: 25,
  },
  
  // Gentle spring for floating widgets and tooltips
  gentle: {
    type: "spring",
    stiffness: 180,
    damping: 20,
  },
  
  // Bouncy spring for status icons, checkmarks, badges
  bouncy: {
    type: "spring",
    stiffness: 350,
    damping: 15,
  },
} as const;
