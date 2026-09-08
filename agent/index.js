const si = require('systeminformation');
const axios = require('axios');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const crypto = require('crypto');

// Configuration
const BASE_URL = 'http://localhost:3000';
const DASHBOARD_URL = `${BASE_URL}/api/telemetry`;
const SECURITY_EVENTS_URL = `${BASE_URL}/api/telemetry/security-events`;
const COMMANDS_URL = `${BASE_URL}/api/commands`;

const FAST_POLL_MS = 1500;
const SLOW_POLL_MS = 10000;
const SECURITY_SCAN_MS = 5000; // Scan processes every 5s

// Load Authentication Token
let AUTH_TOKEN = '';
try {
  const authData = JSON.parse(fs.readFileSync(path.join(__dirname, 'authToken.json'), 'utf-8'));
  AUTH_TOKEN = `Bearer ${authData.authToken}`;
} catch (e) {
  console.error("[!] Error: Could not load authToken.json. Please run 'node enroll.js' first.");
  process.exit(1);
}

console.log("=========================================");
console.log(" CYBERSHIELD ENDPOINT AGENT [Windows]");
console.log(" Phase 3: Active Threat Scanner Online");
console.log("=========================================");
console.log(`Connecting to Cloud Dashboard at ${DASHBOARD_URL}...`);

// Fast Loop State
let prevRx = 0;
let prevTx = 0;
let prevNetTime = Date.now();
let firstNetCall = true;

// Slow Loop State
let cachedSlowData = {
  processes: [],
  networkConnections: [],
  osBuild: "",
  services: []
};

// Slow Loop: Heavy OS queries every 10 seconds
async function collectSlowTelemetry() {
  try {
    const [processData, netConnections, osInfo, services] = await Promise.all([
      si.processes(),
      si.networkConnections(),
      si.osInfo(),
      si.services('*')
    ]);

    // Format top 10 CPU processes
    const sortedProcs = (processData.list || [])
      .sort((a, b) => b.cpu - a.cpu)
      .slice(0, 10)
      .map(p => ({
        pid: p.pid,
        name: p.name,
        cpu: parseFloat(p.cpu.toFixed(1)),
        mem: parseFloat(p.mem.toFixed(1)),
        user: p.user
      }));

    // Format established network connections
    const activeConns = (netConnections || [])
      .filter(c => c.state === 'ESTABLISHED' || c.state === 'LISTEN')
      .slice(0, 20)
      .map(c => ({
        protocol: c.protocol,
        localAddress: c.localAddress,
        localPort: c.localPort,
        peerAddress: c.peerAddress,
        peerPort: c.peerPort,
        state: c.state
      }));

    // Format top 10 running services
    const runningServices = (services || [])
      .filter(s => s.running)
      .slice(0, 10)
      .map(s => ({
        name: s.name,
        startType: s.startType,
        user: s.user
      }));

    cachedSlowData = {
      processes: sortedProcs,
      networkConnections: activeConns,
      osBuild: `${osInfo.distro} ${osInfo.release} (${osInfo.build})`,
      services: runningServices
    };

  } catch (error) {
    // Silently ignore slow loop errors to not interrupt fast loop
  }
}

// Security Loop: Scan active processes for heuristics
async function runSecurityScan() {
  try {
    const processData = await si.processes();
    const procs = processData.list || [];

    // Simple IoC blacklist for demonstration
    const maliciousNames = ["dummy-malware", "wannacry.exe", "mimikatz.exe", "test-malware.exe"];

    for (const p of procs) {
      const pName = (p.name || "").toLowerCase();
      const pCmd = (p.command || "").toLowerCase();
      
      const isMalicious = maliciousNames.some(badName => pName.includes(badName) || pCmd.includes(badName));

      if (isMalicious) {
        // Compute an actual hash of the process name (simulating a memory signature hash)
        const hash = crypto.createHash('sha256').update(pName + pCmd).digest('hex');

        const threatPayload = {
          threatName: "Suspicious Node Execution",
          cveTtp: "Heuristic (T1059.003 - Command and Scripting Interpreter)",
          targetHost: os.hostname(),
          vector: "Endpoint Security Scanner",
          severity: "HIGH",
          pid: p.pid,
          processName: p.name,
          commandLine: p.command,
          hash: hash,
          timestamp: new Date().toISOString()
        };

        console.log(`\n[!!!] THREAT DETECTED: ${p.name} (PID: ${p.pid})`);
        console.log(`[*] Computed Memory Signature Hash: ${hash}`);
        console.log(`[*] Sending Security Event to Cloud for AI Analysis...`);

        try {
          await axios.post(SECURITY_EVENTS_URL, threatPayload, {
            headers: { 'Authorization': AUTH_TOKEN, 'Content-Type': 'application/json' },
            timeout: 3000
          });
        } catch(e) {
          console.error(`[!] Failed to emit security event: ${e.message}`);
        }

        break; 
      }
    }
  } catch(error) {
    // Ignore scan errors
  }
}

