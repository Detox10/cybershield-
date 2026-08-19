"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "rectangular",
  ...props
}) => {
  const variantStyles = {
    text: "h-4 w-full rounded",
    rectangular: "rounded-cardSm",
    circular: "rounded-full",
  };

  return (
    <div
      className={cn(
        "animate-shimmer bg-slate-200/80 dark:bg-slate-800/80 relative overflow-hidden",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
};
