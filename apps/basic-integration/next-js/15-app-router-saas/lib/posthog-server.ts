import 'server-only';
import { PostHog } from 'posthog-node';

type EventProperties = Record<string, string | number | boolean | null | undefined>;

type IdentifyProperties = Record<string, string | number | boolean | null | undefined>;

function createPostHogClient() {
  return new PostHog(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
    enableExceptionAutocapture: true
  });
}

export async function captureServerEvent({
  distinctId,
  event,
  properties
}: {
  distinctId: string;
  event: string;
  properties?: EventProperties;
}) {
  const client = createPostHogClient();

  try {
    await client.capture({
      distinctId,
      event,
      properties
    });
  } finally {
    await client.shutdown();
  }
}

export async function identifyServerUser({
  distinctId,
  properties
}: {
  distinctId: string;
  properties?: IdentifyProperties;
}) {
  const client = createPostHogClient();

  try {
    await client.identify({
      distinctId,
      properties
    });
  } finally {
    await client.shutdown();
  }
}

export async function captureServerException(error: unknown, distinctId: string) {
  const client = createPostHogClient();

  try {
    await client.captureException(error, distinctId);
  } finally {
    await client.shutdown();
  }
}
