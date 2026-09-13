import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

const TELEMETRY_CACHE_TTL = 30; // seconds

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Missing or invalid authorization" }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    // The agent will send: "deviceId:deviceSecret" as the token for basic identity validation
    const [deviceId, deviceSecret] = token.split(':');

    if (!deviceId || !deviceSecret) {
      return NextResponse.json({ error: "Malformed token" }, { status: 401 });
    }

    // Rate limiting or quick cache check could go here using Redis

    // Authenticate Agent against Postgres
    // In a high volume production setting, this check would happen via Redis cache of enrolled agents.
    const agent = await prisma.agent.findUnique({
      where: { id: deviceId }
    });

    if (!agent || agent.credentialSecret !== deviceSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update last seen
    await prisma.agent.update({
      where: { id: deviceId },
      data: { lastSeenAt: new Date() }
    });

    // 1. Hot State: Push the most recent telemetry to Redis (for fast Dashboard UI updates)
    const redisPayload = {
      ...data,
      agentId: agent.id,
      lastSeen: Date.now()
    };
    await redis.set(`telemetry:${agent.id}`, JSON.stringify(redisPayload), 'EX', TELEMETRY_CACHE_TTL);

    // 2. Cold State: If this payload contains advanced metrics (like processes/services), save snapshot to DB
    if (data.advanced && data.advanced.processes) {
      await prisma.telemetrySnapshot.create({
        data: {
          agentId: agent.id,
          cpuLoadPercent: data.cpu?.loadPercent || 0,
          memUsagePercent: data.memory?.usagePercent || 0,
          rxMbps: data.network?.rxMbps || 0,
          txMbps: data.network?.txMbps || 0,
          processes: JSON.stringify(data.advanced.processes),
          services: JSON.stringify(data.advanced.services),
          networkConnections: JSON.stringify(data.advanced.networkConnections)
        }
      });
    }

    return NextResponse.json({ success: true, agentId: agent.id });
  } catch (error) {
    console.error("Telemetry ingest error:", error);
    return NextResponse.json({ error: "Invalid payload or internal error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Dashboard pulls HOT state from Redis
    const keys = await redis.smembers('telemetry:'); 
    
    // Fallback if SMEMBERS logic is mocked, let's just assume we store a master list of active agents or fetch all agents from DB.
    // In our MockRedis smembers returns keys matching prefix.
    const activeKeys = keys || [];
    
    let fleetArray = [];
    for (const key of activeKeys) {
      const dataStr = await redis.get(key);
      if (dataStr) {
        fleetArray.push(JSON.parse(dataStr));
      }
    }

    if (fleetArray.length === 0) {
      return NextResponse.json({
        telemetryStatus: "UNAVAILABLE",
        fleet: []
      });
    }

    const primaryNode = fleetArray[0]; // Simplified for now

    return NextResponse.json({
      fleet: fleetArray,
      cpu: primaryNode.cpu,
      memory: primaryNode.memory,
      network: primaryNode.network,
      host: primaryNode.host,
      disk: primaryNode.disk,
      advanced: primaryNode.advanced || {},
      ebpf: primaryNode.ebpf
    });
  } catch(error) {
    console.error("GET Telemetry Error:", error);
    return NextResponse.json({ error: "Failed to fetch telemetry" }, { status: 500 });
  }
}
