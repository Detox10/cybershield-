# CyberShield — Motion & Animation System

This document outlines the motion principles, duration scales, easing curves, transition patterns, and physics configurations across CyberShield.

---

## 1. Core Motion Philosophy

1. **Purposeful Feedback**: Every motion communicates system state (e.g. Scanning, Threat Alert, Secure, Containment).
2. **Spatial Continuity**: Modals, tabs, and drawers animate along their logical axis to preserve mental model orientation.
3. **High Performance**: Use hardware-accelerated properties (`transform`, `opacity`, `filter`). Target solid 60fps.
4. **Reduced Motion Respect**: Always respect `prefers-reduced-motion: reduce`.

---

## 2. Timing Tokens & Duration Scale

| Token | Milliseconds | Seconds | Typical Use Case |
| :--- | :--- | :--- | :--- |
| **`instant`** | `50ms` | `0.05s` | Micro-press, tactile feedback |
| **`fast`** | `150ms` | `0.15s` | Hover states, button clicks, tooltip reveals |
| **`normal`** | `250ms` | `0.25s` | Tab switches, card reveals, dropdowns |
| **`medium`** | `350ms` | `0.35s` | Modal ingress/egress, drawer slide |
| **`slow`** | `500ms` | `0.5s` | Complex page transition, theme change |
| **`ambient`** | `2000ms+` | `2.0s+` | Breathing shield glow, radar sweep, ambient aura |

---

## 3. Easing & Spring Physics

### 3.1 Standard Curves
- **Smooth Decelerate (`easeOutSmooth`)**: `[0.16, 1, 0.3, 1]` (Natural UI entrances)
- **Sharp Accelerate (`easeInSharp`)**: `[0.4, 0, 1, 1]` (Quick UI exits)
- **Fluid Standard (`easeInOutFluid`)**: `[0.4, 0, 0.2, 1]` (Theme toggle, size changes)

### 3.2 Spring Physics Presets
- **Snappy Spring**: `{ type: "spring", stiffness: 400, damping: 30 }` (Buttons, pills, badges)
- **Smooth Spring**: `{ type: "spring", stiffness: 260, damping: 25 }` (Modals, cards, sidebar)
- **Bouncy Spring**: `{ type: "spring", stiffness: 300, damping: 15 }` (Status indicators, success checks)

---

## 4. Key Animation Patterns

### 4.1 Page & Tab Transitions
- Directional subtle fade + vertical lift (`initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 }`).
- Mode: `mode="wait"` in `<AnimatePresence>`.

### 4.2 Staggered Container
- Container: `transition: { staggerChildren: 0.05, delayChildren: 0.02 }`
- Children: `variants: { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }`

### 4.3 Radar & Threat Telemetry
- Radar sweep: Continuous 360 rotation `spin-slow` (12s linear infinite).
- Threat blips: Expanding ripple effect with fading opacity.

### 4.4 Shimmer Skeleton
- Horizontal continuous highlight gradient sweep over 1.6s.
