import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import crypto from 'crypto';

// GET: Agent polls for pending commands
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Missing authorization" }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const [deviceId, deviceSecret] = token.split(':');

    const agent = await prisma.agent.findUnique({ where: { id: deviceId } });
    if (!agent || agent.credentialSecret !== deviceSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Pop a command from the queue
    const cmdStr = await redis.lpop(`commands:${deviceId}`);
    if (cmdStr) {
      return NextResponse.json({ command: JSON.parse(cmdStr) });
    }

    return NextResponse.json({ command: null });
  } catch (error) {
    console.error("GET commands error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST: Dashboard queues a command OR Agent reports a result
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Agent reporting a result
    if (data.isResult) {
      const authHeader = request.headers.get("authorization");
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: "Missing authorization" }, { status: 401 });
      }
      const token = authHeader.replace('Bearer ', '');
      const [deviceId, deviceSecret] = token.split(':');
      
      const agent = await prisma.agent.findUnique({ where: { id: deviceId } });
      if (!agent || agent.credentialSecret !== deviceSecret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Create audit log event
      await prisma.cyberEvent.create({
        data: {
          deviceId: agent.id,
          type: "COMMAND_RESULT",
          severity: data.success ? "INFO" : "WARNING",
          source: "Endpoint Agent",
          processName: data.processName,
          evidence: JSON.stringify({
            commandId: data.commandId,
            action: data.action,
            pid: data.pid,
            output: data.output,
            error: data.error
          }),
          status: "RESOLVED"
        }
      });

      return NextResponse.json({ success: true });
    }

    // Dashboard queuing a command (simplified auth for hackathon)
    const { deviceId, action, pid, processName } = data;
    if (!deviceId || !action || !pid || !processName) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const commandPayload = {
      commandId: crypto.randomUUID(),
      action,
      pid,
      processName,
      timestamp: Date.now()
    };

    // Push to agent's command queue
    await redis.rpush(`commands:${deviceId}`, JSON.stringify(commandPayload));

    // Create an audit log for the command request
    await prisma.cyberEvent.create({
      data: {
        deviceId: deviceId,
        type: "COMMAND_ISSUED",
        severity: "WARNING",
        source: "Dashboard Operator",
        processName: processName,
        evidence: JSON.stringify(commandPayload),
        status: "OPEN"
      }
    });

    return NextResponse.json({ success: true, commandId: commandPayload.commandId });
  } catch (error) {
    console.error("POST commands error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
