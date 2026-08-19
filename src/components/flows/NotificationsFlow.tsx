"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Trophy,
  Clock,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { NotificationItem } from "@/types/cybershield";

export default function NotificationsFlow() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      title: "Security Milestone: 30-Day Threat-Free Streak",
      body: "Your device has maintained an uninterrupted zero-trust defense posture for 30 consecutive days.",
      type: "MILESTONE",
      timestamp: "Today, 9:30 AM",
      read: false,
      actionText: "View Badge",
    },
    {
      id: "notif-2",
      title: "Autonomous Mitigation: C2 Beacon Dropped",
      body: "Ingress socket attempt on port 443 was intercepted and terminated by edge packet filters.",
      type: "ALERT",
      timestamp: "Yesterday, 4:15 PM",
      read: false,
      actionText: "Investigate Forensic Log",
    },
    {
      id: "notif-3",
      title: "Kernel Microcode Firmware Ready",
      body: "Security patch 2026.08.01 has completed hash validation and is ready for activation.",
      type: "UPDATE",
      timestamp: "Aug 2, 2026",
      read: true,
      actionText: "Deploy",
    },
    {
      id: "notif-4",
      title: "Deep Scan Completed: 148,290 Files Verified",
      body: "Zero high-risk anomalies or obfuscated binaries detected across user volume.",
      type: "INFO",
      timestamp: "Aug 1, 2026",
      read: true,
    },
  ]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-sky-500 dark:text-cyan-400" />
            Alerts, Audit Log & Milestones
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Calm, digestible security updates and protection milestones.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={markAllAsRead}
            className="px-3 py-1.5 rounded-btn bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all"
          >
            Mark all read
          </button>
          <button
            onClick={clearAll}
            className="p-1.5 rounded-btn text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Security Milestone Achievement Highlight Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-card p-6 bg-gradient-to-tr from-sky-500/10 via-cyan-500/10 to-indigo-500/10 border border-sky-500/20 flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 text-white flex items-center justify-center shadow-coreGlow shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
              Achievement Unlocked
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
              30-Day Zero-Incursion Sentinel
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              100% clean uptime with continuous autonomous defense over 720 hours.
            </p>
          </div>
        </div>

        <button className="px-4 py-2 rounded-btn bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold shadow-sm hover:scale-105 transition-all shrink-0">
          Share Certificate
        </button>
      </motion.div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="py-14 text-center text-slate-400 glass-card rounded-card">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
            <p className="text-sm font-semibold">You have no unread security notifications.</p>
            <p className="text-xs text-slate-500 mt-0.5">All systems are running smoothly.</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const isAlert = notif.type === "ALERT";
            const isMilestone = notif.type === "MILESTONE";
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`glass-card rounded-card p-4 sm:p-5 flex items-start justify-between gap-4 transition-all ${
                  !notif.read ? "border-l-4 border-l-sky-500" : "opacity-80"
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div
                    className={`w-9 h-9 rounded-icon flex items-center justify-center shrink-0 ${
                      isAlert
                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        : isMilestone
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "bg-sky-500/10 text-sky-600 dark:text-cyan-400"
                    }`}
                  >
                    {isAlert ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : isMilestone ? (
                      <Sparkles className="w-4 h-4" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-sky-500" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {notif.body}
                    </p>
                    <span className="text-[11px] font-mono text-slate-400 block pt-1">
                      {notif.timestamp}
                    </span>
                  </div>
                </div>

                {notif.actionText && (
                  <button className="text-xs font-semibold text-sky-600 dark:text-cyan-400 hover:underline shrink-0 flex items-center gap-1 mt-1">
                    <span>{notif.actionText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
