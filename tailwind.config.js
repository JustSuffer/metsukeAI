/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bordo: '#6E000C',
        gold: '#D4AF37',
        dark: '#0B0B0D',
        paper: '#E6E1D6',
      },
    },
  },
  plugins: [],
}
