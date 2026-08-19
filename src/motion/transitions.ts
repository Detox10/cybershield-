/**
 * CyberShield Standardized Transitions
 */

import { Transition } from "framer-motion";
import { durations } from "./durations";
import { easings, springs } from "./easing";

export const transitions = {
  // Micro interaction transitions
  fast: {
    duration: durations.fast,
    ease: easings.smoothOut,
  } as Transition,

  normal: {
    duration: durations.normal,
    ease: easings.smoothOut,
  } as Transition,

  medium: {
    duration: durations.medium,
    ease: easings.smoothOut,
  } as Transition,

  slow: {
    duration: durations.slow,
    ease: easings.smoothOut,
  } as Transition,

  // Spring based transitions
  springSnappy: springs.snappy as Transition,
  springSmooth: springs.smooth as Transition,
  springGentle: springs.gentle as Transition,
  springBouncy: springs.bouncy as Transition,

  // Staggered transitions
  stagger: (staggerDelay = 0.05, delayChildren = 0.02): Transition => ({
    staggerChildren: staggerDelay,
    delayChildren: delayChildren,
  }),
};
