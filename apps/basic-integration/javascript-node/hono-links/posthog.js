import { PostHog } from 'posthog-node';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;
const isDevelopment = process.env.NODE_ENV === 'development' || Boolean(process.env.DEBUG);

function missingConfigurationError(variableName) {
  return new Error(
    `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
  );
}

if (isDevelopment && !projectToken) {
  throw missingConfigurationError('POSTHOG_PROJECT_TOKEN');
}

if (isDevelopment && !host) {
  throw missingConfigurationError('POSTHOG_HOST');
}

export const posthog = projectToken && host
  ? new PostHog(projectToken, {
      host,
      enableExceptionAutocapture: true,
    })
  : null;
