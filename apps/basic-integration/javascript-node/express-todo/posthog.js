const { PostHog } = require('posthog-node');

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;
const isProduction = process.env.NODE_ENV === 'production';

function missingConfiguration(variableName) {
  if (!isProduction) {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
    );
  }

  return null;
}

const posthog = !projectToken
  ? missingConfiguration('POSTHOG_PROJECT_TOKEN')
  : !host
    ? missingConfiguration('POSTHOG_HOST')
    : new PostHog(projectToken, {
        host,
        enableExceptionAutocapture: true,
      });

module.exports = posthog;
