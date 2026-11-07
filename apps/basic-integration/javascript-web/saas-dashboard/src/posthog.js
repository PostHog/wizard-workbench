import posthogClient from 'posthog-js';

const projectToken = import.meta.env.VITE_POSTHOG_KEY;
const apiHost = import.meta.env.VITE_POSTHOG_HOST;

if (!projectToken || !apiHost) {
  if (import.meta.env.DEV) {
    const missingVariable = !projectToken ? 'VITE_POSTHOG_KEY' : 'VITE_POSTHOG_HOST';
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
}

export const posthog = projectToken && apiHost ? posthogClient : null;

if (posthog) {
  posthog.init(projectToken, {
    api_host: apiHost,
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
}

export const posthogLogger = {
  info(message, attributes) {
    posthog?.logger?.info(message, attributes);
  },
};
