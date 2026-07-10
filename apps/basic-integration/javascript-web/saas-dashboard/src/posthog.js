import posthog from 'posthog-js';

const key = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

let initialized = false;

export function initPostHog() {
  if (initialized || !key || !host) {
    return;
  }

  posthog.init(key, {
    api_host: host,
    defaults: '2026-05-30',
    capture_exceptions: true,
  });

  initialized = true;
}

export function identifyCurrentUser(user) {
  if (!user) return;

  posthog.identify(user.id, {
    email: user.email,
    name: user.name,
    role: user.role,
  });
}

export function resetPostHogUser() {
  posthog.reset();
}

export { posthog };
