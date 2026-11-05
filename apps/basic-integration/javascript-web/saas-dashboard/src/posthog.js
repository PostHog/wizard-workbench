import posthog from 'posthog-js';

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;

if (!posthogKey || !posthogHost) {
  if (import.meta.env.DEV) {
    const missingVariable = posthogKey ? 'VITE_POSTHOG_HOST' : 'VITE_POSTHOG_KEY';
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    defaults: '2026-08-30',
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
    logs: {
      serviceName: 'trackflow-web',
      environment: import.meta.env.MODE,
      serviceVersion: '1.0.0',
    },
  });
}

export function identifyUser(user) {
  if (!posthogKey || !posthogHost || !user?.id) return;

  posthog.identify(user.id, {
    email: user.email,
    name: user.name,
    role: user.role,
  });
}

export function resetPostHog() {
  if (!posthogKey || !posthogHost) return;

  posthog.reset();
}

export function captureEvent(event, properties) {
  if (!posthogKey || !posthogHost) return;

  posthog.capture(event, properties);
}

export function logAppOperation(message, attributes) {
  if (!posthogKey || !posthogHost) return;

  posthog.logger.info(message, attributes);
}

export default posthog;
