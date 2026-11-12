/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Redesign tokens (see the design export README)
        coral: {
          DEFAULT: "#ff6b57",
          dark: "#e55a47",
          hover: "#ff8371", // lighter on hover so dark button text keeps its contrast
          ink: "#b83a28", // coral for text and links: 4.5:1 on white
          light: "#fff4ed",
          soft: "#ffe1da",
        },
        paper: "#fcfaf9",
        card: "#ffffff",
        line: "#e2e8f0",
        ink: { DEFAULT: "#1f2937", 2: "#4b5563" },
        muted: "#6b7280",
        // Hour ruler bands: differ in lightness, not only hue
        band: { work: "#ffab9e", edge: "#ffe1da", night: "#f3f0ed" },
        // Status: always shown as a word plus a colour
        ok: { DEFAULT: "#0f6e4f", soft: "#e4f5ec" },
        warn: { DEFAULT: "#8a5a0b", soft: "#fcefd9" },
        sleep: { DEFAULT: "#475467", soft: "#eef0f4" },
        danger: { DEFAULT: "#b42318", soft: "#fef0ee" },

        // Old names, kept until every page is redesigned
        primary: "#ff6b57",
        "primary-dark": "#e55a47",
        "primary-accent": "#ff6b57",
        "primary-light": "#fff4ed",
        "bg-main": "#fcfaf9",
        "card-border": "#e2e8f0",
        "text-primary": "#1f2937",
      },
      fontFamily: {
        sans: ['"Instrument Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        // Google sign-in button only
        google: ["Roboto", "arial", "sans-serif"],
      },
      fontSize: {
        label: ["12px", { lineHeight: "16px", letterSpacing: "0.06em" }],
      },
      boxShadow: {
        card: "0 1px 2px rgb(31 41 55 / 0.05)",
        pop: "0 12px 32px -8px rgb(31 41 55 / 0.18), 0 2px 6px rgb(31 41 55 / 0.06)",
      },
      gridTemplateColumns: {
        24: "repeat(24, minmax(0, 1fr))",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
