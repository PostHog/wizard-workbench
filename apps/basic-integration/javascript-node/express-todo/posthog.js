const { PostHog } = require('posthog-node');

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

function missingConfiguration(variable) {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(
      `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`
    );
  }
}

if (!token) missingConfiguration('POSTHOG_PROJECT_TOKEN');
if (!host) missingConfiguration('POSTHOG_HOST');

const posthog = token && host
  ? new PostHog(token, { host, enableExceptionAutocapture: true })
  : null;

module.exports = posthog;
