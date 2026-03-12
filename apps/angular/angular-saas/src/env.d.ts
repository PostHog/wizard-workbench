// Type declarations for environment variables accessed via import.meta.env
declare interface ImportMeta {
  readonly env: {
    readonly NG_APP_POSTHOG_PROJECT_TOKEN?: string;
    readonly NG_APP_POSTHOG_HOST?: string;
    readonly [key: string]: string | undefined;
  };
}
