# Companion App Screens — Website Section Design
**Date:** 2026-04-21
**Status:** Approved

---

## Overview

Add a new website section between "Choose a Plan" and the Footer that showcases a redesigned Starlink companion app. The section presents three interactive phone-screen mockups as inline HTML — not static images — built directly in the design system of the main site.

The core metaphor: **the beam IS the interface.** Every screen uses the physical beam of light from dish to satellite as the primary UI element. Navigation, progress, and status are all expressed through that beam.

---

## Design System Tokens

These tokens apply consistently across all three screens:

| Token | Value |
|---|---|
| Background | `#020208` |
| Text | `#edf0e8` |
| Cyan | `#3ad9ff` / `#00BFCC` |
| CTA Yellow | `#E8E000` |
| Heading font | Bebas Neue |
| Body font | DM Sans |

---

## Website Section Layout

**Structure:** Two-column flex row, `min-height: 680px`, `padding: 100px 90px`.

- **Left column (copy):** Eyebrow label, Bebas Neue headline with cyan emphasis word, body paragraph, and a vertical screen-switcher list (3 items).
- **Right column (phone):** Single phone frame that swaps between the 3 screens based on switcher selection. The phone frame uses a dark `#0a0a12` background, subtle border `rgba(255,255,255,0.08)`, and `border-radius: 44px`.

**Auto-cycle:** Screens rotate every 5 seconds. A CSS `progress` animation on the active switcher item shows a cyan progress bar counting down to the next switch.

**Section background:** Two radial gradients — a deep-blue ellipse at 72% horizontal (behind the phone) and a dark-navy ellipse at 18% / 80% (bottom-left ambient light).

---

## Screen 1 — The Beam (Dashboard)

**Concept:** The animated beam of light from dish to satellite IS the speed/status indicator. No number badges, no list items. One glance = total understanding.

**Orbital Dock Navigation:**
- Four satellite dots spaced along a 210px arc at the top of the screen
- Labels: HOME · STATS · NETWORK · SETTINGS
- Active dot is cyan with a pulse ring; beam physically rotates to point at the active dot
- Tap a dot → beam rotates (CSS `transform: rotate`) to that satellite's orbital position

**Beam animation:**
- SVG `<path>` from dish base to active satellite dot
- 6–8 `<circle>` particles animated via `animateMotion` + `<mpath>` along the beam path
- Particle speed: 1.8s–2.6s, staggered `begin` offsets
- Beam has a glow blur filter (`feGaussianBlur stdDeviation="3"` + `feMerge`)

**Stats row (bottom):**
- Three metrics displayed: `348` Mbps download, `49` Mbps upload, `32` ms latency
- Values in Bebas Neue 28px, labels in DM Sans 8px uppercase tracking
- Subtle separator lines between metrics

**Stars:** ~20 background field stars at randomized positions, 0.4–0.8px radius, `twinkle` keyframe animation at different durations (2.8s–4.5s).

---

## Screen 2 — First Contact (Setup Flow)

**Concept:** A single vertical beam climbs upward through 5 labeled nodes (SETUP → POWER → CONNECT → CONFIGURE → FINISH), replacing the traditional stepper with a physical "signal ascending" metaphor.

**Beam path:** SVG `<line>` from bottom to top of phone. Particles animate upward along this vertical path.

**Nodes:**
- 5 circles along the beam, labeled to the right
- Completed nodes: filled cyan (`#3ad9ff`), white label
- Active node (CONNECT): pulsing ring animation (`animate r: 6;12;6`), brighter cyan fill, label in full white
- Pending nodes: unfilled circle outline, label at 35% opacity

**Active step label:** Large Bebas Neue text above beam showing `CONNECT` in cyan, with a sub-label `STEP 3 OF 5`.

**No hardware images.** The beam is the only graphic. Simplicity is the point.

---

## Screen 3 — Your Profile (Account)

**Concept:** Three distinct visual zones replace the generic account list. Name as hero. Usage as arc. Navigation as constellation.

### Zone 1 — Name Hero
- `VIKTOR` in Bebas Neue 38px, full opacity
- `HENDELMANN` in Bebas Neue 28px, `rgba(237,240,232,0.35)` — deliberately dimmer to create weight hierarchy
- Live indicator: 3px cyan dot + "ONLINE" label in 8px uppercase DM Sans
- Terminal ID: `VIKTOR-STARLINK` in 7px monospace, `rgba(58,217,255,0.35)`

