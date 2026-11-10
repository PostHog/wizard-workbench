import posthog from 'posthog-js';

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;

const isPostHogEnabled = Boolean(posthogKey && posthogHost);

if (isPostHogEnabled) {
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
} else if (import.meta.env.DEV) {
  [
    ['VITE_POSTHOG_KEY', posthogKey],
    ['VITE_POSTHOG_HOST', posthogHost],
  ].forEach(([name, value]) => {
    if (!value) {
      console.error(
        new Error(
          `${name} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${name} is configured`,
        ),
      );
    }
  });
}

export function identifyUser(user) {
  if (!isPostHogEnabled || !user?.id) return;

  posthog.identify(user.id, {
    email: user.email,
    name: user.name,
    role: user.role,
  });
}

export function resetUser() {
  if (isPostHogEnabled) posthog.reset();
}

export function captureEvent(event, properties) {
  if (isPostHogEnabled) posthog.capture(event, properties);
}

export const posthogLogger = {
  info(message, attributes) {
    if (isPostHogEnabled) posthog.logger.info(message, attributes);
  },
};

export default posthog;
