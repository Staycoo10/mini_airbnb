/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'airbnb-primary': '#E61E4D',
        'airbnb-dark': '#D70466',
      }
    },
  },
  plugins: [],
}