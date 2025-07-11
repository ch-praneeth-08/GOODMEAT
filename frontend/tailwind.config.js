/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#d9534f',
        'primary-hover': '#c9302c',
        whatsapp: '#25D366',
        'whatsapp-hover': '#128C7E',
        'brand-accent': '#E53935',
        background: '#1a1a1a',
        surface: '#2c2c2c',
        'surface-light': '#3f3f3f',
        'text-heading': '#d9534f',
        'text-body': '#e0e0e0',
        'text-muted': '#a0a0a0',
        border: '#444444',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
      keyframes: {
        'fade-in-out': {
          '0%': { opacity: '0', transform: 'translate(-50%, -100px)' },
          '15%': { opacity: '1', transform: 'translate(-50%, 0)' },
          '85%': { opacity: '1', transform: 'translate(-50%, 0)' },
          '100%': { opacity: '0', transform: 'translate(-50%, -100px)' },
        },
        'fadeInUp': {
            'from': { opacity: '0', transform: 'translateY(40px)' },
            'to': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'toast': 'fade-in-out 4s ease-in-out forwards',
        'fade-up': 'fadeInUp 0.8s ease-out forwards',
      }
    },
  },
  plugins: [],
}