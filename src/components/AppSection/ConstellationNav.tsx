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
