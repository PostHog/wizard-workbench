const { PostHog } = require('posthog-node');

try {
  process.loadEnvFile();
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const posthogProjectToken = process.env.POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.POSTHOG_HOST;

if ((!posthogProjectToken || !posthogHost) && process.env.NODE_ENV !== 'production') {
  const missingVariable = !posthogProjectToken ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST';
  throw new Error(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`);
}

const posthog = posthogProjectToken && posthogHost
  ? new PostHog(posthogProjectToken, {
      host: posthogHost,
      enableExceptionAutocapture: true,
    })
  : null;

module.exports = posthog;
