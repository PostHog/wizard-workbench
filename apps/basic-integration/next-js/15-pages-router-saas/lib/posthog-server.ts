import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

export function getPostHogServerClient() {
  if (!posthogClient) {
    posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
      enableExceptionAutocapture: true
    });
  }

  return posthogClient;
}

export async function captureServerEvent({
  distinctId,
  event,
  properties
}: {
  distinctId: string;
  event: string;
  properties?: Record<string, unknown>;
}) {
  const client = getPostHogServerClient();
  client.capture({
    distinctId,
    event,
    properties
  });
  await client.shutdown();
  posthogClient = null;
}

export async function identifyServerUser({
  distinctId,
  properties
}: {
  distinctId: string;
  properties?: Record<string, unknown>;
}) {
  const client = getPostHogServerClient();
  client.identify({
    distinctId,
    properties
  });
  await client.shutdown();
  posthogClient = null;
}

export async function captureServerException(error: unknown, distinctId?: string) {
  const client = getPostHogServerClient();
  client.captureException(error, distinctId);
  await client.shutdown();
  posthogClient = null;
}
