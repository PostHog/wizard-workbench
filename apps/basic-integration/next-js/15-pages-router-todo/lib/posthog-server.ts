import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null | undefined;

export function getPostHogClient(): PostHog | null {
  if (posthogClient !== undefined) {
    return posthogClient;
  }

  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!token || !host) {
    if (process.env.NODE_ENV !== 'production') {
      const missing = !token
        ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NEXT_PUBLIC_POSTHOG_HOST';
      throw new Error(
        `${missing} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missing} is configured`,
      );
    }

    posthogClient = null;
    return posthogClient;
  }

  posthogClient = new PostHog(token, {
    host,
    enableExceptionAutocapture: true,
    flushAt: 1,
    flushInterval: 0,
  });

  return posthogClient;
}

export async function captureServerEvent(
  req: { headers: Record<string, string | string[] | undefined> },
  event: string,
  properties?: Record<string, boolean | number | string>,
) {
  const posthog = getPostHogClient();

  if (!posthog) {
    return;
  }

  const distinctId = req.headers['x-posthog-distinct-id'];
  const sessionId = req.headers['x-posthog-session-id'];

  if (typeof distinctId !== 'string') {
    return;
  }

  posthog.capture({
    distinctId,
    event,
    properties: {
      ...properties,
      ...(typeof sessionId === 'string' ? { $session_id: sessionId } : {}),
    },
  });
  await posthog.flush();
}
