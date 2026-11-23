import posthog from "posthog-js";

const posthogToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;
let identifiedUserId: string | undefined;

if (!posthogToken) {
  if (import.meta.env.DEV) {
    throw new Error(
      "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
    );
  }
} else if (!posthogHost) {
  if (import.meta.env.DEV) {
    throw new Error(
      "VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured",
    );
  }
} else {
  posthog.init(posthogToken, {
    api_host: posthogHost,
    capture_exceptions: {
      capture_console_errors: false,
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
    },
    defaults: "2026-08-30",
  });
}

export function identifyPostHogUser({
  email,
  id,
}: {
  email?: string;
  id: string;
}) {
  if (!posthogToken || !posthogHost || identifiedUserId === id) return;

  if (identifiedUserId) {
    posthog.reset();
  }

  posthog.identify(id, email ? { email } : undefined);
  identifiedUserId = id;
}

export function resetPostHogUser() {
  if (!posthogToken || !posthogHost) return;

  posthog.reset();
  identifiedUserId = undefined;
}

export default posthog;
