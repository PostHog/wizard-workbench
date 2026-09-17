import { headers } from 'next/headers';
import { PostHog } from 'posthog-node';

type ServerEvent = {
  distinctId: string;
  event: string;
  properties?: Record<string, string | number | boolean | null | undefined>;
};

export async function captureServerEvent({
  distinctId,
  event,
  properties
}: ServerEvent) {
  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!projectToken || !host) {
    if (process.env.NODE_ENV === 'development') {
      const missingVariable = !projectToken
        ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NEXT_PUBLIC_POSTHOG_HOST';

      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
    }

    return;
  }

  const posthog = new PostHog(projectToken, {
    host,
    flushAt: 1,
    flushInterval: 0,
    enableExceptionAutocapture: true
  });

  const sessionId = (await headers()).get('x-posthog-session-id');

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
