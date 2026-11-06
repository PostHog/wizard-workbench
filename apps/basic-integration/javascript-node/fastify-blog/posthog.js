import { PostHog } from 'posthog-node';

const posthogApiKey = process.env.POSTHOG_API_KEY;
const posthogHost = process.env.POSTHOG_HOST;

if (!posthogApiKey && process.env.NODE_ENV !== 'production') {
  console.warn('POSTHOG_API_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_API_KEY is configured');
}

if (!posthogHost && process.env.NODE_ENV !== 'production') {
  console.warn('POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured');
}

export const posthog = posthogApiKey && posthogHost
  ? new PostHog(posthogApiKey, {
    host: posthogHost,
    enableExceptionAutocapture: true,
  })
  : null;
