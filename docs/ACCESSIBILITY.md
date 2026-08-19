# CyberShield — Accessibility Standards (WCAG 2.1 AA)

CyberShield is built to ensure full accessibility, keyboard navigability, and screen reader compatibility across all views.

---

## 1. Color Contrast Standards

- **Normal Text**: Minimum contrast ratio of **4.5:1** against the background.
- **Large Text / Headings**: Minimum contrast ratio of **3:1**.
- **Interactive Elements & Icons**: Minimum contrast ratio of **3:1** against adjacent background colors.
- **Status Colors**: Critical red, warning amber, and secure emerald colors are paired with explicit icons, labels, and text badges so color is never the sole conveyor of information.

---

## 2. Keyboard Navigation & Focus Management

- **Global Shortcuts**:
  - `Ctrl + K` / `Cmd + K`: Spotlight command launcher.
  - `Ctrl + 1`: Navigate to Dashboard.
  - `Ctrl + S`: Navigate to Scan Flow.
  - `Ctrl + A`: Navigate to AI Assistant.
  - `Ctrl + T`: Navigate to Threat Analysis.
  - `Ctrl + D`: Navigate to Device Diagnostics.
  - `Escape`: Dismiss open modals, popovers, and drawers.
- **Focus Rings**: Standardized high-visibility focus ring (`focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2`).
- **Focus Trapping**: Modals and dialogs trap keyboard focus while open and restore focus to trigger buttons upon dismissal.

---

## 3. ARIA Semantics & Screen Readers

- All interactive buttons have explicit `aria-label` or visible text.
- Live telemetry streams use `aria-live="polite"` for non-disruptive announcements of background security checks.
- Modals use `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`.
- Radar blips and charts provide textual descriptions and data table fallbacks.

---

## 4. Reduced Motion Support

All animations in `src/motion/` verify `prefers-reduced-motion`. When reduced motion is requested by the OS:
- Transform animations collapse to immediate values.
- Complex multi-stage spring transitions gracefully fall back to simple opacity fades.
