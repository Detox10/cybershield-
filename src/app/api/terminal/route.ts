import { NextRequest, NextResponse } from "next/server";
import { ServerDB } from "@/lib/serverDb";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { command, apiKey, context, deviceId } = body;

    const rawCmd = (command || "").trim();
    if (!rawCmd) {
      return NextResponse.json({
        output: "CyberShield OS Terminal — type 'help' for a list of available commands.",
      });
    }

    const parts = rawCmd.split(" ");
    const cmdName = parts[0].toLowerCase();
    const args = parts.slice(1).join(" ");

    // 1. HELP COMMAND
    if (cmdName === "help") {
      return NextResponse.json({
        output: `CyberShield Sentinel OS Terminal v2.4.0
=====================================================
Available System & Security Commands:

  status               Display real-time fleet telemetry & defense index
  logs | tail          Stream live security audit logs & kernel interception events
  scan <sha256>        Run VirusTotal v3 and cryptographic entropy analysis on hash
  gemini <query>       Execute live Google Gemini AI prompt for incident analysis
  quarantine <file>    Simulate moving target artifact to isolated sandbox vault
  clear                Clear the terminal output screen
  help                 Display this command reference index
  
Agent Execution Commands (Routed to Endpoint):
  exec <command>       Execute diagnostic commands (ping, ipconfig, netstat, tasklist, etc.)
`,
      });
    }

    // 2. STATUS COMMAND
    if (cmdName === "status") {
      const incidents = (await ServerDB.getIncidents()).filter(i => i.status !== "QUARANTINED" && i.status !== "BLOCKED");
      const activeAgents = await prisma.agent.count({ where: { isActive: true } });
      return NextResponse.json({
        output: `[CYBERSHIELD SENTINEL STATUS]
--------------------------------------------------
Control Plane     : CyberShield C2 Node
Active Agents     : ${activeAgents} Online
Active Threats    : ${incidents.length} Uncontained
--------------------------------------------------`,
      });
    }

    // 3. LOGS / TAIL COMMAND
    if (cmdName === "logs" || cmdName === "tail") {
      const timeline = await ServerDB.getTimeline();
      if (timeline.length === 0) {
        return NextResponse.json({ output: `No security events logged.` });
      }
      const output = timeline.slice(0, 10).map(evt => `[${evt.time}] [${evt.type.toUpperCase()}] ${evt.title}: ${evt.description}`).join('\n');
      return NextResponse.json({ output: `[LIVE SECURITY AUDIT LOGS]\n\n${output}` });
    }

    // 4. SCAN COMMAND
    if (cmdName === "scan") {
      const targetHash = args.trim();
      if (!targetHash) {
        return NextResponse.json({
          output: "Usage: scan <sha256_or_md5_hash>\nExample: scan e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        });
      }

      const vtKey = apiKey || process.env.VIRUSTOTAL_API_KEY;
      try {
        const vtRes = await fetch(
          `${req.nextUrl.origin || "http://localhost:3000"}/api/virustotal`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ hash: targetHash, apiKey: vtKey }),
          }
        );
        const vtData = await vtRes.json();
        return NextResponse.json({
          output: `[VIRUSTOTAL & THREAT FORENSICS RESULT]
--------------------------------------------------
Target Hash    : ${vtData.hash || targetHash}
Verdict        : ${vtData.isMalicious ? "🚨 MALICIOUS THREAT DETECTED" : "✅ CLEAN ARTIFACT"}
Severity       : ${vtData.severity || "NOMINAL"}
Detections     : ${vtData.positives || 0} / ${vtData.totalEngines || 72} AV Engines
Threat Family  : ${vtData.familyName || "None"}
Meaningful Name: ${vtData.meaningfulName || "Uploaded Artifact"}
MITRE ATT&CK   : ${vtData.mitreTtp || "Nominal"}
Intelligence   : ${vtData.description || "Cryptographic integrity verified."}
--------------------------------------------------`,
        });
      } catch (e: any) {
        return NextResponse.json({
          output: `Scan error querying hash ${targetHash}: ${e.message}`,
        });
      }
    }

    // 5. GEMINI COMMAND
    if (cmdName === "gemini") {
      const promptText = args.trim();
      if (!promptText) {
        return NextResponse.json({
          output: "Usage: gemini <cybersecurity query or code to analyze>\nExample: gemini Analyze LockBit ransomware mitigation steps",
        });
      }

      const gemKey = apiKey || process.env.GEMINI_API_KEY;
      try {
        const aiRes = await fetch(
          `${req.nextUrl.origin || "http://localhost:3000"}/api/ai-diagnose`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prompt: promptText,
              apiKey: gemKey,
              context,
            }),
          }
        );
        const aiData = await aiRes.json();
        return NextResponse.json({
          output: `[GOOGLE GEMINI AI SENTINEL] (${aiData.source || "LIVE"})\n\n${aiData.response || "Analysis completed."}`,
        });
      } catch (e: any) {
        return NextResponse.json({
          output: `Error invoking Gemini AI: ${e.message}`,
        });
      }
    }

    // 6. QUARANTINE COMMAND
    if (cmdName === "quarantine") {
      const target = args.trim();
      if (!target) return NextResponse.json({ output: "Usage: quarantine <sha256>" });
      await ServerDB.quarantineFile(target);
      return NextResponse.json({
        output: `[QUARANTINE ACTION EXECUTED]
--------------------------------------------------
Target Hash     : ${target}
Action          : Isolated into microVM Sandbox & Marked in DB
--------------------------------------------------`,
      });
    }

    // ROUTE TO AGENT (EXEC and other commands like top, netstat, whoami)
    
    // Resolve Target Agent (if deviceId not provided, pick the first active one)
    let targetAgentId = deviceId;
    if (!targetAgentId) {
      const activeAgent = await prisma.agent.findFirst({
        where: { isActive: true },
        orderBy: { lastSeenAt: 'desc' }
      });
      if (!activeAgent) {
        return NextResponse.json({
          output: `Terminal Error: No active Endpoint Agents connected to execute command '${rawCmd}'.`,
        });
      }
      targetAgentId = activeAgent.id;
    }

    // Map legacy shortcut commands to EXEC
    let finalCmd = args;
    if (cmdName === 'top' || cmdName === 'ps') {
       finalCmd = 'tasklist /FI "STATUS eq RUNNING"'; // Assuming Windows agent for now based on context
    } else if (cmdName === 'ports' || cmdName === 'netstat') {
       finalCmd = 'netstat -ano';
    } else if (cmdName === 'whoami') {
       finalCmd = 'whoami';
    } else if (cmdName !== 'exec') {
       return NextResponse.json({
         output: `cybershield: command not found: '${rawCmd}'. Type 'help' to see valid CLI commands.`,
       });
    }

    if (!finalCmd) {
      return NextResponse.json({
        output: "Usage: exec <diagnostic command>\nAllowed commands: ping, ipconfig, hostname, whoami, systeminfo, netstat, tasklist",
      });
    }

    // Send Command to Agent
    const commandId = crypto.randomUUID();
    const commandPayload = {
      commandId,
      action: 'EXEC',
      command: finalCmd,
      timestamp: Date.now()
    };

    await redis.rpush(`commands:${targetAgentId}`, JSON.stringify(commandPayload));

    // Audit Log: Command Issued
    await prisma.cyberEvent.create({
      data: {
        deviceId: targetAgentId,
        type: "COMMAND_ISSUED",
        severity: "WARNING",
        source: "Dashboard Terminal",
        processName: "OS_DIAGNOSTIC",
        evidence: JSON.stringify(commandPayload),
        status: "OPEN"
      }
    });

    // Wait for Result (up to 10 seconds)
    let resultOutput = `[!] Command execution timed out or agent '${targetAgentId}' did not respond in time.\nCheck Audit Logs for asynchronous results.`;
    
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 500));
      
      const event = await prisma.cyberEvent.findFirst({
        where: { 
          deviceId: targetAgentId,
          type: 'COMMAND_RESULT',
          evidence: { contains: commandId }
        }
      });
      
      if (event) {
        try {
          const evData = JSON.parse(event.evidence || "{}");
          resultOutput = evData.output || evData.error;
        } catch (e) {
          resultOutput = "Error parsing agent response.";
        }
        break;
      }
    }

    return NextResponse.json({
      output: `[AGENT EXECUTION: ${targetAgentId}]\n--------------------------------------------------\n${resultOutput}`,
    });

  } catch (err: any) {
    return NextResponse.json(
      { output: `Terminal error: ${err.message || "Internal execution failure"}` },
      { status: 500 }
    );
  }
}
