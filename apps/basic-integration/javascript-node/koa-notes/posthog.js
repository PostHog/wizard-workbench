import { PostHog } from 'posthog-node';

const posthogApiKey = process.env.POSTHOG_API_KEY;
const posthogHost = process.env.POSTHOG_HOST;

if ((!posthogApiKey || !posthogHost) && process.env.NODE_ENV !== 'production') {
  const missingVariable = !posthogApiKey ? 'POSTHOG_API_KEY' : 'POSTHOG_HOST';
  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  );
}

export const posthog =
  posthogApiKey && posthogHost
    ? new PostHog(posthogApiKey, {
        host: posthogHost,
        enableExceptionAutocapture: true,
      })
    : null;
