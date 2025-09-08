/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./App.{js,jsx,ts,tsx}",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'red-orange': {
            '50': '#fff1f1',
            '100': '#ffe1e0',
            '200': '#ffc7c6',
            '300': '#ffa09e',
            '400': '#ff6b67',
            '500': '#fc3e39',
            '600': '#ea1d18',
            '700': '#c51510',
            '800': '#a31511',
            '900': '#861916',
            '950': '#490806',
          },
          black: '#111111',
          darkgray: '#767676',
          lightgray: '#DBDBDB',
        },
      },
    },
    plugins: [],
  }  