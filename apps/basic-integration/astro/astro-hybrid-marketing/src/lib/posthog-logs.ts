import { PostHog } from 'posthog-node';

let posthogLogs: PostHog | null = null;
let hasWarnedAboutConfiguration = false;

/**
 * Returns the dedicated logger whose records are exported to PostHog Logs.
 * Existing application loggers intentionally remain separate.
 */
export function getPostHogLogLogger() {
  const token = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = import.meta.env.PUBLIC_POSTHOG_HOST;

  if (!token || !host) {
    if (import.meta.env.DEV && !hasWarnedAboutConfiguration) {
      const missingVariable = !token
        ? 'PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'PUBLIC_POSTHOG_HOST';
      console.warn(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
      hasWarnedAboutConfiguration = true;
    }
    return null;
  }

  if (!posthogLogs) {
    posthogLogs = new PostHog(token, {
      host,
      logs: {
        serviceName: 'astro-marketing-contact-api',
      },
    });
  }

  return posthogLogs.logger;
}
