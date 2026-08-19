# CyberShield — Master Engineering & UI/UX Directive

> **Single Source of Truth for CyberShield Autonomous Cybersecurity OS**

## Mandatory Pre-Flight Directive for AI Engineers & Contributors
Before generating or modifying any user interface, component, layout, or interaction in CyberShield:
1. Read every document in `docs/`:
   - [DESIGN_SYSTEM.md](file:///c:/Users/bawan/cybershield/docs/DESIGN_SYSTEM.md)
   - [UI_GUIDELINES.md](file:///c:/Users/bawan/cybershield/docs/UI_GUIDELINES.md)
   - [MOTION_SYSTEM.md](file:///c:/Users/bawan/cybershield/docs/MOTION_SYSTEM.md)
   - [ANIMATION_RULES.md](file:///c:/Users/bawan/cybershield/docs/ANIMATION_RULES.md)
   - [COMPONENT_LIBRARY.md](file:///c:/Users/bawan/cybershield/docs/COMPONENT_LIBRARY.md)
   - [BRAND_GUIDELINES.md](file:///c:/Users/bawan/cybershield/docs/BRAND_GUIDELINES.md)
   - [ACCESSIBILITY.md](file:///c:/Users/bawan/cybershield/docs/ACCESSIBILITY.md)
   - [PRD.md](file:///c:/Users/bawan/cybershield/docs/PRD.md)
   - [ROADMAP.md](file:///c:/Users/bawan/cybershield/docs/ROADMAP.md)
2. Use these documents as the inviolable baseline for color palettes, typography, spacing, glassmorphic elevation, 5-state handling, animations, and accessibility.
3. Centralize all motion tokens in `src/motion/` and reusable UI components in `src/components/ui/`.

---

## Core Product Vision
CyberShield is an enterprise-grade autonomous threat intelligence and Zero-Trust cyber operating system. It provides real-time vector telemetry, automated packet disassembly, threat containment, digital twin simulations, and contextual AI mitigation.

---

## Master Architecture Rules
1. **Light-First Master Theme with Cyber Dark Mode**:
   - Light canvas (`#FAFBFC`), crisp border contrasts (`#E2E8F0`), elevated card surfaces (`#FFFFFF`), with animated top ambient neon aurora highlights.
   - Dark mode (`#0F1419` / `#050811`) with glowing cyber accents (`#0EA5E9`, `#10B981`, `#F59E0B`, `#EF4444`).
2. **Atomic Component Reuse**:
   - Never build ad-hoc buttons, cards, modals, or inputs in page views. Always import and extend primitives from `@/components/ui`.
3. **Motion with Intent**:
   - Every animation must indicate status, feedback, or spatial direction.
   - Use centralized spring curves and duration tokens from `@/motion`.
4. **Mandatory 5-State Coverage**:
   - Every telemetry view must handle: *Empty*, *Loading (Skeletons)*, *Success*, *Warning*, and *Error (with recovery action)*.
5. **Zero Generic Placeholders**:
   - Use authentic cybersecurity concepts: MITRE ATT&CK vectors, SHA-256 hashes, eBPF probes, TLS 1.3 telemetry, CIDR notations, and CVE IDs.
