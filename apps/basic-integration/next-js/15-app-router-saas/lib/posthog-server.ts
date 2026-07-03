import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

export function getPostHogClient() {
  if (!posthogClient) {
    posthogClient = new PostHog(
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!,
      {
        host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        flushAt: 1,
        flushInterval: 0
      }
    );
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
  const posthog = getPostHogClient();

  posthog.capture({
    distinctId,
    event,
    properties
  });

  await posthog.shutdown();
  posthogClient = null;
}
