// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import cloudflare from '@astrojs/cloudflare';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  adapter: cloudflare(),

  // Use the repo-root public/ directory for static assets
  // This preserves all images from the Next.js version
  publicDir: '../public',

  // We don't need sessions for this site (no auth/admin UI).
  // Configure a local-only session driver to avoid requiring a Cloudflare KV binding.
  session: {
    driver: 'memory'
  },

  vite: {
    plugins: [tailwindcss()]
  }
});