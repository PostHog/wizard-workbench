import posthog from 'posthog-js';

const projectToken = import.meta.env.VITE_POSTHOG_KEY;
const apiHost = import.meta.env.VITE_POSTHOG_HOST;

if (!projectToken || !apiHost) {
  if (import.meta.env.DEV) {
    const missingVariable = !projectToken ? 'VITE_POSTHOG_KEY' : 'VITE_POSTHOG_HOST';
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else {
  posthog.init(projectToken, {
    api_host: apiHost,
    defaults: '2026-05-30',
    capture_pageview: 'history_change',
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
  });
}

export function captureEvent(event, properties) {
  if (!projectToken || !apiHost) return;

  posthog.capture(event, properties);
}

export function identifyUser(user) {
  if (!projectToken || !apiHost || !user?.id) return;

  posthog.identify(user.id, {
    email: user.email,
    name: user.name,
    role: user.role,
  });
}

export function resetPostHog() {
  if (!projectToken || !apiHost) return;

  posthog.reset();
}

export default posthog;
