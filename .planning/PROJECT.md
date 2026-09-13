# PROJECT

**CyberShield Architecture & Technical Direction**

CyberShield is a unified endpoint and email security platform. This document defines the target architecture based on the `enterprise_nextjs_architecture.md` standard and the project's evolution.

## Target Enterprise Architecture
- **Primary Database:** PostgreSQL (via Prisma ORM)
- **State & Caching:** Redis (for session state, rate limiting, and fast telemetry queues)
- **Client Application:** Next.js App Router (React 18, Tailwind, Zustand)
- **Endpoint Agent:** Node.js executable compiled for Windows
- **Agent Connectivity:** WebSocket (WS/WSS) Agent Gateway for real-time bi-directional C2
- **Agent Identity:** Formal enrollment via cryptographic device credentials
- **Event Bus:** Unified `CyberEvent` data model correlating email and endpoint indicators
- **Security & RBAC:** Strict Command Authorization and Audit Logging

## Engineering Principles (Ponytail Rules)
1. **Lazy, not negligent:** Never rewrite existing functional code unless explicitly upgrading from a broken/mock state to the target architecture.
2. **Local First:** The local development environment must remain functional. Fallbacks (like SQLite or InMemory map) should be preserved strictly for developer onboarding if PostgreSQL/Redis aren't running.
3. **Evidence-based Implementation:** Do not claim a component exists until the repository proves it.
