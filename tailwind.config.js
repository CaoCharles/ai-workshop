/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0E5A38",
          dark: "#0a3a26",
          light: "#1C8B5A",
          lighter: "#37A871",
        },
        cream: "#FAF7F0",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Noto Sans TC", "sans-serif"],
      },
    },
  },
  plugins: [],
};
