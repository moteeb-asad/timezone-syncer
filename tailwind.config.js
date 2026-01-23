/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ff6b57",
        "primary-dark": "#e55a47",
        "primary-accent": "#ff6b57",
        "primary-light": "#fff4ed",
        "bg-main": "#fcfaf9",
        "card-border": "#e2e8f0",
        "text-primary": "#1f2937",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.375rem",
        lg: "0.75rem",
        xl: "1rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
