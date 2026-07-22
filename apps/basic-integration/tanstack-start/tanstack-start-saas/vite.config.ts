import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig, loadEnv } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    server: {
      port: 3000,
      proxy: {
        '/ingest/static': {
          target: env.POSTHOG_ASSET_HOST,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ingest/, ''),
          secure: false,
        },
        '/ingest/array': {
          target: env.POSTHOG_ASSET_HOST,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ingest/, ''),
          secure: false,
        },
        '/ingest': {
          target: env.VITE_PUBLIC_POSTHOG_HOST,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ingest/, ''),
          secure: false,
        },
      },
    },
    plugins: [
      tailwindcss(),
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      tanstackStart({
        srcDirectory: 'src',
      }),
      viteReact(),
      nitro(),
    ],
  }
})
