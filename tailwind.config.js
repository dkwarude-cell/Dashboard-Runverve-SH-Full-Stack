/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#030213",
          50: "#f0f0ff",
          100: "#e0e0fe",
          200: "#b9b8fe",
          300: "#8a88fd",
          400: "#5b58fb",
          500: "#3b37f5",
          600: "#2721d9",
          700: "#1e18b0",
          800: "#19148f",
          900: "#161375",
          950: "#030213",
        },
        accent: {
          DEFAULT: "#d4183d",
          50: "#fef2f3",
          100: "#fde6e8",
          200: "#fbd0d6",
          300: "#f7aab5",
          400: "#f27a8e",
          500: "#e84d6a",
          600: "#d4183d",
          700: "#b31235",
          800: "#961232",
          900: "#80132f",
          950: "#470515",
        },
        background: "#ffffff",
        foreground: "#030213",
        muted: {
          DEFAULT: "#f1f5f9",
          foreground: "#64748b",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#030213",
        },
        border: "#e2e8f0",
        input: "#e2e8f0",
        ring: "#030213",
        destructive: {
          DEFAULT: "#d4183d",
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#10b981",
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#f59e0b",
          foreground: "#ffffff",
        },
        info: {
          DEFAULT: "#3b82f6",
          foreground: "#ffffff",
        },
        chart: {
          1: "#e84d6a",
          2: "#3b82f6",
          3: "#10b981",
          4: "#f59e0b",
          5: "#8b5cf6",
        },
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
