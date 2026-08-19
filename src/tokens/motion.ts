/**
 * CyberShield Motion Tokens
 */
export const motionTokens = {
  durations: {
    instant: 0.1,
    fast: 0.15,
    normal: 0.25,
    deliberate: 0.4,
    slow: 0.7,
  },
  easings: {
    standard: [0.2, 0, 0, 1] as const,
    decelerate: [0, 0, 0.2, 1] as const,
    accelerate: [0.4, 0, 1, 1] as const,
    spring: { type: "spring", stiffness: 350, damping: 28 },
    bouncy: { type: "spring", stiffness: 450, damping: 20 },
  },
} as const;
