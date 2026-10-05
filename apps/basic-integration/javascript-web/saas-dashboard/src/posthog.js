import PostHog from 'posthog-js';

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;
const missingPostHogVariable = !posthogKey
  ? 'VITE_POSTHOG_KEY'
  : !posthogHost
    ? 'VITE_POSTHOG_HOST'
    : null;

if (missingPostHogVariable && import.meta.env.DEV) {
  throw new Error(
    `${missingPostHogVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingPostHogVariable} is configured`,
  );
}

export const posthog = missingPostHogVariable
  ? null
  : PostHog.init(posthogKey, {
      api_host: posthogHost,
      capture_exceptions: {
        capture_unhandled_errors: true,
        capture_unhandled_rejections: true,
        capture_console_errors: false,
      },
      logs: {
        serviceName: 'trackflow-web',
        environment: import.meta.env.MODE,
      },
    });
