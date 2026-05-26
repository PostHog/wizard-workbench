import 'dotenv/config'
import typescript from '@rollup/plugin-typescript'
import posthog from '@posthog/rollup-plugin'

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'es',
  },
  plugins: [
    typescript(),
    posthog({
      personalApiKey: process.env.POSTHOG_API_KEY,
      projectId: process.env.POSTHOG_PROJECT_ID,
      host: process.env.POSTHOG_HOST,
      sourcemaps: {
        enabled:true,
        deleteAfterUpload: false,
      },
    }),
  ],
}
