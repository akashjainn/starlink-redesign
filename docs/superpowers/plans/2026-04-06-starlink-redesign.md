# Starlink Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement both Figma pages (Home + Get Starlink) faithfully with a live Spline 3D earth scene, the custom SVG logo, and elevated micro-interactions (mouse parallax, nav hover animations, glass card shimmer).

**Architecture:** Two Next.js App Router pages share a single `SplineScene` client component that renders the Spline 3D scene with a gradient fallback via Suspense. CSS micro-interactions live in `globals.css`. Both pages use absolute positioning derived from the Figma canvas (1512×982), converted to `vw`/`vh`/`clamp()` values.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind v3, `@splinetool/react-spline@^4.1.0` (already installed)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `public/starlink-icon.svg` | Create (copy) | Custom SVG logo served statically |
| `src/app/globals.css` | Modify | Add `.spline-fallback`, `.spline-parallax`, update `.nav-link` pseudo-elements, add `.glass-card:hover` shimmer |
| `src/components/SplineScene.tsx` | Rewrite | `"use client"` Spline wrapper with Suspense fallback |
| `src/app/page.tsx` | Rewrite | Home hero: mouse parallax, STARLINK wordmark + SVG logo, Spline earth, staggered nav |
| `src/app/get-starlink/page.tsx` | Rewrite | Get Starlink: Spline earth, SVG icon top-right, glass card with form |

---

## Task 1: Copy SVG Logo to Public

**Files:**
- Create: `public/starlink-icon.svg`

- [ ] **Step 1: Copy the SVG file**

