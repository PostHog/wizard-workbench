import posthog from 'posthog-js';

const token = import.meta.env.VITE_POSTHOG_KEY;
const apiHost = import.meta.env.VITE_POSTHOG_HOST;
const isProduction = import.meta.env.PROD;
const isPostHogEnabled = Boolean(token && apiHost);

if (!isPostHogEnabled) {
  if (!isProduction) {
    throw new Error(
      `${!token ? 'VITE_POSTHOG_KEY' : 'VITE_POSTHOG_HOST'} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${!token ? 'VITE_POSTHOG_KEY' : 'VITE_POSTHOG_HOST'} is configured`,
    );
  }
} else {
  posthog.init(token, {
    api_host: apiHost,
    defaults: '2026-05-30',
  });
  posthog.startExceptionAutocapture();
}

function identifyUser(user) {
  if (!isPostHogEnabled || !user?.id) return;

  posthog.identify(user.id, {
    email: user.email,
    name: user.name,
    role: user.role,
  });
}

export { identifyUser, isPostHogEnabled, posthog };
export default posthog;
