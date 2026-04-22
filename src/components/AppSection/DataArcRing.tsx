const CX = 76, CY = 76, R = 62;
const CIRC = 2 * Math.PI * R;  // 389.56
const PCT = 0.614;
const USED = CIRC * PCT;        // 239.19

// endpoint at 61.4% ≈ (35.3, 122.8)
const endAngle = (-90 + PCT * 360) * (Math.PI / 180);
const EX = +(CX + R * Math.cos(endAngle)).toFixed(1);
const EY = +(CY + R * Math.sin(endAngle)).toFixed(1);

export default function DataArcRing() {
  return (
    <svg width="152" height="152" viewBox="0 0 152 152">
      {/* Remaining track — visible so used vs remaining is obvious */}
      <circle cx={CX} cy={CY} r={R}
        fill="none"
        stroke="rgba(237,240,232,0.12)"
        strokeWidth="7" />

      {/* Used arc — solid cyan */}
      <circle cx={CX} cy={CY} r={R}
        fill="none"
        stroke="#3ad9ff"
        strokeWidth="7"
        strokeDasharray={`${USED.toFixed(1)} ${CIRC.toFixed(1)}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${CX} ${CY})`} />

      {/* Endpoint pulse */}
      <circle cx={EX} cy={EY} r="5" fill="rgba(58,217,255,0.18)">
        <animate attributeName="r" values="5;11;5" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0;0.7" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <circle cx={EX} cy={EY} r="3.5" fill="#3ad9ff" />

      {/* Center labels */}
      <text x={CX} y="62" textAnchor="middle"
        fontFamily="DM Sans, sans-serif" fontSize="8" fontWeight="700" letterSpacing="1.4"
        fill="rgba(58,217,255,0.55)">DATA USED</text>
      <text x={CX} y="88" textAnchor="middle"
        fontFamily="'Bebas Neue', sans-serif" fontSize="28"
        fill="rgba(237,240,232,0.95)">614 GB</text>
      <text x={CX} y="102" textAnchor="middle"
        fontFamily="DM Sans, sans-serif" fontSize="8" fontWeight="600" letterSpacing="1"
        fill="rgba(237,240,232,0.25)">OF 1 TB · 61.4%</text>
    </svg>
  );
}
