require('dotenv').config({ quiet: true });

const { PostHog } = require('posthog-node');

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

if ((!token || !host) && process.env.NODE_ENV !== 'production') {
  const missingVariable = token ? 'POSTHOG_HOST' : 'POSTHOG_PROJECT_TOKEN';
  console.error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  );
}

const posthog = token && host
  ? new PostHog(token, { host, enableExceptionAutocapture: true })
  : null;

module.exports = { posthog };
