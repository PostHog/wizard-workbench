import posthog from "posthog-js";

const posthogKey = window.ENV.VITE_POSTHOG_KEY;
const posthogHost = window.ENV.VITE_POSTHOG_HOST;

export const isPostHogEnabled = Boolean(posthogKey && posthogHost);

if (isPostHogEnabled) {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    logs: {
      environment: window.ENV.MODE,
      serviceName: "saas-template-web",
    },
  });
} else if (window.ENV.MODE === "development") {
  const missingVariable = posthogKey
    ? "VITE_POSTHOG_HOST"
    : "VITE_POSTHOG_KEY";

  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

export { posthog };
