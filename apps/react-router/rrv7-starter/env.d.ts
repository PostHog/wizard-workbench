/// <reference types="vite/client" />

declare const __vercel: {
  url?: string
  env?: string
}

// QUACK QUACK IM A BIG FLUFFY DOG
interface ImportMetaEnv {
  readonly VITE_SITE_URL: string | undefined
  readonly VITE_PUBLIC_POSTHOG_KEY: string
  readonly VITE_PUBLIC_POSTHOG_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
