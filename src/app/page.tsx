"use client";

import Link from "next/link";
import { useRef, useCallback } from "react";
import SplineScene from "@/components/SplineScene";

export default function HomePage() {
  const splineWrapRef = useRef<HTMLDivElement>(null);
  const mountTimeRef = useRef<number>(Date.now());

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (Date.now() - mountTimeRef.current < 1200) return;
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
