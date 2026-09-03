import { PostHog } from 'posthog-node';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;
const isDevelopmentOrDebug = process.env.NODE_ENV === 'development' || Boolean(process.env.DEBUG);

function requirePostHogConfig(variableName, value) {
  if (!value && isDevelopmentOrDebug) {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
    );
  }
}

requirePostHogConfig('POSTHOG_API_KEY', apiKey);
requirePostHogConfig('POSTHOG_HOST', host);

export const posthog =
  apiKey && host
    ? new PostHog(apiKey, {
        host,
        enableExceptionAutocapture: true,
      })
    : null;
