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
    },
  },
  plugins: [],
}
