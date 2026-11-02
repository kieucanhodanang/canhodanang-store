
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://canhodanang.store',
  output: 'static',
  build: {
    format: 'directory'
  }
});
