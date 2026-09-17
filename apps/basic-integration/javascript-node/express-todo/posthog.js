const { PostHog } = require('posthog-node');

const missingVariable = ['POSTHOG_PROJECT_TOKEN', 'POSTHOG_HOST'].find(
  (name) => !process.env[name]
);

if (missingVariable && process.env.NODE_ENV !== 'production') {
  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  );
}

const posthog = missingVariable
  ? null
  : new PostHog(process.env.POSTHOG_PROJECT_TOKEN, {
      host: process.env.POSTHOG_HOST,
      enableExceptionAutocapture: true,
    });

module.exports = posthog;
