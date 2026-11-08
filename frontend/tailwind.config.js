/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // CrisisSync ODS: Clinical Primary
        clinical: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          DEFAULT: '#2563EB'
        },
        // CrisisSync ODS: Semantic START Triage System
        triage: {
          critical: '#DC2626',
          criticalHover: '#B91C1C',
          criticalDark: '#EF4444',
          criticalSurfaceDark: '#450A0A',
          criticalSurfaceLight: '#FEF2F2',
          criticalBorderDark: '#7F1D1D',
          criticalBorderLight: '#FECACA',
          
          warning: '#D97706',
          warningHover: '#B45309',
          warningDark: '#F59E0B',
          warningSurfaceDark: '#451A03',
          warningSurfaceLight: '#FFFBEB',
          warningBorderDark: '#78350F',
          warningBorderLight: '#FDE68A',
          
          accepting: '#059669',
          acceptingHover: '#047857',
          acceptingDark: '#10B981',
          acceptingSurfaceDark: '#064E3B',
          acceptingSurfaceLight: '#ECFDF5',
          acceptingBorderDark: '#065F46',
          acceptingBorderLight: '#A7F3D0',
          
          telemetry: '#0284C7',
          telemetryDark: '#38BDF8',
          telemetrySurfaceDark: '#0C1929',
          telemetrySurfaceLight: '#F0F9FF',
          telemetryBorderDark: '#075985',
          telemetryBorderLight: '#BAE6FD',
        },
        // CrisisSync ODS: Solid Surfaces & Boundaries
        ops: {
          canvasDark: '#0B0F19',
          canvasLight: '#F8FAFC',
          surface1Dark: '#111827',
          surface1Light: '#FFFFFF',
          surface2Dark: '#1E293B',
          surface2Light: '#FFFFFF',
          surface3Dark: '#334155',
          surface3Light: '#F1F5F9',
          borderDark: '#334155',
          borderLight: '#CBD5E1',
          dividerDark: '#1E293B',
          dividerLight: '#E2E8F0',
        },
        // Preserved compatibility mappings for legacy references
        command: {
          bg: '#0B0F19',
          subtle: '#111827',
          panel: '#111827',
          card: '#1E293B',
          cardHover: '#263345',
          border: '#334155',
          borderLight: 'rgba(255, 255, 255, 0.08)',
          hover: '#263345'
        },
        emergency: {
          DEFAULT: '#DC2626',
          glow: '#EF4444',
          dark: '#991B1B'
        },
        accent: {
          cyan: '#0284C7',
          emerald: '#059669',
          indigo: '#2563EB',
          violet: '#6366F1',
          amber: '#D97706',
          rose: '#DC2626'
        },
        accepting: '#059669',
        limited: '#D97706',
        critical: '#DC2626',
        full: '#B91C1C',
        offline: '#64748B',
        cyanAccent: '#0284C7',
        brandPurple: {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
          light: '#DBEAFE',
          subtle: '#EFF6FF'
        },
        brandTeal: {
          DEFAULT: '#059669',
          dark: '#047857',
          light: '#D1FAE5'
        },
        canvas: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          darkBg: '#0B0F19',
          darkCard: '#111827'
        }
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'card-elevated': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'card-float': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'popover': '0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.15)',
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        // Controlled, non-bloated semantic focus shadows
        'glow-cyan': '0 0 0 2px rgba(56, 189, 248, 0.3)',
        'glow-emerald': '0 0 0 2px rgba(16, 185, 129, 0.3)',
        'glow-red': '0 0 0 2px rgba(239, 68, 68, 0.35)',
        'glow-amber': '0 0 0 2px rgba(245, 158, 11, 0.3)',
        'glow-purple': '0 0 0 2px rgba(59, 130, 246, 0.3)',
        'pill-dock': '0 4px 20px -2px rgba(0, 0, 0, 0.15)',
        'glass': '0 4px 20px -2px rgba(0, 0, 0, 0.12)',
        'glass-sm': '0 2px 8px -1px rgba(0, 0, 0, 0.1)'
      },
      borderRadius: {
        'control': '8px',
        'card': '12px',
        'modal': '16px'
      },
      animation: {
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flash-update': 'resourceHighlightFlash 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
      },
      keyframes: {
        resourceHighlightFlash: {
          '0%': { borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.15)' },
          '100%': { borderColor: 'inherit', backgroundColor: 'transparent' }
        }
      }
    },
  },
  plugins: [],
}
