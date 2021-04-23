module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'blue-dark': '#25306c',
      }
    },
    backdropFilter: {
      'none': 'none',
      'blur': 'blur(20px)',
      'blur-5': 'blur(5px)',
    },
  },
  
  variants: {
    opacity: ({ after }) => after(['disabled']),
    extend: {},
  },
  plugins: [
    require('tailwindcss-filters'),
  ],
}
