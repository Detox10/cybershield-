"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Sparkles, Key, Palette, Layers, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TokenItem {
  id: string;
  name: string;
  value: string;
  category: "color" | "spacing" | "crypto" | "defense" | "font" | "elevation";
  colorClass: string;
  bgClass: string;
  borderClass: string;
  icon: React.ReactNode;
  initialPos: { top?: string; bottom?: string; left?: string; right?: string };
  tilt: number;
  floatDuration: number;
  delay: number;
}

const SAMPLE_TOKENS: TokenItem[] = [
  {
    id: "token-pink",
    name: "color.critical",
    value: "#FF2E7E",
    category: "color",
    colorClass: "text-white",
    bgClass: "bg-[#FF2E7E] shadow-lg shadow-pink-500/30",
    borderClass: "border-pink-300/40",
    icon: <Palette className="w-3.5 h-3.5" />,
    initialPos: { top: "-14px", left: "-8px" },
    tilt: -8,
    floatDuration: 4.2,
    delay: 0,
  },
  {
    id: "token-green",
    name: "shield.status",
    value: "ZERO_TRUST",
    category: "defense",
    colorClass: "text-emerald-950 font-bold",
    bgClass: "bg-[#74F292] shadow-lg shadow-emerald-500/25",
    borderClass: "border-emerald-300/50",
    icon: <Shield className="w-3.5 h-3.5 text-emerald-900" />,
    initialPos: { top: "-18px", right: "-6px" },
    tilt: 7,
    floatDuration: 5.1,
    delay: 0.4,
  },
  {
    id: "token-orange",
    name: "encryption.key",
    value: "AES-256-GCM",
    category: "crypto",
    colorClass: "text-white font-mono",
    bgClass: "bg-[#FF6B4A] shadow-lg shadow-orange-500/30",
    borderClass: "border-orange-300/40",
    icon: <Key className="w-3.5 h-3.5" />,
    initialPos: { bottom: "40px", right: "-12px" },
    tilt: 10,
    floatDuration: 4.8,
    delay: 0.8,
  },
  {
    id: "token-purple",
    name: "token.sync",
    value: "2,480 / sec",
    category: "spacing",
    colorClass: "text-white font-mono",
    bgClass: "bg-[#7C5CFF] shadow-lg shadow-indigo-500/30",
    borderClass: "border-indigo-300/40",
    icon: <Layers className="w-3.5 h-3.5" />,
    initialPos: { top: "35%", left: "-14px" },
    tilt: -12,
    floatDuration: 4.5,
    delay: 0.2,
  },
  {
    id: "token-yellow",
    name: "ai.sentinel",
    value: "GPT-4o SEC",
    category: "elevation",
    colorClass: "text-amber-950 font-bold",
    bgClass: "bg-[#FFD23F] shadow-lg shadow-amber-500/25",
    borderClass: "border-amber-300/60",
    icon: <Sparkles className="w-3.5 h-3.5 text-amber-900" />,
    initialPos: { bottom: "-12px", left: "10px" },
    tilt: -5,
    floatDuration: 5.6,
    delay: 0.6,
  },
  {
    id: "token-dark",
    name: "threat.containment",
    value: "AUTONOMOUS",
    category: "defense",
    colorClass: "text-cyan-300 font-mono",
    bgClass: "bg-[#131826] shadow-xl shadow-black/40",
    borderClass: "border-cyan-500/40",
    icon: <Cpu className="w-3.5 h-3.5 text-cyan-400" />,
    initialPos: { bottom: "-18px", right: "20px" },
    tilt: 6,
    floatDuration: 4.0,
    delay: 1.0,
  },
];

export const FloatingMotionTokens: React.FC = () => {
  const [activeToken, setActiveToken] = useState<TokenItem | null>(null);

  return (
    <div className="relative w-full h-full pointer-events-none">
      {SAMPLE_TOKENS.map((token) => (
        <motion.div
          key={token.id}
          drag
          dragConstraints={{ left: -20, right: 20, top: -20, bottom: 20 }}
          dragElastic={0.2}
          whileDrag={{ scale: 1.15, cursor: "grabbing" }}
          style={{
            position: "absolute",
            ...token.initialPos,
            zIndex: activeToken?.id === token.id ? 40 : 20,
          }}
          animate={{
            y: [0, -10, 0],
            rotate: [token.tilt, token.tilt + (token.tilt > 0 ? 3 : -3), token.tilt],
          }}
          transition={{
            duration: token.floatDuration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: token.delay,
          }}
          whileHover={{
            scale: 1.12,
            rotate: 0,
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveToken(token)}
          className={cn(
            "pointer-events-auto cursor-pointer select-none rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 border flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold backdrop-blur-md transition-shadow",
            token.bgClass,
            token.colorClass,
            token.borderClass
          )}
        >
          {token.icon}
          <span className="hidden sm:inline opacity-80">{token.name}:</span>
          <span className="tracking-tight">{token.value}</span>
        </motion.div>
      ))}

      {/* Active Token Inspector Popover */}
      <AnimatePresence>
        {activeToken && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="pointer-events-auto absolute z-50 bottom-2 left-1/2 -translate-x-1/2 w-[90%] max-w-xs bg-slate-900/95 text-white p-3.5 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-xl flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                Design Token Inspected
              </span>
              <button
                onClick={() => setActiveToken(null)}
                className="text-xs text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn("p-1.5 rounded-lg", activeToken.bgClass)}>
                {activeToken.icon}
              </div>
              <div>
                <p className="text-xs font-bold font-mono">{activeToken.name}</p>
                <p className="text-[11px] text-cyan-400 font-mono">{activeToken.value}</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              Synced across Figma, iOS Swift, Android Kotlin, and Tailwind CSS in real time.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
