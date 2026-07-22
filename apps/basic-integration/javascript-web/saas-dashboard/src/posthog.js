import posthog from 'posthog-js';

const apiKey = import.meta.env.VITE_POSTHOG_KEY;
const apiHost = import.meta.env.VITE_POSTHOG_HOST;

if (apiKey && apiHost) {
  posthog.init(apiKey, {
    api_host: apiHost,
  });
  posthog.startExceptionAutocapture();
} else if (import.meta.env.DEV) {
  const missing = !apiKey ? 'VITE_POSTHOG_KEY' : 'VITE_POSTHOG_HOST';
  console.error(
    `${missing} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missing} is configured`,
  );
}

export default posthog;
