import posthog from 'posthog-js';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!projectToken) {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(
      'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
    );
  }
} else if (!host) {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(
      'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured'
    );
  }
} else {
  posthog.init(projectToken, {
    api_host: host,
    defaults: '2026-01-30',
    capture_exceptions: true,
    debug: process.env.NODE_ENV === 'development',
  });
}

type PostHogUser = {
  id: number;
  email?: string | null;
  name?: string | null;
  role?: string | null;
};

let identifiedUserId: string | null = null;

function isPostHogConfigured() {
  return Boolean(projectToken && host);
}

export function identifyPostHogUser(user: PostHogUser) {
  if (!isPostHogConfigured()) {
    return;
  }

  const distinctId = String(user.id);
  if (identifiedUserId === distinctId) {
    return;
  }

  if (identifiedUserId && identifiedUserId !== distinctId) {
    posthog.reset();
  }

  posthog.identify(distinctId, {
    ...(user.email ? { email: user.email } : {}),
    ...(user.name ? { name: user.name } : {}),
    ...(user.role ? { role: user.role } : {})
  });
  identifiedUserId = distinctId;
}

export function resetPostHogUser() {
  if (isPostHogConfigured()) {
    posthog.reset();
  }
  identifiedUserId = null;
}

export default posthog;
