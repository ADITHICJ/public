/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6EEF9',
          100: '#CCDDF3',
          200: '#99BBE7',
          300: '#6699DB',
          400: '#3377CF',
          500: '#3366CC', // Main primary color
          600: '#2952A3',
          700: '#1F3D7A',
          800: '#142952',
          900: '#0A1429',
        },
        secondary: {
          50: '#E6F7F6',
          100: '#CCEFED',
          200: '#99DFDB',
          300: '#66CFC9',
          400: '#33BFB7',
          500: '#00A99D', // Main secondary color
          600: '#00877E',
          700: '#00655E',
          800: '#00433F',
          900: '#00221F',
        },
        accent: {
          50: '#FFF5E6',
          100: '#FFEACC',
          200: '#FFD699',
          300: '#FFC166',
          400: '#FFAD33',
          500: '#FF9900', // Main accent color
          600: '#CC7A00',
          700: '#995C00',
          800: '#663D00',
          900: '#331F00',
        },
        success: {
          50: '#E6F9EF',
          100: '#CCF3DF',
          200: '#99E7BF',
          300: '#66DB9F',
          400: '#33CF7F',
          500: '#00C851', // Main success color
          600: '#00A041',
          700: '#007831',
          800: '#005020',
          900: '#002810',
        },
        warning: {
          50: '#FFF9E6',
          100: '#FFF3CC',
          200: '#FFE799',
          300: '#FFDB66',
          400: '#FFCF33',
          500: '#FFBB33', // Main warning color
          600: '#CC9529',
          700: '#997020',
          800: '#664B16',
          900: '#33250B',
        },
        error: {
          50: '#FFEAEC',
          100: '#FFD6D9',
          200: '#FFADB3',
          300: '#FF848D',
          400: '#FF5B67',
          500: '#FF4444', // Main error color
          600: '#CC3636',
          700: '#992929',
          800: '#661B1B',
          900: '#330E0E',
        },
        neutral: {
          50: '#F5F7FA',
          100: '#E4E7EB',
          200: '#CBD2D9',
          300: '#9AA5B1',
          400: '#7B8794',
          500: '#616E7C',
          600: '#52606D',
          700: '#3E4C59',
          800: '#323F4B',
          900: '#1F2933',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};