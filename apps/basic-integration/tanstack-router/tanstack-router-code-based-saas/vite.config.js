import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const assetHost = env.VITE_PUBLIC_POSTHOG_ASSET_HOST
  const ingestHost = env.VITE_PUBLIC_POSTHOG_HOST

  return {
    plugins: [tailwindcss(), react()],
    server: {
      proxy: {
        '/ingest/static': {
          target: assetHost,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ingest/, ''),
        },
        '/ingest/array': {
          target: assetHost,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ingest/, ''),
        },
        '/ingest': {
          target: ingestHost,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ingest/, ''),
        },
      },
    },
  }
})
