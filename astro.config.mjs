// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  redirects: {
    '/contact': '/booking'
  },
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()]
  }
});