### Zone 2 — Data Arc Ring
SVG circle ring, 152×152px:
- Track: `rgba(255,255,255,0.05)`, 7px stroke
- Fill arc: cyan→yellow `linearGradient`, starts at -90° (top), fills 61.4% of circumference (`stroke-dasharray: 239 390`)
- Center text: `614` in Bebas Neue 30px, `GB USED` in 9px, `OF 1 TB` in 9px at 15% opacity
- Endpoint pulse: animated circle at arc end (r: 3→6→3, opacity: 0.9→0.3→0.9, 2.4s loop) in yellow `#E8E000`

### Zone 3 — Constellation Navigation
Interactive SVG (252×112px, overflow visible) replacing the menu list.

**Star positions:**
| Label | cx | cy | Visual weight |
|---|---|---|---|
| MESSAGES | 52 | 22 | Medium (r 3.2) |
| ORDERS | 174 | 16 | Largest/brightest (r 4.2) |
| SHOP | 60 | 76 | Small (r 2.8) |
| STATEMENTS | 168 | 72 | Medium-small (r 3.0) |

**Constellation lines:**
- MESSAGES–ORDERS (`line-MO`): solid `rgba(255,255,255,0.1)`, 0.8px
- MESSAGES–SHOP (`line-MS`): solid `rgba(255,255,255,0.1)`, 0.8px
- ORDERS–STATEMENTS (`line-OS`): solid `rgba(255,255,255,0.1)`, 0.8px
- SHOP–STATEMENTS (`line-SS`): solid `rgba(255,255,255,0.1)`, 0.8px
- ORDERS–SHOP cross (`line-CX`): dashed `rgba(255,255,255,0.055)`, 0.6px, dasharray 1.5 4

**Interaction (JS):**
- Click a star → that star brightens to `rgba(255,255,255,0.98)` with `starBright` filter (feGaussianBlur 4.5 + merge)
- Glow halo appears: `rgba(58,217,255,0.14)` circle r=12
- Label brightens to `rgba(255,255,255,0.85)`
- Adjacent constellation lines turn cyan: `rgba(58,217,255,0.45)`
- Connected stars partially brighten (not fully selected)
- Click same star again → resets all to resting state (toggle off)
- `starLines` adjacency map drives which lines illuminate per star

**Background field stars:** ~15 non-interactive micro-circles at 0.3–0.7px radius scattered around the constellation for depth.

**Twinkle animation:** Each interactive star has a `twinkle-N` class (1–4) with different keyframe durations so they animate out of phase.

### Zone 4 — Sign Out
- Plain `SIGN OUT` text in 9px DM Sans, `rgba(237,240,232,0.22)`, centered below constellation
- No button chrome — just a text tap target

---

## Component Architecture (React/Next.js)

```
src/
  components/
    AppSection/
      AppSection.tsx          # Section wrapper, copy column, switcher
      AppSection.css          # Section-specific styles
      PhoneFrame.tsx          # Reusable phone chrome wrapper
      ScreenBeam.tsx          # Screen 1 — dashboard + orbital nav
      ScreenSetup.tsx         # Screen 2 — vertical beam setup
      ScreenAccount.tsx       # Screen 3 — profile + constellation
      ConstellationNav.tsx    # Isolated constellation SVG + JS logic
      DataArcRing.tsx         # Isolated arc ring SVG
      BeamParticles.tsx       # Reusable beam SVG with animateMotion
```

`AppSection.tsx` owns the `activeScreen` state (0/1/2) and the 5-second auto-cycle timer. It passes `isActive` to each screen; inactive screens use `display: none` (not unmounted) so animations don't reset mid-cycle.

`ConstellationNav.tsx` owns `selectedStar` state internally — it's a pure UI component with no external state dependency.

---

## Integration Point

In `src/app/page.tsx`, the new `<AppSection />` is inserted between the `plans` section and the `<Footer />`:

```tsx
<section id="plans">...</section>
<AppSection />
<Footer />
```

No changes to existing sections. No new routes.

---

## Animations Summary

| Element | Technique | Duration |
|---|---|---|
| Beam particles | SVG animateMotion + mpath | 1.8s–2.6s, infinite |
| Star twinkle | CSS @keyframes opacity | 2.8s–4.5s, infinite |
| Live dot pulse | SVG animate r + opacity | 2.0s, infinite |
| Arc endpoint pulse | SVG animate r + opacity | 2.4s, infinite |
| Constellation star active | Instant JS attribute change | — |
| Switcher progress bar | CSS @keyframes width 0→100% | 5s, resets on switch |
| Active nav dot | CSS box-shadow pulse | 1.8s, infinite |

All animations are CSS/SVG-native — no JavaScript animation loops, no `requestAnimationFrame`.

---

## Out of Scope

- Real data connectivity (speeds, usage %) — all values are static display data
- Actual app navigation (tapping a screen does not open the real Starlink app)
- Mobile responsiveness of this section beyond what the existing site already handles
- Dark/light mode toggle
