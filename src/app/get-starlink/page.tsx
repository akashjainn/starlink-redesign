"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Figma asset — earth + satellite 3D illustration
// (Hosted on Figma MCP asset server; valid 7 days from generation)
const EARTH_SATELLITE_URL =
  "https://www.figma.com/api/mcp/asset/7b8bee9d-73ec-4b0b-90d3-d3f416e11894";

export default function GetStarlinkPage() {
  const [address, setAddress] = useState("");

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setAddress(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Availability check logic goes here
    console.log("Checking availability for:", address);
  }

  return (
    <main
      className="hero-bg relative w-full overflow-hidden"
      style={{ minHeight: "100dvh" }}
    >
      {/* ── Earth + satellite illustration ──────────────────────────────
          Figma: left=214, top=128, w=1408, h=725 on 1512×982 canvas  */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          left: "14.16%",
          top: "13.03%",
          width: "93.12%",
          height: "73.83%",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={EARTH_SATELLITE_URL}
          alt=""
          className="size-full object-cover"
        />
      </div>

      {/* ── Page title ──────────────────────────────────────────────────
          Figma: left=90, top=60, 64px Sansation Bold                 */}
      <header
        className="absolute flex items-center justify-between"
        style={{ left: 0, right: 0, top: 38, padding: "0 90px" }}
      >
        <Link
          href="/"
          className="select-none text-black"
          style={{
            fontFamily:
              "var(--font-barlow), 'Arial Black', 'Trebuchet MS', sans-serif",
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-0.5px",
            marginTop: 22,
            textDecoration: "none",
          }}
        >
          Get Starlink
        </Link>

        {/* Starlink logo — Figma: top-right at left=1327, top=31
            1512-1327-159 = 26px from right; logo w=159, h=87         */}
        <div
          className="relative shrink-0 opacity-90"
          style={{ width: 120, height: 80, marginTop: 0 }}
        >
          <Image
            src="/starlink-logo.png"
            alt="Starlink"
            fill
            className="object-contain"
            priority
          />
        </div>
      </header>

      {/* ── Glass card ──────────────────────────────────────────────────
          Figma: left=83, top=211, w=682, padding=10px
          Inner panel: h=587, glass effect                            */}
      <section
        className="absolute"
        style={{ left: 83, top: 211, width: 682, padding: 10 }}
      >
        <div
          className="glass-card"
          style={{ height: 587, position: "relative", overflow: "hidden" }}
        >
          {/* Card content positioned exactly as in Figma
              Figma absolute positions are relative to page;
              offset by card origin (83+10=93, 211+10=221)            */}

          {/* Heading — Figma: left=135, top=253 → 135-93=42, 253-221=32 */}
          <h2
            style={{
              fontFamily: "Satoshi, 'DM Sans', 'Inter', sans-serif",
              fontSize: 30,
              fontWeight: 500,
              color: "#1a1a1a",
              position: "absolute",
              left: 42,
              top: 32,
              maxWidth: 560,
              lineHeight: 1.3,
            }}
          >
            Where will you use Starlink?
          </h2>

          {/* Subtitle — Figma: left=135, top=323 → 42, 102 */}
          <p
            style={{
              fontFamily: "Satoshi, 'DM Sans', 'Inter', sans-serif",
              fontSize: 20,
              fontWeight: 500,
              color: "rgba(26, 26, 26, 0.85)",
              position: "absolute",
              left: 42,
              top: 102,
              maxWidth: 420,
              lineHeight: 1.5,
            }}
          >
            Enter your location to check availability and get started.
          </p>

          {/* Address input — Figma: left=135, top=398 → 42, 177
              w=376, h=38                                             */}
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
                fontSize: 20,
                fontWeight: 500,
                color: "rgba(26, 26, 26, 0.85)",
                width: 376,
                height: 38,
                padding: "0 16px",
                display: "block",
              }}
            />

            {/* "Use my current location" — Figma: left=168, top=433
                offset from input left (42): 168-93=75 → ~33px from input
                offset from input top: 433-221=212, input at 177 → 35px below */}
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 14,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontFamily: "Satoshi, 'DM Sans', 'Inter', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: "rgba(26, 26, 26, 0.85)",
                opacity: 1,
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.65")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {/* Location pin icon (inline SVG — matches Figma icon) */}
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

            {/* Check availability CTA */}
            <button
              type="submit"
              style={{
                marginTop: 32,
                padding: "12px 28px",
                background: "rgba(26, 26, 26, 0.85)",
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
                  "rgba(26,26,26,0.85)";
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
