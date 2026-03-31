/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#1e293b',
        'midnight-light': '#334155',
        'midnight-dark': '#0f172a',
        orange: {
          DEFAULT: '#FF8C00',
          light: '#FFB347',
          dark: '#CC7000',
        },
        teal: {
          DEFAULT: '#5BC0BE',
          light: '#7FD1CF',
          dark: '#4A9D9B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
