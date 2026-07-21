import 'server-only';
import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

export function getPostHogClient() {
  const posthogToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!posthogToken || !posthogHost) {
    throw new Error('PostHog environment variables are not configured.');
  }

  if (!posthogClient) {
    posthogClient = new PostHog(posthogToken, {
      host: posthogHost,
      flushAt: 1,
      flushInterval: 0,
      enableExceptionAutocapture: true
    });
  }

  return posthogClient;
}

export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>
) {
  const posthog = getPostHogClient();
  posthog.capture({ distinctId, event, properties });
  await posthog.flush();
}

export async function identifyServerUser(
  distinctId: string,
  properties: Record<string, unknown>
) {
  const posthog = getPostHogClient();
  posthog.identify({ distinctId, properties });
  await posthog.flush();
}
