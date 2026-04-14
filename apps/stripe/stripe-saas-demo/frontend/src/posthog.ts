import posthog from "posthog-js";

export function initPostHog() {
  const apiKey = import.meta.env.VITE_POSTHOG_API_KEY;
  const host = import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com";

  if (apiKey) {
    posthog.init(apiKey, {
      api_host: host,
      person_profiles: "identified_only",
      capture_pageview: true,
    });
  } else {
    console.warn("PostHog API key not set — analytics disabled");
  }
}

export { posthog };
