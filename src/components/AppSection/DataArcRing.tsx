export default function DataArcRing() {
  return (
    <svg width="152" height="152" viewBox="0 0 152 152">
      <defs>
        <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3ad9ff" />
          <stop offset="100%" stopColor="#E8E000" />
        </linearGradient>
      </defs>

      {/* Track */}
      <circle cx="76" cy="76" r="62"
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="7" />

      {/* Fill arc — 61.4% of 390 = 239, starts at top (-90°) */}
      <circle cx="76" cy="76" r="62"
        fill="none"
        stroke="url(#arcGrad)"
        strokeWidth="7"
        strokeDasharray="239 390"
        strokeLinecap="round"
        transform="rotate(-90 76 76)" />

      {/* Endpoint pulse — at 131° from 0° (61.4% around from top) */}
      {/* x = 76 + 62*cos(131°) = 35, y = 76 + 62*sin(131°) = 123 */}
      <circle cx="35" cy="123" r="3" fill="#E8E000" opacity="0.9">
        <animate attributeName="r" values="3;6;3" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2.4s" repeatCount="indefinite" />
      </circle>

      {/* Center text */}
      <text x="76" y="65" textAnchor="middle"
        fontFamily="'Bebas Neue', sans-serif" fontSize="30"
        fill="rgba(237,240,232,0.95)">614</text>
      <text x="76" y="79" textAnchor="middle"
        fontFamily="DM Sans, sans-serif" fontSize="9" fontWeight="600" letterSpacing="1.2"
        fill="rgba(237,240,232,0.28)">GB USED</text>
      <text x="76" y="92" textAnchor="middle"
        fontFamily="DM Sans, sans-serif" fontSize="9" letterSpacing="0.8"
        fill="rgba(237,240,232,0.15)">OF 1 TB</text>
    </svg>
  );
}
