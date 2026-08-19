"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { ShieldCheck, Zap, Activity } from "lucide-react";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { cn } from "@/lib/utils";

export interface HeroProps extends HTMLMotionProps<"div"> {
  onScanClick?: () => void;
  onSimulateClick?: () => void;
  systemHealth?: number;
  activeThreatCount?: number;
}

export const Hero: React.FC<HeroProps> = ({
  onScanClick,
  onSimulateClick,
  systemHealth = 99.4,
  activeThreatCount = 0,
  className,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "glass-card p-6 sm:p-8 rounded-card relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6",
        className
      )}
      {...props}
    >
      <div className="space-y-2 max-w-xl">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secure" ping>
            DEFCON 5 — NOMINAL
          </Badge>
          <Badge variant="sky" icon={<Activity className="w-3 h-3" />}>
            ZERO-TRUST SENTINEL ACTIVE
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Autonomous Cybersecurity Command
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Continuous zero-trust perimeter telemetry, deep binary packet disassembly, and autonomous AI breach mitigation.
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {onScanClick && (
          <Button
            variant="glow"
            size="md"
            onClick={onScanClick}
            leftIcon={<ShieldCheck className="w-4 h-4" />}
          >
            Initiate System Scan
          </Button>
        )}
        {onSimulateClick && (
          <Button
            variant="outline"
            size="md"
            onClick={onSimulateClick}
            leftIcon={<Zap className="w-4 h-4" />}
          >
            Simulate Attack
          </Button>
        )}
      </div>
    </motion.div>
  );
};
