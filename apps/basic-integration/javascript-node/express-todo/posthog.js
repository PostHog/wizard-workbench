let posthog = null;

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

if (!projectToken || !host) {
  if (process.env.NODE_ENV !== 'production') {
    const missingVariable = !projectToken ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST';
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
    );
  }
} else {
  const { PostHog } = require('posthog-node');

  posthog = new PostHog(projectToken, {
    host,
    enableExceptionAutocapture: true,
  });
}

module.exports = posthog;
