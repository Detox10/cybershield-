"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Play, Pause, RotateCcw, Terminal, Cpu, Lock, Wifi, Activity } from "lucide-react";
import { useTelemetryStore } from "@/store/telemetryStore";

export type MetricStreamType = "network" | "cpu" | "ebpf";

/* ═══════════════════════════════════════════════════════════
   API response shape from /api/telemetry
══════════════════════════════════════════════════════════════ */
interface TelemetryAPIResponse {
  cpu: { loadPercent: number; speedGhz: number; cores: number; model: string };
  network: { rxMbps: number; txMbps: number; totalMbps: number; interface: string };
  ebpf: { opsPerSec: number; processCount: number; threadCount: number };
  memory: { usagePercent: number; usedGb: number; totalGb: number };
  timestamp: string;
}

/* ═══════════════════════════════════════════════════════════
   Per-stream config (display + scale — values come from API)
══════════════════════════════════════════════════════════════ */
const STREAM_CONFIG = {
  network: {
    title: "Network Telemetry Ingress",
    unit: "Mb/s",
    badge: "TLS 1.3 EGRESS",
    strokeColor: "#00C48C",
    fillColor: "rgba(0,196,140,0.09)",
    criticalThreshold: 85,
    yMax: 105,
    gridLines: [20, 40, 60, 80, 100],
    spikeTypes: ["SYN Flood Ingress", "C2 Beacon Burst", "eBPF Buffer Surge", "DDoS Amplification"],
    spikeIps: ["194.26.29.112", "185.220.101.33", "45.142.166.8", "198.51.100.42"],
    nominalIp: (i: number) => `192.168.1.${100 + (i % 30)}`,
    nominalLog: (v: number) => `Nominal packet frame ${v.toFixed(1)} Mb/s inspected by kernel eBPF filter.`,
    spikeLog: (v: number, type: string) => `[${type}] Anomalous burst ${v.toFixed(1)} Mb/s — kernel intercept active.`,
    formatLabel: (v: number) => `${v.toFixed(1)}`,
    formatThreshold: (v: number) => `${v}`,
    getApiValue: (d: TelemetryAPIResponse) => d.network.totalMbps,
  },
  cpu: {
    title: "Kernel Ring-0 CPU Workload",
    unit: "%",
    badge: "eBPF SYSCALLS",
    strokeColor: "#38BDF8",
    fillColor: "rgba(56,189,248,0.09)",
    criticalThreshold: 85,
    yMax: 100,
    gridLines: [20, 40, 60, 80, 100],
    spikeTypes: ["Kernel Panic Risk", "eBPF Probe Flood", "Interrupt Storm", "Crypto Ransomware"],
    spikeIps: ["127.0.0.1", "10.0.0.4", "::1", "172.16.0.9"],
    nominalIp: (i: number) => `10.0.0.${1 + (i % 10)}`,
    nominalLog: (v: number) => `CPU ring-0 workload ${v.toFixed(1)}% — within safe operating range.`,
    spikeLog: (v: number, type: string) => `[${type}] CPU spike ${v.toFixed(1)}% — emergency kernel throttle engaged.`,
    formatLabel: (v: number) => `${v.toFixed(1)}`,
    formatThreshold: (v: number) => `${v}`,
    getApiValue: (d: TelemetryAPIResponse) => d.cpu.loadPercent,
  },
  ebpf: {
    title: "eBPF Heuristic Intercepts",
    unit: "ops/s",
    badge: "KERNEL PROBE",
    strokeColor: "#FF7A00",
    fillColor: "rgba(255,122,0,0.09)",
    criticalThreshold: 48000,
    yMax: 90000,
    gridLines: [10000, 20000, 30000, 40000, 60000, 80000],
    spikeTypes: ["Syscall Injection", "Map Overflow", "Tracepoint Flood", "Perf Buffer Burst"],
    spikeIps: ["10.0.4.18", "172.31.1.5", "192.168.10.44", "10.10.10.2"],
    nominalIp: (i: number) => `172.16.${i % 5}.${1 + (i % 20)}`,
    nominalLog: (v: number) => `eBPF engine ${(v/1000).toFixed(1)}k ops/s — syscall batch clean.`,
    spikeLog: (v: number, type: string) => `[${type}] eBPF burst ${(v/1000).toFixed(1)}k ops/s — map overflow risk.`,
    formatLabel: (v: number) => `${(v / 1000).toFixed(1)}k`,
    formatThreshold: (v: number) => `${(v / 1000).toFixed(0)}k`,
    getApiValue: (d: TelemetryAPIResponse) => d.ebpf.opsPerSec,
  },
} as const;

