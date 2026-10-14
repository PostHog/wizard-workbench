const posthogProjectToken = process.env.POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.POSTHOG_HOST;

let posthog = null;

if (!posthogProjectToken || !posthogHost) {
  if (process.env.NODE_ENV !== 'production') {
    const missingVariable = posthogProjectToken
      ? 'POSTHOG_HOST'
      : 'POSTHOG_PROJECT_TOKEN';
    console.error(
      new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      ),
    );
  }
} else {
  const { PostHog } = require('posthog-node');

  posthog = new PostHog(posthogProjectToken, {
    host: posthogHost,
    enableExceptionAutocapture: true,
  });
}

module.exports = { posthog };
