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
        gold: '#D4AF37', // Kept for accents, but primary text will be white
        dark: '#0B0B0D',
        // 'paper' removed or set to white for main text base
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Cleaner, modern sans-serif
        serif: ['Merriweather', 'serif'], // kept for headings if needed, but primary is sans
      },
    },
  },
  plugins: [],
}
