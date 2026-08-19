"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Trash2,
  Play,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  FileCode,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { SandboxDetonationModal, QuarantinedItem } from "../modals/SandboxDetonationModal";
import { ActionConfirmModal } from "../modals/ActionConfirmModal";

const INITIAL_QUARANTINE: QuarantinedItem[] = [
  {
    id: "Q-101",
    name: "LockBit3_Payload_x64.exe",
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    threatType: "Trojan-Ransom.Win64.LockBit",
    originalPath: "C:\\Users\\Public\\Downloads\\invoice_oct.exe",
    quarantineDate: "Today, 08:14 AM",
    size: "1.42 MB",
  },
  {
    id: "Q-102",
    name: "CobaltStrike_Beacon_Stager.ps1",
    hash: "8f4e2439818816c7ba2ef1a0cbab585f9ff7038cfbe2542a1705e4fa4d5de646",
    threatType: "HackTool.Win32.CobaltStrike",
    originalPath: "C:\\Windows\\Temp\\stager_4444.ps1",
    quarantineDate: "Today, 07:51 AM",
    size: "68 KB",
  },
  {
    id: "Q-103",
    name: "Mimikatz_x64.dll",
    hash: "3b08e5c8e3678b8433d9c7333d45ef4c1a41db81b0a88fb08c6b797f1f94d97d",
    threatType: "HackTool.SecurityAudit.Mimikatz",
    originalPath: "C:\\Users\\admin\\AppData\\Local\\Temp\\mimi.dll",
    quarantineDate: "Yesterday, 11:20 PM",
    size: "820 KB",
  },
];

export const ScanFlow: React.FC<{ onSetCoreState?: any }> = () => {
  const [items, setItems] = useState<QuarantinedItem[]>(INITIAL_QUARANTINE);
  const [detonatingItem, setDetonatingItem] = useState<QuarantinedItem | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ type: "RELEASE" | "PURGE"; item: QuarantinedItem } | null>(null);

  const handlePurge = (item: QuarantinedItem) => {
    setConfirmAction({ type: "PURGE", item });
  };

  const handleRelease = (item: QuarantinedItem) => {
    setConfirmAction({ type: "RELEASE", item });
  };

  const executeAction = () => {
    if (confirmAction) {
      setItems((prev) => prev.filter((i) => i.id !== confirmAction.item.id));
      setConfirmAction(null);
    }
  };

  const handleDetonateMicroVm = (item: QuarantinedItem) => {
    setDetonatingItem(item);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="bg-[#111317] border border-white/[0.08] rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-950/80 border border-amber-800/60 shadow-inner">
            <Lock className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Quarantine Vault & MicroVM Sandbox Detonation
            </h2>
            <p className="text-xs text-slate-400">
              Isolated, write-blocked encrypted storage for intercepted malware payloads and zero-days.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-300 bg-[#161921] border border-white/10 px-3 py-1.5 rounded-xl">
          Vault Storage: <span className="text-emerald-400 font-bold">{items.length} Payloads Locked</span>
        </div>
      </div>

      {/* Quarantined List */}
      <div className="bg-[#111317] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-xs font-bold text-white uppercase font-mono tracking-wider">
          <span>Active Quarantined Payloads</span>
          <span className="text-slate-400 font-normal">Encrypted AES-256 GCM</span>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-[#151820] border border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-bold text-white">{item.name}</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                    {item.threatType}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Original: {item.originalPath} • {item.size} • Quarantined {item.quarantineDate}
                </div>
                <div className="text-[9px] font-mono text-slate-500 truncate max-w-lg">
                  SHA-256: {item.hash}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDetonateMicroVm(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-800 text-purple-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Play className="w-3 h-3" />
                  <span>Detonate Sandbox</span>
                </button>

                <button
                  onClick={() => handleRelease(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1B1E28] hover:bg-[#232736] border border-white/10 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Release</span>
                </button>

                <button
                  onClick={() => handlePurge(item)}
                  className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/40 text-rose-400 transition-all cursor-pointer"
                  title="Purge Binary"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400">
              Vault is empty. No active quarantined binaries.
            </div>
          )}
        </div>
      </div>
      
      <SandboxDetonationModal 
        item={detonatingItem} 
        onClose={() => setDetonatingItem(null)} 
      />

      <ActionConfirmModal
        type={confirmAction?.type as any}
        item={confirmAction?.item || null}
        onClose={() => setConfirmAction(null)}
        onConfirm={executeAction}
      />
    </div>
  );
};
export default ScanFlow;
