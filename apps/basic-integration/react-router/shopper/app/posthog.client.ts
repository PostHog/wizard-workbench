type PostHogLogAttribute = string | number | boolean;

interface PostHogClient {
  capture: (event: string, properties?: Record<string, unknown>) => void;
  logger: {
    info: (
      message: string,
      attributes?: Record<string, PostHogLogAttribute>
    ) => void;
  };
}

declare global {
  interface Window {
    posthog?: PostHogClient;
  }
}

export function capturePostHogEvent(
  event: string,
  properties?: Record<string, unknown>
) {
  if (typeof window !== "undefined") {
    window.posthog?.capture(event, properties);
  }
}

export function logPostHogInfo(
  message: string,
  attributes?: Record<string, PostHogLogAttribute>
) {
  if (typeof window !== "undefined") {
    window.posthog?.logger.info(message, attributes);
  }
}
