import posthog from "posthog-js";

const token = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

if (token && host) {
  posthog.init(token, {
    api_host: host,
    defaults: "2026-01-30",
  });
} else if (import.meta.env.DEV) {
  const missing = !token
    ? "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN"
    : "VITE_PUBLIC_POSTHOG_HOST";
  throw new Error(
    `${missing} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missing} is configured`,
  );
}

export default posthog;
