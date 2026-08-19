/**
 * CyberShield Page & Tab Transition Variants
 */

import { Variants } from "framer-motion";
import { easings } from "./easing";

export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 6,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: easings.smoothOut,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: {
      duration: 0.15,
      ease: easings.sharpIn,
    },
  },
};

export const tabSlideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 15 : -15,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.25,
      ease: easings.smoothOut,
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 15 : -15,
    opacity: 0,
    transition: {
      duration: 0.18,
      ease: easings.sharpIn,
    },
  }),
};
