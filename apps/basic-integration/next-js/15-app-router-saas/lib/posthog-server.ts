import 'server-only';
import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

export function getPostHogClient() {
  if (!posthogClient) {
    const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

    if (!projectToken) {
      return null;
    }

    posthogClient = new PostHog(projectToken, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0
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
  properties?: Record<string, string | number | boolean | null | undefined>;
}) {
  const client = getPostHogClient();

  if (!client) {
    return;
  }

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
  properties?: Record<string, string | number | boolean | null | undefined>;
}) {
  const client = getPostHogClient();

  if (!client) {
    return;
  }

  client.identify({
    distinctId,
    properties
  });

  await client.shutdown();
  posthogClient = null;
}
