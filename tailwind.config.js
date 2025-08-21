/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,tsx,ts,jsx}", "./components/**/*.{js,jsx,ts,tsx}", "./hooks/**/*.{js,tsx,ts,jsx}", "./styles/**/*.{js,tsx,ts,jsx}",],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}