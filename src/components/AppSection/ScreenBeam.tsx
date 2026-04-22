"use client";

import { useState } from "react";

const SATS = [
  { id: "home",     label: "HOME",     x: 40,  y: 68,  data: { down: "348", up: "49",  ping: "32" } },
  { id: "stats",    label: "STATS",    x: 107, y: 34,  data: { down: "284", up: "38",  ping: "28" } },
  { id: "network",  label: "NETWORK",  x: 173, y: 34,  data: { down: "198", up: "55",  ping: "45" } },
  { id: "settings", label: "SETTINGS", x: 240, y: 68,  data: { down: "412", up: "72",  ping: "22" } },
] as const;

type SatId = typeof SATS[number]["id"];

const DISH_X = 140;
const DISH_Y = 428;

function beamD(satX: number, satY: number) {
  const midX = (DISH_X + satX) / 2;
  const midY = (DISH_Y + satY) / 2 - 40;
  return `M ${DISH_X} ${DISH_Y} Q ${midX} ${midY} ${satX} ${satY}`;
}

function SatIcon({ x, y, active }: { x: number; y: number; active: boolean }) {
  const s  = active ? 5 : 3.5;
  const al = active ? 13 : 9;
  const c  = active ? "#3ad9ff" : "rgba(237,240,232,0.35)";
  const op = active ? 0.9 : 0.45;
  return (
    <g>
      <rect x={x - al - s} y={y - 1.5} width={al} height={3} fill={c} rx="0.5" opacity={op} />
      <rect x={x - s}      y={y - s}   width={s * 2} height={s * 2} fill={c} rx="1" />
      <rect x={x + s}      y={y - 1.5} width={al} height={3} fill={c} rx="0.5" opacity={op} />
    </g>
  );
}

