import posthog from "posthog-js";

const posthogProjectToken = window.ENV.VITE_POSTHOG_PROJECT_TOKEN;
const posthogHost = window.ENV.VITE_POSTHOG_HOST;
let initializedPosthog: typeof posthog | undefined;

if (!posthogProjectToken || !posthogHost) {
  if (window.ENV.MODE === "development") {
    const missingVariable = posthogProjectToken
      ? "VITE_POSTHOG_HOST"
      : "VITE_POSTHOG_PROJECT_TOKEN";

    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else {
  posthog.init(posthogProjectToken, {
    api_host: posthogHost,
    capture_exceptions: {
      capture_console_errors: false,
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
    },
    defaults: "2026-01-30",
  });
  initializedPosthog = posthog;
}

export default initializedPosthog;
