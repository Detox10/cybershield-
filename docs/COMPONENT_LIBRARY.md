# CyberShield — Component Library Specification

This document catalogs all reusable atomic and composite components available in `src/components/ui/` and their respective API contracts.

---

## 1. Atomic UI Primitives (`@/components/ui`)

### 1.1 Button (`Button.tsx`)
- **Variants**: `primary`, `secondary`, `destructive`, `outline`, `ghost`, `glow`
- **Sizes**: `sm` (h-8), `md` (h-10), `lg` (h-12), `icon` (h-10 w-10)
- **Features**: Motion hover/tap built-in, loading spinner state, left/right icon slots.

### 1.2 Card (`Card.tsx`)
- **Subcomponents**: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- **Variants**: `glass` (default glassmorphism), `elevated`, `outlined`, `interactive` (hover lift).

### 1.3 Input & Search (`Input.tsx`, `Search.tsx`)
- **Features**: Leading/trailing icon slots, clear button, error state ring, keyboard shortcut badge (`Ctrl+K`).

### 1.4 Badge (`Badge.tsx`)
- **Variants**: `secure` (green), `warning` (amber), `critical` (red), `sky` (blue), `neutral` (slate), `purple`
- **Features**: Optional glowing pulsing ping dot, icon slot.

### 1.5 Modal & Dialog (`Modal.tsx`, `Dialog.tsx`)
- **Features**: Backdrop blur, smooth spring entrance, accessible ESC key handling, focus retention.

### 1.6 Tooltip (`Tooltip.tsx`)
- **Features**: Floating hover tooltip with glassmorphic styling and directional placement.

### 1.7 Avatar (`Avatar.tsx`)
- **Features**: Image or initials fallback, live active/idle status badge dot.

### 1.8 Skeleton (`Skeleton.tsx`)
- **Features**: Content-shaped shimmer placeholder for smooth loading state handling.

### 1.9 Notification (`Notification.tsx`)
- **Variants**: `info`, `success`, `warning`, `error`
- **Features**: Integrated icon, dismiss button, optional action CTA.

---

## 2. Cyber Domain Components

### 2.1 ShieldCore (`ShieldCore.tsx`)
- **States**: `IDLE`, `SCANNING`, `SECURE`, `WARNING`, `THREAT`
- **Visual**: Glowing concentric geometric shields with animated SVG paths and status-driven colors.

### 2.2 Timeline (`Timeline.tsx`)
- **Features**: Vertical audit & threat incident timeline with color-coded nodes and expandable details.

### 2.3 Chart (`Chart.tsx`)
- **Features**: Minimalistic SVG sparklines, telemetry metric bars, and health gauge rings.

### 2.4 Hero (`Hero.tsx`)
- **Features**: Security posture summary, DEFCON status badge, quick threat scan button, and live uptime counter.
