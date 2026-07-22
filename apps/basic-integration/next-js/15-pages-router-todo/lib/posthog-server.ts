import { PostHog } from 'posthog-node';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

let posthog: PostHog | null = null;

function getPostHogClient() {
  if (!projectToken || !host) {
    if (process.env.NODE_ENV === 'development') {
      const missingVariable = !projectToken
        ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NEXT_PUBLIC_POSTHOG_HOST';
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      );
    }
    return null;
  }

  if (!posthog) {
    posthog = new PostHog(projectToken, {
      host,
      enableExceptionAutocapture: true,
      flushAt: 1,
      flushInterval: 0,
    });
  }

  return posthog;
}

export async function captureServerEvent(event: string, properties: Record<string, boolean | number | string>) {
  const client = getPostHogClient();
  if (!client) return;

  try {
    client.capture({ event, properties });
    await client.flush();
  } catch (error) {
    console.error('Failed to capture PostHog event:', error);
  }
}
