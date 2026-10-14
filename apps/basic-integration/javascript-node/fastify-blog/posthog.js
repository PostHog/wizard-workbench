import { PostHog } from 'posthog-node';

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;
const missingVariable = !token ? 'POSTHOG_PROJECT_TOKEN' : !host ? 'POSTHOG_HOST' : null;

if (missingVariable && process.env.NODE_ENV !== 'production') {
  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

export const posthog = missingVariable
  ? null
  : new PostHog(token, {
      host,
      enableExceptionAutocapture: true,
    });
