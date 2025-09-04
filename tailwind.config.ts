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
      animation: {
        'spin-slow': 'spin 8s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;