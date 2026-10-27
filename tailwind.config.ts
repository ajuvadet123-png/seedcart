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
        terracotta: {
          DEFAULT: "#b85d43",
          hover: "#a34e36",
          light: "#c86d51",
          50: "#fbf3f0",
          100: "#f6e4de",
        },
        warm: {
          50: "#fdfbf9",
          100: "#fbf8f5",
          150: "#f7f4ee",
          200: "#f2ece1",
          300: "#e6dcce",
          400: "#d3c2ad",
          500: "#bda58d",
          600: "#9f866e",
          700: "#7c6753",
          800: "#5d4c3d",
          900: "#3d3228",
        },
        charcoal: {
          DEFAULT: "#141414",
          light: "#222222",
          subtle: "#2a2a2a",
        },
        whatsapp: {
          DEFAULT: "#25D366",
          dark: "#128C7E",
          hover: "#1ebd5c",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
