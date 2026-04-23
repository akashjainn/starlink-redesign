# Mobile Compatibility — Design Spec
**Date:** 2026-04-23  
**Status:** Approved

## Overview

Make the Starlink redesign (Next.js 15 + Tailwind v3) fully functional on mobile devices. Desktop layout is unchanged. All changes are additive: new CSS classes, new media queries, one viewport meta addition, and moving 3–4 inline style properties per hero element into named classes.

Breakpoint: `@media (max-width: 768px)` for mobile. The existing `@media (max-width: 900px)` block (glass card, plans grid, page padding) is already present and is extended/fixed rather than replaced.

---

## Change 1 — Viewport Meta Tag

**File:** `src/app/layout.tsx`

Add Next.js 14+ `viewport` export:

```ts
export const viewport = {
  width: 'device-width',
  initialScale: 1,
};
```

Without this, mobile browsers render at 980px desktop width and scale down. All other responsive CSS is ineffective without it.

---

## Change 2 — Home Page Hero

**Files:** `src/app/page.tsx`, `src/app/globals.css`

### Problem
All hero elements (`brand-row`, `h1`, `p`, `nav`) use `style={{ position: 'absolute', top: X, left: 90, width: Y }}` inline. Inline styles can't be overridden by media queries. On a 375px screen, the fixed widths (456px h1, 591px subline) overflow horizontally.

### Solution
Move `position`, `top`, `left`, and `width` from inline styles into four CSS classes. Keep typography styles (fontFamily, fontSize, fontWeight, color, lineHeight) inline — those don't need to change for mobile.

**New classes (desktop — exact pixel values from current inline styles):**
```css
.home-brand    { position: absolute; top: 60px;  left: 90px; }
.home-headline { position: absolute; top: 176px; left: 90px; width: 456px; }
.home-subline  { position: absolute; top: 358px; left: 90px; width: 591px; }
.home-nav      { position: absolute; top: 469px; left: 90px; display: flex; flex-direction: column; }
```

**Mobile override (`≤ 768px`):**
```css
@media (max-width: 768px) {
  .page-home {
    display: flex;
    flex-direction: column;
    padding: 60px 28px 40px;
  }
  .home-brand, .home-headline, .home-subline, .home-nav {
    position: static;
  }
  .home-brand    { margin-bottom: 48px; }
  .home-headline { width: auto; margin-bottom: 32px; }
  .home-subline  { width: auto; margin-bottom: 28px; }
  .scroll-indicator {
    position: static;
    left: auto;
    margin-top: auto;
  }
}
```

The `margin-bottom` values mirror the visual spacing rhythm of the current desktop layout (brand→headline ~116px gap becomes ~48px; headline→subline ~182px becomes ~32px; subline→nav ~111px becomes ~28px — compressed proportionally for mobile).

The scroll indicator uses `margin-top: auto` on the flex column to float to the bottom of the 100vh section.

**`page.tsx` changes:** Replace the `style` prop on each element — remove `position`, `top`, `left`, `width` properties and add `className` (e.g. `className="home-brand anim-text"`). For the `<nav>`, also remove `display` and `flexDirection` from the inline style since those move into `.home-nav` too (the `style` prop on the nav can be removed entirely).

---

## Change 3 — AppSection

**File:** `src/app/globals.css`

### Problem
`.app-section` is `display: flex` with `padding: 100px 90px 110px` and `gap: 72px`. PhoneFrame (280px wide) + copy column won't fit side-by-side on a 375px screen.

### Solution
Mobile override stacks phone on top, copy below. Phone already comes first in JSX so DOM order is correct.

```css
@media (max-width: 768px) {
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
}
```

---

## Change 4 — Footer

**File:** `src/app/globals.css`

### Problem
`.site-footer` is `display: flex; justify-content: space-between; padding: 32px 90px`. On narrow screens the brand and copyright text are squeezed together.

### Solution
```css
@media (max-width: 768px) {
  .site-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 28px 28px;
  }
}
```

---

## Change 5 — Plans Grid Centering

**File:** `src/app/globals.css`

The existing `@media (max-width: 900px)` block already collapses `.plans-grid` to `grid-template-columns: 1fr; max-width: 400px` but the grid is left-aligned. Add:

```css
.plans-grid {
  margin: 0 auto;  /* inside the existing 900px block */
}
```

---

## Files Touched

| File | Change |
|------|--------|
| `src/app/layout.tsx` | Add `viewport` export |
| `src/app/page.tsx` | Add `className` to 4 hero elements; remove `position`/`top`/`left`/`width` from inline styles |
| `src/app/globals.css` | Add 4 desktop `.home-*` classes; add `@media (max-width: 768px)` block; fix plans grid centering |

No other files change. AppSection JSX is untouched — only its CSS changes.

---

## What Doesn't Change

- Desktop layout: identical (CSS classes reproduce inline styles exactly)
- ThreeScene 3D background: unchanged (fixed canvas, always full screen)
- AppSection JSX / screen switching logic: unchanged
- Tailwind usage: unchanged
- All animation classes: unchanged
