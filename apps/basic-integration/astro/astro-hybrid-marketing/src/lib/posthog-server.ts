import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

/** Returns the shared PostHog client for server-side API tracking. */
export function getPostHogServer(): PostHog {
  if (!posthogClient) {
    posthogClient = new PostHog(import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN, {
      host: import.meta.env.PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
      enableExceptionAutocapture: true,
    });
  }

  return posthogClient;
}
