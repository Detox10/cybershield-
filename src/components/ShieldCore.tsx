"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCoreState } from "@/types/cybershield";

interface ShieldCoreProps {
  state?: ShieldCoreState;
  size?: "mini" | "compact" | "avatar" | "hero";
  className?: string;
  interactive?: boolean;
}

export default function ShieldCore({
  state = "IDLE",
  size = "hero",
  className = "",
  interactive = true,
}: ShieldCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const dimensions = {
    mini: 28,
    compact: 44,
    avatar: 68,
    hero: 140,
  }[size];

  const theme = {
    IDLE: {
      gradientStart: "#0284C7", // Sky-600
      gradientMid: "#0D9488",   // Teal-600
      gradientEnd: "#10B981",   // Emerald-500
      glowColor: "rgba(13, 148, 136, 0.4)",
      particleColor: "rgba(56, 189, 248, 0.8)",
      pulseDuration: 3.0,
      particleSpeed: 0.02,
      particleCount: 5,
    },
    SCANNING: {
      gradientStart: "#06B6D4", // Cyan-500
      gradientMid: "#0284C7",   // Sky-600
      gradientEnd: "#6366F1",   // Indigo-500
      glowColor: "rgba(6, 182, 212, 0.5)",
      particleColor: "rgba(34, 211, 238, 0.9)",
      pulseDuration: 1.5,
      particleSpeed: 0.06,
      particleCount: 8,
    },
    SECURE: {
      gradientStart: "#059669", // Emerald-600
      gradientMid: "#10B981",   // Emerald-500
      gradientEnd: "#0284C7",   // Sky-600
      glowColor: "rgba(16, 185, 129, 0.45)",
      particleColor: "rgba(52, 211, 153, 0.85)",
      pulseDuration: 2.0,
      particleSpeed: 0.015,
      particleCount: 6,
    },
    WARNING: {
      gradientStart: "#D97706", // Amber-600
      gradientMid: "#F59E0B",   // Amber-500
      gradientEnd: "#F97316",   // Orange-500
      glowColor: "rgba(245, 158, 11, 0.4)",
      particleColor: "rgba(251, 191, 36, 0.85)",
      pulseDuration: 0.8,
      particleSpeed: 0.035,
      particleCount: 6,
    },
    THREAT: {
      gradientStart: "#DC2626", // Rose-600
      gradientMid: "#E11D48",   // Rose-500
      gradientEnd: "#EA580C",   // Orange-600
      glowColor: "rgba(225, 29, 72, 0.5)",
      particleColor: "rgba(248, 113, 113, 0.9)",
      pulseDuration: 0.6,
      particleSpeed: 0.05,
      particleCount: 9,
    },
  }[state];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;
    const center = dimensions / 2;
    const orbRadius = dimensions * 0.32;

    // Particle nodes definition
    const particles = Array.from({ length: theme.particleCount }, (_, i) => ({
      angle: (i * (Math.PI * 2)) / theme.particleCount,
      radiusOffset: orbRadius * (0.85 + (i % 3) * 0.25),
      size: size === "hero" ? 2.5 + (i % 2) : 1.5,
      speedMultiplier: 0.8 + (i % 3) * 0.4,
    }));

    const render = () => {
      ctx.clearRect(0, 0, dimensions, dimensions);
      angle += theme.particleSpeed;

      // 1. Draw Outer Glow
      const glowGrad = ctx.createRadialGradient(
        center,
        center,
        orbRadius * 0.4,
        center,
        center,
        orbRadius * 1.5
      );
      glowGrad.addColorStop(0, theme.glowColor);
      glowGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(center, center, orbRadius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw Central Core Sphere
      const sphereGrad = ctx.createRadialGradient(
        center - orbRadius * 0.3,
        center - orbRadius * 0.3,
        orbRadius * 0.1,
        center,
        center,
        orbRadius
      );
      sphereGrad.addColorStop(0, theme.gradientEnd);
      sphereGrad.addColorStop(0.5, theme.gradientMid);
      sphereGrad.addColorStop(1, theme.gradientStart);

      ctx.save();
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(center, center, orbRadius, 0, Math.PI * 2);
      ctx.fill();

      // Subtle surface specular highlight
      const specGrad = ctx.createRadialGradient(
        center - orbRadius * 0.35,
        center - orbRadius * 0.35,
        0,
        center - orbRadius * 0.35,
        center - orbRadius * 0.35,
        orbRadius * 0.5
      );
      specGrad.addColorStop(0, "rgba(255, 255, 255, 0.45)");
      specGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = specGrad;
      ctx.beginPath();
      ctx.arc(center, center, orbRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Draw Orbiting Particles
      particles.forEach((p) => {
        const curAngle = p.angle + angle * p.speedMultiplier;
        const px = center + Math.cos(curAngle) * p.radiusOffset;
        const py = center + Math.sin(curAngle) * p.radiusOffset;

        ctx.fillStyle = theme.particleColor;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Particle soft trail in scanning/threat
        if (state === "SCANNING" || state === "THREAT") {
          const trailX = center + Math.cos(curAngle - 0.2) * p.radiusOffset;
          const trailY = center + Math.sin(curAngle - 0.2) * p.radiusOffset;
          ctx.strokeStyle = theme.particleColor.replace("0.9", "0.25").replace("0.85", "0.25");
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(trailX, trailY);
          ctx.stroke();
        }
      });

      // 4. State-Specific Overlays (e.g. Radar Sweep in SCANNING)
      if (state === "SCANNING") {
        ctx.save();
        ctx.strokeStyle = "rgba(34, 211, 238, 0.35)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(center, center, orbRadius * 1.2, 0, Math.PI * 2);
        ctx.stroke();

        // Radar line
        const rx = center + Math.cos(angle * 2) * orbRadius * 1.2;
        const ry = center + Math.sin(angle * 2) * orbRadius * 1.2;
        ctx.strokeStyle = "rgba(34, 211, 238, 0.7)";
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.lineTo(rx, ry);
        ctx.stroke();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions, state, theme, size]);

  return (
    <motion.div
      animate={{
        scale:
          state === "THREAT"
            ? [1.0, 1.08, 1.0]
            : state === "WARNING"
            ? [1.0, 1.04, 1.0]
            : [1.0, 1.02, 1.0],
      }}
      transition={{
        duration: theme.pulseDuration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: dimensions, height: dimensions }}
    >
      <canvas
        ref={canvasRef}
        width={dimensions}
        height={dimensions}
        className="overflow-visible pointer-events-none"
      />
    </motion.div>
  );
}
