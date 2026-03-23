// Type declarations for Angular CLI environment variables (NG_APP_ prefix)
declare interface Env {
  readonly NG_APP_POSTHOG_PROJECT_TOKEN: string;
  readonly NG_APP_POSTHOG_HOST: string;
  readonly [key: string]: string | undefined;
}

declare interface ImportMeta {
  readonly env: Env;
}
