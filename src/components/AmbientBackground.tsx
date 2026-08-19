"use client";

import React, { useEffect, useState } from "react";
import { ShieldCoreState } from "@/types/cybershield";

interface AmbientBackgroundProps {
  state?: ShieldCoreState;
}

export default function AmbientBackground({ state = "SECURE" }: AmbientBackgroundProps) {
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "afternoon" | "evening">("morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay("morning");
    else if (hour >= 12 && hour < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");
  }, []);

  const gradients = {
    morning: {
      light: "from-sky-100/40 via-slate-50 to-transparent",
      dark: "from-sky-950/20 via-[#070A12] to-transparent",
      secondary: "bg-sky-400/5 dark:bg-sky-500/5",
    },
    afternoon: {
      light: "from-blue-100/30 via-slate-50 to-transparent",
      dark: "from-indigo-950/20 via-[#070A12] to-transparent",
      secondary: "bg-indigo-400/5 dark:bg-indigo-500/5",
    },
    evening: {
      light: "from-indigo-100/40 via-slate-50 to-transparent",
      dark: "from-violet-950/25 via-[#070A12] to-transparent",
      secondary: "bg-violet-400/5 dark:bg-violet-500/5",
    },
  }[timeOfDay];

  // Threat override subtle tint
  const isThreat = state === "THREAT" || state === "WARNING";

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-colors duration-1000">
      {/* Top Main Radial Ambient Halo */}
      <div
        className={`absolute -top-32 left-1/3 -translate-x-1/2 w-[700px] h-[550px] rounded-full blur-[130px] transition-all duration-1000 ${
          isThreat
            ? "bg-rose-500/10 dark:bg-rose-500/10"
            : gradients.secondary
        }`}
      />

      {/* Bottom Secondary Glow */}
      <div
        className={`absolute -bottom-40 right-10 w-[600px] h-[500px] rounded-full blur-[140px] transition-all duration-1000 ${
          isThreat
            ? "bg-amber-500/5 dark:bg-amber-500/5"
            : "bg-slate-300/10 dark:bg-indigo-900/10"
        }`}
      />

      {/* Fine architectural mesh grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-80" />
    </div>
  );
}
