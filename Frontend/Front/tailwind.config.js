// tailwind.config.js
module.exports = {
  content: [
    // ... tus archivos
  ],
  theme: {
    extend: {
      animation: {
        'fade-in-down': 'fade-in-down 0.5s ease-out forwards',
        'bounce-once-slow': 'bounce-once-slow 2s ease-in-out 1', // Anima una sola vez
      },
      keyframes: {
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'bounce-once-slow': {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-20px)' },
          '60%': { transform: 'translateY(-10px)' },
        },
      },
      // Puedes definir tus propios degradados personalizados si quieres
      backgroundImage: {
        'gradient-custom': 'linear-gradient(to right, var(--tw-gradient-stops))', // Para usar con bg-gradient-custom
      }
    },
  },
  plugins: [],
}