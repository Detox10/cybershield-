"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Download,
  Share2,
  Copy,
  Check,
  Shield,
  Smartphone,
  Monitor,
  ExternalLink,
  Lock,
  X,
  FileSpreadsheet,
} from "lucide-react";

interface DownloadShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadShareModal: React.FC<DownloadShareModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const currentUrl = typeof window !== "undefined" ? window.location.origin : "https://cybershield.os";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Create a downloadable Windows/Desktop Web App Shortcut (.url file)
      const shortcutContent = `[InternetShortcut]\nURL=${currentUrl}\nIDList=\n[{000214A0-0000-0000-C000-00000000046}] \nProp3=19,2\n`;
      const blob = new Blob([shortcutContent], { type: "application/x-mswinurl" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "CyberShield_Sentinel_OS.url";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadDiagnosticReport = () => {
    const diagnosticData = {
      app: "CyberShield Sentinel Defense OS",
      version: "2.4.0",
      timestamp: new Date().toISOString(),
      system_diagnostics: {
        host: typeof window !== "undefined" ? window.navigator.userAgent : "Mobile/Desktop",
        cores: typeof window !== "undefined" ? window.navigator.hardwareConcurrency || 8 : 8,
        status: "OPTIMAL",
        entropy_trigger: 7.5,
        ebpf_telemetry: "ACTIVE",
        zero_trust_status: "ENFORCED",
      },
      quarantine_vault_count: "927 · SIMULATED",
      backend_portal_access: `${currentUrl}/admin`,
    };

    const blob = new Blob([JSON.stringify(diagnosticData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cybershield-system-diagnostics.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-3xl p-6 shadow-2xl border space-y-6 relative"
        style={{
          backgroundColor: "var(--cs-bg-card)",
          borderColor: "var(--cs-border-strong)",
          color: "var(--cs-text-primary)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl hover:bg-slate-500/10 transition-colors"
          style={{ color: "var(--cs-text-muted)" }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF7A00] to-[#FF4500] flex items-center justify-center text-white shadow-lg">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold tracking-tight">
              Download App &amp; Sharable Link
            </h3>
            <p className="text-xs" style={{ color: "var(--cs-text-muted)" }}>
              Access CyberShield across Mobile, Desktop, and Admin Backend Portal
            </p>
          </div>
        </div>

        {/* 1. Sharable App Link */}
        <div
          className="p-4 rounded-2xl space-y-3"
          style={{
            backgroundColor: "var(--cs-bg-surface)",
            border: "1px solid var(--cs-border)",
          }}
        >
          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2">
              <Share2 className="w-3.5 h-3.5" style={{ color: "var(--cs-accent)" }} />
              <span>Sharable Web Application Link</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">LIVE</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="w-full text-xs font-mono px-3 py-2 rounded-xl border focus:outline-none select-all"
              style={{
                backgroundColor: "var(--cs-bg-input)",
                borderColor: "var(--cs-border)",
                color: "var(--cs-text-primary)",
              }}
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
              style={{ backgroundColor: "var(--cs-accent)" }}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2. Download App for Desktop & Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            className="p-4 rounded-2xl space-y-2 flex flex-col justify-between"
            style={{
              backgroundColor: "var(--cs-bg-surface)",
              border: "1px solid var(--cs-border)",
            }}
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-bold">
                <Monitor className="w-4 h-4 text-sky-400" />
                <span>Desktop / PWA App</span>
              </div>
              <p className="text-[10px] mt-1" style={{ color: "var(--cs-text-muted)" }}>
                Install standalone CyberShield application on Windows / macOS / Linux.
              </p>
            </div>
            <button
              onClick={handleInstallPWA}
              className="w-full mt-2 py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 hover:bg-sky-500/10 transition-colors cursor-pointer"
              style={{
                borderColor: "var(--cs-border-strong)",
                color: "var(--cs-text-primary)",
              }}
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>{isInstalled ? "App Installed" : "Download / Install"}</span>
            </button>
          </div>

          <div
            className="p-4 rounded-2xl space-y-2 flex flex-col justify-between"
            style={{
              backgroundColor: "var(--cs-bg-surface)",
              border: "1px solid var(--cs-border)",
            }}
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-bold">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>System Diagnosis</span>
              </div>
              <p className="text-[10px] mt-1" style={{ color: "var(--cs-text-muted)" }}>
                Download system &amp; mobile telemetry diagnostic report.
              </p>
            </div>
            <button
              onClick={handleDownloadDiagnosticReport}
              className="w-full mt-2 py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-500/10 transition-colors cursor-pointer"
              style={{
                borderColor: "var(--cs-border-strong)",
                color: "var(--cs-text-primary)",
              }}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download Diagnostics</span>
            </button>
          </div>
        </div>

        {/* 3. Dedicated Separate Admin Portal */}
        <div
          className="p-4 rounded-2xl flex items-center justify-between gap-4"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-rose-400">
                Separate Admin &amp; Database Portal
              </div>
              <div className="text-[10px] text-slate-400">
                Restricted access for Database, API Keys, and Role Management.
              </div>
            </div>
          </div>

          <Link
            href="/admin"
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-lg"
          >
            <span>Open Admin</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DownloadShareModal;
