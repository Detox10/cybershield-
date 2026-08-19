# CyberShield — UI Layout & Component Guidelines

This document outlines structural patterns, layout grids, container hierarchies, responsive behaviors, and state handling rules.

---

## 1. Shell & Navigation Architecture

CyberShield utilizes a fixed desktop sidebar combined with a floating glass navigation pill on mobile devices:

```text
┌─────────────────┬────────────────────────────────────────────────────────┐
│                 │ [ Top Ambient Aurora Glow Bar ]                        │
│                 ├────────────────────────────────────────────────────────┤
│                 │                                                        │
│  Desktop        │  Main Scrollable Viewport                              │
│  Sidebar        │  - Active Tab Flows (Dashboard / Scan / Assistant /   │
│  (Fixed Left)   │    Threats / Diagnostics / Notifications)             │
│                 │                                                        │
│                 ├────────────────────────────────────────────────────────┤
│                 │ [ Universal Spotlight (Ctrl+K) & Modal Layer ]         │
└─────────────────┴────────────────────────────────────────────────────────┘
```

### 1.1 Sidebar Specifications
- **Width**: `240px` (Expanded) / `72px` (Condensed / Mobile Icon Mode)
- **Position**: Fixed left, height `100vh`, glassmorphic backdrop (`backdrop-blur-md`).
- **Interactive Elements**:
  - Logo + System Status indicator (Live Defcon status).
  - Navigation links with active glow pill (`.tab-active-glow`).
  - Theme toggle (Light/Dark mode transition `duration-500`).
  - Quick Spotlight Search trigger button (`Ctrl + K`).

### 1.2 Mobile Floating Pill Nav
- Displayed on viewports `< 768px`.
- Fixed bottom center (`bottom-5 inset-x-4`), rounded `rounded-full`, glassmorphic surface with tactile icons.

---

## 2. Card & Surface Architecture

Every surface must adhere to the standard Card anatomy:
1. **Header Slot**: Title, Subtitle / Category badge, Action button / Icon.
2. **Body Slot**: High-density data grid, radar, chart, or interactive stream.
3. **Footer Slot (Optional)**: Telemetry timestamp, quick audit action, or pagination.
4. **Visual Polish**:
   - `glass-card` class for blurred background.
   - Top aurora animated light highlight.
   - Soft hover elevation (`hover-elevate`).

---

## 3. Mandatory 5-State Handling Matrix

Every view and telemetry container must support all five operational lifecycle states:

1. **Empty State**:
   - Friendly domain icon (e.g. `ShieldCheck` or `SearchX`).
   - Clear headline: e.g. "No Active Breaches Detected".
   - Explanatory body text + immediate primary CTA (e.g. "Run Deep Diagnostics").
2. **Loading State**:
   - Content-shaped skeletons (`Skeleton.tsx`) with animated shimmer.
   - Never use full-screen blank spinners.
3. **Success State**:
   - Crisp confirmation badges, green emerald status lights, and animated checkmarks.
4. **Warning State**:
   - Amber alert callout with non-blocking dismiss and remediation action.
5. **Error State**:
   - Contextual error banner with human-readable diagnostic message and "Retry Diagnostics" button.

---

## 4. Responsive Breakpoint Strategy

| Breakpoint | Target Devices | Layout Adjustments |
| :--- | :--- | :--- |
| **Mobile (`< 640px`)** | Phones | 1-column stack, full-width cards, floating pill navigation, compact headers. |
| **Tablet (`640px - 1024px`)** | Tablets / Foldables | 2-column adaptive grid, sidebar condensed mode, scrollable telemetry tabs. |
| **Desktop (`1024px - 1440px`)** | Laptops / Monitors | Full multi-column dashboard, sticky navigation, side-by-side radar and feeds. |
| **Ultra-Wide (`> 1440px`)** | 2K / 4K Monitors | Constrained max-width `max-w-7xl`, centered alignment with ambient lighting diffusion. |

---

## 5. Keyboard Navigation & Shortcuts

- `Ctrl + K` / `Cmd + K`: Open Spotlight Command Palette
- `Ctrl + 1`: Switch to Dashboard
- `Ctrl + S`: Switch to Threat Scan
- `Ctrl + A`: Open AI Assistant
- `Ctrl + T`: Open Threat Analysis
- `Ctrl + D`: Open Device Diagnostics
- `Escape`: Close modals, drawers, or command palette
