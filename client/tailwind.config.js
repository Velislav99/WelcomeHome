/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['Fredoka One', 'cursive'], // Add Fredoka One to the font family
        lato: ['Lato', 'sans-serif'],
      },
      colors: {
        mainColor: '#3C239F', 
        secondaryColor: '#E2A3A3',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}

