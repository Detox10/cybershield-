"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CrmSidebar } from "@/components/crm/CrmSidebar";
import { LuxuryDarkDashboard } from "@/components/crm/LuxuryDarkDashboard";
import MinimalistLoadingScreen from "@/components/loading/MinimalistLoadingScreen";
import MalwareDiagnosticScanner from "@/components/dashboard/MalwareDiagnosticScanner";
import ProgressiveSpikeGraph from "@/components/dashboard/ProgressiveSpikeGraph";
import AIAssistantFlow from "@/components/flows/AIAssistantFlow";
import ThreatAnalysisFlow from "@/components/flows/ThreatAnalysisFlow";
import ScanFlow from "@/components/flows/ScanFlow";
import AuditLogsFlow from "@/components/flows/AuditLogsFlow";
import DeviceDiagnosticsFlow from "@/components/flows/DeviceDiagnosticsFlow";
import ZeroTrustRulesFlow from "@/components/flows/ZeroTrustRulesFlow";
import SettingsFlow from "@/components/flows/SettingsFlow";
import TerminalFlow from "@/components/flows/TerminalFlow";
import EmailSecurityFlow from "@/components/flows/EmailSecurityFlow";
import LoginPage from "@/components/auth/LoginPage";
import CursorInspectorHUD from "@/components/hud/CursorInspectorHUD";
import { UserSession } from "@/components/auth/AuthModal";
import { ThemeManager } from "@/tokens/themeManager";

