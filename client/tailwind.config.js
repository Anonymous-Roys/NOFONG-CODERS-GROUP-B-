/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      fontSize: {
        'xl': '1.5rem',     // 24px - better for seniors
        '2xl': '1.75rem',   // 28px
        '3xl': '2rem',      // 32px
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