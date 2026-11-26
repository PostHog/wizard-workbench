import posthog from 'posthog-js';

const projectToken = import.meta.env.VITE_POSTHOG_KEY;
const apiHost = import.meta.env.VITE_POSTHOG_HOST;

function reportMissingConfiguration(variableName) {
  console.error(
    new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
    ),
  );
}

const posthogClient = projectToken && apiHost ? posthog : null;

if (posthogClient) {
  posthogClient.init(projectToken, {
    api_host: apiHost,
    defaults: '2026-08-30',
    logs: {
      serviceName: 'trackflow-web',
      environment: import.meta.env.MODE,
    },
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
  });
} else if (import.meta.env.DEV) {
  if (!projectToken) {
    reportMissingConfiguration('VITE_POSTHOG_KEY');
  }

  if (!apiHost) {
    reportMissingConfiguration('VITE_POSTHOG_HOST');
  }
}

export default posthogClient;
