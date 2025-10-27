/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Active le mode dark avec la classe 'dark'
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      // Personnalisation pour un design confortable
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      lineHeight: {
        'relaxed': '1.75',
        'loose': '2',
      },
    }
  },
  plugins: []
};

