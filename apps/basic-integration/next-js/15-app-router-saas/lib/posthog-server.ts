import 'server-only';

import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null | undefined;

function getPostHogClient() {
  if (posthogClient !== undefined) {
    return posthogClient;
  }

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!apiKey || !host) {
    if (process.env.NODE_ENV !== 'production') {
      const missingVariable = !apiKey
        ? 'NEXT_PUBLIC_POSTHOG_KEY'
        : 'NEXT_PUBLIC_POSTHOG_HOST';
      console.warn(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
    }
    posthogClient = null;
    return posthogClient;
  }

  posthogClient = new PostHog(apiKey, {
    host,
    enableExceptionAutocapture: true,
    flushAt: 1,
    flushInterval: 0,
    requestTimeout: 2000,
    fetchRetryCount: 0
  });

  return posthogClient;
}

export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, string | number | boolean | null | undefined>
) {
  const posthog = getPostHogClient();

  if (!posthog) {
    return;
  }

  posthog.capture({ distinctId, event, properties });
  await posthog.flush().catch(() => {});
}
