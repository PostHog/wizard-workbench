declare interface Env {
  readonly NODE_ENV: string;
  readonly NG_APP_POSTHOG_PROJECT_TOKEN: string;
  readonly NG_APP_POSTHOG_HOST: string;
  [key: string]: string | undefined;
}

declare interface ImportMeta {
  readonly env: Env;
}
