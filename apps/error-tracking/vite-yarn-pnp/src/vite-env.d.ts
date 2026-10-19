/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PH_PROJECT_TOKEN: string
  readonly VITE_PH_API_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
