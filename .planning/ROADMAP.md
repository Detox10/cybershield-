# ROADMAP

## Phase 3: Baseline & Cleanup (Current Phase)
- Establish a reproducible baseline of actual compilation, type, and lint errors.
- Fix confirmed syntax, typing, lint, and compilation issues only.
- Do NOT alter architecture, DB, or mock data.

## Phase 4: PostgreSQL + Prisma persistence
- Replace `cybershield_data.json` persistence with Prisma + PostgreSQL.
- Preserve the simplest reliable local-development path without creating a second database architecture unless testing proves it necessary.

## Phase 5: Agent identity/enrollment hardening
- Implement dynamic cryptographic enrollment for agents rather than relying on a static `authToken.json`.

## Phase 6: WebSocket/WSS Agent Gateway
- Upgrade the endpoint agent from HTTP polling to a WebSocket connection for real-time C2.

## Phase 7: Command protocol + audit
- Enforce strict backend validation and audit logging before issuing commands.

## Phase 8: CyberEvent/event pipeline + fleet hardening
- Establish the Unified CyberEvent data model correlating endpoint and email indicators.
