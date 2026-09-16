import 'dotenv/config';
import { PostHog } from 'posthog-node';

const posthogApiKey = process.env.POSTHOG_API_KEY;
const posthogHost = process.env.POSTHOG_HOST;
const isProduction = process.env.NODE_ENV === 'production';

if (!posthogApiKey && !isProduction) {
  throw new Error(
    'POSTHOG_API_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_API_KEY is configured',
  );
}

if (!posthogHost && !isProduction) {
  throw new Error(
    'POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured',
  );
}

export const posthog = posthogApiKey && posthogHost
  ? new PostHog(posthogApiKey, {
      host: posthogHost,
      enableExceptionAutocapture: true,
    })
  : null;
