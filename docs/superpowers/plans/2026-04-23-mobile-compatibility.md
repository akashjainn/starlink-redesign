# Mobile Compatibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Starlink redesign fully functional on mobile screens without changing the desktop layout.

**Architecture:** Additive CSS-only approach — move absolute positioning from inline styles into named CSS classes so media queries can override them, then add a `@media (max-width: 768px)` block that switches the hero to flex-column flow layout and stacks the AppSection vertically.

**Tech Stack:** Next.js 15, Tailwind v3, plain CSS (globals.css), TypeScript

---

## File Map

| File | What changes |
|------|-------------|
| `src/app/layout.tsx` | Add `viewport` export (enables mobile rendering) |
| `src/app/globals.css` | Add `.home-*` desktop classes; add `@media (max-width: 768px)` block; fix plans grid centering |
| `src/app/page.tsx` | Swap inline positioning styles for CSS classNames on 4 hero elements |

---

### Task 1: Add viewport meta tag

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Add the viewport export**

Open `src/app/layout.tsx`. The file currently exports `metadata`. Add a second named export `viewport` directly after it:

```ts
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "STARLINK — Stay connected. Wherever you go.",
  description:
    "Starlink satellite internet built for travelers, explorers, and life off the grid.",
  openGraph: {
    title: "STARLINK — Stay connected. Wherever you go.",
    description:
      "High-speed satellite internet for van lifers, hikers, climbers, and remote adventurers.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Verify the build still passes**

```bash
cd "C:/Users/akash/Documents/starlink redesign/starlink-redesign" && npx next build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully` (or similar — no TypeScript errors).

---

### Task 2: Add desktop CSS classes for hero elements

**Files:**
- Modify: `src/app/globals.css`

The home page hero currently positions every element via inline styles. We extract the layout properties into named classes so media queries can override them. The desktop appearance is identical.

- [ ] **Step 1: Add the four `.home-*` classes to globals.css**

Find the `/* ── Entrance animations ── */` comment block near the bottom of `src/app/globals.css` (around line 418). Insert the following block **immediately before** that comment:

```css
/* ── Home hero positioned elements ── */
.home-brand {
  position: absolute;
  top: 60px;
  left: 90px;
}

.home-headline {
  position: absolute;
  top: 176px;
  left: 90px;
  width: 456px;
}

.home-subline {
  position: absolute;
  top: 358px;
  left: 90px;
  width: 591px;
}

.home-nav {
  position: absolute;
  top: 469px;
  left: 90px;
  display: flex;
  flex-direction: column;
}
```

- [ ] **Step 2: Verify the build passes**

```bash
cd "C:/Users/akash/Documents/starlink redesign/starlink-redesign" && npx next build 2>&1 | tail -10
```

Expected: no errors.

---

### Task 3: Refactor hero inline styles to use CSS classes

**Files:**
- Modify: `src/app/page.tsx`

Remove `position`, `top`, `left`, and `width` from the inline `style` props of the 4 hero elements and replace with `className`. Typography styles (fontFamily, fontSize, etc.) stay inline.

- [ ] **Step 1: Update the brand-row div**

Find (line ~32–43):
```tsx
        <div
          className="brand-row anim-text"
          style={{ position: "absolute", top: 60, left: 90 }}
        >
```

Replace with:
```tsx
        <div className="brand-row anim-text home-brand">
```

- [ ] **Step 2: Update the h1**

Find (line ~46–58):
```tsx
        <h1
          className="anim-text-d1"
          style={{
            position: "absolute",
            top: 176,
            left: 90,
            width: 456,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(36px, 3.5vw, 52px)",
            fontWeight: 700,
            lineHeight: 1.15,
            color: "#edf0e8",
          }}
        >
```

Replace with:
```tsx
        <h1
          className="anim-text-d1 home-headline"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(36px, 3.5vw, 52px)",
            fontWeight: 700,
            lineHeight: 1.15,
            color: "#edf0e8",
          }}
        >
