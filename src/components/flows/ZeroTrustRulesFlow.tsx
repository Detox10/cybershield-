"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Plus,
  Trash2,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Globe,
  Sliders,
} from "lucide-react";

interface FirewallRule {
  id: string;
  name: string;
  protocol: "TCP" | "UDP" | "ALL";
  portRange: string;
  direction: "INBOUND" | "OUTBOUND";
  action: "DROP" | "ACCEPT";
  isActive: boolean;
  priority: number;
}

const INITIAL_RULES: FirewallRule[] = [
  {
    id: "RULE-01",
    name: "Block Inbound Telnet & Unencrypted Probes",
    protocol: "TCP",
    portRange: "23, 8080",
    direction: "INBOUND",
    action: "DROP",
    isActive: true,
    priority: 10,
  },
  {
    id: "RULE-02",
    name: "Drop Outbound C2 Beaconing Sockets",
    protocol: "TCP",
    portRange: "4444, 1337",
    direction: "OUTBOUND",
    action: "DROP",
    isActive: true,
    priority: 20,
  },
  {
    id: "RULE-03",
    name: "Allow Secure HTTPS Web Traffic",
    protocol: "TCP",
    portRange: "443",
    direction: "INBOUND",
    action: "ACCEPT",
    isActive: true,
    priority: 100,
  },
  {
    id: "RULE-04",
    name: "eBPF Ring-0 Syscall Execution Interceptor",
    protocol: "ALL",
    portRange: "*",
    direction: "INBOUND",
    action: "DROP",
    isActive: true,
    priority: 5,
  },
];

export const ZeroTrustRulesFlow: React.FC = () => {
  const [rules, setRules] = useState<FirewallRule[]>(INITIAL_RULES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRuleName, setNewRuleName] = useState("");
  const [newRulePort, setNewRulePort] = useState("");
  const [newRuleProto, setNewRuleProto] = useState<"TCP" | "UDP" | "ALL">("TCP");
  const [newRuleAction, setNewRuleAction] = useState<"DROP" | "ACCEPT">("DROP");

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const deleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName || !newRulePort) return;

    const newRule: FirewallRule = {
      id: `RULE-${Math.floor(10 + Math.random() * 90)}`,
      name: newRuleName,
      protocol: newRuleProto,
      portRange: newRulePort,
      direction: "INBOUND",
      action: newRuleAction,
      isActive: true,
      priority: 50,
    };

    setRules((prev) => [newRule, ...prev]);
    setNewRuleName("");
    setNewRulePort("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="bg-[#111317] border border-white/[0.08] rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF7A00]" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Zero-Trust Network Mesh & Firewall Rules
            </h2>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800 text-[#FF7A00]">
              POLICY ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic port blocking, eBPF packet inspection, and micro-segmented perimeter rules.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF7A00] hover:bg-[#FF8C1A] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Policy Rule</span>
        </button>
      </div>

      {/* Rules List */}
      <div className="bg-[#111317] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-xs font-bold text-white uppercase font-mono tracking-wider">
          <span>Active Zero-Trust Rules ({rules.length})</span>
          <span className="text-emerald-400 font-normal">Deterministic Enforcement: ACTIVE</span>
        </div>

        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                rule.isActive
                  ? "bg-[#151820] border-white/[0.06]"
                  : "bg-[#101217] border-white/[0.02] opacity-60"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-slate-500 font-bold">{rule.id}</span>
                  <span className="text-xs font-bold text-white">{rule.name}</span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      rule.action === "DROP"
                        ? "bg-rose-950 text-rose-400 border border-rose-800"
                        : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                    }`}
                  >
                    {rule.action}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Protocol: {rule.protocol} • Ports: {rule.portRange} • Direction: {rule.direction}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    rule.isActive
                      ? "bg-emerald-950/80 border-emerald-700 text-emerald-400"
                      : "bg-slate-800/80 border-slate-700 text-slate-400"
                  }`}
                >
                  {rule.isActive ? "● Active" : "○ Disabled"}
                </button>

                <button
                  onClick={() => deleteRule(rule.id)}
                  className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/40 text-rose-400 transition-all cursor-pointer"
                  title="Delete Rule"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Rule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#111317] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="text-sm font-bold text-white">Create Zero-Trust Firewall Rule</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRule} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400">Rule Name / Purpose</label>
                <input
                  type="text"
                  placeholder="e.g. Drop Inbound Redis Port 6379"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  className="w-full bg-[#161921] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF7A00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400">Port(s)</label>
                  <input
                    type="text"
                    placeholder="e.g. 6379 or 8000-9000"
                    value={newRulePort}
                    onChange={(e) => setNewRulePort(e.target.value)}
                    className="w-full bg-[#161921] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF7A00]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400">Protocol</label>
                  <select
                    value={newRuleProto}
                    onChange={(e: any) => setNewRuleProto(e.target.value)}
                    className="w-full bg-[#161921] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF7A00]"
                  >
                    <option value="TCP">TCP</option>
                    <option value="UDP">UDP</option>
                    <option value="ALL">ALL</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400">Action</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewRuleAction("DROP")}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      newRuleAction === "DROP"
                        ? "bg-rose-950 border-rose-800 text-rose-400"
                        : "bg-[#161921] border-white/10 text-slate-400"
                    }`}
                  >
                    DROP (Block)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewRuleAction("ACCEPT")}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      newRuleAction === "ACCEPT"
                        ? "bg-emerald-950 border-emerald-800 text-emerald-400"
                        : "bg-[#161921] border-white/10 text-slate-400"
                    }`}
                  >
                    ACCEPT (Allow)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#FF8C1A] text-white text-xs font-bold shadow-lg transition-all cursor-pointer"
              >
                Deploy Rule to Kernel
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
export default ZeroTrustRulesFlow;