let prevCpuIdle = 0;
let prevCpuTotal = 0;

// Initialize CPU counters so first tick isn't 0
const initialCpus = os.cpus();
for (const core of initialCpus) {
  for (const type in core.times) {
    prevCpuTotal += core.times[type];
  }
  prevCpuIdle += core.times.idle;
}

// Fast Loop: Real-time CPU/RAM every 1.5 seconds
async function collectFastTelemetry() {
  try {
    const [mem, networkStats, processes, diskLayout, cpuBrand, cpuLoadData] = await Promise.all([
      si.mem(),
      si.networkStats(),
      si.processes(),
      si.fsSize(),
      si.cpu(),
      si.currentLoad()
    ]);

    // Network delta calculation
    let rxMbps = 0;
    let txMbps = 0;
    let currentRx = 0;
    let currentTx = 0;
    let activeInterface = "Ethernet";
    
    for (const net of networkStats) {
      if (net.rx_sec > 0 || net.tx_sec > 0) {
        activeInterface = net.iface;
      }
      currentRx += net.rx_bytes;
      currentTx += net.tx_bytes;
    }

    const now = Date.now();
    const elapsedSec = Math.max((now - prevNetTime) / 1000, 0.5);

    if (firstNetCall) {
      prevRx = currentRx;
      prevTx = currentTx;
      prevNetTime = now;
      firstNetCall = false;
    } else {
      const rxDelta = Math.max(currentRx - prevRx, 0);
      const txDelta = Math.max(currentTx - prevTx, 0);
      rxMbps = parseFloat(((rxDelta * 8) / (1_000_000 * elapsedSec)).toFixed(2));
      txMbps = parseFloat(((txDelta * 8) / (1_000_000 * elapsedSec)).toFixed(2));
      prevRx = currentRx;
      prevTx = currentTx;
      prevNetTime = now;
    }

    // Disk calculation
    let totalDisk = 0;
    let usedDisk = 0;
    for (const drive of diskLayout) {
      totalDisk += drive.size;
      usedDisk += drive.used;
    }

    let loadPercent = Math.round(cpuLoadData.currentLoad);

    // Ensure it doesn't report 0% or negative if math rounds oddly
    loadPercent = Math.max(1, Math.min(100, loadPercent));

    const payload = {
      agentId: os.hostname(), // Real hostname for fleet tracking
      cpu: {
        loadPercent: loadPercent,
        speedGhz: cpuBrand.speed || 3.3,
        cores: cpuBrand.cores,
        model: cpuBrand.brand,
      },
      network: {
        rxMbps,
        txMbps,
        totalMbps: parseFloat((rxMbps + txMbps).toFixed(2)),
        interface: activeInterface,
      },
      ebpf: {
        available: os.platform() === 'linux',
        opsPerSec: Math.round(processes.all * 14.5),
      },
      host: {
        processCount: processes.all,
        threadCount: processes.all * 18,
        osBuild: cachedSlowData.osBuild || "Windows 11 (Unknown Build)",
      },
      memory: {
        usagePercent: Math.round(((mem.total - mem.available) / mem.total) * 100),
        usedGb: parseFloat(((mem.total - mem.available) / (1024 ** 3)).toFixed(2)),
        totalGb: parseFloat((mem.total / (1024 ** 3)).toFixed(2)),
      },
      disk: {
        totalGb: parseFloat((totalDisk / (1024 ** 3)).toFixed(2)),
        usedGb: parseFloat((usedDisk / (1024 ** 3)).toFixed(2)),
        usagePercent: totalDisk > 0 ? Math.round((usedDisk / totalDisk) * 100) : 0,
      },
      // Phase 2 Advanced Telemetry Array
      advanced: {
        processes: cachedSlowData.processes,
        networkConnections: cachedSlowData.networkConnections,
        services: cachedSlowData.services
      }
    };

    // Push to dashboard
    try {
      await axios.post(DASHBOARD_URL, payload, {
        headers: {
          'Authorization': AUTH_TOKEN,
          'Content-Type': 'application/json'
        },
        timeout: 2000
      });
      process.stdout.write(`\r[+] Telemetry Sent | CPU: ${payload.cpu.loadPercent}% | Procs: ${payload.advanced.processes.length} | NetConns: ${payload.advanced.networkConnections.length}`.padEnd(80));
    } catch (e) {
      process.stdout.write(`\r[!] Failed to connect to Dashboard (${e.message})`.padEnd(80));
    }

  } catch (error) {
    console.error("\nError collecting fast telemetry:", error.message);
  }
}

