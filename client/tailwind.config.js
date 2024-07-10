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
      },
      colors: {
        mainColor: '#3C239F', 
        secondaryColor: '#F9A826',
      },
    },
  },
  plugins: [],
}

