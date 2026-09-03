import { PostHog } from 'posthog-node';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

function getMissingConfigurationError(variableName) {
  return new Error(
    `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
  );
}

if (!projectToken || !host) {
  if (process.env.NODE_ENV !== 'production') {
    throw getMissingConfigurationError(
      !projectToken ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST'
    );
  }
}

export const posthog = projectToken && host
  ? new PostHog(projectToken, { host, enableExceptionAutocapture: true })
  : null;