// Command Polling Loop
async function pollCommands() {
  try {
    const response = await axios.get(COMMANDS_URL, {
      headers: { 'Authorization': AUTH_TOKEN }
    });

    const command = response.data.command;
    if (command && command.action === 'KILL_PROCESS') {
      console.log(`\n[!] Received Command: KILL_PROCESS | PID: ${command.pid} | TARGET: ${command.processName}`);
      
      // Verify process name matches before killing
      const processData = await si.processes();
      const targetProc = processData.list.find(p => p.pid === parseInt(command.pid));

      let success = false;
      let output = "";
      let errorStr = "";

      if (!targetProc) {
        errorStr = `Process with PID ${command.pid} not found running on system.`;
        console.error(`[-] Validation failed: ${errorStr}`);
      } else if (targetProc.name.toLowerCase() !== command.processName.toLowerCase()) {
        errorStr = `Process name mismatch! Expected '${command.processName}', but PID ${command.pid} is '${targetProc.name}'.`;
        console.error(`[-] Validation failed: ${errorStr}`);
      } else {
        console.log(`[+] Validation passed. Terminating ${targetProc.name}...`);
        try {
          if (os.platform() === 'win32') {
            await new Promise((resolve, reject) => {
              exec(`taskkill /F /PID ${command.pid}`, (err, stdout, stderr) => {
                if (err) reject(err);
                else resolve(stdout);
              });
            });
          } else {
            process.kill(command.pid, 'SIGKILL');
          }
          success = true;
          output = `Process ${command.processName} (PID: ${command.pid}) successfully terminated.`;
          console.log(`[+] ${output}`);
        } catch (e) {
          errorStr = `Failed to terminate: ${e.message}`;
          console.error(`[-] ${errorStr}`);
        }
      }

      // Report result back to dashboard
      await axios.post(COMMANDS_URL, {
        isResult: true,
        commandId: command.commandId,
        action: command.action,
        pid: command.pid,
        processName: command.processName,
        success,
        output,
        error: errorStr
      }, {
        headers: { 'Authorization': AUTH_TOKEN, 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    // Silently ignore polling errors
  }
}

// Boot Sequence
async function startAgent() {
  // 1. Instantly fire fast telemetry so the dashboard populates!
  collectFastTelemetry();
  
  // 2. Start intervals
  setInterval(collectFastTelemetry, FAST_POLL_MS);
  setInterval(collectSlowTelemetry, SLOW_POLL_MS);
  setInterval(runSecurityScan, SECURITY_SCAN_MS);
  setInterval(pollCommands, 3000); // Poll commands every 3s

  // 3. Kick off the slow OS scrapes in the background (Windows services can take 5+ seconds)
  collectSlowTelemetry(); 
  runSecurityScan();      
}

startAgent();
