/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'green-custom': '#4a7c59',
        'green-custom-dark': '#2d5530',
        'green-bottle': '#1e3a1a',
      },
    },
  },
  plugins: [],
} 