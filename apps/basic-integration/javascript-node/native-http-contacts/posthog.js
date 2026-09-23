import { PostHog } from 'posthog-node';

const posthogApiKey = process.env.POSTHOG_API_KEY;
const posthogHost = process.env.POSTHOG_HOST;
const isProduction = process.env.NODE_ENV === 'production';

function requirePostHogConfig(variableName, value) {
  if (!value && !isProduction) {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
    );
  }
}

requirePostHogConfig('POSTHOG_API_KEY', posthogApiKey);
requirePostHogConfig('POSTHOG_HOST', posthogHost);

export const posthog =
  posthogApiKey && posthogHost
    ? new PostHog(posthogApiKey, {
        host: posthogHost,
        enableExceptionAutocapture: true,
      })
    : null;
