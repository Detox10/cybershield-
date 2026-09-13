import { WebSocketServer, WebSocket } from 'ws';
import { prisma } from '../lib/prisma';
import { redis } from '../lib/redis';
import http from 'http';
import url from 'url';

const PORT = parseInt(process.env.GATEWAY_PORT || '3001', 10);
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('CyberShield WebSocket Gateway is running.\n');
});
const wss = new WebSocketServer({ noServer: true });

const TELEMETRY_CACHE_TTL = 30; // seconds
const connectedAgents = new Map<string, WebSocket>();

server.on('upgrade', async (request, socket, head) => {
  try {
    const parsedUrl = url.parse(request.url || '', true);
    const token = parsedUrl.query.token as string;

    if (!token) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    const [deviceId, deviceSecret] = token.split(':');
    if (!deviceId || !deviceSecret) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    // Authenticate Agent against Postgres
    const agent = await prisma.agent.findUnique({
      where: { id: deviceId }
    });

    if (!agent || agent.credentialSecret !== deviceSecret) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request, agent);
    });
  } catch (error) {
    socket.write('HTTP/1.1 500 Internal Server Error\r\n\r\n');
    socket.destroy();
  }
});

wss.on('connection', async (ws: WebSocket, request: any, agent: any) => {
  const deviceId = agent.id;
  console.log(`[+] Agent Connected: ${deviceId}`);
  connectedAgents.set(deviceId, ws);

  // Update last seen
  await prisma.agent.update({
    where: { id: deviceId },
    data: { lastSeenAt: new Date(), isActive: true }
  });

  // Push pending commands from Redis list
  const pushPendingCommands = async () => {
    try {
      while (true) {
        const cmdStr = await redis.lpop(`commands:${deviceId}`);
        if (!cmdStr) break;
        ws.send(JSON.stringify({ type: 'COMMAND', data: JSON.parse(cmdStr) }));
      }
    } catch (e) {
      console.error('Redis pop error:', e);
    }
  };

  // Poll for commands every 2 seconds (simple alternative to pub/sub for now to stay compatible)
  const commandInterval = setInterval(pushPendingCommands, 2000);
  // Do initial push
  pushPendingCommands();

  ws.on('message', async (message: Buffer) => {
    try {
      const payload = JSON.parse(message.toString());
      
      // Update last seen
      await prisma.agent.update({
        where: { id: deviceId },
        data: { lastSeenAt: new Date() }
      });

      if (payload.type === 'TELEMETRY') {
        const data = payload.data;
        
        // Hot State: Push to Redis
        const redisPayload = {
          ...data,
          agentId: agent.id,
          lastSeen: Date.now()
        };
        await redis.set(`telemetry:${agent.id}`, JSON.stringify(redisPayload), 'EX', TELEMETRY_CACHE_TTL);

        // Cold State: DB Snapshot if advanced metrics exist
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
      } else if (payload.type === 'SECURITY_EVENT') {
         // Create audit log event
         await prisma.cyberEvent.create({
          data: {
            deviceId: agent.id,
            type: "MALWARE_DETECTED",
            severity: payload.data.severity || "HIGH",
            source: payload.data.vector || "Endpoint Security Scanner",
            processName: payload.data.processName,
            commandLine: payload.data.commandLine,
            fileHash: payload.data.hash,
            evidence: JSON.stringify(payload.data),
            status: "OPEN"
          }
        });
      } else if (payload.type === 'COMMAND_RESULT') {
        const data = payload.data;
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
      }
    } catch (error) {
      console.error(`[-] Error processing message from ${deviceId}:`, error);
    }
  });

  ws.on('close', async () => {
    console.log(`[-] Agent Disconnected: ${deviceId}`);
    connectedAgents.delete(deviceId);
    clearInterval(commandInterval);
    await prisma.agent.update({
      where: { id: deviceId },
      data: { isActive: false }
    });
  });
});

server.listen(PORT, () => {
  console.log(`CyberShield WS Gateway running on port ${PORT}`);
});
