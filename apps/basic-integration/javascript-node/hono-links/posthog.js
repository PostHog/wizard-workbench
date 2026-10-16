import { PostHog } from 'posthog-node';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

function missingConfiguration(variable) {
  return new Error(
    `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`
  );
}

let posthog = null;

if (!projectToken) {
  if (process.env.NODE_ENV !== 'production') {
    throw missingConfiguration('POSTHOG_PROJECT_TOKEN');
  }
} else if (!host) {
  if (process.env.NODE_ENV !== 'production') {
    throw missingConfiguration('POSTHOG_HOST');
  }
} else {
  posthog = new PostHog(projectToken, {
    host,
    enableExceptionAutocapture: true,
  });
}

export { posthog };
