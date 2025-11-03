/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: "#a67c52",
        latte: "#f3e5ab",
        mocha: "#6f4e37",
        cream: "#f5f0e1",
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        paper: "0 2px 5px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
}
