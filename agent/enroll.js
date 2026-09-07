const si = require('systeminformation');
const os = require('os');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const ENROLL_URL = 'http://localhost:3000/api/agent/enroll';
const SETUP_TOKEN = 'CYBERSHIELD_SETUP_2026';
const AUTH_FILE_PATH = path.join(__dirname, 'authToken.json');

async function enrollAgent() {
  console.log("=========================================");
  console.log(" CYBERSHIELD AGENT ENROLLMENT [Windows]");
  console.log("=========================================");

  try {
    const osInfo = await si.osInfo();
    const hostname = os.hostname();
    const osBuild = `${osInfo.distro} ${osInfo.release} (${osInfo.build})`;

    console.log(`[*] Requesting enrollment for ${hostname}...`);

    const response = await axios.post(ENROLL_URL, {
      hostname,
      osBuild,
      setupToken: SETUP_TOKEN
    });

    if (response.data.success) {
      const { deviceId, deviceSecret } = response.data;
      const authToken = `${deviceId}:${deviceSecret}`;

      fs.writeFileSync(AUTH_FILE_PATH, JSON.stringify({ authToken, deviceId }), 'utf-8');
      
      console.log(`[+] Enrollment successful!`);
      console.log(`[+] Device ID: ${deviceId}`);
      console.log(`[+] Token saved to ${AUTH_FILE_PATH}`);
      console.log(`\nYou can now run 'node index.js' to start telemetry.`);
    } else {
      console.error("[-] Enrollment failed:", response.data);
    }

  } catch (error) {
    if (error.response) {
      console.error(`[-] API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else {
      console.error("[-] Network Error:", error.message);
    }
    console.error("Make sure the Next.js dashboard is running on http://localhost:3000");
  }
}

enrollAgent();
