const { PostHog } = require('posthog-node');

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;
const isProduction = process.env.NODE_ENV === 'production';

if ((!projectToken || !host) && !isProduction) {
  const missingVariable = !projectToken ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST';
  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  );
}

const posthog = projectToken && host
  ? new PostHog(projectToken, { host, enableExceptionAutocapture: true })
  : null;

module.exports = posthog;
