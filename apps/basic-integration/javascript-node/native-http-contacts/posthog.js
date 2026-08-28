import { PostHog } from 'posthog-node';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

function reportMissingConfiguration(variable) {
  if (process.env.NODE_ENV !== 'production') {
    console.error(
      new Error(
        `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`
      )
    );
  }
}

if (!projectToken) reportMissingConfiguration('POSTHOG_PROJECT_TOKEN');
if (!host) reportMissingConfiguration('POSTHOG_HOST');

export const posthog =
  projectToken && host
    ? new PostHog(projectToken, {
        host,
        enableExceptionAutocapture: true,
      })
    : null;
