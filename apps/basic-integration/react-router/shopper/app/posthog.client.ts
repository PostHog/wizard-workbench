import posthog from "posthog-js";

const projectToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const apiHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

function missingConfigurationError(variableName: string) {
  return new Error(
    `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
  );
}

let posthogClient: typeof posthog | undefined;

if (!projectToken) {
  if (import.meta.env.DEV) {
    throw missingConfigurationError("VITE_PUBLIC_POSTHOG_PROJECT_TOKEN");
  }
} else if (!apiHost) {
  if (import.meta.env.DEV) {
    throw missingConfigurationError("VITE_PUBLIC_POSTHOG_HOST");
  }
} else {
  posthog.init(projectToken, {
    api_host: apiHost,
    defaults: "2026-01-30",
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
    logs: {
      serviceName: "shopper-web",
      environment: import.meta.env.MODE,
    },
  });
  posthogClient = posthog;
}

export default posthogClient;
