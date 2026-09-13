# Phase 4 Execution Tasks

- [ ] Inspect existing `cybershield_data.json` and map to `schema.prisma`.
- [ ] Update `prisma/schema.prisma` with `ScannedFileRecord`, `PhysicalForensicReport`, `TimelineEvent` (skipping `UserAccount`).
- [ ] Run `npx prisma format` and `npx prisma db push` (or `migrate dev`).
- [ ] Create `scripts/migrate-json-to-postgres.ts`.
- [ ] Refactor `src/lib/serverDb.ts` to use Prisma.
- [ ] Refactor API routes to `await` Prisma calls.
  - [ ] `api/terminal/route.ts`
  - [ ] `api/db/users/route.ts` (Remove/deprecate if unused by app)
  - [ ] `api/db/scans/route.ts`
  - [ ] `api/db/timeline/route.ts`
  - [ ] `api/db/reports/route.ts`
  - [ ] `api/db/incidents/route.ts`
- [ ] Run migration script (`migrate-json-to-postgres.ts`).
- [ ] Verify functionality (startup, build, API calls).
- [ ] Generate Phase 4 Walkthrough report.
