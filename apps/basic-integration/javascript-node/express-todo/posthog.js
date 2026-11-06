const { PostHog } = require('posthog-node');

const missingConfiguration = [];

if (!process.env.POSTHOG_PROJECT_TOKEN) {
  missingConfiguration.push('POSTHOG_PROJECT_TOKEN');
}

if (!process.env.POSTHOG_HOST) {
  missingConfiguration.push('POSTHOG_HOST');
}

if (missingConfiguration.length > 0 && process.env.NODE_ENV !== 'production') {
  for (const variable of missingConfiguration) {
    console.warn(
      `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`
    );
  }
}

const posthog = missingConfiguration.length === 0
  ? new PostHog(process.env.POSTHOG_PROJECT_TOKEN, {
      host: process.env.POSTHOG_HOST,
      enableExceptionAutocapture: true,
    })
  : null;

module.exports = posthog;
