import posthog from 'posthog-js';

const key = import.meta.env.VITE_POSTHOG_KEY;
const host = import.meta.env.VITE_POSTHOG_HOST;

export const isPostHogConfigured = Boolean(key && host);

if (!key) {
  if (import.meta.env.DEV) {
    throw new Error(
      'VITE_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_KEY is configured'
    );
  }
} else if (!host) {
  if (import.meta.env.DEV) {
    throw new Error(
      'VITE_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_HOST is configured'
    );
  }
} else {
  posthog.init(key, {
    api_host: host,
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
  if (!isPostHogConfigured || !user?.id) return;

  posthog.identify(user.id, {
    email: user.email,
    name: user.name,
    role: user.role,
  });
}

export function resetUser() {
  if (isPostHogConfigured) posthog.reset();
}

export const posthogLogger = {
  info(message, attributes) {
    if (isPostHogConfigured) posthog.logger.info(message, attributes);
  },
};

export { posthog };
