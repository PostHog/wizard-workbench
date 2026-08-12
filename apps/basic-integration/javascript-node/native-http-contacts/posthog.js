import { PostHog } from 'posthog-node';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;
const missingVariables = [
  ['POSTHOG_PROJECT_TOKEN', projectToken],
  ['POSTHOG_HOST', host],
].filter(([, value]) => !value);

if (missingVariables.length && process.env.NODE_ENV !== 'production') {
  for (const [variable] of missingVariables) {
    console.error(
      new Error(
        `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`
      )
    );
  }
}

export const posthog =
  missingVariables.length === 0
    ? new PostHog(projectToken, {
        host,
        enableExceptionAutocapture: true,
      })
    : null;
