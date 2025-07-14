import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    mdx(),
    tailwind(),
    react(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'dracula',
      wrap: true
    }
  },
  vite: {
      define: {
        'import.meta.env.WEBHOOK_URL': JSON.stringify(process.env.PUBLIC_WEBHOOK_URL)
      }
    }
});
