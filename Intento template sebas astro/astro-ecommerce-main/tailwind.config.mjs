/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'green-custom': {
          'bottle': '#1e3a1a',
          'dark': '#2d5530', 
          'medium': '#4a7c59',
          'light': '#68a077',
          'pale': '#e8f5e8',
        }
      }
    },
  },
  plugins: [],
  important: true, // Esto hace que todas las clases de Tailwind usen !important
} 