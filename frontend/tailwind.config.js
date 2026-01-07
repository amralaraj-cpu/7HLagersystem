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
          DEFAULT: '#0066FF',
          50: '#E6F0FF',
          100: '#CCE0FF',
          200: '#99C2FF',
          300: '#66A3FF',
          400: '#3385FF',
          500: '#0066FF',
          600: '#0052CC',
          700: '#003D99',
          800: '#002966',
          900: '#001433'
        },
        secondary: {
          DEFAULT: '#00CC66',
          50: '#E6FFF3',
          100: '#CCFFE6',
          200: '#99FFCC',
          300: '#66FFB3',
          400: '#33FF99',
          500: '#00CC66',
          600: '#00A352',
          700: '#007A3D',
          800: '#005229',
          900: '#002914'
        },
        background: '#F5F7FA',
        card: '#FFFFFF',
        'text-primary': '#1A1A1A',
        'text-secondary': '#6B7280',
        border: '#E5E7EB'
      },
      fontFamily: {
        sans: ['Arial', '-apple-system', 'sans-serif'],
        mono: ['"Courier New"', 'monospace']
      }
    },
  },
  plugins: [],
};
