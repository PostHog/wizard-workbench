import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";
import posthog from "posthog-js";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

const posthogProjectToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;

if (!posthogProjectToken) {
  if (import.meta.env.DEV) {
    throw new Error(
      "VITE_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_PROJECT_TOKEN is configured",
    );
  }
} else if (!posthogHost) {
  if (import.meta.env.DEV) {
    throw new Error(
      "VITE_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_HOST is configured",
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
    logs: {
      serviceName: "shopper-web",
      environment: import.meta.env.MODE,
    },
  });
}

hydrateRoot(
  document,
  <PostHogProvider client={posthog}>
    <PostHogErrorBoundary>
      <HydratedRouter />
    </PostHogErrorBoundary>
  </PostHogProvider>,
);
