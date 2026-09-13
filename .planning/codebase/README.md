# Codebase Architecture Map

## Frontend (Next.js App Router)
- **Framework:** Next.js 14, React 18, Tailwind CSS, Lucide Icons, Framer Motion
- **Components (`src/components/`):** Rich UI library including `Hero.tsx`, `LiveIncidentFeed.tsx`, `ThreatRadar.tsx`, `DesktopSidebar.tsx`, `SecurityConsoleModal.tsx`.
- **Flows (`src/components/flows/`):** Dashboard, Scan, Settings, Threat Analysis.
- **State:** Uses Zustand for client state and React Query for server state.

## Backend (Next.js API Routes)
- **Path:** `src/app/api/`
- **Modules:**
  - `/agent/enroll` (Agent registration)
  - `/telemetry` & `/telemetry/security-events` (Agent metrics/threat reporting)
  - `/commands` (C2 instruction polling)
  - `/ai/chat`, `/ai/forensics` (Gemini-powered analysis)
  - `/email/analyze` (Email inspection)
  - `/virustotal` (Threat intel integration)
  - `/db` (Data querying endpoints)

## Data Layer
- **ORM:** Prisma (`prisma/schema.prisma` exists defining Agent, Telemetry, CyberEvent, Incident, EmailAnalysis).
- **Current Runtime DB:** `src/lib/serverDb.ts` currently bypasses Prisma to read/write a flat `cybershield_data.json` file.
- **Caching:** `src/lib/redis.ts` exists but uses an `InMemoryRedis` Map fallback due to missing local Docker/Redis infrastructure.

## Endpoint Agent
- **Path:** `/agent/`
- **Stack:** Node.js (uses `systeminformation`, `axios`).
- **Core Loop:** `index.js` polls OS telemetry (CPU, RAM, Net) every 1.5s and deep metrics (processes, services) every 10s. It polls the dashboard for commands over HTTP.
- **Threat Detection:** Uses a local `dummy-malware.js` for heuristic matching.
