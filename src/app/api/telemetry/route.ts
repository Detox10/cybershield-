import { NextResponse } from "next/server";

// In-memory data store for the Fleet (Dictionary of agents)
let _cyberShieldFleet: Record<string, any> = {};

/**
 * POST /api/telemetry
 * Endpoint Agent pushes data here
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate authentication (Phase 1 simplistic check)
    const authHeader = request.headers.get("authorization");
    if (authHeader !== "Bearer CS-AGENT-SECRET-2026") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const agentId = data.agentId || data.host?.osBuild || `Unknown-${Math.random()}`;

    _cyberShieldFleet[agentId] = {
      ...data,
      agentId,
      lastSeen: Date.now()
    };

    return NextResponse.json({ success: true, agentId });
  } catch (error) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}

/**
 * GET /api/telemetry
 * Dashboard pulls data from here
 */
export async function GET() {
  const fleetArray = Object.values(_cyberShieldFleet);
  
  // If the fleet is empty, return a default mock so the UI doesn't crash before agents connect
  if (fleetArray.length === 0) {
    return NextResponse.json({
      fleet: [],
      cpu: { loadPercent: 0, model: "Waiting for Agent..." },
      memory: { usagePercent: 0, usedGb: 0, totalGb: 0 },
      network: { rxMbps: 0, txMbps: 0 },
      host: { osBuild: "Waiting..." },
      disk: { totalGb: 0, usedGb: 0, usagePercent: 0 },
      advanced: { processes: [], networkConnections: [], services: [] }
    });
  }

  // Find the primary agent to populate legacy root fields for Top KPI cards
  // Prioritizes a real agent (which sends 'ebpf' data) over simulated agents.
  const primaryNode = fleetArray.find(n => n.ebpf) || fleetArray[0];

  return NextResponse.json({
    fleet: fleetArray,
    // Legacy root fields for Top KPI cards (showing stats of the first connected agent)
    cpu: primaryNode.cpu,
    memory: primaryNode.memory,
    network: primaryNode.network,
    host: primaryNode.host,
    disk: primaryNode.disk,
    advanced: primaryNode.advanced,
    ebpf: primaryNode.ebpf
  });
}
