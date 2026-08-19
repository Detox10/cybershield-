"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Shield,
  FileSearch,
  Bot,
  AlertTriangle,
  Activity,
  Sliders,
  Bell,
  ArrowRight,
  Sparkles,
  X,
  Command,
  CheckCircle2,
  Lock,
  Terminal,
  Cpu,
  Smartphone,
} from "lucide-react";
import { NavTab } from "@/types/cybershield";

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavTab) => void;
  onStartScan: () => void;
  onTriggerSimulatedThreat: () => void;
}

export default function SpotlightSearch({
  isOpen,
  onClose,
  onNavigate,
  onStartScan,
  onTriggerSimulatedThreat,
}: SpotlightSearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Global hotkey listener for Cmd+K / Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const allItems = [
    {
      id: "nav-dash",
      title: "Security Command Center",
      category: "Navigation",
      shortcut: "⌘1",
      subtitle: "Live overview of protection score, sentinel daemons, and hardware integrity",
      icon: Shield,
      action: () => {
        onNavigate("dashboard");
        onClose();
      },
    },
    {
      id: "nav-studio",
      title: "Mobile Studio App & Motion Graphics",
      category: "Quick Actions",
      subtitle: "Experience Specify-style automated design token studio with floating 3D motion graphics",
      icon: Smartphone,
      action: () => {
        onNavigate("studio");
        onClose();
      },
    },
    {
      id: "nav-scan",
      title: "Initiate Deep File & Threat Scan",
      category: "Quick Actions",
      shortcut: "⌘S",
      subtitle: "Run 5-stage pipeline analysis across binaries, memory, and download quarantine",
      icon: FileSearch,
      action: () => {
        onNavigate("scan");
        onStartScan();
        onClose();
      },
    },
    {
      id: "nav-assistant",
      title: "CyberShield AI Companion Workspace",
      category: "AI Guardian",
      shortcut: "⌘A",
      subtitle: "Ask questions, review security logs, and receive plain-language guidance",
      icon: Bot,
      action: () => {
        onNavigate("assistant");
        onClose();
      },
    },
    {
      id: "ai-prompt-1",
      title: 'Ask AI: "Explain recent memory isolation event"',
      category: "AI Prompt",
      subtitle: "Get step-by-step forensic explanation of kernel sandbox containment",
      icon: Sparkles,
      action: () => {
        onNavigate("assistant");
        onClose();
      },
    },
    {
      id: "ai-prompt-2",
      title: 'Ask AI: "How can I harden TLS cipher suites?"',
      category: "AI Prompt",
      subtitle: "AI generates zero-trust configuration scripts for local services",
      icon: Terminal,
      action: () => {
        onNavigate("assistant");
        onClose();
      },
    },
    {
      id: "nav-threats",
      title: "Threat Intel & MITRE ATT&CK Matrix",
      category: "Security Intel",
      shortcut: "⌘T",
      subtitle: "Inspect zero-day signatures, quarantined payloads, and CVE advisories",
      icon: AlertTriangle,
      action: () => {
        onNavigate("threats");
        onClose();
      },
    },
    {
      id: "nav-diagnostics",
      title: "Device Diagnostics & Digital Twin",
      category: "System Telemetry",
      shortcut: "⌘D",
      subtitle: "Inspect real-time CPU, RAM, NVMe, and historical time-scrubbing graphs",
      icon: Activity,
      action: () => {
        onNavigate("diagnostics");
        onClose();
      },
    },
    {
      id: "action-sim",
      title: "Simulate Zero-Day Ingress Attack",
      category: "Security Testing",
      subtitle: "Verify autonomous memory isolation and real-time sentinel containment",
      icon: Sparkles,
      action: () => {
        onTriggerSimulatedThreat();
        onClose();
      },
    },
    {
      id: "nav-notifs",
      title: "Notification Center & Audit Logs",
      category: "Alerts & Audit",
      subtitle: "Chronological narrative of system updates, automated patches, and events",
      icon: Bell,
      action: () => {
        onNavigate("notifications");
        onClose();
      },
    },
  ];

  const filteredItems = query
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 sm:px-6">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 dark:bg-black/70 backdrop-blur-md transition-all"
          />

          {/* Spotlight Dialog Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-white/95 dark:bg-[#0E1322]/95 backdrop-blur-2xl rounded-card border border-slate-200/80 dark:border-white/10 shadow-glass3 overflow-hidden z-10 top-ambient-glow"
          >
            {/* Top Light Accent Bar */}
            <div className="h-[2px] w-full bg-gradient-to-r from-sky-500 via-teal-400 to-indigo-500" />

            {/* Search Input Header */}
            <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-white/10">
              <Search className="w-5 h-5 text-sky-500 dark:text-cyan-400 mr-3 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search files, threats, settings or ask CyberShield AI…"
                className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-[14px] sm:text-[15px] font-normal focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white mr-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 text-xs font-medium border border-slate-200/40 dark:border-transparent">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
            </div>

            {/* Search Results List */}
            <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-slate-400 dark:text-slate-500 space-y-1">
                  <p className="text-sm font-medium">No matching commands or resources found.</p>
                  <p className="text-xs text-slate-400">Try searching &quot;scan&quot;, &quot;threat&quot;, &quot;memory&quot;, or &quot;assistant&quot;</p>
                </div>
              ) : (
                filteredItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      className="w-full flex items-center justify-between p-3 rounded-cardSm text-left hover:bg-slate-100/80 dark:hover:bg-white/5 transition-all group"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-9 h-9 rounded-icon bg-gradient-to-tr from-sky-50 to-cyan-50 dark:from-sky-950/40 dark:to-cyan-950/40 border border-sky-100 dark:border-sky-800/30 flex items-center justify-center text-sky-600 dark:text-cyan-400 shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                              {item.title}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 font-medium">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-normal">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0 ml-3">
                        {item.shortcut && (
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 border border-slate-200/40 dark:border-transparent">
                            {item.shortcut}
                          </span>
                        )}
                        <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-sky-500 dark:group-hover:text-cyan-400 transition-colors" />
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-white/5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
              <div className="flex items-center space-x-3 text-[11px]">
                <span>Navigate <kbd className="font-mono bg-white dark:bg-white/10 px-1.5 py-0.5 rounded border border-slate-200 dark:border-transparent">↑↓</kbd></span>
                <span>Execute <kbd className="font-mono bg-white dark:bg-white/10 px-1.5 py-0.5 rounded border border-slate-200 dark:border-transparent">↵</kbd></span>
                <span>Dismiss <kbd className="font-mono bg-white dark:bg-white/10 px-1.5 py-0.5 rounded border border-slate-200 dark:border-transparent">ESC</kbd></span>
              </div>
              <span className="font-medium text-sky-600 dark:text-cyan-400 flex items-center gap-1 text-[11px]">
                <Sparkles className="w-3 h-3" /> CyberShield OS
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
