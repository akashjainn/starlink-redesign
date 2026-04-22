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
          r={i % 3 === 0 ? 0.8 : 0.5}
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
