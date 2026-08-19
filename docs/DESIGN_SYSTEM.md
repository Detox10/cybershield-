# CyberShield — Design System & Visual Specification

This document is the single source of truth for CyberShield's visual language, token architecture, color spectrum, elevation, typography, and state styling.

---

## 1. Color Palette & Dual-Theme Tokens

CyberShield employs a **Light-First Master Theme** alongside a high-tech **Dark Cyber Theme**.

### 1.1 Core Theme Tokens

| Token Category | Light Mode (Default) | Dark Mode | Role / Application |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `#FAFBFC` (Ultra-Clean Slate) | `#0F1419` / `#050811` (Deep Midnight) | Primary page background |
| **Card Background** | `rgba(255, 255, 255, 0.78)` | `rgba(26, 31, 46, 0.75)` | Glassmorphic containers |
| **Elevated Surface** | `#FFFFFF` (Pure White) | `#0E1526` (Muted Indigo/Navy) | Dropdowns, dialogs, popovers |
| **Primary Accent** | `#0EA5E9` (Sky 500) | `#38BDF8` (Sky 400 Glow) | CTAs, active pills, links |
| **Secondary Accent** | `#06B6D4` (Cyan 500) | `#22D3EE` (Cyan 400) | Secondary badges, telemetry lines |
| **Success / Secure** | `#10B981` (Emerald 500) | `#34D399` (Emerald 400) | Secure status, passing checks |
| **Warning** | `#F59E0B` (Amber 500) | `#FBBF24` (Amber 400) | Degraded states, suspicious logs |
| **Critical / Threat** | `#EF4444` (Red 500) | `#F87171` (Rose 400) | Active breaches, quarantined IPs |
| **Text Primary** | `#0F172A` (Slate 900) | `#F1F5F9` (Slate 100) | Headings, primary metrics |
| **Text Secondary** | `#475569` (Slate 600) | `#94A3B8` (Slate 400) | Subtitles, descriptions |
| **Text Muted** | `#64748B` (Slate 500) | `#64748B` (Slate 500) | Timestamps, hashes, monospaced logs |
| **Border Normal** | `rgba(226, 232, 240, 0.8)` | `rgba(255, 255, 255, 0.08)` | Standard card/divider borders |
| **Border Active** | `rgba(14, 165, 233, 0.4)` | `rgba(56, 189, 248, 0.4)` | Focused/active borders |

### 1.2 Aurora Spectrum Gradients
- **Aurora Primary**: `linear-gradient(135deg, #0EA5E9 0%, #06B6D4 35%, #14B8A6 70%, #A78BFA 100%)`
- **Aurora Subtle**: `linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(6, 182, 212, 0.08) 35%, rgba(20, 184, 166, 0.08) 70%, rgba(167, 139, 250, 0.08) 100%)`
- **Top Edge Ambient Glow**: `linear-gradient(90deg, transparent 0%, rgba(56, 189, 248, 0.4) 20%, rgba(45, 212, 191, 0.55) 50%, rgba(167, 139, 250, 0.4) 80%, transparent 100%)`

---

## 2. Typography Hierarchy

- **UI Sans**: `Inter`, `SF Pro Display`, `Outfit`, `system-ui`, `sans-serif`
- **Technical Mono**: `JetBrains Mono`, `Fira Code`, `ui-monospace`, `monospace`

| Type Role | Font Size | Weight | Line Height | Tracking |
| :--- | :--- | :--- | :--- | :--- |
| **Display Title** | `2.25rem` (36px) | 800 (ExtraBold) | 1.15 | `-0.03em` |
| **Section Heading (H1)** | `1.75rem` (28px) | 700 (Bold) | 1.25 | `-0.02em` |
| **Component Header (H2)** | `1.25rem` (20px) | 600 (SemiBold) | 1.3 | `-0.015em` |
| **Card Title (H3)** | `1.0rem` (16px) | 600 (SemiBold) | 1.4 | `-0.01em` |
| **Body (Regular)** | `0.875rem` (14px) | 400 (Regular) | 1.5 | `normal` |
| **Caption / Subtext** | `0.75rem` (12px) | 500 (Medium) | 1.4 | `+0.01em` |
| **Telemetry / Code** | `0.75rem` (12px) | 600 (SemiBold Mono) | 1.4 | `+0.04em` |

---

## 3. Border Radius & Spacing

### 3.1 Radii
- **`rounded-btn`**: `14px` (Buttons, inputs, icon wrappers)
- **`rounded-cardSm`**: `20px` (Inner sub-cards, pills, small modals)
- **`rounded-card`**: `24px` (Main cards, dialogs, sheets)
- **`rounded-full`**: `9999px` (Avatars, status indicator dots, pills)

### 3.2 Spacing Scale
- `p-1` (4px) / `p-2` (8px) / `p-3` (12px) / `p-4` (16px) / `p-6` (24px) / `p-8` (32px) / `p-10` (40px)

---

## 4. Elevation, Shadows & Glassmorphism

- **Glass Base (`.glass-card`)**:
  - Backdrop Blur: `14px`
  - Border: `1px solid var(--glass-border)`
  - Top highlight border line: `1.5px` animated gradient
- **Elevation 1**: `0 1px 3px rgba(0, 0, 0, 0.04)`
- **Elevation 2**: `0 4px 14px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.02)`
- **Elevation 3**: `0 10px 25px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.02)`
- **Elevation 4**: `0 20px 35px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -4px rgba(0, 0, 0, 0.03)`
- **Core Glow**: `0 0 50px -10px rgba(14, 165, 233, 0.35)`

---

## 5. Status Matrix Indicators

| Status | Color | Badge Background | Pulse Effect |
| :--- | :--- | :--- | :--- |
| **SECURE / HEALTHY** | `#10B981` | `rgba(16, 185, 129, 0.12)` | Emerald soft pulse |
| **SCANNING / ACTIVE** | `#0EA5E9` | `rgba(14, 165, 233, 0.12)` | Sky sweep pulse |
| **WARNING / SUSPICIOUS** | `#F59E0B` | `rgba(245, 158, 11, 0.12)` | Amber slow pulse |
| **CRITICAL / THREAT** | `#EF4444` | `rgba(239, 68, 68, 0.12)` | Crimson rapid pulse |
| **NEUTRAL / IDLE** | `#64748B` | `rgba(100, 116, 139, 0.12)` | Static dot |
