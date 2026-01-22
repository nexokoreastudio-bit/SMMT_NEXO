/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-navy': '#0f172a',
        'vibrant-orange': '#f97316',
        'light-gray': '#f8fafc',
      },
      fontFamily: {
        'sans': ['Noto Sans KR', 'Montserrat', 'sans-serif'],
        'display': ['Montserrat', 'Noto Sans KR', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
