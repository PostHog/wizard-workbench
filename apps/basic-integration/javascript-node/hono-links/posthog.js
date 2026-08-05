import { PostHog } from 'posthog-node';

const isDevelopment = process.env.NODE_ENV === 'development' || Boolean(process.env.DEBUG);
const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

function reportMissingConfiguration(variableName) {
  if (isDevelopment) {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
    );
  }
}

function createPostHogClient() {
  if (!projectToken) {
    reportMissingConfiguration('POSTHOG_PROJECT_TOKEN');
    return null;
  }

  if (!host) {
    reportMissingConfiguration('POSTHOG_HOST');
    return null;
  }

  return new PostHog(projectToken, {
    host,
    enableExceptionAutocapture: true,
  });
}

export const posthog = createPostHogClient();
