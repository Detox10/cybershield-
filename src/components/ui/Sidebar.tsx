"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  collapsed?: boolean;
}

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ className, collapsed = false, children, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(
          "h-screen fixed top-0 left-0 z-30 flex flex-col justify-between border-r border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#070B14]/80 backdrop-blur-xl transition-all duration-300",
          collapsed ? "w-[72px]" : "w-[240px]",
          className
        )}
        {...props}
      >
        {children}
      </aside>
    );
  }
);
Sidebar.displayName = "Sidebar";
