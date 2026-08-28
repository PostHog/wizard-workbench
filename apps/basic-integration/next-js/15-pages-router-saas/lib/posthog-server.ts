import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

function getPostHogClient() {
  if (posthogClient) {
    return posthogClient;
  }

  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!projectToken || !host) {
    if (process.env.NODE_ENV === 'development') {
      const missingVariable = projectToken
        ? 'NEXT_PUBLIC_POSTHOG_HOST'
        : 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN';

      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
    }

    return null;
  }

  posthogClient = new PostHog(projectToken, {
    host,
    enableExceptionAutocapture: true,
    flushAt: 1,
    flushInterval: 0
  });

  return posthogClient;
}

export async function captureServerEvent(
  distinctId: number | string,
  event: string,
  properties?: Record<string, boolean | number | string | undefined>
) {
  const posthog = getPostHogClient();

  if (!posthog) {
    return;
  }

  posthog.capture({
    distinctId: String(distinctId),
    event,
    properties
  });

  await posthog.flush();
}
