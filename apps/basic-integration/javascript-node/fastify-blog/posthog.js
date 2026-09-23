import { PostHog } from 'posthog-node';

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

function missingConfiguration(variable) {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(
      `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`,
    );
  }

  return undefined;
}

export const posthog = !token
  ? missingConfiguration('POSTHOG_PROJECT_TOKEN')
  : !host
    ? missingConfiguration('POSTHOG_HOST')
    : new PostHog(token, {
      host,
      enableExceptionAutocapture: true,
    });
