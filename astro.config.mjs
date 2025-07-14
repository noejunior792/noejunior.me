import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
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
      'import.meta.env.PUBLIC_WEBHOOK_URL': JSON.stringify(process.env.PUBLIC_WEBHOOK_URL)
    }
  }
});
