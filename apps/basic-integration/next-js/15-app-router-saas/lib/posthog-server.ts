import { headers } from 'next/headers';
import { PostHog } from 'posthog-node';

type ServerEvent = {
  distinctId: string;
  event: string;
  properties?: Record<string, string | number | boolean | undefined>;
};

export async function captureServerEvent({
  distinctId,
  event,
  properties
}: ServerEvent) {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!token || !host) {
    if (process.env.NODE_ENV === 'development') {
      const missingVariable = token
        ? 'NEXT_PUBLIC_POSTHOG_HOST'
        : 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN';

      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
    }
    return;
  }

  const requestHeaders = await headers();
  const sessionId = requestHeaders.get('x-posthog-session-id');
  const posthog = new PostHog(token, {
    host,
    flushAt: 1,
    flushInterval: 0,
    enableExceptionAutocapture: true
  });

  posthog.capture({
    distinctId,
    event,
    properties: {
      ...properties,
      ...(sessionId ? { $session_id: sessionId } : {})
    }
  });

  await posthog.shutdown();
}
