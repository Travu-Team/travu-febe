/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { 
    extend: {
      // Simplified breakpoints - no overlapping ranges
      screens: {
        'xs': '475px',      // Small phones
        'sm': '640px',      // Large phones
        'md': '768px',      // Tablets  
        'lg': '1024px',     // Laptops
        'xl': '1280px',     // Desktops
        '2xl': '1536px',    // Large desktops
      },
      
      colors: {
        black: '#0f0f0f',
        grey: '#a2a2a2', 
        primary: '#3a59d1',
        secondary: '#47bb8e',
        white: '#f9f9f9',
        'variable-collection-grey': '#444444',
      },
      
      fontFamily: {
        poppins: ['Poppins', 'Helvetica', 'Arial', 'sans-serif'],
      },
      
      fontSize: {
        'body-bold': ['16px', { fontWeight: '700', lineHeight: '1.5' }],
        'body-medium': ['16px', { fontWeight: '500', lineHeight: '1.5' }],
        'body-regular': ['16px', { 
          fontWeight: '400', 
          letterSpacing: '0.32px', 
          lineHeight: '1.498' 
        }],
        'caption-bold': ['12px', { fontWeight: '700', lineHeight: '1.4' }],
        'heading-1-bold': ['32px', { fontWeight: '700', lineHeight: '1.2' }],
        'heading-2-bold': ['24px', { fontWeight: '700', lineHeight: '1.3' }],
        'heading-3-bold': ['20px', { fontWeight: '700', lineHeight: '1.4' }],
        'subhead-bold': ['14px', { fontWeight: '700', lineHeight: '1.4' }],
      },

      // Custom spacing untuk konsistensi
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // Animation improvements
      animation: {
        'bounce-slow': 'bounce 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'ping-slow': 'ping 3s ease-in-out infinite',
      },

      // Box shadows
      boxShadow: {
        'hero': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },

      // Backdrop blur
      backdropBlur: {
        'xs': '2px',
      },
    } 
  },
  plugins: [],
});