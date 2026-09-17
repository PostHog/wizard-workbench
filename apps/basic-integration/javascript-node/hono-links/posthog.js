import 'dotenv/config';
import { PostHog } from 'posthog-node';

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

function requirePostHogEnvironment(variable, value) {
  if (value) return;

  if (process.env.NODE_ENV !== 'production') {
    throw new Error(
      `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`
    );
  }
}

requirePostHogEnvironment('POSTHOG_PROJECT_TOKEN', token);
requirePostHogEnvironment('POSTHOG_HOST', host);

export const posthog = token && host
  ? new PostHog(token, { host, enableExceptionAutocapture: true })
  : null;
