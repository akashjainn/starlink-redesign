# Starlink Redesign — Design Spec

**Date:** 2026-04-06  
**Approach:** C — Faithful to Figma + elevated micro-interactions  
**Target audience:** Adventurers, backpackers, RV campers  
**Stack:** Next.js 15, Tailwind v3, TypeScript

---

## Overview

Two pages — Home and Get Starlink — implemented pixel-faithfully from the Figma design (`W3MlDMf27oCK8DPDyoUg4M`). Both are single-viewport, no-scroll experiences. The Figma's static earth illustration is replaced by a live Spline 3D scene. The custom SVG logo replaces all Figma signal-icon asset URLs. Polish layer adds parallax, shimmer, and nav micro-interactions without changing layout.

---

## Design Tokens

These values are shared across both pages and defined in `globals.css`.

| Token | Value |
|---|---|
| Background | `radial-gradient(ellipse 75.6% 116.4% at 50% 50%, #F7F6F2 0%, #C4DEED 28.365%, #A8D0E6 77.885%, #8CC0BB 88.942%, #6FAF8F 100%)` |
| Font — headings/wordmark | Barlow 800 (`--font-barlow` via `next/font/google`) |
| Font — body/UI | Satoshi 400/500/700 (Fontshare CDN) |
| Text color | `#1a1a1a` |
| Cream | `#F7F6F2` |
| Accent green | `#87FF9D` (SVG logo accent) |
| Glass bg | `linear-gradient(to bottom, rgba(255,255,255,0.39), rgba(255,255,255,0.05))` |
| Glass border | `2px solid rgba(255,255,255,0.22)` |
| Glass blur | `backdrop-filter: blur(12.4px)` |
| Glass shadow | `0px 8px 38.8px rgba(0,0,0,0.12)` |
| Glass hover glow | `0 8px 40px rgba(111,175,143,0.25), 0 0 0 1px rgba(255,255,255,0.3)` |

---

## Assets

### Logo (`public/starlink-icon.svg`)
Copy `C:\Users\akash\Documents\school\junior\visual design\final\final starlink icon.svg` to `public/starlink-icon.svg`. Use as `<img>` tag or inline SVG in both pages. Never use Figma asset URLs for the logo — those expire.

### Spline Scene
- URL: `https://prod.spline.design/6PD9PObnUJ1TIrqE/scene.splinecode`
- Package: `@splinetool/react-spline` (import from `/next` subpath for SSR safety)
- Wrapper: `src/components/SplineScene.tsx` — `"use client"` directive, wraps `<Spline>` in `<Suspense>` with gradient-rect fallback matching the bg gradient
- Both pages use the same scene and same wrapper component

---

## Page 1 — Home (`src/app/page.tsx`)

### Layout (Figma canvas: 1512×982)

All positions converted to `vw`/`vh` or `clamp()` to be responsive.

| Element | Figma position | Responsive value |
|---|---|---|
| Logo row | left=90, top=60 | `left: 5.95vw`, `top: 6.1vh` |
| Hero h1 | left=90, top=176 | `left: 5.95vw`, `top: 17.92vh` |
| Subheading | left=90, top=358 | `marginTop: clamp(24px, 4.49vh, 44px)` |
| Nav links | left=90, top=469 | `marginTop: clamp(32px, 7.13vh, 70px)` |
| Spline | left=214, top=128, w=1408, h=725 | `left: 14.15vw`, `top: 13vh`, `width: 93.12vw`, `height: 73.83vh` |

### Elements

**Logo row** (top-left):
- `STARLINK` wordmark — Barlow 800, `clamp(36px, 4.23vw, 64px)`, `#1a1a1a`
- `<img src="/starlink-icon.svg">` — `clamp(60px, 7.74vw, 117px)` wide, `marginLeft: clamp(10px, 1.06vw, 16px)`

**Hero h1:**
- Text: "Stay connected. Wherever you go."
- Satoshi 700, `clamp(28px, 3.44vw, 52px)`, `lineHeight: 1.27`, `maxWidth: clamp(300px, 30.16vw, 456px)`

**Subheading:**
- Text: "Built for travelers, explorers, and life off the grid."
- Satoshi 400, `clamp(16px, 1.85vw, 28px)`, `lineHeight: 1.46`, `maxWidth: clamp(300px, 39.1vw, 591px)`

**Nav links** (three `<Link>` components):
- "Get Starlink" → `/get-starlink`
- "Learn More" → `#` (dead for now)
- "Q/A" → `#` (dead for now)
- Satoshi 500, `clamp(20px, 2.12vw, 32px)`, `lineHeight: 1.34`
- Gap between links: `clamp(8px, 1.32vw, 20px)`

**Spline earth** (behind all text, `z-index` lower than hero content):
- `<SplineScene>` component, absolutely positioned
- Mouse parallax: `onMouseMove` on `<main>` → translate Spline wrapper by `(mouseX - centerX) * 0.015` px on X and `(mouseY - centerY) * 0.015` px on Y, with `transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)`

### Animations (entrance, on mount)

| Class | Keyframe | Delay |
|---|---|---|
| `.anim-text` | `fade-slide-in` (opacity 0→1, translateX -28px→0) | 0s |
| `.anim-text-d1` | same | 0.12s |
| `.anim-text-d2` | same | 0.24s |
| `.anim-text-d3` | same | 0.36s |
| `.anim-globe` | `fade-scale-in` (opacity 0→1, scale 0.9→1) | 0.1s |

