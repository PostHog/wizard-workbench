import posthog from "posthog-js";

const token = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

function requireConfiguration(variableName: string, value: string | undefined) {
  if (!value && import.meta.env.DEV) {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
    );
  }

  return Boolean(value);
}

const isConfigured =
  requireConfiguration("VITE_PUBLIC_POSTHOG_PROJECT_TOKEN", token) &&
  requireConfiguration("VITE_PUBLIC_POSTHOG_HOST", host);

const posthogClient = isConfigured
  ? posthog.init(token!, {
      api_host: host,
      defaults: "2026-05-30",
      capture_exceptions: {
        capture_unhandled_errors: true,
        capture_unhandled_rejections: true,
        capture_console_errors: false,
      },
    })
  : undefined;

export default posthogClient;
