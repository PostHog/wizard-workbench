import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

/**
 * Get the PostHog server-side client.
 * Uses a singleton pattern to avoid creating multiple clients.
 */
export function getPostHogServer(): PostHog {
  if (!posthogClient) {
    posthogClient = new PostHog(import.meta.env.PUBLIC_POSTHOG_KEY || '', {
      host: import.meta.env.PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return posthogClient;
}
