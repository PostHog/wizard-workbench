import posthog from 'posthog-js';

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;
const isPosthogConfigured = Boolean(posthogKey && posthogHost);

function reportMissingConfiguration(variableName) {
  if (import.meta.env.DEV) {
    console.error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
    );
  }
}

if (!posthogKey) {
  reportMissingConfiguration('VITE_POSTHOG_KEY');
} else if (!posthogHost) {
  reportMissingConfiguration('VITE_POSTHOG_HOST');
} else {
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
  if (!isPosthogConfigured || !user?.id) return;

  posthog.identify(user.id, {
    email: user.email,
    name: user.name,
    role: user.role,
  });
}

export function resetPosthog() {
  if (isPosthogConfigured) posthog.reset();
}

export function captureEvent(event, properties) {
  if (isPosthogConfigured) posthog.capture(event, properties);
}

export default posthog;
