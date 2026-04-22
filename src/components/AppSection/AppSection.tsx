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

    </section>
  );
}
