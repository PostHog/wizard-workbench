import { PostHog } from 'posthog-node';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

function missingConfiguration(variableName) {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
    );
  }

  return null;
}

export const posthog =
  apiKey && host
    ? new PostHog(apiKey, { host, enableExceptionAutocapture: true })
    : missingConfiguration(apiKey ? 'POSTHOG_HOST' : 'POSTHOG_API_KEY');
