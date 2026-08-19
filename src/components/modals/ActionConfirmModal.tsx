"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  AlertOctagon,
  Trash2,
  RotateCcw,
  ShieldAlert,
  Terminal,
  LockOpen
} from "lucide-react";
import { QuarantinedItem } from "./SandboxDetonationModal";

interface ActionConfirmModalProps {
  type: "RELEASE" | "PURGE";
  item: QuarantinedItem | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const ActionConfirmModal: React.FC<ActionConfirmModalProps> = ({ type, item, onClose, onConfirm }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState("");

  useEffect(() => {
    if (!isProcessing) return;

    if (type === "PURGE") {
      // Simulate DoD wipe
      setLog("Initiating DoD 5220.22-M secure wipe (7 passes)...");
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.random() * 15;
        if (currentProgress > 100) currentProgress = 100;
        setProgress(currentProgress);
        
        if (currentProgress < 30) setLog("Pass 1/7: Overwriting with zeros...");
        else if (currentProgress < 60) setLog("Pass 3/7: Overwriting with random data...");
        else if (currentProgress < 90) setLog("Pass 6/7: Overwriting with complementary data...");
        else setLog("Pass 7/7: Verifying sectors... Wipe Complete.");

        if (currentProgress === 100) {
          clearInterval(interval);
          setTimeout(() => {
            onConfirm();
          }, 600);
        }
      }, 300);
      return () => clearInterval(interval);
    } else {
      // Simulate Release
      setLog("Decrypting AES-256 GCM vault envelope...");
      setProgress(20);
      setTimeout(() => {
        setLog(`Restoring payload to ${item?.originalPath}...`);
        setProgress(70);
      }, 800);
      setTimeout(() => {
        setLog("Payload restored. Host protection disabled for this file.");
        setProgress(100);
        setTimeout(() => {
          onConfirm();
        }, 600);
      }, 1800);
    }
  }, [isProcessing, type, item, onConfirm]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={!isProcessing ? onClose : undefined}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-lg bg-[#0A0C10] border rounded-3xl shadow-2xl overflow-hidden flex flex-col ${
            type === "RELEASE" ? "border-rose-500/30" : "border-purple-500/30"
          }`}
        >
          {/* Ambient Glow */}
          <div className={`absolute -top-32 -left-32 w-64 h-64 rounded-full blur-[80px] pointer-events-none opacity-20 ${
            type === "RELEASE" ? "bg-rose-500" : "bg-purple-500"
          }`} />

          {/* Header */}
          <div className="flex-none p-5 border-b border-white/[0.04] flex items-center justify-between z-10 bg-[#0A0C10]/80 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border flex items-center justify-center shadow-lg ${
                type === "RELEASE" ? "bg-rose-950/50 border-rose-500/30 text-rose-400" : "bg-purple-950/50 border-purple-500/30 text-purple-400"
              }`}>
                {type === "RELEASE" ? <AlertOctagon className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {type === "RELEASE" ? "Release Quarantined Payload" : "Secure File Wipe"}
              </h2>
            </div>
            {!isProcessing && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>

          {/* Body */}
          <div className="p-6 z-10 space-y-6">
            {!isProcessing ? (
              <>
                {type === "RELEASE" ? (
                  <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4">
                    <h3 className="text-rose-400 font-bold mb-2 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" /> DANGER: SECURITY OVERRIDE
                    </h3>
                    <p className="text-sm text-rose-200/80 leading-relaxed">
                      You are about to decrypt and release <strong>{item.name}</strong> back to its original path on the host system. 
                      This payload has been flagged as <strong>{item.threatType}</strong>. Releasing this file may result in immediate compromise of the endpoint.
                    </p>
                  </div>
                ) : (
                  <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-4">
                    <h3 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                      <Terminal className="w-4 h-4" /> SECURE WIPE CONFIRMATION
                    </h3>
                    <p className="text-sm text-purple-200/80 leading-relaxed">
                      You are about to permanently destroy <strong>{item.name}</strong> from the Quarantine Vault. 
                      This will execute a 7-pass military-grade overwrite (DoD 5220.22-M). This action cannot be undone and forensics will be lost.
                    </p>
                  </div>
                )}

                <div className="bg-black/40 border border-white/[0.04] rounded-lg p-3 text-xs font-mono text-slate-400">
                  <div className="grid grid-cols-[80px_1fr] gap-1">
                    <span className="text-slate-500">Target:</span> <span className="text-slate-300 truncate">{item.originalPath}</span>
                    <span className="text-slate-500">Hash:</span> <span className="text-slate-300 truncate">{item.hash}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setIsProcessing(true)}
                    className={`flex-1 py-2.5 rounded-xl border font-bold transition-all flex justify-center items-center gap-2 ${
                      type === "RELEASE" 
                        ? "bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-400" 
                        : "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30 text-purple-400"
                    }`}
                  >
                    {type === "RELEASE" ? (
                      <><LockOpen className="w-4 h-4" /> Force Release</>
                    ) : (
                      <><Trash2 className="w-4 h-4" /> Execute Wipe</>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="py-4 space-y-6">
                <div className="text-center space-y-2">
                  <div className="text-lg font-bold text-white">
                    {type === "RELEASE" ? "Releasing Payload..." : "Executing Secure Wipe..."}
                  </div>
                  <div className="text-xs font-mono text-slate-400 h-4">
                    {log}
                  </div>
                </div>
                
                <div className="relative h-2 bg-black rounded-full overflow-hidden border border-white/10">
                  <motion.div 
                    className={`absolute top-0 left-0 h-full ${
                      type === "RELEASE" ? "bg-rose-500" : "bg-purple-500"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear", duration: 0.2 }}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
