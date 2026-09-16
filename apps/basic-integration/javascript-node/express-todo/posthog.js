const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

function missingConfiguration(variableName) {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
    );
  }
}

let posthog = null;

if (!projectToken) {
  missingConfiguration('POSTHOG_PROJECT_TOKEN');
} else if (!host) {
  missingConfiguration('POSTHOG_HOST');
} else {
  const { PostHog } = require('posthog-node');

  posthog = new PostHog(projectToken, {
    host,
    enableExceptionAutocapture: true,
  });
}

module.exports = { posthog };
