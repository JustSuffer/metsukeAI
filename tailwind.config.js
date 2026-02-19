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
        gold: '#C0C0C0', // Changed to silver to avoid yellow
        dark: '#0B0B0D',
        background: '#0B0B0D',
        foreground: '#FFFFFF',
        'sidebar-background': '#121212',
        primary: {
          DEFAULT: '#6E000C', // Bordo
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#a3a3a3', // Neutral Grey instead of Gold
          foreground: '#0B0B0D',
        },
        muted: {
          DEFAULT: '#1a1a1a',
          foreground: '#a3a3a3',
        },
        border: '#27272a',
        input: '#27272a',
        ring: '#D4AF37',
        card: {
            DEFAULT: '#121212',
            foreground: '#FFFFFF'
        },
        popover: {
            DEFAULT: '#0B0B0D',
            foreground: '#FFFFFF'
        },
        accent: {
            DEFAULT: '#27272a',
            foreground: '#FFFFFF'
        },
        destructive: {
            DEFAULT: '#7f1d1d',
            foreground: '#FFFFFF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Cleaner, modern sans-serif
        serif: ['Merriweather', 'serif'], // kept for headings if needed, but primary is sans
      },
    },
  },
  plugins: [],
}
