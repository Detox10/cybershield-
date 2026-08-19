"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DotGridTransitionProps {
  viewKey: string;
  children: React.ReactNode;
}

export const DotGridTransition: React.FC<DotGridTransitionProps> = ({
  viewKey,
  children,
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={viewKey}
        initial={{ opacity: 0, filter: "blur(2px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(2px)" }}
        transition={{
          duration: 0.24,
          ease: [0.65, 0, 0.35, 1], // Exact primary mechanical curve
        }}
        className="w-full relative"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
export default DotGridTransition;
