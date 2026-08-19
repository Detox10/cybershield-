"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileAppFrame } from "../mobile/MobileAppFrame";
import { MobileHeroSection } from "../mobile/MobileHeroSection";
import { MobileVideoDemoSection } from "../mobile/MobileVideoDemoSection";
import { MobileBentoFeatures } from "../mobile/MobileBentoFeatures";
import { MobileTestimonialBento } from "../mobile/MobileTestimonialBento";
import { MobileBottomNavigation } from "../mobile/MobileBottomNavigation";
import { ShieldCheck, Sparkles, ArrowRight, Zap, RefreshCw, Key, Layers, Terminal } from "lucide-react";
import { Notification } from "../ui/Notification";

export const MobileStudioFlow: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [notification, setNotification] = useState<{
    title: string;
    description: string;
    type: "info" | "success" | "warning";
  } | null>(null);

  const triggerQuickAction = (action: string) => {
    if (action === "sync") {
      setNotification({
        title: "Tokens Synchronized",
        description: "148 design tokens successfully synced across iOS, Android, and Web.",
        type: "success",
      });
    } else if (action === "verify") {
      setNotification({
        title: "Zero-Trust Audit Passed",
        description: "RSA-4096 signature verified on all design token manifests.",
        type: "info",
      });
    } else if (action === "export") {
      setNotification({
        title: "Native Exports Generated",
        description: "Swift ThemeTokens.swift and Kotlin ColorTokens.kt compiled.",
        type: "success",
      });
    } else if (action === "keys") {
      setNotification({
        title: "Security Keys Rotated",
        description: "Zero-day encryption cipher rotated across all mobile client nodes.",
        type: "warning",
      });
    }
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <div className="fixed top-6 right-6 z-50 max-w-sm">
            <Notification
              type={notification.type}
              title={notification.title}
              description={notification.description}
              onDismiss={() => setNotification(null)}
            />
          </div>
        )}
      </AnimatePresence>

      <MobileAppFrame>
        {/* TAB 1: Main Landing / Studio Experience */}
        {activeTab === "home" && (
          <div className="w-full flex flex-col items-center">
            <MobileHeroSection
              onPlayDemo={() => {
                const el = document.getElementById("demo-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              onGetStarted={() => triggerQuickAction("sync")}
            />

            <div id="demo-section" className="w-full">
              <MobileVideoDemoSection />
            </div>

            <MobileBentoFeatures />

            <MobileTestimonialBento />

            {/* High Impact Footer CTA matching reference bottom banner */}
            <div className="w-full mt-10 p-8 bg-[#031B15] text-white text-center rounded-3xl border border-emerald-900/60 relative overflow-hidden">
              <div className="relative z-10 space-y-3 max-w-md mx-auto">
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight">
                  BUILD BETTER <br />
                  <span className="text-cyan-400">SYSTEMS—FASTER</span>
                </h3>
                <p className="text-xs text-emerald-200/80 leading-relaxed">
                  Join leading design engineering teams automating tokens and securing perimeters with Specify Studio.
                </p>
                <div className="pt-3">
                  <button
                    onClick={() => triggerQuickAction("sync")}
                    className="h-11 px-6 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-400/25 flex items-center justify-center gap-2 mx-auto transition-transform active:scale-95"
                  >
                    <span>Launch Free App</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Tokens Inspector */}
        {activeTab === "tokens" && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Design Token Matrix</h2>
                <p className="text-xs text-slate-400">Real-time synced tokens</p>
              </div>
              <button
                onClick={() => triggerQuickAction("sync")}
                className="p-2 rounded-lg bg-sky-500/10 text-sky-500 hover:bg-sky-500/20 text-xs font-semibold flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Sync
              </button>
            </div>

            <div className="space-y-2">
              {[
                { name: "color.primary", value: "#0EA5E9", type: "HEX Color", preview: "bg-sky-500" },
                { name: "color.danger", value: "#FF2E7E", type: "HEX Color", preview: "bg-pink-500" },
                { name: "color.warning", value: "#FFB800", type: "HEX Color", preview: "bg-amber-400" },
                { name: "spacing.base", value: "8px", type: "Dimension", preview: "w-4 h-4 bg-slate-300" },
                { name: "radius.card", value: "16px", type: "Border Radius", preview: "w-4 h-4 rounded-lg bg-slate-400" },
                { name: "font.headline", value: "Inter Black 900", type: "Typography", preview: "font-black" },
              ].map((token) => (
                <div
                  key={token.name}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded ${token.preview}`} />
                    <div>
                      <p className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
                        {token.name}
                      </p>
                      <p className="text-[10px] text-slate-400">{token.type}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                    {token.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Defense / Threats */}
        {activeTab === "threats" && (
          <div className="p-5 space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Zero-Trust Telemetry</h2>
              <p className="text-xs text-slate-400">Autonomous packet inspection & containment</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Perimeter Status: NOMINAL</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                0 anomalous signatures detected across 32 connected device nodes.
              </p>
            </div>
            <button
              onClick={() => triggerQuickAction("verify")}
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" /> Run Deep Packet Disassembly
            </button>
          </div>
        )}

        {/* TAB 4: Settings */}
        {activeTab === "settings" && (
          <div className="p-5 space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Studio Configuration</h2>
              <p className="text-xs text-slate-400">Mobile app runtime preferences</p>
            </div>
            <div className="space-y-3">
              {[
                { title: "Automatic Token Watcher", desc: "Poll Figma files every 60 seconds", active: true },
                { title: "Cryptographic Signatures", desc: "Enforce RSA-4096 token manifest check", active: true },
                { title: "Haptic Micro-Feedbacks", desc: "Vibrate on button tap & token drag", active: true },
              ].map((setting, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{setting.title}</p>
                    <p className="text-[10px] text-slate-400">{setting.desc}</p>
                  </div>
                  <div className="w-9 h-5 rounded-full bg-sky-500 p-0.5 flex items-center justify-end cursor-pointer">
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </MobileAppFrame>

      {/* Floating Bottom Navigation */}
      <MobileBottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onQuickAction={triggerQuickAction}
      />
    </div>
  );
};
