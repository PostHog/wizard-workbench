type EventProperties = Record<string, boolean | number | string | undefined>;

export function capturePosthogEvent(
  event: string,
  properties?: EventProperties,
) {
  if (
    !import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ||
    !import.meta.env.VITE_PUBLIC_POSTHOG_HOST
  )
    return;

  void import("posthog-js").then(({ default: posthog }) => {
    posthog.capture(event, properties);
  });
}

export function logPosthogInfo(message: string, attributes?: EventProperties) {
  if (
    !import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ||
    !import.meta.env.VITE_PUBLIC_POSTHOG_HOST
  )
    return;

  void import("posthog-js").then(({ default: posthog }) => {
    posthog.logger.info(message, attributes);
  });
}
