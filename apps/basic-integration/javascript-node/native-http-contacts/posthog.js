import { PostHog } from 'posthog-node';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

function requirePostHogEnvironmentVariable(name, value) {
  if (!value && process.env.NODE_ENV !== 'production') {
    throw new Error(
      `${name} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${name} is configured`
    );
  }
}

requirePostHogEnvironmentVariable('POSTHOG_PROJECT_TOKEN', projectToken);
requirePostHogEnvironmentVariable('POSTHOG_HOST', host);

export const posthog = projectToken && host
  ? new PostHog(projectToken, {
      host,
      enableExceptionAutocapture: true,
    })
  : null;
