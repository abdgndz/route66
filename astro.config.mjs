// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://route66drivingschool.co.uk',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap()],
});
