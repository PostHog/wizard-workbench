import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

export function getPostHogClient() {
  if (!posthogClient) {
    const posthogToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (!posthogToken || !posthogHost) {
      throw new Error('PostHog environment variables are not configured');
    }

    posthogClient = new PostHog(posthogToken, {
      host: posthogHost,
      flushAt: 1,
      flushInterval: 0,
      enableExceptionAutocapture: true
    });
  }

  return posthogClient;
}
