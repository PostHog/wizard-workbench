import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

/**
 * Returns the shared PostHog client for Astro API routes and other server handlers.
 */
export function getPostHogServer(): PostHog {
  if (!posthogClient) {
    posthogClient = new PostHog(import.meta.env.POSTHOG_PROJECT_TOKEN, {
      host: import.meta.env.POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
      enableExceptionAutocapture: true,
    });
  }

  return posthogClient;
}

export async function shutdownPostHog(): Promise<void> {
  if (posthogClient) {
    await posthogClient.shutdown();
    posthogClient = null;
  }
}
