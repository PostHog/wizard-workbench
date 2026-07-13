import 'server-only';

import { PostHog } from 'posthog-node';

type ServerEvent = {
  distinctId: string;
  event: string;
  properties?: Record<string, string | number | boolean | null | undefined>;
};

type ServerIdentify = {
  distinctId: string;
  properties?: Record<string, string | number | boolean | null | undefined>;
};

let client: PostHog | null = null;

function getClient() {
  if (!client) {
    client = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
      enableExceptionAutocapture: true
    });
  }

  return client;
}

export async function captureServerEvent({
  distinctId,
  event,
  properties
}: ServerEvent) {
  const posthog = getClient();

  posthog.capture({
    distinctId,
    event,
    properties
  });

  await posthog.flush();
}

export async function identifyServerUser({
  distinctId,
  properties
}: ServerIdentify) {
  const posthog = getClient();

  posthog.identify({
    distinctId,
    properties
  });

  await posthog.flush();
}

export async function captureServerException(
  error: unknown,
  distinctId: string,
  properties?: Record<string, string | number | boolean | null | undefined>
) {
  const posthog = getClient();
  const normalizedError =
    error instanceof Error ? error : new Error('Unknown server error');

  posthog.captureException(normalizedError, distinctId, properties);

  await posthog.flush();
}
