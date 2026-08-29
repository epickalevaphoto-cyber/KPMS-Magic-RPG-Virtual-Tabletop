/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-chocolate': '#3B2A20',
        'walnut': '#7B5E4A',
        'caramel': '#A67C52',
        'warm-beige': '#D1B89A',
        'vanilla-cream': '#F2E7D5',
        'soft-ivory': '#FAF7F0',
      },
      fontFamily: {
        'serif': ['"Times New Roman"', 'serif'],
        'sans': ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
