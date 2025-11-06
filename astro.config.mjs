import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://zachcbenny.com',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  integrations: [react()],
  prefetch: { prefetchAll: true },
});
