/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {
    colors: {
      black: 'rgba(15, 15, 15, 1)',
      grey: 'rgba(162, 162, 162, 1)',
      primary: 'rgba(58, 89, 209, 1)',
      secondary: 'rgba(71, 187, 142, 1)',
      white: 'rgba(249, 249, 249, 1)',
      'variable-collection-grey': 'rgba(68, 68, 68, 1)',
    },
    fontFamily: {
      poppins: ['Poppins', 'Helvetica'],
    },
    fontSize: {
      'body-bold': ['16px', { fontWeight: 700 }],
      'body-medium': ['16px', { fontWeight: 500 }],
      'body-regular': ['16px', { fontWeight: 400, letterSpacing: '0.32px', lineHeight: '149.84%' }],
      'caption-bold': ['12px', { fontWeight: 700 }],
      'heading-1-bold': ['32px', { fontWeight: 700 }],
      'heading-2-bold': ['24px', { fontWeight: 700 }],
      'heading-3-bold': ['20px', { fontWeight: 700 }],
      'subhead-bold': ['14px', { fontWeight: 700 }],
    },
  } },
  plugins: [],
});
