"use client";

import React, { useState } from "react";
import { Clock, CheckCircle2, AlertOctagon, Info, Zap } from "lucide-react";
import { useTelemetryStore } from "@/store/telemetryStore";

export const SecurityTimeline: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const timelineEvents = useTelemetryStore((state) => state.timelineEvents);

  return (
    <div className="w-full h-full p-5 rounded-3xl flex flex-col space-y-4" style={{ backgroundColor: 'var(--cs-bg-card)', border: '1px solid var(--cs-border)' }}>
      <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid var(--cs-border)' }}>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" style={{ color: 'var(--cs-accent)' }} />
          <h3 className="text-sm font-bold tracking-tight" style={{ color: 'var(--cs-text-primary)' }}>Security Timeline</h3>
        </div>
        <div className="text-[10px] font-mono px-2 py-1 rounded bg-slate-500/10" style={{ color: 'var(--cs-text-muted)' }}>
          {selectedDate}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {timelineEvents.map((evt, idx) => {
          let Icon = Info;
          let color = "text-sky-400";
          let bg = "bg-sky-500/10";
          let border = "border-sky-500/20";

          if (evt.type === "critical") {
            Icon = AlertOctagon;
            color = "text-rose-500";
            bg = "bg-rose-500/10";
            border = "border-rose-500/20";
          } else if (evt.type === "warning") {
            Icon = Zap;
            color = "text-amber-500";
            bg = "bg-amber-500/10";
            border = "border-amber-500/20";
          } else if (evt.type === "success") {
            Icon = CheckCircle2;
            color = "text-emerald-500";
            bg = "bg-emerald-500/10";
            border = "border-emerald-500/20";
          }

          return (
            <div key={evt.id} className="relative pl-6">
              {/* Timeline Line */}
              {idx !== timelineEvents.length - 1 && (
                <div className="absolute top-6 bottom-[-20px] left-[11px] w-[2px] bg-slate-500/20" />
              )}
              
              {/* Timeline Node */}
              <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border flex items-center justify-center ${bg} ${border}`}>
                <Icon className={`w-3 h-3 ${color}`} />
              </div>

              {/* Event Content */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold" style={{ color: 'var(--cs-text-primary)' }}>{evt.title}</span>
                  <span className="text-[9px] font-mono" style={{ color: 'var(--cs-text-muted)' }}>{evt.time}</span>
                </div>
                <p className="text-[10px] leading-relaxed" style={{ color: 'var(--cs-text-secondary)' }}>
                  {evt.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SecurityTimeline;
