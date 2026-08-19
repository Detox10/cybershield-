"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Sparkles, ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import GeometricSecurityGauge from "./GeometricSecurityGauge";

interface WelcomeSequenceProps {
  onComplete: () => void;
  userName?: string;
  threatDetected?: boolean;
}

export default function WelcomeSequence({
  onComplete,
  userName = "Himanshu",
  threatDetected = false,
}: WelcomeSequenceProps) {
  const [taglineIdx, setTaglineIdx] = useState(0);

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const taglines = [
    "Secure by Intelligence. Protected by Design.",
    "Quiet protection. Intelligent decisions.",
    "CyberShield never sleeps, so you don't have to worry.",
  ];

  useEffect(() => {
    // Cycle tagline gently
    const taglineTimer = setTimeout(() => {
      setTaglineIdx((prev) => (prev + 1) % taglines.length);
    }, 1100);

    // Complete splash sequence at ~2.2s
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2400);

    return () => {
      clearTimeout(taglineTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, taglines.length]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAFBFC] dark:bg-[#070A12] select-none px-6"
    >
      {/* Subtle Aurora Ambient Light Veil */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 0.7, scale: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[750px] h-[550px] bg-gradient-to-b from-sky-400/20 via-teal-400/15 to-transparent dark:from-sky-500/20 dark:via-teal-500/10 rounded-full blur-[110px]"
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-lg w-full text-center space-y-7">
        {/* Geometric Shield Emblem with Shared Element Physics */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center"
        >
          <div className="relative p-2">
            <GeometricSecurityGauge
              size="compact"
              score={96}
              state={threatDetected ? "THREAT" : "SECURE"}
              showScore={false}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="w-5 h-5 text-sky-600 dark:text-cyan-400 fill-sky-500/10" />
            </div>
          </div>
        </motion.div>

        {/* Personalized Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-2"
        >
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {getGreeting()}, {userName}.
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-normal max-w-md mx-auto leading-relaxed">
            CyberShield AI has been protecting your digital environment while you were away.
          </p>
        </motion.div>

        {/* Elegant Rotating Tagline Capsule */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="min-h-[46px] flex items-center justify-center"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={taglineIdx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.35 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-sm text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-500 dark:text-cyan-400 shrink-0" />
              <span>{taglines[taglineIdx]}</span>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Subtle Progress Bar & Quick Enter Trigger */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center space-y-3 pt-3"
        >
          <div className="w-36 h-[2px] bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.3, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-sky-500 via-teal-400 to-indigo-500"
            />
          </div>

          <button
            onClick={onComplete}
            className="text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex items-center gap-1 group"
          >
            <span>Enter Command Center</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
