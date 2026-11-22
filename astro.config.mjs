
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { rentalRedirects } from './scripts/rental-redirects.mjs';

export default defineConfig({
  site: 'https://canhodanang.store',

  output: 'static',

  build: {
    format: 'directory'
  },

  integrations: [
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname;

        // Không đưa trang quản trị vào Sitemap
        return !pathname.startsWith('/admin') && !['/mau-giao-dien-du-an', '/mau-giao-dien-du-an/'].includes(pathname);
      }
    }),
    rentalRedirects()
  ]
});
