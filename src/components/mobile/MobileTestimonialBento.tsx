"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Heart, CheckCircle, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

export const MobileTestimonialBento: React.FC = () => {
  const [likes, setLikes] = useState<{ [key: string]: number }>({
    t1: 42,
    t2: 89,
    t3: 57,
    t4: 114,
  });

  const toggleLike = (id: string) => {
    setLikes((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  return (
    <section className="w-full py-10 px-4 flex flex-col items-center gap-6">
      <div className="text-center max-w-md">
        <span className="text-[11px] font-bold font-mono text-sky-500 uppercase tracking-widest">
          SOCIAL PROOF
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tight leading-tight mt-1">
          TRUSTED BY TEAMS WHO TAKE <br />
          <span className="text-pink-500">SYSTEMS SERIOUSLY</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-md">
        {/* Card 1: Crimson Wine Block */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-5 rounded-3xl bg-[#2A080C] text-pink-100 border border-pink-900/50 shadow-lg flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-pink-500/20 text-pink-400 border border-pink-500/30">
              LEAD ARCHITECT
            </span>
            <button
              onClick={() => toggleLike("t1")}
              className="flex items-center gap-1 text-[11px] text-pink-300 hover:text-white transition-colors"
            >
              <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
              <span>{likes.t1}</span>
            </button>
          </div>
          <p className="text-xs font-medium leading-relaxed text-pink-50">
            &ldquo;Specifying design tokens and security telemetry saved our team over 40 hours every sprint release.&rdquo;
          </p>
          <div className="flex items-center gap-2 pt-1 border-t border-pink-900/40">
            <div className="w-6 h-6 rounded-full bg-pink-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">
              E
            </div>
            <div>
              <p className="text-[11px] font-bold text-white">Elena Rostova</p>
              <p className="text-[9px] text-pink-400">Head of Design Systems @ FinTech</p>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Soft Lavender Block */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-5 rounded-3xl bg-[#F0ECFC] dark:bg-[#1A162B] text-slate-900 dark:text-purple-100 border border-purple-200 dark:border-purple-900/60 shadow-lg flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-purple-200 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300">
              MOBILE LEAD
            </span>
            <button
              onClick={() => toggleLike("t2")}
              className="flex items-center gap-1 text-[11px] text-purple-600 dark:text-purple-300 hover:text-purple-900 transition-colors"
            >
              <Heart className="w-3.5 h-3.5 fill-purple-500 text-purple-500" />
              <span>{likes.t2}</span>
            </button>
          </div>
          <p className="text-xs font-medium leading-relaxed text-slate-800 dark:text-purple-100">
            &ldquo;The single source of truth that bridged Figma to native iOS SwiftUI and Android Jetpack flawlessly.&rdquo;
          </p>
          <div className="flex items-center gap-2 pt-1 border-t border-purple-200 dark:border-purple-900/40">
            <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[10px]">
              M
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-950 dark:text-white">Marcus Vance</p>
              <p className="text-[9px] text-purple-600 dark:text-purple-400">VP Engineering @ HyperScale</p>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Deep Forest Olive Block */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-5 rounded-3xl bg-[#0F2317] text-emerald-100 border border-emerald-900/50 shadow-lg flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              CISO VERIFIED
            </span>
            <button
              onClick={() => toggleLike("t3")}
              className="flex items-center gap-1 text-[11px] text-emerald-300 hover:text-white transition-colors"
            >
              <Heart className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
              <span>{likes.t3}</span>
            </button>
          </div>
          <p className="text-xs font-medium leading-relaxed text-emerald-50">
            &ldquo;Zero-Trust token signature verification stopped a poisoned dependency before it reached production.&rdquo;
          </p>
          <div className="flex items-center gap-2 pt-1 border-t border-emerald-900/40">
            <div className="w-6 h-6 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-bold text-[10px]">
              S
            </div>
            <div>
              <p className="text-[11px] font-bold text-white">Sarah Jenkins</p>
              <p className="text-[9px] text-emerald-400">Chief Security Officer @ Apex</p>
            </div>
          </div>
        </motion.div>

        {/* Card 4: Soft Pink Rose Block */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-5 rounded-3xl bg-[#FFF0F5] dark:bg-[#2B1420] text-slate-900 dark:text-pink-100 border border-pink-200 dark:border-pink-900/60 shadow-lg flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-pink-200 dark:bg-pink-900/50 text-pink-800 dark:text-pink-300">
              DESIGN DIRECTOR
            </span>
            <button
              onClick={() => toggleLike("t4")}
              className="flex items-center gap-1 text-[11px] text-pink-600 dark:text-pink-300 hover:text-pink-900 transition-colors"
            >
              <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
              <span>{likes.t4}</span>
            </button>
          </div>
          <p className="text-xs font-medium leading-relaxed text-slate-800 dark:text-pink-100">
            &ldquo;Design system adoption across our 200+ mobile developers surged from 30% to 98% in just 3 weeks.&rdquo;
          </p>
          <div className="flex items-center gap-2 pt-1 border-t border-pink-200 dark:border-pink-900/40">
            <div className="w-6 h-6 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold text-[10px]">
              D
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-950 dark:text-white">David Klien</p>
              <p className="text-[9px] text-pink-600 dark:text-pink-400">Design Operations @ CloudScale</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
