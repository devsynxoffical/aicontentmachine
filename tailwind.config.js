/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#02A3B1",
        darkTeal: "#017A85",
        lightTeal: "#E0F7FA",
        gold: "#F9BE00",
        navy: "#1A1A2E",
        grayText: "#6B7280",
        lightGray: "#F4F6F8",
      },
    },
  },
  plugins: [],
}