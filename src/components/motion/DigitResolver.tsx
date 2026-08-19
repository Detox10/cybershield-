"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface DigitResolverProps {
  value: string | number;
  durationMs?: number;
  className?: string;
  delayMs?: number;
}

const DOT_GLYPHS = ["·", ":", "∷", "⠿", "⚬", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export const DigitResolver: React.FC<DigitResolverProps> = ({
  value,
  durationMs = 180,
  className = "",
  delayMs = 0,
}) => {
  const finalStr = String(value);
  const [displayStr, setDisplayStr] = useState<string>(finalStr);
  const [isResolved, setIsResolved] = useState(false);

  useEffect(() => {
    let frameId: number;
    let timeoutId: NodeJS.Timeout;
    const startTime = performance.now() + delayMs;

    setIsResolved(false);

    timeoutId = setTimeout(() => {
      const updateGlyphs = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);

        if (progress < 1) {
          // Scramble characters based on progress
          const resolvedCount = Math.floor(progress * finalStr.length);
          let scrambled = "";

          for (let i = 0; i < finalStr.length; i++) {
            const char = finalStr[i];
            // Don't scramble punctuation or units (%, GB, ms, commas)
            if (char === "." || char === "%" || char === "," || char === " " || char === "G" || char === "B" || char === "m" || char === "s") {
              scrambled += char;
            } else if (i < resolvedCount) {
              scrambled += char;
            } else {
              scrambled += DOT_GLYPHS[Math.floor(Math.random() * DOT_GLYPHS.length)];
            }
          }

          setDisplayStr(scrambled);
          frameId = requestAnimationFrame(updateGlyphs);
        } else {
          setDisplayStr(finalStr);
          setIsResolved(true);
        }
      };

      frameId = requestAnimationFrame(updateGlyphs);
    }, delayMs);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(frameId);
    };
  }, [value, durationMs, delayMs, finalStr]);

  return (
    <span
      className={`font-mono transition-opacity duration-100 ${
        isResolved ? "opacity-100 font-bold" : "opacity-90 tracking-wider text-teal-600 dark:text-teal-400"
      } ${className}`}
    >
      {displayStr}
    </span>
  );
};
export default DigitResolver;
