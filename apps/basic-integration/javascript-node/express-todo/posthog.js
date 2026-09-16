const { PostHog } = require('posthog-node');

try {
  process.loadEnvFile();
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

if (!token || !host) {
  if (process.env.NODE_ENV !== 'production') {
    const missingVariable = !token ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST';
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
    );
  }

  module.exports = null;
} else {
  module.exports = new PostHog(token, {
    host,
    enableExceptionAutocapture: true,
  });
}
