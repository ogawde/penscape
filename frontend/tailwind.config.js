/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: '#FAF8F1',
        gold: '#FAEAB1',
        teal: {
          DEFAULT: '#34656D',
          50: '#E8F0F2',
          100: '#D1E1E5',
          200: '#A3C3CB',
          300: '#75A5B1',
          400: '#478797',
          500: '#34656D',
          600: '#2A5157',
          700: '#1F3D41',
          800: '#15292C',
          900: '#0A1416',
        },
        darkgreen: '#334443',
      },
    },
  },
  plugins: [],
}

