import { PostHog } from 'posthog-node';

let posthogClient: PostHog | undefined;
let configurationChecked = false;

export function getPostHogServer(): PostHog | undefined {
  const apiKey = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = import.meta.env.PUBLIC_POSTHOG_HOST;

  if (!apiKey || !host) {
    if (!configurationChecked && import.meta.env.DEV) {
      const missingVariable = !apiKey
        ? 'PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'PUBLIC_POSTHOG_HOST';
      throw new Error(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`);
    }
    configurationChecked = true;
    return undefined;
  }

  if (!posthogClient) {
    posthogClient = new PostHog(apiKey, {
      host,
      flushAt: 1,
      flushInterval: 0,
      enableExceptionAutocapture: true,
    });
  }

  return posthogClient;
}
