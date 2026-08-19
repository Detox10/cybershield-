"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, CheckCircle2, AlertTriangle, AlertOctagon, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NotificationProps {
  id?: string;
  type?: "info" | "success" | "warning" | "error";
  title: string;
  description?: string;
  timestamp?: string;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const Notification: React.FC<NotificationProps> = ({
  type = "info",
  title,
  description,
  timestamp,
  onDismiss,
  action,
  className,
}) => {
  const iconMap = {
    info: <Info className="w-5 h-5 text-sky-500 shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    error: <AlertOctagon className="w-5 h-5 text-red-500 shrink-0" />,
  };

  const borderStyles = {
    info: "border-sky-500/30 bg-sky-50/50 dark:bg-sky-950/20",
    success: "border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20",
    warning: "border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20",
    error: "border-red-500/30 bg-red-50/50 dark:bg-red-950/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "p-4 rounded-cardSm border backdrop-blur-md shadow-lg flex gap-3 items-start relative select-none",
        borderStyles[type],
        className
      )}
    >
      <div className="pt-0.5">{iconMap[type]}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h4>
          {timestamp && (
            <span className="text-[11px] font-mono text-slate-400">{timestamp}</span>
          )}
        </div>
        {description && (
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {description}
          </p>
        )}
        {action && (
          <button
            onClick={action.onClick}
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline pt-1 block"
          >
            {action.label}
          </button>
        )}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
};
