import { PostHog } from 'posthog-node';

try {
  process.loadEnvFile();
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

function requirePostHogConfig(name, value) {
  if (value || process.env.NODE_ENV === 'production') return;

  throw new Error(
    `${name} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${name} is configured`
  );
}

requirePostHogConfig('POSTHOG_API_KEY', apiKey);
requirePostHogConfig('POSTHOG_HOST', host);

export const posthog = apiKey && host
  ? new PostHog(apiKey, { host, enableExceptionAutocapture: true })
  : null;
