type EventProperties = Record<string, boolean | number | string>;

export function capturePosthogEvent(
  event: string,
  properties?: EventProperties,
) {
  if (typeof window === "undefined") return;

  void import("./posthog.client").then(
    ({ default: posthog, isPosthogConfigured }) => {
      if (isPosthogConfigured) {
        posthog.capture(event, properties);
      }
    },
  );
}
