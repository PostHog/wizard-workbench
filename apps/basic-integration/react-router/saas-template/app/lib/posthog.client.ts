import posthog from "posthog-js";

const token = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const apiHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

if (!token) {
  if (import.meta.env.DEV) {
    throw new Error(
      "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
    );
  }
} else if (!apiHost) {
  if (import.meta.env.DEV) {
    throw new Error(
      "VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured",
    );
  }
} else {
  posthog.init(token, {
    api_host: apiHost,
    defaults: "2026-01-30",
  });
}

export default posthog;
