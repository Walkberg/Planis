/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neo-yellow': '#FFFDE7',
        'neo-cyan': '#00D9FF',
        'neo-orange': '#ff6b35',
        'neo-purple': '#7B2FBE',
        'neo-amber': '#F7931E',
        'neo-green': '#3DDC97',
      },
      boxShadow: {
        'neo': '2px 2px 0 #000',
        'neo-md': '4px 4px 0 #000',
        'neo-lg': '6px 6px 0 #000',
        'neo-xl': '8px 8px 0 #000',
      },
      fontFamily: {
        'space': ['"Space Mono"', 'monospace'],
      },
      keyframes: {
        "in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        "in": "in 0.2s ease-out",
        "out": "out 0.2s ease-in",
      },
    },
  },
  plugins: [],
}
