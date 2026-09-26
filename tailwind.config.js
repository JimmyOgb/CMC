/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cmc: {
          blue: '#3861FB',
          navy: '#0C1024',
          dark: '#080B1A',
          card: '#12172E',
          border: '#1E2548',
          subtext: '#8B94B2',
          green: '#16C784',
          red: '#EA3943',
          gold: '#F5AC37',
          cyan: '#00F0FF',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
