/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#00100C',
        white: '#F8FFF9',
        brand: '#008f58',
        primary: {
          300: '#a4f6ca',
          400: '#2fd88d',
          600: '#008f58',
          700: '#008f58',
          900: '#036240',
        },
      },
      fontFamily: {
        heading: ['Figtree', 'system-ui', 'sans-serif'],
        body: ['Kanit', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xl': '1.375rem', // 22px
        '2xl': '1.625rem', // 26px
        '3xl': '2rem',     // 32px
      },
      spacing: {
        '18': '4.5rem',     // Larger touch targets
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}