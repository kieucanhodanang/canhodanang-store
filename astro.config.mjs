
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { rentalRedirects } from './scripts/rental-redirects.mjs';

export default defineConfig({
  site: 'https://canhodanang.store',

  output: 'static',

  build: {
    format: 'directory',
    inlineStylesheets: 'always'
  },

  integrations: [
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname;

        // Không đưa trang quản trị vào Sitemap
        return !pathname.startsWith('/admin') && pathname !== '/search-index.json' && !['/mau-giao-dien-du-an', '/mau-giao-dien-du-an/'].includes(pathname);
      }
    }),
    rentalRedirects()
  ]
});
