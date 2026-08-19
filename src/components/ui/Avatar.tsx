"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallbackText?: string;
  size?: "sm" | "md" | "lg";
  status?: "online" | "offline" | "busy" | "scanning";
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  fallbackText = "CS",
  size = "md",
  status,
  className,
  ...props
}) => {
  const sizeStyles = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const statusColorStyles = {
    online: "bg-emerald-500",
    offline: "bg-slate-400",
    busy: "bg-amber-500",
    scanning: "bg-sky-500 animate-ping",
  };

  return (
    <div className="relative inline-flex shrink-0">
      <div
        className={cn(
          "rounded-full overflow-hidden flex items-center justify-center font-semibold bg-gradient-to-tr from-sky-500/20 to-teal-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/30 select-none",
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <span>{fallbackText}</span>
        )}
      </div>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900",
            statusColorStyles[status]
          )}
        />
      )}
    </div>
  );
};
