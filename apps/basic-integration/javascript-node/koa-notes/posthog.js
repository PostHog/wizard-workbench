import { PostHog } from 'posthog-node';

function getPostHogConfig() {
  const token = process.env.POSTHOG_PROJECT_TOKEN;
  const host = process.env.POSTHOG_HOST;

  if (!token) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured'
      );
    }
    return null;
  }

  if (!host) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        'POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured'
      );
    }
    return null;
  }

  return { token, host };
}

const config = getPostHogConfig();

export const posthog = config
  ? new PostHog(config.token, {
      host: config.host,
      enableExceptionAutocapture: true,
    })
  : null;
