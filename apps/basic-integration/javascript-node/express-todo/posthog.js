const { PostHog } = require('posthog-node');

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;
let posthog = null;
let posthogLog = null;

if (!projectToken || !host) {
  if (process.env.NODE_ENV !== 'production') {
    if (!projectToken) {
      console.warn(
        'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured'
      );
    }

    if (!host) {
      console.warn(
        'POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured'
      );
    }
  }
} else {
  posthog = new PostHog(projectToken, {
    host,
    enableExceptionAutocapture: true,
    logs: {
      serviceName: 'express-todo-api',
    },
  });
  posthogLog = posthog.logger;
}

module.exports = { posthog, posthogLog };
