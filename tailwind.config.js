/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heebo: ['Heebo', 'sans-serif'],
        rubik: ['Rubik', 'sans-serif'],
        display: ['Fraunces', 'Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        // Brand palette — Aegean blue + cream + terracotta
        brand: {
          blue: {
            50: '#E8F1F9',
            100: '#C5DCEF',
            200: '#8FB9DF',
            300: '#5A96CF',
            400: '#2C77BC',
            500: '#0B5FA5', // primary
            600: '#094E89',
            700: '#073D6C',
            800: '#052D50',
            900: '#031D34',
          },
          cream: {
            50: '#FDFBF6',
            100: '#FAF6EE', // primary surface
            200: '#F2EAD6',
            300: '#E8DCBE',
            400: '#D9C798',
          },
          terracotta: {
            50: '#FBEFE8',
            100: '#F5D7C5',
            200: '#EAAE8A',
            300: '#DD8550',
            400: '#C0552B', // accent
            500: '#9C4421',
            600: '#7A3519',
          },
          ink: {
            50: '#F5F5F5',
            900: '#1A1A1A',
          },
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.06)',
        lift: '0 8px 24px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.04)',
        pop: '0 24px 48px rgba(15, 23, 42, 0.16), 0 4px 12px rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [],
};
