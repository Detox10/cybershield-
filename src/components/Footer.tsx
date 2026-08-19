"use client";

import React from "react";
import { Shield, Lock, Globe, Heart, CheckCircle2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#04070e] text-slate-400 py-10 mt-16 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/60">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-wider">
                CYBERSHIELD DEFENSE PLATFORM
              </span>
              <p className="text-[11px] text-slate-500">
                Enterprise Autonomous Threat Prevention Infrastructure
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> SOC-2 Type II Certified
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400">
              <Lock className="w-3.5 h-3.5" /> ISO-27001 Compliant
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-purple-400">
              <Globe className="w-3.5 h-3.5" /> 99.999% SLA Uptime
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 text-[11px] text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CyberShield Security Systems, Inc. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <a href="#privacy" className="hover:text-cyan-400 transition-colors">
              Security Disclosure
            </a>
            <a href="#terms" className="hover:text-cyan-400 transition-colors">
              Trust Center
            </a>
            <a href="#api" className="hover:text-cyan-400 transition-colors">
              Threat API Documentation
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
