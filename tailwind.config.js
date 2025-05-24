/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dev-primary': '#2563eb',
        'dev-secondary': '#7c3aed',
        'dev-accent': '#16a34a',
        'dev-dark': '#111827',
        'dev-gray': '#1f2937',
      },
      animation: {
        'window-open': 'windowOpen 0.2s ease-out',
      },
      keyframes: {
        windowOpen: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}