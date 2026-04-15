declare interface ImportMeta {
  readonly env: {
    readonly [key: string]: string | undefined;
    readonly NG_APP_POSTHOG_PROJECT_TOKEN: string | undefined;
    readonly NG_APP_POSTHOG_HOST: string | undefined;
  };
}
