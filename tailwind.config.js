/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",           // 👈 Important for root app
    "./app/**/*.{js,jsx,ts,tsx}",      // 👈 Includes screens & tabs
    "./components/**/*.{js,jsx,ts,tsx}", // 👈 In case you add custom components
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
