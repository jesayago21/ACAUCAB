// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';


// https://astro.build/config
export default defineConfig({
  // Order matters here! `sentry()` should come before `spotlightjs()`
  integrations: [
    react(), 
    tailwind()
  ],
  server: {
    port: 3000
  }
});
