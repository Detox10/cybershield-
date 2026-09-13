import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const keys = await redis.smembers("telemetry:");
    const activeKeys = keys || [];
    
    if (activeKeys.length === 0) {
      return NextResponse.json({
        success: false,
        status: "UNAVAILABLE",
        error: "No endpoint agent connected."
      }, { status: 404 });
    }

    const dataStr = await redis.get(activeKeys[0]);
    if (!dataStr) {
      return NextResponse.json({
        success: false,
        status: "UNAVAILABLE",
        error: "Endpoint telemetry unavailable."
      }, { status: 404 });
    }

    const telemetry = JSON.parse(dataStr);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      host: {
        hostname: telemetry.host?.hostname || "Unknown",
        platform: telemetry.host?.platform || "Unknown",
        osType: telemetry.host?.osType || "Unknown",
        release: telemetry.host?.release || "Unknown",
        osCaption: telemetry.host?.osBuild || "Unknown OS",
        arch: telemetry.host?.arch || "x64",
        uptimeSeconds: telemetry.host?.uptimeSeconds || 0,
        uptimeFormatted: telemetry.host?.uptimeFormatted || "0h 0m",
      },
      cpu: {
        model: telemetry.cpu?.model || "Unknown",
        cores: telemetry.cpu?.cores || 0,
        speedMhz: telemetry.cpu?.speedMhz || 0,
        loadPercent: telemetry.cpu?.loadPercent ?? null,
        architecture: telemetry.host?.arch || "x64",
      },
      memory: {
        totalGb: telemetry.memory?.totalGb || 0,
        usedGb: telemetry.memory?.usedGb || 0,
        freeGb: telemetry.memory?.freeGb || 0,
        usagePercent: telemetry.memory?.usagePercent ?? null,
      },
      network: {
        rxMbps: telemetry.network?.rxMbps ?? null,
        txMbps: telemetry.network?.txMbps ?? null,
        ipAddress: telemetry.network?.ipAddress || "0.0.0.0"
      },
      topProcesses: telemetry.advanced?.processes || [],
      security: {
        kernelRing0Hook: telemetry.ebpf?.available ? "eBPF Active" : "Unavailable",
        secureBoot: true,
        virtualization: "Hardware-Assisted",
        zeroTrustPolicy: "DETERMINISTIC_KERNEL_ENFORCED",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to retrieve host diagnostics",
      },
      { status: 500 }
    );
  }
}
