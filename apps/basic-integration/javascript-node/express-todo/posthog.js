const posthogApiKey = process.env.POSTHOG_API_KEY;
const posthogHost = process.env.POSTHOG_HOST;

let posthog = null;

if (!posthogApiKey || !posthogHost) {
  if (process.env.NODE_ENV !== 'production') {
    const missingVariable = !posthogApiKey ? 'POSTHOG_API_KEY' : 'POSTHOG_HOST';
    console.error(
      new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      )
    );
  }
} else {
  const { PostHog } = require('posthog-node');

  posthog = new PostHog(posthogApiKey, {
    host: posthogHost,
    enableExceptionAutocapture: true,
  });
}

module.exports = { posthog };
