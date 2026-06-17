/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#1a1a14',
          800: '#2a2a20',
          700: '#3a3a30',
          600: '#4a4a40',
        },
        silk: {
          100: '#faf4e4',
          200: '#f5e6c8',
          300: '#ecd4a4',
          400: '#d9bc7e',
        },
        vermilion: {
          500: '#c8323c',
          600: '#a82832',
          700: '#882028',
        },
        bronze: {
          400: '#7a9a8b',
          500: '#5c7a6b',
          600: '#426051',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', 'SimSun', 'serif'],
        kai: ['"KaiTi"', '"STKaiti"', '"楷体"', 'serif'],
      },
      animation: {
        'scroll-unfold': 'scrollUnfold 1.2s ease-out forwards',
        'ink-spread': 'inkSpread 0.8s ease-out forwards',
        'fog-drift': 'fogDrift 8s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
      },
      keyframes: {
        scrollUnfold: {
          '0%': { maxHeight: '0', opacity: '0' },
          '100%': { maxHeight: '10000px', opacity: '1' },
        },
        inkSpread: {
          '0%': { transform: 'scale(0.2)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fogDrift: {
          '0%, 100%': { transform: 'translateX(-2%)', opacity: '0.4' },
          '50%': { transform: 'translateX(2%)', opacity: '0.7' },
        },
        fadeUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
