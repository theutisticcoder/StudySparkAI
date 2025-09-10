/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007aff',
        secondary: '#6b7280',
        background: '#f8f9fa',
        'card-bg': '#ffffff',
        'text-primary': '#212529',
        'text-secondary': '#495057',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        flip: {
          'from': { transform: 'rotateY(0deg)' },
          'to': { transform: 'rotateY(180deg)' },
        },
        'flip-back': {
          'from': { transform: 'rotateY(180deg)' },
          'to': { transform: 'rotateY(0deg)' },
        }
      },
      animation: {
        flip: 'flip 0.6s ease-in-out',
        'flip-back': 'flip-back 0.6s ease-in-out',
      }
    }
  },
  plugins: [],
}