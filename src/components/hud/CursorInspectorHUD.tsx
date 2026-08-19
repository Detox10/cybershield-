"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Info, Shield, Activity, Terminal } from "lucide-react";

export const CursorInspectorHUD: React.FC = () => {
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hudText, setHudText] = useState<string | null>(null);
  const [hudTitle, setHudTitle] = useState<string>("Sentinel Inspector");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeoutId: any = null;

    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });

      // Find closest element with data-hud-info or contextual role
      const target = (e.target as HTMLElement)?.closest("[data-hud-info]") as HTMLElement | null;

      if (target) {
        const info = target.getAttribute("data-hud-info");
        const title = target.getAttribute("data-hud-title") || "Telemetry HUD";
        setHudText(info);
        setHudTitle(title);
        setIsVisible(true);
      } else {
        // Check for common security elements
        const textTarget = (e.target as HTMLElement)?.closest("button, [role='button'], a, input, th") as HTMLElement | null;
        if (textTarget) {
          const innerText = textTarget.innerText?.trim();
          if (innerText && innerText.length < 40) {
            setHudTitle("Interactive Controller");
            setHudText(`Active console trigger for [${innerText}]. Click to execute or switch security context.`);
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        } else {
          setIsVisible(false);
        }
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!isVisible || !hudText) return null;

  // Prevent HUD from going off the right/bottom edge of viewport
  const posX = typeof window !== "undefined" && coords.x + 290 > window.innerWidth ? coords.x - 290 : coords.x + 16;
  const posY = typeof window !== "undefined" && coords.y + 110 > window.innerHeight ? coords.y - 100 : coords.y + 16;

  return (
    <div
      style={{
        position: "fixed",
        left: `${posX}px`,
        top: `${posY}px`,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 4 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="max-w-xs bg-[#0F1218]/95 border border-[#FF7A00]/40 rounded-2xl p-3 shadow-2xl backdrop-blur-xl space-y-1.5 text-slate-100 select-none shadow-black/80"
      >
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#FF7A00] uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-[#FF7A00]" />
            <span>{hudTitle}</span>
          </div>
          <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>ONLINE</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-200 leading-snug font-sans font-medium">
          {hudText}
        </p>
      </motion.div>
    </div>
  );
};
export default CursorInspectorHUD;
