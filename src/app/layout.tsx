import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "STARLINK — Stay connected. Wherever you go.",
  description:
    "Starlink satellite internet built for travelers, explorers, and life off the grid.",
  openGraph: {
    title: "STARLINK — Stay connected. Wherever you go.",
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
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
