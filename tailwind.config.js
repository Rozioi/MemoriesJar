/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-pink": "#fdf2f8",
        "brand-purple": "#f3e8ff",
      },
      fontFamily: {
        cute: ["Comfortaa", "cursive"],
      },
    },
  },
  plugins: [],
};
