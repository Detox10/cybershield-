"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, Trophy } from "lucide-react";

export const ThreatInvadersWidget: React.FC = () => {
  const [score, setScore] = useState(1480);
  const [invaders, setInvaders] = useState([
    { id: 1, color: "text-rose-500", hit: false },
    { id: 2, color: "text-emerald-500", hit: false },
    { id: 3, color: "text-purple-500", hit: false },
  ]);

  const handleShootInvader = (id: number) => {
    setInvaders((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, hit: !inv.hit } : inv))
    );
    setScore((s) => s + 100);
  };

  return (
    <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111622] p-4 shadow-xs select-none">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold font-mono tracking-wider text-slate-900 dark:text-white uppercase">
          THREAT INVADERS
        </span>
        <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded">
          SCORE: {score}
        </span>
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">
        Defend your zero-trust perimeter from the forces of zero-day attacks.
      </p>

      {/* Retro Pixel Sprites */}
      <div className="flex items-center justify-center gap-5 pt-3 pb-1">
        {invaders.map((inv) => (
          <motion.button
            key={inv.id}
            whileHover={{ scale: 1.25, rotate: 10 }}
            whileTap={{ scale: 0.85 }}
            onClick={() => handleShootInvader(inv.id)}
            className={`transition-transform cursor-pointer ${inv.color} ${
              inv.hit ? "opacity-30 line-through" : "opacity-100"
            }`}
            title="Click to intercept threat!"
          >
            {/* SVG Retro 8-bit Alien Sprites */}
            <svg
              className="w-7 h-7 fill-current filter drop-shadow-sm animate-pulse"
              viewBox="0 0 24 24"
            >
              {inv.id === 1 && (
                <path d="M6 3h2v2H6zm10 0h2v2h-2zm-8 4h8v2H8zm-2 2h12v2H6zm-2 2h16v4H4zm2 4h2v2H6zm12 0h2v2h-2zm-8 2h4v2h-4z" />
              )}
              {inv.id === 2 && (
                <path d="M8 2h8v2H8zm-4 4h16v2H4zm-2 4h20v4H2zm4 4h4v2H6zm8 0h4v2h-4zm-6 2h8v2H8z" />
              )}
              {inv.id === 3 && (
                <path d="M4 2h2v2H4zm14 0h2v2h-2zm-6 4h4v2h-4zm-6 2h16v2H6zm-2 2h20v4H4zm2 4h3v2H6zm10 0h3v2h-3zm-6 2h4v2h-4z" />
              )}
            </svg>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
export default ThreatInvadersWidget;
