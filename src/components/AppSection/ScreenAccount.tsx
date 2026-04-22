import DataArcRing from "./DataArcRing";
import ConstellationNav from "./ConstellationNav";

export default function ScreenAccount() {
  return (
    <div style={{
      width: "280px",
      height: "560px",
      background: "#080810",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "0",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Background stars */}
      <svg
        width="280" height="560"
        viewBox="0 0 280 560"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {[
          [20,30],[55,18],[80,50],[230,25],[260,55],
          [240,90],[15,110],[250,140],[28,180],[265,200],
          [12,250],[270,260],[22,320],[258,340],[18,400],
          [262,420],[30,480],[250,500],[140,20],[140,540],
        ].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y}
            r={i % 3 === 0 ? 0.7 : 0.4}
            fill={`rgba(237,240,232,${0.06 + (i % 4) * 0.04})`}
            className={`twinkle-${(i % 4) + 1}`}
          />
        ))}
      </svg>

      {/* Zone 1 — Name hero */}
      <div style={{
        position: "relative",
        zIndex: 10,
        textAlign: "center",
        paddingTop: "48px",
        marginBottom: "4px",
      }}>
        {/* Live indicator */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          marginBottom: "10px",
        }}>
          <span className="live-dot" />
          <span style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "8px",
            fontWeight: 700,
            letterSpacing: "1.4px",
            color: "rgba(58,217,255,0.8)",
          }}>ONLINE</span>
        </div>

        {/* First name */}
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "38px",
          letterSpacing: "0.04em",
          color: "rgba(237,240,232,0.95)",
          lineHeight: 1.0,
        }}>VIKTOR</div>

        {/* Last name — intentionally dimmer */}
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "28px",
          letterSpacing: "0.04em",
          color: "rgba(237,240,232,0.35)",
          lineHeight: 1.0,
          marginBottom: "8px",
        }}>HENDELMANN</div>

        {/* Terminal ID */}
        <div style={{
          fontFamily: "monospace",
          fontSize: "7px",
          letterSpacing: "1px",
          color: "rgba(58,217,255,0.35)",
        }}>VIKTOR-STARLINK</div>
      </div>

      {/* Zone 2 — Data arc ring */}
      <div style={{ position: "relative", zIndex: 10, marginTop: "12px", marginBottom: "8px" }}>
        <DataArcRing />
      </div>

      {/* Zone 3 — Constellation nav */}
      <div style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        padding: "0 14px",
        flex: 1,
      }}>
        <ConstellationNav />

        {/* Sign out */}
        <div style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "9px",
          fontWeight: 600,
          letterSpacing: "1.4px",
          color: "rgba(237,240,232,0.22)",
          cursor: "pointer",
          textTransform: "uppercase",
          marginTop: "4px",
        }}>
          SIGN OUT
        </div>
      </div>
    </div>
  );
}
