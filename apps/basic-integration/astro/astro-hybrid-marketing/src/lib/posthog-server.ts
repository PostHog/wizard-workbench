import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

export function getPostHogServer(): PostHog | null {
  const projectToken = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = import.meta.env.PUBLIC_POSTHOG_HOST;

  if (!projectToken || !host) {
    return null;
  }

  if (!posthogClient) {
    posthogClient = new PostHog(projectToken, {
      host,
      flushAt: 1,
      flushInterval: 0,
      enableExceptionAutocapture: true,
    });
  }

  return posthogClient;
}
