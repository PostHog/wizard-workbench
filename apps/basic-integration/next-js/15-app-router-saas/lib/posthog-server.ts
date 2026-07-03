import 'server-only';
import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

export function getPostHogClient() {
  if (!posthogClient) {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

    if (!posthogKey) {
      throw new Error('NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is not configured.');
    }

    posthogClient = new PostHog(posthogKey, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0
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
