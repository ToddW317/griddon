/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E4D2B',  // Forest Green
          light: '#2A6E3F',
          dark: '#153920',
        },
        secondary: {
          DEFAULT: '#C8102E',  // Football Red
          light: '#E31837',
          dark: '#A00C24',
        },
        accent: {
          DEFAULT: '#FFB81C',  // Gold
          light: '#FFCC33',
          dark: '#CC9916',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F4F4F5',
          tertiary: '#E4E4E7',
        },
        text: {
          DEFAULT: '#18181B',
          secondary: '#3F3F46',
          tertiary: '#71717A',
        }
      },
    },
  },
  plugins: [],
} 