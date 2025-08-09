/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores primarios del sistema BioEntry
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // Índigo principal
          600: '#5b21b6',
          700: '#4c1d95',
          800: '#3730a3',
          900: '#312e81',
        },
        // Colores de estado
        success: {
          50: '#f0fdf4',
          500: '#10b981', // Verde éxito
          600: '#059669',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b', // Ámbar advertencia
          600: '#d97706',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444', // Rojo error
          600: '#dc2626',
        },
        info: {
          50: '#eff6ff',
          500: '#3b82f6', // Azul información
          600: '#2563eb',
        },
        // Grises personalizados
        gray: {
          50: '#f8fafc',   // Fondos claros
          100: '#f1f5f9',  // Bordes suaves
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',  // Texto secundario
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',  // Texto principal
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 25px 0 rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}