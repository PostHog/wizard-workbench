export function capture(
  event: string,
  properties: Record<string, unknown>,
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
