"use client";

import { useState } from "react";
import ThreeScene from "@/components/ThreeScene";

export default function HomePage() {
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
  }

  return (
    <>
      {/* Fixed 3D canvas behind all content */}
      <ThreeScene />

      {/* ═══════════ PAGE 1 — HOME ═══════════ */}
      <section id="page-home" className="page page-home">
        {/* Brand row: STARLINK wordmark + logo mark */}
        <div
          className="brand-row anim-text"
          style={{ position: "absolute", top: 60, left: 90, display: "flex", alignItems: "center", gap: 14, lineHeight: 1 }}
        >
          <span className="wordmark">STARLINK</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/starlink-mark-52.svg"
            alt=""
            aria-hidden="true"
            style={{ width: 52, height: 52, flexShrink: 0, display: "block", objectFit: "contain" }}
          />
        </div>

        {/* Headline */}
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
          Stay connected.<br />Wherever you go.
        </h1>

        {/* Subline */}
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
          Built for travelers, explorers, and life off the grid.
        </p>

        {/* Nav link stack */}
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
          <a href="#page-get" className="nav-link">Get Starlink</a>
          <a href="#page-plans" className="nav-link">Learn More</a>
          <a href="#faq" className="nav-link">Q/A</a>
        </nav>

        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <svg width="1" height="32">
            <line x1="0.5" y1="0" x2="0.5" y2="32" stroke="#edf0e8" strokeWidth="1" />
          </svg>
          <span>Scroll</span>
        </div>
      </section>

      {/* ═══════════ PAGE 2 — GET STARLINK ═══════════ */}
      <section id="page-get" className="page page-get">
        <div className="brand-row-between">
          <span className="wordmark wordmark--section">Get Starlink</span>
        </div>

        <div className="glass-card">
          <h2
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 30,
              fontWeight: 600,
              color: "#1a1a1a",
              marginBottom: 14,
              lineHeight: 1.2,
            }}
          >
            Where will you use Starlink?
          </h2>

          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 20,
              fontWeight: 500,
              color: "rgba(26,26,26,0.75)",
              marginBottom: 40,
              lineHeight: 1.45,
            }}
          >
            Enter your location to check availability and get started.
          </p>

          <form onSubmit={handleSubmit}>
            <input
              className="address-field"
              type="text"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: "rgba(26,26,26,0.75)",
                cursor: "pointer",
                background: "none",
                border: "none",
                padding: 0,
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(26,26,26,0.75)" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              Use my current location
            </button>
          </form>

          <div style={{ flex: 1 }} />
          <a href="#" className="btn-check">Check Availability</a>
        </div>
      </section>

      {/* ═══════════ PAGE 3 — CHOOSE A PLAN ═══════════ */}
      <section id="page-plans" className="page page-plans">
        <div className="brand-row-between">
          <span className="wordmark wordmark--section">Choose a Plan</span>
        </div>

        <div className="plans-grid">
          {/* Roam */}
          <div className="plan-card">
            <div className="plan-name">Roam</div>
            <div className="plan-price"><sup>$</sup>150</div>
            <div className="plan-period">/ month · $599 hardware</div>
            <div className="plan-hr" />
            <ul className="plan-feats">
              <li>Up to 100 Mbps</li>
              <li>Pause anytime</li>
              <li>Single country</li>
              <li>Standard priority</li>
            </ul>
            <a href="#" className="plan-btn">Get Roam</a>
          </div>

          {/* Expedition — featured */}
          <div className="plan-card featured">
            <div className="plan-chip">Most Popular</div>
            <div className="plan-name">Expedition</div>
            <div className="plan-price"><sup>$</sup>250</div>
            <div className="plan-period">/ month · $599 hardware</div>
            <div className="plan-hr" />
            <ul className="plan-feats">
              <li>Up to 220 Mbps</li>
              <li>Global roaming</li>
              <li>Priority access data</li>
              <li>24/7 trail support</li>
            </ul>
            <a href="#" className="plan-btn">Get Expedition</a>
          </div>

          {/* Summit */}
          <div className="plan-card">
            <div className="plan-name">Summit</div>
            <div className="plan-price"><sup>$</sup>500</div>
            <div className="plan-period">/ month · $2,500 hardware</div>
            <div className="plan-hr" />
            <ul className="plan-feats">
              <li>Up to 350 Mbps</li>
              <li>Maritime + aviation</li>
              <li>Enterprise SLA</li>
              <li>Dedicated manager</li>
            </ul>
            <a href="#" className="plan-btn">Get Summit</a>
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="site-footer">
        <div className="footer-brand">
          <span style={{ lineHeight: 0.78 }}>STARLINK</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/starlink-mark-24.svg" alt="" aria-hidden="true" />
        </div>
        <div className="footer-copy">
          © 2025 Space Exploration Technologies Corp. — Rebrand by Akash Jain
        </div>
      </footer>
    </>
  );
}
