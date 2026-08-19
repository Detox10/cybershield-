"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal, X, Play, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

interface SecurityConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SecurityConsoleModal({
  isOpen,
  onClose,
}: SecurityConsoleModalProps) {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState<string[]>([
    "CyberShield Sentinel Kernel v4.8-PRO [x86_64-quantum-arch]",
    "Zero-Trust Policy Engine: ACTIVE | Hardware Encrypted Enclave: OK",
    "Type 'help' for available diagnostics or click preset commands below.",
    "",
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [output, isOpen]);

  if (!isOpen) return null;

  const runCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    setOutput((prev) => [...prev, `root@cybershield:~# ${trimmed}`]);
    setIsRunning(true);

    setTimeout(() => {
      let responses: string[] = [];
      const lower = trimmed.toLowerCase();

      if (lower === "help") {
        responses = [
          "Available Diagnostics & Security Operations:",
          "  audit --deep             Execute comprehensive system vulnerability scan",
          "  dns --verify             Test DNSSEC validation and poisoned cache status",
          "  tls --benchmark          Verify quantum-resistant cipher suites (Kyber/Dilithium)",
          "  portscan --active        Inspect ingress boundary ports and firewall rules",
          "  lockdown --engage        Force instantaneous perimeter zero-trust quarantine",
          "  clear                    Clear terminal screen",
        ];
      } else if (lower.startsWith("audit")) {
        responses = [
          "[*] Initializing deep system vulnerability scanner...",
          "[+] Checking Linux Kernel eBPF filters: HARDENED (No anomalies)",
          "[+] Verifying RASP (Runtime Application Self-Protection): ACTIVE",
          "[+] Scanning 1,420 microservices for CVE-2026-XXXX: 0 VULNERABILITIES FOUND",
          "[+] Memory Corruptions check: 0 Buffer overflows detected",
          "[✓] Audit Complete: System Score 99.8% (AAA+ Grade)",
        ];
      } else if (lower.startsWith("dns")) {
        responses = [
          "[*] Probing Recursive Anycast DNS Resolvers...",
          "[+] Querying 1.1.1.1, 8.8.8.8, 9.9.9.9 with DNSSEC validation...",
          "[+] Cryptographic signature RRSIG verified on root zone (.)",
          "[+] Zero DNS Cache poisoning anomalies identified",
          "[✓] DNS Integrity Status: 100% HEALTHY",
        ];
      } else if (lower.startsWith("tls")) {
        responses = [
          "[*] Benchmarking TLS 1.3 & Post-Quantum Cipher Suites...",
          "[+] Handshake Test: TLS_AES_256_GCM_SHA384 (Negotiated in 0.8ms)",
          "[+] KEM: Kyber-1024 Lattice-based Key Exchange: VERIFIED",
          "[+] Signature Scheme: Dilithium-3 Quantum-resistant: VALID",
          "[✓] Perfect Forward Secrecy & Quantum Shielding: FULLY ENGAGED",
        ];
      } else if (lower.startsWith("portscan")) {
        responses = [
          "[*] Scanning Ingress Boundary (142 Mesh Nodes)...",
          "  PORT 80/TCP   - REDIRECTED TO HTTPS [OK]",
          "  PORT 443/TCP  - TLS 1.3 QUANTUM ENCRYPTED [OK]",
          "  PORT 8443/TCP - gRPC ZERO-TRUST MUTUAL TLS [OK]",
          "  PORT 22/TCP   - HARDWARE KEY ROTATING JUMP-HOST [FILTERED]",
          "  ALL OTHER PORTS: DROPPED BY NEURAL FIREWALL",
          "[✓] Port Surface Scan Complete: 0 Exposed Weaknesses",
        ];
      } else if (lower.startsWith("lockdown")) {
        responses = [
          "[!] WARNING: INITIATING HIGH-SECURITY LOCKDOWN SEQUENCE...",
          "[+] Dropping all non-authenticated telemetry packets...",
          "[+] Engaging biometric mTLS multi-factor barrier on all gateways...",
          "[+] Micro-segmenting internal cluster networks...",
          "[✓] LOCKDOWN ENGAGED: Perimeter Sealed against external vectors.",
        ];
      } else if (lower === "clear") {
        setOutput([]);
        setIsRunning(false);
        return;
      } else {
        responses = [
          `bash: command not found: ${trimmed}. Type 'help' for diagnostics.`,
        ];
      }

      setOutput((prev) => [...prev, ...responses, ""]);
      setIsRunning(false);
    }, 600);

    setCommand("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runCommand(command);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-[#070b14] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="flex items-center space-x-1.5 text-xs font-mono text-cyan-400 pl-3">
              <Terminal className="w-4 h-4" />
              <span>cybershield-sentinel-terminal://root@defense-mesh</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Terminal Output */}
        <div className="p-4 overflow-y-auto flex-1 font-mono text-xs text-slate-300 space-y-1 bg-[#050811] min-h-[300px]">
          {output.map((line, idx) => {
            let color = "text-slate-300";
            if (line.startsWith("root@cybershield")) color = "text-cyan-400 font-bold";
            else if (line.startsWith("[+]")) color = "text-emerald-400";
            else if (line.startsWith("[✓]")) color = "text-teal-300 font-bold";
            else if (line.startsWith("[!]")) color = "text-rose-400 font-bold";
            else if (line.startsWith("[*]")) color = "text-blue-300";

            return (
              <div key={idx} className={color}>
                {line}
              </div>
            );
          })}
          {isRunning && (
            <div className="text-cyan-400 flex items-center gap-2 animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Executing diagnostic routine...</span>
            </div>
          )}
          <div ref={terminalEndRef} />
        </div>

        {/* Preset Quick Command Buttons */}
        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800/80 flex flex-wrap gap-2 text-[11px] font-mono">
          <span className="text-slate-500 self-center">Presets:</span>
          {["audit --deep", "dns --verify", "tls --benchmark", "portscan --active", "lockdown --engage"].map((preset) => (
            <button
              key={preset}
              onClick={() => runCommand(preset)}
              disabled={isRunning}
              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 hover:border-cyan-500/50 transition-all"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Terminal Command Input */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2 font-mono text-xs">
          <span className="text-cyan-400 font-bold">root@cybershield:~#</span>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isRunning}
            placeholder="Type command (e.g. audit --deep)..."
            className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-600 focus:outline-none"
            autoFocus
          />
          <button
            onClick={() => runCommand(command)}
            disabled={isRunning || !command.trim()}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all disabled:opacity-40"
          >
            Run
          </button>
        </div>
      </div>
    </div>
  );
}
