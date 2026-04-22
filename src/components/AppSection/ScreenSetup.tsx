const NODES = [
  { label: "SETUP",     step: 1, state: "done"    },
  { label: "POWER",     step: 2, state: "done"    },
  { label: "CONNECT",   step: 3, state: "active"  },
  { label: "CONFIGURE", step: 4, state: "pending" },
  { label: "FINISH",    step: 5, state: "pending" },
] as const;

type NodeState = typeof NODES[number]["state"];

const NODE_COLOR: Record<NodeState, string> = {
  done:    "#3ad9ff",
  active:  "#3ad9ff",
  pending: "rgba(237,240,232,0.15)",
};

const LABEL_OPACITY: Record<NodeState, number> = {
  done:    0.9,
  active:  1.0,
  pending: 0.35,
};

export default function ScreenSetup() {
  const beamX = 80;
  const topY = 130;
  const bottomY = 460;
  const step = (bottomY - topY) / (NODES.length - 1);

  const beamPath = `M ${beamX} ${bottomY} L ${beamX} ${topY}`;

  return (
    <svg width="280" height="560" viewBox="0 0 280 560" style={{ display: "block", background: "#080810" }}>
      <defs>
        <filter id="beamGlowV" x="-200%" y="-20%" width="500%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="nodeGlow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <path id="vBeamPath" d={beamPath} />
      </defs>

      {/* Star field */}
      {[
        [200,50],[230,80],[250,120],[215,160],[240,200],
        [180,240],[210,280],[245,310],[220,360],[200,400],
        [160,60],[170,140],[185,210],[175,310],[190,430],
      ].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 0.7 : 0.4}
          fill={`rgba(237,240,232,${0.08 + (i % 4) * 0.06})`}
          className={`twinkle-${(i % 4) + 1}`}
        />
      ))}

      {/* Active step label */}
      <text x="140" y="88" textAnchor="middle"
        fontFamily="'Bebas Neue', sans-serif" fontSize="40" letterSpacing="0.05em"
        fill="#3ad9ff">CONNECT</text>
      <text x="140" y="104" textAnchor="middle"
        fontFamily="DM Sans, sans-serif" fontSize="8" fontWeight="600" letterSpacing="1.4"
        fill="rgba(237,240,232,0.3)">STEP 3 OF 5</text>

      {/* Vertical beam rail */}
      <line x1={beamX} y1={topY} x2={beamX} y2={bottomY}
        stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />

      {/* Beam glow */}
      <line x1={beamX} y1={topY} x2={beamX} y2={bottomY}
        stroke="rgba(58,217,255,0.18)" strokeWidth="2"
        filter="url(#beamGlowV)" />

      {/* Beam particles (travel upward) */}
      {[0, 0.4, 0.8, 1.2, 1.6, 2.0].map((offset, i) => (
        <circle key={i} r={i % 2 === 0 ? 2 : 1.5}
          fill={i % 2 === 0 ? "#3ad9ff" : "rgba(58,217,255,0.5)"}>
          <animateMotion dur={`${2.2 + (i % 3) * 0.3}s`} begin={`${offset}s`} repeatCount="indefinite">
            <mpath href="#vBeamPath" />
          </animateMotion>
        </circle>
      ))}

      {/* Nodes */}
      {NODES.map((node, i) => {
        const cy = bottomY - i * step;
        const isActive = node.state === "active";
        const isDone   = node.state === "done";
        return (
          <g key={node.label}>
            {/* Pulse ring for active */}
            {isActive && (
              <circle cx={beamX} cy={cy} r="8" fill="none" stroke="rgba(58,217,255,0.3)" strokeWidth="1">
                <animate attributeName="r" values="8;18;8" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0;0.8" dur="2.2s" repeatCount="indefinite" />
              </circle>
            )}
            {/* Node circle */}
            <circle cx={beamX} cy={cy} r={isActive ? 6 : 4}
              fill={NODE_COLOR[node.state]}
              stroke={isDone ? "none" : "rgba(237,240,232,0.1)"}
              strokeWidth="1"
              filter={isActive ? "url(#nodeGlow)" : undefined}
            />
            {/* Checkmark for done nodes */}
            {isDone && (
              <text x={beamX} y={cy + 3} textAnchor="middle"
                fontFamily="DM Sans, sans-serif" fontSize="6" fill="#080810" fontWeight="700">✓</text>
            )}
            {/* Step label */}
            <text x={beamX + 18} y={cy - 4}
              fontFamily="DM Sans, sans-serif" fontSize="8" fontWeight="700" letterSpacing="1.2"
              fill={`rgba(237,240,232,${LABEL_OPACITY[node.state]})`}>
              {node.label}
            </text>
            <text x={beamX + 18} y={cy + 7}
              fontFamily="DM Sans, sans-serif" fontSize="7" letterSpacing="0.5"
              fill={`rgba(237,240,232,${LABEL_OPACITY[node.state] * 0.5})`}>
              STEP {node.step}
            </text>
          </g>
        );
      })}

      {/* Bottom status */}
      <rect x="90" y="490" width="100" height="22" rx="11"
        fill="rgba(232,224,0,0.1)" stroke="rgba(232,224,0,0.25)" strokeWidth="0.8" />
      <text x="140" y="505" textAnchor="middle"
        fontFamily="DM Sans, sans-serif" fontSize="8" fontWeight="700" letterSpacing="1.4"
        fill="rgba(232,224,0,0.9)">SEARCHING…</text>
    </svg>
  );
}
