/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'limon-dark': '#0d1f17',
        'limon-gold': '#c8860a',
        'limon-earth': '#1c0f05',
        'limon-cream': '#f0e6cc',
        'limon-red': '#7c2d12',
        'limon-amber': '#e59c19',
        'limon-jungle': '#0f3d2e',
        'limon-leaf': '#1b533f',
        'limon-charcoal': '#1a1009',
        'limon-sand': '#ebe1c5',
        'limon-border': '#d8caa7',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Outfit', 'system-ui', 'sans-serif'],
        label: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { 
            transform: 'scale(1)', 
            boxShadow: '0 4px 18px rgba(200, 134, 10, 0.32), 0 0 0 1px rgba(200, 134, 10, 0.45)' 
          },
          '50%': { 
            transform: 'scale(1.025)', 
            boxShadow: '0 8px 30px rgba(200, 134, 10, 0.55), 0 0 0 2px rgba(229, 156, 25, 0.8)' 
          },
        },
        'smoke-rise': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(18px) scale(0.96)',
            filter: 'blur(3px)'
          },
          '60%': { 
            opacity: '0.85', 
            transform: 'translateY(-2px) scale(1.01)',
            filter: 'blur(0.5px)'
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0) scale(1)',
            filter: 'blur(0)'
          },
        },
        bob: {
          '0%, 100%': { 
            transform: 'translateY(0)' 
          },
          '50%': { 
            transform: 'translateY(-6px)' 
          },
        },
        'ember-float': {
          '0%': { 
            transform: 'translateY(0) translateX(0) scale(0.7)', 
            opacity: '0' 
          },
          '20%': { 
            opacity: '0.85' 
          },
          '80%': { 
            opacity: '0.6' 
          },
          '100%': { 
            transform: 'translateY(-140px) translateX(24px) scale(0.2)', 
            opacity: '0' 
          },
        },
        'line-grow': {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        candlelight: {
          '0%, 100%': { opacity: '0.88', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
      },
      animation: {
        heartbeat: 'heartbeat 2.4s ease-in-out infinite',
        'smoke-rise': 'smoke-rise 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        bob: 'bob 3s ease-in-out infinite',
        'ember-float': 'ember-float 6s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'line-grow': 'line-grow 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        candlelight: 'candlelight 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
