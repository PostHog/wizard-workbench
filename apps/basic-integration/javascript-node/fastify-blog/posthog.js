import 'dotenv/config';
import { PostHog } from 'posthog-node';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

function missingConfiguration(variableName) {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
    );
  }
}

if (!projectToken) {
  missingConfiguration('POSTHOG_PROJECT_TOKEN');
}

if (!host) {
  missingConfiguration('POSTHOG_HOST');
}

export const posthog = projectToken && host
  ? new PostHog(projectToken, {
      host,
      enableExceptionAutocapture: true,
      flushAt: 1,
      flushInterval: 0,
    })
  : null;
