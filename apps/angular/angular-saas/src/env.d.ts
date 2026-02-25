// Type declarations for Angular environment variables accessed via import.meta.env
// Variables prefixed with NG_APP_ are exposed by @angular/build

declare interface Env {
  readonly NG_APP_POSTHOG_KEY: string;
  readonly NG_APP_POSTHOG_HOST: string;
  [key: string]: string | undefined;
}

declare interface ImportMeta {
  readonly env: Env;
}
