<div align="center">

```
 ██████╗██╗   ██╗██████╗ ███████╗██████╗ ███████╗██╗  ██╗██╗███████╗██╗     ██████╗ 
██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗██╔════╝██║  ██║██║██╔════╝██║     ██╔══██╗
██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝███████╗███████║██║█████╗  ██║     ██║  ██║
██║       ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗╚════██║██╔══██║██║██╔══╝  ██║     ██║  ██║
╚██████╗   ██║   ██████╔╝███████╗██║  ██║███████║██║  ██║██║███████╗███████╗██████╔╝
 ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚═════╝ 
```

### 🛡️ *Open-Source Endpoint Detection & Response Platform*

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&duration=3000&pause=1000&color=FF6B35&center=true&vCenter=true&multiline=true&width=600&height=80&lines=Real-time+Fleet+Management+%F0%9F%9A%80;Native+Windows+Telemetry+Agent+%F0%9F%96%A5%EF%B8%8F;Cloud+Dashboard+%2B+Endpoint+.exe+Architecture+%E2%9A%A1" alt="Typing SVG" />

---

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-24-green?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge&logo=github)](https://github.com/Detox10/cybershield/pulls)
[![Stars](https://img.shields.io/github/stars/Detox10/cybershield?style=for-the-badge&logo=github&color=orange)](https://github.com/Detox10/cybershield/stargazers)

</div>

---

## 🌐 What is CyberShield?

> CyberShield is a **dual-architecture**, open-source **EDR (Endpoint Detection and Response)** platform built for the modern security era. Designed as a hackathon project and architected for real-world scalability, it gives you a **centralized cloud dashboard** and a **native lightweight endpoint agent** that talks directly to your OS.

No bloatware. No subscriptions. Just raw, real-time telemetry from your system — **beamed to a beautiful dark dashboard.**

---

## ✨ Feature Highlights

| Feature | Description | Status |
|---|---|---|
| 🖥️ **Live CPU Telemetry** | Real-time CPU load pulled from native Windows counters | ✅ Live |
| 🧠 **Memory Monitoring** | RAM usage with total/used GB breakdown | ✅ Live |
| 💽 **Disk Health** | Filesystem size, usage % and drive breakdown | ✅ Live |
| 🌐 **Network I/O** | Rx/Tx Mbps per interface, auto-detected | ✅ Live |
| 🔍 **Threat Radar** | Active threat scanning with process heuristics | ✅ Live |
| 👾 **Malware Scanner** | PE header detection & in-memory payload analysis | ✅ Live |
| 🚀 **Fleet Management** | Multi-node dashboard supporting unlimited endpoints | ✅ Live |
| 🤖 **AI Copilot** | AI-guided threat analysis and remediation steps | ✅ Live |
| 🔒 **Zero-Trust Rules** | Configurable role-based access control system | ✅ Live |
| 🔬 **Forensics Modal** | Kernel-trace level forensics view per incident | ✅ Live |
| 📊 **Physical Audit Report** | Full hardware audit export | ✅ Live |

---

## 🏗️ Architecture Deep-Dive

```
                        ╔═══════════════════════════════════╗
                        ║      CYBERSHIELD CLOUD (Vercel)   ║
                        ║   ┌─────────────────────────────┐ ║
                        ║   │      Next.js Dashboard       │ ║
                        ║   │  • Threat Radar              │ ║
                        ║   │  • Fleet Endpoints           │ ║
                        ║   │  • AI Copilot                │ ║
                        ║   │  • Incident Feed             │ ║
                        ║   └──────────┬──────────────────┘ ║
                        ║              │                     ║
                        ║   /api/telemetry  (REST+WebSocket) ║
                        ╚══════════════╪════════════════════╝
                                       │
              ┌────────────────────────┼───────────────────────────┐
              │                        │                           │
     ┌────────▼──────┐        ┌────────▼──────┐         ┌────────▼──────┐
     │  Windows PC   │        │  Windows PC   │         │  Windows PC   │
     │  (Your PC)    │        │  (Friend's PC)│         │  (Office PC)  │
     │               │        │               │         │               │
     │ cybershield   │        │ cybershield   │         │ cybershield   │
     │  -agent.exe   │        │  -agent.exe   │         │  -agent.exe   │
     │               │        │               │         │               │
     │ • CPU Load    │        │ • CPU Load    │         │ • CPU Load    │
     │ • RAM Usage   │        │ • RAM Usage   │         │ • RAM Usage   │
     │ • Disk Health │        │ • Disk Health │         │ • Disk Health │
     │ • Net Traffic │        │ • Net Traffic │         │ • Net Traffic │
     └───────────────┘        └───────────────┘         └───────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

```bash
node --version  # v18+
npm --version   # v9+
```

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Detox10/cybershield.git
cd cybershield
```

### 2️⃣ Install Dashboard Dependencies

```bash
npm install
```

### 3️⃣ Start the Dashboard (Development)

```bash
npm run dev
# 🚀 Dashboard running on http://localhost:3000
```

### 4️⃣ Start the Endpoint Agent

```bash
# Open a NEW terminal tab — run as Administrator for real hardware stats!
cd agent
npm install
node index.js

# ✅ You should see:
# =========================================
#  CYBERSHIELD ENDPOINT AGENT [Windows]
#  Phase 3: Active Threat Scanner Online
# =========================================
# [+] Telemetry Sent | CPU: 23% | Procs: 357 | NetConns: 48
```

---

## 🌍 Deploy for Public Use (Full Dual-Architecture)

> Want other people's computers to show up in **your** dashboard? Follow this guide.

### Step 1: Deploy the Dashboard to Vercel

```bash
# 1. Push your code to GitHub
git add .
git commit -m "Deploy CyberShield"
git push origin main

# 2. Go to https://vercel.com → New Project → Import GitHub repo
# 3. Click Deploy → Your dashboard goes LIVE 🎉
# 4. Copy your URL: https://your-project.vercel.app
```

### Step 2: Update the Agent to Point to Your Live Dashboard

Open `agent/index.js` and update **line 5**:

```javascript
// BEFORE — local development only
const DASHBOARD_URL = 'http://localhost:3000/api/telemetry';

// AFTER — point to your live Vercel dashboard
const DASHBOARD_URL = 'https://your-project.vercel.app/api/telemetry';
```

### Step 3: Compile the Agent to a Standalone `.exe`

```bash
cd agent
npm install
npm run build

# ✅ Output:
# > npx pkg . --targets node18-win-x64 --output cybershield-agent.exe
# cybershield-agent.exe  ← No Node.js required on the target machine!
```

### Step 4: Distribute the `.exe`

```
📦 cybershield-agent.exe  ← Upload as a GitHub Release asset

When users double-click it (as Administrator):
  ✅ Their PC instantly appears in YOUR Fleet dashboard
  ✅ Live CPU, RAM, Disk, Network streams in real-time
  ✅ Threats are auto-detected and reported to the cloud
```

> ⚠️ **Important:** The `.exe` must be run as **Administrator** to access true hardware telemetry from the Windows kernel. Right-click → *"Run as Administrator"*.

---

## 📁 Project Structure

```
cybershield/
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📁 api/
│   │   │   ├── 📁 telemetry/        ← Agent POST endpoint
│   │   │   ├── 📁 security-events/  ← Threat event receiver
│   │   │   └── 📁 db/               ← Database APIs
│   │   └── 📄 globals.css           ← Global dark theme styles
│   ├── 📁 components/
│   │   ├── 📁 crm/                  ← Main Dashboard Layout
│   │   ├── 📁 dashboard/            ← Charts, Graphs, Scanners
│   │   ├── 📁 modals/               ← Forensics, Sandbox, Quarantine
│   │   └── 📁 ui/                   ← Reusable design system
│   └── 📁 store/                    ← Zustand state management
│
├── 📁 agent/
│   ├── 📄 index.js                  ← 🧠 THE MAIN ENDPOINT AGENT
│   ├── 📄 simulate-fleet.js         ← Mock data for UI testing
│   └── 📄 package.json              ← Agent deps + build script
│
├── 📄 .gitignore
├── 📄 README.md
└── 📄 package.json
```

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TELEMETRY DATA FLOW                         │
└─────────────────────────────────────────────────────────────────────┘

  [Windows OS]                [Agent - index.js]             [Dashboard]
      │                              │                             │
      │  os.cpus()  ─────────────►  │                             │
      │  si.mem() ───────────────►  │   POST /api/telemetry       │
      │  si.networkStats() ──────►  │  ──────────────────────►   │
      │  si.fsSize() ────────────►  │                             │
      │  si.processes() ─────────►  │    every 1.5 seconds        │
      │                              │                             │
      │                              │   ◄── HTTP 200 OK ─────────│
      │                              │                             │
      │                              │              React re-renders
      │                              │           Fleet Table updates
      │                              │           Graph new data point
```

---

## 🛡️ Security Model

```
┌──────────────────────────────────────────────────────┐
│                   THREAT DETECTION                    │
├──────────────────────────────────────────────────────┤
│  Agent runs heuristic checks every 30 seconds        │
│                                                      │
│  🔴 CRITICAL  → In-memory PE payload (MZ header)     │
│  🟠 HIGH      → PROT_EXEC dynamic memory mapping     │
│  🟡 MEDIUM    → Suspicious process name patterns     │
│  🟢 LOW       → Unusual network connection volume    │
│                                                      │
│  On Detection:                                       │
│  ① Process is identified and flagged                 │
│  ② Alert is POSTed to /api/security-events          │
│  ③ Dashboard Incident Feed updates in real-time      │
│  ④ AI Copilot provides remediation guidance          │
└──────────────────────────────────────────────────────┘
```

---

## 🤝 Contributing

CyberShield is fully open and modular. Here is how you can add new monitoring capabilities:

### Adding a New Monitoring Module (Example: GPU Monitoring)

**Step 1 — Collect data in the Agent:**
```javascript
// agent/index.js
const gpuData = await si.graphics();
const gpuLoad = gpuData.controllers[0]?.utilizationGpu ?? 0;
```

**Step 2 — Add it to the telemetry payload:**
```javascript
const payload = {
  cpu:    { loadPercent, model, cores },
  memory: { usagePercent, usedGb, totalGb },
  gpu:    { loadPercent: gpuLoad },   // ← Your new field!
};
```

**Step 3 — Create a Dashboard card:**
```tsx
// src/components/dashboard/GpuCard.tsx
export function GpuCard({ data }) {
  return (
    <div className="glass-card p-4 rounded-2xl">
      <h3 className="text-slate-400">GPU Utilization</h3>
      <p className="text-4xl font-bold text-emerald-400">{data.gpu.loadPercent}%</p>
    </div>
  );
}
```

### Contribution Workflow

```
1. 🍴 Fork  →  2. 🌿 Branch  →  3. ✍️ Code  →  4. ✅ Test  →  5. 📬 PR
```

```bash
git checkout -b feature/gpu-monitoring
# ... make your changes ...
npm run dev          # test the dashboard
cd agent && node index.js  # test the agent
git push origin feature/gpu-monitoring
# open a Pull Request on GitHub!
```

---

## 📊 Roadmap

```
CURRENT (v1.0) ──────────────────────────────────────────────► FUTURE
    │                                                               │
    │  ✅ Real-time telemetry      🔲 GPU utilization monitoring    │
    │  ✅ Multi-node fleet         🔲 Network packet inspection     │
    │  ✅ Threat detection         🔲 Ransomware honeypot traps     │
    │  ✅ AI Copilot               🔲 Rust kernel-level agent       │
    │  ✅ Forensics view           🔲 eBPF Linux agent              │
    │  ✅ .exe compilation         🔲 macOS agent support           │
    │  ✅ Open Source              🔲 Mobile command app            │
    └───────────────────────────────────────────────────────────────┘
```

---

## 📜 License

This project is licensed under the **MIT License**. You are free to use, modify, distribute, and build upon this project for any purpose — personal, educational, or commercial.

---

<div align="center">

Built with ❤️ by [Himanshu Bawane](https://github.com/Detox10) — Open-Source EDR Platform

⭐ **Star this repo** if you found it useful — it helps others discover CyberShield!

[![GitHub stars](https://img.shields.io/github/stars/Detox10/cybershield?style=social)](https://github.com/Detox10/cybershield)

</div>

