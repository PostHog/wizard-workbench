import { PostHog } from 'posthog-node';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

for (const variableName of ['POSTHOG_PROJECT_TOKEN', 'POSTHOG_HOST']) {
  if (!process.env[variableName] && process.env.NODE_ENV !== 'production') {
    console.warn(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
    );
  }
}

export const posthog =
  projectToken && host
    ? new PostHog(projectToken, {
        host,
        enableExceptionAutocapture: true,
      })
    : null;
