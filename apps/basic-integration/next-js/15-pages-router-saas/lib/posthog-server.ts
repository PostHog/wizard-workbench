import type { NextApiRequest } from 'next';
import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

function getPostHogClient() {
  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!projectToken) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(
        'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
      );
    }
    return null;
  }

  if (!host) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(
        'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured'
      );
    }
    return null;
  }

  if (!posthogClient) {
    posthogClient = new PostHog(projectToken, {
      host,
      enableExceptionAutocapture: true,
      flushAt: 1,
      flushInterval: 0
    });
  }

  return posthogClient;
}

export async function captureServerEvent(
  req: NextApiRequest,
  distinctId: string,
  event: string,
  properties: Record<string, unknown> = {}
) {
  const posthog = getPostHogClient();

  if (!posthog) {
    return;
  }

  const sessionId = req.headers['x-posthog-session-id'];
  const eventProperties =
    typeof sessionId === 'string'
      ? { ...properties, $session_id: sessionId }
      : properties;

  posthog.capture({ distinctId, event, properties: eventProperties });
  await posthog.flush();
}
