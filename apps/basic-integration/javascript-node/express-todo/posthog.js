require('dotenv').config();

const { PostHog } = require('posthog-node');

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;
const isProduction = process.env.NODE_ENV === 'production';

function missingConfiguration(variable) {
  const message = `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`;

  if (!isProduction) {
    throw new Error(message);
  }
}

let posthog = null;

if (!token) {
  missingConfiguration('POSTHOG_PROJECT_TOKEN');
} else if (!host) {
  missingConfiguration('POSTHOG_HOST');
} else {
  posthog = new PostHog(token, {
    host,
    enableExceptionAutocapture: true,
  });
}

module.exports = posthog;
