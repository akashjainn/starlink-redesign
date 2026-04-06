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
