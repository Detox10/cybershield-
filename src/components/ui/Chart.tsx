"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  delta?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  sparklineData?: number[];
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  delta,
  isPositive = true,
  icon,
  sparklineData = [35, 45, 30, 60, 75, 50, 85],
  className,
  ...props
}) => {
  // SVG Sparkline calculation
  const max = Math.max(...sparklineData, 1);
  const min = Math.min(...sparklineData, 0);
  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * 100;
      const y = 30 - ((val - min) / (max - min || 1)) * 25;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div
      className={cn(
        "glass-card p-4 sm:p-5 rounded-cardSm flex flex-col justify-between space-y-3",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {icon && <div className="text-slate-400 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">{icon}</div>}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
          {value}
        </span>
        {delta && (
          <span
            className={cn(
              "inline-flex items-center text-xs font-semibold font-mono",
              isPositive ? "text-emerald-500" : "text-red-500"
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            )}
            {delta}
          </span>
        )}
      </div>

      {/* Mini Sparkline */}
      <div className="w-full h-8 pt-1">
        <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            className="text-sky-500"
          />
        </svg>
      </div>
    </div>
  );
};
