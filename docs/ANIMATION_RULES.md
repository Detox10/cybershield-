# CyberShield — Animation Rules & Implementation Best Practices

This document provides strict implementation rules for developers and AI agents creating animations within CyberShield.

---

## 1. Golden Rules of Motion

1. **Import from `@/motion`**:
   - Never write arbitrary inline spring or duration magic numbers. Always import from `@/motion` (e.g. `durations`, `easings`, `springs`, `staggerContainerVariants`).
2. **GPU Acceleration Only**:
   - Animate only `transform` (`scale`, `x`, `y`, `rotate`) and `opacity`.
   - Never animate layout properties like `width`, `height`, `margin`, or `padding` directly when `transform` can achieve the same effect.
3. **Keep Durations Snappy**:
   - Interactive UI elements must respond in $\le 200\text{ms}$.
   - Complex informational card reveals must not exceed $350\text{ms}$.
4. **AnimatePresence with Unique Keys**:
   - Always supply stable, unique keys (`key={item.id}`) when using `AnimatePresence`.
   - Use `mode="wait"` for view/tab replacements to avoid content collision.

---

## 2. Micro-Interactions Standard

### Buttons & Interactive Badges
```tsx
<motion.button
  whileHover={{ y: -1.5 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
>
  ...
</motion.button>
```

### Elevated Cards
```tsx
<motion.div
  whileHover={{ y: -2.5 }}
  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
  className="glass-card"
>
  ...
</motion.div>
```

---

## 3. Performance & Accessibility Guardrails

- **Will-Change Strategy**: Apply `will-change: transform` only during active animation, or rely on Framer Motion's built-in GPU layer promotion.
- **Reduced Motion Support**: Ensure elements gracefully fall back to simple opacity fades if the user's OS has `prefers-reduced-motion` enabled.
- **No Layout Thrashing**: Batch state updates and avoid reading DOM geometry during animation loops.
