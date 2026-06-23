import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const posthogHost = env.VITE_PUBLIC_POSTHOG_HOST
  const posthogAssetsHost = posthogHost
    ? posthogHost.replace('://us.i.', '://us-assets.i.').replace('://eu.i.', '://eu-assets.i.')
    : undefined

  return {
    plugins: [tailwindcss(), react()],
    server: {
      proxy: {
        ...(posthogAssetsHost && {
          '/ingest/static': {
            target: posthogAssetsHost,
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/ingest/, ''),
          },
          '/ingest/array': {
            target: posthogAssetsHost,
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/ingest/, ''),
          },
        }),
        ...(posthogHost && {
          '/ingest': {
            target: posthogHost,
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/ingest/, ''),
          },
        }),
      },
    },
  }
})
