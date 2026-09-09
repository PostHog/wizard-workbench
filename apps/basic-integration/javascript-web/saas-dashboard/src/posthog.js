import posthog from 'posthog-js';

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;

function requirePostHogConfig(variableName, value) {
  if (import.meta.env.DEV && !value?.trim()) {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
    );
  }

  return Boolean(value?.trim());
}

export const isPostHogConfigured =
  requirePostHogConfig('VITE_POSTHOG_KEY', posthogKey) &&
  requirePostHogConfig('VITE_POSTHOG_HOST', posthogHost);

if (isPostHogConfigured) {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    defaults: '2026-05-30',
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

export function captureEvent(event, properties) {
  if (!isPostHogConfigured) return;

  posthog.capture(event, properties);
}

export function resetPostHog() {
  if (!isPostHogConfigured) return;

  posthog.reset();
}

export default posthog;
