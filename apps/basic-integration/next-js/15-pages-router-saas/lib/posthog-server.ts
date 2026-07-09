import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

export function getPostHogClient() {
  if (!posthogClient) {
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

    if (!apiKey) {
      return null;
    }

    posthogClient = new PostHog(apiKey, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
      enableExceptionAutocapture: true
    });
  }

  return posthogClient;
}

export async function shutdownPostHog() {
  if (posthogClient) {
    await posthogClient.shutdown();
    posthogClient = null;
  }
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

  if (!posthog) {
    return;
  }

  posthog.capture({
    distinctId,
    event,
    properties
  });

  await posthog.shutdown();
  posthogClient = null;
}

export async function identifyServerUser({
  distinctId,
  properties
}: {
  distinctId: string;
  properties?: Record<string, unknown>;
}) {
  const posthog = getPostHogClient();

  if (!posthog) {
    return;
  }

  posthog.identify({
    distinctId,
    properties
  });

  await posthog.shutdown();
  posthogClient = null;
}

export async function captureServerException(
  error: unknown,
  distinctId: string,
  additionalProperties?: Record<string, unknown>
) {
  const posthog = getPostHogClient();

  if (!posthog || !(error instanceof Error)) {
    return;
  }

  posthog.captureException(error, distinctId, additionalProperties);

  await posthog.shutdown();
  posthogClient = null;
}
