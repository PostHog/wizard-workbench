import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;
let configurationWarningLogged = false;

export function getPostHogClient(): PostHog | null {
  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!projectToken || !host) {
    if (process.env.NODE_ENV !== 'production' && !configurationWarningLogged) {
      const missingVariable = !projectToken
        ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NEXT_PUBLIC_POSTHOG_HOST';

      console.warn(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      );
      configurationWarningLogged = true;
    }

    return null;
  }

  if (!posthogClient) {
    posthogClient = new PostHog(projectToken, {
      host,
      enableExceptionAutocapture: true,
      flushAt: 1,
      flushInterval: 0,
      requestTimeout: 2000,
      fetchRetryCount: 0,
    });
  }

  return posthogClient;
}
