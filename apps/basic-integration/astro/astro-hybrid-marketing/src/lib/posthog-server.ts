import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

export function getPostHogServer(): PostHog {
  if (!posthogClient) {
    const projectToken = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
    const host = import.meta.env.PUBLIC_POSTHOG_HOST;

    if (!projectToken || !host) {
      throw new Error('PostHog environment variables are required');
    }

    posthogClient = new PostHog(projectToken, {
      host,
      flushAt: 1,
      flushInterval: 0,
      enableExceptionAutocapture: true,
    });
  }

  return posthogClient;
}
