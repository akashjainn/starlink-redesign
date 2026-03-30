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
        cream:      "#F7F6F2",
        "sky-light":"#C4DEED",
        sky:        "#A8D0E6",
        teal:       "#8CC0BB",
        green:      "#6FAF8F",
        ink:        "#1a1a1a",
      },
    },
  },
  plugins: [],
};

export default config;
