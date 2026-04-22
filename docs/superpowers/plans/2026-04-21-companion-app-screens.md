# Companion App Screens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new website section between "Choose a Plan" and the Footer that showcases three interactive Starlink companion app screen redesigns as inline React components.

**Architecture:** Each screen lives in its own focused component file under `src/components/AppSection/`. `AppSection.tsx` is the "use client" boundary that owns the auto-cycle timer and active-screen state. Sub-components are pure (no state) except `ConstellationNav.tsx`, which owns its own `selectedStar` state. All custom styles are appended to `src/app/globals.css`. The section is wired into `src/app/page.tsx` after the plans section.

**Tech Stack:** Next.js 15, React 19, TypeScript, CSS (globals.css), SVG animateMotion for beam particles, SVG animate for pulses, CSS @keyframes for star twinkle + progress bar.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `src/components/AppSection/AppSection.tsx` | Section wrapper, copy column, screen switcher, auto-cycle timer |
| Create | `src/components/AppSection/PhoneFrame.tsx` | Reusable phone chrome (border-radius, dark bg, overflow:hidden) |
| Create | `src/components/AppSection/ScreenBeam.tsx` | Screen 1 — orbital dock nav, animated beam, stats row |
| Create | `src/components/AppSection/ScreenSetup.tsx` | Screen 2 — vertical beam setup flow, 5 nodes |
| Create | `src/components/AppSection/DataArcRing.tsx` | Reusable data arc ring SVG |
| Create | `src/components/AppSection/ConstellationNav.tsx` | Interactive constellation star navigation |
| Create | `src/components/AppSection/ScreenAccount.tsx` | Screen 3 — name hero, data arc, constellation nav |
| Modify | `src/app/globals.css` | Add AppSection styles (section, phone, switcher, keyframes) |
| Modify | `src/app/page.tsx` | Import and render `<AppSection />` between plans and footer |

---

## Task 1: CSS Foundations

**Files:**
- Modify: `src/app/globals.css` (append at end)

- [ ] **Step 1: Append AppSection CSS to globals.css**

Open `src/app/globals.css` and append this block at the very end of the file:

```css
/* ═══════════════════════════════════════════════
   APP SECTION
═══════════════════════════════════════════════ */

.app-section {
  position: relative;
  padding: 100px 90px 110px;
  display: flex;
  align-items: center;
  gap: 72px;
  overflow: hidden;
  min-height: 680px;
  background: transparent;
}

.app-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 72% 50%, rgba(0,28,48,0.45) 0%, transparent 58%),
    radial-gradient(ellipse at 18% 80%, rgba(0,12,30,0.3) 0%, transparent 50%);
  pointer-events: none;
}

/* ── Copy column ── */
.app-copy {
  flex: 1;
  position: relative;
  z-index: 10;
  min-width: 0;
}

.app-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.app-eyebrow-line {
  width: 28px;
  height: 1px;
  background: rgba(0,191,204,0.6);
}

.app-eyebrow-text {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.24em;
  color: rgba(0,191,204,0.8);
  text-transform: uppercase;
}

.app-heading {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(44px, 4.5vw, 64px);
  letter-spacing: 0.04em;
  color: #edf0e8;
  line-height: 1.0;
  margin-bottom: 22px;
}

.app-heading em {
  font-style: normal;
  color: #3ad9ff;
}

.app-body {
  font-size: 16px;
  line-height: 1.6;
  color: rgba(237,240,232,0.6);
  max-width: 380px;
  margin-bottom: 40px;
}

/* ── Screen switcher ── */
.screen-switcher {
  display: flex;
  flex-direction: column;
}

.switcher-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(237,240,232,0.07);
  cursor: pointer;
  transition: all 0.2s;
  opacity: 0.4;
}

.switcher-item:first-child {
  border-top: 1px solid rgba(237,240,232,0.07);
}

.switcher-item.active {
  opacity: 1;
}

.switcher-num {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 13px;
  letter-spacing: 0.14em;
  color: rgba(237,240,232,0.35);
  width: 20px;
  flex-shrink: 0;
  transition: color 0.2s;
}

.switcher-item.active .switcher-num {
  color: #3ad9ff;
}

.switcher-info {
  flex: 1;
}

.switcher-title {
  font-size: 14px;
  font-weight: 600;
  color: #edf0e8;
  margin-bottom: 2px;
}

.switcher-desc {
  font-size: 11px;
  color: rgba(237,240,232,0.4);
  line-height: 1.4;
}

.switcher-progress {
  display: none;
  margin-top: 8px;
  height: 1px;
  width: 0%;
  background: rgba(58,217,255,0.5);
}

.switcher-item.active .switcher-progress {
  display: block;
  animation: switcher-progress 5s linear forwards;
}

@keyframes switcher-progress {
  to { width: 100%; }
}

.switcher-arrow {
  font-size: 12px;
  color: rgba(237,240,232,0.2);
  transition: transform 0.2s, color 0.2s;
}

.switcher-item.active .switcher-arrow {
  color: rgba(58,217,255,0.5);
  transform: translateX(4px);
}

/* ── Phone frame ── */
.app-phone-wrap {
  flex-shrink: 0;
  position: relative;
  z-index: 10;
}

.phone-frame {
  width: 280px;
  height: 560px;
  background: #0a0a12;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 44px;
  overflow: hidden;
  position: relative;
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.03),
    0 40px 80px rgba(0,0,0,0.7),
    0 0 60px rgba(58,217,255,0.04);
}

/* ── Shared keyframes ── */
@keyframes twinkle-1 {
  0%,100% { opacity: 0.45; }
  50% { opacity: 0.12; }
}

@keyframes twinkle-2 {
  0%,100% { opacity: 0.70; }
  50% { opacity: 0.22; }
}

@keyframes twinkle-3 {
  0%,100% { opacity: 0.32; }
  50% { opacity: 0.08; }
}

@keyframes twinkle-4 {
  0%,100% { opacity: 0.55; }
  50% { opacity: 0.15; }
}

.twinkle-1 { animation: twinkle-1 3.2s ease-in-out infinite; }
.twinkle-2 { animation: twinkle-2 2.8s ease-in-out infinite; }
.twinkle-3 { animation: twinkle-3 4.5s ease-in-out infinite; }
.twinkle-4 { animation: twinkle-4 3.8s ease-in-out infinite; }

/* ── Live dot blink ── */
@keyframes live-blink {
  0%,100% { opacity: 1; }
  50% { opacity: 0.2; }
}

.live-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #3ad9ff;
  animation: live-blink 2s ease-in-out infinite;
}

/* ── Nav dot pulse ── */
@keyframes nav-pulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(58,217,255,0.5); }
  50% { box-shadow: 0 0 0 5px rgba(58,217,255,0); }
}

.nav-dot-active {
  animation: nav-pulse 1.8s ease-in-out infinite;
}
```

