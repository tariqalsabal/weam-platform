import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-tajawal)", "Tajawal", "sans-serif"],
      },
      colors: {
        brand: {
          teal: "#15C3B2",
          tealDark: "#0C8C81",
          violet: "#7C5CFF",
          indigo: "#4A3AFF",
          pink: "#FF5C9D",
          coral: "#FF6B5B",
          gold: "#FFC23C",
          sky: "#36C5FF",
          green: "#22C58B",
          red: "#FF5B6E",
          ink: "#0a1030",
        },
      },
      borderRadius: {
        xl: "18px",
        "2xl": "24px",
        "3xl": "30px",
      },
      boxShadow: {
        glow: "0 12px 26px rgba(0,0,0,.25)",
        glowLg: "0 22px 50px rgba(0,0,0,.40)",
      },
      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translateY(22px)" },
          to: { opacity: "1", transform: "none" },
        },
        floatY: {
          "0%,100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-26px) scale(1.12)" },
        },
      },
      animation: {
        rise: "rise .6s cubic-bezier(.2,.8,.2,1) both",
        floatY: "floatY 9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
