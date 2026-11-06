import posthog from 'posthog-js';

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;
const isPostHogConfigured = Boolean(posthogKey && posthogHost);

if (!isPostHogConfigured) {
  if (import.meta.env.DEV) {
    if (!posthogKey) {
      console.error(
        new Error('VITE_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_KEY is configured'),
      );
    }

    if (!posthogHost) {
      console.error(
        new Error('VITE_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_HOST is configured'),
      );
    }
  }
} else {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    defaults: '2026-08-30',
    logs: {
      serviceName: 'trackflow-web',
      environment: import.meta.env.MODE,
      serviceVersion: '1.0.0',
    },
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
  });
}

export function identifyUser(user) {
  if (!isPostHogConfigured || !user?.id) return;

  posthog.identify(user.id, {
    email: user.email,
    name: user.name,
    role: user.role,
  });
}

export function resetPostHog() {
  if (isPostHogConfigured) posthog.reset();
}

export function captureEvent(event, properties) {
  if (isPostHogConfigured) posthog.capture(event, properties);
}

export const appLogger = {
  info(message, attributes) {
    if (isPostHogConfigured) posthog.logger.info(message, attributes);
  },
};