- [ ] **Step 2: Verify TypeScript compilation**

```bash
cd "C:/Users/akash/Documents/starlink redesign/starlink-redesign"
npx tsc --noEmit
```

Expected: no errors (CSS is not type-checked, but run to confirm baseline is clean).

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add AppSection CSS foundations and keyframes"
```

---

## Task 2: PhoneFrame Component

**Files:**
- Create: `src/components/AppSection/PhoneFrame.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/AppSection/PhoneFrame.tsx`:

```tsx
import { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="app-phone-wrap">
      <div className="phone-frame">
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/AppSection/PhoneFrame.tsx
git commit -m "feat: add PhoneFrame component"
```

---

## Task 3: ScreenBeam — Dashboard (Screen 1)

**Files:**
- Create: `src/components/AppSection/ScreenBeam.tsx`

The screen shows a background star field, orbital dock navigation (4 satellite dots on an arc), an animated beam from dish to active satellite, and a stats row.

- [ ] **Step 1: Create ScreenBeam.tsx**

Create `src/components/AppSection/ScreenBeam.tsx`:

```tsx
"use client";

import { useState } from "react";

const NAV_ITEMS = [
  { id: "home",    label: "HOME",    angle: -68 },
  { id: "stats",   label: "STATS",   angle: -30 },
  { id: "network", label: "NETWORK", angle:  10 },
  { id: "settings",label: "SETTINGS",angle:  48 },
] as const;

type NavId = typeof NAV_ITEMS[number]["id"];

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export default function ScreenBeam() {
  const [active, setActive] = useState<NavId>("home");

  const arcCx = 140;
  const arcCy = 10;
  const arcR  = 210;

  const activeItem = NAV_ITEMS.find(n => n.id === active)!;
  const dotPos = polarToXY(arcCx, arcCy, arcR, activeItem.angle);
  const dishX = 140;
  const dishY = 440;

  const beamPath = `M ${dishX} ${dishY} Q ${(dishX + dotPos.x) / 2} ${(dishY + dotPos.y) / 2 - 40} ${dotPos.x} ${dotPos.y}`;

  return (
    <svg width="280" height="560" viewBox="0 0 280 560" style={{ display: "block", background: "#080810" }}>
      <defs>
        <filter id="beamGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="satGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <path id="beamPath" d={beamPath} />
      </defs>

      {/* Star field */}
      {[
        [22,80],[55,34],[90,18],[132,44],[178,28],[215,60],[248,22],
        [30,140],[70,190],[110,155],[165,170],[220,130],[255,175],
        [15,240],[58,280],[95,310],[148,260],[192,295],[238,250],
        [40,370],[82,400],[125,380],[170,350],[210,390],[252,360],
      ].map(([x,y],i) => (
        <circle
          key={i}
          cx={x} cy={y}
          r={Math.random() > 0.6 ? 0.8 : 0.5}
          fill={`rgba(237,240,232,${0.1 + (i % 4) * 0.07})`}
          className={`twinkle-${(i % 4) + 1}`}
        />
      ))}

      {/* Arc rail (faint) */}
      <path
        d={`M ${polarToXY(arcCx,arcCy,arcR,-80).x} ${polarToXY(arcCx,arcCy,arcR,-80).y}
            A ${arcR} ${arcR} 0 0 1
            ${polarToXY(arcCx,arcCy,arcR,60).x} ${polarToXY(arcCx,arcCy,arcR,60).y}`}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="1"
      />

      {/* Beam */}
      <path
        d={beamPath}
        fill="none"
        stroke="rgba(58,217,255,0.25)"
        strokeWidth="1.5"
        filter="url(#beamGlow)"
      />

      {/* Beam particles */}
      {[0, 0.25, 0.5, 0.75, 0.9, 1.1, 1.4, 1.7].map((offset, i) => (
        <circle key={i} r={i % 3 === 0 ? 2.5 : 1.5} fill={i % 3 === 0 ? "#3ad9ff" : "rgba(58,217,255,0.6)"}>
          <animateMotion dur={`${1.8 + (i % 3) * 0.3}s`} begin={`${offset}s`} repeatCount="indefinite">
            <mpath href="#beamPath" />
          </animateMotion>
        </circle>
      ))}

      {/* Nav dots on arc */}
      {NAV_ITEMS.map(item => {
        const pos = polarToXY(arcCx, arcCy, arcR, item.angle);
        const isActive = item.id === active;
        return (
          <g key={item.id} onClick={() => setActive(item.id)} style={{ cursor: "pointer" }}>
            {isActive && (
              <circle cx={pos.x} cy={pos.y} r="10" fill="rgba(58,217,255,0.12)" className="nav-dot-active" />
            )}
            <circle
              cx={pos.x} cy={pos.y}
              r={isActive ? 4 : 2.5}
              fill={isActive ? "#3ad9ff" : "rgba(237,240,232,0.25)"}
              filter={isActive ? "url(#satGlow)" : undefined}
            />
            <text
              x={pos.x} y={pos.y - 12}
              textAnchor="middle"
              fontFamily="DM Sans, sans-serif"
              fontSize="6"
              fontWeight="600"
              letterSpacing="1.2"
              fill={isActive ? "rgba(58,217,255,0.9)" : "rgba(237,240,232,0.3)"}
            >
              {item.label}
            </text>
          </g>
        );
      })}

      {/* Dish base */}
      <ellipse cx={dishX} cy={dishY} rx="22" ry="6" fill="rgba(58,217,255,0.08)" />
      <rect x={dishX - 1} y={dishY - 28} width="2" height="28" fill="rgba(237,240,232,0.3)" />
      <ellipse cx={dishX} cy={dishY - 30} rx="18" ry="5" fill="none" stroke="rgba(237,240,232,0.4)" strokeWidth="1.5" />

      {/* Active satellite dot glow at beam endpoint */}
      <circle cx={dotPos.x} cy={dotPos.y} r="7" fill="rgba(58,217,255,0.08)" />

      {/* Stats row */}
      <line x1="20" y1="500" x2="260" y2="500" stroke="rgba(237,240,232,0.06)" strokeWidth="1" />
      {[
        { val: "348", unit: "MBPS", sub: "DOWN", x: 70 },
        { val: "49",  unit: "MBPS", sub: "UP",   x: 140 },
        { val: "32",  unit: "MS",   sub: "PING",  x: 210 },
      ].map(({ val, unit, sub, x }) => (
        <g key={sub}>
          <text x={x} y="520" textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="26" fill="rgba(237,240,232,0.95)">{val}</text>
          <text x={x} y="532" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="7" fontWeight="600" letterSpacing="1.4" fill="rgba(237,240,232,0.3)">{sub} · {unit}</text>
        </g>
      ))}
      <line x1="105" y1="510" x2="105" y2="535" stroke="rgba(237,240,232,0.08)" strokeWidth="1" />
      <line x1="175" y1="510" x2="175" y2="535" stroke="rgba(237,240,232,0.08)" strokeWidth="1" />

      {/* Status chip */}
      <rect x="100" y="56" width="80" height="18" rx="9" fill="rgba(58,217,255,0.08)" stroke="rgba(58,217,255,0.18)" strokeWidth="0.8" />
      <circle cx="115" cy="65" r="3" fill="#3ad9ff">
        <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x="148" y="69" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="7" fontWeight="700" letterSpacing="1.4" fill="rgba(58,217,255,0.9)">ONLINE</text>
    </svg>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/AppSection/ScreenBeam.tsx
git commit -m "feat: add ScreenBeam component (Screen 1 - dashboard)"
```

---

## Task 4: ScreenSetup — First Contact (Screen 2)

**Files:**
- Create: `src/components/AppSection/ScreenSetup.tsx`

Vertical beam climbing upward through 5 setup nodes. Active node (CONNECT, index 2) pulses.

- [ ] **Step 1: Create ScreenSetup.tsx**

Create `src/components/AppSection/ScreenSetup.tsx`:

```tsx
const NODES = [
  { label: "SETUP",     step: 1, state: "done"    },
  { label: "POWER",     step: 2, state: "done"    },
  { label: "CONNECT",   step: 3, state: "active"  },
  { label: "CONFIGURE", step: 4, state: "pending" },
  { label: "FINISH",    step: 5, state: "pending" },
] as const;

type NodeState = typeof NODES[number]["state"];

const NODE_COLOR: Record<NodeState, string> = {
  done:    "#3ad9ff",
  active:  "#3ad9ff",
  pending: "rgba(237,240,232,0.15)",
};

const LABEL_OPACITY: Record<NodeState, number> = {
  done:    0.9,
  active:  1.0,
  pending: 0.35,
};

export default function ScreenSetup() {
  const beamX = 80;
  const topY = 130;
  const bottomY = 460;
  const step = (bottomY - topY) / (NODES.length - 1);

  const beamPath = `M ${beamX} ${bottomY} L ${beamX} ${topY}`;

  return (
    <svg width="280" height="560" viewBox="0 0 280 560" style={{ display: "block", background: "#080810" }}>
      <defs>
        <filter id="beamGlowV" x="-200%" y="-20%" width="500%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="nodeGlow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <path id="vBeamPath" d={beamPath} />
      </defs>

      {/* Star field */}
      {[
        [200,50],[230,80],[250,120],[215,160],[240,200],
        [180,240],[210,280],[245,310],[220,360],[200,400],
        [160,60],[170,140],[185,210],[175,310],[190,430],
      ].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 0.7 : 0.4}
          fill={`rgba(237,240,232,${0.08 + (i % 4) * 0.06})`}
          className={`twinkle-${(i % 4) + 1}`}
        />
      ))}

      {/* Active step label */}
      <text x="155" y="88" textAnchor="middle"
        fontFamily="'Bebas Neue', sans-serif" fontSize="40" letterSpacing="0.05em"
        fill="#3ad9ff">CONNECT</text>
      <text x="155" y="104" textAnchor="middle"
        fontFamily="DM Sans, sans-serif" fontSize="8" fontWeight="600" letterSpacing="1.4"
        fill="rgba(237,240,232,0.3)">STEP 3 OF 5</text>

      {/* Vertical beam rail */}
      <line x1={beamX} y1={topY} x2={beamX} y2={bottomY}
        stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />

      {/* Beam glow */}
      <line x1={beamX} y1={topY} x2={beamX} y2={bottomY}
        stroke="rgba(58,217,255,0.18)" strokeWidth="2"
        filter="url(#beamGlowV)" />

      {/* Beam particles (travel upward) */}
      {[0, 0.4, 0.8, 1.2, 1.6, 2.0].map((offset, i) => (
        <circle key={i} r={i % 2 === 0 ? 2 : 1.5}
          fill={i % 2 === 0 ? "#3ad9ff" : "rgba(58,217,255,0.5)"}>
          <animateMotion dur={`${2.2 + (i % 3) * 0.3}s`} begin={`${offset}s`} repeatCount="indefinite">
            <mpath href="#vBeamPath" />
          </animateMotion>
        </circle>
      ))}

      {/* Nodes */}
      {NODES.map((node, i) => {
        const cy = bottomY - i * step;
        const isActive = node.state === "active";
        const isDone   = node.state === "done";
        return (
          <g key={node.label}>
            {/* Pulse ring for active */}
            {isActive && (
              <circle cx={beamX} cy={cy} r="8" fill="none" stroke="rgba(58,217,255,0.3)" strokeWidth="1">
                <animate attributeName="r" values="8;18;8" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0;0.8" dur="2.2s" repeatCount="indefinite" />
              </circle>
            )}
            {/* Node circle */}
            <circle cx={beamX} cy={cy} r={isActive ? 6 : 4}
              fill={NODE_COLOR[node.state]}
              stroke={isDone ? "none" : "rgba(237,240,232,0.1)"}
              strokeWidth="1"
              filter={isActive ? "url(#nodeGlow)" : undefined}
            />
            {/* Checkmark for done nodes */}
            {isDone && (
              <text x={beamX} y={cy + 3} textAnchor="middle"
                fontFamily="DM Sans, sans-serif" fontSize="6" fill="#080810" fontWeight="700">✓</text>
            )}
            {/* Step label */}
            <text x={beamX + 18} y={cy - 4}
              fontFamily="DM Sans, sans-serif" fontSize="8" fontWeight="700" letterSpacing="1.2"
              fill={`rgba(237,240,232,${LABEL_OPACITY[node.state]})`}>
              {node.label}
            </text>
            <text x={beamX + 18} y={cy + 7}
              fontFamily="DM Sans, sans-serif" fontSize="7" letterSpacing="0.5"
              fill={`rgba(237,240,232,${LABEL_OPACITY[node.state] * 0.5})`}>
              STEP {node.step}
            </text>
          </g>
        );
      })}

      {/* Bottom status */}
      <rect x="90" y="490" width="100" height="22" rx="11"
        fill="rgba(232,224,0,0.1)" stroke="rgba(232,224,0,0.25)" strokeWidth="0.8" />
      <text x="140" y="505" textAnchor="middle"
        fontFamily="DM Sans, sans-serif" fontSize="8" fontWeight="700" letterSpacing="1.4"
        fill="rgba(232,224,0,0.9)">SEARCHING…</text>
    </svg>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/AppSection/ScreenSetup.tsx
git commit -m "feat: add ScreenSetup component (Screen 2 - setup flow)"
```

---

## Task 5: DataArcRing Component

**Files:**
- Create: `src/components/AppSection/DataArcRing.tsx`

61.4% usage arc. Circumference = 2π×62 = 389.56 ≈ 390. Filled portion = 239.

- [ ] **Step 1: Create DataArcRing.tsx**

Create `src/components/AppSection/DataArcRing.tsx`:

```tsx
export default function DataArcRing() {
  return (
    <svg width="152" height="152" viewBox="0 0 152 152">
      <defs>
        <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3ad9ff" />
          <stop offset="100%" stopColor="#E8E000" />
        </linearGradient>
      </defs>

      {/* Track */}
      <circle cx="76" cy="76" r="62"
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="7" />

      {/* Fill arc — 61.4% of 390 = 239, starts at top (-90°) */}
      <circle cx="76" cy="76" r="62"
        fill="none"
        stroke="url(#arcGrad)"
        strokeWidth="7"
        strokeDasharray="239 390"
        strokeLinecap="round"
        transform="rotate(-90 76 76)" />

      {/* Endpoint pulse — at 131° from 0° (61.4% around from top) */}
      {/* x = 76 + 62*cos(131°) = 35, y = 76 + 62*sin(131°) = 123 */}
      <circle cx="35" cy="123" r="3" fill="#E8E000" opacity="0.9">
        <animate attributeName="r" values="3;6;3" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2.4s" repeatCount="indefinite" />
      </circle>

      {/* Center text */}
      <text x="76" y="65" textAnchor="middle"
        fontFamily="'Bebas Neue', sans-serif" fontSize="30"
        fill="rgba(237,240,232,0.95)">614</text>
      <text x="76" y="79" textAnchor="middle"
        fontFamily="DM Sans, sans-serif" fontSize="9" fontWeight="600" letterSpacing="1.2"
        fill="rgba(237,240,232,0.28)">GB USED</text>
      <text x="76" y="92" textAnchor="middle"
        fontFamily="DM Sans, sans-serif" fontSize="9" letterSpacing="0.8"
        fill="rgba(237,240,232,0.15)">OF 1 TB</text>
    </svg>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/AppSection/DataArcRing.tsx
git commit -m "feat: add DataArcRing component"
```

---

## Task 6: ConstellationNav Component

**Files:**
- Create: `src/components/AppSection/ConstellationNav.tsx`

Interactive SVG. Stars at fixed positions. Click to select — adjacent lines and connected stars light up in cyan. Click again to deselect.

- [ ] **Step 1: Create ConstellationNav.tsx**

Create `src/components/AppSection/ConstellationNav.tsx`:

```tsx
"use client";

import { useState } from "react";

type StarId = "messages" | "orders" | "shop" | "statements";

const STARS: { id: StarId; label: string; cx: number; cy: number; r: number; twinkle: number }[] = [
  { id: "messages",   label: "MESSAGES",   cx: 52,  cy: 22, r: 3.2, twinkle: 1 },
  { id: "orders",     label: "ORDERS",     cx: 174, cy: 16, r: 4.2, twinkle: 2 },
  { id: "shop",       label: "SHOP",       cx: 60,  cy: 76, r: 2.8, twinkle: 3 },
  { id: "statements", label: "STATEMENTS", cx: 168, cy: 72, r: 3.0, twinkle: 4 },
];

const LINES: { id: string; x1: number; y1: number; x2: number; y2: number; dashed?: boolean }[] = [
  { id: "line-MO", x1: 52,  y1: 22, x2: 174, y2: 16 },
  { id: "line-MS", x1: 52,  y1: 22, x2: 60,  y2: 76 },
  { id: "line-OS", x1: 174, y1: 16, x2: 168, y2: 72 },
  { id: "line-SS", x1: 60,  y1: 76, x2: 168, y2: 72 },
  { id: "line-CX", x1: 174, y1: 16, x2: 60,  y2: 76, dashed: true },
];

const STAR_LINES: Record<StarId, string[]> = {
  messages:   ["line-MO", "line-MS"],
  orders:     ["line-MO", "line-OS", "line-CX"],
  shop:       ["line-MS", "line-SS", "line-CX"],
  statements: ["line-OS", "line-SS"],
};

const STAR_NEIGHBORS: Record<StarId, StarId[]> = {
  messages:   ["orders", "shop"],
  orders:     ["messages", "statements", "shop"],
  shop:       ["messages", "statements", "orders"],
  statements: ["orders", "shop"],
};

export default function ConstellationNav() {
  const [selected, setSelected] = useState<StarId | null>(null);

  function handleStarClick(id: StarId) {
    setSelected(prev => prev === id ? null : id);
  }

  const activeLines = selected ? new Set(STAR_LINES[selected]) : new Set<string>();
  const neighbors   = selected ? new Set(STAR_NEIGHBORS[selected]) : new Set<StarId>();

  return (
    <svg
      width="252" height="112" viewBox="0 0 252 112"
      style={{ overflow: "visible", cursor: "pointer", display: "block" }}
    >
      <defs>
        <filter id="starBright" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="4.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Background field stars */}
      {[
        [12,44,0.6,0.15],[228,88,0.5,0.12],[8,90,0.7,0.1],
        [240,34,0.4,0.12],[122,100,0.5,0.1],[30,8,0.4,0.1],
        [200,104,0.6,0.08],[100,8,0.4,0.08],[140,56,0.5,0.07],
      ].map(([x,y,r,op],i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={`rgba(255,255,255,${op})`} />
      ))}

      {/* Constellation lines */}
      {LINES.map(line => {
        const isActive = activeLines.has(line.id);
        return (
          <line
            key={line.id}
            x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
            stroke={isActive ? "rgba(58,217,255,0.45)" : "rgba(255,255,255,0.1)"}
            strokeWidth={line.dashed ? 0.6 : 0.8}
            strokeDasharray={line.dashed ? "1.5 4" : undefined}
            style={{ transition: "stroke 0.3s" }}
          />
        );
      })}

      {/* Stars */}
      {STARS.map(star => {
        const isSelected  = selected === star.id;
        const isNeighbor  = neighbors.has(star.id);

        const starFill   = isSelected  ? "rgba(255,255,255,0.98)"
                         : isNeighbor  ? "rgba(237,240,232,0.65)"
                         : "rgba(237,240,232,0.45)";
        const labelFill  = isSelected  ? "rgba(255,255,255,0.85)"
                         : isNeighbor  ? "rgba(237,240,232,0.5)"
                         : "rgba(237,240,232,0.28)";

        return (
          <g key={star.id} onClick={() => handleStarClick(star.id)} style={{ cursor: "pointer" }}>
            {/* Glow halo when selected */}
            {isSelected && (
              <circle cx={star.cx} cy={star.cy} r="12" fill="rgba(58,217,255,0.14)" />
            )}
            <circle
              cx={star.cx} cy={star.cy} r={star.r}
              fill={starFill}
              filter={isSelected ? "url(#starBright)" : undefined}
              className={`twinkle-${star.twinkle}`}
              style={{ transition: "fill 0.3s" }}
            />
            <text
              x={star.cx} y={star.cy - star.r - 5}
              textAnchor="middle"
              fontFamily="DM Sans, sans-serif"
              fontSize="6.5"
              fontWeight="700"
              letterSpacing="1.1"
              fill={labelFill}
              style={{ transition: "fill 0.3s", userSelect: "none" }}
            >
              {star.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/AppSection/ConstellationNav.tsx
git commit -m "feat: add ConstellationNav interactive constellation component"
```

---

## Task 7: ScreenAccount Component (Screen 3)

**Files:**
- Create: `src/components/AppSection/ScreenAccount.tsx`

Three zones: name hero, data arc ring, constellation navigation. Plus a SIGN OUT text link.

- [ ] **Step 1: Create ScreenAccount.tsx**

Create `src/components/AppSection/ScreenAccount.tsx`:

```tsx
import DataArcRing from "./DataArcRing";
import ConstellationNav from "./ConstellationNav";

export default function ScreenAccount() {
  return (
    <div style={{
      width: "280px",
      height: "560px",
      background: "#080810",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "0",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Background stars */}
      <svg
        width="280" height="560"
        viewBox="0 0 280 560"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {[
          [20,30],[55,18],[80,50],[230,25],[260,55],
          [240,90],[15,110],[250,140],[28,180],[265,200],
          [12,250],[270,260],[22,320],[258,340],[18,400],
          [262,420],[30,480],[250,500],[140,20],[140,540],
        ].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y}
            r={i % 3 === 0 ? 0.7 : 0.4}
            fill={`rgba(237,240,232,${0.06 + (i % 4) * 0.04})`}
            className={`twinkle-${(i % 4) + 1}`}
          />
        ))}
      </svg>

      {/* Zone 1 — Name hero */}
      <div style={{
        position: "relative",
        zIndex: 10,
        textAlign: "center",
        paddingTop: "48px",
        marginBottom: "4px",
      }}>
        {/* Live indicator */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          marginBottom: "10px",
        }}>
          <span className="live-dot" />
          <span style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "8px",
            fontWeight: 700,
            letterSpacing: "1.4px",
            color: "rgba(58,217,255,0.8)",
          }}>ONLINE</span>
        </div>

        {/* First name */}
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "38px",
          letterSpacing: "0.04em",
          color: "rgba(237,240,232,0.95)",
          lineHeight: 1.0,
        }}>VIKTOR</div>

        {/* Last name — intentionally dimmer */}
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "28px",
          letterSpacing: "0.04em",
          color: "rgba(237,240,232,0.35)",
          lineHeight: 1.0,
          marginBottom: "8px",
        }}>HENDELMANN</div>

        {/* Terminal ID */}
        <div style={{
          fontFamily: "monospace",
          fontSize: "7px",
          letterSpacing: "1px",
          color: "rgba(58,217,255,0.35)",
        }}>VIKTOR-STARLINK</div>
      </div>

      {/* Zone 2 — Data arc ring */}
      <div style={{ position: "relative", zIndex: 10, marginTop: "12px", marginBottom: "8px" }}>
        <DataArcRing />
      </div>

      {/* Zone 3 — Constellation nav */}
      <div style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        padding: "0 14px",
        flex: 1,
      }}>
        <ConstellationNav />

        {/* Sign out */}
        <div style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "9px",
          fontWeight: 600,
          letterSpacing: "1.4px",
          color: "rgba(237,240,232,0.22)",
          cursor: "pointer",
          textTransform: "uppercase",
          marginTop: "4px",
        }}>
          SIGN OUT
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/AppSection/ScreenAccount.tsx
git commit -m "feat: add ScreenAccount component (Screen 3 - profile)"
```

---

## Task 8: AppSection — Section Wrapper

**Files:**
- Create: `src/components/AppSection/AppSection.tsx`

Owns `activeScreen` state (0/1/2) and 5-second auto-cycle timer. Renders copy column + phone frame. Inactive screens use `display: none` so animations don't reset.

- [ ] **Step 1: Create AppSection.tsx**

Create `src/components/AppSection/AppSection.tsx`:

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import PhoneFrame from "./PhoneFrame";
import ScreenBeam from "./ScreenBeam";
import ScreenSetup from "./ScreenSetup";
import ScreenAccount from "./ScreenAccount";

const SCREENS = [
  {
    num: "01",
    title: "The Beam",
    desc: "Tap any satellite to instantly re-aim. Speed at a glance.",
  },
  {
    num: "02",
    title: "First Contact",
    desc: "Signal climbs node by node. You always know where you stand.",
  },
  {
    num: "03",
    title: "Your Universe",
    desc: "Your data. Your constellation. Everything in one glance.",
  },
] as const;

export default function AppSection() {
  const [activeScreen, setActiveScreen] = useState(0);

  const advance = useCallback(() => {
    setActiveScreen(prev => (prev + 1) % SCREENS.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(advance, 5000);
    return () => clearInterval(timer);
  }, [advance]);

  function handleSwitcherClick(index: number) {
    setActiveScreen(index);
  }

  return (
    <section className="app-section" id="app-screens">
      {/* Copy column */}
      <div className="app-copy">
        <div className="app-eyebrow">
          <span className="app-eyebrow-line" />
          <span className="app-eyebrow-text">Companion App</span>
        </div>

        <h2 className="app-heading">
          Your signal.<br />
          <em>Reimagined.</em>
        </h2>

        <p className="app-body">
          Every screen built around one idea — the beam is the interface.
          No dashboards. No menus. Just signal, alive in your hand.
        </p>

        {/* Screen switcher */}
        <div className="screen-switcher">
          {SCREENS.map((screen, i) => (
            <div
              key={i}
              className={`switcher-item${activeScreen === i ? " active" : ""}`}
              onClick={() => handleSwitcherClick(i)}
            >
              <span className="switcher-num">{screen.num}</span>
              <div className="switcher-info">
                <div className="switcher-title">{screen.title}</div>
                <div className="switcher-desc">{screen.desc}</div>
                <div className="switcher-progress" key={`${i}-${activeScreen}`} />
              </div>
              <span className="switcher-arrow">→</span>
            </div>
          ))}
        </div>
      </div>

      {/* Phone — render all screens, hide inactive with display:none */}
      <PhoneFrame>
        <div style={{ display: activeScreen === 0 ? "block" : "none" }}>
          <ScreenBeam />
        </div>
        <div style={{ display: activeScreen === 1 ? "block" : "none" }}>
          <ScreenSetup />
        </div>
        <div style={{ display: activeScreen === 2 ? "block" : "none" }}>
          <ScreenAccount />
        </div>
      </PhoneFrame>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/AppSection/AppSection.tsx
git commit -m "feat: add AppSection wrapper with auto-cycle switcher"
```