export default function CyberShieldApp() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isLocked, setIsLocked] = useState(false);
  const [userSession, setUserSession] = useState<UserSession | null>(null);

  // Apply Theme configuration
  useEffect(() => {
    ThemeManager.applyTheme(ThemeManager.getTheme());

    const handleThemeChange = () => {
      ThemeManager.applyTheme(ThemeManager.getTheme());
    };
    window.addEventListener("cybershield_theme_changed", handleThemeChange);

    // Check existing stored session
    const saved = localStorage.getItem("cybershield_session");
    if (saved) {
      try {
        setUserSession(JSON.parse(saved));
      } catch (e) {}
    } else {
      // Default initial session
      const defaultSession: UserSession = {
        email: "root@cybershield.os",
        name: "Sentinel Root Admin",
        role: "SENTINEL_ROOT_ADMIN",
        authProvider: "LOCAL_DEV",
        avatar: "SR",
        loginTime: new Date().toLocaleTimeString(),
      };
      setUserSession(defaultSession);
      localStorage.setItem("cybershield_session", JSON.stringify(defaultSession));
    }

    return () => {
      window.removeEventListener("cybershield_theme_changed", handleThemeChange);
    };
  }, []);

  const handleLockConsole = () => {
    setIsLocked(true);
  };

  const handleLoginSuccess = (session: UserSession) => {
    setUserSession(session);
    setIsLocked(false);
  };

  return (
    <>
      {/* Minimalist Loading Screen Transition */}
      {isLoading && (
        <MinimalistLoadingScreen
          minDurationMs={2200}
          onComplete={() => setIsLoading(false)}
        />
      )}

      {/* Global Progressive Cursor Inspector HUD */}
      <CursorInspectorHUD />

      {/* Dedicated Full Login Page when Locked or unauthenticated */}
      {isLocked ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="h-screen w-screen flex overflow-hidden font-sans select-none" style={{ backgroundColor: 'var(--cs-bg-base)', color: 'var(--cs-text-primary)' }}>
          {/* Left Obsidian Glass Sidebar */}
          <CrmSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            userSession={userSession}
            onLockConsole={handleLockConsole}
          />

          {/* Main Workspace Area with Ambient Light */}
          <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative">
            <AnimatePresence mode="wait">
              {/* 1. Threat Radar (Home Dashboard) */}
              {activeTab === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.24, ease: [0.65, 0, 0.35, 1] }}
                >
                  <LuxuryDarkDashboard
                    onNavigateScanner={() => setActiveTab("scanner")}
                    onNavigateTelemetry={() => setActiveTab("diagnostics")}
                    onNavigateZeroTrust={() => setActiveTab("policy")}
                    onNavigateIncidents={() => setActiveTab("threats")}
                    onNavigateQuarantine={() => setActiveTab("quarantine")}
                  />
                </motion.div>
              )}

              {/* 2. Live Malware Hunter & Sandbox Diagnostics */}
              {activeTab === "scanner" && (
                <motion.div
                  key="scanner"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.24, ease: [0.65, 0, 0.35, 1] }}
                  className="p-8 max-w-7xl mx-auto w-full space-y-6"
                >
                  <MalwareDiagnosticScanner />
                </motion.div>
              )}

              {/* 3. Live Telemetry & Anomaly Spikes */}
              {activeTab === "diagnostics" && (
                <motion.div
                  key="diagnostics"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.24, ease: [0.65, 0, 0.35, 1] }}
                  className="p-8 max-w-7xl mx-auto w-full space-y-6"
                >
                  <ProgressiveSpikeGraph />
                </motion.div>
              )}

              {/* 4. AI Security Copilot */}
              {activeTab === "assistant" && (
                <motion.div
                  key="assistant"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.24, ease: [0.65, 0, 0.35, 1] }}
                  className="p-8 max-w-7xl mx-auto w-full space-y-6"
                >
                  <AIAssistantFlow />
                </motion.div>
              )}

              {/* Sentinel Terminal & Shell Engine */}
              {activeTab === "terminal" && (
                <motion.div
                  key="terminal"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.24, ease: [0.65, 0, 0.35, 1] }}
                  className="p-8 max-w-7xl mx-auto w-full space-y-6"
                >
                  <TerminalFlow />
                </motion.div>
              )}

              {/* 5. Threat Incidents Feed */}
              {activeTab === "threats" && (
                <motion.div
                  key="threats"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.24, ease: [0.65, 0, 0.35, 1] }}
                  className="p-8 max-w-7xl mx-auto w-full space-y-6"
                >
                  <ThreatAnalysisFlow />
                </motion.div>
              )}

              {/* 6. Quarantine Vault */}
              {activeTab === "quarantine" && (
                <motion.div
                  key="quarantine"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.24, ease: [0.65, 0, 0.35, 1] }}
                  className="p-8 max-w-7xl mx-auto w-full space-y-6"
                >
                  <ScanFlow onSetCoreState={() => {}} />
                </motion.div>
              )}

              {/* 7. Fleet Endpoints & Real Hardware Diagnostics */}
              {activeTab === "endpoints" && (
                <motion.div
                  key="endpoints"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.24, ease: [0.65, 0, 0.35, 1] }}
                  className="p-8 max-w-7xl mx-auto w-full space-y-6"
                >
                  <DeviceDiagnosticsFlow />
                </motion.div>
              )}

              {/* 8. Audit Logs */}
              {activeTab === "audit" && (
                <motion.div
                  key="audit"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.24, ease: [0.65, 0, 0.35, 1] }}
                  className="p-8 max-w-7xl mx-auto w-full space-y-6"
                >
                  <AuditLogsFlow />
                </motion.div>
              )}

              {/* 9. Zero-Trust Policy Rules */}
              {activeTab === "policy" && (
                <motion.div
                  key="policy"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.24, ease: [0.65, 0, 0.35, 1] }}
                  className="p-8 max-w-7xl mx-auto w-full space-y-6"
                >
                  <ZeroTrustRulesFlow />
                </motion.div>
              )}

              {/* 10. Defense Config & API Keys */}
              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.24, ease: [0.65, 0, 0.35, 1] }}
                  className="p-8 max-w-7xl mx-auto w-full space-y-6"
                >
                  <SettingsFlow />
                </motion.div>
              )}

              {/* 11. Email Security */}
              {activeTab === "email" && (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.24, ease: [0.65, 0, 0.35, 1] }}
                  className="p-8 max-w-7xl mx-auto w-full space-y-6"
                >
                  <EmailSecurityFlow />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </>
  );
}
