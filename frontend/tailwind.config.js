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
          bg: '#050811',
          subtle: '#080E1A',
          panel: '#0C1322',
          card: '#111B2E',
          cardHover: '#16233B',
          border: '#1E2C44',
          borderLight: 'rgba(255, 255, 255, 0.08)',
          hover: '#18263E'
        },
        emergency: {
          DEFAULT: '#EF4444',
          glow: '#F87171',
          dark: '#991B1B'
        },
        accent: {
          cyan: '#06B6D4',
          emerald: '#10B981',
          indigo: '#6366F1',
          violet: '#8B5CF6',
          amber: '#F59E0B',
          rose: '#F43F5E'
        },
        accepting: '#10B981',
        limited: '#F59E0B',
        critical: '#F97316',
        full: '#EF4444',
        offline: '#64748B',
        cyanAccent: '#06B6D4'
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -4px rgba(6, 182, 212, 0.35)',
        'glow-emerald': '0 0 25px -4px rgba(16, 185, 129, 0.35)',
        'glow-red': '0 0 25px -4px rgba(239, 68, 68, 0.35)',
        'glow-amber': '0 0 25px -4px rgba(245, 158, 11, 0.35)',
        'glow-purple': '0 0 25px -4px rgba(139, 92, 246, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.3)'
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'radar': 'radarSweep 4s linear infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        shimmer: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.9' }
        }
      }
    },
  },
  plugins: [],
}
