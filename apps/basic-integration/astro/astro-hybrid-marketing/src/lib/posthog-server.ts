import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null | undefined;

export function getPostHogServer(): PostHog | null {
  if (posthogClient !== undefined) return posthogClient;

  const apiKey = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  const apiHost = import.meta.env.PUBLIC_POSTHOG_HOST;

  if (!apiKey || !apiHost) {
    if (import.meta.env.DEV) {
      const missingVariable = !apiKey
        ? 'PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'PUBLIC_POSTHOG_HOST';
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      );
    }

    posthogClient = null;
    return posthogClient;
  }

  posthogClient = new PostHog(apiKey, {
    host: apiHost,
    flushAt: 1,
    flushInterval: 0,
    enableExceptionAutocapture: true,
  });

  return posthogClient;
}
