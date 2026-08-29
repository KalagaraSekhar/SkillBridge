/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2E2A6B',
          50: '#F4F3FB',
          100: '#E8E6F7',
          200: '#D2CEEF',
          300: '#ACA4DF',
          400: '#7E72C8',
          500: '#5B4EB0',
          600: '#433792',
          700: '#2E2A6B',
          800: '#242055',
          900: '#1B1740',
        },
        accent: {
          DEFAULT: '#FF6B5E',
          hover: '#FA5849',
          light: '#FFF0EE',
          dark: '#E04E41',
        },
        tealSuccess: {
          DEFAULT: '#1FAE8B',
          light: '#E7F7F3',
          dark: '#168B6F',
        },
        surface: {
          DEFAULT: '#FAF9F6',
          card: '#FFFFFF',
          muted: '#F3F2EE',
          border: '#E8E6DF',
        },
        charcoal: {
          DEFAULT: '#1F1F29',
          light: '#353545',
        },
        slateSub: {
          DEFAULT: '#6B6B7B',
          light: '#9494A3',
          dark: '#4B4B58',
        }
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(46, 42, 107, 0.06), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
        'soft': '0 8px 24px -4px rgba(46, 42, 107, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 16px 36px -6px rgba(46, 42, 107, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.05)',
        'soft-hover': '0 20px 40px -8px rgba(46, 42, 107, 0.16), 0 10px 20px -5px rgba(255, 107, 94, 0.12)',
        'coral-glow': '0 8px 25px -4px rgba(255, 107, 94, 0.35)',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '28px',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        }
      }
    },
  },
  plugins: [],
}
