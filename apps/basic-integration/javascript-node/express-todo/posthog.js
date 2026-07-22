const { PostHog } = require('posthog-node');

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

if (!token || !host) {
  if (process.env.NODE_ENV !== 'production') {
    const variable = token ? 'POSTHOG_HOST' : 'POSTHOG_PROJECT_TOKEN';
    throw new Error(
      `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`
    );
  }

  module.exports = null;
} else {
  const posthog = new PostHog(token, {
    host,
    enableExceptionAutocapture: true,
  });

  process.once('SIGINT', async () => {
    await posthog.shutdown();
    process.exit(0);
  });
  process.once('SIGTERM', async () => {
    await posthog.shutdown();
    process.exit(0);
  });

  module.exports = posthog;
}
