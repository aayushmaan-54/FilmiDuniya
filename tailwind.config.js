/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBg: '#080421',
        lightBg: '#ffffff',
        contrastDark: '#e00f34',
        contrastLight: '#5a56f0',
        primaryDark: '#12102b',
        primaryLight: '#a9a6b0',
        secondaryDark: '#26233d',
        secondaryLight: '#bebbc6',
        tertiaryDark: '#343447',
        tertiaryLight: '#f7f7f7',
        complementDark: '#6a667e',
        complementLight: '#f7f7f7',
        darkText: '#d9d5f7',
        lightText: '#4a4949',
      }
    },
  },
  plugins: [],
}