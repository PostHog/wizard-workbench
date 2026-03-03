declare interface Env {
  readonly NODE_ENV: string;
  readonly NG_APP_POSTHOG_KEY: string;
  readonly NG_APP_POSTHOG_HOST: string;
}

declare interface ImportMeta {
  readonly env: Env;
}
