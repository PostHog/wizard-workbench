import { PostHog } from 'posthog-node';

type EventProperties = Record<string, string | number | boolean | null | undefined>;

export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: EventProperties
) {
  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!projectToken || !host) {
    if (process.env.NODE_ENV === 'development') {
      const missingVariable = !projectToken
        ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NEXT_PUBLIC_POSTHOG_HOST';
      console.error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
    }
    return;
  }

  try {
    const posthog = new PostHog(projectToken, {
      host,
      flushAt: 1,
      flushInterval: 0,
      enableExceptionAutocapture: true
    });

    posthog.capture({ distinctId, event, properties });
    await posthog.shutdown();
  } catch (error) {
    console.error('PostHog event capture failed', error);
  }
}
