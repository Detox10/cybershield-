/**
 * CyberShield Loading & Telemetry Motion
 */

import { TargetAndTransition } from "framer-motion";

export const loadingMotion = {
  // Continuous smooth spinner rotation
  spinner: {
    rotate: 360,
    transition: {
      duration: 0.9,
      repeat: Infinity,
      ease: "linear",
    },
  } as TargetAndTransition,

  // Shimmer pulse for skeletons
  shimmerPulse: {
    opacity: [0.4, 0.8, 0.4],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  } as TargetAndTransition,

  // Scanning laser / line animation
  scanLaser: {
    y: ["0%", "100%", "0%"],
    transition: {
      duration: 2.2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  } as TargetAndTransition,
};
