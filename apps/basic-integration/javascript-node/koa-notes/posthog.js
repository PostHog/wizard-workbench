import { PostHog } from 'posthog-node';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

function requirePostHogConfiguration(variable, value) {
  if (value || process.env.NODE_ENV === 'production') return;

  throw new Error(
    `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`
  );
}

requirePostHogConfiguration('POSTHOG_PROJECT_TOKEN', projectToken);
requirePostHogConfiguration('POSTHOG_HOST', host);

export const posthog = projectToken && host
  ? new PostHog(projectToken, {
      host,
      enableExceptionAutocapture: true,
      flushAt: 1,
      flushInterval: 0,
    })
  : null;
