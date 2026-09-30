import { PostHog } from 'posthog-node';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

type EventProperties = Record<string, string | number | boolean | undefined>;

export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: EventProperties
) {
  if (!posthogKey) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        'NEXT_PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_KEY is configured'
      );
    }
    return;
  }

  if (!posthogHost) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured'
      );
    }
    return;
  }

  const posthog = new PostHog(posthogKey, {
    host: posthogHost,
    flushAt: 1,
    flushInterval: 0,
    enableExceptionAutocapture: true
  });

  posthog.capture({ distinctId, event, properties });
  await posthog.shutdown();
}
