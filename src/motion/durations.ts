/**
 * CyberShield Centralized Duration Tokens
 * Standard timing definitions across all UI transitions and micro-interactions.
 */

export const durations = {
  instant: 0.05, // 50ms - Micro-taps, instantaneous feedback
  fast: 0.15,    // 150ms - Hover states, button clicks, tooltips
  normal: 0.25,  // 250ms - Tab switches, card reveals, dropdowns
  medium: 0.35,  // 350ms - Modal ingress/egress, drawer transitions
  slow: 0.5,     // 500ms - Theme changes, page transitions
  relaxed: 0.8,  // 800ms - Complex sequence animations
  ambient: 2.0,  // 2000ms+ - Continuous background pulses
} as const;

export const durationsMs = {
  instant: 50,
  fast: 150,
  normal: 250,
  medium: 350,
  slow: 500,
  relaxed: 800,
  ambient: 2000,
} as const;
