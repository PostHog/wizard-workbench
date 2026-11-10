import 'dotenv/config';
import { PostHog } from 'posthog-node';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;
const isProduction = process.env.NODE_ENV === 'production';

if (!apiKey && !isProduction) {
  console.warn(
    'POSTHOG_API_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_API_KEY is configured'
  );
}

if (!host && !isProduction) {
  console.warn(
    'POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured'
  );
}

export const posthog =
  apiKey && host
    ? new PostHog(apiKey, {
        host,
        enableExceptionAutocapture: true,
      })
    : null;
