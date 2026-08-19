"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Check, ArrowRight, Layers, Sparkles, Terminal, Shield, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export const MobileBentoFeatures: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [robotPoked, setRobotPoked] = useState(false);

  const STEPS = [
    {
      title: "1. Connect Figma & Code Repositories",
      desc: "Specify extracts colors, typography, elevations, and security rules automatically.",
      tokens: ["color.brand.sky", "font.heading.bold", "shadow.glow.lg"],
    },
    {
      title: "2. Zero-Trust Security Verification",
      desc: "Every token is cryptographically signed to prevent supply-chain tampering.",
      tokens: ["crypto.sha256.verified", "policy.strict.enforced", "sentinel.approved"],
    },
    {
      title: "3. Auto-Deploy Everywhere",
      desc: "Instant synchronization to Swift, Android Kotlin, React, and CSS variables.",
      tokens: ["iOS: ThemeTokens.swift", "Android: ColorTokens.kt", "Web: tokens.css"],
    },
  ];

  return (
    <section className="w-full py-10 px-4 flex flex-col items-center gap-6">
      {/* Section 1 Header */}
      <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tight leading-none text-center">
        HERE IS HOW THE <br />
        <span className="text-indigo-600 dark:text-indigo-400">STUDIO WORKS</span>
      </h2>

      {/* Feature 1: Soft Lavender Interactive Pipeline Block */}
      <div className="w-full max-w-md rounded-3xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 p-5 sm:p-6 backdrop-blur-md shadow-lg">
        {/* Step Selector Chips */}
        <div className="flex gap-2 pb-4 overflow-x-auto">
          {STEPS.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 select-none",
                activeStep === idx
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                  : "bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              )}
            >
              Step {idx + 1}
            </button>
          ))}
        </div>

        {/* Dynamic Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                {STEPS[activeStep].title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {STEPS[activeStep].desc}
              </p>
            </div>

            {/* Token Live Visualizer List */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pb-1 border-b border-slate-100 dark:border-slate-800">
                <span>ACTIVE PAYLOAD</span>
                <span className="text-emerald-500 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> VERIFIED
                </span>
              </div>
              {STEPS[activeStep].tokens.map((tok, i) => (
                <motion.div
                  key={tok}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-xs font-mono"
                >
                  <span className="text-slate-800 dark:text-slate-200">{tok}</span>
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Feature 2: High Energy Amber Gold Banner with Mascot */}
      <div className="w-full max-w-md rounded-3xl bg-[#FFB800] text-slate-950 p-6 sm:p-7 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[260px]">
        {/* Background Decorative Pattern */}
        <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none">
          <Layers className="w-48 h-48 -mr-10 -mb-10 text-black" />
        </div>

        <div className="relative z-10 space-y-2 max-w-[240px]">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-black text-amber-300 inline-block">
            AI AGENT GUARDIAN
          </span>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight">
            POWERING THE PRIDE BEHIND DESIGN SYSTEMS
          </h3>
          <p className="text-xs font-medium text-slate-900/80 leading-snug">
            Autonomous verification, accessibility scanning, and automated token transformation.
          </p>
        </div>

        {/* Mascot Robot Graphic */}
        <motion.div
          onClick={() => {
            setRobotPoked(true);
            setTimeout(() => setRobotPoked(false), 800);
          }}
          whileHover={{ scale: 1.1, rotate: 4 }}
          animate={
            robotPoked
              ? { scale: [1, 1.25, 0.9, 1], rotate: [0, -15, 15, 0] }
              : { y: [0, -6, 0] }
          }
          transition={
            robotPoked
              ? { duration: 0.6 }
              : { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }
          className="absolute right-4 bottom-5 cursor-pointer flex flex-col items-center select-none"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-black text-amber-400 border-2 border-slate-950 flex items-center justify-center shadow-2xl relative">
            <Bot className="w-9 h-9 sm:w-11 sm:h-11" />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-black flex items-center justify-center text-[8px] font-bold text-black">
              ✓
            </span>
          </div>
          <span className="text-[9px] font-black uppercase tracking-tighter mt-1 bg-black/80 text-white px-1.5 py-0.5 rounded">
            Tap Me
          </span>
        </motion.div>

        {/* Button */}
        <div className="relative z-10 pt-4">
          <button className="px-4 py-2 rounded-xl bg-black hover:bg-slate-900 text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-transform">
            <span>Explore Sentinel</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Feature 3: Electric Violet Card */}
      <div className="w-full max-w-md rounded-3xl bg-[#7C5CFF] text-white p-6 sm:p-7 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[260px]">
        <div className="space-y-2 max-w-[260px]">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-white/20 text-white inline-block backdrop-blur-sm">
            UNIVERSAL COMPATIBILITY
          </span>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight">
            OPEN BY DEFAULT, AGNOSTIC BY DESIGN
          </h3>
          <p className="text-xs text-indigo-100 font-medium leading-snug">
            Write design tokens once and export to iOS Swift, Android Jetpack Compose, Tailwind CSS, or Figma Tokens Studio.
          </p>
        </div>

        {/* Ecosystem Badges Pill Group */}
        <div className="pt-4 flex flex-wrap gap-1.5">
          {["SWIFTUI", "JETPACK COMPOSE", "TAILWIND", "REACT NATIVE", "FLUTTER"].map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 rounded-lg bg-black/30 border border-white/20 text-[10px] font-mono font-bold text-cyan-300"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="pt-4">
          <button className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-indigo-900 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-transform">
            <span>Read Specs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
