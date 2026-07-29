import { PostHog } from 'posthog-node';

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

function requireConfig(value, variable) {
  if (value) return value;

  if (process.env.NODE_ENV !== 'production') {
    throw new Error(
      `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`,
    );
  }

  return null;
}

const configuredToken = requireConfig(token, 'POSTHOG_PROJECT_TOKEN');
const configuredHost = requireConfig(host, 'POSTHOG_HOST');

export const posthog = configuredToken && configuredHost
  ? new PostHog(configuredToken, {
      host: configuredHost,
      enableExceptionAutocapture: true,
    })
  : null;
