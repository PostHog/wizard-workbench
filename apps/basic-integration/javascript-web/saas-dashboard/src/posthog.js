import posthog from 'posthog-js';

const apiKey = import.meta.env.VITE_POSTHOG_KEY;
const host = import.meta.env.VITE_POSTHOG_HOST;

if (!apiKey || !host) {
  if (import.meta.env.DEV) {
    throw new Error(
      `${!apiKey ? 'VITE_POSTHOG_KEY' : 'VITE_POSTHOG_HOST'} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${!apiKey ? 'VITE_POSTHOG_KEY' : 'VITE_POSTHOG_HOST'} is configured`,
    );
  }
} else {
  posthog.init(apiKey, {
    api_host: host,
    capture_exceptions: true,
  });
}

export { posthog };
