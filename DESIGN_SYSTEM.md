# Enterprise SaaS Design System & Architecture Blueprint

This document serves as the formal specification and reference guide for the application's visual language, component hierarchy, theme tokens, state handling, and responsive behaviors.

---

## 1. Design System Foundations

### 1.1 Color Hierarchy & Dual-Theme Tokens (Light-First)

The primary interface experience is **Light Mode**, engineered with crisp contrast, clean borders, and subtle elevation, alongside an equally refined **Dark Mode**.

| Token Category | Light Mode (Primary) | Dark Mode (Secondary) | Role / Usage |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `#F8FAFC` (Slate 50) | `#050811` (Cyber Deep Navy) | Root surface container |
| **Card / Surface Background** | `#FFFFFF` (Pure White) | `#070B14` (Surface Navy) | Component containers & modals |
| **Elevated Surface** | `#F1F5F9` (Slate 100) | `#0E1526` (Muted Indigo/Navy) | Popovers, dropdowns, tooltips |
| **Primary Accent** | `#0284C7` (Sky 600) | `#00F0FF` (Neon Cyan) | Main CTAs, active highlights |
| **Secondary Accent** | `#0D9488` (Teal 600) | `#10B981` (Emerald Green) | Success metrics, secure nodes |
| **Warning Accent** | `#D97706` (Amber 600) | `#F59E0B` (Vibrant Amber) | Degraded states, warning flags |
| **Destructive Accent** | `#DC2626` (Rose 600) | `#F43F5E` (Crimson Rose) | Critical breaches, drop actions |
| **Primary Text** | `#0F172A` (Slate 900) | `#F8FAFC` (Slate 50) | Main headings & key telemetry |
| **Secondary Text** | `#475569` (Slate 600) | `#94A3B8` (Slate 400) | Subtitles, descriptions, captions |
| **Muted Text / Metadata** | `#64748B` (Slate 500) | `#64748B` (Slate 500) | Timestamps, hashes, monospaced logs |
| **Border / Dividers** | `#E2E8F0` (Slate 200) | `#1E293B` (Slate 800) | Card boundaries, table grids |

---

### 1.2 Typography Hierarchy

- **Primary Font Family**: Inter, SF Pro, or Outfit (`sans-serif`) for crisp, legible UI elements.
- **Monospace Family**: JetBrains Mono, Fira Code, or Roboto Mono (`monospace`) for IP addresses, cryptographic hashes, timestamps, and terminal commands.

| Role | Font Size | Weight | Line Height | Tracking |
| :--- | :--- | :--- | :--- | :--- |
| **Display / H1** | `2.25rem` (36px) - `3.0rem` (48px) | 800 (ExtraBold) | 1.15 | `-0.025em` |
| **Section Headings / H2** | `1.5rem` (24px) - `1.875rem` (30px) | 700 (Bold) | 1.25 | `-0.02em` |
| **Card Titles / H3** | `1.125rem` (18px) - `1.25rem` (20px) | 600 (SemiBold) | 1.35 | `-0.01em` |
| **Body / Standard** | `0.875rem` (14px) - `1.0rem` (16px) | 400 (Regular) | 1.5 | `normal` |
| **Metadata / Badges** | `0.75rem` (12px) - `0.8125rem` (13px) | 500 (Medium) | 1.4 | `+0.02em` |
| **Technical Telemetry** | `0.6875rem` (11px) - `0.75rem` (12px) | 600 (SemiBold Mono) | 1.4 | `+0.05em` |

---

### 1.3 Elevation, Shadows & Depth

- **Light Mode Elevation**: Soft multi-layered ambient diffusion (`box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 8px 24px -4px rgba(15,23,42,0.08)`).
- **Dark Mode Elevation**: Subtle inset lighting, edge border highlights (`rgba(255,255,255,0.08)`), and soft radial backdrop glows.

---

### 1.4 Purposeful Motion & Micro-Interactions

Every animation serves a distinct user feedback or spatial orientation function:
- **State Transitions**: `150ms - 200ms ease-out` for hover states, button presses, and tab switches.
- **Drawer / Modal Ingress**: `250ms cubic-bezier(0.16, 1, 0.3, 1)` to prevent layout jarring.
- **Pulsing Status Indicators**: Subtly timed (`2s - 3s ease-in-out infinite`) to indicate live telemetry without causing visual distraction.

---

## 2. Reusable Component Inventory

Every screen builds upon unified, composable primitives:

1. **Button Suite**:
   - `Primary`: High-contrast accent fill with hover scale (`active:scale-[0.98]`).
   - `Secondary / Outline`: Clean border with soft background hover.
   - `Destructive`: Clear red/rose indicator for high-risk actions.
   - `Ghost / Icon`: Low visual weight for auxiliary actions.
2. **Data Presentation**:
   - `Metric Card`: Title, primary scalar value, trend indicator (+/-%), subtext.
   - `Badge / Pill`: Status indicator with standardized severity colors (Critical, High, Medium, Low, Success).
   - `Table & Virtualized Lists`: Sticky headers, sorting controls, monospaced data alignment.
3. **Inputs & Modals**:
   - Accessible keyboard navigation, clear focus rings (`ring-2 ring-offset-2`), floating or aligned labels, integrated validation errors.

---

## 3. Mandatory Five-State Coverage Matrix

Every major feature or view is designed to handle all 5 operational lifecycle states:

```
┌─────────────┐     Fetch Trigger     ┌──────────────┐
│ Empty State │ ────────────────────> │ Loading View │
└─────────────┘                       └──────┬───────┘
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
               ┌───────────────┐                           ┌───────────────┐
               │ Success State │                           │  Error State  │
               └───────┬───────┘                           └───────────────┘
                       │ Anomaly / Alert
                       ▼
               ┌───────────────┐
               │ Warning State │
               └───────────────┘
```

1. **Empty State**: Friendly illustration/icon, clear explanation of why it's empty, and an immediate primary action to populate or start.
2. **Loading State**: Content-shaped skeleton loaders rather than generic full-page spinners to avoid layout shifts.
3. **Success State**: Clear confirmation toast, banner, or badge with unambiguous feedback.
4. **Warning State**: Non-blocking alert banner with actionable remediation links.
5. **Error State**: Context-aware error message with automatic retry trigger and diagnostic copy.

---

## 4. Responsive Viewport Strategy

| Breakpoint | Target Devices | Layout Behavior |
| :--- | :--- | :--- |
| **Mobile (`< 640px`)** | iOS / Android phones | Single-column stack, bottom navigation/drawers, touch targets $\ge 44\text{px}$. |
| **Tablet (`640px - 1024px`)** | iPads, foldables | 2-column adaptive grid, collapsible sidebar, condensed data tables. |
| **Desktop (`1024px - 1440px`)** | Standard laptops, monitors | Full multi-column dashboard, sticky navigation, side-by-side telemetry panels. |
| **Ultra-Wide (`> 1440px`)** | 4K & wide monitors | Max-width constraint (`1280px` - `1440px`) with centered canvas and optional peripheral widgets. |

---

## 5. Domain-Accurate Content Guidelines

- **Strictly No Placeholders**: Avoid "Lorem Ipsum", "Sample User", or "Test Item 123".
- **Domain Authenticity**: Use realistic network protocols (`TLS 1.3`, `HTTP/2 Multiplex`, `eBPF`), genuine geographic node designations (`Frankfurt PoP-04`, `Tokyo Edge-01`), and plausible attack signatures.
- **Enterprise / Accessible Tone**: Professional terminology suitable for CISOs, devops engineers, and cybersecurity students alike.
