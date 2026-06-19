import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import posthog from '@posthog/rollup-plugin'

export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }
  return defineConfig({
    plugins: [
      react(),
      posthog({
        personalApiKey: process.env.POSTHOG_API_KEY,
        projectId: process.env.POSTHOG_PROJECT_ID,
        host: process.env.POSTHOG_HOST,
        sourcemaps: {
          enabled: true,
          deleteAfterUpload: true,
        },
      }),
    ],
  })
}
