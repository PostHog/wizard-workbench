declare interface Env {
  readonly NG_APP_POSTHOG_KEY: string;
  readonly NG_APP_POSTHOG_HOST: string;
  [key: string]: string | undefined;
}

declare interface ImportMeta {
  readonly env: Env;
}
