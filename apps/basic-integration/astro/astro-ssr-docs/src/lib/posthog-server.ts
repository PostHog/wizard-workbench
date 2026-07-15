import { PostHog } from "posthog-node";

let posthogClient: PostHog | null = null;

/** Returns the shared PostHog client for server-side event tracking. */
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
