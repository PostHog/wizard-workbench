type PostHogLogLevel = "info" | "warn" | "error";
type PostHogLogAttributes = Record<string, string | number | boolean>;

const hasPostHogConfiguration = Boolean(
  import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
);

export function logToPostHog(
  level: PostHogLogLevel,
  body: string,
  attributes?: PostHogLogAttributes,
): void {
  if (!hasPostHogConfiguration) return;

  void import("posthog-js").then(({ default: posthog }) => {
    posthog.logger[level](body, attributes);
  });
}
