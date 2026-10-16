import { PostHog } from 'posthog-node';

try {
  process.loadEnvFile?.();
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;
const isProduction = process.env.NODE_ENV === 'production';

function missingConfiguration(variableName) {
  return new Error(
    `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
  );
}

let posthog = null;

if (!apiKey) {
  if (!isProduction) throw missingConfiguration('POSTHOG_API_KEY');
} else if (!host) {
  if (!isProduction) throw missingConfiguration('POSTHOG_HOST');
} else {
  posthog = new PostHog(apiKey, {
    host,
    enableExceptionAutocapture: true,
  });
}

export { posthog };
