import { PostHog } from 'posthog-node';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;
const missingVariables = [
  !projectToken && 'POSTHOG_PROJECT_TOKEN',
  !host && 'POSTHOG_HOST',
].filter(Boolean);

if (missingVariables.length && process.env.NODE_ENV !== 'production') {
  for (const variable of missingVariables) {
    console.warn(
      `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`,
    );
  }
}

export const posthog = projectToken && host
  ? new PostHog(projectToken, {
    host,
    enableExceptionAutocapture: true,
  })
  : null;
