/**
 * CyberShield Hover & Press Micro-Interactions
 */

import { TargetAndTransition } from "framer-motion";
import { easings } from "./easing";

export const hoverPresets = {
  // Button standard hover
  buttonHover: {
    y: -1.5,
    transition: { duration: 0.15, ease: easings.smoothOut },
  } as TargetAndTransition,

  // Button tap press
  buttonTap: {
    scale: 0.98,
    y: 0,
    transition: { duration: 0.05 },
  } as TargetAndTransition,

  // Card lift on hover
  cardHover: {
    y: -3,
    transition: { duration: 0.2, ease: easings.smoothOut },
  } as TargetAndTransition,

  // Icon glow hover
  iconHover: {
    scale: 1.1,
    transition: { duration: 0.15, ease: easings.smoothOut },
  } as TargetAndTransition,

  // Subtle pill tab scale
  tabHover: {
    scale: 1.02,
    transition: { duration: 0.12 },
  } as TargetAndTransition,
};
