"use client";

import React from "react";
import { Server, Cpu, HardDrive, Network, ShieldCheck, Activity } from "lucide-react";
import { useTelemetryStore } from "@/store/telemetryStore";

export const FleetManagementTable: React.FC = () => {
  const fleet = useTelemetryStore((state) => state.fleet);

  return (
    <div className="bg-[#121418]/90 border border-white/[0.08] rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-xl flex flex-col h-[450px]">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Server className="w-5 h-5 text-sky-400" />
            <span>Enterprise Fleet Management</span>
            <span className="px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-[10px] font-mono text-sky-400 font-bold ml-2">
              {fleet.length} ONLINE
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Live telemetry for all authenticated endpoint agents.</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="text-[10px] text-slate-400 font-mono tracking-wider bg-white/[0.02]">
            <tr>
              <th className="py-3 px-3 font-bold rounded-tl-lg">NODE ID (HOSTNAME)</th>
              <th className="py-3 px-3 font-bold">OS BUILD</th>
              <th className="py-3 px-3 font-bold">PROCESSOR & LOAD</th>
              <th className="py-3 px-3 font-bold">MEMORY</th>
              <th className="py-3 px-3 font-bold">STORAGE</th>
              <th className="py-3 px-3 font-bold">NETWORK IN/OUT</th>
              <th className="py-3 px-3 font-bold rounded-tr-lg text-right">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {fleet.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 italic">
                  No agents connected to the fleet yet.
                </td>
              </tr>
            )}
            {fleet.map((node, i) => (
              <tr key={node.agentId || i} className="hover:bg-white/[0.02] transition-colors group">
                <td className="py-3 px-3 font-bold text-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
                    {node.agentId}
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-400 font-mono">
                  {node.host?.osBuild || "Unknown OS"}
                </td>
                <td className="py-3 px-3">
                  <div className="flex flex-col">
                    <span className="text-white font-bold flex items-center gap-1.5">
                      <Cpu className="w-3 h-3 text-[#FF7A00]" /> {node.cpu?.loadPercent || 0}%
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono truncate max-w-[120px]">{node.cpu?.model}</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div 
                        className="h-full bg-sky-400 rounded-full" 
                        style={{ width: `${node.memory?.usagePercent || 0}%` }}
                      />
                    </div>
                    <span className="text-slate-300 font-mono text-[11px]">{node.memory?.usagePercent || 0}%</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <HardDrive className="w-3 h-3 text-emerald-400" />
                    {node.disk?.usagePercent || 0}%
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-slate-300 flex items-center gap-1.5 font-mono">
                    <Network className="w-3 h-3 text-rose-400" />
                    {(node.network?.totalMbps || 0).toFixed(1)} Mbps
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <button className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase tracking-wider flex items-center justify-end gap-1 ml-auto">
                    <ShieldCheck className="w-3 h-3" /> SECURE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FleetManagementTable;
