/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          emergency: "hsl(var(--ac-emergency))",
          telemetry: "hsl(var(--ac-telemetry))",
          drone: "hsl(var(--ac-drone))",
          warning: "hsl(var(--ac-warning))",
        },
      },
      fontFamily: {
        display: ["var(--font-inter)", "sans-serif"],
        tactical: ["var(--font-monospace)", "monospace"],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addUtilities }) {
      addUtilities({
        .bg-grid-pattern: {
          backgroundImage: "url('/grid-pattern.svg')",
        },
        .bg-grid-pattern-dark: {
          backgroundImage: "url('/grid-pattern-dark.svg')",
          backgroundSize: "20px 20px",
        },
      })
    },
  ],
}