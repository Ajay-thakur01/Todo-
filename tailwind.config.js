/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Priority colors
        priority: {
          1: '#ef4444', // red-500
          2: '#f97316', // orange-500
          3: '#3b82f6', // blue-500
          4: '#9ca3af', // gray-400
        },
        // App surface colors
        surface: {
          DEFAULT: '#ffffff',
          dark: '#1a1a1a',
        },
      },
      width: {
        sidebar: '260px',
      },
      transitionProperty: {
        sidebar: 'width, transform, opacity',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
