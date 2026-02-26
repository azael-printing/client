/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0b74b9",
        bgLight: "#eef7fb",
        success: "#22c55e",
        warning: "#facc15",
        danger: "#fb923c",
        info: "#3b82f6",
      },
      fontFamily: {
        sans: ["Segoe UI Variable", "Segoe UI", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