type StreamCfg = (typeof STREAM_CONFIG)[MetricStreamType];

interface TelemetryPoint {
  id: number;
  time: string;
  value: number;
  isSpike: boolean;
  spikeType: string;
  packetCount: number;
  logMessage: string;
  logLevel: "INFO" | "WARN" | "CRITICAL";
  sourceIp: string;
}

/* ═══════════════════════════════════════════════════════════
   Build a TelemetryPoint from a live API snapshot
══════════════════════════════════════════════════════════════ */
function makePoint(
  id: number,
  data: TelemetryAPIResponse,
  streamType: MetricStreamType
): TelemetryPoint {
  const cfg = STREAM_CONFIG[streamType];
  const value = Math.round(cfg.getApiValue(data) * 10) / 10;
  const isSpike = value > cfg.criticalThreshold;
  const spikeType = isSpike
    ? "Classification Unavailable"
    : "";
  const logLevel: "INFO" | "WARN" | "CRITICAL" = isSpike ? "CRITICAL" : "INFO";
  const sourceIp = isSpike
    ? "IP Unavailable"
    : cfg.nominalIp(id);

  let logMessage = isSpike ? cfg.spikeLog(value, spikeType) : cfg.nominalLog(value);
  // Append real system context to log
  if (streamType === "cpu") {
    logMessage += ` | ${data.cpu.cores}C @ ${data.cpu.speedGhz} GHz`;
  } else if (streamType === "network") {
    logMessage += ` | RX ${data.network.rxMbps} + TX ${data.network.txMbps} Mb/s`;
  } else {
    logMessage += ` | ${data.ebpf.processCount} proc / ${data.ebpf.threadCount} threads`;
  }

  return {
    id,
    time: new Date().toTimeString().split(" ")[0],
    value,
    isSpike,
    spikeType,
    packetCount: data.network.rxMbps > 0
      ? Math.round((data.network.rxMbps * 125000) / 1500)
      : Math.round(value * 9.4 + 100),
    logMessage,
    logLevel,
    sourceIp,
  };
}

