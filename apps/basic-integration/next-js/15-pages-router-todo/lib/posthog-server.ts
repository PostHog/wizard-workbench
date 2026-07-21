import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

export function getPostHogClient() {
  if (!posthogClient) {
    const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

    if (!projectToken) {
      throw new Error('NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is required');
    }

    posthogClient = new PostHog(projectToken, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
      enableExceptionAutocapture: true,
    });
  }

  return posthogClient;
}
