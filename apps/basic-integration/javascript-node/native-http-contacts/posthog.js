import { PostHog } from 'posthog-node';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;
const isProduction = process.env.NODE_ENV === 'production';

if ((!apiKey || !host) && !isProduction) {
  const missingVariable = !apiKey ? 'POSTHOG_API_KEY' : 'POSTHOG_HOST';
  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  );
}

export const posthog =
  apiKey && host
    ? new PostHog(apiKey, {
        host,
        enableExceptionAutocapture: true,
      })
    : null;
