/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        violetDark: '#a78bfa', // violet pour le texte en dark mode
      },
    },
  },
  plugins: [],
};
