import 'server-only';
import { PostHog } from 'posthog-node';

let client: PostHog | null | undefined;

function getClient() {
  if (client !== undefined) {
    return client;
  }

  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!token || !host) {
    if (process.env.NODE_ENV !== 'production') {
      const missing = !token
        ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NEXT_PUBLIC_POSTHOG_HOST';
      console.error(
        `${missing} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missing} is configured`
      );
    }
    client = null;
    return client;
  }

  client = new PostHog(token, {
    host,
    enableExceptionAutocapture: true,
    flushAt: 1,
    flushInterval: 0
  });
  return client;
}

export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, string | number | boolean | null | undefined>
) {
  const posthog = getClient();
  if (!posthog) {
    return;
  }

  posthog.capture({ distinctId, event, properties });
  await posthog.flush();
}
