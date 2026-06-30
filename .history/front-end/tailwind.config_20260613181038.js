/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#fafaf9',
        surface: {
          card: '#ffffff',
          deep: '#f5f5f4',
          elevated: '#fafaf9',
        },
        ink: '#1c1917',
        charcoal: '#57534e',
        ash: '#78716c',
        mute: '#a8a29e',
        stone: '#d6d3d1',
        hairline: {
          DEFAULT: '#e7e5e4',
          strong: '#d6d3d1',
        },
        divider: {
          soft: '#e7e5e4',
        },
        accent: {
          orange: '#ea580c',
          'orange-glow': '#fff7ed',
          blue: '#0369a1',
          'blue-glow': '#f0f9ff',
          green: '#15803d',
          'green-glow': '#f0fdf4',
          yellow: '#a16207',
          'yellow-glow': '#fefce8',
          red: '#dc2626',
          'red-glow': '#fef2f2',
        }
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}