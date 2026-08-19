"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Zap, Activity, Bug, X, Server } from "lucide-react";
import { useTelemetryStore } from "@/store/telemetryStore";

interface ControlPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ControlPanelModal: React.FC<ControlPanelModalProps> = ({ isOpen, onClose }) => {
  const triggerUnusualActivity = useTelemetryStore((state) => state.triggerUnusualActivity);

  const handleTrigger = (type: "DDoS" | "ZeroDay" | "Ransomware") => {
    triggerUnusualActivity(type);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-xl bg-[#121418] border border-white/15 rounded-3xl p-6 shadow-2xl overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#FF6A00]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6A00] to-[#FF3B00] flex items-center justify-center border border-white/10 shadow-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    Simulation Control Panel
                  </h2>
                  <p className="text-xs text-slate-400">
                    Inject anomalies and trigger system-wide telemetry syncing.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              {/* Trigger 1: Volumetric DDoS */}
              <button
                onClick={() => handleTrigger("DDoS")}
                className="group relative flex flex-col items-start text-left p-4 rounded-2xl bg-[#161922] border border-white/[0.06] hover:bg-[#1A1D25] hover:border-amber-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-amber-500 group-hover:animate-pulse" />
                  <span className="font-bold text-white text-sm">Simulate DDoS</span>
                </div>
                <p className="text-xs text-slate-400">
                  Flood edge gateway with SYN packets and trigger WAF rate-limiting.
                </p>
              </button>

              {/* Trigger 2: Zero-Day Exploit */}
              <button
                onClick={() => handleTrigger("ZeroDay")}
                className="group relative flex flex-col items-start text-left p-4 rounded-2xl bg-[#161922] border border-white/[0.06] hover:bg-[#1A1D25] hover:border-rose-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Bug className="w-4 h-4 text-rose-500 group-hover:animate-pulse" />
                  <span className="font-bold text-white text-sm">Inject Zero-Day</span>
                </div>
                <p className="text-xs text-slate-400">
                  Execute unknown memory corruption payload to test eBPF kernel hooks.
                </p>
              </button>

              {/* Trigger 3: Ransomware Lateral Movement */}
              <button
                onClick={() => handleTrigger("Ransomware")}
                className="group relative flex flex-col items-start text-left p-4 rounded-2xl bg-[#161922] border border-white/[0.06] hover:bg-[#1A1D25] hover:border-sky-500/30 transition-all cursor-pointer sm:col-span-2"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Server className="w-4 h-4 text-sky-500 group-hover:animate-pulse" />
                  <span className="font-bold text-white text-sm">Trigger Ransomware Lateral Scan</span>
                </div>
                <p className="text-xs text-slate-400">
                  Simulate compromised workstation probing SMB shares across the network mesh.
                </p>
              </button>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 flex gap-3">
              <ShieldAlert className="w-5 h-5 text-blue-400 shrink-0" />
              <p className="text-xs text-slate-300 leading-relaxed">
                Clicking any of these triggers will instantly dispatch an event across the global telemetry store. You will see <strong>Threats Neutralized</strong> spike, the <strong>Threat Ingress graph</strong> update, and new alerts appear in the <strong>Timeline</strong> and <strong>Incidents Table</strong> simultaneously.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
