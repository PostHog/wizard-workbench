import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

export function getPostHogServer(): PostHog | null {
  const projectToken = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = import.meta.env.PUBLIC_POSTHOG_HOST;

  if (!projectToken || !host) {
    if (import.meta.env.MODE === 'development') {
      throw new Error('PUBLIC_POSTHOG_PROJECT_TOKEN and PUBLIC_POSTHOG_HOST variables required by PostHog are missing or un-configured, this causes events to be silently missed. This error stops appearing once they are configured');
    }
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
