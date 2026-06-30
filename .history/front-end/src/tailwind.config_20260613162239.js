/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'accent-orange': '#f97316',
        'accent-blue': '#3b82f6',
        'accent-green': '#22c55e',
        'accent-yellow': '#eab308',
        'accent-red': '#ef4444',
        'ink': '#1e293b',
        'canvas': '#ffffff',
        'charcoal': '#475569',
        'mute': '#94a3b8',
        'ash': '#cbd5e1',
        'hairline': '#e2e8f0',
        'hairline-strong': '#cbd5e1',
        'surface-card': '#ffffff',
        'surface-deep': '#f1f5f9',
        'surface-elevated': '#f8fafc',
        'body': '#475569',
        'stone': '#94a3b8'
      },
      fontFamily: {
        'display-xxl': ['Outfit', 'sans-serif'],
        'display-lg': ['Outfit', 'sans-serif'],
        'heading-sm': ['Outfit', 'sans-serif'],
        'subtitle': ['Plus Jakarta Sans', 'sans-serif'],
        'caption': ['Plus Jakarta Sans', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        'button-md': ['Plus Jakarta Sans', 'sans-serif'],
        'body-sm': ['Plus Jakarta Sans', 'sans-serif']
      }
    }
  },
  plugins: [],
}