In the terminal (not Claude Code's tools — this is a file copy):
```bash
cp "C:/Users/akash/Documents/school/junior/visual design/final/final starlink icon.svg" \
   "C:/Users/akash/Documents/starlink redesign/starlink-redesign/public/starlink-icon.svg"
```

- [ ] **Step 2: Verify the file is accessible**

Start the dev server if not running:
```bash
cd "C:/Users/akash/Documents/starlink redesign/starlink-redesign"
npm run dev
```

Open `http://localhost:3000/starlink-icon.svg` in the browser. You should see the Starlink signal icon SVG render directly. It has two paths — one black (#1A1A1A) and one green (#87FF9D).

- [ ] **Step 3: Commit**

```bash
git -C "C:/Users/akash/Documents/starlink redesign/starlink-redesign" add public/starlink-icon.svg
git -C "C:/Users/akash/Documents/starlink redesign/starlink-redesign" commit -m "feat: add custom SVG logo to public/"
```

---

## Task 2: Update globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace the `.nav-link` block**

Find and replace the entire `.nav-link` section (currently lines ~81–107 in globals.css). Replace with:

```css
/* ─── Nav link micro-interaction ───────────────────────────────────── */
.nav-link {
  position: relative;
  display: inline-block;
  color: #1a1a1a;
  text-decoration: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

/* Underline draws from left — uses ::before so ::after is free for arrow */
.nav-link::before {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: #1a1a1a;
  transition: width 0.25s ease;
}

.nav-link:hover::before {
  width: 100%;
}

/* Arrow reveals and slides in on hover */
.nav-link::after {
  content: ' →';
  opacity: 0;
  display: inline-block;
  transform: translateX(-4px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.nav-link:hover {
  opacity: 0.7;
  transform: translateX(4px);
}

.nav-link:hover::after {
  opacity: 0.6;
  transform: translateX(0);
}
```

- [ ] **Step 2: Add `.glass-card` transition and hover shimmer**

Find the existing `.glass-card` block and add `transition: box-shadow 0.3s ease;` to it, then append the hover rule after the closing brace:

```css
/* existing .glass-card block — add this property inside it: */
  transition: box-shadow 0.3s ease;

/* new rule after the block: */
.glass-card:hover {
  box-shadow:
    0px 8px 38.8px 0px rgba(0, 0, 0, 0.12),
    0 8px 40px rgba(111, 175, 143, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.3);
}
```

- [ ] **Step 3: Append new utility classes at the end of the file**

```css
/* ─── Spline fallback (shown while 3D scene loads) ─────────────────── */
.spline-fallback {
  width: 100%;
  height: 100%;
  background: radial-gradient(
    ellipse 75.6% 116.4% at 50% 50%,
    #F7F6F2 0%,
    #C4DEED 28.365%,
    #A8D0E6 77.885%,
    #8CC0BB 88.942%,
    #6FAF8F 100%
  );
}

/* ─── Spline parallax wrapper ───────────────────────────────────────── */
.spline-parallax {
  transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

- [ ] **Step 4: Verify visually**

With dev server running, open `http://localhost:3000`. Hover over "Get Starlink" nav link — it should slide right 4px and reveal " →". The underline should draw from left to right. No layout shifts.

- [ ] **Step 5: Commit**

```bash
git -C "C:/Users/akash/Documents/starlink redesign/starlink-redesign" add src/app/globals.css
git -C "C:/Users/akash/Documents/starlink redesign/starlink-redesign" commit -m "style: update nav-link micro-interactions, glass card shimmer, Spline utility classes"
```

---

## Task 3: Rewrite SplineScene Component

**Files:**
- Modify: `src/components/SplineScene.tsx`

- [ ] **Step 1: Rewrite the file**

Replace the entire contents of `src/components/SplineScene.tsx` with:

```tsx
"use client";

import Spline from "@splinetool/react-spline/next";
import { Suspense } from "react";

function SplineFallback() {
  return <div className="spline-fallback" aria-hidden="true" />;
}

export default function SplineScene() {
  return (
    <Suspense fallback={<SplineFallback />}>
      <Spline
        scene="https://prod.spline.design/6PD9PObnUJ1TIrqE/scene.splinecode"
        style={{ width: "100%", height: "100%" }}
      />
    </Suspense>
  );
}
```

- [ ] **Step 2: Verify**

Open `http://localhost:3000`. The home page should show:
- While loading: a soft gradient rectangle in the earth's position
- After load (~2–4s on first visit): the live interactive Spline earth + satellite

If you see a blank white rectangle instead of the gradient fallback, check that `.spline-fallback` was added to `globals.css` in Task 2.

If you see an error about `@splinetool/react-spline/next` not found, run:
```bash
npm install @splinetool/react-spline@latest
```
(The installed v4.1.0 already has the `/next` subpath — this should not be needed.)

- [ ] **Step 3: Commit**

```bash
git -C "C:/Users/akash/Documents/starlink redesign/starlink-redesign" add src/components/SplineScene.tsx
git -C "C:/Users/akash/Documents/starlink redesign/starlink-redesign" commit -m "feat: rewrite SplineScene with Suspense fallback and /next SSR-safe import"
```

---

## Task 4: Rewrite Home Page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Rewrite the file**

Replace the entire contents of `src/app/page.tsx` with:

```tsx
"use client";

import Link from "next/link";
import { useRef, useCallback } from "react";
import SplineScene from "@/components/SplineScene";

export default function HomePage() {
  const splineWrapRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width / 2) * 0.015;
      const dy = (e.clientY - rect.top - rect.height / 2) * 0.015;
      if (splineWrapRef.current) {
        splineWrapRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
      }
    },
    []
  );

  return (
    <main
      className="hero-bg relative w-full overflow-hidden"
      style={{ minHeight: "100dvh" }}
      onMouseMove={handleMouseMove}
    >
      {/* ── Spline earth + satellite ─────────────────────────────────────
          Figma canvas: 1512 × 982
          Figma node:   left=214 top=128 w=1408 h=725
          Converted:    14.15vw / 13vh / 93.12vw / 73.83vh              */}
      <div
        ref={splineWrapRef}
        aria-hidden="true"
        className="pointer-events-none absolute anim-globe globe-wrap spline-parallax"
        style={{
          left: "14.15vw",
          top: "13vh",
          width: "93.12vw",
          height: "73.83vh",
        }}
      >
        <SplineScene />
      </div>

      {/* ── STARLINK wordmark + custom signal icon ───────────────────────
          Figma: left=90, top=60                                         */}
      <div
        className="absolute flex items-center anim-text hero-logo-row"
        style={{ left: "5.95vw", top: "6.1vh" }}
      >
        <span
          style={{
            fontFamily:
              "var(--font-barlow), 'Arial Black', 'Trebuchet MS', sans-serif",
            fontSize: "clamp(36px, 4.23vw, 64px)",
            fontWeight: 800,
            letterSpacing: "-0.5px",
            color: "#000",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          STARLINK
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/starlink-icon.svg"
          alt="Starlink signal icon"
          style={{
            marginLeft: "clamp(10px, 1.06vw, 16px)",
            width: "clamp(60px, 7.74vw, 117px)",
            height: "auto",
          }}
        />
      </div>

      {/* ── Hero content ─────────────────────────────────────────────────
          Figma: h1 left=90, top=176 → 5.95vw / 17.92vh
          Subheading: top=358 → 44px gap after h1
          Nav: top=469 → 70px gap after subheading                      */}
      <section
        className="absolute flex flex-col hero-left"
        style={{ left: "5.95vw", top: "17.92vh" }}
        aria-label="Hero"
      >
        <h1
          className="anim-text-d1"
          style={{
            fontFamily: "Satoshi, 'DM Sans', 'Inter', sans-serif",
            fontSize: "clamp(28px, 3.44vw, 52px)",
            fontWeight: 700,
            lineHeight: 1.27,
            color: "#000",
            maxWidth: "clamp(300px, 30.16vw, 456px)",
          }}
        >
          Stay connected.
          <br />
          Wherever you go.
        </h1>

        <p
          className="anim-text-d2"
          style={{
            fontFamily: "Satoshi, 'DM Sans', 'Inter', sans-serif",
            fontSize: "clamp(16px, 1.85vw, 28px)",
            fontWeight: 400,
            color: "#000",
            maxWidth: "clamp(300px, 39.1vw, 591px)",
            marginTop: "clamp(24px, 4.49vh, 44px)",
            lineHeight: 1.46,
          }}
        >
          Built for travelers, explorers, and life off the grid.
        </p>

        <nav
          className="flex flex-col anim-text-d3"
          style={{ marginTop: "clamp(32px, 7.13vh, 70px)" }}
          aria-label="Primary"
        >
          {[
            { label: "Get Starlink", href: "/get-starlink" },
            { label: "Learn More",   href: "#"             },
            { label: "Q/A",          href: "#"             },
          ].map(({ label, href }, i) => (
            <Link
              key={label}
              href={href}
              className="nav-link"
              style={{
                fontFamily: "Satoshi, 'DM Sans', 'Inter', sans-serif",
                fontSize: "clamp(20px, 2.12vw, 32px)",
                fontWeight: 500,
                lineHeight: 1.34,
                marginTop: i === 0 ? 0 : "clamp(8px, 1.32vw, 20px)",
              }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Verify**

Open `http://localhost:3000`. Check:
- [ ] Gradient background (cream center → teal/green edges)
- [ ] STARLINK wordmark top-left with the custom green+black SVG icon next to it
- [ ] Spline earth visible right-of-center (may take a few seconds to load; gradient fallback shows while loading)
- [ ] "Stay connected. Wherever you go." heading, subheading, and three nav links stagger in from the left
- [ ] Move the mouse — the earth should drift subtly following the cursor (max ~8px movement at screen edge)
- [ ] Hover "Get Starlink" — it slides right, underline draws, " →" fades in
- [ ] Click "Get Starlink" — navigates to `/get-starlink`

- [ ] **Step 3: Commit**

```bash
git -C "C:/Users/akash/Documents/starlink redesign/starlink-redesign" add src/app/page.tsx
git -C "C:/Users/akash/Documents/starlink redesign/starlink-redesign" commit -m "feat: rewrite home page — Spline earth, SVG logo, mouse parallax, nav micro-interactions"
```

---

## Task 5: Rewrite Get Starlink Page

**Files:**
- Modify: `src/app/get-starlink/page.tsx`

- [ ] **Step 1: Rewrite the file**

Replace the entire contents of `src/app/get-starlink/page.tsx` with:

```tsx
"use client";

import { useState } from "react";
import SplineScene from "@/components/SplineScene";

export default function GetStarlinkPage() {
  const [address, setAddress] = useState("");

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setAddress(
        `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
      );
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Checking availability for:", address);
  }

  return (
    <main
      className="hero-bg relative w-full overflow-hidden"
      style={{ minHeight: "100dvh" }}
    >
      {/* ── Spline earth — same scene, earth bleeds behind card ──────────
          Figma: left=214 top=128 w=1408 h=725 on 1512×982 canvas       */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute anim-globe globe-wrap"
        style={{
          left: "14.15vw",
          top: "13vh",
          width: "93.12vw",
          height: "73.83vh",
        }}
      >
        <SplineScene />
      </div>

      {/* ── "Get Starlink" page title — Figma: left=90, top=60 ─────────── */}
      <h1
        className="absolute anim-text"
        style={{
          left: "5.95vw",
          top: "6.1vh",
          fontFamily:
            "var(--font-barlow), 'Arial Black', 'Trebuchet MS', sans-serif",
          fontSize: "clamp(36px, 4.23vw, 64px)",
          fontWeight: 800,
          letterSpacing: "-0.5px",
          color: "#000",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        Get Starlink
      </h1>

      {/* ── Signal icon top-right — Figma: right=26px, top=31px ────────── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/starlink-icon.svg"
        alt="Starlink signal icon"
        className="absolute anim-text"
        style={{
          right: "clamp(16px, 1.72vw, 26px)",
          top: "3.16vh",
          width: "clamp(60px, 7.74vw, 117px)",
          height: "auto",
          opacity: 0.9,
        }}
      />

      {/* ── Glass card ───────────────────────────────────────────────────
          Figma: outer wrapper left=83, top=211, w=682, padding=10px
          Inner glass panel: h=587                                       */}
      <section
        className="absolute anim-text-d1 gs-card-wrap"
        style={{
          left: "5.49vw",
          top: "21.49vh",
          width: "clamp(340px, 45.11vw, 682px)",
          padding: 10,
        }}
      >
        <div
          className="glass-card"
          style={{ height: 587, position: "relative" }}
        >
          {/* Card heading — Figma: Satoshi Medium 30px, offset 42, 32 from card */}
          <h2
            style={{
              fontFamily: "Satoshi, 'DM Sans', 'Inter', sans-serif",
              fontSize: "clamp(20px, 1.98vw, 30px)",
              fontWeight: 500,
              color: "#1a1a1a",
              position: "absolute",
              left: 42,
              top: 32,
              maxWidth: "80%",
              lineHeight: 1.3,
            }}
          >
            Where will you use Starlink?
          </h2>

          {/* Subtitle — Figma: Satoshi Medium 20px, offset 42, 102 */}
          <p
            style={{
              fontFamily: "Satoshi, 'DM Sans', 'Inter', sans-serif",
              fontSize: "clamp(14px, 1.32vw, 20px)",
              fontWeight: 500,
              color: "rgba(26, 26, 26, 0.85)",
              position: "absolute",
              left: 42,
              top: 102,
              maxWidth: "85%",
              lineHeight: 1.5,
            }}
          >
            Enter your location to check availability and get started.
          </p>

          {/* Form — Figma: input offset 42, 177 from card */}
          <form
            onSubmit={handleSubmit}
            style={{ position: "absolute", left: 42, top: 177 }}
          >
            <input
              className="glass-input"
              type="text"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{
                fontFamily: "Satoshi, 'DM Sans', 'Inter', sans-serif",
                fontSize: "clamp(14px, 1.32vw, 20px)",
                fontWeight: 500,
                color: "rgba(26, 26, 26, 0.85)",
                width: "clamp(240px, 24.87vw, 376px)",
                height: 38,
                padding: "0 16px",
                display: "block",
              }}
            />

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 14,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontFamily: "Satoshi, 'DM Sans', 'Inter', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: "rgba(26, 26, 26, 0.85)",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.opacity = "0.6")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.opacity = "1")
              }
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="rgba(26,26,26,0.75)"
                aria-hidden="true"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              Use my current location
            </button>

            <button
              type="submit"
              style={{
                marginTop: 32,
                padding: "12px 28px",
                background: "rgba(26, 26, 26, 0.9)",
                color: "#F7F6F2",
                border: "none",
                borderRadius: 8,
                fontFamily: "Satoshi, 'DM Sans', 'Inter', sans-serif",
                fontSize: 16,
                fontWeight: 500,
                cursor: "pointer",
                transition: "background 0.2s ease, transform 0.15s ease",
                display: "block",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(26,26,26,1)";
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(26,26,26,0.9)";
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(0)";
              }}
            >
              Check availability →
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Verify**

Open `http://localhost:3000/get-starlink`. Check:
- [ ] Same gradient background as home
- [ ] "Get Starlink" wordmark top-left
- [ ] Custom SVG icon top-right (same icon, ~60–117px wide)
- [ ] Spline earth visible right-of-center, bleeding behind the glass card
- [ ] Glass card slides in from the left on load
- [ ] Hover the glass card — it should get a soft green glow (`rgba(111,175,143,0.25)`)
- [ ] Type into the address input — text renders correctly
- [ ] Click "Use my current location" — browser asks for location permission; if granted, coordinates populate the input
- [ ] Click "Check availability →" — check browser console for `Checking availability for: <address>`
- [ ] Hover the CTA button — it lifts up 1px and darkens slightly
- [ ] Resize to mobile width (≤768px) — card becomes ~90vw, Spline shifts to background at 50% opacity

- [ ] **Step 3: Commit**

```bash
git -C "C:/Users/akash/Documents/starlink redesign/starlink-redesign" add src/app/get-starlink/page.tsx
git -C "C:/Users/akash/Documents/starlink redesign/starlink-redesign" commit -m "feat: rewrite get-starlink page — Spline earth, SVG logo, glass card shimmer"
```

---

## Task 6: Production Build Check

**Files:** none (verification only)

- [ ] **Step 1: Run a production build**

```bash
cd "C:/Users/akash/Documents/starlink redesign/starlink-redesign"
npm run build
```

Expected output: `✓ Compiled successfully` with no TypeScript or ESLint errors.

Common issues to fix if they appear:
- `Module not found: @splinetool/react-spline/next` → run `npm install @splinetool/react-spline@latest`
- `Type error: Property 'scene' does not exist` → check `SplineScene.tsx` imports from `/next` not root
- ESLint `no-img-element` warnings are suppressed with the `eslint-disable-next-line` comments already in the code

- [ ] **Step 2: Run production server and do final visual check**

```bash
npm run start
```

Open `http://localhost:3000` and `http://localhost:3000/get-starlink`. Confirm both pages look identical to the dev build.

- [ ] **Step 3: Final commit**

```bash
git -C "C:/Users/akash/Documents/starlink redesign/starlink-redesign" add -A
git -C "C:/Users/akash/Documents/starlink redesign/starlink-redesign" commit -m "chore: verified production build — Starlink redesign complete"
```
