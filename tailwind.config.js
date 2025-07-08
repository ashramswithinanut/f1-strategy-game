/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // F1 Racing Colors
        'f1-red': '#FF1E1E',
        'f1-silver': '#C0C0C0',
        'f1-black': '#15151E',
        'f1-yellow': '#FFD700',
        'f1-green': '#00FF41',
        'f1-blue': '#0070F3',
        
        // Team Colors
        'volley-yellow': '#FFD700',
        'volley-gold': '#FFA500',
        'storm-blue': '#1E3A8A',
        'valkyrie-purple': '#7C3AED',
        
        // UI Colors
        'pit-wall': '#1A1A2E',
        'track-green': '#16213E',
        'tyre-soft': '#FF0000',
        'tyre-medium': '#FFFF00',
        'tyre-hard': '#FFFFFF',
        'tyre-inter': '#0000FF',
        'tyre-wet': '#00FF00',
      },
      fontFamily: {
        'racing': ['Orbitron', 'monospace'],
      },
      animation: {
        'pulse-fast': 'pulse 0.5s infinite',
        'bounce-slow': 'bounce 2s infinite',
      }
    },
  },
  plugins: [],
} 