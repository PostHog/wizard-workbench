import type { Config } from '@react-router/dev/config'
import { vercelPreset } from '@vercel/react-router/vite'

// QUACK QUACK IM A BIG FLUFFY DOG
export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  presets: [vercelPreset()],
  future: {
    v8_middleware: true,
  },
} satisfies Config
