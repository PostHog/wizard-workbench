import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

export function getPostHogServer(): PostHog | null {
  const apiKey = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  const apiHost = import.meta.env.PUBLIC_POSTHOG_HOST;

  if (!apiKey || !apiHost) {
    if (import.meta.env.DEV) {
      console.error('PUBLIC_POSTHOG_PROJECT_TOKEN and PUBLIC_POSTHOG_HOST variables required by PostHog are missing or un-configured, this causes events to be silently missed. This error stops appearing once both variables are configured');
    }
    return null;
  }

  if (!posthogClient) {
    posthogClient = new PostHog(apiKey, {
      host: apiHost,
      enableExceptionAutocapture: true,
      flushAt: 1,
      flushInterval: 0,
    });
  }

  return posthogClient;
}
