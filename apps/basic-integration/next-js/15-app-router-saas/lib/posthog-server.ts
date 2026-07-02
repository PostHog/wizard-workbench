import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

/**
 * Returns a singleton PostHog client configured for server-side event capture.
 * Uses environment variables for project token and host.
 */
export function getPostHogClient(): PostHog {
  if (!posthogClient) {
    posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return posthogClient;
}

/**
 * Ensures all queued events are flushed before shutdown. */
export async function shutdownPostHog(): Promise<void> {
  if (posthogClient) {
    await posthogClient.shutdown();
  }
}