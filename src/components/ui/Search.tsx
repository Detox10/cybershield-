"use client";

import React from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  shortcutKey?: string;
}

export const Search = React.forwardRef<HTMLInputElement, SearchProps>(
  ({ className, value, onClear, shortcutKey = "Ctrl+K", ...props }, ref) => {
    return (
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          ref={ref}
          type="text"
          value={value}
          className={cn(
            "flex h-10 w-full rounded-btn border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 pl-9 pr-16 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 backdrop-blur-md transition-all shadow-sm",
            className
          )}
          {...props}
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {shortcutKey && (
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 select-none">
              {shortcutKey}
            </kbd>
          )}
        </div>
      </div>
    );
  }
);
Search.displayName = "Search";
