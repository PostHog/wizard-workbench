/// <reference types="vite/client" />

declare const __vercel: {
  url?: string
  env?: string
}

interface ImportMetaEnv {
  readonly VITE_SITE_URL: string | undefined
  readonly VITE_PUBLIC_POSTHOG_PROJECT_TOKEN: string
  readonly VITE_PUBLIC_POSTHOG_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
