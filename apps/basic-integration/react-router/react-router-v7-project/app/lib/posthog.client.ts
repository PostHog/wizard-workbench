import posthogJs from "posthog-js";

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;

if (!posthogKey || !posthogHost) {
  if (import.meta.env.DEV) {
    const variableName = posthogKey ? "VITE_POSTHOG_HOST" : "VITE_POSTHOG_KEY";
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
    );
  }
}

export const posthog =
  posthogKey && posthogHost
    ? posthogJs.init(posthogKey, {
        api_host: posthogHost,
        defaults: "2026-01-30",
        logs: {
          serviceName: "country-claims-web",
          environment: import.meta.env.MODE,
        },
        capture_exceptions: {
          capture_unhandled_errors: true,
          capture_unhandled_rejections: true,
          capture_console_errors: false,
        },
      })
    : undefined;
