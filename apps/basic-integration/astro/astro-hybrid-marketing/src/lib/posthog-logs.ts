import { PostHog } from 'posthog-node';

let posthog: PostHog | null | undefined;

function getPostHogLogsClient(): PostHog | null {
  if (posthog !== undefined) {
    return posthog;
  }

  const token = import.meta.env.PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = import.meta.env.PUBLIC_POSTHOG_HOST;

  if (!token || !host) {
    if (!import.meta.env.PROD) {
      if (!token) {
        console.warn(
          'PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
        );
      }
      if (!host) {
        console.warn(
          'PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured'
        );
      }
    }

    posthog = null;
    return posthog;
  }

  posthog = new PostHog(token, {
    host,
    logs: { serviceName: 'astro-hybrid-marketing' },
  });

  return posthog;
}

export function logContactApiEvent(
  message: string,
  attributes: Record<string, string | boolean>
): void {
  const client = getPostHogLogsClient();
  client?.logger.info(message, attributes);
}
