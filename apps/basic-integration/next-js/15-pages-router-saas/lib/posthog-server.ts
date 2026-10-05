import { PostHog } from 'posthog-node';

let posthog: PostHog | undefined;

function getPostHogClient() {
  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!projectToken || !host) {
    if (process.env.NODE_ENV === 'development') {
      const missingVariable = projectToken
        ? 'NEXT_PUBLIC_POSTHOG_HOST'
        : 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN';
      console.error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
    }
    return undefined;
  }

  if (!posthog) {
    posthog = new PostHog(projectToken, {
      host,
      enableExceptionAutocapture: true,
      flushAt: 1,
      flushInterval: 0
    });
  }

  return posthog;
}

export async function captureServerEvent({
  distinctId,
  event,
  properties
}: {
  distinctId: string;
  event: string;
  properties?: Record<string, string | number | boolean | null | undefined>;
}) {
  const client = getPostHogClient();

  if (!client) {
    return;
  }

  try {
    client.capture({ distinctId, event, properties });
    await client.flush();
  } catch (error) {
    console.error(`Failed to capture PostHog event ${event}`, error);
  }
}
