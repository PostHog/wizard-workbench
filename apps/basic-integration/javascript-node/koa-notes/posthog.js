import { PostHog } from 'posthog-node';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

function requirePostHogEnvironment(variable, value) {
  if (!value && process.env.NODE_ENV !== 'production') {
    throw new Error(
      `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`
    );
  }
}

requirePostHogEnvironment('POSTHOG_API_KEY', apiKey);
requirePostHogEnvironment('POSTHOG_HOST', host);

export const posthog = apiKey && host
  ? new PostHog(apiKey, {
      host,
      enableExceptionAutocapture: true,
      flushAt: 1,
      flushInterval: 0,
    })
  : null;
