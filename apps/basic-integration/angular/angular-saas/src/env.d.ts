declare interface ImportMetaEnv {
  readonly NG_APP_POSTHOG_PROJECT_TOKEN?: string;
  readonly NG_APP_POSTHOG_HOST?: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
