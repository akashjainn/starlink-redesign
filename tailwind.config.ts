import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-forest": "#0b1a10",
        "canvas-bg":   "#07120a",
        "page-tint":   "rgba(237,240,232,0.55)",
        teal:          "#6FAF8F",
        "teal-light":  "#9DD5B9",
        "gold-light":  "#FFE08A",
        "gold":        "#FFC94A",
        "sage-footer": "#dde4d8",
        ink:           "#1a1a1a",
      },
      fontFamily: {
        syne:   ["'Syne'", "sans-serif"],
        "dm-sans": ["'DM Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
