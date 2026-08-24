const { PostHog } = require('posthog-node');

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;
const isProduction = process.env.NODE_ENV === 'production';

function missingConfigurationError(variableName) {
  return new Error(
    `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
  );
}

let posthog = null;

if (!projectToken) {
  if (!isProduction) throw missingConfigurationError('POSTHOG_PROJECT_TOKEN');
} else if (!host) {
  if (!isProduction) throw missingConfigurationError('POSTHOG_HOST');
} else {
  posthog = new PostHog(projectToken, {
    host,
    enableExceptionAutocapture: true,
  });
}

module.exports = posthog;
