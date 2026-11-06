import { PostHog } from 'posthog-node';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

let posthog;

if (apiKey && host) {
  posthog = new PostHog(apiKey, {
    host,
    enableExceptionAutocapture: true,
  });
} else if (process.env.NODE_ENV !== 'production') {
  const missingVariable = apiKey ? 'POSTHOG_HOST' : 'POSTHOG_API_KEY';
  console.warn(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  );
}

export { posthog };
