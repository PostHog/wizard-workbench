export function capturePostHogEvent(
  event: string,
  properties?: Record<string, string | number | boolean>,
) {
  if (
    typeof window === "undefined" ||
    !import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ||
    !import.meta.env.VITE_PUBLIC_POSTHOG_HOST
  ) {
    return;
  }

  void import("posthog-js").then(({ default: posthog }) => {
    posthog.capture(event, properties);
  });
}
