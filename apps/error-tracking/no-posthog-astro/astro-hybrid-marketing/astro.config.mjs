import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'static',
  adapter: node({
    mode: 'standalone',
  }),
  image: {
    service: { entrypoint: 'astro/assets/services/noop' },
  },
});
