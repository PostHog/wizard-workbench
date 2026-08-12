import { PostHog } from 'posthog-node';

try {
  process.loadEnvFile?.();
} catch (error) {
  if (error.code !== 'ENOENT') {
    throw error;
  }
}

const { POSTHOG_PROJECT_TOKEN, POSTHOG_HOST, NODE_ENV } = process.env;
const missingVariable = !POSTHOG_PROJECT_TOKEN
  ? 'POSTHOG_PROJECT_TOKEN'
  : !POSTHOG_HOST
    ? 'POSTHOG_HOST'
    : null;

if (missingVariable && NODE_ENV !== 'production') {
  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

export const posthog = missingVariable
  ? null
  : new PostHog(POSTHOG_PROJECT_TOKEN, {
      host: POSTHOG_HOST,
      enableExceptionAutocapture: true,
    });
