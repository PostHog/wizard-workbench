import posthog from 'posthog-js';

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;
const isPosthogConfigured = Boolean(posthogKey && posthogHost);

if (isPosthogConfigured) {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    capture_pageview: 'history_change',
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
  });
} else if (import.meta.env.DEV) {
  const missingVariable = posthogKey ? 'VITE_POSTHOG_HOST' : 'VITE_POSTHOG_KEY';
  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

function identifyUser(user) {
  if (!isPosthogConfigured || !user?.id) return;

  posthog.identify(user.id, {
    email: user.email,
    name: user.name,
    role: user.role,
  });
}

function resetUser() {
  if (isPosthogConfigured) posthog.reset();
}

function captureEvent(event, properties) {
  if (isPosthogConfigured) posthog.capture(event, properties);
}

export { captureEvent, identifyUser, resetUser };