```

- [ ] **Step 3: Update the subline paragraph**

Find (line ~64–78):
```tsx
        <p
          className="anim-text-d2"
          style={{
            position: "absolute",
            top: 358,
            left: 90,
            width: 591,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(18px, 1.9vw, 28px)",
            fontWeight: 400,
            color: "rgba(237,240,232,0.82)",
            lineHeight: 1.4,
          }}
        >
```

Replace with:
```tsx
        <p
          className="anim-text-d2 home-subline"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(18px, 1.9vw, 28px)",
            fontWeight: 400,
            color: "rgba(237,240,232,0.82)",
            lineHeight: 1.4,
          }}
        >
```

- [ ] **Step 4: Update the nav**

Find (line ~82–96):
```tsx
        <nav
          className="anim-text-d3"
          style={{
            position: "absolute",
            top: 469,
            left: 90,
            display: "flex",
            flexDirection: "column",
          }}
          aria-label="Primary actions"
        >
```

Replace with:
```tsx
        <nav
          className="anim-text-d3 home-nav"
          aria-label="Primary actions"
        >
```

- [ ] **Step 5: Verify the build passes and desktop still looks correct**

```bash
cd "C:/Users/akash/Documents/starlink redesign/starlink-redesign" && npx next build 2>&1 | tail -10
```

Start the dev server and open `http://localhost:3000` on a desktop browser. Confirm the hero elements are in the exact same positions as before.

```bash
cd "C:/Users/akash/Documents/starlink redesign/starlink-redesign" && npx next dev
```

---

### Task 4: Add mobile media query for home hero

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add the 768px media query block**

Find the `/* ── Responsive ── */` comment block (around line 434 in globals.css — the existing `@media (max-width: 900px)` block). Add the following new block **after** the closing `}` of that 900px block:

```css
@media (max-width: 768px) {
  .page-home {
    display: flex;
    flex-direction: column;
    padding: 60px 28px 40px;
  }

  .home-brand,
  .home-headline,
  .home-subline,
  .home-nav {
    position: static;
  }

  .home-brand {
    margin-bottom: 48px;
  }

  .home-headline {
    width: auto;
    margin-bottom: 32px;
  }

  .home-subline {
    width: auto;
    margin-bottom: 28px;
  }

  .scroll-indicator {
    position: static;
    left: auto;
    bottom: auto;
    margin-top: auto;
  }
}
```

- [ ] **Step 2: Verify visually on mobile**

With the dev server running, open Chrome DevTools → toggle device toolbar → select "iPhone SE" (375×667). Confirm:
- STARLINK wordmark + logo appear at the top left
- Headline renders below without overflow
- Subline renders below headline
- Nav links stack below subline
- Scroll indicator appears at the bottom of the viewport

---

### Task 5: Add AppSection, footer, and plans grid mobile overrides

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add AppSection and footer overrides to the 768px block**

Find the `@media (max-width: 768px)` block you just added. Add the following inside it (after the `.scroll-indicator` rule):

```css
  .app-section {
    flex-direction: column;
    align-items: center;
    padding: 60px 28px;
    gap: 48px;
    min-height: auto;
  }

  .app-body {
    max-width: 100%;
  }

  .site-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 28px 28px;
  }
```

- [ ] **Step 2: Fix plans grid centering in the existing 900px block**

Find the existing `@media (max-width: 900px)` block (around line 435). Inside it, the `.plans-grid` rule sets `grid-template-columns: 1fr; max-width: 400px`. Add `margin: 0 auto` to it:

```css
  .plans-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }
```

- [ ] **Step 3: Verify visually on mobile**

With dev server running at `http://localhost:3000`, in Chrome DevTools at iPhone SE (375×667):

- Scroll to the **Choose a Plan** section: single-column plan cards, centered on screen
- Scroll to the **Companion App** section: phone frame on top, copy text below, both centered
- Scroll to the **footer**: STARLINK brand stacked above the copyright line, left-aligned

Then switch to iPad (768×1024) and confirm desktop layout is preserved everywhere.

- [ ] **Step 4: Final build check**

```bash
cd "C:/Users/akash/Documents/starlink redesign/starlink-redesign" && npx next build 2>&1 | tail -10
```

Expected: `✓ Compiled successfully` with no errors or warnings about the new CSS.
