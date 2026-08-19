"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { hoverPresets } from "@/motion";

export interface CardProps extends HTMLMotionProps<"div"> {
  variant?: "glass" | "elevated" | "outlined" | "interactive";
  enableTopGlow?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "glass", enableTopGlow = true, children, ...props }, ref) => {
    const variantStyles = {
      glass: "glass-card",
      elevated:
        "bg-white dark:bg-[#0E1526] shadow-md border border-slate-200/80 dark:border-slate-800",
      outlined:
        "bg-transparent border border-slate-200 dark:border-slate-800/80",
      interactive:
        "glass-card hover-elevate cursor-pointer",
    };

    return (
      <motion.div
        ref={ref}
        whileHover={variant === "interactive" ? hoverPresets.cardHover : undefined}
        className={cn(
          "rounded-card p-5 sm:p-6 transition-all duration-200 relative overflow-hidden",
          variantStyles[variant],
          !enableTopGlow && "before:hidden",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-semibold text-lg sm:text-xl text-slate-900 dark:text-slate-100 tracking-tight leading-none",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs sm:text-sm text-slate-500 dark:text-slate-400", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4 border-t border-slate-100 dark:border-slate-800/60", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";
