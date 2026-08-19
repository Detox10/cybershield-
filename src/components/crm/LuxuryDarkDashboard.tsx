"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ShieldAlert,
  Activity,
  Lock,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  HelpCircle,
  Home,
  ChevronRight,
  Shield,
  Sparkles,
  Bug,
  Cpu,
  FileText,
  Printer,
  HardDrive,
  Network
} from "lucide-react";
import GlowingBarChart from "./GlowingBarChart";
import RadialRevenueDonut from "./RadialRevenueDonut";
import DealsTable from "./DealsTable";
import SecurityTimeline from "../dashboard/SecurityTimeline";
import FleetManagementTable from "./FleetManagementTable";
import { PhysicalReportModal } from "@/components/reports/PhysicalReportModal";
import DownloadShareModal from "@/components/modals/DownloadShareModal";
import { ControlPanelModal } from "@/components/modals/ControlPanelModal";
import { useTelemetryStore } from "@/store/telemetryStore";
import { Download } from "lucide-react";

interface LuxuryDarkDashboardProps {
  onNavigateScanner?: () => void;
  onNavigateTelemetry?: () => void;
  onNavigateZeroTrust?: () => void;
  onNavigateIncidents?: () => void;
  onNavigateQuarantine?: () => void;
}

export const LuxuryDarkDashboard: React.FC<LuxuryDarkDashboardProps> = ({
  onNavigateScanner,
  onNavigateTelemetry,
  onNavigateZeroTrust,
  onNavigateIncidents,
  onNavigateQuarantine,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);

  const {
    cpuLoad,
    cpuModel,
    cpuCores,
    memUsedGb,
    memTotalGb,
    memUsagePercent,
    diskUsedGb,
    diskTotalGb,
    diskUsagePercent,
    rxMbps,
    txMbps,
    fetchSystemStats,
    fetchData
  } = useTelemetryStore();

  React.useEffect(() => {
    // Initial fetch
    fetchSystemStats();
    fetchData();
    // Poll every 5 seconds to simulate live real-time OS telemetry
    const interval = setInterval(() => {
      fetchSystemStats();
      fetchData();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchSystemStats, fetchData]);

  return (
    <div className="relative min-h-screen w-full bg-[#0B0C10] text-slate-100 flex flex-col p-4 sm:p-8 font-sans overflow-x-hidden select-none">
      {/* Warm Ambient Orange Atmospheric Glow in Top Left */}
      <div className="absolute top-[-100px] left-[-100px] w-[540px] h-[540px] bg-gradient-to-br from-[#FF6A00]/20 via-[#FF3B00]/10 to-transparent rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[30%] right-[-100px] w-[400px] h-[400px] bg-gradient-to-bl from-[#FF8800]/10 to-transparent rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Main Glass Shell Container */}
      <div className="relative z-10 max-w-7xl w-full mx-auto space-y-6">
        {/* Top Application Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-slate-200 font-semibold">Threat Radar & Overview</span>
            <span className="ml-4 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE HOST
            </span>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            
            {/* Control Panel Button */}
            <button
              onClick={() => setIsControlPanelOpen(true)}
              data-hud-title="Simulation Control Panel"
              data-hud-info="Inject anomalies and trigger system-wide telemetry syncing."
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 backdrop-blur-xl text-amber-500 text-xs font-bold transition-all border border-amber-500/30 cursor-pointer shadow-lg shadow-amber-900/20"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Control Panel</span>
            </button>

            {/* Download & Share App Button */}
            <button
              onClick={() => setIsDownloadOpen(true)}
              data-hud-title="Download & Share App"
              data-hud-info="Download desktop shortcut, share web link, or access dedicated Admin Database Portal."
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-xl text-white text-xs font-bold transition-all border border-white/10 cursor-pointer shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Download &amp; Share</span>
            </button>

            {/* Generate Physical Report Button */}
            <button
              onClick={() => setIsReportOpen(true)}
              data-hud-title="Physical Security Audit"
              data-hud-info="Generate and print an official, physical compliance audit certificate with full hardware specs, scan database records, and digital signature."
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#FF7A00]/80 to-[#FF8C1A]/80 backdrop-blur-xl hover:from-[#FF7A00] hover:to-[#FF8C1A] text-white text-xs font-bold transition-all border border-white/20 shadow-[0_8px_32px_0_rgba(255,122,0,0.4)] cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Physical Audit Report</span>
            </button>

            {/* Top Search Pill */}
            <div className="relative w-48 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search telemetry, CVEs, nodes..."
                className="w-full pl-9 pr-3 py-2 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all shadow-[0_4px_16px_0_rgba(0,0,0,0.2)]"
              />
            </div>

            {/* Profile Avatar & User Badge */}
            <div className="flex items-center gap-3 pl-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6A00] to-[#FF3B00] border border-white/10 flex items-center justify-center font-bold text-xs text-white shadow-sm">
                CS
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-white leading-tight">
                  Security Officer
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  @sentinel-root
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Top KPI Security Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: CPU Processor */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            onClick={onNavigateTelemetry}
            data-hud-title="CPU Processing Unit"
            data-hud-info={`Monitoring core usage for ${cpuModel}. Click to inspect live telemetry.`}
            className="bg-white/[0.02] border border-white/[0.08] rounded-3xl p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-2xl space-y-3 relative group hover:border-white/20 hover:bg-white/[0.04] transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <span>CPU Processor</span>
                <HelpCircle className="w-3 h-3 text-slate-500" />
              </div>
              <div className="w-8 h-8 rounded-xl bg-[#1A1D25] border border-white/[0.06] flex items-center justify-center text-[#FF7A00]">
                <Cpu className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-2xl font-extrabold text-white tracking-tight flex items-baseline gap-2">
                {cpuLoad}%
              </div>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400 truncate">
                <span className="truncate">{cpuModel} ({cpuCores} Cores)</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Memory Utilization */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            onClick={onNavigateTelemetry}
            data-hud-title="Memory Utilization"
            data-hud-info="Live physical memory (RAM) utilization tracking page table activity."
            className="bg-white/[0.02] border border-white/[0.08] rounded-3xl p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-2xl space-y-3 relative group hover:border-white/20 hover:bg-white/[0.04] transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <span>Memory Utilization</span>
                <HelpCircle className="w-3 h-3 text-slate-500" />
              </div>
              <div className="w-8 h-8 rounded-xl bg-[#1A1D25] border border-white/[0.06] flex items-center justify-center text-sky-400">
                <Activity className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-2xl font-extrabold text-white tracking-tight flex items-baseline gap-2">
                {memUsagePercent}%
              </div>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                <span>{memUsedGb} GB / {memTotalGb} GB Used</span>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Disk Subsystem Health */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            onClick={onNavigateTelemetry}
            data-hud-title="Disk Subsystem Health"
            data-hud-info="Primary volume capacity and IOPS monitoring."
            className="bg-white/[0.02] border border-white/[0.08] rounded-3xl p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-2xl space-y-3 relative group hover:border-white/20 hover:bg-white/[0.04] transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <span>Disk Subsystem Health</span>
                <HelpCircle className="w-3 h-3 text-slate-500" />
              </div>
              <div className="w-8 h-8 rounded-xl bg-[#1A1D25] border border-white/[0.06] flex items-center justify-center text-emerald-400">
                <HardDrive className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-2xl font-extrabold text-white tracking-tight flex items-baseline gap-2">
                {diskUsagePercent}%
              </div>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                <span>{diskUsedGb} GB / {diskTotalGb} GB Used</span>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Network Traffic I/O */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onClick={onNavigateTelemetry}
            data-hud-title="Network Traffic I/O"
            data-hud-info="Real-time inbound and outbound adapter throughput."
            className="bg-white/[0.02] border border-white/[0.08] rounded-3xl p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-2xl space-y-3 relative group hover:border-white/20 hover:bg-white/[0.04] transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <span>Network Traffic I/O</span>
                <HelpCircle className="w-3 h-3 text-slate-500" />
              </div>
              <div className="w-8 h-8 rounded-xl bg-[#1A1D25] border border-white/[0.06] flex items-center justify-center text-rose-400">
                <Network className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-2xl font-extrabold text-white tracking-tight flex items-baseline gap-2">
                {(rxMbps + txMbps).toFixed(1)} <span className="text-xs font-normal text-slate-400">Mbps</span>
              </div>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><ArrowDownRight className="w-3 h-3 text-sky-400"/> {rxMbps} Mbps</span>
                <span className="flex items-center gap-1"><ArrowUpRight className="w-3 h-3 text-rose-400"/> {txMbps} Mbps</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Middle 2-Column Section: Glowing Bar Chart + Defense Health Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GlowingBarChart />
          </div>
          <div className="lg:col-span-1">
            <RadialRevenueDonut />
          </div>
        </div>

        {/* Bottom Section: Active Threat Incidents & Mitigation Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DealsTable />
          </div>
          <div className="lg:col-span-1 h-[450px]">
            <SecurityTimeline />
          </div>
        </div>

        {/* Phase 5 Fleet Section */}
        <div className="w-full">
          <FleetManagementTable />
        </div>
      </div>

      {/* Physical Report Modal */}
      <PhysicalReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

      {/* Download & Share Modal */}
      <DownloadShareModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
      />

      {/* Control Panel Modal */}
      <ControlPanelModal
        isOpen={isControlPanelOpen}
        onClose={() => setIsControlPanelOpen(false)}
      />
    </div>
  );
};
export default LuxuryDarkDashboard;
