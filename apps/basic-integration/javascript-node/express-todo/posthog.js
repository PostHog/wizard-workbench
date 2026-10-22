const posthogProjectToken = process.env.POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.POSTHOG_HOST;

let posthog = null;

if (posthogProjectToken && posthogHost) {
  const { PostHog } = require('posthog-node');

  posthog = new PostHog(posthogProjectToken, {
    host: posthogHost,
    enableExceptionAutocapture: true,
  });
} else if (process.env.NODE_ENV !== 'production') {
  if (!posthogProjectToken) {
    console.error(new Error('POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured'));
  }

  if (!posthogHost) {
    console.error(new Error('POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured'));
  }
}

module.exports = posthog;
