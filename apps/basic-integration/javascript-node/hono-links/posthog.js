import 'dotenv/config';
import { PostHog } from 'posthog-node';

const { POSTHOG_PROJECT_TOKEN, POSTHOG_HOST, NODE_ENV } = process.env;

function missingConfiguration(variable) {
  if (NODE_ENV !== 'production') {
    throw new Error(
      `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`
    );
  }

  return null;
}

export const posthog = !POSTHOG_PROJECT_TOKEN
  ? missingConfiguration('POSTHOG_PROJECT_TOKEN')
  : !POSTHOG_HOST
    ? missingConfiguration('POSTHOG_HOST')
    : new PostHog(POSTHOG_PROJECT_TOKEN, {
        host: POSTHOG_HOST,
        enableExceptionAutocapture: true,
      });
