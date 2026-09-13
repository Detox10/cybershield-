"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Inbox,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { Button } from "./Button";
import { Skeleton } from "./Skeleton";
import { cn } from "@/lib/utils";

export type StateViewStatus = "nominal" | "loading" | "empty" | "error" | "warning" | "success";

export interface StateViewProps {
  status: StateViewStatus;
  children: React.ReactNode;
  
  // Customization props for the 5 states
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  
  // Secondary action
  secondaryLabel?: string;
  onSecondaryAction?: () => void;

  // Custom skeleton count for loading state
  skeletonRows?: number;
  skeletonType?: "cards" | "table" | "detail";
  className?: string;
}

export const StateView: React.FC<StateViewProps> = ({
  status,
  children,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  secondaryLabel,
  onSecondaryAction,
  skeletonRows = 3,
  skeletonType = "cards",
  className,
}) => {
  // 1. NOMINAL STATE: Render children normally
  if (status === "nominal") {
    return <>{children}</>;
  }

  // 2. LOADING STATE: Shimmering bones
  if (status === "loading") {
    return (
      <div className={cn("w-full space-y-4 p-6", className)}>
        {skeletonType === "cards" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: skeletonRows }).map((_, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24 rounded-md" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
                <Skeleton className="h-8 w-16 rounded-md" />
                <Skeleton className="h-3 w-36 rounded-md" />
              </div>
            ))}
          </div>
        )}

        {skeletonType === "table" && (
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 space-y-3">
            <div className="flex justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-5 w-20 rounded-md" />
            </div>
            {Array.from({ length: skeletonRows }).map((_, index) => (
              <div key={`msg-${index}`} className="flex items-start gap-3 text-left py-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-40 rounded-md" />
                    <Skeleton className="h-3 w-24 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        )}

        {skeletonType === "detail" && (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <Skeleton className="h-7 w-48 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <div className="pt-4 flex gap-3">
              <Skeleton className="h-10 w-28 rounded-xl" />
              <Skeleton className="h-10 w-28 rounded-xl" />
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. EMPTY STATE
  if (status === "empty") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "w-full p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 text-center flex flex-col items-center justify-center space-y-4 shadow-sm",
          className
        )}
      >
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center shadow-inner">
          <Inbox className="w-8 h-8 stroke-[1.5]" />
        </div>
        <div className="max-w-md space-y-1.5">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {title || "No Records Available"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {description || "There is currently no telemetry or data matching your selected filters."}
          </p>
        </div>
        {actionLabel && (
          <div className="pt-2 flex items-center gap-3">
            <Button onClick={onAction} variant="primary" size="md">
              {actionIcon}
              <span>{actionLabel}</span>
            </Button>
            {secondaryLabel && (
              <Button onClick={onSecondaryAction} variant="outline" size="md">
                {secondaryLabel}
              </Button>
            )}
          </div>
        )}
      </motion.div>
    );
  }

  // 4. ERROR STATE
  if (status === "error") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "w-full p-8 sm:p-12 rounded-3xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-center flex flex-col items-center justify-center space-y-4",
          className
        )}
      >
        <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center shadow-sm">
          <AlertOctagon className="w-8 h-8 stroke-[1.75]" />
        </div>
        <div className="max-w-md space-y-1.5">
          <h3 className="text-base sm:text-lg font-bold text-red-950 dark:text-red-200">
            {title || "Security Service Connection Failed"}
          </h3>
          <p className="text-xs sm:text-sm text-red-700 dark:text-red-400 leading-relaxed">
            {description || "Unable to establish encrypted handshake with the daemon node. Kernel hooks temporarily unreachable."}
          </p>
        </div>
        <div className="pt-2 flex items-center gap-3">
          <Button
            onClick={onAction}
            variant="destructive"
            size="md"
            className="shadow-md shadow-red-500/20"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{actionLabel || "Retry Handshake"}</span>
          </Button>
        </div>
      </motion.div>
    );
  }

  // 5. WARNING STATE
  if (status === "warning") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "w-full p-6 sm:p-8 rounded-3xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row items-center sm:items-start gap-4",
          className
        )}
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-6 h-6 stroke-[2]" />
        </div>
        <div className="flex-1 text-center sm:text-left space-y-1">
          <h4 className="text-sm sm:text-base font-bold text-amber-950 dark:text-amber-200">
            {title || "Security Advisory & Remediation Required"}
          </h4>
          <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-400 leading-relaxed">
            {description || "Zero-Trust policy detected unsigned binary execution in memory heap."}
          </p>
        </div>
        {actionLabel && (
          <Button onClick={onAction} variant="outline" size="sm" className="shrink-0 border-amber-300 text-amber-900 dark:text-amber-200">
            <span>{actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        )}
      </motion.div>
    );
  }

  // 6. SUCCESS STATE
  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "w-full p-8 sm:p-12 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-center flex flex-col items-center justify-center space-y-4",
          className
        )}
      >
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
          <CheckCircle2 className="w-8 h-8 stroke-[2]" />
        </div>
        <div className="max-w-md space-y-1.5">
          <h3 className="text-base sm:text-lg font-bold text-emerald-950 dark:text-emerald-200">
            {title || "Perimeter Clean & Verified"}
          </h3>
          <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-400 leading-relaxed">
            {description || "All 128 device nodes, memory heaps, and network sockets successfully verified with RSA-4096 zero-trust signature."}
          </p>
        </div>
        {actionLabel && (
          <div className="pt-2">
            <Button onClick={onAction} variant="primary" size="md" className="bg-emerald-600 hover:bg-emerald-500">
              {actionIcon}
              <span>{actionLabel}</span>
            </Button>
          </div>
        )}
      </motion.div>
    );
  }

  return <>{children}</>;
};
