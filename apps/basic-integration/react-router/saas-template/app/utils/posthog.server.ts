import { PostHog } from "posthog-node";

let hasWarnedAboutMissingPostHogKey = false;

type CaptureServerEventArgs = {
  distinctId: string;
  event: string;
  properties?: Record<string, boolean | number | string>;
  request: Request;
};

export async function captureServerEvent({
  distinctId,
  event,
  properties,
  request,
}: CaptureServerEventArgs) {
  const apiKey = process.env.VITE_POSTHOG_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production" && !hasWarnedAboutMissingPostHogKey) {
      console.warn(
        "VITE_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_KEY is configured",
      );
      hasWarnedAboutMissingPostHogKey = true;
    }
    return;
  }

  const posthog = new PostHog(apiKey, {
    enableExceptionAutocapture: true,
    fetchRetryCount: 0,
    flushAt: 1,
    flushInterval: 0,
    host: process.env.VITE_POSTHOG_HOST,
    requestTimeout: 2_000,
  });

  try {
    posthog.capture({
      distinctId,
      event,
      properties: {
        ...properties,
        $session_id: request.headers.get("X-POSTHOG-SESSION-ID") ?? undefined,
      },
    });
  } catch {
    // Analytics must not interrupt the user's action.
  } finally {
    await posthog.shutdown().catch(() => {});
  }
}