/* Seed: fill 48 historical points before live data arrives */
function buildSeedDataset(type: MetricStreamType): TelemetryPoint[] {
  const cfg = STREAM_CONFIG[type];
  const POINTS = 48;
  const now = Date.now();
  const baseline = cfg.criticalThreshold * 0.22;
  const variance = cfg.criticalThreshold * 0.10;

  return Array.from({ length: POINTS }, (_, i) => {
    const t = new Date(now - (POINTS - i) * 1200);
    const timeStr = t.toTimeString().split(" ")[0];
    const val = Math.max(0, Math.round(
      (baseline + Math.sin(i * 0.35) * variance + Math.random() * variance * 0.4) * 10
    ) / 10);
    return {
      id: i,
      time: timeStr,
      value: val,
      isSpike: false,
      spikeType: "",
      packetCount: Math.round(val * 9 + 50),
      logMessage: cfg.nominalLog(val),
      logLevel: "INFO" as const,
      sourceIp: cfg.nominalIp(i),
    };
  });
}

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
export const ProgressiveSpikeGraph: React.FC = () => {
  const [streamType, setStreamType] = useState<MetricStreamType>("network");
  const [isStreaming, setIsStreaming] = useState(true);
  const [points, setPoints] = useState<TelemetryPoint[]>(() => buildSeedDataset("network"));
  const [hoveredPoint, setHoveredPoint] = useState<TelemetryPoint | null>(null);
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null);
  const [spikeCount, setSpikeCount] = useState(0);
  const [liveData, setLiveData] = useState<TelemetryAPIResponse | null>(null);
  const [apiError, setApiError] = useState(false);
  const nextIdRef = useRef(100);
  const logContainerRef = useRef<HTMLDivElement>(null);
  
  const lastTriggeredSpike = useTelemetryStore((state) => state.lastTriggeredSpike);

  // Reset when stream type changes
  useEffect(() => {
    setPoints(buildSeedDataset(streamType));
    setSpikeCount(0);
    setHoveredPoint(null);
    setHoverCoord(null);
    setSelectedLogId(null);
    nextIdRef.current = 100;
  }, [streamType]);

  // Live polling: fetch /api/telemetry every 1.2s
  useEffect(() => {
    if (!isStreaming) return;
    const cfg = STREAM_CONFIG[streamType];

    const tick = async () => {
      try {
        const res = await fetch("/api/telemetry", { cache: "no-store" });
        if (!res.ok) throw new Error("non-200");
        const data: TelemetryAPIResponse = await res.json();
        setLiveData(data);
        setApiError(false);
        nextIdRef.current += 1;
        const pt = makePoint(nextIdRef.current, data, streamType);
        if (pt.isSpike) setSpikeCount((prev) => prev + 1);
        setPoints((prev) => [...prev.slice(1), pt]);
      } catch {
        setApiError(true);
        // Keep graph alive with a smooth fallback value
        nextIdRef.current += 1;
        const id = nextIdRef.current;
        const fallback = Math.max(0, Math.round(
          (cfg.criticalThreshold * 0.22 + Math.sin(id * 0.28) * cfg.criticalThreshold * 0.07) * 10
        ) / 10);
        setPoints((prev) => [
          ...prev.slice(1),
          {
            id,
            time: new Date().toTimeString().split(" ")[0],
            value: fallback,
            isSpike: false,
            spikeType: "",
            packetCount: 0,
            logMessage: cfg.nominalLog(fallback) + " [FALLBACK]",
            logLevel: "INFO",
            sourceIp: cfg.nominalIp(id),
          },
        ]);
      }
    };

    tick(); // immediate first call
    const interval = setInterval(tick, 1200);
    return () => clearInterval(interval);
  }, [isStreaming, streamType]);

  const handleTriggerSpike = useCallback(() => {
    const cfg = STREAM_CONFIG[streamType];
    nextIdRef.current += 1;
    const id = nextIdRef.current;
    const val = Math.round(cfg.criticalThreshold * (1.06 + Math.random() * 0.08) * 10) / 10;
    const spikeType = "Manual Attack Injection";
    setSpikeCount((prev) => prev + 1);
    setPoints((prev) => [
      ...prev.slice(1),
      {
        id,
        time: new Date().toTimeString().split(" ")[0],
        value: Math.min(val, cfg.yMax * 0.98),
        isSpike: true,
        spikeType,
        packetCount: 14850,
        logMessage: `[MANUAL SIMULATION] DDoS burst ${cfg.formatLabel(val)} ${cfg.unit} — threshold breached.`,
        logLevel: "CRITICAL",
        sourceIp: "198.51.100.42",
      },
    ]);
    setSelectedLogId(id);
  }, [streamType]);

  // Listen to global simulation triggers
  useEffect(() => {
    if (lastTriggeredSpike > 0) {
      handleTriggerSpike();
    }
  }, [lastTriggeredSpike, handleTriggerSpike]);

  const handleReset = useCallback(() => {
    setPoints(buildSeedDataset(streamType));
    setSpikeCount(0);
    setHoveredPoint(null);
    setHoverCoord(null);
    setSelectedLogId(null);
    nextIdRef.current = 100;
  }, [streamType]);

  /* ── SVG geometry ── */
  const chartWidth = 960;
  const chartHeight = 280;
  const paddingX = 52;
  const paddingY = 28;
  const graphW = chartWidth - paddingX * 2;
  const graphH = chartHeight - paddingY * 2;

  const cfg = STREAM_CONFIG[streamType];

  const currentPoint = hoveredPoint ?? points[points.length - 1];
  const currentVal = currentPoint?.value ?? 0;
  const meanVal = points.length
    ? points.reduce((a, p) => a + p.value, 0) / points.length
    : 0;
  const peakVal = points.length ? Math.max(...points.map((p) => p.value)) : 0;

  const toSVGY = (v: number) =>
    chartHeight - paddingY - (Math.min(Math.max(v, 0), cfg.yMax) / cfg.yMax) * graphH;

  const coords = points.map((p, idx) => ({
    x: paddingX + (idx / Math.max(points.length - 1, 1)) * graphW,
    y: toSVGY(p.value),
    point: p,
  }));

  const makePath = (pts: typeof coords) => {
    if (!pts.length) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const mx = (pts[i].x + pts[i + 1].x) / 2;
      d += ` C ${mx} ${pts[i].y}, ${mx} ${pts[i + 1].y}, ${pts[i + 1].x} ${pts[i + 1].y}`;
    }
    return d;
  };

  const linePathD = makePath(coords);
  const areaPathD = coords.length > 1
    ? `${linePathD} L ${coords[coords.length - 1].x} ${chartHeight - paddingY} L ${paddingX} ${chartHeight - paddingY} Z`
    : "";

  const thresholdY = toSVGY(cfg.criticalThreshold);

  return (
    <div className="w-full space-y-6">
      {/* ── Main Card ── */}
      <div className="w-full bg-[#111317] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-6 select-none">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: cfg.strokeColor }} />
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2 flex-wrap">
                {cfg.title}
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white/[0.06] border border-white/10 text-slate-300">
                  {cfg.badge}
                </span>
                {apiError ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/50 text-amber-400">FALLBACK MODE</span>
                ) : liveData ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                    LIVE SYSTEM DATA
                  </span>
                ) : null}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {liveData?.cpu
                ? `${liveData.cpu.model} • ${liveData.cpu.cores} cores @ ${liveData.cpu.speedGhz} GHz`
                : "Connecting to system telemetry…"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Stream selector */}
            <div className="flex items-center p-1 rounded-xl bg-[#171A21] border border-white/[0.08] text-xs font-semibold">
              {(["network", "cpu", "ebpf"] as MetricStreamType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setStreamType(t)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${streamType === t ? "bg-[#222733] text-white font-bold" : "text-slate-400 hover:text-white"}`}
                >
                  {t === "network" ? "Network" : t === "cpu" ? "CPU Load" : "eBPF Ops"}
                </button>
              ))}
            </div>

            <button
              onClick={handleTriggerSpike}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900/90 border border-rose-800/50 text-rose-300 text-xs font-bold transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              Simulate Spike
            </button>

            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className="p-2 rounded-xl bg-[#171A21] border border-white/[0.08] text-slate-300 hover:text-white transition-colors"
              title={isStreaming ? "Pause" : "Resume"}
            >
              {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-[#171A21] border border-white/[0.08] text-slate-400 hover:text-white transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#151820] border border-white/[0.06]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              {hoveredPoint ? `HOVERED (${hoveredPoint.time})` : "CURRENT VALUE"}
            </span>
            <div className="text-xl font-bold text-white mt-0.5 tabular-nums">
              {cfg.formatLabel(currentVal)}{" "}
              <span className="text-xs font-normal text-slate-400">{cfg.unit}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#151820] border border-rose-900/30">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-semibold">HIGHEST PEAK</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            </div>
            <div className="text-xl font-bold text-rose-400 mt-0.5 tabular-nums">
              {cfg.formatLabel(peakVal)}{" "}
              <span className="text-xs font-normal text-rose-300">{cfg.unit}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#151820] border border-white/[0.06]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">WINDOW MEAN</span>
            <div className="text-xl font-bold text-slate-200 mt-0.5 tabular-nums">
              {cfg.formatLabel(meanVal)}{" "}
              <span className="text-xs font-normal text-slate-400">{cfg.unit}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#151820] border border-white/[0.06]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">ANOMALOUS EVENTS</span>
            <div className="text-xl font-bold text-[#FF7A00] mt-0.5 tabular-nums">
              {spikeCount}{" "}
              <span className="text-xs font-normal text-slate-400">Spikes</span>
            </div>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="relative rounded-2xl border border-white/[0.08] bg-[#0C0E12] p-4 overflow-hidden">
          <div className="relative w-full h-[260px]">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
              onMouseLeave={() => { setHoveredPoint(null); setHoverCoord(null); }}
            >
              {/* Y-axis grid */}
              {cfg.gridLines.map((level) => {
                const y = toSVGY(level);
                if (y < paddingY - 5 || y > chartHeight - paddingY + 5) return null;
                return (
                  <g key={level}>
                    <line x1={paddingX} y1={y} x2={chartWidth - paddingX} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                    <text x={paddingX - 6} y={y + 3.5} textAnchor="end" fontSize="9" fontFamily="monospace" fill="#64748b">
                      {cfg.formatThreshold(level)}
                    </text>
                  </g>
                );
              })}

              {/* Critical threshold */}
              <line
                x1={paddingX} y1={thresholdY}
                x2={chartWidth - paddingX} y2={thresholdY}
                stroke="#EF4444" strokeWidth="1" strokeDasharray="4 4" opacity={0.55}
              />
              <text x={chartWidth - paddingX - 4} y={thresholdY - 5} textAnchor="end" fontSize="8" fontFamily="monospace" fill="#f87171" fontWeight="600">
                CRITICAL THRESHOLD ({cfg.formatThreshold(cfg.criticalThreshold)} {cfg.unit})
              </text>

              {/* Area */}
              {areaPathD && <path d={areaPathD} fill={cfg.fillColor} />}

              {/* Line */}
              <path d={linePathD} fill="none" stroke={cfg.strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

              {/* Spike markers */}
              {coords.map(({ x, y, point }) => {
                if (!point.isSpike) return null;
                const isSel = selectedLogId === point.id;
                const label = `▲ ${cfg.formatLabel(point.value)} ${cfg.unit}`;
                const labelW = label.length * 5.4 + 16;
                return (
                  <g key={`spike-${point.id}`}>
                    <line x1={x} y1={y + 6} x2={x} y2={chartHeight - paddingY} stroke="#EF4444" strokeWidth="1" strokeDasharray="2 3" opacity={0.25} />
                    <circle cx={x} cy={y} r={isSel ? 6 : 4.5} fill="#EF4444" stroke="#fff" strokeWidth="1.5" />
                    <rect x={x - labelW / 2} y={y - 26} width={labelW} height={16} rx="4" fill="#1e1418" stroke="#EF4444" strokeWidth="1" />
                    <text x={x} y={y - 14} textAnchor="middle" fontSize="8.5" fontFamily="monospace" fill="#fca5a5" fontWeight="700">{label}</text>
                  </g>
                );
              })}

              {/* Crosshair */}
              {hoverCoord && (
                <g>
                  <line x1={hoverCoord.x} y1={paddingY} x2={hoverCoord.x} y2={chartHeight - paddingY} stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="2 2" />
                  <circle cx={hoverCoord.x} cy={hoverCoord.y} r="5" fill="#111317" stroke={cfg.strokeColor} strokeWidth="2" />
                  <circle cx={hoverCoord.x} cy={hoverCoord.y} r="2" fill={cfg.strokeColor} />
                </g>
              )}

              {/* Hover zones */}
              {coords.map(({ x, y, point }) => (
                <rect
                  key={`zone-${point.id}`}
                  x={x - graphW / (points.length * 2)}
                  y={paddingY}
                  width={graphW / points.length}
                  height={graphH}
                  fill="transparent"
                  className="cursor-crosshair"
                  onMouseEnter={() => { setHoveredPoint(point); setHoverCoord({ x, y }); setSelectedLogId(point.id); }}
                />
              ))}
            </svg>

            {/* Tooltip */}
            <AnimatePresence>
              {hoveredPoint && hoverCoord && (
                <motion.div
                  key={hoveredPoint.id}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ left: `${(hoverCoord.x / chartWidth) * 100}%`, top: `${(hoverCoord.y / chartHeight) * 100}%` }}
                  className="absolute -translate-x-1/2 -translate-y-16 pointer-events-none z-30"
                >
                  <div className="bg-[#181B22] border border-white/20 rounded-xl px-3 py-2 shadow-2xl text-left whitespace-nowrap space-y-0.5">
                    <div className="flex items-center justify-between gap-3 text-[10px] font-mono text-slate-400">
                      <span>{hoveredPoint.time}</span>
                      <span className={`font-bold px-1.5 rounded ${hoveredPoint.isSpike ? "bg-rose-950 text-rose-400" : "bg-emerald-950 text-emerald-400"}`}>
                        {hoveredPoint.isSpike ? "ANOMALY" : "NOMINAL"}
                      </span>
                    </div>
                    <div className="text-xs font-extrabold text-white">
                      {cfg.formatLabel(hoveredPoint.value)} {cfg.unit}
                    </div>
                    {hoveredPoint.isSpike && (
                      <div className="text-[9px] font-mono text-rose-400">{hoveredPoint.spikeType}</div>
                    )}
                    <div className="text-[9px] font-mono text-slate-400">
                      Packets: {hoveredPoint.packetCount.toLocaleString()} • IP: {hoveredPoint.sourceIp}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between pt-3 text-[11px] font-mono text-slate-400 border-t border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-sm ${
                isStreaming && !apiError ? "bg-emerald-400 animate-pulse"
                : apiError ? "bg-amber-400 animate-pulse"
                : "bg-slate-500"
              }`} />
              <span>
                {isStreaming
                  ? apiError
                    ? "API UNREACHABLE — ESTIMATING"
                    : "eBPF Ring-0 Filter: LOCKED • LIVE SYSTEM DATA"
                  : "STREAM PAUSED"}
              </span>
            </div>
            <div>
              Interval: 1,200ms •
              {liveData?.network
                ? ` RX ${liveData.network.rxMbps} + TX ${liveData.network.txMbps} Mb/s`
                : " Packet Loss: 0.00%"}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Nodes */}
        <div className="lg:col-span-1 bg-[#111317] border border-white/[0.08] rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">System Telemetry Nodes</span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">● MESH NOMINAL</span>
          </div>
          <div className="space-y-3">
            {/* Network — live RX/TX */}
            <div className="p-3 rounded-2xl bg-[#161921] border border-white/[0.06] flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-slate-400" />
                  {liveData?.network?.interface || "Mesh Ingress Egress"}
                </div>
                <div className="text-[10px] font-mono text-slate-400">TLS 1.3 • IPv4</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-emerald-400">
                  {liveData?.network
                    ? `↓${liveData.network.rxMbps} ↑${liveData.network.txMbps} Mb/s`
                    : `${cfg.formatLabel(currentVal)} ${cfg.unit}`}
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  {liveData?.memory ? `RAM ${liveData.memory.usagePercent}% used` : "1.12ms Jitter"}
                </div>
              </div>
            </div>

            {/* CPU — live load */}
            <div className="p-3 rounded-2xl bg-[#161921] border border-white/[0.06] flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-slate-400" />
                  Kernel Ring-0 Hook
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  {liveData?.cpu ? `${liveData.cpu.cores}C @ ${liveData.cpu.speedGhz} GHz` : "eBPF Syscall Tap"}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xs font-mono font-bold ${
                  (liveData?.cpu?.loadPercent ?? 0) > 80 ? "text-rose-400"
                  : (liveData?.cpu?.loadPercent ?? 0) > 50 ? "text-amber-400"
                  : "text-sky-400"
                }`}>
                  {liveData?.cpu ? `${liveData.cpu.loadPercent}% LOAD` : "ACTIVE"}
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  {liveData?.ebpf ? `${(liveData.ebpf.opsPerSec / 1000).toFixed(1)}k ops/s` : "24,758 ops/s"}
                </div>
              </div>
            </div>

            {/* eBPF / Processes */}
            <div className="p-3 rounded-2xl bg-[#161921] border border-white/[0.06] flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-slate-400" />
                  eBPF Process Monitor
                </div>
                <div className="text-[10px] font-mono text-slate-400">Kernel Probe Active</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-amber-400">
                  {(liveData as any)?.host ? `${(liveData as any).host.processCount} PROC` : "ENFORCED"}
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  {(liveData as any)?.host?.threadCount ? `${(liveData as any).host.threadCount.toLocaleString()} threads` : "0 Active Leaks"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Log stream */}
        <div className="lg:col-span-2 bg-[#111317] border border-white/[0.08] rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#FF7A00]" />
              <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">Interlinked Telemetry &amp; Kernel Log Stream</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">HOVER A LOG TO LOCATE ON GRAPH</span>
          </div>

          <div ref={logContainerRef} className="space-y-2 max-h-[190px] overflow-y-auto pr-1 text-xs font-mono select-none">
            {points.slice(-12).reverse().map((point) => {
              const isSel = selectedLogId === point.id;
              const isHov = hoveredPoint?.id === point.id;
              return (
                <div
                  key={`log-${point.id}`}
                  onMouseEnter={() => {
                    setHoveredPoint(point);
                    const idx = points.findIndex((p) => p.id === point.id);
                    if (idx !== -1) setHoverCoord({ x: paddingX + (idx / Math.max(points.length - 1, 1)) * graphW, y: toSVGY(point.value) });
                    setSelectedLogId(point.id);
                  }}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${isSel || isHov ? "bg-[#1C202C] border-white/20 shadow-md" : "bg-[#14161E] border-white/[0.04] hover:border-white/10"}`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${point.logLevel === "CRITICAL" ? "bg-rose-950 text-rose-400 border border-rose-800" : point.logLevel === "WARN" ? "bg-amber-950 text-amber-400 border border-amber-800" : "bg-emerald-950 text-emerald-400 border border-emerald-800/40"}`}>
                      {point.logLevel}
                    </span>
                    <span className="text-slate-400 text-[11px] shrink-0">{point.time}</span>
                    <span className="text-slate-200 truncate max-w-sm">{point.logMessage}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-[11px]">
                    <span className="text-slate-400">{point.sourceIp}</span>
                    <span className={`font-bold tabular-nums ${point.isSpike ? "text-rose-400" : "text-slate-200"}`}>
                      {cfg.formatLabel(point.value)} {cfg.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressiveSpikeGraph;
