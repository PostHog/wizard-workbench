const { PostHog } = require('posthog-node');

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

let posthog;

if (apiKey && host) {
  posthog = new PostHog(apiKey, {
    host,
    enableExceptionAutocapture: true,
  });
} else if (process.env.NODE_ENV !== 'production') {
  for (const variable of ['POSTHOG_API_KEY', 'POSTHOG_HOST']) {
    if (!process.env[variable]) {
      console.error(
        new Error(
          `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`
        )
      );
    }
  }
}

module.exports = { posthog };
