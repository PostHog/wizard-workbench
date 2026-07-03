import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

export function getPostHogClient() {
  if (!posthogClient) {
    posthogClient = new PostHog(
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!,
      {
        host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        flushAt: 1,
        flushInterval: 0,
      }
    );
    // Enable debug logs in development only
    if (process.env.NODE_ENV === 'development') {
      posthogClient.debug(true);
    }
  }
  return posthogClient;
}

export async function shutdownPostHog() {
  if (posthogClient) {
    await posthogClient.shutdown();
  }
}
