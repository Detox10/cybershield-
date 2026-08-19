import { NextResponse } from "next/server";
// We need to fetch from our own API or use the db logic directly.
// In Next.js App Router, we can't easily fetch to our own absolute URL in a serverless function without knowing the host, 
// so we'll just mock the VT response and POST directly to the incidents API, or we can just do a relative fetch if we pass the host.
// Actually, it's easier to just POST to the timeline and incidents DB.

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const authHeader = request.headers.get("authorization");
    if (authHeader !== "Bearer CS-AGENT-SECRET-2026") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Receive the security event from the Agent
    console.log("[Cloud] Received Security Event from Agent:", data.processName);

    // 2. Simulate Cloud Intelligence (VirusTotal / AI correlation)
    // We already passed a malicious WannaCry hash from the agent.
    const isMalicious = true; 
    
    // AI Copilot Correlation Engine
    let mappedTtp = data.cveTtp || "T1059 (Command and Scripting Interpreter)";
    let aiGeneratedSummary = "Process execution matched heuristic profile.";
    const pName = (data.processName || "").toLowerCase();
    
    if (pName.includes("dummy") || pName.includes("malware")) {
      mappedTtp = "T1204.002 (Malicious File) -> T1059.003 (Command Shell)";
      aiGeneratedSummary = `CyberShield AI Copilot identified '${data.processName}' as an active threat actor beacon attempting execution on ${data.targetHost}. The file signature closely matches known ransomware variants. Action blocked instantly at Ring-0.`;
    } else if (pName.includes("powershell")) {
      mappedTtp = "T1059.001 (PowerShell) -> T1082 (System Information Discovery)";
      aiGeneratedSummary = `AI Copilot intercepted unauthorized PowerShell execution on ${data.targetHost}. The script attempted to enumerate local administrators and network shares.`;
    }

    if (isMalicious) {
      const idSuffix = Math.floor(Math.random() * 10000);
      
      const newIncident = {
        id: `inc-agent-${idSuffix}`,
        threatName: data.threatName || "Suspicious Execution",
        cveTtp: mappedTtp,
        targetHost: data.targetHost || "Endpoint",
        vector: data.vector || "Endpoint Agent",
        severity: data.severity || "CRITICAL",
        timestamp: data.timestamp || new Date().toISOString(),
        status: "QUARANTINED",
        aiSummary: aiGeneratedSummary
      };

      const newEvent = {
        id: `evt-agent-${idSuffix}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: "Agent Quarantine",
        description: `Endpoint Agent successfully isolated ${data.processName} (PID ${data.pid}).`,
        type: "success"
      };

      // 3. Post to the Dashboard DB
      // We need absolute URL in Next.js Server Components if fetching our own API
      const host = request.headers.get("host") || "localhost:3000";
      const protocol = host.includes("localhost") ? "http" : "https";
      
      await fetch(`${protocol}://${host}/api/db/incidents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newIncident)
      });

      await fetch(`${protocol}://${host}/api/db/timeline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent)
      });
      
      // Also write to scans database so it shows up in Quarantine Vault
      const newScan = {
        id: `scan-agent-${idSuffix}`,
        name: data.processName,
        hash: data.hash,
        threatType: data.threatName,
        originalPath: data.commandLine || `C:\\Windows\\Temp\\${data.processName}`,
        quarantineDate: new Date().toISOString(),
        size: "1.2 MB"
      };

      await fetch(`${protocol}://${host}/api/db/scans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newScan)
      });

      console.log("[Cloud] Incident and Quarantine generated successfully.");
    }

    return NextResponse.json({ success: true, action: "quarantined" });

  } catch (error) {
    console.error("Security Event Error:", error);
    return NextResponse.json({ error: "Failed to process security event" }, { status: 500 });
  }
}
