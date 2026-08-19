"use client";

import React, { useEffect, useRef } from "react";

interface DotGridCanvasProps {
  isScanning?: boolean;
  scanProgress?: number; // 0 to 100
  className?: string;
}

export const DotGridCanvas: React.FC<DotGridCanvasProps> = ({
  isScanning = false,
  scanProgress = 0,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let sweepPos = isScanning ? (scanProgress / 100) * canvas.width : -100;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const dotSpacing = 8;
      const dotRadius = 1.0;
      const cols = Math.floor(w / dotSpacing);
      const rows = Math.floor(h / dotSpacing);

      // Determine sweep location
      if (isScanning && scanProgress === 0) {
        sweepPos = (sweepPos + 2.5) % (w + 120);
      } else if (isScanning) {
        sweepPos = (scanProgress / 100) * w;
      }

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * dotSpacing + dotSpacing / 2;
          const y = r * dotSpacing + dotSpacing / 2;

          // Calculate distance from scan head
          const distToSweep = Math.abs(x - sweepPos);

          if (isScanning && distToSweep < 48) {
            // Illuminated teal-to-emerald dot near scan head
            const intensity = 1 - distToSweep / 48;
            ctx.fillStyle = `rgba(0, 163, 137, ${0.2 + intensity * 0.8})`;
            ctx.beginPath();
            ctx.arc(x, y, dotRadius + intensity * 0.8, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Dormant dot at rest
            ctx.fillStyle = "rgba(148, 163, 184, 0.28)";
            ctx.beginPath();
            ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      if (isScanning && scanProgress === 0) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isScanning, scanProgress]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={140}
      className={`w-full h-full pointer-events-none ${className}`}
    />
  );
};
export default DotGridCanvas;
