import { PostHog } from 'posthog-node';

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

if (process.env.NODE_ENV !== 'production') {
  if (!token) {
    console.warn(
      'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured'
    );
  }
  if (!host) {
    console.warn(
      'POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured'
    );
  }
}

export const posthog =
  token && host
    ? new PostHog(token, {
        host,
        enableExceptionAutocapture: true,
      })
    : null;
