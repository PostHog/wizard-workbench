import 'server-only';
import { PostHog } from 'posthog-node';

export const posthogServerClient = new PostHog(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!,
  {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0
  }
);

export async function captureServerEvent({
  distinctId,
  event,
  properties
}: {
  distinctId: string;
  event: string;
  properties?: Record<string, unknown>;
}) {
  await posthogServerClient.captureImmediate({
    distinctId,
    event,
    properties
  });
}

export async function identifyServerUser({
  distinctId,
  properties
}: {
  distinctId: string;
  properties?: Record<string, unknown>;
}) {
  await posthogServerClient.identifyImmediate({
    distinctId,
    properties
  });
}

export async function captureServerException(
  error: unknown,
  distinctId?: string,
  properties?: Record<string, unknown>
) {
  await posthogServerClient.captureExceptionImmediate(
    error,
    distinctId,
    properties
  );
}
