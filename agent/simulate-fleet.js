const axios = require('axios');

const DASHBOARD_URL = 'https://cybershield-beryl-two.vercel.app/api/telemetry';
const AUTH_TOKEN = 'Bearer CS-AGENT-SECRET-2026';
const POLL_MS = 2000;

const MOCK_AGENTS = [
  { agentId: "WIN-DESKTOP-HR", model: "Intel Core i5-11400", cores: 6, speedGhz: 2.6, osBuild: "Windows 11 (22621)", totalGb: 16 },
  { agentId: "UBUNTU-SERVER-PROD", model: "AMD EPYC 7742", cores: 64, speedGhz: 2.25, osBuild: "Ubuntu 22.04 LTS", totalGb: 128 },
  { agentId: "WIN-LAPTOP-EXEC", model: "Intel Core i7-12700H", cores: 14, speedGhz: 3.5, osBuild: "Windows 11 (22631)", totalGb: 32 },
  { agentId: "CENTOS-DB-01", model: "Intel Xeon Platinum 8380", cores: 40, speedGhz: 2.3, osBuild: "CentOS Linux 8", totalGb: 256 },
  { agentId: "MAC-DEV-M2", model: "Apple M2 Pro", cores: 10, speedGhz: 3.49, osBuild: "macOS 14.2.1", totalGb: 16 }
];

console.log("=========================================");
console.log(" CYBERSHIELD VIRTUAL FLEET SIMULATOR");
console.log(` Generating telemetry for ${MOCK_AGENTS.length} virtual endpoints...`);
console.log("=========================================");

function generateRandomTelemetry(agentInfo) {
  const isServer = agentInfo.agentId.includes("SERVER") || agentInfo.agentId.includes("DB");
  
  // Randomize loads based on if it's a server or not
  const loadPercent = isServer ? Math.floor(Math.random() * 40) + 40 : Math.floor(Math.random() * 20) + 5;
  const memoryUsagePercent = isServer ? Math.floor(Math.random() * 30) + 60 : Math.floor(Math.random() * 40) + 30;
  
  const rxMbps = parseFloat((Math.random() * (isServer ? 50 : 10)).toFixed(2));
  const txMbps = parseFloat((Math.random() * (isServer ? 100 : 5)).toFixed(2));

  return {
    agentId: agentInfo.agentId,
    cpu: {
      loadPercent,
      speedGhz: agentInfo.speedGhz,
      cores: agentInfo.cores,
      model: agentInfo.model
    },
    network: {
      rxMbps,
      txMbps,
      totalMbps: parseFloat((rxMbps + txMbps).toFixed(2)),
      interface: "eth0"
    },
    host: {
      processCount: Math.floor(Math.random() * 100) + 150,
      threadCount: Math.floor(Math.random() * 500) + 1500,
      osBuild: agentInfo.osBuild
    },
    memory: {
      usagePercent: memoryUsagePercent,
      usedGb: parseFloat(((memoryUsagePercent / 100) * agentInfo.totalGb).toFixed(2)),
      totalGb: agentInfo.totalGb
    },
    disk: {
      totalGb: isServer ? 2048 : 512,
      usedGb: isServer ? 1400 : 200,
      usagePercent: isServer ? 68 : 39
    },
    advanced: {
      processes: [],
      networkConnections: [],
      services: []
    }
  };
}

async function emitFleetTelemetry() {
  for (const agent of MOCK_AGENTS) {
    const payload = generateRandomTelemetry(agent);
    
    try {
      await axios.post(DASHBOARD_URL, payload, {
        headers: {
          'Authorization': AUTH_TOKEN,
          'Content-Type': 'application/json'
        },
        timeout: 2000
      });
      console.log(`[+] Pushed telemetry for ${agent.agentId} | CPU: ${payload.cpu.loadPercent}%`);
    } catch (e) {
      console.log(`[!] Failed to push for ${agent.agentId}: ${e.message}`);
    }
  }
}

// Start looping
setInterval(emitFleetTelemetry, POLL_MS);
emitFleetTelemetry();
