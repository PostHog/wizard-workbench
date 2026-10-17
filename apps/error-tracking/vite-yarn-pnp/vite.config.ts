import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { compression } from 'vite-plugin-compression2'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: process.env.BASE_PATH ?? '/',
  plugins: [
    react(),
    // Pre-compress assets for the static host; skipped in dev for faster reloads.
    mode === 'production' &&
      compression({
        algorithms: ['gzip', 'brotliCompress'],
        exclude: [/\.map$/],
      }),
  ],
  build: {
    sourcemap: 'hidden',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          analytics: ['posthog-js'],
        },
      },
    },
  },
}))
