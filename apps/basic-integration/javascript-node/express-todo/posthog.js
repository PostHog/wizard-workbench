const { PostHog } = require('posthog-node');

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

let posthog = null;

if (!projectToken) {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(
      'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured'
    );
  }
} else if (!host) {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(
      'POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured'
    );
  }
} else {
  posthog = new PostHog(projectToken, {
    host,
    enableExceptionAutocapture: true,
  });
}

module.exports = posthog;
