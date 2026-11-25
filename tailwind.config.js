/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        seed: {
          DEFAULT: "#39FF00",
          light: "#66ff33",
          dark: "#2eb800",
          accent: "#39FF00",
          glow: "rgba(57, 255, 0, 0.3)",
        },
        brand: {
          green: "#39FF00",
          black: "#0a0a0a",
          dark: "#141414",
          surface: "#f8f9fa",
        },
        charcoal: {
          DEFAULT: "#111111",
          light: "#1c1c1c",
          subtle: "#262626",
          dark: "#0a0a0a",
        },
        whatsapp: {
          DEFAULT: "#25D366",
          dark: "#128C7E",
          hover: "#1ebd5c",
        },
        terracotta: {
          DEFAULT: "#111111",
          hover: "#39FF00",
          light: "#39FF00",
          50: "#f0fdf4",
          100: "#dcfce7",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif"
        ],
        serif: [
          "Playfair Display",
          "Didot",
          "Bodoni MT",
          "Georgia",
          "serif"
        ],
        editorial: [
          "Playfair Display",
          "Didot",
          "Bodoni MT",
          "Georgia",
          "serif"
        ],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
