const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

if (!projectToken && process.env.NODE_ENV !== 'production') {
  throw new Error(
    'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured'
  );
}

if (!host && process.env.NODE_ENV !== 'production') {
  throw new Error(
    'POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured'
  );
}

let posthog = null;

if (projectToken && host) {
  const { PostHog } = require('posthog-node');

  posthog = new PostHog(projectToken, {
    host,
    enableExceptionAutocapture: true,
  });
}

module.exports = posthog;
