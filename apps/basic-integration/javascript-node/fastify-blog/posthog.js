import { PostHog } from 'posthog-node';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;
const isProduction = process.env.NODE_ENV === 'production';

function requireConfig(value, variable) {
  if (!value && !isProduction) {
    throw new Error(
      `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`,
    );
  }
  return value;
}

const configuredToken = requireConfig(projectToken, 'POSTHOG_PROJECT_TOKEN');
const configuredHost = requireConfig(host, 'POSTHOG_HOST');

export const posthog = configuredToken && configuredHost
  ? new PostHog(configuredToken, {
      host: configuredHost,
      enableExceptionAutocapture: true,
      flushAt: 1,
      flushInterval: 0,
    })
  : null;
