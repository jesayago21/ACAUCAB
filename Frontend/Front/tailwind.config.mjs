/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#2E7D32',      // Verde oscuro y sólido
        'primary-hover': '#1B5E20', // Un poco más oscuro para el hover
        secondary: '#A5D6A7',    // Verde más claro
        accent: '#66BB6A',       // Verde vibrante para acentos
        background: '#E8F5E9',   // Verde muy pálido, casi blanco
      },
      animation: {
        // ... existing code ...
      }
    },
  },
  plugins: [],
  important: true, // Esto hace que todas las clases de Tailwind usen !important
} 