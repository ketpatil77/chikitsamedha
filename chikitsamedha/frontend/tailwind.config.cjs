/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        emerald: '#0EA47A',
        deep: '#0B3B2E',
        gold: '#C9A227',
        ink: '#0C0F14',
        cloud: '#F6F8FB',
      },
      boxShadow: {
        ambient: '0 20px 60px rgba(14,164,122,0.25)'
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}
