"use client";

import React from "react";
import {
  ShieldAlert,
  Cpu,
  KeyRound,
  Network,
  Binary,
  Layers,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function DefenseModules() {
  const capabilities = [
    {
      icon: <Cpu className="w-6 h-6 text-cyan-400" />,
      title: "Neural AI Honeypot",
      desc: "Deploys synthetic deceptive network architecture that lures malicious actors, extracts zero-day exploit payloads, and counter-fingerprints attackers automatically.",
      badge: "ACTIVE L7",
      color: "border-cyan-500/30 bg-cyan-950/20",
    },
    {
      icon: <Network className="w-6 h-6 text-emerald-400" />,
      title: "Tbps DDoS Mitigation",
      desc: "Hyper-distributed multi-anycast scrubbing nodes neutralize volumetric SYN/UDP floods, HTTP/2 Rapid Reset attacks, and Layer 7 bot swarms in sub-milliseconds.",
      badge: "99.999% SLA",
      color: "border-emerald-500/30 bg-emerald-950/20",
    },
    {
      icon: <KeyRound className="w-6 h-6 text-purple-400" />,
      title: "Post-Quantum Cryptography",
      desc: "Kyber-1024 and Dilithium lattice-based key encapsulation mechanisms safeguard data in-flight against current supercomputers and future quantum decrypt attacks.",
      badge: "NIST STANDARDIZED",
      color: "border-purple-500/30 bg-purple-950/20",
    },
    {
      icon: <Binary className="w-6 h-6 text-blue-400" />,
      title: "Zero-Day Sandboxing",
      desc: "Micro-virtualized isolation environment executes untrusted binaries and polymorphic code signatures to discover memory corruptions before production ingress.",
      badge: "REAL-TIME",
      color: "border-blue-500/30 bg-blue-950/20",
    },
    {
      icon: <Layers className="w-6 h-6 text-amber-400" />,
      title: "Zero-Trust Identity Fabric",
      desc: "Continuous micro-segmentation, biometric mTLS validation, and dynamic contextual risk scoring strictly verify every user, device, and service mesh request.",
      badge: "ZTA ISO-27001",
      color: "border-amber-500/30 bg-amber-950/20",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-rose-400" />,
      title: "Autonomous Patch Synthesizer",
      desc: "Instantly generates virtual WAF rule signatures and runtime application self-protection (RASP) hot-patches within seconds of novel CVE disclosure.",
      badge: "AUTOMATED",
      color: "border-rose-500/30 bg-rose-950/20",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-wide">
          CORE DEFENSE CAPABILITIES
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-mono">
          NEXT-GENERATION SECURITY ARCHITECTURE BUILT FOR ZERO COMPROMISE
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {capabilities.map((cap, i) => (
          <div
            key={i}
            className={`cyber-card p-5 rounded-2xl border ${cap.color} hover:scale-[1.02] transition-all flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  {cap.icon}
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/90 border border-slate-800 text-slate-300">
                  {cap.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">
                {cap.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {cap.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-cyan-400">
              <span>Operational</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