---

## Task 9: Wire Into page.tsx

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add import and render AppSection**

In `src/app/page.tsx`:

1. Add this import after the existing `ThreeScene` import:
```tsx
import AppSection from "@/components/AppSection/AppSection";
```

2. Insert `<AppSection />` between the `#page-plans` section and the `<footer>`. The closing `</section>` of `#page-plans` is at line 233. Insert after it:
```tsx
      {/* ═══════════ APP SCREENS SECTION ═══════════ */}
      <AppSection />
```

The final page structure around the insertion point:
```tsx
      </section>

      {/* ═══════════ APP SCREENS SECTION ═══════════ */}
      <AppSection />

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="site-footer">
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Run dev server and open browser**

```bash
npm run dev
```

Open `http://localhost:3000` and scroll past the plans section. Verify:
- The section appears with copy on the left, phone on the right
- Screen 1 shows the orbital dock with animated beam particles and tappable nav dots
- After 5 seconds the switcher advances to Screen 2 with the vertical beam setup
- After another 5 seconds it advances to Screen 3 with the name hero, arc ring, and constellation stars
- Clicking a switcher item jumps to that screen and the progress bar animation restarts
- On Screen 1, tapping the nav dots (HOME/STATS/NETWORK/SETTINGS) rotates the beam
- On Screen 3, clicking a constellation star highlights it and its adjacent lines in cyan; clicking again deselects

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: integrate AppSection into main page between plans and footer"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|---|---|
| Section between plans and footer | Task 9 |
| Two-column layout (copy + phone) | Task 8 |
| Screen switcher with progress bar | Task 1 (CSS) + Task 8 |
| Auto-cycle every 5s | Task 8 |
| Phone frame chrome | Task 2 |
| Screen 1: orbital dock nav, beam particles, stats row | Task 3 |
| Screen 2: vertical beam, 5 nodes, active step pulse | Task 4 |
| Screen 3: name hero, live indicator, terminal ID | Task 7 |
| Screen 3: data arc ring 61.4%, endpoint pulse | Task 5 |
| Screen 3: constellation nav, 4 stars, line illumination | Task 6 |
| Screen 3: SIGN OUT | Task 7 |
| Background stars + twinkle keyframes | Task 1 (keyframes) + Tasks 3,4,7 (stars) |

All requirements covered. No placeholders. Types are consistent across all tasks (`StarId`, `NavId` are defined where used). `NavId` in Task 3 and `StarId` in Task 6 are separate — no collision.
