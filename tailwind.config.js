/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        Poppins:[ "Poppins", "sans-serif"],
        LondrinaOutline:["Londrina Outline", "sans-serif"],
        workSans:[ "Work Sans", "sans-serif"],
        inter:["Inter", "sans-serif"]
      },
      wordBreak: {
        'break-all': 'break-all', // Custom class for word-break-all
        'break-word': 'break-word', // Custom class for break-word
      }
    },
  },
  // plugins: [],
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    // ...
  ],
}

