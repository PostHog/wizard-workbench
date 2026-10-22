import 'server-only';

import { PostHog } from 'posthog-node';

const posthogProjectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

let posthogClient: PostHog | null = null;

function getPostHogClient() {
  if (!posthogProjectToken || !posthogHost) {
    if (process.env.NODE_ENV === 'development') {
      const missingVariable = !posthogProjectToken
        ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NEXT_PUBLIC_POSTHOG_HOST';
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
    }

    return null;
  }

  if (!posthogClient) {
    posthogClient = new PostHog(posthogProjectToken, {
      host: posthogHost,
      enableExceptionAutocapture: true,
      flushAt: 1,
      flushInterval: 0
    });
  }

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
  await posthog.flush();
}
