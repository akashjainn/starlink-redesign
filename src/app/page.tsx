import Image from "next/image";
import Link from "next/link";
import SplineScene from "@/components/SplineScene";

export default function HomePage() {
  return (
    <main
      className="hero-bg relative w-full overflow-hidden"
      style={{ minHeight: "100dvh" }}
    >
      {/* ── Spline 3D Scene ─────────────────────────────────────────────
          Positioned to match the earth+satellite placement in Figma:
          left: 214/1512 = 14.16%, top: 128/982 = 13.03%
          width: 1408/1512 = 93.12%, height: 725/982 = 73.83%         */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          left: "14.16%",
          top: "13.03%",
          width: "93.12%",
          height: "73.83%",
        }}
      >
        <SplineScene />
      </div>

      {/* ── Header logo ─────────────────────────────────────────────────
          Figma: "STARLINK" at left=90, top=60, 64px Sansation Bold
          Logo icon at left=390, top=38, 181.5×99px                   */}
      <header
        className="absolute flex items-center"
        style={{ left: 90, top: 38 }}
      >
        <span
          className="select-none text-black"
          style={{
            fontFamily:
              "var(--font-barlow), 'Arial Black', 'Trebuchet MS', sans-serif",
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-0.5px",
            marginTop: 22, /* align baseline: logo top=38, text top=60 */
          }}
        >
          STARLINK
        </span>

        {/* Starlink satellite/wifi icon from user's brand assets */}
        <div
          className="relative ml-5 shrink-0 opacity-90"
          style={{ width: 181, height: 99 }}
        >
          <Image
            src="/starlink-logo.png"
            alt=""
            fill
            className="object-contain"
            priority
          />
        </div>
      </header>

      {/* ── Hero copy ───────────────────────────────────────────────────
          Figma left col starts at left=90                             */}
      <section
        className="absolute flex flex-col"
        style={{ left: 90, top: 176 }}
      >
        {/* Heading — Figma: Satoshi Bold 52px, w≈456px */}
        <h1
          className="text-black"
          style={{
            fontFamily: "Satoshi, 'DM Sans', 'Inter', sans-serif",
            fontSize: 52,
            fontWeight: 700,
            lineHeight: 1.27,
            maxWidth: 456,
          }}
        >
          Stay connected.
          <br />
          Wherever you go.
        </h1>

        {/* Subheading — Figma: Satoshi Regular 28px, top=358
            offset from section top (176): 358-176 = 182px            */}
        <p
          className="text-black"
          style={{
            fontFamily: "Satoshi, 'DM Sans', 'Inter', sans-serif",
            fontSize: 28,
            fontWeight: 400,
            lineHeight: 1.46,
            maxWidth: 591,
            marginTop: 182,
          }}
        >
          Built for travelers, explorers, and life off the grid.
        </p>

        {/* Nav links — Figma: Satoshi Medium 32px
            Figma tops: 469, 532, 595
            Offset from section top (176): 293, 356, 419
            Gap between links: 63px                                    */}
        <nav
          className="flex flex-col"
          style={{ marginTop: 111 }}
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
                fontSize: 32,
                fontWeight: 500,
                lineHeight: 1.34,
                marginTop: i === 0 ? 0 : 20,
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
