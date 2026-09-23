import { PostHog } from 'posthog-node';

type ServerEvent = {
  distinctId: string;
  event: string;
  properties?: Record<string, string | number | boolean>;
};

let client: PostHog | null | undefined;

function getPostHogClient() {
  if (client !== undefined) {
    return client;
  }

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!apiKey || !host) {
    if (process.env.NODE_ENV === 'development') {
      const missingVariable = apiKey
        ? 'NEXT_PUBLIC_POSTHOG_HOST'
        : 'NEXT_PUBLIC_POSTHOG_KEY';
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
    }

    client = null;
    return client;
  }

  client = new PostHog(apiKey, {
    host,
    enableExceptionAutocapture: true,
    flushAt: 1,
    flushInterval: 0
  });
  return client;
}

export async function captureServerEvent({
  distinctId,
  event,
  properties
}: ServerEvent) {
  const posthog = getPostHogClient();

  if (!posthog) {
    return;
  }

  posthog.capture({ distinctId, event, properties });
  await posthog.flush();
}
