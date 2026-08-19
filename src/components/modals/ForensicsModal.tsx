"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShieldAlert,
  Activity,
  Cpu,
  Network,
  Database,
  Lock,
  Terminal,
  Server,
  Crosshair,
  ShieldCheck,
  AlertTriangle,
  Play
} from "lucide-react";

export interface Incident {
  id: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  title: string;
  vector: string;
  mitreTtp: string;
  targetHost: string;
  status: "QUARANTINED" | "CONTAINED" | "RESOLVED" | "ANALYZING";
  timestamp: string;
}

interface ForensicsModalProps {
  incident: Incident | null;
  onClose: () => void;
}

export const ForensicsModal: React.FC<ForensicsModalProps> = ({ incident, onClose }) => {
  const [activeTab, setActiveTab] = useState<"overview" | "tree" | "intelligence" | "trace">("overview");
  const [vtData, setVtData] = useState<any>(null);
  const [vtLoading, setVtLoading] = useState(false);

  useEffect(() => {
    if (!incident) return;
    
    // Map incident to a known hash for the demo
    let hashToUse = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"; // LockBit default
    if (incident.title.toLowerCase().includes("powershell") || incident.title.toLowerCase().includes("cobalt")) {
      hashToUse = "8f4e2439818816c7ba2ef1a0cbab585f9ff7038cfbe2542a1705e4fa4d5de646"; // Cobalt Strike
    } else if (incident.title.toLowerCase().includes("unsigned") || incident.title.toLowerCase().includes("pegasus")) {
      hashToUse = "2b3a1a1532c2a05cf4e81561f5f3e7bb0e922f3e8f192b67f1396a51d02c7711"; // Pegasus
    }

    const fetchVt = async () => {
      setVtLoading(true);
      try {
        const res = await fetch("/api/virustotal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hash: hashToUse }),
        });
        const data = await res.json();
        if (data.success && data.data) {
          setVtData(data.data);
        }
      } catch (err) {
        console.error("VT fetch failed", err);
      } finally {
        setVtLoading(false);
      }
    };

    fetchVt();
  }, [incident]);

  if (!incident) return null;

  const severityColors = {
    CRITICAL: "border-rose-500/50 bg-rose-500/10 text-rose-500",
    HIGH: "border-amber-500/50 bg-amber-500/10 text-amber-500",
    MEDIUM: "border-sky-500/50 bg-sky-500/10 text-sky-500",
    LOW: "border-emerald-500/50 bg-emerald-500/10 text-emerald-500",
  };
  
  const glowColors = {
    CRITICAL: "bg-rose-500",
    HIGH: "bg-amber-500",
    MEDIUM: "bg-sky-500",
    LOW: "bg-emerald-500",
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl h-[85vh] bg-[#0A0C10] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Ambient Glow */}
          <div className={`absolute -top-32 -right-32 w-96 h-96 ${glowColors[incident.severity]} opacity-10 rounded-full blur-[100px] pointer-events-none`} />
          <div className={`absolute -bottom-32 -left-32 w-96 h-96 ${glowColors[incident.severity]} opacity-[0.05] rounded-full blur-[100px] pointer-events-none`} />

          {/* Header */}
          <div className="flex-none p-6 border-b border-white/[0.08] flex items-center justify-between z-10 bg-[#0A0C10]/50 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg ${severityColors[incident.severity]}`}>
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                  {incident.title}
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${severityColors[incident.severity]}`}>
                    {incident.severity}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                    {incident.status}
                  </span>
                </h2>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 font-mono">
                  <span>ID: {incident.id}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span>{incident.timestamp}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span className="flex items-center gap-1"><Server className="w-3 h-3" /> {incident.targetHost}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-bold transition-colors">
                Isolate Host
              </button>
              <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-colors">
                Export PCAP
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors ml-2"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex-none px-6 pt-4 border-b border-white/[0.04] flex items-center gap-6 z-10 bg-[#0A0C10]/50 backdrop-blur-xl">
            {[
              { id: "overview", label: "Overview", icon: Activity },
              { id: "tree", label: "Process Tree", icon: Network },
              { id: "intelligence", label: "Intelligence", icon: Database },
              { id: "trace", label: "eBPF Trace", icon: Terminal },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 pb-4 text-sm font-semibold transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "border-[#FF7A00] text-white"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-[#FF7A00]" : ""}`} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 z-10 custom-scrollbar">
            
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* MITRE ATT&CK Panel */}
                  <div className="bg-[#12141A] rounded-2xl p-5 border border-white/[0.04]">
                    <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                      <Crosshair className="w-4 h-4 text-blue-400" /> MITRE ATT&CK Mapping
                    </h3>
                    <div className="space-y-3">
                      {incident.mitreTtp.split(", ").map((t, i) => {
                        const [id, ...nameParts] = t.split(" ");
                        return (
                          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded-md">{id}</span>
                              <span className="text-sm font-semibold text-slate-200">{nameParts.join(" ").replace(/[()]/g, '')}</span>
                            </div>
                            <span className="text-xs text-slate-500">Tactic matched by heuristic</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Threat Vector Panel */}
                  <div className="bg-[#12141A] rounded-2xl p-5 border border-white/[0.04]">
                    <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-rose-400" /> Threat Vector & Artifacts
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Primary Vector</div>
                        <div className="text-sm font-mono text-slate-300 bg-black/40 px-3 py-2 rounded-lg border border-white/[0.05]">
                          {incident.vector}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Associated Hash (SHA-256)</div>
                        <div className="text-sm font-mono text-slate-400 bg-black/40 px-3 py-2 rounded-lg border border-white/[0.05] truncate select-all">
                          {vtData?.hash || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
                
                {/* AI Summary */}
                <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/10 rounded-2xl p-5 border border-blue-500/20 flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-1">
                    <Activity className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-blue-100 mb-1">Copilot Forensics Summary</h3>
                    <p className="text-sm text-blue-200/70 leading-relaxed">
                      At {incident.timestamp}, Sentinel detected unauthorized memory allocation attempts targeting `{incident.vector.split("•")[1]?.trim() || "system process"}` on `{incident.targetHost}`.
                      The execution pattern strictly aligns with known {incident.mitreTtp} tactics. The AI engine immediately injected a containment hook via eBPF, terminating the process tree and preventing lateral movement. No data exfiltration occurred.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PROCESS TREE TAB */}
            {activeTab === "tree" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                <div className="flex-1 bg-[#12141A] rounded-2xl border border-white/[0.04] p-8 relative overflow-hidden flex items-center justify-center">
                  
                  {/* Decorative background grid */}
                  <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
                  
                  {/* Fake tree visualization */}
                  <div className="relative z-10 flex flex-col items-center">
                    
                    {/* Node 1 */}
                    <div className="bg-[#1A1D24] border border-white/[0.1] rounded-xl p-3 px-6 shadow-lg flex items-center gap-3">
                      <Cpu className="w-5 h-5 text-slate-400" />
                      <div>
                        <div className="text-sm font-bold text-white">services.exe</div>
                        <div className="text-[10px] font-mono text-slate-500">PID: 832 • NT AUTHORITY\SYSTEM</div>
                      </div>
                    </div>
                    
                    {/* Line */}
                    <div className="w-0.5 h-8 bg-white/[0.1]" />
                    
                    {/* Node 2 */}
                    <div className="bg-[#1A1D24] border border-white/[0.1] rounded-xl p-3 px-6 shadow-lg flex items-center gap-3">
                      <Terminal className="w-5 h-5 text-slate-400" />
                      <div>
                        <div className="text-sm font-bold text-white">cmd.exe</div>
                        <div className="text-[10px] font-mono text-slate-500">PID: 4192 • Spawned child</div>
                      </div>
                    </div>

                    {/* Line */}
                    <div className="w-0.5 h-8 bg-rose-500/50 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                    
                    {/* Node 3 (Malicious) */}
                    <div className="bg-rose-950/40 border border-rose-500/50 rounded-xl p-3 px-6 shadow-[0_0_15px_rgba(244,63,94,0.15)] flex items-center gap-3 relative">
                      <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-rose-500 rounded-full animate-ping" />
                      <AlertTriangle className="w-5 h-5 text-rose-500" />
                      <div>
                        <div className="text-sm font-bold text-white">{incident.vector.split("•")[1]?.trim() || "malware.exe"}</div>
                        <div className="text-[10px] font-mono text-rose-400/80">PID: 9182 • Reflective DLL Injection</div>
                      </div>
                    </div>

                    {/* Terminated Line */}
                    <div className="flex items-center justify-center my-2">
                      <div className="w-0.5 h-6 bg-slate-700 relative">
                        <X className="w-4 h-4 text-rose-500 absolute top-1/2 -translate-y-1/2 -left-[7px]" />
                      </div>
                    </div>

                    {/* Node 4 (Blocked) */}
                    <div className="bg-black/40 border border-slate-700/50 rounded-xl p-3 px-6 opacity-50 flex items-center gap-3">
                      <Database className="w-5 h-5 text-slate-600" />
                      <div>
                        <div className="text-sm font-bold text-slate-500 line-through">vssadmin.exe delete shadows</div>
                        <div className="text-[10px] font-mono text-slate-600">TERMINATED BY eBPF HOOK</div>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {/* INTELLIGENCE TAB */}
            {activeTab === "intelligence" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {vtLoading ? (
                  <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <div className="w-8 h-8 rounded-full border-2 border-[#FF7A00] border-t-transparent animate-spin" />
                    <div className="text-sm text-slate-400 font-mono">Querying Threat Intelligence Networks...</div>
                  </div>
                ) : vtData ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Score Card */}
                    <div className="col-span-1 bg-[#12141A] rounded-2xl p-6 border border-white/[0.04] flex flex-col items-center justify-center text-center">
                      <div className="relative w-32 h-32 mb-4 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-slate-800"
                            strokeWidth="3"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className={`${vtData.severity === 'CRITICAL' ? 'text-rose-500' : 'text-amber-500'}`}
                            strokeWidth="3"
                            strokeDasharray={`${(vtData.positives / vtData.totalEngines) * 100}, 100`}
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-bold text-white">{vtData.positives}</span>
                          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">/ {vtData.totalEngines}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-white">{vtData.family}</h3>
                      <p className="text-xs text-slate-400 mt-2">{vtData.description}</p>
                    </div>

                    {/* Engines List */}
                    <div className="col-span-1 md:col-span-2 bg-[#12141A] rounded-2xl p-6 border border-white/[0.04]">
                      <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" /> Vendor Engine Detections
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                        {Object.entries(vtData.engines || {}).map(([vendor, detection]) => (
                          <div key={vendor} className="bg-rose-950/10 border border-rose-900/30 rounded-xl p-3 flex flex-col">
                            <span className="text-[10px] font-mono text-slate-500 mb-1">{vendor}</span>
                            <span className="text-xs font-bold text-rose-400 truncate" title={String(detection)}>{String(detection)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <ShieldAlert className="w-8 h-8 text-slate-600" />
                    <div className="text-sm text-slate-500 font-mono">No intelligence data available for this payload.</div>
                  </div>
                )}
              </motion.div>
            )}

            {/* eBPF TRACE TAB */}
            {activeTab === "trace" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                <div className="bg-[#0A0C10] rounded-xl border border-white/10 h-full overflow-hidden flex flex-col">
                  <div className="bg-[#12141A] px-4 py-2 border-b border-white/10 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-mono text-slate-400">ebpf-sensor-d • Ring-0 Trace</span>
                  </div>
                  <div className="p-4 font-mono text-[11px] text-green-400/80 leading-relaxed overflow-y-auto custom-scrollbar flex-1">
                    <div className="text-slate-500 mb-2"># attaching kprobe to sys_execve...</div>
                    <div className="text-slate-500 mb-4"># attaching tracepoint to sched:sched_process_exec...</div>
                    
                    <div>[{incident.timestamp}.102] sys_clone (pid: 9182, ppid: 832) -&gt; SUCCESS</div>
                    <div>[{incident.timestamp}.115] sys_mmap (pid: 9182, addr: 0x0, len: 4096, prot: PROT_READ|PROT_WRITE|PROT_EXEC) -&gt; 0x7f8a9b200000</div>
                    <div className="text-amber-400">[{incident.timestamp}.120] !! HEURISTIC WARNING: PROT_EXEC mapped dynamically</div>
                    <div>[{incident.timestamp}.305] sys_read (fd: 3, buf: 0x7f8a9b200000, count: 1024) -&gt; SUCCESS</div>
                    <div className="text-rose-400 font-bold mt-2">[{incident.timestamp}.450] !! CRITICAL: IN-MEMORY PE PAYLOAD DETECTED (MZ header matched)</div>
                    <div className="text-rose-400 font-bold">[{incident.timestamp}.451] -&gt; TRIGGER: bpf_send_signal(SIGKILL)</div>
                    <div className="text-emerald-400 mt-2">[{incident.timestamp}.452] sys_exit_group (pid: 9182) -&gt; process terminated</div>
                    <div className="text-emerald-400">[{incident.timestamp}.455] bpf_probe_read: malicious memory region scrubbed</div>
                    
                    <div className="mt-4 flex items-center gap-2 text-slate-500 animate-pulse">
                      <Play className="w-3 h-3" /> Listening for new syscalls...
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
