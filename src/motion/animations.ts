/**
 * CyberShield Keyframe Animation Presets
 */

import { TargetAndTransition } from "framer-motion";

export const animations = {
  // Continuous breathing pulse for shield core
  pulseBreath: {
    scale: [1, 1.04, 1],
    opacity: [0.9, 1, 0.9],
    transition: {
      duration: 3.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  } as TargetAndTransition,

  // Continuous subtle radar sweep rotation
  radarSweep: {
    rotate: [0, 360],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "linear",
    },
  } as TargetAndTransition,

  // Threat ripple ping
  threatPing: {
    scale: [1, 2.2],
    opacity: [0.8, 0],
    transition: {
      duration: 1.8,
      repeat: Infinity,
      ease: "easeOut",
    },
  } as TargetAndTransition,

  // Telemetry dot pulse
  statusDotPulse: {
    scale: [1, 1.3, 1],
    opacity: [1, 0.6, 1],
    transition: {
      duration: 2.0,
      repeat: Infinity,
      ease: "easeInOut",
    },
  } as TargetAndTransition,
};
