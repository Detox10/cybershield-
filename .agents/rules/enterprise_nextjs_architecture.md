---
trigger: always_on
description: Standardized enterprise Next.js full-stack architecture guidelines based on the CyberShield design pattern.
---

# Enterprise Next.js Architecture Standard

When generating, modifying, or structuring ANY new web application or project, adhere strictly to this architectural blueprint (inspired by the CyberShield project) to ensure maximum scalability, security, and maintainability.

## 1. Core Tech Stack
- **Framework:** Next.js (App Router `src/app` only)
- **Language:** TypeScript (Strict mode enabled)
- **Styling:** Tailwind CSS + Radix UI (headless primitives) + Lucide React (icons)
- **State Management:** Zustand (Client state) + TanStack React Query (Server state/data fetching)
- **Database ORM:** Prisma
- **Validation:** Zod (for both API payloads and form inputs)

## 2. Directory Structure Blueprint
Enforce the following modular structure in `src/`:
```text
src/
├── app/
│   ├── api/             # Backend API routes (Serverless functions)
│   ├── (auth)/          # Authentication routes
│   └── (dashboard)/     # Main application views
├── components/
│   ├── ui/              # Reusable UI primitives (Buttons, Inputs)
│   ├── modals/          # Global dialogs and modals
│   └── shared/          # Complex cross-page components
├── lib/
│   ├── db.ts            # Prisma client singleton
│   ├── redis.ts         # Caching layer (with InMemory fallback)
│   └── utils.ts         # Shared helpers (e.g., tailwind merge)
└── types/               # Global TypeScript definitions
```

## 3. Dual-Architecture & AI Fallback Principles
- **Separation of Concerns:** Keep heavy processing (like endpoint agents or data scrapers) in separate Node.js scripts or workers. The Next.js API should strictly act as the Command & Control (C2) receiver.
- **Graceful Degradation (Offline Fallbacks):** Whenever integrating external APIs (like Google Gemini, VirusTotal, or Stripe), ALWAYS provide a local, hardcoded heuristic fallback. If the API key is missing or the service is down, the application must not crash; it should fall back to a local rules engine or mock database.

## 4. UI/UX Design System
- **Theme:** Default to a premium Dark Mode aesthetic.
- **Glassmorphism:** Use translucent backgrounds (`bg-white/5 backdrop-blur-md`) for cards and modals.
- **Feedback:** Use `sonner` or `react-toastify` for immediate user feedback on all API actions.
- **Data Visualization:** Use `recharts` for dashboards. Always include empty states ("Waiting for data...") when telemetry is at 0.

## 5. Security & Validation
- **Environment Variables:** NEVER expose secret keys to the client. Keep them server-side.
- **Payload Validation:** Every `/api/*` POST/PUT route MUST validate `request.json()` using a Zod schema before processing.
- **Authorization:** Validate Bearer tokens or Session cookies on every protected API route.