export default function ScreenBeam() {
  const [activeId, setActiveId] = useState<SatId>("home");

  const sat  = SATS.find(s => s.id === activeId)!;
  const path = beamD(sat.x, sat.y);

  return (
    <svg width="280" height="560" viewBox="0 0 280 560"
      style={{ display: "block", background: "#080810" }}>
      <defs>
        <filter id="beamGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="satGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <path id="bp" d={path} />
      </defs>

      {/* Star field */}
      {[
        [22,120],[55,90],[90,75],[132,105],[178,85],[215,110],[248,78],
        [30,185],[70,240],[110,210],[165,225],[220,180],[255,230],
        [15,295],[58,335],[95,365],[148,315],[192,350],[238,305],
        [40,420],[82,450],[125,435],[170,405],[210,445],[252,415],
      ].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y}
          r={i % 3 === 0 ? 0.8 : 0.5}
          fill={`rgba(237,240,232,${0.1 + (i % 4) * 0.07})`}
          className={`twinkle-${(i % 4) + 1}`}
        />
      ))}

      {/* Orbital arc rail */}
      <path d="M 30 75 C 80 0, 200 0, 250 75"
        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

      {/* Beam */}
      <path d={path} fill="none"
        stroke="rgba(58,217,255,0.22)" strokeWidth="1.5"
        filter="url(#beamGlow)" />

      {/* Beam particles — key includes activeId so they remount on satellite change */}
      {[0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8, 2.1].map((offset, i) => (
        <circle key={`${activeId}-${i}`}
          r={i % 3 === 0 ? 2.5 : 1.5}
          fill={i % 3 === 0 ? "#3ad9ff" : "rgba(58,217,255,0.6)"}>
          <animateMotion dur={`${1.8 + (i % 3) * 0.3}s`} begin={`${offset}s`} repeatCount="indefinite">
            <mpath href="#bp" />
          </animateMotion>
        </circle>
      ))}

      {/* Satellites */}
      {SATS.map(s => {
        const isActive = s.id === activeId;
        return (
          <g key={s.id} onClick={() => setActiveId(s.id)} style={{ cursor: "pointer" }}>
            {/* Generous hit area */}
            <circle cx={s.x} cy={s.y} r="22" fill="transparent" />
            {/* Pulse halo on active */}
            {isActive && (
              <circle cx={s.x} cy={s.y} r="18" fill="rgba(58,217,255,0.07)"
                className="nav-dot-active" />
            )}
            {/* Satellite body */}
            <g filter={isActive ? "url(#satGlow)" : undefined}>
              <SatIcon x={s.x} y={s.y} active={isActive} />
            </g>
            {/* Label */}
            <text x={s.x} y={s.y + 22} textAnchor="middle"
              fontFamily="DM Sans, sans-serif" fontSize="6" fontWeight="700" letterSpacing="1.1"
              fill={isActive ? "rgba(58,217,255,0.9)" : "rgba(237,240,232,0.28)"}>
              {s.label}
            </text>
          </g>
        );
      })}

      {/* Beam endpoint glow at active satellite */}
      <circle cx={sat.x} cy={sat.y} r="12" fill="rgba(58,217,255,0.05)" />

      {/* Dish */}
      <ellipse cx={DISH_X} cy={DISH_Y}     rx="22" ry="6"  fill="rgba(58,217,255,0.08)" />
      <rect    x={DISH_X - 1} y={DISH_Y - 28} width="2" height="28" fill="rgba(237,240,232,0.3)" />
      <ellipse cx={DISH_X} cy={DISH_Y - 30} rx="18" ry="5"
        fill="none" stroke="rgba(237,240,232,0.4)" strokeWidth="1.5" />

      {/* Active satellite name */}
      <text x="140" y="112" textAnchor="middle"
        fontFamily="'Bebas Neue', sans-serif" fontSize="13" letterSpacing="0.18em"
        fill="rgba(58,217,255,0.5)">
        {sat.label} LINK
      </text>

      {/* Online chip */}
      <rect x="100" y="120" width="80" height="18" rx="9"
        fill="rgba(58,217,255,0.08)" stroke="rgba(58,217,255,0.18)" strokeWidth="0.8" />
      <circle cx="115" cy="129" r="3" fill="#3ad9ff">
        <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x="148" y="133" textAnchor="middle"
        fontFamily="DM Sans, sans-serif" fontSize="7" fontWeight="700" letterSpacing="1.4"
        fill="rgba(58,217,255,0.9)">ONLINE</text>

      {/* Stats — key remounts group on satellite change, triggering fade-in */}
      <line x1="20" y1="488" x2="260" y2="488" stroke="rgba(237,240,232,0.06)" strokeWidth="1" />
      <g key={activeId}>
        {[
          { val: sat.data.down, unit: "MBPS", sub: "DOWN", x: 70  },
          { val: sat.data.up,   unit: "MBPS", sub: "UP",   x: 140 },
          { val: sat.data.ping, unit: "MS",   sub: "PING",  x: 210 },
        ].map(({ val, unit, sub, x }) => (
          <g key={sub}>
            <text x={x} y="513" textAnchor="middle"
              fontFamily="'Bebas Neue', sans-serif" fontSize="26"
              fill="rgba(237,240,232,0.95)">
              {val}
              <animate attributeName="opacity" values="0;1" dur="0.35s" begin="0s" fill="freeze" />
            </text>
            <text x={x} y="525" textAnchor="middle"
              fontFamily="DM Sans, sans-serif" fontSize="7" fontWeight="600" letterSpacing="1.4"
              fill="rgba(237,240,232,0.3)">
              {sub} · {unit}
              <animate attributeName="opacity" values="0;1" dur="0.35s" begin="0.05s" fill="freeze" />
            </text>
          </g>
        ))}
      </g>
      <line x1="105" y1="498" x2="105" y2="523" stroke="rgba(237,240,232,0.08)" strokeWidth="1" />
      <line x1="175" y1="498" x2="175" y2="523" stroke="rgba(237,240,232,0.08)" strokeWidth="1" />
    </svg>
  );
}
