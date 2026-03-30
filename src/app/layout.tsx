import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import "./globals.css";

// Barlow Bold used as Sansation fallback (geometric bold, closest Google Fonts match)
const barlow = Barlow({
  weight: ["700", "800"],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Starlink — Stay connected. Wherever you go.",
  description:
    "Starlink satellite internet built for travelers, explorers, and life off the grid.",
  openGraph: {
    title: "Starlink — Stay connected. Wherever you go.",
    description:
      "High-speed satellite internet for van lifers, hikers, climbers, and remote adventurers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Satoshi from Fontshare — primary UI font */}
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${barlow.variable} antialiased`}>{children}</body>
    </html>
  );
}
