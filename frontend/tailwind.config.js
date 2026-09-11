/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        command: {
          bg: '#080C15',
          panel: '#0E1626',
          card: '#152033',
          border: '#1E2E48',
          hover: '#1B2942'
        },
        emergency: {
          DEFAULT: '#EF4444',
          glow: '#F87171',
          dark: '#991B1B'
        },
        accepting: '#10B981',
        limited: '#F59E0B',
        critical: '#F97316',
        full: '#EF4444',
        offline: '#6B7280',
        cyanAccent: '#06B6D4'
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
