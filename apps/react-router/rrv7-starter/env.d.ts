/// <reference types="vite/client" />

declare const __vercel: {
  url?: string
  env?: string
}

interface ImportMetaEnv {
  readonly VITE_SITE_URL: string | undefined
  readonly VITE_POSTHOG_KEY: string | undefined
  readonly VITE_POSTHOG_HOST: string | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
