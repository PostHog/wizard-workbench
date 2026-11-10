import { PostHog } from 'posthog-node';

const posthogKey = process.env.POSTHOG_API_KEY;
const posthogHost = process.env.POSTHOG_HOST;

if ((!posthogKey || !posthogHost) && process.env.NODE_ENV !== 'production') {
  if (!posthogKey) {
    console.warn(
      'POSTHOG_API_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_API_KEY is configured'
    );
  }

  if (!posthogHost) {
    console.warn(
      'POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured'
    );
  }
}

export const posthog =
  posthogKey && posthogHost
    ? new PostHog(posthogKey, {
        host: posthogHost,
        enableExceptionAutocapture: true,
      })
    : null;
