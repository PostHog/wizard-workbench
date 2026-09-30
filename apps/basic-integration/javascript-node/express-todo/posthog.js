let posthog = null;
let setupExpressRequestContext = null;
let setupExpressErrorHandler = null;

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

if (!token || !host) {
  if (process.env.NODE_ENV !== 'production') {
    const variable = token ? 'POSTHOG_HOST' : 'POSTHOG_PROJECT_TOKEN';
    throw new Error(
      `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`,
    );
  }
} else {
  const {
    PostHog,
    setupExpressRequestContext: setupContext,
    setupExpressErrorHandler: setupErrorHandler,
  } = require('posthog-node');

  posthog = new PostHog(token, {
    host,
    enableExceptionAutocapture: true,
  });
  setupExpressRequestContext = setupContext;
  setupExpressErrorHandler = setupErrorHandler;
}

module.exports = { posthog, setupExpressRequestContext, setupExpressErrorHandler };
