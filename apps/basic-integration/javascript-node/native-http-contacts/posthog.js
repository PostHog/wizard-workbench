import { PostHog } from 'posthog-node';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;
const isProduction = process.env.NODE_ENV === 'production';

function requirePostHogConfig(value, variableName) {
  if (!value && !isProduction) {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
    );
  }
}

requirePostHogConfig(apiKey, 'POSTHOG_API_KEY');
requirePostHogConfig(host, 'POSTHOG_HOST');

export const posthog =
  apiKey && host
    ? new PostHog(apiKey, { host, enableExceptionAutocapture: true })
    : undefined;
