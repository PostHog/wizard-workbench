import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

export default function PostHogServer() {
  if (!posthogClient) {
    posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
    });
    // Enable debug in development
    try {
      posthogClient.debug(true);
    } catch (e) {
      // ignore
    }
  }
  return posthogClient;
}
