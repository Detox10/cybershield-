"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, AlertTriangle, RefreshCw, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export type ShieldCoreStatus = "IDLE" | "SCANNING" | "SECURE" | "WARNING" | "THREAT";

export interface ShieldCoreProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: ShieldCoreStatus;
  size?: "sm" | "md" | "lg";
  efficiency?: number;
}

export const ShieldCore: React.FC<ShieldCoreProps> = ({
  status = "SECURE",
  size = "md",
  efficiency = 99.4,
  className,
  ...props
}) => {
  const sizeStyles = {
    sm: "w-36 h-36",
    md: "w-48 h-48 sm:w-56 sm:h-56",
    lg: "w-64 h-64 sm:w-72 sm:h-72",
  };

  const statusConfig = {
    IDLE: {
      color: "#64748B",
      bgGlow: "rgba(100, 116, 139, 0.15)",
      icon: <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />,
      label: "DEFENSE READY",
    },
    SCANNING: {
      color: "#0EA5E9",
      bgGlow: "rgba(14, 165, 233, 0.25)",
      icon: <RefreshCw className="w-8 h-8 sm:w-10 sm:h-10 text-sky-400 animate-spin" />,
      label: "SCANNING ACTIVE",
    },
    SECURE: {
      color: "#10B981",
      bgGlow: "rgba(16, 185, 129, 0.25)",
      icon: <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />,
      label: "SECURE POSTURE",
    },
    WARNING: {
      color: "#F59E0B",
      bgGlow: "rgba(245, 158, 11, 0.25)",
      icon: <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 animate-pulse" />,
      label: "WARNING DEGRADED",
    },
    THREAT: {
      color: "#EF4444",
      bgGlow: "rgba(239, 68, 68, 0.35)",
      icon: <ShieldAlert className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 animate-bounce" />,
      label: "THREAT DETECTED",
    },
  };

  const current = statusConfig[status];

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center select-none",
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {/* Background Radial Glow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl transition-all duration-700 pointer-events-none"
        style={{ backgroundColor: current.bgGlow }}
      />

      {/* Rotating Outer Radar Rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        className="absolute inset-2 border border-dashed rounded-full opacity-30"
        style={{ borderColor: current.color }}
      />

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        className="absolute inset-6 border border-dotted rounded-full opacity-40"
        style={{ borderColor: current.color }}
      />

      {/* Central Interactive Orb */}
      <motion.div
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 flex flex-col items-center justify-center p-6 rounded-full bg-white/80 dark:bg-[#0E1526]/90 border border-slate-200/80 dark:border-slate-800 shadow-xl backdrop-blur-md"
      >
        <div className="mb-1">{current.icon}</div>
        <span
          className="text-[10px] sm:text-xs font-mono font-bold tracking-wider"
          style={{ color: current.color }}
        >
          {efficiency}%
        </span>
        <span className="text-[9px] text-slate-400 font-mono tracking-tighter">
          {current.label}
        </span>
      </motion.div>
    </div>
  );
};
