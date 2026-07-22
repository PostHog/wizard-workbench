import { PostHog } from 'posthog-node';

type EventProperties = Record<string, string | number | boolean | null | undefined>;

export async function captureServerEvent({
  distinctId,
  event,
  properties,
  processPersonProfile = true
}: {
  distinctId: string;
  event: string;
  properties?: EventProperties;
  processPersonProfile?: boolean;
}) {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!token || !host) {
    if (process.env.NODE_ENV === 'development') {
      const missingVariable = !token
        ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NEXT_PUBLIC_POSTHOG_HOST';
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
    }
    return;
  }

  const posthog = new PostHog(token, {
    host,
    enableExceptionAutocapture: true,
    flushAt: 1,
    flushInterval: 0
  });

  posthog.capture({
    distinctId,
    event,
    properties: {
      ...properties,
      $process_person_profile: processPersonProfile
    }
  });
  await posthog.shutdown();
}
