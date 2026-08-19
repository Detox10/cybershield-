"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./Badge";

export interface TimelineItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  severity?: "secure" | "warning" | "critical" | "sky" | "neutral";
  tag?: string;
  icon?: React.ReactNode;
}

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TimelineItem[];
}

export const Timeline: React.FC<TimelineProps> = ({ items, className, ...props }) => {
  return (
    <div className={cn("relative pl-6 space-y-6 border-l border-slate-200 dark:border-slate-800", className)} {...props}>
      {items.map((item) => (
        <div key={item.id} className="relative group">
          {/* Node Dot */}
          <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#0E1526] bg-sky-500 shadow-sm" />

          {/* Item Content */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-slate-400">{item.timestamp}</span>
              {item.severity && (
                <Badge variant={item.severity} size="sm">
                  {item.tag || item.severity.toUpperCase()}
                </Badge>
              )}
            </div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {item.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
