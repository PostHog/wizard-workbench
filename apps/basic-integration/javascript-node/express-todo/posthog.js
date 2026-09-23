let posthog;
let setupExpressRequestContext;

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

if (!projectToken || !host) {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG) {
    const missingVariable = !projectToken ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST';
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
    );
  }
} else {
  const { PostHog, setupExpressRequestContext: setupRequestContext } = require('posthog-node');

  posthog = new PostHog(projectToken, {
    host,
    enableExceptionAutocapture: true,
  });
  setupExpressRequestContext = setupRequestContext;
}

module.exports = { posthog, setupExpressRequestContext };
