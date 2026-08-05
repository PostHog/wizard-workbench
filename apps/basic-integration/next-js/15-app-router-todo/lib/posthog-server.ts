import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

function getPostHogClient() {
  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!projectToken || !host) {
    if (process.env.NODE_ENV === 'development') {
      if (!projectToken) {
        console.error(
          new Error(
            'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
          )
        );
      }

      if (!host) {
        console.error(
          new Error(
            'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured'
          )
        );
      }
    }

    return null;
  }

  if (!posthogClient) {
    posthogClient = new PostHog(projectToken, {
      host,
      enableExceptionAutocapture: true,
      flushAt: 1,
      flushInterval: 0,
    });
  }

  return posthogClient;
}

export async function captureServerEvent(
  event: string,
  properties?: Record<string, boolean>
) {
  const posthog = getPostHogClient();

  if (!posthog) {
    return;
  }

  posthog.capture({ event, properties });
  await posthog.flush();
}
