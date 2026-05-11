/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3e8ff',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
        },
        accent: '#22d3ee',      // Cyan
        dark: '#1e2937',
        light: '#f8fafc',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}