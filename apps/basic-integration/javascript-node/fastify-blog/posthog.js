import { PostHog } from 'posthog-node';

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

if ((!token || !host) && process.env.NODE_ENV !== 'production') {
  for (const variableName of ['POSTHOG_PROJECT_TOKEN', 'POSTHOG_HOST']) {
    if (!process.env[variableName]) {
      console.warn(
        `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
      );
    }
  }
}

export const posthog = token && host
  ? new PostHog(token, { host, enableExceptionAutocapture: true })
  : null;
