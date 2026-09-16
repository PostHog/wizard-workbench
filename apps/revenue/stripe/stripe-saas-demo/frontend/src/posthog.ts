import posthog from "posthog-js";

export function initPostHog() {
  const apiKey = import.meta.env.VITE_POSTHOG_API_KEY;
  const host = import.meta.env.VITE_POSTHOG_HOST;

  if (!apiKey) {
    if (import.meta.env.DEV) {
      throw new Error(
        "VITE_POSTHOG_API_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_API_KEY is configured"
      );
    }
    return;
  }

  if (!host) {
    if (import.meta.env.DEV) {
      throw new Error(
        "VITE_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_HOST is configured"
      );
    }
    return;
  }

  posthog.init(apiKey, {
    api_host: host,
    person_profiles: "identified_only",
    capture_pageview: true,
  });
}

export { posthog };
