import Link from "next/link";

// Figma assets — node 1:3 (Home page) — expires 7 days from 2026-04-01
const EARTH_SATELLITE_URL =
  "https://www.figma.com/api/mcp/asset/ef8c5c76-4f63-4780-9b8a-0b4790bd44e6";
const SIGNAL_ICON_URL =
  "https://www.figma.com/api/mcp/asset/2e7f6f1f-17aa-4dd2-a49f-b6cf674b8426";

export default function HomePage() {
  return (
    <main
      className="hero-bg relative w-full overflow-hidden"
      style={{ minHeight: "100dvh" }}
    >
      {/* ── Earth + satellite illustration ──────────────────────────────
          Figma canvas: 1512 × 982
          Figma node:   left=214 top=128 w=1408 h=725
          Converted:    14.15vw / 13vh / 93.12vw / 73.83vh              */}
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={EARTH_SATELLITE_URL}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* ── STARLINK wordmark + signal icon — Figma: left=90, top=60 ── */}
      <div
        className="absolute flex items-center anim-text hero-logo-row"
        style={{ left: "5.95vw", top: "6.1vh" }}
      >
        <span
          style={{
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
          STARLINK
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SIGNAL_ICON_URL}
          alt=""
          style={{
            marginLeft: "clamp(10px, 1.06vw, 16px)",
            width: "clamp(60px, 7.74vw, 117px)",
            height: "auto",
            opacity: 0.9,
          }}
        />
      </div>

      {/* ── Hero content ────────────────────────────────────────────────
          Figma: section starts at left=90, top=176 (h1 top)
          Subheading at top=358 → gap from h1 bottom (176+138=314): 44px
          Nav at top=469 → gap from p bottom (358+41=399): 70px         */}
      <section
        className="absolute flex flex-col hero-left"
        style={{ left: "5.95vw", top: "17.92vh" }}
        aria-label="Hero"
      >
        {/* Heading — Figma: Satoshi Bold 52px, w≈456px, h≈138px */}
        <h1
          className="anim-text-d1"
          style={{
            fontFamily: "Satoshi, 'DM Sans', 'Inter', sans-serif",
            fontSize: "clamp(28px, 3.44vw, 52px)",
            fontWeight: 700,
            lineHeight: 1.27,
            color: "#000",
            maxWidth: "clamp(300px, 30.16vw, 456px)",
          }}
        >
          Stay connected.
          <br />
          Wherever you go.
        </h1>

        {/* Subheading — Figma: Satoshi Regular 28px, top=358
            44px gap after h1 (top=358 − h1_bottom=314 = 44px)          */}
        <p
          className="anim-text-d2"
          style={{
            fontFamily: "Satoshi, 'DM Sans', 'Inter', sans-serif",
            fontSize: "clamp(16px, 1.85vw, 28px)",
            fontWeight: 400,
            color: "#000",
            maxWidth: "clamp(300px, 39.1vw, 591px)",
            marginTop: "clamp(24px, 4.49vh, 44px)",
            lineHeight: 1.46,
          }}
        >
          Built for travelers, explorers, and life off the grid.
        </p>

        {/* Nav links — Figma: Satoshi Medium 32px, tops 469/532/595
            70px gap from p bottom (399) to nav start (469)             */}
        <nav
          className="flex flex-col anim-text-d3"
          style={{ marginTop: "clamp(32px, 7.13vh, 70px)" }}
          aria-label="Primary"
        >
          {[
            { label: "Get Starlink", href: "/get-starlink" },
            { label: "Learn More",   href: "#learn-more"   },
            { label: "Q/A",          href: "#faq"          },
          ].map(({ label, href }, i) => (
            <Link
              key={label}
              href={href}
              className="nav-link"
              style={{
                fontFamily: "Satoshi, 'DM Sans', 'Inter', sans-serif",
                fontSize: "clamp(20px, 2.12vw, 32px)",
                fontWeight: 500,
                lineHeight: 1.34,
                marginTop: i === 0 ? 0 : "clamp(8px, 1.32vw, 20px)",
              }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </section>
    </main>
  );
}
