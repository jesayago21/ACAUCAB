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
  // Usar !important selectivamente - solo para layout y componentes principales
  important: [
    '.autopago-main',
    '.bg-green-500',
    '.bg-green-600', 
    '.bg-blue-500',
    '.bg-blue-600',
    '.text-white',
    '.rounded-lg',
    '.rounded-xl',
    '.shadow-lg',
    '.shadow-xl',
    '.grid',
    '.flex',
    '.sticky',
    '.fixed',
    '.absolute',
    '.relative'
  ],
} 