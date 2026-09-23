import posthog from 'posthog-js';

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;
const isPosthogConfigured = Boolean(posthogKey && posthogHost);

if (!isPosthogConfigured) {
  if (import.meta.env.DEV) {
    const missingVariable = posthogKey ? 'VITE_POSTHOG_HOST' : 'VITE_POSTHOG_KEY';
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    defaults: '2026-05-30',
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

export function identifyUser(user) {
  if (!isPosthogConfigured || !user?.id) return;

  posthog.identify(user.id, {
    email: user.email,
    name: user.name,
    role: user.role,
  });
}

export function resetUser() {
  if (!isPosthogConfigured) return;

  posthog.reset();
}

export function captureEvent(event, properties) {
  if (!isPosthogConfigured) return;

  posthog.capture(event, properties);
}

const posthogLog = {
  info(message, attributes) {
    if (!isPosthogConfigured) return;

    posthog.logger.info(message, attributes);
  },
};

export { posthog, posthogLog };
