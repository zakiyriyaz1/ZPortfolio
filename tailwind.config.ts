// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)"],
        cyber: ["var(--font-cyber)"],
      },
      colors: {
        dark: "#0a0a0a", // This is your new background color
        trueBlack: "#000000",
        light: "#fff",
        accent: "#22d3ee", 
        accentDark: "#64ffda",
        gray: "#747474",
      },
      boxShadow: {
        'cyan-glow': '0 0 15px rgba(34, 211, 238, 0.4)',
      },
      keyframes: {
        // Page entrance. Animates TRANSFORM ONLY -- never opacity.
        //
        // Opacity-based entrances are what caused pages to render invisible:
        // if the animation stalls, content that starts at opacity 0 is stuck
        // unseen. A transform-only animation can't do that -- the worst case
        // is content sitting a few pixels off, still fully readable.
        rise: {
          '0%': { transform: 'translateY(14px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        rise: 'rise 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
export default config;