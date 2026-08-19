"use client";

import React, { useState } from "react";
import {
  Radar,
  Crosshair,
  ShieldX,
  AlertOctagon,
  CheckCircle2,
  Filter,
  Eye,
  Lock,
} from "lucide-react";

export interface ThreatItem {
  id: string;
  sourceIp: string;
  location: string;
  vector: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "BLOCKED" | "QUARANTINED" | "ANALYZING";
  coordinates: { x: number; y: number };
  timestamp: string;
  protocol: string;
  payloadHash: string;
}

interface ThreatRadarProps {
  threats: ThreatItem[];
  onIsolateThreat: (id: string) => void;
}

export default function ThreatRadar({
  threats,
  onIsolateThreat,
}: ThreatRadarProps) {
  const [selectedThreat, setSelectedThreat] = useState<ThreatItem | null>(
    threats[0] || null
  );
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");

  const filteredThreats = threats.filter((t) => {
    if (severityFilter === "ALL") return true;
    return t.severity === severityFilter;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-500/10 text-red-400 border-red-500/40";
      case "HIGH":
        return "bg-orange-500/10 text-orange-400 border-orange-500/40";
      case "MEDIUM":
        return "bg-amber-500/10 text-amber-400 border-amber-500/40";
      case "LOW":
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/40";
    }
  };

  return (
    <div className="cyber-card rounded-2xl p-5 border border-slate-800 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Radar className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              REAL-TIME THREAT RADAR
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                ACTIVE SWEEP
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              GEOSPATIAL & ANOMALOUS VECTOR DETECTION
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-1.5 bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          {["ALL", "CRITICAL", "HIGH", "MEDIUM"].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded transition-all ${
                severityFilter === sev
                  ? "bg-cyan-500 text-black font-bold shadow-glow-cyan"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Radar Canvas on Left, Selected Threat Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-center">
        {/* Radar Graphic */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="relative w-72 h-72 sm:w-84 sm:h-84 md:w-96 md:h-96 rounded-full border-2 border-cyan-500/20 bg-[#070c18] flex items-center justify-center overflow-hidden shadow-2xl">
            {/* Concentric rings */}
            <div className="absolute w-[80%] h-[80%] rounded-full border border-cyan-500/20 border-dashed" />
            <div className="absolute w-[60%] h-[60%] rounded-full border border-cyan-500/25" />
            <div className="absolute w-[40%] h-[40%] rounded-full border border-cyan-500/30 border-dashed" />
            <div className="absolute w-[20%] h-[20%] rounded-full border border-cyan-500/40" />

            {/* Crosshairs */}
            <div className="absolute w-full h-[1px] bg-cyan-500/20" />
            <div className="absolute h-full w-[1px] bg-cyan-500/20" />

            {/* Radar Sweeping Beam */}
            <div className="absolute inset-0 rounded-full animate-radar-sweep pointer-events-none origin-center">
              <div className="w-1/2 h-1/2 bg-gradient-to-br from-cyan-500/30 to-transparent origin-bottom-right rounded-tl-full" />
            </div>

            {/* Center Core */}
            <div className="relative z-10 w-4 h-4 rounded-full bg-cyan-400 shadow-glow-cyan animate-ping" />
            <div className="absolute z-10 w-2.5 h-2.5 rounded-full bg-white" />

            {/* Threat Blips */}
            {filteredThreats.map((threat) => {
              const isSelected = selectedThreat?.id === threat.id;
              const colorClass =
                threat.severity === "CRITICAL"
                  ? "bg-red-500 border-red-300 shadow-glow-red"
                  : threat.severity === "HIGH"
                  ? "bg-orange-500 border-orange-300 shadow-glow-red"
                  : threat.severity === "MEDIUM"
                  ? "bg-amber-400 border-amber-200"
                  : "bg-cyan-400 border-cyan-200";

              return (
                <button
                  key={threat.id}
                  onClick={() => setSelectedThreat(threat)}
                  style={{
                    left: `${threat.coordinates.x}%`,
                    top: `${threat.coordinates.y}%`,
                  }}
                  className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-transform hover:scale-150 ${colorClass} ${
                    isSelected ? "ring-4 ring-cyan-400 scale-125 animate-bounce" : ""
                  }`}
                  title={`${threat.vector} from ${threat.sourceIp}`}
                >
                  <span className="sr-only">{threat.vector}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-6 mt-4 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
              Critical (DDoS/Ransomware)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
              High (SQLi/XSS)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              Medium (Probe)
            </span>
          </div>
        </div>

        {/* Selected Threat Details Panel */}
        <div className="lg:col-span-5 bg-slate-950/70 border border-slate-800 rounded-xl p-4 font-mono space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs text-cyan-400 flex items-center gap-1.5">
              <Crosshair className="w-4 h-4" />
              TARGET VECTOR TELEMETRY
            </span>
            {selectedThreat && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded border ${getSeverityBadge(
                  selectedThreat.severity
                )}`}
              >
                {selectedThreat.severity}
              </span>
            )}
          </div>

          {selectedThreat ? (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-400">ATTACK VECTOR</div>
                  <div className="text-cyan-300 font-bold mt-0.5">
                    {selectedThreat.vector}
                  </div>
                </div>

                <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-400">SOURCE IP</div>
                  <div className="text-slate-200 font-bold mt-0.5">
                    {selectedThreat.sourceIp}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Origin / Country:</span>
                  <span className="text-slate-200">{selectedThreat.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Protocol:</span>
                  <span className="text-slate-200">{selectedThreat.protocol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Detected At:</span>
                  <span className="text-slate-300">{selectedThreat.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mitigation Status:</span>
                  <span className="text-emerald-400 font-bold">
                    {selectedThreat.status}
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/90 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400 mb-1">
                  PAYLOAD SIGNATURE HASH
                </div>
                <div className="text-[11px] text-purple-400 truncate bg-slate-950 p-1.5 rounded">
                  {selectedThreat.payloadHash}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => onIsolateThreat(selectedThreat.id)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/50 text-xs font-bold transition-all"
                >
                  <ShieldX className="w-3.5 h-3.5" />
                  Isolate IP & Drop Route
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              Select any blip on the radar to inspect live payload intelligence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
