import posthog from "posthog-js";

const posthogProjectToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;
export const isPostHogConfigured = Boolean(posthogProjectToken && posthogHost);

if (!posthogProjectToken) {
  if (import.meta.env.DEV) {
    console.error(
      new Error(
        "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
      ),
    );
  }
} else if (!posthogHost) {
  if (import.meta.env.DEV) {
    console.error(
      new Error(
        "VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured",
      ),
    );
  }
} else {
  posthog.init(posthogProjectToken, {
    api_host: posthogHost,
    logs: {
      serviceName: "rrv7-project-web",
      environment: import.meta.env.MODE,
    },
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
  });
}

export default posthog;
