import { PostHog } from 'posthog-node';

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;
const isProduction = process.env.NODE_ENV === 'production';

function missingConfig(variable) {
  return new Error(
    `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`,
  );
}

if ((!token || !host) && !isProduction) {
  throw missingConfig(!token ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST');
}

export const posthog = token && host
  ? new PostHog(token, {
      host,
      enableExceptionAutocapture: true,
      flushAt: 1,
      flushInterval: 0,
    })
  : null;