Duration: 0.8s, easing: `cubic-bezier(0.22, 1, 0.36, 1)`.

### Nav link micro-interaction
Existing `globals.css` uses `::after` for the underline. We switch it to `::before` so `::after` is free for the arrow:

```css
/* Underline — was ::after, now ::before */
.nav-link::before {
  content: '';
  position: absolute;
  bottom: -2px; left: 0;
  width: 0; height: 2px;
  background: #1a1a1a;
  transition: width 0.25s ease;
}
.nav-link:hover::before { width: 100%; }

/* Arrow reveal */
.nav-link::after {
  content: ' →';
  opacity: 0;
  display: inline-block;
  transform: translateX(-4px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.nav-link:hover { opacity: 0.7; transform: translateX(4px); }
.nav-link:hover::after { opacity: 0.6; transform: translateX(0); }
```

---

## Page 2 — Get Starlink (`src/app/get-starlink/page.tsx`)

`"use client"` — uses `useState` for address, `navigator.geolocation`.

### Layout

| Element | Figma position | Responsive value |
|---|---|---|
| "Get Starlink" title | left=90, top=60 | `left: 5.95vw`, `top: 6.1vh` |
| SVG icon | right=26px, top=31px | `right: clamp(16px, 1.72vw, 26px)`, `top: 3.16vh` |
| Glass card wrapper | left=83, top=211, w=682 | `left: 5.49vw`, `top: 21.49vh`, `width: clamp(340px, 45.11vw, 682px)` |
| Spline | same as home | same values |

### Glass card contents (inner offsets from card origin at 93px, 221px)

| Element | Figma offset | Value |
|---|---|---|
| Card h2 | left=135, top=253 → 42, 32 | `position: absolute; left: 42px; top: 32px` |
| Subtitle | left=135, top=323 → 42, 102 | `position: absolute; left: 42px; top: 102px` |
| Input | left=135, top=398 → 42, 177 | `position: absolute; left: 42px; top: 177px; width: clamp(240px, 24.87vw, 376px); height: 38px` |
| Location btn | below input | `marginTop: 14px` |
| CTA button | below location btn | `marginTop: 32px` |

**Card h2:** "Where will you use Starlink?" — Satoshi 500, `clamp(20px, 1.98vw, 30px)`, `#1a1a1a`  
**Subtitle:** "Enter your location to check availability and get started." — Satoshi 500, `clamp(14px, 1.32vw, 20px)`, `rgba(26,26,26,0.85)`  
**Input:** `glass-input` class, placeholder "Enter address", controlled with `address` state  
**Location button:** Pin SVG icon + "Use my current location" — triggers `navigator.geolocation.getCurrentPosition`  
**CTA:** "Check availability →" — `background: rgba(26,26,26,0.9)`, hover lifts `translateY(-1px)`, submits form (console.log for now)

### Glass card shimmer on hover
```css
.glass-card {
  transition: box-shadow 0.3s ease;
}
.glass-card:hover {
  box-shadow: 0 8px 40px rgba(111,175,143,0.25), 0 0 0 1px rgba(255,255,255,0.3);
}
```

Card entrance: slides in from left — `animation: fade-slide-in 0.8s cubic-bezier(0.22,1,0.36,1) 0.12s both`.

---

## Component: SplineScene (`src/components/SplineScene.tsx`)

```
"use client"
- Props: none (scene URL hardcoded)
- Renders <Suspense fallback={<div className="spline-fallback" />}>
            <Spline scene="https://prod.spline.design/6PD9PObnUJ1TIrqE/scene.splinecode" />
          </Suspense>
- .spline-fallback: same radial-gradient as hero-bg, full size, no content
```

The component is `"use client"` so it can be imported by both page.tsx files without breaking SSR. The page files themselves do NOT need `"use client"`.

---

## Responsive Breakpoints

**≤768px (tablet/mobile):**
- Spline: `left: -5vw; bottom: -5%; width: 140vw; opacity: 0.5` (bleeds behind content)
- Logo row and hero section: `left: 6vw; top: 4–5vh`
- Glass card: `left: 4vw; width: 90vw`
- Mouse parallax: naturally disabled on touch devices — `mousemove` never fires on mobile. The `onMouseMove` handler stays on `<main>` but has zero effect without a pointer device. No extra code needed.

---

## File Changes

| File | Action |
|---|---|
| `public/starlink-icon.svg` | Copy from user's school folder |
| `src/components/SplineScene.tsx` | Rewrite: `"use client"`, Spline + Suspense |
| `src/app/page.tsx` | Rewrite: mouse parallax, SVG logo, fresh layout |
| `src/app/get-starlink/page.tsx` | Rewrite: SVG logo, glass card shimmer |
| `src/app/globals.css` | Add `.glass-card:hover`, `.nav-link` micro-interaction, `.spline-fallback` |
| `package.json` | Ensure `@splinetool/react-spline` is installed |

---

## Out of Scope

- Learn More page (nav link → `#`)
- Q/A page (nav link → `#`)  
- "Check availability" backend / redirect (console.log stub)
- Pricing, hardware info, testimonials
