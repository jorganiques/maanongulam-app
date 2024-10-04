/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        recia: ['Recia', 'sans-serif'],
        zina: ['Zina', 'serif'],
      },
    },
  },
  plugins: [],
}